import {
    ChangeEvent,
    FormEvent,
    useEffect,
    useRef,
    useState,
} from 'react';

import { Head, Link, useForm } from '@inertiajs/react';

import DashboardLayout from '../../Components/Dashboard/d_layout';
import {
    ArrowLeft,
    ArrowUpRight,
    CheckIcon,
    PlusIcon,
} from '../../Components/Icons';

/*
|--------------------------------------------------------------------------
| FORM DATA
|--------------------------------------------------------------------------
*/

interface ReleaseFormData {
    title: string;
    release_type: string;
    artwork: File | null;
    release_date: string;
    description: string;
    spotify_url: string;
    apple_music_url: string;
    youtube_url: string;
    soundcloud_url: string;
    bandcamp_url: string;
    lyrics: string;
    is_visible: boolean;
}

/*
|--------------------------------------------------------------------------
| GLASS SECTION
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
| FIELD LABEL
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| FIELD ERROR
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| INPUT STYLE
|--------------------------------------------------------------------------
*/

const inputClassName =
    'w-full rounded-2xl border border-white/[0.08] bg-black/30 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-white/20 focus:bg-white/[0.035] focus:ring-1 focus:ring-white/[0.06]';

/*
|--------------------------------------------------------------------------
| CREATE RELEASE
|--------------------------------------------------------------------------
*/

export default function Create() {
    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
    } = useForm<ReleaseFormData>({
        title: '',
        release_type: 'single',
        artwork: null,
        release_date: '',
        description: '',
        spotify_url: '',
        apple_music_url: '',
        youtube_url: '',
        soundcloud_url: '',
        bandcamp_url: '',
        lyrics: '',
        is_visible: true,
    });

    const [artworkPreview, setArtworkPreview] =
        useState<string | null>(null);

    /*
    |--------------------------------------------------------------------------
    | ARTWORK PREVIEW
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (!data.artwork) {
            setArtworkPreview(null);

            return;
        }

        const objectUrl =
            URL.createObjectURL(data.artwork);

        setArtworkPreview(objectUrl);

        return () => {
            URL.revokeObjectURL(objectUrl);
        };
    }, [data.artwork]);

    /*
    |--------------------------------------------------------------------------
    | ARTWORK CHANGE
    |--------------------------------------------------------------------------
    */

    function handleArtworkChange(
        event: ChangeEvent<HTMLInputElement>,
    ) {
        const file =
            event.target.files?.[0] ?? null;

        setData('artwork', file);
    }

    /*
    |--------------------------------------------------------------------------
    | VALIDATION FOCUS
    |--------------------------------------------------------------------------
    */

    function focusFirstError(
        validationErrors: Record<string, string>,
    ) {
        const errorKeys = Object.keys(validationErrors);

        if (errorKeys.length === 0) {
            return;
        }

        const firstError = errorKeys[0];

        const selectors: Record<string, string> = {
            title: '#title',
            release_type: '#release_type',
            release_date: '#release_date',
            description: '#description',
            artwork: '#artwork',
            spotify_url: '#spotify_url',
            apple_music_url: '#apple_music_url',
            youtube_url: '#youtube_url',
            soundcloud_url: '#soundcloud_url',
            bandcamp_url: '#bandcamp_url',
            lyrics: '#lyrics',
            is_visible: '#is_visible',
        };

        const selector = selectors[firstError];

        if (!selector) {
            return;
        }

        window.setTimeout(() => {
            const element = document.querySelector<
                HTMLInputElement |
                HTMLTextAreaElement |
                HTMLButtonElement
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

    /*
    |--------------------------------------------------------------------------
    | SUBMIT
    |--------------------------------------------------------------------------
    */

    function submit(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        post('/dashboard/releases', {
            forceFormData: true,

            preserveScroll: (page) => {
                const pageErrors =
                    page.props.errors as Record<
                        string,
                        string
                    >;

                if (Object.keys(pageErrors).length > 0) {
                    focusFirstError(pageErrors);

                    return false;
                }

                return true;
            },

            onSuccess: () => {
                reset();
            },
        });
    }

    return (
        <DashboardLayout>

            <Head title="Add Release" />

            <main className="min-h-screen">

                <div className="mx-auto max-w-[1400px] px-6 py-10 sm:px-8 lg:px-12 lg:py-12">

                    {/* ====================================================
                        PAGE HEADER
                    ===================================================== */}

                    <div className="relative mb-10">

                        <Link
                            href="/dashboard/releases"
                            className="group mb-7 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-zinc-600 transition hover:text-zinc-300"
                        >
                            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />

                            Back to Releases
                        </Link>

                        <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-600">
                            LIRA / STUDIO / MUSIC
                        </p>

                        <div className="mt-3 max-w-3xl">

                            <h1 className="text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">

                                Add a{' '}

                                <span className="bg-[linear-gradient(90deg,#fff_0%,#bdefff_24%,#9d8cff_58%,#f08bd7_82%,#fff_100%)] bg-clip-text text-transparent">
                                    new release.
                                </span>

                            </h1>

                            <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-500 sm:text-base">
                                Add music to your LIRA studio and
                                decide how you want the release to
                                appear on your public artist portfolio.
                            </p>

                        </div>

                    </div>

                    {/* ====================================================
                        FORM
                    ===================================================== */}

                    <form
                        onSubmit={submit}
                        className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]"
                    >

                        {/* ==================================================
                            MAIN CONTENT
                        =================================================== */}

                        <div className="space-y-6">

                            {/* =================================================
                                01 / RELEASE IDENTITY
                            ================================================== */}

                            <GlassSection
                                eyebrow="01 / RELEASE IDENTITY"
                                title="Tell the story of the release."
                                description="Start with the details that define this piece of music."
                            >

                                <div className="space-y-6">

                                    {/* Title */}

                                    <div>

                                        <FieldLabel htmlFor="title">
                                            Release Title
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
                                            placeholder="e.g. It's Alright"
                                            autoFocus
                                            className={inputClassName}
                                        />

                                        <FieldError
                                            message={errors.title}
                                        />

                                    </div>

                                    {/* Type + Date */}

                                    <div className="grid gap-6 sm:grid-cols-2">

                                        <div>

                                            <FieldLabel htmlFor="release_type">
                                                Release Type
                                            </FieldLabel>

                                            <ReleaseTypeDropdown
                                                value={data.release_type}
                                                onChange={(value) =>
                                                    setData('release_type', value)
                                                }
                                            />

                                            <FieldError
                                                message={
                                                    errors.release_type
                                                }
                                            />

                                        </div>

                                        <div>

                                            <FieldLabel
                                                htmlFor="release_date"
                                                optional
                                            >
                                                Release Date
                                            </FieldLabel>

                                            <input
                                                id="release_date"
                                                type="date"
                                                value={
                                                    data.release_date
                                                }
                                                onChange={(event) =>
                                                    setData(
                                                        'release_date',
                                                        event.target.value,
                                                    )
                                                }
                                                className={inputClassName}
                                            />

                                            <FieldError
                                                message={
                                                    errors.release_date
                                                }
                                            />

                                        </div>

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
                                            value={data.description}
                                            onChange={(event) =>
                                                setData(
                                                    'description',
                                                    event.target.value,
                                                )
                                            }
                                            rows={7}
                                            maxLength={5000}
                                            placeholder="Describe the release, the story behind it, the inspiration, collaborators, or anything you want listeners to know."
                                            className={`${inputClassName} resize-none leading-6`}
                                        />

                                        <div className="mt-2 flex items-center justify-between">

                                            <FieldError
                                                message={
                                                    errors.description
                                                }
                                            />

                                            <span className="ml-auto text-[9px] uppercase tracking-[0.16em] text-zinc-700">
                                                {data.description.length}
                                                /5000
                                            </span>

                                        </div>

                                    </div>

                                </div>

                            </GlassSection>

                            {/* =================================================
                                02 / ARTWORK
                            ================================================== */}

                            <GlassSection
                                eyebrow="02 / ARTWORK"
                                title="Give the release a face."
                                description="Upload the artwork that represents this release across your music experience."
                            >

                                <div className="space-y-5">

                                    {artworkPreview ? (

                                        <div>

                                            {/* Artwork Preview */}

                                            <div className="group relative mx-auto aspect-square w-full max-w-[560px] overflow-hidden rounded-2xl border border-white/[0.1] bg-black/20">

                                                <img
                                                    src={artworkPreview}
                                                    alt="Release artwork preview"
                                                    className="h-full w-full select-none object-cover"
                                                    draggable={false}
                                                />

                                                {/* Overlay */}

                                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                                                {/* Artwork metadata */}

                                                <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">

                                                    <div>

                                                        <p className="text-[9px] uppercase tracking-[0.2em] text-white/50">
                                                            Selected artwork
                                                        </p>

                                                        <p className="mt-1 max-w-[300px] truncate text-sm text-white">
                                                            {data.artwork?.name}
                                                        </p>

                                                    </div>

                                                    <label
                                                        htmlFor="artwork"
                                                        className="pointer-events-auto shrink-0 cursor-pointer rounded-full border border-white/10 bg-black/50 px-3 py-1.5 text-[9px] uppercase tracking-[0.14em] text-zinc-300 backdrop-blur-md transition hover:border-white/20 hover:text-white"
                                                    >
                                                        Change
                                                    </label>

                                                </div>

                                            </div>

                                            <div className="mt-4 flex items-center justify-between gap-4">

                                                <p className="text-[9px] uppercase tracking-[0.14em] text-zinc-700">
                                                    Square artwork recommended
                                                </p>

                                            </div>

                                        </div>

                                    ) : (

                                        /* Empty Artwork State */

                                        <label
                                            htmlFor="artwork"
                                            className="group relative block cursor-pointer overflow-hidden rounded-2xl border border-dashed border-white/[0.1] bg-black/20 transition hover:border-white/[0.18] hover:bg-white/[0.02]"
                                        >

                                            <div className="flex min-h-[360px] flex-col items-center justify-center px-6 py-12 text-center">

                                                <div className="relative mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.025]">

                                                    <PlusIcon className="h-5 w-5 text-zinc-500 transition duration-300 group-hover:text-white" />

                                                </div>

                                                <p className="text-sm font-medium text-zinc-300">
                                                    Choose release artwork
                                                </p>

                                                <p className="mt-2 max-w-sm text-xs leading-5 text-zinc-600">
                                                    Use a strong square visual
                                                    that represents the release
                                                    and catches attention.
                                                </p>

                                                <span className="mt-5 rounded-full border border-white/[0.08] px-4 py-2 text-[9px] uppercase tracking-[0.16em] text-zinc-500 transition group-hover:border-white/[0.16] group-hover:text-zinc-300">
                                                    Browse files
                                                </span>

                                            </div>

                                        </label>
                                    )}

                                    <input
                                        id="artwork"
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        onChange={
                                            handleArtworkChange
                                        }
                                        className="sr-only"
                                    />

                                    <FieldError
                                        message={errors.artwork}
                                    />

                                    <div className="flex flex-col gap-2 text-[10px] uppercase tracking-[0.14em] text-zinc-700 sm:flex-row sm:items-center sm:justify-between">

                                        <span>
                                            JPG / PNG / WebP
                                        </span>

                                        <span>
                                            Minimum 500 × 500
                                        </span>

                                        <span>
                                            Maximum file size: 5 MB
                                        </span>

                                    </div>

                                </div>

                            </GlassSection>

                            {/* =================================================
                                03 / DISTRIBUTION
                            ================================================== */}

                            <GlassSection
                                eyebrow="03 / DISTRIBUTION"
                                title="Where can people listen?"
                                description="Add the platforms where this release is available."
                            >

                                <div className="grid gap-6 sm:grid-cols-2">

                                    <MusicLinkField
                                        id="spotify_url"
                                        label="Spotify"
                                        value={data.spotify_url}
                                        onChange={(value) =>
                                            setData(
                                                'spotify_url',
                                                value,
                                            )
                                        }
                                        placeholder="https://open.spotify.com/..."
                                        error={
                                            errors.spotify_url
                                        }
                                    />

                                    <MusicLinkField
                                        id="apple_music_url"
                                        label="Apple Music"
                                        value={
                                            data.apple_music_url
                                        }
                                        onChange={(value) =>
                                            setData(
                                                'apple_music_url',
                                                value,
                                            )
                                        }
                                        placeholder="https://music.apple.com/..."
                                        error={
                                            errors.apple_music_url
                                        }
                                    />

                                    <MusicLinkField
                                        id="youtube_url"
                                        label="YouTube"
                                        value={data.youtube_url}
                                        onChange={(value) =>
                                            setData(
                                                'youtube_url',
                                                value,
                                            )
                                        }
                                        placeholder="https://youtube.com/..."
                                        error={
                                            errors.youtube_url
                                        }
                                    />

                                    <MusicLinkField
                                        id="soundcloud_url"
                                        label="SoundCloud"
                                        value={
                                            data.soundcloud_url
                                        }
                                        onChange={(value) =>
                                            setData(
                                                'soundcloud_url',
                                                value,
                                            )
                                        }
                                        placeholder="https://soundcloud.com/..."
                                        error={
                                            errors.soundcloud_url
                                        }
                                    />

                                    <MusicLinkField
                                        id="bandcamp_url"
                                        label="Bandcamp"
                                        value={data.bandcamp_url}
                                        onChange={(value) =>
                                            setData(
                                                'bandcamp_url',
                                                value,
                                            )
                                        }
                                        placeholder="https://artist.bandcamp.com/..."
                                        error={
                                            errors.bandcamp_url
                                        }
                                    />

                                </div>

                            </GlassSection>

                            {/* =================================================
                                04 / LYRICS
                            ================================================== */}

                            <GlassSection
                                eyebrow="04 / LYRICS"
                                title="Add the words."
                                description="Give listeners access to the story behind the music."
                            >

                                <div>

                                    <FieldLabel
                                        htmlFor="lyrics"
                                        optional
                                    >
                                        Lyrics
                                    </FieldLabel>

                                    <textarea
                                        id="lyrics"
                                        value={data.lyrics}
                                        onChange={(event) =>
                                            setData(
                                                'lyrics',
                                                event.target.value,
                                            )
                                        }
                                        rows={16}
                                        placeholder="Paste your lyrics here..."
                                        className={`${inputClassName} resize-y font-mono text-xs leading-6`}
                                    />

                                    <FieldError
                                        message={errors.lyrics}
                                    />

                                </div>

                            </GlassSection>

                        </div>

                        {/* ==================================================
                            SIDEBAR
                        =================================================== */}

                        <aside className="space-y-6">

                            {/* =================================================
                                PRESENTATION
                            ================================================== */}

                            <GlassSection
                                eyebrow="05 / PRESENTATION"
                                title="Ready for your portfolio."
                                description="Choose whether this release should appear publicly when it is created."
                            >

                                <div className="rounded-2xl border border-white/[0.07] bg-black/20 p-4">

                                    <button
                                        id="is_visible"
                                        type="button"
                                        onClick={() =>
                                            setData(
                                                'is_visible',
                                                !data.is_visible,
                                            )
                                        }
                                        className="flex w-full items-start gap-3 text-left"
                                    >

                                        <div
                                            className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition ${data.is_visible
                                                ? 'border-emerald-400/10 bg-emerald-400/[0.06]'
                                                : 'border-white/[0.08] bg-white/[0.025]'
                                                }`}
                                        >

                                            {data.is_visible ? (
                                                <CheckIcon className="h-3.5 w-3.5 text-emerald-300" />
                                            ) : (
                                                <span className="h-1.5 w-1.5 rounded-full bg-zinc-600" />
                                            )}

                                        </div>

                                        <div>

                                            <p className="text-sm font-medium text-zinc-300">
                                                {data.is_visible
                                                    ? 'Visible on creation'
                                                    : 'Hidden on creation'}
                                            </p>

                                            <p className="mt-1 text-xs leading-5 text-zinc-600">
                                                {data.is_visible
                                                    ? 'This release can appear on your public artist portfolio.'
                                                    : 'This release will remain hidden from your public portfolio.'}
                                            </p>

                                        </div>

                                    </button>

                                </div>

                                <FieldError
                                    message={errors.is_visible}
                                />

                            </GlassSection>

                            {/* =================================================
                                RELEASE TYPES
                            ================================================== */}

                            <GlassSection
                                eyebrow="LIRA / RELEASE TYPES"
                                title="Build your catalog."
                                description="LIRA supports different forms of musical releases."
                            >

                                <div className="space-y-3">

                                    <ReleaseType
                                        active={
                                            data.release_type ===
                                            'single'
                                        }
                                        label="Single"
                                        description="One primary track."
                                    />

                                    <ReleaseType
                                        active={
                                            data.release_type ===
                                            'ep'
                                        }
                                        label="EP"
                                        description="A short collection of tracks."
                                    />

                                    <ReleaseType
                                        active={
                                            data.release_type ===
                                            'album'
                                        }
                                        label="Album"
                                        description="A full-length body of work."
                                    />

                                    <ReleaseType
                                        active={
                                            data.release_type ===
                                            'mixtape'
                                        }
                                        label="Mixtape"
                                        description="A curated collection of music."
                                    />

                                    <ReleaseType
                                        active={
                                            data.release_type ===
                                            'compilation'
                                        }
                                        label="Compilation"
                                        description="Music collected from multiple works."
                                    />

                                </div>

                            </GlassSection>

                            {/* =================================================
                                GUIDANCE
                            ================================================== */}

                            <GlassSection
                                eyebrow="LIRA / NOTE"
                                title="Make it memorable."
                                description="Your artwork, title, and release information are often the first things someone sees."
                            >

                                <div className="space-y-4 text-xs leading-6 text-zinc-600">

                                    <p>
                                        Use a clear release title
                                        and artwork that immediately
                                        communicates the identity of
                                        the music.
                                    </p>

                                    <p>
                                        Add your streaming links so
                                        visitors can easily continue
                                        listening wherever your music
                                        is available.
                                    </p>

                                    <p>
                                        Keep unfinished releases hidden
                                        until they are ready for public
                                        presentation.
                                    </p>

                                </div>

                            </GlassSection>

                            {/* =================================================
                                ACTIONS
                            ================================================== */}

                            <div className="rounded-[28px] border border-white/[0.07] bg-white/[0.02] p-5 backdrop-blur-xl">

                                <div className="flex flex-col gap-3">

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-[linear-gradient(90deg,#fff_0%,#c8f5ff_22%,#a393ff_50%,#f28bd7_76%,#fff_100%)] px-5 py-3.5 text-sm font-semibold text-zinc-950 shadow-[0_8px_30px_rgba(120,200,255,0.12)] transition duration-300 hover:shadow-[0_10px_40px_rgba(160,140,255,0.18)] disabled:cursor-not-allowed disabled:opacity-50"
                                    >

                                        <span>
                                            {processing
                                                ? 'Creating Release...'
                                                : 'Create Release'}
                                        </span>

                                        {!processing && (
                                            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                        )}

                                    </button>

                                    <Link
                                        href="/dashboard/releases"
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

/*
|--------------------------------------------------------------------------
| MUSIC LINK FIELD
|--------------------------------------------------------------------------
*/

function MusicLinkField({
    id,
    label,
    value,
    onChange,
    placeholder,
    error,
}: {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    error?: string;
}) {
    return (
        <div>

            <FieldLabel
                htmlFor={id}
                optional
            >
                {label}
            </FieldLabel>

            <div className="relative">

                <input
                    id={id}
                    type="url"
                    value={value}
                    onChange={(event) =>
                        onChange(
                            event.target.value,
                        )
                    }
                    placeholder={placeholder}
                    className={`${inputClassName} pr-11`}
                />

                <ArrowUpRight className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-700" />

            </div>

            <FieldError message={error} />

        </div>
    );
}

/*
|--------------------------------------------------------------------------
| RELEASE TYPE DROPDOWN
|--------------------------------------------------------------------------
*/

const releaseTypeOptions = [
    {
        value: 'single',
        label: 'Single',
        description: 'One primary track.',
    },
    {
        value: 'ep',
        label: 'EP',
        description: 'A short collection of tracks.',
    },
    {
        value: 'album',
        label: 'Album',
        description: 'A full-length body of work.',
    },
    {
        value: 'mixtape',
        label: 'Mixtape',
        description: 'A curated collection of music.',
    },
    {
        value: 'compilation',
        label: 'Compilation',
        description: 'Music collected from multiple works.',
    },
];

function ReleaseTypeDropdown({
    value,
    onChange,
}: {
    value: string;
    onChange: (value: string) => void;
}) {
    const [open, setOpen] = useState(false);

    const dropdownRef =
        useRef<HTMLDivElement | null>(null);

    const selected =
        releaseTypeOptions.find(
            (option) => option.value === value,
        ) ?? releaseTypeOptions[0];

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(
                    event.target as Node,
                )
            ) {
                setOpen(false);
            }
        }

        document.addEventListener(
            'mousedown',
            handleClickOutside,
        );

        return () => {
            document.removeEventListener(
                'mousedown',
                handleClickOutside,
            );
        };
    }, []);

    function handleKeyDown(
        event: React.KeyboardEvent<HTMLButtonElement>,
    ) {
        if (
            event.key === 'Escape' ||
            event.key === 'Tab'
        ) {
            setOpen(false);

            return;
        }

        if (
            event.key === 'Enter' ||
            event.key === ' '
        ) {
            event.preventDefault();

            setOpen((current) => !current);

            return;
        }

        if (
            event.key === 'ArrowDown' &&
            !open
        ) {
            event.preventDefault();

            setOpen(true);
        }
    }

    return (
        <div
            ref={dropdownRef}
            className="relative z-20"
        >
            <button
                id="release_type"
                type="button"
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={() =>
                    setOpen((current) => !current)
                }
                onKeyDown={handleKeyDown}
                className={`flex h-[50px] w-full items-center justify-between rounded-2xl border px-4 text-left transition ${open
                        ? 'border-white/20 bg-white/[0.06] ring-1 ring-white/[0.06]'
                        : 'border-white/[0.08] bg-black/30 hover:border-white/[0.15]'
                    }`}
            >
                <div className="flex min-w-0 items-center gap-3">
                    <span
                        className={`h-1.5 w-1.5 shrink-0 rounded-full transition ${open
                                ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]'
                                : 'bg-zinc-600'
                            }`}
                    />

                    <span className="truncate text-sm text-white">
                        {selected.label}
                    </span>
                </div>

                <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    className={`h-4 w-4 shrink-0 transition-transform duration-200 ${open
                            ? 'rotate-180 text-zinc-200'
                            : 'text-zinc-600'
                        }`}
                >
                    <path
                        d="M5 7.5L10 12.5L15 7.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>

            {open && (
                <div
                    role="listbox"
                    className="mt-2 w-full overflow-hidden rounded-2xl border border-white/[0.12] bg-[#08090b] p-1.5 shadow-[0_20px_60px_rgba(0,0,0,0.65)]"
                >
                    <div className="pointer-events-none absolute left-0 right-0 top-[58px] h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)]" />

                    {releaseTypeOptions.map(
                        (option) => {
                            const isSelected =
                                option.value === value;

                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    role="option"
                                    aria-selected={
                                        isSelected
                                    }
                                    onClick={() => {
                                        onChange(
                                            option.value,
                                        );

                                        setOpen(false);
                                    }}
                                    className={`group flex w-full items-start gap-3 rounded-xl px-3 py-3.5 text-left transition ${isSelected
                                            ? 'bg-white/[0.08]'
                                            : 'hover:bg-white/[0.045]'
                                        }`}
                                >
                                    <span
                                        className={`mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full transition ${isSelected
                                                ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.55)]'
                                                : 'bg-zinc-700 group-hover:bg-zinc-400'
                                            }`}
                                    />

                                    <span className="min-w-0 flex-1">
                                        <span
                                            className={`block text-sm font-medium transition ${isSelected
                                                    ? 'text-white'
                                                    : 'text-zinc-300 group-hover:text-white'
                                                }`}
                                        >
                                            {
                                                option.label
                                            }
                                        </span>

                                        <span
                                            className={`mt-1 block text-[10px] leading-4 transition ${isSelected
                                                    ? 'text-zinc-500'
                                                    : 'text-zinc-600 group-hover:text-zinc-500'
                                                }`}
                                        >
                                            {
                                                option.description
                                            }
                                        </span>
                                    </span>

                                    {isSelected && (
                                        <span className="pt-0.5 text-zinc-300">
                                            <svg
                                                viewBox="0 0 20 20"
                                                fill="none"
                                                className="h-3.5 w-3.5"
                                            >
                                                <path
                                                    d="M4.5 10.5L8 14L15.5 6.5"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </span>
                                    )}
                                </button>
                            );
                        },
                    )}
                </div>
            )}
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| RELEASE TYPE
|--------------------------------------------------------------------------
*/

function ReleaseType({
    active,
    label,
    description,
}: {
    active: boolean;
    label: string;
    description: string;
}) {
    return (
        <div
            className={`rounded-2xl border p-4 transition ${active
                ? 'border-white/[0.12] bg-white/[0.035]'
                : 'border-white/[0.05] bg-black/10'
                }`}
        >
            <div className="flex items-center gap-3">

                <span
                    className={`h-1.5 w-1.5 rounded-full transition ${active
                        ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.45)]'
                        : 'bg-zinc-800'
                        }`}
                />

                <p
                    className={`text-sm font-medium ${active
                        ? 'text-white'
                        : 'text-zinc-500'
                        }`}
                >
                    {label}
                </p>

            </div>

            <p className="mt-1 pl-[18px] text-[10px] leading-5 text-zinc-700">
                {description}
            </p>

        </div>
    );
}
