"use client";

export default function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="glass-panel p-6 rounded-lg w-full max-w-md relative border border-[var(--primary)] shadow-[0_0_20px_rgba(0,255,157,0.2)]">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-[var(--foreground)] hover:text-[var(--primary)]"
                >
                    ✕
                </button>
                <h2 className="text-2xl font-bold mb-4 text-[var(--primary)] neon-text">{title}</h2>
                {children}
            </div>
        </div>
    );
}
