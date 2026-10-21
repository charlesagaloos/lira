import { Head, Link } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import type { MouseEvent } from 'react';

import Footer from '../../Components/Footer';
import Header from '../../Components/Header';
import Portfolio from '../Public/Portfolio';
import type {
    GalleryResponsiveSettings,
    GalleryResponsiveSettingsMap,
    PortfolioGalleryImage,
    PortfolioNavigationItem,
    PortfolioProfile,
    PortfolioProject,
    PortfolioRelease,
    PortfolioSettings,
} from '../Public/types';
import usePublicTheme from '../../lib/usePublicTheme';

interface Props {
    sampleImage: string;
}

type ColorKey =
    | 'primary_color'
    | 'background_color'
    | 'text_color'
    | 'accent_color'
    | 'hover_color'
    | 'surface_color'
    | 'muted_text_color'
    | 'border_color'
    | 'card_background_color'
    | 'card_text_color'
    | 'card_accent_color'
    | 'card_primary_color'
    | 'card_hover_color';

type ProfileTextKey =
    | 'display_name'
    | 'bio'
    | 'about_me'
    | 'artist_type'
    | 'location'
    | 'website';

type DemoDevice = keyof GalleryResponsiveSettingsMap;
type GalleryLayout = GalleryResponsiveSettings['display'];
type GalleryAspect = GalleryResponsiveSettings['image_aspect'];

const colorFields: { key: ColorKey; label: string }[] = [
    { key: 'primary_color', label: 'Primary' },
    { key: 'background_color', label: 'Background' },
    { key: 'text_color', label: 'Text' },
    { key: 'accent_color', label: 'Accent' },
    { key: 'hover_color', label: 'Hover' },
    { key: 'surface_color', label: 'Surface' },
    { key: 'muted_text_color', label: 'Muted text' },
    { key: 'border_color', label: 'Border' },
    { key: 'card_background_color', label: 'Card background' },
    { key: 'card_text_color', label: 'Card text' },
    { key: 'card_accent_color', label: 'Card accent' },
    { key: 'card_primary_color', label: 'Card primary' },
    { key: 'card_hover_color', label: 'Card hover' },
];

const palettePresets: {
    name: string;
    colors: Record<ColorKey, string>;
}[] = [
    {
        name: 'Midnight',
        colors: {
            primary_color: '#d9c5ff',
            background_color: '#09090b',
            text_color: '#f4f2f8',
            accent_color: '#a78bfa',
            hover_color: '#c4b5fd',
            surface_color: '#15131b',
            muted_text_color: '#a6a0b0',
            border_color: '#383242',
            card_background_color: '#17141d',
            card_text_color: '#f4f2f8',
            card_accent_color: '#c4b5fd',
            card_primary_color: '#a78bfa',
            card_hover_color: '#ddd0ff',
        },
    },
    {
        name: 'Terracotta',
        colors: {
            primary_color: '#f4d2bf',
            background_color: '#17100e',
            text_color: '#f8eee8',
            accent_color: '#db8b68',
            hover_color: '#f0a582',
            surface_color: '#251914',
            muted_text_color: '#c0a79a',
            border_color: '#50352a',
            card_background_color: '#2a1c16',
            card_text_color: '#f8eee8',
            card_accent_color: '#f0a582',
            card_primary_color: '#db8b68',
            card_hover_color: '#ffd1bb',
        },
    },
    {
        name: 'Tide',
        colors: {
            primary_color: '#b8f1ee',
            background_color: '#081313',
            text_color: '#e8f6f5',
            accent_color: '#57c9c3',
            hover_color: '#7fe2dc',
            surface_color: '#102020',
            muted_text_color: '#9ab8b6',
            border_color: '#254241',
            card_background_color: '#122524',
            card_text_color: '#e8f6f5',
            card_accent_color: '#7fe2dc',
            card_primary_color: '#57c9c3',
            card_hover_color: '#b8f1ee',
        },
    },
];

const galleryLayouts: GalleryLayout[] = [
    'grid',
    'masonry',
    'editorial',
    'freeform',
];

const galleryAspects: GalleryAspect[] = [
    'original',
    'square',
    'portrait',
    'landscape',
];

const navigationDestinations = [
    { value: 'home', label: 'Home' },
    { value: 'work', label: 'Selected work' },
    { value: 'gallery', label: 'Gallery' },
    { value: 'music', label: 'Music' },
    { value: 'about', label: 'About' },
    { value: 'artist_message', label: 'Artist message' },
    { value: 'contact', label: 'Contact' },
    { value: 'footer', label: 'Footer' },
    { value: 'external', label: 'External URL' },
];

function createDemoSettings(sampleImage: string): PortfolioSettings {
    return {
        template: 'default',
        primary_color: '#d9c5ff',
        background_color: '#09090b',
        text_color: '#f4f2f8',
        accent_color: '#a78bfa',
        hover_color: '#c4b5fd',
        surface_color: '#15131b',
        muted_text_color: '#a6a0b0',
        border_color: '#383242',
        card_background_color: '#17141d',
        card_text_color: '#f4f2f8',
        card_accent_color: '#c4b5fd',
        card_primary_color: '#a78bfa',
        card_hover_color: '#ddd0ff',
        cover_image: sampleImage,
        cover_image_position_x: 50,
        cover_image_position_y: 50,
        cover_image_zoom: 1,
        cover_image_offset_x: 0,
        cover_image_offset_y: 0,
        show_hero: true,
        hero_label: 'Independent artist',
        hero_statement: 'Making room for wonder.',
        show_work: true,
        work_label: 'Selected work',
        work_description: 'A collection of images and ideas gathered along the way.',
        show_about: true,
        about_label: 'About the artist',
        show_artist_message: true,
        artist_message_label: 'A note from the studio',
        artist_message:
            'I look for the quiet details that make a place feel alive. Thank you for spending a little time in my world.',
        canvas_background_text: 'ARTIST NAME',
        show_gallery: true,
        gallery_label: 'Field notes',
        gallery_description: 'Studies, experiments, and moments between projects.',
        gallery_display: 'grid',
        gallery_columns: 3,
        gallery_image_aspect: 'original',
        gallery_responsive: {
            desktop: {
                display: 'grid',
                columns: 3,
                image_aspect: 'original',
            },
            tablet: {
                display: 'masonry',
                columns: 2,
                image_aspect: 'original',
            },
            mobile: {
                display: 'grid',
                columns: 1,
                image_aspect: 'portrait',
            },
        },
        gallery_show_captions: true,
        gallery_show_titles: true,
        gallery_enable_lightbox: true,
        gallery_images: [
            {
                id: 1,
                image: sampleImage,
                title: 'Last light',
                caption: 'The studio, just before the day ends.',
                alt_text: 'Artist working in a softly lit studio',
                sort_order: 0,
            },
            {
                id: 2,
                image: sampleImage,
                title: 'A quiet afternoon',
                caption: 'Notes from a slow afternoon.',
                alt_text: 'A quiet moment in the artist studio',
                sort_order: 1,
            },
            {
                id: 3,
                image: sampleImage,
                title: 'In progress',
                caption: 'Work in progress, Los Angeles.',
                alt_text: 'A work in progress in the studio',
                sort_order: 2,
            },
        ],
        show_music: true,
        music_label: 'Listening room',
        music_release_display: 'latest',
        music_release_limit: 3,
        featured_release_id: 1,
        show_music_links: true,
        music_description: 'A few sounds that have been keeping me company.',
        navigation_items: [
            { id: 1, label: 'Work', destination: 'work', url: null, sort_order: 0, is_visible: true },
            { id: 2, label: 'About', destination: 'about', url: null, sort_order: 1, is_visible: true },
            { id: 3, label: 'Gallery', destination: 'gallery', url: null, sort_order: 2, is_visible: true },
            { id: 4, label: 'Music', destination: 'music', url: null, sort_order: 3, is_visible: true },
        ],
        show_navigation: true,
        show_footer: true,
        footer_label: 'Stay in touch',
        footer_message: 'For collaborations, kind notes, and everything in between.',
        show_footer_socials: true,
        footer_logo: null,
        copyright_text: '© 2026 Artist Name',
        show_powered_by_lira: true,
    };
}

function createDemoProjects(sampleImage: string): PortfolioProject[] {
    return [
        {
            id: 1,
            title: 'Soft Geometry',
            slug: 'soft-geometry',
            description: 'A study of shape, shadow, and the spaces in between.',
            project_type: 'Photography',
            thumbnail: sampleImage,
            thumbnail_position_x: 50,
            thumbnail_position_y: 50,
            thumbnail_zoom: 1,
            thumbnail_offset_x: 0,
            thumbnail_offset_y: 0,
            url: null,
        },
        {
            id: 2,
            title: 'After the Rain',
            slug: 'after-the-rain',
            description: 'Small observations from the city after a storm.',
            project_type: 'Art direction',
            thumbnail: sampleImage,
            thumbnail_position_x: 50,
            thumbnail_position_y: 50,
            thumbnail_zoom: 1,
            thumbnail_offset_x: 0,
            thumbnail_offset_y: 0,
            url: null,
        },
        {
            id: 3,
            title: 'Between Places',
            slug: 'between-places',
            description: 'A visual journal about travel and belonging.',
            project_type: 'Visual journal',
            thumbnail: sampleImage,
            thumbnail_position_x: 50,
            thumbnail_position_y: 50,
            thumbnail_zoom: 1,
            thumbnail_offset_x: 0,
            thumbnail_offset_y: 0,
            url: null,
        },
    ];
}

function createDemoReleases(): PortfolioRelease[] {
    return [
        {
            id: 1,
            title: 'Rooms of Light',
            release_type: 'EP',
            artwork: null,
            release_date: '2026-03-18',
            description: 'A small collection for slow mornings.',
            spotify_url: null,
            apple_music_url: null,
            youtube_url: null,
            soundcloud_url: null,
            bandcamp_url: null,
            lyrics: null,
        },
        {
            id: 2,
            title: 'The Long Way Home',
            release_type: 'Single',
            artwork: null,
            release_date: '2025-10-04',
            description: 'A song about finding your way back.',
            spotify_url: null,
            apple_music_url: null,
            youtube_url: null,
            soundcloud_url: null,
            bandcamp_url: null,
            lyrics: null,
        },
    ];
}

function createDemoProfile(
    sampleImage: string,
    settings: PortfolioSettings,
): PortfolioProfile {
    return {
        username: 'artist-name',
        display_name: 'Artist Name',
        bio: 'Artist, photographer, and collector of quiet moments.',
        about_me:
            'I am a multidisciplinary artist based in Los Angeles. My work explores memory, light, and the small rituals that connect us to a place.',
        artist_type: 'Visual artist & photographer',
        location: 'Los Angeles, California',
        website: 'https://example.com',
        avatar: null,
        cover_image: sampleImage,
        avatar_zoom: 1,
        avatar_position_x: 50,
        avatar_position_y: 50,
        social_links: [
            {
                id: 1,
                platform: 'Instagram',
                url: 'https://example.com',
                position: 0,
                is_visible: true,
            },
        ],
        portfolio_settings: settings,
        projects: createDemoProjects(sampleImage),
        releases: createDemoReleases(),
    };
}

function Field({
    label,
    value,
    onChange,
    multiline = false,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    multiline?: boolean;
}) {
    const className =
        'portfolio-demo-field mt-2 w-full rounded-xl border border-white/10 bg-black/25 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-cyan-200/50 focus:ring-2 focus:ring-cyan-200/10';

    return (
        <label className="block text-xs text-zinc-400">
            {label}
            {multiline ? (
                <textarea
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    rows={3}
                    className={className}
                />
            ) : (
                <input
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    className={className}
                />
            )}
        </label>
    );
}

function ColorField({
    label,
    value,
    onChange,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
}) {
    return (
        <label className="flex min-w-0 items-center justify-between gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2 text-xs text-zinc-400">
            <span className="truncate">{label}</span>
            <input
                type="color"
                aria-label={`${label} color`}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="h-7 w-8 shrink-0 cursor-pointer rounded border-0 bg-transparent p-0"
            />
        </label>
    );
}

function Toggle({
    label,
    checked,
    onChange,
}: {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}) {
    return (
        <label className="flex cursor-pointer items-center justify-between gap-4 py-1 text-sm text-zinc-300">
            {label}
            <input
                type="checkbox"
                checked={checked}
                onChange={(event) => onChange(event.target.checked)}
                className="h-4 w-4 accent-cyan-300"
            />
        </label>
    );
}

function SelectField({
    label,
    value,
    options,
    onChange,
}: {
    label: string;
    value: string;
    options: { value: string; label: string; disabled?: boolean }[];
    onChange: (value: string) => void;
}) {
    return (
        <label className="block text-xs text-zinc-400">
            {label}
            <select
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="portfolio-demo-field mt-2 w-full rounded-xl border border-white/10 bg-[#111214] px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-200/50"
            >
                {options.map((option) => (
                    <option
                        key={option.value}
                        value={option.value}
                        disabled={option.disabled}
                    >
                        {option.label}
                    </option>
                ))}
            </select>
        </label>
    );
}

function RangeField({
    label,
    value,
    min,
    max,
    step = 1,
    onChange,
}: {
    label: string;
    value: number;
    min: number;
    max: number;
    step?: number;
    onChange: (value: number) => void;
}) {
    return (
        <label className="block text-xs text-zinc-400">
            <span className="flex justify-between gap-3">
                {label}
                <span className="tabular-nums text-zinc-500">{value}</span>
            </span>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(event) => onChange(Number(event.target.value))}
                className="mt-2 w-full accent-cyan-300"
            />
        </label>
    );
}

function FileField({
    label,
    accept = 'image/*',
    multiple = false,
    onFiles,
}: {
    label: string;
    accept?: string;
    multiple?: boolean;
    onFiles: (files: File[]) => void;
}) {
    return (
        <label className="inline-flex cursor-pointer items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-zinc-300 transition hover:border-cyan-200/30 hover:text-white">
            {label}
            <input
                type="file"
                accept={accept}
                multiple={multiple}
                className="sr-only"
                onChange={(event) => {
                    onFiles(Array.from(event.currentTarget.files ?? []));
                    event.currentTarget.value = '';
                }}
            />
        </label>
    );
}

function PanelSection({
    title,
    description,
    defaultOpen = false,
    children,
}: {
    title: string;
    description?: string;
    defaultOpen?: boolean;
    children: React.ReactNode;
}) {
    return (
        <details
            open={defaultOpen}
            className="group rounded-2xl border border-white/[0.08] bg-white/[0.025]"
        >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-4">
                <span>
                    <span className="block text-sm font-medium text-white">
                        {title}
                    </span>
                    {description && (
                        <span className="mt-1 block text-xs leading-5 text-zinc-500">
                            {description}
                        </span>
                    )}
                </span>
                <span className="text-zinc-500 transition group-open:rotate-45">
                    +
                </span>
            </summary>
            <div className="grid gap-4 border-t border-white/[0.07] px-4 py-4">
                {children}
            </div>
        </details>
    );
}

function updateGalleryResponsive<K extends keyof GalleryResponsiveSettings>(
    current: GalleryResponsiveSettingsMap,
    device: DemoDevice,
    key: K,
    value: GalleryResponsiveSettings[K],
): GalleryResponsiveSettingsMap {
    return {
        ...current,
        [device]: {
            ...current[device],
            [key]: value,
        },
    };
}

export default function Demo({ sampleImage }: Props) {
    const { theme, toggleTheme } = usePublicTheme();
    const [settings, setSettings] = useState(() =>
        createDemoSettings(sampleImage),
    );
    const [profile, setProfile] = useState(() =>
        createDemoProfile(sampleImage, settings),
    );
    const [mobileView, setMobileView] = useState<'edit' | 'preview'>('edit');
    const objectUrls = useRef<string[]>([]);
    const nextGalleryImageId = useRef(10);
    const nextNavigationItemId = useRef(5);

    useEffect(
        () => () => {
            objectUrls.current.forEach((url) => URL.revokeObjectURL(url));
        },
        [],
    );

    const previewProfile: PortfolioProfile = {
        ...profile,
        portfolio_settings: settings,
    };

    function updateSetting<K extends keyof PortfolioSettings>(
        key: K,
        value: PortfolioSettings[K],
    ) {
        setSettings((current) => ({ ...current, [key]: value }));
    }

    function updateProfile(key: ProfileTextKey, value: string) {
        setProfile((current) => ({ ...current, [key]: value }));
    }

    function makeLocalImage(file: File): string {
        const url = URL.createObjectURL(file);
        objectUrls.current.push(url);
        return url;
    }

    function setSingleImage(
        file: File | undefined,
        update: (image: string) => void,
    ) {
        if (file) {
            update(makeLocalImage(file));
        }
    }

    function updateNavigation(
        index: number,
        updates: Partial<PortfolioNavigationItem>,
    ) {
        setSettings((current) => ({
            ...current,
            navigation_items: current.navigation_items.map((item, itemIndex) =>
                itemIndex === index ? { ...item, ...updates } : item,
            ),
        }));
    }

    function addNavigationItem() {
        const id = nextNavigationItemId.current++;

        setSettings((current) => {
            const destination =
                navigationDestinations.find(
                    (option) =>
                        option.value === 'external' ||
                        !current.navigation_items.some(
                            (item) => item.destination === option.value,
                        ),
                )?.value ?? 'external';

            return {
                ...current,
                navigation_items: [
                    ...current.navigation_items,
                    {
                        id,
                        label: 'New Link',
                        destination,
                        url: null,
                        sort_order: current.navigation_items.length,
                        is_visible: true,
                    },
                ],
            };
        });
    }

    function moveNavigationItem(index: number, direction: -1 | 1) {
        setSettings((current) => {
            const items = [...current.navigation_items];
            const destination = index + direction;

            if (destination < 0 || destination >= items.length) {
                return current;
            }

            [items[index], items[destination]] = [
                items[destination],
                items[index],
            ];

            return {
                ...current,
                navigation_items: items.map((item, sortOrder) => ({
                    ...item,
                    sort_order: sortOrder,
                })),
            };
        });
    }

    function removeNavigationItem(index: number) {
        setSettings((current) => ({
            ...current,
            navigation_items: current.navigation_items
                .filter((_, itemIndex) => itemIndex !== index)
                .map((item, sortOrder) => ({
                    ...item,
                    sort_order: sortOrder,
                })),
        }));
    }

    function updateGalleryImage(
        index: number,
        updates: Partial<PortfolioGalleryImage>,
    ) {
        setSettings((current) => ({
            ...current,
            gallery_images: current.gallery_images.map((image, imageIndex) =>
                imageIndex === index ? { ...image, ...updates } : image,
            ),
        }));
    }

    function moveGalleryImage(index: number, direction: -1 | 1) {
        setSettings((current) => {
            const images = [...current.gallery_images];
            const destination = index + direction;

            if (destination < 0 || destination >= images.length) {
                return current;
            }

            [images[index], images[destination]] = [
                images[destination],
                images[index],
            ];

            return {
                ...current,
                gallery_images: images.map((image, sortOrder) => ({
                    ...image,
                    sort_order: sortOrder,
                })),
            };
        });
    }

    function addGalleryImages(files: File[]) {
        const additions = files.map((file) => ({
            id: nextGalleryImageId.current++,
            image: makeLocalImage(file),
            title: file.name.replace(/\.[^.]+$/, ''),
            caption: '',
            alt_text: file.name.replace(/\.[^.]+$/, ''),
            sort_order: 0,
        }));

        setSettings((current) => {
            const firstSortOrder = current.gallery_images.length;

            return {
                ...current,
                gallery_images: [
                    ...current.gallery_images,
                    ...additions.map((image, index) => ({
                        ...image,
                        sort_order: firstSortOrder + index,
                    })),
                ],
            };
        });
    }

    function resetDemo() {
        objectUrls.current.forEach((url) => URL.revokeObjectURL(url));
        objectUrls.current = [];
        nextGalleryImageId.current = 10;
        nextNavigationItemId.current = 5;
        const resetSettings = createDemoSettings(sampleImage);
        setSettings(resetSettings);
        setProfile(createDemoProfile(sampleImage, resetSettings));
        setMobileView('edit');
    }

    function keepPreviewLocal(event: MouseEvent<HTMLDivElement>) {
        const target = event.target;

        if (target instanceof Element) {
            const link = target.closest('a');

            if (link && !link.getAttribute('href')?.startsWith('#')) {
                event.preventDefault();
            }
        }
    }

    const responsiveSettings =
        settings.gallery_responsive ?? createDemoSettings(sampleImage).gallery_responsive!;

    return (
        <main
            className="public-site min-h-screen bg-[#070809] text-white"
            data-public-theme={theme}
        >
            <Head title="Portfolio Demo" />
            <Header theme={theme} onToggleTheme={toggleTheme} />

            <div className="mx-auto w-full max-w-[1920px] px-4 pb-16 pt-28 sm:px-6 lg:px-10">
                <div className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                    <div>
                        <p className="portfolio-demo-badge inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[0.07] px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.22em] text-cyan-200">
                            <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                            Interactive portfolio demo
                        </p>
                        <h1 className="mt-4 text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">
                            Make it yours.
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
                            Try every portfolio setting with a sample artist.
                            Changes update the preview instantly and stay only
                            in this browser.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={resetDemo}
                        className="self-start rounded-full border border-white/10 px-4 py-2.5 text-xs text-zinc-300 transition hover:border-white/25 hover:text-white sm:self-auto"
                    >
                        Reset demo
                    </button>
                </div>

                <div className="mb-4 grid grid-cols-2 gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-1.5 lg:hidden">
                    <button
                        type="button"
                        aria-pressed={mobileView === 'edit'}
                        onClick={() => setMobileView('edit')}
                        className={`rounded-xl px-3 py-2.5 text-xs transition ${mobileView === 'edit' ? 'bg-white/10 text-white' : 'text-zinc-500'}`}
                    >
                        Edit settings
                    </button>
                    <button
                        type="button"
                        aria-pressed={mobileView === 'preview'}
                        onClick={() => setMobileView('preview')}
                        className={`rounded-xl px-3 py-2.5 text-xs transition ${mobileView === 'preview' ? 'bg-white/10 text-white' : 'text-zinc-500'}`}
                    >
                        Live preview
                    </button>
                </div>

                <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(340px,430px)_minmax(0,1fr)] lg:items-start">
                    <section
                        aria-label="Demo portfolio settings"
                        className={`portfolio-demo-settings ${mobileView === 'edit' ? 'block' : 'hidden'} min-w-0 space-y-3 lg:block`}
                    >
                        <div className="flex items-start gap-3 rounded-2xl border border-cyan-200/15 bg-cyan-200/[0.04] p-4">
                            <span className="mt-0.5 text-cyan-200" aria-hidden="true">i</span>
                            <p className="portfolio-demo-info-icon text-xs leading-5 text-zinc-400">
                                Demo mode is on. Uploads and edits are temporary
                                and are not sent to LIRA or saved to an account.
                            </p>
                        </div>

                        <PanelSection
                            title="Theme & colors"
                            description="Choose a layout and tune its color palette."
                            defaultOpen
                        >
                            <SelectField
                                label="Portfolio theme"
                                value={settings.template}
                                options={[
                                    { value: 'default', label: 'Default' },
                                    { value: 'editorial', label: 'Editorial' },
                                    { value: 'canvas', label: 'Canvas' },
                                    { value: 'motion', label: 'Motion' },
                                    { value: 'musician', label: 'Musician' },
                                ]}
                                onChange={(value) => updateSetting('template', value)}
                            />
                            <div>
                                <p className="mb-2 text-xs text-zinc-400">Color presets</p>
                                <div className="grid grid-cols-3 gap-2">
                                    {palettePresets.map((preset) => (
                                        <button
                                            key={preset.name}
                                            type="button"
                                            onClick={() =>
                                                setSettings((current) => ({
                                                    ...current,
                                                    ...preset.colors,
                                                }))
                                            }
                                            className="rounded-xl border border-white/10 bg-white/[0.025] px-3 py-2 text-left text-xs text-zinc-300 transition hover:border-white/25"
                                        >
                                            <span className="mb-2 flex gap-1">
                                                {[
                                                    preset.colors.background_color,
                                                    preset.colors.accent_color,
                                                    preset.colors.primary_color,
                                                ].map((color) => (
                                                    <span
                                                        key={color}
                                                        className="h-3 w-3 rounded-full border border-white/15"
                                                        style={{ backgroundColor: color }}
                                                    />
                                                ))}
                                            </span>
                                            {preset.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {colorFields.map(({ key, label }) => (
                                    <ColorField
                                        key={key}
                                        label={label}
                                        value={settings[key]}
                                        onChange={(value) => updateSetting(key, value)}
                                    />
                                ))}
                            </div>
                            <div className="grid gap-3 border-t border-white/[0.07] pt-4">
                                <p className="text-xs font-medium text-zinc-300">Cover image & crop</p>
                                <div className="flex flex-wrap gap-2">
                                    <FileField
                                        label="Replace cover image"
                                        onFiles={(files) =>
                                            setSingleImage(files[0], (image) =>
                                                updateSetting('cover_image', image),
                                            )
                                        }
                                    />
                                    <button
                                        type="button"
                                        onClick={() => updateSetting('cover_image', null)}
                                        className="rounded-full border border-white/10 px-3 py-2 text-xs text-zinc-400 hover:text-white"
                                    >
                                        Remove image
                                    </button>
                                </div>
                                <RangeField
                                    label="Image horizontal position"
                                    value={settings.cover_image_position_x}
                                    min={0}
                                    max={100}
                                    onChange={(value) => updateSetting('cover_image_position_x', value)}
                                />
                                <RangeField
                                    label="Image vertical position"
                                    value={settings.cover_image_position_y}
                                    min={0}
                                    max={100}
                                    onChange={(value) => updateSetting('cover_image_position_y', value)}
                                />
                                <RangeField
                                    label="Image zoom"
                                    value={settings.cover_image_zoom}
                                    min={1}
                                    max={2.5}
                                    step={0.05}
                                    onChange={(value) => updateSetting('cover_image_zoom', value)}
                                />
                                <RangeField
                                    label="Horizontal offset"
                                    value={settings.cover_image_offset_x}
                                    min={-100}
                                    max={100}
                                    onChange={(value) => updateSetting('cover_image_offset_x', value)}
                                />
                                <RangeField
                                    label="Vertical offset"
                                    value={settings.cover_image_offset_y}
                                    min={-100}
                                    max={100}
                                    onChange={(value) => updateSetting('cover_image_offset_y', value)}
                                />
                            </div>
                        </PanelSection>

                        <PanelSection
                            title="Profile & sections"
                            description="Edit sample artist details and portfolio copy."
                        >
                            <div className="flex items-center gap-3">
                                <img
                                    src={profile.avatar ?? sampleImage}
                                    alt=""
                                    className="h-12 w-12 rounded-full object-cover"
                                />
                                <div className="flex flex-wrap gap-2">
                                    <FileField
                                        label="Replace profile image"
                                        onFiles={(files) =>
                                            setSingleImage(files[0], (image) =>
                                                setProfile((current) => ({
                                                    ...current,
                                                    avatar: image,
                                                })),
                                            )
                                        }
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setProfile((current) => ({
                                                ...current,
                                                avatar: null,
                                            }))
                                        }
                                        className="rounded-full border border-white/10 px-3 py-2 text-xs text-zinc-400 hover:text-white"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                            <Field
                                label="Artist name"
                                value={profile.display_name}
                                onChange={(value) => updateProfile('display_name', value)}
                            />
                            <Field
                                label="Artist type"
                                value={profile.artist_type ?? ''}
                                onChange={(value) => updateProfile('artist_type', value)}
                            />
                            <Field
                                label="Location"
                                value={profile.location ?? ''}
                                onChange={(value) => updateProfile('location', value)}
                            />
                            <Field
                                label="Website"
                                value={profile.website ?? ''}
                                onChange={(value) => updateProfile('website', value)}
                            />
                            <Field
                                label="Short bio"
                                value={profile.bio ?? ''}
                                onChange={(value) => updateProfile('bio', value)}
                                multiline
                            />
                            <Field
                                label="About the artist"
                                value={profile.about_me ?? ''}
                                onChange={(value) => updateProfile('about_me', value)}
                                multiline
                            />
                            <div className="border-t border-white/[0.07] pt-4">
                                <Toggle
                                    label="Show hero"
                                    checked={settings.show_hero}
                                    onChange={(value) => updateSetting('show_hero', value)}
                                />
                                {settings.show_hero && (
                                    <div className="mt-3 grid gap-3">
                                        <Field
                                            label="Hero label"
                                            value={settings.hero_label ?? ''}
                                            onChange={(value) => updateSetting('hero_label', value)}
                                        />
                                        <Field
                                            label="Hero statement"
                                            value={settings.hero_statement ?? ''}
                                            onChange={(value) => updateSetting('hero_statement', value)}
                                            multiline
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="border-t border-white/[0.07] pt-4">
                                <Toggle
                                    label="Show work"
                                    checked={settings.show_work}
                                    onChange={(value) => updateSetting('show_work', value)}
                                />
                                {settings.show_work && (
                                    <div className="mt-3 grid gap-3">
                                        <Field
                                            label="Work section label"
                                            value={settings.work_label ?? ''}
                                            onChange={(value) => updateSetting('work_label', value)}
                                        />
                                        <Field
                                            label="Work description"
                                            value={settings.work_description ?? ''}
                                            onChange={(value) => updateSetting('work_description', value)}
                                            multiline
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="border-t border-white/[0.07] pt-4">
                                <Toggle
                                    label="Show about section"
                                    checked={settings.show_about}
                                    onChange={(value) => updateSetting('show_about', value)}
                                />
                                {settings.show_about && (
                                    <div className="mt-3">
                                        <Field
                                            label="About section label"
                                            value={settings.about_label ?? ''}
                                            onChange={(value) => updateSetting('about_label', value)}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="border-t border-white/[0.07] pt-4">
                                <Toggle
                                    label="Show artist message"
                                    checked={settings.show_artist_message}
                                    onChange={(value) => updateSetting('show_artist_message', value)}
                                />
                                {settings.show_artist_message && (
                                    <div className="mt-3 grid gap-3">
                                        <Field
                                            label="Message section label"
                                            value={settings.artist_message_label ?? ''}
                                            onChange={(value) => updateSetting('artist_message_label', value)}
                                        />
                                        <Field
                                            label="Artist message"
                                            value={settings.artist_message ?? ''}
                                            onChange={(value) => updateSetting('artist_message', value)}
                                            multiline
                                        />
                                    </div>
                                )}
                            </div>
                            <Field
                                label="Canvas background text"
                                value={settings.canvas_background_text}
                                onChange={(value) => updateSetting('canvas_background_text', value)}
                            />
                        </PanelSection>

                        <PanelSection
                            title="Gallery"
                            description="Adjust layouts, responsive behavior, and sample images."
                        >
                            <Toggle
                                label="Show gallery"
                                checked={settings.show_gallery}
                                onChange={(value) => updateSetting('show_gallery', value)}
                            />
                            {settings.show_gallery && (
                                <>
                                    <Field
                                        label="Gallery label"
                                        value={settings.gallery_label ?? ''}
                                        onChange={(value) => updateSetting('gallery_label', value)}
                                    />
                                    <Field
                                        label="Gallery description"
                                        value={settings.gallery_description ?? ''}
                                        onChange={(value) => updateSetting('gallery_description', value)}
                                        multiline
                                    />
                                    <div className="grid grid-cols-2 gap-3">
                                        <SelectField
                                            label="Layout"
                                            value={settings.gallery_display}
                                            options={galleryLayouts.map((layout) => ({
                                                value: layout,
                                                label: layout[0].toUpperCase() + layout.slice(1),
                                            }))}
                                            onChange={(value) =>
                                                updateSetting('gallery_display', value as GalleryLayout)
                                            }
                                        />
                                        <SelectField
                                            label="Columns"
                                            value={String(settings.gallery_columns)}
                                            options={[1, 2, 3, 4].map((columns) => ({
                                                value: String(columns),
                                                label: String(columns),
                                            }))}
                                            onChange={(value) =>
                                                updateSetting('gallery_columns', Number(value))
                                            }
                                        />
                                    </div>
                                    <SelectField
                                        label="Image aspect ratio"
                                        value={settings.gallery_image_aspect}
                                        options={galleryAspects.map((aspect) => ({
                                            value: aspect,
                                            label: aspect[0].toUpperCase() + aspect.slice(1),
                                        }))}
                                        onChange={(value) =>
                                            updateSetting('gallery_image_aspect', value as GalleryAspect)
                                        }
                                    />
                                    <div className="border-t border-white/[0.07] pt-3">
                                        <p className="mb-3 text-xs font-medium text-zinc-300">
                                            Responsive gallery settings
                                        </p>
                                        <div className="grid gap-3">
                                            {(['desktop', 'tablet', 'mobile'] as DemoDevice[]).map((device) => (
                                                <div
                                                    key={device}
                                                    className="grid grid-cols-2 gap-2 rounded-xl border border-white/[0.07] p-3"
                                                >
                                                    <p className="col-span-2 text-xs capitalize text-zinc-400">
                                                        {device}
                                                    </p>
                                                    <SelectField
                                                        label="Layout"
                                                        value={responsiveSettings[device].display}
                                                        options={galleryLayouts.map((layout) => ({
                                                            value: layout,
                                                            label: layout,
                                                        }))}
                                                        onChange={(value) =>
                                                            setSettings((current) => ({
                                                                ...current,
                                                                gallery_responsive: updateGalleryResponsive(
                                                                    current.gallery_responsive ?? responsiveSettings,
                                                                    device,
                                                                    'display',
                                                                    value as GalleryLayout,
                                                                ),
                                                            }))
                                                        }
                                                    />
                                                    <SelectField
                                                        label="Columns"
                                                        value={String(responsiveSettings[device].columns)}
                                                        options={[1, 2, 3, 4].map((columns) => ({
                                                            value: String(columns),
                                                            label: String(columns),
                                                        }))}
                                                        onChange={(value) =>
                                                            setSettings((current) => ({
                                                                ...current,
                                                                gallery_responsive: updateGalleryResponsive(
                                                                    current.gallery_responsive ?? responsiveSettings,
                                                                    device,
                                                                    'columns',
                                                                    Number(value),
                                                                ),
                                                            }))
                                                        }
                                                    />
                                                    <div className="col-span-2">
                                                        <SelectField
                                                            label="Image aspect"
                                                            value={responsiveSettings[device].image_aspect}
                                                            options={galleryAspects.map((aspect) => ({
                                                                value: aspect,
                                                                label: aspect,
                                                            }))}
                                                            onChange={(value) =>
                                                                setSettings((current) => ({
                                                                    ...current,
                                                                    gallery_responsive: updateGalleryResponsive(
                                                                        current.gallery_responsive ?? responsiveSettings,
                                                                        device,
                                                                        'image_aspect',
                                                                        value as GalleryAspect,
                                                                    ),
                                                                }))
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="grid gap-1 border-t border-white/[0.07] pt-3">
                                        <Toggle
                                            label="Show image titles"
                                            checked={settings.gallery_show_titles}
                                            onChange={(value) => updateSetting('gallery_show_titles', value)}
                                        />
                                        <Toggle
                                            label="Show image captions"
                                            checked={settings.gallery_show_captions}
                                            onChange={(value) => updateSetting('gallery_show_captions', value)}
                                        />
                                        <Toggle
                                            label="Enable lightbox"
                                            checked={settings.gallery_enable_lightbox}
                                            onChange={(value) => updateSetting('gallery_enable_lightbox', value)}
                                        />
                                    </div>
                                    <div className="border-t border-white/[0.07] pt-3">
                                        <div className="mb-3 flex items-center justify-between gap-2">
                                            <p className="text-xs font-medium text-zinc-300">
                                                Gallery images ({settings.gallery_images.length})
                                            </p>
                                            <FileField
                                                label="Add images"
                                                multiple
                                                onFiles={addGalleryImages}
                                            />
                                        </div>
                                        <div className="grid gap-3">
                                            {settings.gallery_images.map((image, index) => (
                                                <div
                                                    key={image.id}
                                                    className="rounded-xl border border-white/[0.07] p-3"
                                                >
                                                    <div className="mb-3 flex items-center gap-3">
                                                        <img
                                                            src={image.image}
                                                            alt=""
                                                            className="h-14 w-14 rounded-lg object-cover"
                                                        />
                                                        <div className="flex flex-wrap gap-1.5">
                                                            <FileField
                                                                label="Replace"
                                                                onFiles={(files) =>
                                                                    setSingleImage(files[0], (url) =>
                                                                        updateGalleryImage(index, { image: url }),
                                                                    )
                                                                }
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => moveGalleryImage(index, -1)}
                                                                aria-label="Move image earlier"
                                                                className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-zinc-400 disabled:opacity-30"
                                                                disabled={index === 0}
                                                            >
                                                                ↑
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => moveGalleryImage(index, 1)}
                                                                aria-label="Move image later"
                                                                className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-zinc-400 disabled:opacity-30"
                                                                disabled={index === settings.gallery_images.length - 1}
                                                            >
                                                                ↓
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setSettings((current) => ({
                                                                        ...current,
                                                                        gallery_images: current.gallery_images
                                                                            .filter((_, itemIndex) => itemIndex !== index)
                                                                            .map((item, sortOrder) => ({
                                                                                ...item,
                                                                                sort_order: sortOrder,
                                                                            })),
                                                                    }))
                                                                }
                                                                className="rounded-full border border-rose-300/15 px-2.5 py-1 text-xs text-rose-200/80 hover:text-rose-100"
                                                            >
                                                                Remove
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="grid gap-3">
                                                        <Field
                                                            label="Title"
                                                            value={image.title ?? ''}
                                                            onChange={(value) =>
                                                                updateGalleryImage(index, { title: value })
                                                            }
                                                        />
                                                        <Field
                                                            label="Caption"
                                                            value={image.caption ?? ''}
                                                            onChange={(value) =>
                                                                updateGalleryImage(index, { caption: value })
                                                            }
                                                            multiline
                                                        />
                                                        <Field
                                                            label="Alt text"
                                                            value={image.alt_text ?? ''}
                                                            onChange={(value) =>
                                                                updateGalleryImage(index, { alt_text: value })
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </PanelSection>

                        <PanelSection
                            title="Music"
                            description="Choose how the sample artist's releases appear."
                        >
                            <Toggle
                                label="Show music section"
                                checked={settings.show_music}
                                onChange={(value) => updateSetting('show_music', value)}
                            />
                            {settings.show_music && (
                                <>
                                    <Field
                                        label="Music section label"
                                        value={settings.music_label ?? ''}
                                        onChange={(value) => updateSetting('music_label', value)}
                                    />
                                    <Field
                                        label="Music description"
                                        value={settings.music_description ?? ''}
                                        onChange={(value) => updateSetting('music_description', value)}
                                        multiline
                                    />
                                    <SelectField
                                        label="Release selection"
                                        value={settings.music_release_display}
                                        options={[
                                            { value: 'latest', label: 'Latest releases' },
                                            { value: 'all', label: 'All releases' },
                                        ]}
                                        onChange={(value) =>
                                            updateSetting('music_release_display', value as 'latest' | 'all')
                                        }
                                    />
                                    <SelectField
                                        label="Number of releases"
                                        value={String(settings.music_release_limit)}
                                        options={[1, 2, 3, 4, 5, 6, 8, 10].map((count) => ({
                                            value: String(count),
                                            label: String(count),
                                        }))}
                                        onChange={(value) =>
                                            updateSetting('music_release_limit', Number(value))
                                        }
                                    />
                                    <SelectField
                                        label="Featured release"
                                        value={String(settings.featured_release_id ?? '')}
                                        options={[
                                            { value: '', label: 'No featured release' },
                                            ...profile.releases.map((release) => ({
                                                value: String(release.id),
                                                label: release.title,
                                            })),
                                        ]}
                                        onChange={(value) =>
                                            updateSetting(
                                                'featured_release_id',
                                                value ? Number(value) : null,
                                            )
                                        }
                                    />
                                    <Toggle
                                        label="Show streaming links"
                                        checked={settings.show_music_links}
                                        onChange={(value) => updateSetting('show_music_links', value)}
                                    />
                                </>
                            )}
                        </PanelSection>

                        <PanelSection
                            title="Navigation"
                            description="Control the portfolio menu and its links."
                        >
                            <Toggle
                                label="Show navigation"
                                checked={settings.show_navigation}
                                onChange={(value) => updateSetting('show_navigation', value)}
                            />
                            {settings.show_navigation && (
                                <div className="grid gap-3">
                                    {settings.navigation_items.map((item, index) => (
                                        <div
                                            key={item.id ?? index}
                                            className="rounded-xl border border-white/[0.07] p-3"
                                        >
                                            <div className="mb-3 flex items-center justify-between gap-3">
                                                <span className="text-[10px] uppercase tracking-[0.15em] text-zinc-500">
                                                    Item {String(index + 1).padStart(2, '0')}
                                                </span>
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        type="button"
                                                        aria-label="Move navigation item up"
                                                        disabled={index === 0}
                                                        onClick={() => moveNavigationItem(index, -1)}
                                                        className="rounded-lg border border-white/10 px-2 py-1 text-xs text-zinc-400 disabled:opacity-30"
                                                    >
                                                        ↑
                                                    </button>
                                                    <button
                                                        type="button"
                                                        aria-label="Move navigation item down"
                                                        disabled={index === settings.navigation_items.length - 1}
                                                        onClick={() => moveNavigationItem(index, 1)}
                                                        className="rounded-lg border border-white/10 px-2 py-1 text-xs text-zinc-400 disabled:opacity-30"
                                                    >
                                                        ↓
                                                    </button>
                                                    <button
                                                        type="button"
                                                        aria-label="Remove navigation item"
                                                        onClick={() => removeNavigationItem(index)}
                                                        className="rounded-lg border border-rose-300/15 px-2 py-1 text-xs text-rose-200/80 hover:text-rose-100"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-[1fr_1fr_auto] items-end gap-2">
                                                <Field
                                                    label="Label"
                                                    value={item.label}
                                                    onChange={(value) =>
                                                        updateNavigation(index, { label: value })
                                                    }
                                                />
                                                <SelectField
                                                    label="Destination"
                                                    value={item.destination}
                                                    options={navigationDestinations.map((destination) => ({
                                                        ...destination,
                                                        disabled:
                                                            destination.value !== 'external' &&
                                                            settings.navigation_items.some(
                                                                (otherItem, otherIndex) =>
                                                                    otherIndex !== index &&
                                                                    otherItem.destination === destination.value,
                                                            ),
                                                    }))}
                                                    onChange={(value) =>
                                                        updateNavigation(index, {
                                                            destination: value,
                                                            url: value === 'external' ? item.url : null,
                                                        })
                                                    }
                                                />
                                                <input
                                                    type="checkbox"
                                                    aria-label={`Show ${item.label} navigation link`}
                                                    checked={item.is_visible}
                                                    onChange={(event) =>
                                                        updateNavigation(index, {
                                                            is_visible: event.target.checked,
                                                        })
                                                    }
                                                    className="mb-3 h-4 w-4 accent-cyan-300"
                                                />
                                            </div>
                                            {item.destination === 'external' && (
                                                <div className="mt-3">
                                                    <Field
                                                        label="External URL"
                                                        value={item.url ?? ''}
                                                        onChange={(value) =>
                                                            updateNavigation(index, { url: value })
                                                        }
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={addNavigationItem}
                                        className="rounded-xl border border-dashed border-white/15 px-3 py-3 text-xs text-zinc-400 transition hover:border-cyan-200/30 hover:text-white"
                                    >
                                        Add navigation item
                                    </button>
                                </div>
                            )}
                        </PanelSection>

                        <PanelSection
                            title="Footer"
                            description="Edit the closing message and branding."
                        >
                            <Toggle
                                label="Show footer"
                                checked={settings.show_footer}
                                onChange={(value) => updateSetting('show_footer', value)}
                            />
                            {settings.show_footer && (
                                <>
                                    <Field
                                        label="Footer label"
                                        value={settings.footer_label ?? ''}
                                        onChange={(value) => updateSetting('footer_label', value)}
                                    />
                                    <Field
                                        label="Footer message"
                                        value={settings.footer_message ?? ''}
                                        onChange={(value) => updateSetting('footer_message', value)}
                                        multiline
                                    />
                                    <Field
                                        label="Copyright text"
                                        value={settings.copyright_text ?? ''}
                                        onChange={(value) => updateSetting('copyright_text', value)}
                                    />
                                    <div className="flex items-center gap-3">
                                        {settings.footer_logo && (
                                            <img
                                                src={settings.footer_logo}
                                                alt=""
                                                className="h-10 max-w-32 object-contain"
                                            />
                                        )}
                                        <FileField
                                            label="Upload footer logo"
                                            onFiles={(files) =>
                                                setSingleImage(files[0], (image) =>
                                                    updateSetting('footer_logo', image),
                                                )
                                            }
                                        />
                                        {settings.footer_logo && (
                                            <button
                                                type="button"
                                                onClick={() => updateSetting('footer_logo', null)}
                                                className="text-xs text-zinc-400 hover:text-white"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                    <Toggle
                                        label="Show social links"
                                        checked={settings.show_footer_socials}
                                        onChange={(value) => updateSetting('show_footer_socials', value)}
                                    />
                                    <Toggle
                                        label="Show Powered by LIRA"
                                        checked={settings.show_powered_by_lira}
                                        onChange={(value) =>
                                            updateSetting('show_powered_by_lira', value)
                                        }
                                    />
                                </>
                            )}
                        </PanelSection>

                        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
                            <p className="text-sm font-medium text-white">
                                Ready to make it yours?
                            </p>
                            <p className="mt-2 text-xs leading-5 text-zinc-500">
                                Create an account to build and save your own artist portfolio.
                            </p>
                            <Link
                                href="/register"
                                className="mt-4 inline-flex rounded-full bg-cyan-200 px-4 py-2.5 text-xs font-semibold text-[#071014] transition hover:bg-cyan-100"
                            >
                                Create your account
                            </Link>
                        </div>
                    </section>

                    <section
                        aria-label="Live portfolio preview"
                        className={`${mobileView === 'preview' ? 'block' : 'hidden'} min-w-0 lg:block`}
                    >
                        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0b0d]">
                            <div className="portfolio-demo-preview-chrome flex items-center justify-between gap-3 border-b border-white/[0.08] px-4 py-3">
                                <div>
                                    <p className="text-xs font-medium text-white">Live portfolio</p>
                                    <p className="mt-1 text-[10px] text-zinc-500">
                                        {settings.template} theme · changes are temporary
                                    </p>
                                </div>
                                <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-emerald-300">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                                    Preview
                                </span>
                            </div>
                            <div
                                className="public-portfolio-preview relative isolate transform-gpu max-h-[calc(100vh-12rem)] min-h-[560px] overflow-y-auto bg-black"
                                onClick={keepPreviewLocal}
                            >
                                <Portfolio profile={previewProfile} />
                            </div>
                        </div>
                        <p className="mt-3 text-center text-xs text-zinc-600">
                            Preview links are disabled. Create an account to publish your own.
                        </p>
                    </section>
                </div>
            </div>

            <Footer theme={theme} />
        </main>
    );
}
