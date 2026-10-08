import type { FormDataConvertible } from '@inertiajs/core';

import {
    ChangeEvent,
    DragEvent,
    FormEvent,
    PointerEvent,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from 'react';

import { Link, router } from '@inertiajs/react';

import DashboardLayout from '../../Components/Dashboard/d_layout';
import templates from '../Public/templates';

import {
    ArrowLeft,
    ArrowUpRight,
    CheckIcon,
} from '../../Components/Icons';

/* Settings UI */

const SETTINGS_UI_ACCENT = '#7de7ff';


interface Settings {
    /* Template */
    template: string;

    /* Global Colors */
    primary_color: string;
    background_color: string;
    text_color: string;
    accent_color: string;
    hover_color: string;
    surface_color: string;
    muted_text_color: string;
    border_color: string;

    /* Project Card Colors */
    card_background_color: string;
    card_text_color: string;
    card_accent_color: string;
    card_primary_color: string;
    card_hover_color: string;

    /* Cover */
    cover_image: string | null;
    cover_image_position_x: number;
    cover_image_position_y: number;
    cover_image_zoom: number;
    cover_image_offset_x: number;
    cover_image_offset_y: number;

    /* Hero */
    show_hero: boolean;
    hero_label: string | null;
    hero_statement: string | null;

    /* Canvas */
    canvas_background_text: string | null;

    /* Work */
    show_work: boolean;
    work_label: string | null;
    work_description: string | null;

    /* About */
    show_about: boolean;
    about_label: string | null;

    /* Artist Message */
    show_artist_message: boolean;
    artist_message_label: string | null;
    artist_message: string | null;

    /* Gallery */

    show_gallery: boolean;
    gallery_label: string | null;
    gallery_description: string | null;

    gallery_display:
    | 'grid'
    | 'masonry'
    | 'editorial'
    | 'freeform';

    gallery_columns: number;

    gallery_image_aspect:
    | 'original'
    | 'square'
    | 'portrait'
    | 'landscape';

    gallery_responsive:
    GalleryResponsiveSettingsMap | null;

    gallery_show_captions: boolean;
    gallery_show_titles: boolean;
    gallery_enable_lightbox: boolean;

    /* Music */
    show_music: boolean;
    music_label: string | null;
    music_release_display: 'latest' | 'all';
    music_release_limit: number;
    featured_release_id: number | null;
    show_music_links: boolean;

    /* Navigation */
    show_navigation: boolean;

    /* Footer */
    show_footer: boolean;
    footer_label: string | null;
    footer_message: string | null;
    show_footer_socials: boolean;
    footer_logo: string | null;
    copyright_text: string | null;
    show_powered_by_lira: boolean;
}

interface Project {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    project_type: string | null;
    thumbnail: string | null;
    url: string | null;
}

interface Release {
    id: number;
    title: string;
    release_type: string;
    artwork: string | null;
    release_date: string | null;
    is_visible: boolean;
    spotify_url: string | null;
    apple_music_url: string | null;
    youtube_url: string | null;
    soundcloud_url: string | null;
    bandcamp_url: string | null;
}

type GalleryResponsiveSettings = Record<
    'display' | 'columns' | 'image_aspect',
    string | number
> & {
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

type GalleryResponsiveSettingsMap = Record<
    'desktop' | 'tablet' | 'mobile',
    GalleryResponsiveSettings
>;

interface GalleryImage {
    id: number | null;
    image: string | null;
    title: string;
    caption: string;
    alt_text: string;
    sort_order: number;
}

interface Profile {
    username: string;
    display_name: string;
    bio: string | null;
    artist_type: string | null;
    location: string | null;
    website: string | null;
    avatar: string | null;
    cover_image: string | null;
    projects: Project[];
    releases?: Release[];
}

interface NavigationItem {
    id?: number;
    label: string;
    destination: string;
    url: string | null;
    sort_order: number;
    is_visible: boolean;
}

interface Props {
    settings: Settings;
    profile: Profile;
    navigationItems: NavigationItem[];
    galleryImages: GalleryImage[];
}

interface ColorFieldProps {
    id: string;
    label: string;
    description: string;
    value: string;
    onChange: (value: string) => void;
}

interface Palette {
    name: string;
    primary: string;
    background: string;
    text: string;
    accent: string;
    hover: string;
    surface: string;
    mutedText: string;
    border: string;
    cardBackground: string;
    cardText: string;
    cardAccent: string;
    cardPrimary: string;
    cardHover: string;
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

/* Glass Section */

function GlassSection({
    id,
    eyebrow,
    title,
    description,
    children,
}: {
    id?: string;
    eyebrow?: string;
    title: string;
    description?: string;
    children: React.ReactNode;
}) {
    return (
        <section
            id={id}
            className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025] shadow-[0_20px_80px_rgba(0,0,0,0.24)] backdrop-blur-2xl sm:rounded-[24px] lg:rounded-[28px]"
        >
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.045),transparent_35%,rgba(255,255,255,0.012))]" />

            <div className="relative p-4 sm:p-6 lg:p-8">
                {(eyebrow || title || description) && (
                    <div className="mb-6 sm:mb-8">
                        {eyebrow && (
                            <p className="text-[9px] uppercase tracking-[0.24em] text-zinc-600">
                                {eyebrow}
                            </p>
                        )}

                        <h2 className="mt-2 text-lg font-semibold tracking-tight text-white sm:text-xl">
                            {title}
                        </h2>

                        {description && (
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
                                {description}
                            </p>
                        )}
                    </div>
                )}

                {children}
            </div>
        </section>
    );
}

// Color Field

function ColorField({
    id,
    label,
    description,
    value,
    onChange,
}: ColorFieldProps) {
    return (
        <div className="group">
            <label
                htmlFor={id}
                className="mb-2 block text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-400"
            >
                {label}
            </label>

            <p className="mb-3 text-xs leading-5 text-zinc-600">
                {description}
            </p>

            <div className="flex items-center gap-3">
                <label
                    htmlFor={id}
                    className="relative h-12 w-12 shrink-0 cursor-pointer overflow-hidden rounded-xl border border-white/[0.1] bg-black/30 p-1 transition hover:border-white/[0.2]"
                >
                    <span
                        className="block h-full w-full rounded-lg"
                        style={{
                            backgroundColor: value,
                        }}
                    />

                    <input
                        id={id}
                        type="color"
                        value={value}
                        onChange={(event) =>
                            onChange(event.target.value)
                        }
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    />
                </label>

                <input
                    type="text"
                    value={value}
                    onChange={(event) =>
                        onChange(event.target.value)
                    }
                    spellCheck={false}
                    className="min-w-0 flex-1 rounded-xl border border-white/[0.08] bg-black/30 px-4 py-3 text-sm font-mono text-zinc-300 outline-none transition focus:border-white/20 focus:bg-white/[0.035]"
                />
            </div>
        </div>
    );
}

// Palette Button

function PaletteButton({
    palette,
    active,
    onClick,
}: {
    palette: Palette;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`group relative overflow-hidden rounded-2xl border p-3 text-left transition ${active
                ? 'border-white/[0.2] bg-white/[0.055]'
                : 'border-white/[0.07] bg-black/20 hover:border-white/[0.15] hover:bg-white/[0.025]'
                }`}
        >
            {active && (
                <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.06]">
                    <CheckIcon className="h-3 w-3 text-white" />
                </div>
            )}

            <div className="flex items-center gap-1.5">
                <span
                    className="h-4 w-4 rounded-full border border-white/20"
                    style={{ backgroundColor: palette.primary }}
                />

                <span
                    className="h-4 w-4 rounded-full border border-white/20"
                    style={{ backgroundColor: palette.accent }}
                />

                <span
                    className="h-4 w-4 rounded-full border border-white/20"
                    style={{ backgroundColor: palette.hover }}
                />

                <span
                    className="h-4 w-4 rounded-full border border-white/20"
                    style={{ backgroundColor: palette.surface }}
                />

                <span
                    className="h-4 w-4 rounded-full border border-white/20"
                    style={{ backgroundColor: palette.cardPrimary }}
                />
            </div>

            <p className="mt-3 text-[9px] uppercase tracking-[0.16em] text-zinc-600 transition group-hover:text-zinc-300">
                {palette.name}
            </p>
        </button>
    );
}

// Cover Image Preview

function CoverImagePreview({
    coverImage,
    positionX,
    positionY,
    zoom,
    offsetX,
    offsetY,
    aspectRatio,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    isDragging,
}: {
    coverImage: string | null;
    positionX: number;
    positionY: number;
    zoom: number;
    offsetX: number;
    offsetY: number;
    aspectRatio: number;
    onPointerDown: (
        event: PointerEvent<HTMLDivElement>,
    ) => void;
    onPointerMove: (
        event: PointerEvent<HTMLDivElement>,
    ) => void;
    onPointerUp: (
        event: PointerEvent<HTMLDivElement>,
    ) => void;
    isDragging: boolean;
}) {
    return (
        <div
            className={`group relative overflow-hidden bg-black select-none ${coverImage && isDragging
                ? 'cursor-grabbing'
                : coverImage
                    ? 'cursor-grab'
                    : 'cursor-pointer'
                }`}
            style={{
                aspectRatio,
                touchAction: coverImage
                    ? 'none'
                    : 'auto',
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
        >
            {coverImage ? (
                <div
                    className="absolute inset-0"
                    style={{
                        transform: `translate(${offsetX}px, ${offsetY}px)`,
                    }}
                >
                    <img
                        src={coverImage}
                        alt="Cover preview"
                        draggable={false}
                        className="pointer-events-none absolute inset-0 h-full w-full max-w-none object-cover select-none"
                        style={{
                            objectPosition: `${positionX}% ${positionY}%`,
                            transform: `scale(${zoom})`,
                            transformOrigin: 'center',
                        }}
                    />
                </div>
            ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-800 via-zinc-950 to-black">
                    <div className="text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.025] text-zinc-500">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                className="h-5 w-5"
                                aria-hidden="true"
                            >
                                <path
                                    d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5v-11Z"
                                    stroke="currentColor"
                                    strokeWidth="1.3"
                                />
                                <path
                                    d="m7 16 3.25-3.5 2.5 2.5 1.75-2 2.5 3"
                                    stroke="currentColor"
                                    strokeWidth="1.3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <circle
                                    cx="9"
                                    cy="8.5"
                                    r="1.25"
                                    stroke="currentColor"
                                    strokeWidth="1.3"
                                />
                            </svg>
                        </div>

                        <p className="mt-3 text-[10px] uppercase tracking-[0.18em] text-zinc-600">
                            No cover image
                        </p>

                        <p className="mt-1 text-[9px] text-zinc-700">
                            Click to upload
                        </p>
                    </div>
                </div>
            )}



            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

            {coverImage && (
                <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/35 px-4 py-2 text-[9px] uppercase tracking-[0.18em] text-white/70 opacity-0 backdrop-blur-md transition group-hover:opacity-100">
                    Drag to reposition
                </div>
            )}

            <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
                <div>
                    <p className="text-[9px] uppercase tracking-[0.2em] text-white/50">
                        Portfolio Hero
                    </p>

                    <p className="mt-1 text-xs text-white/80">
                        {coverImage
                            ? 'Drag image to reposition'
                            : 'Click anywhere to upload'}
                    </p>
                </div>
            </div>
        </div>
    );
}

// Wireframe helpers

function WireText({
    width = 'w-full',
    strong = false,
}: {
    width?: string;
    strong?: boolean;
}) {
    return (
        <span
            className={`block h-[2px] rounded-full ${strong ? 'bg-current opacity-45' : 'bg-current opacity-15'
                } ${width}`}
        />
    );
}

function WireImage({
    className = '',
    label = 'IMAGE',
    accentColor,
    light = false,
}: {
    className?: string;
    label?: string;
    accentColor: string;
    light?: boolean;
}) {
    return (
        <div
            className={`relative overflow-hidden border ${light
                ? 'border-black/10 bg-black/[0.035] text-black/35'
                : 'border-white/[0.08] bg-white/[0.025] text-white/30'
                } ${className}`}
        >
            <div
                className="absolute inset-0 opacity-30"
                style={{
                    backgroundImage: `linear-gradient(135deg, transparent 49.35%, ${accentColor} 49.7%, transparent 50.05%)`,
                    backgroundSize: '14px 14px',
                }}
            />
            <div
                className={`absolute inset-x-0 top-1/2 h-px ${light ? 'bg-black/8' : 'bg-white/[0.06]'
                    }`}
            />
            <div
                className={`absolute inset-y-0 left-1/2 w-px ${light ? 'bg-black/8' : 'bg-white/[0.06]'
                    }`}
            />
            <span className="absolute left-2 top-2 text-[5px] uppercase tracking-[0.2em]">
                {label}
            </span>
        </div>
    );
}

function WireNav({
    light = false,
    compact = false,
}: {
    light?: boolean;
    compact?: boolean;
}) {
    return (
        <div
            className={`flex items-center justify-between border-b px-3 ${compact ? 'py-2' : 'py-2.5'
                } ${light
                    ? 'border-black/10 text-black'
                    : 'border-white/[0.08] text-white'
                }`}
        >
            <div
                className={`h-1.5 ${compact ? 'w-8' : 'w-10'
                    } rounded-full ${light ? 'bg-black/55' : 'bg-white/55'}`}
            />
            <div className="flex items-center gap-2">
                {[0, 1, 2].map((item) => (
                    <span
                        key={item}
                        className={`h-1 w-5 rounded-full ${light ? 'bg-black/20' : 'bg-white/20'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}

function WireLabel({
    children,
    light = false,
}: {
    children: React.ReactNode;
    light?: boolean;
}) {
    return (
        <p
            className={`text-[5px] uppercase tracking-[0.22em] ${light ? 'text-black/40' : 'text-white/35'
                }`}
        >
            {children}
        </p>
    );
}

function WireDot({
    accentColor,
    light = false,
}: {
    accentColor: string;
    light?: boolean;
}) {
    return (
        <span
            className={`h-1.5 w-1.5 rounded-full ${light ? 'border border-black/20' : 'border border-white/20'
                }`}
            style={{
                backgroundColor: `${accentColor}88`,
                boxShadow: `0 0 8px ${accentColor}44`,
            }}
        />
    );
}

// Default wireframe

function DefaultWireframe({ accentColor }: { accentColor: string }) {
    return (
        <div className="relative min-h-[620px] overflow-hidden bg-[#090a0b] text-white">
            <div className="absolute inset-2 border border-white/[0.12]" />

            <div className="relative z-10 flex items-center justify-between px-4 py-4">
                <div className="flex items-center gap-2">
                    <span className="h-6 w-6 rounded-full border border-white/50" />
                    <span className="text-[8px] uppercase tracking-[0.28em] text-white/80">ARTIST NAME</span>
                </div>

                <div className="flex items-center gap-5 text-[6px] uppercase tracking-[0.22em] text-white/55">
                    <span>About</span>
                    <span>Projects</span>
                    <span>Galleries</span>
                </div>

                <span className="text-[6px] uppercase tracking-[0.2em] text-white/55">Explore ↗</span>
            </div>

            <div className="absolute inset-x-2 top-14 bottom-2 overflow-hidden border-t border-white/[0.06]">
                <div className="absolute inset-0 opacity-60">
                    <div className="absolute left-1/2 top-1/2 h-px w-[150%] -translate-x-1/2 -rotate-[25deg] bg-white/[0.12]" />
                    <div className="absolute left-1/2 top-1/2 h-px w-[150%] -translate-x-1/2 rotate-[25deg] bg-white/[0.12]" />
                </div>

                <WireImage
                    className="absolute left-1/2 top-[40%] h-20 w-24 -translate-x-1/2 -translate-y-1/2"
                    label=""
                    accentColor={accentColor}
                />

                <div className="absolute bottom-10 left-8 w-[48%]">
                    <div className="mb-2 flex items-center gap-2">
                        <span className="h-px w-8 bg-white/70" />
                        <span className="text-[6px] uppercase tracking-[0.2em] text-white/55">Musician • Manila, PH</span>
                    </div>
                    <div className="text-[42px] font-light uppercase leading-[0.82] tracking-[-0.06em] text-white/90">
                        ARTIST<br />NAME
                    </div>
                    <div className="mt-3 text-[6px] uppercase tracking-[0.2em] text-white/55">Explore <span className="ml-2 inline-block w-8 border-t border-white/50 align-middle" /></div>
                </div>

                <div className="absolute bottom-10 right-8 w-[29%] border-l border-white/35 pl-5">
                    <WireLabel>Artist Statement</WireLabel>
                    <WireText width="w-full" strong />
                    <WireText width="w-3/4" strong />
                    <div className="mt-4 flex items-center gap-3">
                        <span className="h-8 w-8 rounded-full border border-white/25" />
                        <div className="flex-1 space-y-1.5">
                            <WireText width="w-3/4" />
                            <WireText width="w-1/2" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Editorial wireframe

function EditorialWireframe({ accentColor }: { accentColor: string }) {
    return (
        <div className="overflow-hidden bg-[#08090b] text-white">
            <div className="flex items-center justify-between border-b border-white px-4 py-3">
                <span className="text-[8px] uppercase tracking-[0.35em]">ARTIST NAME</span>
                <div className="flex gap-5 text-[6px] uppercase tracking-[0.18em] text-white"><span>About</span><span>Projects</span><span>Galleries</span></div>
                <span className="text-[6px] uppercase tracking-[0.18em] text-white">Explore ↗</span>
            </div>

            <div className="grid grid-cols-[0.9fr_1.1fr] gap-5 px-5 py-6">
                <div className="flex flex-col justify-center">
                    <WireLabel light>Musician • Manila, PH</WireLabel>
                    <div className="mt-4 text-[42px] font-light uppercase leading-[0.82] tracking-[-0.06em]">ARTIST<br />NAME</div>
                    <p className="mt-5 max-w-[85%] text-[7px] leading-4 text-white">R&B Artist based in the Philippines. Creating music, visuals, and stories that connect.</p>
                    <div className="mt-5 flex gap-5 text-[5px] uppercase tracking-[0.18em] text-white"><span>Spotify</span><span>YouTube</span><span>Instagram</span></div>
                </div>

                <WireImage className="aspect-[1.38/1]" label="" accentColor={accentColor} light />
            </div>

            <div className="border-t border-white px-5 py-5">
                <div className="flex items-end justify-between">
                    <div>
                        <WireLabel light>Featured</WireLabel>
                        <div className="mt-2 text-[31px] font-light uppercase leading-none tracking-[-0.05em]">SELECTED WORK</div>
                    </div>
                    <span className="text-[5px] uppercase tracking-[0.18em] text-white">View all ↗</span>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                    <WireImage className="col-span-2 aspect-[1.7/1]" label="FEATURED" accentColor={accentColor} light />
                    <div className="flex flex-col justify-end border-l border-white pl-3">
                        <WireText width="w-full" strong />
                        <WireText width="w-4/5" strong />
                        <WireText width="w-2/3" />
                    </div>
                </div>
            </div>
        </div>
    );
}

// Canvas wireframe

function CanvasWireframe({ accentColor }: { accentColor: string }) {
    return (
        <div className="relative min-h-[620px] overflow-hidden bg-[#08090a] text-white">
            <div className="absolute inset-0 opacity-45 [background-image:radial-gradient(circle,rgba(255,255,255,0.16)_0.7px,transparent_0.8px)] [background-size:10px_10px]" />
            <div className="absolute inset-3 border border-white/[0.1]" />

            <div className="relative z-10 flex items-center justify-between px-5 py-4">
                <span className="text-[8px] uppercase tracking-[0.35em]">ARTIST NAME</span>
                <div className="flex gap-5 text-[6px] uppercase tracking-[0.2em] text-white/55"><span>About</span><span>Projects</span><span>Galleries</span></div>
            </div>

            <div className="relative z-10 mx-auto mt-4 h-[500px] w-[72%]">
                <div className="absolute left-[6%] top-[2%] text-[38px] font-light uppercase leading-[0.82] tracking-[-0.07em] text-white/90" style={{ fontFamily: 'cursive' }}>
                    + ART<br />CREATES<br />SPACE
                </div>
                <div className="absolute left-[8%] top-[45%] h-12 w-20 rounded-full border border-white/35" />

                <div className="absolute left-[37%] top-[17%] w-[34%] rotate-[-3deg]">
                    <WireImage className="aspect-[0.75/1]" label="" accentColor={accentColor} />
                    <span className="absolute -top-2 left-1/2 h-4 w-12 -translate-x-1/2 rotate-2 bg-white/15" />
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white px-3 py-1 text-[5px] uppercase tracking-[0.16em] text-black">Music • Visuals • Ideas</span>
                </div>

                <div className="absolute right-[5%] top-[8%] w-[19%] rotate-[6deg]">
                    <WireImage className="aspect-square" label="" accentColor={accentColor} />
                </div>
                <div className="absolute right-[2%] top-[43%] w-[24%] rotate-[3deg] bg-[#e8e5dd] p-3 text-[6px] uppercase leading-3 tracking-[0.1em] text-black">
                    MUSIC<br />VISUALS<br />STORIES<br />PEOPLE<br />PLACES
                </div>

                <div className="absolute left-[8%] bottom-[6%] text-[6px] uppercase tracking-[0.2em] text-white/50">R&B Artist<br />Manila, PH</div>
            </div>
        </div>
    );
}

// Motion wireframe

function MotionWireframe({ accentColor }: { accentColor: string }) {
    return (
        <div className="relative min-h-[620px] overflow-hidden bg-[#090a0b] text-white">
            <div className="absolute inset-2 border border-white/[0.12]" />
            <div className="absolute inset-4 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:52px_52px]" />

            <div className="relative z-10 flex items-center justify-between px-5 py-4">
                <span className="text-[8px] uppercase tracking-[0.35em]">ARTIST NAME</span>
                <div className="flex gap-5 text-[6px] uppercase tracking-[0.2em] text-white/55"><span>About</span><span>Projects</span><span>Galleries</span></div>
                <span className="text-[6px] uppercase tracking-[0.2em] text-white/55">Explore ↗</span>
            </div>

            <div className="absolute inset-4 top-14">
                <div className="absolute left-1/2 top-1/2 h-px w-[150%] -translate-x-1/2 -rotate-[27deg] bg-white/[0.14]" />
                <div className="absolute left-1/2 top-1/2 h-px w-[150%] -translate-x-1/2 rotate-[27deg] bg-white/[0.14]" />

                <div className="absolute left-[24%] top-[22%] w-[43%]">
                    <WireLabel>Musician</WireLabel>
                    <div className="mt-4 text-[46px] font-bold uppercase leading-[0.82] tracking-[-0.07em]">
                        MAKE<br />SOMETHING<br />THAT<br />LASTS.
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-[5px] uppercase tracking-[0.2em] text-white/55">
                        ARTIST NAME <span className="h-px w-7 bg-white/40" /> MANILA, PH
                    </div>
                    <span className="mt-5 inline-flex border border-white/55 px-4 py-2 text-[5px] uppercase tracking-[0.2em]">Selected Work —</span>
                </div>

                <WireImage
                    className="absolute right-[14%] top-[30%] h-28 w-[34%]"
                    label=""
                    accentColor={accentColor}
                />

                <div className="absolute bottom-8 right-[18%] text-[5px] uppercase tracking-[0.22em] text-white/45">Scroll to explore</div>
            </div>
        </div>
    );
}

// Musician wireframe

function MusicianWireframe({ accentColor }: { accentColor: string }) {
    return (
        <div className="overflow-hidden bg-[#08090b] text-white">
            <WireNav />

            <div className="relative border-b border-white/[0.08] px-4 py-5">
                <div className="absolute left-5 top-5 grid grid-cols-4 gap-1 opacity-50">
                    {Array.from({ length: 16 }).map((_, i) => <span key={i} className="h-1 w-1 rounded-full bg-white/40" />)}
                </div>
                <div className="absolute right-5 top-6 h-7 w-7 rotate-45 border border-white/35" />

                <div className="grid grid-cols-[0.82fr_1.18fr] items-center gap-4 pt-5">
                    <div>
                        <WireLabel>Musician</WireLabel>
                        <div className="mt-4 text-[40px] font-bold uppercase leading-[0.82] tracking-[-0.07em] text-white/90">ARTIST NAME</div>
                        <p className="mt-3 text-[7px] tracking-[0.08em] text-white/55">Make something that lasts.</p>
                        <div className="mt-4 flex gap-2">
                            <span className="border border-white/50 px-3 py-1.5 text-[5px] uppercase tracking-[0.16em]">Listen ↗</span>
                            <span className="border-b border-white/40 px-2 py-1.5 text-[5px] uppercase tracking-[0.16em]">Explore</span>
                        </div>
                        <div className="mt-4 flex gap-3 text-[5px] text-white/45">
                            <span>●</span><span>▶</span><span>◎</span><span>☁</span>
                        </div>
                    </div>

                    <div className="relative aspect-[1.65/1] overflow-hidden border border-white/35">
                        <WireImage className="absolute inset-0 h-full w-full border-0" label="" accentColor={accentColor} />
                        <div className="absolute inset-x-0 bottom-0 h-7 border-t border-white/20 bg-black/35" />
                        <div className="absolute bottom-3 left-4 right-4 h-px bg-white/25" />
                        <div className="absolute bottom-3 left-10 h-1 w-1 rounded-full bg-white" />
                    </div>
                </div>
            </div>

            <div className="border-b border-white/[0.08] px-4 py-5">
                <div className="mb-3 flex items-end justify-between">
                    <div>
                        <WireLabel>Latest Releases</WireLabel>
                        <div className="mt-2 text-[30px] font-bold uppercase leading-none tracking-[-0.06em]">MUSIC</div>
                    </div>
                    <span className="text-[5px] uppercase tracking-[0.16em] text-white/50">View all ↗</span>
                </div>

                <div className="grid grid-cols-[1.05fr_0.95fr] gap-4">
                    <div className="grid grid-cols-[1fr_0.9fr] gap-3">
                        <WireImage className="aspect-square" label="ALBUM" accentColor={accentColor} />
                        <div className="flex flex-col justify-center">
                            <WireLabel>Latest Release</WireLabel>
                            <div className="mt-2 text-[18px] font-bold uppercase leading-[0.85]">MUSIC TITLE</div>
                            <span className="mt-2 text-[5px] uppercase tracking-[0.16em] text-white/45">Single • 2024</span>
                            <div className="mt-4 h-px bg-white/20" />
                            <div className="mt-2 text-[5px] text-white/40">0:00 / 3:24</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        {['HORIZON', 'BETTER DAYS'].map((title) => (
                            <div key={title}>
                                <WireImage className="aspect-square" label="" accentColor={accentColor} />
                                <p className="mt-1.5 text-[5px] font-medium uppercase tracking-[0.12em]">{title}</p>
                                <p className="mt-1 text-[4px] uppercase tracking-[0.12em] text-white/35">2023 ↗</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function WireframePreview({
    template,
    accentColor,
}: {
    template: string;
    accentColor: string;
}) {
    if (template === 'editorial') {
        return <EditorialWireframe accentColor={accentColor} />;
    }

    if (template === 'canvas') {
        return <CanvasWireframe accentColor={accentColor} />;
    }

    if (template === 'motion') {
        return <MotionWireframe accentColor={accentColor} />;
    }

    if (template === 'musician') {
        return <MusicianWireframe accentColor={accentColor} />;
    }

    return <DefaultWireframe accentColor={accentColor} />;
}

function PortfolioSettingsLoading() {
    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050608] px-6 text-white">
            {/* Atmospheric background */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-1/2 top-1/2 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(139,108,255,0.13)_0%,rgba(53,223,255,0.07)_28%,transparent_68%)] blur-3xl" />

                <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]" />

                <span className="absolute left-[18%] top-[24%] h-1 w-1 animate-pulse rounded-full bg-white/70 shadow-[0_0_18px_rgba(255,255,255,0.65)]" />
                <span className="absolute right-[22%] top-[31%] h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-200/70 shadow-[0_0_20px_rgba(53,223,255,0.7)] [animation-delay:400ms]" />
                <span className="absolute bottom-[25%] left-[27%] h-1 w-1 animate-pulse rounded-full bg-fuchsia-200/60 shadow-[0_0_18px_rgba(240,90,191,0.65)] [animation-delay:800ms]" />
            </div>

            {/* Loading mark */}
            <div className="relative z-10 flex w-full max-w-sm flex-col items-center text-center">
                <div className="relative mb-8 flex h-28 w-28 items-center justify-center">
                    <div className="absolute inset-0 rounded-full border border-white/[0.07]" />

                    <div className="absolute inset-2 animate-[spin_10s_linear_infinite] rounded-full border border-dashed border-cyan-200/20" />

                    <div className="absolute inset-5 animate-[spin_7s_linear_infinite_reverse] rounded-full border border-dashed border-fuchsia-200/20" />

                    <div className="absolute inset-[31%] rounded-full bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.9),rgba(139,108,255,0.35)_28%,rgba(53,223,255,0.12)_58%,transparent_72%)] shadow-[0_0_45px_rgba(139,108,255,0.22)]" />

                    <img
                        src="/images/brand/Lira_logo.png"
                        alt="LIRA"
                        className="relative z-10 h-auto w-14 object-contain opacity-90 sm:w-16"
                    />
                </div>

                <p className="text-[9px] uppercase tracking-[0.42em] text-zinc-600">
                    LIRA / STUDIO / PORTFOLIO
                </p>

                <h1 className="mt-4 text-2xl font-light tracking-[-0.03em] text-white sm:text-3xl">
                    Building your <span className="bg-[linear-gradient(90deg,#fff,#9eeaff,#a393ff,#f28bd7)] bg-clip-text text-transparent">space.</span>
                </h1>

                <p className="mt-3 max-w-xs text-xs leading-6 text-zinc-500">
                    Preparing your portfolio settings. Just a moment while we shape everything for you.
                </p>

                <div className="mt-7 h-px w-32 overflow-hidden bg-white/[0.06]">
                    <div className="h-full w-1/2 animate-[loading_1.2s_ease-in-out_infinite] bg-[linear-gradient(90deg,transparent,#35dfff,#a393ff,#f28bd7,transparent)]" />
                </div>
            </div>

            <style>{`
                @keyframes loading {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(200%); }
                }
            `}</style>
        </div>
    );
}

export default function Settings({
    settings,
    profile,
    navigationItems: initialNavigationItems,
    galleryImages: initialGalleryImages,
}: Props) {
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            setIsInitialLoading(false);
        }, 1500);

        return () => window.clearTimeout(timer);
    }, []);

    const [template, setTemplate] = useState(
        settings.template,
    );

    const selectedTemplate = templates[template] ?? templates.default;
    const releases = profile.releases ?? [];

    /* Section Settings */

    const [showHero, setShowHero] = useState(
        settings.show_hero ?? true,
    );

    const [heroLabel, setHeroLabel] = useState(
        settings.hero_label ?? '',
    );

    const [heroStatement, setHeroStatement] = useState(
        settings.hero_statement ?? '',
    );

    const [canvasBackgroundText, setCanvasBackgroundText] =
        useState(settings.canvas_background_text ?? '');

    const [showWork, setShowWork] = useState(
        settings.show_work ?? true,
    );

    const [workLabel, setWorkLabel] = useState(
        settings.work_label ?? '',
    );

    const [workDescription, setWorkDescription] = useState(
        settings.work_description ?? '',
    );

    const [showAbout, setShowAbout] = useState(
        settings.show_about ?? true,
    );

    const [aboutLabel, setAboutLabel] = useState(
        settings.about_label ?? '',
    );

    const [showArtistMessage, setShowArtistMessage] =
        useState(settings.show_artist_message ?? false);

    const [artistMessageLabel, setArtistMessageLabel] =
        useState(settings.artist_message_label ?? '');

    const [artistMessage, setArtistMessage] =
        useState(settings.artist_message ?? '');

    const [showGallery, setShowGallery] = useState(
        settings.show_gallery ?? false,
    );

    const [galleryLabel, setGalleryLabel] = useState(
        settings.gallery_label ?? '',
    );

    const [galleryDescription, setGalleryDescription] =
        useState(settings.gallery_description ?? '');

    const defaultGalleryResponsive: GalleryResponsiveSettingsMap = {
        desktop: {
            display:
                settings.gallery_responsive?.desktop?.display ??
                settings.gallery_display ??
                'grid',

            columns: Number(
                settings.gallery_responsive?.desktop?.columns ??
                settings.gallery_columns ??
                3,
            ),

            image_aspect:
                settings.gallery_responsive?.desktop?.image_aspect ??
                settings.gallery_image_aspect ??
                'original',
        },

        tablet: {
            display:
                settings.gallery_responsive?.tablet?.display ??
                settings.gallery_display ??
                'grid',

            columns: Number(
                settings.gallery_responsive?.tablet?.columns ??
                Math.min(settings.gallery_columns ?? 3, 3),
            ),

            image_aspect:
                settings.gallery_responsive?.tablet?.image_aspect ??
                settings.gallery_image_aspect ??
                'original',
        },

        mobile: {
            display:
                settings.gallery_responsive?.mobile?.display ??
                settings.gallery_display ??
                'grid',

            columns: Number(
                settings.gallery_responsive?.mobile?.columns ?? 1,
            ),

            image_aspect:
                settings.gallery_responsive?.mobile?.image_aspect ??
                settings.gallery_image_aspect ??
                'original',
        },
    };

    const [galleryResponsive, setGalleryResponsive] =
        useState<GalleryResponsiveSettingsMap>(
            defaultGalleryResponsive,
        );

    const [galleryDevice, setGalleryDevice] = useState<
        'desktop' | 'tablet' | 'mobile'
    >('desktop');

    const [galleryShowCaptions, setGalleryShowCaptions] =
        useState(settings.gallery_show_captions ?? true);

    const [galleryShowTitles, setGalleryShowTitles] =
        useState(settings.gallery_show_titles ?? true);

    const [galleryEnableLightbox, setGalleryEnableLightbox] =
        useState(settings.gallery_enable_lightbox ?? true);

    const [galleryImages, setGalleryImages] = useState<
        GalleryImage[]
    >(
        (initialGalleryImages ?? []).map((image) => ({
            id: image.id,
            image: image.image,
            title: image.title ?? '',
            caption: image.caption ?? '',
            alt_text: image.alt_text ?? '',
            sort_order: image.sort_order ?? 0,
        })),
    );

    const [musicLabel, setMusicLabel] = useState(
        settings.music_label ?? '',
    );

    const [showNavigation, setShowNavigation] = useState(
        settings.show_navigation ?? true,
    );

    const [navigationItemState, setNavigationItemState] =
        useState<NavigationItem[]>(
            initialNavigationItems.map((item, index) => ({
                ...item,
                sort_order: item.sort_order ?? index,
                url: item.url ?? null,
            })),
        );

    const [showFooter, setShowFooter] = useState(
        settings.show_footer ?? true,
    );

    const [footerLabel, setFooterLabel] = useState(
        settings.footer_label ?? '',
    );

    const [footerMessage, setFooterMessage] = useState(
        settings.footer_message ?? '',
    );

    const [showFooterSocials, setShowFooterSocials] =
        useState(settings.show_footer_socials ?? true);

    const [footerLogo, setFooterLogo] = useState<File | null>(
        null,
    );

    const [footerLogoError, setFooterLogoError] =
        useState<string | null>(null);

    const [footerLogoPreview, setFooterLogoPreview] =
        useState<string | null>(
            getImageUrl(settings.footer_logo),
        );

    const [removeFooterLogo, setRemoveFooterLogo] =
        useState(false);

    const [copyrightText, setCopyrightText] = useState(
        settings.copyright_text ?? '',
    );

    const [showPoweredByLira, setShowPoweredByLira] =
        useState(settings.show_powered_by_lira ?? true);

    // Music Settings

    const [showMusic, setShowMusic] = useState(
        settings.show_music ?? true,
    );

    const [musicReleaseDisplay, setMusicReleaseDisplay] =
        useState<'latest' | 'all'>(
            settings.music_release_display ?? 'latest',
        );

    const [musicReleaseLimit, setMusicReleaseLimit] =
        useState(
            Number(settings.music_release_limit ?? 6),
        );

    const [featuredReleaseId, setFeaturedReleaseId] =
        useState<number | null>(
            settings.featured_release_id ?? null,
        );

    const [showMusicLinks, setShowMusicLinks] = useState(
        settings.show_music_links ?? true,
    );

    const [primaryColor, setPrimaryColor] = useState(
        settings.primary_color,
    );

    const [backgroundColor, setBackgroundColor] =
        useState(settings.background_color);

    const [textColor, setTextColor] = useState(
        settings.text_color,
    );

    const [accentColor, setAccentColor] = useState(
        settings.accent_color,
    );

    const [hoverColor, setHoverColor] = useState(
        settings.hover_color,
    );

    const [surfaceColor, setSurfaceColor] = useState(
        settings.surface_color,
    );

    const [mutedTextColor, setMutedTextColor] = useState(
        settings.muted_text_color,
    );

    const [borderColor, setBorderColor] = useState(
        settings.border_color,
    );

    const [cardBackgroundColor, setCardBackgroundColor] =
        useState(settings.card_background_color);

    const [cardTextColor, setCardTextColor] = useState(
        settings.card_text_color,
    );

    const [cardAccentColor, setCardAccentColor] =
        useState(settings.card_accent_color);

    const [cardPrimaryColor, setCardPrimaryColor] = useState(
        settings.card_primary_color,
    );

    const [cardHoverColor, setCardHoverColor] = useState(
        settings.card_hover_color,
    );

    // Cover Image State

    const [coverImage, setCoverImage] =
        useState<File | null>(null);

    const [coverImagePreview, setCoverImagePreview] =
        useState<string | null>(
            getImageUrl(
                settings.cover_image ??
                profile.cover_image,
            ),
        );

    const [coverImageError, setCoverImageError] =
        useState<string | null>(null);

    const [removeCoverImage, setRemoveCoverImage] =
        useState(false);

    const [coverImagePositionX, setCoverImagePositionX] =
        useState(
            Number(settings.cover_image_position_x ?? 50),
        );

    const [coverImagePositionY, setCoverImagePositionY] =
        useState(
            Number(settings.cover_image_position_y ?? 50),
        );

    const [coverImageZoom, setCoverImageZoom] =
        useState(
            Number(settings.cover_image_zoom ?? 1),
        );

    const [coverImageOffsetX, setCoverImageOffsetX] =
        useState(0);

    const [coverImageOffsetY, setCoverImageOffsetY] =
        useState(0);

    const [isDraggingCover, setIsDraggingCover] =
        useState(false);

    const coverPreviewRef =
        useRef<HTMLDivElement | null>(null);

    const dragStartRef = useRef<{
        x: number;
        y: number;
        positionX: number;
        positionY: number;
        offsetX: number;
        offsetY: number;
    } | null>(null);

    const fileInputRef =
        useRef<HTMLInputElement | null>(null);

    const [saving, setSaving] = useState(false);

    const [validationErrors, setValidationErrors] = useState<
        Record<string, string>
    >({});

    const [activeSection, setActiveSection] =
        useState('foundation');

    const [viewportRatio, setViewportRatio] = useState(
        () => window.innerWidth / window.innerHeight,
    );

    useEffect(() => {
        function updateViewportRatio() {
            setViewportRatio(
                window.innerWidth / window.innerHeight,
            );
        }

        updateViewportRatio();

        window.addEventListener(
            'resize',
            updateViewportRatio,
        );

        return () => {
            window.removeEventListener(
                'resize',
                updateViewportRatio,
            );
        };
    }, []);

    // Load saved offsets into pixel values

    useLayoutEffect(() => {
        const editor = coverPreviewRef.current;

        if (!editor) {
            return;
        }

        setCoverImageOffsetX(
            (Number(settings.cover_image_offset_x ?? 0) / 100) *
            editor.clientWidth,
        );

        setCoverImageOffsetY(
            (Number(settings.cover_image_offset_y ?? 0) / 100) *
            editor.clientHeight,
        );
    }, [
        settings.cover_image_offset_x,
        settings.cover_image_offset_y,
    ]);

    // Blob Preview Cleanup

    useEffect(() => {
        return () => {
            if (
                coverImagePreview?.startsWith('blob:')
            ) {
                URL.revokeObjectURL(
                    coverImagePreview,
                );
            }
        };
    }, [coverImagePreview]);

    // Cover Image Validation

    function validateCoverImageDimensions(
        file: File,
    ): Promise<{
        valid: boolean;
        width: number;
        height: number;
    }> {
        return new Promise((resolve) => {
            const image = new Image();

            const objectUrl =
                URL.createObjectURL(file);

            image.onload = () => {
                const width = image.naturalWidth;
                const height = image.naturalHeight;

                URL.revokeObjectURL(objectUrl);

                resolve({
                    valid:
                        width >= 2660 &&
                        height >= 1140,
                    width,
                    height,
                });
            };

            image.onerror = () => {
                URL.revokeObjectURL(objectUrl);

                resolve({
                    valid: false,
                    width: 0,
                    height: 0,
                });
            };

            image.src = objectUrl;
        });
    }

    // Cover Image Upload

    async function handleCoverImageChange(
        event: ChangeEvent<HTMLInputElement>,
    ) {
        const file =
            event.target.files?.[0] ?? null;

        setCoverImageError(null);

        if (!file) {
            return;
        }

        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'image/gif',
        ];

        if (!allowedTypes.includes(file.type)) {
            setCoverImage(null);
            setCoverImageError(
                'Please select a JPEG, PNG, or GIF image.',
            );
            event.target.value = '';
            return;
        }

        const maxSize = 5 * 1024 * 1024;

        if (file.size > maxSize) {
            setCoverImage(null);
            setCoverImageError(
                'The cover image must be 5 MB or smaller.',
            );
            event.target.value = '';
            return;
        }

        const dimensions =
            await validateCoverImageDimensions(file);

        // if (!dimensions.valid) {
        //     setCoverImage(null);
        //     setCoverImageError(
        //         `The cover image must be at least 2660 × 1140 px. This image is ${dimensions.width} × ${dimensions.height} px.`,
        //     );
        //     event.target.value = '';
        //     return;
        // }

        const previousPreview =
            coverImagePreview;

        const previewUrl =
            URL.createObjectURL(file);

        setCoverImage(file);
        setCoverImagePreview(previewUrl);

        setRemoveCoverImage(false);

        // Reset New Image Position

        setCoverImagePositionX(50);
        setCoverImagePositionY(50);
        setCoverImageZoom(1);
        setCoverImageOffsetX(0);
        setCoverImageOffsetY(0);

        if (
            previousPreview?.startsWith('blob:')
        ) {
            URL.revokeObjectURL(
                previousPreview,
            );
        }
    }

    // Open File Picker

    function openCoverImagePicker() {
        fileInputRef.current?.click();
    }

    // Remove Cover Image

    function handleRemoveCoverImage() {
        setCoverImage(null);
        setCoverImagePreview(null);
        setRemoveCoverImage(true);
        setCoverImageError(null);

        setCoverImagePositionX(50);
        setCoverImagePositionY(50);
        setCoverImageZoom(1);
        setCoverImageOffsetX(0);
        setCoverImageOffsetY(0);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }

    // Drag Cover Image

    function handleCoverPointerDown(
        event: PointerEvent<HTMLDivElement>,
    ) {
        if (!coverImagePreview) {
            openCoverImagePicker();
            return;
        }

        const target =
            event.target as HTMLElement;

        // Don't start dragging from controls.

        if (
            target.closest('button') ||
            target.closest('input') ||
            target.closest('label')
        ) {
            return;
        }

        event.preventDefault();

        event.currentTarget.setPointerCapture(
            event.pointerId,
        );

        setIsDraggingCover(true);

        dragStartRef.current = {
            x: event.clientX,
            y: event.clientY,
            positionX: coverImagePositionX,
            positionY: coverImagePositionY,
            offsetX: coverImageOffsetX,
            offsetY: coverImageOffsetY,
        };
    }

    function handleCoverPointerMove(
        event: PointerEvent<HTMLDivElement>,
    ) {
        if (
            !isDraggingCover ||
            !dragStartRef.current
        ) {
            return;
        }

        event.preventDefault();

        const rect =
            event.currentTarget.getBoundingClientRect();

        const deltaX =
            ((event.clientX - dragStartRef.current.x) /
                rect.width) *
            100;

        const deltaY =
            ((event.clientY - dragStartRef.current.y) /
                rect.height) *
            100;

        // Same crop-position behaviour as the project editor.

        setCoverImagePositionX(
            Math.max(
                0,
                Math.min(
                    100,
                    dragStartRef.current.positionX -
                    deltaX,
                ),
            ),
        );

        setCoverImagePositionY(
            Math.max(
                0,
                Math.min(
                    100,
                    dragStartRef.current.positionY -
                    deltaY,
                ),
            ),
        );

        // Additional pixel movement available from zoom.

        const zoomFactor = coverImageZoom;

        const maxOffsetX =
            (rect.width * (zoomFactor - 1)) / 2;

        const maxOffsetY =
            (rect.height * (zoomFactor - 1)) / 2;

        const offsetDeltaX =
            event.clientX - dragStartRef.current.x;

        const offsetDeltaY =
            event.clientY - dragStartRef.current.y;

        setCoverImageOffsetX(
            Math.max(
                -maxOffsetX,
                Math.min(
                    maxOffsetX,
                    dragStartRef.current.offsetX +
                    offsetDeltaX,
                ),
            ),
        );

        setCoverImageOffsetY(
            Math.max(
                -maxOffsetY,
                Math.min(
                    maxOffsetY,
                    dragStartRef.current.offsetY +
                    offsetDeltaY,
                ),
            ),
        );
    }

    function stopCoverDragging(
        event: PointerEvent<HTMLDivElement>,
    ) {
        if (
            event.currentTarget.hasPointerCapture(
                event.pointerId,
            )
        ) {
            event.currentTarget.releasePointerCapture(
                event.pointerId,
            );
        }

        setIsDraggingCover(false);
        dragStartRef.current = null;
    }

    // Palettes

    const palettes: Palette[] = [
        {
            name: 'Chrome',
            primary: '#ffffff',
            background: '#050607',
            text: '#f5f5f5',
            accent: '#7de7ff',
            hover: '#35dfff',
            surface: '#0d0f12',
            mutedText: '#8a8f98',
            border: '#ffffff',
            cardBackground: '#0b0d0f',
            cardText: '#f5f5f5',
            cardAccent: '#9d8cff',
            cardPrimary: '#ffffff',
            cardHover: '#35dfff',
        },
        {
            name: 'Nocturne',
            primary: '#d9c7ff',
            background: '#0b0810',
            text: '#f4efff',
            accent: '#c084fc',
            hover: '#e9b8ff',
            surface: '#15101d',
            mutedText: '#9b91aa',
            border: '#d9c7ff',
            cardBackground: '#15101d',
            cardText: '#eee6ff',
            cardAccent: '#f0abfc',
            cardPrimary: '#fff5ff',
            cardHover: '#f0abfc',
        },
        {
            name: 'Mono',
            primary: '#ffffff',
            background: '#080808',
            text: '#ffffff',
            accent: '#b8b8b8',
            hover: '#ffffff',
            surface: '#141414',
            mutedText: '#858585',
            border: '#ffffff',
            cardBackground: '#141414',
            cardText: '#f2f2f2',
            cardAccent: '#ffffff',
            cardPrimary: '#ffffff',
            cardHover: '#d8d8d8',
        },
        {
            name: 'Aurora',
            primary: '#d9fff8',
            background: '#06100f',
            text: '#e9fffb',
            accent: '#58e6cf',
            hover: '#8ef5e4',
            surface: '#0b1917',
            mutedText: '#7ea39c',
            border: '#58e6cf',
            cardBackground: '#0b1917',
            cardText: '#d9f8f2',
            cardAccent: '#8ef5e4',
            cardPrimary: '#d9fff8',
            cardHover: '#58e6cf',
        },
        {
            name: 'Electric',
            primary: '#e9ecff',
            background: '#070914',
            text: '#edf0ff',
            accent: '#6685ff',
            hover: '#8ba1ff',
            surface: '#0d1224',
            mutedText: '#7e87a8',
            border: '#6685ff',
            cardBackground: '#0d1224',
            cardText: '#dce2ff',
            cardAccent: '#8ba1ff',
            cardPrimary: '#e9ecff',
            cardHover: '#6685ff',
        },
        {
            name: 'Gallery',
            primary: '#f2f0eb',
            background: '#f2f0eb',
            text: '#222222',
            accent: '#111111',
            hover: '#000000',
            surface: '#ffffff',
            mutedText: '#000000',
            border: '#171717',
            cardBackground: '#ffffff',
            cardText: '#555555',
            cardAccent: '#171717',
            cardPrimary: '#171717',
            cardHover: '#000000',
        },
        {
            name: 'Rose',
            primary: '#fff1f7',
            background: '#13080d',
            text: '#ffeef4',
            accent: '#f05abf',
            hover: '#ff8ed3',
            surface: '#211018',
            mutedText: '#a77d90',
            border: '#f05abf',
            cardBackground: '#211018',
            cardText: '#f8dce8',
            cardAccent: '#ff8ed3',
            cardPrimary: '#fff1f7',
            cardHover: '#f05abf',
        },
        {
            name: 'Ivory',
            primary: '#201c17',
            background: '#eee9df',
            text: '#302b25',
            accent: '#9b7750',
            hover: '#b88d5c',
            surface: '#f8f5ee',
            mutedText: '#7c7267',
            border: '#9b7750',
            cardBackground: '#f8f5ee',
            cardText: '#5e564d',
            cardAccent: '#8a6744',
            cardPrimary: '#201c17',
            cardHover: '#9b7750',
        },
    ];

    const applyPalette = (palette: Palette) => {
        setPrimaryColor(palette.primary);
        setBackgroundColor(palette.background);
        setTextColor(palette.text);
        setAccentColor(palette.accent);
        setHoverColor(palette.hover);
        setSurfaceColor(palette.surface);
        setMutedTextColor(palette.mutedText);
        setBorderColor(palette.border);
        setCardBackgroundColor(palette.cardBackground);
        setCardTextColor(palette.cardText);
        setCardAccentColor(palette.cardAccent);
        setCardPrimaryColor(palette.cardPrimary);
        setCardHoverColor(palette.cardHover);
    };

    const coverEditorWidth =
        coverPreviewRef.current?.clientWidth ?? 0;

    const coverEditorHeight =
        coverPreviewRef.current?.clientHeight ?? 0;

    const coverImageOffsetXPercent =
        coverEditorWidth > 0
            ? (coverImageOffsetX / coverEditorWidth) * 100
            : Number(settings.cover_image_offset_x ?? 0);

    const coverImageOffsetYPercent =
        coverEditorHeight > 0
            ? (coverImageOffsetY / coverEditorHeight) * 100
            : Number(settings.cover_image_offset_y ?? 0);

    /* Navigation */

    function getAvailableNavigationDestination() {
        return (
            navigationDestinations.find(
                (destination) =>
                    destination.value === 'external' ||
                    !navigationItemState.some(
                        (item) =>
                            item.destination ===
                            destination.value,
                    ),
            )?.value ?? 'external'
        );
    }

    function addNavigationItem() {
        const availableDestination =
            navigationDestinations.find(
                (destination) =>
                    destination.value === 'external' ||
                    !navigationItemState.some(
                        (item) =>
                            item.destination ===
                            destination.value,
                    ),
            )?.value ?? 'external';

        getAvailableNavigationDestination();

        setNavigationItemState((items) => [
            ...items,
            {
                label: 'New Link',
                destination: availableDestination,
                url: null,
                sort_order: items.length,
                is_visible: true,
            },
        ]);
    }

    function updateNavigationItem(
        index: number,
        updates: Partial<NavigationItem>,
    ) {
        setNavigationItemState((items) =>
            items.map((item, itemIndex) =>
                itemIndex === index
                    ? { ...item, ...updates }
                    : item,
            ),
        );
    }

    function removeNavigationItem(index: number) {
        setNavigationItemState((items) =>
            items
                .filter((_, itemIndex) => itemIndex !== index)
                .map((item, itemIndex) => ({
                    ...item,
                    sort_order: itemIndex,
                })),
        );
    }

    function moveNavigationItem(
        index: number,
        direction: 'up' | 'down',
    ) {
        setNavigationItemState((items) => {
            const targetIndex =
                direction === 'up'
                    ? index - 1
                    : index + 1;

            if (
                targetIndex < 0 ||
                targetIndex >= items.length
            ) {
                return items;
            }

            const nextItems = [...items];

            [
                nextItems[index],
                nextItems[targetIndex],
            ] = [
                    nextItems[targetIndex],
                    nextItems[index],
                ];

            return nextItems.map((item, itemIndex) => ({
                ...item,
                sort_order: itemIndex,
            }));
        });
    }

    const navigationDestinations = [
        { value: 'home', label: 'Home' },
        { value: 'work', label: 'Selected Work' },
        { value: 'gallery', label: 'Gallery' },
        { value: 'music', label: 'Music' },
        { value: 'about', label: 'About' },
        { value: 'artist_message', label: 'Artist Message' },
        { value: 'contact', label: 'Contact' },
        { value: 'footer', label: 'Footer' },
        { value: 'external', label: 'External URL' },
    ];

    function isNavigationDestinationUsed(
        destination: string,
        currentIndex: number,
    ) {
        if (destination === 'external') {
            return false;
        }

        return navigationItemState.some(
            (item, index) =>
                index !== currentIndex &&
                item.destination === destination,
        );
    }

    /* Gallery */

    function updateGalleryResponsive(
        updates: Partial<GalleryResponsiveSettings>,
    ) {
        setGalleryResponsive((current) => ({
            ...current,

            [galleryDevice]: {
                ...current[galleryDevice],
                ...updates,
            },
        }));
    }

    function getGalleryColumnOptions() {
        switch (galleryDevice) {
            case 'mobile':
                return [1, 2];

            case 'tablet':
                return [2, 3, 4];

            case 'desktop':
            default:
                return [2, 3, 4, 5];
        }
    }

    const [draggingGalleryIndex, setDraggingGalleryIndex] =
        useState<number | null>(null);

    function reorderGalleryImages(
        fromIndex: number,
        toIndex: number,
    ) {
        if (
            fromIndex === toIndex ||
            fromIndex < 0 ||
            toIndex < 0 ||
            fromIndex >= galleryImages.length ||
            toIndex >= galleryImages.length
        ) {
            return;
        }


        setGalleryImages((current) => {
            const next = [...current];
            const [moved] = next.splice(fromIndex, 1);

            next.splice(toIndex, 0, moved);

            return next.map((image, index) => ({
                ...image,
                sort_order: index,
            }));
        });
    }

    function handleGalleryDragStart(index: number) {
        setDraggingGalleryIndex(index);
    }

    function handleGalleryDragOver(
        event: DragEvent<HTMLDivElement>,
    ) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }

    function handleGalleryDrop(
        event: DragEvent<HTMLDivElement>,
        targetIndex: number,
    ) {
        event.preventDefault();

        if (draggingGalleryIndex === null) {
            return;
        }

        reorderGalleryImages(
            draggingGalleryIndex,
            targetIndex,
        );

        setDraggingGalleryIndex(null);
    }

    function handleGalleryDragEnd() {
        setDraggingGalleryIndex(null);
    }

    /* Settings Navigation */

    function selectSettingsSection(id: string) {
        setActiveSection(id);
    }

    const settingsGroups = [
        {
            id: 'foundation',
            label: 'Foundation',
            description: 'Templates',
        },
        {
            id: 'theme',
            label: 'Theme',
            description: 'Presets, colors, and project cards',
        },
        {
            id: 'hero',
            label: 'Hero',
            description: 'Cover image and hero',
        },
        {
            id: 'content',
            label: 'Content',
            description: 'Work, about, message, and gallery',
        },
        {
            id: 'media',
            label: 'Media',
            description: 'Music',
        },
        {
            id: 'site',
            label: 'Site',
            description: 'Navigation and footer',
        },
    ] as const;

    function focusFirstError(
        errors: Record<string, string>,
    ) {
        const errorKeys = Object.keys(errors);

        if (errorKeys.length === 0) {
            return;
        }

        const firstError = errorKeys[0];

        let section:
            | 'hero'
            | 'content'
            | 'site'
            | null = null;

        let selector: string | null = null;

        if (firstError === 'cover_image') {
            section = 'hero';
            selector = '#cover_image';
        } else if (firstError === 'footer_logo') {
            section = 'site';
            selector = '#footer_logo';
        }

        if (!selector || !section) {
            return;
        }

        setActiveSection(section);

        window.setTimeout(() => {
            const element = document.querySelector<
                HTMLInputElement
            >(selector);

            if (!element) {
                return;
            }

            element.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });

            element.focus({
                preventScroll: true,
            });
        }, 50);
    }

    /* Submit */

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setSaving(true);

        const editor =
            coverPreviewRef.current;

        const offsetXPercent = editor
            ? (coverImageOffsetX / editor.clientWidth) * 100
            : Number(settings.cover_image_offset_x ?? 0);

        const offsetYPercent = editor
            ? (coverImageOffsetY / editor.clientHeight) * 100
            : Number(settings.cover_image_offset_y ?? 0);

        const galleryResponsivePayload = {
            desktop: {
                display: galleryResponsive.desktop.display,
                columns: galleryResponsive.desktop.columns,
                image_aspect:
                    galleryResponsive.desktop.image_aspect,
            },
            tablet: {
                display: galleryResponsive.tablet.display,
                columns: galleryResponsive.tablet.columns,
                image_aspect:
                    galleryResponsive.tablet.image_aspect,
            },
            mobile: {
                display: galleryResponsive.mobile.display,
                columns: galleryResponsive.mobile.columns,
                image_aspect:
                    galleryResponsive.mobile.image_aspect,
            },
        };

        router.post(
            '/dashboard/portfolio/settings',
            {
                _method: 'put',

                template,

                primary_color: primaryColor,
                background_color: backgroundColor,
                text_color: textColor,
                accent_color: accentColor,
                hover_color: hoverColor,
                surface_color: surfaceColor,
                muted_text_color: mutedTextColor,
                border_color: borderColor,
                card_background_color: cardBackgroundColor,
                card_text_color: cardTextColor,
                card_accent_color: cardAccentColor,

                cover_image: coverImage,
                remove_cover_image: removeCoverImage,
                cover_image_position_x: coverImagePositionX,
                cover_image_position_y: coverImagePositionY,
                cover_image_zoom: coverImageZoom,
                cover_image_offset_x: offsetXPercent,
                cover_image_offset_y: offsetYPercent,

                show_music: showMusic,
                music_release_display: musicReleaseDisplay,
                music_release_limit: musicReleaseLimit,
                featured_release_id: featuredReleaseId,
                show_music_links: showMusicLinks,

                card_primary_color: cardPrimaryColor,
                card_hover_color: cardHoverColor,

                show_hero: showHero,
                hero_label: heroLabel || null,
                hero_statement: heroStatement || null,
                canvas_background_text:
                    canvasBackgroundText || null,

                show_work: showWork,
                work_label: workLabel || null,
                work_description: workDescription || null,

                show_about: showAbout,
                about_label: aboutLabel || null,

                show_artist_message: showArtistMessage,
                artist_message_label: artistMessageLabel || null,
                artist_message: artistMessage || null,

                show_gallery: showGallery,
                gallery_label: galleryLabel || null,
                gallery_description:
                    galleryDescription || null,

                gallery_display:
                    galleryResponsive.desktop.display,

                gallery_columns:
                    galleryResponsive.desktop.columns,

                gallery_image_aspect:
                    galleryResponsive.desktop.image_aspect,

                gallery_responsive:
                    galleryResponsive as FormDataConvertible,

                gallery_show_captions:
                    galleryShowCaptions,

                gallery_show_titles:
                    galleryShowTitles,

                gallery_enable_lightbox:
                    galleryEnableLightbox,

                gallery_order: galleryImages.map(
                    (image, index) => ({
                        id: image.id,
                        sort_order: index,
                    }),
                ),

                music_label: musicLabel || null,

                show_navigation: showNavigation,

                navigation_items: navigationItemState.map(
                    (item, index) => ({
                        ...(item.id ? { id: item.id } : {}),
                        label: item.label,
                        destination: item.destination,
                        url: item.destination === 'external'
                            ? item.url
                            : null,
                        sort_order: index,
                        is_visible: item.is_visible,
                    }),
                ),

                show_footer: showFooter,
                footer_label: footerLabel || null,
                footer_message: footerMessage || null,
                show_footer_socials: showFooterSocials,
                footer_logo: footerLogo,
                remove_footer_logo: removeFooterLogo,
                copyright_text: copyrightText || null,
                show_powered_by_lira: showPoweredByLira,

            },
            {
                forceFormData: true,
                preserveScroll: true,

                onError: (errors) => {
                    const serverErrors =
                        errors as Record<string, string>;

                    setValidationErrors(serverErrors);
                    setCoverImageError(
                        serverErrors.cover_image ?? null,
                    );
                    setFooterLogoError(
                        serverErrors.footer_logo ?? null,
                    );

                    focusFirstError(serverErrors);
                },

                onFinish: () => {
                    setSaving(false);
                },
            },
        );
    }

    if (isInitialLoading) {
        return <PortfolioSettingsLoading />;
    }

    return (
        <DashboardLayout>
            <div className="mx-auto w-full max-w-[1920px] px-4 py-6 pb-24 sm:px-6 sm:py-8 sm:pb-24 lg:px-8 lg:py-10 lg:pb-24 xl:pb-10 2xl:px-10">
                {/* PAGE HEADER */}

                <div className="mb-6 sm:mb-8 lg:mb-10">
                    <div className="mb-5 flex items-center gap-3">
                        <span className="h-px w-8 bg-[linear-gradient(90deg,#ffffff,#7d8991,transparent)]" />

                        <span className="text-[9px] uppercase tracking-[0.35em] text-zinc-600">
                            LIRA / STUDIO / PORTFOLIO
                        </span>
                    </div>

                    <h1 className="text-2xl font-light tracking-[-0.055em] text-white sm:text-4xl lg:text-5xl">
                        Shape your{' '}
                        <span className="bg-[linear-gradient(90deg,#fff_0%,#bdefff_24%,#9d8cff_58%,#f08bd7_82%,#fff_100%)] bg-clip-text text-transparent">
                            space.
                        </span>
                    </h1>

                    <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-500 sm:mt-4 sm:text-base sm:leading-7">
                        Customize the visual identity of your
                        public portfolio and see your changes
                        reflected in the actual template.
                    </p>
                </div>

                <form
                    onSubmit={submit}
                    className="grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-[190px_minmax(0,1fr)] lg:gap-6 xl:grid-cols-[220px_minmax(0,1fr)_300px] 2xl:grid-cols-[240px_minmax(0,1fr)_340px]"
                >
                    {/* Section Navigation */}

                    <aside className="xl:sticky xl:top-24 xl:self-start">
                        <div className="hidden rounded-2xl border border-white/[0.07] bg-[#0a0b0d]/90 p-2 shadow-[0_16px_40px_rgba(0,0,0,0.2)] backdrop-blur-xl lg:block">
                            <div className="px-3 pb-3 pt-3">
                                <p className="text-[8px] uppercase tracking-[0.24em] text-zinc-600">
                                    Portfolio Settings
                                </p>

                                <p className="mt-1 text-xs leading-5 text-zinc-400">
                                    Choose a category to customize.
                                </p>
                            </div>

                            <nav
                                aria-label="Portfolio settings categories"
                                className="space-y-1"
                            >
                                {settingsGroups.map(
                                    (group, index) => {
                                        const active =
                                            activeSection === group.id;

                                        return (
                                            <button
                                                key={group.id}
                                                type="button"
                                                onClick={() =>
                                                    selectSettingsSection(
                                                        group.id,
                                                    )
                                                }
                                                className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${active
                                                    ? 'bg-white/[0.07] text-white'
                                                    : 'text-zinc-500 hover:bg-white/[0.035] hover:text-zinc-200'
                                                    }`}
                                            >
                                                <span
                                                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-[9px] font-medium tabular-nums transition"
                                                    style={{
                                                        borderColor: active
                                                            ? `${SETTINGS_UI_ACCENT}45`
                                                            : 'rgba(255,255,255,0.08)',
                                                        backgroundColor: active
                                                            ? `${SETTINGS_UI_ACCENT}10`
                                                            : 'rgba(255,255,255,0.02)',
                                                        color: active
                                                            ? SETTINGS_UI_ACCENT
                                                            : 'rgba(255,255,255,0.35)',
                                                    }}
                                                >
                                                    {String(index + 1).padStart(
                                                        2,
                                                        '0',
                                                    )}
                                                </span>

                                                <span className="min-w-0">
                                                    <span className="block text-[10px] font-medium">
                                                        {group.label}
                                                    </span>

                                                    <span className="mt-0.5 block truncate text-[8px] leading-4 text-zinc-600 transition group-hover:text-zinc-500">
                                                        {group.description}
                                                    </span>
                                                </span>
                                            </button>
                                        );
                                    },
                                )}
                            </nav>
                        </div>

                        {/* Mobile Navigation */}

                        <div className="lg:hidden">
                            <div className="rounded-2xl border border-white/[0.08] bg-[#0a0b0d]/95 p-3 shadow-[0_16px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-4">
                                <div className="mb-3">
                                    <p className="text-[8px] uppercase tracking-[0.2em] text-zinc-600">
                                        Customize section
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-zinc-500">
                                        Choose what you want to customize.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                    {settingsGroups.map(
                                        (group, index) => {
                                            const active =
                                                activeSection === group.id;

                                            return (
                                                <button
                                                    key={group.id}
                                                    type="button"
                                                    onClick={() =>
                                                        selectSettingsSection(
                                                            group.id,
                                                        )
                                                    }
                                                    className={`min-w-0 rounded-xl border px-3 py-3 text-left transition ${active
                                                        ? 'border-white/[0.14] bg-white/[0.07] text-white'
                                                        : 'border-white/[0.06] bg-white/[0.02] text-zinc-500 hover:border-white/[0.1] hover:bg-white/[0.04] hover:text-zinc-200'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span
                                                            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[8px] font-medium tabular-nums"
                                                            style={{
                                                                borderColor: active
                                                                    ? `${SETTINGS_UI_ACCENT}45`
                                                                    : 'rgba(255,255,255,0.08)',
                                                                backgroundColor: active
                                                                    ? `${SETTINGS_UI_ACCENT}10`
                                                                    : 'rgba(255,255,255,0.02)',
                                                                color: active
                                                                    ? SETTINGS_UI_ACCENT
                                                                    : 'rgba(255,255,255,0.35)',
                                                            }}
                                                        >
                                                            {String(index + 1).padStart(
                                                                2,
                                                                '0',
                                                            )}
                                                        </span>

                                                        <span className="min-w-0 truncate text-[10px] font-medium">
                                                            {group.label}
                                                        </span>
                                                    </div>

                                                    <p className="mt-2 truncate text-[8px] leading-4 text-zinc-600">
                                                        {group.description}
                                                    </p>
                                                </button>
                                            );
                                        },
                                    )}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Settings */}

                    <div className="min-w-0 space-y-6">
                        {/* Template */}
                        {activeSection === 'foundation' && (
                            <GlassSection id="templates" eyebrow="01 / TEMPLATE" title="Choose your foundation." description="Templates control the overall visual structure of your public portfolio.">
                                <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-2">
                                    {Object.values(templates).map((portfolioTemplate) => {
                                        const isSelected =
                                            template === portfolioTemplate.id;

                                        return (
                                            <div
                                                key={portfolioTemplate.id}
                                                role="button"
                                                tabIndex={0}
                                                onClick={() =>
                                                    setTemplate(portfolioTemplate.id)
                                                }
                                                onKeyDown={(event) => {
                                                    if (
                                                        event.key === 'Enter' ||
                                                        event.key === ' '
                                                    ) {
                                                        event.preventDefault();
                                                        setTemplate(portfolioTemplate.id);
                                                    }
                                                }}
                                                className={`group relative cursor-pointer overflow-hidden rounded-2xl border p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-[#7de7ff]/30 ${isSelected
                                                    ? 'border-white/[0.22] bg-white/[0.06]'
                                                    : 'border-white/[0.07] bg-black/20 hover:border-white/[0.14] hover:bg-white/[0.025]'
                                                    }`}
                                            >
                                                {/* Template wireframe preview.
                                                    This is a structural representation of the actual template layout —
                                                    no real portfolio images are rendered here. */}
                                                <div className="relative h-[180px] overflow-hidden rounded-xl border border-white/[0.07] bg-black">
                                                    <div className="pointer-events-none absolute inset-0 select-none overflow-hidden">
                                                        <div className="w-full origin-top-left">
                                                            <WireframePreview
                                                                template={portfolioTemplate.id}
                                                                accentColor={SETTINGS_UI_ACCENT}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Keep the preview purely visual and focus the card on the upper layout. */}
                                                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />

                                                    <div className="pointer-events-none absolute left-3 top-3 z-10">
                                                        <span className="rounded-full border border-white/[0.1] bg-black/65 px-2.5 py-1 text-[7px] uppercase tracking-[0.18em] text-white/60 backdrop-blur-md">
                                                            {portfolioTemplate.type}
                                                        </span>
                                                    </div>

                                                    {isSelected && (
                                                        <div className="pointer-events-none absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-[#7de7ff]/20 bg-[#7de7ff]/[0.08] backdrop-blur-md">
                                                            <CheckIcon className="h-3.5 w-3.5 text-[#7de7ff]" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Template Information */}
                                                <div className="mt-4 flex items-start justify-between gap-4">
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-sm font-medium text-zinc-200">
                                                                {portfolioTemplate.name}
                                                            </p>

                                                            {portfolioTemplate.type ===
                                                                'premium' && (
                                                                <span className="text-[8px] uppercase tracking-[0.15em] text-[#f0a7e5]">
                                                                    Premium
                                                                </span>
                                                            )}
                                                        </div>

                                                        <p className="mt-1 text-xs leading-5 text-zinc-600">
                                                            {portfolioTemplate.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </GlassSection>
                        )}

                        {/* Presets */}

                        {activeSection === 'theme' && (
                            <GlassSection
                                id="presets"
                                eyebrow="02 / PRESETS"
                                title="Start from a direction."
                                description="Choose a visual direction, then refine each color above."
                            >
                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                    {palettes.map(
                                        (palette) => (
                                            <PaletteButton
                                                key={
                                                    palette.name
                                                }
                                                palette={
                                                    palette
                                                }
                                                active={
                                                    primaryColor ===
                                                    palette.primary &&
                                                    backgroundColor ===
                                                    palette.background &&
                                                    accentColor ===
                                                    palette.accent
                                                }
                                                onClick={() =>
                                                    applyPalette(
                                                        palette,
                                                    )
                                                }
                                            />
                                        ),
                                    )}
                                </div>
                            </GlassSection>
                        )}

                        {/* Color System */}

                        {activeSection === 'theme' && (
                            <GlassSection id="colors" eyebrow="03 / COLOR SYSTEM" title="Define your visual language." description="Set the colors that shape the actual public portfolio.">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <ColorField
                                        id="primary_color"
                                        label="Primary"
                                        description="Your main visual color."
                                        value={primaryColor}
                                        onChange={setPrimaryColor}
                                    />

                                    <ColorField
                                        id="accent_color"
                                        label="Accent"
                                        description="Secondary color used for emphasis."
                                        value={accentColor}
                                        onChange={setAccentColor}
                                    />

                                    <ColorField
                                        id="hover_color"
                                        label="Hover"
                                        description="Color used for interactive hover states."
                                        value={hoverColor}
                                        onChange={setHoverColor}
                                    />

                                    <ColorField
                                        id="background_color"
                                        label="Background"
                                        description="The main background color of your portfolio."
                                        value={backgroundColor}
                                        onChange={setBackgroundColor}
                                    />

                                    <ColorField
                                        id="surface_color"
                                        label="Surface"
                                        description="Color used for secondary surfaces and panels."
                                        value={surfaceColor}
                                        onChange={setSurfaceColor}
                                    />

                                    <ColorField
                                        id="text_color"
                                        label="Text"
                                        description="Primary text color."
                                        value={textColor}
                                        onChange={setTextColor}
                                    />

                                    <ColorField
                                        id="muted_text_color"
                                        label="Muted Text"
                                        description="Secondary and supporting text color."
                                        value={mutedTextColor}
                                        onChange={setMutedTextColor}
                                    />

                                    <ColorField
                                        id="border_color"
                                        label="Border"
                                        description="Color used for borders and dividers."
                                        value={borderColor}
                                        onChange={setBorderColor}
                                    />
                                </div>
                            </GlassSection>
                        )}

                        {/* Project Cards */}

                        {activeSection === 'theme' && (
                            <GlassSection id="project-cards" eyebrow="04 / PROJECT CARDS" title="Style your work." description="Control how your projects appear inside the Default portfolio.">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <ColorField
                                        id="card_background_color"
                                        label="Card Background"
                                        description="Background color used for project cards."
                                        value={cardBackgroundColor}
                                        onChange={setCardBackgroundColor}
                                    />

                                    <ColorField
                                        id="card_text_color"
                                        label="Card Text"
                                        description="Text color used inside project cards."
                                        value={cardTextColor}
                                        onChange={setCardTextColor}
                                    />

                                    <ColorField
                                        id="card_accent_color"
                                        label="Card Accent"
                                        description="Accent color used inside project cards."
                                        value={cardAccentColor}
                                        onChange={setCardAccentColor}
                                    />

                                    <ColorField
                                        id="card_primary_color"
                                        label="Card Primary"
                                        description="Primary color used for project card emphasis."
                                        value={cardPrimaryColor}
                                        onChange={setCardPrimaryColor}
                                    />

                                    <ColorField
                                        id="card_hover_color"
                                        label="Card Hover"
                                        description="Color used when interacting with project cards."
                                        value={cardHoverColor}
                                        onChange={setCardHoverColor}
                                    />
                                </div>
                            </GlassSection>
                        )}

                        {/* Cover Image */}

                        {activeSection === 'hero' && (
                            <GlassSection
                                id="cover"
                                eyebrow="05 / COVER IMAGE"
                                title="Set the atmosphere."
                                description="Upload and position the image that becomes the hero background of your public portfolio."
                            >
                                <div className="space-y-5">
                                    <div
                                        ref={
                                            coverPreviewRef
                                        }
                                        className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-white/[0.08] bg-black/30"
                                    >
                                        <CoverImagePreview
                                            coverImage={coverImagePreview}
                                            positionX={coverImagePositionX}
                                            positionY={coverImagePositionY}
                                            zoom={coverImageZoom}
                                            offsetX={coverImageOffsetX}
                                            offsetY={coverImageOffsetY}
                                            aspectRatio={viewportRatio}
                                            onPointerDown={handleCoverPointerDown}
                                            onPointerMove={handleCoverPointerMove}
                                            onPointerUp={stopCoverDragging}
                                            isDragging={isDraggingCover}
                                        />

                                        {coverImagePreview && (
                                            <div className="absolute right-4 top-4 flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={
                                                        openCoverImagePicker
                                                    }
                                                    className="rounded-full border border-white/20 bg-black/55 px-3.5 py-2 text-[9px] font-medium uppercase tracking-[0.14em] text-white backdrop-blur-md transition hover:border-white/35 hover:bg-black/75"
                                                >
                                                    Change
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={
                                                        handleRemoveCoverImage
                                                    }
                                                    className="rounded-full border border-red-400/20 bg-black/55 px-3.5 py-2 text-[9px] font-medium uppercase tracking-[0.14em] text-red-300 backdrop-blur-md transition hover:border-red-400/40 hover:bg-red-500/10"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <input
                                        ref={
                                            fileInputRef
                                        }
                                        id="cover_image"
                                        name="cover_image"
                                        type="file"
                                        accept="image/jpeg,image/png,image/gif"
                                        onChange={
                                            handleCoverImageChange
                                        }
                                        className="sr-only"
                                    />

                                    {coverImagePreview && (
                                        <>
                                            <div className="flex flex-col gap-5 rounded-2xl border border-white/[0.07] bg-black/20 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                                                <div>
                                                    <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-600">
                                                        Image Position
                                                    </p>

                                                    <p className="mt-1 text-xs text-zinc-500">
                                                        Drag the image directly to
                                                        position it. Use the zoom control
                                                        below to adjust the scale.
                                                    </p>
                                                </div>

                                                <div className="min-w-0 flex-1 sm:max-w-[260px]">
                                                    <div className="mb-2 flex items-center justify-between">
                                                        <span className="text-[9px] uppercase tracking-[0.16em] text-zinc-600">
                                                            Zoom
                                                        </span>

                                                        <span className="text-[10px] tabular-nums text-zinc-500">
                                                            {Math.round(coverImageZoom * 100)}%
                                                        </span>
                                                    </div>

                                                    <input
                                                        type="range"
                                                        min="1"
                                                        max="2"
                                                        step="0.05"
                                                        value={coverImageZoom}
                                                        onChange={(event) => {
                                                            const nextZoom = Number(event.target.value);

                                                            setCoverImageZoom(nextZoom);

                                                            if (nextZoom === 1) {
                                                                setCoverImageOffsetX(0);
                                                                setCoverImageOffsetY(0);
                                                            }
                                                        }}
                                                        className="w-full accent-white"
                                                        aria-label="Cover image zoom"
                                                    />
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setCoverImagePositionX(50);
                                                        setCoverImagePositionY(50);
                                                        setCoverImageZoom(1);
                                                        setCoverImageOffsetX(0);
                                                        setCoverImageOffsetY(0);
                                                    }}
                                                    className="shrink-0 rounded-full border border-white/[0.08] px-3 py-2 text-[9px] uppercase tracking-[0.14em] text-zinc-500 transition hover:border-white/[0.16] hover:text-white"
                                                >
                                                    Reset
                                                </button>
                                            </div>
                                        </>
                                    )}

                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                        <p className="text-[11px] leading-5 text-zinc-600">
                                            JPEG, PNG, or GIF · Minimum 2660 ×
                                            1140 px · Maximum 5 MB.
                                        </p>

                                        {coverImage && (
                                            <p className="shrink-0 text-[10px] uppercase tracking-[0.15em] text-[#7de7ff]/70">
                                                Ready to upload
                                            </p>
                                        )}
                                    </div>

                                    {coverImageError && (
                                        <p className="text-xs leading-5 text-red-400">
                                            {coverImageError}
                                        </p>
                                    )}
                                </div>
                            </GlassSection>
                        )}

                        {/* Hero section */}

                        {activeSection === 'hero' && (
                            <GlassSection id="hero" title="Hero">
                                <div className="space-y-5">
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-white">
                                                Show Hero
                                            </p>

                                            <p className="mt-1 text-xs text-white/50">
                                                Display the hero section on your public portfolio.
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => setShowHero((value) => !value)}
                                            className={`relative h-6 w-11 rounded-full transition ${showHero
                                                ? 'bg-white'
                                                : 'bg-white/10'
                                                }`}
                                            aria-pressed={showHero}
                                        >
                                            <span
                                                className={`absolute top-1 h-4 w-4 rounded-full transition ${showHero
                                                    ? 'left-6 bg-black'
                                                    : 'left-1 bg-white/50'
                                                    }`}
                                            />
                                        </button>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-white">
                                            Hero Label
                                        </label>

                                        <input
                                            type="text"
                                            value={heroLabel}
                                            onChange={(event) =>
                                                setHeroLabel(event.target.value)
                                            }
                                            placeholder="Selected work"
                                            maxLength={100}
                                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-white/30"
                                        />

                                        <p className="mt-2 text-xs text-white/40">
                                            Optional. Leave empty to use the template default.
                                        </p>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-white">
                                            Hero Statement
                                        </label>

                                        <textarea
                                            value={heroStatement}
                                            onChange={(event) =>
                                                setHeroStatement(event.target.value)
                                            }
                                            placeholder="Create boldly. Make something that lasts."
                                            maxLength={500}
                                            rows={4}
                                            className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-white/30"
                                        />

                                        <p className="mt-2 text-xs text-white/40">
                                            Optional. A short statement displayed in your hero.
                                        </p>
                                    </div>

                                    {template === 'canvas' && (
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-white">
                                                Canvas Background Text
                                            </label>

                                            <textarea
                                                value={canvasBackgroundText}
                                                onChange={(event) =>
                                                    setCanvasBackgroundText(
                                                        event.target.value,
                                                    )
                                                }
                                                placeholder="ART CREATES SPACE"
                                                maxLength={500}
                                                rows={4}
                                                className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm uppercase tracking-[0.08em] text-white outline-none transition placeholder:text-white/20 focus:border-white/30"
                                            />

                                            <p className="mt-2 text-xs leading-5 text-white/40">
                                                Optional. Large background typography used by the Canvas template.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </GlassSection>
                        )}

                        {/* About Section */}

                        {activeSection === 'content' && (
                            <GlassSection id="about" title="About">
                                <div className="space-y-5">
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-white">
                                                Show About
                                            </p>

                                            <p className="mt-1 text-xs text-white/50">
                                                Display your artist information on your public portfolio.
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => setShowAbout((value) => !value)}
                                            className={`relative h-6 w-11 rounded-full transition ${showAbout
                                                ? 'bg-white'
                                                : 'bg-white/10'
                                                }`}
                                            aria-pressed={showAbout}
                                        >
                                            <span
                                                className={`absolute top-1 h-4 w-4 rounded-full transition ${showAbout
                                                    ? 'left-6 bg-black'
                                                    : 'left-1 bg-white/50'
                                                    }`}
                                            />
                                        </button>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-white">
                                            About Label
                                        </label>

                                        <input
                                            type="text"
                                            value={aboutLabel}
                                            onChange={(event) =>
                                                setAboutLabel(event.target.value)
                                            }
                                            placeholder="About"
                                            maxLength={100}
                                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-white/30"
                                        />

                                        <p className="mt-2 text-xs text-white/40">
                                            Optional. Leave empty to use the template default.
                                        </p>
                                    </div>
                                </div>
                            </GlassSection>
                        )}

                        {/* Work section */}

                        {activeSection === 'content' && (
                            <GlassSection id="work" title="Work">
                                <div className="space-y-5">
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-white">
                                                Show Work
                                            </p>

                                            <p className="mt-1 text-xs text-white/50">
                                                Display your selected projects on your public portfolio.
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => setShowWork((value) => !value)}
                                            className={`relative h-6 w-11 rounded-full transition ${showWork
                                                ? 'bg-white'
                                                : 'bg-white/10'
                                                }`}
                                            aria-pressed={showWork}
                                        >
                                            <span
                                                className={`absolute top-1 h-4 w-4 rounded-full transition ${showWork
                                                    ? 'left-6 bg-black'
                                                    : 'left-1 bg-white/50'
                                                    }`}
                                            />
                                        </button>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-white">
                                            Work Label
                                        </label>

                                        <input
                                            type="text"
                                            value={workLabel}
                                            onChange={(event) =>
                                                setWorkLabel(event.target.value)
                                            }
                                            placeholder="Work with intention."
                                            maxLength={100}
                                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-white/30"
                                        />

                                        <p className="mt-2 text-xs text-white/40">
                                            Optional. Leave empty to use the template default.
                                        </p>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-white">
                                            Work Description
                                        </label>

                                        <textarea
                                            value={workDescription}
                                            onChange={(event) =>
                                                setWorkDescription(event.target.value)
                                            }
                                            placeholder="A selection of projects, collaborations, and creative work."
                                            maxLength={500}
                                            rows={4}
                                            className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-white/30"
                                        />

                                        <p className="mt-2 text-xs text-white/40">
                                            Optional. A short introduction for your work section.
                                        </p>
                                    </div>
                                </div>
                            </GlassSection>
                        )}

                        {/* Artist Message */}

                        {activeSection === 'content' && (
                            <GlassSection id="artist-message" title="Artist Message">
                                <div className="space-y-5">
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-white">
                                                Show Artist Message
                                            </p>

                                            <p className="mt-1 text-xs text-white/50">
                                                Display a personal message, motto, or creative statement.
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowArtistMessage((value) => !value)
                                            }
                                            className={`relative h-6 w-11 rounded-full transition ${showArtistMessage
                                                ? 'bg-white'
                                                : 'bg-white/10'
                                                }`}
                                            aria-pressed={showArtistMessage}
                                        >
                                            <span
                                                className={`absolute top-1 h-4 w-4 rounded-full transition ${showArtistMessage
                                                    ? 'left-6 bg-black'
                                                    : 'left-1 bg-white/50'
                                                    }`}
                                            />
                                        </button>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-white">
                                            Message Label
                                        </label>

                                        <input
                                            type="text"
                                            value={artistMessageLabel}
                                            onChange={(event) =>
                                                setArtistMessageLabel(event.target.value)
                                            }
                                            placeholder="A little about the artist"
                                            maxLength={100}
                                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-white/30"
                                        />

                                        <p className="mt-2 text-xs text-white/40">
                                            Optional. Leave empty to use the template default.
                                        </p>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-white">
                                            Message
                                        </label>

                                        <textarea
                                            value={artistMessage}
                                            onChange={(event) =>
                                                setArtistMessage(event.target.value)
                                            }
                                            placeholder="Create with purpose. Leave something meaningful behind."
                                            maxLength={2000}
                                            rows={5}
                                            className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-white/30"
                                        />

                                        <p className="mt-2 text-xs text-white/40">
                                            Optional. Share a motto, philosophy, or personal message.
                                        </p>
                                    </div>
                                </div>
                            </GlassSection>
                        )}

                        {/* Gallery Section */}

                        {activeSection === 'content' && (
                            <GlassSection
                                id="gallery"
                                title="Gallery"
                                description="Build a visual collection of your work and control how it appears on your public portfolio."
                            >
                                <div className="space-y-6">
                                    {/* Gallery Visibility */}

                                    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/[0.07] bg-black/20 p-5">
                                        <div>
                                            <p className="text-sm font-medium text-zinc-200">
                                                Show Gallery
                                            </p>

                                            <p className="mt-1 text-xs leading-5 text-zinc-600">
                                                Display a visual gallery on your public portfolio.
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            role="switch"
                                            aria-checked={showGallery}
                                            onClick={() =>
                                                setShowGallery((current) => !current)
                                            }
                                            className={`relative h-6 w-11 shrink-0 rounded-full border transition ${showGallery
                                                ? 'border-white/20 bg-white'
                                                : 'border-white/[0.08] bg-black/40'
                                                }`}
                                        >
                                            <span
                                                className={`absolute top-1 h-4 w-4 rounded-full transition ${showGallery
                                                    ? 'left-6 bg-black'
                                                    : 'left-1 bg-zinc-700'
                                                    }`}
                                            />
                                        </button>
                                    </div>

                                    {/* Gallery Settings */}

                                    <div
                                        className={`space-y-5 transition-opacity ${showGallery
                                            ? 'opacity-100'
                                            : 'pointer-events-none opacity-40'
                                            }`}
                                    >
                                        {/* Label */}

                                        <div>
                                            <label
                                                htmlFor="gallery_label"
                                                className="mb-2 block text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-400"
                                            >
                                                Section Label
                                            </label>

                                            <input
                                                id="gallery_label"
                                                type="text"
                                                value={galleryLabel}
                                                onChange={(event) =>
                                                    setGalleryLabel(event.target.value)
                                                }
                                                placeholder="Gallery"
                                                maxLength={100}
                                                className="h-12 w-full rounded-xl border border-white/[0.08] bg-black/30 px-4 text-sm text-zinc-300 outline-none transition focus:border-white/20 focus:bg-white/[0.035]"
                                            />

                                            <p className="mt-2 text-xs leading-5 text-zinc-600">
                                                Optional. Leave empty to use the template default.
                                            </p>
                                        </div>

                                        {/* Description */}

                                        <div>
                                            <label
                                                htmlFor="gallery_description"
                                                className="mb-2 block text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-400"
                                            >
                                                Section Description
                                            </label>

                                            <textarea
                                                id="gallery_description"
                                                value={galleryDescription}
                                                onChange={(event) =>
                                                    setGalleryDescription(event.target.value)
                                                }
                                                placeholder="A collection of selected visual work."
                                                maxLength={500}
                                                rows={4}
                                                className="w-full resize-none rounded-xl border border-white/[0.08] bg-black/30 px-4 py-3 text-sm text-zinc-300 outline-none transition focus:border-white/20 focus:bg-white/[0.035]"
                                            />

                                            <p className="mt-2 text-xs leading-5 text-zinc-600">
                                                Optional. Add a short introduction to your gallery.
                                            </p>
                                        </div>

                                        {/* Display Settings */}

                                        <div className="border-t border-white/10 pt-6">
                                            <div className="mb-5">
                                                <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-white">
                                                    Responsive Layout
                                                </p>

                                                <p className="mt-2 text-xs leading-5 text-white/40">
                                                    Configure how the gallery behaves across
                                                    different screen sizes.
                                                </p>
                                            </div>

                                            {/* Device */}

                                            <div className="grid grid-cols-3 border border-white/10">
                                                {(
                                                    [
                                                        ['desktop', 'Desktop', '≥ 1024px'],
                                                        ['tablet', 'Tablet', '768–1023px'],
                                                        ['mobile', 'Mobile', '< 768px'],
                                                    ] as const
                                                ).map(([device, label, range]) => {
                                                    const active =
                                                        galleryDevice === device;

                                                    return (
                                                        <button
                                                            key={device}
                                                            type="button"
                                                            onClick={() =>
                                                                setGalleryDevice(device)
                                                            }
                                                            className="border-r border-white/10 px-4 py-4 text-left transition-colors last:border-r-0"
                                                            style={{
                                                                backgroundColor: active
                                                                    ? `${SETTINGS_UI_ACCENT}12`
                                                                    : 'transparent',
                                                            }}
                                                        >
                                                            <span
                                                                className="block text-[9px] uppercase tracking-[0.2em]"
                                                                style={{
                                                                    color: active
                                                                        ? SETTINGS_UI_ACCENT
                                                                        : 'rgba(255,255,255,0.45)',
                                                                }}
                                                            >
                                                                {label}
                                                            </span>

                                                            <span className="mt-1 block text-[8px] uppercase tracking-[0.15em] text-white/25">
                                                                {range}
                                                            </span>
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            {/* Display */}

                                            <div className="mt-6">
                                                <label className="text-[9px] uppercase tracking-[0.2em] text-white/45">
                                                    Display
                                                </label>

                                                <select
                                                    value={
                                                        galleryResponsive[
                                                            galleryDevice
                                                        ].display
                                                    }
                                                    onChange={(event) =>
                                                        updateGalleryResponsive({
                                                            display: event.target.value as
                                                                | 'grid'
                                                                | 'masonry'
                                                                | 'editorial'
                                                                | 'freeform',
                                                        })
                                                    }
                                                    className="mt-2 w-full border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
                                                >
                                                    <option value="grid">
                                                        Grid
                                                    </option>

                                                    <option value="masonry">
                                                        Masonry
                                                    </option>

                                                    <option value="editorial">
                                                        Editorial
                                                    </option>

                                                    <option value="freeform">
                                                        Freeform
                                                    </option>
                                                </select>
                                            </div>

                                            {/* Columns */}

                                            <div className="mt-5">
                                                <label className="text-[9px] uppercase tracking-[0.2em] text-white/45">
                                                    Columns
                                                </label>

                                                <div className="mt-2 grid grid-cols-4 gap-2">
                                                    {getGalleryColumnOptions().map(
                                                        (columns) => {
                                                            const active =
                                                                Number(
                                                                    galleryResponsive[galleryDevice].columns,
                                                                ) === columns;

                                                            return (
                                                                <button
                                                                    key={columns}
                                                                    type="button"
                                                                    onClick={() =>
                                                                        updateGalleryResponsive({
                                                                            columns,
                                                                        })
                                                                    }
                                                                    className="border px-3 py-3 text-xs transition-colors"
                                                                    style={{
                                                                        borderColor: active
                                                                            ? SETTINGS_UI_ACCENT
                                                                            : 'rgba(255,255,255,0.1)',

                                                                        backgroundColor: active
                                                                            ? `${SETTINGS_UI_ACCENT}12`
                                                                            : 'transparent',

                                                                        color: active
                                                                            ? SETTINGS_UI_ACCENT
                                                                            : 'rgba(255,255,255,0.5)',
                                                                    }}
                                                                >
                                                                    {columns}
                                                                </button>
                                                            );
                                                        },
                                                    )}
                                                </div>
                                            </div>

                                            {/* Image Aspect */}

                                            <div className="mt-5">
                                                <label className="text-[9px] uppercase tracking-[0.2em] text-white/45">
                                                    Image Aspect
                                                </label>

                                                <select
                                                    value={
                                                        galleryResponsive[
                                                            galleryDevice
                                                        ].image_aspect
                                                    }
                                                    onChange={(event) =>
                                                        updateGalleryResponsive({
                                                            image_aspect:
                                                                event.target.value as
                                                                | 'original'
                                                                | 'square'
                                                                | 'portrait'
                                                                | 'landscape',
                                                        })
                                                    }
                                                    className="mt-2 w-full border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
                                                >
                                                    <option value="original">
                                                        Original
                                                    </option>

                                                    <option value="square">
                                                        Square
                                                    </option>

                                                    <option value="portrait">
                                                        Portrait
                                                    </option>

                                                    <option value="landscape">
                                                        Landscape
                                                    </option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Display Options */}

                                        <div className="grid gap-3 sm:grid-cols-3">
                                            {/* Captions */}

                                            <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/[0.07] bg-black/20 p-4">
                                                <div>
                                                    <p className="text-sm text-zinc-300">
                                                        Captions
                                                    </p>

                                                    <p className="mt-1 text-xs text-zinc-600">
                                                        Show image captions.
                                                    </p>
                                                </div>

                                                <button
                                                    type="button"
                                                    role="switch"
                                                    aria-checked={galleryShowCaptions}
                                                    onClick={() =>
                                                        setGalleryShowCaptions(
                                                            (current) => !current,
                                                        )
                                                    }
                                                    className={`relative h-6 w-11 shrink-0 rounded-full border transition ${galleryShowCaptions
                                                        ? 'border-white/20 bg-white'
                                                        : 'border-white/[0.08] bg-black/40'
                                                        }`}
                                                >
                                                    <span
                                                        className={`absolute top-1 h-4 w-4 rounded-full transition ${galleryShowCaptions
                                                            ? 'left-6 bg-black'
                                                            : 'left-1 bg-zinc-700'
                                                            }`}
                                                    />
                                                </button>
                                            </div>

                                            {/* Titles */}

                                            <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/[0.07] bg-black/20 p-4">
                                                <div>
                                                    <p className="text-sm text-zinc-300">
                                                        Titles
                                                    </p>

                                                    <p className="mt-1 text-xs text-zinc-600">
                                                        Show image titles.
                                                    </p>
                                                </div>

                                                <button
                                                    type="button"
                                                    role="switch"
                                                    aria-checked={galleryShowTitles}
                                                    onClick={() =>
                                                        setGalleryShowTitles(
                                                            (current) => !current,
                                                        )
                                                    }
                                                    className={`relative h-6 w-11 shrink-0 rounded-full border transition ${galleryShowTitles
                                                        ? 'border-white/20 bg-white'
                                                        : 'border-white/[0.08] bg-black/40'
                                                        }`}
                                                >
                                                    <span
                                                        className={`absolute top-1 h-4 w-4 rounded-full transition ${galleryShowTitles
                                                            ? 'left-6 bg-black'
                                                            : 'left-1 bg-zinc-700'
                                                            }`}
                                                    />
                                                </button>
                                            </div>

                                            {/* Lightbox */}

                                            <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/[0.07] bg-black/20 p-4">
                                                <div>
                                                    <p className="text-sm text-zinc-300">
                                                        Lightbox
                                                    </p>

                                                    <p className="mt-1 text-xs text-zinc-600">
                                                        Open images in a larger view.
                                                    </p>
                                                </div>

                                                <button
                                                    type="button"
                                                    role="switch"
                                                    aria-checked={galleryEnableLightbox}
                                                    onClick={() =>
                                                        setGalleryEnableLightbox(
                                                            (current) => !current,
                                                        )
                                                    }
                                                    className={`relative h-6 w-11 shrink-0 rounded-full border transition ${galleryEnableLightbox
                                                        ? 'border-white/20 bg-white'
                                                        : 'border-white/[0.08] bg-black/40'
                                                        }`}
                                                >
                                                    <span
                                                        className={`absolute top-1 h-4 w-4 rounded-full transition ${galleryEnableLightbox
                                                            ? 'left-6 bg-black'
                                                            : 'left-1 bg-zinc-700'
                                                            }`}
                                                    />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Gallery Order */}

                                        <div className="border-t border-white/[0.06] pt-6">
                                            <div className="sticky top-20 z-20 -mx-2 flex flex-col gap-3 rounded-2xl border border-white/[0.07] bg-[#0a0b0d]/90 p-3 shadow-[0_16px_40px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-sm font-medium text-zinc-200">
                                                            Gallery Order
                                                        </p>

                                                        <span className="rounded-full border border-white/[0.08] bg-white/[0.035] px-2 py-0.5 text-[8px] uppercase tracking-[0.14em] text-zinc-500">
                                                            {galleryImages.length}{' '}
                                                            {galleryImages.length === 1 ? 'image' : 'images'}
                                                        </span>
                                                    </div>

                                                    <p className="mt-1 text-xs leading-5 text-zinc-600">
                                                        Drag and drop the images to set the order used on your public portfolio. Click Save Portfolio to save the new order.
                                                    </p>
                                                </div>

                                            </div>

                                            {galleryImages.length === 0 ? (
                                                <div className="mt-4 rounded-2xl border border-dashed border-white/[0.08] bg-black/20 px-5 py-10 text-center">
                                                    <p className="text-sm text-zinc-400">
                                                        No gallery images yet.
                                                    </p>

                                                    <p className="mt-1 text-xs leading-5 text-zinc-600">
                                                        Add images from the Gallery page first.
                                                    </p>

                                                    <Link href="/dashboard/gallery/create" className="mt-4 inline-flex rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[9px] font-medium uppercase tracking-[0.14em] text-zinc-300 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white">
                                                        Add Image
                                                    </Link>
                                                </div>
                                            ) : (
                                                <div className="mt-4 space-y-3">
                                                    {galleryImages.map((image, index) => {
                                                        const imagePreview = getImageUrl(image.image);
                                                        const isDragging = draggingGalleryIndex === index;

                                                        return (
                                                            <div
                                                                key={image.id ?? `gallery-${index}`}
                                                                draggable
                                                                onDragStart={() => handleGalleryDragStart(index)}
                                                                onDragOver={handleGalleryDragOver}
                                                                onDrop={(event) => handleGalleryDrop(event, index)}
                                                                onDragEnd={handleGalleryDragEnd}
                                                                className={`flex cursor-grab items-center gap-4 rounded-2xl border bg-black/20 p-3 transition active:cursor-grabbing sm:p-4 ${isDragging ? 'border-white/20 opacity-40' : 'border-white/[0.07] hover:border-white/[0.12]'}`}
                                                            >
                                                                <div className="flex h-10 w-8 shrink-0 items-center justify-center text-zinc-600" aria-hidden="true">
                                                                    <span className="text-lg leading-none">⋮⋮</span>
                                                                </div>

                                                                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-white/[0.08] bg-black/40 sm:h-20 sm:w-20">
                                                                    {imagePreview ? (
                                                                        <img src={imagePreview} alt={image.alt_text || ''} className="h-full w-full object-cover" />
                                                                    ) : (
                                                                        <div className="flex h-full items-center justify-center text-[8px] uppercase tracking-[0.12em] text-zinc-700">
                                                                            No image
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                <div className="min-w-0 flex-1">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-[9px] uppercase tracking-[0.16em] text-zinc-600">
                                                                            {String(index + 1).padStart(2, '0')}
                                                                        </span>

                                                                        <p className="truncate text-sm font-medium text-zinc-200">
                                                                            {image.title || 'Untitled Image'}
                                                                        </p>
                                                                    </div>

                                                                    {image.caption && (
                                                                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-zinc-600">
                                                                            {image.caption}
                                                                        </p>
                                                                    )}

                                                                    <p className="mt-2 text-[9px] uppercase tracking-[0.14em] text-zinc-700">
                                                                        Drag to reorder
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </GlassSection>
                        )}

{/* Music */}

                        {activeSection === 'media' && (
                            <GlassSection
                                id="music"
                                eyebrow="06 / MUSIC"
                                title="Shape your sound."
                                description="Control how your releases and music links appear on your public portfolio."
                            >
                                <div className="space-y-6">
                                    {/* Show Music */}

                                    <div className="flex flex-col gap-4 rounded-2xl border border-white/[0.07] bg-black/20 p-5 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="max-w-xl">
                                            <p className="text-sm font-medium text-zinc-200">
                                                Show Music
                                            </p>

                                            <p className="mt-1 text-xs leading-5 text-zinc-600">
                                                Display the music section on your public portfolio.
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            role="switch"
                                            aria-checked={showMusic}
                                            onClick={() => setShowMusic((current) => !current)}
                                            className={`relative h-6 w-11 shrink-0 rounded-full border transition ${showMusic
                                                ? 'border-white/20 bg-white'
                                                : 'border-white/[0.08] bg-black/40'
                                                }`}
                                        >
                                            <span
                                                className={`absolute top-1 h-4 w-4 rounded-full transition ${showMusic
                                                    ? 'left-6 bg-black'
                                                    : 'left-1 bg-zinc-700'
                                                    }`}
                                            />
                                        </button>
                                    </div>

                                    {/* Release Display */}

                                    <div
                                        className={`space-y-5 transition-opacity ${showMusic
                                            ? 'opacity-100'
                                            : 'pointer-events-none opacity-40'
                                            }`}
                                    >
                                        <div className="grid gap-5 sm:grid-cols-2">
                                            <div>
                                                <label
                                                    htmlFor="music_release_display"
                                                    className="mb-2 block text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-400"
                                                >
                                                    Release Display
                                                </label>

                                                <p className="mb-3 min-h-[40px] text-xs leading-5 text-zinc-600">
                                                    Choose whether the template shows your latest releases or every visible release.
                                                </p>

                                                <select
                                                    id="music_release_display"
                                                    value={musicReleaseDisplay}
                                                    onChange={(event) =>
                                                        setMusicReleaseDisplay(
                                                            event.target.value as
                                                            | 'latest'
                                                            | 'all',
                                                        )
                                                    }
                                                    className="h-12 w-full rounded-xl border border-white/[0.08] bg-[#08090b] px-4 text-sm text-zinc-300 outline-none transition focus:border-white/20"
                                                >
                                                    <option value="latest">
                                                        Latest releases
                                                    </option>

                                                    <option value="all">
                                                        All visible releases
                                                    </option>
                                                </select>
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor="music_release_limit"
                                                    className="mb-2 block text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-400"
                                                >
                                                    Number of Releases
                                                </label>

                                                <p className="mb-3 min-h-[40px] text-xs leading-5 text-zinc-600">
                                                    Maximum number shown when using Latest releases.
                                                </p>

                                                <input
                                                    id="music_release_limit"
                                                    type="number"
                                                    min={1}
                                                    max={24}
                                                    value={musicReleaseLimit}
                                                    onChange={(event) =>
                                                        setMusicReleaseLimit(
                                                            Math.min(
                                                                24,
                                                                Math.max(
                                                                    1,
                                                                    Number(
                                                                        event.target.value || 1,
                                                                    ),
                                                                ),
                                                            ),
                                                        )
                                                    }
                                                    className="h-12 w-full rounded-xl border border-white/[0.08] bg-black/30 px-4 text-sm text-zinc-300 outline-none transition focus:border-white/20 focus:bg-white/[0.035]"
                                                />
                                            </div>
                                        </div>

                                        {/* Featured Release */}

                                        <div>
                                            <label
                                                htmlFor="featured_release"
                                                className="mb-2 block text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-400"
                                            >
                                                Featured Release
                                            </label>

                                            <p className="mb-3 text-xs leading-5 text-zinc-600">
                                                Optionally highlight one visible release in templates that support featured music.
                                            </p>

                                            <select
                                                id="featured_release"
                                                value={
                                                    featuredReleaseId ??
                                                    ''
                                                }
                                                onChange={(
                                                    event,
                                                ) => {
                                                    const value =
                                                        event
                                                            .target
                                                            .value;

                                                    setFeaturedReleaseId(
                                                        value
                                                            ? Number(
                                                                value,
                                                            )
                                                            : null,
                                                    );
                                                }}
                                                className="h-12 w-full rounded-xl border border-white/[0.08] bg-[#08090b] px-4 text-sm text-zinc-300 outline-none transition focus:border-white/20"
                                            >
                                                <option value="">
                                                    No featured release
                                                </option>

                                                {releases
                                                    .filter(
                                                        (
                                                            release,
                                                        ) =>
                                                            release.is_visible,
                                                    )
                                                    .map(
                                                        (
                                                            release,
                                                        ) => (
                                                            <option
                                                                key={
                                                                    release.id
                                                                }
                                                                value={
                                                                    release.id
                                                                }
                                                            >
                                                                {
                                                                    release.title
                                                                }
                                                            </option>
                                                        ),
                                                    )}
                                            </select>

                                            {releases.filter(
                                                (release) =>
                                                    release.is_visible,
                                            ).length === 0 && (
                                                    <p className="mt-3 text-xs text-zinc-600">
                                                        No visible releases yet. Add a release from the Music section first.
                                                    </p>
                                                )}
                                        </div>

                                        {/* Music Links */}

                                        <div className="flex flex-col gap-4 rounded-2xl border border-white/[0.07] bg-black/20 p-5 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="max-w-xl">
                                                <p className="text-sm font-medium text-zinc-200">
                                                    Show Music Links
                                                </p>

                                                <p className="mt-1 text-xs leading-5 text-zinc-600">
                                                    Display available Spotify, Apple Music, YouTube, SoundCloud, and Bandcamp links with your releases.
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                role="switch"
                                                aria-checked={showMusicLinks}
                                                onClick={() => setShowMusicLinks((current) => !current)}
                                                className={`relative h-6 w-11 shrink-0 rounded-full border transition ${showMusicLinks
                                                    ? 'border-white/20 bg-white'
                                                    : 'border-white/[0.08] bg-black/40'
                                                    }`}
                                            >
                                                <span
                                                    className={`absolute top-1 h-4 w-4 rounded-full transition ${showMusicLinks
                                                        ? 'left-6 bg-black'
                                                        : 'left-1 bg-zinc-700'
                                                        }`}
                                                />
                                            </button>
                                        </div>

                                        {/* Release Summary */}

                                        <div className="grid gap-3 sm:grid-cols-3">
                                            <div className="rounded-2xl border border-white/[0.06] bg-black/20 p-4">
                                                <p className="text-[9px] uppercase tracking-[0.18em] text-zinc-600">
                                                    Total Releases
                                                </p>

                                                <p className="mt-2 text-xl font-light text-white">
                                                    {releases.length}
                                                </p>
                                            </div>

                                            <div className="rounded-2xl border border-white/[0.06] bg-black/20 p-4">
                                                <p className="text-[9px] uppercase tracking-[0.18em] text-zinc-600">
                                                    Visible
                                                </p>

                                                <p className="mt-2 text-xl font-light text-white">
                                                    {
                                                        releases.filter(
                                                            (release) =>
                                                                release.is_visible,
                                                        ).length
                                                    }
                                                </p>
                                            </div>

                                            <div className="rounded-2xl border border-white/[0.06] bg-black/20 p-4">
                                                <p className="text-[9px] uppercase tracking-[0.18em] text-zinc-600">
                                                    Featured
                                                </p>

                                                <p className="mt-2 truncate text-sm font-medium text-zinc-300">
                                                    {featuredReleaseId
                                                        ? releases.find(
                                                            (
                                                                release,
                                                            ) =>
                                                                release.id ===
                                                                featuredReleaseId,
                                                        )?.title ??
                                                        'Not found'
                                                        : 'None'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </GlassSection>
                        )}

                        {/* Navigation Section */}

                        {activeSection === 'site' && (
                            <GlassSection id="navigation" title="Navigation">
                                <div className="space-y-5">
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-white">
                                                Show Navigation
                                            </p>

                                            <p className="mt-1 text-xs text-white/50">
                                                Display the navigation menu on your public portfolio.
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowNavigation((value) => !value)
                                            }
                                            className={`relative h-6 w-11 rounded-full transition ${showNavigation
                                                ? 'bg-white'
                                                : 'bg-white/10'
                                                }`}
                                            aria-pressed={showNavigation}
                                        >
                                            <span
                                                className={`absolute top-1 h-4 w-4 rounded-full transition ${showNavigation
                                                    ? 'left-6 bg-black'
                                                    : 'left-1 bg-white/50'
                                                    }`}
                                            />
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between gap-4">
                                            <div>
                                                <p className="text-sm font-medium text-white">
                                                    Navigation Items
                                                </p>

                                                <p className="mt-1 text-xs leading-5 text-white/40">
                                                    Add and arrange the links that appear in
                                                    your public portfolio navigation.
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={addNavigationItem}
                                                className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[9px] font-medium uppercase tracking-[0.14em] text-zinc-300 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                                            >
                                                Add Item
                                            </button>
                                        </div>

                                        {navigationItemState.length === 0 ? (
                                            <div className="rounded-2xl border border-dashed border-white/[0.08] bg-black/20 px-5 py-8 text-center">
                                                <p className="text-sm text-zinc-400">
                                                    No navigation items yet.
                                                </p>

                                                <p className="mt-1 text-xs text-zinc-600">
                                                    Add your first navigation item above.
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {navigationItemState.map(
                                                    (item, index) => (
                                                        <div
                                                            key={
                                                                item.id ??
                                                                `navigation-${index}`
                                                            }
                                                            className="rounded-2xl border border-white/[0.07] bg-black/20 p-4"
                                                        >
                                                            <div className="flex flex-col gap-4">
                                                                <div className="flex items-start justify-between gap-4">
                                                                    <div>
                                                                        <p className="text-[9px] uppercase tracking-[0.18em] text-zinc-600">
                                                                            Item {String(index + 1).padStart(2, '0')}
                                                                        </p>

                                                                        <p className="mt-1 text-sm font-medium text-zinc-200">
                                                                            {item.label || 'Untitled'}
                                                                        </p>
                                                                    </div>

                                                                    <div className="flex items-center gap-1">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                moveNavigationItem(
                                                                                    index,
                                                                                    'up',
                                                                                )
                                                                            }
                                                                            disabled={index === 0}
                                                                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] text-zinc-500 transition hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                                                                            aria-label="Move item up"
                                                                        >
                                                                            ↑
                                                                        </button>

                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                moveNavigationItem(
                                                                                    index,
                                                                                    'down',
                                                                                )
                                                                            }
                                                                            disabled={
                                                                                index ===
                                                                                navigationItemState.length -
                                                                                1
                                                                            }
                                                                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] text-zinc-500 transition hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                                                                            aria-label="Move item down"
                                                                        >
                                                                            ↓
                                                                        </button>

                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                removeNavigationItem(
                                                                                    index,
                                                                                )
                                                                            }
                                                                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-400/10 text-red-300/60 transition hover:border-red-400/25 hover:bg-red-500/5 hover:text-red-300"
                                                                            aria-label="Remove navigation item"
                                                                        >
                                                                            ×
                                                                        </button>
                                                                    </div>
                                                                </div>

                                                                <div className="grid gap-4 sm:grid-cols-2">
                                                                    <div>
                                                                        <label className="mb-2 block text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-400">
                                                                            Label
                                                                        </label>

                                                                        <input
                                                                            type="text"
                                                                            value={item.label}
                                                                            onChange={(event) =>
                                                                                updateNavigationItem(
                                                                                    index,
                                                                                    {
                                                                                        label: event
                                                                                            .target
                                                                                            .value,
                                                                                    },
                                                                                )
                                                                            }
                                                                            placeholder="Work"
                                                                            maxLength={100}
                                                                            className="h-12 w-full rounded-xl border border-white/[0.08] bg-black/30 px-4 text-sm text-zinc-300 outline-none transition focus:border-white/20 focus:bg-white/[0.035]"
                                                                        />
                                                                    </div>

                                                                    <div>
                                                                        <label className="mb-2 block text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-400">
                                                                            Destination
                                                                        </label>

                                                                        <select
                                                                            value={
                                                                                item.destination
                                                                            }
                                                                            onChange={(event) => {
                                                                                const destination =
                                                                                    event.target
                                                                                        .value;

                                                                                updateNavigationItem(
                                                                                    index,
                                                                                    {
                                                                                        destination,
                                                                                        url:
                                                                                            destination ===
                                                                                                'external'
                                                                                                ? item.url
                                                                                                : null,
                                                                                    },
                                                                                );
                                                                            }}
                                                                            className="h-12 w-full rounded-xl border border-white/[0.08] bg-[#08090b] px-4 text-sm text-zinc-300 outline-none transition focus:border-white/20"
                                                                        >
                                                                            {navigationDestinations.map((destination) => (
                                                                                <option
                                                                                    key={destination.value}
                                                                                    value={destination.value}
                                                                                    disabled={isNavigationDestinationUsed(
                                                                                        destination.value,
                                                                                        index,
                                                                                    )}
                                                                                >
                                                                                    {destination.label}
                                                                                    {isNavigationDestinationUsed(
                                                                                        destination.value,
                                                                                        index,
                                                                                    )
                                                                                        ? ' — Already Used'
                                                                                        : ''}
                                                                                </option>
                                                                            ))}
                                                                        </select>
                                                                    </div>
                                                                </div>

                                                                {item.destination ===
                                                                    'external' && (
                                                                        <div>
                                                                            <label className="mb-2 block text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-400">
                                                                                External URL
                                                                            </label>

                                                                            <input
                                                                                type="url"
                                                                                value={
                                                                                    item.url ?? ''
                                                                                }
                                                                                onChange={(event) =>
                                                                                    updateNavigationItem(
                                                                                        index,
                                                                                        {
                                                                                            url: event
                                                                                                .target
                                                                                                .value,
                                                                                        },
                                                                                    )
                                                                                }
                                                                                placeholder="https://example.com"
                                                                                className="h-12 w-full rounded-xl border border-white/[0.08] bg-black/30 px-4 text-sm text-zinc-300 outline-none transition focus:border-white/20 focus:bg-white/[0.035]"
                                                                            />
                                                                        </div>
                                                                    )}

                                                                <div className="flex items-center justify-between gap-4 border-t border-white/[0.06] pt-4">
                                                                    <div>
                                                                        <p className="text-sm text-zinc-300">
                                                                            Visible
                                                                        </p>

                                                                        <p className="mt-1 text-xs text-zinc-600">
                                                                            Show this item in the
                                                                            public navigation.
                                                                        </p>
                                                                    </div>

                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            updateNavigationItem(
                                                                                index,
                                                                                {
                                                                                    is_visible:
                                                                                        !item.is_visible,
                                                                                },
                                                                            )
                                                                        }
                                                                        className={`relative h-6 w-11 shrink-0 rounded-full transition ${item.is_visible
                                                                            ? 'bg-white'
                                                                            : 'bg-white/10'
                                                                            }`}
                                                                        aria-pressed={
                                                                            item.is_visible
                                                                        }
                                                                    >
                                                                        <span
                                                                            className={`absolute top-1 h-4 w-4 rounded-full transition ${item.is_visible
                                                                                ? 'left-6 bg-black'
                                                                                : 'left-1 bg-white/50'
                                                                                }`}
                                                                        />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </GlassSection>
                        )}

                        {/* Footer Section */}

                        {activeSection === 'site' && (
                            <GlassSection id="footer" title="Footer">
                                <div className="space-y-5">
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-white">
                                                Show Footer
                                            </p>

                                            <p className="mt-1 text-xs text-white/50">
                                                Display the footer on your public portfolio.
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => setShowFooter((value) => !value)}
                                            className={`relative h-6 w-11 rounded-full transition ${showFooter
                                                ? 'bg-white'
                                                : 'bg-white/10'
                                                }`}
                                            aria-pressed={showFooter}
                                        >
                                            <span
                                                className={`absolute top-1 h-4 w-4 rounded-full transition ${showFooter
                                                    ? 'left-6 bg-black'
                                                    : 'left-1 bg-white/50'
                                                    }`}
                                            />
                                        </button>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-white">
                                            Footer Label
                                        </label>

                                        <input
                                            type="text"
                                            value={footerLabel}
                                            onChange={(event) =>
                                                setFooterLabel(event.target.value)
                                            }
                                            placeholder="Stay connected."
                                            maxLength={100}
                                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-white/30"
                                        />

                                        <p className="mt-2 text-xs text-white/40">
                                            Optional. Leave empty to use the template default.
                                        </p>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-white">
                                            Footer Message
                                        </label>

                                        <textarea
                                            value={footerMessage}
                                            onChange={(event) =>
                                                setFooterMessage(event.target.value)
                                            }
                                            placeholder="Thanks for visiting my space."
                                            maxLength={500}
                                            rows={4}
                                            className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-white/30"
                                        />

                                        <p className="mt-2 text-xs text-white/40">
                                            Optional. Add a short closing message.
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-white">
                                                Show Social Links
                                            </p>

                                            <p className="mt-1 text-xs text-white/50">
                                                Display your connected social links in the footer.
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowFooterSocials((value) => !value)
                                            }
                                            className={`relative h-6 w-11 rounded-full transition ${showFooterSocials
                                                ? 'bg-white'
                                                : 'bg-white/10'
                                                }`}
                                            aria-pressed={showFooterSocials}
                                        >
                                            <span
                                                className={`absolute top-1 h-4 w-4 rounded-full transition ${showFooterSocials
                                                    ? 'left-6 bg-black'
                                                    : 'left-1 bg-white/50'
                                                    }`}
                                            />
                                        </button>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-white">
                                            Footer Logo
                                        </label>

                                        <input
                                            id="footer_logo"
                                                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            onChange={(event) => {
                                                const file = event.target.files?.[0] ?? null;

                                                setFooterLogoError(null);
                                                                                        setFooterLogo(file);
                                                setRemoveFooterLogo(false);

                                                if (file) {
                                                    setFooterLogoPreview(
                                                        URL.createObjectURL(file),
                                                    );
                                                }
                                            }}
                                            className="block w-full text-sm text-white/60 file:mr-4 file:rounded-lg file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-medium file:text-black"
                                        />

                                        {footerLogoPreview && (
                                            <div className="mt-4 flex items-center gap-4">
                                                <img
                                                    src={footerLogoPreview}
                                                    alt="Footer logo preview"
                                                    className="h-16 w-auto max-w-48 object-contain"
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setFooterLogo(null);
                                                        setFooterLogoPreview(null);
                                                        setRemoveFooterLogo(true);
                                                    }}
                                                    className="text-xs text-white/50 transition hover:text-white"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        )}

                                        <p className="mt-2 text-xs text-white/40">
                                            Optional. Upload a logo to display in the footer.
                                        </p>

                                        {footerLogoError && (
                                            <p className="mt-2 text-xs leading-5 text-red-400">
                                                {footerLogoError}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-white">
                                            Copyright Text
                                        </label>

                                        <input
                                            type="text"
                                            value={copyrightText}
                                            onChange={(event) =>
                                                setCopyrightText(event.target.value)
                                            }
                                            placeholder="© 2026 Your Name"
                                            maxLength={255}
                                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-white/30"
                                        />

                                        <p className="mt-2 text-xs text-white/40">
                                            Optional. Add your own copyright text.
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-white">
                                                Powered by LIRA
                                            </p>

                                            <p className="mt-1 text-xs text-white/50">
                                                Show the LIRA attribution in your public footer.
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPoweredByLira((value) => !value)
                                            }
                                            className={`relative h-6 w-11 rounded-full transition ${showPoweredByLira
                                                ? 'bg-white'
                                                : 'bg-white/10'
                                                }`}
                                            aria-pressed={showPoweredByLira}
                                        >
                                            <span
                                                className={`absolute top-1 h-4 w-4 rounded-full transition ${showPoweredByLira
                                                    ? 'left-6 bg-black'
                                                    : 'left-1 bg-white/50'
                                                    }`}
                                            />
                                        </button>
                                    </div>
                                </div>
                            </GlassSection>
                        )}
                    </div>

                    {/* Live Preview */}

                    <aside className="w-full lg:col-span-2 xl:col-span-1 xl:sticky xl:top-24 xl:self-start">
                        <div className="mx-auto w-full max-w-[360px] space-y-5 lg:max-w-none xl:mx-0 xl:ml-auto">
                            {/* Save */}

                            <div className="hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 backdrop-blur-xl sm:rounded-[24px] sm:p-5 xl:block">
                                <div className="mb-4">
                                    <p className="text-[8px] uppercase tracking-[0.24em] text-zinc-600">
                                        Portfolio Changes
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-zinc-500">
                                        Save when you are happy with your customization.
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-[linear-gradient(90deg,#fff_0%,#c8f5ff_22%,#a393ff_50%,#f28bd7_76%,#fff_100%)] px-5 py-3.5 text-sm font-semibold text-zinc-950 shadow-[0_8px_30px_rgba(120,200,255,0.12)] transition duration-300 hover:shadow-[0_10px_40px_rgba(160,140,255,0.18)] disabled:cursor-not-allowed disabled:opacity-50 sm:rounded-full"
                                >
                                    <span>
                                        {saving
                                            ? 'Saving Changes...'
                                            : 'Save Portfolio'}
                                    </span>

                                    {!saving && (
                                        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                    )}
                                </button>

                                <Link
                                    href="/dashboard"
                                    className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-white/[0.08] px-5 py-3.5 text-sm font-medium text-zinc-500 transition hover:border-white/[0.15] hover:text-white sm:rounded-full"
                                >
                                    Cancel
                                </Link>
                            </div>

                            {/* Preview */}

                            <GlassSection eyebrow="LIVE / PREVIEW" title="See your space." description={`A structural wireframe of the ${selectedTemplate.name} template.`}>
                                <div className="mx-auto max-h-[520px] overflow-hidden rounded-2xl border border-white/[0.08] bg-black shadow-2xl">
                                    <div className="origin-top scale-[0.82]">
                                        <WireframePreview
                                            template={template}
                                            accentColor={SETTINGS_UI_ACCENT}
                                        />
                                    </div>
                                </div>

                                <div className="mt-4 rounded-2xl border border-white/[0.06] bg-black/20 p-3">
                                    <div className="flex items-start gap-3">
                                        <div
                                            className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border"
                                            style={{
                                                borderColor: `${SETTINGS_UI_ACCENT}25`,
                                                backgroundColor: `${SETTINGS_UI_ACCENT}0d`,
                                                color: SETTINGS_UI_ACCENT,
                                            }}
                                        >
                                            <CheckIcon className="h-3 w-3" />
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium text-zinc-300">
                                                Live template preview
                                            </p>

                                            <p className="mt-1 text-[11px] leading-5 text-zinc-600">
                                                Your changes are previewed here before they are saved.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </GlassSection>
                        </div>
                    </aside>

                    {/* Mobile Save Bar */}

                    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/[0.08] bg-[#090a0c]/95 p-3 shadow-[0_-16px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl xl:hidden">
                        <div className="mx-auto flex w-full max-w-2xl gap-2 sm:gap-3">
                            <Link
                                href="/dashboard"
                                className="inline-flex flex-1 items-center justify-center rounded-xl border border-white/[0.08] px-4 py-3 text-xs font-medium text-zinc-500 transition hover:border-white/[0.15] hover:text-white sm:text-sm"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={saving}
                                className="group relative inline-flex flex-[1.6] items-center justify-center gap-2 overflow-hidden rounded-xl bg-[linear-gradient(90deg,#fff_0%,#c8f5ff_22%,#a393ff_50%,#f28bd7_76%,#fff_100%)] px-4 py-3 text-xs font-semibold text-zinc-950 shadow-[0_8px_30px_rgba(120,200,255,0.12)] transition duration-300 hover:shadow-[0_10px_40px_rgba(160,140,255,0.18)] disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
                            >
                                {saving ? 'Saving Changes...' : 'Save Portfolio'}

                                {!saving && (
                                    <ArrowUpRight className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                    </div>
                </form>

            </div>
        </DashboardLayout>
    );
}
