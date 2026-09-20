import { useEffect, useRef, useState } from 'react';
import { router } from '@inertiajs/react';

interface FlashProps {
    success?: string | null;
    error?: string | null;
}

interface InertiaPageProps {
    flash?: FlashProps;
}

function CheckIcon() {
    return (
        <svg
            viewBox="0 0 20 20"
            fill="none"
            className="h-4 w-4"
            aria-hidden="true"
        >
            <path
                d="M5 10.5L8.25 13.5L15 6.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function ErrorIcon() {
    return (
        <svg
            viewBox="0 0 20 20"
            fill="none"
            className="h-4 w-4"
            aria-hidden="true"
        >
            <circle
                cx="10"
                cy="10"
                r="7"
                stroke="currentColor"
                strokeWidth="1.3"
            />

            <path
                d="M10 6.5V10.5"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
            />

            <circle
                cx="10"
                cy="13.5"
                r="0.75"
                fill="currentColor"
            />
        </svg>
    );
}

function CloseIcon() {
    return (
        <svg
            viewBox="0 0 20 20"
            fill="none"
            className="h-3.5 w-3.5"
            aria-hidden="true"
        >
            <path
                d="M5 5L15 15M15 5L5 15"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
            />
        </svg>
    );
}

export default function FlashAlert() {
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [type, setType] = useState<'success' | 'error'>('success');

    const timerRef = useRef<number | null>(null);

    function clearTimer() {
        if (timerRef.current !== null) {
            window.clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }

    function showAlert(
        message: string,
        type: 'success' | 'error',
    ) {
        clearTimer();

        setMessage(message);
        setType(type);
        setVisible(true);

        timerRef.current = window.setTimeout(() => {
            setVisible(false);
            timerRef.current = null;
        }, 4000);
    }

    useEffect(() => {
        const removeListener = router.on('success', (event) => {
            const pageProps =
                event.detail.page.props as InertiaPageProps;

            const flash = pageProps.flash;

            if (flash?.success) {
                showAlert(flash.success, 'success');
                return;
            }

            if (flash?.error) {
                showAlert(flash.error, 'error');
                return;
            }
        });

        return () => {
            removeListener();
            clearTimer();
        };
    }, []);

    function dismiss() {
        clearTimer();
        setVisible(false);
    }

    if (!visible || !message) {
        return null;
    }

    const isSuccess = type === 'success';

    return (
        <div
            className="pointer-events-none fixed right-5 top-5 z-[100] w-[min(380px,calc(100vw-2.5rem))] sm:right-7 sm:top-7"
            role="status"
            aria-live="polite"
        >
            <div
                className={`pointer-events-auto relative overflow-hidden rounded-2xl border backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.06)] ${isSuccess
                        ? 'border-[#7de7ff]/20 bg-[#071014]/90'
                        : 'border-red-400/20 bg-[#14090a]/90'
                    }`}
            >
                {/* Top chrome line */}

                <div
                    className={`absolute inset-x-0 top-0 h-px ${isSuccess
                            ? 'bg-[linear-gradient(90deg,transparent,#7de7ff,transparent)]'
                            : 'bg-[linear-gradient(90deg,transparent,#f87171,transparent)]'
                        }`}
                />

                {/* Ambient glow */}

                <div
                    className={`pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full blur-3xl ${isSuccess
                            ? 'bg-[#7de7ff]/[0.08]'
                            : 'bg-red-400/[0.08]'
                        }`}
                />

                <div className="relative flex items-start gap-3 px-4 py-3.5">
                    {/* Icon */}

                    <div
                        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${isSuccess
                                ? 'border-[#7de7ff]/15 bg-[#7de7ff]/[0.05] text-[#7de7ff]'
                                : 'border-red-400/15 bg-red-400/[0.05] text-red-400'
                            }`}
                    >
                        {isSuccess ? <CheckIcon /> : <ErrorIcon />}
                    </div>

                    {/* Message */}

                    <div className="min-w-0 flex-1">
                        <p
                            className={`text-[8px] uppercase tracking-[0.25em] ${isSuccess
                                    ? 'text-[#7de7ff]/70'
                                    : 'text-red-400/70'
                                }`}
                        >
                            {isSuccess ? 'Success' : 'Error'}
                        </p>

                        <p className="mt-1 text-xs leading-5 text-zinc-300">
                            {message}
                        </p>
                    </div>

                    {/* Close */}

                    <button
                        type="button"
                        onClick={dismiss}
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-zinc-700 transition hover:bg-white/[0.05] hover:text-zinc-300"
                        aria-label="Dismiss notification"
                    >
                        <CloseIcon />
                    </button>
                </div>

                {/* Progress bar */}

                <div
                    className={`h-px ${isSuccess
                            ? 'bg-[#7de7ff]/30'
                            : 'bg-red-400/30'
                        }`}
                    style={{
                        animation: 'flash-progress 4s linear forwards',
                    }}
                />
            </div>
        </div>
    );
}
