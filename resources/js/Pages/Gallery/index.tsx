import { Link, router } from '@inertiajs/react';

import DashboardLayout from '../../Components/Dashboard/d_layout';
import {
    ArrowRight,
    ArrowUpRight,
    PlusIcon,
} from '../../Components/Icons';

interface GalleryImage {
    id: number;
    image: string | null;
    title: string | null;
    caption: string | null;
    alt_text: string | null;
    sort_order: number;
}

interface Props {
    galleryImages: GalleryImage[];
    flash?: {
        success?: string;
    };
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

// Gallery image card.
function GalleryCard({
    image,
    index,
    onDelete,
    deleting,
}: {
    image: GalleryImage;
    index: number;
    onDelete: () => void;
    deleting: boolean;
}) {
    const imageUrl = getImageUrl(image.image);

    return (
        <article className="group relative overflow-hidden rounded-[1.35rem] border border-white/[0.08] bg-[linear-gradient(145deg,rgba(255,255,255,0.045),rgba(255,255,255,0.012)_42%,rgba(255,255,255,0.022))] shadow-[0_25px_70px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-2xl transition duration-500 hover:-translate-y-0.5 hover:border-white/[0.14] hover:shadow-[0_35px_90px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.06)]">
            <div className="pointer-events-none absolute inset-0 z-30 rounded-[1.35rem] border border-white/[0.02]" />

            <div className="pointer-events-none absolute inset-x-0 top-0 z-40 h-px bg-[linear-gradient(90deg,transparent_5%,rgba(255,255,255,0.32)_35%,rgba(255,255,255,0.12)_55%,transparent_95%)] opacity-70" />

            <div className="pointer-events-none absolute left-5 top-5 z-40">
                <span className="text-[8px] uppercase tracking-[0.2em] text-white/50">
                    {String(index + 1).padStart(2, '0')}
                </span>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden bg-[#0b0d0f]">
                {imageUrl ? (
                    <>
                        <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(135deg,rgba(255,255,255,0.035),transparent_40%,rgba(255,255,255,0.025))]" />

                        <img
                            src={imageUrl}
                            alt={
                                image.alt_text ||
                                image.title ||
                                'Gallery image'
                            }
                            className="h-full w-full select-none object-cover transition duration-700 group-hover:scale-[1.035]"
                            draggable={false}
                            loading="lazy"
                        />

                        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-32 bg-[linear-gradient(to_top,rgba(5,6,7,0.82),transparent)]" />

                        <div className="pointer-events-none absolute bottom-5 left-5 z-30">
                            <span className="text-[8px] uppercase tracking-[0.28em] text-white/45">
                                LIRA / GALLERY
                            </span>
                        </div>
                    </>
                ) : (
                    <div className="flex h-full items-center justify-center text-center">
                        <div>
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.025]">
                                <PlusIcon className="h-5 w-5 text-zinc-700" />
                            </div>

                            <p className="mt-4 text-[8px] uppercase tracking-[0.28em] text-zinc-700">
                                No image
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <div className="relative z-10 p-6">
                <div className="flex items-start justify-between gap-5">
                    <div className="min-w-0">
                        <div className="flex items-center gap-3">
                            <p className="text-[8px] uppercase tracking-[0.28em] text-zinc-600">
                                Gallery
                            </p>
                        </div>

                        <h2 className="mt-2 truncate text-[17px] font-medium tracking-[-0.025em] text-white">
                            {image.title || 'Untitled Image'}
                        </h2>
                    </div>

                    <span className="shrink-0 text-[8px] uppercase tracking-[0.18em] text-zinc-700">
                        #{String(index + 1).padStart(2, '0')}
                    </span>
                </div>

                {image.caption ? (
                    <p className="mt-3 line-clamp-3 text-xs leading-5 text-zinc-600">
                        {image.caption}
                    </p>
                ) : (
                    <p className="mt-3 text-xs leading-5 text-zinc-700">
                        No caption has been added yet.
                    </p>
                )}

                <div className="mt-6 flex items-center justify-between border-t border-white/[0.06] pt-5">
                    <div className="flex items-center gap-5">
                        <Link
                            href={`/dashboard/gallery/${image.id}/edit`}
                            className="group/edit inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-zinc-500 transition hover:text-white"
                        >
                            Edit

                            <ArrowUpRight className="h-3 w-3 transition duration-300 group-hover/edit:translate-x-0.5 group-hover/edit:-translate-y-0.5" />
                        </Link>

                        <button
                            type="button"
                            onClick={onDelete}
                            disabled={deleting}
                            className="text-[10px] uppercase tracking-[0.18em] text-zinc-700 transition hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            {deleting ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>

                    {image.alt_text && (
                        <span className="text-[8px] uppercase tracking-[0.16em] text-zinc-700">
                            Alt text
                        </span>
                    )}
                </div>
            </div>
        </article>
    );
}

export default function Index({
    galleryImages: initialGalleryImages,
    flash,
}: Props) {
    const galleryImages = [...initialGalleryImages].sort(
        (a, b) => a.sort_order - b.sort_order,
    );

    function deleteGalleryImage(image: GalleryImage) {
        if (
            !window.confirm(
                `Delete "${image.title || 'Untitled Image'}"?`,
            )
        ) {
            return;
        }

        router.delete(`/dashboard/gallery/${image.id}`, {
            preserveScroll: true,
        });
    }

    return (
        <DashboardLayout>
            <div className="mx-auto max-w-[1400px] px-6 py-10 sm:px-8 lg:px-12 lg:py-12">
                <section className="relative mb-14 overflow-hidden border-b border-white/[0.07] pb-12">
                    <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <div className="mb-5 flex items-center gap-3">
                                <span className="h-px w-8 bg-[linear-gradient(90deg,#ffffff,#7d8991,transparent)]" />

                                <span className="text-[9px] uppercase tracking-[0.35em] text-zinc-600">
                                    LIRA / STUDIO / GALLERY
                                </span>
                            </div>

                            <h1 className="text-4xl font-light tracking-[-0.055em] text-white sm:text-5xl">
                                Your visual,
                                <br />
                                <span className="bg-[linear-gradient(90deg,#fff_0%,#bdefff_24%,#9d8cff_58%,#f08bd7_82%,#fff_100%)] bg-clip-text text-transparent">
                                    your story.
                                </span>
                            </h1>

                            <p className="mt-6 max-w-xl text-sm leading-6 text-zinc-600">
                                A curated visual archive of the artwork,
                                photography, and creative work that defines
                                your identity on LIRA.
                            </p>
                        </div>

                        <Link
                            href="/dashboard/gallery/create"
                            className="group relative inline-flex h-11 shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full border border-white/40 bg-[linear-gradient(105deg,#32ddff_0%,#6677ff_20%,#a955ff_38%,#f05abd_51%,#ff8ed3_63%,#7b63ff_78%,#34dcff_94%)] px-5 text-xs font-medium text-[#08090b] shadow-[0_8px_35px_rgba(90,150,255,0.14)] transition duration-300 hover:scale-[1.015] hover:shadow-[0_12px_50px_rgba(190,80,255,0.22)]"
                        >
                            <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_20%,rgba(255,255,255,0.65)_48%,transparent_72%)] opacity-0 transition duration-700 group-hover:translate-x-[25%] group-hover:opacity-100" />

                            <PlusIcon className="relative h-3.5 w-3.5" />

                            <span className="relative">
                                Add Image
                            </span>
                        </Link>
                    </div>
                </section>

                <section className="mb-16">
                    <div className="mb-6 flex items-end justify-between">
                        <div>
                            <p className="text-[9px] uppercase tracking-[0.32em] text-zinc-700">
                                Studio Overview
                            </p>

                            <h2 className="mt-2 text-lg font-light tracking-[-0.025em] text-white">
                                Your visual inventory.
                            </h2>
                        </div>

                        <span className="hidden text-[8px] uppercase tracking-[0.25em] text-zinc-700 sm:block">
                            CURRENT STATE
                        </span>
                    </div>

                    <div className="relative overflow-hidden rounded-[1.25rem] border border-white/[0.08] bg-[linear-gradient(145deg,rgba(255,255,255,0.035),rgba(255,255,255,0.008))] px-6 py-7 shadow-[0_25px_70px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.035)] sm:px-8">
                        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)]" />

                        <div className="grid gap-8 sm:grid-cols-3">
                            <div className="relative overflow-hidden border-l border-white/[0.08] pl-5 first:border-l-0 first:pl-0">
                                <p className="text-2xl font-light tracking-[-0.04em] text-white">
                                    {String(galleryImages.length).padStart(2, '0')}
                                </p>

                                <p className="mt-2 text-[8px] uppercase tracking-[0.28em] text-zinc-500">
                                    Total Images
                                </p>

                                <p className="mt-2 max-w-[180px] text-[10px] leading-4 text-zinc-700">
                                    Images currently stored in your LIRA
                                    studio.
                                </p>
                            </div>

                            <div className="relative overflow-hidden border-l border-white/[0.08] pl-5 first:border-l-0 first:pl-0">
                                <p className="text-2xl font-light tracking-[-0.04em] text-white">
                                    {String(
                                        galleryImages.filter(
                                            (image) =>
                                                Boolean(image.title?.trim()),
                                        ).length,
                                    ).padStart(2, '0')}
                                </p>

                                <p className="mt-2 text-[8px] uppercase tracking-[0.28em] text-zinc-500">
                                    Titled
                                </p>

                                <p className="mt-2 max-w-[180px] text-[10px] leading-4 text-zinc-700">
                                    Images with a title that identifies
                                    the work.
                                </p>
                            </div>

                            <div className="relative overflow-hidden border-l border-white/[0.08] pl-5 first:border-l-0 first:pl-0">
                                <p className="text-2xl font-light tracking-[-0.04em] text-white">
                                    {String(
                                        galleryImages.filter(
                                            (image) =>
                                                Boolean(image.caption?.trim()),
                                        ).length,
                                    ).padStart(2, '0')}
                                </p>

                                <p className="mt-2 text-[8px] uppercase tracking-[0.28em] text-zinc-500">
                                    Captioned
                                </p>

                                <p className="mt-2 max-w-[180px] text-[10px] leading-4 text-zinc-700">
                                    Images with additional context for
                                    visitors.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {flash?.success && (
                    <div className="mb-6 rounded-2xl border border-[#7de7ff]/15 bg-[#7de7ff]/[0.04] px-4 py-3">
                        <p className="text-xs leading-5 text-[#bdefff]">
                            {flash.success}
                        </p>
                    </div>
                )}

                <section>
                    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <div className="flex items-center gap-3">
                                <span className="h-px w-7 bg-[linear-gradient(90deg,#ffffff,transparent)]" />

                                <p className="text-[9px] uppercase tracking-[0.32em] text-zinc-600">
                                    Gallery Index
                                </p>
                            </div>

                            <h2 className="mt-3 text-2xl font-light tracking-[-0.035em] text-white">
                                Your visual catalog.
                            </h2>

                            <p className="mt-2 max-w-xl text-xs leading-5 text-zinc-700">
                                Browse your saved images. Edit metadata
                                from the individual image editor when it is
                                available.
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="hidden h-px w-10 bg-white/[0.08] sm:block" />

                            <div className="text-right">
                                <p className="text-sm font-light text-white">
                                    {String(galleryImages.length).padStart(
                                        2,
                                        '0',
                                    )}
                                </p>

                                <p className="mt-1 text-[8px] uppercase tracking-[0.25em] text-zinc-700">
                                    Images
                                </p>
                            </div>
                        </div>
                    </div>

                    {galleryImages.length === 0 ? (
                        <div className="relative overflow-hidden rounded-[1.5rem] border border-white/[0.09] bg-[linear-gradient(145deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))] shadow-[0_30px_80px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.04)]">
                            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent)]" />

                            <div className="pointer-events-none absolute right-[15%] top-10 h-3 w-3 opacity-30">
                                <span className="absolute inset-0 rotate-45 bg-white/60 blur-[1px]" />
                                <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/60" />
                                <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white/60" />
                            </div>

                            <div className="px-6 py-20 text-center sm:px-10">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.09] bg-white/[0.025] text-zinc-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                                    <PlusIcon className="h-5 w-5" />
                                </div>

                                <p className="mt-6 text-[9px] uppercase tracking-[0.3em] text-zinc-700">
                                    Gallery Index / Empty
                                </p>

                                <h2 className="mt-3 text-xl font-light tracking-[-0.025em] text-white">
                                    Your gallery is waiting
                                    <br />
                                    for its first image.
                                </h2>

                                <p className="mx-auto mt-3 max-w-md text-xs leading-5 text-zinc-600">
                                    Add artwork, photography, paintings,
                                    illustrations, or other creative work
                                    to begin building your visual identity
                                    on LIRA.
                                </p>

                                <Link
                                    href="/dashboard/gallery/create"
                                    className="group mt-7 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-zinc-500 transition hover:text-white"
                                >
                                    Add your first image

                                    <ArrowRight className="h-3 w-3 transition duration-300 group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                            {galleryImages.map((image, index) => (
                                <GalleryCard
                                    key={image.id}
                                    image={image}
                                    index={index}
                                    onDelete={() =>
                                        deleteGalleryImage(image)
                                    }
                                    deleting={false}
                                />
                            ))}
                        </div>
                    )}
                </section>

                <section className="mt-16 border-t border-white/[0.07] pt-10">
                    <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
                        <div>
                            <p className="text-[9px] uppercase tracking-[0.32em] text-zinc-700">
                                Portfolio Presentation
                            </p>

                            <h2 className="mt-3 text-xl font-light tracking-[-0.03em] text-white">
                                Arrange the presentation later.
                            </h2>

                            <p className="mt-3 max-w-xl text-xs leading-5 text-zinc-600">
                                Gallery order and presentation settings will
                                be managed through Portfolio Settings.
                            </p>
                        </div>

                        <Link
                            href="/dashboard/settings"
                            className="group inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-zinc-500 transition hover:text-white"
                        >
                            Portfolio Settings

                            <ArrowRight className="h-3 w-3 transition duration-300 group-hover:translate-x-1" />
                        </Link>
                    </div>
                </section>

                <footer className="mt-10 flex flex-col gap-3 border-t border-white/[0.05] pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-[9px] uppercase tracking-[0.22em] text-zinc-800">
                        LIRA / STUDIO / VISUAL ARCHIVE
                    </p>

                    <p className="text-[10px] text-zinc-800">
                        {galleryImages.length > 0
                            ? `${galleryImages.length} image${
                                  galleryImages.length === 1 ? '' : 's'
                              } in your archive`
                            : 'Start building your visual archive'}
                    </p>
                </footer>
            </div>
        </DashboardLayout>
    );
}
