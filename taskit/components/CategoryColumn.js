"use client";
import TaskItem from './TaskItem';

export default function CategoryColumn({ title }) {
    return (
        <div className="min-w-[300px] max-w-[300px] flex flex-col glass-panel p-4 rounded-lg h-full">
            <div className="flex justify-between items-center mb-4 border-b border-[var(--primary)] pb-2">
                <h2 className="text-xl font-bold text-[var(--primary)] tracking-wider">{title}</h2>
                <button className="text-xs opacity-50 hover:opacity-100">[HIDE]</button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                {/* Mock Tasks */}
                <TaskItem text="Implement Login" status="done" />
                <TaskItem text="Design Database" status="pending" highlighted={true} />
                <TaskItem text="Fix CSS Bugs" status="pending" />
            </div>

            <button className="btn mt-4 w-full text-sm">
                + ADD_TASK
            </button>
        </div>
    );
}
