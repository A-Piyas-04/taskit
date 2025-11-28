"use client";
import { useState } from 'react';
import CategoryColumn from './CategoryColumn';

export default function Board() {
    const [categories, setCategories] = useState(['TODO', 'IN_PROGRESS', 'DONE']);

    return (
        <div className="flex overflow-x-auto gap-6 pb-4 h-[calc(100vh-150px)] items-start">
            {categories.map(cat => (
                <CategoryColumn key={cat} title={cat} />
            ))}
            <button className="btn min-w-[300px] h-[50px] flex items-center justify-center opacity-50 hover:opacity-100 border-dashed">
                + ADD_CATEGORY
            </button>
        </div>
    );
}
