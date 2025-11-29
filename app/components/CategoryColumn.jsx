'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { subscribeToTasks, addTask, updateCategory, deleteCategory } from '@/lib/firestore';
import TaskItem from './TaskItem';
import Modal from './Modal';
import Tooltip from './Tooltip';
import { toast } from 'react-hot-toast';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

export default function CategoryColumn({ category, index }) {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [newTaskText, setNewTaskText] = useState('');
    const [isExpanded, setIsExpanded] = useState(true);

    useEffect(() => {
        if (!category?.id) return;
        const unsubscribe = subscribeToTasks(category.id, (data) => {
            setTasks(data);
        }, user?.uid || null);
        return () => unsubscribe();
    }, [category.id, user?.uid]);

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!newTaskText.trim()) {
            toast.error('Task description is required');
            return;
        }

        const result = await addTask(user.uid, category.id, newTaskText.trim());
        if (result.success) {
            toast.success('Task added successfully!');
            setNewTaskText('');
            setIsAddTaskOpen(false);
        } else {
            toast.error(`Failed to add task: ${result.error}`);
        }
    };

    const handleToggleVisibility = async () => {
        const result = await updateCategory(category.id, { hidden: !category.hidden });
        if (result.success) {
            toast.success(category.hidden ? 'Category shown' : 'Category hidden');
        } else {
            toast.error('Failed to toggle visibility');
        }
    };

    const handleDeleteCategory = async () => {
        const result = await deleteCategory(category.id, user?.uid || null);
        if (result.success) {
            toast.success('Category deleted successfully!');
            setIsDeleteOpen(false);
        } else {
            toast.error(`Failed to delete category: ${result.error}`);
        }
    };

    // Keyboard shortcuts (only when modal is open)
    useKeyboardShortcuts({
        'n': () => !isAddTaskOpen && !isDeleteOpen && setIsAddTaskOpen(true),
    }, [isAddTaskOpen, isDeleteOpen]);

    const completedTasks = tasks.filter(t => t.completed).length;
    const highlightedTasks = tasks.filter(t => t.highlighted).length;
    const totalTasks = tasks.length;

    // Color scheme: Cyan for dark mode, Navy Blue/Blue for light mode
    const colorScheme = {
        border: 'border-light-categoryBorder dark:border-cyan-500',
        text: 'text-light-categoryHeading dark:text-cyan-400',
        bg: 'bg-light-categoryHeading dark:bg-cyan-500'
    };

    return (
        <>
            <div
                className={`glass-panel rounded-2xl overflow-hidden transition-all duration-300 animate-fade-in border-t-4 ${colorScheme.border}`}
                style={{ animationDelay: `${index * 0.1}s` }}
            >
                {/* Header */}
                <div className="p-5 border-b border-light-border dark:border-cyber-borderSubtle">
                    <div className="flex items-start justify-between mb-3">
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="flex-1 text-left group flex items-center gap-2"
                            aria-expanded={isExpanded}
                        >
                            <svg
                                className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            <h3 className={`text-lg font-heading font-bold tracking-wide ${colorScheme.text} group-hover:text-glow flex items-center gap-2`}>
                                {category.name}
                                {category.highlighted && (
                                    <span className="inline-flex items-center text-cyber-warning">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    </span>
                                )}
                            </h3>
                        </button>
                        <div className="flex items-center gap-2">
                            <Tooltip content="Toggle visibility">
                                <button
                                    onClick={handleToggleVisibility}
                                    className="p-2 hover:bg-light-categoryHeading/10 dark:hover:bg-cyan-500/20 rounded-lg transition-all hover:scale-110 group"
                                    aria-label={category.hidden ? "Show category" : "Hide category"}
                                >
                                    <svg className="w-5 h-5 text-light-categoryHeading dark:text-cyan-400 group-hover:text-light-categoryHeading dark:group-hover:text-cyan-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        {category.hidden ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        ) : (
                                            <>
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </>
                                        )}
                                    </svg>
                                </button>
                            </Tooltip>
                            <Tooltip content="Delete category">
                                <button
                                    onClick={() => setIsDeleteOpen(true)}
                                    className="p-1.5 hover:bg-light-surfaceHover dark:hover:bg-cyber-surfaceLight rounded transition-colors text-light-danger dark:text-cyber-danger hover:text-cyber-danger"
                                    aria-label="Delete category"
                                >
                                    <svg className="w-4 h-4 opacity-60 hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </Tooltip>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1.5">
                            <div className={`w-2 h-2 rounded-full ${colorScheme.bg}`}></div>
                            <span className="text-light-textMuted dark:text-cyber-textMuted">{totalTasks} tasks</span>
                        </div>
                        {totalTasks > 0 && (
                            <>
                                <div className="flex items-center gap-1.5">
                                    <svg className="w-3 h-3 text-light-success dark:text-cyber-success" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-light-textMuted dark:text-cyber-textMuted">{completedTasks} done</span>
                                </div>
                                {highlightedTasks > 0 && (
                                    <div className="flex items-center gap-1.5">
                                        <svg className="w-3 h-3 text-light-warning dark:text-cyber-warning" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <span className="text-light-textMuted dark:text-cyber-textMuted">{highlightedTasks} starred</span>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Tasks */}
                {isExpanded && (
                    <div className="p-4 space-y-3 min-h-[200px] max-h-[600px] overflow-y-auto custom-scrollbar">
                        {tasks.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="w-16 h-16 mb-3 rounded-full bg-light-surfaceHover dark:bg-cyber-surface flex items-center justify-center opacity-40">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <p className="text-sm text-light-textMuted dark:text-cyber-textMuted mb-3">No tasks yet</p>
                                <button
                                    onClick={() => setIsAddTaskOpen(true)}
                                    className="text-xs text-light-categoryHeading dark:text-cyber-primary hover:opacity-80 flex items-center gap-1"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Add your first task
                                </button>
                            </div>
                        ) : (
                            tasks.map((task, idx) => (
                                <TaskItem
                                    key={task.id}
                                    task={task}
                                    index={idx}
                                    colorScheme={colorScheme}
                                />
                            ))
                        )}
                    </div>
                )}

                {/* Add Task Button */}
                {isExpanded && (
                    <div className="p-4 border-t border-light-border dark:border-cyber-borderSubtle">
                        <button
                            onClick={() => setIsAddTaskOpen(true)}
                            className="w-full py-2.5 px-4 rounded-lg border-2 border-dashed border-light-border dark:border-cyber-borderSubtle hover:border-light-categoryHeading dark:hover:border-cyber-primary text-light-textMuted dark:text-cyber-textMuted hover:text-light-text dark:hover:text-cyber-text transition-all flex items-center justify-center gap-2 text-sm font-medium group"
                        >
                            <svg className="w-4 h-4 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Task
                            <kbd className="ml-2 px-2 py-0.5 text-xs bg-light-surface dark:bg-cyber-surface rounded border border-light-border dark:border-cyber-borderSubtle hidden md:inline">N</kbd>
                        </button>
                    </div>
                )}
            </div>

            {/* Add Task Modal */}
            <Modal
                isOpen={isAddTaskOpen}
                onClose={() => {
                    setIsAddTaskOpen(false);
                    setNewTaskText('');
                }}
                title={`Add Task to ${category.name}`}
            >
                <form onSubmit={handleAddTask} className="space-y-6">
                    <div>
                        <label htmlFor="task-text" className="block text-sm font-semibold mb-2 text-light-text dark:text-cyber-text">
                            Task Description
                        </label>
                        <textarea
                            id="task-text"
                            value={newTaskText}
                            onChange={(e) => setNewTaskText(e.target.value)}
                            placeholder="What needs to be done?"
                            className="textarea"
                            autoFocus
                            rows={4}
                            maxLength={500}
                        />
                        <p className="mt-2 text-xs text-light-textMuted dark:text-cyber-textMuted">
                            {newTaskText.length}/500 characters
                        </p>
                    </div>
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                setIsAddTaskOpen(false);
                                setNewTaskText('');
                            }}
                            className="btn btn-secondary"
                        >
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-success">
                            Add Task
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation */}
            <Modal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                title="Delete Category"
            >
                <div className="space-y-6">
                    <div className="p-4 bg-cyber-danger/10 border border-cyber-danger/30 rounded-lg">
                        <p className="text-light-text dark:text-cyber-text text-sm">
                            Are you sure you want to delete <strong className="text-cyber-danger">{category.name}</strong>?
                            This will also delete all <strong>{totalTasks}</strong> {totalTasks === 1 ? 'task' : 'tasks'} in this category.
                        </p>
                        <p className="text-light-textMuted dark:text-cyber-textMuted text-sm mt-2">
                            This action cannot be undone.
                        </p>
                    </div>
                    <div className="flex justify-end gap-3">
                        <button onClick={() => setIsDeleteOpen(false)} className="btn btn-secondary">
                            Cancel
                        </button>
                        <button onClick={handleDeleteCategory} className="btn btn-danger">
                            Delete Category
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
