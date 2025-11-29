import './globals.css';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import { AuthProvider } from '@/context/AuthContext';

export const metadata = {
    title: 'TaskIt - Cyberpunk Task Manager',
    description: 'Manage your tasks with style in a cyberpunk-themed interface',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className="relative">
                <AuthProvider>
                    <Navbar />
                    <main className="relative z-10">
                        {children}
                    </main>
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
