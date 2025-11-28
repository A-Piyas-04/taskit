'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { subscribeToCategories, addCategory } from '@/lib/firestore';
import CategoryColumn from './components/CategoryColumn';
import Modal from './components/Modal';
import { toast } from 'react-hot-toast';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

export default function Home() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [categories, setCategories] = useState([]);
    const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (!user) return;

        const unsubscribe = subscribeToCategories(user.uid, (data) => {
            setCategories(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [user]);

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCategoryName.trim()) {
            toast.error('Category name is required');
            return;
        }

        const result = await addCategory(user.uid, newCategoryName.trim());
        if (result.success) {
            toast.success('Category created successfully!');
            setNewCategoryName('');
            setIsAddCategoryOpen(false);
        } else {
            toast.error(`Failed to create category: ${result.error}`);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-cyber-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) return null;

    // Keyboard shortcuts
    useKeyboardShortcuts({
        'c': () => setIsAddCategoryOpen(true),
    });

    const visibleCategories = categories.filter(cat => !cat.hidden);
    const hiddenCategories = categories.filter(cat => cat.hidden);

    return (
        <div className="container mx-auto px-4 py-8 max-w-[1600px]">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-heading font-bold neon-text mb-2">
                        Your Task Boards
                    </h1>
                    <p className="text-cyber-textMuted text-sm md:text-base">
                        {categories.length} {categories.length === 1 ? 'category' : 'categories'}
                        {hiddenCategories.length > 0 && ` • ${hiddenCategories.length} hidden`}
                    </p>
                </div>
                <button
                    onClick={() => setIsAddCategoryOpen(true)}
                    className="btn btn-primary flex items-center gap-2 group"
                    aria-label="Add new category"
                >
                    <svg className="w-5 h-5 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="hidden sm:inline">New Category</span>
                    <kbd className="hidden md:inline ml-2 px-2 py-0.5 text-xs bg-cyber-surface rounded border border-cyber-borderSubtle">C</kbd>
                </button>
            </div>

            {/* Categories Grid */}
            {loading ? (
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 border-4 border-cyber-primary border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-cyber-textMuted animate-pulse">Loading your boards...</p>
                    </div>
                </div>
            ) : categories.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] text-center py-20">
                    <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-cyber-primary to-cyber-secondary opacity-20 flex items-center justify-center animate-pulse">
                        <svg className="w-12 h-12 text-cyber-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-heading font-bold mb-2 text-cyber-text">No categories yet</h2>
                    <p className="text-cyber-textMuted mb-8 max-w-md">
                        Get started by creating your first category to organize your tasks
                    </p>
                    <button
                        onClick={() => setIsAddCategoryOpen(true)}
                        className="btn btn-secondary"
                    >
                        Create Your First Category
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {visibleCategories.map((category, index) => (
                        <CategoryColumn
                            key={category.id}
                            category={category}
                            index={index}
                        />
                    ))}
                </div>
            )}

            {/* Hidden Categories Indicator */}
            {hiddenCategories.length > 0 && (
                <div className="mt-8 p-4 glass-panel rounded-lg border-cyber-warning/30">
                    <div className="flex items-center gap-2 text-cyber-warning">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                        <span className="font-semibold">{hiddenCategories.length} hidden {hiddenCategories.length === 1 ? 'category' : 'categories'}</span>
                    </div>
                </div>
            )}

            {/* Add Category Modal */}
            <Modal
                isOpen={isAddCategoryOpen}
                onClose={() => {
                    setIsAddCategoryOpen(false);
                    setNewCategoryName('');
                }}
                title="Create New Category"
            >
                <form onSubmit={handleAddCategory} className="space-y-6">
                    <div>
                        <label htmlFor="category-name" className="block text-sm font-semibold mb-2 text-cyber-text">
                            Category Name
                        </label>
                        <input
                            id="category-name"
                            type="text"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="e.g., Work, Personal, Shopping"
                            className="input"
                            autoFocus
                            maxLength={50}
                        />
                        <p className="mt-2 text-xs text-cyber-textMuted">
                            {newCategoryName.length}/50 characters
                        </p>
                    </div>
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                setIsAddCategoryOpen(false);
                                setNewCategoryName('');
                            }}
                            className="btn btn-secondary"
                        >
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-success">
                            Create Category
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
