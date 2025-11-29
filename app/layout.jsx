'use client';

import './globals.css';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import { AuthProvider } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import Head from 'next/head';
import { useEffect } from 'react';

export default function RootLayout({ children }) {
    // Set document title and meta tags
    useEffect(() => {
        document.title = 'TaskIt - Cyberpunk Task Manager';
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', 'Manage your tasks with style in a cyberpunk-themed interface');
        } else {
            const meta = document.createElement('meta');
            meta.name = 'description';
            meta.content = 'Manage your tasks with style in a cyberpunk-themed interface';
            document.head.appendChild(meta);
        }
    }, []);

    return (
        <html lang="en">
            <body className="relative">
                <AuthProvider>
                    <LayoutContent>{children}</LayoutContent>
                    <Toaster
                        position="bottom-right"
                        toastOptions={{
                            className: 'glass-panel border-cyber-primary',
                            style: {
                                background: '#1a1f3a',
                                color: '#e4e8f0',
                                border: '1px solid rgba(0, 217, 255, 0.3)',
                            },
                            success: {
                                iconTheme: {
                                    primary: '#00ff88',
                                    secondary: '#1a1f3a',
                                },
                            },
                            error: {
                                iconTheme: {
                                    primary: '#ff3366',
                                    secondary: '#1a1f3a',
                                },
                            },
                        }}
                    />
                </AuthProvider>
            </body>
        </html>
    );
}

function LayoutContent({ children }) {
    const pathname = usePathname();
    const isLoginPage = pathname === '/login';

    return (
        <>
            {!isLoginPage && <Navbar />}
            <main className="relative z-10">
                {children}
            </main>
        </>
    );
}
