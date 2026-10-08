import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { Head } from '@inertiajs/react';
import { LiquidGlassCarousel as LiquidGlassCarouselComponent } from '../../../Components/UI/liquid-glass-carousel';
import AvatarImage from '../../../Components/Portfolio/AvatarImage';

import type {
    PortfolioProject,
    PortfolioProps,
    PortfolioRelease,
} from '../types';

type NavigationItem = {
    id?: number;
    label: string;
    destination: string;
    url?: string | null;
    sort_order: number;
    is_visible: boolean;
};

type NavigationSettings = {
    navigation_items?: NavigationItem[];
};

type GalleryImage = {
    id: number;
    image: string;
    title?: string | null;
    caption?: string | null;
    alt_text?: string | null;
    sort_order: number;
};

type GalleryResponsive = {
    display?: 'grid' | 'masonry' | 'editorial' | 'freeform';
    columns?: number;
    image_aspect?: 'original' | 'square' | 'portrait' | 'landscape';
};

type GallerySettings = {
    gallery_images?: GalleryImage[];
    gallery_responsive?: {
        desktop?: GalleryResponsive;
        tablet?: GalleryResponsive;
        mobile?: GalleryResponsive;
    } | null;
};

function getGalleryAspectRatio(
    aspect: GalleryResponsive['image_aspect'],
): string {
    switch (aspect) {
        case 'square':
            return '1 / 1';
        case 'portrait':
            return '4 / 5';
        case 'landscape':
            return '4 / 3';
        default:
            return '4 / 3';
    }
}

function getAssetUrl(path?: string | null): string | null {
    if (!path) {
        return null;
    }

    if (
        path.startsWith('http://') ||
        path.startsWith('https://') ||
        path.startsWith('data:') ||
        path.startsWith('blob:')
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

    return `/storage/${path.replace(/^\/+/, '')}`;
}

function getProjectUrl(
    profile: PortfolioProps['profile'],
    project: PortfolioProject,
): string {
    return `/@${profile.username}/project/${project.slug}`;
}

function getStreamingLinks(
    release: PortfolioRelease,
): Array<{ label: string; url: string }> {
    return [
        ['Spotify', release.spotify_url],
        ['Apple Music', release.apple_music_url],
        ['YouTube', release.youtube_url],
        ['SoundCloud', release.soundcloud_url],
        ['Bandcamp', release.bandcamp_url],
    ]
        .filter(
            (item): item is [string, string] =>
                typeof item[1] === 'string' &&
                item[1].trim().length > 0,
        )
        .map(([label, url]) => ({ label, url }));
}

function formatReleaseDate(
    date: string | null | undefined,
): string | null {
    if (!date) {
        return null;
    }

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
        return null;
    }

    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        year: 'numeric',
    })
        .format(parsed)
        .toUpperCase();
}

function isNavigationItemAvailable(
    item: NavigationItem,
    profile: PortfolioProps['profile'],
    galleryImages: GalleryImage[],
): boolean {
    const settings = profile.portfolio_settings;

    switch (item.destination) {
        case 'home':
            return true;

        case 'work':
            return settings.show_work && profile.projects.length > 0;

        case 'music':
            return settings.show_music && profile.releases.length > 0;

        case 'about':
            return settings.show_about;

        case 'artist_message':
            return (
                settings.show_artist_message &&
                Boolean(settings.artist_message?.trim())
            );

        case 'gallery':
            return settings.show_gallery && galleryImages.length > 0;

        case 'footer':
            return settings.show_footer;

        case 'external':
            return Boolean(item.url);

        case 'contact':
            return false;

        default:
            return false;
    }
}

function ReleaseArtwork({
    release,
    className = '',
}: {
    release: PortfolioRelease;
    className?: string;
}) {
    const image = getAssetUrl(release.artwork);

    if (!image) {
        return (
            <div
                className={`flex h-full w-full items-center justify-center ${className}`}
                style={{
                    backgroundColor: 'var(--musician-surface)',
                    color: 'var(--musician-muted)',
                }}
            >
                <span className="text-[8px] uppercase tracking-[0.3em]">
                    {release.release_type || 'Release'}
                </span>
            </div>
        );
    }

    return (
        <img
            src={image}
            alt={release.title}
            className={`h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.035] ${className}`}
            draggable={false}
        />
    );
}

function MusicianReleaseCard({
    release,
    index,
    featured = false,
}: {
    release: PortfolioRelease;
    index: number;
    featured?: boolean;
}) {
    const links = getStreamingLinks(release);
    const date = formatReleaseDate(release.release_date);

    return (
        <article
            className={`group ${featured ? 'md:col-span-2' : ''
                }`}
        >
            <div
                className={`relative overflow-hidden border ${featured
                    ? 'aspect-[16/10] md:aspect-[16/9]'
                    : 'aspect-square'
                    }`}
                style={{
                    borderColor: 'var(--musician-border)',
                    backgroundColor: 'var(--musician-surface)',
                }}
            >
                <ReleaseArtwork release={release} />

                <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background:
                            'linear-gradient(180deg, transparent 45%, rgba(0,0,0,.82) 100%)',
                    }}
                />

                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                    <div className="flex items-end justify-between gap-4">
                        <div className="min-w-0">
                            <p
                                className="text-[7px] uppercase tracking-[0.28em]"
                                style={{
                                    color: 'var(--musician-accent)',
                                }}
                            >
                                {String(index + 1).padStart(2, '0')} /{' '}
                                {release.release_type || 'Release'}
                            </p>

                            <h3 className="mt-2 truncate text-lg font-medium tracking-[-0.03em] text-white sm:text-xl">
                                {release.title}
                            </h3>

                            {date && (
                                <p className="mt-1 text-[7px] uppercase tracking-[0.22em] text-white/55">
                                    {date}
                                </p>
                            )}
                        </div>

                        {links.length > 0 && (
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/35 text-sm text-white transition duration-300 group-hover:border-white group-hover:bg-white group-hover:text-black">
                                ↗
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {links.length > 0 && (
                <div
                    className="flex flex-wrap gap-x-4 gap-y-2 border-x border-b px-3 py-3"
                    style={{
                        borderColor: 'var(--musician-border)',
                    }}
                >
                    {links.map((link) => (
                        <a
                            key={link.label}
                            href={link.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[7px] uppercase tracking-[0.2em] transition-opacity hover:opacity-60"
                            style={{
                                color: 'var(--musician-muted)',
                            }}
                        >
                            {link.label} ↗
                        </a>
                    ))}
                </div>
            )}
        </article>
    );
}


function MusicPlayerWidget({
    releases,
    activeReleaseId,
    onChangeRelease,
    artistName,
}: {
    releases: PortfolioRelease[];
    activeReleaseId: number | null;
    onChangeRelease: (releaseId: number) => void;
    artistName: string;
}) {
    const activeRelease =
        releases.find(
            (release) => release.id === activeReleaseId,
        ) ?? releases[0] ?? null;

    if (!activeRelease) {
        return null;
    }

    const activeIndex = Math.max(
        0,
        releases.findIndex(
            (release) => release.id === activeRelease.id,
        ),
    );

    const streamingLink =
        getStreamingLinks(activeRelease)[0] ?? null;

    const goPrevious = () => {
        const previousIndex =
            activeIndex === 0
                ? releases.length - 1
                : activeIndex - 1;

        const previousRelease = releases[previousIndex];

        if (previousRelease) {
            onChangeRelease(previousRelease.id);
        }
    };

    const goNext = () => {
        const nextIndex =
            activeIndex === releases.length - 1
                ? 0
                : activeIndex + 1;

        const nextRelease = releases[nextIndex];

        if (nextRelease) {
            onChangeRelease(nextRelease.id);
        }
    };

    return (
        <div
            className="relative overflow-hidden border"
            style={{
                borderColor:
                    'var(--musician-border)',
                backgroundColor:
                    'var(--musician-surface)',
            }}
        >
            <div className="grid gap-0 md:grid-cols-[1.05fr_.95fr]">
                <div className="relative flex min-h-[430px] items-center justify-center overflow-hidden border-b p-6 sm:p-10 md:min-h-[560px] md:border-b-0 md:border-r">
                    <div
                        className="pointer-events-none absolute inset-0"
                        style={{
                            background:
                                'radial-gradient(circle at 50% 12%, color-mix(in srgb, var(--musician-accent) 16%, transparent), transparent 45%)',
                        }}
                    />

                    <div className="relative w-full max-w-[420px]">
                        <div
                            className="mx-auto mb-3 flex max-w-[360px] items-center justify-between"
                        >
                            <div
                                className="border px-2.5 py-1.5"
                                style={{
                                    borderColor:
                                        'rgba(255,255,255,.35)',
                                    backgroundColor:
                                        'rgba(0,0,0,.25)',
                                }}
                            >
                                <span className="text-[7px] font-bold uppercase tracking-[0.25em] text-white">
                                    Now / Playing
                                </span>
                            </div>
                        </div>

                        <div
                            className="relative mx-auto aspect-square w-full max-w-[360px] overflow-hidden"
                            style={{
                                border:
                                    '1px solid var(--musician-border)',
                                borderRadius:
                                    '50% 50% 14% 14% / 34% 34% 14% 14%',
                                backgroundColor:
                                    'var(--musician-bg)',
                                boxShadow:
                                    '0 30px 80px color-mix(in srgb, var(--musician-primary) 24%, transparent)',
                            }}
                        >
                            <ReleaseArtwork
                                release={activeRelease}
                            />

                            <div
                                className="pointer-events-none absolute inset-0"
                                style={{
                                    background:
                                        'linear-gradient(180deg, transparent 42%, rgba(0,0,0,.35) 100%)',
                                }}
                            />

                        </div>

                        <div className="mx-auto mt-5 flex max-w-[360px] items-center justify-between text-[7px] uppercase tracking-[0.2em]">
                            <span
                                style={{
                                    color:
                                        'var(--musician-muted)',
                                }}
                            >
                                Track {String(activeIndex + 1).padStart(2, '0')}
                            </span>

                            <span
                                style={{
                                    color:
                                        'var(--musician-muted)',
                                }}
                            >
                                {String(releases.length).padStart(2, '0')}{' '}
                                Tracks
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-10">
                    <div>
                        <div className="flex items-start justify-between gap-4">
                            <p
                                className="text-[7px] font-bold uppercase tracking-[0.28em]"
                                style={{
                                    color:
                                        'var(--musician-accent)',
                                }}
                            >
                                Music Player
                            </p>

                            <span
                                className="border px-2 py-1 text-[6px] uppercase tracking-[0.2em]"
                                style={{
                                    borderColor:
                                        'var(--musician-border)',
                                    color:
                                        'var(--musician-muted)',
                                }}
                            >
                                {activeRelease.release_type ||
                                    'Release'}
                            </span>
                        </div>

                        <h3
                            className="mt-6 text-[clamp(2.4rem,5vw,5.5rem)] font-black uppercase leading-[.78] tracking-[-.07em]"
                            style={{
                                color:
                                    'var(--musician-text)',
                            }}
                        >
                            {activeRelease.title}
                        </h3>

                        <p
                            className="mt-4 text-[8px] font-bold uppercase tracking-[0.24em]"
                            style={{
                                color:
                                    'var(--musician-muted)',
                            }}
                        >
                            {artistName}
                        </p>

                        {activeRelease.description && (
                            <p
                                className="mt-6 max-w-md text-xs leading-6"
                                style={{
                                    color:
                                        'var(--musician-muted)',
                                }}
                            >
                                {activeRelease.description}
                            </p>
                        )}
                    </div>

                    <div className="mt-10">
                        <div className="mb-2 flex items-center justify-between text-[7px] uppercase tracking-[0.18em]">
                            <span
                                style={{
                                    color:
                                        'var(--musician-muted)',
                                }}
                            >
                                00:00
                            </span>
                            <span
                                style={{
                                    color:
                                        'var(--musician-muted)',
                                }}
                            >
                                Audio upload coming soon
                            </span>
                        </div>

                        <div
                            className="h-1 overflow-hidden"
                            style={{
                                backgroundColor:
                                    'color-mix(in srgb, var(--musician-border) 70%, transparent)',
                            }}
                        >
                            <div
                                className="h-full w-0"
                                style={{
                                    backgroundColor:
                                        'var(--musician-accent)',
                                }}
                            />
                        </div>

                        <div className="mt-7 flex items-center justify-center gap-3">
                            <button
                                type="button"
                                onClick={goPrevious}
                                disabled={releases.length < 2}
                                className="flex h-11 w-11 items-center justify-center border text-sm transition disabled:cursor-not-allowed disabled:opacity-30 hover:bg-black/10"
                                style={{
                                    borderColor:
                                        'var(--musician-border)',
                                    color:
                                        'var(--musician-text)',
                                }}
                                aria-label="Previous release"
                            >
                                ‹
                            </button>

                            {streamingLink ? (
                                <a
                                    href={streamingLink.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex h-14 min-w-32 items-center justify-center gap-3 border-2 px-5 transition hover:-translate-y-0.5 hover:bg-black/10"
                                    style={{
                                        borderColor:
                                            'var(--musician-text)',
                                        color:
                                            'var(--musician-text)',
                                    }}
                                    aria-label={`Listen to ${activeRelease.title} on ${streamingLink.label}`}
                                >
                                    <span
                                        className="flex h-7 w-7 items-center justify-center rounded-full border"
                                        style={{
                                            borderColor:
                                                'currentColor',
                                        }}
                                    >
                                        <span className="ml-px border-y-[4px] border-l-[5px] border-y-transparent border-l-current" />
                                    </span>

                                    <span className="text-[7px] font-bold uppercase tracking-[0.22em]">
                                        Listen
                                    </span>
                                </a>
                            ) : (
                                <button
                                    type="button"
                                    disabled
                                    className="flex h-14 min-w-32 cursor-not-allowed items-center justify-center gap-3 border-2 px-5 opacity-40"
                                    style={{
                                        borderColor:
                                            'var(--musician-text)',
                                        color:
                                            'var(--musician-text)',
                                    }}
                                >
                                    <span className="text-[7px] font-bold uppercase tracking-[0.22em]">
                                        No Audio
                                    </span>
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={goNext}
                                disabled={releases.length < 2}
                                className="flex h-11 w-11 items-center justify-center border text-sm transition disabled:cursor-not-allowed disabled:opacity-30 hover:bg-black/10"
                                style={{
                                    borderColor:
                                        'var(--musician-border)',
                                    color:
                                        'var(--musician-text)',
                                }}
                                aria-label="Next release"
                            >
                                ›
                            </button>
                        </div>

                        <div className="mt-7 grid grid-cols-3 border-y">
                            <div
                                className="border-r px-3 py-3"
                                style={{
                                    borderColor:
                                        'var(--musician-border)',
                                }}
                            >
                                <span
                                    className="block text-[6px] uppercase tracking-[0.2em]"
                                    style={{
                                        color:
                                            'var(--musician-muted)',
                                    }}
                                >
                                    Position
                                </span>
                                <span
                                    className="mt-1 block text-xs font-bold"
                                    style={{
                                        color:
                                            'var(--musician-text)',
                                    }}
                                >
                                    {String(activeIndex + 1).padStart(2, '0')}
                                </span>
                            </div>

                            <div
                                className="border-r px-3 py-3"
                                style={{
                                    borderColor:
                                        'var(--musician-border)',
                                }}
                            >
                                <span
                                    className="block text-[6px] uppercase tracking-[0.2em]"
                                    style={{
                                        color:
                                            'var(--musician-muted)',
                                    }}
                                >
                                    Release
                                </span>
                                <span
                                    className="mt-1 block truncate text-xs font-bold uppercase"
                                    style={{
                                        color:
                                            'var(--musician-text)',
                                    }}
                                >
                                    {activeRelease.release_type ||
                                        'Single'}
                                </span>
                            </div>

                            <div className="px-3 py-3">
                                <span
                                    className="block text-[6px] uppercase tracking-[0.2em]"
                                    style={{
                                        color:
                                            'var(--musician-muted)',
                                    }}
                                >
                                    Date
                                </span>
                                <span
                                    className="mt-1 block truncate text-xs font-bold"
                                    style={{
                                        color:
                                            'var(--musician-text)',
                                    }}
                                >
                                    {formatReleaseDate(
                                        activeRelease.release_date,
                                    ) ?? '—'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


{/* Work */ }
function WorkWheelSection({
    profile,
    settings,
    projects,
    getProjectUrl,
}: {
    profile: PortfolioProps['profile'];
    settings: PortfolioProps['profile']['portfolio_settings'];
    projects: PortfolioProject[];
    getProjectUrl: (
        profile: PortfolioProps['profile'],
        project: PortfolioProject,
    ) => string;
}) {
    const [wheelActive, setWheelActive] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [viewportWidth, setViewportWidth] = useState(0);
    const dragStartX = useRef<number | null>(null);
    const wheelLocked = useRef(false);
    const workWheelRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const updateViewportWidth = () => {
            setViewportWidth(window.innerWidth);
        };

        updateViewportWidth();
        window.addEventListener('resize', updateViewportWidth);

        return () => {
            window.removeEventListener(
                'resize',
                updateViewportWidth,
            );
        };
    }, []);

    const lockWheel = () => {
        wheelLocked.current = true;
        window.setTimeout(() => {
            wheelLocked.current = false;
        }, 720);
    };

    const moveWheel = (direction: 1 | -1) => {
        if (wheelLocked.current) {
            return;
        }

        const nextIndex = activeIndex + direction;

        if (nextIndex < 0) {
            setWheelActive(false);
            setActiveIndex(0);
            return;
        }

        if (nextIndex >= projects.length) {
            setWheelActive(false);
            setActiveIndex(projects.length - 1);
            return;
        }

        setActiveIndex(nextIndex);
        lockWheel();
    };

    const handleWheel = (delta: number) => {
        if (Math.abs(delta) < 2) {
            return;
        }

        if (!wheelActive) {
            if (delta > 0) {
                setWheelActive(true);
                setActiveIndex(0);
                lockWheel();
            }

            return;
        }

        if (
            (delta < 0 && activeIndex === 0) ||
            (delta > 0 && activeIndex === projects.length - 1)
        ) {
            setWheelActive(false);
            if (delta < 0) {
                setActiveIndex(0);
            }
            return;
        }

        moveWheel(delta > 0 ? 1 : -1);
    };

    useEffect(() => {
        const element = workWheelRef.current;

        if (!element) {
            return;
        }

        const handleNativeWheel = (event: WheelEvent) => {
            const delta = event.deltaY;

            if (Math.abs(delta) < 2) {
                return;
            }

            // Keep the page from moving while the Work wheel owns the scroll.
            // The next wheel event after reaching an edge is allowed to leave
            // the section.
            if (wheelActive || delta > 0) {
                event.preventDefault();
            }

            handleWheel(delta);
        };

        element.addEventListener('wheel', handleNativeWheel, {
            passive: false,
        });

        return () => {
            element.removeEventListener('wheel', handleNativeWheel);
        };
    }, [wheelActive, activeIndex, projects.length]);

    const handlePointerDown = (
        event: React.PointerEvent<HTMLDivElement>,
    ) => {
        dragStartX.current = event.clientX;
        // Do not capture the pointer yet. A simple press/release
        // must remain a normal button click so the lightbox opens.
        setIsDragging(true);
    };

    const handlePointerMove = (
        event: React.PointerEvent<HTMLDivElement>,
    ) => {
        if (!isDragging || dragStartX.current === null) {
            return;
        }

        const distance = event.clientX - dragStartX.current;

        if (Math.abs(distance) < 55) {
            return;
        }

        if (!wheelActive) {
            setWheelActive(true);
            setActiveIndex(0);
        }

        moveWheel(distance < 0 ? 1 : -1);
        dragStartX.current = event.clientX;
    };

    const handlePointerUp = (
        event: React.PointerEvent<HTMLDivElement>,
    ) => {
        dragStartX.current = null;
        setIsDragging(false);

        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }
    };

    const isMobile = viewportWidth > 0 && viewportWidth < 640;
    const isTablet =
        viewportWidth >= 640 && viewportWidth < 1024;

    const wheelSize = isMobile
        ? 125
        : isTablet
            ? 170
            : projects.length > 1
                ? Math.min(
                    300,
                    Math.max(
                        190,
                        270 - projects.length * 7,
                    ),
                )
                : 240;

    const drumStep = isMobile
        ? 135
        : isTablet
            ? 165
            : 205;

    const workCardWidth = isMobile
        ? 'min(86vw, 360px)'
        : isTablet
            ? 'min(78vw, 400px)'
            : 'min(72vw, 430px)';

    return (
        <section
            id="work"
            className="musician-poster-section border-b px-4 py-12 sm:px-7 sm:py-20 lg:px-10"
            style={{
                borderColor: settings.border_color,
            }}
        >
            <div className="mx-auto max-w-[1440px]">
                <div
                    className="mb-8 flex flex-col gap-4 border-b-2 pb-5 sm:flex-row sm:items-end sm:justify-between"
                    style={{
                        borderColor: settings.text_color,
                    }}
                >
                    <div>
                        <p
                            className="text-[7px] font-bold uppercase tracking-[0.3em]"
                            style={{
                                color: settings.accent_color,
                            }}
                        >
                            02 / Visual Work
                        </p>

                        <h2
                            className="musician-section-title mt-3"
                            style={{
                                color: settings.text_color,
                            }}
                        >
                            {settings.work_label || 'Work'}
                        </h2>
                    </div>

                    {settings.work_description && (
                        <p
                            className="max-w-md text-xs leading-6"
                            style={{
                                color: settings.muted_text_color,
                            }}
                        >
                            {settings.work_description}
                        </p>
                    )}
                </div>

                <div
                    className={`relative overflow-hidden border-2 ${wheelActive
                        ? 'cursor-grab active:cursor-grabbing'
                        : ''
                        }`}
                    style={{
                        borderColor: settings.text_color,
                        backgroundColor: settings.background_color,
                    }}
                    ref={workWheelRef}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                >
                    <div className="relative min-h-[500px] select-none overflow-hidden sm:min-h-[620px] lg:min-h-[780px]">
                        <div className="pointer-events-none absolute inset-0">
                            <div
                                className="absolute left-1/2 top-1/2 h-px w-[72%] -translate-x-1/2"
                                style={{
                                    backgroundColor:
                                        settings.border_color,
                                    opacity: 0.32,
                                }}
                            />

                            <div
                                className="absolute left-1/2 top-1/2 h-[72%] w-px -translate-x-1/2 -translate-y-1/2"
                                style={{
                                    backgroundColor:
                                        settings.border_color,
                                    opacity: 0.22,
                                }}
                            />

                            <div
                                className="absolute left-1/2 top-1/2 h-[min(68vw,620px)] w-[min(68vw,620px)] -translate-x-1/2 -translate-y-1/2 rounded-full border"
                                style={{
                                    borderColor:
                                        settings.border_color,
                                    opacity: wheelActive ? 0.08 : 0.2,
                                    transform: `translate(-50%, -50%) scale(${wheelActive ? 0.74 : 1})`,
                                    transition:
                                        'transform 900ms cubic-bezier(.16,1,.3,1), opacity 900ms ease',
                                }}
                            />
                        </div>

                        <div className="absolute left-4 top-4 z-30 border px-3 py-2 sm:left-6 sm:top-6">
                            <span
                                className="text-[7px] font-bold uppercase tracking-[0.24em]"
                                style={{
                                    color: settings.text_color,
                                }}
                            >
                                {wheelActive
                                    ? 'Scroll / Drag'
                                    : 'Scroll to Explore'}
                            </span>
                        </div>

                        <div className="absolute right-4 top-4 z-30 text-right sm:right-6 sm:top-6">
                            <span
                                className="block text-[7px] uppercase tracking-[0.2em]"
                                style={{
                                    color: settings.muted_text_color,
                                }}
                            >
                                {String(activeIndex + 1).padStart(2, '0')} /{' '}
                                {String(projects.length).padStart(2, '0')}
                            </span>
                        </div>

                        <div
                            className="absolute left-1/2 top-1/2 h-[460px] w-full max-w-[900px] -translate-x-1/2 -translate-y-1/2 [perspective:1200px] sm:h-[560px]"
                            style={{
                                touchAction: 'pan-y',
                            }}
                        >
                            {projects.map((project, index) => {
                                const image = getAssetUrl(
                                    project.thumbnail,
                                );

                                const count = projects.length;
                                const angle =
                                    (360 / count) * index - 90;

                                const relative =
                                    index - activeIndex;

                                let transform: string;
                                let opacity: number;
                                let zIndex: number;

                                if (!wheelActive) {
                                    transform = `
                                        rotate(${angle}deg)
                                        translateY(-${wheelSize}px)
                                        rotate(${-angle}deg)
                                        scale(.78)
                                    `;
                                    opacity = 1;
                                    zIndex = 10;
                                } else {
                                    const distance =
                                        Math.abs(relative);

                                    transform = `
                                        translate3d(
                                            0,
                                            ${relative * drumStep}px,
                                            ${relative === 0 ? 80 : -distance * 70}px
                                        )
                                        rotateX(${relative * -14}deg)
                                        rotateZ(${relative * 1.8}deg)
                                        scale(${relative === 0 ? 1 : Math.max(.56, 1 - distance * .13)})
                                    `;

                                    opacity =
                                        distance > 3
                                            ? 0
                                            : Math.max(
                                                0.18,
                                                1 -
                                                distance *
                                                0.22,
                                            );

                                    zIndex =
                                        30 - distance;
                                }

                                return (
                                    <a
                                        key={project.id}
                                        href={getProjectUrl(
                                            profile,
                                            project,
                                        )}
                                        className="group absolute left-1/2 top-1/2 block -translate-x-1/2 -translate-y-1/2"
                                        style={{
                                            transform,
                                            opacity,
                                            zIndex,
                                            width: workCardWidth,
                                            transition:
                                                'transform 900ms cubic-bezier(.16,1,.3,1), opacity 650ms ease, filter 650ms ease',
                                            filter:
                                                wheelActive &&
                                                    index !==
                                                    activeIndex
                                                    ? 'brightness(.58)'
                                                    : 'brightness(1)',
                                            pointerEvents:
                                                opacity < 0.08
                                                    ? 'none'
                                                    : 'auto',
                                        }}
                                        aria-label={`View ${project.title}`}
                                    >
                                        <div
                                            className={`relative overflow-hidden border-2 ${wheelActive &&
                                                index ===
                                                activeIndex
                                                ? 'shadow-[18px_18px_0_rgba(255,255,255,.08)]'
                                                : ''
                                                }`}
                                            style={{
                                                borderColor:
                                                    settings.text_color,
                                                backgroundColor:
                                                    settings.surface_color,
                                                aspectRatio:
                                                    wheelActive
                                                        ? '4 / 3'
                                                        : '1 / 1',
                                                transition:
                                                    'aspect-ratio 900ms cubic-bezier(.16,1,.3,1), box-shadow 650ms ease',
                                            }}
                                        >
                                            {image ? (
                                                <img
                                                    src={image}
                                                    alt={project.title}
                                                    className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.035]"
                                                    style={{
                                                        objectPosition: `${project.thumbnail_position_x ?? 50}% ${project.thumbnail_position_y ?? 50}%`,
                                                    }}
                                                    draggable={false}
                                                />
                                            ) : (
                                                <div
                                                    className="flex h-full w-full items-center justify-center"
                                                    style={{
                                                        backgroundColor:
                                                            settings.surface_color,
                                                    }}
                                                >
                                                    <span
                                                        className="text-[8px] font-bold uppercase tracking-[0.3em]"
                                                        style={{
                                                            color: settings.text_color,
                                                        }}
                                                    >
                                                        {project.title}
                                                    </span>
                                                </div>
                                            )}

                                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />

                                            <div className="absolute left-4 top-4 border px-3 py-2">
                                                <span className="text-[7px] font-bold uppercase tracking-[0.2em] text-white">
                                                    {String(
                                                        index + 1,
                                                    ).padStart(
                                                        2,
                                                        '0',
                                                    )}{' '}
                                                    /{' '}
                                                    {project.project_type ||
                                                        'Visual'}
                                                </span>
                                            </div>

                                            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                                                <h3 className="text-xl font-black uppercase leading-[.88] tracking-[-.05em] text-white sm:text-3xl lg:text-4xl">
                                                    {project.title}
                                                </h3>

                                                {wheelActive &&
                                                    index ===
                                                    activeIndex && (
                                                        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
                                                            <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-white sm:text-[10px]">
                                                                View Project
                                                            </span>

                                                            <span className="text-sm text-white">
                                                                ↗
                                                            </span>
                                                        </div>
                                                    )}
                                            </div>
                                        </div>
                                    </a>
                                );
                            })}
                        </div>

                        <div
                            className="pointer-events-none absolute bottom-5 left-1/2 z-30 -translate-x-1/2 text-center"
                            style={{
                                color: settings.muted_text_color,
                            }}
                        >
                            <span className="text-[7px] uppercase tracking-[0.22em]">
                                {wheelActive
                                    ? projects[activeIndex]?.title
                                    : `${projects.length} works`}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}


function LiquidGlassEditorialGallery({
    images,
    showTitle,
    settings,
    onOpen,
}: {
    images: GalleryImage[];
    showTitle: boolean;
    settings: PortfolioProps['profile']['portfolio_settings'];
    onOpen: (index: number) => void;
}) {
    const items = images
        .map((image) => {
            const src = getAssetUrl(image.image);

            if (!src) {
                return null;
            }

            return {
                src,
                title: showTitle
                    ? image.title || 'Untitled'
                    : '',
            };
        })
        .filter(
            (
                item,
            ): item is {
                src: string;
                title: string;
            } => item !== null,
        );

    if (items.length === 0) {
        return null;
    }

    return (
        <div className="h-[68svh] min-h-[420px] max-h-[720px] w-full">
            <LiquidGlassCarouselComponent
                items={items}
                panelHeight={450}
                gap={12}
                // background={settings.surface_color}
                background="#ffffff"
                accentColor={settings.accent_color}
                textColor="#000000"
                mutedTextColor={settings.muted_text_color}
                entry={false}
                onItemClick={(index) => {
                    onOpen(index);
                }}
                className="h-full w-full"
            />
        </div>
    );
}

function GalleryCard({
    image,
    index,
    onOpen,
    showTitle,
    showCaption,
}: {
    image: GalleryImage;
    index: number;
    onOpen: () => void;
    showTitle: boolean;
    showCaption: boolean;
}) {
    const src = getAssetUrl(image.image);

    if (!src) {
        return null;
    }

    return (
        <button
            type="button"
            onClick={onOpen}
            data-gallery-index={String(index + 1).padStart(2, '0')}
            className="musician-gallery-card group relative overflow-hidden border text-left"
            style={{
                borderColor: 'var(--musician-border)',
                backgroundColor: 'var(--musician-surface)',
            }}
        >
            <div className="musician-gallery-image-frame overflow-hidden">
                <img
                    src={src}
                    alt={
                        image.alt_text ||
                        image.title ||
                        'Gallery image'
                    }
                    className="musician-gallery-image h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                    draggable={false}
                />
            </div>

            {(showTitle || showCaption) && (
                <div
                    className="musician-gallery-meta border-t px-4 py-3"
                    style={{
                        borderColor: 'var(--musician-border)',
                    }}
                >
                    {showTitle && image.title && (
                        <p
                            className="text-xs font-medium"
                            style={{
                                color: 'var(--musician-card-text)',
                            }}
                        >
                            {image.title}
                        </p>
                    )}

                    {showCaption && image.caption && (
                        <p
                            className={`text-[9px] leading-4 ${image.title ? 'mt-1' : ''
                                }`}
                            style={{
                                color: 'var(--musician-muted)',
                            }}
                        >
                            {image.caption}
                        </p>
                    )}
                </div>
            )}

            <span
                className="musician-gallery-index pointer-events-none absolute right-3 top-3 border px-2 py-1 text-[7px] uppercase tracking-[0.2em] opacity-0 backdrop-blur-sm transition group-hover:opacity-100"
                style={{
                    borderColor: 'rgba(255,255,255,.35)',
                    backgroundColor: 'rgba(0,0,0,.35)',
                    color: '#fff',
                }}
            >
                {String(index + 1).padStart(2, '0')}
            </span>
        </button>
    );
}


function MusicianFreeformGallery({
    images,
    showTitle,
    showCaption,
    onOpen,
}: {
    images: GalleryImage[];
    showTitle: boolean;
    showCaption: boolean;
    onOpen: (index: number) => void;
}) {
    const [rotation, setRotation] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const dragStartX = useRef<number | null>(null);
    const dragStartY = useRef<number | null>(null);
    const lastDragX = useRef<number | null>(null);
    const suppressClick = useRef(false);
    const draggingAxis = useRef<'horizontal' | null>(null);
    const formationRef = useRef<HTMLDivElement | null>(null);

    const handlePointerDown = (
        event: React.PointerEvent<HTMLDivElement>,
    ) => {
        if (event.pointerType === 'mouse' && event.button !== 0) {
            return;
        }

        dragStartX.current = event.clientX;
        dragStartY.current = event.clientY;
        lastDragX.current = event.clientX;
        draggingAxis.current = null;
        suppressClick.current = false;

        setIsDragging(true);
        // Do not capture the pointer on pointerdown. The event may have
        // originated from the GalleryCard button, and capturing it here
        // can prevent a normal desktop click from reaching the button.
        // Pointer capture is applied only after a real horizontal drag
        // has been detected in handlePointerMove.
    };

    const handlePointerMove = (
        event: React.PointerEvent<HTMLDivElement>,
    ) => {
        if (
            !isDragging ||
            dragStartX.current === null ||
            dragStartY.current === null ||
            lastDragX.current === null
        ) {
            return;
        }

        const totalX =
            event.clientX - dragStartX.current;
        const totalY =
            event.clientY - dragStartY.current;

        if (!draggingAxis.current) {
            if (
                Math.max(
                    Math.abs(totalX),
                    Math.abs(totalY),
                ) < 8
            ) {
                return;
            }

            if (Math.abs(totalX) < Math.abs(totalY)) {
                return;
            }

            draggingAxis.current = 'horizontal';

            // Capture the pointer only after a real horizontal drag
            // has been detected. Keeping the initial pointer down on
            // the image/button allows a normal click to fire.
            if (
                !event.currentTarget.hasPointerCapture(
                    event.pointerId,
                )
            ) {
                event.currentTarget.setPointerCapture(
                    event.pointerId,
                );
            }
        }

        const deltaX =
            event.clientX - lastDragX.current;

        if (Math.abs(deltaX) < 0.5) {
            return;
        }

        suppressClick.current = true;

        setRotation((current) => current + deltaX * 0.42);
        lastDragX.current = event.clientX;
    };

    const handlePointerUp = (
        event: React.PointerEvent<HTMLDivElement>,
    ) => {
        dragStartX.current = null;
        dragStartY.current = null;
        lastDragX.current = null;
        draggingAxis.current = null;
        setIsDragging(false);

        if (
            event.currentTarget.hasPointerCapture(
                event.pointerId,
            )
        ) {
            event.currentTarget.releasePointerCapture(
                event.pointerId,
            );
        }

        window.setTimeout(() => {
            suppressClick.current = false;
        }, 80);
    };

    const ringCount = Math.max(images.length, 1);
    const ringRadiusX = 35;
    const ringRadiusY = 28;

    return (
        <div
            ref={formationRef}
            className={`musician-formation ${isDragging
                ? 'is-dragging'
                : ''
                }`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
        >
            <div className="musician-formation-stage">
                {images.map((image, index) => {
                    // Keep the front-most image centered.
                    // The depth axis controls front/back while the
                    // horizontal axis follows the circular formation.
                    const angle =
                        rotation +
                        (index * 360) / ringCount;

                    const radians =
                        (angle * Math.PI) / 180;

                    const depth =
                        (Math.cos(radians) + 1) / 2;

                    const x =
                        Math.sin(radians) *
                        ringRadiusX;

                    const y =
                        Math.cos(radians) *
                        ringRadiusY;

                    const scale =
                        0.76 +
                        depth * 0.27;

                    const z =
                        depth * 280 - 140;

                    const rotate =
                        -Math.sin(radians) * 7;

                    return (
                        <div
                            key={`formation-${image.id}`}
                            className="musician-formation-item"
                            onClickCapture={(event) => {
                                // Handle the click at the formation-item level so
                                // transformed desktop cards always have a reliable
                                // lightbox hit target.
                                if (suppressClick.current) {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    suppressClick.current = false;
                                    return;
                                }

                                event.preventDefault();
                                event.stopPropagation();
                                onOpen(index);
                            }}
                            style={{
                                '--formation-x': `${x}%`,
                                '--formation-y': `${y}%`,
                                '--formation-z': `${z}px`,
                                '--formation-rotate': `${rotate}deg`,
                                '--formation-scale': scale,
                                zIndex: Math.round(
                                    depth * 100,
                                ),
                            } as CSSProperties}
                        >
                            <div className="musician-formation-card">
                                <GalleryCard
                                    image={image}
                                    index={index}
                                    onOpen={() => { }}
                                    // Freeform shows image-only cards.
                                    // Title and caption are shown in the lightbox.
                                    showTitle={false}
                                    showCaption={false}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="musician-formation-hint">
                <span>Drag to Rotate</span>
            </div>
        </div>
    );
}
export default function MusicianTemplate({
    profile,
}: PortfolioProps) {
    const settings = profile.portfolio_settings;

    const navigationSettings =
        settings as typeof settings & NavigationSettings;

    const gallerySettings =
        settings as typeof settings & GallerySettings;

    const galleryImages = (
        gallerySettings.gallery_images ?? []
    ).filter((image) => Boolean(image.image));

    const savedNavigationItems = (
        navigationSettings.navigation_items ?? []
    )
        .filter((item) =>
            isNavigationItemAvailable(
                item,
                profile,
                galleryImages,
            ),
        )
        .sort((a, b) => a.sort_order - b.sort_order);

    const navigationItems: NavigationItem[] =
        savedNavigationItems.length > 0
            ? savedNavigationItems
            : [
                {
                    id: -1,
                    label: 'Music',
                    destination: 'music',
                    url: null,
                    sort_order: 0,
                    is_visible: true,
                },
                ...(settings.show_work &&
                    profile.projects.length > 0
                    ? [
                        {
                            id: -2,
                            label: 'Work',
                            destination: 'work',
                            url: null,
                            sort_order: 1,
                            is_visible: true,
                        },
                    ]
                    : []),
                ...(settings.show_about
                    ? [
                        {
                            id: -3,
                            label: 'About',
                            destination: 'about',
                            url: null,
                            sort_order: 2,
                            is_visible: true,
                        },
                    ]
                    : []),
                ...(settings.show_gallery &&
                    galleryImages.length > 0
                    ? [
                        {
                            id: -4,
                            label: 'Gallery',
                            destination: 'gallery',
                            url: null,
                            sort_order: 3,
                            is_visible: true,
                        },
                    ]
                    : []),
            ];

    const releases =
        settings.music_release_display === 'all'
            ? profile.releases
            : profile.releases.slice(
                0,
                Math.max(1, settings.music_release_limit ?? 6),
            );

    const featuredRelease =
        releases.find(
            (release) =>
                release.id === settings.featured_release_id,
        ) ?? releases[0] ?? null;

    const secondaryReleases = featuredRelease
        ? releases.filter(
            (release) =>
                release.id !== featuredRelease.id,
        )
        : [];

    const heroRelease =
        settings.show_music
            ? featuredRelease ?? profile.releases[0] ?? null
            : null;

    // Match the Settings preview source exactly.
    const coverImage =
        getAssetUrl(settings.cover_image) ??
        getAssetUrl(profile.cover_image);

    const profileImage = getAssetUrl(profile.avatar);

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] =
        useState<number | null>(null);
    const [activeReleaseId, setActiveReleaseId] =
        useState<number | null>(
            featuredRelease?.id ??
            releases[0]?.id ??
            null,
        );

    useEffect(() => {
        if (releases.length === 0) {
            setActiveReleaseId(null);
            return;
        }

        if (
            activeReleaseId === null ||
            !releases.some(
                (release) =>
                    release.id === activeReleaseId,
            )
        ) {
            setActiveReleaseId(
                featuredRelease?.id ??
                releases[0]?.id ??
                null,
            );
        }
    }, [
        activeReleaseId,
        featuredRelease?.id,
        releases,
    ]);

    const currentLightboxImage =
        lightboxIndex !== null
            ? galleryImages[lightboxIndex] ?? null
            : null;

    const galleryResponsive =
        gallerySettings.gallery_responsive ?? null;

    const desktopGallery: Required<GalleryResponsive> = {
        display:
            galleryResponsive?.desktop?.display ??
            'grid',
        columns: Math.min(
            Math.max(
                Number(
                    galleryResponsive?.desktop?.columns ??
                    settings.gallery_columns ??
                    3,
                ),
                2,
            ),
            4,
        ),
        image_aspect:
            galleryResponsive?.desktop?.image_aspect ??
            'original',
    };

    const tabletGallery: Required<GalleryResponsive> = {
        display:
            galleryResponsive?.tablet?.display ??
            desktopGallery.display,
        columns: Math.min(
            Math.max(
                Number(
                    galleryResponsive?.tablet?.columns ??
                    desktopGallery.columns,
                ),
                2,
            ),
            4,
        ),
        image_aspect:
            galleryResponsive?.tablet?.image_aspect ??
            desktopGallery.image_aspect,
    };

    const mobileGallery: Required<GalleryResponsive> = {
        display:
            galleryResponsive?.mobile?.display ??
            tabletGallery.display,
        columns: Math.min(
            Math.max(
                Number(
                    galleryResponsive?.mobile?.columns ??
                    Math.min(tabletGallery.columns, 2),
                ),
                1,
            ),
            2,
        ),
        image_aspect:
            galleryResponsive?.mobile?.image_aspect ??
            tabletGallery.image_aspect,
    };

    const desktopAspect = getGalleryAspectRatio(
        desktopGallery.image_aspect,
    );
    const tabletAspect = getGalleryAspectRatio(
        tabletGallery.image_aspect,
    );
    const mobileAspect = getGalleryAspectRatio(
        mobileGallery.image_aspect,
    );

    const pageStyle = {
        backgroundColor: settings.background_color,
        color: settings.text_color,
        '--musician-bg': settings.background_color,
        '--musician-text': settings.text_color,
        '--musician-primary': settings.primary_color,
        '--musician-accent': settings.accent_color,
        '--musician-hover': settings.hover_color,
        '--musician-surface': settings.surface_color,
        '--musician-muted': settings.muted_text_color,
        '--musician-border': settings.border_color,
        '--musician-card-text': settings.card_text_color,
    } as CSSProperties;

    const getNavigationHref = (item: NavigationItem) => {
        switch (item.destination) {
            case 'home':
                return '#top';
            case 'work':
                return '#work';
            case 'music':
                return '#music';
            case 'about':
                return '#about';
            case 'artist_message':
                return '#artist-message';
            case 'gallery':
                return '#gallery';
            case 'footer':
                return '#footer';
            case 'external':
                return item.url ?? '#';
            default:
                return '#top';
        }
    };

    const closeLightbox = () => {
        setLightboxIndex(null);
    };

    const showPreviousImage = () => {
        if (lightboxIndex === null || galleryImages.length === 0) {
            return;
        }

        setLightboxIndex(
            lightboxIndex === 0
                ? galleryImages.length - 1
                : lightboxIndex - 1,
        );
    };

    const showNextImage = () => {
        if (lightboxIndex === null || galleryImages.length === 0) {
            return;
        }

        setLightboxIndex(
            lightboxIndex === galleryImages.length - 1
                ? 0
                : lightboxIndex + 1,
        );
    };

    useEffect(() => {
        if (lightboxIndex === null) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                closeLightbox();
            }

            if (event.key === 'ArrowLeft') {
                showPreviousImage();
            }

            if (event.key === 'ArrowRight') {
                showNextImage();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () =>
            window.removeEventListener(
                'keydown',
                handleKeyDown,
            );
    }, [lightboxIndex, galleryImages.length]);

    useEffect(() => {
        if (lightboxIndex === null) {
            return;
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [lightboxIndex]);

    const heroStatement =
        settings.hero_statement?.trim() ||
        profile.bio?.trim() ||
        'Sound, identity, and movement.';

    const artistLabel =
        profile.artist_type ||
        settings.hero_label ||
        'Independent Artist';

    const latestReleaseDate = featuredRelease
        ? formatReleaseDate(featuredRelease.release_date)
        : null;

    const visibleProjects = profile.projects;

    const releaseCountLabel =
        releases.length === 1 ? 'Release' : 'Releases';

    const sectionStyle = {
        borderColor: settings.border_color,
    };

    const faviconUrl = settings.footer_logo ? `/storage/${settings.footer_logo}` : '/images/brand/Lira_logo.png';

    const socialLinks = (profile.social_links ?? []).filter(
        (link) => link.is_visible && link.url,
    );

    return (
        <>
            <Head>
                <link rel="icon" type="image/png" href={faviconUrl} />
            </Head>
            <main
                id="top"
                className="musician-template min-h-screen overflow-x-hidden"
                style={pageStyle}
            >
                <style>{`
                .musician-template {
                    --musician-line: color-mix(
                        in srgb,
                        var(--musician-border) 70%,
                        transparent
                    );
                    background:
                        linear-gradient(
                            135deg,
                            color-mix(
                                in srgb,
                                var(--musician-primary) 12%,
                                var(--musician-bg)
                            ),
                            var(--musician-bg) 48%,
                            color-mix(
                                in srgb,
                                var(--musician-accent) 9%,
                                var(--musician-bg)
                            )
                        );
                }

                .musician-template a,
                .musician-template button {
                    -webkit-tap-highlight-color: transparent;
                }

                .musician-poster-nav {
                    background:
                        color-mix(
                            in srgb,
                            var(--musician-bg) 88%,
                            black
                        );
                    border-bottom: 1px solid
                        color-mix(
                            in srgb,
                            var(--musician-border) 78%,
                            black
                        );
                    box-shadow: 0 10px 35px rgba(0, 0, 0, .24);
                }

                .musician-poster-nav::after {
                    content: '';
                    position: absolute;
                    left: 0;
                    right: 0;
                    bottom: -4px;
                    height: 4px;
                    background:
                        linear-gradient(
                            90deg,
                            transparent,
                            var(--musician-accent) 18%,
                            var(--musician-text) 50%,
                            var(--musician-accent) 82%,
                            transparent
                        );
                    opacity: .7;
                }

                .musician-poster-hero {
                    position: relative;
                    isolation: isolate;
                    background:
                        linear-gradient(
                            135deg,
                            color-mix(
                                in srgb,
                                var(--musician-primary) 82%,
                                var(--musician-bg)
                            ),
                            color-mix(
                                in srgb,
                                var(--musician-accent) 58%,
                                var(--musician-primary)
                            ) 52%,
                            color-mix(
                                in srgb,
                                var(--musician-primary) 45%,
                                var(--musician-bg)
                            )
                        );
                }

                .musician-poster-hero::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    z-index: -1;
                    background:
                        linear-gradient(
                            90deg,
                            transparent 0 76%,
                            color-mix(
                                in srgb,
                                var(--musician-text) 12%,
                                transparent
                            ) 76% 77%,
                            transparent 77%
                        ),
                        radial-gradient(
                            circle at 16% 18%,
                            color-mix(
                                in srgb,
                                var(--musician-text) 18%,
                                transparent
                            ) 0 1px,
                            transparent 2px
                        );
                    background-size: auto, 18px 18px;
                    opacity: .65;
                }

                .musician-poster-hero::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    z-index: -1;
                    background:
                        linear-gradient(
                            90deg,
                            color-mix(
                                in srgb,
                                var(--musician-bg) 24%,
                                transparent
                            ) 0%,
                            transparent 42%,
                            color-mix(
                                in srgb,
                                var(--musician-bg) 10%,
                                transparent
                            ) 100%
                        ),
                        linear-gradient(
                            180deg,
                            transparent 54%,
                            color-mix(
                                in srgb,
                                var(--musician-bg) 42%,
                                transparent
                            ) 100%
                        ),
                        radial-gradient(
                            ellipse at center,
                            transparent 48%,
                            color-mix(
                                in srgb,
                                var(--musician-bg) 22%,
                                transparent
                            ) 100%
                        );
                    pointer-events: none;
                }

                .musician-poster-frame {
                    position: relative;
                    border: 2px solid var(--musician-text);
                    background: var(--musician-bg);
                    box-shadow:
                        18px 18px 0
                        color-mix(
                            in srgb,
                            var(--musician-primary) 62%,
                            transparent
                        );
                }

                .musician-poster-frame::before {
                    content: '';
                    position: absolute;
                    inset: -.75rem -.65rem;
                    border: 1px solid
                        color-mix(
                            in srgb,
                            var(--musician-text) 65%,
                            transparent
                        );
                    pointer-events: none;
                }

                .musician-poster-x {
                    position: absolute;
                    width: 58px;
                    height: 58px;
                    border: 4px solid var(--musician-text);
                    transform: rotate(45deg);
                    z-index: 4;
                    pointer-events: none;
                }

                .musician-poster-x::after {
                    content: '';
                    position: absolute;
                    inset: -4px;
                    border: 4px solid
                        color-mix(
                            in srgb,
                            var(--musician-text) 65%,
                            transparent
                        );
                    transform: rotate(90deg);
                }

                .musician-poster-dots {
                    width: 78px;
                    height: 78px;
                    background-image:
                        radial-gradient(
                            circle,
                            var(--musician-text) 1.7px,
                            transparent 2px
                        );
                    background-size: 16px 16px;
                    opacity: .55;
                    pointer-events: none;
                }

                .musician-poster-block {
                    background: var(--musician-bg);
                    border: 1px solid var(--musician-border);
                }

                .musician-poster-section {
                    position: relative;
                    border-bottom: 1px solid var(--musician-border);
                    background:
                        linear-gradient(
                            135deg,
                            color-mix(
                                in srgb,
                                var(--musician-primary) 7%,
                                var(--musician-bg)
                            ),
                            var(--musician-bg) 58%,
                            color-mix(
                                in srgb,
                                var(--musician-accent) 6%,
                                var(--musician-bg)
                            )
                        );
                }

                .musician-section-title {
                    font-size: clamp(3rem, 8vw, 7rem);
                    line-height: .78;
                    letter-spacing: -.075em;
                    font-weight: 900;
                    text-transform: uppercase;
                }

                .musician-release-card {
                    position: relative;
                    border: 1px solid var(--musician-border);
                    background: var(--musician-surface);
                    transition:
                        transform 400ms cubic-bezier(.22,1,.36,1),
                        box-shadow 400ms cubic-bezier(.22,1,.36,1);
                }

                .musician-release-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 12px 12px 0
                        color-mix(
                            in srgb,
                            var(--musician-primary) 38%,
                            transparent
                        );
                }

                .musician-release-art {
                    border-bottom: 1px solid var(--musician-border);
                }

                .musician-about {
                    background:
                        linear-gradient(
                            90deg,
                            color-mix(
                                in srgb,
                                var(--musician-primary) 18%,
                                var(--musician-bg)
                            ),
                            var(--musician-bg) 50%,
                            color-mix(
                                in srgb,
                                var(--musician-accent) 10%,
                                var(--musician-bg)
                            )
                        );
                }

                .musician-about-image {
                    position: relative;
                    border: 2px solid var(--musician-text);
                }

                .musician-about-image::after {
                    content: '';
                    position: absolute;
                    inset: 10px;
                    border: 1px solid
                        color-mix(
                            in srgb,
                            var(--musician-text) 70%,
                            transparent
                        );
                    pointer-events: none;
                }

                .musician-footer-poster {
                    position: relative;
                    overflow: hidden;
                    background:
                        linear-gradient(
                            135deg,
                            color-mix(
                                in srgb,
                                var(--musician-primary) 72%,
                                var(--musician-bg)
                            ),
                            color-mix(
                                in srgb,
                                var(--musician-accent) 52%,
                                var(--musician-primary)
                            )
                        );
                }

                .musician-footer-poster::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background:
                        repeating-linear-gradient(
                            90deg,
                            transparent 0 42px,
                            color-mix(
                                in srgb,
                                var(--musician-text) 9%,
                                transparent
                            ) 42px 43px
                        );
                    pointer-events: none;
                }

                .musician-footer-x {
                    position: absolute;
                    width: 110px;
                    height: 110px;
                    border: 7px solid var(--musician-text);
                    transform: rotate(45deg);
                    opacity: .55;
                    pointer-events: none;
                }

                .musician-footer-x::after {
                    content: '';
                    position: absolute;
                    inset: -7px;
                    border: 7px solid
                        color-mix(
                            in srgb,
                            var(--musician-text) 65%,
                            transparent
                        );
                    transform: rotate(90deg);
                }

                .musician-gallery-poster {
                    position: relative;
                }

                .musician-gallery-poster::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                    background:
                        linear-gradient(
                            90deg,
                            transparent 0 24%,
                            color-mix(
                                in srgb,
                                var(--musician-text) 7%,
                                transparent
                            ) 24% 24.2%,
                            transparent 24.2%
                        );
                    opacity: .7;
                }

                .musician-gallery [data-gallery-layout] {
                    display: none !important;
                }

                /* Desktop gallery display */
                .musician-gallery[data-desktop-display="grid"]
                [data-gallery-layout="grid"] {
                    display: grid !important;
                }

                .musician-gallery[data-desktop-display="masonry"]
                [data-gallery-layout="masonry"] {
                    display: block !important;
                }

                .musician-gallery[data-desktop-display="editorial"]
                [data-gallery-layout="editorial"] {
                    display: block !important;
                }


                .musician-gallery[data-desktop-display="freeform"]
                [data-gallery-layout="freeform"] {
                    display: block !important;
                }

                .musician-freeform-scroll-scene {
                    position: relative;
                    /* The scene remains tall enough for the page to release only after placement. */
                    height: 190svh;
                    overscroll-behavior: contain;
                }

                .musician-freeform-stage {
                    --freeform-progress: 0;
                    position: sticky;
                    top: 58px;
                    display: grid;
                    grid-template-columns: repeat(3, minmax(0, 1fr));
                    align-items: center;
                    gap: clamp(12px, 1.5vw, 24px);
                    width: 100%;
                    height: calc(100svh - 58px);
                    min-height: 0;
                    padding: clamp(24px, 4vw, 64px);
                    box-sizing: border-box;
                    perspective: 1800px;
                    transform-style: preserve-3d;
                    overflow: hidden;
                    overscroll-behavior: contain;
                    touch-action: pan-y;
                }

                .musician-freeform-column {
                    display: flex;
                    min-width: 0;
                    flex-direction: column;
                    gap: clamp(12px, 1.5vw, 24px);
                    transform-style: preserve-3d;
                    will-change: transform;
                    transition: none;
                }

                .musician-freeform-column-1 {
                    transform:
                        translate3d(
                            calc((1 - var(--freeform-progress)) * 11vw),
                            calc((1 - var(--freeform-progress)) * -4vh),
                            calc((1 - var(--freeform-progress)) * 160px)
                        )
                        rotateY(
                            calc((1 - var(--freeform-progress)) * 24deg)
                        )
                        rotateZ(
                            calc((1 - var(--freeform-progress)) * -5deg)
                        );
                }

                .musician-freeform-column-2 {
                    transform:
                        translate3d(
                            0,
                            calc((1 - var(--freeform-progress)) * 5vh),
                            calc((1 - var(--freeform-progress)) * -80px)
                        )
                        rotateX(
                            calc((1 - var(--freeform-progress)) * -4deg)
                        );
                }

                .musician-freeform-column-3 {
                    transform:
                        translate3d(
                            calc((1 - var(--freeform-progress)) * -11vw),
                            calc((1 - var(--freeform-progress)) * -2vh),
                            calc((1 - var(--freeform-progress)) * 120px)
                        )
                        rotateY(
                            calc((1 - var(--freeform-progress)) * -24deg)
                        )
                        rotateZ(
                            calc((1 - var(--freeform-progress)) * 5deg)
                        );
                }

                .musician-freeform-column
                .musician-gallery-card {
                    position: relative;
                    display: block;
                    width: 100%;
                    flex: 0 0 auto;
                    overflow: hidden;
                    border: 1px solid var(--musician-border);
                    background: var(--musician-surface);
                    box-shadow:
                        0 24px 70px rgba(0, 0, 0, .22);
                    transform-style: preserve-3d;
                    transition:
                        box-shadow 350ms ease,
                        filter 350ms ease;
                }

                .musician-freeform-column-1
                .musician-gallery-card:nth-child(3n + 1) {
                    transform:
                        translateY(
                            calc((1 - var(--freeform-progress)) * 28px)
                        )
                        rotateZ(
                            calc((1 - var(--freeform-progress)) * -1.5deg)
                        );
                }

                .musician-freeform-column-2
                .musician-gallery-card:nth-child(3n + 1) {
                    transform:
                        translateY(
                            calc((1 - var(--freeform-progress)) * -36px)
                        )
                        rotateZ(
                            calc((1 - var(--freeform-progress)) * 1deg)
                        );
                }

                .musician-freeform-column-3
                .musician-gallery-card:nth-child(3n + 1) {
                    transform:
                        translateY(
                            calc((1 - var(--freeform-progress)) * 42px)
                        )
                        rotateZ(
                            calc((1 - var(--freeform-progress)) * 1.5deg)
                        );
                }

                .musician-freeform-column
                .musician-gallery-card:hover {
                    z-index: 10;
                    transform:
                        translate3d(0, -8px, 70px)
                        scale(1.025);
                    box-shadow:
                        0 34px 90px rgba(0, 0, 0, .34);
                }

                .musician-freeform-column
                .musician-gallery-image-frame {
                    height: clamp(140px, 24svh, 280px);
                    min-height: 0;
                    aspect-ratio: 4 / 3;
                    overflow: hidden;
                    background: var(--musician-surface);
                }

                .musician-freeform-column
                .musician-gallery-image {
                    display: block;
                    width: 100%;
                    height: auto;
                    min-height: 100%;
                    object-fit: cover;
                    transition:
                        transform 900ms cubic-bezier(.22, 1, .36, 1),
                        filter 700ms ease;
                }

                .musician-freeform-column
                .musician-gallery-card:hover
                .musician-gallery-image {
                    transform: scale(1.045);
                }

                .musician-freeform-column
                .musician-gallery-meta {
                    position: absolute;
                    inset: auto 0 0;
                    z-index: 2;
                    padding: 48px 16px 14px;
                    border-top: 0;
                    background:
                        linear-gradient(
                            180deg,
                            transparent 0%,
                            rgba(0, 0, 0, .78) 100%
                        );
                    opacity: .9;
                    pointer-events: none;
                }

                .musician-freeform-column
                .musician-gallery-index {
                    opacity: 0;
                }

                .musician-freeform-column
                .musician-gallery-card:hover
                .musician-gallery-index,
                .musician-freeform-column
                .musician-gallery-card:focus-visible
                .musician-gallery-index {
                    opacity: 1;
                }

                .musician-gallery [data-gallery-layout="grid"] {
                    grid-template-columns:
                        repeat(
                            var(--musician-gallery-desktop-columns),
                            minmax(0, 1fr)
                        );
                    gap: 12px;
                }

                .musician-gallery[data-desktop-display="grid"] .musician-gallery-image-frame {
                    aspect-ratio: var(--musician-gallery-desktop-aspect);
                }

                .musician-gallery[data-desktop-display="grid"] .musician-gallery-card {
                    border: 2px solid var(--musician-border);
                    background: var(--musician-surface);
                }

                .musician-gallery [data-gallery-layout="masonry"] {
                    column-count: var(--musician-gallery-desktop-columns);
                    column-gap: 12px;
                }

                .musician-gallery[data-desktop-display="masonry"] .musician-gallery-card {
                    display: block;
                    width: 100%;
                    margin: 0 0 12px;
                    break-inside: avoid;
                    border: 2px solid var(--musician-border);
                }

                .musician-gallery[data-desktop-display="masonry"] .musician-gallery-image-frame {
                    aspect-ratio: auto;
                }

                .musician-gallery[data-desktop-display="masonry"] .musician-gallery-image {
                    display: block;
                    height: auto;
                    object-fit: contain;
                }

                .musician-gallery[data-desktop-display="editorial"] [data-gallery-layout="editorial"] {
                    display: block;
                }

                .musician-liquid-editorial {
                    position: relative;
                    width: 100%;
                    overflow: hidden;
                    border: 1px solid var(--liquid-border);
                    background:
                        radial-gradient(
                            circle at 50% 48%,
                            color-mix(
                                in srgb,
                                var(--liquid-accent) 7%,
                                transparent
                            ),
                            transparent 38%
                        ),
                        var(--liquid-surface);
                    user-select: none;
                    -webkit-user-select: none;
                }

                .musician-liquid-editorial-head,
                .musician-liquid-editorial-foot {
                    position: relative;
                    z-index: 20;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 1rem;
                    padding: 16px 18px;
                    border-bottom: 1px solid var(--liquid-border);
                    color: var(--liquid-text);
                }

                .musician-liquid-editorial-foot {
                    border-top: 1px solid var(--liquid-border);
                    border-bottom: 0;
                    padding-block: 12px;
                    font-size: 8px;
                    font-weight: 700;
                    letter-spacing: .24em;
                    text-transform: uppercase;
                }

                .musician-liquid-editorial-title {
                    max-width: 65%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    font-size: clamp(10px, 1.1vw, 13px);
                    font-weight: 700;
                    letter-spacing: .08em;
                    text-transform: uppercase;
                }

                .musician-liquid-editorial-hint,
                .musician-liquid-editorial-foot-title {
                    color: var(--liquid-muted);
                    font-size: 7px;
                    font-weight: 700;
                    letter-spacing: .2em;
                    text-transform: uppercase;
                }

                .musician-liquid-editorial-stage {
                    position: relative;
                    min-height: clamp(360px, 43vw, 620px);
                    overflow: hidden;
                    perspective: 1400px;
                    touch-action: pan-y;
                    cursor: grab;
                    background:
                        linear-gradient(
                            90deg,
                            color-mix(
                                in srgb,
                                var(--liquid-surface) 94%,
                                #000
                            ),
                            transparent 18% 82%,
                            color-mix(
                                in srgb,
                                var(--liquid-surface) 94%,
                                #000
                            )
                        );
                }

                .musician-liquid-editorial-stage.is-dragging {
                    cursor: grabbing;
                }

                .musician-liquid-editorial-track {
                    position: absolute;
                    inset: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transform-style: preserve-3d;
                }

                .musician-liquid-editorial-card {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    width: clamp(210px, 25vw, 350px);
                    aspect-ratio: 4 / 5;
                    padding: 0;
                    border: 1px solid
                        color-mix(
                            in srgb,
                            var(--liquid-border) 85%,
                            white
                        );
                    background: var(--liquid-surface);
                    transform:
                        translate(-50%, -50%)
                        translateX(
                            calc(
                                var(--card-distance) *
                                clamp(190px, 25vw, 350px)
                            )
                        )
                        translateZ(
                            calc(
                                var(--card-abs-distance) *
                                -80px
                            )
                        )
                        rotateY(
                            calc(
                                var(--card-distance) *
                                -12deg
                            )
                        )
                        scale(
                            calc(
                                1 -
                                (
                                    var(--card-abs-distance) *
                                    .11
                                )
                            )
                        );
                    opacity:
                        calc(
                            1 -
                            (
                                var(--card-abs-distance) *
                                .18
                            )
                        );
                    filter:
                        saturate(
                            calc(
                                1 -
                                (
                                    var(--card-abs-distance) *
                                    .1
                                )
                            )
                        )
                        brightness(
                            calc(
                                1 -
                                (
                                    var(--card-abs-distance) *
                                    .1
                                )
                            )
                        );
                    box-shadow:
                        0 28px 70px rgba(0,0,0,.24);
                    transition:
                        transform 560ms cubic-bezier(.22,1,.36,1),
                        opacity 420ms ease,
                        filter 420ms ease,
                        box-shadow 560ms ease;
                    will-change: transform;
                    overflow: hidden;
                }

                .musician-liquid-editorial-card.is-active {
                    z-index: 12;
                    border-color:
                        color-mix(
                            in srgb,
                            var(--liquid-accent) 65%,
                            var(--liquid-border)
                        );
                    box-shadow:
                        0 36px 90px rgba(0,0,0,.3),
                        0 0 50px
                        color-mix(
                            in srgb,
                            var(--liquid-accent) 12%,
                            transparent
                        );
                }

                .musician-liquid-editorial-card-inner {
                    position: relative;
                    display: block;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                }

                .musician-liquid-editorial-card img {
                    display: block;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 700ms cubic-bezier(.22,1,.36,1);
                }

                .musician-liquid-editorial-card:hover img,
                .musician-liquid-editorial-card.is-active img {
                    transform: scale(1.035);
                }

                .musician-liquid-editorial-card-shade {
                    position: absolute;
                    inset: 0;
                    background:
                        linear-gradient(
                            180deg,
                            transparent 58%,
                            rgba(0,0,0,.48)
                        );
                    pointer-events: none;
                }

                .musician-liquid-editorial-card-number {
                    position: absolute;
                    top: 12px;
                    right: 12px;
                    border: 1px solid rgba(255,255,255,.35);
                    padding: 5px 7px;
                    color: #fff;
                    background: rgba(0,0,0,.24);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    font-size: 7px;
                    font-weight: 700;
                    letter-spacing: .18em;
                }

                .musician-liquid-editorial-card-caption {
                    position: absolute;
                    left: 14px;
                    right: 14px;
                    bottom: 13px;
                    z-index: 2;
                    color: #fff;
                    font-size: 8px;
                    line-height: 1.5;
                    text-align: left;
                }

                .musician-liquid-editorial-lens {
                    position: absolute;
                    z-index: 15;
                    left: 50%;
                    top: 50%;
                    width: min(76vw, 930px);
                    height: min(72%, 420px);
                    transform: translate(-50%, -50%);
                    border: 1px solid
                        color-mix(
                            in srgb,
                            var(--liquid-accent) 55%,
                            rgba(255,255,255,.55)
                        );
                    border-radius: 45% 55% 48% 52% / 54% 45% 55% 46%;
                    background:
                        linear-gradient(
                            90deg,
                            rgba(255,255,255,.035),
                            rgba(255,255,255,.07) 50%,
                            rgba(255,255,255,.025)
                        );
                    box-shadow:
                        inset 0 0 35px rgba(255,255,255,.045),
                        0 0 30px
                        color-mix(
                            in srgb,
                            var(--liquid-accent) 12%,
                            transparent
                        );
                    backdrop-filter:
                        blur(1.5px)
                        saturate(1.08);
                    -webkit-backdrop-filter:
                        blur(1.5px)
                        saturate(1.08);
                    pointer-events: none;
                    animation: musician-liquid-lens 8s ease-in-out infinite;
                }

                .musician-liquid-editorial-glow {
                    position: absolute;
                    z-index: 16;
                    top: 50%;
                    width: 17%;
                    height: 70%;
                    transform: translateY(-50%);
                    filter: blur(22px);
                    opacity: .55;
                    pointer-events: none;
                }

                .musician-liquid-editorial-glow-left {
                    left: -3%;
                    background:
                        radial-gradient(
                            ellipse at center,
                            color-mix(
                                in srgb,
                                var(--liquid-accent) 70%,
                                transparent
                            ),
                            transparent 68%
                        );
                    border-radius: 55% 35% 48% 52%;
                }

                .musician-liquid-editorial-glow-right {
                    right: -3%;
                    background:
                        radial-gradient(
                            ellipse at center,
                            color-mix(
                                in srgb,
                                var(--liquid-accent) 70%,
                                transparent
                            ),
                            transparent 68%
                        );
                    border-radius: 35% 55% 52% 48%;
                }

                @keyframes musician-liquid-lens {
                    0%, 100% {
                        border-radius: 45% 55% 48% 52% / 54% 45% 55% 46%;
                        transform: translate(-50%, -50%) scaleX(1);
                    }
                    50% {
                        border-radius: 53% 47% 55% 45% / 46% 55% 45% 54%;
                        transform: translate(-50%, -50%) scaleX(1.018);
                    }
                }

                .musician-gallery-image-frame {
                    min-width: 0;
                    background: var(--musician-surface);
                }

                .musician-gallery-image {
                    display: block;
                }

                .musician-gallery-card {
                    min-width: 0;
                }

                @media (max-width: 1023px) {
                    .musician-gallery [data-gallery-layout] {
                        display: none !important;
                    }

                    /* Tablet gallery display */
                    .musician-gallery[data-tablet-display="grid"]
                    [data-gallery-layout="grid"] {
                        display: grid !important;
                    }

                    .musician-gallery[data-tablet-display="masonry"]
                    [data-gallery-layout="masonry"] {
                        display: block !important;
                    }

                    .musician-gallery[data-tablet-display="editorial"]
                    [data-gallery-layout="editorial"] {
                        display: block !important;
                    }

                    .musician-gallery[data-tablet-display="freeform"]
                    [data-gallery-layout="freeform"] {
                        display: block !important;
                    }

                    .musician-gallery [data-gallery-layout="grid"] {
                        grid-template-columns:
                            repeat(
                                var(--musician-gallery-tablet-columns),
                                minmax(0, 1fr)
                            );
                    }

                    .musician-gallery[data-tablet-display="grid"] .musician-gallery-image-frame {
                        aspect-ratio: var(--musician-gallery-tablet-aspect);
                    }

                    .musician-gallery [data-gallery-layout="masonry"] {
                        column-count: var(--musician-gallery-tablet-columns);
                    }

                    .musician-gallery[data-tablet-display="masonry"] .musician-gallery-image-frame {
                        aspect-ratio: auto;
                    }

                    .musician-gallery[data-tablet-display="editorial"] [data-gallery-layout="editorial"] {
                        display: block;
                    }

                    .musician-liquid-editorial-stage {
                        min-height: clamp(340px, 52vw, 520px);
                    }

                    .musician-liquid-editorial-card {
                        width: clamp(190px, 29vw, 300px);
                    }

                    .musician-liquid-editorial-lens {
                        width: 82%;
                        height: 68%;
                    }

                    .musician-freeform-scroll-scene {
                        height: 180svh;
                    }

                    .musician-freeform-stage {
                        top: 58px;
                        height: calc(100svh - 58px);
                        min-height: 0;
                        padding: 28px;
                        gap: 14px;
                    }

                    .musician-freeform-column {
                        gap: 14px;
                    }

                    .musician-freeform-column-1 {
                        transform:
                            translate3d(
                                calc((1 - var(--freeform-progress)) * 7vw),
                                calc((1 - var(--freeform-progress)) * -3vh),
                                calc((1 - var(--freeform-progress)) * 100px)
                            )
                            rotateY(
                                calc((1 - var(--freeform-progress)) * 18deg)
                            )
                            rotateZ(
                                calc((1 - var(--freeform-progress)) * -3deg)
                            );
                    }

                    .musician-freeform-column-2 {
                        transform:
                            translate3d(
                                0,
                                calc((1 - var(--freeform-progress)) * 4vh),
                                calc((1 - var(--freeform-progress)) * -60px)
                            )
                            rotateX(
                                calc((1 - var(--freeform-progress)) * -3deg)
                            );
                    }

                    .musician-freeform-column-3 {
                        transform:
                            translate3d(
                                calc((1 - var(--freeform-progress)) * -7vw),
                                calc((1 - var(--freeform-progress)) * -2vh),
                                calc((1 - var(--freeform-progress)) * 80px)
                            )
                            rotateY(
                                calc((1 - var(--freeform-progress)) * -18deg)
                            )
                            rotateZ(
                                calc((1 - var(--freeform-progress)) * 3deg)
                            );
                    }

                    .musician-freeform-column
                    .musician-gallery-image-frame {
                        height: clamp(130px, 23svh, 240px);
                        min-height: 0;
                    }
                }

                @media (max-width: 639px) {
                    .musician-poster-hero {
                        min-height: auto;
                    }

                    .musician-poster-x {
                        width: 36px;
                        height: 36px;
                        border-width: 3px;
                    }

                    .musician-poster-x::after {
                        border-width: 3px;
                    }

                    .musician-poster-dots {
                        width: 52px;
                        height: 52px;
                        background-size: 12px 12px;
                    }

                    .musician-gallery [data-gallery-layout] {
                        display: none !important;
                    }

                    /* Mobile gallery display */
                    .musician-gallery[data-mobile-display="grid"]
                    [data-gallery-layout="grid"] {
                        display: grid !important;
                    }

                    .musician-gallery[data-mobile-display="masonry"]
                    [data-gallery-layout="masonry"] {
                        display: block !important;
                    }

                    .musician-gallery[data-mobile-display="editorial"]
                    [data-gallery-layout="editorial"] {
                        display: block !important;
                    }

                    .musician-gallery[data-mobile-display="freeform"]
                    [data-gallery-layout="freeform"] {
                        display: block !important;
                    }

                    .musician-freeform-scroll-scene {
                        height: 165svh;
                    }

                    .musician-freeform-stage {
                        top: 12px;
                        height: calc(100svh - 12px);
                        padding: 16px 10px;
                        gap: 8px;
                        perspective: 1000px;
                    }

                    .musician-freeform-column {
                        gap: 8px;
                    }

                    .musician-freeform-column-1 {
                        transform:
                            translate3d(
                                calc((1 - var(--freeform-progress)) * 12vw),
                                calc((1 - var(--freeform-progress)) * -2vh),
                                calc((1 - var(--freeform-progress)) * 70px)
                            )
                            rotateY(
                                calc((1 - var(--freeform-progress)) * 14deg)
                            )
                            rotateZ(
                                calc((1 - var(--freeform-progress)) * -2deg)
                            );
                    }

                    .musician-freeform-column-2 {
                        transform:
                            translate3d(
                                0,
                                calc((1 - var(--freeform-progress)) * 2vh),
                                calc((1 - var(--freeform-progress)) * -35px)
                            )
                            rotateX(
                                calc((1 - var(--freeform-progress)) * -2deg)
                            );
                    }

                    .musician-freeform-column-3 {
                        transform:
                            translate3d(
                                calc((1 - var(--freeform-progress)) * -12vw),
                                calc((1 - var(--freeform-progress)) * -2vh),
                                calc((1 - var(--freeform-progress)) * 60px)
                            )
                            rotateY(
                                calc((1 - var(--freeform-progress)) * -14deg)
                            )
                            rotateZ(
                                calc((1 - var(--freeform-progress)) * 2deg)
                            );
                    }

                    .musician-freeform-column
                    .musician-gallery-image-frame {
                        height: clamp(108px, 22svh, 190px);
                    }

                    .musician-freeform-column
                    .musician-gallery-meta {
                        padding: 34px 9px 9px;
                    }

                    .musician-gallery [data-gallery-layout="grid"] {
                        grid-template-columns:
                            repeat(
                                var(--musician-gallery-mobile-columns),
                                minmax(0, 1fr)
                            );
                        gap: 8px;
                    }

                    .musician-gallery[data-mobile-display="grid"] .musician-gallery-image-frame {
                        aspect-ratio: var(--musician-gallery-mobile-aspect);
                    }

                    .musician-gallery [data-gallery-layout="masonry"] {
                        column-count: var(--musician-gallery-mobile-columns);
                        column-gap: 8px;
                    }

                    .musician-gallery[data-mobile-display="masonry"] .musician-gallery-card {
                        margin-bottom: 8px;
                    }

                    .musician-gallery[data-mobile-display="masonry"] .musician-gallery-image-frame {
                        aspect-ratio: auto;
                    }

                    .musician-gallery[data-mobile-display="editorial"] [data-gallery-layout="editorial"] {
                        display: block;
                    }

                    .musician-liquid-editorial-head {
                        padding: 13px 12px;
                    }

                    .musician-liquid-editorial-hint {
                        display: none;
                    }

                    .musician-liquid-editorial-stage {
                        min-height: 390px;
                    }

                    .musician-liquid-editorial-card {
                        width: min(64vw, 280px);
                        transform:
                            translate(-50%, -50%)
                            translateX(
                                calc(
                                    var(--card-distance) *
                                    min(63vw, 278px)
                                )
                            )
                            translateZ(
                                calc(
                                    var(--card-abs-distance) *
                                    -45px
                                )
                            )
                            rotateY(
                                calc(
                                    var(--card-distance) *
                                    -8deg
                                )
                            )
                            scale(
                                calc(
                                    1 -
                                    (
                                        var(--card-abs-distance) *
                                        .13
                                    )
                                )
                            );
                    }

                    .musician-liquid-editorial-lens {
                        width: 108%;
                        height: 62%;
                    }

                    .musician-liquid-editorial-glow {
                        width: 22%;
                        opacity: .42;
                    }

                    .musician-liquid-editorial-foot {
                        padding: 11px 12px;
                    }

                    .musician-liquid-editorial-foot-title {
                        max-width: 55%;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .musician-freeform-column {
                        transform: none !important;
                        transition: none;
                    }

                    .musician-freeform-column
                    .musician-gallery-card,
                    .musician-freeform-column
                    .musician-gallery-image {
                        transition: none;
                    }

                    .musician-liquid-editorial-card,
                    .musician-liquid-editorial-card img,
                    .musician-liquid-editorial-lens {
                        transition: none;
                        animation: none;
                    }
                }

                @supports not (backdrop-filter: blur(1px)) {
                    .musician-liquid-editorial-card-number {
                        background: rgba(0,0,0,.68);
                    }

                    .musician-liquid-editorial-lens {
                        background: rgba(255,255,255,.06);
                    }
                }

                @keyframes musician-poster-in {
                    from {
                        opacity: 0;
                        transform: translateY(22px) rotate(.7deg) scale(.985);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) rotate(0) scale(1);
                    }
                }

                .musician-poster-animate {
                    animation: musician-poster-in 850ms cubic-bezier(.22,1,.36,1) both;
                }

                @media (prefers-reduced-motion: reduce) {
                    .musician-poster-animate {
                        animation: none;
                    }
                }

                /* Circular Drag Freeform Gallery */
                .musician-formation {
                    position: relative;
                    width: 100%;
                    height: clamp(520px, 68svh, 760px);
                    min-height: 460px;
                    overflow: hidden;
                    perspective: 1600px;
                    touch-action: pan-y;
                    user-select: none;
                    -webkit-user-select: none;
                    isolation: isolate;
                    cursor: grab;
                }

                .musician-formation.is-dragging {
                    cursor: grabbing;
                }

                .musician-formation-stage {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    perspective: 1600px;
                    transform-style: preserve-3d;
                    isolation: isolate;
                }

                .musician-formation-item {
                    position: absolute;
                    left: calc(
                        50% + var(--formation-x)
                    );
                    top: calc(
                        50% + var(--formation-y)
                    );
                    width: clamp(190px, 24vw, 340px);
                    transform:
                        translate3d(
                            -50%,
                            -50%,
                            var(--formation-z)
                        )
                        rotateZ(var(--formation-rotate))
                        scale(var(--formation-scale));
                    transform-style: preserve-3d;
                    transform-origin: center;
                    will-change: left, top, transform;
                    pointer-events: auto;
                }

                /* Cards stay fully clickable; the parent captures only after drag starts. */
                .musician-formation-card {
                    position: relative;
                    width: 100%;
                    overflow: hidden;
                    border: 1px solid
                        color-mix(
                            in srgb,
                            var(--musician-border) 85%,
                            white 15%
                        );
                    background:
                        var(--musician-surface);
                    box-shadow:
                        0 24px 70px rgba(0, 0, 0, .28),
                        0 4px 18px rgba(0, 0, 0, .2);
                    transform-style: preserve-3d;
                    pointer-events: auto;
                    cursor: pointer;
                    touch-action: pan-y;
                    transition:
                        box-shadow 220ms ease,
                        filter 220ms ease;
                }

                .musician-formation-card
                .musician-gallery-card {
                    display: block;
                    width: 100%;
                    border: 0 !important;
                    box-shadow: none !important;
                    cursor: pointer;
                }

                .musician-formation-card
                .musician-gallery-card:hover {
                    transform: none !important;
                    box-shadow: none !important;
                }

                .musician-formation-card
                .musician-gallery-image-frame {
                    aspect-ratio: 4 / 3;
                    height: auto;
                    min-height: 0;
                    overflow: hidden;
                }

                .musician-formation-card
                .musician-gallery-image {
                    display: block;
                    width: 100%;
                    // height: auto;
                    min-height: 0;
                    object-fit: cover;
                    transition:
                        transform 450ms cubic-bezier(
                            .22,
                            1,
                            .36,
                            1
                        ),
                        filter 250ms ease;
                }

                .musician-formation-card:hover {
                    box-shadow:
                        0 32px 90px rgba(0, 0, 0, .4),
                        0 8px 28px rgba(0, 0, 0, .24);
                    filter: brightness(1.04);
                }

                .musician-formation-card:hover
                .musician-gallery-image {
                    transform: scale(1.035);
                }

                .musician-formation-hint {
                    position: absolute;
                    top: 14px;
                    left: 50%;
                    z-index: 1000;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    transform: translateX(-50%);
                    padding: 7px 10px;
                    border: 1px solid
                        color-mix(
                            in srgb,
                            var(--musician-border) 72%,
                            transparent
                        );
                    background:
                        color-mix(
                            in srgb,
                            var(--musician-bg) 82%,
                            transparent
                        );
                    color:
                        var(--musician-muted);
                    font-size: 8px;
                    font-weight: 700;
                    letter-spacing: .22em;
                    text-transform: uppercase;
                    pointer-events: none;
                    white-space: nowrap;
                }

                .musician-formation-hint-line {
                    width: 28px;
                    height: 1px;
                    background:
                        var(--musician-border);
                }

                @media (max-width: 1023px) {
                    .musician-formation {
                        height: clamp(470px, 64svh, 650px);
                        min-height: 430px;
                        perspective: 1200px;
                    }

                    .musician-formation-stage {
                        perspective: 1200px;
                    }

                    .musician-formation-item {
                        width: clamp(165px, 29vw, 280px);
                    }
                }

                @media (max-width: 639px) {
                    .musician-formation {
                        height: clamp(420px, 60svh, 540px);
                        min-height: 390px;
                        overflow: hidden;
                    }

                    .musician-formation-stage {
                        perspective: 900px;
                    }

                    .musician-formation-item {
                        width: clamp(132px, 43vw, 210px);
                    }

                    .musician-formation-hint {
                        top: 10px;
                        font-size: 7px;
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .musician-formation-item,
                    .musician-formation-card,
                    .musician-formation-card
                    .musician-gallery-image {
                        transition: none !important;
                    }
                }
            `}</style>

                {/* Navigation */}
                {settings.show_navigation && (
                    <header className="musician-poster-nav fixed inset-x-0 top-0 z-50">
                        <div className="mx-auto flex min-h-[58px] max-w-[1440px] items-center justify-between px-4 sm:px-7 lg:px-10">
                            <a
                                href="#top"
                                className="flex items-center"
                                aria-label={`Go to ${profile.display_name} home`}
                            >
                                <span
                                    className="text-[7px] font-bold uppercase tracking-[0.28em]"
                                    style={{
                                        color:
                                            settings.text_color,
                                    }}
                                >
                                    {profile.display_name}
                                </span>
                            </a>

                            <nav
                                className="hidden items-center gap-1 md:flex"
                                aria-label="Portfolio navigation"
                            >
                                {navigationItems.map((item) => (
                                    <a
                                        key={item.id ?? item.label}
                                        href={getNavigationHref(item)}
                                        target={
                                            item.destination === 'external'
                                                ? '_blank'
                                                : undefined
                                        }
                                        rel={
                                            item.destination === 'external'
                                                ? 'noreferrer'
                                                : undefined
                                        }
                                        className="px-4 py-2 text-[7px] font-bold uppercase tracking-[0.22em] transition hover:bg-white/10 sm:px-5"
                                        style={{
                                            color:
                                                settings.text_color,
                                        }}
                                    >
                                        {item.label}
                                    </a>
                                ))}
                            </nav>

                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    className="flex h-9 w-9 items-center justify-center border md:hidden"
                                    style={{
                                        borderColor:
                                            settings.border_color,
                                        color:
                                            settings.text_color,
                                    }}
                                    onClick={() =>
                                        setMobileMenuOpen((open) => !open)
                                    }
                                    aria-label="Toggle navigation"
                                    aria-expanded={mobileMenuOpen}
                                >
                                    {mobileMenuOpen ? '×' : '☰'}
                                </button>
                            </div>
                        </div>

                        {mobileMenuOpen && (
                            <nav
                                className="border-t md:hidden"
                                style={{
                                    borderColor:
                                        settings.border_color,
                                    backgroundColor:
                                        settings.background_color,
                                }}
                                aria-label="Mobile portfolio navigation"
                            >
                                <div className="mx-auto grid max-w-[1440px] grid-cols-2">
                                    {navigationItems.map((item) => (
                                        <a
                                            key={item.id ?? item.label}
                                            href={getNavigationHref(item)}
                                            target={
                                                item.destination === 'external'
                                                    ? '_blank'
                                                    : undefined
                                            }
                                            rel={
                                                item.destination === 'external'
                                                    ? 'noreferrer'
                                                    : undefined
                                            }
                                            onClick={() =>
                                                setMobileMenuOpen(false)
                                            }
                                            className="border-b border-r px-4 py-4 text-[7px] font-bold uppercase tracking-[0.2em]"
                                            style={{
                                                borderColor:
                                                    settings.border_color,
                                                color:
                                                    settings.text_color,
                                            }}
                                        >
                                            {item.label}
                                        </a>
                                    ))}
                                </div>
                            </nav>
                        )}
                    </header>
                )}

                {/* Hero Poster */}
                <section
                    className="musician-poster-hero border-b px-4 pb-10 pt-24 sm:px-7 sm:pb-14 sm:pt-28 lg:px-10 lg:pb-16"
                    style={sectionStyle}
                >
                    <div className="pointer-events-none absolute left-[7%] top-[18%] musician-poster-dots hidden sm:block" />
                    <div className="musician-poster-x left-[5%] top-[28%] hidden sm:block" />
                    <div className="musician-poster-x right-[8%] top-[12%] hidden sm:block scale-125" />

                    <div className="mx-auto grid max-w-[1440px] items-center gap-8 lg:grid-cols-12 lg:gap-10">
                        <div className="musician-poster-animate order-2 lg:order-1 lg:col-span-5">
                            <p
                                className="text-[8px] font-bold uppercase tracking-[0.34em]"
                                style={{ color: settings.text_color }}
                            >
                                {artistLabel}
                            </p>

                            <h1
                                className="mt-5 max-w-[760px] text-[clamp(4rem,10vw,9rem)] font-black uppercase leading-[.73] tracking-[-.085em]"
                                style={{ color: settings.text_color }}
                            >
                                {profile.display_name}
                            </h1>

                            <div
                                className="mt-7 h-1 w-24"
                                style={{
                                    backgroundColor:
                                        settings.accent_color,
                                }}
                            />

                            <p
                                className="mt-6 max-w-xl whitespace-pre-line text-sm font-medium leading-7 sm:text-base"
                                style={{
                                    color: settings.text_color,
                                }}
                            >
                                {heroStatement}
                            </p>

                            <div className="mt-7 flex flex-wrap gap-3">
                                <a
                                    href="#music"
                                    className="border-2 px-5 py-3 text-[7px] font-bold uppercase tracking-[0.24em] transition hover:bg-black/15"
                                    style={{
                                        borderColor:
                                            settings.text_color,
                                        color: settings.text_color,
                                    }}
                                >
                                    Listen now
                                </a>

                                {heroRelease && (
                                    <span
                                        className="border px-4 py-3 text-[7px] uppercase tracking-[0.2em]"
                                        style={{
                                            borderColor:
                                                settings.border_color,
                                            color:
                                                settings.text_color,
                                        }}
                                    >
                                        {heroRelease.title}
                                        {latestReleaseDate
                                            ? ` / ${latestReleaseDate}`
                                            : ''}
                                    </span>
                                )}
                            </div>

                            <div className="mt-12 grid grid-cols-3 border-y">
                                <div
                                    className="border-r px-3 py-4"
                                    style={{
                                        borderColor:
                                            settings.border_color,
                                    }}
                                >
                                    <span
                                        className="block text-[7px] uppercase tracking-[0.2em]"
                                        style={{
                                            color:
                                                settings.muted_text_color,
                                        }}
                                    >
                                        Releases
                                    </span>
                                    <span
                                        className="mt-2 block text-lg font-black"
                                        style={{
                                            color:
                                                settings.text_color,
                                        }}
                                    >
                                        {profile.releases.length}
                                    </span>
                                </div>
                                <div
                                    className="border-r px-3 py-4"
                                    style={{
                                        borderColor:
                                            settings.border_color,
                                    }}
                                >
                                    <span
                                        className="block text-[7px] uppercase tracking-[0.2em]"
                                        style={{
                                            color:
                                                settings.muted_text_color,
                                        }}
                                    >
                                        Work
                                    </span>
                                    <span
                                        className="mt-2 block text-lg font-black"
                                        style={{
                                            color:
                                                settings.text_color,
                                        }}
                                    >
                                        {profile.projects.length}
                                    </span>
                                </div>
                                <div className="px-3 py-4">
                                    <span
                                        className="block text-[7px] uppercase tracking-[0.2em]"
                                        style={{
                                            color:
                                                settings.muted_text_color,
                                        }}
                                    >
                                        Base
                                    </span>
                                    <span
                                        className="mt-2 block truncate text-xs font-bold uppercase"
                                        style={{
                                            color:
                                                settings.text_color,
                                        }}
                                    >
                                        {profile.location ||
                                            'Independent'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="order-1 flex justify-center lg:order-2 lg:col-span-7 lg:justify-end">
                            <div className="musician-poster-animate musician-poster-frame w-full max-w-[760px]">
                                {coverImage ? (
                                    <div className="relative aspect-[8/3] w-full overflow-hidden">
                                        <div
                                            className="absolute inset-0"
                                            style={{
                                                transform: `translate(${settings.cover_image_offset_x ?? 0}%, ${settings.cover_image_offset_y ?? 0}%)`,
                                            }}
                                        >
                                            <img
                                                src={coverImage}
                                                alt={`${profile.display_name} cover`}
                                                className="h-full w-full object-cover"
                                                style={{
                                                    objectPosition: `${settings.cover_image_position_x ?? 50}% ${settings.cover_image_position_y ?? 50}%`,
                                                    transform: `scale(${settings.cover_image_zoom ?? 1})`,
                                                    transformOrigin: 'center',
                                                }}
                                                draggable={false}
                                            />
                                        </div>

                                        <div
                                            className="absolute inset-0 pointer-events-none"
                                            style={{
                                                background:
                                                    'linear-gradient(90deg, rgba(0,0,0,.82) 0%, rgba(0,0,0,.56) 24%, rgba(0,0,0,.16) 54%, transparent 78%), linear-gradient(0deg, rgba(0,0,0,.78) 0%, rgba(0,0,0,.30) 30%, transparent 68%), radial-gradient(circle at 48% 50%, transparent 32%, rgba(0,0,0,.28) 100%)',
                                            }}
                                        />

                                        <div className="absolute left-5 top-5 border px-3 py-2 backdrop-blur-sm">
                                            <span className="text-[7px] font-bold uppercase tracking-[0.28em] text-white">
                                                Artist / Cover / Live
                                            </span>
                                        </div>

                                        <div className="absolute bottom-5 right-5 text-right">
                                            <span className="block text-[clamp(2rem,5vw,4rem)] font-black uppercase leading-[.78] tracking-[-.07em] text-white">
                                                {profile.display_name}
                                            </span>
                                            <span className="mt-2 block text-[7px] font-bold uppercase tracking-[0.25em] text-white/70">
                                                {artistLabel}
                                            </span>
                                        </div>

                                        <span className="musician-poster-x -right-5 top-10 scale-75" />
                                    </div>
                                ) : (
                                    <div
                                        className="flex aspect-[8/3] w-full items-center justify-center"
                                        style={{
                                            backgroundColor:
                                                settings.surface_color,
                                        }}
                                    >
                                        <span
                                            className="text-[8px] font-bold uppercase tracking-[0.3em]"
                                            style={{
                                                color:
                                                    settings.text_color,
                                            }}
                                        >
                                            {profile.display_name}
                                        </span>
                                    </div>
                                )}

                                <div
                                    className="grid grid-cols-3 border-t"
                                    style={{
                                        borderColor:
                                            settings.border_color,
                                    }}
                                >
                                    <span
                                        className="border-r px-3 py-3 text-[7px] uppercase tracking-[0.2em]"
                                        style={{
                                            borderColor:
                                                settings.border_color,
                                            color:
                                                settings.text_color,
                                        }}
                                    >
                                        Artist
                                    </span>
                                    <span
                                        className="border-r px-3 py-3 text-center text-[7px] uppercase tracking-[0.2em]"
                                        style={{
                                            borderColor:
                                                settings.border_color,
                                            color:
                                                settings.text_color,
                                        }}
                                    >
                                        {artistLabel}
                                    </span>
                                    <span
                                        className="px-3 py-3 text-right text-[7px] uppercase tracking-[0.2em]"
                                        style={{
                                            color:
                                                settings.accent_color,
                                        }}
                                    >
                                        {profile.location ||
                                            'Worldwide'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* New Release / All Releases */}
                {settings.show_music &&
                    releases.length > 0 && (
                        <section
                            id="music"
                            className="musician-poster-section px-4 py-14 sm:px-7 sm:py-20 lg:px-10"
                            style={{
                                borderColor:
                                    settings.border_color,
                            }}
                        >
                            <div className="mx-auto max-w-[1440px]">
                                <div className="mb-8 flex items-end justify-between gap-5 border-b-2 pb-5"
                                    style={{
                                        borderColor:
                                            settings.text_color,
                                    }}
                                >
                                    <div>
                                        <p
                                            className="text-[7px] font-bold uppercase tracking-[0.3em]"
                                            style={{
                                                color:
                                                    settings.text_color,
                                            }}
                                        >
                                            01 / New Release
                                        </p>
                                        <h2
                                            className="musician-section-title mt-3"
                                            style={{
                                                color:
                                                    settings.text_color,
                                            }}
                                        >
                                            Music
                                        </h2>
                                    </div>
                                    <span
                                        className="text-[7px] font-bold uppercase tracking-[0.24em]"
                                        style={{
                                            color:
                                                settings.accent_color,
                                        }}
                                    >
                                        {releases.length}{' '}
                                        {releaseCountLabel}
                                    </span>
                                </div>

                                <div className="grid gap-7 lg:grid-cols-12">
                                    <div className="lg:col-span-8">
                                        <MusicPlayerWidget
                                            releases={releases}
                                            activeReleaseId={activeReleaseId}
                                            onChangeRelease={
                                                setActiveReleaseId
                                            }
                                            artistName={
                                                profile.display_name
                                            }
                                        />
                                    </div>

                                    <div className="lg:col-span-4">
                                        <div className="mb-3 flex items-center justify-between">
                                            <p
                                                className="text-[7px] font-bold uppercase tracking-[0.28em]"
                                                style={{
                                                    color:
                                                        settings.text_color,
                                                }}
                                            >
                                                All Releases
                                            </p>
                                            <span
                                                className="text-[7px] uppercase tracking-[0.2em]"
                                                style={{
                                                    color:
                                                        settings.muted_text_color,
                                                }}
                                            >
                                                {releases.length}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2">
                                            {releases.map(
                                                (
                                                    release,
                                                    index,
                                                ) => (
                                                    <button
                                                        key={
                                                            release.id
                                                        }
                                                        type="button"
                                                        onClick={() =>
                                                            setActiveReleaseId(
                                                                release.id,
                                                            )
                                                        }
                                                        className="group border text-left transition duration-300 hover:-translate-y-1"
                                                        style={{
                                                            borderColor:
                                                                release.id ===
                                                                    activeReleaseId
                                                                    ? settings.text_color
                                                                    : settings.border_color,
                                                            backgroundColor:
                                                                settings.surface_color,
                                                            boxShadow:
                                                                release.id ===
                                                                    activeReleaseId
                                                                    ? `6px 6px 0 ${settings.primary_color}`
                                                                    : undefined,
                                                        }}
                                                        aria-label={`Select ${release.title}`}
                                                    >
                                                        <div className="aspect-square overflow-hidden">
                                                            <ReleaseArtwork
                                                                release={
                                                                    release
                                                                }
                                                            />
                                                        </div>
                                                        <div className="border-t p-3"
                                                            style={{
                                                                borderColor:
                                                                    settings.border_color,
                                                            }}
                                                        >
                                                            <p
                                                                className="truncate text-[8px] font-bold uppercase"
                                                                style={{
                                                                    color:
                                                                        settings.text_color,
                                                                }}
                                                            >
                                                                {
                                                                    release.title
                                                                }
                                                            </p>
                                                            <p
                                                                className="mt-1 text-[7px] uppercase tracking-[0.16em]"
                                                                style={{
                                                                    color:
                                                                        settings.muted_text_color,
                                                                }}
                                                            >
                                                                {String(
                                                                    index +
                                                                    1,
                                                                ).padStart(
                                                                    2,
                                                                    '0',
                                                                )}{' '}
                                                                /{' '}
                                                                {release.release_type ||
                                                                    'Release'}
                                                            </p>
                                                        </div>
                                                    </button>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                {/* Artist Message */}
                {settings.show_artist_message && (
                    <section
                        id="artist-message"
                        className="border-b px-4 py-14 sm:px-7 sm:py-20 lg:px-10"
                        style={{
                            borderColor:
                                settings.border_color,
                            backgroundColor:
                                settings.background_color,
                        }}
                    >
                        <div className="mx-auto max-w-[1440px] border-y-2 py-8 sm:py-12"
                            style={{
                                borderColor:
                                    settings.text_color,
                            }}
                        >
                            <p
                                className="text-[7px] font-bold uppercase tracking-[0.3em]"
                                style={{
                                    color:
                                        settings.accent_color,
                                }}
                            >
                                {settings.artist_message_label ||
                                    'Artist Statement'}
                            </p>
                            <p
                                className="mt-5 max-w-6xl text-[clamp(2.2rem,5.5vw,6rem)] font-black uppercase leading-[.82] tracking-[-.07em]"
                                style={{
                                    color:
                                        settings.text_color,
                                }}
                            >
                                {settings.artist_message || 'Create with intention. Share your story with the world.'}
                            </p>
                        </div>
                    </section>
                )}


                {/* Work */}
                {settings.show_work &&
                    visibleProjects.length > 0 && (
                        <WorkWheelSection
                            profile={profile}
                            settings={settings}
                            projects={visibleProjects}
                            getProjectUrl={getProjectUrl}
                        />
                    )}

                {/* Gallery */}
                {settings.show_gallery &&
                    galleryImages.length > 0 && (
                        <section
                            id="gallery"
                            className="musician-poster-section border-b px-4 py-14 sm:px-7 sm:py-20 lg:px-10"
                            style={{
                                borderColor:
                                    settings.border_color,
                            }}
                        >
                            <div className="mx-auto max-w-[1440px]">
                                <div className="mb-8 flex flex-col gap-4 border-b-2 pb-5 sm:flex-row sm:items-end sm:justify-between"
                                    style={{
                                        borderColor:
                                            settings.text_color,
                                    }}
                                >
                                    <div>
                                        <p
                                            className="text-[7px] font-bold uppercase tracking-[0.3em]"
                                            style={{
                                                color:
                                                    settings.accent_color,
                                            }}
                                        >
                                            03 / Archive
                                        </p>
                                        <h2
                                            className="musician-section-title mt-3"
                                            style={{
                                                color:
                                                    settings.text_color,
                                            }}
                                        >
                                            {settings.gallery_label ||
                                                'Gallery'}
                                        </h2>
                                    </div>
                                    {settings.gallery_description && (
                                        <p
                                            className="max-w-md text-xs leading-6"
                                            style={{
                                                color:
                                                    settings.muted_text_color,
                                            }}
                                        >
                                            {
                                                settings.gallery_description
                                            }
                                        </p>
                                    )}
                                </div>

                                <div
                                    className="musician-gallery musician-gallery-poster"
                                    data-desktop-display={
                                        desktopGallery.display
                                    }
                                    data-tablet-display={
                                        tabletGallery.display
                                    }
                                    data-mobile-display={
                                        mobileGallery.display
                                    }
                                    style={
                                        {
                                            '--musician-gallery-desktop-columns':
                                                desktopGallery.columns,
                                            '--musician-gallery-tablet-columns':
                                                tabletGallery.columns,
                                            '--musician-gallery-mobile-columns':
                                                mobileGallery.columns,
                                            '--musician-gallery-desktop-aspect':
                                                desktopAspect,
                                            '--musician-gallery-tablet-aspect':
                                                tabletAspect,
                                            '--musician-gallery-mobile-aspect':
                                                mobileAspect,
                                        } as CSSProperties
                                    }
                                >
                                    {(
                                        [
                                            'grid',
                                            'masonry',
                                            'editorial',
                                            'freeform',
                                        ] as const
                                    ).map((layout) => (
                                        <div
                                            key={layout}
                                            data-gallery-layout={layout}
                                        >
                                            {layout === 'editorial' ? (
                                                <LiquidGlassEditorialGallery
                                                    images={galleryImages}
                                                    showTitle={
                                                        settings.gallery_show_titles
                                                    }
                                                    settings={settings}
                                                    onOpen={(index) =>
                                                        setLightboxIndex(index)
                                                    }
                                                />
                                            ) : layout === 'freeform' ? (
                                                <MusicianFreeformGallery
                                                    images={galleryImages}
                                                    showTitle={
                                                        settings.gallery_show_titles
                                                    }
                                                    showCaption={
                                                        settings.gallery_show_captions
                                                    }
                                                    onOpen={(index) =>
                                                        setLightboxIndex(index)
                                                    }
                                                />
                                            ) : (
                                                galleryImages.map(
                                                    (image, index) => (
                                                        <GalleryCard
                                                            key={`${layout}-${image.id}`}
                                                            image={image}
                                                            index={index}
                                                            onOpen={() =>
                                                                setLightboxIndex(
                                                                    index,
                                                                )
                                                            }
                                                            showTitle={
                                                                settings.gallery_show_titles
                                                            }
                                                            showCaption={
                                                                settings.gallery_show_captions
                                                            }
                                                        />
                                                    ),
                                                )
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                {/* About */}
                {settings.show_about && (
                    <section
                        id="about"
                        className="musician-about border-b px-4 py-14 sm:px-7 sm:py-20 lg:px-10"
                        style={{
                            borderColor:
                                settings.border_color,
                        }}
                    >
                        <div className="mx-auto max-w-[1440px]">
                            <div className="grid border-2 lg:grid-cols-12"
                                style={{
                                    borderColor:
                                        settings.text_color,
                                }}
                            >
                                <div className="relative border-b lg:col-span-7 lg:border-b-0 lg:border-r"
                                    style={{
                                        borderColor:
                                            settings.border_color,
                                    }}
                                >
                                    {profileImage ? (
                                        <div className="musician-about-image relative h-full min-h-[400px] overflow-hidden">
                                            <AvatarImage
                                                src={profileImage}
                                                alt={profile.display_name}
                                                className="select-none object-cover"
                                                zoom={Number(profile.avatar_zoom ?? 1)}
                                                positionX={Number(profile.avatar_position_x ?? 50)}
                                                positionY={Number(profile.avatar_position_y ?? 50)}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                                            <span className="absolute bottom-5 left-5 border px-3 py-2 text-[7px] font-bold uppercase tracking-[0.25em] text-white">
                                                Artist / Portrait
                                            </span>
                                        </div>
                                    ) : (
                                        <div
                                            className="flex min-h-[400px] items-center justify-center"
                                            style={{
                                                backgroundColor:
                                                    settings.surface_color,
                                            }}
                                        >
                                            <span
                                                className="text-[7px] font-bold uppercase tracking-[0.3em]"
                                                style={{
                                                    color:
                                                        settings.text_color,
                                                }}
                                            >
                                                Artist / Portrait
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col justify-between p-6 sm:p-9 lg:col-span-5 lg:p-12">
                                    <div>
                                        <p
                                            className="text-[7px] font-bold uppercase tracking-[0.3em]"
                                            style={{
                                                color:
                                                    settings.accent_color,
                                            }}
                                        >
                                            04 / About
                                        </p>
                                        <h2
                                            className="mt-4 text-[clamp(3rem,7vw,6.5rem)] font-black uppercase leading-[.76] tracking-[-.07em]"
                                            style={{
                                                color:
                                                    settings.text_color,
                                            }}
                                        >
                                            {settings.about_label ||
                                                'The Artist'}
                                        </h2>

                                        <p
                                            className="mt-7 whitespace-pre-line text-sm leading-7"
                                            style={{
                                                color:
                                                    settings.muted_text_color,
                                            }}
                                        >
                                            {profile.about_me ||
                                                profile.bio ||
                                                'An independent artist creating music, visuals, and experiences.'}
                                        </p>
                                    </div>

                                    <div className="mt-10">
                                        <div
                                            className="grid border-y"
                                            style={{
                                                borderColor:
                                                    settings.border_color,
                                            }}
                                        >
                                            <div
                                                className="grid grid-cols-2 border-b px-3 py-4"
                                                style={{
                                                    borderColor:
                                                        settings.border_color,
                                                }}
                                            >
                                                <span
                                                    className="text-[7px] uppercase tracking-[0.2em]"
                                                    style={{
                                                        color:
                                                            settings.muted_text_color,
                                                    }}
                                                >
                                                    Practice
                                                </span>
                                                <span
                                                    className="text-right text-[8px] font-bold uppercase"
                                                    style={{
                                                        color:
                                                            settings.text_color,
                                                    }}
                                                >
                                                    {artistLabel}
                                                </span>
                                            </div>
                                            <div
                                                className="grid grid-cols-2 border-b px-3 py-4"
                                                style={{
                                                    borderColor:
                                                        settings.border_color,
                                                }}
                                            >
                                                <span
                                                    className="text-[7px] uppercase tracking-[0.2em]"
                                                    style={{
                                                        color:
                                                            settings.muted_text_color,
                                                    }}
                                                >
                                                    Location
                                                </span>
                                                <span
                                                    className="text-right text-[8px] font-bold uppercase"
                                                    style={{
                                                        color:
                                                            settings.text_color,
                                                    }}
                                                >
                                                    {profile.location ||
                                                        'Independent'}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 px-3 py-4">
                                                <span
                                                    className="text-[7px] uppercase tracking-[0.2em]"
                                                    style={{
                                                        color:
                                                            settings.muted_text_color,
                                                    }}
                                                >
                                                    Connect
                                                </span>
                                                {profile.website ? (
                                                    <a
                                                        href={
                                                            profile.website
                                                        }
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-right text-[8px] font-bold uppercase hover:opacity-60"
                                                        style={{
                                                            color:
                                                                settings.text_color,
                                                        }}
                                                    >
                                                        Website ↗
                                                    </a>
                                                ) : (
                                                    <span
                                                        className="text-right text-[8px] font-bold uppercase"
                                                        style={{
                                                            color:
                                                                settings.text_color,
                                                        }}
                                                    >
                                                        —
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Footer */}
                {settings.show_footer && (
                    <footer
                        id="footer"
                        className="relative overflow-hidden border-t px-4 py-10 sm:px-7 sm:py-14 lg:px-10"
                        style={{
                            borderColor:
                                settings.border_color,
                            backgroundColor:
                                settings.background_color,
                        }}
                    >
                        <div className="pointer-events-none absolute inset-x-0 top-0 h-px"
                            style={{
                                backgroundColor:
                                    settings.accent_color,
                            }}
                        />

                        <div className="mx-auto max-w-[1440px]">
                            <div className="grid gap-0 border"
                                style={{
                                    borderColor:
                                        settings.border_color,
                                }}
                            >
                                <div className="grid lg:grid-cols-[1.35fr_.65fr]">
                                    <div
                                        className="relative overflow-hidden border-b p-6 sm:p-9 lg:border-b-0 lg:border-r lg:p-12"
                                        style={{
                                            borderColor:
                                                settings.border_color,
                                        }}
                                    >
                                        <div className="pointer-events-none absolute right-8 top-8 musician-poster-dots opacity-40" />

                                        <p
                                            className="text-[7px] font-bold uppercase tracking-[0.3em]"
                                            style={{
                                                color:
                                                    settings.accent_color,
                                            }}
                                        >
                                            {settings.footer_label ||
                                                'Official Artist Website'}
                                        </p>

                                        <h2
                                            className="mt-5 max-w-5xl text-[clamp(3.5rem,10vw,10rem)] font-black uppercase leading-[.7] tracking-[-.09em]"
                                            style={{
                                                color:
                                                    settings.text_color,
                                            }}
                                        >
                                            {profile.display_name}
                                        </h2>

                                        {settings.footer_message && (
                                            <p
                                                className="mt-7 max-w-lg text-xs leading-6"
                                                style={{
                                                    color:
                                                        settings.muted_text_color,
                                                }}
                                            >
                                                {
                                                    settings.footer_message
                                                }
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex flex-col justify-between p-6 sm:p-9 lg:p-12">

                                        <div className="mt-10">
                                            <p
                                                className="text-[7px] uppercase tracking-[0.2em]"
                                                style={{
                                                    color:
                                                        settings.muted_text_color,
                                                }}
                                            >
                                                {profile.location ||
                                                    'Worldwide'}
                                            </p>

                                            <p
                                                className="mt-2 text-[7px] uppercase tracking-[0.2em]"
                                                style={{
                                                    color:
                                                        settings.muted_text_color,
                                                }}
                                            >
                                                {settings.copyright_text ||
                                                    `© ${new Date().getFullYear()} ${profile.display_name}`}
                                            </p>

                                            {settings.show_footer_socials !== false &&
                                                socialLinks.length > 0 && (
                                                    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 lg:justify-end">
                                                        {socialLinks.map((socialLink) => (
                                                            <a
                                                                key={socialLink.id}
                                                                href={socialLink.url}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="text-[7px] font-bold uppercase tracking-[0.18em] transition-opacity hover:opacity-50"
                                                                style={{
                                                                    color: settings.text_color,
                                                                }}
                                                            >
                                                                {socialLink.platform.replace('_', ' ')} ↗︎
                                                            </a>
                                                        ))}
                                                    </div>
                                                )}

                                            {settings.show_powered_by_lira && (
                                                <a
                                                    href="/"
                                                    className="mt-5 inline-flex items-center gap-3 border px-4 py-3 text-[7px] font-bold uppercase tracking-[0.22em] transition hover:bg-white/10"
                                                    style={{
                                                        borderColor:
                                                            settings.border_color,
                                                        color:
                                                            settings.text_color,
                                                    }}
                                                >
                                                    Powered by
                                                    <img
                                                        src="/images/brand/Lira_logo.png"
                                                        alt="LIRA"
                                                        className="h-4 w-auto object-contain"
                                                    />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className="grid grid-cols-3"
                                    style={{
                                        borderTop: `1px solid ${settings.border_color}`,
                                    }}
                                >
                                    <span
                                        className="border-r px-3 py-3 text-center text-[7px] font-bold uppercase tracking-[0.2em]"
                                        style={{
                                            borderColor:
                                                settings.border_color,
                                            color:
                                                settings.text_color,
                                        }}
                                    >
                                        Music
                                    </span>
                                    <span
                                        className="border-r px-3 py-3 text-center text-[7px] font-bold uppercase tracking-[0.2em]"
                                        style={{
                                            borderColor:
                                                settings.border_color,
                                            color:
                                                settings.text_color,
                                        }}
                                    >
                                        Visuals
                                    </span>
                                    <span
                                        className="px-3 py-3 text-center text-[7px] font-bold uppercase tracking-[0.2em]"
                                        style={{
                                            color:
                                                settings.text_color,
                                        }}
                                    >
                                        Live
                                    </span>
                                </div>
                            </div>
                        </div>
                    </footer>
                )}

                {/* Gallery lightbox */}
                {currentLightboxImage &&
                    settings.gallery_enable_lightbox && (
                        <div
                            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 p-4 backdrop-blur-xl sm:p-8"
                            role="dialog"
                            aria-modal="true"
                            aria-label={
                                currentLightboxImage.title ||
                                'Gallery image'
                            }
                            onClick={closeLightbox}
                        >
                            <button
                                type="button"
                                onClick={closeLightbox}
                                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center border border-white/20 bg-black/40 text-lg text-white sm:right-8 sm:top-8"
                                aria-label="Close gallery"
                            >
                                ×
                            </button>

                            {galleryImages.length > 1 && (
                                <>
                                    <button
                                        type="button"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            showPreviousImage();
                                        }}
                                        className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-white/20 bg-black/40 text-white sm:left-8"
                                        aria-label="Previous image"
                                    >
                                        ←
                                    </button>

                                    <button
                                        type="button"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            showNextImage();
                                        }}
                                        className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-white/20 bg-black/40 text-white sm:right-8"
                                        aria-label="Next image"
                                    >
                                        →
                                    </button>
                                </>
                            )}

                            <div
                                className="relative max-h-[90vh] max-w-[92vw]"
                                onClick={(event) =>
                                    event.stopPropagation()
                                }
                            >
                                <img
                                    src={
                                        getAssetUrl(
                                            currentLightboxImage.image,
                                        ) ?? undefined
                                    }
                                    alt={
                                        currentLightboxImage.alt_text ||
                                        currentLightboxImage.title ||
                                        'Gallery image'
                                    }
                                    className="max-h-[82vh] max-w-[94vw] object-contain"
                                />

                                {(currentLightboxImage.title ||
                                    currentLightboxImage.caption) && (
                                        <div className="mt-4">
                                            {currentLightboxImage.title && (
                                                <p
                                                    className="text-sm"
                                                    style={{
                                                        color:
                                                            settings.text_color,
                                                    }}
                                                >
                                                    {
                                                        currentLightboxImage.title
                                                    }
                                                </p>
                                            )}

                                            {currentLightboxImage.caption && (
                                                <p
                                                    className="mt-1 max-w-2xl text-xs leading-5"
                                                    style={{
                                                        color:
                                                            settings.muted_text_color,
                                                    }}
                                                >
                                                    {
                                                        currentLightboxImage.caption
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    )}

                                <span
                                    className="absolute right-0 top-full mt-3 text-[7px] uppercase tracking-[0.25em]"
                                    style={{
                                        color:
                                            settings.muted_text_color,
                                    }}
                                >
                                    {(lightboxIndex ?? 0) + 1} /{' '}
                                    {galleryImages.length}
                                </span>
                            </div>
                        </div>
                    )}
            </main>
        </>
    );
}
