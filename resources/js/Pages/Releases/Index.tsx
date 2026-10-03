import { Link, router } from '@inertiajs/react';

import DashboardLayout from '../../Components/Dashboard/d_layout';
import {
    ArrowRight,
    ArrowUpRight,
    PlusIcon,
} from '../../Components/Icons';

interface Profile {
    username: string;
    avatar: string | null;
    avatar_zoom: number;
    avatar_position_x: number;
    avatar_position_y: number;
}

interface Release {
    id: number;
    title: string;
    release_type: string;
    artwork: string | null;
    release_date: string | null;
    description: string | null;
    spotify_url: string | null;
    apple_music_url: string | null;
    youtube_url: string | null;
    soundcloud_url: string | null;
    bandcamp_url: string | null;
    position: number;
    is_visible: boolean;
}

interface Props {
    profile: Profile;
    releases: Release[];
}

/*
|--------------------------------------------------------------------------
| RELEASE ARTWORK
|--------------------------------------------------------------------------
*/

function ReleaseArtwork({
    release,
}: {
    release: Release;
}) {
    return (
        <div className="relative aspect-square overflow-hidden bg-[#0b0d0f]">
            <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(135deg,rgba(255,255,255,0.035),transparent_40%,rgba(255,255,255,0.025))]" />

            {release.artwork ? (
                <img
                    src={`/storage/${release.artwork}`}
                    alt={release.title}
                    className="h-full w-full select-none object-cover transition duration-700 group-hover:scale-[1.035]"
                    draggable={false}
                    loading="eager"
                />
            ) : (
                <div className="relative flex h-full w-full items-center justify-center bg-[linear-gradient(145deg,#0b0d0f,#15191d)]">
                    <div className="pointer-events-none absolute right-8 top-8 h-3 w-3">
                        <span className="absolute inset-0 rotate-45 bg-white/20 blur-[1px]" />
                        <span className="absolute left-1/2 top-0 h-full w-px bg-white/30" />
                        <span className="absolute left-0 top-1/2 h-px w-full bg-white/30" />
                    </div>

                    <div className="text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.025] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                            <span className="text-xl text-zinc-700">
                                ♪
                            </span>
                        </div>

                        <p className="mt-4 text-[8px] uppercase tracking-[0.28em] text-zinc-700">
                            {formatReleaseType(release.release_type)}
                        </p>
                    </div>
                </div>
            )}

            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-[linear-gradient(to_top,rgba(5,6,7,0.78),transparent)]" />

            <div className="pointer-events-none absolute bottom-4 left-5 z-20">
                <span className="text-[8px] uppercase tracking-[0.28em] text-white/45">
                    LIRA / MUSIC
                </span>
            </div>
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| RELEASE CARD
|--------------------------------------------------------------------------
*/

function ReleaseCard({
    release,
    index,
}: {
    release: Release;
    index: number;
}) {
    function deleteRelease() {
        if (!window.confirm(`Delete "${release.title}"?`)) {
            return;
        }

        router.delete(
            `/dashboard/releases/${release.id}`,
        );
    }

    function toggleVisibility() {
        router.patch(
            `/dashboard/releases/${release.id}/visibility`,
        );
    }

    return (
        <article className="group relative overflow-hidden rounded-[1.35rem] border border-white/[0.08] bg-[linear-gradient(145deg,rgba(255,255,255,0.045),rgba(255,255,255,0.012)_42%,rgba(255,255,255,0.022))] shadow-[0_25px_70px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-2xl transition duration-500 hover:-translate-y-0.5 hover:border-white/[0.14] hover:shadow-[0_35px_90px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.06)]">

            {/* Inner border */}

            <div className="pointer-events-none absolute inset-0 z-30 rounded-[1.35rem] border border-white/[0.02]" />

            {/* Chrome line */}

            <div className="pointer-events-none absolute inset-x-0 top-0 z-40 h-px bg-[linear-gradient(90deg,transparent_5%,rgba(255,255,255,0.32)_35%,rgba(255,255,255,0.12)_55%,transparent_95%)] opacity-70" />

            {/* Release number */}

            <div className="pointer-events-none absolute left-5 top-5 z-40">
                <span className="text-[8px] uppercase tracking-[0.2em] text-white/50">
                    {String(index + 1).padStart(2, '0')}
                </span>
            </div>

            {/* Sparkle */}

            <div className="pointer-events-none absolute right-6 top-6 z-40 h-3 w-3 opacity-20 transition duration-500 group-hover:opacity-70">
                <span className="absolute inset-0 rotate-45 bg-white/60 blur-[1px]" />
                <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/70" />
                <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white/70" />
            </div>

            {/* Artwork */}

            <ReleaseArtwork release={release} />

            {/* Content */}

            <div className="relative z-10 p-6">

                <div className="flex items-start justify-between gap-5">

                    <div className="min-w-0">

                        <div className="flex items-center gap-3">
                            <p className="text-[8px] uppercase tracking-[0.28em] text-zinc-600">
                                {formatReleaseType(
                                    release.release_type,
                                )}
                            </p>

                            {release.release_date && (
                                <>
                                    <span className="h-1 w-1 rounded-full bg-white/15" />

                                    <p className="text-[8px] uppercase tracking-[0.2em] text-zinc-700">
                                        {formatReleaseDate(
                                            release.release_date,
                                        )}
                                    </p>
                                </>
                            )}
                        </div>

                        <h2 className="mt-2 truncate text-[17px] font-medium tracking-[-0.025em] text-white">
                            {release.title}
                        </h2>

                    </div>

                    <div
                        className={`mt-1 flex shrink-0 items-center gap-2 text-[8px] uppercase tracking-[0.18em] ${release.is_visible
                            ? 'text-emerald-400/70'
                            : 'text-zinc-700'
                            }`}
                    >
                        <span
                            className={`h-1.5 w-1.5 rounded-full ${release.is_visible
                                ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]'
                                : 'bg-zinc-700'
                                }`}
                        />

                        {release.is_visible
                            ? 'Visible'
                            : 'Hidden'}
                    </div>

                </div>

                {release.description ? (
                    <p className="mt-3 line-clamp-3 text-xs leading-5 text-zinc-600">
                        {release.description}
                    </p>
                ) : (
                    <p className="mt-3 text-xs leading-5 text-zinc-700">
                        No release description has been added yet.
                    </p>
                )}

                {/* Streaming platforms */}

                <div className="mt-4 flex flex-wrap items-center gap-3">

                    {release.spotify_url && (
                        <a
                            href={release.spotify_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[8px] uppercase tracking-[0.18em] text-zinc-700 transition hover:text-white"
                        >
                            Spotify
                        </a>
                    )}

                    {release.apple_music_url && (
                        <a
                            href={release.apple_music_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[8px] uppercase tracking-[0.18em] text-zinc-700 transition hover:text-white"
                        >
                            Apple Music
                        </a>
                    )}

                    {release.youtube_url && (
                        <a
                            href={release.youtube_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[8px] uppercase tracking-[0.18em] text-zinc-700 transition hover:text-white"
                        >
                            YouTube
                        </a>
                    )}

                    {release.soundcloud_url && (
                        <a
                            href={release.soundcloud_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[8px] uppercase tracking-[0.18em] text-zinc-700 transition hover:text-white"
                        >
                            SoundCloud
                        </a>
                    )}

                    {release.bandcamp_url && (
                        <a
                            href={release.bandcamp_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[8px] uppercase tracking-[0.18em] text-zinc-700 transition hover:text-white"
                        >
                            Bandcamp
                        </a>
                    )}

                </div>

                {/* Actions */}

                <div className="mt-6 flex items-center justify-between border-t border-white/[0.06] pt-5">

                    <div className="flex items-center gap-5">

                        <Link
                            href={`/dashboard/releases/${release.id}/edit`}
                            className="group/edit inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-zinc-500 transition hover:text-white"
                        >
                            Edit

                            <ArrowUpRight className="h-3 w-3 transition duration-300 group-hover/edit:translate-x-0.5 group-hover/edit:-translate-y-0.5" />
                        </Link>

                        <button
                            type="button"
                            onClick={toggleVisibility}
                            className={`text-[10px] uppercase tracking-[0.18em] transition ${release.is_visible
                                ? 'text-zinc-600 hover:text-zinc-300'
                                : 'text-zinc-600 hover:text-white'
                                }`}
                        >
                            {release.is_visible
                                ? 'Hide'
                                : 'Show'}
                        </button>

                        <button
                            type="button"
                            onClick={deleteRelease}
                            className="text-[10px] uppercase tracking-[0.18em] text-zinc-700 transition hover:text-red-400"
                        >
                            Delete
                        </button>

                    </div>

                    {/* External link */}

                    {release.spotify_url && (
                        <a
                            href={release.spotify_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-zinc-600 transition hover:text-white"
                            aria-label={`Open ${release.title}`}
                        >
                            <ArrowUpRight className="h-4 w-4" />
                        </a>
                    )}

                </div>
            </div>
        </article>
    );
}

/*
|--------------------------------------------------------------------------
| STAT BLOCK
|--------------------------------------------------------------------------
*/

function StudioStat({
    value,
    label,
    description,
}: {
    value: number;
    label: string;
    description: string;
}) {
    return (
        <div className="relative overflow-hidden border-l border-white/[0.08] pl-5 first:border-l-0 first:pl-0">

            <p className="text-2xl font-light tracking-[-0.04em] text-white">
                {String(value).padStart(2, '0')}
            </p>

            <p className="mt-2 text-[8px] uppercase tracking-[0.28em] text-zinc-500">
                {label}
            </p>

            <p className="mt-2 max-w-[180px] text-[10px] leading-4 text-zinc-700">
                {description}
            </p>

        </div>
    );
}

/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

function formatReleaseType(type: string): string {
    return type.charAt(0).toUpperCase() + type.slice(1);
}

function formatReleaseDate(
    date: string,
): string {
    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
        return date;
    }

    return parsed.toLocaleDateString(
        'en-US',
        {
            month: 'short',
            year: 'numeric',
        },
    );
}

/*
|--------------------------------------------------------------------------
| RELEASES
|--------------------------------------------------------------------------
*/

export default function Index({
    profile,
    releases,
}: Props) {
    const visibleReleases = releases.filter(
        (release) => release.is_visible,
    );

    const hiddenReleases = releases.filter(
        (release) => !release.is_visible,
    );

    const releaseTypes = new Set(
        releases.map(
            (release) => release.release_type,
        ),
    ).size;

    return (
        <DashboardLayout>

            <div className="mx-auto max-w-[1400px] px-6 py-10 sm:px-8 lg:px-12 lg:py-12">

                {/* =====================================================
                    HERO
                ====================================================== */}

                <section className="relative mb-14 overflow-hidden border-b border-white/[0.07] pb-12">

                    <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">

                        <div>

                            <div className="mb-5 flex items-center gap-3">
                                <span className="h-px w-8 bg-[linear-gradient(90deg,#ffffff,#7d8991,transparent)]" />

                                <span className="text-[9px] uppercase tracking-[0.35em] text-zinc-600">
                                    LIRA / STUDIO / MUSIC
                                </span>
                            </div>

                            <h1 className="text-4xl font-light tracking-[-0.055em] text-white sm:text-5xl">
                                Your music,
                                <br />

                                <span className="bg-[linear-gradient(90deg,#fff_0%,#bdefff_24%,#9d8cff_58%,#f08bd7_82%,#fff_100%)] bg-clip-text text-transparent">
                                    your releases.
                                </span>
                            </h1>

                            <p className="mt-6 max-w-xl text-sm leading-6 text-zinc-600">
                                A curated catalog of the music,
                                releases, and records that define
                                your identity as an artist on LIRA.
                            </p>

                        </div>

                        <Link
                            href="/dashboard/releases/create"
                            className="group relative inline-flex h-11 shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full border border-white/40 bg-[linear-gradient(105deg,#32ddff_0%,#6677ff_20%,#a955ff_38%,#f05abd_51%,#ff8ed3_63%,#7b63ff_78%,#34dcff_94%)] px-5 text-xs font-medium text-[#08090b] shadow-[0_8px_35px_rgba(90,150,255,0.14)] transition duration-300 hover:scale-[1.015] hover:shadow-[0_12px_50px_rgba(190,80,255,0.22)]"
                        >
                            <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_20%,rgba(255,255,255,0.65)_48%,transparent_72%)] opacity-0 transition duration-700 group-hover:translate-x-[25%] group-hover:opacity-100" />

                            <PlusIcon className="relative h-3.5 w-3.5" />

                            <span className="relative">
                                Add Release
                            </span>
                        </Link>

                    </div>

                </section>

                {/* =====================================================
                    STUDIO OVERVIEW
                ====================================================== */}

                <section className="mb-16">

                    <div className="mb-6 flex items-end justify-between">

                        <div>

                            <p className="text-[9px] uppercase tracking-[0.32em] text-zinc-700">
                                Studio Overview
                            </p>

                            <h2 className="mt-2 text-lg font-light tracking-[-0.025em] text-white">
                                Your music inventory.
                            </h2>

                        </div>

                        <span className="hidden text-[8px] uppercase tracking-[0.25em] text-zinc-700 sm:block">
                            CURRENT STATE
                        </span>

                    </div>

                    <div className="relative overflow-hidden rounded-[1.25rem] border border-white/[0.08] bg-[linear-gradient(145deg,rgba(255,255,255,0.035),rgba(255,255,255,0.008))] px-6 py-7 shadow-[0_25px_70px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.035)] sm:px-8">

                        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)]" />

                        <div className="grid gap-8 sm:grid-cols-3">

                            <StudioStat
                                value={releases.length}
                                label="Total Releases"
                                description="Music currently stored in your LIRA studio."
                            />

                            <StudioStat
                                value={visibleReleases.length}
                                label="On Portfolio"
                                description="Releases currently visible to visitors."
                            />

                            <StudioStat
                                value={hiddenReleases.length}
                                label="Hidden Music"
                                description="Releases kept private while you continue refining them."
                            />

                        </div>

                    </div>

                </section>

                {/* =====================================================
                    RELEASE INDEX
                ====================================================== */}

                <section>

                    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

                        <div>

                            <div className="flex items-center gap-3">
                                <span className="h-px w-7 bg-[linear-gradient(90deg,#ffffff,transparent)]" />

                                <p className="text-[9px] uppercase tracking-[0.32em] text-zinc-600">
                                    Release Index
                                </p>
                            </div>

                            <h2 className="mt-3 text-2xl font-light tracking-[-0.035em] text-white">
                                Your catalog.
                            </h2>

                            <p className="mt-2 max-w-xl text-xs leading-5 text-zinc-700">
                                Each release becomes part of the
                                musical identity presented through
                                your public artist portfolio.
                            </p>

                        </div>

                        <div className="flex items-center gap-4">

                            <div className="hidden h-px w-10 bg-white/[0.08] sm:block" />

                            <div className="text-right">

                                <p className="text-sm font-light text-white">
                                    {String(releases.length).padStart(
                                        2,
                                        '0',
                                    )}
                                </p>

                                <p className="mt-1 text-[8px] uppercase tracking-[0.25em] text-zinc-700">
                                    Releases
                                </p>

                            </div>

                        </div>

                    </div>

                    {releases.length === 0 ? (

                        <div className="relative overflow-hidden rounded-[1.5rem] border border-white/[0.09] bg-[linear-gradient(145deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))] shadow-[0_30px_80px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.04)]">

                            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent)]" />

                            <div className="pointer-events-none absolute right-[15%] top-10 h-3 w-3 opacity-30">
                                <span className="absolute inset-0 rotate-45 bg-white/60 blur-[1px]" />
                                <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/60" />
                                <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white/60" />
                            </div>

                            <div className="px-6 py-20 text-center sm:px-10">

                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.09] bg-white/[0.025] text-zinc-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                                    <PlusIcon className="h-5 w-5" />
                                </div>

                                <p className="mt-6 text-[9px] uppercase tracking-[0.3em] text-zinc-700">
                                    Release Index / Empty
                                </p>

                                <h2 className="mt-3 text-xl font-light tracking-[-0.025em] text-white">
                                    Your music is waiting
                                    <br />
                                    for its first release.
                                </h2>

                                <p className="mx-auto mt-3 max-w-md text-xs leading-5 text-zinc-600">
                                    Add your first single, EP,
                                    album, or mixtape and start
                                    building your musical identity
                                    on LIRA.
                                </p>

                                <Link
                                    href="/dashboard/releases/create"
                                    className="group mt-7 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-zinc-500 transition hover:text-white"
                                >
                                    Add your first release

                                    <ArrowRight className="h-3 w-3 transition duration-300 group-hover:translate-x-1" />
                                </Link>

                            </div>

                        </div>

                    ) : (

                        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">

                            {releases.map(
                                (release, index) => (
                                    <ReleaseCard
                                        key={release.id}
                                        release={release}
                                        index={index}
                                    />
                                ),
                            )}

                        </div>

                    )}

                </section>

                {/* =====================================================
                    PORTFOLIO PRESENTATION
                ====================================================== */}

                <section className="mt-16 border-t border-white/[0.07] pt-10">

                    <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">

                        <div>

                            <p className="text-[9px] uppercase tracking-[0.32em] text-zinc-700">
                                Portfolio Presentation
                            </p>

                            <h2 className="mt-3 text-xl font-light tracking-[-0.03em] text-white">
                                Decide what the world hears.
                            </h2>

                            <p className="mt-3 max-w-xl text-xs leading-5 text-zinc-600">
                                Visibility controls determine which
                                releases appear on your public LIRA
                                portfolio. Keep unfinished music
                                private until it is ready.
                            </p>

                        </div>

                        <div className="flex flex-wrap items-center gap-5">

                            <div className="flex items-center gap-2">

                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.45)]" />

                                <span className="text-[8px] uppercase tracking-[0.2em] text-zinc-600">
                                    {visibleReleases.length}{' '}
                                    Visible
                                </span>

                            </div>

                            <div className="flex items-center gap-2">

                                <span className="h-1.5 w-1.5 rounded-full bg-zinc-700" />

                                <span className="text-[8px] uppercase tracking-[0.2em] text-zinc-700">
                                    {hiddenReleases.length}{' '}
                                    Hidden
                                </span>

                            </div>

                            <Link
                                href={`/@${profile.username}`}
                                className="group inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-zinc-500 transition hover:text-white"
                            >
                                View Portfolio

                                <ArrowRight className="h-3 w-3 transition duration-300 group-hover:translate-x-1" />
                            </Link>

                        </div>

                    </div>

                </section>

                {/* =====================================================
                    FOOTER METADATA
                ====================================================== */}

                <footer className="mt-10 flex flex-col gap-3 border-t border-white/[0.05] pt-6 sm:flex-row sm:items-center sm:justify-between">

                    <p className="text-[9px] uppercase tracking-[0.22em] text-zinc-800">
                        LIRA / STUDIO / MUSIC ARCHIVE
                    </p>

                    <p className="text-[10px] text-zinc-800">
                        {releaseTypes > 0
                            ? `${releaseTypes} release ${releaseTypes === 1
                                ? 'type'
                                : 'types'
                            } represented`
                            : 'Start building your catalog'}
                    </p>

                </footer>

            </div>

        </DashboardLayout>
    );
}
