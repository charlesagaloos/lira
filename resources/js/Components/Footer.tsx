import { Link } from '@inertiajs/react';

function InstagramIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-[18px] w-[18px]"
            aria-hidden="true"
        >
            <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="5"
                stroke="currentColor"
                strokeWidth="1.4"
            />

            <circle
                cx="12"
                cy="12"
                r="4"
                stroke="currentColor"
                strokeWidth="1.4"
            />

            <circle
                cx="17.5"
                cy="6.5"
                r="0.9"
                fill="currentColor"
            />
        </svg>
    );
}

function XIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-[18px] w-[18px]"
            aria-hidden="true"
        >
            <path
                d="M5 4L19 20M19 4L5 20"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
        </svg>
    );
}

function YouTubeIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-[18px] w-[18px]"
            aria-hidden="true"
        >
            <rect
                x="3"
                y="6"
                width="18"
                height="12"
                rx="4"
                stroke="currentColor"
                strokeWidth="1.4"
            />

            <path
                d="M10 9L16 12L10 15V9Z"
                fill="currentColor"
            />
        </svg>
    );
}

function ArrowUpRight() {
    return (
        <svg
            viewBox="0 0 20 20"
            fill="none"
            className="h-4 w-4"
            aria-hidden="true"
        >
            <path
                d="M5 15L15 5M7 5H15V13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export default function Footer() {
    return (
        <footer className="relative overflow-hidden border-t border-white/[0.08] bg-[#050607] text-white">
            {/* =====================================================
                ATMOSPHERIC CHROME LIGHT
            ====================================================== */}

            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-[10%] bottom-[-45%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(55,220,255,0.035),rgba(130,85,255,0.025)_38%,rgba(255,80,190,0.018)_55%,transparent_72%)] blur-[90px]" />

                <div className="absolute right-[-8%] top-[-45%] h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.055),rgba(100,210,255,0.025)_25%,rgba(170,90,255,0.018)_45%,transparent_70%)] blur-[90px]" />
            </div>

            <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
                {/* =================================================
                    MAIN FOOTER
                ================================================== */}

                <div className="grid gap-14 py-16 sm:py-20 lg:grid-cols-[1.4fr_0.8fr_0.8fr] lg:gap-20">
                    {/* =================================================
                        BRAND
                    ================================================== */}

                    <div>
                        <Link href="/" aria-label="LIRA home" className="group inline-block">
                            <img src="/images/brand/Lira_logo.png" alt="LIRA" className="h-auto w-[150px] transition duration-300 group-hover:brightness-125"/>
                        </Link>

                        <p className="mt-7 max-w-sm text-sm leading-6 text-zinc-500">
                            A space for independent artists to build their
                            identity, showcase their work, and share their
                            creative world.
                        </p>

                        {/* Iridescent signature line */}
                        <div className="relative mt-8 h-px w-32 overflow-visible">
                            <div className="absolute -inset-x-3 -inset-y-2 bg-[linear-gradient(90deg,transparent,#35dfff,#8b6cff,#f05abf,#35dfff,transparent)] opacity-25 blur-md" />

                            <div className="relative h-px w-full bg-[linear-gradient(90deg,#35dfff,#8b6cff,#f05abf,#35dfff)] opacity-70" />
                        </div>
                    </div>

                    {/* =================================================
                        NAVIGATION
                    ================================================== */}

                    <div>
                        <p className="text-[9px] uppercase tracking-[0.35em] text-zinc-600">
                            Explore
                        </p>

                        <nav className="mt-6 flex flex-col gap-4">
                            <a
                                href="/#discovers"
                                className="group flex items-center gap-2 text-sm text-zinc-400 transition duration-200 hover:text-white"
                            >
                                Discover

                                <span className="text-zinc-700 opacity-0 transition duration-200 group-hover:translate-x-0.5 group-hover:opacity-100">
                                    <ArrowUpRight />
                                </span>
                            </a>

                            <a
                                href="/#artists"
                                className="group flex items-center gap-2 text-sm text-zinc-400 transition duration-200 hover:text-white"
                            >
                                Artists

                                <span className="text-zinc-700 opacity-0 transition duration-200 group-hover:translate-x-0.5 group-hover:opacity-100">
                                    <ArrowUpRight />
                                </span>
                            </a>

                            <a
                                href="/#for-artists"
                                className="group flex items-center gap-2 text-sm text-zinc-400 transition duration-200 hover:text-white"
                            >
                                For Artists

                                <span className="text-zinc-700 opacity-0 transition duration-200 group-hover:translate-x-0.5 group-hover:opacity-100">
                                    <ArrowUpRight />
                                </span>
                            </a>

                            <a
                                href="/#faq"
                                className="group flex items-center gap-2 text-sm text-zinc-400 transition duration-200 hover:text-white"
                            >
                                FAQ

                                <span className="text-zinc-700 opacity-0 transition duration-200 group-hover:translate-x-0.5 group-hover:opacity-100">
                                    <ArrowUpRight />
                                </span>
                            </a>
                        </nav>
                    </div>

                    {/* =================================================
                        CONNECT
                    ================================================== */}

                    <div>
                        <p className="text-[9px] uppercase tracking-[0.35em] text-zinc-600">
                            Connect
                        </p>

                        <div className="mt-6 flex items-center gap-5">
                            <a
                                href="#"
                                aria-label="Instagram"
                                className="text-zinc-500 transition duration-200 hover:bg-[linear-gradient(135deg,#35dfff,#9b5cff,#f05abf)] hover:bg-clip-text hover:text-transparent"
                            >
                                <InstagramIcon />
                            </a>

                            <a
                                href="#"
                                aria-label="X"
                                className="text-zinc-500 transition duration-200 hover:bg-[linear-gradient(135deg,#35dfff,#9b5cff,#f05abf)] hover:bg-clip-text hover:text-transparent"
                            >
                                <XIcon />
                            </a>

                            <a
                                href="#"
                                aria-label="YouTube"
                                className="text-zinc-500 transition duration-200 hover:bg-[linear-gradient(135deg,#35dfff,#9b5cff,#f05abf)] hover:bg-clip-text hover:text-transparent"
                            >
                                <YouTubeIcon />
                            </a>
                        </div>

                        <p className="mt-7 max-w-[220px] text-xs leading-5 text-zinc-600">
                            Your art.
                            <br />
                            Your identity.
                            <br />
                            Your space.
                        </p>
                    </div>
                </div>

                {/* =================================================
                    BOTTOM BAR
                ================================================== */}

                <div className="relative border-t border-white/[0.07] py-6">
                    {/* Tiny chrome reflection */}
                    <div className="pointer-events-none absolute left-0 top-[-1px] h-px w-32 bg-[linear-gradient(90deg,#35dfff,#8b6cff,#f05abf,transparent)] opacity-50" />

                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-700">
                            © {new Date().getFullYear()} LIRA
                        </p>

                        <div className="flex items-center gap-6 text-[10px] uppercase tracking-[0.2em] text-zinc-700">
                            <a
                                href="#"
                                className="transition hover:text-zinc-400"
                            >
                                Privacy
                            </a>

                            <a
                                href="#"
                                className="transition hover:text-zinc-400"
                            >
                                Terms
                            </a>

                            <a
                                href="#"
                                className="transition hover:text-zinc-400"
                            >
                                Contact
                            </a>
                        </div>

                        <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-700">
                            Independent Creative Platform
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
