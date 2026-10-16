import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import FlashAlert from './Components/UI/FlashAlert';

createInertiaApp({
    resolve: (name) => {
        const pages = import.meta.glob('./Pages/**/*.tsx', {
            eager: true,
        });

        return pages[`./Pages/${name}.tsx`] as {
            default: React.ComponentType;
        };
    },
    
    setup({ el, App, props }) {
        createRoot(el).render(
            <>
                <App {...props} />
                <FlashAlert initialFlash={props.initialPage.props.flash as {
                    success?: string | null;
                    error?: string | null;
                    status?: string | null;
                }} />
            </>,
        );
    },


    title: (title) => (title ? `${title} — LIRA` : 'LIRA'),
});
