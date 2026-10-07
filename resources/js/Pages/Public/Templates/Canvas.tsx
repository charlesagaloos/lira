import { useState } from 'react';
import type { CSSProperties } from 'react';

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
    url: string | null;
    sort_order: number;
    is_visible: boolean;
};

type NavigationSettings = {
    navigation_items?: NavigationItem[];
};

type CanvasGalleryImage = {
    id: number;
    image: string | null;
    title: string | null;
    caption: string | null;
    alt_text: string | null;
    sort_order: number;
};

type CanvasGalleryResponsive = {
    display: 'grid' | 'masonry' | 'editorial' | 'freeform';
    columns: number;
    image_aspect: 'original' | 'square' | 'portrait' | 'landscape';
};

type CanvasGalleryResponsiveMap = {
    desktop?: CanvasGalleryResponsive;
    tablet?: CanvasGalleryResponsive;
    mobile?: CanvasGalleryResponsive;
};

function getGalleryAspectRatio(
    aspect: CanvasGalleryResponsive['image_aspect'],
): string | undefined {
    switch (aspect) {
        case 'square':
            return '1 / 1';
        case 'portrait':
            return '4 / 5';
        case 'landscape':
            return '4 / 3';
        default:
            return undefined;
    }
}

function getAssetUrl(path: string | null): string | null {
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

function formatReleaseDate(date: string | null): string | null {
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

    const platform = platforms.find(([, url]) => Boolean(url));

    if (!platform || !platform[1]) {
        return null;
    }

    return {
        label: platform[0],
        url: platform[1],
    };
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
            return settings.show_work && profile.projects.length > 0;
        case 'gallery':
            return (
                settings.show_gallery &&
                (settings.gallery_images?.length ?? 0) > 0
            );
        case 'music':
            return settings.show_music && profile.releases.length > 0;
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

function getNavigationHref(item: NavigationItem): string | null {
    switch (item.destination) {
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
        case 'external':
            return item.url;
        default:
            return null;
    }
}

function Tape({
    className = '',
}: {
    className?: string;
}) {
    return <span aria-hidden="true" className={`canvas-tape ${className}`} />;
}

function Scribble({
    className = '',
}: {
    className?: string;
}) {
    return <span aria-hidden="true" className={`canvas-scribble ${className}`} />;
}

function ProjectPhoto({
    project,
    index,
    className = '',
}: {
    project: PortfolioProject;
    index: number;
    className?: string;
}) {
    const image = getAssetUrl(project.thumbnail);

    return (
        <div
            className={`canvas-photo group relative overflow-visible ${className}`}
            style={{ zIndex: index + 1 }}
        >
            <Tape className="-top-3 left-1/2 -translate-x-1/2 -rotate-2" />

            <div className="relative overflow-hidden border border-black/15 bg-[#d9d3c5] p-1.5 shadow-[5px_7px_0_rgba(0,0,0,0.16)] sm:p-2">
                <div className="relative aspect-[4/3] overflow-hidden bg-black/10">
                    {image ? (
                        <img
                            src={image}
                            alt={project.title}
                            className="absolute inset-0 h-full w-full select-none object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
                            draggable={false}
                            style={{
                                objectPosition: `${project.thumbnail_position_x}% ${project.thumbnail_position_y}%`,
                                transform: `translate(${project.thumbnail_offset_x}%, ${project.thumbnail_offset_y}%) scale(${project.thumbnail_zoom / 100})`,
                                transformOrigin: 'center',
                            }}
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center bg-[#222] text-[8px] uppercase tracking-[0.28em] text-white/60">
                            No Image
                        </div>
                    )}
                </div>

                <div className="px-1 pb-1 pt-2 sm:px-2 sm:pb-0 sm:pt-2">
                    <p className="font-[cursive] text-[10px] leading-none text-black/70 sm:text-xs">
                        {project.title}
                    </p>
                </div>

                <div className="pointer-events-none absolute inset-0 border border-white/30" />
            </div>

        </div>
    );
}

function ReleaseCard({
    release,
    index,
}: {
    release: PortfolioRelease;
    index: number;
}) {
    const image = getAssetUrl(release.artwork);
    const streamingLink = getPrimaryStreamingLink(release);

    return (
        <article className={`canvas-release group relative ${index % 2 === 0 ? 'canvas-release-left' : 'canvas-release-right'}`}>
            <Tape className={index % 2 === 0 ? '-top-2 left-6 -rotate-6' : '-top-2 right-6 rotate-6'} />

            <div className="relative aspect-square overflow-hidden border border-black/15 bg-[#d9d3c5] p-1.5 shadow-[4px_6px_0_rgba(0,0,0,0.18)]">
                {image ? (
                    streamingLink ? (
                        <a
                            href={streamingLink.url}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`Play ${release.title} on ${streamingLink.label}`}
                            className="block h-full w-full"
                        >
                            <img
                                src={image}
                                alt={release.title}
                                className="h-full w-full select-none object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                                draggable={false}
                            />
                        </a>
                    ) : (
                        <img
                            src={image}
                            alt={release.title}
                            className="h-full w-full select-none object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                            draggable={false}
                        />
                    )
                ) : (
                    <div className="flex h-full items-center justify-center bg-[#222] text-[8px] uppercase tracking-[0.2em] text-white/60">
                        {release.release_type}
                    </div>
                )}

                {streamingLink && (
                    <a
                        href={streamingLink.url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Play ${release.title} on ${streamingLink.label}`}
                        className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/70 bg-black/55 text-white backdrop-blur-sm transition-transform duration-300 hover:scale-110"
                    >
                        <span className="ml-0.5 border-y-[4px] border-l-[6px] border-y-transparent border-l-current" />
                    </a>
                )}
            </div>

            <div className="mt-2 px-1">
                <p className="font-[cursive] text-[11px] leading-none text-white/85">
                    {release.title}
                </p>
            </div>
        </article>
    );
}

export default function CanvasTemplate({
    profile,
}: PortfolioProps) {
    const settings = profile.portfolio_settings;
    const projects = profile.projects ?? [];
    const releases = profile.releases ?? [];
    const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);

    const navigationSettings =
        settings as typeof settings & NavigationSettings;

    const navigationItems = (
        navigationSettings.navigation_items ?? []
    )
        .filter(
            (item) =>
                item.is_visible &&
                isNavigationItemAvailable(item, profile),
        )
        .sort((a, b) => a.sort_order - b.sort_order);

    const visibleReleases =
        settings.music_release_display === 'latest'
            ? releases.slice(0, Math.max(1, settings.music_release_limit))
            : releases;

    const heroProjects = projects.slice(0, 2);
    const collageProjects = projects.slice(0, 6);

    const featuredRelease =
        releases.find(
            (release) => release.id === settings.featured_release_id,
        ) ?? releases[0] ?? null;

    const canvasBackgroundText =
        settings.canvas_background_text?.trim() ||
        'ART\nCREATES\nSPACE';

    const galleryImages = (
        (settings.gallery_images ?? []) as CanvasGalleryImage[]
    ).filter((image) => Boolean(image.image));

    const galleryResponsive =
        (settings.gallery_responsive as
            | CanvasGalleryResponsiveMap
            | null
            | undefined) ?? {};

    const desktopGallery: CanvasGalleryResponsive = galleryResponsive.desktop ?? {
        display: settings.gallery_display ?? 'grid',
        columns: settings.gallery_columns ?? 3,
        image_aspect: settings.gallery_image_aspect ?? 'original',
    };

    const tabletGallery: CanvasGalleryResponsive = galleryResponsive.tablet ?? desktopGallery;
    const mobileGallery: CanvasGalleryResponsive = galleryResponsive.mobile ?? {
        ...tabletGallery,
        columns: Math.min(tabletGallery.columns, 2),
    };

    const [lightboxIndex, setLightboxIndex] =
        useState<number | null>(null);

    const lightboxImage =
        lightboxIndex !== null
            ? galleryImages[lightboxIndex] ?? null
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
        if (lightboxIndex === null || galleryImages.length === 0) {
            return;
        }

        setLightboxIndex(
            lightboxIndex === 0
                ? galleryImages.length - 1
                : lightboxIndex - 1,
        );
    }

    function showNextImage() {
        if (lightboxIndex === null || galleryImages.length === 0) {
            return;
        }

        setLightboxIndex(
            lightboxIndex === galleryImages.length - 1
                ? 0
                : lightboxIndex + 1,
        );
    }

    const profileImage = getAssetUrl(profile.avatar);
    const footerLogo = getAssetUrl(settings.footer_logo);

    const pageStyle = {
        backgroundColor: settings.background_color,
        color: settings.text_color,
        '--canvas-bg': settings.background_color,
        '--canvas-text': settings.text_color,
        '--canvas-muted': settings.muted_text_color,
        '--canvas-surface': settings.card_background_color,
        '--canvas-border': settings.border_color,
        '--canvas-accent': settings.accent_color,
        '--canvas-primary': settings.primary_color,
        '--canvas-card': settings.card_background_color,
    } as CSSProperties;

    return (
        <main
            id="top"
            className="canvas-page min-h-screen overflow-hidden"
            style={pageStyle}
        >
            <style>{`
                .canvas-page {
                    position: relative;
                    isolation: isolate;
                    background-image:
                        radial-gradient(circle at 15% 20%, rgba(255,255,255,0.055) 0 1px, transparent 1.5px),
                        radial-gradient(circle at 70% 80%, rgba(255,255,255,0.04) 0 1px, transparent 1.5px),
                        repeating-linear-gradient(0deg, rgba(255,255,255,0.018) 0 1px, transparent 1px 5px),
                        repeating-linear-gradient(90deg, rgba(0,0,0,0.018) 0 1px, transparent 1px 7px);
                    background-size: 13px 13px, 17px 17px, auto, auto;
                }

                .canvas-page::before {
                    content: '';
                    position: fixed;
                    inset: 0;
                    z-index: -1;
                    pointer-events: none;
                    opacity: 0.32;
                    background:
                        radial-gradient(ellipse at center, transparent 25%, rgba(0,0,0,0.34) 100%);
                    mix-blend-mode: multiply;
                }

                .canvas-hand {
                    font-family: 'Segoe Print', 'Comic Sans MS', cursive;
                }

                .canvas-tape {
                    position: absolute;
                    z-index: 30;
                    width: 58px;
                    height: 18px;
                    background: rgba(196, 187, 164, 0.72);
                    box-shadow: inset 0 0 8px rgba(80,70,55,0.12);
                    mix-blend-mode: multiply;
                    pointer-events: none;
                }

                .canvas-scribble {
                    position: absolute;
                    width: 54px;
                    height: 54px;
                    border: 1px solid currentColor;
                    border-radius: 48% 52% 44% 56%;
                    transform: rotate(-17deg);
                    opacity: 0.65;
                    pointer-events: none;
                }

                .canvas-scribble::before,
                .canvas-scribble::after {
                    content: '';
                    position: absolute;
                    inset: 5px 9px;
                    border: 1px solid currentColor;
                    border-radius: 50%;
                    transform: rotate(21deg);
                }

                .canvas-scribble::after {
                    inset: 18px -7px 18px 12px;
                    border-radius: 0;
                    border-width: 0 0 1px 0;
                    transform: rotate(-22deg);
                }

                .canvas-torn {
                    clip-path: polygon(0 3%, 7% 0, 15% 2%, 22% 0, 31% 2%, 39% 0, 48% 2%, 58% 0, 68% 3%, 76% 0, 87% 2%, 100% 0, 98% 100%, 88% 97%, 80% 100%, 69% 97%, 59% 100%, 50% 97%, 39% 100%, 29% 97%, 18% 100%, 9% 97%, 0 100%);
                }

                .canvas-project:nth-child(1) { transform: rotate(-2.2deg) translateY(14px); }
                .canvas-project:nth-child(2) { transform: rotate(1.8deg) translateY(-12px); }
                .canvas-project:nth-child(3) { transform: rotate(-1.2deg) translateY(20px); }
                .canvas-project:nth-child(4) { transform: rotate(2.3deg) translateY(-18px); }
                .canvas-project:nth-child(5) { transform: rotate(-1.7deg) translateY(12px); }
                .canvas-project:nth-child(6) { transform: rotate(1.2deg) translateY(-8px); }

                .canvas-project:hover {
                    z-index: 50 !important;
                    transform: translateY(-7px) rotate(0deg) scale(1.025) !important;
                }

                .canvas-release-left { transform: rotate(-1.7deg); }
                .canvas-release-right { transform: rotate(1.5deg) translateY(9px); }

                .canvas-gallery-grid {
                    display: grid;
                    grid-template-columns: repeat(var(--gallery-desktop-columns), minmax(0, 1fr));
                    gap: 1.25rem;
                }

                .canvas-gallery-item {
                    min-width: 0;
                }

                .canvas-gallery-item-image {
                    width: 100%;
                    overflow: hidden;
                    background: rgba(0,0,0,0.12);
                }

                .canvas-gallery-masonry {
                    column-count: var(--gallery-desktop-columns);
                    column-gap: 1.25rem;
                }

                .canvas-gallery-masonry .canvas-gallery-item {
                    break-inside: avoid;
                    margin-bottom: 1.25rem;
                }

                .canvas-gallery-editorial {
                    display: grid;
                    grid-template-columns: repeat(12, minmax(0, 1fr));
                    gap: 1.5rem 1.25rem;
                    align-items: start;
                }

                /* Editorial rhythm: structured asymmetry without random offsets */
                .canvas-gallery-editorial .canvas-gallery-item {
                    min-width: 0;
                    margin-top: 0;
                }

                .canvas-gallery-editorial .canvas-gallery-item:nth-child(6n + 1) {
                    grid-column: 1 / span 7;
                }

                .canvas-gallery-editorial .canvas-gallery-item:nth-child(6n + 2) {
                    grid-column: 8 / span 5;
                }

                .canvas-gallery-editorial .canvas-gallery-item:nth-child(6n + 3) {
                    grid-column: 2 / span 5;
                }

                .canvas-gallery-editorial .canvas-gallery-item:nth-child(6n + 4) {
                    grid-column: 7 / span 6;
                }

                .canvas-gallery-editorial .canvas-gallery-item:nth-child(6n + 5) {
                    grid-column: 1 / span 6;
                }

                .canvas-gallery-editorial .canvas-gallery-item:nth-child(6n) {
                    grid-column: 7 / span 6;
                }

                .canvas-gallery-freeform {
                    display: grid;
                    grid-template-columns: repeat(var(--gallery-desktop-columns), minmax(0, 1fr));
                    gap: 1.5rem;
                    align-items: start;
                }

                .canvas-gallery-freeform .canvas-gallery-item:nth-child(odd) {
                    transform: rotate(-1.2deg) translateY(0.75rem);
                }

                .canvas-gallery-freeform .canvas-gallery-item:nth-child(even) {
                    transform: rotate(1.2deg) translateY(-0.5rem);
                }

                .canvas-gallery-freeform .canvas-gallery-item:hover {
                    transform: translateY(-5px) rotate(0deg) scale(1.015);
                    z-index: 5;
                }

                .canvas-gallery [data-gallery-layout] {
                    display: none;
                }

                .canvas-gallery[data-desktop-display="grid"] [data-gallery-layout="grid"],
                .canvas-gallery[data-desktop-display="masonry"] [data-gallery-layout="masonry"],
                .canvas-gallery[data-desktop-display="editorial"] [data-gallery-layout="editorial"],
                .canvas-gallery[data-desktop-display="freeform"] [data-gallery-layout="freeform"] {
                    display: grid;
                }

                .canvas-gallery[data-desktop-display="masonry"] [data-gallery-layout="masonry"] {
                    display: block;
                }

                @media (max-width: 1023px) {
                    /* Tablet: hide the desktop selection first, then show the tablet selection. */
                    .canvas-gallery [data-gallery-layout] {
                        display: none;
                    }

                    .canvas-gallery[data-tablet-display="grid"] [data-gallery-layout="grid"],
                    .canvas-gallery[data-tablet-display="editorial"] [data-gallery-layout="editorial"],
                    .canvas-gallery[data-tablet-display="freeform"] [data-gallery-layout="freeform"] {
                        display: grid;
                    }

                    .canvas-gallery[data-tablet-display="masonry"] [data-gallery-layout="masonry"] {
                        display: block;
                    }

                    .canvas-gallery-grid {
                        grid-template-columns: repeat(var(--gallery-tablet-columns), minmax(0, 1fr));
                    }

                    .canvas-gallery-masonry {
                        column-count: var(--gallery-tablet-columns);
                    }

                    .canvas-gallery-editorial {
                        grid-template-columns: repeat(12, minmax(0, 1fr));
                    }

                    .canvas-gallery-editorial .canvas-gallery-item:nth-child(3n + 1) {
                        grid-column: 1 / span 7;
                    }

                    .canvas-gallery-editorial .canvas-gallery-item:nth-child(3n + 2) {
                        grid-column: 8 / span 5;
                        margin-top: 1rem;
                    }

                    .canvas-gallery-editorial .canvas-gallery-item:nth-child(3n) {
                        grid-column: 2 / span 7;
                    }

                    .canvas-gallery-freeform {
                        grid-template-columns: repeat(var(--gallery-tablet-columns), minmax(0, 1fr));
                    }
                    .canvas-project:nth-child(1) { transform: rotate(-1.5deg) translateY(10px); }
                    .canvas-project:nth-child(2) { transform: rotate(1.2deg) translateY(-7px); }
                    .canvas-project:nth-child(3) { transform: rotate(-1deg) translateY(12px); }
                    .canvas-project:nth-child(4) { transform: rotate(1.4deg) translateY(-9px); }
                    .canvas-project:nth-child(5) { transform: rotate(-1deg) translateY(8px); }
                    .canvas-project:nth-child(6) { transform: rotate(0.8deg) translateY(-5px); }
                }

                @media (max-width: 639px) {
                    /* Mobile: hide the tablet selection first, then show the mobile selection. */
                    .canvas-gallery [data-gallery-layout] {
                        display: none;
                    }

                    .canvas-gallery[data-mobile-display="grid"] [data-gallery-layout="grid"],
                    .canvas-gallery[data-mobile-display="editorial"] [data-gallery-layout="editorial"],
                    .canvas-gallery[data-mobile-display="freeform"] [data-gallery-layout="freeform"] {
                        display: grid;
                    }

                    .canvas-gallery[data-mobile-display="masonry"] [data-gallery-layout="masonry"] {
                        display: block;
                    }
                    .canvas-project:nth-child(n) { transform: none; }
                    .canvas-project:nth-child(odd) { transform: rotate(-1deg) translateY(4px); }
                    .canvas-project:nth-child(even) { transform: rotate(1deg) translateY(-4px); }
                    .canvas-project:hover { transform: translateY(-4px) rotate(0deg) scale(1.015) !important; }
                    .canvas-tape { width: 48px; height: 15px; }
                    .canvas-release-left { transform: rotate(-1deg); }
                    .canvas-release-right { transform: rotate(1deg) translateY(4px); }

                    .canvas-gallery-grid {
                        grid-template-columns: repeat(var(--gallery-mobile-columns), minmax(0, 1fr));
                        gap: 0.75rem;
                    }

                    .canvas-gallery-masonry {
                        column-count: var(--gallery-mobile-columns);
                        column-gap: 0.75rem;
                    }

                    .canvas-gallery-masonry .canvas-gallery-item {
                        margin-bottom: 0.75rem;
                    }

                    .canvas-gallery-editorial {
                        grid-template-columns: 1fr;
                        gap: 1rem;
                    }

                    .canvas-gallery-editorial .canvas-gallery-item:nth-child(n) {
                        grid-column: 1 / -1;
                        margin-top: 0;
                    }

                    .canvas-gallery-freeform {
                        grid-template-columns: repeat(var(--gallery-mobile-columns), minmax(0, 1fr));
                        gap: 0.75rem;
                    }
                }
            `}</style>

            {/* Navigation */}
            {settings.show_navigation && navigationItems.length > 0 && (
                <header
                    className="fixed inset-x-0 top-0 z-[100]"
                    style={{ backgroundColor: settings.background_color }}
                >
                    <div className="mx-auto max-w-[1100px] px-5 sm:px-8">
                        <div className="flex items-center justify-between py-4">
                            <a
                                href="#top"
                                className="text-[9px] font-semibold uppercase tracking-[0.28em]"
                                style={{ color: settings.text_color }}
                                onClick={() => setMobileNavigationOpen(false)}
                            >
                                {profile.display_name}
                            </a>

                            <nav className="hidden items-center gap-6 md:flex">
                                {navigationItems.map((item) => {
                                    const href = getNavigationHref(item);

                                    if (!href) return null;

                                    return (
                                        <a
                                            key={item.id ?? `${item.destination}-${item.label}`}
                                            href={href}
                                            target={item.destination === 'external' ? '_blank' : undefined}
                                            rel={item.destination === 'external' ? 'noreferrer' : undefined}
                                            className="text-[7px] uppercase tracking-[0.18em] transition-opacity hover:opacity-50"
                                            style={{ color: settings.text_color }}
                                        >
                                            {item.label}
                                        </a>
                                    );
                                })}
                            </nav>

                            <div className="flex items-center gap-4">

                                <button
                                    type="button"
                                    className="flex h-8 w-8 items-center justify-center border border-current/20 md:hidden"
                                    style={{ color: settings.text_color }}
                                    onClick={() => setMobileNavigationOpen((open) => !open)}
                                    aria-expanded={mobileNavigationOpen}
                                    aria-controls="canvas-mobile-navigation"
                                    aria-label={mobileNavigationOpen ? 'Close navigation' : 'Open navigation'}
                                >
                                    <span className="sr-only">
                                        {mobileNavigationOpen ? 'Close navigation' : 'Open navigation'}
                                    </span>
                                    <span className="flex w-3.5 flex-col gap-1">
                                        <span className={`block h-px w-full bg-current transition-transform ${mobileNavigationOpen ? 'translate-y-[3px] rotate-45' : ''}`} />
                                        <span className={`block h-px w-full bg-current transition-opacity ${mobileNavigationOpen ? 'opacity-0' : ''}`} />
                                        <span className={`block h-px w-full bg-current transition-transform ${mobileNavigationOpen ? '-translate-y-[3px] -rotate-45' : ''}`} />
                                    </span>
                                </button>
                            </div>
                        </div>

                        {mobileNavigationOpen && (
                            <nav
                                id="canvas-mobile-navigation"
                                className="border-t py-4 md:hidden"
                                style={{
                                    borderColor: settings.border_color,
                                    backgroundColor: settings.background_color,
                                }}
                            >
                                <div className="flex flex-col">
                                    {navigationItems.map((item) => {
                                        const href = getNavigationHref(item);
                                        if (!href) return null;

                                        return (
                                            <a
                                                key={`mobile-${item.id ?? `${item.destination}-${item.label}`}`}
                                                href={href}
                                                target={item.destination === 'external' ? '_blank' : undefined}
                                                rel={item.destination === 'external' ? 'noreferrer' : undefined}
                                                className="border-b py-3 text-[8px] uppercase tracking-[0.2em] transition-opacity last:border-b-0 hover:opacity-50"
                                                style={{ color: settings.text_color, borderColor: settings.border_color }}
                                                onClick={() => setMobileNavigationOpen(false)}
                                            >
                                                {item.label}
                                            </a>
                                        );
                                    })}
                                </div>
                            </nav>
                        )}
                    </div>
                </header>
            )}

            {/* Hero */}
            {settings.show_hero && (
                <section className="relative min-h-[760px] px-5 pb-16 pt-24 sm:min-h-screen sm:px-8 sm:pt-28">
                    <div className="mx-auto max-w-[1100px]">
                        <div className="relative min-h-[680px] sm:min-h-[760px]">
                            <div className="absolute left-0 top-0 max-w-[280px] sm:max-w-[370px]">
                                <h1
                                    className="canvas-hand whitespace-pre-line text-[clamp(2.9rem,9vw,6.7rem)] font-normal uppercase leading-[0.72] tracking-[-0.075em]"
                                    style={{ color: settings.text_color }}
                                >
                                    {canvasBackgroundText}
                                </h1>

                                <Scribble className="-bottom-10 left-8" />
                            </div>

                            {heroProjects[1] && (
                                <div className="absolute right-[2%] top-2 w-[27%] min-w-[110px] max-w-[210px] rotate-[5deg] sm:right-[8%] sm:top-8">
                                    <div className="canvas-torn overflow-hidden bg-[#d7d0c0] p-1.5 shadow-[5px_7px_0_rgba(0,0,0,0.18)]">
                                        {getAssetUrl(heroProjects[1].thumbnail) ? (
                                            <img
                                                src={getAssetUrl(heroProjects[1].thumbnail) ?? undefined}
                                                alt={heroProjects[1].title}
                                                className="aspect-[3/4] w-full object-cover"
                                                style={{
                                                    objectPosition: `${heroProjects[1].thumbnail_position_x}% ${heroProjects[1].thumbnail_position_y}%`,
                                                }}
                                            />
                                        ) : (
                                            <div className="aspect-[3/4] bg-black/20" />
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="absolute left-[21%] top-[112px] w-[56%] max-w-[510px] rotate-[-1.5deg] sm:top-[135px] sm:left-[24%] sm:w-[47%]">
                                <Tape className="-top-2 left-1/2 -translate-x-1/2 rotate-1" />
                                <div className="relative border border-white/20 bg-[#d9d3c5] p-2 shadow-[10px_13px_0_rgba(0,0,0,0.25)] sm:p-3">
                                    <div className="relative aspect-[4/5] overflow-hidden bg-black">
                                        {profile.cover_image ? (
                                            <img
                                                src={getAssetUrl(profile.cover_image) ?? undefined}
                                                alt={profile.display_name}
                                                className="absolute inset-0 h-full w-full object-cover"
                                                style={{
                                                    objectPosition: `${settings.cover_image_position_x}% ${settings.cover_image_position_y}%`,
                                                    transform: `translate(${settings.cover_image_offset_x}%, ${settings.cover_image_offset_y}%) scale(${settings.cover_image_zoom})`,
                                                    transformOrigin: 'center',
                                                }}
                                            />
                                        ) : profile.avatar ? (
                                            <AvatarImage
                                                src={getAssetUrl(profile.avatar) ?? ''}
                                                alt={profile.display_name}
                                                className="select-none object-cover"
                                                zoom={Number(profile.avatar_zoom ?? 1)}
                                                positionX={Number(profile.avatar_position_x ?? 50)}
                                                positionY={Number(profile.avatar_position_y ?? 50)}
                                            />
                                        ) : (
                                            <div className="flex h-full items-end p-5 text-white/60">
                                                <span className="text-[8px] uppercase tracking-[0.25em]">
                                                    No cover image
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="absolute right-0 top-[310px] w-[36%] max-w-[270px] rotate-[4deg] sm:right-[3%] sm:top-[365px]">
                                <div className="canvas-torn bg-[#d7d0c0] p-4 shadow-[4px_6px_0_rgba(0,0,0,0.2)] sm:p-5">
                                    <p className="canvas-hand text-[15px] leading-[1.05] text-black/75 sm:text-[18px]">
                                        ideas
                                        <br />
                                        images
                                        <br />
                                        people
                                        <br />
                                        pieces
                                    </p>
                                </div>
                            </div>

                            <div className="absolute left-[2%] top-[430px] w-[32%] max-w-[210px] rotate-[-8deg] sm:left-[4%] sm:top-[475px]">
                                <div className="relative rounded-full border border-white/55 p-4 text-center text-[9px] uppercase tracking-[0.15em] sm:p-7">
                                    <span className="canvas-hand text-[12px] normal-case tracking-normal sm:text-[15px]">
                                        01
                                    </span>
                                    <Scribble className="inset-1/2 -translate-x-1/2 -translate-y-1/2" />
                                </div>
                            </div>

                            {settings.hero_statement?.trim() && (
                                <div className="absolute bottom-0 right-[4%] w-[54%] max-w-[400px] rotate-[-2deg] sm:right-[7%]">
                                    <div className="canvas-torn bg-[#e2dccd] px-5 py-4 text-black shadow-[5px_6px_0_rgba(0,0,0,0.18)] sm:px-7 sm:py-5">
                                        <p className="canvas-hand whitespace-pre-line text-[12px] leading-[1.05] sm:text-[16px]">
                                            {settings.hero_statement}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="absolute bottom-2 left-0 max-w-[240px] sm:left-[2%]">
                                <p
                                    className="text-[7px] uppercase tracking-[0.2em]"
                                    style={{ color: settings.muted_text_color }}
                                >
                                    {profile.artist_type || 'Artist'}
                                    {profile.location ? ` / ${profile.location}` : ''}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Selected Work */}
            {settings.show_work && projects.length > 0 && (
                <section
                    id="work"
                    className="relative border-t px-5 py-20 sm:px-8 sm:py-28"
                    style={{ borderColor: settings.border_color }}
                >
                    <div className="mx-auto max-w-[1100px]">
                        <div className="relative mb-12">
                            <p
                                className="text-[7px] uppercase tracking-[0.3em]"
                                style={{ color: settings.accent_color }}
                            >
                                01 / Selected Work
                            </p>

                            <h2
                                className="canvas-hand mt-3 text-[clamp(2.7rem,8vw,5.8rem)] font-normal uppercase leading-[0.8] tracking-[-0.06em]"
                                style={{ color: settings.text_color }}
                            >
                                {settings.work_label || 'Selected Work'}
                            </h2>

                            <Scribble className="-right-2 top-1/2" />
                        </div>

                        {settings.work_description && (
                            <p
                                className="mb-12 max-w-sm text-xs leading-6 sm:text-sm"
                                style={{ color: settings.muted_text_color }}
                            >
                                {settings.work_description}
                            </p>
                        )}

                        <div className="canvas-collage relative grid grid-cols-2 items-start gap-x-5 gap-y-10 sm:grid-cols-12 sm:gap-x-7 sm:gap-y-16">
                            {collageProjects.map((project, index) => {
                                const placements = [
                                    'sm:col-span-7 sm:col-start-1',
                                    'sm:col-span-5 sm:col-start-8 sm:mt-16',
                                    'sm:col-span-5 sm:col-start-2 sm:-mt-4',
                                    'sm:col-span-6 sm:col-start-7 sm:mt-10',
                                    'sm:col-span-5 sm:col-start-1 sm:mt-8',
                                    'sm:col-span-5 sm:col-start-7 sm:-mt-12',
                                ];

                                return (
                                    <div
                                        key={project.id}
                                        className={`canvas-project col-span-1 ${placements[index] ?? 'sm:col-span-5'}`}
                                    >
                                        <a
                                            href={`/@${profile.username}/project/${project.slug}`}
                                            className="block"
                                            aria-label={`View ${project.title}`}
                                        >
                                            <div className="relative">
                                                <ProjectPhoto
                                                    project={project}
                                                    index={index}
                                                    className="w-full"
                                                />

                                                <div className="pointer-events-none absolute -bottom-7 right-1 font-[cursive] text-[10px] text-white/70 sm:-bottom-8">
                                                    {String(index + 1).padStart(2, '0')}
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                );
                            })}
                        </div>

                        {projects.length > 6 && (
                            <p
                                className="mt-14 text-center font-[cursive] text-sm"
                                style={{ color: settings.muted_text_color }}
                            >
                                + {projects.length - 6} more pieces
                            </p>
                        )}
                    </div>
                </section>
            )}

            {/* Gallery */}
            {settings.show_gallery && galleryImages.length > 0 && (
                <section
                    id="gallery"
                    className="relative border-t px-5 py-20 sm:px-8 sm:py-28"
                    style={{ borderColor: settings.border_color }}
                >
                    <div className="mx-auto max-w-[1100px]">
                        <div className="relative mb-12">
                            <p
                                className="text-[7px] uppercase tracking-[0.3em]"
                                style={{ color: settings.accent_color }}
                            >
                                02 / Gallery
                            </p>

                            <h2
                                className="canvas-hand mt-3 text-[clamp(2.7rem,8vw,5.8rem)] font-normal uppercase leading-[0.8] tracking-[-0.06em]"
                                style={{ color: settings.text_color }}
                            >
                                {settings.gallery_label || 'Gallery'}
                            </h2>

                            {settings.gallery_description && (
                                <p
                                    className="mt-7 max-w-xl text-xs leading-6 sm:text-sm"
                                    style={{ color: settings.muted_text_color }}
                                >
                                    {settings.gallery_description}
                                </p>
                            )}

                            <Scribble className="-right-2 top-1/2" />
                        </div>

                        <div
                            className="canvas-gallery"
                            data-desktop-display={desktopGallery.display}
                            data-tablet-display={tabletGallery.display}
                            data-mobile-display={mobileGallery.display}
                            style={
                                {
                                    '--gallery-desktop-columns': Math.max(
                                        1,
                                        desktopGallery.columns,
                                    ),
                                    '--gallery-tablet-columns': Math.max(
                                        1,
                                        tabletGallery.columns,
                                    ),
                                    '--gallery-mobile-columns': Math.max(
                                        1,
                                        mobileGallery.columns,
                                    ),
                                } as CSSProperties
                            }
                        >
                            <div
                                className="canvas-gallery-grid"
                                data-gallery-layout="grid"
                            >
                                {galleryImages.map((image, index) => {
                                    const imageUrl = getAssetUrl(image.image);

                                    if (!imageUrl) {
                                        return null;
                                    }

                                    const aspectRatio =
                                        getGalleryAspectRatio(
                                            desktopGallery.image_aspect,
                                        );

                                    return (
                                        <figure
                                            key={image.id ?? `${image.sort_order}-${index}`}
                                            className="canvas-gallery-item group relative"
                                        >
                                            <button
                                                type="button"
                                                className="block w-full cursor-zoom-in text-left"
                                                onClick={() =>
                                                    settings.gallery_enable_lightbox &&
                                                    openLightbox(index)
                                                }
                                                aria-label={
                                                    settings.gallery_enable_lightbox
                                                        ? `View ${image.alt_text || image.title || `Gallery image ${index + 1}`}`
                                                        : undefined
                                                }
                                            >
                                                <div
                                                    className="canvas-gallery-item-image relative border border-white/15 bg-[#d9d3c5] p-1.5 shadow-[5px_7px_0_rgba(0,0,0,0.16)] transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-[-0.5deg]"
                                                    style={{ aspectRatio }}
                                                >
                                                    <img
                                                        src={imageUrl}
                                                        alt={
                                                            image.alt_text ||
                                                            image.title ||
                                                            `Gallery image ${index + 1}`
                                                        }
                                                        className="h-full w-full object-cover"
                                                        loading="lazy"
                                                    />

                                                    <span className="pointer-events-none absolute inset-1.5 border border-white/20" />
                                                </div>
                                            </button>

                                            {(settings.gallery_show_titles &&
                                                image.title) ||
                                            (settings.gallery_show_captions &&
                                                image.caption) ? (
                                                <figcaption className="px-1 pt-3">
                                                    {settings.gallery_show_titles &&
                                                        image.title && (
                                                            <p
                                                                className="font-[cursive] text-[11px] leading-4"
                                                                style={{
                                                                    color: settings.text_color,
                                                                }}
                                                            >
                                                                {image.title}
                                                            </p>
                                                        )}

                                                    {settings.gallery_show_captions &&
                                                        image.caption && (
                                                            <p
                                                                className="mt-1 text-[9px] leading-4"
                                                                style={{
                                                                    color: settings.muted_text_color,
                                                                }}
                                                            >
                                                                {image.caption}
                                                            </p>
                                                        )}
                                                </figcaption>
                                            ) : null}
                                        </figure>
                                    );
                                })}
                            </div>

                            <div
                                className="canvas-gallery-masonry hidden"
                                data-gallery-layout="masonry"
                            >
                                {galleryImages.map((image, index) => {
                                    const imageUrl = getAssetUrl(image.image);

                                    if (!imageUrl) {
                                        return null;
                                    }

                                    return (
                                        <figure
                                            key={`masonry-${image.id ?? `${image.sort_order}-${index}`}`}
                                            className="canvas-gallery-item group"
                                        >
                                            <button
                                                type="button"
                                                className="block w-full cursor-zoom-in text-left"
                                                onClick={() =>
                                                    settings.gallery_enable_lightbox &&
                                                    openLightbox(index)
                                                }
                                            >
                                                <div
                                                    className="canvas-gallery-item-image relative aspect-[4/3] overflow-hidden border border-white/15 bg-[#d9d3c5] p-1.5 shadow-[5px_7px_0_rgba(0,0,0,0.16)] transition-transform duration-500 group-hover:-translate-y-1"
                                                >
                                                    <img
                                                        src={imageUrl}
                                                        alt={
                                                            image.alt_text ||
                                                            image.title ||
                                                            `Gallery image ${index + 1}`
                                                        }
                                                        className="h-auto w-full object-cover"
                                                        loading="lazy"
                                                    />
                                                </div>
                                            </button>

                                            {(settings.gallery_show_titles &&
                                                image.title) ||
                                            (settings.gallery_show_captions &&
                                                image.caption) ? (
                                                <figcaption className="px-1 pt-3">
                                                    {settings.gallery_show_titles &&
                                                        image.title && (
                                                            <p
                                                                className="font-[cursive] text-[11px]"
                                                                style={{
                                                                    color: settings.text_color,
                                                                }}
                                                            >
                                                                {image.title}
                                                            </p>
                                                        )}
                                                    {settings.gallery_show_captions &&
                                                        image.caption && (
                                                            <p
                                                                className="mt-1 text-[9px] leading-4"
                                                                style={{
                                                                    color: settings.muted_text_color,
                                                                }}
                                                            >
                                                                {image.caption}
                                                            </p>
                                                        )}
                                                </figcaption>
                                            ) : null}
                                        </figure>
                                    );
                                })}
                            </div>

                            <div
                                className="canvas-gallery-editorial hidden"
                                data-gallery-layout="editorial"
                            >
                                {galleryImages.map((image, index) => {
                                    const imageUrl = getAssetUrl(image.image);

                                    if (!imageUrl) {
                                        return null;
                                    }

                                    return (
                                        <figure
                                            key={`editorial-${image.id ?? `${image.sort_order}-${index}`}`}
                                            className="canvas-gallery-item group"
                                        >
                                            <button
                                                type="button"
                                                className="block w-full cursor-zoom-in text-left"
                                                onClick={() =>
                                                    settings.gallery_enable_lightbox &&
                                                    openLightbox(index)
                                                }
                                            >
                                                <div className="canvas-gallery-item-image relative border border-white/15 bg-[#d9d3c5] p-1.5 shadow-[5px_7px_0_rgba(0,0,0,0.16)] transition-transform duration-500 group-hover:-translate-y-1">
                                                    <img
                                                        src={imageUrl}
                                                        alt={
                                                            image.alt_text ||
                                                            image.title ||
                                                            `Gallery image ${index + 1}`
                                                        }
                                                        className="block h-full w-full object-cover"
                                                        loading="lazy"
                                                    />
                                                </div>
                                            </button>

                                            {(settings.gallery_show_titles &&
                                                image.title) ||
                                            (settings.gallery_show_captions &&
                                                image.caption) ? (
                                                <figcaption className="px-1 pt-3">
                                                    {settings.gallery_show_titles &&
                                                        image.title && (
                                                            <p
                                                                className="font-[cursive] text-[11px]"
                                                                style={{
                                                                    color: settings.text_color,
                                                                }}
                                                            >
                                                                {image.title}
                                                            </p>
                                                        )}
                                                    {settings.gallery_show_captions &&
                                                        image.caption && (
                                                            <p
                                                                className="mt-1 text-[9px] leading-4"
                                                                style={{
                                                                    color: settings.muted_text_color,
                                                                }}
                                                            >
                                                                {image.caption}
                                                            </p>
                                                        )}
                                                </figcaption>
                                            ) : null}
                                        </figure>
                                    );
                                })}
                            </div>

                            <div
                                className="canvas-gallery-freeform hidden"
                                data-gallery-layout="freeform"
                            >
                                {galleryImages.map((image, index) => {
                                    const imageUrl = getAssetUrl(image.image);

                                    if (!imageUrl) {
                                        return null;
                                    }

                                    return (
                                        <figure
                                            key={`freeform-${image.id ?? `${image.sort_order}-${index}`}`}
                                            className="canvas-gallery-item group"
                                        >
                                            <button
                                                type="button"
                                                className="block w-full cursor-zoom-in text-left"
                                                onClick={() =>
                                                    settings.gallery_enable_lightbox &&
                                                    openLightbox(index)
                                                }
                                            >
                                                <div className="canvas-gallery-item-image relative border border-white/15 bg-[#d9d3c5] p-1.5 shadow-[5px_7px_0_rgba(0,0,0,0.16)] transition-transform duration-500">
                                                    <img
                                                        src={imageUrl}
                                                        alt={
                                                            image.alt_text ||
                                                            image.title ||
                                                            `Gallery image ${index + 1}`
                                                        }
                                                        className="h-auto w-full object-cover"
                                                        loading="lazy"
                                                    />
                                                </div>
                                            </button>

                                            {(settings.gallery_show_titles &&
                                                image.title) ||
                                            (settings.gallery_show_captions &&
                                                image.caption) ? (
                                                <figcaption className="px-1 pt-3">
                                                    {settings.gallery_show_titles &&
                                                        image.title && (
                                                            <p
                                                                className="font-[cursive] text-[11px]"
                                                                style={{
                                                                    color: settings.text_color,
                                                                }}
                                                            >
                                                                {image.title}
                                                            </p>
                                                        )}
                                                    {settings.gallery_show_captions &&
                                                        image.caption && (
                                                            <p
                                                                className="mt-1 text-[9px] leading-4"
                                                                style={{
                                                                    color: settings.muted_text_color,
                                                                }}
                                                            >
                                                                {image.caption}
                                                            </p>
                                                        )}
                                                </figcaption>
                                            ) : null}
                                        </figure>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Music */}
            {settings.show_music && visibleReleases.length > 0 && (
                <section
                    id="music"
                    className="relative border-t px-5 py-20 sm:px-8 sm:py-28"
                    style={{ borderColor: settings.border_color }}
                >
                    <div className="mx-auto max-w-[1100px]">
                        <div className="relative mb-12 flex items-end justify-between gap-8">
                            <div>
                                <p
                                    className="text-[7px] uppercase tracking-[0.3em]"
                                    style={{ color: settings.accent_color }}
                                >
                                    03 / Sound
                                </p>

                                <h2
                                    className="canvas-hand mt-3 text-[clamp(2.7rem,8vw,5.8rem)] font-normal uppercase leading-[0.8] tracking-[-0.06em]"
                                    style={{ color: settings.text_color }}
                                >
                                    {settings.music_label || 'Music'}
                                </h2>
                            </div>

                            <Scribble className="bottom-0 right-3" />
                        </div>

                        <div className="relative">
                            <div className="mb-8 max-w-md font-[cursive] text-sm leading-5 text-white/75 sm:text-base">
                                sounds, releases,
                                <br />
                                things made to be heard.
                            </div>

                            <div className="grid grid-cols-3 gap-4 sm:gap-7">
                                {visibleReleases.slice(0, 3).map((release, index) => (
                                    <ReleaseCard
                                        key={release.id}
                                        release={release}
                                        index={index}
                                    />
                                ))}
                            </div>

                            {featuredRelease && visibleReleases.length > 3 && (
                                <div className="mt-12 flex items-center justify-between border-t pt-5" style={{ borderColor: settings.border_color }}>
                                    <div>
                                        <p
                                            className="text-[7px] uppercase tracking-[0.2em]"
                                            style={{ color: settings.muted_text_color }}
                                        >
                                            Featured
                                        </p>
                                        <p
                                            className="mt-1 text-sm font-medium"
                                            style={{ color: settings.text_color }}
                                        >
                                            {featuredRelease.title}
                                        </p>
                                    </div>

                                    {getPrimaryStreamingLink(featuredRelease) && (
                                        <a
                                            href={getPrimaryStreamingLink(featuredRelease)?.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="font-[cursive] text-sm underline decoration-dotted underline-offset-4"
                                            style={{ color: settings.text_color }}
                                        >
                                            Listen ↗
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* About */}
            {settings.show_about && (
                <section
                    id="about"
                    className="relative border-t px-5 py-20 sm:px-8 sm:py-28"
                    style={{ borderColor: settings.border_color }}
                >
                    <div className="mx-auto grid max-w-[1100px] gap-10 sm:grid-cols-[0.4fr_0.6fr] sm:gap-16 lg:grid-cols-[0.35fr_0.65fr]">
                        <div>
                            <p
                                className="text-[7px] uppercase tracking-[0.3em]"
                                style={{ color: settings.accent_color }}
                            >
                                04 / About
                            </p>

                            {profileImage ? (
                                <div className="relative mt-8 w-full max-w-[280px] rotate-[-3deg] sm:mt-12 sm:max-w-[320px]">
                                    <Tape className="-top-2 left-1/2 -translate-x-1/2 rotate-2" />

                                    <div className="bg-[#d9d3c5] p-2 shadow-[7px_9px_0_rgba(0,0,0,0.18)]">
                                        <div className="relative aspect-square overflow-hidden border border-black/15 bg-black/10">
                                            <AvatarImage
                                                src={profileImage}
                                                alt={profile.display_name}
                                                className="select-none object-cover"
                                                zoom={Number(profile.avatar_zoom ?? 1)}
                                                positionX={Number(profile.avatar_position_x ?? 50)}
                                                positionY={Number(profile.avatar_position_y ?? 50)}
                                            />
                                        </div>

                                        <p className="canvas-hand mt-3 px-1 pb-1 text-[12px] text-black/70">
                                            {profile.display_name}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    className="mt-8 flex aspect-square w-full max-w-[280px] items-center justify-center border border-white/15 bg-white/5 text-center text-[8px] uppercase tracking-[0.2em] sm:mt-12"
                                    style={{ color: settings.muted_text_color }}
                                >
                                    No profile image
                                </div>
                            )}
                        </div>

                        <div>
                            <h2
                                className="canvas-hand text-[clamp(2.8rem,7vw,5.5rem)] font-normal uppercase leading-[0.82] tracking-[-0.06em]"
                                style={{ color: settings.text_color }}
                            >
                                {settings.about_label || 'About'}
                            </h2>

                            {(profile.about_me || profile.bio) && (
                                <p
                                    className="mt-8 max-w-2xl whitespace-pre-line text-sm leading-7 sm:text-base sm:leading-8"
                                    style={{ color: settings.muted_text_color }}
                                >
                                    {profile.about_me || profile.bio}
                                </p>
                            )}

                            {(profile.artist_type || profile.location) && (
                                <p
                                    className="mt-8 text-[8px] uppercase tracking-[0.2em]"
                                    style={{ color: settings.muted_text_color }}
                                >
                                    {profile.artist_type || 'Artist'}
                                    {profile.location
                                        ? ` / ${profile.location}`
                                        : ''}
                                </p>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* Artist Message */}
            {settings.show_artist_message && (
                <section
                    id="artist-message"
                    className="relative border-t px-5 py-20 sm:px-8 sm:py-28"
                    style={{ borderColor: settings.border_color }}
                >
                    <div className="mx-auto max-w-[1100px]">
                        <div className="relative mx-auto max-w-3xl rotate-[-1deg]">
                            <Tape className="-top-3 left-1/2 -translate-x-1/2 rotate-2" />

                            <div className="canvas-torn bg-[#e2dccd] px-6 py-8 text-black shadow-[7px_9px_0_rgba(0,0,0,0.18)] sm:px-10 sm:py-10">
                                <p className="text-[7px] uppercase tracking-[0.3em] text-black/50">
                                    05 / Artist Message
                                </p>

                                <h2 className="canvas-hand mt-4 text-[clamp(2.5rem,7vw,5rem)] font-normal uppercase leading-[0.82] tracking-[-0.06em]">
                                    {settings.artist_message_label || 'A note from the artist.'}
                                </h2>

                                <div className="mt-7 max-w-2xl whitespace-pre-line text-sm leading-7 text-black/70 sm:text-base sm:leading-8">
                                    {settings.artist_message?.trim() ||
                                        'Create with intention. Share your story with the world.'}
                                </div>

                                <Scribble className="-bottom-7 right-4 text-black/50" />
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Footer */}
            {settings.show_footer && (
                <footer
                    id="footer"
                    className="relative border-t px-5 py-12 sm:px-8 sm:py-16"
                    style={{ borderColor: settings.border_color }}
                >
                    <div className="mx-auto max-w-[1100px]">
                        <div className="grid gap-10 sm:grid-cols-[1fr_auto] sm:items-end sm:gap-12">
                            <div className="min-w-0">
                                {footerLogo && (
                                    <div className="mb-7">
                                        <img
                                            src={footerLogo}
                                            alt={`${profile.display_name} footer logo`}
                                            className="h-auto max-h-20 w-auto max-w-[220px] object-contain object-left"
                                            loading="lazy"
                                        />
                                    </div>
                                )}

                                <p
                                    className="canvas-hand text-lg sm:text-xl"
                                    style={{ color: settings.text_color }}
                                >
                                    {settings.footer_label || profile.display_name}
                                </p>

                                {settings.footer_message && (
                                    <p
                                        className="mt-2 max-w-sm text-xs leading-5 sm:text-sm"
                                        style={{ color: settings.muted_text_color }}
                                    >
                                        {settings.footer_message}
                                    </p>
                                )}
                            </div>

                            <div
                                className="text-[7px] uppercase tracking-[0.2em] sm:text-right"
                                style={{ color: settings.muted_text_color }}
                            >
                                <p>
                                    {settings.copyright_text ||
                                        `© ${new Date().getFullYear()} ${profile.display_name}`}
                                </p>

                                {settings.show_powered_by_lira && (
                                    <a
                                        href="/"
                                        className="mt-3 inline-flex items-center gap-2 transition-opacity hover:opacity-70"
                                        aria-label="Powered by LIRA"
                                    >
                                        <span>Powered by</span>
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
                </footer>
            )}

            {lightboxImage && settings.gallery_enable_lightbox && (
                <div
                    className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 p-5 backdrop-blur-sm sm:p-8"
                    role="dialog"
                    aria-modal="true"
                    aria-label={lightboxImage.title || 'Gallery image'}
                    onClick={closeLightbox}
                >
                    <button
                        type="button"
                        className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center border border-white/25 bg-black/40 text-lg text-white transition hover:bg-white/10 sm:right-8 sm:top-8"
                        onClick={closeLightbox}
                        aria-label="Close gallery image"
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
                                className="absolute left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-white/25 bg-black/40 text-lg text-white transition hover:bg-white/10 sm:left-8"
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
                                className="absolute right-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-white/25 bg-black/40 text-lg text-white transition hover:bg-white/10 sm:right-8"
                                aria-label="Next image"
                            >
                                →
                            </button>
                        </>
                    )}

                    <div
                        className="relative max-h-[90vh] max-w-[92vw]"
                        onClick={(event) => event.stopPropagation()}
                    >
                        {getAssetUrl(lightboxImage.image) && (
                            <img
                                src={getAssetUrl(lightboxImage.image) ?? undefined}
                                alt={
                                    lightboxImage.alt_text ||
                                    lightboxImage.title ||
                                    'Gallery image'
                                }
                                className="max-h-[82vh] max-w-[92vw] object-contain"
                            />
                        )}

                        {(lightboxImage.title || lightboxImage.caption) && (
                            <div className="mt-3">
                                {lightboxImage.title && (
                                    <p
                                        className="font-[cursive] text-sm"
                                        style={{ color: settings.text_color }}
                                    >
                                        {lightboxImage.title}
                                    </p>
                                )}

                                {lightboxImage.caption && (
                                    <p
                                        className="mt-1 max-w-2xl text-xs leading-5"
                                        style={{ color: settings.muted_text_color }}
                                    >
                                        {lightboxImage.caption}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </main>
    );
}
