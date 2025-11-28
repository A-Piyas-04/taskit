"use client";
import { useState, useEffect } from 'react';
import { subscribeToTasks, addTask, updateTask, deleteTask } from '@/lib/firebaseService';
import TaskItem from './TaskItem';
import Modal from './Modal';

export default function CategoryColumn({ category }) {
    const [tasks, setTasks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTaskText, setNewTaskText] = useState('');

    useEffect(() => {
        const unsubscribe = subscribeToTasks(category.id, (data) => {
            setTasks(data);
        });
        return () => unsubscribe();
    }, [category.id]);

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!newTaskText.trim()) return;
        await addTask(category.id, newTaskText);
        setNewTaskText('');
        setIsModalOpen(false);
    };

    return (
        <>
            <div className="min-w-[300px] max-w-[300px] flex flex-col glass-panel p-4 rounded-lg h-full">
                <div className="flex justify-between items-center mb-4 border-b border-[var(--primary)] pb-2">
                    <h2 className="text-xl font-bold text-[var(--primary)] tracking-wider">{category.name}</h2>
                    {/* Implement Hide/Delete category later if needed */}
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                    {tasks.map(task => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            onToggleStatus={() => updateTask(task.id, { status: task.status === 'done' ? 'pending' : 'done' })}
                            onToggleHighlight={() => updateTask(task.id, { highlighted: !task.highlighted })}
                            onDelete={() => deleteTask(task.id)}
                            onUpdateText={(text) => updateTask(task.id, { text })}
                        />
                    ))}
                </div>

                <button onClick={() => setIsModalOpen(true)} className="btn mt-4 w-full text-sm">
                    + ADD_TASK
                </button>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="NEW_TASK"
            >
                <form onSubmit={handleAddTask} className="space-y-4">
                    <input
                        type="text"
                        value={newTaskText}
                        onChange={(e) => setNewTaskText(e.target.value)}
                        placeholder="TASK_DESCRIPTION"
                        className="w-full bg-[var(--surface)] border border-[var(--border)] p-2 text-[var(--foreground)] focus:border-[var(--primary)] outline-none"
                        autoFocus
                    />
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">CANCEL</button>
                        <button type="submit" className="btn">ADD</button>
                    </div>
                </form>
            </Modal>
        </>
    );
}
