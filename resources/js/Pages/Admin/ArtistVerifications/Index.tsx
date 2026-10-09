import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Components/Dashboard/AdminLayout';
import ConfirmModal from '../../../Components/UI/ConfirmModal';
import AvatarImage from '../../../Components/Portfolio/AvatarImage';

import {
    ArrowLeft,
    ArrowRight,
    ArrowUpRight,
    Check,
    CheckCircle2,
    ChevronDown,
    MapPin,
    Search,
    User,
    X,
} from 'lucide-react';

import { useEffect, useState } from 'react';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedProfiles {
    data: ArtistProfile[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: PaginationLink[];
}

interface ArtistProfile {
    id: number;
    username: string;
    display_name: string;
    bio: string | null;
    artist_type: string | null;
    location: string | null;
    avatar: string | null;
    avatar_zoom: number | null;
    avatar_position_x: number | null;
    avatar_position_y: number | null;
    spotify_artist_url: string | null;
    apple_music_artist_url: string | null;
    verification_status: string;
    social_links?: {
        id: number;
        platform: string;
        url: string;
        is_visible: boolean;
    }[];
    user: {
        id: number;
        name: string;
        email: string;
    };
}

interface Props {
    profiles: PaginatedProfiles;
    filters: {
        search: string;
        artist_type: string;
        per_page: number;
    };
    pendingCount: number;
    artistTypes: string[];
}

function GlassPanel({
    children,
    className = '',
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={`overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] backdrop-blur-xl ${className}`}>
            {children}
        </div>
    );
}

function DetailItem({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="min-w-0">
            <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-600">
                {label}
            </p>
            <p className="mt-1.5 break-words text-sm leading-5 text-zinc-300">
                {value}
            </p>
        </div>
    );
}

function getStatusStyle(status: string) {
    switch (status.toLowerCase()) {
        case 'verified':
            return {
                label: 'Verified',
                dot: 'bg-emerald-400',
                text: 'text-emerald-300',
                badge: 'border-emerald-400/15 bg-emerald-400/[0.06]',
            };
        case 'rejected':
            return {
                label: 'Rejected',
                dot: 'bg-rose-400',
                text: 'text-rose-300',
                badge: 'border-rose-400/15 bg-rose-400/[0.06]',
            };
        default:
            return {
                label: 'Pending',
                dot: 'bg-purple-400',
                text: 'text-purple-300',
                badge: 'border-purple-400/15 bg-purple-400/[0.06]',
            };
    }
}

function getImageUrl(path: string | null): string | null {
    if (!path) {
        return null;
    }

    if (
        path.startsWith('http://') ||
        path.startsWith('https://') ||
        path.startsWith('blob:') ||
        path.startsWith('data:')
    ) {
        return path;
    }

    if (path.startsWith('/storage/')) {
        return path;
    }

    if (path.startsWith('storage/')) {
        return `/${path}`;
    }

    if (path.startsWith('/')) {
        return path;
    }

    return `/storage/${path}`;
}


function getVisiblePages(
    currentPage: number,
    lastPage: number,
): (number | 'ellipsis')[] {
    if (lastPage <= 5) {
        return Array.from({ length: lastPage }, (_, index) => index + 1);
    }

    if (currentPage <= 3) {
        return [1, 2, 3, 'ellipsis', lastPage];
    }

    if (currentPage >= lastPage - 2) {
        return [1, 'ellipsis', lastPage - 2, lastPage - 1, lastPage];
    }

    return [1, 'ellipsis', currentPage, 'ellipsis', lastPage];
}



export default function Index({
    profiles,
    filters,
    pendingCount,
    artistTypes,
}: Props) {
    const [search, setSearch] = useState(filters.search);
    const [typeFilter, setTypeFilter] = useState(filters.artist_type);
    const [expandedProfiles, setExpandedProfiles] = useState<number[]>([]);

    const [confirmation, setConfirmation] = useState<{
        profile: ArtistProfile;
        action: 'verify' | 'reject';
    } | null>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [rejectionError, setRejectionError] = useState('');

    useEffect(() => {
        setSearch(filters.search);
        setTypeFilter(filters.artist_type);
    }, [filters.search, filters.artist_type]);

    const applyFilters = (
        nextSearch = search,
        nextType = typeFilter,
        nextPerPage = filters.per_page,
    ) => {
        router.get(
            '/dashboard/admin/verifications',
            {
                search: nextSearch.trim() || undefined,
                artist_type: nextType === 'all' ? undefined : nextType,
                per_page: nextPerPage,
            },
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            },
        );
    };

    const toggleExpanded = (profileId: number) => {
        setExpandedProfiles((current) =>
            current.includes(profileId)
                ? current.filter((id) => id !== profileId)
                : [...current, profileId],
        );
    };

    const verifyArtist = (profile: ArtistProfile) => {
        setConfirmation({ profile, action: 'verify' });
    };

    const rejectArtist = (profile: ArtistProfile) => {
        setRejectionReason('');
        setRejectionError('');
        setConfirmation({ profile, action: 'reject' });
    };

    const closeConfirmation = () => {
        if (isSubmitting) return;

        setConfirmation(null);
        setRejectionReason('');
        setRejectionError('');
    };

    const confirmAction = () => {
        if (!confirmation || isSubmitting) return;

        const { profile, action } = confirmation;

        if (action === 'reject') {
            const reason = rejectionReason.trim();

            if (reason.length < 10) {
                setRejectionError(
                    'Please provide a reason with at least 10 characters.',
                );
                return;
            }

            if (reason.length > 2000) {
                setRejectionError(
                    'The rejection reason cannot exceed 2,000 characters.',
                );
                return;
            }
        }

        setIsSubmitting(true);

        router.post(
            `/dashboard/admin/verifications/${profile.id}/${action}`,
            action === 'reject'
                ? { rejection_reason: rejectionReason.trim() }
                : {},
            {
                preserveScroll: true,
                onError: (errors) => {
                    if (action === 'reject' && errors.rejection_reason) {
                        setRejectionError(errors.rejection_reason);
                    }
                },
                onSuccess: () => {
                    setConfirmation(null);
                    setRejectionReason('');
                    setRejectionError('');
                },
                onFinish: () => {
                    setIsSubmitting(false);
                },
            },
        );
    };


    return (
        <AdminLayout>
            <Head title="Artist Verifications" />

            <div className="mx-auto max-w-[1400px] px-6 py-10 text-white sm:px-8 lg:px-12 lg:py-12">
                {/* Page header */}
                <div className="mb-9 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                    <div className="min-w-0">
                        <div className="mb-5 flex items-center gap-3">
                            <span className="h-px w-8 bg-gradient-to-r from-white to-transparent" />
                            <span className="text-[9px] uppercase tracking-[0.3em] text-zinc-600">
                                LIRA / ADMIN / VERIFICATION
                            </span>
                        </div>

                        <h1 className="text-4xl font-light tracking-[-0.055em] text-white sm:text-5xl">
                            Artist{' '}
                            <span className="bg-gradient-to-r from-white via-[#bdefff] to-[#b79aff] bg-clip-text text-transparent">
                                verifications.
                            </span>
                        </h1>

                        <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-500">
                            Review submitted artist profiles, inspect their
                            information, and manage verification requests.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Link
                            href="/dashboard/admin"
                            className="inline-flex items-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.035] px-4 py-3 text-xs text-zinc-300 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
                        >
                            <ArrowLeft className="h-3.5 w-3.5" />
                            <span>Admin Dashboard</span>
                        </Link>

                        <div className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-purple-400/15 bg-purple-400/[0.06]">
                                <User className="h-4 w-4 text-purple-300" />
                            </div>
                            <div>
                                <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-600">
                                    Pending queue
                                </p>
                                <p className="mt-0.5 text-lg font-light text-white">
                                    {pendingCount}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Queue summary */}
                <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                        <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-600">
                            Total requests
                        </p>
                        <p className="mt-2 text-2xl font-light text-white">
                            {pendingCount}
                        </p>
                    </div>

                    <div className="rounded-xl border border-purple-400/10 bg-purple-400/[0.025] p-4">
                        <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-600">
                            Matching results
                        </p>
                        <p className="mt-2 text-2xl font-light text-white">
                            {profiles.total}
                        </p>
                    </div>

                    <div className="col-span-2 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 sm:col-span-1">
                        <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-600">
                            Artist categories
                        </p>
                        <p className="mt-2 text-2xl font-light text-white">
                            {artistTypes.length}
                        </p>
                    </div>
                </div>


                {/* Search and filters */}
                <GlassPanel className="mb-6">
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            applyFilters();
                        }}
                        className="grid gap-3 p-4 md:grid-cols-[minmax(0,1fr)_220px_120px] md:p-5"
                    >
                        <div className="relative">
                            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />

                            <input
                                type="search"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search artist, username, email, or location..."
                                aria-label="Search artist verification requests"
                                className="h-12 w-full rounded-xl border border-white/[0.07] bg-black/20 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-white/20 focus:bg-white/[0.025]"
                            />
                        </div>

                        <div className="relative">
                            <select
                                value={typeFilter}
                                onChange={(event) => {
                                    const nextType = event.target.value;
                                    setTypeFilter(nextType);
                                    applyFilters(search, nextType);
                                }}
                                aria-label="Filter by artist type"
                                className="h-12 w-full appearance-none rounded-xl border border-white/[0.07] bg-[#101012] px-4 pr-10 text-sm text-zinc-300 outline-none transition focus:border-white/20"
                            >
                                <option value="all">All artist types</option>

                                {artistTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>

                            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
                        </div>

                        <div className="relative">
                            <select
                                value={filters.per_page}
                                onChange={(event) =>
                                    applyFilters(
                                        search,
                                        typeFilter,
                                        Number(event.target.value),
                                    )
                                }
                                aria-label="Artists per page"
                                className="h-12 w-full appearance-none rounded-xl border border-white/[0.07] bg-[#101012] px-3 pr-9 text-sm text-zinc-300 outline-none transition focus:border-white/20"
                            >
                                <option value={10}>10 / page</option>
                                <option value={25}>25 / page</option>
                                <option value={50}>50 / page</option>
                            </select>

                            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
                        </div>

                        <div className="flex flex-wrap gap-2 md:col-span-3">
                            <button
                                type="submit"
                                className="rounded-lg border border-cyan-300/20 bg-cyan-300/[0.06] px-4 py-2.5 text-xs text-cyan-200 transition hover:bg-cyan-300/[0.12]"
                            >
                                Search artists
                            </button>

                            {(search.trim() !== '' || typeFilter !== 'all') && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearch('');
                                        setTypeFilter('all');
                                        applyFilters('', 'all');
                                    }}
                                    className="rounded-lg border border-white/10 px-4 py-2.5 text-xs text-zinc-300 transition hover:bg-white/[0.05] hover:text-white"
                                >
                                    Clear filters
                                </button>
                            )}
                        </div>
                    </form>
                </GlassPanel>


                {/* Artist queue */}
                {pendingCount === 0 ? (
                    <GlassPanel>
                        <div className="flex flex-col items-center px-6 py-20 text-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-emerald-400/15 bg-emerald-400/[0.05]">
                                <CheckCircle2 className="h-6 w-6 text-emerald-300" />
                            </div>
                            <h2 className="mt-5 text-lg font-light text-white">
                                All caught up.
                            </h2>
                            <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500">
                                There are no pending artist verification
                                requests at the moment.
                            </p>
                        </div>
                    </GlassPanel>
                ) : profiles.total === 0 ? (
                    <GlassPanel>
                        <div className="flex flex-col items-center px-6 py-16 text-center">
                            <Search className="h-6 w-6 text-zinc-600" />
                            <h2 className="mt-4 text-base font-light text-white">
                                No matching artists
                            </h2>
                            <p className="mt-2 text-sm text-zinc-500">
                                Try another search term or artist category.
                            </p>
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch('');
                                    setTypeFilter('all');
                                    applyFilters('', 'all');
                                }}
                                className="mt-5 rounded-lg border border-white/10 px-4 py-2 text-xs text-zinc-300 transition hover:bg-white/[0.05] hover:text-white"
                            >
                                Clear filters
                            </button>
                        </div>
                    </GlassPanel>
                ) : (
                    <div>
                        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                            <div>
                                <p className="text-[9px] uppercase tracking-[0.25em] text-zinc-600">
                                    Verification queue
                                </p>
                                <h2 className="mt-1.5 text-xl font-light tracking-tight text-white">
                                    Submitted artists
                                </h2>
                            </div>

                            <p className="text-xs text-zinc-600">
                                Showing{' '}
                                <span className="text-zinc-300">
                                    {profiles.from ?? 0}–{profiles.to ?? 0}
                                </span>{' '}
                                of {profiles.total} matching artists
                            </p>
                        </div>

                        <div className="space-y-3">
                            {profiles.data.map((profile) => {
                                const status = getStatusStyle(
                                    profile.verification_status,
                                );
                                const expanded = expandedProfiles.includes(
                                    profile.id,
                                );

                                return (
                                    <GlassPanel
                                        key={profile.id}
                                        className="transition-colors duration-200 hover:border-white/[0.12]"
                                    >
                                        {/* Compact artist row */}
                                        <div className="p-4 sm:p-5">
                                            <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
                                                <div className="flex min-w-0 flex-1 items-start gap-3">
                                                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.035]">
                                                        {getImageUrl(profile.avatar) ? (
                                                            <div className="absolute inset-0 h-full w-full overflow-hidden">
                                                                <AvatarImage
                                                                    src={getImageUrl(profile.avatar)!}
                                                                    alt={profile.display_name}
                                                                    className="absolute inset-0 h-full w-full object-cover"
                                                                    zoom={Number(profile.avatar_zoom ?? 1)}
                                                                    positionX={Number(profile.avatar_position_x ?? 50)}
                                                                    positionY={Number(profile.avatar_position_y ?? 50)}
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center text-sm text-zinc-300">
                                                                {profile.display_name.trim().charAt(0).toUpperCase() || (
                                                                    <User className="h-4 w-4" />
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <h3 className="break-words text-sm font-medium text-white">
                                                                {profile.display_name}
                                                            </h3>

                                                            <span
                                                                className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[8px] uppercase tracking-[0.12em] ${status.badge} ${status.text}`}
                                                            >
                                                                <span
                                                                    className={`h-1.5 w-1.5 rounded-full ${status.dot}`}
                                                                />
                                                                {status.label}
                                                            </span>
                                                        </div>

                                                        <p className="mt-1 break-all text-xs text-zinc-500">
                                                            @{profile.username}
                                                        </p>

                                                        <p className="mt-2 break-words text-xs text-zinc-600">
                                                            {profile.user.name}
                                                            <span className="mx-2 text-zinc-800">
                                                                ·
                                                            </span>
                                                            {profile.user.email}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 xl:w-[300px] xl:shrink-0">
                                                    <div className="min-w-0">
                                                        <p className="text-[9px] uppercase tracking-[0.17em] text-zinc-600">
                                                            Artist type
                                                        </p>
                                                        <p className="mt-1.5 break-words text-xs text-zinc-300">
                                                            {profile.artist_type ||
                                                                'Not provided'}
                                                        </p>
                                                    </div>

                                                    <div className="min-w-0">
                                                        <p className="text-[9px] uppercase tracking-[0.17em] text-zinc-600">
                                                            Location
                                                        </p>
                                                        <p className="mt-1.5 flex items-start gap-1.5 break-words text-xs text-zinc-400">
                                                            <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-zinc-600" />
                                                            <span>
                                                                {profile.location ||
                                                                    'Not provided'}
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-2 border-t border-white/[0.06] pt-3 xl:w-[270px] xl:shrink-0 xl:justify-end xl:border-0 xl:pt-0">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            toggleExpanded(
                                                                profile.id,
                                                            )
                                                        }
                                                        aria-expanded={expanded}
                                                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] px-3 py-2 text-xs text-zinc-400 transition hover:bg-white/[0.05] hover:text-white"
                                                    >
                                                        Details
                                                        <ChevronDown
                                                            className={`h-3.5 w-3.5 transition-transform ${expanded
                                                                ? 'rotate-180'
                                                                : ''
                                                                }`}
                                                        />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            rejectArtist(profile)
                                                        }
                                                        className="inline-flex items-center gap-1.5 rounded-lg border border-rose-400/15 px-3 py-2 text-xs text-rose-300/80 transition hover:border-rose-400/30 hover:bg-rose-400/[0.06] hover:text-rose-200"
                                                    >
                                                        <X className="h-3.5 w-3.5" />
                                                        Reject
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            verifyArtist(profile)
                                                        }
                                                        className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-300/20 bg-cyan-300/[0.06] px-3 py-2 text-xs text-cyan-200 transition hover:border-cyan-300/35 hover:bg-cyan-300/[0.12]"
                                                    >
                                                        <Check className="h-3.5 w-3.5" />
                                                        Verify
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Expandable details */}
                                        {expanded && (
                                            <div className="border-t border-white/[0.07] bg-black/10 p-4 sm:p-6">
                                                <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_280px]">
                                                    <div className="min-w-0 space-y-7">
                                                        <div>
                                                            <p className="mb-4 text-[9px] uppercase tracking-[0.22em] text-zinc-600">
                                                                Artist information
                                                            </p>

                                                            <div className="grid gap-5 sm:grid-cols-2">
                                                                <DetailItem
                                                                    label="Display name"
                                                                    value={
                                                                        profile.display_name
                                                                    }
                                                                />
                                                                <DetailItem
                                                                    label="Username"
                                                                    value={`@${profile.username}`}
                                                                />
                                                                <DetailItem
                                                                    label="Artist type"
                                                                    value={
                                                                        profile.artist_type ||
                                                                        'Not provided'
                                                                    }
                                                                />
                                                                <DetailItem
                                                                    label="Location"
                                                                    value={
                                                                        profile.location ||
                                                                        'Not provided'
                                                                    }
                                                                />
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <p className="mb-3 text-[9px] uppercase tracking-[0.22em] text-zinc-600">
                                                                Artist bio
                                                            </p>
                                                            <p className="whitespace-pre-line break-words text-sm leading-6 text-zinc-400">
                                                                {profile.bio ||
                                                                    'No artist bio provided.'}
                                                            </p>
                                                        </div>

                                                        <div>
                                                            <p className="mb-4 text-[9px] uppercase tracking-[0.22em] text-zinc-600">
                                                                Account owner
                                                            </p>
                                                            <div className="grid gap-5 sm:grid-cols-2">
                                                                <DetailItem
                                                                    label="Name"
                                                                    value={
                                                                        profile.user.name
                                                                    }
                                                                />
                                                                <DetailItem
                                                                    label="Email"
                                                                    value={
                                                                        profile.user.email
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="min-w-0 rounded-xl border border-white/[0.07] bg-white/[0.015] p-4">
                                                        <div className="flex items-center gap-2">
                                                            <ArrowUpRight className="h-4 w-4 text-zinc-500" />
                                                            <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-500">
                                                                Online presence
                                                            </p>
                                                        </div>

                                                        {(() => {
                                                            const links = [
                                                                ...(profile.social_links ?? [])
                                                                    .filter((link) => link.is_visible && link.url?.trim())
                                                                    .map((link) => ({
                                                                        label: link.platform
                                                                            .replace(/[-_]/g, ' ')
                                                                            .replace(/\b\w/g, (char) => char.toUpperCase()),
                                                                        url: link.url,
                                                                    })),
                                                                ...(profile.spotify_artist_url
                                                                    ? [{
                                                                        label: 'Spotify',
                                                                        url: profile.spotify_artist_url,
                                                                    }]
                                                                    : []),
                                                                ...(profile.apple_music_artist_url
                                                                    ? [{
                                                                        label: 'Apple Music',
                                                                        url: profile.apple_music_artist_url,
                                                                    }]
                                                                    : []),
                                                            ].filter(
                                                                (link, index, all) =>
                                                                    all.findIndex((item) => item.url === link.url) === index,
                                                            );

                                                            return links.length > 0 ? (
                                                                <div className="mt-4 space-y-2">
                                                                    {links.map((link) => (
                                                                        <a
                                                                            key={`${link.label}-${link.url}`}
                                                                            href={link.url}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="flex min-w-0 items-center justify-between gap-3 rounded-lg border border-white/[0.06] px-3 py-3 text-xs text-zinc-400 transition hover:border-white/15 hover:bg-white/[0.035] hover:text-white"
                                                                        >
                                                                            <span className="break-words">{link.label}</span>
                                                                            <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
                                                                        </a>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <p className="py-4 text-xs leading-5 text-zinc-600">
                                                                    No online profiles provided.
                                                                </p>
                                                            );
                                                        })()}
                                                    </div>

                                                </div>

                                                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] pt-4">
                                                    <p className="text-[10px] leading-5 text-zinc-600">
                                                        Review the submitted information before making a decision.
                                                    </p>

                                                    <div className="flex flex-wrap gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                rejectArtist(
                                                                    profile,
                                                                )
                                                            }
                                                            className="inline-flex items-center gap-2 rounded-lg border border-rose-400/15 px-3 py-2 text-xs text-rose-300 transition hover:bg-rose-400/[0.06]"
                                                        >
                                                            <X className="h-3.5 w-3.5" />
                                                            Reject request
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                verifyArtist(
                                                                    profile,
                                                                )
                                                            }
                                                            className="inline-flex items-center gap-2 rounded-lg border border-cyan-300/20 bg-cyan-300/[0.06] px-3 py-2 text-xs text-cyan-200 transition hover:bg-cyan-300/[0.12]"
                                                        >
                                                            <Check className="h-3.5 w-3.5" />
                                                            Verify artist
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </GlassPanel>
                                );
                            })}
                        </div>
                    </div>
                )}


                {/* Pagination */}
                {profiles.total > 0 && (
                    <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs text-zinc-500">
                            Page{' '}
                            <span className="text-zinc-200">
                                {profiles.current_page}
                            </span>{' '}
                            of{' '}
                            <span className="text-zinc-200">
                                {profiles.last_page}
                            </span>
                        </p>

                        {profiles.last_page > 1 && (
                            <nav
                                aria-label="Artist verification pagination"
                                className="flex flex-wrap items-center gap-1.5"
                            >
                                {/* Previous */}
                                <button
                                    type="button"
                                    disabled={!profiles.links[0]?.url}
                                    onClick={() => {
                                        const url = profiles.links[0]?.url;

                                        if (url) {
                                            router.get(url, {}, {
                                                preserveScroll: true,
                                                preserveState: true,
                                            });
                                        }
                                    }}
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] px-3 py-2 text-xs text-zinc-300 transition hover:bg-white/[0.05] disabled:cursor-not-allowed disabled:opacity-30"
                                >
                                    <ArrowLeft className="h-3.5 w-3.5" />
                                    Previous
                                </button>

                                {/* Page numbers */}
                                {getVisiblePages(
                                    profiles.current_page,
                                    profiles.last_page,
                                ).map((page, index) => {
                                    if (page === 'ellipsis') {
                                        return (
                                            <span
                                                key={`ellipsis-${index}`}
                                                className="px-1.5 text-xs text-zinc-600"
                                            >
                                                …
                                            </span>
                                        );
                                    }

                                    const pageLink = profiles.links.find(
                                        (link) => link.label.trim() === String(page),
                                    );

                                    return (
                                        <button
                                            key={page}
                                            type="button"
                                            disabled={!pageLink?.url}
                                            aria-current={
                                                page === profiles.current_page
                                                    ? 'page'
                                                    : undefined
                                            }
                                            onClick={() => {
                                                if (pageLink?.url) {
                                                    router.get(pageLink.url, {}, {
                                                        preserveScroll: true,
                                                        preserveState: true,
                                                    });
                                                }
                                            }}
                                            className={`min-w-9 rounded-lg border px-3 py-2 text-xs transition ${page === profiles.current_page
                                                ? 'border-cyan-300/25 bg-cyan-300/[0.08] text-cyan-200'
                                                : 'border-white/[0.08] text-zinc-400 hover:bg-white/[0.05] hover:text-white'
                                                } disabled:cursor-not-allowed disabled:opacity-30`}
                                        >
                                            {page}
                                        </button>
                                    );
                                })}

                                {/* Next */}
                                <button
                                    type="button"
                                    disabled={
                                        !profiles.links[profiles.links.length - 1]?.url
                                    }
                                    onClick={() => {
                                        const url =
                                            profiles.links[profiles.links.length - 1]?.url;

                                        if (url) {
                                            router.get(url, {}, {
                                                preserveScroll: true,
                                                preserveState: true,
                                            });
                                        }
                                    }}
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] px-3 py-2 text-xs text-zinc-300 transition hover:bg-white/[0.05] disabled:cursor-not-allowed disabled:opacity-30"
                                >
                                    Next
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </button>
                            </nav>
                        )}
                    </div>
                )}

                <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] pt-5">
                    <p className="text-[10px] leading-5 text-zinc-600">
                        LIRA Administration · Artist verification queue
                    </p>

                    <Link
                        href="/dashboard/admin"
                        className="inline-flex items-center gap-2 text-[10px] text-zinc-500 transition hover:text-white"
                    >
                        <ArrowLeft className="h-3 w-3" />
                        Back to dashboard
                    </Link>
                </div>
            </div>


            {confirmation?.action === 'reject' ? (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="reject-modal-title"
                        className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#101012] shadow-2xl"
                    >
                        <div className="border-b border-white/[0.07] p-6">
                            <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-rose-400/15 bg-rose-400/[0.06]">
                                    <X className="h-5 w-5 text-rose-300" />
                                </div>

                                <div className="min-w-0">
                                    <h2
                                        id="reject-modal-title"
                                        className="text-lg font-medium text-white"
                                    >
                                        Reject verification request
                                    </h2>

                                    <p className="mt-2 text-sm leading-6 text-zinc-500">
                                        Provide feedback for{' '}
                                        <span className="text-zinc-200">
                                            {confirmation.profile.display_name}
                                        </span>
                                        . The artist will be able to review this reason
                                        before resubmitting.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            <label
                                htmlFor="rejection-reason"
                                className="mb-2 block text-xs font-medium text-zinc-300"
                            >
                                Reason for rejection
                                <span className="ml-1 text-rose-300">*</span>
                            </label>

                            <textarea
                                id="rejection-reason"
                                value={rejectionReason}
                                onChange={(event) => {
                                    setRejectionReason(event.target.value);
                                    setRejectionError('');
                                }}
                                rows={5}
                                maxLength={2000}
                                disabled={isSubmitting}
                                placeholder="Explain what needs to be corrected or provided before this artist can be verified..."
                                className="w-full resize-y rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-zinc-700 focus:border-rose-300/30 disabled:opacity-60"
                            />

                            <div className="mt-2 flex items-start justify-between gap-3">
                                {rejectionError ? (
                                    <p role="alert" className="text-xs text-rose-300">
                                        {rejectionError}
                                    </p>
                                ) : (
                                    <p className="text-xs leading-5 text-zinc-600">
                                        Provide at least 10 characters of constructive
                                        feedback.
                                    </p>
                                )}

                                <span className="shrink-0 text-[10px] tabular-nums text-zinc-600">
                                    {rejectionReason.length}/2000
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col-reverse gap-2 border-t border-white/[0.07] p-5 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={closeConfirmation}
                                disabled={isSubmitting}
                                className="rounded-xl border border-white/10 px-4 py-3 text-xs text-zinc-300 transition hover:bg-white/[0.05] disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={confirmAction}
                                disabled={isSubmitting}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-400/20 bg-rose-400/[0.08] px-4 py-3 text-xs text-rose-200 transition hover:bg-rose-400/[0.14] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <X className="h-3.5 w-3.5" />
                                {isSubmitting ? 'Submitting...' : 'Reject Request'}
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <ConfirmModal
                    isOpen={confirmation?.action === 'verify'}
                    title="Verify this artist?"
                    description={
                        confirmation
                            ? `You are about to verify ${confirmation.profile.display_name}. Confirm that the artist meets LIRA's verification requirements before proceeding.`
                            : ''
                    }
                    confirmText="Verify Artist"
                    variant="success"
                    isLoading={isSubmitting}
                    onConfirm={confirmAction}
                    onCancel={closeConfirmation}
                />
            )}
        </AdminLayout>
    );
}
