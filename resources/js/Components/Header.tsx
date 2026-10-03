import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface AuthUser {
    id: number;
}

interface AuthProps {
    auth?: {
        user?: AuthUser | null;
    };
}

function MenuIcon() {
    return (
        <svg
            viewBox="0 0 20 20"
            fill="none"
            className="h-4 w-4"
            aria-hidden="true"
        >
            <path
                d="M4 6H16M4 10H16M4 14H16"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
            />
        </svg>
    );
}

function CloseIcon() {
    return (
        <svg
            viewBox="0 0 20 20"
            fill="none"
            className="h-4 w-4"
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

export default function Header() {
    const props = usePage().props as unknown as AuthProps;
    const isAuthenticated = Boolean(props.auth?.user);

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    return (
        <header className="fixed inset-x-0 top-0 z-50 w-full border-b border-white/[0.06] bg-[#050607]/65 backdrop-blur-xl">
            <div className="mx-auto flex min-h-[68px] w-full max-w-[1920px] items-center gap-3 px-4 py-2 sm:h-[76px] sm:px-6 lg:px-10 xl:px-16">

                {/* =====================================================
                    LIRA WORDMARK
                ====================================================== */}
                <Link
                    href="/"
                    aria-label="LIRA home"
                    className="group shrink-0"
                >
                    <img
                        src="/images/brand/Lira_logo.png"
                        alt="LIRA"
                        className="h-auto w-[88px] transition duration-300 group-hover:brightness-125 sm:w-[110px] lg:w-[132px]"
                    />
                </Link>

                {/* =====================================================
                    DESKTOP CENTER NAVIGATION
                ====================================================== */}
                <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-12 md:flex">
                    <a
                        href="/#discovers"
                        className="text-sm text-zinc-400 transition duration-200 hover:text-white"
                    >
                        Discover
                    </a>

                    <a
                        href="/#artists"
                        className="text-sm text-zinc-400 transition duration-200 hover:text-white"
                    >
                        Artists
                    </a>

                    <a
                        href="/#for-artists"
                        className="text-sm text-zinc-400 transition duration-200 hover:text-white"
                    >
                        About
                    </a>
                </nav>

                {/* =====================================================
                    RIGHT ACTIONS
                ====================================================== */}
                <div className="ml-auto flex min-w-0 items-center gap-2 sm:gap-4 lg:gap-7">

                    {/* Sign In / Dashboard */}
                    {isAuthenticated ? (
                        <Link
                            href="/dashboard"
                            className="shrink-0 text-xs text-zinc-400 transition duration-200 hover:text-white sm:text-sm"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <Link
                            href="/login"
                            className="shrink-0 text-xs text-zinc-400 transition duration-200 hover:text-white sm:text-sm"
                        >
                            Sign In
                        </Link>
                    )}

                    {/* =================================================
                        IRIDESCENT CTA
                    ================================================== */}
                    {!isAuthenticated && (
                        <Link
                            href="/register"
                            className="group relative inline-flex h-9 min-w-0 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/50 bg-[linear-gradient(105deg,#32ddff_0%,#6677ff_20%,#a955ff_38%,#f05abd_51%,#ff8ed3_63%,#7b63ff_78%,#34dcff_94%)] px-4 text-[11px] font-medium text-[#09090a] shadow-[0_8px_35px_rgba(90,150,255,0.18)] transition duration-300 hover:scale-[1.025] hover:shadow-[0_12px_50px_rgba(190,80,255,0.25)] sm:h-10 sm:px-5 sm:text-xs lg:h-[50px] lg:min-w-[170px] lg:px-7 lg:text-sm"
                        >
                            <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_20%,rgba(255,255,255,0.55)_48%,transparent_72%)] opacity-0 transition duration-700 group-hover:translate-x-[25%] group-hover:opacity-100" />

                            <span className="relative whitespace-nowrap">
                                Get Started
                            </span>
                        </Link>
                    )}

                    {/* =================================================
                        MOBILE MENU BUTTON
                    ================================================== */}
                    <button
                        type="button"
                        onClick={() =>
                            setMobileMenuOpen((open) => !open)
                        }
                        className={`relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border transition duration-300 md:hidden ${mobileMenuOpen
                                ? 'border-white/[0.22] bg-white/[0.08] text-white'
                                : 'border-white/[0.10] bg-white/[0.035] text-zinc-400 hover:border-white/[0.18] hover:text-white'
                            }`}
                        aria-label={
                            mobileMenuOpen
                                ? 'Close navigation'
                                : 'Open navigation'
                        }
                        aria-expanded={mobileMenuOpen}
                    >
                        <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(53,223,255,0.06),rgba(139,108,255,0.05),rgba(240,90,191,0.04))]" />

                        <span className="relative">
                            {mobileMenuOpen ? (
                                <CloseIcon />
                            ) : (
                                <MenuIcon />
                            )}
                        </span>
                    </button>
                </div>
            </div>

            {/* =========================================================
                MOBILE NAVIGATION
            ========================================================== */}
            <div
                className={`overflow-hidden border-t border-white/[0.06] transition-all duration-300 ease-out md:hidden ${mobileMenuOpen
                        ? 'max-h-[320px] opacity-100'
                        : 'max-h-0 border-t-transparent opacity-0'
                    }`}
            >
                <nav className="bg-[#070809]/98 px-4 pb-5 pt-3 backdrop-blur-2xl sm:px-6">

                    <a
                        href="/#discovers"
                        onClick={closeMobileMenu}
                        className="flex min-h-[48px] items-center justify-between rounded-xl px-4 text-sm text-zinc-400 transition hover:bg-white/[0.035] hover:text-white"
                    >
                        <span>Discover</span>

                        <span className="text-zinc-700">
                            ↗
                        </span>
                    </a>

                    <a
                        href="/#artists"
                        onClick={closeMobileMenu}
                        className="flex min-h-[48px] items-center justify-between rounded-xl px-4 text-sm text-zinc-400 transition hover:bg-white/[0.035] hover:text-white"
                    >
                        <span>Artists</span>

                        <span className="text-zinc-700">
                            ↗
                        </span>
                    </a>

                    <a
                        href="/#for-artists"
                        onClick={closeMobileMenu}
                        className="flex min-h-[48px] items-center justify-between rounded-xl px-4 text-sm text-zinc-400 transition hover:bg-white/[0.035] hover:text-white"
                    >
                        <span>About</span>

                        <span className="text-zinc-700">
                            ↗
                        </span>
                    </a>
                </nav>
            </div>
        </header>
    );
}
