'use client';

export default function Error({ error, reset }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-cyber-bg px-4">
            <div className="text-center">
                <h1 className="text-4xl font-heading font-bold text-cyber-text">
                    Refresh to get back to Login
                </h1>
            </div>
        </div>
    );
}
