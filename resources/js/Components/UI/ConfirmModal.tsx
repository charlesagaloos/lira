
import { useEffect } from 'react';
import {
    AlertTriangle,
    CheckCircle2,
    LoaderCircle,
    X,
} from 'lucide-react';

export type ConfirmModalVariant = 'default' | 'success' | 'danger';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: ConfirmModalVariant;
    isLoading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const variantStyles: Record<
    ConfirmModalVariant,
    {
        icon: string;
        button: string;
        Icon: typeof AlertTriangle;
    }
> = {
    default: {
        icon: 'border-white/10 bg-white/[0.04] text-zinc-300',
        button: 'border-white/20 bg-white text-black hover:bg-zinc-200',
        Icon: AlertTriangle,
    },
    success: {
        icon: 'border-cyan-300/20 bg-cyan-300/[0.06] text-cyan-200',
        button: 'border-cyan-300/20 bg-cyan-300/[0.10] text-cyan-100 hover:bg-cyan-300/[0.18]',
        Icon: CheckCircle2,
    },
    danger: {
        icon: 'border-rose-400/20 bg-rose-400/[0.06] text-rose-300',
        button: 'border-rose-400/20 bg-rose-400/[0.10] text-rose-200 hover:bg-rose-400/[0.18]',
        Icon: AlertTriangle,
    },
};

export default function ConfirmModal({
    isOpen,
    title,
    description,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'default',
    isLoading = false,
    onConfirm,
    onCancel,
}: ConfirmModalProps) {
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && !isLoading) {
                onCancel();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () =>
            document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, isLoading, onCancel]);

    if (!isOpen) return null;

    const styles = variantStyles[variant];
    const ModalIcon = styles.Icon;

    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
            onMouseDown={(event) => {
                if (
                    event.target === event.currentTarget &&
                    !isLoading
                ) {
                    onCancel();
                }
            }}
        >
            <div
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="confirm-modal-title"
                aria-describedby="confirm-modal-description"
                className="w-full max-w-md overflow-hidden rounded-2xl border border-white/[0.10] bg-[#0b0d0f] shadow-[0_30px_100px_rgba(0,0,0,0.65)]"
            >
                <div className="flex items-start justify-between border-b border-white/[0.07] p-5 sm:p-6">
                    <div className="flex items-start gap-4">
                        <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${styles.icon}`}
                        >
                            <ModalIcon className="h-5 w-5" />
                        </div>

                        <div className="min-w-0 pt-0.5">
                            <h2
                                id="confirm-modal-title"
                                className="text-base font-medium text-white"
                            >
                                {title}
                            </h2>
                            <p
                                id="confirm-modal-description"
                                className="mt-2 whitespace-pre-line text-sm leading-6 text-zinc-400"
                            >
                                {description}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isLoading}
                        aria-label="Close confirmation"
                        className="ml-3 rounded-lg p-1.5 text-zinc-600 transition hover:bg-white/[0.05] hover:text-white disabled:opacity-40"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="flex flex-col-reverse gap-2 border-t border-white/[0.05] bg-white/[0.015] p-5 sm:flex-row sm:justify-end sm:p-6">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="inline-flex h-10 items-center justify-center rounded-xl border border-white/[0.08] px-5 text-xs text-zinc-400 transition hover:bg-white/[0.04] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {cancelText}
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl border px-5 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${styles.button}`}
                    >
                        {isLoading && (
                            <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                        )}
                        {isLoading ? 'Please wait...' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
