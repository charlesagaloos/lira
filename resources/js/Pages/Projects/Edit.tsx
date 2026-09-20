import {
    ChangeEvent,
    FormEvent,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import type { PageProps as InertiaPageProps } from '@inertiajs/core';

import DashboardLayout from '../../Components/Dashboard/d_layout';
import {
    ArrowLeft,
    ArrowUpRight,
    CheckIcon,
} from '../../Components/Icons';

interface Project {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    project_type: string | null;
    thumbnail: string | null;
    thumbnail_position_x: number;
    thumbnail_position_y: number;
    thumbnail_zoom: number;
    thumbnail_offset_x: number;
    thumbnail_offset_y: number;
    url: string | null;
    position: number;
    is_visible: boolean;
}

interface Props {
    project: Project;
}

interface PageProps extends InertiaPageProps {
    errors: Record<string, string>;
}

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

function FieldLabel({
    htmlFor,
    children,
    optional = false,
}: {
    htmlFor: string;
    children: React.ReactNode;
    optional?: boolean;
}) {
    return (
        <label
            htmlFor={htmlFor}
            className="mb-2 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-400"
        >
            <span>{children}</span>

            {optional && (
                <span className="text-[9px] tracking-[0.12em] text-zinc-700">
                    OPTIONAL
                </span>
            )}
        </label>
    );
}

function FieldError({
    message,
}: {
    message?: string;
}) {
    if (!message) {
        return null;
    }

    return (
        <p className="mt-2 text-xs leading-5 text-red-400">
            {message}
        </p>
    );
}

function focusFirstError(errors: Record<string, string>) {
    const errorKeys = Object.keys(errors);

    if (errorKeys.length === 0) {
        return;
    }

    const firstError = errorKeys[0];

    const selectors: Record<string, string> = {
        title: '#title',
        project_type: '#project_type',
        description: '#description',
        url: '#url',
        image: '#image',
        thumbnail_position_x: '#image',
        thumbnail_position_y: '#image',
        thumbnail_zoom: '#image',
        thumbnail_offset_x: '#image',
        thumbnail_offset_y: '#image',
    };

    const selector = selectors[firstError];

    if (!selector) {
        return;
    }

    window.setTimeout(() => {
        const element = document.querySelector<
            HTMLInputElement | HTMLTextAreaElement
        >(selector);

        if (!element) {
            return;
        }

        element.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
        });

        element.focus();
    }, 50);
}

const inputClassName =
    'w-full rounded-2xl border border-white/[0.08] bg-black/30 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-white/20 focus:bg-white/[0.035] focus:ring-1 focus:ring-white/[0.06]';

export default function Edit({ project }: Props) {
    const { errors } = usePage<PageProps>().props;

    const [title, setTitle] = useState(project.title);
    const [description, setDescription] = useState(
        project.description ?? '',
    );
    const [projectType, setProjectType] = useState(
        project.project_type ?? '',
    );
    const [url, setUrl] = useState(project.url ?? '');

    const [image, setImage] = useState<File | null>(null);

    const [imagePreview, setImagePreview] = useState<string | null>(
        project.thumbnail
            ? `/storage/${project.thumbnail}`
            : null,
    );

    /*
     * Existing saved image positioning.
     */
    const [imagePositionX, setImagePositionX] = useState(
        project.thumbnail_position_x,
    );

    const [imagePositionY, setImagePositionY] = useState(
        project.thumbnail_position_y,
    );

    const [imageZoom, setImageZoom] = useState(
        project.thumbnail_zoom,
    );

    /*
     * Pixel offsets used while dragging.
     *
     * The database stores these as percentages.
     * They are converted to pixels when the editor loads.
     */
    const [imageOffsetX, setImageOffsetX] = useState(0);
    const [imageOffsetY, setImageOffsetY] = useState(0);

    const [isDragging, setIsDragging] = useState(false);

    const [dragStart, setDragStart] = useState<{
        x: number;
        y: number;
        positionX: number;
        positionY: number;
        offsetX: number;
        offsetY: number;
    } | null>(null);

    const imageEditorRef = useRef<HTMLDivElement | null>(null);

    /*
     * Load the saved percentage offsets into pixel values
     * based on the current editor dimensions.
     */
    useLayoutEffect(() => {
        const editor = imageEditorRef.current;

        if (!editor) {
            return;
        }

        setImageOffsetX(
            (project.thumbnail_offset_x / 100) *
            editor.clientWidth,
        );

        setImageOffsetY(
            (project.thumbnail_offset_y / 100) *
            editor.clientHeight,
        );
    }, [
        project.thumbnail_offset_x,
        project.thumbnail_offset_y,
    ]);

    /*
     * Clean up object URLs when the component unmounts
     * or the preview changes.
     */
    useEffect(() => {
        return () => {
            if (
                imagePreview &&
                imagePreview.startsWith('blob:')
            ) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    function handleImageChange(
        event: ChangeEvent<HTMLInputElement>,
    ) {
        const file = event.target.files?.[0] ?? null;

        setImage(file);

        if (!file) {
            return;
        }

        setImagePreview(URL.createObjectURL(file));

        /*
         * A newly selected image starts centered.
         */
        setImagePositionX(50);
        setImagePositionY(50);
        setImageZoom(100);
        setImageOffsetX(0);
        setImageOffsetY(0);
    }

    function handleImagePointerDown(
        event: React.PointerEvent<HTMLDivElement>,
    ) {
        event.preventDefault();

        event.currentTarget.setPointerCapture(
            event.pointerId,
        );

        setIsDragging(true);

        setDragStart({
            x: event.clientX,
            y: event.clientY,
            positionX: imagePositionX,
            positionY: imagePositionY,
            offsetX: imageOffsetX,
            offsetY: imageOffsetY,
        });
    }

    function handleImagePointerMove(
        event: React.PointerEvent<HTMLDivElement>,
    ) {
        if (!isDragging || !dragStart) {
            return;
        }

        const rect =
            event.currentTarget.getBoundingClientRect();

        const deltaX =
            ((event.clientX - dragStart.x) / rect.width) *
            100;

        const deltaY =
            ((event.clientY - dragStart.y) / rect.height) *
            100;

        /*
         * Normal crop positioning.
         */
        setImagePositionX(
            Math.max(
                0,
                Math.min(
                    100,
                    dragStart.positionX - deltaX,
                ),
            ),
        );

        setImagePositionY(
            Math.max(
                0,
                Math.min(
                    100,
                    dragStart.positionY - deltaY,
                ),
            ),
        );

        /*
         * Additional movement available because of zoom.
         */
        const zoomFactor = imageZoom / 100;

        const maxOffsetX =
            (rect.width * (zoomFactor - 1)) / 2;

        const maxOffsetY =
            (rect.height * (zoomFactor - 1)) / 2;

        const offsetDeltaX =
            event.clientX - dragStart.x;

        const offsetDeltaY =
            event.clientY - dragStart.y;

        setImageOffsetX(
            Math.max(
                -maxOffsetX,
                Math.min(
                    maxOffsetX,
                    dragStart.offsetX +
                    offsetDeltaX,
                ),
            ),
        );

        setImageOffsetY(
            Math.max(
                -maxOffsetY,
                Math.min(
                    maxOffsetY,
                    dragStart.offsetY +
                    offsetDeltaY,
                ),
            ),
        );
    }

    function handleImagePointerUp(
        event: React.PointerEvent<HTMLDivElement>,
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

        setIsDragging(false);
        setDragStart(null);
    }

    function handleZoomChange(zoom: number) {
        setImageZoom(zoom);

        /*
         * At 100%, there is no additional zoom space,
         * so reset the extra pixel offsets.
         */
        if (zoom === 100) {
            setImageOffsetX(0);
            setImageOffsetY(0);
        }
    }

    function submit(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        const editor = imageEditorRef.current;

        const offsetXPercent = editor
            ? (imageOffsetX / editor.clientWidth) * 100
            : 0;

        const offsetYPercent = editor
            ? (imageOffsetY / editor.clientHeight) * 100
            : 0;

        router.post(
            `/dashboard/projects/${project.id}`,
            {
                title,
                description,
                project_type: projectType,
                url,
                image,

                thumbnail_position_x: imagePositionX,
                thumbnail_position_y: imagePositionY,
                thumbnail_zoom: imageZoom,
                thumbnail_offset_x: offsetXPercent,
                thumbnail_offset_y: offsetYPercent,

                _method: 'put',
            },
            {
                forceFormData: true,

                preserveScroll: (page) => {
                    const pageErrors =
                        page.props.errors as Record<
                            string,
                            string
                        >;

                    if (
                        Object.keys(pageErrors).length >
                        0
                    ) {
                        focusFirstError(pageErrors);

                        return false;
                    }

                    return true;
                },
            },
        );
    }

    return (
        <DashboardLayout>
            <main className="min-h-screen">
                <div className="mx-auto max-w-[1400px] px-6 py-10 sm:px-8 lg:px-12 lg:py-12">
                    {/* ============================================================
                        PAGE HEADER
                    ============================================================ */}
                    <div className="relative mb-10">
                        <Link
                            href="/dashboard/projects"
                            className="group mb-7 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-zinc-600 transition hover:text-zinc-300"
                        >
                            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />

                            Back to Projects
                        </Link>

                        <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-600">
                            LIRA / STUDIO / PROJECTS
                        </p>

                        <div className="mt-3 max-w-3xl">
                            <h1 className="text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
                                Refine your{' '}
                                <span className="bg-[linear-gradient(90deg,#fff_0%,#bdefff_24%,#9d8cff_58%,#f08bd7_82%,#fff_100%)] bg-clip-text text-transparent">
                                    work.
                                </span>
                            </h1>

                            <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-500 sm:text-base">
                                Update the details, visual presentation,
                                and positioning of this project in your
                                LIRA portfolio.
                            </p>
                        </div>
                    </div>

                    {/* ============================================================
                        FORM
                    ============================================================ */}
                    <form
                        onSubmit={submit}
                        className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]"
                    >
                        {/* ========================================================
                            MAIN INFORMATION
                        ======================================================== */}
                        <div className="space-y-6">
                            <GlassSection
                                eyebrow="01 / PROJECT IDENTITY"
                                title="Tell the story of the work."
                                description="Update the details that define this project."
                            >
                                <div className="space-y-6">
                                    {/* Title */}
                                    <div>
                                        <FieldLabel htmlFor="title">
                                            Project Title
                                        </FieldLabel>

                                        <input
                                            id="title"
                                            type="text"
                                            value={title}
                                            onChange={(event) =>
                                                setTitle(
                                                    event.target
                                                        .value,
                                                )
                                            }
                                            className={inputClassName}
                                        />

                                        <FieldError
                                            message={errors.title}
                                        />
                                    </div>

                                    {/* Project Type */}
                                    <div>
                                        <FieldLabel
                                            htmlFor="project_type"
                                            optional
                                        >
                                            Project Type
                                        </FieldLabel>

                                        <input
                                            id="project_type"
                                            type="text"
                                            value={projectType}
                                            onChange={(event) =>
                                                setProjectType(
                                                    event.target
                                                        .value,
                                                )
                                            }
                                            placeholder="e.g. Music, Artwork, Website"
                                            className={inputClassName}
                                        />

                                        <FieldError
                                            message={
                                                errors.project_type
                                            }
                                        />
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <FieldLabel
                                            htmlFor="description"
                                            optional
                                        >
                                            Description
                                        </FieldLabel>

                                        <textarea
                                            id="description"
                                            value={description}
                                            onChange={(event) =>
                                                setDescription(
                                                    event.target
                                                        .value,
                                                )
                                            }
                                            rows={7}
                                            placeholder="Describe the work, your role, the concept, or anything you want visitors to know."
                                            className={`${inputClassName} resize-none leading-6`}
                                        />

                                        <div className="mt-2 flex items-center justify-between">
                                            <FieldError
                                                message={
                                                    errors.description
                                                }
                                            />

                                            <span className="ml-auto text-[9px] uppercase tracking-[0.16em] text-zinc-700">
                                                {description.length}
                                                /5000
                                            </span>
                                        </div>
                                    </div>

                                    {/* URL */}
                                    <div>
                                        <FieldLabel
                                            htmlFor="url"
                                            optional
                                        >
                                            Project URL
                                        </FieldLabel>

                                        <div className="relative">
                                            <input
                                                id="url"
                                                type="url"
                                                value={url}
                                                onChange={(event) =>
                                                    setUrl(
                                                        event.target
                                                            .value,
                                                    )
                                                }
                                                placeholder="https://..."
                                                className={`${inputClassName} pr-11`}
                                            />

                                            <ArrowUpRight className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-700" />
                                        </div>

                                        <FieldError
                                            message={errors.url}
                                        />

                                        <p className="mt-2 text-[10px] leading-5 text-zinc-700">
                                            Add a live website, track,
                                            gallery, case study, or
                                            other external destination.
                                        </p>
                                    </div>
                                </div>
                            </GlassSection>

                            {/* ====================================================
                                IMAGE
                            ==================================================== */}
                            <GlassSection
                                eyebrow="02 / VISUAL"
                                title="Shape the presentation."
                                description="Drag and zoom the image to control exactly how this project appears."
                            >
                                <div className="space-y-5">
                                    {imagePreview ? (
                                        <div>
                                            {/* Image editor */}
                                            <div
                                                ref={imageEditorRef}
                                                className={`group relative h-[420px] overflow-hidden rounded-2xl border border-white/[0.1] bg-black/20 sm:h-[480px] lg:h-[720px] ${isDragging
                                                        ? 'cursor-grabbing'
                                                        : 'cursor-grab'
                                                    }`}
                                                onPointerDown={
                                                    handleImagePointerDown
                                                }
                                                onPointerMove={
                                                    handleImagePointerMove
                                                }
                                                onPointerUp={
                                                    handleImagePointerUp
                                                }
                                                onPointerCancel={
                                                    handleImagePointerUp
                                                }
                                                style={{
                                                    touchAction: 'none',
                                                }}
                                            >
                                                <img
                                                    src={imagePreview}
                                                    alt={project.title}
                                                    className="h-full w-full select-none object-cover"
                                                    draggable={false}
                                                    style={{
                                                        objectPosition: `${imagePositionX}% ${imagePositionY}%`,
                                                        transform: `
                                                            translate(${imageOffsetX}px, ${imageOffsetY}px)
                                                            scale(${imageZoom / 100})
                                                        `,
                                                        transformOrigin:
                                                            'center',
                                                    }}
                                                />

                                                {/* Image overlay */}
                                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                                                {/* Drag instruction */}
                                                {!isDragging && (
                                                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                                        <div className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-black/50 px-5 py-4 text-center opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                                                            <div className="relative h-6 w-6 text-white/80">
                                                                <span className="absolute left-1/2 top-0 -translate-x-1/2 text-sm">
                                                                    ↑
                                                                </span>

                                                                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-sm">
                                                                    ↓
                                                                </span>

                                                                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-sm">
                                                                    ←
                                                                </span>

                                                                <span className="absolute right-0 top-1/2 -translate-y-1/2 text-sm">
                                                                    →
                                                                </span>
                                                            </div>

                                                            <span className="text-xs font-medium text-white">
                                                                Drag to position
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Current image */}
                                                <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
                                                    <div>
                                                        <p className="text-[9px] uppercase tracking-[0.2em] text-white/50">
                                                            Current image
                                                        </p>

                                                        <p className="mt-1 text-sm text-white">
                                                            {image
                                                                ? image.name
                                                                : 'Project thumbnail'}
                                                        </p>
                                                    </div>

                                                    <label
                                                        htmlFor="image"
                                                        className="pointer-events-auto shrink-0 cursor-pointer rounded-full border border-white/10 bg-black/50 px-3 py-1.5 text-[9px] uppercase tracking-[0.14em] text-zinc-300 backdrop-blur-md transition hover:border-white/20 hover:text-white"
                                                        onPointerDown={(event) =>
                                                            event.stopPropagation()
                                                        }
                                                    >
                                                        Change
                                                    </label>
                                                </div>
                                            </div>

                                            {/* Zoom controls */}
                                            <div className="mt-4 flex items-center gap-4">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleZoomChange(
                                                            Math.max(
                                                                100,
                                                                imageZoom -
                                                                10,
                                                            ),
                                                        )
                                                    }
                                                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-black/30 text-lg text-zinc-300 transition hover:border-white/20 hover:text-white"
                                                    aria-label="Zoom out"
                                                >
                                                    −
                                                </button>

                                                <input
                                                    type="range"
                                                    min="100"
                                                    max="200"
                                                    step="5"
                                                    value={imageZoom}
                                                    onChange={(event) =>
                                                        handleZoomChange(
                                                            Number(
                                                                event
                                                                    .target
                                                                    .value,
                                                            ),
                                                        )
                                                    }
                                                    className="flex-1 accent-white"
                                                    aria-label="Image zoom"
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleZoomChange(
                                                            Math.min(
                                                                200,
                                                                imageZoom +
                                                                10,
                                                            ),
                                                        )
                                                    }
                                                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-black/30 text-lg text-zinc-300 transition hover:border-white/20 hover:text-white"
                                                    aria-label="Zoom in"
                                                >
                                                    +
                                                </button>

                                                <span className="w-12 text-right text-sm tabular-nums text-zinc-500">
                                                    {imageZoom}%
                                                </span>
                                            </div>

                                            <p className="mt-3 text-[9px] uppercase tracking-[0.14em] text-zinc-700">
                                                Drag the image to adjust its
                                                position
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="rounded-2xl border border-dashed border-white/[0.1] bg-black/20 p-8 text-center">
                                            <p className="text-sm text-zinc-500">
                                                No project image has been
                                                uploaded.
                                            </p>

                                            <p className="mt-2 text-xs text-zinc-700">
                                                Choose an image below to add
                                                one.
                                            </p>
                                        </div>
                                    )}

                                    <input
                                        id="image"
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        onChange={handleImageChange}
                                        className="sr-only"
                                    />

                                    <label
                                        htmlFor="image"
                                        className="group flex cursor-pointer items-center justify-between rounded-2xl border border-white/[0.07] bg-black/20 px-4 py-3 transition hover:border-white/[0.14] hover:bg-white/[0.02]"
                                    >
                                        <div>
                                            <p className="text-sm font-medium text-zinc-300">
                                                {image
                                                    ? 'Replace project image'
                                                    : 'Choose project image'}
                                            </p>

                                            <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-zinc-700">
                                                JPG / PNG / WebP · Maximum
                                                15 MB
                                            </p>
                                        </div>

                                        <span className="rounded-full border border-white/[0.08] px-3 py-1.5 text-[9px] uppercase tracking-[0.14em] text-zinc-500 transition group-hover:border-white/[0.16] group-hover:text-zinc-300">
                                            Browse
                                        </span>
                                    </label>

                                    <FieldError
                                        message={errors.image}
                                    />
                                </div>
                            </GlassSection>
                        </div>

                        {/* ========================================================
                            SIDEBAR
                        ======================================================== */}
                        <aside className="space-y-6">
                            {/* Portfolio status */}
                            <GlassSection
                                eyebrow="03 / PRESENTATION"
                                title="Portfolio presence."
                                description="Control the project details that visitors will see."
                            >
                                <div className="rounded-2xl border border-white/[0.07] bg-black/20 p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-emerald-400/10 bg-emerald-400/[0.06]">
                                            <CheckIcon className="h-3.5 w-3.5 text-emerald-300" />
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium text-zinc-300">
                                                {project.is_visible
                                                    ? 'Visible on portfolio'
                                                    : 'Hidden from portfolio'}
                                            </p>

                                            <p className="mt-1 text-xs leading-5 text-zinc-600">
                                                Visibility can be changed
                                                later from your Projects
                                                studio.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </GlassSection>

                            {/* Project information */}
                            <GlassSection
                                eyebrow="LIRA / WORK"
                                title="Project details."
                                description="A quick reference for this work."
                            >
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                                        <span className="text-[9px] uppercase tracking-[0.16em] text-zinc-700">
                                            Position
                                        </span>

                                        <span className="text-xs tabular-nums text-zinc-400">
                                            {String(
                                                project.position,
                                            ).padStart(2, '0')}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-[9px] uppercase tracking-[0.16em] text-zinc-700">
                                            Status
                                        </span>

                                        <span
                                            className={`text-[9px] uppercase tracking-[0.14em] ${project.is_visible
                                                ? 'text-emerald-300/70'
                                                : 'text-zinc-600'
                                                }`}
                                        >
                                            {project.is_visible
                                                ? 'Visible'
                                                : 'Hidden'}
                                        </span>
                                    </div>
                                </div>
                            </GlassSection>

                            {/* Actions */}
                            <div className="rounded-[28px] border border-white/[0.07] bg-white/[0.02] p-5 backdrop-blur-xl">
                                <div className="flex flex-col gap-3">
                                    <button
                                        type="submit"
                                        className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-[linear-gradient(90deg,#fff_0%,#c8f5ff_22%,#a393ff_50%,#f28bd7_76%,#fff_100%)] px-5 py-3.5 text-sm font-semibold text-zinc-950 shadow-[0_8px_30px_rgba(120,200,255,0.12)] transition duration-300 hover:shadow-[0_10px_40px_rgba(160,140,255,0.18)]"
                                    >
                                        <span>
                                            Save Changes
                                        </span>

                                        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                    </button>

                                    <Link
                                        href="/dashboard/projects"
                                        className="inline-flex w-full items-center justify-center rounded-full border border-white/[0.08] px-5 py-3.5 text-sm font-medium text-zinc-500 transition hover:border-white/[0.15] hover:text-white"
                                    >
                                        Cancel
                                    </Link>
                                </div>
                            </div>
                        </aside>
                    </form>
                </div>
            </main>
        </DashboardLayout>
    );
}
