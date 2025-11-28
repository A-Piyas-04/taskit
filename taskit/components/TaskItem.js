"use client";
import { useState } from 'react';
import Modal from './Modal';

export default function TaskItem({ task, onToggleStatus, onToggleHighlight, onDelete, onUpdateText }) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editText, setEditText] = useState(task.text);

    const handleUpdate = (e) => {
        e.preventDefault();
        onUpdateText(editText);
        setIsEditModalOpen(false);
    };

    const handleDelete = () => {
        onDelete();
        setIsDeleteModalOpen(false);
    };

    return (
        <>
            <div className={`p-3 border ${task.highlighted ? 'border-[var(--secondary)] shadow-[0_0_5px_var(--secondary)]' : 'border-[var(--border)]'} bg-[var(--surface)] hover:bg-[var(--surface-hover)] transition-colors group relative`}>
                <div className="flex justify-between items-start gap-2">
                    <p
                        className={`text-sm cursor-pointer ${task.status === 'done' ? 'line-through opacity-50' : ''}`}
                        onClick={() => setIsEditModalOpen(true)}
                    >
                        {task.text}
                    </p>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={onToggleStatus} className="text-[var(--primary)] hover:text-white">✓</button>
                        <button onClick={onToggleHighlight} className="text-[var(--secondary)] hover:text-white">!</button>
                        <button onClick={() => setIsDeleteModalOpen(true)} className="text-red-500 hover:text-white">✗</button>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="EDIT_TASK"
            >
                <form onSubmit={handleUpdate} className="space-y-4">
                    <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full bg-[var(--surface)] border border-[var(--border)] p-2 text-[var(--foreground)] focus:border-[var(--primary)] outline-none"
                        autoFocus
                    />
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => setIsEditModalOpen(false)} className="btn btn-secondary">CANCEL</button>
                        <button type="submit" className="btn">SAVE</button>
                    </div>
                </form>
            </Modal>

            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="CONFIRM_DELETE"
            >
                <p className="mb-4 text-[var(--foreground)]">Are you sure you want to delete this task?</p>
                <div className="flex justify-end gap-2">
                    <button onClick={() => setIsDeleteModalOpen(false)} className="btn btn-secondary">CANCEL</button>
                    <button onClick={handleDelete} className="btn btn-danger">DELETE</button>
                </div>
            </Modal>
        </>
    );
}
