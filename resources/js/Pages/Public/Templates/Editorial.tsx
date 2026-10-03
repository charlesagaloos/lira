import {
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from 'react';

import type {
    CSSProperties,
} from 'react';

import type {
    PortfolioGalleryImage,
    PortfolioProject,
    PortfolioProps,
    PortfolioRelease,
} from '../types';

type NavigationItem = {
    id?: number;
    label: string;
    destination: string;
    url: string | null;
    sort_order: number;
    is_visible: boolean;
};

type NavigationSettings = {
    navigation_items?: NavigationItem[];
};

type GalleryLayout = {
    display:
        | 'grid'
        | 'masonry'
        | 'editorial'
        | 'freeform';
    columns: number;
    image_aspect:
        | 'original'
        | 'square'
        | 'portrait'
        | 'landscape';
};

type GalleryLayoutMap = {
    desktop: GalleryLayout;
    tablet: GalleryLayout;
    mobile: GalleryLayout;
};

function getAssetUrl(
    path: string | null,
): string | null {
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

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
        return null;
    }

    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
    })
        .format(parsed)
        .toUpperCase();
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
    const streamingLink =
        getPrimaryStreamingLink(release);

    if (!streamingLink) {
        return null;
    }

    return (
        <a
            href={streamingLink.url}
            target="_blank"
            rel="noreferrer"
            aria-label={`Play ${release.title} on ${streamingLink.label}`}
            className={`editorial-play-button inline-flex items-center gap-3 border transition-all duration-300 hover:-translate-y-0.5 ${
                compact
                    ? 'h-9 px-3'
                    : 'h-11 px-4 sm:h-12 sm:px-5'
            }`}
            style={{
                borderColor: 'var(--editorial-primary)',
                backgroundColor: 'var(--editorial-primary)',
                color: 'var(--editorial-primary-contrast)',
            }}
        >
            <span
                className={`flex items-center justify-center border ${
                    compact ? 'h-5 w-5' : 'h-6 w-6'
                }`}
            >
                <span
                    className={`ml-px ${
                        compact
                            ? 'border-y-[3px] border-l-[4px]'
                            : 'border-y-[4px] border-l-[5px]'
                    } border-y-transparent border-l-current`}
                />
            </span>

            <span className="text-[8px] font-semibold uppercase tracking-[0.22em]">
                Play
            </span>

            <span className="hidden text-[7px] uppercase tracking-[0.18em] opacity-50 sm:inline">
                {streamingLink.label}
            </span>
        </a>
    );
}

function ProjectImage({
    project,
}: {
    project: PortfolioProject;
}) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(0);
    const image = getAssetUrl(project.thumbnail);

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

    return (
        <div
            ref={containerRef}
            className="relative aspect-[4/3] overflow-hidden"
        >
            {image ? (
                <img
                    src={image}
                    alt={project.title}
                    className="absolute inset-0 h-full w-full select-none object-cover grayscale transition-all duration-700 ease-out group-hover:scale-[1.035] group-hover:grayscale-0"
                    draggable={false}
                    style={{
                        objectPosition: `${project.thumbnail_position_x}% ${project.thumbnail_position_y}%`,
                        transform: `translate(${offsetX}px, ${offsetY}px) scale(${project.thumbnail_zoom / 100})`,
                        transformOrigin: 'center',
                    }}
                />
            ) : (
                <div
                    className="flex h-full w-full items-center justify-center"
                    style={{
                        backgroundColor:
                            'var(--editorial-surface)',
                        color:
                            'var(--editorial-muted)',
                    }}
                >
                    <span className="text-[9px] uppercase tracking-[0.24em]">
                        No Image
                    </span>
                </div>
            )}

            <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                    background:
                        'linear-gradient(180deg, transparent 45%, rgba(0,0,0,0.28) 100%)',
                }}
            />
        </div>
    );
}

function ReleaseArtwork({
    release,
}: {
    release: PortfolioRelease;
}) {
    const image = getAssetUrl(release.artwork);

    if (!image) {
        return (
            <div
                className="flex h-full w-full items-center justify-center"
                style={{
                    backgroundColor:
                        'var(--editorial-surface)',
                    color:
                        'var(--editorial-muted)',
                }}
            >
                <span className="text-[8px] uppercase tracking-[0.3em]">
                    {release.release_type}
                </span>
            </div>
        );
    }

    return (
        <img
            src={image}
            alt={release.title}
            className="h-full w-full select-none object-cover grayscale transition-all duration-700 group-hover:grayscale-0"
            draggable={false}
        />
    );
}

function StreamingLinks({
    release,
}: {
    release: PortfolioRelease;
}) {
    const links: Array<[string, string | null]> = [
        ['Spotify', release.spotify_url],
        ['Apple Music', release.apple_music_url],
        ['YouTube', release.youtube_url],
        ['SoundCloud', release.soundcloud_url],
        ['Bandcamp', release.bandcamp_url],
    ];

    const available = links.filter(
        ([, url]) => Boolean(url),
    ) as Array<[string, string]>;

    if (available.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-wrap gap-x-5 gap-y-2">
            {available.map(([label, url]) => (
                <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[8px] uppercase tracking-[0.2em] transition-opacity hover:opacity-50"
                    style={{
                        color:
                            'var(--editorial-muted)',
                    }}
                >
                    {label} ↗
                </a>
            ))}
        </div>
    );
}

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

        case 'contact':
            return '#contact';

        case 'footer':
            return '#footer';

        default:
            return null;
    }
}

function isNavigationItemAvailable(
    item: NavigationItem,
    profile: PortfolioProps['profile'],
): boolean {
    const settings = profile.portfolio_settings;

    switch (item.destination) {
        case 'home':
            return settings.show_hero;

        case 'work':
            return (
                settings.show_work &&
                profile.projects.length > 0
            );

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

        case 'contact':
            return Boolean(profile.website);

        case 'footer':
            return settings.show_footer;

        case 'external':
            return Boolean(item.url);

        default:
            return false;
    }
}

function GallerySection({
    profile,
}: PortfolioProps) {
    const settings = profile.portfolio_settings;
    const images = settings.gallery_images ?? [];
    const responsive =
        settings.gallery_responsive as Partial<GalleryLayoutMap> | null;

    const normalizeGalleryDisplay = (
        value: unknown,
        fallback: GalleryLayout['display'],
    ): GalleryLayout['display'] => {
        return value === 'grid' ||
            value === 'masonry' ||
            value === 'editorial' ||
            value === 'freeform'
            ? value
            : fallback;
    };

    const normalizeGalleryAspect = (
        value: unknown,
        fallback: GalleryLayout['image_aspect'],
    ): GalleryLayout['image_aspect'] => {
        return value === 'original' ||
            value === 'square' ||
            value === 'portrait' ||
            value === 'landscape'
            ? value
            : fallback;
    };

    const normalizeGalleryColumns = (
        value: unknown,
        fallback: number,
        min: number,
        max: number,
    ): number => {
        const numeric = Number(value);

        if (!Number.isFinite(numeric)) {
            return fallback;
        }

        return Math.min(
            Math.max(Math.round(numeric), min),
            max,
        );
    };

    const desktop: GalleryLayout = {
        display: normalizeGalleryDisplay(
            responsive?.desktop?.display,
            settings.gallery_display ?? 'editorial',
        ),
        columns: normalizeGalleryColumns(
            responsive?.desktop?.columns,
            settings.gallery_columns ?? 3,
            2,
            5,
        ),
        image_aspect: normalizeGalleryAspect(
            responsive?.desktop?.image_aspect,
            settings.gallery_image_aspect ?? 'landscape',
        ),
    };

    const tablet: GalleryLayout = {
        display: normalizeGalleryDisplay(
            responsive?.tablet?.display,
            desktop.display,
        ),
        columns: normalizeGalleryColumns(
            responsive?.tablet?.columns,
            Math.min(desktop.columns, 3),
            2,
            4,
        ),
        image_aspect: normalizeGalleryAspect(
            responsive?.tablet?.image_aspect,
            desktop.image_aspect,
        ),
    };

    const mobile: GalleryLayout = {
        display: normalizeGalleryDisplay(
            responsive?.mobile?.display,
            desktop.display,
        ),
        columns: normalizeGalleryColumns(
            responsive?.mobile?.columns,
            1,
            1,
            2,
        ),
        image_aspect: normalizeGalleryAspect(
            responsive?.mobile?.image_aspect,
            desktop.image_aspect,
        ),
    };

    const desktopColumns = Math.min(
        Math.max(desktop.columns, 2),
        5,
    );

    const tabletColumns = Math.min(
        Math.max(tablet.columns, 2),
        4,
    );

    const mobileColumns = Math.min(
        Math.max(mobile.columns, 1),
        2,
    );

    const [lightboxIndex, setLightboxIndex] =
        useState<number | null>(null);

    if (!settings.show_gallery || images.length === 0) {
        return null;
    }

    const activeImage =
        lightboxIndex !== null
            ? images[lightboxIndex]
            : null;

    function imageUrl(image: PortfolioGalleryImage): string {
        return getAssetUrl(image.image) ?? '';
    }

    /* Gallery aspect */
    function aspectValue(
        aspect: GalleryLayout['image_aspect'],
    ): string {
        switch (aspect) {
            case 'square':
                return '1 / 1';
            case 'portrait':
                return '4 / 5';
            case 'landscape':
                return '4 / 3';
            case 'original':
            default:
                return '4 / 3';
        }
    }

    function renderImage(
        image: PortfolioGalleryImage,
        index: number,
        layout:
            | 'grid'
            | 'masonry'
            | 'editorial'
            | 'freeform',
    ) {
        const content = (
            <figure
                className={`editorial-gallery-card editorial-gallery-${layout}-card group relative`}
                style={{
                    backgroundColor:
                        'var(--editorial-bg)',
                }}
            >
                <div
                    className={`editorial-gallery-media editorial-gallery-${layout}-media relative w-full overflow-hidden`}
                    style={{
                        '--gallery-mobile-aspect':
                            aspectValue(
                                mobile.image_aspect,
                            ),
                        '--gallery-tablet-aspect':
                            aspectValue(
                                tablet.image_aspect,
                            ),
                        '--gallery-desktop-aspect':
                            aspectValue(
                                desktop.image_aspect,
                            ),
                    } as CSSProperties}
                >
                    {imageUrl(image) ? (
                        <img
                            src={imageUrl(image)}
                            alt={
                                image.alt_text ||
                                image.title ||
                                settings.gallery_label ||
                                'Gallery image'
                            }
                            className="gallery-image absolute inset-0 h-full w-full select-none object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                            draggable={false}
                        />
                    ) : (
                        <div
                            className="absolute inset-0 flex items-center justify-center"
                            style={{
                                backgroundColor:
                                    'var(--editorial-bg)',
                                color:
                                    'var(--editorial-muted)',
                            }}
                        >
                            <span className="text-[8px] uppercase tracking-[0.24em]">
                                No Image
                            </span>
                        </div>
                    )}

                    {(layout === 'grid' || layout === 'masonry') && (
                        <span
                            className="pointer-events-none absolute left-3 top-3 border px-2 py-1 text-[7px] uppercase tracking-[0.22em] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                            style={{
                                borderColor:
                                    'rgba(255,255,255,0.55)',
                                backgroundColor:
                                    'rgba(0,0,0,0.28)',
                                color: '#fff',
                            }}
                        >
                            {String(index + 1).padStart(2, '0')}
                        </span>
                    )}
                </div>

                {(layout === 'grid' || layout === 'masonry') &&
                    (settings.gallery_show_titles ||
                        settings.gallery_show_captions) && (
                        <figcaption className="border-t px-3 py-3 sm:px-4">
                            <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                    {settings.gallery_show_titles &&
                                        image.title && (
                                            <h3
                                                className="truncate text-[10px] font-medium uppercase tracking-[0.08em]"
                                                style={{
                                                    color: 'var(--editorial-text)',
                                                }}
                                            >
                                                {image.title}
                                            </h3>
                                        )}

                                    {settings.gallery_show_captions &&
                                        image.caption && (
                                            <p
                                                className={`text-[10px] leading-5 ${
                                                    settings.gallery_show_titles &&
                                                    image.title
                                                        ? 'mt-1'
                                                        : ''
                                                }`}
                                                style={{
                                                    color: 'var(--editorial-muted)',
                                                }}
                                            >
                                                {image.caption}
                                            </p>
                                        )}
                                </div>

                                <span
                                    className="shrink-0 text-[7px] uppercase tracking-[0.2em]"
                                    style={{
                                        color: 'var(--editorial-muted)',
                                    }}
                                >
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                            </div>
                        </figcaption>
                    )}
            </figure>
        );

        if (!settings.gallery_enable_lightbox) {
            return content;
        }

        return (
            <button
                type="button"
                onClick={() => setLightboxIndex(index)}
                className="editorial-gallery-lightbox-trigger block w-full cursor-zoom-in p-0 text-left"
                aria-label={`Open ${image.title || 'gallery image'}`}
            >
                {content}
            </button>
        );
    }

    return (
        <>
            <style>
                {`
                    .editorial-gallery {
                        --gallery-mobile-aspect: 4 / 3;
                        --gallery-tablet-aspect: 4 / 3;
                        --gallery-desktop-aspect: 4 / 3;
                    }

                    .editorial-gallery-grid,
                    .editorial-gallery-masonry,
                    .editorial-gallery-editorial,
                    .editorial-gallery-freeform {
                        display: none;
                        min-width: 0;
                        width: 100%;
                    }

                    .editorial-gallery-media {
                        display: block;
                        width: 100%;
                        aspect-ratio: var(--gallery-mobile-aspect, 4 / 3);
                        overflow: hidden;
                        isolation: isolate;
                    }

                    .editorial-gallery-media .gallery-image {
                        display: block;
                        width: 100%;
                        height: 100%;
                        min-width: 0;
                        min-height: 0;
                        object-fit: cover;
                        object-position: center;
                    }

                    .editorial-gallery-lightbox-trigger {
                        appearance: none;
                        border: 0;
                        background: transparent;
                        color: inherit;
                    }

                    /* Grid */
                    .editorial-gallery-grid {
                        grid-template-columns: repeat(
                            var(--gallery-mobile-columns),
                            minmax(0, 1fr)
                        );
                        gap: 0;
                        border-top: 1px solid var(--editorial-border);
                        border-left: 1px solid var(--editorial-border);
                    }

                    .editorial-gallery-grid > div {
                        min-width: 0;
                    }

                    .editorial-gallery-grid .editorial-gallery-card {
                        min-width: 0;
                        width: 100%;
                        border-right: 1px solid var(--editorial-border);
                        border-bottom: 1px solid var(--editorial-border);
                    }

                    .editorial-gallery-grid .editorial-gallery-media {
                        transition: opacity 300ms ease;
                    }

                    .editorial-gallery-grid .editorial-gallery-card:hover .editorial-gallery-media {
                        opacity: 0.9;
                    }

                    /* Masonry */
                    .editorial-gallery-masonry {
                        column-count: var(--gallery-mobile-columns);
                        column-gap: 0.75rem;
                    }

                    .editorial-gallery-masonry > div {
                        width: 100%;
                        break-inside: avoid;
                        page-break-inside: avoid;
                    }

                    .editorial-gallery-masonry .editorial-gallery-card {
                        width: 100%;
                        margin-bottom: 0.75rem;
                        break-inside: avoid;
                    }

                    .editorial-gallery-masonry .editorial-gallery-media {
                        aspect-ratio: var(--gallery-mobile-aspect, 4 / 3);
                    }

                    .editorial-gallery-masonry > div:nth-child(4n + 2) .editorial-gallery-media {
                        aspect-ratio: 4 / 5;
                    }

                    .editorial-gallery-masonry > div:nth-child(4n + 3) .editorial-gallery-media {
                        aspect-ratio: 1 / 1;
                    }

                    .editorial-gallery-masonry > div:nth-child(4n + 4) .editorial-gallery-media {
                        aspect-ratio: 5 / 4;
                    }

                    .editorial-gallery-masonry .gallery-image {
                        transition: transform 700ms ease;
                    }

                    /* Editorial */
                    .editorial-gallery-editorial {
                        width: 100%;
                        height: 450px;
                        gap: 0.5rem;
                        align-items: stretch;
                        overflow: hidden;
                    }

                    .editorial-gallery-editorial > div {
                        min-width: 0;
                        min-height: 0;
                        flex: 1 1 0;
                        margin-top: 0 !important;
                        transition:
                            flex 650ms cubic-bezier(0.22, 1, 0.36, 1);
                    }

                    .editorial-gallery-editorial > div:hover,
                    .editorial-gallery-editorial > div:focus-within {
                        flex: 3.75 1 0;
                    }

                    .editorial-gallery-editorial .editorial-gallery-card {
                        position: relative;
                        width: 100%;
                        height: 100%;
                        min-height: 0;
                        overflow: hidden;
                        border: 1px solid var(--editorial-border);
                        padding: 0;
                        background: var(--editorial-card-bg);
                    }

                    .editorial-gallery-editorial .editorial-gallery-lightbox-trigger {
                        display: block;
                        width: 100%;
                        height: 100%;
                    }

                    .editorial-gallery-editorial .editorial-gallery-media {
                        width: 100%;
                        height: 100%;
                        min-height: 0;
                        aspect-ratio: auto !important;
                    }

                    .editorial-gallery-editorial .gallery-image {
                        transition:
                            transform 900ms cubic-bezier(0.22, 1, 0.36, 1);
                    }

                    .editorial-gallery-editorial > div:hover .gallery-image,
                    .editorial-gallery-editorial > div:focus-within .gallery-image {
                        transform: scale(1.025);
                    }

                    /* Freeform / Bento */
                    .editorial-gallery-freeform {
                        grid-template-columns: repeat(4, minmax(0, 1fr));
                        grid-auto-rows: clamp(104px, 10.5vw, 148px);
                        gap: 0.75rem;
                        align-items: stretch;
                    }

                    .editorial-gallery-freeform > div {
                        min-width: 0;
                        min-height: 0;
                    }

                    .editorial-gallery-freeform > div > .editorial-gallery-lightbox-trigger {
                        display: block;
                        width: 100%;
                        height: 100%;
                    }

                    .editorial-gallery-freeform .editorial-gallery-card {
                        position: relative;
                        width: 100%;
                        height: 100%;
                        min-height: 0;
                        overflow: hidden;
                        border: 1px solid var(--editorial-border);
                        background: var(--editorial-card-bg);
                        box-shadow: 0 18px 50px rgba(0, 0, 0, 0.16);
                        transition:
                            transform 500ms cubic-bezier(0.22, 1, 0.36, 1),
                            box-shadow 500ms cubic-bezier(0.22, 1, 0.36, 1);
                    }

                    .editorial-gallery-freeform .editorial-gallery-media {
                        width: 100%;
                        height: 100%;
                        min-height: 0;
                        aspect-ratio: auto !important;
                    }

                    .editorial-gallery-freeform .gallery-image {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        transition: transform 700ms ease;
                    }

                    .editorial-gallery-freeform .editorial-gallery-card:hover {
                        transform: translateY(-0.3rem);
                        z-index: 5;
                        box-shadow: 0 28px 70px rgba(0, 0, 0, 0.24);
                    }

                    .editorial-gallery-freeform .editorial-gallery-card:hover .gallery-image {
                        transform: scale(1.025);
                    }

                    .editorial-gallery-freeform > div:nth-child(1),
                    .editorial-gallery-freeform > div:nth-child(3),
                    .editorial-gallery-freeform > div:nth-child(5),
                    .editorial-gallery-freeform > div:nth-child(7) {
                        grid-column: span 1;
                        grid-row: span 3;
                    }

                    .editorial-gallery-freeform > div:nth-child(2),
                    .editorial-gallery-freeform > div:nth-child(4),
                    .editorial-gallery-freeform > div:nth-child(6) {
                        grid-column: span 2;
                        grid-row: span 2;
                    }

                    /* Mobile */
                    @media (max-width: 639px) {
                        .editorial-gallery-editorial {
                            height: 320px;
                            gap: 0.35rem;
                        }

                        .editorial-gallery-editorial > div {
                            margin-top: 0 !important;
                        }

                        .editorial-gallery-editorial > div:hover,
                        .editorial-gallery-editorial > div:focus-within {
                            flex: 2.5 1 0;
                        }

                        .editorial-gallery-freeform {
                            grid-template-columns: minmax(0, 1fr);
                            grid-auto-rows: 300px;
                            gap: 0.75rem;
                        }

                        .editorial-gallery-freeform > div {
                            grid-column: 1 / -1 !important;
                            grid-row: span 1 !important;
                        }

                        .editorial-gallery-freeform .editorial-gallery-card:hover {
                            transform: none;
                        }
                    }

                    /* Tablet */
                    @media (min-width: 640px) and (max-width: 1023px) {
                        .editorial-gallery-grid {
                            grid-template-columns: repeat(
                                var(--gallery-tablet-columns),
                                minmax(0, 1fr)
                            );
                        }

                        .editorial-gallery-masonry {
                            column-count: var(--gallery-tablet-columns);
                        }

                        .editorial-gallery-editorial {
                            height: 400px;
                            gap: 0.45rem;
                        }

                        .editorial-gallery-editorial > div {
                            margin-top: 0 !important;
                        }

                        .editorial-gallery-freeform {
                            grid-template-columns: repeat(4, minmax(0, 1fr));
                            grid-auto-rows: clamp(92px, 9vw, 126px);
                            gap: 0.75rem;
                        }
                    }

                    /* Desktop */
                    @media (min-width: 1024px) {
                        .editorial-gallery-grid {
                            grid-template-columns: repeat(
                                var(--gallery-desktop-columns),
                                minmax(0, 1fr)
                            );
                        }

                        .editorial-gallery-masonry {
                            column-count: var(--gallery-desktop-columns);
                        }

                        .editorial-gallery-editorial {
                            width: 100%;
                            height: 500px;
                            margin-inline: 0;
                            gap: 0.5rem;
                        }

                        .editorial-gallery-editorial > div {
                            margin-top: 0 !important;
                        }

                        .editorial-gallery-freeform {
                            width: min(100%, 1440px);
                            margin-inline: auto;
                            grid-template-columns: repeat(4, minmax(0, 1fr));
                            grid-auto-rows: clamp(110px, 10.5vw, 158px);
                            gap: 0.75rem;
                        }
                    }

                    /* Responsive display */
                    @media (max-width: 639px) {
                        .editorial-gallery[data-mobile-display="grid"] .editorial-gallery-grid {
                            display: grid !important;
                        }

                        .editorial-gallery[data-mobile-display="masonry"] .editorial-gallery-masonry {
                            display: block !important;
                        }

                        .editorial-gallery[data-mobile-display="editorial"] .editorial-gallery-editorial {
                            display: flex !important;
                        }

                        .editorial-gallery[data-mobile-display="freeform"] .editorial-gallery-freeform {
                            display: grid !important;
                        }
                    }

                    @media (min-width: 640px) and (max-width: 1023px) {
                        .editorial-gallery[data-tablet-display="grid"] .editorial-gallery-grid {
                            display: grid !important;
                        }

                        .editorial-gallery[data-tablet-display="masonry"] .editorial-gallery-masonry {
                            display: block !important;
                        }

                        .editorial-gallery[data-tablet-display="editorial"] .editorial-gallery-editorial {
                            display: flex !important;
                        }

                        .editorial-gallery[data-tablet-display="freeform"] .editorial-gallery-freeform {
                            display: grid !important;
                        }
                    }

                    @media (min-width: 1024px) {
                        .editorial-gallery[data-desktop-display="grid"] .editorial-gallery-grid {
                            display: grid !important;
                        }

                        .editorial-gallery[data-desktop-display="masonry"] .editorial-gallery-masonry {
                            display: block !important;
                        }

                        .editorial-gallery[data-desktop-display="editorial"] .editorial-gallery-editorial {
                            display: flex !important;
                        }

                        .editorial-gallery[data-desktop-display="freeform"] .editorial-gallery-freeform {
                            display: grid !important;
                        }
                    }
                `}
            </style>

            <section
                id="gallery"
                className="border-b"
                style={{
                    backgroundColor:
                        'var(--editorial-surface)',
                    borderColor:
                        'var(--editorial-border)',
                }}
            >
                <div className="mx-auto max-w-[1600px] px-6 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-32">
                    <div className="mb-12 flex flex-col gap-6 border-b pb-6 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p
                                className="text-[8px] font-semibold uppercase tracking-[0.32em]"
                                style={{
                                    color: 'var(--editorial-accent)',
                                }}
                            >
                                04 / Visual Archive
                            </p>
                            <h2
                                className="mt-4 max-w-4xl text-5xl font-medium leading-[0.88] tracking-[-0.07em] sm:text-7xl lg:text-[7rem]"
                                style={{
                                    color: 'var(--editorial-text)',
                                }}
                            >
                                {settings.gallery_label || 'Gallery'}
                            </h2>
                        </div>

                        <div className="max-w-sm sm:text-right">
                            {settings.gallery_description && (
                                <p
                                    className="text-xs leading-6"
                                    style={{
                                        color: 'var(--editorial-muted)',
                                    }}
                                >
                                    {settings.gallery_description}
                                </p>
                            )}

                            <p
                                className="mt-4 text-[8px] uppercase tracking-[0.24em]"
                                style={{
                                    color: 'var(--editorial-muted)',
                                }}
                            >
                                {String(images.length).padStart(2, '0')} images / archive
                            </p>
                        </div>
                    </div>

                    <div
                        className="editorial-gallery"
                        data-mobile-display={mobile.display}
                        data-tablet-display={tablet.display}
                        data-desktop-display={desktop.display}
                        data-mobile-aspect={mobile.image_aspect}
                        data-tablet-aspect={tablet.image_aspect}
                        data-desktop-aspect={desktop.image_aspect}
                        style={{
                            '--gallery-mobile-columns':
                                mobileColumns,
                            '--gallery-tablet-columns':
                                tabletColumns,
                            '--gallery-desktop-columns':
                                desktopColumns,
                        } as CSSProperties}
                    >
                        <div className="editorial-gallery-grid">
                            {images.map((image, index) => (
                                <div
                                    key={
                                        image.id ??
                                        `gallery-grid-${index}`
                                    }
                                >
                                    {renderImage(
                                        image,
                                        index,
                                        'grid',
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="editorial-gallery-masonry">
                            {images.map((image, index) => (
                                <div
                                    key={
                                        image.id ??
                                        `gallery-masonry-${index}`
                                    }
                                >
                                    {renderImage(
                                        image,
                                        index,
                                        'masonry',
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="editorial-gallery-editorial">
                            {images.map((image, index) => (
                                <div
                                    key={
                                        image.id ??
                                        `gallery-editorial-${index}`
                                    }
                                >
                                    {renderImage(
                                        image,
                                        index,
                                        'editorial',
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="editorial-gallery-freeform">
                            {images.map((image, index) => (
                                <div
                                    key={
                                        image.id ??
                                        `gallery-freeform-${index}`
                                    }
                                >
                                    {renderImage(
                                        image,
                                        index,
                                        'freeform',
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {activeImage && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-5 backdrop-blur-sm sm:p-8"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Gallery lightbox"
                    onClick={() => setLightboxIndex(null)}
                >
                    <button
                        type="button"
                        onClick={() => setLightboxIndex(null)}
                        className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center border border-white/20 text-lg text-white transition-colors hover:bg-white hover:text-black"
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
                                    setLightboxIndex(
                                        lightboxIndex === 0
                                            ? images.length - 1
                                            : (lightboxIndex ?? 1) - 1,
                                    );
                                }}
                                className="absolute left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-white/20 text-white transition-colors hover:bg-white hover:text-black sm:left-8"
                                aria-label="Previous image"
                            >
                                ←
                            </button>

                            <button
                                type="button"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    setLightboxIndex(
                                        lightboxIndex === images.length - 1
                                            ? 0
                                            : (lightboxIndex ?? -1) + 1,
                                    );
                                }}
                                className="absolute right-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-white/20 text-white transition-colors hover:bg-white hover:text-black sm:right-8"
                                aria-label="Next image"
                            >
                                →
                            </button>
                        </>
                    )}

                    <div
                        className="relative max-h-[90vh] max-w-[90vw]"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <img
                            src={imageUrl(activeImage)}
                            alt={
                                activeImage.alt_text ||
                                activeImage.title ||
                                'Gallery image'
                            }
                            className="max-h-[78vh] max-w-[90vw] object-contain"
                            draggable={false}
                        />

                        {(activeImage.title ||
                            activeImage.caption) && (
                            <div className="mt-4 border-t border-white/15 pt-4">
                                {activeImage.title && (
                                    <h3 className="text-sm font-medium text-white">
                                        {activeImage.title}
                                    </h3>
                                )}

                                {activeImage.caption && (
                                    <p className="mt-1 max-w-2xl text-xs leading-6 text-white/60">
                                        {activeImage.caption}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

function MusicSection({
    profile,
}: PortfolioProps) {
    const settings = profile.portfolio_settings;

    if (!settings.show_music || profile.releases.length === 0) {
        return null;
    }

    const releases = settings.music_release_display === 'all'
        ? profile.releases
        : profile.releases.slice(0, settings.music_release_limit);

    if (releases.length === 0) {
        return null;
    }

    const featured = releases.find(
        (release) => release.id === settings.featured_release_id,
    ) ?? releases[0];

    const secondary = releases.filter(
        (release) => release.id !== featured.id,
    );

    return (
        <section
            id="music"
            className="border-b"
            style={{
                backgroundColor: 'var(--editorial-bg)',
                borderColor: 'var(--editorial-border)',
            }}
        >
            <div className="mx-auto max-w-[1600px] px-6 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-32">
                {/* Header */}
                <div className="mb-14 border-b pb-7 sm:mb-16">
                    <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <div className="mb-6 flex items-center gap-3">
                                <span
                                    className="h-px w-10"
                                    style={{
                                        backgroundColor:
                                            'var(--editorial-accent)',
                                    }}
                                />
                                <p
                                    className="text-[8px] font-semibold uppercase tracking-[0.32em]"
                                    style={{
                                        color: 'var(--editorial-accent)',
                                    }}
                                >
                                    05 / Sound Archive
                                </p>
                            </div>

                            <h2
                                className="max-w-5xl text-[clamp(4rem,10vw,9rem)] font-medium leading-[0.8] tracking-[-0.08em]"
                                style={{
                                    color: 'var(--editorial-text)',
                                }}
                            >
                                {settings.music_label || 'Music'}
                            </h2>
                        </div>

                        <div className="max-w-sm lg:pb-2 lg:text-right">
                            {settings.music_description && (
                                <p
                                    className="text-xs leading-6"
                                    style={{
                                        color: 'var(--editorial-muted)',
                                    }}
                                >
                                    {settings.music_description}
                                </p>
                            )}

                            <p
                                className="mt-4 text-[8px] uppercase tracking-[0.24em]"
                                style={{
                                    color: 'var(--editorial-muted)',
                                }}
                            >
                                {String(releases.length).padStart(2, '0')} releases / catalogue
                            </p>
                        </div>
                    </div>
                </div>

                {/* Featured release */}
                <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:gap-16">
                    <div className="relative">
                        <div className="relative overflow-hidden border" style={{ borderColor: 'var(--editorial-border)' }}>
                            <div className="aspect-square w-full">
                                <div className="group h-full w-full">
                                    <ReleaseArtwork release={featured} />
                                </div>
                            </div>

                            <div className="pointer-events-none absolute inset-0 border border-white/10" />

                            <div className="absolute left-5 top-5 flex items-center gap-3 text-white mix-blend-difference sm:left-7 sm:top-7">
                                <span className="text-[7px] uppercase tracking-[0.25em]">
                                    01 / Featured release
                                </span>
                            </div>

                            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-5 text-white mix-blend-difference sm:bottom-7 sm:left-7 sm:right-7">
                                <span className="text-[7px] uppercase tracking-[0.22em]">
                                    {featured.release_type || 'Release'}
                                </span>

                                {formatReleaseDate(featured.release_date) && (
                                    <span className="text-[7px] uppercase tracking-[0.22em]">
                                        {formatReleaseDate(featured.release_date)}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col justify-between border-t pt-6 lg:border-t-0 lg:pt-2">
                        <div>
                            <div className="mb-8 flex items-start justify-between gap-5">
                                <p
                                    className="text-[8px] uppercase tracking-[0.25em]"
                                    style={{
                                        color: 'var(--editorial-muted)',
                                    }}
                                >
                                    Featured work
                                </p>

                                <span
                                    className="text-[8px] uppercase tracking-[0.2em]"
                                    style={{
                                        color: 'var(--editorial-muted)',
                                    }}
                                >
                                    01
                                </span>
                            </div>

                            <h3
                                className="max-w-xl text-4xl font-medium leading-[0.9] tracking-[-0.06em] sm:text-5xl lg:text-6xl"
                                style={{
                                    color: 'var(--editorial-text)',
                                }}
                            >
                                {featured.title}
                            </h3>

                            <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-[8px] uppercase tracking-[0.2em]">
                                <span style={{ color: 'var(--editorial-muted)' }}>
                                    {featured.release_type || 'Release'}
                                </span>
                                {formatReleaseDate(featured.release_date) && (
                                    <span style={{ color: 'var(--editorial-muted)' }}>
                                        {formatReleaseDate(featured.release_date)}
                                    </span>
                                )}
                            </div>

                            {featured.description && (
                                <p
                                    className="mt-8 max-w-lg text-sm leading-7"
                                    style={{
                                        color: 'var(--editorial-muted)',
                                    }}
                                >
                                    {featured.description}
                                </p>
                            )}
                        </div>

                        <div className="mt-10 border-t pt-5 sm:mt-14">
                            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                                {settings.show_music_links ? (
                                    <StreamingLinks release={featured} />
                                ) : (
                                    <span
                                        className="text-[8px] uppercase tracking-[0.2em]"
                                        style={{
                                            color: 'var(--editorial-muted)',
                                        }}
                                    >
                                        Available now
                                    </span>
                                )}

                                <PlayButton release={featured} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Catalogue */}
                <div className="mt-20 border-t sm:mt-24" style={{ borderColor: 'var(--editorial-border)' }}>
                    <div className="grid lg:grid-cols-[0.25fr_1fr]">
                        <div className="border-b py-5 lg:border-b-0 lg:border-r lg:py-7 lg:pr-8">
                            <p
                                className="text-[8px] uppercase tracking-[0.25em]"
                                style={{ color: 'var(--editorial-muted)' }}
                            >
                                Catalogue
                            </p>
                        </div>

                        <div className="lg:pl-8">
                            {secondary.length > 0 ? (
                                <div>
                                    {secondary.map((release, index) => (
                                        <article
                                            key={release.id}
                                            className="group grid gap-5 border-b py-7 sm:grid-cols-[42px_104px_minmax(0,1fr)_auto] sm:items-center sm:gap-7"
                                            style={{
                                                borderColor:
                                                    'var(--editorial-border)',
                                            }}
                                        >
                                            <span
                                                className="text-[8px] uppercase tracking-[0.2em]"
                                                style={{
                                                    color: 'var(--editorial-muted)',
                                                }}
                                            >
                                                {String(index + 2).padStart(2, '0')}
                                            </span>

                                            <div className="aspect-square w-20 overflow-hidden border sm:w-[104px]" style={{ borderColor: 'var(--editorial-border)' }}>
                                                <ReleaseArtwork release={release} />
                                            </div>

                                            <div className="min-w-0">
                                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[8px] uppercase tracking-[0.2em]">
                                                    <span style={{ color: 'var(--editorial-muted)' }}>
                                                        {release.release_type || 'Release'}
                                                    </span>
                                                    {formatReleaseDate(release.release_date) && (
                                                        <span style={{ color: 'var(--editorial-muted)' }}>
                                                            {formatReleaseDate(release.release_date)}
                                                        </span>
                                                    )}
                                                </div>

                                                <h3
                                                    className="mt-2 truncate text-2xl font-medium leading-tight tracking-[-0.04em] transition-opacity duration-300 group-hover:opacity-55 sm:text-3xl"
                                                    style={{
                                                        color: 'var(--editorial-text)',
                                                    }}
                                                >
                                                    {release.title}
                                                </h3>

                                                {settings.show_music_links && (
                                                    <div className="mt-3">
                                                        <StreamingLinks release={release} />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="sm:justify-self-end">
                                                <PlayButton release={release} compact />
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            ) : (
                                <p
                                    className="py-7 text-[8px] uppercase tracking-[0.2em]"
                                    style={{ color: 'var(--editorial-muted)' }}
                                >
                                    Featured release is currently the only entry.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function ArtistMessageSection({
    profile,
}: PortfolioProps) {
    const settings = profile.portfolio_settings;

    if (
        !settings.show_artist_message ||
        !settings.artist_message?.trim()
    ) {
        return null;
    }

    return (
        <section
            id="artist-message"
            className="border-b"
            style={{
                backgroundColor:
                    'var(--editorial-bg)',
                borderColor:
                    'var(--editorial-border)',
            }}
        >
            <div className="mx-auto max-w-[1600px] px-6 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-32">
                <div className="grid gap-12 lg:grid-cols-[0.35fr_1fr] lg:gap-20">
                    <div>
                        <p
                            className="text-[9px] uppercase tracking-[0.3em]"
                            style={{
                                color:
                                    'var(--editorial-muted)',
                            }}
                        >
                            Artist Message
                        </p>

                        <h2
                            className="mt-5 max-w-sm text-4xl font-medium leading-[0.95] tracking-[-0.05em] sm:text-5xl"
                            style={{
                                color:
                                    'var(--editorial-text)',
                            }}
                        >
                            {settings.artist_message_label ||
                                'A note from the artist.'}
                        </h2>
                    </div>

                    <p
                        className="max-w-5xl whitespace-pre-line text-2xl font-medium leading-[1.2] tracking-[-0.035em] sm:text-4xl lg:text-6xl"
                        style={{
                            color:
                                'var(--editorial-text)',
                        }}
                    >
                        {settings.artist_message}
                    </p>
                </div>
            </div>
        </section>
    );
}

function AboutSection({
    profile,
}: PortfolioProps) {
    const settings = profile.portfolio_settings;

    if (!settings.show_about) {
        return null;
    }

    const avatar = getAssetUrl(profile.avatar);

    return (
        <section
            id="about"
            className="border-b"
            style={{
                backgroundColor: 'var(--editorial-surface)',
                borderColor: 'var(--editorial-border)',
            }}
        >
            <div className="mx-auto max-w-[1600px] px-6 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-32">
                <div className="mb-12 flex flex-col gap-5 border-b pb-7 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p
                            className="text-[8px] font-semibold uppercase tracking-[0.32em]"
                            style={{ color: 'var(--editorial-accent)' }}
                        >
                            06 / Profile
                        </p>
                        <h2
                            className="mt-4 text-5xl font-medium leading-[0.88] tracking-[-0.07em] sm:text-7xl lg:text-[7rem]"
                            style={{ color: 'var(--editorial-text)' }}
                        >
                            {settings.about_label || 'About'}
                        </h2>
                    </div>
                    <span
                        className="text-[8px] uppercase tracking-[0.22em]"
                        style={{ color: 'var(--editorial-muted)' }}
                    >
                        Artist / practice / place
                    </span>
                </div>

                <div className="grid gap-10 lg:grid-cols-[minmax(260px,0.55fr)_minmax(0,1.45fr)] lg:gap-16">
                    <div>
                        <div className="relative mx-auto aspect-[4/5] w-full max-w-[420px] overflow-hidden border lg:mx-0">
                            {avatar ? (
                                <img
                                    src={avatar}
                                    alt={profile.display_name}
                                    className="absolute inset-0 h-full w-full select-none object-cover"
                                    draggable={false}
                                    style={{
                                        objectPosition: `${profile.avatar_position_x ?? 50}% ${profile.avatar_position_y ?? 50}%`,
                                        transform: `scale(${profile.avatar_zoom ?? 1})`,
                                        transformOrigin: 'center',
                                    }}
                                />
                            ) : (
                                <div
                                    className="flex h-full w-full items-center justify-center"
                                    style={{
                                        backgroundColor: 'var(--editorial-bg)',
                                        color: 'var(--editorial-text)',
                                    }}
                                >
                                    <span className="text-[clamp(4rem,10vw,8rem)] font-medium tracking-[-0.08em]">
                                        {profile.display_name
                                            .split(' ')
                                            .map((name) => name[0])
                                            .join('')
                                            .slice(0, 2)
                                            .toUpperCase()}
                                    </span>
                                </div>
                            )}

                            <div
                                className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
                                style={{
                                    background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.5))',
                                }}
                            />

                            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4 text-white">
                                <span className="text-[8px] uppercase tracking-[0.22em]">
                                    @{profile.username}
                                </span>
                                {profile.location && (
                                    <span className="text-right text-[8px] uppercase tracking-[0.18em]">
                                        {profile.location}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col justify-between">
                        <div>
                            <p
                                className="max-w-4xl whitespace-pre-line text-[15px] leading-7 sm:text-base sm:leading-8 lg:text-lg lg:leading-8"
                                style={{ color: 'var(--editorial-text)' }}
                            >
                                {profile.about_me ??
                                    profile.bio ??
                                    'An independent artist exploring ideas, images, and creative expression through a constantly evolving practice.'}
                            </p>
                        </div>

                        <div className="mt-12 grid border-y sm:grid-cols-3">
                            {[
                                ['Discipline', profile.artist_type],
                                ['Based in', profile.location],
                                ['Online', profile.website],
                            ].map(([label, value], index) => (
                                <div
                                    key={label}
                                    className={`py-5 sm:px-5 ${index > 0 ? 'border-t sm:border-l sm:border-t-0' : ''}`}
                                    style={{ borderColor: 'var(--editorial-border)' }}
                                >
                                    <p
                                        className="text-[8px] uppercase tracking-[0.2em]"
                                        style={{ color: 'var(--editorial-muted)' }}
                                    >
                                        {label}
                                    </p>

                                    {value ? (
                                        label === 'Online' ? (
                                            <a
                                                href={String(value)}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="mt-2 inline-block text-xs underline underline-offset-4 transition-opacity hover:opacity-50"
                                                style={{ color: 'var(--editorial-text)' }}
                                            >
                                                Visit website ↗
                                            </a>
                                        ) : (
                                            <p
                                                className="mt-2 text-xs"
                                                style={{ color: 'var(--editorial-text)' }}
                                            >
                                                {value}
                                            </p>
                                        )
                                    ) : (
                                        <p
                                            className="mt-2 text-xs"
                                            style={{ color: 'var(--editorial-muted)' }}
                                        >
                                            —
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function ContactSection({
    profile,
    visible,
}: PortfolioProps & {
    visible: boolean;
}) {
    const settings = profile.portfolio_settings;

    if (!visible || !profile.website) {
        return null;
    }

    return (
        <section
            id="contact"
            className="border-b"
            style={{
                backgroundColor:
                    'var(--editorial-bg)',
                borderColor:
                    'var(--editorial-border)',
            }}
        >
            <div className="mx-auto max-w-[1600px] px-6 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-32">
                <div className="grid gap-10 lg:grid-cols-[0.35fr_1fr] lg:gap-20">
                    <div>
                        <p
                            className="text-[9px] uppercase tracking-[0.3em]"
                            style={{
                                color:
                                    'var(--editorial-muted)',
                            }}
                        >
                            Contact
                        </p>
                    </div>

                    <div>
                        <h2
                            className="max-w-5xl text-5xl font-medium leading-[0.92] tracking-[-0.06em] sm:text-7xl lg:text-8xl"
                            style={{
                                color:
                                    'var(--editorial-text)',
                            }}
                        >
                            Let&apos;s make
                            <br />
                            something
                            <br />
                            meaningful.
                        </h2>

                        <a
                            href={profile.website}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-12 inline-flex items-center gap-3 border-b pb-2 text-[9px] uppercase tracking-[0.22em] transition-opacity hover:opacity-50"
                            style={{
                                borderColor:
                                    'var(--editorial-text)',
                                color:
                                    'var(--editorial-text)',
                            }}
                        >
                            Get in touch ↗
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default function EditorialTemplate({
    profile,
}: PortfolioProps) {
    const settings = profile.portfolio_settings;
    const projects = profile.projects ?? [];

    const navigationSettings =
        settings as typeof settings &
            NavigationSettings;

    const navigationItems = (
        navigationSettings.navigation_items ?? []
    )
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

    const contactNavigationVisible =
        navigationItems.some(
            (item) =>
                item.destination === 'contact',
        );

    const [mobileMenuOpen, setMobileMenuOpen] =
        useState(false);

    useEffect(() => {
        const onKeyDown = (
            event: KeyboardEvent,
        ) => {
            if (event.key === 'Escape') {
                setMobileMenuOpen(false);
            }
        };

        window.addEventListener(
            'keydown',
            onKeyDown,
        );

        return () => {
            window.removeEventListener(
                'keydown',
                onKeyDown,
            );
        };
    }, []);

    const pageStyle = {
        backgroundColor:
            settings.background_color,
        color: settings.text_color,
        '--editorial-bg':
            settings.background_color,
        '--editorial-text':
            settings.text_color,
        '--editorial-primary':
            settings.primary_color,
        '--editorial-accent':
            settings.accent_color,
        '--editorial-hover':
            settings.hover_color,
        '--editorial-surface':
            settings.surface_color,
        '--editorial-muted':
            settings.muted_text_color,
        '--editorial-border':
            `${settings.border_color}66`,
        '--editorial-card-bg': settings.card_background_color,
        '--editorial-card-text': settings.card_text_color,
        '--editorial-card-accent': settings.card_accent_color,
        '--editorial-card-primary': settings.card_primary_color,
        '--editorial-card-hover': settings.card_hover_color,
        '--editorial-card-hover-text': getContrastColor(
            settings.card_hover_color,
        ),
        '--editorial-primary-contrast': getContrastColor(settings.primary_color),
    } as CSSProperties;

    const navTextColor = getContrastColor(
        settings.background_color,
    );

    return (
        <>
            <style>{`
                .editorial-setting-hover:hover {
                    color: var(--editorial-hover) !important;
                    border-color: var(--editorial-hover) !important;
                }

                .editorial-play-button:hover {
                    background-color: var(--editorial-hover) !important;
                    border-color: var(--editorial-hover) !important;
                    color: var(--editorial-bg) !important;
                }

                .editorial-project-row {
                    background-color: var(--editorial-card-bg);
                    color: var(--editorial-card-text);
                    transition: background-color 300ms ease, color 300ms ease;
                }

                .editorial-project-row:hover {
                    background-color: var(--editorial-card-hover);
                }

                .editorial-project-row:hover .editorial-project-hover-text {
                    color: var(--editorial-card-hover-text) !important;
                }

                .editorial-project-row:hover .editorial-project-hover-line {
                    background-color: var(--editorial-card-hover-text) !important;
                }

                .editorial-project-primary {
                    color: var(--editorial-card-primary);
                }

                .editorial-project-accent {
                    color: var(--editorial-card-accent);
                }

                .editorial-project-image {
                    border-color: var(--editorial-card-accent) !important;
                }
            `}</style>

            <main
            id="top"
            className={`min-h-screen overflow-x-hidden ${settings.show_navigation ? 'pt-16 sm:pt-[4.5rem]' : ''}`}
            style={pageStyle}
        >
            {/* Navigation */}
            {settings.show_navigation && (
                <header
                    className="fixed inset-x-0 top-0 z-50 border-b"
                    style={{
                        backgroundColor: settings.background_color,
                        borderColor: `${navTextColor}33`,
                        color: navTextColor,
                    }}
                >
                    <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
                        <div className="grid min-h-16 grid-cols-[1fr_auto_1fr] items-center gap-4 sm:min-h-[4.5rem]">
                            <a
                                href="#top"
                                className="group flex min-w-0 items-center gap-3"
                                onClick={() => setMobileMenuOpen(false)}
                                style={{ color: navTextColor }}
                            >

                                <span
                                    className="truncate text-[9px] font-semibold uppercase tracking-[0.18em]"
                                    style={{ color: navTextColor }}
                                >
                                    {profile.display_name}
                                </span>
                            </a>

                            <nav className="hidden items-center justify-center gap-6 md:flex lg:gap-8">
                                {navigationItems.map((item, index) => {
                                    const href = getNavigationHref(item.destination);
                                    const external = item.destination === 'external';

                                    if (!href && !external) {
                                        return null;
                                    }

                                    return (
                                        <a
                                            key={item.id ?? `${item.destination}-${item.sort_order}`}
                                            href={external ? item.url ?? '#' : href ?? '#'}
                                            target={external ? '_blank' : undefined}
                                            rel={external ? 'noreferrer' : undefined}
                                            className="editorial-setting-hover group relative flex items-center gap-2 py-2 text-[8px] font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-55"
                                            style={{ color: navTextColor }}
                                        >
                                            <span
                                                className="text-[6px] opacity-50"
                                                style={{ color: navTextColor }}
                                            >
                                                {String(index + 1).padStart(2, '0')}
                                            </span>
                                            <span>{item.label}</span>
                                            <span
                                                className="absolute bottom-0 left-0 h-px w-0 transition-all duration-300 group-hover:w-full"
                                                style={{ backgroundColor: navTextColor }}
                                            />
                                        </a>
                                    );
                                })}
                            </nav>

                            <div className="flex items-center justify-end gap-3">
                                <span
                                    className="hidden text-[7px] font-medium uppercase tracking-[0.2em] opacity-60 lg:block"
                                    style={{ color: navTextColor }}
                                >
                                    {new Date().getFullYear()} / PORTFOLIO
                                </span>

                                <button
                                    type="button"
                                    className="flex h-9 min-w-9 items-center justify-center border px-2 md:hidden"
                                    style={{
                                        borderColor: `${navTextColor}55`,
                                        color: navTextColor,
                                    }}
                                    aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                                    aria-expanded={mobileMenuOpen}
                                    onClick={() => setMobileMenuOpen((open) => !open)}
                                >
                                    <span className="text-[8px] font-semibold uppercase tracking-[0.16em]">
                                        {mobileMenuOpen ? 'Close' : 'Menu'}
                                    </span>
                                </button>
                            </div>
                        </div>

                        <div
                            className={`overflow-hidden transition-all duration-300 md:hidden ${mobileMenuOpen ? 'max-h-[80vh] border-t opacity-100' : 'max-h-0 opacity-0'}`}
                            style={{ borderColor: `${navTextColor}33` }}
                        >
                            <nav className="grid grid-cols-1 sm:grid-cols-2">
                                {navigationItems.map((item, index) => {
                                    const href = getNavigationHref(item.destination);
                                    const external = item.destination === 'external';

                                    if (!href && !external) {
                                        return null;
                                    }

                                    return (
                                        <a
                                            key={item.id ?? `${item.destination}-mobile-${item.sort_order}`}
                                            href={external ? item.url ?? '#' : href ?? '#'}
                                            target={external ? '_blank' : undefined}
                                            rel={external ? 'noreferrer' : undefined}
                                            className="editorial-setting-hover group flex items-center justify-between border-b py-4 text-[9px] font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-55 sm:px-3"
                                            style={{
                                                borderColor: `${navTextColor}33`,
                                                color: navTextColor,
                                            }}
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            <span className="flex items-center gap-3">
                                                <span
                                                    className="text-[7px] opacity-50"
                                                    style={{ color: navTextColor }}
                                                >
                                                    {String(index + 1).padStart(2, '0')}
                                                </span>
                                                <span>{item.label}</span>
                                            </span>
                                            <span style={{ color: navTextColor }}>↗</span>
                                        </a>
                                    );
                                })}
                            </nav>
                        </div>
                    </div>
                </header>
            )}

            {/* Hero */}
            {settings.show_hero && (
                <section
                    className="border-b"
                    style={{
                        borderColor:
                            'var(--editorial-border)',
                    }}
                >
                    <div className="mx-auto grid max-w-[1600px] gap-10 px-6 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-12 lg:py-24">
                        <div className="flex flex-col justify-between">
                            <div>
                                <div className="mb-7 flex items-center gap-3">
                                    <span
                                        className="h-px w-10"
                                        style={{
                                            backgroundColor:
                                                'var(--editorial-accent)',
                                        }}
                                    />

                                    <p
                                        className="text-[9px] uppercase tracking-[0.3em]"
                                        style={{
                                            color:
                                                'var(--editorial-muted)',
                                        }}
                                    >
                                        {settings.hero_label ||
                                            profile.artist_type ||
                                            'Independent Artist'}
                                    </p>
                                </div>

                                <h1
                                    className="max-w-5xl text-[clamp(4rem,11vw,11rem)] font-medium leading-[0.8] tracking-[-0.08em]"
                                    style={{
                                        color:
                                            'var(--editorial-text)',
                                    }}
                                >
                                    {profile.display_name}
                                </h1>
                            </div>

                            <div className="mt-16 max-w-xl lg:mt-24">
                                <div
                                    className="mb-5 h-px w-16"
                                    style={{
                                        backgroundColor:
                                            'var(--editorial-text)',
                                    }}
                                />

                                <p
                                    className="text-lg leading-8 sm:text-xl"
                                    style={{
                                        color:
                                            'var(--editorial-muted)',
                                    }}
                                >
                                    {settings.hero_statement ||
                                        profile.bio ||
                                        'An independent artist building meaningful work through creativity, experimentation, and visual expression.'}
                                </p>

                                <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-[9px] uppercase tracking-[0.2em]">
                                    {profile.artist_type && (
                                        <span
                                            style={{
                                                color:
                                                    'var(--editorial-muted)',
                                            }}
                                        >
                                            {
                                                profile.artist_type
                                            }
                                        </span>
                                    )}

                                    {profile.location && (
                                        <span
                                            style={{
                                                color:
                                                    'var(--editorial-muted)',
                                            }}
                                        >
                                            {
                                                profile.location
                                            }
                                        </span>
                                    )}

                                    <span
                                        style={{
                                            color:
                                                'var(--editorial-muted)',
                                        }}
                                    >
                                        @{profile.username}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div
                            className="relative min-h-[420px] overflow-hidden border sm:min-h-[560px] lg:min-h-[680px]"
                            style={{
                                backgroundColor:
                                    'var(--editorial-surface)',
                                borderColor:
                                    'var(--editorial-border)',
                            }}
                        >
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
                                        src={
                                            getAssetUrl(
                                                profile.cover_image,
                                            ) ??
                                            ''
                                        }
                                        alt={
                                            profile.display_name
                                        }
                                        className="absolute inset-0 h-full w-full select-none object-cover"
                                        draggable={false}
                                        style={{
                                            objectPosition: `${settings.cover_image_position_x}% ${settings.cover_image_position_y}%`,
                                            transform: `scale(${settings.cover_image_zoom})`,
                                            transformOrigin:
                                                'center',
                                        }}
                                    />
                                </div>
                            ) : profile.avatar ? (
                                <img
                                    src={
                                        getAssetUrl(
                                            profile.avatar,
                                        ) ?? ''
                                    }
                                    alt={
                                        profile.display_name
                                    }
                                    className="absolute inset-0 h-full w-full select-none object-cover grayscale"
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
                                    className="absolute inset-0 flex items-end p-8"
                                    style={{
                                        color:
                                            'var(--editorial-muted)',
                                    }}
                                >
                                    <span className="text-[9px] uppercase tracking-[0.24em]">
                                        Image / Cover
                                    </span>
                                </div>
                            )}

                            <div className="pointer-events-none absolute inset-0 border border-black/15" />

                            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 text-white mix-blend-difference sm:bottom-7 sm:left-7 sm:right-7">
                                <span className="text-[8px] uppercase tracking-[0.2em]">
                                    01 — Identity
                                </span>

                                {profile.website && (
                                    <a
                                        href={
                                            profile.website
                                        }
                                        target="_blank"
                                        rel="noreferrer"
                                        className="pointer-events-auto text-[8px] uppercase tracking-[0.2em] underline underline-offset-4"
                                    >
                                        Website ↗
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Selected Work */}
            {settings.show_work && (
                <section
                    id="work"
                    className="border-b"
                    style={{
                        borderColor:
                            'var(--editorial-border)',
                    }}
                >
                    <div className="mx-auto max-w-[1600px] px-6 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-32">
                        <div className="mb-16 grid gap-8 border-b pb-8 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
                            <div>
                                <p
                                    className="text-[9px] uppercase tracking-[0.3em]"
                                    style={{
                                        color:
                                            'var(--editorial-muted)',
                                    }}
                                >
                                    02 /{' '}
                                    {settings.work_label ||
                                        'Selected Work'}
                                </p>

                                <h2
                                    className="mt-5 max-w-5xl text-[clamp(3.5rem,8vw,8rem)] font-medium leading-[0.82] tracking-[-0.075em]"
                                    style={{
                                        color:
                                            'var(--editorial-text)',
                                    }}
                                >
                                    {settings.work_label ||
                                        'Selected Work'}
                                </h2>
                            </div>

                            <div className="lg:pb-1 lg:text-right">
                                <span
                                    className="text-[8px] uppercase tracking-[0.24em]"
                                    style={{
                                        color:
                                            'var(--editorial-muted)',
                                    }}
                                >
                                    {String(
                                        projects.length,
                                    ).padStart(
                                        2,
                                        '0',
                                    )}{' '}
                                    Projects / Index
                                </span>
                            </div>
                        </div>

                        {settings.work_description && (
                            <div className="mb-16 grid gap-6 lg:grid-cols-[0.35fr_1fr] lg:gap-16">
                                <p
                                    className="text-[8px] uppercase tracking-[0.24em]"
                                    style={{
                                        color:
                                            'var(--editorial-muted)',
                                    }}
                                >
                                    Selected practice
                                </p>

                                <p
                                    className="max-w-3xl text-sm leading-7 sm:text-base sm:leading-8"
                                    style={{
                                        color:
                                            'var(--editorial-muted)',
                                    }}
                                >
                                    {settings.work_description}
                                </p>
                            </div>
                        )}

                        {projects.length > 0 ? (
                            <div className="border-t">
                                {projects.map(
                                    (
                                        project,
                                        index,
                                    ) => (
                                        <a
                                            key={
                                                project.id
                                            }
                                            href={`/@${profile.username}/project/${project.slug}`}
                                            className="editorial-project-row group relative block border-b py-10 sm:py-14 lg:py-16"
                                            style={{
                                                borderColor:
                                                    'var(--editorial-border)',
                                            }}
                                        >
                                            <div className="mx-auto grid w-full gap-8 lg:w-[84%] lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.62fr)] lg:items-center lg:gap-12">
                                                    <div className="order-2 lg:order-1">
                                                        <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                                                            <span
                                                                className="editorial-project-hover-text text-[8px] uppercase tracking-[0.2em]"
                                                                style={{
                                                                    color:
                                                                        'var(--editorial-card-primary)',
                                                                }}
                                                            >
                                                                {project.project_type ||
                                                                    'Creative Project'}
                                                            </span>

                                                            <span
                                                                className="editorial-project-hover-line h-px w-5"
                                                                style={{
                                                                    backgroundColor:
                                                                        'var(--editorial-border)',
                                                                }}
                                                            />

                                                            <span
                                                                className="editorial-project-hover-text text-[8px] uppercase tracking-[0.2em]"
                                                                style={{
                                                                    color:
                                                                        'var(--editorial-muted)',
                                                                }}
                                                            >
                                                                Project
                                                            </span>
                                                        </div>

                                                        <h3
                                                            className="editorial-project-hover-text max-w-3xl text-[clamp(2.5rem,5vw,5.5rem)] font-medium leading-[0.86] tracking-[-0.065em] transition-transform duration-500 group-hover:translate-x-2"
                                                            style={{
                                                                color:
                                                                    'var(--editorial-card-text)',
                                                            }}
                                                        >
                                                            {
                                                                project.title
                                                            }
                                                        </h3>

                                                        <div className="mt-8 flex items-center gap-4">
                                                            <span
                                                                className="h-px w-10 transition-all duration-500 group-hover:w-16"
                                                                style={{
                                                                    backgroundColor:
                                                                        'var(--editorial-card-accent)',
                                                                }}
                                                            />

                                                            <span
                                                                className="editorial-project-hover-text text-[8px] uppercase tracking-[0.22em] transition-opacity duration-300 group-hover:opacity-100 lg:opacity-60"
                                                                style={{
                                                                    color:
                                                                        'var(--editorial-card-text)',
                                                                }}
                                                            >
                                                                Explore project
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="editorial-project-image order-1 overflow-hidden border lg:order-2"
                                                        style={{
                                                            borderColor:
                                                                'var(--editorial-card-accent)',
                                                        }}
                                                    >
                                                        <ProjectImage
                                                            project={
                                                                project
                                                            }
                                                        />
                                                    </div>
                                                </div>

                                            <div
                                                className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                                                style={{
                                                    backgroundColor:
                                                        'var(--editorial-card-accent)',
                                                }}
                                            />
                                        </a>
                                    ),
                                )}
                            </div>
                        ) : (
                            <div
                                className="border-t py-16"
                                style={{
                                    borderColor:
                                        'var(--editorial-border)',
                                }}
                            >
                                <p
                                    className="text-sm"
                                    style={{
                                        color:
                                            'var(--editorial-muted)',
                                    }}
                                >
                                    Selected work will appear
                                    here.
                                </p>
                            </div>
                        )}
                    </div>
                </section>
            )}

            <GallerySection profile={profile} />

            <MusicSection profile={profile} />

            <ArtistMessageSection
                profile={profile}
            />

            <AboutSection profile={profile} />

            <ContactSection
                profile={profile}
                visible={
                    contactNavigationVisible
                }
            />

            {/* Footer */}
            {settings.show_footer && (
                <footer
                    id="footer"
                    className="border-t"
                    style={{
                        backgroundColor: 'var(--editorial-surface)',
                        borderColor: 'var(--editorial-border)',
                    }}
                >
                    <div className="mx-auto max-w-[1600px] px-6 pb-7 pt-16 sm:px-8 sm:pt-20 lg:px-12 lg:pt-24">
                        <div className="border-b pb-10" style={{ borderColor: 'var(--editorial-border)' }}>
                            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <p
                                        className="text-[8px] font-semibold uppercase tracking-[0.3em]"
                                        style={{ color: 'var(--editorial-accent)' }}
                                    >
                                        {settings.footer_label || 'Colophon'}
                                    </p>
                                    <h2
                                        className="mt-5 text-[clamp(4rem,13vw,11rem)] font-medium leading-[0.75] tracking-[-0.09em]"
                                        style={{ color: 'var(--editorial-text)' }}
                                    >
                                        THE END.
                                    </h2>
                                </div>

                                {settings.footer_logo ? (
                                    <img
                                        src={getAssetUrl(settings.footer_logo) ?? ''}
                                        alt="Footer logo"
                                        className="max-h-12 max-w-[180px] object-contain opacity-80"
                                    />
                                ) : (
                                    <img
                                        src="/images/brand/Lira_logo.png"
                                        alt="LIRA"
                                        className="h-8 w-auto object-contain opacity-70"
                                    />
                                )}
                            </div>

                            {settings.footer_message && (
                                <p
                                    className="mt-8 max-w-xl text-xs leading-6"
                                    style={{ color: 'var(--editorial-muted)' }}
                                >
                                    {settings.footer_message}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-8 py-7 sm:grid-cols-2 lg:grid-cols-[1fr_auto_1fr] lg:items-end">
                            <div>
                                <p
                                    className="text-[8px] uppercase tracking-[0.22em]"
                                    style={{ color: 'var(--editorial-muted)' }}
                                >
                                    {settings.copyright_text || `© ${new Date().getFullYear()} ${profile.display_name}`}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-x-6 gap-y-3 lg:justify-center">
                                {settings.show_footer_socials && profile.website && (
                                    <a
                                        href={profile.website}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-[8px] uppercase tracking-[0.22em] underline underline-offset-4 transition-opacity hover:opacity-50"
                                        style={{ color: 'var(--editorial-text)' }}
                                    >
                                        Website ↗
                                    </a>
                                )}
                                <a
                                    href="#top"
                                    className="text-[8px] uppercase tracking-[0.22em] transition-opacity hover:opacity-50"
                                    style={{ color: 'var(--editorial-text)' }}
                                >
                                    Back to top ↑
                                </a>
                            </div>

                            <div className="flex items-center gap-3 sm:justify-end">
                                <span
                                    className="text-[8px] uppercase tracking-[0.2em]"
                                    style={{ color: 'var(--editorial-muted)' }}
                                >
                                    Independent artist / LIRA
                                </span>
                                {settings.show_powered_by_lira && (
                                    <a
                                        href="/"
                                        aria-label="Powered by LIRA"
                                        className="transition-opacity hover:opacity-60"
                                    >
                                        <img
                                            src="/images/brand/Lira_logo.png"
                                            alt="LIRA"
                                            className="h-5 w-auto object-contain opacity-70"
                                        />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </footer>
            )}

            </main>
        </>
    );
}
