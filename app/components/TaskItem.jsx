'use client';

import { useState } from 'react';
import { updateTask, deleteTask } from '@/lib/firestore';
import Modal from './Modal';
import Tooltip from './Tooltip';
import { toast } from 'react-hot-toast';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

export default function TaskItem({ task, index, colorScheme }) {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [editText, setEditText] = useState(task.text);

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!editText.trim()) {
            toast.error('Task description is required');
            return;
        }

        const result = await updateTask(task.id, { text: editText.trim() });
        if (result.success) {
            toast.success('Task updated successfully!');
            setIsEditOpen(false);
        } else {
            toast.error(`Failed to update task: ${result.error}`);
        }
    };

    const handleDelete = async () => {
        const result = await deleteTask(task.id);
        if (result.success) {
            toast.success('Task deleted successfully!');
            setIsDeleteOpen(false);
        } else {
            toast.error(`Failed to delete task: ${result.error}`);
        }
    };

    const handleToggleStatus = async () => {
        const result = await updateTask(task.id, {
            completed: !task.completed
        });
        if (!result.success) {
            toast.error('Failed to update status');
        }
    };

    const handleToggleHighlight = async () => {
        const result = await updateTask(task.id, {
            highlighted: !task.highlighted
        });
        if (result.success) {
            toast.success(task.highlighted ? 'Removed highlight' : 'Task highlighted!');
        } else {
            toast.error('Failed to toggle highlight');
        }
    };

    // Keyboard shortcut for highlighting (only when not in modal)
    useKeyboardShortcuts({
        'h': () => !isEditOpen && !isDeleteOpen && handleToggleHighlight(),
    }, [isEditOpen, isDeleteOpen, task.highlighted]);

    return (
        <>
            <div
                className={`group relative p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer animate-slide-in ${task.highlighted
                    ? `${colorScheme.border} bg-gradient-to-br from-light-surface to-light-surfaceHover dark:from-cyber-surface dark:to-cyber-surfaceLight shadow-lg shadow-${colorScheme.bg}/20`
                    : 'border-light-border dark:border-cyber-borderSubtle bg-light-surface dark:bg-cyber-surface hover:border-light-categoryBorder dark:hover:border-cyber-border hover:bg-light-surfaceHover dark:hover:bg-cyber-surfaceLight'
                    }`}
                style={{ animationDelay: `${index * 0.05}s` }}
            >
                {/* Highlight Indicator */}
                {task.highlighted && (
                    <div
                        className={`absolute top-0 left-0 w-1 h-full rounded-l-lg ${colorScheme.bg} animate-pulse-glow`}
                        aria-hidden="true"
                    ></div>
                )}

                <div className="flex items-start gap-3">
                    {/* Status Checkbox */}
                    <Tooltip content={task.completed ? "Mark as incomplete" : "Mark as complete"}>
                        <button
                            onClick={handleToggleStatus}
                            className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all mt-0.5 ${task.completed
                                ? 'bg-light-success dark:bg-cyber-success border-light-success dark:border-cyber-success'
                                : 'border-light-border dark:border-cyber-border hover:border-light-categoryHeading dark:hover:border-cyber-primary'
                                }`}
                            aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
                            aria-pressed={task.completed}
                        >
                            {task.completed && (
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </button>
                    </Tooltip>

                    {/* Task Content */}
                    <div className="flex-1 min-w-0">
                        <p
                            onClick={() => setIsEditOpen(true)}
                            className={`text-sm leading-relaxed break-words transition-all ${task.completed
                                ? 'line-through opacity-50 text-light-text dark:text-cyber-text'
                                : 'text-light-text dark:text-cyber-text hover:text-light-categoryHeading dark:hover:text-cyber-primary'
                                }`}
                            role="button"
                            tabIndex={0}
                            onKeyPress={(e) => e.key === 'Enter' && setIsEditOpen(true)}
                        >
                            {task.text}
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Tooltip content={task.highlighted ? "Remove highlight (H)" : "Highlight task (H)"}>
                            <button
                                onClick={handleToggleHighlight}
                                className={`p-1.5 rounded hover:bg-light-surfaceHover dark:hover:bg-cyber-surfaceLight transition-colors ${task.highlighted ? colorScheme.text : 'text-light-textMuted dark:text-cyber-textMuted hover:text-light-warning dark:hover:text-cyber-warning'
                                    }`}
                                aria-label={task.highlighted ? "Remove highlight" : "Highlight task"}
                                aria-pressed={task.highlighted}
                            >
                                <svg className="w-4 h-4" fill={task.highlighted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                            </button>
                        </Tooltip>
                        <Tooltip content="Edit task">
                            <button
                                onClick={() => setIsEditOpen(true)}
                                className="p-1.5 rounded hover:bg-light-surfaceHover dark:hover:bg-cyber-surfaceLight transition-colors text-light-textMuted dark:text-cyber-textMuted hover:text-light-categoryHeading dark:hover:text-cyber-primary"
                                aria-label="Edit task"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </button>
                        </Tooltip>
                        <Tooltip content="Delete task">
                            <button
                                onClick={() => setIsDeleteOpen(true)}
                                className="p-1.5 rounded hover:bg-light-surfaceHover dark:hover:bg-cyber-surfaceLight transition-colors text-light-textMuted dark:text-cyber-textMuted hover:text-light-danger dark:hover:text-cyber-danger"
                                aria-label="Delete task"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </Tooltip>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            <Modal
                isOpen={isEditOpen}
                onClose={() => {
                    setIsEditOpen(false);
                    setEditText(task.text);
                }}
                title="Edit Task"
            >
                <form onSubmit={handleUpdate} className="space-y-6">
                    <div>
                        <label htmlFor="edit-task-text" className="block text-sm font-semibold mb-2 text-light-text dark:text-cyber-text">
                            Task Description
                        </label>
                        <textarea
                            id="edit-task-text"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="textarea"
                            autoFocus
                            rows={4}
                            maxLength={500}
                        />
                        <p className="mt-2 text-xs text-light-textMuted dark:text-cyber-textMuted">
                            {editText.length}/500 characters
                        </p>
                    </div>
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                setIsEditOpen(false);
                                setEditText(task.text);
                            }}
                            className="btn btn-secondary"
                        >
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-success">
                            Save Changes
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation */}
            <Modal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                title="Delete Task"
            >
                <div className="space-y-6">
                    <p className="text-light-text dark:text-cyber-text">
                        Are you sure you want to delete this task? This action cannot be undone.
                    </p>
                    <div className="p-4 bg-light-surfaceHover dark:bg-cyber-surface rounded-lg border border-light-border dark:border-cyber-borderSubtle">
                        <p className="text-sm text-light-textMuted dark:text-cyber-textMuted italic">&quot;{task.text}&quot;</p>
                    </div>
                    <div className="flex justify-end gap-3">
                        <button onClick={() => setIsDeleteOpen(false)} className="btn btn-secondary">
                            Cancel
                        </button>
                        <button onClick={handleDelete} className="btn btn-danger">
                            Delete Task
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
