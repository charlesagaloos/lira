import templates from './templates';

import type { PortfolioProps } from './types';
import usePublicTheme from '../../lib/usePublicTheme';

function ThemeIcon({ theme }: { theme: 'dark' | 'light' }) {
    return theme === 'light' ? (
        <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
            <path d="M16.2 12.2A6.8 6.8 0 0 1 7.8 3.8a6.9 6.9 0 1 0 8.4 8.4Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        </svg>
    ) : (
        <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
            <circle cx="10" cy="10" r="3.2" stroke="currentColor" strokeWidth="1.4" />
            <path d="M10 1.8V3.4M10 16.6v1.6M18.2 10h-1.6M3.4 10H1.8m14-5.8-1.1 1.1M5.3 14.7l-1.1 1.1m11.6 0-1.1-1.1M5.3 5.3 4.2 4.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
    );
}

export default function Portfolio({ profile }: PortfolioProps) {
    const { theme, toggleTheme } = usePublicTheme();
    const templateKey =
        profile.portfolio_settings?.template ?? 'default';

    const template =
        templates[templateKey] ??
        templates.default;

    const TemplateComponent = template.component;
    const themedProfile = theme === 'light'
        ? {
            ...profile,
            portfolio_settings: {
                ...profile.portfolio_settings,
                background_color: '#f3f6f9',
                text_color: '#1d2b36',
                muted_text_color: '#586875',
                surface_color: '#edf2f6',
                border_color: '#d6e0e7',
                card_background_color: '#ffffff',
                card_text_color: '#1d2b36',
            },
        }
        : profile;

    return (
        <div className="public-portfolio-root" data-public-theme={theme}>
            <TemplateComponent profile={themedProfile} />
            <button
                type="button"
                onClick={toggleTheme}
                className="public-portfolio-theme-toggle"
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            >
                <ThemeIcon theme={theme} />
            </button>
        </div>
    );
}
