'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { logout } from '@/lib/auth';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const { user } = useAuth();
    const router = useRouter();
    const [showShortcuts, setShowShortcuts] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
            toast.success('Logged out successfully');
            router.push('/login');
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('Failed to log out');
        }
    };

    const shortcuts = [
        { key: 'N', description: 'New Task (in category)' },
        { key: 'C', description: 'New Category' },
        { key: 'H', description: 'Toggle Highlight (in task)' },
        { key: 'Esc', description: 'Close Modal' },
    ];

    return (
        <header className="sticky top-0 z-50 glass-panel border-b-2 border-cyber-primary backdrop-blur-xl">
            <div className="container mx-auto px-4 sm:px-6 py-4 max-w-[1600px]">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 sm:gap-4 group">
                        <div className="relative">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-cyber-primary to-cyber-secondary rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-6">
                                <svg className="w-5 h-5 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                            </div>
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyber-success rounded-full animate-pulse" aria-hidden="true"></div>
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-heading font-bold neon-text">
                                TaskIt
                            </h1>
                            <p className="text-xs text-cyber-textMuted hidden sm:block">
                                Project Management
                            </p>
                        </div>
                    </Link>

                    {/* Actions */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        {/* Keyboard Shortcuts */}
                        <div className="relative">
                            <button
                                onClick={() => setShowShortcuts(!showShortcuts)}
                                className="hidden md:flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border border-cyber-borderSubtle hover:border-cyber-primary transition-all text-sm"
                                aria-label="Keyboard shortcuts"
                                aria-expanded={showShortcuts}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                </svg>
                                <span className="hidden lg:inline">Shortcuts</span>
                            </button>

                            {showShortcuts && (
                                <div className="absolute right-0 top-full mt-2 w-64 glass-panel rounded-lg border border-cyber-primary p-4 animate-scale-in">
                                    <h3 className="font-heading font-bold text-sm mb-3 text-cyber-primary">Keyboard Shortcuts</h3>
                                    <div className="space-y-2">
                                        {shortcuts.map((shortcut) => (
                                            <div key={shortcut.key} className="flex items-center justify-between text-sm">
                                                <span className="text-cyber-textMuted">{shortcut.description}</span>
                                                <kbd className="px-2 py-1 bg-cyber-surface rounded border border-cyber-borderSubtle font-mono text-xs">
                                                    {shortcut.key}
                                                </kbd>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {user ? (
                            <div className="flex items-center gap-3 pl-4 border-l border-cyber-borderSubtle">
                                <div className="hidden sm:block text-right">
                                    <p className="text-sm font-bold text-cyber-text">{user.displayName || 'User'}</p>
                                    <p className="text-xs text-cyber-textMuted truncate max-w-[150px]">{user.email}</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 rounded-lg border border-cyber-borderSubtle hover:border-cyber-danger hover:text-cyber-danger transition-all"
                                    aria-label="Log out"
                                    title="Log out"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="btn btn-primary text-sm"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Close shortcuts dropdown when clicking outside */}
            {showShortcuts && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowShortcuts(false)}
                    aria-hidden="true"
                />
            )}
        </header>
    );
}
