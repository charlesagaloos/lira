
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowUpRight,
    ExternalLink,
    Globe,
    MapPin,
    Music2,
    Pencil,
    User,
    UserRoundCheck,
} from 'lucide-react';
import type { ReactNode } from 'react';
import AdminLayout from '../../../Components/Dashboard/AdminLayout';
import AvatarImage from '../../../Components/Portfolio/AvatarImage';

type Status = 'pending' | 'verified' | 'rejected';

interface ArtistUser {
    id: number;
    name: string;
    email: string;
    is_admin: boolean;
    created_at: string | null;
}

interface Profile {
    id: number;
    username: string;
    display_name: string;
    avatar: string | null;
    avatar_zoom?: number | null;
    avatar_position_x?: number | null;
    avatar_position_y?: number | null;
    bio: string | null;
    about_me: string | null;
    artist_type: string | null;
    location: string | null;
    website: string | null;
    spotify_artist_url?: string | null;
    apple_music_artist_url?: string | null;
    verification_status: Status | string;
    is_published: boolean;
    updated_at: string | null;
    created_at: string | null;
    user: ArtistUser | null;
    public_url: string | null;
}

interface Props {
    profile: Profile;
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
            className={`relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.025] backdrop-blur-xl ${className}`}
        >
            {children}
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const normalized = status.toLowerCase();

    const styles =
        normalized === 'verified'
            ? 'border-cyan-300/20 bg-cyan-300/[0.07] text-cyan-200'
            : normalized === 'rejected'
              ? 'border-rose-300/20 bg-rose-300/[0.07] text-rose-200'
              : 'border-violet-300/20 bg-violet-300/[0.07] text-violet-200';

    return (
        <span className="inline-flex items-center gap-2">
            <span
                className={`h-1.5 w-1.5 rounded-full ${
                    normalized === 'verified'
                        ? 'bg-[#35dfff] shadow-[0_0_8px_rgba(53,223,255,0.5)]'
                        : normalized === 'rejected'
                          ? 'bg-[#ff6b9d] shadow-[0_0_8px_rgba(255,107,157,0.5)]'
                          : 'bg-[#a855f7] shadow-[0_0_8px_rgba(168,85,247,0.5)]'
                }`}
            />
            <span
                className={`rounded-full border px-3 py-1 text-[8px] uppercase tracking-[0.18em] ${styles}`}
            >
                {normalized}
            </span>
        </span>
    );
}

function DetailItem({
    label,
    value,
}: {
    label: string;
    value: ReactNode;
}) {
    const isEmpty =
        value === null ||
        value === undefined ||
        value === '' ||
        value === false;

    return (
        <div className="min-w-0">
            <p className="text-[9px] uppercase tracking-[0.25em] text-zinc-600">
                {label}
            </p>
            <div className="mt-2 break-words text-sm leading-6 text-zinc-400">
                {isEmpty ? (
                    <span className="text-zinc-700">Not provided</span>
                ) : (
                    value
                )}
            </div>
        </div>
    );
}

function dateLabel(value: string | null): string {
    if (!value) return 'Not provided';

    const date = new Date(value);

    return Number.isNaN(date.getTime())
        ? 'Not provided'
        : date.toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
          });
}

function imageUrl(path: string | null): string | null {
    if (!path) return null;

    if (/^https?:\/\//i.test(path) || path.startsWith('/')) {
        return path;
    }

    return `/storage/${path.replace(/^storage\//, '')}`;
}

export default function Show({ profile }: Props) {
    const avatar = imageUrl(profile.avatar);
    const artistName = profile.display_name || profile.username || 'Artist';

    const publicUrl =
        profile.public_url ||
        (profile.username ? `/@${profile.username}` : null);

    return (
        <AdminLayout>
            <Head title={`${artistName} | LIRA Admin`} />

            <div className="mx-auto max-w-[1400px] px-6 py-10 text-white sm:px-8 lg:px-12 lg:py-12">
                <div className="mb-12">
                    <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
                        <div>
                            <div className="mb-5 flex items-center gap-3">
                                <span className="h-px w-8 bg-[linear-gradient(90deg,#ffffff,#7d8991,transparent)]" />

                                <span className="text-[9px] uppercase tracking-[0.35em] text-zinc-600">
                                    LIRA / ADMIN / ARTISTS / PROFILE
                                </span>
                            </div>

                            <h1 className="text-4xl font-light tracking-[-0.055em] sm:text-5xl">
                                Artist
                                <br />
                                <span className="bg-[linear-gradient(90deg,#fff_0%,#bdefff_24%,#9d8cff_58%,#f08bd7_82%,#fff_100%)] bg-clip-text text-transparent">
                                    profile.
                                </span>
                            </h1>

                            <p className="mt-5 max-w-xl text-sm leading-6 text-zinc-600">
                                Review the artist's account, portfolio
                                information, and public profile details.
                            </p>
                        </div>

                        <div className="flex shrink-0 flex-wrap items-center gap-3">
                            <Link
                                href="/dashboard/admin/artists"
                                className="group inline-flex items-center gap-2 rounded-xl border border-white/[0.10] bg-white/[0.045] px-4 py-2.5 text-xs font-medium text-white/80 shadow-[0_0_20px_rgba(255,255,255,0.02)] transition duration-300 hover:border-white/[0.18] hover:bg-white/[0.08] hover:text-white"
                            >
                                <ArrowLeft className="h-3.5 w-3.5 text-white/60 transition-transform duration-300 group-hover:-translate-x-1 group-hover:text-white" />
                                Back to Directory
                            </Link>

                            {profile.user && (
                                <Link
                                    href={`/dashboard/admin/artists/${profile.id}/edit`}
                                    className="group inline-flex items-center gap-2 rounded-xl border border-white/[0.10] bg-white/[0.045] px-4 py-2.5 text-xs font-medium text-white/80 transition duration-300 hover:border-white/[0.18] hover:bg-white/[0.08] hover:text-white"
                                >
                                    <Pencil className="h-3.5 w-3.5 text-zinc-500 transition group-hover:text-white" />
                                    Manage Account
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Artist Profile Card */}

                <div className="mb-5 flex items-end justify-between gap-4">
                    <div>
                        <p className="text-[9px] uppercase tracking-[0.3em] text-zinc-600">
                            Artist Directory
                        </p>
                        <h2 className="mt-2 text-2xl font-light tracking-[-0.04em] text-white">
                            Profile Details
                        </h2>
                    </div>

                    <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-700">
                        Profile ID #{profile.id}
                    </p>
                </div>

                <div className="space-y-5">
                    <GlassPanel>
                        {/* Artist Header */}

                        <div className="border-b border-white/[0.06] p-6 sm:p-7">
                            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                                <div className="flex min-w-0 items-start gap-4">
                                    <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.035] text-xl text-zinc-400">
                                        {avatar ? (
                                            <AvatarImage
                                                src={avatar}
                                                alt={`${artistName} profile`}
                                                className="select-none object-cover"
                                                zoom={Number(
                                                    profile.avatar_zoom ?? 1,
                                                )}
                                                positionX={Number(
                                                    profile.avatar_position_x ??
                                                        50,
                                                )}
                                                positionY={Number(
                                                    profile.avatar_position_y ??
                                                        50,
                                                )}
                                            />
                                        ) : (
                                            <User className="h-6 w-6 text-zinc-600" />
                                        )}
                                    </div>

                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                                            <h2 className="text-xl font-light tracking-[-0.025em] text-white sm:text-2xl">
                                                {profile.display_name ||
                                                    'Unnamed artist'}
                                            </h2>
                                            <StatusBadge
                                                status={
                                                    profile.verification_status
                                                }
                                            />
                                        </div>

                                        <p className="mt-1 text-xs text-zinc-600">
                                            @{profile.username || 'no-username'}
                                        </p>

                                        <p className="mt-3 break-all text-[10px] text-zinc-700">
                                            Account owner{' '}
                                            <span className="text-zinc-500">
                                                {profile.user?.name ??
                                                    'Unknown account'}
                                            </span>
                                            <span className="mx-2">·</span>
                                            {profile.user?.email ??
                                                'No email available'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                                    <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-2 text-[9px] uppercase tracking-[0.15em] text-zinc-500">
                                        <span
                                            className={`h-1.5 w-1.5 rounded-full ${
                                                profile.is_published
                                                    ? 'bg-[#35dfff]'
                                                    : 'bg-zinc-600'
                                            }`}
                                        />
                                        {profile.is_published
                                            ? 'Published'
                                            : 'Unpublished'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Artist and Account Information */}

                        <div className="grid gap-8 p-6 sm:p-7 lg:grid-cols-[1fr_320px]">
                            <div className="space-y-8">
                                <section>
                                    <div className="mb-5 flex items-center gap-2">
                                        <UserRoundCheck className="h-4 w-4 text-zinc-600" />
                                        <p className="text-[9px] uppercase tracking-[0.25em] text-zinc-600">
                                            Artist Information
                                        </p>
                                    </div>

                                    <div className="grid gap-6 sm:grid-cols-2">
                                        <DetailItem
                                            label="Display Name"
                                            value={profile.display_name}
                                        />

                                        <DetailItem
                                            label="Username"
                                            value={
                                                profile.username
                                                    ? `@${profile.username}`
                                                    : null
                                            }
                                        />

                                        <DetailItem
                                            label="Artist Type"
                                            value={profile.artist_type}
                                        />

                                        <div>
                                            <p className="text-[9px] uppercase tracking-[0.25em] text-zinc-600">
                                                Location
                                            </p>
                                            <div className="mt-2 flex items-center gap-2 text-sm text-zinc-400">
                                                <MapPin className="h-3.5 w-3.5 shrink-0 text-zinc-600" />
                                                <span>
                                                    {profile.location ||
                                                        'Not provided'}
                                                </span>
                                            </div>
                                        </div>

                                        <DetailItem
                                            label="Verification Status"
                                            value={
                                                profile.verification_status
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                profile.verification_status.slice(
                                                    1,
                                                )
                                            }
                                        />

                                        <DetailItem
                                            label="Profile Visibility"
                                            value={
                                                profile.is_published
                                                    ? 'Published'
                                                    : 'Unpublished'
                                            }
                                        />
                                    </div>
                                </section>

                                <section className="border-t border-white/[0.06] pt-7">
                                    <div className="mb-5 flex items-center gap-2">
                                        <User className="h-4 w-4 text-zinc-600" />
                                        <p className="text-[9px] uppercase tracking-[0.25em] text-zinc-600">
                                            Account Information
                                        </p>
                                    </div>

                                    <div className="grid gap-6 sm:grid-cols-2">
                                        <DetailItem
                                            label="Account Name"
                                            value={profile.user?.name}
                                        />

                                        <DetailItem
                                            label="Email Address"
                                            value={profile.user?.email}
                                        />

                                        <DetailItem
                                            label="Account Role"
                                            value={
                                                profile.user
                                                    ? profile.user.is_admin
                                                        ? 'Administrator'
                                                        : 'Artist / User'
                                                    : null
                                            }
                                        />

                                        <DetailItem
                                            label="User ID"
                                            value={
                                                profile.user
                                                    ? String(profile.user.id)
                                                    : null
                                            }
                                        />

                                        <DetailItem
                                            label="Account Created"
                                            value={dateLabel(
                                                profile.user?.created_at ??
                                                    null,
                                            )}
                                        />

                                        <DetailItem
                                            label="Profile Last Updated"
                                            value={dateLabel(
                                                profile.updated_at,
                                            )}
                                        />
                                    </div>
                                </section>

                                <section className="border-t border-white/[0.06] pt-7">
                                    <p className="text-[9px] uppercase tracking-[0.25em] text-zinc-600">
                                        Artist Biography
                                    </p>

                                    <div className="mt-5 space-y-6">
                                        <div>
                                            <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-700">
                                                Bio
                                            </p>
                                            <p className="mt-3 whitespace-pre-line text-sm leading-6 text-zinc-500">
                                                {profile.bio ||
                                                    'No biography provided.'}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-700">
                                                About the Artist
                                            </p>
                                            <p className="mt-3 whitespace-pre-line text-sm leading-6 text-zinc-500">
                                                {profile.about_me ||
                                                    'No additional information provided.'}
                                            </p>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            {/* Links and Public Portfolio */}

                            <aside className="space-y-5">
                                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-5">
                                    <div className="flex items-center gap-2">
                                        <Globe className="h-4 w-4 text-zinc-600" />
                                        <p className="text-[9px] uppercase tracking-[0.25em] text-zinc-600">
                                            Public Portfolio
                                        </p>
                                    </div>

                                    <div className="mt-5">
                                        <p className="break-all text-xs leading-5 text-zinc-500">
                                            {profile.is_published && publicUrl
                                                ? publicUrl
                                                : 'This portfolio is unpublished or has no public URL.'}
                                        </p>

                                        {profile.is_published && publicUrl && (
                                            <a
                                                href={publicUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="group/link mt-4 flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.015] px-4 py-3 text-xs text-zinc-500 transition duration-300 hover:border-white/[0.12] hover:bg-white/[0.035] hover:text-white"
                                            >
                                                <span>Open Portfolio</span>
                                                <ArrowUpRight className="h-3.5 w-3.5 text-zinc-700 transition duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 group-hover/link:text-white" />
                                            </a>
                                        )}
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-5">
                                    <div className="flex items-center gap-2">
                                        <ExternalLink className="h-4 w-4 text-zinc-600" />
                                        <p className="text-[9px] uppercase tracking-[0.25em] text-zinc-600">
                                            External Links
                                        </p>
                                    </div>

                                    <div className="mt-5 space-y-2">
                                        {profile.website ? (
                                            <a
                                                href={profile.website}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="group/link flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.015] px-4 py-3 text-xs text-zinc-500 transition duration-300 hover:border-white/[0.12] hover:bg-white/[0.035] hover:text-white"
                                            >
                                                <span className="break-all">
                                                    Website
                                                </span>
                                                <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-zinc-700 transition group-hover/link:text-white" />
                                            </a>
                                        ) : null}

                                        {profile.spotify_artist_url ? (
                                            <a
                                                href={
                                                    profile.spotify_artist_url
                                                }
                                                target="_blank"
                                                rel="noreferrer"
                                                className="group/link flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.015] px-4 py-3 text-xs text-zinc-500 transition duration-300 hover:border-white/[0.12] hover:bg-white/[0.035] hover:text-white"
                                            >
                                                <span>Spotify</span>
                                                <ArrowUpRight className="h-3.5 w-3.5 text-zinc-700 transition group-hover/link:text-white" />
                                            </a>
                                        ) : null}

                                        {profile.apple_music_artist_url ? (
                                            <a
                                                href={
                                                    profile.apple_music_artist_url
                                                }
                                                target="_blank"
                                                rel="noreferrer"
                                                className="group/link flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.015] px-4 py-3 text-xs text-zinc-500 transition duration-300 hover:border-white/[0.12] hover:bg-white/[0.035] hover:text-white"
                                            >
                                                <span>Apple Music</span>
                                                <ArrowUpRight className="h-3.5 w-3.5 text-zinc-700 transition group-hover/link:text-white" />
                                            </a>
                                        ) : null}

                                        {!profile.website &&
                                            !profile.spotify_artist_url &&
                                            !profile.apple_music_artist_url && (
                                                <p className="py-5 text-center text-[10px] leading-5 text-zinc-700">
                                                    No external links provided.
                                                </p>
                                            )}
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-5">
                                    <div className="flex items-center gap-2">
                                        <Music2 className="h-4 w-4 text-zinc-600" />
                                        <p className="text-[9px] uppercase tracking-[0.25em] text-zinc-600">
                                            Profile Timeline
                                        </p>
                                    </div>

                                    <div className="mt-5 space-y-5">
                                        <DetailItem
                                            label="Profile Created"
                                            value={dateLabel(
                                                profile.created_at,
                                            )}
                                        />

                                        <DetailItem
                                            label="Last Updated"
                                            value={dateLabel(
                                                profile.updated_at,
                                            )}
                                        />
                                    </div>
                                </div>
                            </aside>
                        </div>

                        {/* Footer */}

                        <div className="border-t border-white/[0.06] bg-white/[0.012] px-6 py-4 sm:px-7">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-[10px] leading-5 text-zinc-700">
                                    Review the profile information and account
                                    details before making administrative
                                    changes.
                                </p>

                                {profile.user && (
                                    <Link
                                        href={`/dashboard/admin/artists/${profile.id}/edit`}
                                        className="inline-flex shrink-0 items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-[#35dfff]/70 transition hover:text-[#72e9ff]"
                                    >
                                        <Pencil className="h-3.5 w-3.5" />
                                        Manage Account
                                    </Link>
                                )}
                            </div>
                        </div>
                    </GlassPanel>
                </div>
            </div>
        </AdminLayout>
    );
}
