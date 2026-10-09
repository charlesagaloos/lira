
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Components/Dashboard/AdminLayout';
import ConfirmModal from '../../../Components/UI/ConfirmModal';

import {
    ArrowLeft,
    ArrowUpRight,
    Check,
    CheckCircle2,
    ChevronDown,
    MapPin,
    Music2,
    Search,
    User,
    X,
} from 'lucide-react';
import { useMemo, useState } from 'react';

interface ArtistProfile {
    id: number;
    username: string;
    display_name: string;
    bio: string | null;
    artist_type: string | null;
    location: string | null;
    spotify_artist_url: string | null;
    apple_music_artist_url: string | null;
    verification_status: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
}

interface Props {
    profiles: ArtistProfile[];
}

function GlassPanel({
    children,
    className = '',
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={`overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] backdrop-blur-xl ${className}`}
        >
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

export default function Index({ profiles }: Props) {
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [expandedProfiles, setExpandedProfiles] = useState<number[]>([]);

    // Confirmation modal state
    const [confirmation, setConfirmation] = useState<{
        profile: ArtistProfile;
        action: 'verify' | 'reject';
    } | null>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const artistTypes = useMemo(
        () =>
            Array.from(
                new Set(
                    profiles
                        .map((profile) => profile.artist_type?.trim())
                        .filter(
                            (type): type is string => Boolean(type),
                        ),
                ),
            ).sort((a, b) => a.localeCompare(b)),
        [profiles],
    );

    const filteredProfiles = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();

        return profiles.filter((profile) => {
            const matchesSearch =
                !normalizedSearch ||
                [
                    profile.display_name,
                    profile.username,
                    profile.user?.name,
                    profile.user?.email,
                    profile.artist_type,
                    profile.location,
                ].some((value) =>
                    value?.toLowerCase().includes(normalizedSearch),
                );

            const matchesType =
                typeFilter === 'all' ||
                profile.artist_type === typeFilter;

            return matchesSearch && matchesType;
        });
    }, [profiles, search, typeFilter]);

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
        setConfirmation({ profile, action: 'reject' });
    };

    const closeConfirmation = () => {
        if (isSubmitting) return;
        setConfirmation(null);
    };

    const confirmAction = () => {
        if (!confirmation || isSubmitting) return;

        const { profile, action } = confirmation;

        setIsSubmitting(true);

        router.post(
            `/dashboard/admin/verifications/${profile.id}/${action}`,
            {},
            {
                onFinish: () => {
                    setIsSubmitting(false);
                    setConfirmation(null);
                },
            },
        );
    };

    const pendingCount = profiles.filter(
        (profile) => profile.verification_status.toLowerCase() === 'pending',
    ).length;

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
                            {profiles.length}
                        </p>
                    </div>

                    <div className="rounded-xl border border-purple-400/10 bg-purple-400/[0.025] p-4">
                        <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-600">
                            Matching results
                        </p>
                        <p className="mt-2 text-2xl font-light text-white">
                            {filteredProfiles.length}
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
                    <div className="grid gap-3 p-4 md:grid-cols-[minmax(0,1fr)_240px] md:p-5">
                        <div className="relative">
                            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
                            <input
                                type="search"
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Search artist, username, email, or location..."
                                aria-label="Search artist verification requests"
                                className="h-12 w-full rounded-xl border border-white/[0.07] bg-black/20 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-white/20 focus:bg-white/[0.025]"
                            />
                        </div>

                        <div className="relative">
                            <select
                                value={typeFilter}
                                onChange={(event) =>
                                    setTypeFilter(event.target.value)
                                }
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
                    </div>
                </GlassPanel>

                {/* Artist queue */}
                {profiles.length === 0 ? (
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
                ) : filteredProfiles.length === 0 ? (
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
                                    {filteredProfiles.length}
                                </span>{' '}
                                of {profiles.length}
                            </p>
                        </div>

                        <div className="space-y-3">
                            {filteredProfiles.map((profile) => {
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
                                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.035] text-sm text-zinc-300">
                                                        {profile.display_name
                                                            .trim()
                                                            .charAt(0)
                                                            .toUpperCase() || (
                                                                <User className="h-4 w-4" />
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
                                                            <Music2 className="h-4 w-4 text-zinc-500" />
                                                            <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-500">
                                                                Music profiles
                                                            </p>
                                                        </div>

                                                        <div className="mt-4 space-y-2">
                                                            {profile.spotify_artist_url && (
                                                                <a
                                                                    href={
                                                                        profile.spotify_artist_url
                                                                    }
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="flex min-w-0 items-center justify-between gap-3 rounded-lg border border-white/[0.06] px-3 py-3 text-xs text-zinc-400 transition hover:border-white/15 hover:bg-white/[0.035] hover:text-white"
                                                                >
                                                                    <span>
                                                                        Spotify
                                                                    </span>
                                                                    <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
                                                                </a>
                                                            )}

                                                            {profile.apple_music_artist_url && (
                                                                <a
                                                                    href={
                                                                        profile.apple_music_artist_url
                                                                    }
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="flex min-w-0 items-center justify-between gap-3 rounded-lg border border-white/[0.06] px-3 py-3 text-xs text-zinc-400 transition hover:border-white/15 hover:bg-white/[0.035] hover:text-white"
                                                                >
                                                                    <span>
                                                                        Apple Music
                                                                    </span>
                                                                    <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
                                                                </a>
                                                            )}

                                                            {!profile.spotify_artist_url &&
                                                                !profile.apple_music_artist_url && (
                                                                    <p className="py-4 text-xs leading-5 text-zinc-600">
                                                                        No music profiles provided.
                                                                    </p>
                                                                )}
                                                        </div>
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

            <ConfirmModal
                isOpen={confirmation !== null}
                title={
                    confirmation?.action === 'verify'
                        ? 'Verify this artist?'
                        : 'Reject this verification request?'
                }
                description={
                    confirmation
                        ? confirmation.action === 'verify'
                            ? `You are about to verify ${confirmation.profile.display_name}. Confirm that the artist meets LIRA's verification requirements before proceeding.`
                            : `You are about to reject ${confirmation.profile.display_name}'s verification request. Make sure this is your intended decision.`
                        : ''
                }
                confirmText={
                    confirmation?.action === 'verify'
                        ? 'Verify Artist'
                        : 'Reject Request'
                }
                variant={
                    confirmation?.action === 'verify'
                        ? 'success'
                        : 'danger'
                }
                isLoading={isSubmitting}
                onConfirm={confirmAction}
                onCancel={closeConfirmation}
            />
        </AdminLayout>
    );
}
