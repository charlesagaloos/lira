import { FormEvent } from 'react';
import { Link, useForm } from '@inertiajs/react';
import usePublicTheme from '../../lib/usePublicTheme';
import PublicThemeToggle from '../../Components/PublicThemeToggle';

function MailIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
            <rect
                x="3"
                y="5"
                width="18"
                height="14"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.7"
            />
            <path
                d="m4 7 8 6 8-6"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function ArrowRight() {
    return (
        <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
            <path
                d="M4 10h11M11 5l5 5-5 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function CommunityIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
            <path
                d="M16 20v-1.5a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4V20"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
            />
            <circle cx="9.5" cy="7.5" r="3.5" stroke="currentColor" strokeWidth="1.6" />
            <path
                d="M17 4.5a3.5 3.5 0 0 1 0 6.8M21 20v-1.5a4 4 0 0 0-2.5-3.7"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
            />
        </svg>
    );
}

function ShowcaseIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
            <rect
                x="4"
                y="3"
                width="16"
                height="18"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.6"
            />
            <path
                d="M8 16v-3M12 16V9M16 16v-6"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
            />
        </svg>
    );
}

function GlobeIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
            <path
                d="M3 12h18M12 3c2.2 2.4 3.2 5.4 3.2 9S14.2 18.6 12 21M12 3c-2.2 2.4-3.2 5.4-3.2 9S9.8 18.6 12 21"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
            />
        </svg>
    );
}

type PageProps = {
    flash?: {
        success?: string | null;
        error?: string | null;
        status?: string | null;
    };
};


export default function ForgotPassword() {
    const { theme, toggleTheme } = usePublicTheme();
    const form = useForm({
        email: '',
    });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        form.post('/forgot-password', {
            preserveScroll: true,
        });
    }

    return (
        <main className="auth-page min-h-screen overflow-hidden bg-[#050607] text-white" data-public-theme={theme}>
            <PublicThemeToggle theme={theme} onToggle={toggleTheme} />
            <div className="grid min-h-screen lg:grid-cols-2">
                {/* Global chrome atmosphere */}
                <div className="pointer-events-none fixed inset-0 z-0">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_30%,rgba(60,215,255,0.045),transparent_30%),radial-gradient(circle_at_82%_65%,rgba(165,85,255,0.045),transparent_30%),radial-gradient(circle_at_55%_15%,rgba(255,255,255,0.025),transparent_28%)]" />
                    <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.018)_45%,transparent_58%)]" />
                </div>

                {/* Left brand panel */}
                <section className="auth-art-panel relative hidden overflow-hidden border-r border-white/[0.07] lg:flex">
                    <div className="pointer-events-none absolute left-[15%] top-[20%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(55,220,255,0.055),rgba(125,85,255,0.04)_38%,rgba(245,80,190,0.025)_55%,transparent_72%)] blur-[100px]" />

                    <div className="absolute left-10 top-8 z-20 xl:left-16">
                        <Link href="/" aria-label="LIRA home" className="group block">
                            <img
                                src="/images/brand/Lira_logo.png"
                                alt="LIRA"
                                className="h-auto w-[120px] transition duration-300 group-hover:brightness-125"
                            />
                        </Link>
                    </div>

                    <div className="relative z-10 flex w-full flex-col justify-between px-10 py-20 xl:px-16">
                        {/* Creative artwork */}
                        <div className="relative mx-auto mt-0 h-[700px] w-full max-w-[680px]">
                            <div className="pointer-events-none absolute left-[12%] top-[8%] h-[600px] w-[500px] rounded-full bg-[radial-gradient(ellipse,rgba(255,255,255,0.05),rgba(60,220,255,0.025)_28%,rgba(140,90,255,0.025)_48%,transparent_72%)] blur-[80px]" />

                            <div className="absolute left-[8%] top-[7%] h-[630px] w-[76%] rotate-[-7deg] rounded-[2.5rem] border border-white/[0.08] bg-[#0d0f11]/80 shadow-[0_40px_120px_rgba(0,0,0,0.6)] backdrop-blur-xl">
                                <div className="absolute inset-0 rounded-[2.5rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.06),transparent_22%,transparent_70%,rgba(60,215,255,0.025))]" />
                            </div>

                            <div className="absolute left-[13%] top-[3%] h-[650px] w-[78%] rotate-[5deg] rounded-[2.5rem] border border-white/[0.09] bg-[#0b0d0f]/90 shadow-[0_40px_120px_rgba(0,0,0,0.65)] backdrop-blur-xl">
                                <div className="absolute inset-0 rounded-[2.5rem] bg-[linear-gradient(125deg,transparent_18%,rgba(55,220,255,0.035)_38%,rgba(155,85,255,0.035)_55%,rgba(255,90,190,0.025)_68%,transparent_82%)]" />
                            </div>

                            <div className="absolute left-[2%] top-0 h-[670px] w-[84%] rotate-[-3deg] overflow-hidden rounded-[2.5rem] border border-white/[0.14] bg-[#0c0e10] shadow-[0_50px_140px_rgba(0,0,0,0.8)]">
                                <img
                                    src="/images/auth/artist_with_guitar.png"
                                    alt="Artist playing guitar"
                                    className="absolute inset-0 h-full w-full object-cover object-center"
                                />

                                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(3,4,5,0.12),rgba(3,4,5,0.05)_35%,rgba(3,4,5,0.92)_100%)]" />
                                <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_15%,rgba(60,220,255,0.07)_38%,rgba(150,85,255,0.055)_52%,rgba(255,85,190,0.045)_63%,transparent_82%)] mix-blend-screen" />
                                <div className="absolute inset-0 rounded-[2.5rem] border border-white/[0.07]" />

                                <div className="absolute left-10 top-10 flex items-center gap-3">
                                    <span className="h-2 w-2 rounded-full bg-[linear-gradient(135deg,#35dfff,#9b6cff,#f05abf)] shadow-[0_0_14px_rgba(80,210,255,0.6)]" />
                                    <span className="text-[10px] uppercase tracking-[0.35em] text-white/55">
                                        LIRA / ARTIST
                                    </span>
                                </div>

                                <div className="absolute bottom-11 left-10 right-10">
                                    <div className="relative mb-7 h-px w-14">
                                        <div className="absolute -inset-x-2 -inset-y-2 bg-[linear-gradient(90deg,#35dfff,#8b6cff,#f05abf)] opacity-30 blur-md" />
                                        <div className="relative h-px w-full bg-[linear-gradient(90deg,#35dfff,#8b6cff,#f05abf)]" />
                                    </div>

                                    <p className="text-xs uppercase tracking-[0.35em] text-white/65">
                                        Your art.
                                    </p>
                                    <p className="mt-2 text-xs uppercase tracking-[0.35em] text-white/45">
                                        Your identity.
                                    </p>
                                    <p className="mt-2 bg-[linear-gradient(90deg,#35dfff,#8b6cff,#f05abf)] bg-clip-text text-xs uppercase tracking-[0.35em] text-transparent">
                                        Your space.
                                    </p>
                                </div>
                            </div>

                            <div className="absolute bottom-7 right-0 z-10 overflow-hidden rounded-2xl border border-white/[0.11] bg-[#0c0e10]/90 px-5 py-4 shadow-[0_30px_80px_rgba(0,0,0,0.7)] backdrop-blur-xl">
                                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.035),transparent_45%,rgba(100,200,255,0.025))]" />
                                <p className="relative text-[8px] uppercase tracking-[0.25em] text-zinc-600">Create</p>
                                <p className="relative mt-1 text-[8px] uppercase tracking-[0.25em] text-zinc-500">Share</p>
                                <p className="relative mt-1 text-[8px] uppercase tracking-[0.25em] text-zinc-500">Inspire</p>
                            </div>
                        </div>

                        {/* Brand message */}
                        <div className="auth-brand-message max-w-xl">
                            <p className="mb-5 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-zinc-600">
                                <span className="relative h-px w-8 bg-[linear-gradient(90deg,#35dfff,#8b6cff,#f05abf)]" />
                                Account recovery
                            </p>

                            <h2 className="text-5xl font-semibold leading-[0.92] tracking-[-0.06em] xl:text-6xl">
                                Your work.
                                <br />
                                Your story.
                                <br />
                                <span className="bg-[linear-gradient(100deg,#ffffff,#9da8ae_35%,#ffffff_55%,#35dfff_78%,#d58bff)] bg-clip-text text-transparent">
                                    Your space.
                                </span>
                            </h2>

                            <p className="mt-7 max-w-lg text-sm leading-7 text-zinc-500">
                                A fresh start is only a step away. Recover access to your account and get back to building your creative identity.
                            </p>

                            <div className="mt-8 grid max-w-lg grid-cols-3 border-t border-white/[0.08] pt-6">
                                <div className="pr-5">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.025] text-zinc-400">
                                        <CommunityIcon />
                                    </div>
                                    <p className="mt-3 text-xs leading-5 text-zinc-600">
                                        Join a creative community
                                    </p>
                                </div>

                                <div className="border-l border-white/[0.08] px-5">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.025] text-zinc-400">
                                        <ShowcaseIcon />
                                    </div>
                                    <p className="mt-3 text-xs leading-5 text-zinc-600">
                                        Showcase your work
                                    </p>
                                </div>

                                <div className="border-l border-white/[0.08] pl-5">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.025] text-zinc-400">
                                        <GlobeIcon />
                                    </div>
                                    <p className="mt-3 text-xs leading-5 text-zinc-600">
                                        Be discovered globally
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Right recovery panel */}
                <section className="relative flex min-h-screen flex-col">
                    {/* Top navigation */}
                    <div className="relative z-10 flex items-center justify-between px-6 py-6 sm:px-10 lg:px-12">
                        <Link href="/" aria-label="LIRA home" className="group lg:hidden">
                            <img
                                src="/images/brand/Lira_logo.png"
                                alt="LIRA"
                                className="h-auto w-[92px] transition duration-300 group-hover:brightness-125"
                            />
                        </Link>

                        <div className="ml-auto flex items-center gap-4 text-sm">
                            <span className="hidden text-zinc-600 sm:inline">
                                Remembered your password?
                            </span>

                            <Link
                                href="/login"
                                className="group relative inline-flex h-11 items-center justify-center overflow-hidden rounded-full border border-white/[0.15] px-5 text-zinc-300 transition duration-300 hover:border-white/30 hover:text-white"
                            >
                                <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,rgba(53,223,255,0.08),rgba(139,108,255,0.08),rgba(240,90,191,0.08))] opacity-0 transition duration-300 group-hover:opacity-100" />
                                <span className="relative">Back to Login</span>
                            </Link>
                        </div>
                    </div>

                    {/* Recovery form */}
                    <div className="relative flex flex-1 items-center px-6 py-12 sm:px-10 lg:px-12">
                        <div className="mx-auto w-full max-w-xl">
                            <div className="mb-9">
                                <p className="mb-5 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-zinc-600">
                                    <span className="relative h-px w-8 bg-[linear-gradient(90deg,#35dfff,#8b6cff,#f05abf)]" />
                                    Password recovery
                                </p>

                                <h1 className="text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
                                    Forgot your{' '}
                                    <span className="bg-[linear-gradient(100deg,#ffffff,#aab4ba_42%,#35dfff_72%,#d58bff)] bg-clip-text text-transparent">
                                        password?
                                    </span>
                                </h1>

                                <p className="mt-4 max-w-md text-sm leading-6 text-zinc-500 sm:text-base">
                                    Enter the email address associated with your LIRA account. We’ll send you a link to reset your password.
                                </p>
                            </div>

                            <form onSubmit={submit} className="space-y-5">
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="mb-2 block text-sm font-medium text-zinc-400"
                                    >
                                        Email
                                    </label>

                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-zinc-700">
                                            <MailIcon />
                                        </div>

                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={form.data.email}
                                            onChange={(event) =>
                                                form.setData('email', event.target.value)
                                            }
                                            autoComplete="email"
                                            autoFocus
                                            required
                                            placeholder="you@example.com"
                                            className={`h-14 w-full rounded-xl border bg-white/[0.025] pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-700 ${form.errors.email
                                                ? 'border-red-500/40 focus:border-red-500/60'
                                                : 'border-white/[0.09] focus:border-cyan-300/30'
                                                }`}
                                        />
                                    </div>

                                    {form.errors.email && (
                                        <p role="alert" className="mt-2 text-xs text-red-400">
                                            {form.errors.email}
                                        </p>
                                    )}
                                </div>

                                {/* Iridescent recovery button */}
                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="group relative mt-3 flex h-14 w-full items-center justify-center gap-3 overflow-hidden rounded-full border border-white/50 bg-[linear-gradient(105deg,#32ddff_0%,#6677ff_20%,#a955ff_38%,#f05abd_51%,#ff8ed3_63%,#7b63ff_78%,#34dcff_94%)] text-sm font-semibold text-[#09090a] shadow-[0_8px_35px_rgba(90,150,255,0.18)] transition duration-300 hover:scale-[1.01] hover:shadow-[0_12px_50px_rgba(190,80,255,0.22)] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_18%,rgba(255,255,255,0.6)_47%,transparent_72%)] opacity-0 transition duration-700 group-hover:translate-x-[20%] group-hover:opacity-100" />

                                    <span className="relative">
                                        {form.processing ? 'Sending reset link...' : 'Send password reset link'}
                                    </span>

                                    {!form.processing && (
                                        <span className="relative transition-transform duration-300 group-hover:translate-x-1">
                                            <ArrowRight />
                                        </span>
                                    )}
                                </button>
                            </form>

                            <div className="mt-6">
                                <div className="relative mb-5">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-white/[0.07]" />
                                    </div>
                                    <div className="relative flex justify-center">
                                        <span className="bg-[#050607] px-4 text-xs text-zinc-700">
                                            NEED AN ACCOUNT?
                                        </span>
                                    </div>
                                </div>

                                <Link
                                    href="/register"
                                    className="group relative flex h-14 w-full items-center justify-center overflow-hidden rounded-full border border-white/[0.09] bg-white/[0.025] text-sm font-medium text-zinc-400 transition duration-300 hover:border-white/[0.18] hover:bg-white/[0.045] hover:text-white"
                                >
                                    <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,rgba(53,223,255,0.025),rgba(139,108,255,0.035),rgba(240,90,191,0.025))] opacity-0 transition duration-300 group-hover:opacity-100" />
                                    <span className="relative">Create a LIRA account</span>
                                </Link>
                            </div>

                            <div className="mt-12 flex items-center justify-center gap-3 text-[9px] uppercase tracking-[0.35em] text-zinc-700">
                                <span className="h-px w-8 bg-[linear-gradient(90deg,transparent,#35dfff)] opacity-50" />
                                Create. Share. Inspire.
                                <span className="h-px w-8 bg-[linear-gradient(90deg,#f05abf,transparent)] opacity-50" />
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
