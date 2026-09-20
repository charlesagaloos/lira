import { FormEvent, ReactNode } from 'react';
import { Link, useForm } from '@inertiajs/react';

import DashboardLayout from '../../Components/Dashboard/d_layout';
import {
    ArrowLeft,
    ArrowUpRight,
    GlobeIcon,
    PlusIcon,
    UserIcon,
} from '../../Components/Icons';

interface SocialLinkForm {
    platform: string;
    url: string;
}

interface FormData {
    username: string;
    display_name: string;
    bio: string;
    artist_type: string;
    location: string;
    website: string;
    social_links: SocialLinkForm[];
}

/*
|--------------------------------------------------------------------------
| CHROME SPARKLE
|--------------------------------------------------------------------------
*/

function ChromeSparkle({
    className = '',
    size = 'sm',
}: {
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}) {
    const sizes = {
        sm: 'h-3 w-3',
        md: 'h-4 w-4',
        lg: 'h-5 w-5',
    };

    return (
        <span
            className={`pointer-events-none absolute ${sizes[size]} ${className}`}
            aria-hidden="true"
        >
            <svg
                viewBox="0 0 20 20"
                fill="none"
                className="h-full w-full"
            >
                <path
                    d="M10 0.75C10.6 6.8 13.2 9.4 19.25 10C13.2 10.6 10.6 13.2 10 19.25C9.4 13.2 6.8 10.6 0.75 10C6.8 9.4 9.4 6.8 10 0.75Z"
                    fill="url(#chrome-sparkle-create)"
                />

                <defs>
                    <linearGradient
                        id="chrome-sparkle-create"
                        x1="2"
                        y1="2"
                        x2="18"
                        y2="18"
                    >
                        <stop offset="0" stopColor="#ffffff" />
                        <stop offset="0.35" stopColor="#dce5e9" />
                        <stop offset="0.55" stopColor="#7d8a91" />
                        <stop offset="0.72" stopColor="#ffffff" />
                        <stop offset="1" stopColor="#68747c" />
                    </linearGradient>
                </defs>
            </svg>
        </span>
    );
}

/*
|--------------------------------------------------------------------------
| GLASS SECTION
|--------------------------------------------------------------------------
*/

function GlassSection({
    number,
    icon,
    title,
    description,
    children,
}: {
    number: string;
    icon: ReactNode;
    title: string;
    description: string;
    children: ReactNode;
}) {
    return (
        <section className="group relative overflow-hidden rounded-[1.5rem] border border-white/[0.10] bg-[linear-gradient(145deg,rgba(255,255,255,0.045),rgba(255,255,255,0.012)_35%,rgba(255,255,255,0.018)_70%,rgba(255,255,255,0.035))] shadow-[0_30px_80px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.055)] backdrop-blur-2xl transition duration-500 hover:border-white/[0.14]">

            <div className="pointer-events-none absolute inset-0 rounded-[1.5rem] border border-white/[0.025]" />

            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent_5%,rgba(255,255,255,0.45)_35%,rgba(255,255,255,0.18)_55%,transparent_95%)] opacity-70" />

            <div className="pointer-events-none absolute -right-[20%] top-0 h-px w-[70%] rotate-[24deg] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.16),transparent)] blur-[1px]" />

            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(125deg,transparent_0%,transparent_42%,rgba(255,255,255,0.018)_49%,rgba(255,255,255,0.035)_51%,transparent_58%,transparent_100%)] opacity-70" />

            <ChromeSparkle
                size="sm"
                className="right-8 top-7 opacity-30 transition duration-500 group-hover:opacity-60"
            />

            <ChromeSparkle
                size="sm"
                className="bottom-8 right-[18%] opacity-10 transition duration-700 group-hover:opacity-30"
            />

            <div className="relative p-6 sm:p-8 lg:p-9">
                <div className="flex items-start gap-5">

                    <div className="hidden shrink-0 sm:block">
                        <span className="text-[9px] uppercase tracking-[0.25em] text-zinc-700">
                            {number}
                        </span>
                    </div>

                    <div className="min-w-0 flex-1">

                        <div className="flex items-start gap-4">

                            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/[0.09] bg-[linear-gradient(145deg,rgba(255,255,255,0.065),rgba(255,255,255,0.015))] text-zinc-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">

                                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_45%,rgba(255,255,255,0.025))]" />

                                <span className="relative">
                                    {icon}
                                </span>
                            </div>

                            <div>
                                <h2 className="text-lg font-medium tracking-[-0.02em] text-white">
                                    {title}
                                </h2>

                                <p className="mt-1.5 max-w-xl text-xs leading-5 text-zinc-600">
                                    {description}
                                </p>
                            </div>
                        </div>

                        <div className="mt-8">
                            {children}
                        </div>
                    </div>
                </div>
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
}: {
    htmlFor: string;
    children: ReactNode;
}) {
    return (
        <label
            htmlFor={htmlFor}
            className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-zinc-500"
        >
            {children}
        </label>
    );
}

/*
|--------------------------------------------------------------------------
| INPUT STYLE
|--------------------------------------------------------------------------
*/

const inputClass =
    'h-12 w-full rounded-xl border border-white/[0.085] bg-[linear-gradient(145deg,rgba(255,255,255,0.035),rgba(255,255,255,0.012))] px-4 text-sm text-white outline-none shadow-[inset_0_1px_0_rgba(255,255,255,0.025)] transition duration-300 placeholder:text-zinc-700 focus:border-white/[0.18] focus:bg-white/[0.035] focus:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_0_30px_rgba(255,255,255,0.025)]';

/*
|--------------------------------------------------------------------------
| CREATE PROFILE
|--------------------------------------------------------------------------
*/

export default function Create() {
    const form = useForm<FormData>({
        username: '',
        display_name: '',
        bio: '',
        artist_type: '',
        location: '',
        website: '',
        social_links: [],
    });

    const socialPlatforms = [
        { value: 'spotify', label: 'Spotify' },
        { value: 'apple_music', label: 'Apple Music' },
        { value: 'instagram', label: 'Instagram' },
        { value: 'youtube', label: 'YouTube' },
        { value: 'tiktok', label: 'TikTok' },
        { value: 'x', label: 'X' },
        { value: 'facebook', label: 'Facebook' },
        { value: 'soundcloud', label: 'SoundCloud' },
    ];

    function focusFirstError(errors: Record<string, string>) {
        const errorKeys = Object.keys(errors);

        if (errorKeys.length === 0) {
            return;
        }

        const firstError = errorKeys[0];

        let selector = '';

        if (firstError === 'display_name') {
            selector = '#display_name';
        } else if (firstError === 'username') {
            selector = '#username';
        } else if (firstError === 'artist_type') {
            selector = '#artist_type';
        } else if (firstError === 'location') {
            selector = '#location';
        } else if (firstError === 'bio') {
            selector = '#bio';
        } else if (firstError === 'website') {
            selector = '#website';
        } else {
            const socialLinkMatch = firstError.match(
                /^social_links\.(\d+)\.(platform|url)$/,
            );

            if (socialLinkMatch) {
                const index = socialLinkMatch[1];
                const field = socialLinkMatch[2];

                selector = `#social-${field}-${index}`;
            }
        }

        if (!selector) {
            return;
        }

        window.setTimeout(() => {
            const element = document.querySelector<
                HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
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

    function submit(event: FormEvent) {
        event.preventDefault();

        form.post('/dashboard/profile', {
            preserveScroll: (page) => {
                const errors = page.props.errors as Record<string, string>;

                if (Object.keys(errors).length > 0) {
                    focusFirstError(errors);

                    return false;
                }

                return true;
            },
        });
    }

    function addSocialLink() {
        form.setData('social_links', [
            ...form.data.social_links,
            {
                platform: '',
                url: '',
            },
        ]);
    }

    function removeSocialLink(index: number) {
        form.setData(
            'social_links',
            form.data.social_links.filter((_, itemIndex) => itemIndex !== index),
        );
    }

    function updateSocialLink(
        index: number,
        field: keyof SocialLinkForm,
        value: string,
    ) {
        const socialLinks = [...form.data.social_links];

        socialLinks[index] = {
            ...socialLinks[index],
            [field]: value,
        };

        form.setData('social_links', socialLinks);
    }

    return (
        <DashboardLayout>
            <div className="mx-auto max-w-[1400px] px-6 py-10 sm:px-8 lg:px-12 lg:py-12">

                {/* =========================================================
                    PAGE HEADER
                ========================================================== */}

                <div className="mb-12">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">

                        <div>

                            <div className="mb-5 flex items-center gap-3">
                                <span className="h-px w-8 bg-[linear-gradient(90deg,#ffffff,#7d8991,transparent)]" />

                                <span className="text-[9px] uppercase tracking-[0.35em] text-zinc-600">
                                    LIRA / STUDIO / PROFILE SETUP
                                </span>
                            </div>

                            <h1 className="text-4xl font-light tracking-[-0.055em] text-white sm:text-5xl">
                                Create your
                                <br />

                                <span className="bg-[linear-gradient(100deg,#ffffff_0%,#aeb8bd_30%,#ffffff_48%,#77838a_68%,#ffffff_100%)] bg-clip-text text-transparent">
                                    artist identity.
                                </span>
                            </h1>

                            <p className="mt-5 max-w-xl text-sm leading-6 text-zinc-600">
                                Build the foundation of your LIRA space.
                                Tell people who you are, what you create,
                                and where they can find your work.
                            </p>
                        </div>
                    </div>
                </div>

                {/* =========================================================
                    FORM
                ========================================================== */}

                <form
                    onSubmit={submit}
                    className="space-y-5"
                >

                    {/* =====================================================
                        PROFILE
                    ====================================================== */}

                    <GlassSection
                        number="01"
                        icon={<UserIcon />}
                        title="Profile"
                        description="Introduce yourself and define how you appear on LIRA."
                    >
                        <div className="space-y-6">

                            {/* Artist Name */}
                            <div>
                                <FieldLabel htmlFor="display_name">
                                    Artist Name
                                </FieldLabel>

                                <input
                                    id="display_name"
                                    type="text"
                                    value={form.data.display_name}
                                    onChange={(event) =>
                                        form.setData(
                                            'display_name',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Your artist name"
                                    className={inputClass}
                                />

                                {form.errors.display_name && (
                                    <p className="mt-2 text-xs text-red-400">
                                        {form.errors.display_name}
                                    </p>
                                )}
                            </div>

                            {/* Username */}
                            <div>
                                <FieldLabel htmlFor="username">
                                    Username
                                </FieldLabel>

                                <div className="flex h-12 overflow-hidden rounded-xl border border-white/[0.085] bg-[linear-gradient(145deg,rgba(255,255,255,0.035),rgba(255,255,255,0.012))] shadow-[inset_0_1px_0_rgba(255,255,255,0.025)] transition duration-300 focus-within:border-white/[0.18] focus-within:bg-white/[0.035]">

                                    <span className="flex items-center border-r border-white/[0.07] px-4 text-sm text-zinc-700">
                                        @
                                    </span>

                                    <input
                                        id="username"
                                        type="text"
                                        value={form.data.username}
                                        onChange={(event) =>
                                            form.setData(
                                                'username',
                                                event.target.value,
                                            )
                                        }
                                        placeholder="yourusername"
                                        className="min-w-0 flex-1 bg-transparent px-4 text-sm text-white outline-none placeholder:text-zinc-700"
                                    />
                                </div>

                                <p className="mt-2 text-[11px] leading-5 text-zinc-700">
                                    Your public LIRA profile will be available
                                    at{' '}
                                    <span className="text-zinc-500">
                                        /@username
                                    </span>
                                </p>

                                {form.errors.username && (
                                    <p className="mt-2 text-xs text-red-400">
                                        {form.errors.username}
                                    </p>
                                )}
                            </div>

                            {/* Artist Type + Location */}
                            <div className="grid gap-6 sm:grid-cols-2">

                                <div>
                                    <FieldLabel htmlFor="artist_type">
                                        Artist Type
                                    </FieldLabel>

                                    <input
                                        id="artist_type"
                                        type="text"
                                        value={form.data.artist_type}
                                        onChange={(event) =>
                                            form.setData(
                                                'artist_type',
                                                event.target.value,
                                            )
                                        }
                                        placeholder="Musician, Photographer, Designer..."
                                        className={inputClass}
                                    />

                                    {form.errors.artist_type && (
                                        <p className="mt-2 text-xs text-red-400">
                                            {form.errors.artist_type}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <FieldLabel htmlFor="location">
                                        Location
                                    </FieldLabel>

                                    <input
                                        id="location"
                                        type="text"
                                        value={form.data.location}
                                        onChange={(event) =>
                                            form.setData(
                                                'location',
                                                event.target.value,
                                            )
                                        }
                                        placeholder="City, Country"
                                        className={inputClass}
                                    />

                                    {form.errors.location && (
                                        <p className="mt-2 text-xs text-red-400">
                                            {form.errors.location}
                                        </p>
                                    )}
                                </div>

                            </div>

                            {/* Bio */}
                            <div>
                                <FieldLabel htmlFor="bio">
                                    Bio
                                </FieldLabel>

                                <textarea
                                    id="bio"
                                    value={form.data.bio}
                                    onChange={(event) =>
                                        form.setData(
                                            'bio',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Tell people about your work..."
                                    rows={6}
                                    className="w-full resize-none rounded-xl border border-white/[0.085] bg-[linear-gradient(145deg,rgba(255,255,255,0.035),rgba(255,255,255,0.012))] px-4 py-3 text-sm leading-6 text-white outline-none shadow-[inset_0_1px_0_rgba(255,255,255,0.025)] transition duration-300 placeholder:text-zinc-700 focus:border-white/[0.18] focus:bg-white/[0.035]"
                                />

                                {form.errors.bio && (
                                    <p className="mt-2 text-xs text-red-400">
                                        {form.errors.bio}
                                    </p>
                                )}
                            </div>

                        </div>
                    </GlassSection>

                    {/* =====================================================
                        ONLINE PRESENCE
                    ====================================================== */}

                    <GlassSection
                        number="02"
                        icon={<GlobeIcon />}
                        title="Online Presence"
                        description="Give people more ways to discover your work."
                    >
                        <div className="space-y-8">

                            {/* Website */}
                            <div>
                                <FieldLabel htmlFor="website">
                                    Website
                                </FieldLabel>

                                <input
                                    id="website"
                                    type="url"
                                    value={form.data.website}
                                    onChange={(event) =>
                                        form.setData(
                                            'website',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="https://example.com"
                                    className={inputClass}
                                />

                                {form.errors.website && (
                                    <p className="mt-2 text-xs text-red-400">
                                        {form.errors.website}
                                    </p>
                                )}
                            </div>

                            {/* Social Links */}
                            <div className="border-t border-white/[0.07] pt-8">
                                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-600">
                                            Social & Music
                                        </p>

                                        <h3 className="mt-2 text-sm font-medium text-zinc-300">
                                            Social Links
                                        </h3>

                                        <p className="mt-2 max-w-xl text-xs leading-5 text-zinc-600">
                                            Connect your social media, music, and other online platforms.
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={addSocialLink}
                                        className="group inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full border border-white/[0.09] bg-[linear-gradient(145deg,rgba(255,255,255,0.045),rgba(255,255,255,0.01))] px-4 text-xs font-medium text-zinc-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition duration-300 hover:border-white/[0.18] hover:bg-white/[0.05] hover:text-white"
                                    >
                                        <span className="transition group-hover:text-white">
                                            <PlusIcon />
                                        </span>

                                        Add Social Link
                                    </button>
                                </div>

                                {form.data.social_links.length === 0 ? (
                                    <div className="group/social relative mt-6 overflow-hidden rounded-[1.25rem] border border-white/[0.07] bg-[linear-gradient(145deg,rgba(255,255,255,0.028),rgba(255,255,255,0.008))] px-6 py-12 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.035)] transition duration-500 hover:border-white/[0.12]">
                                        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)]" />

                                        <ChromeSparkle
                                            size="sm"
                                            className="right-8 top-6 opacity-20 transition duration-500 group-hover/social:opacity-50"
                                        />

                                        <ChromeSparkle
                                            size="sm"
                                            className="bottom-7 left-10 opacity-10"
                                        />

                                        <div className="relative">
                                            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.09] bg-[linear-gradient(145deg,rgba(255,255,255,0.055),rgba(255,255,255,0.01))] text-zinc-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                                                <PlusIcon />
                                            </div>

                                            <p className="mt-4 text-sm text-zinc-600">
                                                No social links added yet.
                                            </p>

                                            <p className="mt-2 text-[11px] text-zinc-700">
                                                Add Spotify, Instagram, YouTube, TikTok, and more.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-6 space-y-3">
                                        {form.data.social_links.map((socialLink, index) => (
                                            <div
                                                key={index}
                                                className="relative rounded-[1.25rem] border border-white/[0.07] bg-[linear-gradient(145deg,rgba(255,255,255,0.028),rgba(255,255,255,0.008))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]"
                                            >
                                                <div className="grid gap-4 sm:grid-cols-[220px_1fr_auto] sm:items-end">
                                                    <div>
                                                        <FieldLabel htmlFor={`social-platform-${index}`}>
                                                            Platform
                                                        </FieldLabel>

                                                        <select
                                                            id={`social-platform-${index}`}
                                                            value={socialLink.platform}
                                                            onChange={(event) =>
                                                                updateSocialLink(
                                                                    index,
                                                                    'platform',
                                                                    event.target.value,
                                                                )
                                                            }
                                                            className={`${inputClass} appearance-none`}
                                                        >
                                                            <option value="" disabled>
                                                                Select platform
                                                            </option>

                                                            {socialPlatforms.map((platform) => (
                                                                <option
                                                                    key={platform.value}
                                                                    value={platform.value}
                                                                    className="bg-[#0b0d0f] text-white"
                                                                >
                                                                    {platform.label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <FieldLabel htmlFor={`social-url-${index}`}>
                                                            URL
                                                        </FieldLabel>

                                                        <input
                                                            id={`social-url-${index}`}
                                                            type="url"
                                                            value={socialLink.url}
                                                            onChange={(event) =>
                                                                updateSocialLink(
                                                                    index,
                                                                    'url',
                                                                    event.target.value,
                                                                )
                                                            }
                                                            placeholder="https://..."
                                                            className={inputClass}
                                                        />
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() => removeSocialLink(index)}
                                                        className="h-12 rounded-xl border border-white/[0.07] px-4 text-xs text-zinc-600 transition hover:border-red-400/20 hover:bg-red-400/[0.04] hover:text-red-400"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>

                                                {form.errors[`social_links.${index}.platform`] && (
                                                    <p className="mt-2 text-xs text-red-400">
                                                        {form.errors[`social_links.${index}.platform`]}
                                                    </p>
                                                )}

                                                {form.errors[`social_links.${index}.url`] && (
                                                    <p className="mt-2 text-xs text-red-400">
                                                        {form.errors[`social_links.${index}.url`]}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </GlassSection>

                    {/* =====================================================
                        VERIFICATION NOTICE
                    ====================================================== */}

                    <div className="group relative overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-[linear-gradient(145deg,rgba(255,255,255,0.03),rgba(255,255,255,0.008))] shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]">

                        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)]" />

                        <ChromeSparkle
                            size="sm"
                            className="right-8 top-6 opacity-20 transition duration-500 group-hover:opacity-50"
                        />

                        <div className="relative flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">

                            <div>
                                <p className="text-[9px] uppercase tracking-[0.3em] text-zinc-600">
                                    Before you publish
                                </p>

                                <p className="mt-2 text-xs leading-5 text-zinc-500">
                                    Your artist profile will be submitted
                                    for verification. Portfolio tools become
                                    available once your profile is verified.
                                </p>
                            </div>

                            <div className="flex shrink-0 items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.45)]" />

                                <span className="text-[9px] uppercase tracking-[0.2em] text-zinc-600">
                                    Verification required
                                </span>
                            </div>

                        </div>
                    </div>

                    {/* =====================================================
                        SUBMIT
                    ====================================================== */}

                    <div className="flex flex-col-reverse gap-5 border-t border-white/[0.07] pt-7 sm:flex-row sm:items-center sm:justify-between">

                        <p className="max-w-md text-[11px] leading-5 text-zinc-700">
                            You can customize your portfolio after creating
                            your profile and completing verification.
                        </p>

                        <button
                            type="submit"
                            disabled={form.processing}
                            className="group relative inline-flex h-12 shrink-0 items-center justify-center gap-3 overflow-hidden rounded-full border border-white/40 bg-[linear-gradient(105deg,#32ddff_0%,#6677ff_20%,#a955ff_38%,#f05abd_51%,#ff8ed3_63%,#7b63ff_78%,#34dcff_94%)] px-7 text-sm font-medium text-[#08090b] shadow-[0_8px_35px_rgba(90,150,255,0.16)] transition duration-300 hover:scale-[1.015] hover:shadow-[0_12px_50px_rgba(190,80,255,0.24)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                        >
                            <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_20%,rgba(255,255,255,0.6)_48%,transparent_72%)] opacity-0 transition duration-700 group-hover:translate-x-[25%] group-hover:opacity-100" />

                            <span className="relative">
                                {form.processing
                                    ? 'Creating Profile...'
                                    : 'Create Artist Profile'}
                            </span>

                            {!form.processing && (
                                <span className="relative">
                                    <ArrowUpRight />
                                </span>
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </DashboardLayout>
    );
}
