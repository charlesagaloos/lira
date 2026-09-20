import { Link, usePage } from '@inertiajs/react';

interface AuthUser {
    id: number;
}

interface AuthProps {
    auth?: {
        user?: AuthUser | null;
    };
}

export default function Header() {
    const props = usePage().props as unknown as AuthProps;
    const isAuthenticated = Boolean(props.auth?.user);

    return (
        <header className="fixed inset-x-0 top-0 z-50 w-full bg-[#050607]/65 backdrop-blur-xl">
            <div className="mx-auto flex h-[76px] max-w-[1920px] items-center px-8 sm:px-10 lg:px-16">
                {/* =====================================================
                    LIRA WORDMARK
                ====================================================== */}
                <Link href="/" aria-label="LIRA home" className="group shrink-0">
                    <img src="/images/brand/Lira_logo.png" alt="LIRA" className="h-auto w-[132px] transition duration-300 group-hover:brightness-125" />
                </Link>

                {/* =====================================================
                    CENTER NAVIGATION
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
                <div className="ml-auto flex items-center gap-7">
                    {/* Sign In / Dashboard */}
                    {isAuthenticated ? (
                        <Link
                            href="/dashboard"
                            className="hidden text-sm text-zinc-400 transition duration-200 hover:text-white sm:block"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <Link
                            href="/login"
                            className="hidden text-sm text-zinc-400 transition duration-200 hover:text-white sm:block"
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
                            className="group relative inline-flex h-[50px] min-w-[170px] items-center justify-center overflow-hidden rounded-full border border-white/50 bg-[linear-gradient(105deg,#32ddff_0%,#6677ff_20%,#a955ff_38%,#f05abd_51%,#ff8ed3_63%,#7b63ff_78%,#34dcff_94%)] px-7 text-sm font-medium text-[#09090a] shadow-[0_8px_35px_rgba(90,150,255,0.18)] transition duration-300 hover:scale-[1.025] hover:shadow-[0_12px_50px_rgba(190,80,255,0.25)]"
                        >
                            {/* Chrome highlight */}
                            <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_20%,rgba(255,255,255,0.55)_48%,transparent_72%)] opacity-0 transition duration-700 group-hover:translate-x-[25%] group-hover:opacity-100" />

                            <span className="relative">
                                Get Started
                            </span>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
