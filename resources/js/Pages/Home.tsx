import { Link } from '@inertiajs/react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';

interface Artist {
    id: number;
    username: string;
    display_name: string;
    artist_type: string | null;
    location: string | null;
    avatar: string | null;
    cover_image: string | null;
}

interface Props {
    artists: Artist[];
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

function PenIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-6 w-6"
            aria-hidden="true"
        >
            <path
                d="M4 20L8.5 19L19 8.5C20.1 7.4 20.1 5.6 19 4.5C17.9 3.4 16.1 3.4 15 4.5L4.5 15L4 20Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
            />
            <path
                d="M13.5 6L18 10.5"
                stroke="currentColor"
                strokeWidth="1.5"
            />
        </svg>
    );
}

function FolderIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-6 w-6"
            aria-hidden="true"
        >
            <path
                d="M3 7.5C3 6.67 3.67 6 4.5 6H9L11 8H19.5C20.33 8 21 8.67 21 9.5V17.5C21 18.33 20.33 19 19.5 19H4.5C3.67 19 3 18.33 3 17.5V7.5Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function GlobeIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-6 w-6"
            aria-hidden="true"
        >
            <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="1.5"
            />
            <path
                d="M3 12H21M12 3C14.2 5.4 15.4 8.4 15.4 12C15.4 15.6 14.2 18.6 12 21C9.8 18.6 8.6 15.6 8.6 12C8.6 8.4 9.8 5.4 12 3Z"
                stroke="currentColor"
                strokeWidth="1.5"
            />
        </svg>
    );
}

function SparkleIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-6 w-6"
            aria-hidden="true"
        >
            <path
                d="M12 3L13.5 9.5L20 11L13.5 12.5L12 19L10.5 12.5L4 11L10.5 9.5L12 3Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
            />
            <path
                d="M19 3V6M17.5 4.5H20.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
        </svg>
    );
}

const features = [
    {
        icon: PenIcon,
        title: 'Create Your Profile',
        description: 'Show who you are. Tell your story. Make it yours.',
    },
    {
        icon: FolderIcon,
        title: 'Showcase Your Work',
        description: 'Upload your music, projects, and creative work.',
    },
    {
        icon: GlobeIcon,
        title: 'Reach a Wider Audience',
        description:
            'Share your portfolio with fans, collaborators, and opportunities.',
    },
    {
        icon: SparkleIcon,
        title: 'A Space for Creatives',
        description:
            'Designed for artists, by people who understand creativity.',
    },
];

function getImageUrl(path: string | null): string | null {
    if (!path) {
        return null;
    }

    if (
        path.startsWith('http://') ||
        path.startsWith('https://') ||
        path.startsWith('/')
    ) {
        return path;
    }

    return `/storage/${path}`;
}

export default function Home({ artists }: Props) {
    const heroArtist = artists[0] ?? null;
    const heroImage = heroArtist
        ? getImageUrl(heroArtist.cover_image ?? heroArtist.avatar)
        : null;

    return (
        <main className="min-h-screen overflow-hidden bg-[#030405] text-white">
            <Header />

            {/* =========================================================
                HERO
            ========================================================= */}
            <section className="relative isolate min-h-screen overflow-hidden border-b border-white/10 pt-[76px]">
                {/* Atmospheric chrome background */}
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_42%,rgba(255,255,255,0.11),transparent_22%),radial-gradient(circle_at_20%_70%,rgba(255,255,255,0.035),transparent_28%),radial-gradient(circle_at_80%_85%,rgba(90,210,255,0.025),transparent_24%)]" />

                    <div className="absolute -right-[10%] top-[2%] h-[820px] w-[820px] rounded-full bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.17),rgba(120,220,255,0.07)_20%,rgba(120,90,255,0.05)_38%,rgba(255,70,190,0.04)_53%,transparent_70%)] blur-[90px]" />

                    <div className="absolute -bottom-[24%] left-[28%] h-[720px] w-[720px] rounded-full bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.09),rgba(70,220,255,0.04)_24%,rgba(160,80,255,0.035)_42%,rgba(255,70,180,0.022)_55%,transparent_72%)] blur-[100px]" />

                    {/* Very subtle liquid color sweep */}
                    <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_8%,rgba(40,220,255,0.018)_28%,rgba(120,80,255,0.026)_42%,rgba(255,70,190,0.017)_53%,transparent_66%,rgba(50,220,255,0.012)_84%,transparent_96%)]" />

                    <div className="absolute -right-[12%] top-[52%] h-px w-[65%] rotate-[-13deg] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.08),rgba(100,220,255,0.12),transparent)] blur-[1px]" />
                </div>

                <div className="relative mx-auto grid min-h-[calc(100vh-76px)] w-full max-w-[1920px] items-center gap-10 px-8 pb-20 pt-12 sm:px-10 lg:grid-cols-[0.88fr_1.12fr] lg:px-20 lg:pb-16 lg:pt-6 xl:gap-4">
                    {/* -------------------------------------------------
                        Hero copy
                    ------------------------------------------------- */}
                    <div className="relative z-10 max-w-[760px] xl:pl-2">
                        <div className="mb-8 flex items-center gap-3 text-[10px] uppercase tracking-[0.42em] text-zinc-500">
                            <span className="h-px w-10 bg-[linear-gradient(90deg,#35dfff,#9b5cff,#f05abf)]" />

                            Independent creative platform
                        </div>

                        <h1 className="text-[clamp(4.25rem,6.8vw,8.4rem)] font-semibold leading-[0.82] tracking-[-0.085em]">
                            Your art.
                            <br />
                            Your identity.
                            <br />

                            {/* Liquid chrome typography */}
                            <span className="relative inline-block">
                                <span className="bg-[linear-gradient(102deg,#ffffff_0%,#7c8a93_12%,#ffffff_22%,#58656e_34%,#f9fbfc_43%,#b6c1c7_52%,#ffffff_62%,#66737c_73%,#ffffff_84%,#aab5bb_92%,#ffffff_100%)] bg-clip-text text-transparent drop-shadow-[0_0_28px_rgba(180,220,255,0.13)]">
                                    Your space.
                                </span>

                                {/* Tiny iridescent reflection */}
                                <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,transparent_8%,rgba(50,220,255,0.8)_20%,rgba(125,90,255,0.65)_35%,rgba(255,80,190,0.7)_48%,rgba(255,210,100,0.5)_58%,rgba(70,230,210,0.55)_72%,transparent_88%)] bg-clip-text text-transparent opacity-70 mix-blend-screen">
                                    Your space.
                                </span>
                            </span>
                        </h1>

                        <p className="mt-9 max-w-[620px] text-base leading-7 text-zinc-400 sm:text-lg sm:leading-8">
                            LIRA gives independent artists a place to build
                            their identity, showcase their work, and share
                            everything that makes their creative world theirs.
                        </p>

                        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                            {/* Primary CTA */}
                            <Link
                                href="/register"
                                className="group relative inline-flex h-[54px] items-center justify-center gap-3 overflow-hidden rounded-full border border-white/55 bg-[linear-gradient(105deg,#32ddff_0%,#6677ff_20%,#a955ff_38%,#f05abd_51%,#ff8ed3_63%,#7b63ff_78%,#34dcff_94%)] px-8 text-sm font-semibold text-[#09090a] shadow-[0_10px_45px_rgba(90,150,255,0.20),0_0_30px_rgba(240,90,210,0.10)] transition duration-300 hover:scale-[1.025] hover:shadow-[0_14px_60px_rgba(190,80,255,0.28),0_0_35px_rgba(50,220,255,0.16)]"
                            >
                                <span className="absolute inset-0 bg-[linear-gradient(115deg,transparent,rgba(255,255,255,0.42),transparent)] opacity-0 transition duration-500 group-hover:translate-x-full group-hover:opacity-100" />

                                <span className="relative">
                                    Create your space
                                </span>

                                <span className="relative transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                                    <ArrowUpRight />
                                </span>
                            </Link>

                            {/* Secondary CTA */}
                            <a
                                href="#artists"
                                className="inline-flex h-[54px] items-center justify-center gap-3 rounded-full border border-white/20 bg-white/[0.015] px-8 text-sm font-medium text-zinc-300 transition hover:border-white/35 hover:bg-white/[0.035] hover:text-white"
                            >
                                Explore LIRA
                                <span className="text-zinc-500">↓</span>
                            </a>
                        </div>

                        <div className="mt-12 flex items-center gap-7 border-t border-white/10 pt-6">
                            <div>
                                <p className="text-2xl font-medium tracking-tight">
                                    01
                                </p>
                                <p className="mt-1 text-[9px] uppercase tracking-[0.25em] text-zinc-600">
                                    Create
                                </p>
                            </div>

                            <div className="h-8 w-px bg-white/10" />

                            <div>
                                <p className="text-2xl font-medium tracking-tight">
                                    02
                                </p>
                                <p className="mt-1 text-[9px] uppercase tracking-[0.25em] text-zinc-600">
                                    Customize
                                </p>
                            </div>

                            <div className="h-8 w-px bg-white/10" />

                            <div>
                                <p className="text-2xl font-medium tracking-tight">
                                    03
                                </p>
                                <p className="mt-1 text-[9px] uppercase tracking-[0.25em] text-zinc-600">
                                    Share
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* =================================================
                        HERO VISUAL
                    ================================================= */}
                    <div className="relative mx-auto h-[570px] w-full max-w-[940px] lg:h-[700px] xl:translate-x-4">

                        {/* =================================================
                            CHROME ATMOSPHERE
                        ================================================= */}

                        {/* Main soft chrome bloom */}
                        <div className="pointer-events-none absolute right-[0%] top-[0%] h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle_at_38%_28%,rgba(255,255,255,0.13),rgba(55,220,255,0.055)_25%,rgba(125,90,255,0.045)_43%,rgba(255,80,190,0.035)_57%,transparent_74%)] blur-[70px]" />

                        {/* Cyan reflected light */}
                        <div className="pointer-events-none absolute right-[18%] top-[25%] h-[180px] w-[420px] rotate-[-18deg] rounded-full bg-cyan-300/[0.035] blur-[85px]" />

                        {/* Purple reflected light */}
                        <div className="pointer-events-none absolute right-[4%] bottom-[20%] h-[180px] w-[360px] rotate-[20deg] rounded-full bg-violet-400/[0.04] blur-[90px]" />

                        {/* Pink reflected light */}
                        <div className="pointer-events-none absolute right-[28%] bottom-[5%] h-[130px] w-[280px] rounded-full bg-fuchsia-400/[0.035] blur-[80px]" />


                        {/* =================================================
                            BACK PORTFOLIO
                        ================================================= */}
                        <div className="absolute right-[1%] top-5 h-[475px] w-[78%] rotate-[5deg] lg:h-[520px]">

                            {/* Outer chrome bloom */}
                            <div className="pointer-events-none absolute -inset-[9px] rounded-[2.35rem] bg-[linear-gradient(120deg,rgba(255,255,255,0.10),rgba(80,220,255,0.07),transparent_38%,rgba(150,90,255,0.07),rgba(255,90,200,0.055),rgba(255,255,255,0.08))] blur-xl" />

                            {/* Chrome rim */}
                            <div className="pointer-events-none absolute -inset-[2px] rounded-[2.3rem] bg-[linear-gradient(125deg,rgba(255,255,255,0.60),rgba(120,220,255,0.20)_18%,rgba(255,255,255,0.08)_38%,rgba(255,255,255,0.04)_55%,rgba(170,100,255,0.16)_72%,rgba(255,100,210,0.14)_84%,rgba(255,255,255,0.42))]" />

                            {/* Card */}
                            <div className="relative h-full w-full rounded-[2.25rem] border border-white/15 bg-[#0e1012]/90 p-5 shadow-[0_35px_90px_rgba(0,0,0,0.65)] backdrop-blur-xl">

                                <div className="flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#08090a]">

                                    {/* Back portfolio header */}
                                    <div className="flex items-center justify-between px-6 py-5">

                                        <div className="flex gap-2">
                                            <span className="h-1.5 w-1.5 rounded-full bg-white/35" />
                                            <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
                                        </div>

                                        <div className="flex gap-4 text-[8px] uppercase tracking-[0.22em] text-zinc-600">
                                            <span>Music</span>
                                            <span>Photo</span>
                                            <span>Visual</span>
                                        </div>

                                    </div>

                                    {/* Back artwork */}
                                    <div className="relative flex-1 overflow-hidden">

                                        <div className="absolute inset-0 bg-[linear-gradient(135deg,#171a1c_0%,#657178_20%,#f1f4f5_39%,#313a3f_54%,#aeb8bd_73%,#171a1c_100%)]" />

                                        <div className="absolute inset-0 bg-[linear-gradient(125deg,transparent_15%,rgba(45,225,255,0.14)_29%,rgba(130,90,255,0.12)_43%,rgba(255,75,190,0.10)_53%,rgba(255,200,90,0.07)_63%,transparent_80%)]" />

                                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,255,255,0.65),transparent_25%)]" />

                                        {/* Chrome reflection */}
                                        <div className="pointer-events-none absolute -left-[25%] top-[25%] h-[35%] w-[150%] rotate-[-12deg] bg-white/[0.08] blur-3xl" />

                                    </div>

                                </div>
                            </div>
                        </div>


                        {/* =================================================
                            MAIN PORTFOLIO
                        ================================================= */}
                        <div className="absolute left-[1%] top-12 z-10 h-[530px] w-[84%] lg:h-[590px]">

                            {/* Main outer bloom */}
                            <div className="pointer-events-none absolute -inset-[14px] rounded-[2.45rem] bg-[linear-gradient(120deg,rgba(255,255,255,0.12),rgba(50,220,255,0.07),transparent_35%,rgba(145,90,255,0.08),rgba(255,80,190,0.07),rgba(255,255,255,0.10))] blur-2xl" />

                            {/* Main chrome rim */}
                            <div className="pointer-events-none absolute -inset-[2px] rounded-[2.3rem] bg-[linear-gradient(125deg,rgba(255,255,255,0.75),rgba(130,225,255,0.24)_15%,rgba(255,255,255,0.10)_30%,rgba(255,255,255,0.04)_48%,rgba(165,100,255,0.18)_66%,rgba(255,100,210,0.16)_78%,rgba(255,255,255,0.55)_94%)]" />

                            {/* Main card */}
                            <div className="relative h-full w-full overflow-hidden rounded-[2.25rem] border border-white/20 bg-[#101214]/95 shadow-[0_45px_120px_rgba(0,0,0,0.72)] backdrop-blur-xl">

                                {/* Subtle chrome reflection across card */}
                                <div className="pointer-events-none absolute -left-[30%] top-[8%] z-30 h-[60%] w-[35%] rotate-[18deg] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.07),rgba(90,220,255,0.045),transparent)] blur-3xl" />

                                <div className="pointer-events-none absolute -right-[20%] bottom-[3%] z-30 h-[45%] w-[30%] rotate-[-20deg] bg-[linear-gradient(90deg,transparent,rgba(165,100,255,0.055),rgba(255,100,210,0.045),transparent)] blur-3xl" />


                                {/* =================================================
                                    TOP BAR
                                ================================================= */}
                                <div className="relative z-20 flex items-center justify-between border-b border-white/10 px-6 py-5">

                                    <div className="flex items-center gap-3">

                                        <span className="h-2 w-2 rounded-full bg-white/70 shadow-[0_0_12px_rgba(255,255,255,0.35)]" />

                                        <span className="text-[9px] uppercase tracking-[0.3em] text-zinc-500">
                                            LIRA / ARTIST
                                        </span>

                                    </div>

                                    <div className="h-7 w-7 rounded-full border border-white/10 bg-[linear-gradient(135deg,#f7f9fa,#66737a,#ffffff,#8b969c)] shadow-[0_0_22px_rgba(255,255,255,0.10)]" />

                                </div>


                                {/* =================================================
                                    ARTIST INFO
                                ================================================= */}
                                <div className="relative z-20 px-7 pb-7 pt-9">

                                    <p className="text-[9px] uppercase tracking-[0.3em] text-zinc-500">
                                        @artistname
                                    </p>

                                    <h2 className="mt-3 text-4xl font-semibold leading-[0.9] tracking-[-0.06em]">
                                        Artist
                                        <br />
                                        Name.
                                    </h2>

                                    <p className="mt-4 text-xs text-zinc-500">
                                        Musician · Visual Artist · Manila
                                    </p>

                                </div>


                                {/* =================================================
                                    ARTWORK
                                ================================================= */}
                                <div className="relative z-20 grid grid-cols-2 gap-3 px-7">

                                    {/* Project 01 */}
                                    <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/15 shadow-[0_0_35px_rgba(80,220,255,0.035)]">

                                        <div className="absolute inset-0 bg-[linear-gradient(135deg,#f6f8f9_0%,#87939a_17%,#1a1e20_35%,#e5e9eb_50%,#58656d_68%,#f8fafb_100%)]" />

                                        <div className="absolute inset-0 bg-[linear-gradient(125deg,transparent_15%,rgba(0,220,255,0.12)_30%,rgba(150,80,255,0.11)_44%,rgba(255,70,190,0.09)_55%,rgba(255,210,90,0.06)_65%,transparent_82%)]" />

                                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,255,255,0.7),transparent_27%)]" />

                                        {/* Surface reflection */}
                                        <div className="pointer-events-none absolute -left-[25%] top-[25%] h-[30%] w-[150%] rotate-[-15deg] bg-white/[0.12] blur-2xl" />

                                        {/* Inner chrome edge */}
                                        <div className="pointer-events-none absolute inset-0 rounded-2xl border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.35)]" />

                                        <span className="absolute bottom-4 left-4 text-[8px] uppercase tracking-[0.2em] text-black/60">
                                            Project 01
                                        </span>

                                    </div>


                                    {/* Project 02 */}
                                    <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/15 shadow-[0_0_35px_rgba(165,100,255,0.035)]">

                                        <div className="absolute inset-0 bg-[linear-gradient(145deg,#171a1c_0%,#707b82_28%,#f0f3f4_46%,#56636a_67%,#171a1c_100%)]" />

                                        <div className="absolute inset-0 bg-[linear-gradient(145deg,transparent_12%,rgba(70,220,255,0.12)_29%,rgba(125,90,255,0.12)_43%,rgba(255,70,180,0.10)_54%,rgba(70,230,160,0.06)_66%,transparent_84%)]" />

                                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_22%,rgba(255,255,255,0.65),transparent_25%)]" />

                                        {/* Surface reflection */}
                                        <div className="pointer-events-none absolute -right-[25%] top-[30%] h-[30%] w-[150%] rotate-[15deg] bg-white/[0.10] blur-2xl" />

                                        {/* Inner chrome edge */}
                                        <div className="pointer-events-none absolute inset-0 rounded-2xl border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.35)]" />

                                        <span className="absolute bottom-4 left-4 text-[8px] uppercase tracking-[0.2em] text-white/65">
                                            Project 02
                                        </span>

                                    </div>

                                </div>


                                {/* =================================================
                                    CARD FOOTER
                                ================================================= */}
                                <div className="relative z-20 mt-4 flex items-center justify-between px-7">

                                    <span className="text-[8px] uppercase tracking-[0.25em] text-zinc-600">
                                        Selected work
                                    </span>

                                    <span className="bg-[linear-gradient(90deg,#35dfff,#6578ff,#a855f7,#f05abf,#ff8bd2,#35dfff)] bg-clip-text text-[9px] font-medium text-transparent">
                                        View all →
                                    </span>

                                </div>

                            </div>
                        </div>


                        {/* =================================================
                            FLOATING YOUR SPACE CARD
                        ================================================= */}
                        <div className="absolute bottom-2 right-[1%] z-20 w-56">

                            {/* Outer chrome bloom */}
                            <div className="pointer-events-none absolute -inset-[9px] rounded-[1.4rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.10),rgba(50,220,255,0.07),transparent_40%,rgba(165,90,255,0.08),rgba(255,90,200,0.07),rgba(255,255,255,0.10))] blur-xl" />

                            {/* Chrome rim */}
                            <div className="pointer-events-none absolute -inset-[2px] rounded-[1.35rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.55),rgba(70,220,255,0.18),transparent_35%,rgba(160,90,255,0.18),rgba(255,100,210,0.14),rgba(255,255,255,0.45))]" />

                            {/* Card */}
                            <div className="relative rounded-[1.25rem] border border-white/15 bg-[#111315]/95 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.65)] backdrop-blur-xl">

                                <div className="flex items-center justify-between">

                                    <span className="text-[9px] uppercase tracking-[0.22em] text-zinc-500">
                                        Your space
                                    </span>

                                    <span className="bg-[linear-gradient(135deg,#35dfff,#7c6cff,#f05abf)] bg-clip-text text-transparent">
                                        <ArrowUpRight />
                                    </span>

                                </div>


                                {/* Glowing iridescent line */}
                                <div className="relative mt-6 h-1.5">

                                    {/* Bloom */}
                                    <div className="absolute -inset-x-2 top-1/2 h-5 -translate-y-1/2 rounded-full bg-[linear-gradient(90deg,#35dfff,#6578ff,#a855f7,#f05abf,#ff8bd2,#35dfff)] opacity-30 blur-md" />

                                    {/* Line */}
                                    <div className="relative h-1.5 w-full rounded-full bg-[linear-gradient(90deg,#35dfff,#6578ff,#a855f7,#f05abf,#ff8bd2,#35dfff)] shadow-[0_0_16px_rgba(90,210,255,0.25)]" />

                                </div>


                                <p className="mt-4 text-xs leading-5 text-zinc-400">
                                    Build something that feels like you.
                                </p>

                            </div>
                        </div>

                    </div>
                </div>

                <div className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 items-center gap-3 text-[9px] uppercase tracking-[0.35em] text-zinc-600 lg:flex">
                    Scroll to explore
                    <span className="bg-[linear-gradient(135deg,#35dfff,#a855f7,#f05abf)] bg-clip-text text-transparent">
                        ↓
                    </span>
                </div>
            </section>

            {/* =========================================================
                DISCOVER / FEATURES
            ========================================================= */}
            <section id="discovers" className="border-b border-white/10">
                <div className="mx-auto max-w-[1920px] px-8 sm:px-10 lg:px-20 lg:py-22">
                    <div className="grid border-x border-white/10 md:grid-cols-2 lg:grid-cols-4">
                        {features.map((feature, index) => (
                            <div
                                key={feature.title}
                                className={`min-h-[250px] px-6 py-10 lg:px-8 lg:py-14 ${index > 0 ? 'border-t border-white/10 md:border-l md:border-t-0' : ''
                                    }`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <span className="text-[10px] uppercase tracking-[0.28em] text-zinc-600">
                                        0{index + 1}
                                    </span>
                                    <span className="h-px w-12 bg-[linear-gradient(90deg,#35dfff,#a855f7,#f05abf)] opacity-60" />
                                </div>

                                <h2 className="mt-16 text-lg font-medium tracking-[-0.03em]">
                                    {feature.title}
                                </h2>

                                <p className="mt-3 max-w-xs text-sm leading-6 text-zinc-500">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* =========================================================
                FEATURED ARTISTS
            ========================================================= */}
            <section id="features" className="border-b border-white/10">
                <div id="artists" className="mx-auto max-w-[1920px] px-8 py-24 sm:px-10 lg:px-20 lg:py-32">
                    <div className="flex items-end justify-between gap-6 border-b border-white/10 pb-8">
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.38em] text-zinc-500">
                                Featured artists
                            </p>
                            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.055em] sm:text-6xl">
                                Real artists.
                                <br />
                                Real stories.
                            </h2>
                        </div>
                        <a href="#artists" className="hidden items-center gap-2 text-sm text-zinc-400 transition hover:text-white sm:flex">
                            Explore all artists
                            <ArrowUpRight />
                        </a>
                    </div>

                    {artists.length > 0 ? (
                        <div className="mt-12 grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
                            {artists.map((artist) => {
                                const image = getImageUrl(artist.cover_image ?? artist.avatar);

                                return (
                                    <Link
                                        key={artist.id}
                                        href={`/@${artist.username}`}
                                        className="group relative overflow-hidden bg-[#070809] transition duration-500 hover:bg-[#0b0d0e]"
                                    >
                                        <div className="relative aspect-[0.82/1] overflow-hidden">
                                            {image ? (
                                                <img
                                                    src={image}
                                                    alt={artist.display_name}
                                                    className="h-full w-full object-cover grayscale-[0.35] transition duration-700 group-hover:scale-[1.035] group-hover:grayscale-0"
                                                />
                                            ) : (
                                                <div className="relative h-full w-full overflow-hidden bg-[linear-gradient(135deg,#101315,#738087_32%,#151719_54%,#c4ccd0_76%,#111315)]">
                                                    <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(60,220,255,0.10),rgba(170,90,255,0.08),rgba(255,80,190,0.06),transparent)]" />
                                                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,255,255,0.32),transparent_30%)]" />
                                                </div>
                                            )}

                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/5 to-transparent opacity-90" />

                                            <div className="absolute inset-x-6 bottom-6">
                                                <div className="flex items-end justify-between gap-4">
                                                    <div>
                                                        <p className="text-[9px] uppercase tracking-[0.28em] text-white/45">
                                                            @{artist.username}
                                                        </p>
                                                        <h3 className="mt-2 text-2xl font-medium tracking-[-0.04em]">
                                                            {artist.display_name}
                                                        </h3>
                                                        {(artist.artist_type || artist.location) && (
                                                            <p className="mt-2 text-xs text-white/45">
                                                                {[artist.artist_type, artist.location].filter(Boolean).join(' · ')}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-black/20 text-white/70 backdrop-blur-sm transition group-hover:border-white/40 group-hover:text-white">
                                                        <ArrowUpRight />
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="mt-12 border border-white/10 px-6 py-20 text-center">
                            <p className="text-sm text-zinc-500">
                                Artists will appear here as they build their LIRA spaces.
                            </p>
                        </div>
                    )}

                    <a href="#artists" className="mt-8 flex items-center justify-center gap-2 text-sm text-zinc-400 transition hover:text-white sm:hidden">
                        Explore all artists
                        <ArrowUpRight />
                    </a>
                </div>
            </section>

            {/* =========================================================
                QUOTE
            ========================================================= */}
            <section className="border-b border-white/10">
                <div className="relative mx-auto min-h-[280px] max-w-7xl overflow-hidden px-6 sm:px-8 lg:px-10">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgba(80,220,255,0.04),transparent_35%),radial-gradient(ellipse_at_30%_70%,rgba(170,90,255,0.03),transparent_35%),linear-gradient(90deg,#111416,#070809)]" />

                    <div className="relative flex min-h-[280px] items-center justify-center px-6 text-center lg:justify-end lg:text-left lg:pr-20">
                        <div className="max-w-xl">
                            <div className="text-5xl leading-none text-zinc-600">
                                “
                            </div>

                            <blockquote className="mt-1 text-3xl font-medium leading-tight tracking-[-0.04em] text-zinc-200 sm:text-5xl">
                                A platform that actually feels like home for
                                creatives.
                            </blockquote>

                            <div className="mt-5 flex items-center justify-center gap-3 lg:justify-start">
                                <span className="h-px w-6 bg-[linear-gradient(90deg,#35dfff,#a855f7,#f05abf)]" />

                                <span className="text-[10px] uppercase tracking-[0.25em] text-zinc-600">
                                    LIRA artist
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =========================================================
                FOR ARTISTS
            ========================================================= */}
            <section
                id="for-artists"
                className="border-b border-white/10"
            >
                <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 sm:px-8 lg:grid-cols-2 lg:px-10 lg:py-28">
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.35em] text-zinc-500">
                            For artists
                        </p>

                        <h2 className="mt-4 max-w-xl text-4xl font-semibold leading-[0.95] tracking-[-0.06em] sm:text-6xl">
                            Your work deserves
                            <br />

                            <span className="bg-[linear-gradient(100deg,#f8fbff,#8d9aa2_20%,#ffffff_38%,#5ee6ff_48%,#a855f7_61%,#f05abf_72%,#ffffff_88%)] bg-clip-text text-transparent">
                                your own space.
                            </span>
                        </h2>
                    </div>

                    <div className="lg:pt-8">
                        <p className="max-w-xl text-base leading-7 text-zinc-400 sm:text-lg">
                            Build a portfolio around your creative identity.
                            Choose what you show, how it looks, and how people
                            discover your work.
                        </p>

                        <div className="mt-8 grid grid-cols-2 gap-8 border-t border-white/10 pt-8">
                            <div>
                                <p className="text-3xl font-semibold">01</p>

                                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-zinc-600">
                                    Your identity
                                </p>
                            </div>

                            <div>
                                <p className="text-3xl font-semibold">∞</p>

                                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-zinc-600">
                                    Your creativity
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =========================================================
                FAQ
            ========================================================= */}
            <section id="faq" className="border-b border-white/10">
                <div className="mx-auto max-w-4xl px-6 py-20 sm:px-8 lg:py-24">
                    <div className="text-center">
                        <p className="text-[10px] uppercase tracking-[0.35em] text-zinc-500">
                            FAQ
                        </p>

                        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
                            Questions, answered.
                        </h2>
                    </div>

                    <div className="mt-10 divide-y divide-white/10 border-y border-white/10">
                        {[
                            'Who is LIRA for?',
                            'Can I customize my portfolio?',
                            'Can I share my portfolio anywhere?',
                        ].map((question) => (
                            <div
                                key={question}
                                className="flex items-center justify-between py-5"
                            >
                                <span className="text-sm text-zinc-300">
                                    {question}
                                </span>

                                <span className="text-zinc-600">+</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* =========================================================
                FINAL CTA
            ========================================================= */}
            <section>
                <div className="mx-auto max-w-7xl px-6 py-24 text-center sm:px-8 lg:px-10 lg:py-32">
                    <p className="text-[10px] uppercase tracking-[0.35em] text-zinc-500">
                        Ready to build yours?
                    </p>

                    <h2 className="mt-4 text-5xl font-semibold leading-[0.9] tracking-[-0.065em] sm:text-7xl">
                        Start with your own
                        <br />
                        <span className="bg-[linear-gradient(102deg,#ffffff_0%,#8a979f_18%,#ffffff_32%,#5ee6ff_46%,#a855f7_60%,#f05abf_73%,#ffffff_90%)] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(180,220,255,0.10)]">space.</span>
                    </h2>

                    <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-zinc-500">
                        Join LIRA and create a portfolio that&apos;s uniquely
                        you.
                    </p>

                    <Link
                        href="/register"
                        className="group relative mt-8 inline-flex items-center gap-3 overflow-hidden rounded-full border border-white/40 bg-[linear-gradient(105deg,#31dcff_0%,#6376ff_22%,#a653ff_39%,#f05abf_52%,#ff8bd2_64%,#7961ff_78%,#31dcff_94%)] px-8 py-4 text-sm font-semibold text-[#09090a] shadow-[0_15px_55px_rgba(110,110,255,0.16)] transition duration-300 hover:scale-[1.025] hover:shadow-[0_18px_70px_rgba(200,80,255,0.24)]"
                    >
                        <span className="absolute inset-0 bg-[linear-gradient(115deg,transparent,rgba(255,255,255,0.45),transparent)] opacity-0 transition duration-500 group-hover:translate-x-full group-hover:opacity-100" />

                        <span className="relative">Get Started</span>

                        <span className="relative transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                            <ArrowUpRight />
                        </span>
                    </Link>
                </div>
            </section>

            <Footer />
        </main>
    );
}
