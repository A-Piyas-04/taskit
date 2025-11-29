'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { logout } from '@/lib/auth';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const { user } = useAuth();
    const router = useRouter();

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

    return (
        <header className="sticky top-0 z-50 glass-panel border-b-2 border-cyber-primary backdrop-blur-xl">
            <div className="container mx-auto px-4 sm:px-6 py-4 max-w-[1600px]">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 sm:gap-4 group">
                        <div className="relative">
                            {/* Professional hexagonal logo with checkmark */}
                            <div className="w-10 h-10 sm:w-12 sm:h-12 relative transition-transform group-hover:scale-110 group-hover:rotate-3">
                                {/* Hexagon background */}
                                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                                    <defs>
                                        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#00f0ff" />
                                            <stop offset="100%" stopColor="#5773ff" />
                                        </linearGradient>
                                        <filter id="glow">
                                            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                                            <feMerge>
                                                <feMergeNode in="coloredBlur" />
                                                <feMergeNode in="SourceGraphic" />
                                            </feMerge>
                                        </filter>
                                    </defs>
                                    {/* Hexagon shape */}
                                    <path
                                        d="M50 5 L85 27.5 L85 72.5 L50 95 L15 72.5 L15 27.5 Z"
                                        fill="url(#logoGradient)"
                                        filter="url(#glow)"
                                        className="drop-shadow-lg"
                                    />
                                    {/* Checkmark */}
                                    <path
                                        d="M35 50 L45 60 L65 35"
                                        fill="none"
                                        stroke="white"
                                        strokeWidth="6"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
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
                        {/* Meet the Dev Button */}
                        <a
                            href="https://ahnaf-s-p.vercel.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden md:flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border border-cyber-borderSubtle hover:border-cyber-accent hover:bg-cyber-accent/10 transition-all text-sm group"
                            aria-label="Visit developer portfolio"
                        >
                            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="hidden lg:inline font-medium">Meet the Dev</span>
                        </a>

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
        </header>
    );
}
