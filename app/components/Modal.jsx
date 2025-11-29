'use client';

import { useEffect } from 'react';

export default function Modal({ isOpen, onClose, title, children }) {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.addEventListener('keydown', handleEscape);
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-md animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div
                className="glass-panel p-8 rounded-2xl w-full max-w-lg relative border-2 border-light-categoryHeading dark:border-cyber-primary m-4 animate-scale-in shadow-2xl dark:shadow-[0_0_40px_rgba(0,217,255,0.3),_0_20px_60px_rgba(0,0,0,0.5)]"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-lg hover:bg-light-surfaceHover dark:hover:bg-cyber-surfaceLight transition-colors text-light-textMuted dark:text-cyber-textMuted hover:text-light-text dark:hover:text-cyber-text group"
                    aria-label="Close modal"
                >
                    <svg className="w-5 h-5 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <h2
                    id="modal-title"
                    className="text-2xl font-heading font-bold mb-6 text-light-categoryHeading dark:text-cyber-primary neon-text pr-8"
                >
                    {title}
                </h2>
                {children}
            </div>
        </div>
    );
}
