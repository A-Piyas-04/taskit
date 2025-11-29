import './globals.css';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';

export const metadata = {
    title: 'TaskIt - Cyberpunk Task Manager',
    description: 'Manage your tasks with style in a cyberpunk-themed interface',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className="relative">
                <AuthProvider>
                    <ThemeProvider>
                        <Navbar />
                        <main className="relative z-10">
                            {children}
                        </main>
                        <Toaster
                            position="bottom-right"
                            toastOptions={{
                                className: 'toast-custom',
                                style: {},
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
                    </ThemeProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
