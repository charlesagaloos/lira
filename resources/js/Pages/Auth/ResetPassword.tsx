import { FormEvent, useEffect, useState } from 'react';
import { Link, useForm } from '@inertiajs/react';

type ResetPasswordProps = {
    email: string;
    token: string;
};

function LockIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
            <rect x="4" y="10" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="1.7" />
            <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
    );
}

function MailIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
            <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.7" />
            <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function EyeIcon({ visible }: { visible: boolean }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
            <path
                d="M2.5 12s3.4-6 9.5-6 9.5 6 9.5 6-3.4 6-9.5 6-9.5-6-9.5-6Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
            />
            <circle cx="12" cy="12" r="2.8" stroke="currentColor" strokeWidth="1.6" />
            {!visible && (
                <path d="m4 4 16 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            )}
        </svg>
    );
}

function ArrowRight() {
    return (
        <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
            <path d="M4 10h11M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export default function ResetPassword({ email, token }: ResetPasswordProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const [toast, setToast] = useState<string | null>(null);

    useEffect(() => {
        if (!toast) return;

        const timeout = window.setTimeout(() => {
            setToast(null);
        }, 4000);

        return () => window.clearTimeout(timeout);
    }, [toast]);

    const form = useForm({
        token: token ?? '',
        email: email ?? '',
        password: '',
        password_confirmation: '',
    });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        form.post('/reset-password', {
            preserveScroll: true,
            onSuccess: () => {
                setToast('Your password has been reset successfully.');
            },
        });
    }

    return (

        <main className="relative min-h-screen overflow-hidden bg-[#050607] text-white">
            {toast && (
                <div
                    role="status"
                    aria-live="polite"
                    className="fixed right-5 top-5 z-50 flex w-[calc(100%-2.5rem)] max-w-sm items-start gap-3 rounded-2xl border border-emerald-400/20 bg-[#101513]/95 p-4 shadow-2xl backdrop-blur-xl"
                >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-400">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="h-5 w-5"
                            aria-hidden="true"
                        >
                            <path
                                d="m5 12 4 4L19 6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>

                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-white">Success</p>
                        <p className="mt-1 text-sm leading-5 text-zinc-400">{toast}</p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setToast(null)}
                        aria-label="Dismiss notification"
                        className="text-lg leading-none text-zinc-500 transition hover:text-white"
                    >
                        ×
                    </button>
                </div>
            )}
            <div className="pointer-events-none fixed inset-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_30%,rgba(60,215,255,0.045),transparent_30%),radial-gradient(circle_at_82%_65%,rgba(165,85,255,0.045),transparent_30%),radial-gradient(circle_at_55%_15%,rgba(255,255,255,0.025),transparent_28%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.018)_45%,transparent_58%)]" />
            </div>

            <header className="relative z-10 flex items-center justify-between px-6 py-6 sm:px-10 lg:px-12">
                <Link href="/" aria-label="LIRA home" className="group">
                    <img
                        src="/images/brand/Lira_logo.png"
                        alt="LIRA"
                        className="h-auto w-[92px] transition duration-300 group-hover:brightness-125"
                    />
                </Link>

                <Link
                    href="/login"
                    className="group relative inline-flex h-11 items-center justify-center overflow-hidden rounded-full border border-white/[0.15] px-5 text-sm text-zinc-300 transition duration-300 hover:border-white/30 hover:text-white"
                >
                    <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,rgba(53,223,255,0.08),rgba(139,108,255,0.08),rgba(240,90,191,0.08))] opacity-0 transition group-hover:opacity-100" />
                    <span className="relative">Back to Login</span>
                </Link>
            </header>

            <section className="relative z-10 flex min-h-[calc(100vh-88px)] items-center justify-center px-6 py-12 sm:px-10">
                <div className="w-full max-w-xl">
                    <div className="mb-9">
                        <p className="mb-5 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-zinc-600">
                            <span className="h-px w-8 bg-[linear-gradient(90deg,#35dfff,#8b6cff,#f05abf)]" />
                            Account security
                        </p>

                        <h1 className="text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
                            Create a new{' '}
                            <span className="bg-[linear-gradient(100deg,#ffffff,#aab4ba_42%,#35dfff_72%,#d58bff)] bg-clip-text text-transparent">
                                password.
                            </span>
                        </h1>

                        <p className="mt-4 max-w-md text-sm leading-6 text-zinc-500 sm:text-base">
                            Choose a strong password to secure your LIRA account and get back to your creative space.
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="mb-2 block text-sm font-medium text-zinc-400">
                                Email
                            </label>

                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-zinc-700">
                                    <MailIcon />
                                </div>

                                <input
                                    id="email"
                                    type="email"
                                    value={form.data.email}
                                    onChange={(event) => form.setData('email', event.target.value)}
                                    autoComplete="email"
                                    required
                                    className="h-14 w-full rounded-xl border border-white/[0.09] bg-white/[0.025] pl-12 pr-4 text-sm text-white outline-none transition focus:border-cyan-300/30"
                                />
                            </div>

                            {form.errors.email && (
                                <p role="alert" className="mt-2 text-xs text-red-400">
                                    {form.errors.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="mb-2 block text-sm font-medium text-zinc-400">
                                New password
                            </label>

                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-zinc-700">
                                    <LockIcon />
                                </div>

                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={form.data.password}
                                    onChange={(event) => form.setData('password', event.target.value)}
                                    autoComplete="new-password"
                                    required
                                    placeholder="Enter your new password"
                                    className={`h-14 w-full rounded-xl border bg-white/[0.025] pl-12 pr-12 text-sm text-white outline-none transition placeholder:text-zinc-700 ${form.errors.password
                                        ? 'border-red-500/40 focus:border-red-500/60'
                                        : 'border-white/[0.09] focus:border-cyan-300/30'
                                        }`}
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    className="absolute inset-y-0 right-4 flex items-center text-zinc-600 transition hover:text-zinc-300"
                                >
                                    <EyeIcon visible={showPassword} />
                                </button>
                            </div>

                            {form.errors.password && (
                                <p role="alert" className="mt-2 text-xs text-red-400">
                                    {form.errors.password}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password_confirmation" className="mb-2 block text-sm font-medium text-zinc-400">
                                Confirm new password
                            </label>

                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-zinc-700">
                                    <LockIcon />
                                </div>

                                <input
                                    id="password_confirmation"
                                    type={showConfirmation ? 'text' : 'password'}
                                    value={form.data.password_confirmation}
                                    onChange={(event) => form.setData('password_confirmation', event.target.value)}
                                    autoComplete="new-password"
                                    required
                                    placeholder="Re-enter your new password"
                                    className={`h-14 w-full rounded-xl border bg-white/[0.025] pl-12 pr-12 text-sm text-white outline-none transition placeholder:text-zinc-700 ${form.errors.password
                                        ? 'border-red-500/40 focus:border-red-500/60'
                                        : 'border-white/[0.09] focus:border-cyan-300/30'
                                        }`}
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowConfirmation(!showConfirmation)}
                                    aria-label={showConfirmation ? 'Hide confirmation' : 'Show confirmation'}
                                    className="absolute inset-y-0 right-4 flex items-center text-zinc-600 transition hover:text-zinc-300"
                                >
                                    <EyeIcon visible={showConfirmation} />
                                </button>
                            </div>
                        </div>

                        {form.errors.token && (
                            <p role="alert" className="text-xs text-red-400">
                                {form.errors.token}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={form.processing}
                            className="group relative mt-3 flex h-14 w-full items-center justify-center gap-3 overflow-hidden rounded-full border border-white/50 bg-[linear-gradient(105deg,#32ddff_0%,#6677ff_20%,#a955ff_38%,#f05abd_51%,#ff8ed3_63%,#7b63ff_78%,#34dcff_94%)] text-sm font-semibold text-[#09090a] shadow-[0_8px_35px_rgba(90,150,255,0.18)] transition duration-300 hover:scale-[1.01] hover:shadow-[0_12px_50px_rgba(190,80,255,0.22)] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_18%,rgba(255,255,255,0.6)_47%,transparent_72%)] opacity-0 transition duration-700 group-hover:translate-x-[20%] group-hover:opacity-100" />
                            <span className="relative">
                                {form.processing ? 'Updating password...' : 'Reset password'}
                            </span>
                            {!form.processing && (
                                <span className="relative transition-transform duration-300 group-hover:translate-x-1">
                                    <ArrowRight />
                                </span>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-zinc-600">
                        Remembered your password?{' '}
                        <Link href="/login" className="text-zinc-300 transition hover:text-white">
                            Sign in
                        </Link>
                    </div>

                    <div className="mt-12 flex items-center justify-center gap-3 text-[9px] uppercase tracking-[0.35em] text-zinc-700">
                        <span className="h-px w-8 bg-[linear-gradient(90deg,transparent,#35dfff)] opacity-50" />
                        Create. Share. Inspire.
                        <span className="h-px w-8 bg-[linear-gradient(90deg,#f05abf,transparent)] opacity-50" />
                    </div>
                </div>
            </section>
        </main>
    );
}
