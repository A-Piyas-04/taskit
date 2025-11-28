"use client";

export default function TaskItem({ text, status, highlighted }) {
    return (
        <div className={`p-3 border ${highlighted ? 'border-[var(--secondary)] shadow-[0_0_5px_var(--secondary)]' : 'border-[var(--border)]'} bg-[var(--surface)] hover:bg-[var(--surface-hover)] transition-colors group relative`}>
            <div className="flex justify-between items-start gap-2">
                <p className={`text-sm ${status === 'done' ? 'line-through opacity-50' : ''}`}>{text}</p>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-[var(--primary)] hover:text-white">✓</button>
                    <button className="text-[var(--secondary)] hover:text-white">!</button>
                    <button className="text-red-500 hover:text-white">✗</button>
                </div>
            </div>
        </div>
    );
}
