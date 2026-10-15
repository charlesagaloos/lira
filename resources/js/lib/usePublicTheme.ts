import { useCallback, useState } from 'react';

export type PublicTheme = 'dark' | 'light';

const STORAGE_KEY = 'lira-public-theme';

export default function usePublicTheme() {
    const [theme, setTheme] = useState<PublicTheme>(() => {
        if (typeof window === 'undefined') {
            return 'dark';
        }

        return window.localStorage.getItem(STORAGE_KEY) === 'light'
            ? 'light'
            : 'dark';
    });

    const toggleTheme = useCallback(() => {
        const nextTheme = theme === 'dark' ? 'light' : 'dark';
        window.localStorage.setItem(STORAGE_KEY, nextTheme);
        setTheme(nextTheme);
    }, [theme]);

    return { theme, toggleTheme };
}
