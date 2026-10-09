import { Head, Link } from '@inertiajs/react';
import type { ReactNode } from 'react';

import AdminLayout from '../../Components/Dashboard/AdminLayout';

import {
    ArrowRight,
    ArrowUpRight,
    CheckIcon,
    UserIcon,
} from '../../Components/Icons';

interface Stats {
    totalArtists: number;
    pendingVerification: number;
    verifiedArtists: number;
    rejectedArtists: number;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface RecentVerification {
    id: number;
    user_id: number;
    username: string;
    display_name: string;
    artist_type: string | null;
    location: string | null;
    verification_status: string;
    updated_at: string;
    user: User;
}

interface Props {
    stats: Stats;
    recentVerifications: RecentVerification[];
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
            <div className="pointer-events-none absolute inset-0 rounded-[1.5rem] border border-white/[0.025]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)]" />
            <div className="relative">{children}</div>
        </div>
    );
}

function SectionHeading({
    eyebrow,
    title,
    action,
}: {
    eyebrow: string;
    title: string;
    action?: ReactNode;
}) {
    return (
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <p className="text-[9px] uppercase tracking-[0.3em] text-zinc-600">
                    {eyebrow}
                </p>
                <h2 className="mt-2 text-xl font-light tracking-[-0.04em] text-white sm:text-2xl">
                    {title}
                </h2>
            </div>
            {action}
        </div>
    );
}

function StatCard({
    label,
    value,
    description,
    icon,
    href,
    accent = 'neutral',
}: {
    label: string;
    value: number;
    description: string;
    icon: ReactNode;
    href: string;
    accent?: 'neutral' | 'cyan' | 'violet' | 'pink';
}) {
    const accentStyles = {
        neutral: 'text-zinc-300 bg-white/[0.04] border-white/[0.08]',
        cyan: 'text-[#72e9ff] bg-cyan-300/[0.05] border-cyan-200/[0.10]',
        violet: 'text-violet-300 bg-violet-300/[0.05] border-violet-200/[0.10]',
        pink: 'text-pink-300 bg-pink-300/[0.05] border-pink-200/[0.10]',
    };

    return (
        <Link
            href={href}
            className="group block rounded-[1.35rem] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/60"
        >
            <GlassPanel className="h-full transition duration-300 group-hover:border-white/[0.16] group-hover:bg-white/[0.035]">
                <div className="p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-3">
                        <p className="text-[9px] uppercase tracking-[0.22em] text-zinc-500">
                            {label}
                        </p>
                        <span
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${accentStyles[accent]}`}
                        >
                            {icon}
                        </span>
                    </div>
                    <div className="mt-5 flex items-end justify-between gap-3">
                        <div>
                            <p className="text-3xl font-light tracking-[-0.05em] text-white sm:text-4xl">
                                {value.toLocaleString()}
                            </p>
                            <p className="mt-2 text-[10px] leading-4 text-zinc-600">
                                {description}
                            </p>
                        </div>
                        <ArrowUpRight className="mb-1 h-4 w-4 shrink-0 text-zinc-700 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
                    </div>
                </div>
            </GlassPanel>
        </Link>
    );
}

function VerificationStatus({ status }: { status: string }) {
    const normalizedStatus = status.toLowerCase();
    const isVerified = normalizedStatus === 'verified';
    const isRejected = normalizedStatus === 'rejected';

    return (
        <span className="inline-flex items-center gap-2">
            <span
                className={`h-1.5 w-1.5 rounded-full ${
                    isVerified
                        ? 'bg-[#35dfff] shadow-[0_0_8px_rgba(53,223,255,0.7)]'
                        : isRejected
                          ? 'bg-[#ff6b9d] shadow-[0_0_8px_rgba(255,107,157,0.5)]'
                          : 'bg-[#a855f7] shadow-[0_0_8px_rgba(168,85,247,0.5)]'
                }`}
            />
            <span
                className={`text-[8px] uppercase tracking-[0.18em] ${
                    isVerified
                        ? 'text-[#72e9ff]'
                        : isRejected
                          ? 'text-[#ff9cbb]'
                          : 'text-violet-300'
                }`}
            >
                {normalizedStatus}
            </span>
        </span>
    );
}

function QuickAction({
    href,
    title,
    description,
    icon,
}: {
    href: string;
    title: string;
    description: string;
    icon: ReactNode;
}) {
    return (
        <Link
            href={href}
            className="group flex items-center gap-4 rounded-xl border border-white/[0.07] bg-white/[0.015] p-4 transition duration-300 hover:border-white/[0.14] hover:bg-white/[0.04] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/60"
        >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.035] text-zinc-400 transition group-hover:text-white">
                {icon}
            </span>
            <span className="min-w-0 flex-1">
                <span className="block text-xs font-medium text-zinc-200">
                    {title}
                </span>
                <span className="mt-1 block text-[10px] leading-4 text-zinc-600">
                    {description}
                </span>
            </span>
            <ArrowUpRight className="h-4 w-4 shrink-0 text-zinc-700 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
        </Link>
    );
}

export default function Dashboard({
    stats,
    recentVerifications,
}: Props) {
    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />

            <div className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
                {/* Page heading */}
                <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
                    <div>
                        <div className="mb-5 flex items-center gap-3">
                            <span className="h-px w-8 bg-[linear-gradient(90deg,#ffffff,#7d8991,transparent)]" />
                            <span className="text-[9px] uppercase tracking-[0.35em] text-zinc-600">
                                LIRA / ADMIN
                            </span>
                        </div>
                        <h1 className="text-4xl font-light tracking-[-0.055em] text-white sm:text-5xl">
                            Platform
                            <br />
                            <span className="bg-[linear-gradient(90deg,#fff_0%,#bdefff_24%,#9d8cff_58%,#f08bd7_82%,#fff_100%)] bg-clip-text text-transparent">
                                overview.
                            </span>
                        </h1>
                        <p className="mt-5 max-w-2xl text-sm leading-6 text-zinc-500">
                            Monitor artist accounts and verification activity,
                            and jump directly to the administrative tasks that
                            need attention.
                        </p>
                    </div>

                </div>

                {/* Platform metrics */}
                <section className="mt-10 sm:mt-12">
                    <SectionHeading
                        eyebrow="Platform metrics"
                        title="Artist accounts"
                        action={
                            <Link
                                href="/dashboard/admin/artists"
                                className="group inline-flex items-center gap-2 text-xs text-zinc-500 transition hover:text-white"
                            >
                                Manage artists
                                <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                            </Link>
                        }
                    />

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <StatCard
                            label="Total artists"
                            value={stats.totalArtists}
                            description="All registered artist profiles"
                            href="/dashboard/admin/artists"
                            icon={<UserIcon className="h-4 w-4" />}
                        />
                        <StatCard
                            label="Pending review"
                            value={stats.pendingVerification}
                            description="Requests awaiting a decision"
                            href="/dashboard/admin/verifications"
                            icon={
                                <span className="h-2 w-2 rounded-full bg-violet-300 shadow-[0_0_10px_rgba(168,85,247,0.6)]" />
                            }
                            accent="violet"
                        />
                        <StatCard
                            label="Verified"
                            value={stats.verifiedArtists}
                            description="Profiles approved for verification"
                            href="/dashboard/admin/artists?status=verified"
                            icon={<CheckIcon className="h-4 w-4" />}
                            accent="cyan"
                        />
                        <StatCard
                            label="Rejected"
                            value={stats.rejectedArtists}
                            description="Profiles declined during review"
                            href="/dashboard/admin/artists?status=rejected"
                            icon={
                                <span className="h-2 w-2 rounded-full bg-pink-300 shadow-[0_0_10px_rgba(255,107,157,0.6)]" />
                            }
                            accent="pink"
                        />
                    </div>
                    <p className="mt-3 text-[10px] leading-5 text-zinc-700">
                        Artist directory links are ready for the planned
                        directory page and filters.
                    </p>
                </section>

                {/* Operational shortcuts */}
                <section className="mt-12 lg:mt-14">
                    <SectionHeading
                        eyebrow="Operations"
                        title="Quick actions"
                    />

                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                        <QuickAction
                            href="/dashboard/admin/verifications"
                            title="Review verification queue"
                            description={`${stats.pendingVerification.toLocaleString()} request${stats.pendingVerification === 1 ? '' : 's'} currently pending`}
                            icon={<CheckIcon className="h-4 w-4" />}
                        />
                        <QuickAction
                            href="/dashboard/admin/artists"
                            title="Browse artist accounts"
                            description="Find profiles and manage account records"
                            icon={<UserIcon className="h-4 w-4" />}
                        />
                        <QuickAction
                            href="/dashboard/admin/artists?status=verified"
                            title="View verified artists"
                            description="Open the artist directory with the verified filter"
                            icon={<CheckIcon className="h-4 w-4" />}
                        />
                    </div>
                </section>

                {/* Recent verification requests */}
                <section className="mt-12 lg:mt-14">
                    <SectionHeading
                        eyebrow="Needs attention"
                        title="Recent verification requests"
                        action={
                            <Link
                                href="/dashboard/admin/verifications"
                                className="group inline-flex items-center gap-2 text-xs text-zinc-500 transition hover:text-white"
                            >
                                View queue
                                <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                            </Link>
                        }
                    />

                    <GlassPanel>
                        {recentVerifications.length > 0 ? (
                            <>
                                <div className="hidden grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,0.8fr)_auto] gap-4 border-b border-white/[0.07] px-6 py-3 md:grid">
                                    {['Artist', 'Account owner', 'Status', ''].map(
                                        (heading) => (
                                            <span
                                                key={heading || 'action'}
                                                className="text-[8px] uppercase tracking-[0.2em] text-zinc-600"
                                            >
                                                {heading}
                                            </span>
                                        ),
                                    )}
                                </div>
                                <div className="divide-y divide-white/[0.06]">
                                    {recentVerifications.map((profile) => (
                                        <div
                                            key={profile.id}
                                            className="grid gap-4 p-4 transition hover:bg-white/[0.018] sm:p-5 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,0.8fr)_auto] md:items-center md:gap-4 md:px-6"
                                        >
                                            <div className="flex min-w-0 items-center gap-3">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.025] text-sm text-zinc-400">
                                                    {profile.display_name
                                                        ?.charAt(0)
                                                        .toUpperCase() || '?'}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="truncate text-xs font-medium text-zinc-200">
                                                        {profile.display_name}
                                                    </p>
                                                    <p className="mt-1 truncate text-[10px] text-zinc-600">
                                                        @{profile.username}
                                                        {profile.artist_type
                                                            ? ` · ${profile.artist_type}`
                                                            : ''}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="min-w-0">
                                                <p className="truncate text-xs text-zinc-400">
                                                    {profile.user?.name ||
                                                        'Unknown user'}
                                                </p>
                                                <p className="mt-1 truncate text-[10px] text-zinc-700">
                                                    {profile.user?.email ||
                                                        'No email available'}
                                                </p>
                                            </div>

                                            <div>
                                                <VerificationStatus
                                                    status={
                                                        profile.verification_status
                                                    }
                                                />
                                                {profile.location && (
                                                    <p className="mt-1 truncate text-[10px] text-zinc-700">
                                                        {profile.location}
                                                    </p>
                                                )}
                                            </div>

                                            <Link
                                                href="/dashboard/admin/verifications"
                                                className="inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border border-white/[0.08] px-3 text-[10px] text-zinc-400 transition hover:border-white/[0.16] hover:bg-white/[0.04] hover:text-white"
                                            >
                                                Review
                                                <ArrowUpRight className="h-3.5 w-3.5" />
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
                                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.025] text-cyan-100/60">
                                    <CheckIcon className="h-5 w-5" />
                                </div>
                                <p className="mt-4 text-sm text-zinc-200">
                                    Verification queue is clear
                                </p>
                                <p className="mt-2 max-w-sm text-[11px] leading-5 text-zinc-600">
                                    There are no pending requests in the current
                                    queue. Newly submitted requests will appear
                                    here.
                                </p>
                            </div>
                        )}
                    </GlassPanel>
                </section>

                <div className="mt-8 flex flex-col gap-3 border-t border-white/[0.06] pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-[10px] leading-5 text-zinc-700">
                        Dashboard metrics reflect the data supplied by the
                        server.
                    </p>
                    <Link
                        href="/dashboard/admin/verifications"
                        className="group inline-flex items-center gap-2 text-[10px] text-zinc-500 transition hover:text-white"
                    >
                        Open verification queue
                        <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                    </Link>
                </div>
            </div>
        </AdminLayout>
    );
}
