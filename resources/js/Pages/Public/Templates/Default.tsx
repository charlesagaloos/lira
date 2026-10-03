import {
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from 'react';

import type {
    CSSProperties,
    PointerEvent,
} from 'react';

import type {
    PortfolioGalleryImage,
    PortfolioProject,
    PortfolioProps,
    PortfolioRelease,
} from '../types';

function getContrastColor(
    backgroundColor: string,
): string {
    const value = backgroundColor.replace('#', '').trim();

    if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(value)) {
        return '#ffffff';
    }

    const hex = value.length === 3
        ? value
            .split('')
            .map((character) => `${character}${character}`)
            .join('')
        : value;

    const red = parseInt(hex.slice(0, 2), 16) / 255;
    const green = parseInt(hex.slice(2, 4), 16) / 255;
    const blue = parseInt(hex.slice(4, 6), 16) / 255;

    const luminance =
        0.2126 * red +
        0.7152 * green +
        0.0722 * blue;

    return luminance > 0.52 ? '#111111' : '#ffffff';
}

function formatReleaseDate(
    date: string | null,
): string | null {
    if (!date) {
        return null;
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return null;
    }

    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
    })
        .format(parsedDate)
        .toUpperCase();
}

function ProjectImage({
    project,
    className = '',
}: {
    project: PortfolioProject;
    className?: string;
}) {
    const containerRef = useRef<HTMLDivElement | null>(null);

    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(0);
    const [hovered, setHovered] = useState(false);
    const [pointer, setPointer] = useState({
        x: 0.5,
        y: 0.5,
    });

    useLayoutEffect(() => {
        const container = containerRef.current;

        if (!container) {
            return;
        }

        const updateOffsets = () => {
            setOffsetX(
                (project.thumbnail_offset_x / 100) *
                container.clientWidth,
            );

            setOffsetY(
                (project.thumbnail_offset_y / 100) *
                container.clientHeight,
            );
        };

        updateOffsets();

        const resizeObserver = new ResizeObserver(
            updateOffsets,
        );

        resizeObserver.observe(container);

        return () => {
            resizeObserver.disconnect();
        };
    }, [
        project.thumbnail_offset_x,
        project.thumbnail_offset_y,
    ]);

    function handlePointerMove(
        event: PointerEvent<HTMLDivElement>,
    ) {
        const rect =
            event.currentTarget.getBoundingClientRect();

        setPointer({
            x: (event.clientX - rect.left) / rect.width,
            y: (event.clientY - rect.top) / rect.height,
        });
    }

    const rotateX =
        (0.5 - pointer.y) * (hovered ? 2.4 : 0);

    const rotateY =
        (pointer.x - 0.5) * (hovered ? 2.4 : 0);

    return (
        <div
            ref={containerRef}
            className={`group relative overflow-hidden ${className}`}
            onPointerMove={handlePointerMove}
            onPointerEnter={() => setHovered(true)}
            onPointerLeave={() => {
                setHovered(false);
                setPointer({ x: 0.5, y: 0.5 });
            }}
            style={{
                perspective: '1400px',
            }}
        >
            <div
                className="absolute inset-0 transition-transform duration-700 ease-out"
                style={{
                    transform: `
                        rotateX(${rotateX}deg)
                        rotateY(${rotateY}deg)
                        scale(${hovered ? 1.015 : 1})
                    `,
                    transformStyle: 'preserve-3d',
                }}
            >
                {project.thumbnail ? (
                    <img
                        src={project.thumbnail}
                        alt={project.title}
                        className="h-full w-full select-none object-cover transition-transform duration-[1200ms] ease-out"
                        draggable={false}
                        style={{
                            objectPosition: `${project.thumbnail_position_x}% ${project.thumbnail_position_y}%`,
                            transform: `
                                translate(${offsetX}px, ${offsetY}px)
                                scale(${(project.thumbnail_zoom /
                                    100) *
                                (hovered ? 1.035 : 1)
                                })
                            `,
                            transformOrigin: 'center',
                        }}
                    />
                ) : (
                    <div
                        className="flex h-full w-full items-center justify-center"
                        style={{
                            backgroundColor:
                                'var(--portfolio-card)',
                        }}
                    >
                        <span
                            className="text-[9px] uppercase tracking-[0.3em]"
                            style={{
                                color:
                                    'var(--portfolio-card-text)',
                            }}
                        >
                            {project.project_type ??
                                'Selected Work'}
                        </span>
                    </div>
                )}
            </div>

            <div
                className="pointer-events-none absolute inset-0 transition-colors duration-700"
                style={{
                    backgroundColor: hovered
                        ? 'color-mix(in srgb, var(--portfolio-card-hover) 12%, transparent)'
                        : 'transparent',
                }}
            />

            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_48%,rgba(0,0,0,0.78)_100%)] opacity-75 transition-opacity duration-700 group-hover:opacity-95" />

            <div
                className="pointer-events-none absolute inset-0 border transition-colors duration-700"
                style={{
                    borderColor: hovered
                        ? 'var(--portfolio-card-hover)'
                        : 'var(--portfolio-border)',
                }}
            />

            <div className="pointer-events-none absolute bottom-5 left-5 right-5 flex items-end justify-between">
                <span
                    className="text-[8px] uppercase tracking-[0.28em]"
                    style={{
                        color:
                            'var(--portfolio-card-text)',
                    }}
                >
                    {project.project_type ??
                        'Selected Work'}
                </span>

                <span className="flex h-10 w-10 translate-y-2 items-center justify-center border border-white/20 bg-black/30 text-sm text-white opacity-0 backdrop-blur-xl transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    ↗
                </span>
            </div>
        </div>
    );
}

function ReleaseArtwork({
    release,
}: {
    release: PortfolioRelease;
}) {
    if (release.artwork) {
        return (
            <img
                src={`/storage/${release.artwork}`}
                alt={release.title}
                className="h-full w-full select-none object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                draggable={false}
            />
        );
    }

    return (
        <div
            className="relative flex h-full w-full items-center justify-center overflow-hidden"
            style={{
                backgroundColor:
                    'var(--portfolio-card)',
            }}
        >
            <div
                className="absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-10 blur-3xl"
                style={{
                    backgroundColor:
                        'var(--portfolio-primary)',
                }}
            />

            <div
                className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full opacity-10 blur-3xl"
                style={{
                    backgroundColor:
                        'var(--portfolio-accent)',
                }}
            />

            <span
                className="relative text-[9px] uppercase tracking-[0.35em]"
                style={{
                    color:
                        'var(--portfolio-card-text)',
                }}
            >
                {release.release_type}
            </span>
        </div>
    );
}

function StreamingLinks({
    release,
}: {
    release: PortfolioRelease;
}) {
    const links = [
        ['Spotify', release.spotify_url],
        ['Apple Music', release.apple_music_url],
        ['YouTube', release.youtube_url],
        ['SoundCloud', release.soundcloud_url],
        ['Bandcamp', release.bandcamp_url],
    ].filter(
        (
            item,
        ): item is [string, string] =>
            Boolean(item[1]),
    );

    if (links.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-wrap gap-x-5 gap-y-2">
            {links.map(([label, url]) => (
                <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[8px] uppercase tracking-[0.2em] transition-colors hover:text-white"
                    style={{
                        color:
                            'var(--portfolio-card-text)',
                    }}
                >
                    {label}
                </a>
            ))}
        </div>
    );
}

function getPrimaryStreamingLink(
    release: PortfolioRelease,
): { label: string; url: string } | null {
    const platforms: Array<[string, string | null]> = [
        ['Spotify', release.spotify_url],
        ['Apple Music', release.apple_music_url],
        ['YouTube', release.youtube_url],
        ['SoundCloud', release.soundcloud_url],
        ['Bandcamp', release.bandcamp_url],
    ];

    const platform = platforms.find(
        ([, url]) => Boolean(url),
    );

    if (!platform || !platform[1]) {
        return null;
    }

    return {
        label: platform[0],
        url: platform[1],
    };
}

function PlayButton({
    release,
    compact = false,
}: {
    release: PortfolioRelease;
    compact?: boolean;
}) {
    const streamingLink = getPrimaryStreamingLink(release);

    if (!streamingLink) {
        return null;
    }

    return (
        <a
            href={streamingLink.url}
            target="_blank"
            rel="noreferrer"
            aria-label={`Play ${release.title} on ${streamingLink.label}`}
            className={`group/play inline-flex items-center gap-3 border transition-all duration-500 hover:-translate-y-0.5 ${compact
                ? 'h-10 px-3'
                : 'h-12 px-4 sm:h-13 sm:px-5'
                }`}
            style={{
                borderColor: `${'var(--portfolio-primary)'}66`,
                backgroundColor:
                    'var(--portfolio-primary)',
                color: 'var(--portfolio-surface)',
            }}
        >
            <span
                className={`flex items-center justify-center rounded-full border ${compact
                    ? 'h-5 w-5'
                    : 'h-6 w-6'
                    }`}
                style={{
                    borderColor:
                        'currentColor',
                }}
            >
                <span
                    className={`ml-px ${compact
                        ? 'border-y-[3px] border-l-[4px]'
                        : 'border-y-[4px] border-l-[5px]'
                        } border-y-transparent border-l-current`}
                />
            </span>

            <span
                className={`text-[8px] font-semibold uppercase tracking-[0.22em] ${compact ? '' : 'sm:text-[9px]'
                    }`}
            >
                Play
            </span>

            <span
                className={`hidden text-[7px] uppercase tracking-[0.18em] opacity-60 sm:inline ${compact ? '' : ''
                    }`}
            >
                {streamingLink.label}
            </span>
        </a>
    );
}

function MusicSection({
    profile,
}: PortfolioProps) {
    const settings = profile.portfolio_settings;

    if (
        !settings.show_music ||
        profile.releases.length === 0
    ) {
        return null;
    }

    const releases =
        settings.music_release_display === 'all'
            ? profile.releases
            : profile.releases.slice(
                0,
                settings.music_release_limit,
            );

    if (releases.length === 0) {
        return null;
    }

    const featured =
        releases.find(
            (release) =>
                release.id ===
                settings.featured_release_id,
        ) ?? releases[0];

    const secondary = releases.filter(
        (release) => release.id !== featured.id,
    );

    return (
        <section
            id="music"
            className="border-t px-6 py-28 sm:px-8 lg:px-12 lg:py-40"
            style={{
                backgroundColor:
                    settings.background_color,
                borderColor:
                    `${settings.border_color}66`,
            }}
        >
            <div className="mx-auto max-w-[1600px]">
                <div className="mb-14 grid gap-8 border-b border-white/10 pb-12 lg:grid-cols-[1fr_auto] lg:items-end">
                    <div>
                        <p
                            className="text-[8px] uppercase tracking-[0.38em]"
                            style={{
                                color:
                                    settings.card_text_color,
                            }}
                        >
                            03 /{' '}
                            {settings.music_label ||
                                'Sound'}
                        </p>

                        <h2
                            className="mt-5 max-w-4xl text-6xl font-light leading-[0.88] tracking-[-0.07em] sm:text-7xl lg:text-8xl"
                            style={{
                                color:
                                    settings.primary_color,
                            }}
                        >
                            {settings.music_label ||
                                'Music'}
                        </h2>
                    </div>

                    <div className="flex items-end justify-between gap-6 lg:justify-end">
                        <p
                            className="max-w-xs text-xs leading-6"
                            style={{
                                color:
                                    settings.card_text_color,
                            }}
                        >
                            Releases, sounds, and moments
                            worth pressing play for.
                        </p>

                        <span
                            className="hidden text-[8px] uppercase tracking-[0.25em] sm:block"
                            style={{
                                color:
                                    settings.card_text_color,
                            }}
                        >
                            {releases.length}{' '}
                            {releases.length === 1
                                ? 'Release'
                                : 'Releases'}
                        </span>
                    </div>
                </div>

                <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] lg:gap-16">
                    <article className="group">
                        <div className="relative overflow-hidden">
                            <div
                                className="aspect-square overflow-hidden border"
                                style={{
                                    borderColor:
                                        `${settings.border_color}88`,
                                    backgroundColor:
                                        settings.card_background_color,
                                }}
                            >
                                <ReleaseArtwork
                                    release={featured}
                                />
                            </div>

                            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgba(0,0,0,0.82)_100%)]" />

                            <div className="absolute left-5 top-5 flex items-center gap-2 sm:left-7 sm:top-7">
                                <span
                                    className="h-px w-8"
                                    style={{
                                        backgroundColor:
                                            settings.accent_color,
                                    }}
                                />

                                <span className="text-[8px] uppercase tracking-[0.28em] text-white/65">
                                    Featured Release
                                </span>
                            </div>

                            <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-8">
                                <div className="flex items-end justify-between gap-6">
                                    <div className="min-w-0">
                                        <p className="text-[8px] uppercase tracking-[0.25em] text-white/55">
                                            {featured.release_type}
                                            {formatReleaseDate(
                                                featured.release_date,
                                            )
                                                ? ` · ${formatReleaseDate(featured.release_date)}`
                                                : ''}
                                        </p>

                                        <h3 className="mt-3 max-w-2xl text-4xl font-medium leading-[0.94] tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">
                                            {featured.title}
                                        </h3>
                                    </div>


                                </div>
                            </div>
                        </div>

                        <div className="grid gap-7 border-b border-white/10 py-7 sm:grid-cols-[1fr_auto] sm:items-end">
                            <div>
                                {featured.description && (
                                    <p
                                        className="max-w-2xl text-sm leading-7"
                                        style={{
                                            color:
                                                settings.card_text_color,
                                        }}
                                    >
                                        {featured.description}
                                    </p>
                                )}

                                {settings.show_music_links && (
                                    <div className="mt-6">
                                        <StreamingLinks
                                            release={featured}
                                        />
                                    </div>
                                )}
                            </div>

                            <PlayButton
                                release={featured}
                            />
                        </div>
                    </article>

                    <div className="lg:border-l lg:border-white/10 lg:pl-10">
                        <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
                            <span
                                className="text-[8px] uppercase tracking-[0.25em]"
                                style={{
                                    color:
                                        settings.card_text_color,
                                }}
                            >
                                More releases
                            </span>

                            <span
                                className="text-[8px] uppercase tracking-[0.2em]"
                                style={{
                                    color:
                                        settings.muted_text_color,
                                }}
                            >
                                {String(
                                    Math.max(
                                        secondary.length,
                                        0,
                                    ),
                                ).padStart(2, '0')}
                            </span>
                        </div>

                        {secondary.length > 0 ? (
                            <div>
                                {secondary.map(
                                    (
                                        release,
                                        index,
                                    ) => (
                                        <article
                                            key={
                                                release.id
                                            }
                                            className="group grid grid-cols-[72px_minmax(0,1fr)_auto] gap-4 border-b border-white/10 py-6 sm:grid-cols-[88px_minmax(0,1fr)_auto] sm:gap-5"
                                        >
                                            <div className="aspect-square overflow-hidden border border-white/10">
                                                <ReleaseArtwork
                                                    release={
                                                        release
                                                    }
                                                />
                                            </div>

                                            <div className="min-w-0 self-center">
                                                <div className="flex flex-wrap gap-x-3 gap-y-1">
                                                    <span
                                                        className="text-[7px] uppercase tracking-[0.2em]"
                                                        style={{
                                                            color:
                                                                settings.card_text_color,
                                                        }}
                                                    >
                                                        {String(
                                                            index +
                                                            2,
                                                        ).padStart(
                                                            2,
                                                            '0',
                                                        )}{' '}
                                                        /{' '}
                                                        {
                                                            release.release_type
                                                        }
                                                    </span>

                                                    {formatReleaseDate(
                                                        release.release_date,
                                                    ) && (
                                                            <span
                                                                className="text-[7px] uppercase tracking-[0.2em]"
                                                                style={{
                                                                    color:
                                                                        settings.card_text_color,
                                                                }}
                                                            >
                                                                {formatReleaseDate(
                                                                    release.release_date,
                                                                )}
                                                            </span>
                                                        )}
                                                </div>

                                                <h3
                                                    className="mt-2 truncate text-xl font-medium tracking-tight"
                                                    style={{
                                                        color:
                                                            settings.card_accent_color,
                                                    }}
                                                >
                                                    {
                                                        release.title
                                                    }
                                                </h3>

                                                {settings.show_music_links && (
                                                    <div className="mt-3">
                                                        <StreamingLinks
                                                            release={
                                                                release
                                                            }
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="self-center">
                                                <PlayButton
                                                    release={
                                                        release
                                                    }
                                                    compact
                                                />
                                            </div>
                                        </article>
                                    ),
                                )}
                            </div>
                        ) : (
                            <div className="flex min-h-48 items-center border-b border-white/10">
                                <p
                                    className="text-sm"
                                    style={{
                                        color:
                                            settings.card_text_color,
                                    }}
                                >
                                    Your latest release
                                    appears here.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

function GallerySection({
    profile,
}: PortfolioProps) {
    const settings = profile.portfolio_settings;
    const images = settings.gallery_images ?? [];

    const responsive = settings.gallery_responsive;

    const normalizeDisplay = (
        value: unknown,
        fallback:
            | 'grid'
            | 'masonry'
            | 'editorial'
            | 'freeform',
    ) => {
        const normalized =
            typeof value === 'string'
                ? value.trim().toLowerCase()
                : '';

        return normalized === 'grid' ||
            normalized === 'masonry' ||
            normalized === 'editorial' ||
            normalized === 'freeform'
            ? normalized
            : fallback;
    };

    const normalizeAspect = (
        value: unknown,
        fallback:
            | 'original'
            | 'square'
            | 'portrait'
            | 'landscape',
    ) => {
        const normalized =
            typeof value === 'string'
                ? value.trim().toLowerCase()
                : '';

        return normalized === 'original' ||
            normalized === 'square' ||
            normalized === 'portrait' ||
            normalized === 'landscape'
            ? normalized
            : fallback;
    };

    const normalizeColumns = (
        value: unknown,
        fallback: number,
        min: number,
        max: number,
    ) => {
        const numeric = Number(value);

        if (!Number.isFinite(numeric)) {
            return fallback;
        }

        return Math.min(
            Math.max(Math.round(numeric), min),
            max,
        );
    };

    const desktop = {
        display: normalizeDisplay(
            responsive?.desktop?.display,
            settings.gallery_display ?? 'grid',
        ),
        columns: normalizeColumns(
            responsive?.desktop?.columns,
            settings.gallery_columns ?? 3,
            2,
            5,
        ),
        image_aspect: normalizeAspect(
            responsive?.desktop?.image_aspect,
            settings.gallery_image_aspect ?? 'original',
        ),
    };

    const tablet = {
        display: normalizeDisplay(
            responsive?.tablet?.display,
            desktop.display,
        ),
        columns: normalizeColumns(
            responsive?.tablet?.columns,
            Math.min(desktop.columns, 3),
            2,
            4,
        ),
        image_aspect: normalizeAspect(
            responsive?.tablet?.image_aspect,
            desktop.image_aspect,
        ),
    };

    const mobile = {
        display: normalizeDisplay(
            responsive?.mobile?.display,
            desktop.display,
        ),
        columns: normalizeColumns(
            responsive?.mobile?.columns,
            1,
            1,
            2,
        ),
        image_aspect: normalizeAspect(
            responsive?.mobile?.image_aspect,
            desktop.image_aspect,
        ),
    };

    const [lightboxIndex, setLightboxIndex] =
        useState<number | null>(null);

    if (
        !settings.show_gallery ||
        images.length === 0
    ) {
        return null;
    }

    const activeImage =
        lightboxIndex !== null
            ? images[lightboxIndex]
            : null;

    function openLightbox(index: number) {
        if (!settings.gallery_enable_lightbox) {
            return;
        }

        setLightboxIndex(index);
    }

    function closeLightbox() {
        setLightboxIndex(null);
    }

    function showPreviousImage() {
        if (lightboxIndex === null) {
            return;
        }

        setLightboxIndex(
            lightboxIndex === 0
                ? images.length - 1
                : lightboxIndex - 1,
        );
    }

    function showNextImage() {
        if (lightboxIndex === null) {
            return;
        }

        setLightboxIndex(
            lightboxIndex === images.length - 1
                ? 0
                : lightboxIndex + 1,
        );
    }

    function getImageUrl(
        image: PortfolioGalleryImage,
    ) {
        const path = image.image;

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

        return `/storage/${path.replace(/^\/+/, '')}`;
    }

    function getAspectRatio(
        aspect:
            | 'original'
            | 'square'
            | 'portrait'
            | 'landscape',
    ) {
        switch (aspect) {
            case 'square':
                return '1 / 1';

            case 'portrait':
                return '4 / 5';

            case 'landscape':
                return '4 / 3';

            case 'original':
            default:
                return 'auto';
        }
    }

    function renderImage(
        image: PortfolioGalleryImage,
        index: number,
    ) {
        const imageUrl = getImageUrl(image);

        const content = (
            <div
                className="lira-gallery-card group relative overflow-hidden"
                style={{
                    borderColor:
                        `${settings.border_color}66`,
                    backgroundColor:
                        settings.card_background_color,
                }}
            >
                <div
                    className="lira-gallery-image-frame relative overflow-hidden"
                    style={{
                        '--gallery-mobile-aspect':
                            getAspectRatio(
                                mobile.image_aspect,
                            ),
                        '--gallery-tablet-aspect':
                            getAspectRatio(
                                tablet.image_aspect,
                            ),
                        '--gallery-desktop-aspect':
                            getAspectRatio(
                                desktop.image_aspect,
                            ),
                    } as CSSProperties}
                >
                    <img
                        src={imageUrl}
                        alt={
                            image.alt_text ||
                            image.title ||
                            settings.gallery_label ||
                            'Gallery image'
                        }
                        className="lira-gallery-image h-auto w-full select-none object-cover transition-transform duration-[1000ms] ease-out"
                        draggable={false}
                    />

                    <div
                        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                        style={{
                            background:
                                `linear-gradient(180deg, transparent 42%, ${settings.background_color}cc 100%)`,
                        }}
                    />

                    <div
                        className="pointer-events-none absolute inset-0 border transition-colors duration-500"
                        style={{
                            borderColor:
                                settings.border_color,
                        }}
                    />

                    {settings.gallery_enable_lightbox && (
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                            <span
                                className="flex h-12 w-12 items-center justify-center rounded-full border backdrop-blur-xl"
                                style={{
                                    borderColor:
                                        `${settings.primary_color}99`,
                                    backgroundColor:
                                        `${settings.background_color}bb`,
                                    color:
                                        settings.primary_color,
                                }}
                            >
                                ↗
                            </span>
                        </div>
                    )}
                </div>

                {(settings.gallery_show_titles ||
                    settings.gallery_show_captions) && (
                    <div className="lira-gallery-card-meta border-t px-4 py-4 sm:px-5">
                        {settings.gallery_show_titles &&
                            image.title && (
                                <h3
                                    className="text-sm font-medium tracking-tight"
                                    style={{
                                        color:
                                            settings.card_primary_color,
                                    }}
                                >
                                    {image.title}
                                </h3>
                            )}

                        {settings.gallery_show_captions &&
                            image.caption && (
                                <p
                                    className={`text-xs leading-6 ${
                                        image.title
                                            ? 'mt-2'
                                            : ''
                                    }`}
                                    style={{
                                        color:
                                            settings.card_text_color,
                                    }}
                                >
                                    {image.caption}
                                </p>
                            )}
                    </div>
                )}
            </div>
        );

        if (!settings.gallery_enable_lightbox) {
            return content;
        }

        return (
            <button
                type="button"
                onClick={() => openLightbox(index)}
                className="block w-full text-left"
                aria-label={`Open ${
                    image.title || 'gallery image'
                }`}
            >
                {content}
            </button>
        );
    }

    function renderGalleryItem(
        image: PortfolioGalleryImage,
        index: number,
    ) {
        return (
            <div
                key={image.id}
                className="lira-gallery-item"
            >
                {renderImage(image, index)}
            </div>
        );
    }

    const desktopColumns = normalizeColumns(
        desktop.columns,
        3,
        2,
        5,
    );

    const tabletColumns = normalizeColumns(
        tablet.columns,
        3,
        2,
        4,
    );

    const mobileColumns = normalizeColumns(
        mobile.columns,
        1,
        1,
        2,
    );

    return (
        <>
            <style>
                {`
                    .lira-gallery {
                        --gallery-mobile-columns:
                            ${mobileColumns};
                        --gallery-tablet-columns:
                            ${tabletColumns};
                        --gallery-desktop-columns:
                            ${desktopColumns};
                    }

                    .lira-gallery-image-frame {
                        aspect-ratio:
                            var(--gallery-mobile-aspect);
                    }

                    .lira-gallery-image {
                        height: 100%;
                    }

                    /* Grid */

                    .lira-gallery-grid {
                        display: grid;
                        grid-template-columns:
                            repeat(
                                var(--gallery-mobile-columns),
                                minmax(0, 1fr)
                            );
                        gap: 1rem;
                    }

                    .lira-gallery-grid
                    .lira-gallery-item {
                        min-width: 0;
                    }

                    .lira-gallery-grid
                    .lira-gallery-card {
                        border-width: 1px;
                    }

                    .lira-gallery-grid
                    .lira-gallery-card:hover
                    .lira-gallery-image {
                        transform: scale(1.025);
                    }

                    /* Masonry */

                    .lira-gallery-masonry {
                        column-count:
                            var(--gallery-mobile-columns);
                        column-gap: 1rem;
                    }

                    .lira-gallery-masonry
                    .lira-gallery-item {
                        break-inside: avoid;
                        margin-bottom: 1rem;
                    }

                    .lira-gallery-masonry
                    .lira-gallery-image-frame {
                        aspect-ratio: auto !important;
                        height: auto;
                    }

                    .lira-gallery-masonry
                    .lira-gallery-image {
                        display: block;
                        height: auto !important;
                        width: 100%;
                        object-fit: contain;
                    }

                    .lira-gallery-masonry
                    .lira-gallery-card:hover
                    .lira-gallery-image {
                        transform: scale(1.035);
                    }

                    /* Editorial */

                    .lira-gallery-editorial {
                        display: grid;
                        grid-template-columns:
                            repeat(
                                var(--gallery-mobile-columns),
                                minmax(0, 1fr)
                            );
                        gap: 2rem;
                        align-items: start;
                    }

                    .lira-gallery-editorial
                    .lira-gallery-item {
                        min-width: 0;
                    }

                    .lira-gallery-editorial
                    .lira-gallery-item:nth-child(2n) {
                        margin-top: 2.5rem;
                    }

                    .lira-gallery-editorial
                    .lira-gallery-card {
                        border-width: 0;
                        background: transparent;
                    }

                    .lira-gallery-editorial
                    .lira-gallery-card
                    .lira-gallery-image-frame {
                        border: 0;
                    }

                    .lira-gallery-editorial
                    .lira-gallery-card
                    .lira-gallery-image {
                        filter: saturate(0.88);
                    }

                    .lira-gallery-editorial
                    .lira-gallery-card:hover
                    .lira-gallery-image {
                        transform: scale(1.025);
                        filter: saturate(1);
                    }

                    /* Freeform / Bento */

                    .lira-gallery-freeform {
                        display: grid;
                        grid-template-columns:
                            repeat(
                                var(--gallery-mobile-columns),
                                minmax(0, 1fr)
                            );
                        gap: 0.75rem;
                        align-items: stretch;
                    }

                    .lira-gallery-freeform
                    .lira-gallery-item {
                        min-width: 0;
                        min-height: 0;
                        position: relative;
                        z-index: 1;
                    }

                    .lira-gallery-freeform
                    .lira-gallery-item > button {
                        display: block;
                        height: 100%;
                        width: 100%;
                    }

                    .lira-gallery-freeform
                    .lira-gallery-card {
                        position: relative;
                        height: 100%;
                        border: 0;
                        background: transparent;
                        box-shadow:
                            0 18px 50px rgba(0, 0, 0, 0.16);
                        transition:
                            transform 500ms cubic-bezier(
                                0.22,
                                1,
                                0.36,
                                1
                            ),
                            box-shadow 500ms cubic-bezier(
                                0.22,
                                1,
                                0.36,
                                1
                            );
                    }

                    .lira-gallery-freeform
                    .lira-gallery-card
                    .lira-gallery-image-frame {
                        height: 100%;
                        min-height: 100%;
                        aspect-ratio: auto !important;
                        border: 1px solid
                            ${settings.border_color}66;
                        background:
                            ${settings.card_background_color};
                        box-shadow:
                            inset 0 0 0 1px
                            rgba(255, 255, 255, 0.035);
                    }

                    .lira-gallery-freeform
                    .lira-gallery-card
                    .lira-gallery-image {
                        height: 100%;
                        min-height: 100%;
                        object-fit: cover;
                    }

                    .lira-gallery-freeform
                    .lira-gallery-card
                    .lira-gallery-card-meta {
                        display: none;
                        position: absolute;
                        inset: auto 0 0 0;
                        z-index: 3;
                        border-top: 0;
                        padding:
                            3.5rem 1rem 1rem;
                        background:
                            linear-gradient(
                                180deg,
                                transparent 0%,
                                rgba(0, 0, 0, 0.72) 100%
                            );
                        opacity: 0.94;
                        pointer-events: none;
                    }

                    .lira-gallery-freeform
                    .lira-gallery-card
                    .lira-gallery-card-meta {
                        color:
                            ${settings.card_text_color};
                    }

                    .lira-gallery-freeform
                    .lira-gallery-card
                    .lira-gallery-card-meta h3 {
                        color:
                            ${settings.card_primary_color};
                        text-shadow:
                            0 1px 18px rgba(0, 0, 0, 0.35);
                    }

                    .lira-gallery-freeform
                    .lira-gallery-card
                    .lira-gallery-card-meta p {
                        color:
                            ${settings.card_text_color};
                        display:
                            -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                    }

                    .lira-gallery-freeform
                    .lira-gallery-card:hover {
                        transform: translateY(-0.35rem);
                        box-shadow:
                            0 28px 70px rgba(0, 0, 0, 0.24);
                    }

                    .lira-gallery-freeform
                    .lira-gallery-card:hover
                    .lira-gallery-image {
                        transform: scale(1.025);
                    }

                    .lira-gallery-freeform
                    .lira-gallery-card:hover
                    .lira-gallery-card-meta {
                        opacity: 1;
                    }

                    .lira-gallery-freeform
                    .lira-gallery-item:focus-within {
                        z-index: 5;
                    }


                    /* Gallery Layout */

                    .lira-gallery-grid {
                        display: var(--gallery-grid-display-mobile);
                    }

                    .lira-gallery-masonry {
                        display: var(--gallery-masonry-display-mobile);
                    }

                    .lira-gallery-editorial {
                        display: var(--gallery-editorial-display-mobile);
                    }

                    .lira-gallery-freeform {
                        display: var(--gallery-freeform-display-mobile);
                    }

                    /* Mobile */

                    @media (max-width: 639px) {
                        .lira-gallery-editorial {
                            grid-template-columns:
                                minmax(0, 1fr);
                        }

                        .lira-gallery-editorial
                        .lira-gallery-item {
                            grid-column: 1 / -1;
                            margin-top: 0;
                        }

                        .lira-gallery-freeform {
                            grid-template-columns:
                                minmax(0, 1fr);
                            grid-auto-rows:
                                minmax(0, 300px);
                            gap: 0.75rem;
                            padding-bottom: 1rem;
                        }

                        .lira-gallery-freeform
                        .lira-gallery-item {
                            grid-column: 1 / -1;
                            grid-row: span 1;
                        }

                        .lira-gallery-freeform
                        .lira-gallery-card {
                            transform: none;
                        }

                        .lira-gallery-freeform
                        .lira-gallery-card:hover {
                            transform: none;
                        }

                        .lira-gallery-freeform
                        .lira-gallery-card
                        .lira-gallery-card-meta {
                            padding:
                                4rem 1rem 1rem;
                        }

                    }

                    /* Tablet */

                    @media (min-width: 640px) {
                        .lira-gallery-grid {
                            display: var(--gallery-grid-display-tablet);
                        }

                        .lira-gallery-masonry {
                            display: var(--gallery-masonry-display-tablet);
                        }

                        .lira-gallery-editorial {
                            display: var(--gallery-editorial-display-tablet);
                        }

                        .lira-gallery-freeform {
                            display: var(--gallery-freeform-display-tablet);
                        }

                        .lira-gallery-image-frame {
                            aspect-ratio:
                                var(--gallery-tablet-aspect);
                        }

                        .lira-gallery-grid {
                            grid-template-columns:
                                repeat(
                                    var(--gallery-tablet-columns),
                                    minmax(0, 1fr)
                                );
                            gap: 1.25rem;
                        }

                        .lira-gallery-masonry {
                            column-count:
                                var(--gallery-tablet-columns);
                            column-gap: 1.25rem;
                        }

                        .lira-gallery-masonry
                        .lira-gallery-image-frame {
                            aspect-ratio: auto !important;
                            height: auto;
                        }

                        .lira-gallery-masonry
                        .lira-gallery-image {
                            height: auto !important;
                            object-fit: contain;
                        }

                        .lira-gallery-masonry
                        .lira-gallery-item {
                            margin-bottom: 1.25rem;
                        }

                        .lira-gallery-editorial {
                        width: min(100%, 1080px);
                        margin-inline: auto;
                        grid-template-columns:
                            repeat(6, minmax(0, 1fr));
                        gap: 1.5rem;
                    }

                    .lira-gallery-editorial
                    .lira-gallery-item:nth-child(6n + 1) {
                        grid-column: 1 / span 4;
                        margin-top: 0;
                    }

                    .lira-gallery-editorial
                    .lira-gallery-item:nth-child(6n + 2) {
                        grid-column: 5 / span 2;
                        margin-top: 3.25rem;
                    }

                    .lira-gallery-editorial
                    .lira-gallery-item:nth-child(6n + 3) {
                        grid-column: 2 / span 3;
                        margin-top: 1.5rem;
                    }

                    .lira-gallery-editorial
                    .lira-gallery-item:nth-child(6n + 4) {
                        grid-column: 4 / span 3;
                        margin-top: 3.25rem;
                    }

                    .lira-gallery-editorial
                    .lira-gallery-item:nth-child(6n + 5) {
                        grid-column: 1 / span 4;
                        margin-top: 1.5rem;
                    }

                    .lira-gallery-editorial
                    .lira-gallery-item:nth-child(6n + 6) {
                        grid-column: 5 / span 2;
                        margin-top: 4rem;
                    }

                    .lira-gallery-freeform {
                        grid-template-columns:
                            repeat(4, minmax(0, 1fr));
                        grid-auto-rows:
                            clamp(104px, 10.5vw, 148px);
                        gap: 0.75rem;
                        padding-bottom: 2rem;
                    }

                    .lira-gallery-freeform
                    .lira-gallery-item:nth-child(1) {
                        grid-column: span 1;
                        grid-row: span 3;
                    }

                    .lira-gallery-freeform
                    .lira-gallery-item:nth-child(2) {
                        grid-column: span 2;
                        grid-row: span 2;
                    }

                    .lira-gallery-freeform
                    .lira-gallery-item:nth-child(3) {
                        grid-column: span 1;
                        grid-row: span 3;
                    }

                    .lira-gallery-freeform
                    .lira-gallery-item:nth-child(4) {
                        grid-column: span 2;
                        grid-row: span 2;
                    }

                    .lira-gallery-freeform
                    .lira-gallery-item:nth-child(5) {
                        grid-column: span 1;
                        grid-row: span 3;
                    }

                    .lira-gallery-freeform
                    .lira-gallery-item:nth-child(6) {
                        grid-column: span 2;
                        grid-row: span 2;
                    }

                    .lira-gallery-freeform
                    .lira-gallery-item:nth-child(7) {
                        grid-column: span 1;
                        grid-row: span 3;
                    }

                    }

                    /* Desktop */

                    @media (min-width: 1024px) {
                        .lira-gallery-grid {
                            display: var(--gallery-grid-display-desktop);
                        }

                        .lira-gallery-masonry {
                            display: var(--gallery-masonry-display-desktop);
                        }

                        .lira-gallery-editorial {
                            display: var(--gallery-editorial-display-desktop);
                        }

                        .lira-gallery-freeform {
                            display: var(--gallery-freeform-display-desktop);
                        }

                        .lira-gallery-image-frame {
                            aspect-ratio:
                                var(--gallery-desktop-aspect);
                        }

                        .lira-gallery-grid {
                            grid-template-columns:
                                repeat(
                                    var(--gallery-desktop-columns),
                                    minmax(0, 1fr)
                                );
                            gap: 1.5rem;
                        }

                        .lira-gallery-masonry {
                            column-count:
                                var(--gallery-desktop-columns);
                            column-gap: 1.5rem;
                        }

                        .lira-gallery-masonry
                        .lira-gallery-image-frame {
                            aspect-ratio: auto !important;
                            height: auto;
                        }

                        .lira-gallery-masonry
                        .lira-gallery-image {
                            height: auto !important;
                            object-fit: contain;
                        }

                        .lira-gallery-masonry
                        .lira-gallery-item {
                            margin-bottom: 1.5rem;
                        }

                        /* Editorial */

                        .lira-gallery-editorial {
                            width: min(100%, 1180px);
                            margin-inline: auto;
                            grid-template-columns:
                                repeat(12, minmax(0, 1fr));
                            gap: 2rem;
                            align-items: start;
                        }

                        .lira-gallery-editorial
                        .lira-gallery-item:nth-child(6n + 1) {
                            grid-column: 1 / span 7;
                        }

                        .lira-gallery-editorial
                        .lira-gallery-item:nth-child(6n + 2) {
                            grid-column: 9 / span 3;
                            margin-top: 6.5rem;
                        }

                        .lira-gallery-editorial
                        .lira-gallery-item:nth-child(6n + 3) {
                            grid-column: 2 / span 4;
                            margin-top: 1.5rem;
                        }

                        .lira-gallery-editorial
                        .lira-gallery-item:nth-child(6n + 4) {
                            grid-column: 7 / span 5;
                            margin-top: 5rem;
                        }

                        .lira-gallery-editorial
                        .lira-gallery-item:nth-child(6n + 5) {
                            grid-column: 1 / span 8;
                            margin-top: 2rem;
                        }

                        .lira-gallery-editorial
                        .lira-gallery-item:nth-child(6n + 6) {
                            grid-column: 10 / span 2;
                            margin-top: 7rem;
                        }

                        /* Freeform / Bento */

                        .lira-gallery-freeform {
                            width: min(100%, 1600px);
                            margin-inline: auto;
                            grid-template-columns:
                                repeat(4, minmax(0, 1fr));
                            grid-auto-rows:
                                clamp(116px, 9vw, 174px);
                            column-gap: 0.75rem;
                            row-gap: 0.75rem;
                            align-items: stretch;
                            padding-bottom: 3rem;
                        }

                        .lira-gallery-freeform
                        .lira-gallery-item {
                            position: relative;
                            z-index: 1;
                        }

                        .lira-gallery-freeform
                        .lira-gallery-item:nth-child(1) {
                            grid-column: span 1;
                            grid-row: span 3;
                        }

                        .lira-gallery-freeform
                        .lira-gallery-item:nth-child(2) {
                            grid-column: span 2;
                            grid-row: span 2;
                        }

                        .lira-gallery-freeform
                        .lira-gallery-item:nth-child(3) {
                            grid-column: span 1;
                            grid-row: span 3;
                        }

                        .lira-gallery-freeform
                        .lira-gallery-item:nth-child(4) {
                            grid-column: span 2;
                            grid-row: span 2;
                        }

                        .lira-gallery-freeform
                        .lira-gallery-item:nth-child(5) {
                            grid-column: span 1;
                            grid-row: span 3;
                        }

                        .lira-gallery-freeform
                        .lira-gallery-item:nth-child(6) {
                            grid-column: span 2;
                            grid-row: span 2;
                        }

                        .lira-gallery-freeform
                        .lira-gallery-item:nth-child(7) {
                            grid-column: span 1;
                            grid-row: span 3;
                        }

                        .lira-gallery-freeform
                        .lira-gallery-item:hover {
                            z-index: 5;
                        }

                        .lira-gallery-freeform
                        .lira-gallery-card {
                            box-shadow:
                                0 24px 60px rgba(
                                    0,
                                    0,
                                    0,
                                    0.18
                                );
                        }

                        .lira-gallery-freeform
                        .lira-gallery-card:hover {
                            transform:
                                translateY(-0.4rem)
                                scale(1.008);
                            box-shadow:
                                0 34px 80px rgba(
                                    0,
                                    0,
                                    0,
                                    0.26
                                );
                        }

                        .lira-gallery-freeform
                        .lira-gallery-card
                        .lira-gallery-card-meta {
                            padding:
                                4rem 1.25rem 1.15rem;
                        }



                    }

                `}
            </style>

            <section
                id="gallery"
                className="lira-gallery border-t px-6 py-28 sm:px-8 lg:px-12 lg:py-40"
                data-mobile-display={mobile.display}
                data-tablet-display={tablet.display}
                data-desktop-display={desktop.display}
                data-mobile-columns={mobileColumns}
                data-tablet-columns={tabletColumns}
                data-desktop-columns={desktopColumns}
                style={{
                    backgroundColor:
                        settings.surface_color,
                    borderColor:
                        `${settings.border_color}66`,
                    '--gallery-mobile-columns':
                        mobileColumns,
                    '--gallery-tablet-columns':
                        tabletColumns,
                    '--gallery-desktop-columns':
                        desktopColumns,
                    '--gallery-grid-display-mobile':
                        mobile.display === 'grid'
                            ? 'grid'
                            : 'none',
                    '--gallery-masonry-display-mobile':
                        mobile.display === 'masonry'
                            ? 'block'
                            : 'none',
                    '--gallery-editorial-display-mobile':
                        mobile.display === 'editorial'
                            ? 'grid'
                            : 'none',
                    '--gallery-freeform-display-mobile':
                        mobile.display === 'freeform'
                            ? 'grid'
                            : 'none',
                    '--gallery-grid-display-tablet':
                        tablet.display === 'grid'
                            ? 'grid'
                            : 'none',
                    '--gallery-masonry-display-tablet':
                        tablet.display === 'masonry'
                            ? 'block'
                            : 'none',
                    '--gallery-editorial-display-tablet':
                        tablet.display === 'editorial'
                            ? 'grid'
                            : 'none',
                    '--gallery-freeform-display-tablet':
                        tablet.display === 'freeform'
                            ? 'grid'
                            : 'none',
                    '--gallery-grid-display-desktop':
                        desktop.display === 'grid'
                            ? 'grid'
                            : 'none',
                    '--gallery-masonry-display-desktop':
                        desktop.display === 'masonry'
                            ? 'block'
                            : 'none',
                    '--gallery-editorial-display-desktop':
                        desktop.display === 'editorial'
                            ? 'grid'
                            : 'none',
                    '--gallery-freeform-display-desktop':
                        desktop.display === 'freeform'
                            ? 'grid'
                            : 'none',
                } as CSSProperties}
            >
                <div className="mx-auto max-w-[1600px]">
                    <div className="mb-14 grid gap-8 border-b border-white/10 pb-12 lg:grid-cols-[1fr_0.8fr] lg:items-end">
                        <div>
                            <p
                                className="text-[8px] uppercase tracking-[0.38em]"
                                style={{
                                    color:
                                        settings.card_text_color,
                                }}
                            >
                                04 /{' '}
                                {settings.gallery_label ||
                                    'Gallery'}
                            </p>

                            <h2
                                className="mt-5 max-w-4xl text-6xl font-light leading-[0.9] tracking-[-0.065em] sm:text-7xl lg:text-8xl"
                                style={{
                                    color:
                                        settings.primary_color,
                                }}
                            >
                                {settings.gallery_label ||
                                    'Gallery'}
                            </h2>
                        </div>

                        {settings.gallery_description && (
                            <p
                                className="max-w-sm justify-self-start text-sm leading-7 lg:justify-self-end"
                                style={{
                                    color:
                                        settings.card_text_color,
                                }}
                            >
                                {settings.gallery_description}
                            </p>
                        )}
                    </div>

                    <div className="relative">
                        <div className="lira-gallery-grid">
                            {images.map(
                                renderGalleryItem,
                            )}
                        </div>

                        <div className="lira-gallery-masonry">
                            {images.map(
                                renderGalleryItem,
                            )}
                        </div>

                        <div className="lira-gallery-editorial">
                            {images.map(
                                renderGalleryItem,
                            )}
                        </div>

                        <div className="lira-gallery-freeform">
                            {images.map(
                                renderGalleryItem,
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {activeImage && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-5 backdrop-blur-xl sm:p-8"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Gallery lightbox"
                    onClick={closeLightbox}
                >
                    <button
                        type="button"
                        onClick={closeLightbox}
                        className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center border border-white/20 bg-black/40 text-white transition-colors hover:bg-white/10 sm:right-8 sm:top-8"
                        aria-label="Close gallery"
                    >
                        ×
                    </button>

                    {images.length > 1 && (
                        <>
                            <button
                                type="button"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    showPreviousImage();
                                }}
                                className="absolute left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-white/20 bg-black/40 text-lg text-white transition-colors hover:bg-white/10 sm:left-8"
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
                                className="absolute right-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-white/20 bg-black/40 text-lg text-white transition-colors hover:bg-white/10 sm:right-8"
                                aria-label="Next image"
                            >
                                →
                            </button>
                        </>
                    )}

                    <div
                        className="relative flex max-h-[90vh] max-w-[90vw] flex-col"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <img
                            src={getImageUrl(activeImage)}
                            alt={
                                activeImage.alt_text ||
                                activeImage.title ||
                                settings.gallery_label ||
                                'Gallery image'
                            }
                            className="max-h-[78vh] max-w-[90vw] object-contain"
                            draggable={false}
                        />

                        {(activeImage.title ||
                            activeImage.caption) && (
                            <div className="mt-4 border-t border-white/10 pt-4">
                                {activeImage.title && (
                                    <h3 className="text-sm font-medium text-white">
                                        {activeImage.title}
                                    </h3>
                                )}

                                {activeImage.caption && (
                                    <p className="mt-1 max-w-2xl text-xs leading-6 text-white/55">
                                        {
                                            activeImage.caption
                                        }
                                    </p>
                                )}
                            </div>
                        )}

                        <span className="absolute bottom-0 right-0 translate-y-7 text-[8px] uppercase tracking-[0.25em] text-white/35">
                            {(lightboxIndex ?? 0) + 1}{' '}
                            / {images.length}
                        </span>
                    </div>
                </div>
            )}
        </>
    );
}

type PortfolioNavigationItem = {
    id?: number;
    label: string;
    destination: string;
    url: string | null;
    sort_order: number;
    is_visible: boolean;
};

type PortfolioNavigationSettings = {
    navigation_items?: PortfolioNavigationItem[];
};

function getNavigationHref(
    destination: string,
): string | null {
    switch (destination) {
        case 'home':
            return '#top';

        case 'work':
            return '#work';

        case 'gallery':
            return '#gallery';

        case 'music':
            return '#music';

        case 'about':
            return '#about';

        case 'artist_message':
            return '#artist-message';

        case 'footer':
            return '#footer';

        default:
            return null;
    }
}

function isNavigationItemAvailable(
    item: PortfolioNavigationItem,
    profile: PortfolioProps['profile'],
): boolean {
    const settings = profile.portfolio_settings;
    switch (item.destination) {
        case 'home':
            return true;

        case 'work':
            return settings.show_work;

        case 'gallery':
            return (
                settings.show_gallery &&
                (settings.gallery_images?.length ?? 0) > 0
            );

        case 'music':
            return (
                settings.show_music &&
                profile.releases.length > 0
            );

        case 'about':
            return settings.show_about;

        case 'artist_message':
            return (
                settings.show_artist_message &&
                Boolean(settings.artist_message?.trim())
            );

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

export default function DefaultTemplate({
    profile,
}: PortfolioProps) {
    const settings = profile.portfolio_settings;

    const navigationSettings =
        settings as typeof settings &
        PortfolioNavigationSettings;

    const navigationItems =
        (navigationSettings.navigation_items ?? [])
            .filter(
                (item) =>
                    item.is_visible &&
                    isNavigationItemAvailable(
                        item,
                        profile,
                    ),
            )
            .sort(
                (a, b) =>
                    a.sort_order - b.sort_order,
            );

    const [navigationScrolled, setNavigationScrolled] =
        useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] =
        useState(false);
    const [shareFeedback, setShareFeedback] =
        useState(false);

    const initials = profile.display_name
        .split(' ')
        .map((name) => name[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    useEffect(() => {
        const onScroll = () => {
            const current = window.scrollY;

            setNavigationScrolled(current > 40);
        };

        onScroll();

        window.addEventListener(
            'scroll',
            onScroll,
            { passive: true },
        );

        return () => {
            window.removeEventListener(
                'scroll',
                onScroll,
            );
        };
    }, []);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setMobileMenuOpen(false);
            }
        };

        window.addEventListener('keydown', onKeyDown);

        return () => {
            window.removeEventListener(
                'keydown',
                onKeyDown,
            );
        };
    }, []);

    async function handleShare() {
        const shareData = {
            title: profile.display_name,
            text:
                settings.hero_statement ??
                profile.bio ??
                `Discover ${profile.display_name}'s portfolio on LIRA.`,
            url: window.location.href,
        };

        try {
            if (typeof navigator.share === 'function') {
                await navigator.share(shareData);
                return;
            }

            if (
                typeof navigator.clipboard?.writeText ===
                'function'
            ) {
                await navigator.clipboard.writeText(
                    window.location.href,
                );
                setShareFeedback(true);

                window.setTimeout(() => {
                    setShareFeedback(false);
                }, 1800);
            }
        } catch {
            /* Sharing can be cancelled by the visitor. */
        }
    }

    const featuredProject =
        profile.projects[0] ?? null;

    const secondaryProjects =
        profile.projects.slice(1, 3);

    const remainingProjects =
        profile.projects.slice(3);

    const pageStyle = {
        backgroundColor:
            settings.background_color,
        color: settings.text_color,
        '--portfolio-primary':
            settings.primary_color,
        '--portfolio-accent':
            settings.accent_color,
        '--portfolio-card':
            settings.card_background_color,
        '--portfolio-card-text':
            settings.card_text_color,
        '--portfolio-hover':
            settings.hover_color,
        '--portfolio-surface':
            settings.surface_color,
        '--portfolio-muted':
            settings.muted_text_color,
        '--portfolio-border':
            settings.border_color,
        '--portfolio-card-primary':
            settings.card_primary_color,
        '--portfolio-card-hover':
            settings.card_hover_color,
    } as CSSProperties;

    /*
     * The hero has a dark readability overlay, so navigation stays light
     * while it is sitting over the cover image. Once the navigation becomes
     * a solid bar, it also stays light. If there is no cover image, fall back
     * to the portfolio background contrast.
     */
    const hasHeroNavigationBackdrop =
        settings.show_hero &&
        Boolean(profile.cover_image);

    const navTextColor =
        navigationScrolled || hasHeroNavigationBackdrop
            ? '#ffffff'
            : getContrastColor(settings.background_color);

    const mobileNavigationBackground =
        navigationScrolled
            ? 'rgba(12, 12, 12, 0.94)'
            : hasHeroNavigationBackdrop
                ? 'rgba(12, 12, 12, 0.78)'
                : settings.background_color;

    return (
        <main
            id="top"
            className="min-h-screen overflow-x-hidden"
            style={pageStyle}
        >
            {settings.show_navigation && (
                <nav
                    className={`fixed left-0 top-0 z-50 w-full border-b transition-all duration-500 ${navigationScrolled
                        ? 'border-b'
                        : 'border-transparent'
                        }`}
                    style={{
                        backgroundColor: navigationScrolled
                            ? 'rgba(12, 12, 12, 0.82)'
                            : 'transparent',
                        borderColor: navigationScrolled
                            ? `${settings.accent_color}35`
                            : 'transparent',
                        backdropFilter: navigationScrolled
                            ? 'blur(18px) saturate(120%)'
                            : 'none',
                        WebkitBackdropFilter: navigationScrolled
                            ? 'blur(18px) saturate(120%)'
                            : 'none',
                        boxShadow: navigationScrolled
                            ? `0 10px 30px rgba(0,0,0,0.16), 0 1px 0 ${settings.accent_color}10`
                            : 'none',
                    }}
                >
                    <div className="relative mx-auto flex h-12 max-w-6xl items-center justify-between px-4 sm:h-14 sm:px-2">
                        <a
                            href="#top"
                            className="group flex min-w-0 items-center gap-2.5 sm:gap-3"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <span className="relative flex h-7 w-7 shrink-0 items-center justify-center">
                                <span
                                    className="h-1.5 w-1.5 rounded-full transition-all duration-500 group-hover:scale-125"
                                    style={{
                                        backgroundColor:
                                            navTextColor,
                                        boxShadow: `0 0 14px ${settings.primary_color}`,
                                    }}
                                />
                            </span>

                            <span
                                className="max-w-[120px] truncate text-[8px] font-semibold uppercase tracking-[0.28em] transition-opacity duration-300 group-hover:opacity-70 sm:max-w-none sm:text-[9px] sm:tracking-[0.34em]"
                                style={{
                                    color: navTextColor,
                                }}
                            >
                                {profile.display_name}
                            </span>
                        </a>

                        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center md:flex">
                            <div className="flex items-center">
                                {navigationItems.map((item) => {
                                    const href =
                                        getNavigationHref(
                                            item.destination,
                                        );

                                    const isExternal =
                                        item.destination ===
                                        'external';

                                    if (
                                        !href &&
                                        !isExternal
                                    ) {
                                        return null;
                                    }

                                    return (
                                        <a
                                            key={
                                                item.id ??
                                                `${item.destination}-${item.sort_order}`
                                            }
                                            href={
                                                isExternal
                                                    ? item.url ??
                                                    '#'
                                                    : href ??
                                                    '#'
                                            }
                                            target={
                                                isExternal
                                                    ? '_blank'
                                                    : undefined
                                            }
                                            rel={
                                                isExternal
                                                    ? 'noreferrer'
                                                    : undefined
                                            }
                                            className="group relative px-4 py-2 text-[8px] uppercase tracking-[0.28em]"
                                            style={{ color: navTextColor }}
                                        >
                                            <span className="transition-colors duration-300 group-hover:opacity-60">
                                                {item.label}
                                            </span>

                                            <span
                                                className="absolute inset-x-4 bottom-0 h-px origin-center scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                                                style={{
                                                    backgroundColor:
                                                        settings.accent_color,
                                                }}
                                            />
                                        </a>
                                    );
                                })}
                            </div>
                        </div>

                        {settings.show_work && (


                            <a
                                href="#work"
                                className="group hidden items-center gap-3 md:flex"
                            >
                                <span
                                    className="text-[8px] uppercase tracking-[0.28em] transition-colors duration-300 group-hover:opacity-60"
                                    style={{
                                        color: navTextColor,
                                    }}
                                >
                                    Explore
                                </span>

                                <span className="flex h-7 w-7 items-center justify-center transition-transform duration-500 group-hover:translate-y-0.5">
                                    <span
                                        className="text-[11px]"
                                        style={{
                                            color:
                                                settings.accent_color,
                                        }}
                                    >
                                        ↓
                                    </span>
                                </span>
                            </a>


                        )}

                        <button
                            type="button"
                            className="group flex h-9 w-9 items-center justify-center border transition-colors duration-300 md:hidden"
                            style={{
                                borderColor: navigationScrolled
                                    ? `${settings.accent_color}66`
                                    : `${navTextColor}30`,
                                backgroundColor: navigationScrolled
                                    ? `${settings.accent_color}0d`
                                    : 'transparent',
                            }}
                            aria-label={
                                mobileMenuOpen
                                    ? 'Close navigation menu'
                                    : 'Open navigation menu'
                            }
                            aria-expanded={mobileMenuOpen}
                            onClick={() =>
                                setMobileMenuOpen((open) => !open)
                            }
                        >
                            <span className="relative flex h-3.5 w-4 items-center justify-center">
                                <span
                                    className={`absolute h-px w-4 transition-transform duration-300 ${mobileMenuOpen
                                        ? 'rotate-45'
                                        : '-translate-y-1.5'
                                        }`}
                                    style={{
                                        backgroundColor:
                                            navTextColor,
                                    }}
                                />
                                <span
                                    className={`absolute h-px w-4 transition-transform duration-300 ${mobileMenuOpen
                                        ? '-rotate-45'
                                        : 'translate-y-1.5'
                                        }`}
                                    style={{
                                        backgroundColor:
                                            navTextColor,
                                    }}
                                />
                            </span>
                        </button>
                    </div>

                    <div
                        className={`overflow-hidden transition-all duration-500 md:hidden ${mobileMenuOpen
                            ? 'max-h-[80vh] opacity-100'
                            : 'max-h-0 opacity-0'
                            }`}
                    >
                        <div
                            className="border-t px-4 pb-4 pt-2"
                            style={{
                                borderColor: `${settings.accent_color}28`,
                                backgroundColor:
                                    mobileNavigationBackground,
                            }}
                        >
                            <div className="grid gap-1">
                                {navigationItems.map((item) => {
                                    const href =
                                        getNavigationHref(
                                            item.destination,
                                        );

                                    const isExternal =
                                        item.destination ===
                                        'external';

                                    if (
                                        !href &&
                                        !isExternal
                                    ) {
                                        return null;
                                    }

                                    return (
                                        <a
                                            key={
                                                item.id ??
                                                `${item.destination}-${item.sort_order}`
                                            }
                                            href={
                                                isExternal
                                                    ? item.url ??
                                                    '#'
                                                    : href ??
                                                    '#'
                                            }
                                            target={
                                                isExternal
                                                    ? '_blank'
                                                    : undefined
                                            }
                                            rel={
                                                isExternal
                                                    ? 'noreferrer'
                                                    : undefined
                                            }
                                            className="group flex items-center justify-between border-b border-white/[0.06] px-2 py-4 text-[9px] uppercase tracking-[0.28em] transition-colors hover:opacity-60 last:border-b-0"
                                            style={{ color: navTextColor }}
                                            onClick={() =>
                                                setMobileMenuOpen(
                                                    false,
                                                )
                                            }
                                        >
                                            <span>
                                                {item.label}
                                            </span>

                                            <span
                                                className="text-[12px] opacity-60 transition-transform duration-300 group-hover:translate-x-1"
                                                style={{
                                                    color:
                                                        settings.accent_color,
                                                }}
                                            >
                                                →
                                            </span>
                                        </a>
                                    );
                                })}
                            </div>

                            <div
                                className="mt-2 flex items-center justify-between border-t px-2 pt-3"
                                style={{
                                    borderColor: `${settings.accent_color}20`,
                                }}
                            >
                                <span
                                    className="text-[7px] uppercase tracking-[0.28em]"
                                    style={{
                                        color: navTextColor,
                                    }}
                                >
                                    {profile.display_name}
                                </span>

                            </div>
                        </div>
                    </div>
                </nav>
            )}

            {settings.show_hero && (
                <section className="relative min-h-screen overflow-hidden">
                    {profile.cover_image ? (
                        <div
                            className="absolute inset-0"
                            style={{
                                transform: `
                translate(
                    ${settings.cover_image_offset_x}%,
                    ${settings.cover_image_offset_y}%
                )
            `,
                            }}
                        >
                            <img
                                src={profile.cover_image}
                                alt=""
                                className="absolute inset-0 h-full w-full select-none object-cover"
                                draggable={false}
                                style={{
                                    objectPosition: `${settings.cover_image_position_x}% ${settings.cover_image_position_y}%`,
                                    transform: `scale(${settings.cover_image_zoom})`,
                                    transformOrigin: 'center',
                                }}
                            />
                        </div>
                    ) : (
                        <div
                            className="absolute inset-0"
                            style={{
                                backgroundColor:
                                    settings.background_color,
                            }}
                        />
                    )}

                    <div className="absolute inset-0 bg-black/10" />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.28)_0%,rgba(0,0,0,0.12)_28%,rgba(0,0,0,0.42)_55%,rgba(0,0,0,0.97)_100%)]" />

                    <div
                        className="absolute inset-0 opacity-20"
                        style={{
                            backgroundImage:
                                'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.3) 0, transparent 1px), radial-gradient(circle at 70% 35%, rgba(255,255,255,0.2) 0, transparent 1px)',
                            backgroundSize:
                                '140px 140px, 190px 190px',
                        }}
                    />

                    <div className="relative z-10 flex min-h-screen flex-col justify-end px-6 pb-8 pt-32 sm:px-8 sm:pb-10 lg:px-12 lg:pb-12">
                        <div className="mx-auto w-full max-w-[1600px]">
                            <div className="mb-10 flex items-center justify-between border-b border-white/15 pb-5">
                                <div className="flex items-center gap-4">
                                    <span
                                        className="h-px w-12"
                                        style={{
                                            backgroundColor:
                                                settings.accent_color,
                                        }}
                                    />

                                    <p className="text-[8px] uppercase tracking-[0.38em] text-white/60">
                                        {settings.hero_label ||
                                            profile.artist_type ||
                                            'Independent Artist'}
                                        {profile.location
                                            ? ` · ${profile.location}`
                                            : ''}
                                    </p>
                                </div>

                            </div>

                            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
                                <div>
                                    <h1
                                        className="max-w-[1200px] text-[18vw] font-light leading-[0.72] tracking-[-0.085em] sm:text-[14vw] lg:text-[11vw]"
                                        style={{
                                            color:
                                                settings.primary_color,
                                        }}
                                    >
                                        {profile.display_name}
                                    </h1>
                                </div>

                                <div className="border-l border-white/15 pl-6 lg:mb-2">
                                    <p className="text-[8px] uppercase tracking-[0.25em] text-white/45">
                                        Artist statement
                                    </p>

                                    <p className="mt-4 text-sm leading-6 text-white/75">
                                        {settings.hero_statement ||
                                            profile.bio ||
                                            'Independent creative work, visual experiments, and selected projects.'}
                                    </p>

                                    <div className="mt-7 flex items-center gap-4">
                                        {profile.avatar ? (
                                            <img
                                                src={
                                                    profile.avatar
                                                }
                                                alt={
                                                    profile.display_name
                                                }
                                                className="h-10 w-10 rounded-full border border-white/20 object-cover"
                                            />
                                        ) : (
                                            <div
                                                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-[9px]"
                                                style={{
                                                    color:
                                                        settings.primary_color,
                                                }}
                                            >
                                                {initials}
                                            </div>
                                        )}

                                        <div>
                                            <p className="text-[8px] uppercase tracking-[0.18em] text-white/80">
                                                @
                                                {
                                                    profile.username
                                                }
                                            </p>

                                            {profile.website && (
                                                <a
                                                    href={
                                                        profile.website
                                                    }
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="mt-1 inline-block text-[8px] uppercase tracking-[0.18em] text-white/45 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white"
                                                >
                                                    Website ↗
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 flex items-center justify-between">

                                {settings.show_work && (


                                    <a
                                        href="#work"
                                        className="group flex items-center gap-3 text-[8px] uppercase tracking-[0.25em] text-white/55 transition-colors hover:text-white"
                                    >
                                        Explore
                                        <span
                                            className="h-px w-12 transition-all duration-500 group-hover:w-20"
                                            style={{
                                                backgroundColor:
                                                    settings.accent_color,
                                            }}
                                        />
                                    </a>


                                )}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {settings.show_work && (
                <section
                    id="work"
                    className="px-6 py-28 sm:px-8 lg:px-12 lg:py-40"
                    style={{
                        backgroundColor:
                            settings.background_color,
                    }}
                >
                    <div className="mx-auto max-w-[1600px]">
                        <div className="grid gap-8 border-b border-white/10 pb-12 lg:grid-cols-[1fr_0.8fr] lg:items-end">
                            <div>
                                <p
                                    className="text-[8px] uppercase tracking-[0.38em]"
                                    style={{
                                        color:
                                            settings.card_text_color,
                                    }}
                                >
                                    02 / {settings.work_label || 'Selected Work'}
                                </p>

                                <h2
                                    className="mt-5 max-w-3xl text-6xl font-light leading-[0.9] tracking-[-0.065em] sm:text-7xl lg:text-8xl"
                                    style={{
                                        color:
                                            settings.primary_color,
                                    }}
                                >
                                    {settings.work_label ||
                                        'Work with intention.'}
                                </h2>
                            </div>

                            <p
                                className="max-w-sm justify-self-start text-sm leading-7 lg:justify-self-end"
                                style={{
                                    color:
                                        settings.card_text_color,
                                }}
                            >
                                {settings.work_description ||
                                    'A considered selection of projects, collaborations, and creative work.'}
                            </p>
                        </div>

                        {profile.projects.length > 0 ? (
                            <div className="mt-14">
                                {featuredProject && (
                                    <a
                                        href={`/@${profile.username}/project/${featuredProject.slug}`}
                                        className="group block"
                                    >
                                        <div className="grid border border-white/10 bg-black/10 lg:grid-cols-[minmax(0,1fr)_300px]">
                                            <ProjectImage
                                                project={
                                                    featuredProject
                                                }
                                                className="aspect-[16/10] lg:aspect-auto lg:min-h-[620px]"
                                            />

                                            <div className="flex flex-col justify-between border-t border-white/10 p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
                                                <div>
                                                    <div className="flex items-center justify-between">
                                                        <span
                                                            className="text-[8px] uppercase tracking-[0.25em]"
                                                            style={{
                                                                color:
                                                                    settings.card_text_color,
                                                            }}
                                                        >
                                                            01
                                                        </span>

                                                        <span
                                                            className="text-[8px] uppercase tracking-[0.2em]"
                                                            style={{
                                                                color:
                                                                    settings.card_text_color,
                                                            }}
                                                        >
                                                            Featured
                                                        </span>
                                                    </div>

                                                    <div className="mt-20">
                                                        {featuredProject.project_type && (
                                                            <p
                                                                className="text-[8px] uppercase tracking-[0.25em]"
                                                                style={{
                                                                    color:
                                                                        settings.card_text_color,
                                                                }}
                                                            >
                                                                {
                                                                    featuredProject.project_type
                                                                }
                                                            </p>
                                                        )}

                                                        <h3
                                                            className="mt-3 text-4xl font-medium leading-[0.95] tracking-[-0.04em] sm:text-5xl"
                                                            style={{
                                                                color:
                                                                    settings.card_accent_color,
                                                            }}
                                                        >
                                                            {
                                                                featuredProject.title
                                                            }
                                                        </h3>

                                                        {featuredProject.description && (
                                                            <p
                                                                className="mt-6 text-sm leading-7"
                                                                style={{
                                                                    color:
                                                                        settings.card_text_color,
                                                                }}
                                                            >
                                                                {
                                                                    featuredProject.description
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="mt-16 flex items-center justify-between border-t border-white/10 pt-5">
                                                    <span
                                                        className="text-[8px] uppercase tracking-[0.2em]"
                                                        style={{
                                                            color:
                                                                settings.card_text_color,
                                                        }}
                                                    >
                                                        View Project
                                                    </span>

                                                    <span
                                                        className="text-lg transition-transform duration-500 group-hover:translate-x-2"
                                                        style={{
                                                            color:
                                                                settings.card_primary_color,
                                                        }}
                                                    >
                                                        →
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                )}

                                {secondaryProjects.length > 0 && (
                                    <div className="mt-20 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
                                        {secondaryProjects.map(
                                            (
                                                project,
                                                index,
                                            ) => (
                                                <a
                                                    key={
                                                        project.id
                                                    }
                                                    href={`/@${profile.username}/project/${project.slug}`}
                                                    className={`group block ${index === 1
                                                        ? 'lg:mt-28'
                                                        : ''
                                                        }`}
                                                >
                                                    <ProjectImage
                                                        project={
                                                            project
                                                        }
                                                        className="aspect-[4/3] border border-white/10"
                                                    />

                                                    <div className="mt-5 flex items-start justify-between gap-6 border-t border-white/10 pt-4">
                                                        <div>
                                                            <span
                                                                className="text-[8px] uppercase tracking-[0.25em]"
                                                                style={{
                                                                    color:
                                                                        settings.card_text_color,
                                                                }}
                                                            >
                                                                {String(
                                                                    index +
                                                                    2,
                                                                ).padStart(
                                                                    2,
                                                                    '0',
                                                                )}{' '}
                                                                /{' '}
                                                                {
                                                                    project.project_type ??
                                                                    'Project'
                                                                }
                                                            </span>

                                                            <h3
                                                                className="mt-2 text-2xl font-medium tracking-tight"
                                                                style={{
                                                                    color:
                                                                        settings.card_accent_color,
                                                                }}
                                                            >
                                                                {
                                                                    project.title
                                                                }
                                                            </h3>
                                                        </div>

                                                        <span
                                                            className="mt-1 text-lg transition-transform duration-500 group-hover:translate-x-2"
                                                            style={{
                                                                color:
                                                                    settings.card_primary_color,
                                                            }}
                                                        >
                                                            ↗
                                                        </span>
                                                    </div>
                                                </a>
                                            ),
                                        )}
                                    </div>
                                )}

                                {remainingProjects.length > 0 && (
                                    <div className="mt-24 border-t border-white/10">
                                        {remainingProjects.map(
                                            (
                                                project,
                                                index,
                                            ) => (
                                                <a
                                                    key={
                                                        project.id
                                                    }
                                                    href={`/@${profile.username}/project/${project.slug}`}
                                                    className="group grid gap-5 border-b border-white/10 py-7 transition-colors hover:bg-white/[0.025] sm:grid-cols-[72px_1fr_auto] sm:items-center"
                                                >
                                                    <span
                                                        className="text-[8px] uppercase tracking-[0.2em]"
                                                        style={{
                                                            color:
                                                                settings.card_text_color,
                                                        }}
                                                    >
                                                        {String(
                                                            index +
                                                            4,
                                                        ).padStart(
                                                            2,
                                                            '0',
                                                        )}
                                                    </span>

                                                    <div>
                                                        <span
                                                            className="text-[8px] uppercase tracking-[0.22em]"
                                                            style={{
                                                                color:
                                                                    settings.card_text_color,
                                                            }}
                                                        >
                                                            {
                                                                project.project_type ??
                                                                'Project'
                                                            }
                                                        </span>

                                                        <h3
                                                            className="mt-2 text-2xl font-medium tracking-tight"
                                                            style={{
                                                                color:
                                                                    settings.card_accent_color,
                                                            }}
                                                        >
                                                            {
                                                                project.title
                                                            }
                                                        </h3>
                                                    </div>

                                                    <span
                                                        className="text-lg transition-transform duration-500 group-hover:translate-x-2"
                                                        style={{
                                                            color:
                                                                settings.card_primary_color,
                                                        }}
                                                    >
                                                        →
                                                    </span>
                                                </a>
                                            ),
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="mt-14 border-y border-white/10 py-20">
                                <p
                                    className="text-sm"
                                    style={{
                                        color:
                                            settings.card_text_color,
                                    }}
                                >
                                    No projects have been
                                    published yet.
                                </p>
                            </div>
                        )}
                    </div>
                </section>
            )}

            <MusicSection profile={profile} />

            <GallerySection profile={profile} />

            {settings.show_artist_message && (
                <section
                    id="artist-message"
                    className="border-t px-6 py-24 sm:px-8 lg:px-12 lg:py-32"
                    style={{
                        backgroundColor:
                            settings.surface_color,
                        borderColor:
                            `${settings.border_color}66`,
                    }}
                >
                    <div className="mx-auto max-w-[1600px]">
                        <div className="grid gap-10 lg:grid-cols-[0.55fr_1.45fr] lg:items-start">
                            <div>
                                <p
                                    className="text-[8px] uppercase tracking-[0.38em]"
                                    style={{
                                        color:
                                            settings.muted_text_color,
                                    }}
                                >
                                    Artist Message
                                </p>

                                <h2
                                    className="mt-5 max-w-sm text-4xl font-light leading-[0.95] tracking-[-0.05em] sm:text-5xl lg:text-6xl"
                                    style={{
                                        color:
                                            settings.primary_color,
                                    }}
                                >
                                    {settings.artist_message_label ??
                                        'A note from the artist.'}
                                </h2>
                            </div>

                            <p
                                className="max-w-4xl whitespace-pre-line text-xl font-light leading-[1.65] tracking-[-0.02em] sm:text-2xl lg:text-[32px]"
                                style={{
                                    color:
                                        settings.text_color,
                                }}
                            >
                                {settings.artist_message ?? ''}
                            </p>
                        </div>
                    </div>
                </section>
            )}

            {settings.show_about && (
                <section
                    id="about"
                    className="border-t border-white/10 px-6 py-28 sm:px-8 lg:px-12 lg:py-40"
                    style={{
                        backgroundColor:
                            settings.background_color,
                    }}
                >
                    <div className="mx-auto max-w-[1600px]">
                        <div className="mb-14 flex items-end justify-between border-b border-white/10 pb-8">
                            <div>
                                <p
                                    className="text-[8px] uppercase tracking-[0.38em]"
                                    style={{
                                        color:
                                            settings.card_text_color,
                                    }}
                                >
                                    06 /{' '}
                                    {settings.about_label ||
                                        'About'}
                                </p>

                                <h2
                                    className="mt-5 text-6xl font-light leading-[0.88] tracking-[-0.07em] sm:text-7xl lg:text-8xl"
                                    style={{
                                        color:
                                            settings.primary_color,
                                    }}
                                >
                                    {settings.about_label ||
                                        'About'}
                                </h2>
                            </div>

                            <span
                                className="hidden text-[8px] uppercase tracking-[0.25em] sm:block"
                                style={{
                                    color:
                                        settings.muted_text_color,
                                }}
                            >
                                The person behind the work
                            </span>
                        </div>

                        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-start lg:gap-20">
                            <div className="relative">
                                <div className="relative mx-auto aspect-square w-full max-w-[680px] lg:mx-0">
                                    <div
                                        className="absolute inset-0 translate-x-3 translate-y-3 border"
                                        style={{
                                            borderColor:
                                                `${settings.accent_color}66`,
                                        }}
                                    />

                                    <div
                                        className="absolute -inset-2 border"
                                        style={{
                                            borderColor:
                                                `${settings.border_color}55`,
                                        }}
                                    />

                                    <div
                                        className="relative h-full w-full overflow-hidden border"
                                        style={{
                                            borderColor:
                                                `${settings.border_color}aa`,
                                            backgroundColor:
                                                settings.card_background_color,
                                        }}
                                    >
                                        {profile.avatar ? (
                                            <img
                                                src={
                                                    profile.avatar
                                                }
                                                alt={
                                                    profile.display_name
                                                }
                                                className="absolute inset-0 h-full w-full select-none object-cover transition-transform duration-[1400ms] ease-out hover:scale-[1.02]"
                                                draggable={false}
                                                style={{
                                                    objectPosition: `${profile.avatar_position_x ?? 50}% ${profile.avatar_position_y ?? 50}%`,
                                                    transform: `scale(${profile.avatar_zoom ?? 1})`,
                                                    transformOrigin:
                                                        'center',
                                                }}
                                            />
                                        ) : (
                                            <div
                                                className="flex h-full w-full items-center justify-center"
                                                style={{
                                                    backgroundColor:
                                                        settings.card_background_color,
                                                }}
                                            >
                                                <span
                                                    className="text-[clamp(4rem,10vw,9rem)] font-light tracking-[-0.08em]"
                                                    style={{
                                                        color:
                                                            settings.primary_color,
                                                    }}
                                                >
                                                    {initials}
                                                </span>
                                            </div>
                                        )}

                                        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,transparent_35%,rgba(0,0,0,0.35)_100%)]" />

                                        <div className="absolute left-5 top-5 flex items-center gap-3 sm:left-7 sm:top-7">
                                            <span
                                                className="h-px w-8"
                                                style={{
                                                    backgroundColor:
                                                        settings.accent_color,
                                                }}
                                            />

                                            <span className="text-[8px] uppercase tracking-[0.28em] text-white/70">
                                                {profile.display_name}
                                            </span>
                                        </div>

                                        <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between sm:bottom-7 sm:left-7 sm:right-7">
                                            <span className="text-[8px] uppercase tracking-[0.25em] text-white/55">
                                                @{profile.username}
                                            </span>

                                            {profile.location && (
                                                <span className="text-right text-[8px] uppercase tracking-[0.2em] text-white/55">
                                                    {
                                                        profile.location
                                                    }
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:pt-3">
                                <p
                                    className="max-w-4xl whitespace-pre-line text-2xl font-light leading-[1.45] tracking-[-0.035em] sm:text-3xl lg:text-[42px]"
                                    style={{
                                        color:
                                            settings.text_color,
                                    }}
                                >
                                    {profile.about_me ??
                                        profile.bio ??
                                        'An independent artist building work with intention, identity, and a distinct point of view.'}
                                </p>

                                <div className="mt-12 border-t border-white/10 pt-6">
                                    <div className="flex flex-wrap items-center justify-between gap-5">
                                        <div className="flex flex-wrap gap-x-7 gap-y-3">
                                            {profile.location && (
                                                <span
                                                    className="text-[8px] uppercase tracking-[0.2em]"
                                                    style={{
                                                        color:
                                                            settings.card_text_color,
                                                    }}
                                                >
                                                    Based in{' '}
                                                    {
                                                        profile.location
                                                    }
                                                </span>
                                            )}

                                            {profile.website && (
                                                <a
                                                    href={
                                                        profile.website
                                                    }
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-[8px] uppercase tracking-[0.2em] underline decoration-white/20 underline-offset-4 transition-colors hover:decoration-white"
                                                    style={{
                                                        color:
                                                            settings.primary_color,
                                                    }}
                                                >
                                                    Visit Website ↗
                                                </a>
                                            )}
                                        </div>

                                        <span
                                            className="text-[8px] uppercase tracking-[0.2em]"
                                            style={{
                                                color:
                                                    settings.muted_text_color,
                                            }}
                                        >
                                            Independent / Original
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {settings.show_footer && (
                <footer
                    id="footer"
                    className="border-t px-6 py-12 sm:px-8 lg:px-12"
                    style={{
                        borderColor: `${settings.border_color}66`,
                        backgroundColor:
                            settings.surface_color,
                    }}
                >
                    <div className="mx-auto max-w-[1600px]">
                        <div className="grid gap-10 lg:grid-cols-[1fr_auto_1fr] lg:items-end">
                            <div>
                                <p
                                    className="text-[8px] uppercase tracking-[0.35em]"
                                    style={{
                                        color:
                                            settings.muted_text_color,
                                    }}
                                >
                                    {settings.footer_label ||
                                        profile.display_name}
                                </p>

                                <h2
                                    className="mt-4 max-w-xl text-3xl font-light tracking-[-0.04em] sm:text-4xl"
                                    style={{
                                        color:
                                            settings.primary_color,
                                    }}
                                >
                                    {settings.footer_message ||
                                        'Independent work, shared with intention.'}
                                </h2>

                                {settings.show_footer_socials && (
                                    <div className="mt-6 flex flex-wrap items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={handleShare}
                                            className="group inline-flex items-center gap-3 border px-4 py-2.5 text-[8px] uppercase tracking-[0.22em] transition-all duration-300 hover:-translate-y-0.5"
                                            style={{
                                                borderColor:
                                                    `${settings.border_color}99`,
                                                color:
                                                    settings.card_text_color,
                                                backgroundColor:
                                                    settings.card_background_color,
                                            }}
                                        >
                                            <span>
                                                {shareFeedback
                                                    ? 'Link Copied'
                                                    : 'Share Portfolio'}
                                            </span>

                                            <span
                                                className="transition-transform duration-300 group-hover:translate-x-1"
                                                style={{
                                                    color:
                                                        settings.card_primary_color,
                                                }}
                                            >
                                                ↗
                                            </span>
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-start lg:justify-center">
                                {settings.footer_logo ? (
                                    <img
                                        src={`/storage/${settings.footer_logo}`}
                                        alt="Footer logo"
                                        className="max-h-16 w-auto max-w-[180px] object-contain"
                                    />
                                ) : (
                                    <div
                                        className="flex h-12 w-12 items-center justify-center"
                                        style={{
                                            border:
                                                `1px solid ${settings.border_color}66`,
                                        }}
                                    >
                                        <span
                                            className="h-1.5 w-1.5 rounded-full"
                                            style={{
                                                backgroundColor:
                                                    settings.primary_color,
                                                boxShadow:
                                                    `0 0 14px ${settings.primary_color}`,
                                            }}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col items-start gap-4 lg:items-end">
                                <div className="flex flex-wrap items-center gap-5">
                                    <span
                                        className="text-[8px] uppercase tracking-[0.2em]"
                                        style={{
                                            color:
                                                settings.card_text_color,
                                        }}
                                    >
                                        {settings.copyright_text ||
                                            `© ${new Date().getFullYear()} ${profile.display_name}`}
                                    </span>

                                    <a
                                        href="#top"
                                        className="text-[8px] uppercase tracking-[0.2em] transition-colors hover:text-white"
                                        style={{
                                            color:
                                                settings.card_text_color,
                                        }}
                                    >
                                        Back to top ↑
                                    </a>
                                </div>

                                {settings.show_powered_by_lira && (
                                    <a
                                        href="/"
                                        className="group flex items-center gap-2 text-[8px] uppercase tracking-[0.2em]"
                                        style={{
                                            color:
                                                settings.muted_text_color,
                                        }}
                                    >
                                        <span>Powered by</span>

                                        <img
                                            src="/images/brand/Lira_logo.png"
                                            alt="LIRA"
                                            className="h-5 w-auto object-contain opacity-80 transition-opacity duration-300 group-hover:opacity-100"
                                        />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </footer>
            )}
        </main>
    );
}
