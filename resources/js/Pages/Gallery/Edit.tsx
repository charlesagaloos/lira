import {
    ChangeEvent,
    FormEvent,
    useEffect,
    useState,
} from 'react';

import { Head, Link, useForm } from '@inertiajs/react';

import DashboardLayout from '../../Components/Dashboard/d_layout';

import {
    ArrowLeft,
    ArrowUpRight,
} from '../../Components/Icons';

interface GalleryImage {
    id: number;
    image: string | null;
    title: string | null;
    caption: string | null;
    alt_text: string | null;
    sort_order: number;
}

interface GalleryFormData {
    image: File | null;
    title: string;
    caption: string;
    alt_text: string;
}

interface EditProps {
    galleryImage: GalleryImage;
}

function getImageUrl(path: string | null): string | null {
    if (!path) {
        return null;
    }

    if (
        path.startsWith('http://') ||
        path.startsWith('https://') ||
        path.startsWith('/')
    ) {
        return path;
    }

    return `/storage/${path}`;
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

const inputClassName =
    'w-full rounded-2xl border border-white/[0.08] bg-black/30 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-white/20 focus:bg-white/[0.035] focus:ring-1 focus:ring-white/[0.06]';

export default function Edit({
    galleryImage,
}: EditProps) {
    const {
        data,
        setData,
        put,
        processing,
        errors,
    } = useForm<GalleryFormData>({
        image: null,
        title: galleryImage.title ?? '',
        caption: galleryImage.caption ?? '',
        alt_text: galleryImage.alt_text ?? '',
    });

    const [imagePreview, setImagePreview] =
        useState<string | null>(
            getImageUrl(galleryImage.image),
        );

    useEffect(() => {
        return () => {
            if (imagePreview?.startsWith('blob:')) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    function handleImageChange(
        event: ChangeEvent<HTMLInputElement>,
    ) {
        const file = event.target.files?.[0] ?? null;

        event.target.value = '';

        if (!file) {
            return;
        }

        if (imagePreview?.startsWith('blob:')) {
            URL.revokeObjectURL(imagePreview);
        }

        setData('image', file);
        setImagePreview(URL.createObjectURL(file));
    }

    function submit(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        put(`/dashboard/gallery/${galleryImage.id}`, {
            forceFormData: true,
            preserveScroll: true,
        });
    }

    return (
        <DashboardLayout>
            <Head title="Edit Image" />

            <main className="min-h-screen">
                <div className="mx-auto max-w-[1400px] px-6 py-10 sm:px-8 lg:px-12 lg:py-12">
                    <div className="relative mb-10">
                        <Link
                            href="/dashboard/gallery"
                            className="group mb-7 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-zinc-600 transition hover:text-zinc-300"
                        >
                            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />

                            Back to Gallery
                        </Link>

                        <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-600">
                            LIRA / STUDIO / GALLERY
                        </p>

                        <div className="mt-3 max-w-3xl">
                            <h1 className="text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
                                Edit your{' '}
                                <span className="bg-[linear-gradient(90deg,#fff_0%,#bdefff_24%,#9d8cff_58%,#f08bd7_82%,#fff_100%)] bg-clip-text text-transparent">
                                    image.
                                </span>
                            </h1>

                            <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-500 sm:text-base">
                                Update the artwork, title, caption, or
                                accessibility information for this gallery
                                image.
                            </p>
                        </div>
                    </div>

                    <form
                        onSubmit={submit}
                        className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]"
                    >
                        <div className="space-y-6">
                            <GlassSection
                                eyebrow="01 / IMAGE"
                                title="Update the artwork."
                                description="Replace the existing image or keep it and update its details."
                            >
                                <div className="space-y-5">
                                    {imagePreview ? (
                                        <div>
                                            <div className="group relative mx-auto aspect-square w-full max-w-[640px] overflow-hidden rounded-2xl border border-white/[0.1] bg-black/20">
                                                <img
                                                    src={imagePreview}
                                                    alt={
                                                        data.alt_text ||
                                                        galleryImage.alt_text ||
                                                        data.title ||
                                                        galleryImage.title ||
                                                        'Gallery image preview'
                                                    }
                                                    className="h-full w-full select-none object-cover"
                                                    draggable={false}
                                                />

                                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                                                <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
                                                    <div className="min-w-0">
                                                        <p className="text-[9px] uppercase tracking-[0.2em] text-white/50">
                                                            Current image
                                                        </p>

                                                        <p className="mt-1 truncate text-sm text-white">
                                                            {data.image?.name ??
                                                                galleryImage.image
                                                                    ?.split('/')
                                                                    .pop()}
                                                        </p>
                                                    </div>

                                                    <label
                                                        htmlFor="image"
                                                        className="pointer-events-auto shrink-0 cursor-pointer rounded-full border border-white/10 bg-black/50 px-3 py-1.5 text-[9px] uppercase tracking-[0.14em] text-zinc-300 backdrop-blur-md transition hover:border-white/20 hover:text-white"
                                                    >
                                                        Change
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="mt-4 flex flex-col gap-2 text-[10px] uppercase tracking-[0.14em] text-zinc-700 sm:flex-row sm:items-center sm:justify-between">
                                                <span>
                                                    JPG / PNG / WebP / GIF
                                                </span>

                                                <span>
                                                    Maximum file size: 10 MB
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <label
                                            htmlFor="image"
                                            className="group relative block cursor-pointer overflow-hidden rounded-2xl border border-dashed border-white/[0.1] bg-black/20 transition hover:border-white/[0.18] hover:bg-white/[0.02]"
                                        >
                                            <div className="flex min-h-[420px] flex-col items-center justify-center px-6 py-12 text-center">
                                                <p className="text-sm font-medium text-zinc-300">
                                                    Choose replacement image
                                                </p>

                                                <span className="mt-5 rounded-full border border-white/[0.08] px-4 py-2 text-[9px] uppercase tracking-[0.16em] text-zinc-500 transition group-hover:border-white/[0.16] group-hover:text-zinc-300">
                                                    Browse files
                                                </span>
                                            </div>
                                        </label>
                                    )}

                                    <input
                                        id="image"
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp,image/gif"
                                        onChange={handleImageChange}
                                        className="sr-only"
                                    />

                                    <FieldError
                                        message={errors.image}
                                    />

                                    <div className="flex flex-col gap-2 text-[10px] uppercase tracking-[0.14em] text-zinc-700 sm:flex-row sm:items-center sm:justify-between">
                                        <span>
                                            Replacing the image will run the
                                            same content moderation check as
                                            a new gallery upload.
                                        </span>
                                    </div>
                                </div>
                            </GlassSection>

                            <GlassSection
                                eyebrow="02 / DETAILS"
                                title="Tell the story."
                                description="Update the information that helps visitors understand the work."
                            >
                                <div className="space-y-6">
                                    <div>
                                        <FieldLabel
                                            htmlFor="title"
                                            optional
                                        >
                                            Image Title
                                        </FieldLabel>

                                        <input
                                            id="title"
                                            type="text"
                                            value={data.title}
                                            onChange={(event) =>
                                                setData(
                                                    'title',
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="e.g. Untitled No. 01"
                                            maxLength={255}
                                            autoFocus
                                            className={inputClassName}
                                        />

                                        <FieldError
                                            message={errors.title}
                                        />
                                    </div>

                                    <div>
                                        <FieldLabel
                                            htmlFor="caption"
                                            optional
                                        >
                                            Caption
                                        </FieldLabel>

                                        <textarea
                                            id="caption"
                                            value={data.caption}
                                            onChange={(event) =>
                                                setData(
                                                    'caption',
                                                    event.target.value,
                                                )
                                            }
                                            rows={6}
                                            maxLength={500}
                                            placeholder="Add a short story, context, inspiration, or note about this work."
                                            className={`${inputClassName} resize-none leading-6`}
                                        />

                                        <div className="mt-2 flex items-center justify-between">
                                            <FieldError
                                                message={errors.caption}
                                            />

                                            <span className="ml-auto text-[9px] uppercase tracking-[0.16em] text-zinc-700">
                                                {data.caption.length}/500
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <FieldLabel
                                            htmlFor="alt_text"
                                            optional
                                        >
                                            Alt Text
                                        </FieldLabel>

                                        <input
                                            id="alt_text"
                                            type="text"
                                            value={data.alt_text}
                                            onChange={(event) =>
                                                setData(
                                                    'alt_text',
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="Describe the image for accessibility"
                                            maxLength={255}
                                            className={inputClassName}
                                        />

                                        <FieldError
                                            message={errors.alt_text}
                                        />
                                    </div>
                                </div>
                            </GlassSection>
                        </div>

                        <aside className="space-y-6">
                            <GlassSection
                                eyebrow="03 / PRESENTATION"
                                title="Keep it intentional."
                                description="Your changes will update this image in your public portfolio."
                            >
                                <div className="rounded-2xl border border-white/[0.07] bg-black/20 p-4">
                                    <div className="space-y-3">
                                        <p className="text-sm font-medium text-zinc-300">
                                            Gallery image
                                        </p>

                                        <p className="text-xs leading-5 text-zinc-600">
                                            The existing image remains unchanged
                                            unless you select a replacement.
                                        </p>

                                        <p className="text-xs leading-5 text-zinc-600">
                                            Replacement images are checked by
                                            the LIRA image moderation service
                                            before they are stored.
                                        </p>
                                    </div>
                                </div>
                            </GlassSection>

                            <div className="rounded-[28px] border border-white/[0.07] bg-white/[0.02] p-5 backdrop-blur-xl">
                                <div className="flex flex-col gap-3">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-[linear-gradient(90deg,#fff_0%,#c8f5ff_22%,#a393ff_50%,#f28bd7_76%,#fff_100%)] px-5 py-3.5 text-sm font-semibold text-zinc-950 shadow-[0_8px_30px_rgba(120,200,255,0.12)] transition duration-300 hover:shadow-[0_10px_40px_rgba(160,140,255,0.18)] disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <span>
                                            {processing
                                                ? 'Saving Changes...'
                                                : 'Save Changes'}
                                        </span>

                                        {!processing && (
                                            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                        )}
                                    </button>

                                    <Link
                                        href="/dashboard/gallery"
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
