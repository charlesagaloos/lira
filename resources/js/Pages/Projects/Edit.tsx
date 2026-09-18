import { FormEvent, useLayoutEffect, useRef, useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';

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

export default function Edit({ project }: Props) {
    const { errors } = usePage<{
        errors: Record<string, string>;
    }>().props;

    const [showErrors, setShowErrors] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);


    const [title, setTitle] = useState(project.title);
    const [description, setDescription] = useState(project.description ?? '');
    const [projectType, setProjectType] = useState(project.project_type ?? '');
    const [url, setUrl] = useState(project.url ?? '');

    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(
        project.thumbnail
            ? `/storage/${project.thumbnail}`
            : null,
    );
    const [imagePositionX, setImagePositionX] = useState(
        project.thumbnail_position_x,
    );
    const [imagePositionY, setImagePositionY] = useState(
        project.thumbnail_position_y,
    );
    const [imageZoom, setImageZoom] = useState(
        project.thumbnail_zoom,
    );

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
    }, []);

    function handleImagePointerDown(
        event: React.PointerEvent<HTMLDivElement>,
    ) {
        event.currentTarget.setPointerCapture(event.pointerId);

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

        const rect = event.currentTarget.getBoundingClientRect();

        const deltaX =
            ((event.clientX - dragStart.x) / rect.width) * 100;

        const deltaY =
            ((event.clientY - dragStart.y) / rect.height) * 100;

        // Normal crop positioning.
        setImagePositionX(
            Math.max(
                0,
                Math.min(100, dragStart.positionX - deltaX),
            ),
        );

        setImagePositionY(
            Math.max(
                0,
                Math.min(100, dragStart.positionY - deltaY),
            ),
        );

        // Additional movement available because of zoom.
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
                    dragStart.offsetX + offsetDeltaX,
                ),
            ),
        );

        setImageOffsetY(
            Math.max(
                -maxOffsetY,
                Math.min(
                    maxOffsetY,
                    dragStart.offsetY + offsetDeltaY,
                ),
            ),
        );
    }

    function handleImagePointerUp(
        event: React.PointerEvent<HTMLDivElement>,
    ) {
        event.currentTarget.releasePointerCapture(event.pointerId);

        setIsDragging(false);
        setDragStart(null);
    }

    function submit(event: FormEvent<HTMLFormElement>) {
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
                preserveScroll: true,

                onSuccess: () => {
                    setShowSuccess(true);

                    setTimeout(() => {
                        setShowSuccess(false);
                    }, 5000);
                },

                onError: () => {
                    setShowErrors(true);

                    setTimeout(() => {
                        setShowErrors(false);
                    }, 5000);
                },
            },
        );
    }

    return (
        <main className="min-h-screen bg-zinc-950 px-6 py-12 text-white sm:px-8 lg:px-12">
            {showErrors && Object.keys(errors).length > 0 && (
                <div className="fixed right-6 top-6 z-50 w-full max-w-sm">
                    <div className="rounded-2xl border border-red-500/20 bg-zinc-900/95 p-4 shadow-2xl backdrop-blur-md">
                        <div className="flex items-start gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-400">
                                !
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-red-300">
                                    Please fix the following errors
                                </p>

                                <ul className="mt-2 space-y-1.5 text-sm text-zinc-400">
                                    {Object.values(errors).map((error, index) => (
                                        <li key={index}>
                                            {error}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowErrors(false)}
                                className="text-lg leading-none text-zinc-500 transition hover:text-white"
                                aria-label="Close error notification"
                            >
                                ×
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showSuccess && (
                <div className="fixed right-6 top-6 z-50 w-full max-w-sm">
                    <div className="rounded-2xl border border-emerald-500/20 bg-zinc-900/95 p-4 shadow-2xl backdrop-blur-md">
                        <div className="flex items-start gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                                ✓
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-emerald-300">
                                    Success
                                </p>

                                <p className="mt-1 text-sm text-zinc-400">
                                    Project updated successfully.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowSuccess(false)}
                                className="text-lg leading-none text-zinc-500 transition hover:text-white"
                                aria-label="Close success notification"
                            >
                                ×
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="mx-auto max-w-3xl">
                <Link
                    href="/dashboard/projects"
                    className="text-sm text-zinc-500 transition hover:text-white"
                >
                    ← Back to Projects
                </Link>

                <div className="mt-10">
                    <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
                        Portfolio
                    </p>

                    <h1 className="mt-2 text-4xl font-bold tracking-tight">
                        Edit Project
                    </h1>

                    <p className="mt-3 text-zinc-400">
                        Update your project details.
                    </p>
                </div>

                <form onSubmit={submit} className="mt-10 space-y-6">
                    <div>
                        <label
                            htmlFor="title"
                            className="mb-2 block text-sm font-medium text-zinc-300"
                        >
                            Title
                        </label>

                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            required
                            className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-white/30"
                        />

                        {errors.title && (
                            <p className="mt-2 text-sm text-red-400">
                                {errors.title}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="project_type"
                            className="mb-2 block text-sm font-medium text-zinc-300"
                        >
                            Project Type
                        </label>

                        <input
                            id="project_type"
                            type="text"
                            value={projectType}
                            onChange={(event) => setProjectType(event.target.value)}
                            placeholder="e.g. Music, Artwork, Website"
                            className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-white/30"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="description"
                            className="mb-2 block text-sm font-medium text-zinc-300"
                        >
                            Description
                        </label>

                        <textarea
                            id="description"
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                            rows={6}
                            className="w-full resize-none rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-white/30"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="image"
                            className="mb-2 block text-sm font-medium text-zinc-300"
                        >
                            Project Image
                        </label>

                        {imagePreview && (
                            <div className="mb-4">
                                <div
                                    ref={imageEditorRef}
                                    className={`relative overflow-hidden rounded-xl border border-white/10 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'
                                        }`}
                                    onPointerDown={handleImagePointerDown}
                                    onPointerMove={handleImagePointerMove}
                                    onPointerUp={handleImagePointerUp}
                                    onPointerCancel={handleImagePointerUp}
                                    style={{
                                        touchAction: 'none',
                                    }}
                                >
                                    <img
                                        src={imagePreview}
                                        alt={project.title}
                                        className="aspect-[4/3] w-full object-cover select-none"
                                        draggable={false}
                                        style={{
                                            objectPosition: `${imagePositionX}% ${imagePositionY}%`,
                                            transform: `
                                                            translate(${imageOffsetX}px, ${imageOffsetY}px)
                                                            scale(${imageZoom / 100})
                                                        `,
                                            transformOrigin: 'center',
                                        }}
                                    />

                                    {!isDragging && (
                                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                            <div className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-black/50 px-5 py-4 text-center backdrop-blur-sm">
                                                <div className="relative h-6 w-6 text-white/80">
                                                    <span className="absolute left-1/2 top-0 -translate-x-1/2 text-sm">↑</span>
                                                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-sm">↓</span>
                                                    <span className="absolute left-0 top-1/2 -translate-y-1/2 text-sm">←</span>
                                                    <span className="absolute right-0 top-1/2 -translate-y-1/2 text-sm">→</span>
                                                </div>

                                                <span className="text-xs font-medium text-white">
                                                    Drag to position
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4 flex items-center gap-4">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setImageZoom((zoom) => Math.max(100, zoom - 10))
                                        }
                                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-zinc-900 text-lg text-zinc-300 transition hover:border-white/20 hover:text-white"
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
                                        onChange={(event) => {
                                            const zoom = Number(event.target.value);

                                            setImageZoom(zoom);

                                            if (zoom === 100) {
                                                setImageOffsetX(0);
                                                setImageOffsetY(0);
                                            }
                                        }}
                                        className="flex-1 accent-white"
                                        aria-label="Image zoom"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setImageZoom((zoom) => Math.min(200, zoom + 10))
                                        }
                                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-zinc-900 text-lg text-zinc-300 transition hover:border-white/20 hover:text-white"
                                        aria-label="Zoom in"
                                    >
                                        +
                                    </button>

                                    <span className="w-12 text-right text-sm tabular-nums text-zinc-500">
                                        {imageZoom}%
                                    </span>
                                </div>
                            </div>
                        )}

                        <input
                            id="image"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={(event) => {
                                const file = event.target.files?.[0] ?? null;

                                setImage(file);

                                if (file) {
                                    setImagePreview(URL.createObjectURL(file));
                                    setImagePositionX(50);
                                    setImagePositionY(50);
                                    setImageZoom(100);
                                    setImageOffsetX(0);
                                    setImageOffsetY(0);
                                }
                            }}
                            className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-zinc-300 outline-none transition file:mr-4 file:rounded-lg file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-semibold file:text-zinc-950 hover:file:bg-zinc-200 focus:border-white/30"
                        />

                        <p className="mt-2 text-xs text-zinc-500">
                            JPG, PNG, or WebP. Maximum file size: 5 MB.
                        </p>
                    </div>

                    <div>
                        <label
                            htmlFor="url"
                            className="mb-2 block text-sm font-medium text-zinc-300"
                        >
                            Project URL
                        </label>

                        <input
                            id="url"
                            type="url"
                            value={url}
                            onChange={(event) => setUrl(event.target.value)}
                            placeholder="https://..."
                            className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-white/30"
                        />
                    </div>

                    <div className="flex items-center gap-4 pt-4">
                        <Link
                            href="/dashboard/projects"
                            className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-zinc-300 transition hover:border-white/20 hover:text-white"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}
