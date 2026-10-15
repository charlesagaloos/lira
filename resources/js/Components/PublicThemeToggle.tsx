import type { PublicTheme } from '../lib/usePublicTheme';

export default function PublicThemeToggle({
    theme,
    onToggle,
}: {
    theme: PublicTheme;
    onToggle: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onToggle}
            className="public-theme-toggle fixed bottom-5 right-5 z-[60] inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.035] text-zinc-300 transition hover:border-white/30 hover:text-white"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
        >
            {theme === 'light' ? (
                <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
                    <path d="M16.2 12.2A6.8 6.8 0 0 1 7.8 3.8a6.9 6.9 0 1 0 8.4 8.4Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                </svg>
            ) : (
                <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
                    <circle cx="10" cy="10" r="3.2" stroke="currentColor" strokeWidth="1.4" />
                    <path d="M10 1.8V3.4M10 16.6v1.6M18.2 10h-1.6M3.4 10H1.8m14-5.8-1.1 1.1M5.3 14.7l-1.1 1.1m11.6 0-1.1-1.1M5.3 5.3 4.2 4.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
            )}
        </button>
    );
}
