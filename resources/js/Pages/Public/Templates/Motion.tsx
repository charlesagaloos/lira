import { useEffect, useState, type CSSProperties } from 'react';

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

    return `/storage/${path.replace(/^\/+/, '')}`;
}

function getProjectUrl(
    profile: PortfolioProps['profile'],
    project: PortfolioProject,
): string {
    return `/@${profile.username}/project/${project.slug}`;
}

function getPrimaryStreamingLink(
    release: PortfolioRelease,
): { label: string; url: string } | null {
    const links = [
        {
            label: 'Spotify',
            url: release.spotify_url,
        },
        {
            label: 'Apple Music',
            url: release.apple_music_url,
        },
        {
            label: 'YouTube',
            url: release.youtube_url,
        },
        {
            label: 'SoundCloud',
            url: release.soundcloud_url,
        },
        {
            label: 'Bandcamp',
            url: release.bandcamp_url,
        },
    ];

    return (
        links.find(
            (link) =>
                typeof link.url === 'string' &&
                link.url.trim().length > 0,
        ) ?? null
    ) as { label: string; url: string } | null;
}

function formatReleaseDate(
    date: string | null | undefined,
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

function isNavigationItemAvailable(
    item: NavigationItem,
    profile: PortfolioProps['profile'],
): boolean {
    switch (item.destination) {
        case 'home':
            return true;

        case 'work':
            return (
                profile.portfolio_settings.show_work &&
                profile.projects.length > 0
            );

        case 'music':
            return (
                profile.portfolio_settings.show_music &&
                profile.releases.length > 0
            );

        case 'about':
            return profile.portfolio_settings.show_about;

        case 'artist_message':
            return (
                profile.portfolio_settings.show_artist_message &&
                Boolean(
                    profile.portfolio_settings.artist_message?.trim(),
                )
            );

        case 'gallery':
            return (
                profile.portfolio_settings.show_gallery &&
                Boolean(
                    (
                        profile.portfolio_settings as typeof profile.portfolio_settings & {
                            gallery_images?: GalleryImage[];
                        }
                    ).gallery_images?.length,
                )
            );

        case 'footer':
            return profile.portfolio_settings.show_footer;

        case 'external':
            return Boolean(item.url);

        case 'contact':
            return false;

        default:
            return false;
    }
}

function MotionProjectRow({
    project,
    index,
    profile,
}: {
    project: PortfolioProject;
    index: number;
    profile: PortfolioProps['profile'];
}) {
    const image = getAssetUrl(project.thumbnail);
    const number = String(index + 1).padStart(2, '0');

    return (
        <a
            href={getProjectUrl(profile, project)}
            className="motion-project-row group block border-t"
            style={{
                borderColor: profile.portfolio_settings.border_color,
            }}
        >
            <div className="grid gap-6 py-8 md:grid-cols-[72px_minmax(260px,0.9fr)_1fr_auto] md:items-center md:gap-8 md:py-10 lg:grid-cols-[92px_minmax(360px,0.95fr)_1fr_auto]">
                <div className="flex items-start justify-between md:block">
                    <span
                        className="motion-number block text-[clamp(2.8rem,7vw,6rem)] font-light leading-none tracking-[-0.08em]"
                        style={{
                            color: profile.portfolio_settings.text_color,
                        }}
                    >
                        {number}
                    </span>

                    <span
                        className="mt-2 hidden text-[7px] uppercase tracking-[0.28em] md:block"
                        style={{
                            color: profile.portfolio_settings.muted_text_color,
                        }}
                    >
                        Project
                    </span>
                </div>

                <div className="relative aspect-[16/10] overflow-hidden bg-black/20">
                    {image ? (
                        <img
                            src={image}
                            alt={project.title}
                            className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.045]"
                            style={{
                                objectPosition: `${project.thumbnail_position_x ?? 50}% ${project.thumbnail_position_y ?? 50}%`,
                            }}
                            draggable={false}
                        />
                    ) : (
                        <div
                            className="flex h-full items-center justify-center text-[8px] uppercase tracking-[0.3em]"
                            style={{
                                backgroundColor:
                                    profile.portfolio_settings.surface_color,
                                color:
                                    profile.portfolio_settings.muted_text_color,
                            }}
                        >
                            No image
                        </div>
                    )}

                    <span
                        className="absolute bottom-3 left-3 text-[7px] uppercase tracking-[0.24em]"
                        style={{
                            color: '#ffffff',
                            textShadow: '0 1px 10px rgba(0,0,0,.8)',
                        }}
                    >
                        {project.project_type || 'Selected work'}
                    </span>
                </div>

                <div className="min-w-0">
                    <div className="flex items-start justify-between gap-5">
                        <div>
                            <p
                                className="text-[clamp(1.45rem,3vw,2.6rem)] font-light leading-[0.95] tracking-[-0.045em]"
                                style={{
                                    color:
                                        profile.portfolio_settings.text_color,
                                }}
                            >
                                {project.title}
                            </p>

                            {project.description && (
                                <p
                                    className="mt-4 max-w-md text-xs leading-6"
                                    style={{
                                        color:
                                            profile.portfolio_settings
                                                .muted_text_color,
                                    }}
                                >
                                    {project.description}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[7px] uppercase tracking-[0.22em]">
                        <span
                            style={{
                                color:
                                    profile.portfolio_settings.muted_text_color,
                            }}
                        >
                            {project.project_type || 'Work'}
                        </span>

                        <span
                            style={{
                                color:
                                    profile.portfolio_settings.muted_text_color,
                            }}
                        >
                            {project.url ? 'External link' : 'View project'}
                        </span>
                    </div>
                </div>

                <span
                    className="motion-arrow flex h-10 w-10 shrink-0 items-center justify-center border text-sm transition duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                    style={{
                        borderColor:
                            profile.portfolio_settings.border_color,
                        color: profile.portfolio_settings.text_color,
                    }}
                    aria-hidden="true"
                >
                    ↗
                </span>
            </div>
        </a>
    );
}

function MotionReleaseCard({
    release,
    profile,
}: {
    release: PortfolioRelease;
    profile: PortfolioProps['profile'];
}) {
    const image = getAssetUrl(release.artwork);
    const streamingLink = getPrimaryStreamingLink(release);

    return (
        <article className="group">
            <div className="relative aspect-square overflow-hidden">
                {image ? (
                    <img
                        src={image}
                        alt={release.title}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                        draggable={false}
                    />
                ) : (
                    <div
                        className="flex h-full items-center justify-center text-[8px] uppercase tracking-[0.3em]"
                        style={{
                            backgroundColor:
                                profile.portfolio_settings.surface_color,
                            color:
                                profile.portfolio_settings.muted_text_color,
                        }}
                    >
                        {release.release_type || 'Release'}
                    </div>
                )}

                {streamingLink && (
                    <a
                        href={streamingLink.url}
                        target="_blank"
                        rel="noreferrer"
                        className="absolute inset-0 flex items-end justify-between bg-black/0 p-4 transition duration-300 group-hover:bg-black/25"
                        aria-label={`Listen to ${release.title} on ${streamingLink.label}`}
                    >
                        <span
                            className="text-[7px] uppercase tracking-[0.25em] opacity-0 transition group-hover:opacity-100"
                            style={{ color: '#ffffff' }}
                        >
                            {streamingLink.label}
                        </span>

                        <span
                            className="flex h-9 w-9 items-center justify-center border border-white/70 bg-black/45 text-white backdrop-blur-sm"
                            aria-hidden="true"
                        >
                            ↗
                        </span>
                    </a>
                )}
            </div>

            <div className="mt-4 border-t pt-3" style={{ borderColor: profile.portfolio_settings.border_color }}>
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p
                            className="text-sm"
                            style={{
                                color:
                                    profile.portfolio_settings.text_color,
                            }}
                        >
                            {release.title}
                        </p>

                        <p
                            className="mt-1 text-[7px] uppercase tracking-[0.2em]"
                            style={{
                                color:
                                    profile.portfolio_settings
                                        .muted_text_color,
                            }}
                        >
                            {release.release_type || 'Release'}
                            {release.release_date
                                ? ` / ${formatReleaseDate(release.release_date)}`
                                : ''}
                        </p>
                    </div>
                </div>
            </div>
        </article>
    );
}

export default function MotionTemplate({
    profile,
}: PortfolioProps) {
    const settings = profile.portfolio_settings;

    const projects = profile.projects ?? [];
    const releases = profile.releases ?? [];

    const navigationSettings =
        settings as typeof settings & NavigationSettings;

    const savedNavigationItems = (
        navigationSettings.navigation_items ?? []
    )
        .filter(
            (item) =>
                item.is_visible &&
                isNavigationItemAvailable(item, profile),
        )
        .sort((a, b) => a.sort_order - b.sort_order);

    const navigationItems: NavigationItem[] =
        savedNavigationItems.length > 0
            ? savedNavigationItems
            : [
                  {
                      id: -1,
                      label: 'Work',
                      destination: 'work',
                      url: null,
                      sort_order: 0,
                      is_visible: true,
                  },
                  ...(settings.show_music && releases.length > 0
                      ? [
                            {
                                id: -2,
                                label: 'Music',
                                destination: 'music',
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
              ];

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [lightboxIndex, setLightboxIndex] =
        useState<number | null>(null);

    const visibleReleases =
        settings.music_release_display === 'latest'
            ? releases.slice(
                  0,
                  Math.max(1, settings.music_release_limit),
              )
            : releases;

    const galleryImages = (
        (settings as typeof settings & {
            gallery_images?: GalleryImage[];
        }).gallery_images ?? []
    ).filter((image) => Boolean(image.image));

    const galleryResponsive =
        (settings as typeof settings & {
            gallery_responsive?: {
                desktop?: {
                    display?: string;
                    columns?: number;
                    image_aspect?: string;
                };
                tablet?: {
                    display?: string;
                    columns?: number;
                    image_aspect?: string;
                };
                mobile?: {
                    display?: string;
                    columns?: number;
                    image_aspect?: string;
                };
            } | null;
        }).gallery_responsive ?? null;

    const normalizeGalleryDisplay = (
        value: unknown,
        fallback: 'grid' | 'masonry' | 'editorial' | 'freeform',
    ): 'grid' | 'masonry' | 'editorial' | 'freeform' => {
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

    const normalizeGalleryAspect = (
        value: unknown,
        fallback:
            | 'original'
            | 'square'
            | 'portrait'
            | 'landscape',
    ):
        | 'original'
        | 'square'
        | 'portrait'
        | 'landscape' => {
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

    const galleryDesktop = {
        display: normalizeGalleryDisplay(
            galleryResponsive?.desktop?.display,
            normalizeGalleryDisplay(
                settings.gallery_display,
                'grid',
            ),
        ),
        columns: normalizeGalleryColumns(
            galleryResponsive?.desktop?.columns,
            settings.gallery_columns ?? 3,
            2,
            5,
        ),
        imageAspect: normalizeGalleryAspect(
            galleryResponsive?.desktop?.image_aspect,
            normalizeGalleryAspect(
                settings.gallery_image_aspect,
                'original',
            ),
        ),
    };

    const galleryTablet = {
        display: normalizeGalleryDisplay(
            galleryResponsive?.tablet?.display,
            galleryDesktop.display,
        ),
        columns: normalizeGalleryColumns(
            galleryResponsive?.tablet?.columns,
            Math.min(galleryDesktop.columns, 3),
            2,
            4,
        ),
        imageAspect: normalizeGalleryAspect(
            galleryResponsive?.tablet?.image_aspect,
            galleryDesktop.imageAspect,
        ),
    };

    const galleryMobile = {
        display: normalizeGalleryDisplay(
            galleryResponsive?.mobile?.display,
            galleryDesktop.display,
        ),
        columns: normalizeGalleryColumns(
            galleryResponsive?.mobile?.columns,
            1,
            1,
            2,
        ),
        imageAspect: normalizeGalleryAspect(
            galleryResponsive?.mobile?.image_aspect,
            galleryDesktop.imageAspect,
        ),
    };

    const coverImage = getAssetUrl(
        settings.cover_image ?? profile.cover_image,
    );
    const profileImage = getAssetUrl(profile.avatar);
    const lightboxImage =
        lightboxIndex !== null
            ? galleryImages[lightboxIndex] ?? null
            : null;

    const heroStatement =
        settings.hero_statement?.trim() ||
        profile.bio?.trim() ||
        'Creating work that moves.';

    const heroWords = heroStatement
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 12);

    const heroProjects = projects.slice(0, 3);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 40);
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll, {
            passive: true,
        });

        return () =>
            window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setMobileMenuOpen(false);
                setLightboxIndex(null);
            }

            if (
                lightboxIndex !== null &&
                galleryImages.length > 1
            ) {
                if (event.key === 'ArrowLeft') {
                    setLightboxIndex((current) =>
                        current === null
                            ? null
                            : current === 0
                              ? galleryImages.length - 1
                              : current - 1,
                    );
                }

                if (event.key === 'ArrowRight') {
                    setLightboxIndex((current) =>
                        current === null
                            ? null
                            : current === galleryImages.length - 1
                              ? 0
                              : current + 1,
                    );
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () =>
            window.removeEventListener(
                'keydown',
                handleKeyDown,
            );
    }, [lightboxIndex, galleryImages.length]);

    function getNavigationHref(item: NavigationItem): string {
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
    }

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

    const pageStyle = {
        backgroundColor: settings.background_color,
        color: settings.text_color,
        '--motion-primary': settings.primary_color,
        '--motion-accent': settings.accent_color,
        '--motion-hover': settings.hover_color,
        '--motion-surface': settings.surface_color,
        '--motion-muted': settings.muted_text_color,
        '--motion-border': settings.border_color,
    } as CSSProperties;

    return (
        <main
            id="top"
            style={pageStyle}
            className="motion-template min-h-screen overflow-x-hidden"
        >
            <style>{`
                .motion-template {
                    --motion-grid: rgba(255,255,255,.045);
                }

                .motion-template::selection {
                    background: var(--motion-accent);
                    color: var(--motion-text, #050607);
                }

                .motion-nav {
                    transition:
                        background-color 350ms ease,
                        border-color 350ms ease,
                        backdrop-filter 350ms ease,
                        box-shadow 350ms ease;
                }

                .motion-marquee {
                    animation: motion-marquee 22s linear infinite;
                }

                .motion-reveal {
                    animation: motion-reveal 900ms cubic-bezier(.2,.75,.2,1) both;
                }

                .motion-hero-image {
                    animation: motion-hero-image 1400ms cubic-bezier(.2,.75,.2,1) both;
                }

                .motion-hero-copy {
                    animation: motion-hero-copy 1000ms cubic-bezier(.2,.75,.2,1) 120ms both;
                }

                .motion-work-card {
                    transition:
                        transform 500ms cubic-bezier(.2,.75,.2,1),
                        opacity 350ms ease;
                }

                .motion-work-card:hover {
                    transform: translateY(-5px);
                }

                .motion-work-card:hover img {
                    transform: scale(1.035);
                }

                .motion-work-card img {
                    transition: transform 800ms cubic-bezier(.2,.75,.2,1);
                }

                .motion-about-image {
                    transition:
                        transform 700ms cubic-bezier(.2,.75,.2,1),
                        filter 700ms ease;
                }

                .motion-about-image:hover {
                    transform: scale(1.02) rotate(-0.5deg);
                    filter: contrast(1.08);
                }

                @keyframes motion-hero-image {
                    from {
                        opacity: 0;
                        transform: scale(1.045);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                @keyframes motion-hero-copy {
                    from {
                        opacity: 0;
                        transform: translateY(34px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .motion-project-row {
                    transition:
                        padding-left 450ms cubic-bezier(.2,.75,.2,1),
                        background-color 450ms ease;
                }

                .motion-project-row:hover {
                    padding-left: 12px;
                }

                .motion-number {
                    transition:
                        transform 450ms cubic-bezier(.2,.75,.2,1),
                        color 450ms ease;
                }

                .motion-project-row:hover .motion-number {
                    transform: translateX(6px);
                }

                .motion-arrow {
                    transition:
                        transform 350ms ease,
                        background-color 350ms ease,
                        color 350ms ease;
                }

                .motion-project-row:hover .motion-arrow {
                    background: var(--motion-text, #fff);
                    color: var(--motion-bg, #050607);
                }

                @keyframes motion-marquee {
                    from { transform: translateX(0); }
                    to { transform: translateX(-50%); }
                }

                @keyframes motion-reveal {
                    from {
                        opacity: 0;
                        transform: translateY(28px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                /* Gallery display modes */
                .motion-gallery-layout {
                    display: grid;
                    grid-template-columns: repeat(
                        var(--motion-gallery-desktop-columns),
                        minmax(0, 1fr)
                    );
                    gap: 1rem;
                    align-items: start;
                }

                /* Grid */
                .motion-gallery[data-desktop-display="grid"] .motion-gallery-layout,
                .motion-gallery[data-tablet-display="grid"] .motion-gallery-layout,
                .motion-gallery[data-mobile-display="grid"] .motion-gallery-layout {
                    display: grid;
                }

                .motion-gallery[data-desktop-display="grid"] .motion-gallery-layout {
                    grid-template-columns: repeat(
                        var(--motion-gallery-desktop-columns),
                        minmax(0, 1fr)
                    );
                    gap: 1rem;
                }

                .motion-gallery[data-desktop-display="grid"] .motion-gallery-card {
                    aspect-ratio: 4 / 3;
                }

                .motion-gallery[data-desktop-display="grid"] .motion-gallery-image {
                    height: 100%;
                    object-fit: cover;
                }

                /* Masonry */
                .motion-gallery[data-desktop-display="masonry"] .motion-gallery-layout {
                    display: block;
                    column-count: var(--motion-gallery-desktop-columns);
                    column-gap: 1rem;
                }

                .motion-gallery[data-desktop-display="masonry"] .motion-gallery-card {
                    display: block;
                    width: 100%;
                    height: auto !important;
                    min-height: 0;
                    margin: 0 0 1rem;
                    padding: 0;
                    aspect-ratio: auto !important;
                    break-inside: avoid;
                }

                .motion-gallery[data-desktop-display="masonry"] .motion-gallery-image {
                    display: block;
                    width: 100%;
                    height: auto !important;
                    aspect-ratio: auto !important;
                    object-fit: contain;
                }

                /* Editorial: art-directed magazine grid */
                .motion-gallery[data-desktop-display="editorial"] .motion-gallery-layout {
                    display: grid;
                    grid-template-columns: repeat(12, minmax(0, 1fr));
                    gap: 1.25rem;
                    align-items: start;
                    padding: 0.5rem 0 2.5rem;
                }

                .motion-gallery[data-desktop-display="editorial"] .motion-gallery-card {
                    min-width: 0;
                    position: relative;
                    border-radius: 0;
                    border-width: 0 0 1px;
                    padding-bottom: 0.8rem;
                }

                /* Row 1 */
                .motion-gallery[data-desktop-display="editorial"] .motion-gallery-card:nth-child(6n + 1) {
                    grid-column: 1 / span 7;
                }

                .motion-gallery[data-desktop-display="editorial"] .motion-gallery-card:nth-child(6n + 2) {
                    grid-column: 8 / span 5;
                }

                /* Row 2 */
                .motion-gallery[data-desktop-display="editorial"] .motion-gallery-card:nth-child(6n + 3) {
                    grid-column: 1 / span 5;
                }

                .motion-gallery[data-desktop-display="editorial"] .motion-gallery-card:nth-child(6n + 4) {
                    grid-column: 6 / span 7;
                }

                /* Row 3 */
                .motion-gallery[data-desktop-display="editorial"] .motion-gallery-card:nth-child(6n + 5) {
                    grid-column: 1 / span 4;
                }

                .motion-gallery[data-desktop-display="editorial"] .motion-gallery-card:nth-child(6n + 6) {
                    grid-column: 5 / span 8;
                }

                /* Give each editorial position a deliberate image proportion. */
                .motion-gallery[data-desktop-display="editorial"] .motion-gallery-card:nth-child(6n + 1) {
                    aspect-ratio: 7 / 5;
                }

                .motion-gallery[data-desktop-display="editorial"] .motion-gallery-card:nth-child(6n + 2) {
                    aspect-ratio: 5 / 4;
                }

                .motion-gallery[data-desktop-display="editorial"] .motion-gallery-card:nth-child(6n + 3) {
                    aspect-ratio: 5 / 4;
                }

                .motion-gallery[data-desktop-display="editorial"] .motion-gallery-card:nth-child(6n + 4) {
                    aspect-ratio: 7 / 5;
                }

                .motion-gallery[data-desktop-display="editorial"] .motion-gallery-card:nth-child(6n + 5) {
                    aspect-ratio: 4 / 5;
                }

                .motion-gallery[data-desktop-display="editorial"] .motion-gallery-card:nth-child(6n + 6) {
                    aspect-ratio: 8 / 5;
                }

                .motion-gallery[data-desktop-display="editorial"] .motion-gallery-image {
                    height: 100%;
                    object-fit: cover;
                }

                .motion-gallery[data-desktop-display="editorial"] .motion-gallery-card::before {
                    content: attr(data-gallery-index);
                    display: block;
                    margin-bottom: 0.55rem;
                    font-size: 7px;
                    line-height: 1;
                    letter-spacing: 0.28em;
                    text-transform: uppercase;
                    color: rgba(255,255,255,.45);
                }

                .motion-gallery[data-desktop-display="editorial"] .motion-gallery-card::after {
                    content: '';
                    position: absolute;
                    left: 0;
                    bottom: -1px;
                    width: 24%;
                    height: 1px;
                    background: currentColor;
                    opacity: .65;
                    pointer-events: none;
                }

                @media (min-width: 1024px) {
                    /* Freeform: controlled collage — no image overlap */
                    .motion-gallery[data-desktop-display="freeform"] .motion-gallery-layout {
                        display: grid;
                        grid-template-columns: repeat(4, minmax(0, 1fr));
                        grid-auto-rows: minmax(150px, 12vw);
                        gap: 1rem;
                        align-items: stretch;
                        padding: 1rem 0 4rem;
                    }

                    .motion-gallery[data-desktop-display="freeform"] .motion-gallery-card {
                        min-width: 0;
                        height: 100%;
                        border-radius: 0.9rem;
                        border-color: rgba(255,255,255,.18) !important;
                        box-shadow: 0 20px 60px rgba(0,0,0,.35);
                        transition:
                            transform 500ms cubic-bezier(.2,.75,.2,1),
                            box-shadow 500ms ease;
                    }

                    .motion-gallery[data-desktop-display="freeform"] .motion-gallery-card:nth-child(6n + 1) {
                        grid-column: span 1;
                        grid-row: span 2;
                    }

                    .motion-gallery[data-desktop-display="freeform"] .motion-gallery-card:nth-child(6n + 2) {
                        grid-column: span 2;
                        grid-row: span 2;
                    }

                    .motion-gallery[data-desktop-display="freeform"] .motion-gallery-card:nth-child(6n + 3) {
                        grid-column: span 1;
                        grid-row: span 2;
                    }

                    .motion-gallery[data-desktop-display="freeform"] .motion-gallery-card:nth-child(6n + 4) {
                        grid-column: span 1;
                        grid-row: span 2;
                    }

                    .motion-gallery[data-desktop-display="freeform"] .motion-gallery-card:nth-child(6n + 5) {
                        grid-column: span 2;
                        grid-row: span 2;
                    }

                    .motion-gallery[data-desktop-display="freeform"] .motion-gallery-card:nth-child(6n + 6) {
                        grid-column: span 1;
                        grid-row: span 2;
                    }

                    .motion-gallery[data-desktop-display="freeform"] .motion-gallery-card:hover {
                        z-index: 2;
                        transform: translateY(-5px);
                        box-shadow: 0 30px 80px rgba(0,0,0,.5);
                    }
                }

                .motion-gallery-card {
                    width: 100%;
                    border-radius: 1rem;
                }

                .motion-gallery-image {
                    display: block;
                    width: 100%;
                }

                /* Grid aspect ratios.
                 * Masonry intentionally keeps natural image proportions.
                 */
                .motion-gallery[data-desktop-display="grid"][data-desktop-aspect="square"] .motion-gallery-card {
                    aspect-ratio: 1 / 1;
                }

                .motion-gallery[data-desktop-display="grid"][data-desktop-aspect="portrait"] .motion-gallery-card {
                    aspect-ratio: 4 / 5;
                }

                .motion-gallery[data-desktop-display="grid"][data-desktop-aspect="landscape"] .motion-gallery-card {
                    aspect-ratio: 16 / 10;
                }

                .motion-gallery[data-desktop-display="grid"][data-desktop-aspect="original"] .motion-gallery-card {
                    aspect-ratio: 4 / 3;
                }

                @media (max-width: 1023px) {
                    /* Tablet: the SAME cards change layout; nothing is duplicated. */
                    .motion-gallery[data-tablet-display="grid"] .motion-gallery-layout {
                        display: grid;
                        grid-template-columns: repeat(
                            var(--motion-gallery-tablet-columns),
                            minmax(0, 1fr)
                        );
                        gap: 1rem;
                    }

                    .motion-gallery[data-tablet-display="masonry"] .motion-gallery-layout {
                        display: block;
                        column-count: var(--motion-gallery-tablet-columns);
                        column-gap: 1rem;
                    }

                    .motion-gallery[data-tablet-display="masonry"] .motion-gallery-card {
                        height: auto !important;
                        aspect-ratio: auto !important;
                        margin: 0 0 1rem;
                        break-inside: avoid;
                    }

                    .motion-gallery[data-tablet-display="masonry"] .motion-gallery-image {
                        height: auto !important;
                        aspect-ratio: auto !important;
                        object-fit: contain;
                    }

                    /* Tablet Editorial: compact two-column magazine rhythm */
                    .motion-gallery[data-tablet-display="editorial"] .motion-gallery-layout {
                        display: grid;
                        grid-template-columns: repeat(6, minmax(0, 1fr));
                        gap: 0.9rem;
                        align-items: start;
                        padding: 0.25rem 0 1.5rem;
                    }

                    .motion-gallery[data-tablet-display="editorial"] .motion-gallery-card {
                        min-width: 0;
                        position: relative;
                        border-radius: 0;
                        border-width: 0 0 1px;
                        padding-bottom: .65rem;
                    }

                    .motion-gallery[data-tablet-display="editorial"] .motion-gallery-card:nth-child(4n + 1) {
                        grid-column: 1 / 5;
                        aspect-ratio: 4 / 3;
                    }

                    .motion-gallery[data-tablet-display="editorial"] .motion-gallery-card:nth-child(4n + 2) {
                        grid-column: 5 / 7;
                        aspect-ratio: 2 / 3;
                    }

                    .motion-gallery[data-tablet-display="editorial"] .motion-gallery-card:nth-child(4n + 3) {
                        grid-column: 1 / 4;
                        aspect-ratio: 3 / 4;
                    }

                    .motion-gallery[data-tablet-display="editorial"] .motion-gallery-card:nth-child(4n + 4) {
                        grid-column: 4 / 7;
                        aspect-ratio: 3 / 2;
                    }

                    .motion-gallery[data-tablet-display="editorial"] .motion-gallery-image {
                        height: 100%;
                        object-fit: cover;
                    }

                    .motion-gallery[data-tablet-display="editorial"] .motion-gallery-card::before {
                        content: attr(data-gallery-index);
                        display: block;
                        margin-bottom: .5rem;
                        font-size: 7px;
                        line-height: 1;
                        letter-spacing: .26em;
                        text-transform: uppercase;
                        color: rgba(255,255,255,.42);
                    }

                    .motion-gallery[data-tablet-display="editorial"] .motion-gallery-card::after {
                        content: '';
                        position: absolute;
                        left: 0;
                        bottom: -1px;
                        width: 24%;
                        height: 1px;
                        background: currentColor;
                        opacity: .6;
                        pointer-events: none;
                    }

                    /* Tablet Freeform: controlled collage without image overlap */
                    .motion-gallery[data-tablet-display="freeform"] .motion-gallery-layout {
                        display: grid;
                        grid-template-columns: repeat(6, minmax(0, 1fr));
                        gap: 1rem;
                        padding: 1.5rem 0 4rem;
                        align-items: start;
                    }

                    .motion-gallery[data-tablet-display="freeform"] .motion-gallery-card {
                        min-width: 0;
                        height: auto;
                        border-radius: .8rem;
                        box-shadow: 0 18px 45px rgba(0,0,0,.32);
                        transform: none;
                    }

                    /* Keep the collage asymmetrical, but every card gets its own grid space. */
                    .motion-gallery[data-tablet-display="freeform"] .motion-gallery-card:nth-child(4n + 1) {
                        grid-column: 1 / 4;
                    }

                    .motion-gallery[data-tablet-display="freeform"] .motion-gallery-card:nth-child(4n + 2) {
                        grid-column: 4 / 7;
                        margin-top: 2rem;
                    }

                    .motion-gallery[data-tablet-display="freeform"] .motion-gallery-card:nth-child(4n + 3) {
                        grid-column: 1 / 5;
                        margin-top: 0.5rem;
                    }

                    .motion-gallery[data-tablet-display="freeform"] .motion-gallery-card:nth-child(4n + 4) {
                        grid-column: 5 / 7;
                        margin-top: 2rem;
                    }

                    .motion-gallery[data-tablet-display="freeform"] .motion-gallery-card:hover {
                        transform: none;
                    }

                    .motion-gallery[data-tablet-display="grid"][data-tablet-aspect="square"] .motion-gallery-card {
                        aspect-ratio: 1 / 1;
                    }

                    .motion-gallery[data-tablet-display="grid"][data-tablet-aspect="portrait"] .motion-gallery-card {
                        aspect-ratio: 4 / 5;
                    }

                    .motion-gallery[data-tablet-display="grid"][data-tablet-aspect="landscape"] .motion-gallery-card {
                        aspect-ratio: 16 / 10;
                    }

                    .motion-gallery[data-tablet-display="grid"][data-tablet-aspect="original"] .motion-gallery-card {
                        aspect-ratio: 4 / 3;
                    }

                    .motion-gallery[data-tablet-display="grid"] .motion-gallery-image {
                        height: 100%;
                        object-fit: cover;
                    }
                }

                @media (max-width: 639px) {
                    /* Mobile: the SAME cards change layout; nothing is duplicated. */
                    .motion-gallery[data-mobile-display="grid"] .motion-gallery-layout {
                        display: grid;
                        grid-template-columns: repeat(
                            var(--motion-gallery-mobile-columns),
                            minmax(0, 1fr)
                        );
                        gap: 0.75rem;
                    }

                    .motion-gallery[data-mobile-display="masonry"] .motion-gallery-layout {
                        display: block;
                        column-count: var(--motion-gallery-mobile-columns);
                        column-gap: 0.75rem;
                    }

                    .motion-gallery[data-mobile-display="masonry"] .motion-gallery-card {
                        height: auto !important;
                        aspect-ratio: auto !important;
                        margin: 0 0 0.75rem;
                        break-inside: avoid;
                    }

                    .motion-gallery[data-mobile-display="masonry"] .motion-gallery-image {
                        height: auto !important;
                        aspect-ratio: auto !important;
                        object-fit: contain;
                    }

                    /* Mobile Editorial: compact vertical art direction */
                    .motion-gallery[data-mobile-display="editorial"] .motion-gallery-layout {
                        display: grid;
                        grid-template-columns: repeat(6, minmax(0, 1fr));
                        gap: 0.8rem;
                        padding: 0.25rem 0 2rem;
                        align-items: start;
                    }

                    .motion-gallery[data-mobile-display="editorial"] .motion-gallery-card {
                        min-width: 0;
                        position: relative;
                        border-radius: 0;
                        border-width: 0 0 1px;
                        padding-bottom: .6rem;
                    }

                    .motion-gallery[data-mobile-display="editorial"] .motion-gallery-card:nth-child(3n + 1) {
                        grid-column: 1 / 7;
                        aspect-ratio: 4 / 3;
                    }

                    .motion-gallery[data-mobile-display="editorial"] .motion-gallery-card:nth-child(3n + 2) {
                        grid-column: 1 / 5;
                        aspect-ratio: 4 / 5;
                    }

                    .motion-gallery[data-mobile-display="editorial"] .motion-gallery-card:nth-child(3n + 3) {
                        grid-column: 2 / 7;
                        aspect-ratio: 5 / 4;
                    }

                    .motion-gallery[data-mobile-display="editorial"] .motion-gallery-image {
                        height: 100%;
                        object-fit: cover;
                    }

                    .motion-gallery[data-mobile-display="editorial"] .motion-gallery-card::before {
                        content: attr(data-gallery-index);
                        display: block;
                        margin-bottom: .45rem;
                        font-size: 7px;
                        line-height: 1;
                        letter-spacing: .24em;
                        text-transform: uppercase;
                        color: rgba(255,255,255,.42);
                    }

                    .motion-gallery[data-mobile-display="editorial"] .motion-gallery-card::after {
                        content: '';
                        position: absolute;
                        left: 0;
                        bottom: -1px;
                        width: 24%;
                        height: 1px;
                        background: currentColor;
                        opacity: .6;
                        pointer-events: none;
                    }

                    /* Mobile Freeform: controlled stacked collage */
                    .motion-gallery[data-mobile-display="freeform"] .motion-gallery-layout {
                        display: grid;
                        grid-template-columns: repeat(2, minmax(0, 1fr));
                        grid-auto-rows: auto;
                        gap: .75rem;
                        padding: 1rem 0 3rem;
                        align-items: start;
                    }

                    .motion-gallery[data-mobile-display="freeform"] .motion-gallery-card {
                        width: 100%;
                        min-width: 0;
                        border-radius: .65rem;
                        box-shadow: 0 12px 30px rgba(0,0,0,.28);
                        transform: none;
                    }

                    /* Keep the freeform character, but avoid overlap on small screens. */
                    .motion-gallery[data-mobile-display="freeform"] .motion-gallery-card:nth-child(4n + 1) {
                        grid-column: 1 / 3;
                    }

                    .motion-gallery[data-mobile-display="freeform"] .motion-gallery-card:nth-child(4n + 2) {
                        grid-column: 1 / 2;
                        margin-top: .75rem;
                    }

                    .motion-gallery[data-mobile-display="freeform"] .motion-gallery-card:nth-child(4n + 3) {
                        grid-column: 2 / 3;
                        margin-top: 2.5rem;
                    }

                    .motion-gallery[data-mobile-display="freeform"] .motion-gallery-card:nth-child(4n + 4) {
                        grid-column: 1 / 3;
                        margin-top: .75rem;
                    }

                    .motion-gallery[data-mobile-display="freeform"] .motion-gallery-card:hover {
                        transform: none;
                    }

                    .motion-gallery[data-mobile-display="grid"][data-mobile-aspect="square"] .motion-gallery-card {
                        aspect-ratio: 1 / 1;
                    }

                    .motion-gallery[data-mobile-display="grid"][data-mobile-aspect="portrait"] .motion-gallery-card {
                        aspect-ratio: 4 / 5;
                    }

                    .motion-gallery[data-mobile-display="grid"][data-mobile-aspect="landscape"] .motion-gallery-card {
                        aspect-ratio: 16 / 10;
                    }

                    .motion-gallery[data-mobile-display="grid"][data-mobile-aspect="original"] .motion-gallery-card {
                        aspect-ratio: 4 / 3;
                    }

                    .motion-gallery[data-mobile-display="grid"] .motion-gallery-image {
                        height: 100%;
                        object-fit: cover;
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .motion-marquee,
                    .motion-reveal,
                    .motion-hero-image,
                    .motion-hero-copy {
                        animation: none;
                    }

                    .motion-project-row,
                    .motion-number,
                    .motion-arrow {
                        transition: none;
                    }
                }
            `}</style>

            {/* Navigation */}
            {settings.show_navigation && (
                <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-7 sm:pt-6">
                    <div className="mx-auto flex max-w-[1320px] items-center justify-between">
                        <a
                            href="#top"
                            className="group inline-flex items-center gap-3"
                            aria-label={`Go to ${profile.display_name} home`}
                        >
                            <span
                                className="h-px w-7 transition-all duration-300 group-hover:w-12"
                                style={{
                                    backgroundColor: settings.accent_color,
                                }}
                            />
                            <span
                                className="text-[8px] uppercase tracking-[0.28em]"
                                style={{ color: settings.text_color }}
                            >
                                {profile.display_name}
                            </span>
                        </a>

                        <nav
                            className="hidden items-center gap-1 border px-1 py-1 backdrop-blur-xl md:flex"
                            style={{
                                borderColor: settings.border_color,
                                backgroundColor: `${settings.background_color}cc`,
                            }}
                            aria-label="Portfolio navigation"
                        >
                            {navigationItems.map((item, index) => (
                                <a
                                    key={item.id}
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
                                    className="group relative px-4 py-2.5 text-[7px] uppercase tracking-[0.22em] transition-colors duration-300"
                                    style={{
                                        color: settings.text_color,
                                    }}
                                >
                                    <span className="relative z-10">
                                        {String(index + 1).padStart(2, '0')} /{' '}
                                        {item.label}
                                    </span>

                                    <span
                                        className="absolute inset-0 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
                                        style={{
                                            backgroundColor:
                                                settings.accent_color,
                                            opacity: 0.12,
                                        }}
                                    />
                                </a>
                            ))}
                        </nav>

                        <button
                            type="button"
                            className="flex h-10 w-10 items-center justify-center border backdrop-blur-xl transition duration-300 hover:rotate-90 md:hidden"
                            style={{
                                borderColor: settings.border_color,
                                backgroundColor: `${settings.background_color}cc`,
                                color: settings.text_color,
                            }}
                            onClick={() =>
                                setMobileMenuOpen((open) => !open)
                            }
                            aria-label="Toggle navigation"
                            aria-expanded={mobileMenuOpen}
                        >
                            <span className="text-base leading-none">
                                {mobileMenuOpen ? '×' : '＋'}
                            </span>
                        </button>
                    </div>

                    {mobileMenuOpen && (
                        <div
                            className="mx-auto mt-3 max-w-[1320px] border backdrop-blur-2xl md:hidden"
                            style={{
                                borderColor: settings.border_color,
                                backgroundColor: `${settings.background_color}f2`,
                            }}
                        >
                            <nav
                                className="grid grid-cols-2"
                                aria-label="Mobile portfolio navigation"
                            >
                                {navigationItems.map((item, index) => (
                                    <a
                                        key={item.id}
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
                                        className="border-b border-r px-4 py-5 text-[8px] uppercase tracking-[0.22em] transition-opacity hover:opacity-55"
                                        style={{
                                            borderColor:
                                                settings.border_color,
                                            color:
                                                settings.text_color,
                                        }}
                                    >
                                        <span
                                            className="mr-2"
                                            style={{
                                                color:
                                                    settings.accent_color,
                                            }}
                                        >
                                            {String(index + 1).padStart(
                                                2,
                                                '0',
                                            )}
                                        </span>
                                        {item.label}
                                    </a>
                                ))}
                            </nav>
                        </div>
                    )}
                </header>
            )}

            {/* Hero */}
            {settings.show_hero && (
                <section
                    className="relative min-h-[100svh] overflow-hidden border-b"
                    style={{
                        borderColor: settings.border_color,
                    }}
                >
                    {coverImage && (
                        <img
                            src={coverImage}
                            alt=""
                            aria-hidden="true"
                            className="motion-hero-image absolute inset-0 h-full w-full object-cover"
                            style={{
                                objectPosition: `${settings.cover_image_position_x ?? 50}% ${settings.cover_image_position_y ?? 50}%`,
                                transform: `translate(${settings.cover_image_offset_x ?? 0}%, ${settings.cover_image_offset_y ?? 0}%) scale(${settings.cover_image_zoom ?? 1})`,
                            }}
                        />
                    )}

                    <div
                        className="absolute inset-0"
                        style={{
                            background: coverImage
                                ? 'linear-gradient(90deg, rgba(0,0,0,.97) 0%, rgba(0,0,0,.78) 28%, rgba(0,0,0,.28) 58%, rgba(0,0,0,.08) 100%)'
                                : `linear-gradient(135deg, ${settings.background_color} 0%, ${settings.surface_color} 100%)`,
                        }}
                    />

                    <div
                        className="absolute inset-0"
                        style={{
                            background:
                                'linear-gradient(0deg, rgba(0,0,0,.82) 0%, rgba(0,0,0,.12) 45%, rgba(0,0,0,.3) 100%)',
                        }}
                    />

                    <div
                        className="absolute inset-0 opacity-20"
                        style={{
                            backgroundImage:
                                'linear-gradient(var(--motion-grid) 1px, transparent 1px), linear-gradient(90deg, var(--motion-grid) 1px, transparent 1px)',
                            backgroundSize: '80px 80px',
                        }}
                    />

                    <div className="relative mx-auto flex min-h-[100svh] max-w-[1320px] flex-col justify-end px-5 pb-16 pt-32 sm:px-8 sm:pb-20 lg:pb-24">
                        <div className="motion-hero-copy max-w-[980px]">
                            <div className="mb-7 flex items-center gap-3">
                                <span
                                    className="h-px w-10"
                                    style={{
                                        backgroundColor:
                                            settings.accent_color,
                                    }}
                                />
                                <p
                                    className="text-[7px] uppercase tracking-[0.34em]"
                                    style={{
                                        color: settings.accent_color,
                                    }}
                                >
                                    {settings.hero_label ||
                                        profile.artist_type ||
                                        'Visual Artist'}
                                </p>
                            </div>

                            <h1
                                className="max-w-[900px] whitespace-pre-line text-[clamp(4rem,12vw,11rem)] font-black uppercase leading-[0.76] tracking-[-0.085em]"
                                style={{
                                    color: settings.text_color,
                                }}
                            >
                                {heroStatement || profile.display_name}
                            </h1>

                            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
                                <span
                                    className="text-[9px] uppercase tracking-[0.28em]"
                                    style={{
                                        color: settings.text_color,
                                    }}
                                >
                                    {profile.display_name}
                                </span>

                                <span
                                    className="h-px w-10"
                                    style={{
                                        backgroundColor:
                                            settings.border_color,
                                    }}
                                />

                                <span
                                    className="text-[7px] uppercase tracking-[0.28em]"
                                    style={{
                                        color:
                                            settings.muted_text_color,
                                    }}
                                >
                                    {profile.location ||
                                        'Independent creative practice'}
                                </span>
                            </div>

                            <div className="mt-10">
                                <a
                                    href="#work"
                                    className="group inline-flex items-center gap-4 border px-4 py-3 text-[7px] uppercase tracking-[0.25em] transition-all duration-300 hover:bg-white hover:text-black"
                                    style={{
                                        borderColor:
                                            settings.text_color,
                                        color: settings.text_color,
                                    }}
                                >
                                    <span>
                                        {settings.work_label ||
                                            'Selected Work'}
                                    </span>
                                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                                        →
                                    </span>
                                </a>
                            </div>
                        </div>

                        <div className="absolute bottom-6 right-5 hidden flex-col items-end gap-2 sm:right-8 md:flex">
                            <span
                                className="text-[7px] uppercase tracking-[0.28em]"
                                style={{
                                    color:
                                        settings.muted_text_color,
                                }}
                            >
                                Scroll to explore
                            </span>
                            <span
                                className="h-10 w-px"
                                style={{
                                    backgroundColor:
                                        settings.border_color,
                                }}
                            />
                        </div>
                    </div>
                </section>
            )}

            {/* Moving statement */}
            {settings.show_hero && heroStatement && (
                <div
                    className="overflow-hidden border-b py-4"
                    style={{
                        borderColor: settings.border_color,
                    }}
                >
                    <div className="motion-marquee flex w-max">
                        {[0, 1].map((copy) => (
                            <div
                                key={copy}
                                className="flex shrink-0 items-center"
                            >
                                <span
                                    className="px-5 text-[8px] uppercase tracking-[0.28em] sm:px-8"
                                    style={{
                                        color:
                                            settings.muted_text_color,
                                    }}
                                >
                                    {heroStatement}
                                </span>
                                <span
                                    className="px-5 text-[8px] sm:px-8"
                                    style={{
                                        color:
                                            settings.accent_color,
                                    }}
                                >
                                    ●
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Work */}
            {settings.show_work && (
                <section
                    id="work"
                    className="border-b px-5 py-16 sm:px-8 sm:py-24"
                    style={{
                        borderColor: settings.border_color,
                    }}
                >
                    <div className="mx-auto max-w-[1320px]">
                        <div className="mb-10 flex flex-col gap-6 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <p
                                    className="text-[7px] uppercase tracking-[0.32em]"
                                    style={{
                                        color: settings.accent_color,
                                    }}
                                >
                                    01 / Selected Work
                                </p>

                                <h2
                                    className="mt-3 max-w-4xl text-[clamp(2.8rem,7vw,7rem)] font-black uppercase leading-[0.76] tracking-[-0.08em]"
                                    style={{
                                        color: settings.text_color,
                                    }}
                                >
                                    {settings.work_label ||
                                        'Selected Work'}
                                </h2>
                            </div>

                            {settings.work_description && (
                                <p
                                    className="max-w-sm text-xs leading-6 sm:text-right"
                                    style={{
                                        color:
                                            settings.muted_text_color,
                                    }}
                                >
                                    {settings.work_description}
                                </p>
                            )}
                        </div>

                        {projects.length > 0 ? (
                            <div className="grid gap-3 md:grid-cols-12 md:gap-5">
                                {projects.slice(0, 3).map((project, index) => {
                                    const image = getAssetUrl(
                                        project.thumbnail,
                                    );

                                    if (index === 0) {
                                        return (
                                            <a
                                                key={project.id}
                                                href={getProjectUrl(
                                                    profile,
                                                    project,
                                                )}
                                                className="motion-work-card group relative min-h-[420px] overflow-hidden border md:col-span-8 md:min-h-[620px]"
                                                style={{
                                                    borderColor:
                                                        settings.border_color,
                                                }}
                                            >
                                                {image ? (
                                                    <img
                                                        src={image}
                                                        alt={project.title}
                                                        className="absolute inset-0 h-full w-full object-cover"
                                                        style={{
                                                            objectPosition: `${project.thumbnail_position_x ?? 50}% ${project.thumbnail_position_y ?? 50}%`,
                                                        }}
                                                    />
                                                ) : (
                                                    <div
                                                        className="absolute inset-0"
                                                        style={{
                                                            backgroundColor:
                                                                settings.surface_color,
                                                        }}
                                                    />
                                                )}

                                                <div
                                                    className="absolute inset-0"
                                                    style={{
                                                        background:
                                                            'linear-gradient(0deg, rgba(0,0,0,.9) 0%, rgba(0,0,0,.05) 62%)',
                                                    }}
                                                />

                                                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                                                    <div className="flex items-end justify-between gap-5">
                                                        <div>
                                                            <p className="text-[8px] uppercase tracking-[0.25em] text-white/55">
                                                                01 / Selected
                                                                Work
                                                            </p>
                                                            <h3 className="mt-2 max-w-2xl text-[clamp(1.8rem,4vw,4rem)] font-light leading-[0.9] tracking-[-0.05em] text-white">
                                                                {
                                                                    project.title
                                                                }
                                                            </h3>
                                                        </div>

                                                        <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/40 text-xs text-white transition duration-300 group-hover:bg-white group-hover:text-black">
                                                            ↗
                                                        </span>
                                                    </div>
                                                </div>
                                            </a>
                                        );
                                    }

                                    return (
                                        <a
                                            key={project.id}
                                            href={getProjectUrl(
                                                profile,
                                                project,
                                            )}
                                            className={`motion-work-card group relative min-h-[300px] overflow-hidden border md:col-span-4 ${
                                                index === 1
                                                    ? 'md:translate-y-14'
                                                    : 'md:-translate-y-2'
                                            }`}
                                            style={{
                                                borderColor:
                                                    settings.border_color,
                                            }}
                                        >
                                            {image ? (
                                                <img
                                                    src={image}
                                                    alt={project.title}
                                                    className="absolute inset-0 h-full w-full object-cover"
                                                    style={{
                                                        objectPosition: `${project.thumbnail_position_x ?? 50}% ${project.thumbnail_position_y ?? 50}%`,
                                                    }}
                                                />
                                            ) : (
                                                <div
                                                    className="absolute inset-0"
                                                    style={{
                                                        backgroundColor:
                                                            settings.surface_color,
                                                    }}
                                                />
                                            )}

                                            <div
                                                className="absolute inset-0"
                                                style={{
                                                    background:
                                                        'linear-gradient(0deg, rgba(0,0,0,.88) 0%, rgba(0,0,0,.08) 70%)',
                                                }}
                                            />

                                            <div className="absolute inset-x-0 bottom-0 p-5">
                                                <div className="flex items-end justify-between gap-4">
                                                    <div>
                                                        <p className="text-[7px] uppercase tracking-[0.25em] text-white/55">
                                                            {String(
                                                                index + 1,
                                                            ).padStart(2, '0')}
                                                        </p>
                                                        <h3 className="mt-2 text-xl font-light leading-tight tracking-[-0.03em] text-white sm:text-2xl">
                                                            {
                                                                project.title
                                                            }
                                                        </h3>
                                                    </div>

                                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-white/35 text-[10px] text-white">
                                                        ↗
                                                    </span>
                                                </div>
                                            </div>
                                        </a>
                                    );
                                })}
                            </div>
                        ) : (
                            <div
                                className="border-y py-16 text-center"
                                style={{
                                    borderColor:
                                        settings.border_color,
                                    color:
                                        settings.muted_text_color,
                                }}
                            >
                                <p className="text-[8px] uppercase tracking-[0.3em]">
                                    No selected work yet
                                </p>
                            </div>
                        )}

                        {projects.length > 3 && (
                            <div className="mt-12 border-t pt-6">
                                <div className="grid gap-4">
                                    {projects.slice(3).map((project, index) => (
                                        <MotionProjectRow
                                            key={project.id}
                                            project={project}
                                            index={index + 3}
                                            profile={profile}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Artist Message */}
            {settings.show_artist_message && (
                <section
                    id="artist-message"
                    className="border-y px-5 py-20 sm:px-8 sm:py-28"
                    style={{
                        borderColor: settings.border_color,
                    }}
                >
                    <div className="mx-auto max-w-[1320px]">
                        <p
                            className="text-[7px] uppercase tracking-[0.3em]"
                            style={{
                                color: settings.accent_color,
                            }}
                        >
                            {settings.artist_message_label ||
                                'A note from the artist'}
                        </p>

                        <p
                            className="mt-8 max-w-6xl text-[clamp(2.1rem,5vw,5.8rem)] font-light leading-[0.92] tracking-[-0.06em]"
                            style={{
                                color: settings.text_color,
                            }}
                        >
                            {settings.artist_message?.trim() ||
                                'Create with intention. Share your story with the world.'}
                        </p>
                    </div>
                </section>
            )}

            {/* Gallery */}
            {settings.show_gallery &&
                galleryImages.length > 0 && (
                    <section
                        id="gallery"
                        className="px-5 py-20 sm:px-8 sm:py-28"
                    >
                        <div className="mx-auto max-w-[1320px]">
                            <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
                                <div>
                                    <p
                                        className="text-[7px] uppercase tracking-[0.3em]"
                                        style={{
                                            color:
                                                settings.accent_color,
                                        }}
                                    >
                                        02 / Gallery
                                    </p>

                                    <h2
                                        className="mt-4 text-[clamp(3rem,8vw,8rem)] font-light uppercase leading-[0.75] tracking-[-0.08em]"
                                        style={{
                                            color:
                                                settings.text_color,
                                        }}
                                    >
                                        {settings.gallery_label ||
                                            'Archive'}
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
                                        {settings.gallery_description}
                                    </p>
                                )}
                            </div>

                            <div
                                className="motion-gallery"
                                data-desktop-display={
                                    galleryDesktop.display
                                }
                                data-tablet-display={
                                    galleryTablet.display
                                }
                                data-mobile-display={
                                    galleryMobile.display
                                }
                                data-desktop-aspect={
                                    galleryDesktop.imageAspect
                                }
                                data-tablet-aspect={
                                    galleryTablet.imageAspect
                                }
                                data-mobile-aspect={
                                    galleryMobile.imageAspect
                                }
                                style={
                                    {
                                        '--motion-gallery-desktop-columns':
                                            galleryDesktop.columns,
                                        '--motion-gallery-tablet-columns':
                                            galleryTablet.columns,
                                        '--motion-gallery-mobile-columns':
                                            galleryMobile.columns,
                                    } as CSSProperties
                                }
                            >
                                <div className="motion-gallery-layout">
                                    {galleryImages.map(
                                        (image, index) => {
                                            const src =
                                                getAssetUrl(
                                                    image.image,
                                                );

                                            if (!src) {
                                                return null;
                                            }

                                            return (
                                                <button
                                                    key={image.id}
                                                    type="button"
                                                    onClick={() =>
                                                        openLightbox(
                                                            index,
                                                        )
                                                    }
                                                    data-gallery-index={String(
                                                        index + 1,
                                                    ).padStart(2, '0')}
                                                    className="motion-gallery-card group relative overflow-hidden border text-left"
                                                    style={{
                                                        borderColor:
                                                            settings.border_color,
                                                    }}
                                                >
                                                    <img
                                                        src={src}
                                                        alt={
                                                            image.alt_text ||
                                                            image.title ||
                                                            'Gallery image'
                                                        }
                                                        className="motion-gallery-image h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                                                    />

                                                    {(settings.gallery_show_titles ||
                                                        settings.gallery_show_captions) && (
                                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-4 pt-14 opacity-0 transition duration-300 group-hover:opacity-100">
                                                            {settings.gallery_show_titles &&
                                                                image.title && (
                                                                    <p className="text-xs text-white">
                                                                        {
                                                                            image.title
                                                                        }
                                                                    </p>
                                                                )}

                                                            {settings.gallery_show_captions &&
                                                                image.caption && (
                                                                    <p className="mt-1 text-[9px] leading-4 text-white/65">
                                                                        {
                                                                            image.caption
                                                                        }
                                                                    </p>
                                                                )}
                                                        </div>
                                                    )}

                                                    <span className="absolute right-3 top-3 border border-white/30 bg-black/30 px-2 py-1 text-[7px] uppercase tracking-[0.2em] text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100">
                                                        {String(
                                                            index + 1,
                                                        ).padStart(
                                                            2,
                                                            '0',
                                                        )}
                                                    </span>
                                                </button>
                                            );
                                        },
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                )}

            {/* Music */}
            {settings.show_music &&
                visibleReleases.length > 0 && (
                    <section
                        id="music"
                        className="border-t px-5 py-20 sm:px-8 sm:py-28"
                        style={{
                            borderColor: settings.border_color,
                        }}
                    >
                        <div className="mx-auto max-w-[1320px]">
                            <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
                                <div>
                                    <p
                                        className="text-[7px] uppercase tracking-[0.3em]"
                                        style={{
                                            color:
                                                settings.accent_color,
                                        }}
                                    >
                                        03 / Sound
                                    </p>

                                    <h2
                                        className="mt-4 text-[clamp(3rem,8vw,8rem)] font-light uppercase leading-[0.75] tracking-[-0.08em]"
                                        style={{
                                            color:
                                                settings.text_color,
                                        }}
                                    >
                                        {settings.music_label ||
                                            'Music'}
                                    </h2>
                                </div>

                                <p
                                    className="max-w-sm text-xs leading-6"
                                    style={{
                                        color:
                                            settings.muted_text_color,
                                    }}
                                >
                                    Releases, experiments, and work made
                                    to be heard.
                                </p>
                            </div>

                            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                                {visibleReleases.map((release) => (
                                    <MotionReleaseCard
                                        key={release.id}
                                        release={release}
                                        profile={profile}
                                    />
                                ))}
                            </div>
                        </div>
                    </section>
                )}

            {/* About */}
            {settings.show_about && (
                <section
                    id="about"
                    className="relative overflow-hidden border-b px-5 py-20 sm:px-8 sm:py-28"
                    style={{
                        borderColor: settings.border_color,
                    }}
                >
                    <div
                        className="pointer-events-none absolute right-[-8%] top-[-12%] select-none text-[28vw] font-black uppercase leading-none tracking-[-0.12em]"
                        style={{
                            color: settings.border_color,
                            opacity: 0.22,
                        }}
                    >
                        04
                    </div>

                    <div className="relative mx-auto max-w-[1320px]">
                        <div className="mb-12 flex items-center justify-between gap-6">
                            <div className="flex items-center gap-3">
                                <span
                                    className="h-px w-10"
                                    style={{
                                        backgroundColor:
                                            settings.accent_color,
                                    }}
                                />
                                <p
                                    className="text-[7px] uppercase tracking-[0.34em]"
                                    style={{
                                        color: settings.accent_color,
                                    }}
                                >
                                    04 / About
                                </p>
                            </div>

                            <span
                                className="hidden text-[7px] uppercase tracking-[0.3em] sm:block"
                                style={{
                                    color:
                                        settings.muted_text_color,
                                }}
                            >
                                {profile.artist_type ||
                                    'Independent Artist'}
                            </span>
                        </div>

                        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-10">
                            <div className="lg:col-span-5">
                                {profileImage ? (
                                    <div className="relative max-w-[520px]">
                                        <div
                                            className="absolute -bottom-5 -right-5 h-full w-full border"
                                            style={{
                                                borderColor:
                                                    settings.accent_color,
                                                opacity: 0.45,
                                            }}
                                        />

                                        <div
                                            className="motion-about-image relative aspect-[4/5] overflow-hidden border"
                                            style={{
                                                borderColor:
                                                    settings.border_color,
                                            }}
                                        >
                                            <AvatarImage
                                                src={profileImage}
                                                alt={profile.display_name}
                                                zoom={Number(profile.avatar_zoom ?? 1)}
                                                positionX={Number(
                                                    profile.avatar_position_x ?? 50,
                                                )}
                                                positionY={Number(
                                                    profile.avatar_position_y ?? 50,
                                                )}
                                            />

                                            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/45 px-4 py-3 backdrop-blur-sm">
                                                <span className="text-[7px] uppercase tracking-[0.25em] text-white/75">
                                                    {profile.display_name}
                                                </span>
                                                <span className="text-[7px] uppercase tracking-[0.25em] text-white/45">
                                                    Motion / 04
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        className="aspect-[4/5] max-w-[520px] border"
                                        style={{
                                            borderColor:
                                                settings.border_color,
                                            backgroundColor:
                                                settings.surface_color,
                                        }}
                                    />
                                )}
                            </div>

                            <div className="lg:col-span-7 lg:pt-8">
                                <p
                                    className="max-w-5xl text-[clamp(3.3rem,8vw,8.5rem)] font-black uppercase leading-[0.75] tracking-[-0.085em]"
                                    style={{
                                        color: settings.text_color,
                                    }}
                                >
                                    {settings.about_label ||
                                        'About'}
                                </p>

                                <div className="mt-10 grid gap-8 md:grid-cols-[1fr_auto]">
                                    <p
                                        className="max-w-2xl whitespace-pre-line text-sm leading-7 sm:text-base sm:leading-8"
                                        style={{
                                            color:
                                                settings.muted_text_color,
                                        }}
                                    >
                                        {profile.about_me ||
                                            profile.bio ||
                                            'A creative practice built through movement, image, sound, and experimentation.'}
                                    </p>

                                    <div
                                        className="hidden text-right md:block"
                                        style={{
                                            color:
                                                settings.muted_text_color,
                                        }}
                                    >
                                        <span className="block text-[7px] uppercase tracking-[0.25em]">
                                            Based in
                                        </span>
                                        <span
                                            className="mt-2 block text-xs uppercase tracking-[0.15em]"
                                            style={{
                                                color:
                                                    settings.text_color,
                                            }}
                                        >
                                            {profile.location ||
                                                'Independent practice'}
                                        </span>
                                    </div>
                                </div>

                                <div
                                    className="mt-12 grid border-y sm:grid-cols-3"
                                    style={{
                                        borderColor:
                                            settings.border_color,
                                    }}
                                >
                                    <div className="border-b px-4 py-5 sm:border-b-0 sm:border-r sm:px-5">
                                        <span
                                            className="block text-[7px] uppercase tracking-[0.25em]"
                                            style={{
                                                color:
                                                    settings.muted_text_color,
                                            }}
                                        >
                                            Practice
                                        </span>
                                        <span
                                            className="mt-2 block text-xs uppercase tracking-[0.14em]"
                                            style={{
                                                color:
                                                    settings.text_color,
                                            }}
                                        >
                                            {profile.artist_type ||
                                                'Creative'}
                                        </span>
                                    </div>

                                    <div className="border-b px-4 py-5 sm:border-b-0 sm:border-r sm:px-5">
                                        <span
                                            className="block text-[7px] uppercase tracking-[0.25em]"
                                            style={{
                                                color:
                                                    settings.muted_text_color,
                                            }}
                                        >
                                            Location
                                        </span>
                                        <span
                                            className="mt-2 block text-xs uppercase tracking-[0.14em]"
                                            style={{
                                                color:
                                                    settings.text_color,
                                            }}
                                        >
                                            {profile.location || '—'}
                                        </span>
                                    </div>

                                    <div className="px-4 py-5 sm:px-5">
                                        <span
                                            className="block text-[7px] uppercase tracking-[0.25em]"
                                            style={{
                                                color:
                                                    settings.muted_text_color,
                                            }}
                                        >
                                            Connect
                                        </span>

                                        {profile.website ? (
                                            <a
                                                href={profile.website}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="mt-2 inline-block text-xs uppercase tracking-[0.14em] transition-opacity hover:opacity-55"
                                                style={{
                                                    color:
                                                        settings.text_color,
                                                }}
                                            >
                                                Website ↗
                                            </a>
                                        ) : (
                                            <span
                                                className="mt-2 block text-xs uppercase tracking-[0.14em]"
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
                </section>
            )}

            {/* Footer */}
            {settings.show_footer && (
                <footer
                    id="footer"
                    className="relative overflow-hidden border-t px-5 py-16 sm:px-8 sm:py-24"
                    style={{
                        borderColor: settings.border_color,
                    }}
                >
                    <div
                        className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full blur-3xl"
                        style={{
                            backgroundColor: settings.accent_color,
                            opacity: 0.08,
                        }}
                    />

                    <div className="relative mx-auto max-w-[1320px]">
                        <div className="flex flex-col gap-10">
                            <div className="flex items-center gap-4">
                                <span
                                    className="h-px w-10"
                                    style={{
                                        backgroundColor:
                                            settings.accent_color,
                                    }}
                                />
                                <span
                                    className="text-[7px] uppercase tracking-[0.35em]"
                                    style={{
                                        color:
                                            settings.muted_text_color,
                                    }}
                                >
                                    End of the practice
                                </span>
                            </div>

                            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
                                <div>
                                    {getAssetUrl(settings.footer_logo) && (
                                        <img
                                            src={
                                                getAssetUrl(
                                                    settings.footer_logo,
                                                ) ?? undefined
                                            }
                                            alt={`${profile.display_name} footer logo`}
                                            className="mb-8 max-h-16 w-auto max-w-[220px] object-contain object-left"
                                        />
                                    )}

                                    <p
                                        className="max-w-6xl text-[clamp(3.5rem,11vw,11rem)] font-black uppercase leading-[0.72] tracking-[-0.09em]"
                                        style={{
                                            color:
                                                settings.text_color,
                                        }}
                                    >
                                        {settings.footer_label ||
                                            profile.display_name}
                                    </p>

                                    {settings.footer_message && (
                                        <p
                                            className="mt-8 max-w-xl text-xs leading-6"
                                            style={{
                                                color:
                                                    settings.muted_text_color,
                                            }}
                                        >
                                            {settings.footer_message}
                                        </p>
                                    )}
                                </div>

                                <div className="lg:text-right">
                                    <p
                                        className="text-[7px] uppercase tracking-[0.25em]"
                                        style={{
                                            color:
                                                settings.muted_text_color,
                                        }}
                                    >
                                        {settings.copyright_text ||
                                            `© ${new Date().getFullYear()} ${profile.display_name}`}
                                    </p>

                                    {settings.show_powered_by_lira && (
                                        <a
                                            href="/"
                                            className="mt-5 inline-flex items-center gap-3 border px-4 py-3 text-[7px] uppercase tracking-[0.22em] transition hover:bg-white hover:text-black"
                                            style={{
                                                borderColor:
                                                    settings.border_color,
                                                color:
                                                    settings.text_color,
                                            }}
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

                            <div
                                className="flex flex-col gap-3 border-t pt-5 text-[7px] uppercase tracking-[0.24em] sm:flex-row sm:items-center sm:justify-between"
                                style={{
                                    borderColor: settings.border_color,
                                    color: settings.muted_text_color,
                                }}
                            >
                                <span>Motion / Portfolio / Archive</span>
                                <span>
                                    {profile.location ||
                                        'Independent creative practice'}
                                </span>
                            </div>
                        </div>
                    </div>
                </footer>
            )}

            {/* Gallery lightbox */}
            {lightboxImage &&
                settings.gallery_enable_lightbox && (
                    <div
                        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-5 backdrop-blur-xl sm:p-8"
                        role="dialog"
                        aria-modal="true"
                        aria-label={
                            lightboxImage.title ||
                            'Gallery image'
                        }
                        onClick={closeLightbox}
                    >
                        <button
                            type="button"
                            onClick={closeLightbox}
                            className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center border border-white/20 bg-black/40 text-lg text-white transition hover:bg-white/10 sm:right-8 sm:top-8"
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
                                    className="absolute left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-white/20 bg-black/40 text-lg text-white transition hover:bg-white/10 sm:left-8"
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
                                    className="absolute right-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-white/20 bg-black/40 text-lg text-white transition hover:bg-white/10 sm:right-8"
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
                                        lightboxImage.image,
                                    ) ?? undefined
                                }
                                alt={
                                    lightboxImage.alt_text ||
                                    lightboxImage.title ||
                                    'Gallery image'
                                }
                                className="max-h-[78vh] max-w-[92vw] object-contain"
                            />

                            {(lightboxImage.title ||
                                lightboxImage.caption) && (
                                <div className="mt-4">
                                    {lightboxImage.title && (
                                        <p
                                            className="text-sm"
                                            style={{
                                                color:
                                                    settings.text_color,
                                            }}
                                        >
                                            {lightboxImage.title}
                                        </p>
                                    )}

                                    {lightboxImage.caption && (
                                        <p
                                            className="mt-1 max-w-2xl text-xs leading-5"
                                            style={{
                                                color:
                                                    settings.muted_text_color,
                                            }}
                                        >
                                            {
                                                lightboxImage.caption
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
    );
}
