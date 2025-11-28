"use client";
import { useState, useEffect } from 'react';
import { subscribeToCategories, addCategory } from '@/lib/firebaseService';
import CategoryColumn from './CategoryColumn';
import Modal from './Modal';

export default function Board() {
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    useEffect(() => {
        const unsubscribe = subscribeToCategories((data) => {
            setCategories(data);
        });
        return () => unsubscribe();
    }, []);

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;
        await addCategory(newCategoryName);
        setNewCategoryName('');
        setIsModalOpen(false);
    };

    return (
        <>
            <div className="flex overflow-x-auto gap-6 pb-4 h-[calc(100vh-150px)] items-start">
                {categories.map(cat => (
                    <CategoryColumn key={cat.id} category={cat} />
                ))}
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn min-w-[300px] h-[50px] flex items-center justify-center opacity-50 hover:opacity-100 border-dashed"
                >
                    + ADD_CATEGORY
                </button>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="NEW_CATEGORY"
            >
                <form onSubmit={handleAddCategory} className="space-y-4">
                    <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="CATEGORY_NAME"
                        className="w-full bg-[var(--surface)] border border-[var(--border)] p-2 text-[var(--foreground)] focus:border-[var(--primary)] outline-none"
                        autoFocus
                    />
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">CANCEL</button>
                        <button type="submit" className="btn">CREATE</button>
                    </div>
                </form>
            </Modal>
        </>
    );
}
