import { FormEvent, useState } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';

function MailIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-5 w-5"
            aria-hidden="true"
        >
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

function LockIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-5 w-5"
            aria-hidden="true"
        >
            <rect
                x="4"
                y="10"
                width="16"
                height="10"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.7"
            />

            <path
                d="M8 10V7a4 4 0 0 1 8 0v3"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
            />
        </svg>
    );
}

function EyeIcon({ hidden }: { hidden: boolean }) {
    return hidden ? (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-5 w-5"
            aria-hidden="true"
        >
            <path
                d="M3 3l18 18"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
            />

            <path
                d="M10.6 10.7a2 2 0 0 0 2.7 2.7M9.9 5.2A10.7 10.7 0 0 1 12 5c5 0 8.5 4 9.5 6-.4.8-1.4 2.2-3 3.4M6.6 6.6C4.6 7.8 3.3 9.5 2.5 11c1 2 4.5 6 9.5 6 1 0 1.9-.2 2.7-.5"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ) : (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-5 w-5"
            aria-hidden="true"
        >
            <path
                d="M2.5 12S6 6 12 6s9.5 6 9.5 6S18 18 12 18s-9.5-6-9.5-6Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            <circle
                cx="12"
                cy="12"
                r="2.5"
                stroke="currentColor"
                strokeWidth="1.7"
            />
        </svg>
    );
}

function ArrowRight() {
    return (
        <svg
            viewBox="0 0 20 20"
            fill="none"
            className="h-4 w-4"
            aria-hidden="true"
        >
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
        <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-5 w-5"
            aria-hidden="true"
        >
            <path
                d="M16 20v-1.5a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4V20"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
            />

            <circle
                cx="9.5"
                cy="7.5"
                r="3.5"
                stroke="currentColor"
                strokeWidth="1.6"
            />

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
        <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-5 w-5"
            aria-hidden="true"
        >
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
        <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-5 w-5"
            aria-hidden="true"
        >
            <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="1.6"
            />

            <path
                d="M3 12h18M12 3c2.2 2.4 3.2 5.4 3.2 9S14.2 18.6 12 21M12 3c-2.2 2.4-3.2 5.4-3.2 9S9.8 18.6 12 21"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
            />
        </svg>
    );
}

function GoogleIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            aria-hidden="true"
        >
            <path
                fill="#4285F4"
                d="M21.35 12.23c0-.79-.07-1.55-.22-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.42Z"
            />

            <path
                fill="#34A853"
                d="M12 21.5c2.63 0 4.84-.87 6.45-2.35l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.29v2.53A9.74 9.74 0 0 0 12 21.5Z"
            />

            <path
                fill="#FBBC05"
                d="M6.54 13.59A5.86 5.86 0 0 1 6.23 12c0-.55.11-1.08.31-1.59V7.88H3.29A9.74 9.74 0 0 0 2.25 12c0 1.57.38 3.05 1.04 4.12l3.25-2.53Z"
            />

            <path
                fill="#EA4335"
                d="M12 6.38c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.83 3.49 14.63 2.5 12 2.5a9.74 9.74 0 0 0-8.71 5.38l3.25 2.53C7.31 8.1 9.46 6.38 12 6.38Z"
            />
        </svg>
    );
}

export default function Login() {
    const page = usePage();

    const errors = (
        page.props as unknown as {
            errors: {
                email?: string;
            };
        }
    ).errors;

    const form = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    function submit(event: FormEvent) {
        event.preventDefault();

        form.post('/login');
    }

    return (
        <main className="min-h-screen overflow-hidden bg-[#050607] text-white">
            <div className="grid min-h-screen lg:grid-cols-2">

                {/* =====================================================
                    GLOBAL CHROME ATMOSPHERE
                ====================================================== */}

                <div className="pointer-events-none fixed inset-0 z-0">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_30%,rgba(60,215,255,0.045),transparent_30%),radial-gradient(circle_at_82%_65%,rgba(165,85,255,0.045),transparent_30%),radial-gradient(circle_at_55%_15%,rgba(255,255,255,0.025),transparent_28%)]" />

                    <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.018)_45%,transparent_58%)]" />
                </div>

                {/* =====================================================
                    LEFT / BRAND PANEL
                ====================================================== */}

                <section className="relative hidden overflow-hidden border-r border-white/[0.07] lg:flex">

                    {/* Chrome glow behind artwork */}
                    <div className="pointer-events-none absolute left-[15%] top-[20%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(55,220,255,0.055),rgba(125,85,255,0.04)_38%,rgba(245,80,190,0.025)_55%,transparent_72%)] blur-[100px]" />

                    {/* Brand */}
                    <div className="absolute left-10 top-8 z-20 xl:left-16">
                        <Link
                            href="/"
                            aria-label="LIRA home"
                            className="group block"
                        >
                            <img
                                src="/images/brand/Lira_logo.png"
                                alt="LIRA"
                                className="h-auto w-[120px] transition duration-300 group-hover:brightness-125"
                            />
                        </Link>
                    </div>

                    <div className="relative z-10 flex w-full flex-col justify-between px-10 py-20 xl:px-16">

                        {/* =================================================
                            CREATIVE ARTWORK
                        ================================================== */}

                        <div className="relative mx-auto mt-0 h-[700px] w-full max-w-[680px]">

                            {/* Chrome atmospheric glow */}
                            <div className="pointer-events-none absolute left-[12%] top-[8%] h-[600px] w-[500px] rounded-full bg-[radial-gradient(ellipse,rgba(255,255,255,0.05),rgba(60,220,255,0.025)_28%,rgba(140,90,255,0.025)_48%,transparent_72%)] blur-[80px]" />

                            {/* Back reflection */}
                            <div className="absolute left-[8%] top-[7%] h-[630px] w-[76%] rotate-[-7deg] rounded-[2.5rem] border border-white/[0.08] bg-[#0d0f11]/80 shadow-[0_40px_120px_rgba(0,0,0,0.6)] backdrop-blur-xl">
                                <div className="absolute inset-0 rounded-[2.5rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.06),transparent_22%,transparent_70%,rgba(60,215,255,0.025))]" />
                            </div>

                            {/* Middle reflection */}
                            <div className="absolute left-[13%] top-[3%] h-[650px] w-[78%] rotate-[5deg] rounded-[2.5rem] border border-white/[0.09] bg-[#0b0d0f]/90 shadow-[0_40px_120px_rgba(0,0,0,0.65)] backdrop-blur-xl">
                                <div className="absolute inset-0 rounded-[2.5rem] bg-[linear-gradient(125deg,transparent_18%,rgba(55,220,255,0.035)_38%,rgba(155,85,255,0.035)_55%,rgba(255,90,190,0.025)_68%,transparent_82%)]" />
                            </div>

                            {/* Main artist image */}
                            <div className="absolute left-[2%] top-0 h-[670px] w-[84%] rotate-[-3deg] overflow-hidden rounded-[2.5rem] border border-white/[0.14] bg-[#0c0e10] shadow-[0_50px_140px_rgba(0,0,0,0.8)]">

                                <img
                                    src="/images/auth/artist_with_guitar.png"
                                    alt="Artist playing guitar"
                                    className="absolute inset-0 h-full w-full object-cover object-center"
                                />

                                {/* Dark cinematic treatment */}
                                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(3,4,5,0.12),rgba(3,4,5,0.05)_35%,rgba(3,4,5,0.92)_100%)]" />

                                {/* Chrome light wash */}
                                <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_15%,rgba(60,220,255,0.07)_38%,rgba(150,85,255,0.055)_52%,rgba(255,85,190,0.045)_63%,transparent_82%)] mix-blend-screen" />

                                {/* Glass highlight */}
                                <div className="absolute inset-0 rounded-[2.5rem] border border-white/[0.07]" />

                                {/* Artist label */}
                                <div className="absolute left-10 top-10 flex items-center gap-3">
                                    <span className="h-2 w-2 rounded-full bg-[linear-gradient(135deg,#35dfff,#9b6cff,#f05abf)] shadow-[0_0_14px_rgba(80,210,255,0.6)]" />

                                    <span className="text-[10px] uppercase tracking-[0.35em] text-white/55">
                                        LIRA / ARTIST
                                    </span>
                                </div>

                                {/* Bottom statement */}
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

                            {/* Floating glass label */}
                            <div className="absolute bottom-7 right-0 z-10 overflow-hidden rounded-2xl border border-white/[0.11] bg-[#0c0e10]/90 px-5 py-4 shadow-[0_30px_80px_rgba(0,0,0,0.7)] backdrop-blur-xl">

                                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.035),transparent_45%,rgba(100,200,255,0.025))]" />

                                <p className="relative text-[8px] uppercase tracking-[0.25em] text-zinc-600">
                                    Create
                                </p>

                                <p className="relative mt-1 text-[8px] uppercase tracking-[0.25em] text-zinc-500">
                                    Share
                                </p>

                                <p className="relative mt-1 text-[8px] uppercase tracking-[0.25em] text-zinc-500">
                                    Inspire
                                </p>
                            </div>
                        </div>

                        {/* =================================================
                            BRAND MESSAGE
                        ================================================== */}

                        <div className="max-w-xl">

                            <p className="mb-5 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-zinc-600">
                                <span className="relative h-px w-8 bg-[linear-gradient(90deg,#35dfff,#8b6cff,#f05abf)]" />
                                Welcome back
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
                                Sign in to continue building your creative
                                identity. Manage your portfolio, showcase your
                                work, and keep everything you create in one
                                place.
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

                {/* =====================================================
                    RIGHT / LOGIN
                ====================================================== */}

                <section className="relative flex min-h-screen flex-col">

                    {/* Top navigation */}
                    <div className="relative z-10 flex items-center justify-between px-6 py-6 sm:px-10 lg:px-12">

                        {/* Mobile logo */}
                        <Link
                            href="/"
                            aria-label="LIRA home"
                            className="group lg:hidden"
                        >
                            <img
                                src="/images/brand/Lira_logo.png"
                                alt="LIRA"
                                className="h-auto w-[92px] transition duration-300 group-hover:brightness-125"
                            />
                        </Link>

                        <div className="ml-auto flex items-center gap-4 text-sm">
                            <span className="text-zinc-600">
                                Don't have an account?
                            </span>

                            <Link
                                href="/register"
                                className="group relative inline-flex h-11 items-center justify-center overflow-hidden rounded-full border border-white/[0.15] px-5 text-zinc-300 transition duration-300 hover:border-white/30 hover:text-white"
                            >
                                <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,rgba(53,223,255,0.08),rgba(139,108,255,0.08),rgba(240,90,191,0.08))] opacity-0 transition duration-300 group-hover:opacity-100" />

                                <span className="relative">
                                    Get Started
                                </span>
                            </Link>
                        </div>
                    </div>

                    {/* Form area */}
                    <div className="relative flex flex-1 items-center px-6 py-12 sm:px-10 lg:px-12">

                        <div className="mx-auto w-full max-w-xl">

                            {/* Heading */}
                            <div className="mb-9">

                                <p className="mb-5 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-zinc-600">
                                    <span className="relative h-px w-8 bg-[linear-gradient(90deg,#35dfff,#8b6cff,#f05abf)]" />
                                    Welcome back
                                </p>

                                <h1 className="text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
                                    Sign in to{' '}
                                    <span className="bg-[linear-gradient(100deg,#ffffff,#aab4ba_42%,#35dfff_72%,#d58bff)] bg-clip-text text-transparent">
                                        LIRA
                                    </span>
                                </h1>

                                <p className="mt-4 max-w-md text-sm leading-6 text-zinc-500 sm:text-base">
                                    Continue where you left off and keep
                                    building your creative space.
                                </p>
                            </div>

                            {/* Form */}
                            <form
                                onSubmit={submit}
                                className="space-y-5"
                            >

                                {/* Email */}
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
                                            type="email"
                                            value={form.data.email}
                                            onChange={(event) =>
                                                form.setData(
                                                    'email',
                                                    event.target.value,
                                                )
                                            }
                                            autoComplete="email"
                                            autoFocus
                                            placeholder="you@example.com"
                                            className={`h-14 w-full rounded-xl border bg-white/[0.025] pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-700 ${form.errors.email || errors.email
                                                ? 'border-red-500/40 focus:border-red-500/60'
                                                : 'border-white/[0.09] focus:border-cyan-300/30'
                                                }`}
                                        />
                                    </div>

                                    {(form.errors.email || errors.email) && (
                                        <p className="mt-2 text-xs text-red-400">
                                            {form.errors.email || errors.email}
                                        </p>
                                    )}
                                </div>

                                {/* Password */}
                                <div>
                                    <div className="mb-2 flex items-center justify-between">
                                        <label
                                            htmlFor="password"
                                            className="block text-sm font-medium text-zinc-400"
                                        >
                                            Password
                                        </label>

                                        <Link
                                            href="/forgot-password"
                                            className="text-xs text-zinc-600 transition hover:text-zinc-300"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>

                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-zinc-700">
                                            <LockIcon />
                                        </div>

                                        <input
                                            id="password"
                                            type={
                                                showPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            value={form.data.password}
                                            onChange={(event) =>
                                                form.setData(
                                                    'password',
                                                    event.target.value,
                                                )
                                            }
                                            autoComplete="current-password"
                                            placeholder="Your password"
                                            className={`h-14 w-full rounded-xl border bg-white/[0.025] pl-12 pr-12 text-sm text-white outline-none transition placeholder:text-zinc-700 ${form.errors.password
                                                ? 'border-red-500/40 focus:border-red-500/60'
                                                : 'border-white/[0.09] focus:border-violet-300/30'
                                                }`}
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(
                                                    (value) => !value,
                                                )
                                            }
                                            className="absolute inset-y-0 right-4 flex items-center text-zinc-700 transition hover:text-zinc-300"
                                            aria-label={
                                                showPassword
                                                    ? 'Hide password'
                                                    : 'Show password'
                                            }
                                        >
                                            <EyeIcon
                                                hidden={showPassword}
                                            />
                                        </button>
                                    </div>

                                    {form.errors.password && (
                                        <p className="mt-2 text-xs text-red-400">
                                            {form.errors.password}
                                        </p>
                                    )}
                                </div>

                                {/* Remember me */}
                                <label className="flex cursor-pointer items-center gap-3 text-sm text-zinc-600">
                                    <input
                                        type="checkbox"
                                        checked={form.data.remember}
                                        onChange={(event) =>
                                            form.setData(
                                                'remember',
                                                event.target.checked,
                                            )
                                        }
                                        className="h-4 w-4 rounded border-white/10 bg-white/[0.025] accent-cyan-300"
                                    />

                                    Remember me
                                </label>

                                {/* =================================================
                                    IRIDESCENT SIGN IN
                                ================================================== */}

                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="group relative mt-3 flex h-14 w-full items-center justify-center gap-3 overflow-hidden rounded-full border border-white/50 bg-[linear-gradient(105deg,#32ddff_0%,#6677ff_20%,#a955ff_38%,#f05abd_51%,#ff8ed3_63%,#7b63ff_78%,#34dcff_94%)] text-sm font-semibold text-[#09090a] shadow-[0_8px_35px_rgba(90,150,255,0.18)] transition duration-300 hover:scale-[1.01] hover:shadow-[0_12px_50px_rgba(190,80,255,0.22)] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {/* Chrome reflection */}
                                    <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_18%,rgba(255,255,255,0.6)_47%,transparent_72%)] opacity-0 transition duration-700 group-hover:translate-x-[20%] group-hover:opacity-100" />

                                    <span className="relative">
                                        {form.processing
                                            ? 'Signing in...'
                                            : 'Sign in'}
                                    </span>

                                    {!form.processing && (
                                        <span className="relative transition-transform duration-300 group-hover:translate-x-1">
                                            <ArrowRight />
                                        </span>
                                    )}
                                </button>
                            </form>

                            {/* Google Sign In */}
                            <div className="mt-6">

                                <div className="relative mb-5">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-white/[0.07]" />
                                    </div>

                                    <div className="relative flex justify-center">
                                        <span className="bg-[#050607] px-4 text-xs text-zinc-700">
                                            OR
                                        </span>
                                    </div>
                                </div>

                                <a
                                    href="/auth/google"
                                    className="group relative flex h-14 w-full items-center justify-center gap-3 overflow-hidden rounded-full border border-white/[0.09] bg-white/[0.025] text-sm font-medium text-zinc-400 transition duration-300 hover:border-white/[0.18] hover:bg-white/[0.045] hover:text-white"
                                >
                                    <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,rgba(53,223,255,0.025),rgba(139,108,255,0.035),rgba(240,90,191,0.025))] opacity-0 transition duration-300 group-hover:opacity-100" />

                                    <span className="relative">
                                        <GoogleIcon />
                                    </span>

                                    <span className="relative">
                                        Continue with Google
                                    </span>
                                </a>
                            </div>

                            {/* Bottom brand line */}
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
