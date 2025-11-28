import { useEffect } from 'react';

export function useKeyboardShortcuts(shortcuts, dependencies = []) {
    useEffect(() => {
        const handleKeyPress = (e) => {
            // Ignore if user is typing in an input or textarea
            if (
                e.target.tagName === 'INPUT' ||
                e.target.tagName === 'TEXTAREA' ||
                e.target.isContentEditable
            ) {
                return;
            }

            const key = e.key.toLowerCase();

            if (shortcuts[key]) {
                e.preventDefault();
                shortcuts[key]();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [shortcuts, ...dependencies]);
}
