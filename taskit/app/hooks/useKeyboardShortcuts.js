import { useEffect } from 'react';

export function useKeyboardShortcuts(shortcuts, dependencies = []) {
    // Shortcuts disabled per requirements
    useEffect(() => {
        return () => {};
    }, [shortcuts, ...dependencies]);
}
