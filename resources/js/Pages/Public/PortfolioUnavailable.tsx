import { Head, Link } from '@inertiajs/react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';

type Props = {
    username: string;
    isOwner: boolean;
    status: 'pending' | 'verified' | 'rejected';
    isPublished: boolean;
};

function LockIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-7 w-7"
            aria-hidden="true"
        >
            <path
                d="M7 10V7a5 5 0 0 1 10 0v3"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
            />
            <rect
                x="4"
                y="10"
                width="16"
                height="11"
                rx="2.5"
                stroke="currentColor"
                strokeWidth="1.4"
            />
            <circle cx="12" cy="15" r="1.3" fill="currentColor" />
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

export default function PortfolioUnavailable({
    username,
    isOwner,
    status,
    isPublished,
}: Props) {
    const title = !isPublished
        ? 'Your space is not live yet.'
        : status === 'pending'
            ? 'Your space is taking shape.'
            : status === 'rejected'
                ? 'Your space needs attention.'
                : 'This space is unavailable.';

    const message = !isPublished
        ? 'Your creative world is almost ready. Head to your dashboard to continue setting up your portfolio and prepare it for the world.'
        : status === 'pending'
            ? 'Your artist profile is currently being reviewed. Visit your dashboard to check your profile status and next steps.'
            : status === 'rejected'
                ? "Your artist profile is not currently available to the public. Visit your dashboard to review your profile and available next steps."
                : "This artist's creative space is not available right now. Check back again later.";

    const displayTitle = isOwner
        ? title
        : 'This creative space is not available.';

    const displayMessage = isOwner
        ? message
        : 'This portfolio may not be published yet. In the meantime, discover more independent creatives on LIRA.';

    return (
        <>
            <Head title={isOwner ? 'Portfolio Status' : 'Portfolio Unavailable'} />

            <main className="relative isolate flex min-h-screen flex-col overflow-hidden bg-[#030405] text-white">
                <Header />

                {/* Atmospheric chrome background */}
                <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_35%,rgba(255,255,255,0.08),transparent_22%),radial-gradient(circle_at_20%_70%,rgba(255,255,255,0.025),transparent_28%)]" />

                    <div className="absolute -right-[15%] top-[8%] h-[650px] w-[650px] rounded-full bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.12),rgba(120,220,255,0.055)_20%,rgba(120,90,255,0.045)_38%,rgba(255,70,190,0.035)_53%,transparent_70%)] blur-[90px]" />

                    <div className="absolute -bottom-[15%] -left-[10%] h-[550px] w-[550px] rounded-full bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.07),rgba(70,220,255,0.035)_24%,rgba(160,80,255,0.03)_42%,rgba(255,70,180,0.02)_55%,transparent_72%)] blur-[100px]" />

                    <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_8%,rgba(40,220,255,0.012)_28%,rgba(120,80,255,0.02)_42%,rgba(255,70,190,0.014)_53%,transparent_75%)]" />
                </div>

                <section className="relative flex flex-1 items-center justify-center px-6 pb-20 pt-32 sm:px-10">
                    <div className="relative mx-auto w-full max-w-3xl text-center">
                        {/* Chrome frame */}
                        <div className="pointer-events-none absolute -inset-5 rounded-[2.5rem] bg-[linear-gradient(120deg,rgba(255,255,255,0.07),rgba(50,220,255,0.035),transparent_35%,rgba(145,90,255,0.04),rgba(255,80,190,0.035),rgba(255,255,255,0.05))] blur-2xl" />

                        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#090b0d]/75 px-6 py-12 shadow-[0_35px_100px_rgba(0,0,0,0.5)] backdrop-blur-2xl sm:px-12 sm:py-16">
                            {/* LIRA wordmark */}
                            <Link
                                href="/"
                                aria-label="LIRA home"
                                className="inline-flex items-center justify-center transition duration-300 hover:brightness-125"
                            >
                                <img
                                    src="/images/brand/Lira_logo.png"
                                    alt="LIRA"
                                    className="h-auto w-[120px] object-contain sm:w-[145px]"
                                />
                            </Link>

                            {/* Status icon */}
                            <div className="relative mx-auto mt-12 flex h-24 w-24 items-center justify-center">
                                <div className="absolute inset-0 rounded-full bg-[linear-gradient(135deg,rgba(53,223,255,0.12),rgba(124,108,255,0.12),rgba(240,90,191,0.12))] blur-xl" />

                                <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-white/15 bg-[#111416]/90 text-white/75 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                                    <LockIcon />
                                </div>
                            </div>

                            <p className="mt-9 text-[9px] uppercase tracking-[0.4em] text-zinc-500">
                                {isOwner ? 'YOUR LIRA SPACE' : 'LIRA / PORTFOLIO'}
                            </p>

                            <h1 className="mx-auto mt-5 max-w-2xl text-4xl font-semibold leading-[0.98] tracking-[-0.065em] sm:text-6xl">
                                {isOwner ? (
                                    displayTitle
                                ) : (
                                    <>
                                        This creative space
                                        <br />
                                        <span className="bg-[linear-gradient(100deg,#ffffff_0%,#8d9aa2_20%,#ffffff_36%,#5ee6ff_49%,#a855f7_65%,#f05abf_80%,#ffffff_100%)] bg-clip-text text-transparent">
                                            is not available.
                                        </span>
                                    </>
                                )}
                            </h1>

                            <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-zinc-400 sm:text-base sm:leading-8">
                                {displayMessage}
                            </p>

                            <div className="mx-auto mt-9 flex max-w-xs items-center justify-center gap-2">
                                <span className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-300/40 to-violet-400/30" />
                                <span className="h-1 w-1 rounded-full bg-white/50" />
                                <span className="h-px flex-1 bg-gradient-to-r from-violet-400/30 via-fuchsia-300/40 to-transparent" />
                            </div>

                            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                                {isOwner ? (
                                    <Link
                                        href="/dashboard"
                                        className="group relative inline-flex h-[52px] items-center justify-center gap-3 overflow-hidden rounded-full border border-white/40 bg-[linear-gradient(105deg,#32ddff_0%,#6677ff_20%,#a955ff_38%,#f05abf_51%,#ff8ed3_63%,#7b63ff_78%,#34dcff_94%)] px-7 text-sm font-semibold text-[#09090a] shadow-[0_10px_45px_rgba(90,150,255,0.15)] transition duration-300 hover:scale-[1.025]"
                                    >
                                        <span>Go to Dashboard</span>
                                        <ArrowUpRight />
                                    </Link>
                                ) : (
                                    <Link
                                        href="/"
                                        className="group relative inline-flex h-[52px] items-center justify-center gap-3 overflow-hidden rounded-full border border-white/40 bg-[linear-gradient(105deg,#32ddff_0%,#6677ff_20%,#a955ff_38%,#f05abf_51%,#ff8ed3_63%,#7b63ff_78%,#34dcff_94%)] px-7 text-sm font-semibold text-[#09090a] shadow-[0_10px_45px_rgba(90,150,255,0.15)] transition duration-300 hover:scale-[1.025]"
                                    >
                                        <span>Explore LIRA</span>
                                        <ArrowUpRight />
                                    </Link>
                                )}
                            </div>

                            <p className="mt-10 text-xs text-zinc-600">
                                @{username}
                            </p>
                        </div>

                        <p className="mt-8 text-[9px] uppercase tracking-[0.3em] text-zinc-700">
                            Your art. Your identity. Your space.
                        </p>
                    </div>
                </section>

                <Footer />
            </main>
        </>
    );
}
