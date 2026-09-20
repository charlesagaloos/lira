import { Link } from '@inertiajs/react';
import type { ReactNode } from 'react';
import DashboardLayout from '../Components/Dashboard/d_layout';

import {
    ArrowRight,
    ArrowUpRight,
    CheckIcon,
    GlobeIcon,
    LockIcon,
    PlusIcon,
    UserIcon,
    FolderIcon,
} from '../Components/Icons';

interface Profile {
    id: number;
    username: string;
    display_name: string;
    bio: string | null;
    artist_type: string | null;
    location: string | null;
    verification_status: string;
    is_published: boolean;
    portfolio_views_count: number;
}

interface Project {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    project_type: string | null;
    thumbnail: string | null;
    is_visible: boolean;
}

interface Props {
    profile: Profile | null;
    projects: Project[];
}


function ChromeButton({
    href,
    children,
}: {
    href: string;
    children: ReactNode;
}) {
    return (
        <Link
            href={href}
            className="group relative inline-flex h-11 items-center justify-center gap-3 overflow-hidden rounded-full border border-white/40 bg-[linear-gradient(105deg,#32ddff_0%,#6677ff_20%,#a955ff_38%,#f05abd_51%,#ff8ed3_63%,#7b63ff_78%,#34dcff_94%)] px-6 text-xs font-medium text-[#08090b] shadow-[0_8px_35px_rgba(90,150,255,0.16)] transition duration-300 hover:scale-[1.02] hover:shadow-[0_12px_45px_rgba(190,80,255,0.22)]"
        >
            <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_20%,rgba(255,255,255,0.5)_48%,transparent_72%)] opacity-0 transition duration-700 group-hover:translate-x-[25%] group-hover:opacity-100" />

            <span className="relative">{children}</span>

            <span className="relative">
                <ArrowUpRight />
            </span>
        </Link>
    );
}

function GlassPanel({
    children,
    className = '',
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <div
            className={`relative overflow-hidden rounded-[1.5rem] border border-white/[0.09] bg-white/[0.018] backdrop-blur-xl ${className}`}
        >
            {/* Chrome edge */}
            <div className="pointer-events-none absolute inset-0 rounded-[1.5rem] border border-white/[0.025]" />

            {/* Subtle glass reflection */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)]" />

            <div className="relative">{children}</div>
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

export default function Dashboard({ profile, projects }: Props) {
    /*
    |--------------------------------------------------------------------------
    | NEW USER
    |--------------------------------------------------------------------------
    */

    if (!profile) {
        return (
            <DashboardLayout>
                <div className="mx-auto max-w-[1400px] px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
                    {/* Eyebrow */}
                    <div className="mb-8 flex items-center gap-3">
                        <span className="h-px w-8 bg-[linear-gradient(90deg,#ffffff,#7d8991,transparent)]" />

                        <span className="text-[9px] uppercase tracking-[0.35em] text-zinc-600">
                            LIRA / STUDIO
                        </span>
                    </div>

                    {/* Hero */}
                    <div className="max-w-3xl">
                        <h1 className="text-4xl font-light leading-[0.95] tracking-[-0.055em] text-white sm:text-5xl lg:text-6xl">
                            Your creative
                            <br />

                            <span className="bg-[linear-gradient(100deg,#ffffff_0%,#aeb8bd_30%,#ffffff_48%,#77838a_68%,#ffffff_100%)] bg-clip-text text-transparent">
                                space starts here.
                            </span>
                        </h1>

                        <p className="mt-6 max-w-xl text-sm leading-6 text-zinc-500">
                            Create your artist profile, build your portfolio,
                            and shape a space that feels like you.
                        </p>

                        <div className="mt-8">
                            <ChromeButton href="/dashboard/profile/create">
                                Create Artist Profile
                            </ChromeButton>
                        </div>
                    </div>

                    {/* Onboarding */}
                    <GlassPanel className="mt-16 max-w-[1000px]">
                        <div className="grid md:grid-cols-3">
                            <div className="border-b border-white/[0.07] p-7 md:border-b-0 md:border-r">
                                <span className="text-[10px] text-zinc-600">
                                    01
                                </span>

                                <h2 className="mt-7 text-sm font-medium text-white">
                                    Create your identity
                                </h2>

                                <p className="mt-3 text-xs leading-5 text-zinc-600">
                                    Set your artist name, bio, location, and
                                    social presence.
                                </p>
                            </div>

                            <div className="border-b border-white/[0.07] p-7 md:border-b-0 md:border-r">
                                <span className="text-[10px] text-zinc-600">
                                    02
                                </span>

                                <h2 className="mt-7 text-sm font-medium text-white">
                                    Get verified
                                </h2>

                                <p className="mt-3 text-xs leading-5 text-zinc-600">
                                    Your artist identity will be reviewed
                                    before your creative space becomes fully
                                    available.
                                </p>
                            </div>

                            <div className="p-7">
                                <span className="text-[10px] text-zinc-600">
                                    03
                                </span>

                                <h2 className="mt-7 text-sm font-medium text-white">
                                    Build your space
                                </h2>

                                <p className="mt-3 text-xs leading-5 text-zinc-600">
                                    Add projects, customize your portfolio,
                                    and publish your work.
                                </p>
                            </div>
                        </div>
                    </GlassPanel>
                </div>
            </DashboardLayout>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | PROFILE STATUS
    |--------------------------------------------------------------------------
    */

    const verificationStatus =
        profile.verification_status.toLowerCase();

    const isVerified = verificationStatus === 'verified';
    const isRejected = verificationStatus === 'rejected';

    /*
    |--------------------------------------------------------------------------
    | EXISTING ARTIST
    |--------------------------------------------------------------------------
    */

    return (
        <DashboardLayout>
            <div className="mx-auto max-w-[1400px] px-6 py-10 sm:px-8 lg:px-12 lg:py-12">
                {/* =========================================================
                    PAGE INTRO
                ========================================================== */}

                <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
                    <div>
                        <div className="mb-5 flex items-center gap-3">
                            <span className="h-px w-8 bg-[linear-gradient(90deg,#ffffff,#7d8991,transparent)]" />

                            <span className="text-[9px] uppercase tracking-[0.35em] text-zinc-600">
                                LIRA / STUDIO
                            </span>
                        </div>

                        <h1 className="text-4xl font-light tracking-[-0.055em] text-white sm:text-5xl">
                            Good to see you again,
                            <br />

                            <span className="bg-[linear-gradient(90deg,#fff_0%,#bdefff_24%,#9d8cff_58%,#f08bd7_82%,#fff_100%)] bg-clip-text text-transparent">
                                {profile.display_name}.
                            </span>
                        </h1>

                        <p className="mt-5 max-w-xl text-sm leading-6 text-zinc-600">
                            Manage your creative identity, projects, and
                            portfolio from your studio.
                        </p>
                    </div>

                    {isVerified && (
                        <ChromeButton href="/dashboard/projects/create">
                            <span className="flex items-center gap-2">
                                <PlusIcon />
                                Add Project
                            </span>
                        </ChromeButton>
                    )}
                </div>

                {/* =========================================================
                    ARTIST IDENTITY
                ========================================================== */}

                <GlassPanel className="mt-12">
                    <div className="p-6 sm:p-8">
                        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex items-center gap-5">
                                {/* Artist avatar */}
                                <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-[linear-gradient(135deg,#eef2f3_0%,#66747b_30%,#ffffff_48%,#56636a_70%,#eef2f3_100%)] shadow-[0_0_30px_rgba(255,255,255,0.08)]">
                                    <span className="text-lg font-medium text-black/70">
                                        {profile.display_name
                                            .charAt(0)
                                            .toUpperCase()}
                                    </span>

                                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent_20%,rgba(255,255,255,0.6)_48%,transparent_72%)] opacity-40" />
                                </div>

                                <div>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <h2 className="text-xl font-medium tracking-[-0.02em]">
                                            {profile.display_name}
                                        </h2>

                                        {isVerified && (
                                            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#35dfff]/20 bg-[#35dfff]/[0.04] px-2.5 py-1 text-[8px] uppercase tracking-[0.18em] text-[#72e9ff]">
                                                <CheckIcon />
                                                Verified
                                            </span>
                                        )}
                                    </div>

                                    <p className="mt-1 text-xs text-zinc-600">
                                        @{profile.username}
                                    </p>

                                    <p className="mt-3 text-xs text-zinc-500">
                                        {[
                                            profile.artist_type,
                                            profile.location,
                                        ]
                                            .filter(Boolean)
                                            .join(' · ') ||
                                            'Independent Artist'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </GlassPanel>

                {/* =========================================================
                    VERIFICATION STATUS
                ========================================================== */}

                {!isVerified && (
                    <GlassPanel className="mt-5">
                        <div className="relative p-6 sm:p-8">
                            <div
                                className={`absolute left-0 top-0 h-full w-px ${isRejected
                                    ? 'bg-[#ff6b9d]'
                                    : 'bg-[linear-gradient(to_bottom,#ffffff,#7d8991,#ffffff)]'
                                    }`}
                            />

                            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                    <p className="text-[9px] uppercase tracking-[0.3em] text-zinc-600">
                                        Artist Verification
                                    </p>

                                    <h2 className="mt-3 text-lg font-medium">
                                        {isRejected
                                            ? 'Your profile needs attention.'
                                            : 'Your artist profile is under review.'}
                                    </h2>

                                    <p className="mt-2 max-w-2xl text-xs leading-5 text-zinc-600">
                                        {isRejected
                                            ? 'Review your profile information and update anything that may be required before requesting verification again.'
                                            : 'Once your artist profile has been reviewed and verified, your portfolio tools will become available.'}
                                    </p>
                                </div>

                                <Link
                                    href="/dashboard/profile"
                                    className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/10 px-5 py-2.5 text-xs text-zinc-400 transition hover:border-white/20 hover:text-white"
                                >
                                    {isRejected
                                        ? 'Review Profile'
                                        : 'View Profile'}
                                    <ArrowRight />
                                </Link>
                            </div>
                        </div>
                    </GlassPanel>
                )}

                {/* =========================================================
                    STATS
                ========================================================= */}

                <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

                    {/* Projects */}
                    <GlassPanel>
                        <div className="p-6">
                            <p className="text-[9px] uppercase tracking-[0.25em] text-zinc-600">
                                Projects
                            </p>

                            <div className="mt-5 flex items-end justify-between gap-4">
                                <div>
                                    <span className="text-4xl font-light tracking-[-0.05em]">
                                        {projects.length}
                                    </span>

                                    <p className="mt-2 max-w-[180px] text-[10px] leading-4 text-zinc-600">
                                        Creative works currently in your studio.
                                    </p>
                                </div>

                                {isVerified && (
                                    <Link
                                        href="/dashboard/projects"
                                        className="mb-1 text-zinc-600 transition hover:text-white"
                                    >
                                        <ArrowUpRight />
                                    </Link>
                                )}
                            </div>
                        </div>
                    </GlassPanel>


                    {/* Verification */}
                    <GlassPanel>
                        <div className="p-6">
                            <p className="text-[9px] uppercase tracking-[0.25em] text-zinc-600">
                                Verification
                            </p>

                            <div className="mt-5 flex items-start gap-3">
                                <span
                                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${isVerified
                                        ? 'bg-[#35dfff] shadow-[0_0_14px_rgba(53,223,255,0.7)]'
                                        : isRejected
                                            ? 'bg-[#ff6b9d] shadow-[0_0_14px_rgba(255,107,157,0.5)]'
                                            : 'bg-[#a855f7] shadow-[0_0_14px_rgba(168,85,247,0.5)]'
                                        }`}
                                />

                                <div>
                                    <span className="text-lg font-light capitalize">
                                        {verificationStatus}
                                    </span>

                                    <p className="mt-2 max-w-[190px] text-[10px] leading-4 text-zinc-600">
                                        {isVerified
                                            ? 'Your artist identity has been verified.'
                                            : isRejected
                                                ? 'Your profile needs attention.'
                                                : 'Your artist profile is currently under review.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </GlassPanel>


                    {/* Portfolio */}
                    <GlassPanel>
                        <div className="p-6">
                            <p className="text-[9px] uppercase tracking-[0.25em] text-zinc-600">
                                Portfolio
                            </p>

                            <div className="mt-5 flex items-start gap-3">
                                <span
                                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${profile.is_published
                                        ? 'bg-[#35dfff] shadow-[0_0_14px_rgba(53,223,255,0.7)]'
                                        : 'bg-zinc-700'
                                        }`}
                                />

                                <div>
                                    <span className="text-lg font-light">
                                        {profile.is_published
                                            ? 'Published'
                                            : 'Not Published'}
                                    </span>

                                    <p className="mt-2 max-w-[190px] text-[10px] leading-4 text-zinc-600">
                                        {profile.is_published
                                            ? 'Your portfolio is currently visible to visitors.'
                                            : 'Your portfolio is not currently visible to visitors.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </GlassPanel>


                    {/* Portfolio Views */}
                    <GlassPanel>
                        <div className="p-6">
                            <p className="text-[9px] uppercase tracking-[0.25em] text-zinc-600">
                                Portfolio Views
                            </p>

                            <div className="mt-5 flex items-end justify-between gap-4">
                                <div>
                                    <span className="text-4xl font-light tracking-[-0.05em]">
                                        {profile.portfolio_views_count.toLocaleString()}
                                    </span>

                                    <p className="mt-2 max-w-[190px] text-[10px] leading-4 text-zinc-600">
                                        Total visits to your public portfolio.
                                    </p>
                                </div>

                                {isVerified && profile.is_published && (
                                    <Link
                                        href={`/@${profile.username}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mb-1 text-zinc-600 transition hover:text-white"
                                    >
                                        <ArrowUpRight />
                                    </Link>
                                )}
                            </div>
                        </div>
                    </GlassPanel>

                </div>

                {/* =========================================================
                    PORTFOLIO PREVIEW
                ========================================================= */}

                <div className="mt-14">
                    <GlassPanel className="overflow-hidden">
                        <div className="grid lg:grid-cols-[0.8fr_1.2fr]">

                            {/* Preview Information */}

                            <div className="relative flex flex-col justify-between overflow-hidden border-b border-white/[0.07] p-7 sm:p-9 lg:border-b-0 lg:border-r">
                                {/* Chrome reflection */}

                                <div className="pointer-events-none absolute right-0 top-0 h-px w-[70%] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)]" />

                                {/* Subtle glow */}

                                <div className="pointer-events-none absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-[#35dfff]/[0.025] blur-3xl" />

                                <div className="relative">
                                    <p className="text-[9px] uppercase tracking-[0.32em] text-zinc-600">
                                        Your Portfolio
                                    </p>

                                    <h2 className="mt-8 max-w-md text-3xl font-light leading-[1.05] tracking-[-0.045em] text-white sm:text-4xl">
                                        A glimpse of your
                                        <br />

                                        <span className="bg-[linear-gradient(100deg,#ffffff_0%,#aeb8bd_30%,#ffffff_48%,#77838a_68%,#ffffff_100%)] bg-clip-text text-transparent">
                                            world.
                                        </span>
                                    </h2>

                                    <p className="mt-5 max-w-md text-sm leading-6 text-zinc-600">
                                        This is how your public portfolio looks right now.
                                    </p>
                                </div>

                                <div className="relative mt-10">
                                    <Link
                                        href={`/@${profile.username}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group inline-flex h-11 items-center gap-3 rounded-full bg-white px-6 text-xs font-medium text-[#08090b] transition duration-300 hover:bg-zinc-200 hover:shadow-[0_10px_35px_rgba(255,255,255,0.08)]"
                                    >
                                        <span>
                                            View Portfolio
                                        </span>

                                        <ArrowUpRight className="transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                    </Link>
                                </div>
                            </div>

                            {/* Live Portfolio Preview */}

                            <div className="relative min-h-[280px] overflow-hidden bg-[#050607] sm:min-h-[360px] lg:min-h-[430px]">

                                {/* Browser-style top edge */}

                                <div className="absolute inset-x-0 top-0 z-30 flex h-8 items-center border-b border-white/[0.07] bg-[#08090a]/90 px-3 backdrop-blur-xl">
                                    <div className="flex items-center gap-1.5">
                                        <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                                        <span className="h-1.5 w-1.5 rounded-full bg-white/10" />
                                        <span className="h-1.5 w-1.5 rounded-full bg-white/10" />
                                    </div>

                                    <div className="mx-auto max-w-[55%] truncate text-[7px] tracking-[0.12em] text-zinc-700">
                                        lira.test/@{profile.username}
                                    </div>
                                </div>

                                {/* Static preview viewport */}

                                <div className="absolute inset-x-3 bottom-3 top-11 overflow-hidden rounded-lg border border-white/[0.08] bg-black shadow-[0_20px_60px_rgba(0,0,0,0.45)] sm:inset-x-5 sm:bottom-5 sm:top-12">
                                    <div className="absolute inset-0 overflow-hidden">

                                        <iframe
                                            src={`/@${profile.username}`}
                                            title={`${profile.display_name} portfolio preview`}
                                            scrolling="no"
                                            className="pointer-events-none absolute left-0 top-0 h-[250%] w-[250%] origin-top-left border-0 overflow-hidden"
                                            style={{
                                                transform: 'scale(0.4)',
                                            }}
                                        />

                                        {/* Preview overlay */}

                                        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.025),transparent_35%,rgba(255,255,255,0.015))]" />

                                        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/[0.04]" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </GlassPanel>
                </div>

                {/* =========================================================
                    RECENT WORK
                ========================================================= */}

                <div className="mt-14">
                    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">

                        {/* =====================================================
            RECENT PROJECTS
        ====================================================== */}

                        <section>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[9px] uppercase tracking-[0.3em] text-zinc-600">
                                        Selected Work
                                    </p>

                                    <h2 className="mt-2 text-2xl font-light tracking-[-0.04em] text-white">
                                        Recent Projects
                                    </h2>
                                </div>

                                {isVerified && projects.length > 0 && (
                                    <Link
                                        href="/dashboard/projects"
                                        className="group hidden items-center gap-2 text-xs text-zinc-500 transition hover:text-white sm:flex"
                                    >
                                        View All

                                        <ArrowRight className="h-3.5 w-3.5 transition duration-300 group-hover:translate-x-1" />
                                    </Link>
                                )}
                            </div>

                            <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

                                {/* =================================================
                    PROJECTS
                ================================================== */}

                                {projects.slice(0, 2).map((project) => (
                                    <GlassPanel
                                        key={project.id}
                                        className="group overflow-hidden"
                                    >
                                        {/* Thumbnail */}

                                        <div className="relative aspect-[4/3] overflow-hidden bg-[#0d0f11]">

                                            {project.thumbnail ? (
                                                <img
                                                    src={`/storage/${project.thumbnail}`}
                                                    alt={project.title}
                                                    className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 bg-[linear-gradient(135deg,#15191b_0%,#657178_28%,#f0f3f4_46%,#56636a_67%,#171a1c_100%)]">
                                                    <div className="absolute inset-0 bg-[linear-gradient(125deg,transparent_15%,rgba(45,225,255,0.14)_30%,rgba(130,90,255,0.11)_44%,rgba(255,75,190,0.1)_55%,transparent_78%)]" />
                                                </div>
                                            )}

                                            {/* Image overlay */}

                                            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_45%,rgba(0,0,0,0.72)_100%)]" />

                                            {/* Project type */}

                                            <div className="absolute bottom-4 left-4">
                                                <span className="text-[8px] uppercase tracking-[0.25em] text-white/60">
                                                    {project.project_type || 'Project'}
                                                </span>
                                            </div>

                                            {/* Visibility */}

                                            <div className="absolute right-4 top-4 flex items-center gap-2">
                                                <span
                                                    className={`h-1.5 w-1.5 rounded-full ${project.is_visible
                                                        ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]'
                                                        : 'bg-zinc-600'
                                                        }`}
                                                />

                                                <span
                                                    className={`text-[8px] uppercase tracking-[0.16em] ${project.is_visible
                                                        ? 'text-emerald-300/90'
                                                        : 'text-zinc-500'
                                                        }`}
                                                >
                                                    {project.is_visible
                                                        ? 'Visible'
                                                        : 'Hidden'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Project Information */}

                                        <div className="p-5">
                                            <h3 className="text-sm font-medium text-white">
                                                {project.title}
                                            </h3>

                                            {project.description && (
                                                <p className="mt-1 line-clamp-1 text-[11px] text-zinc-600">
                                                    {project.description}
                                                </p>
                                            )}

                                            {/* Actions */}

                                            <div className="mt-5 flex items-center gap-2">

                                                <Link
                                                    href={`/dashboard/projects/${project.id}/edit`}
                                                    className="inline-flex h-9 items-center rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 text-[10px] font-medium text-zinc-300 transition hover:border-white/[0.14] hover:bg-white/[0.05] hover:text-white"
                                                >
                                                    Edit
                                                </Link>

                                                {project.is_visible && (
                                                    <Link
                                                        href={`/@${profile.username}/project/${project.slug}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="group/view inline-flex h-9 items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 text-[10px] font-medium text-zinc-300 transition hover:border-white/[0.14] hover:bg-white/[0.05] hover:text-white"
                                                    >
                                                        View

                                                        <ArrowUpRight className="h-3 w-3 transition duration-300 group-hover/view:-translate-y-0.5 group-hover/view:translate-x-0.5" />
                                                    </Link>
                                                )}

                                                <Link
                                                    href={`/dashboard/projects/${project.id}/edit`}
                                                    aria-label={`Manage ${project.title}`}
                                                    className="ml-auto flex h-9 w-9 items-center justify-center rounded-xl text-zinc-600 transition hover:bg-white/[0.04] hover:text-white"
                                                >
                                                    <span className="flex gap-[3px]">
                                                        <span className="h-1 w-1 rounded-full bg-current" />
                                                        <span className="h-1 w-1 rounded-full bg-current" />
                                                        <span className="h-1 w-1 rounded-full bg-current" />
                                                    </span>
                                                </Link>
                                            </div>
                                        </div>
                                    </GlassPanel>
                                ))}

                                {/* =================================================
                    ADD PROJECT CARD
                ================================================== */}

                                {isVerified && (
                                    <Link
                                        href="/dashboard/projects/create"
                                        className="group relative flex min-h-[360px] flex-col items-center justify-center overflow-hidden rounded-[1rem] border border-dashed border-white/[0.12] bg-white/[0.008] transition duration-500 hover:border-white/[0.22] hover:bg-white/[0.018]"
                                    >
                                        {/* Chrome reflection */}

                                        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.16),transparent)] opacity-0 transition duration-500 group-hover:opacity-100" />

                                        {/* Ambient glow */}

                                        <div className="pointer-events-none absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#35dfff]/[0.025] blur-3xl transition duration-500 group-hover:bg-[#35dfff]/[0.05]" />

                                        {/* Plus */}

                                        <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.035] text-zinc-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition duration-500 group-hover:border-white/[0.16] group-hover:bg-white/[0.06] group-hover:text-white">
                                            <PlusIcon className="h-5 w-5" />
                                        </div>

                                        <h3 className="relative mt-6 text-sm font-medium text-white">
                                            Add New Project
                                        </h3>

                                        <p className="relative mt-2 max-w-[180px] text-center text-[11px] leading-5 text-zinc-600">
                                            Share your next creation
                                            with the world.
                                        </p>
                                    </Link>
                                )}

                                {/* =================================================
                    EMPTY STATE WHEN NOT VERIFIED
                ================================================== */}

                                {!isVerified && projects.length === 0 && (
                                    <GlassPanel className="md:col-span-2 lg:col-span-3">
                                        <div className="flex flex-col items-start justify-between gap-6 p-8 sm:flex-row sm:items-center">
                                            <div>
                                                <p className="text-sm text-white">
                                                    Your space is waiting for its first
                                                    project.
                                                </p>

                                                <p className="mt-2 text-xs leading-5 text-zinc-600">
                                                    Projects become available once your
                                                    artist profile has been verified.
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-2 text-xs text-zinc-700">
                                                <LockIcon />

                                                Available after verification
                                            </div>
                                        </div>
                                    </GlassPanel>
                                )}
                            </div>

                            {/* Mobile View All */}

                            {isVerified && projects.length > 0 && (
                                <Link
                                    href="/dashboard/projects"
                                    className="group mt-5 flex items-center justify-center gap-2 text-xs text-zinc-500 transition hover:text-white sm:hidden"
                                >
                                    View All

                                    <ArrowRight className="h-3.5 w-3.5 transition duration-300 group-hover:translate-x-1" />
                                </Link>
                            )}
                        </section>

                        {/* =====================================================
                            QUICK ACTIONS
                        ====================================================== */}

                        <aside className="space-y-5">

                            {/* Quick Actions */}

                            <GlassPanel className="overflow-hidden">
                                <div className="p-5">
                                    <h3 className="text-base font-medium text-white">
                                        Quick Actions
                                    </h3>

                                    <div className="mt-4 space-y-1">

                                        {/* Edit Profile */}

                                        <Link
                                            href="/dashboard/profile/edit"
                                            className="group flex items-center gap-4 rounded-2xl p-3 transition hover:bg-white/[0.035]"
                                        >
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.035] text-zinc-400 transition group-hover:border-white/[0.12] group-hover:text-white">
                                                <UserIcon className="h-5 w-5" />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium text-white">
                                                    Edit Profile
                                                </p>

                                                <p className="mt-0.5 text-[10px] text-zinc-600">
                                                    Update your artist information
                                                </p>
                                            </div>

                                            <ArrowRight className="h-4 w-4 shrink-0 text-zinc-600 transition group-hover:translate-x-1 group-hover:text-white" />
                                        </Link>

                                        {/* Manage Projects */}

                                        {isVerified ? (
                                            <Link
                                                href="/dashboard/projects"
                                                className="group flex items-center gap-4 rounded-2xl p-3 transition hover:bg-white/[0.035]"
                                            >
                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.035] text-zinc-400 transition group-hover:border-white/[0.12] group-hover:text-white">
                                                    <FolderIcon className="h-5 w-5" />
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-medium text-white">
                                                        Manage Projects
                                                    </p>

                                                    <p className="mt-0.5 text-[10px] text-zinc-600">
                                                        Add, edit, or organize your work
                                                    </p>
                                                </div>

                                                <ArrowRight className="h-4 w-4 shrink-0 text-zinc-600 transition group-hover:translate-x-1 group-hover:text-white" />
                                            </Link>
                                        ) : (
                                            <div className="flex items-center gap-4 rounded-2xl p-3 opacity-40">
                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.025] text-zinc-600">
                                                    <LockIcon className="h-4 w-4" />
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-medium text-zinc-500">
                                                        Manage Projects
                                                    </p>

                                                    <p className="mt-0.5 text-[10px] text-zinc-700">
                                                        Available after verification
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Customize Portfolio */}

                                        {isVerified ? (
                                            <Link
                                                href="/dashboard/portfolio/settings"
                                                className="group flex items-center gap-4 rounded-2xl p-3 transition hover:bg-white/[0.035]"
                                            >
                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.035] text-zinc-400 transition group-hover:border-white/[0.12] group-hover:text-white">
                                                    <span className="text-sm">
                                                        ✦
                                                    </span>
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-medium text-white">
                                                        Customize Portfolio
                                                    </p>

                                                    <p className="mt-0.5 text-[10px] text-zinc-600">
                                                        Change your visual style
                                                    </p>
                                                </div>

                                                <ArrowRight className="h-4 w-4 shrink-0 text-zinc-600 transition group-hover:translate-x-1 group-hover:text-white" />
                                            </Link>
                                        ) : (
                                            <div className="flex items-center gap-4 rounded-2xl p-3 opacity-40">
                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.025] text-zinc-600">
                                                    <LockIcon className="h-4 w-4" />
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-medium text-zinc-500">
                                                        Customize Portfolio
                                                    </p>

                                                    <p className="mt-0.5 text-[10px] text-zinc-700">
                                                        Available after verification
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Public Portfolio */}

                                        {isVerified ? (
                                            <Link
                                                href={`/@${profile.username}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group flex items-center gap-4 rounded-2xl p-3 transition hover:bg-white/[0.035]"
                                            >
                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.035] text-zinc-400 transition group-hover:border-white/[0.12] group-hover:text-white">
                                                    <GlobeIcon className="h-5 w-5" />
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-medium text-white">
                                                        View Public Portfolio
                                                    </p>

                                                    <p className="mt-0.5 text-[10px] text-zinc-600">
                                                        See how it looks to the world
                                                    </p>
                                                </div>

                                                <ArrowUpRight className="h-4 w-4 shrink-0 text-zinc-600 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
                                            </Link>
                                        ) : (
                                            <div className="flex items-center gap-4 rounded-2xl p-3 opacity-40">
                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.025] text-zinc-600">
                                                    <LockIcon className="h-4 w-4" />
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-medium text-zinc-500">
                                                        View Public Portfolio
                                                    </p>

                                                    <p className="mt-0.5 text-[10px] text-zinc-700">
                                                        Available after verification
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </GlassPanel>

                            {/* Account */}

                            <GlassPanel className="overflow-hidden">
                                <div className="p-5">
                                    <h3 className="text-base font-medium text-white">
                                        Account
                                    </h3>

                                    <div className="mt-5 flex items-center gap-4">
                                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-[linear-gradient(135deg,#d9e0e3,#68747a,#f4f7f8)] text-sm font-medium text-[#17191b] shadow-[0_0_25px_rgba(255,255,255,0.08)]">
                                            {profile.display_name
                                                ?.charAt(0)
                                                .toUpperCase()}
                                        </div>

                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium text-white">
                                                @{profile.username}
                                            </p>

                                            <p className="mt-1 truncate text-[10px] text-zinc-600">
                                                {profile.artist_type || 'Artist'}
                                                {profile.location
                                                    ? ` · ${profile.location}`
                                                    : ''}
                                            </p>
                                        </div>
                                    </div>

                                    <Link
                                        href="/dashboard/profile"
                                        className="group mt-5 flex h-10 items-center justify-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.015] text-[10px] font-medium text-zinc-400 transition hover:border-white/[0.15] hover:bg-white/[0.04] hover:text-white"
                                    >
                                        View Profile

                                        <ArrowRight className="h-3.5 w-3.5 transition duration-300 group-hover:translate-x-1" />
                                    </Link>
                                </div>
                            </GlassPanel>
                        </aside>
                    </div>
                </div>

                {/* =========================================================
                    PORTFOLIO ACTION
                ========================================================== */}

                {isVerified && (
                    <GlassPanel className="mt-14">
                        <div className="relative overflow-hidden p-8 sm:p-10">
                            {/* Chrome reflection */}
                            <div className="pointer-events-none absolute right-0 top-0 h-px w-[55%] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)]" />

                            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                    <p className="text-[9px] uppercase tracking-[0.3em] text-zinc-600">
                                        Your Space
                                    </p>

                                    <h2 className="mt-3 text-2xl font-light tracking-[-0.04em]">
                                        Shape your portfolio.
                                    </h2>

                                    <p className="mt-3 max-w-xl text-xs leading-5 text-zinc-600">
                                        Customize the visual identity of your
                                        portfolio and make it feel
                                        unmistakably yours.
                                    </p>
                                </div>

                                <Link
                                    href="/dashboard/portfolio/settings"
                                    className="inline-flex shrink-0 items-center gap-3 rounded-full border border-white/10 px-6 py-3 text-xs text-zinc-400 transition hover:border-white/20 hover:text-white"
                                >
                                    Customize Portfolio
                                    <ArrowRight />
                                </Link>
                            </div>
                        </div>
                    </GlassPanel>
                )}
            </div>
        </DashboardLayout>
    );
}
