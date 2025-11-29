'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithGoogle } from '@/lib/auth';
import { toast } from 'react-hot-toast';

export default function Login() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleGoogleLogin = async () => {
        try {
            setLoading(true);
            await signInWithGoogle();
            toast.success('Logged in successfully!');
            router.push('/');
        } catch (error) {
            console.error(error);

            // Provide more specific error messages
            let errorMessage = 'Failed to login with Google';
            if (error.code === 'auth/unauthorized-domain') {
                errorMessage = 'Authentication domain not authorized. Please contact the administrator.';
            } else if (error.code === 'auth/popup-blocked') {
                errorMessage = 'Popup was blocked. Please allow popups for this site.';
            } else if (error.code === 'auth/popup-closed-by-user') {
                errorMessage = 'Sign-in cancelled.';
            }

            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md glass-panel p-8 rounded-xl border border-cyber-primary/30 relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyber-primary via-cyber-secondary to-cyber-accent"></div>

                <div className="text-center mb-8">
                    <h1 className="text-4xl font-heading font-bold neon-text mb-3">
                        Welcome to TaskIt
                    </h1>
                    <p className="text-cyber-textMuted text-lg">
                        Sign in with Google to access your workspace
                    </p>
                </div>

                <div className="space-y-6">
                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full btn bg-white text-black hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 py-4 text-lg font-semibold transition-all hover:scale-105"
                    >
                        {loading ? (
                            <>
                                <div className="w-6 h-6 border-3 border-black border-t-transparent rounded-full animate-spin"></div>
                                <span>Signing in...</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-6 h-6" viewBox="0 0 24 24">
                                    <path
                                        fill="currentColor"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                <span>Continue with Google</span>
                            </>
                        )}
                    </button>

                    <div className="text-center text-sm text-cyber-textMuted pt-4">
                        <p>🔒 Secure authentication powered by Google</p>
                    </div>
                </div>

                {/* Feature highlights */}
                <div className="mt-8 pt-6 border-t border-cyber-borderSubtle">
                    <h3 className="text-sm font-semibold text-cyber-text mb-3 text-center">Why TaskIt?</h3>
                    <div className="space-y-2 text-sm text-cyber-textMuted">
                        <div className="flex items-center gap-2">
                            <span className="text-cyber-accent">✨</span>
                            <span>Organize tasks with custom categories</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-cyber-accent">⚡</span>
                            <span>Real-time sync across devices</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-cyber-accent">🎨</span>
                            <span>Beautiful cyberpunk interface</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
