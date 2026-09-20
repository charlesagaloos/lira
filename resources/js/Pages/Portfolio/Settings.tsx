import {
    ChangeEvent,
    FormEvent,
    PointerEvent,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from 'react';

import { Link, router } from '@inertiajs/react';

import DashboardLayout from '../../Components/Dashboard/d_layout';

import {
    ArrowLeft,
    ArrowUpRight,
    CheckIcon,
} from '../../Components/Icons';

interface Settings {
    template: string;
    primary_color: string;
    background_color: string;
    text_color: string;
    accent_color: string;
    card_background_color: string;
    card_text_color: string;
    card_accent_color: string;

    cover_image: string | null;
    cover_image_position_x: number;
    cover_image_position_y: number;
    cover_image_zoom: number;
    cover_image_offset_x: number;
    cover_image_offset_y: number;
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
}

interface Props {
    settings: Settings;
    profile: Profile;
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
    cardBackground: string;
    cardText: string;
    cardAccent: string;
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

/*
|--------------------------------------------------------------------------
| Glass Section
|--------------------------------------------------------------------------
*/

function GlassSection({
    eyebrow,
    title,
    description,
    children,
}: {
    eyebrow?: string;
    title: string;
    description?: string;
    children: React.ReactNode;
}) {
    return (
        <section className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.025] shadow-[0_20px_80px_rgba(0,0,0,0.24)] backdrop-blur-2xl">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.045),transparent_35%,rgba(255,255,255,0.012))]" />

            <div className="relative p-6 sm:p-8">
                {(eyebrow || title || description) && (
                    <div className="mb-8">
                        {eyebrow && (
                            <p className="text-[9px] uppercase tracking-[0.24em] text-zinc-600">
                                {eyebrow}
                            </p>
                        )}

                        <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">
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

/*
|--------------------------------------------------------------------------
| Color Field
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| Palette Button
|--------------------------------------------------------------------------
*/

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

            <div className="flex gap-1.5">
                <span
                    className="h-8 flex-1 rounded-lg"
                    style={{
                        backgroundColor: palette.background,
                    }}
                />

                <span
                    className="h-8 w-8 rounded-lg"
                    style={{
                        backgroundColor: palette.primary,
                    }}
                />

                <span
                    className="h-8 w-8 rounded-lg"
                    style={{
                        backgroundColor: palette.accent,
                    }}
                />

                <span
                    className="h-8 w-8 rounded-lg"
                    style={{
                        backgroundColor:
                            palette.cardBackground,
                    }}
                />
            </div>

            <p className="mt-3 text-[9px] uppercase tracking-[0.16em] text-zinc-600 transition group-hover:text-zinc-300">
                {palette.name}
            </p>
        </button>
    );
}

/*
|--------------------------------------------------------------------------
| Cover Image Preview
|--------------------------------------------------------------------------
*/

function CoverImagePreview({
    coverImage,
    positionX,
    positionY,
    zoom,
    offsetX,
    offsetY,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    isDragging,
    deviceGuide,
}: {
    coverImage: string | null;
    positionX: number;
    positionY: number;
    zoom: number;
    offsetX: number;
    offsetY: number;
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
    deviceGuide: 'desktop' | 'tablet' | 'mobile';
}) {
    return (
        <div
            className={`group relative aspect-[266/114] overflow-hidden bg-black select-none ${coverImage && isDragging
                ? 'cursor-grabbing'
                : coverImage
                    ? 'cursor-grab'
                    : 'cursor-pointer'
                }`}
            style={{
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
                <img
                    src={coverImage}
                    alt="Cover preview"
                    draggable={false}
                    className="pointer-events-none absolute inset-0 h-full w-full max-w-none object-cover select-none"
                    style={{
                        objectPosition: `${positionX}% ${positionY}%`,
                        transform: `translate(${offsetX}px, ${offsetY}px) scale(${zoom})`,
                    }}
                />
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

            {coverImage && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div
                        className={`relative border border-white/25 shadow-[0_0_0_9999px_rgba(0,0,0,0.16)] ${deviceGuide === 'desktop'
                            ? 'h-[72%] w-[88%]'
                            : deviceGuide === 'tablet'
                                ? 'h-[76%] w-[58%]'
                                : 'h-[86%] w-[24%]'
                            }`}
                    >
                        <div className="absolute left-2 top-2 rounded-md border border-white/15 bg-black/45 px-2 py-1 text-[7px] uppercase tracking-[0.16em] text-white/55 backdrop-blur-sm">
                            {deviceGuide === 'desktop'
                                ? 'Desktop · 1440 × 900'
                                : deviceGuide === 'tablet'
                                    ? 'Tablet · 1024 × 1366'
                                    : 'Mobile · 390 × 844'}
                        </div>
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

/*
|--------------------------------------------------------------------------
| Default Portfolio Preview
|--------------------------------------------------------------------------
|
| This mirrors the actual Public/Portfolio.tsx structure.
|
*/

function DefaultPortfolioPreview({
    settings,
}: {
    settings: Settings;
}) {
    return (
        <div
            className="overflow-hidden rounded-2xl border border-white/[0.08] bg-black shadow-2xl"
            style={{
                backgroundColor: settings.background_color,
                color: settings.text_color,
            }}
        >
            {/* ================================================================
                DEFAULT TEMPLATE WIREFRAME
            ================================================================= */}

            <div className="relative">
                <div className="absolute right-4 top-4 z-20 rounded-full border border-white/[0.08] bg-black/60 px-3 py-1.5 text-[7px] uppercase tracking-[0.18em] text-zinc-500 backdrop-blur-md">
                    Structure Preview
                </div>

                {/* HERO */}
                <section className="relative flex min-h-[430px] items-end overflow-hidden border-b border-white/[0.08]">
                    <div className="absolute inset-4 rounded-xl border border-dashed border-white/[0.14]">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="flex flex-col items-center gap-2 text-center">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.02]">
                                    <span className="text-[12px] text-zinc-600">
                                        +
                                    </span>
                                </div>

                                <span className="text-[7px] uppercase tracking-[0.2em] text-zinc-700">
                                    Cover Image
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 w-full px-5 pb-8">
                        <div className="mb-4 h-14 w-14 rounded-full border border-white/[0.16] bg-white/[0.025]" />

                        <div className="mb-2 h-1.5 w-16 rounded-full bg-white/[0.12]" />

                        <div
                            className="h-5 w-36 rounded-full"
                            style={{
                                backgroundColor: `${settings.primary_color}28`,
                                border: `1px solid ${settings.primary_color}35`,
                            }}
                        />

                        <div className="mt-4 flex items-center gap-2">
                            <span className="h-1.5 w-12 rounded-full bg-white/[0.08]" />
                            <span className="h-1.5 w-1.5 rounded-full bg-white/[0.06]" />
                            <span className="h-1.5 w-16 rounded-full bg-white/[0.08]" />
                        </div>

                        <div
                            className="mt-5 h-7 w-24 rounded-full border"
                            style={{
                                borderColor: `${settings.accent_color}35`,
                                backgroundColor: `${settings.accent_color}12`,
                            }}
                        />
                    </div>
                </section>

                {/* ABOUT */}
                <section
                    className="border-b px-5 py-10"
                    style={{
                        borderColor: `${settings.text_color}18`,
                    }}
                >
                    <div className="mb-6 h-1.5 w-12 rounded-full bg-white/[0.12]" />

                    <div className="space-y-2">
                        <div
                            className="h-3 w-32 rounded-full"
                            style={{
                                backgroundColor: `${settings.text_color}20`,
                            }}
                        />
                        <div
                            className="h-2 w-full max-w-[280px] rounded-full"
                            style={{
                                backgroundColor: `${settings.text_color}0d`,
                            }}
                        />
                        <div
                            className="h-2 w-4/5 max-w-[230px] rounded-full"
                            style={{
                                backgroundColor: `${settings.text_color}0d`,
                            }}
                        />
                    </div>
                </section>

                {/* PROJECTS */}
                <section className="border-b px-5 py-10">
                    <div className="mb-6">
                        <div className="mb-3 h-1.5 w-16 rounded-full bg-white/[0.12]" />

                        <div
                            className="h-4 w-24 rounded-full"
                            style={{
                                backgroundColor: `${settings.primary_color}20`,
                            }}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {[1, 2, 3, 4].map((item) => (
                            <div
                                key={item}
                                className="overflow-hidden rounded-xl border"
                                style={{
                                    backgroundColor:
                                        settings.card_background_color,
                                    borderColor:
                                        `${settings.card_text_color}18`,
                                }}
                            >
                                <div className="relative aspect-[4/3] border-b border-white/[0.06]">
                                    <div className="absolute inset-2 rounded-lg border border-dashed border-white/[0.08]" />

                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-[6px] uppercase tracking-[0.15em] text-zinc-700">
                                            Project Image
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-2 p-3">
                                    <div className="h-1.5 w-10 rounded-full bg-white/[0.08]" />

                                    <div
                                        className="h-2.5 w-20 rounded-full"
                                        style={{
                                            backgroundColor:
                                                `${settings.card_accent_color}22`,
                                        }}
                                    />

                                    <div className="h-1.5 w-full rounded-full bg-white/[0.05]" />
                                    <div className="h-1.5 w-3/4 rounded-full bg-white/[0.05]" />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* FOOTER */}
                <div className="px-5 py-5 text-center">
                    <div className="mx-auto h-1.5 w-20 rounded-full bg-white/[0.06]" />
                </div>
            </div>
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| Main Settings Page
|--------------------------------------------------------------------------
*/

export default function Settings({
    settings,
    profile,
}: Props) {
    const [template, setTemplate] = useState(
        settings.template,
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

    const [cardBackgroundColor, setCardBackgroundColor] =
        useState(settings.card_background_color);

    const [cardTextColor, setCardTextColor] = useState(
        settings.card_text_color,
    );

    const [cardAccentColor, setCardAccentColor] =
        useState(settings.card_accent_color);

    /*
    |--------------------------------------------------------------------------
    | Cover Image State
    |--------------------------------------------------------------------------
    */

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

    const [deviceGuide, setDeviceGuide] = useState<
        'desktop' | 'tablet' | 'mobile'
    >('desktop');

    /*
    |--------------------------------------------------------------------------
    | Load saved offsets into pixel values
    |--------------------------------------------------------------------------
    */

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

    /*
    |--------------------------------------------------------------------------
    | Blob Preview Cleanup
    |--------------------------------------------------------------------------
    */

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

    /*
    |--------------------------------------------------------------------------
    | Cover Image Validation
    |--------------------------------------------------------------------------
    */

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

    /*
    |--------------------------------------------------------------------------
    | Cover Image Upload
    |--------------------------------------------------------------------------
    */

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

        if (!dimensions.valid) {
            setCoverImage(null);
            setCoverImageError(
                `The cover image must be at least 2660 × 1140 px. This image is ${dimensions.width} × ${dimensions.height} px.`,
            );
            event.target.value = '';
            return;
        }

        const previousPreview =
            coverImagePreview;

        const previewUrl =
            URL.createObjectURL(file);

        setCoverImage(file);
        setCoverImagePreview(previewUrl);

        setRemoveCoverImage(false);

        /*
        |----------------------------------------------------------------------
        | Reset New Image Position
        |----------------------------------------------------------------------
        */

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

    /*
    |--------------------------------------------------------------------------
    | Open File Picker
    |--------------------------------------------------------------------------
    */

    function openCoverImagePicker() {
        fileInputRef.current?.click();
    }

    /*
    |--------------------------------------------------------------------------
    | Remove Cover Image
    |--------------------------------------------------------------------------
    */

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

    /*
    |--------------------------------------------------------------------------
    | Drag Cover Image
    |--------------------------------------------------------------------------
    */

    function handleCoverPointerDown(
        event: PointerEvent<HTMLDivElement>,
    ) {
        if (!coverImagePreview) {
            openCoverImagePicker();
            return;
        }

        const target =
            event.target as HTMLElement;

        /*
        |--------------------------------------------------------------------------
        | Don't start dragging from controls.
        |--------------------------------------------------------------------------
        */

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

        /*
        |--------------------------------------------------------------------------
        | Same crop-position behaviour as the project editor.
        |--------------------------------------------------------------------------
        */

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

        /*
        |--------------------------------------------------------------------------
        | Additional pixel movement available from zoom.
        |--------------------------------------------------------------------------
        */

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

    /*
    |--------------------------------------------------------------------------
    | Palettes
    |--------------------------------------------------------------------------
    */

    const palettes: Palette[] = [
        {
            name: 'Chrome',
            primary: '#ffffff',
            background: '#050607',
            text: '#f5f5f5',
            accent: '#7de7ff',
            cardBackground: '#0b0d0f',
            cardText: '#f5f5f5',
            cardAccent: '#9d8cff',
        },
        {
            name: 'Nocturne',
            primary: '#d9c7ff',
            background: '#0b0810',
            text: '#f4efff',
            accent: '#c084fc',
            cardBackground: '#15101d',
            cardText: '#eee6ff',
            cardAccent: '#f0abfc',
        },
        {
            name: 'Mono',
            primary: '#ffffff',
            background: '#080808',
            text: '#ffffff',
            accent: '#b8b8b8',
            cardBackground: '#141414',
            cardText: '#f2f2f2',
            cardAccent: '#ffffff',
        },
        {
            name: 'Aurora',
            primary: '#d9fff8',
            background: '#06100f',
            text: '#e9fffb',
            accent: '#58e6cf',
            cardBackground: '#0b1917',
            cardText: '#d9f8f2',
            cardAccent: '#8ef5e4',
        },
        {
            name: 'Electric',
            primary: '#e9ecff',
            background: '#070914',
            text: '#edf0ff',
            accent: '#6685ff',
            cardBackground: '#0d1224',
            cardText: '#dce2ff',
            cardAccent: '#8ba1ff',
        },
        {
            name: 'Gallery',
            primary: '#171717',
            background: '#f2f0eb',
            text: '#222222',
            accent: '#111111',
            cardBackground: '#ffffff',
            cardText: '#555555',
            cardAccent: '#171717',
        },
        {
            name: 'Rose',
            primary: '#fff1f7',
            background: '#13080d',
            text: '#ffeef4',
            accent: '#f05abf',
            cardBackground: '#211018',
            cardText: '#f8dce8',
            cardAccent: '#ff8ed3',
        },
        {
            name: 'Ivory',
            primary: '#201c17',
            background: '#eee9df',
            text: '#302b25',
            accent: '#9b7750',
            cardBackground: '#f8f5ee',
            cardText: '#5e564d',
            cardAccent: '#8a6744',
        },
    ];

    function applyPalette(
        palette: Palette,
    ) {
        setPrimaryColor(palette.primary);
        setBackgroundColor(palette.background);
        setTextColor(palette.text);
        setAccentColor(palette.accent);
        setCardBackgroundColor(
            palette.cardBackground,
        );
        setCardTextColor(palette.cardText);
        setCardAccentColor(
            palette.cardAccent,
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Preview Settings
    |--------------------------------------------------------------------------
    */

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

    const previewSettings: Settings = {
        template,
        primary_color: primaryColor,
        background_color: backgroundColor,
        text_color: textColor,
        accent_color: accentColor,
        card_background_color:
            cardBackgroundColor,
        card_text_color:
            cardTextColor,
        card_accent_color:
            cardAccentColor,

        cover_image:
            coverImagePreview,
        cover_image_position_x:
            coverImagePositionX,
        cover_image_position_y:
            coverImagePositionY,
        cover_image_zoom:
            coverImageZoom,
        cover_image_offset_x:
            coverImageOffsetXPercent,
        cover_image_offset_y:
            coverImageOffsetYPercent,
    };

    /*
    |--------------------------------------------------------------------------
    | Submit
    |--------------------------------------------------------------------------
    */

    function submit(
        event: FormEvent<HTMLFormElement>,
    ) {
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

        router.post(
            '/dashboard/portfolio/settings',
            {
                _method: 'put',

                template,

                primary_color:
                    primaryColor,

                background_color:
                    backgroundColor,

                text_color:
                    textColor,

                accent_color:
                    accentColor,

                card_background_color:
                    cardBackgroundColor,

                card_text_color:
                    cardTextColor,

                card_accent_color:
                    cardAccentColor,

                cover_image:
                    coverImage,

                remove_cover_image:
                    removeCoverImage,

                cover_image_position_x:
                    coverImagePositionX,

                cover_image_position_y:
                    coverImagePositionY,

                cover_image_zoom:
                    coverImageZoom,

                cover_image_offset_x:
                    offsetXPercent,

                cover_image_offset_y:
                    offsetYPercent,
            },
            {
                forceFormData: true,
                preserveScroll: true,

                onFinish: () => {
                    setSaving(false);
                },
            },
        );
    }

    return (
        <DashboardLayout>
            <div className="mx-auto max-w-[1400px] px-6 py-10 sm:px-8 lg:px-12 lg:py-12">
                {/* ============================================================
                    PAGE HEADER
                ============================================================= */}

                <div className="mb-12">
                    <div className="mb-5 flex items-center gap-3">
                        <span className="h-px w-8 bg-[linear-gradient(90deg,#ffffff,#7d8991,transparent)]" />

                        <span className="text-[9px] uppercase tracking-[0.35em] text-zinc-600">
                            LIRA / STUDIO / PORTFOLIO
                        </span>
                    </div>

                    <h1 className="text-4xl font-light tracking-[-0.055em] text-white sm:text-5xl">
                        Shape your{' '}
                        <span className="bg-[linear-gradient(90deg,#fff_0%,#bdefff_24%,#9d8cff_58%,#f08bd7_82%,#fff_100%)] bg-clip-text text-transparent">
                            space.
                        </span>
                    </h1>

                    <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-500 sm:text-base">
                        Customize the visual identity of your
                        public portfolio and see your changes
                        reflected in the actual template.
                    </p>
                </div>

                <form
                    onSubmit={submit}
                    className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]"
                >
                    {/* ========================================================
                        SETTINGS
                    ========================================================= */}

                    <div className="space-y-6">
                        {/* Template */}

                        <GlassSection
                            eyebrow="01 / TEMPLATE"
                            title="Choose your foundation."
                            description="Templates control the overall visual structure of your public portfolio."
                        >
                            <div className="grid gap-4">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setTemplate(
                                            'default',
                                        )
                                    }
                                    className={`group relative overflow-hidden rounded-2xl border p-5 text-left transition ${template ===
                                        'default'
                                        ? 'border-white/[0.22] bg-white/[0.06]'
                                        : 'border-white/[0.07] bg-black/20 hover:border-white/[0.14]'
                                        }`}
                                >
                                    <div className="grid gap-5 sm:grid-cols-[180px_1fr] sm:items-center">
                                        <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/[0.07] bg-black">
                                            {coverImagePreview ? (
                                                <img
                                                    src={
                                                        coverImagePreview
                                                    }
                                                    alt=""
                                                    className="absolute inset-0 h-full w-full object-cover"
                                                    style={{
                                                        objectPosition: `${coverImagePositionX}% ${coverImagePositionY}%`,
                                                        transform: `translate(${coverImageOffsetX}%, ${coverImageOffsetY}%) scale(${coverImageZoom})`,
                                                    }}
                                                />
                                            ) : (
                                                <div className="absolute inset-0 bg-gradient-to-br from-zinc-700 via-zinc-950 to-black" />
                                            )}

                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                                            <div className="absolute bottom-3 left-3">
                                                <div className="h-2 w-14 rounded-full bg-white/80" />

                                                <div className="mt-1.5 h-1 w-8 rounded-full bg-white/40" />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between gap-4">
                                            <div>
                                                <p className="text-sm font-medium text-zinc-200">
                                                    Default
                                                </p>

                                                <p className="mt-1 text-xs leading-5 text-zinc-600">
                                                    LIRA&apos;s current
                                                    portfolio experience
                                                    with hero, about, and
                                                    selected work sections.
                                                </p>
                                            </div>

                                            {template ===
                                                'default' && (
                                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#7de7ff]/20 bg-[#7de7ff]/[0.06]">
                                                        <CheckIcon className="h-3.5 w-3.5 text-[#7de7ff]" />
                                                    </div>
                                                )}
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </GlassSection>

                        {/* Color System */}

                        <GlassSection
                            eyebrow="02 / COLOR SYSTEM"
                            title="Define your visual language."
                            description="Set the colors that shape the actual public portfolio."
                        >
                            <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2">
                                <ColorField
                                    id="primary_color"
                                    label="Primary Color"
                                    description="Artist name and major portfolio headings."
                                    value={
                                        primaryColor
                                    }
                                    onChange={
                                        setPrimaryColor
                                    }
                                />

                                <ColorField
                                    id="accent_color"
                                    label="Accent Color"
                                    description="Interactive elements and portfolio highlights."
                                    value={
                                        accentColor
                                    }
                                    onChange={
                                        setAccentColor
                                    }
                                />

                                <ColorField
                                    id="background_color"
                                    label="Background Color"
                                    description="Main background behind portfolio sections."
                                    value={
                                        backgroundColor
                                    }
                                    onChange={
                                        setBackgroundColor
                                    }
                                />

                                <ColorField
                                    id="text_color"
                                    label="Text Color"
                                    description="Main typography throughout the portfolio."
                                    value={textColor}
                                    onChange={
                                        setTextColor
                                    }
                                />
                            </div>
                        </GlassSection>

                        {/* Cards */}

                        <GlassSection
                            eyebrow="03 / PROJECT CARDS"
                            title="Style your work."
                            description="Control how your projects appear inside the Default portfolio."
                        >
                            <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2">
                                <ColorField
                                    id="card_background_color"
                                    label="Card Background"
                                    description="Background behind project information."
                                    value={
                                        cardBackgroundColor
                                    }
                                    onChange={
                                        setCardBackgroundColor
                                    }
                                />

                                <ColorField
                                    id="card_text_color"
                                    label="Card Text"
                                    description="Project type and description text."
                                    value={
                                        cardTextColor
                                    }
                                    onChange={
                                        setCardTextColor
                                    }
                                />

                                <ColorField
                                    id="card_accent_color"
                                    label="Card Accent"
                                    description="Project titles and card emphasis."
                                    value={
                                        cardAccentColor
                                    }
                                    onChange={
                                        setCardAccentColor
                                    }
                                />
                            </div>
                        </GlassSection>

                        {/* Cover Image */}

                        <GlassSection
                            eyebrow="04 / COVER IMAGE"
                            title="Set the atmosphere."
                            description="Upload and position the image that becomes the hero background of your public portfolio."
                        >
                            <div className="space-y-5">
                                <div
                                    ref={
                                        coverPreviewRef
                                    }
                                    className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-black/30"
                                >
                                    <CoverImagePreview
                                        coverImage={
                                            coverImagePreview
                                        }
                                        positionX={
                                            coverImagePositionX
                                        }
                                        positionY={
                                            coverImagePositionY
                                        }
                                        zoom={
                                            coverImageZoom
                                        }
                                        offsetX={
                                            coverImageOffsetX
                                        }
                                        offsetY={
                                            coverImageOffsetY
                                        }
                                        onPointerDown={
                                            handleCoverPointerDown
                                        }
                                        onPointerMove={
                                            handleCoverPointerMove
                                        }
                                        onPointerUp={
                                            stopCoverDragging
                                        }
                                        isDragging={
                                            isDraggingCover
                                        }
                                        deviceGuide={
                                            deviceGuide
                                        }
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
                                        <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.07] bg-black/20 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                                            <div>
                                                <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-600">
                                                    Device Guide
                                                </p>
                                                <p className="mt-1 text-xs text-zinc-500">
                                                    Use the outline to preview how the hero may be framed across devices.
                                                </p>
                                            </div>

                                            <div className="flex shrink-0 items-center gap-1 rounded-full border border-white/[0.07] bg-black/30 p-1">
                                                {([
                                                    ['desktop', 'Desktop'],
                                                    ['tablet', 'Tablet'],
                                                    ['mobile', 'Mobile'],
                                                ] as const).map(([value, label]) => (
                                                    <button
                                                        key={value}
                                                        type="button"
                                                        onClick={() => setDeviceGuide(value)}
                                                        className={`rounded-full px-3 py-1.5 text-[8px] uppercase tracking-[0.12em] transition ${deviceGuide === value
                                                            ? 'bg-white/[0.1] text-white'
                                                            : 'text-zinc-600 hover:text-zinc-300'
                                                            }`}
                                                    >
                                                        {label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

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

                        {/* Presets */}

                        <GlassSection
                            eyebrow="05 / PRESETS"
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
                    </div>

                    {/* ========================================================
                        LIVE PREVIEW
                    ========================================================= */}

                    <aside className="space-y-6">
                        <div className="sticky top-24">
                            <GlassSection
                                eyebrow="LIVE / PREVIEW"
                                title="See your space."
                                description="This is the Default portfolio template rendered with your current settings."
                            >
                                <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-black shadow-2xl">
                                    {template ===
                                        'default' ? (
                                        <DefaultPortfolioPreview
                                            settings={
                                                previewSettings
                                            }
                                        />
                                    ) : null}
                                </div>

                                <div className="mt-5 rounded-2xl border border-white/[0.06] bg-black/20 p-4">
                                    <div className="flex items-start gap-3">
                                        <div
                                            className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border"
                                            style={{
                                                borderColor:
                                                    `${accentColor}25`,
                                                backgroundColor:
                                                    `${accentColor}0d`,
                                                color:
                                                    accentColor,
                                            }}
                                        >
                                            <CheckIcon className="h-3.5 w-3.5" />
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium text-zinc-300">
                                                Live template
                                                preview
                                            </p>

                                            <p className="mt-1 text-xs leading-5 text-zinc-600">
                                                Your changes are
                                                previewed here before
                                                they are saved.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </GlassSection>

                            {/* Save */}

                            <div className="mt-6 rounded-[28px] border border-white/[0.07] bg-white/[0.02] p-5 backdrop-blur-xl">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-[linear-gradient(90deg,#fff_0%,#c8f5ff_22%,#a393ff_50%,#f28bd7_76%,#fff_100%)] px-5 py-3.5 text-sm font-semibold text-zinc-950 shadow-[0_8px_30px_rgba(120,200,255,0.12)] transition duration-300 hover:shadow-[0_10px_40px_rgba(160,140,255,0.18)] disabled:cursor-not-allowed disabled:opacity-50"
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
                                    className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-white/[0.08] px-5 py-3.5 text-sm font-medium text-zinc-500 transition hover:border-white/[0.15] hover:text-white"
                                >
                                    Cancel
                                </Link>
                            </div>
                        </div>
                    </aside>
                </form>
            </div>
        </DashboardLayout>
    );
}
