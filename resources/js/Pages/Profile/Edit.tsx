import { FormEvent, ReactNode } from 'react';
import { Link, useForm } from '@inertiajs/react';

import DashboardLayout from '../../Components/Dashboard/d_layout';
import {
    ArrowLeft,
    ArrowUpRight,
    CloseIcon,
    GlobeIcon,
    PlusIcon,
    UserIcon,
} from '../../Components/Icons';

interface SocialLink {
    id: number;
    platform: string;
    url: string;
    position: number;
    is_visible: boolean;
}

interface Profile {
    id: number;
    username: string;
    display_name: string;
    bio: string | null;
    artist_type: string | null;
    location: string | null;
    website: string | null;
    verification_status: string;
    is_published: boolean;
    social_links: SocialLink[];
}

interface Props {
    profile: Profile;
}

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

const SOCIAL_PLATFORMS = [
    {
        value: 'spotify',
        label: 'Spotify',
    },
    {
        value: 'apple_music',
        label: 'Apple Music',
    },
    {
        value: 'instagram',
        label: 'Instagram',
    },
    {
        value: 'youtube',
        label: 'YouTube',
    },
    {
        value: 'tiktok',
        label: 'TikTok',
    },
    {
        value: 'x',
        label: 'X',
    },
    {
        value: 'facebook',
        label: 'Facebook',
    },
    {
        value: 'soundcloud',
        label: 'SoundCloud',
    },
];

/*
|--------------------------------------------------------------------------
| Chrome Sparkle
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
                    fill="url(#chrome-sparkle-edit)"
                />

                <defs>
                    <linearGradient
                        id="chrome-sparkle-edit"
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
| Glass Section
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
| Field Label
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
            className="mb-2 block text-[8px] uppercase tracking-[0.25em] text-zinc-600"
        >
            {children}
        </label>
    );
}

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

/*
|--------------------------------------------------------------------------
| Input Class
|--------------------------------------------------------------------------
*/

const inputClass =
    'h-12 w-full rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-white/[0.18] focus:bg-white/[0.04]';

/*
|--------------------------------------------------------------------------
| Chrome Button
|--------------------------------------------------------------------------
*/

function ChromeButton({
    children,
    type = 'button',
    disabled = false,
}: {
    children: ReactNode;
    type?: 'button' | 'submit';
    disabled?: boolean;
}) {
    return (
        <button
            type={type}
            disabled={disabled}
            className="group relative inline-flex h-11 items-center justify-center overflow-hidden rounded-full border border-white/50 bg-[linear-gradient(105deg,#32ddff_0%,#6677ff_20%,#a955ff_38%,#f05abd_51%,#ff8ed3_63%,#7b63ff_78%,#34dcff_94%)] px-7 text-xs font-medium text-[#09090a] shadow-[0_8px_35px_rgba(90,150,255,0.16)] transition duration-300 hover:scale-[1.02] hover:shadow-[0_12px_50px_rgba(190,80,255,0.22)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
        >
            <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_20%,rgba(255,255,255,0.55)_48%,transparent_72%)] opacity-0 transition duration-700 group-hover:translate-x-[25%] group-hover:opacity-100" />

            <span className="relative">
                {children}
            </span>
        </button>
    );
}

/*
|--------------------------------------------------------------------------
| Edit Profile
|--------------------------------------------------------------------------
*/

export default function Edit({ profile }: Props) {
    const form = useForm<FormData>({
        username: profile.username,
        display_name: profile.display_name,
        bio: profile.bio ?? '',
        artist_type: profile.artist_type ?? '',
        location: profile.location ?? '',
        website: profile.website ?? '',
        social_links: profile.social_links.map((link) => ({
            platform: link.platform,
            url: link.url,
        })),
    });

    function submit(event: FormEvent) {
        event.preventDefault();

        form.put('/dashboard/profile', {
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
        if (form.data.social_links.length >= 8) {
            return;
        }

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
            form.data.social_links.filter(
                (_, linkIndex) => linkIndex !== index,
            ),
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

    function getAvailablePlatforms(index: number) {
        const selectedPlatforms = form.data.social_links
            .map((link, linkIndex) =>
                linkIndex === index ? null : link.platform,
            )
            .filter(Boolean);

        return SOCIAL_PLATFORMS.filter(
            (platform) =>
                !selectedPlatforms.includes(platform.value),
        );
    }

    const verificationStatus =
        profile.verification_status.toLowerCase();

    const verificationLabel =
        verificationStatus.charAt(0).toUpperCase() +
        verificationStatus.slice(1);

    const verificationMessage =
        verificationStatus === 'verified'
            ? 'Your artist identity has been verified. Your creative workspace is fully available.'
            : verificationStatus === 'rejected'
                ? 'Your artist profile was not approved. Review your profile information before submitting again.'
                : 'Your artist profile is currently under review.';

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
                                    LIRA / STUDIO / PROFILE
                                </span>
                            </div>

                            <h1 className="text-4xl font-light tracking-[-0.055em] text-white sm:text-5xl">
                                Edit your
                                <br />

                                <span className="bg-[linear-gradient(100deg,#ffffff_0%,#aeb8bd_30%,#ffffff_48%,#77838a_68%,#ffffff_100%)] bg-clip-text text-transparent">
                                    artist identity.
                                </span>
                            </h1>

                            <p className="mt-5 max-w-xl text-sm leading-6 text-zinc-600">
                                Manage the information people see when they
                                discover you on LIRA.
                            </p>
                        </div>

                        <div className="flex shrink-0 items-center gap-4">
                            <Link
                                href="/dashboard/profile"
                                className="inline-flex items-center gap-2 text-xs text-zinc-600 transition duration-300 hover:text-white"
                            >
                                <ArrowLeft />
                                View Profile
                            </Link>
                        </div>
                    </div>
                </div>

                {/* =========================================================
                    FORM
                ========================================================== */}

                <form onSubmit={submit}>
                    {/* =====================================================
                        PROFILE
                    ====================================================== */}

                    <GlassSection
                        number="01"
                        icon={<UserIcon />}
                        title="Artist Identity"
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
                                    className={inputClass}
                                    placeholder="Your artist name"
                                />

                                {form.errors.display_name && (
                                    <p className="mt-2 text-[10px] text-red-400">
                                        {form.errors.display_name}
                                    </p>
                                )}
                            </div>

                            {/* Username */}

                            <div>
                                <FieldLabel htmlFor="username">
                                    Username
                                </FieldLabel>

                                <div className="relative">
                                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xs text-zinc-600">
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
                                        className={`${inputClass} pl-8`}
                                        placeholder="yourusername"
                                    />
                                </div>

                                <p className="mt-2 text-[10px] text-zinc-700">
                                    Your public LIRA profile will be available
                                    at{' '}
                                    <span className="text-zinc-600">
                                        /@
                                        {form.data.username || 'username'}
                                    </span>
                                </p>

                                {form.errors.username && (
                                    <p className="mt-2 text-[10px] text-red-400">
                                        {form.errors.username}
                                    </p>
                                )}
                            </div>

                            {/* Artist Type + Location */}

                            <div className="grid gap-6 md:grid-cols-2">
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
                                        className={inputClass}
                                        placeholder="Musician, Photographer, Designer..."
                                    />

                                    {form.errors.artist_type && (
                                        <p className="mt-2 text-[10px] text-red-400">
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
                                        className={inputClass}
                                        placeholder="City, Country"
                                    />

                                    {form.errors.location && (
                                        <p className="mt-2 text-[10px] text-red-400">
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
                                    rows={6}
                                    value={form.data.bio}
                                    onChange={(event) =>
                                        form.setData(
                                            'bio',
                                            event.target.value,
                                        )
                                    }
                                    className="w-full resize-none rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-zinc-700 focus:border-white/[0.18] focus:bg-white/[0.04]"
                                    placeholder="Tell people about your work..."
                                />

                                {form.errors.bio && (
                                    <p className="mt-2 text-[10px] text-red-400">
                                        {form.errors.bio}
                                    </p>
                                )}
                            </div>
                        </div>
                    </GlassSection>

                    {/* =====================================================
                        ONLINE PRESENCE
                    ====================================================== */}

                    <div className="mt-5">
                        <GlassSection
                            number="02"
                            icon={<GlobeIcon />}
                            title="Online Presence"
                            description="Give people more ways to discover your work."
                        >
                            <div className="space-y-7">
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
                                        className={inputClass}
                                        placeholder="https://example.com"
                                    />

                                    {form.errors.website && (
                                        <p className="mt-2 text-[10px] text-red-400">
                                            {form.errors.website}
                                        </p>
                                    )}
                                </div>

                                {/* Social Links */}

                                <div className="border-t border-white/[0.07] pt-7">
                                    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                                        <div>
                                            <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-600">
                                                Social & Music
                                            </p>

                                            <h3 className="mt-2 text-sm font-medium text-zinc-300">
                                                Social Links
                                            </h3>

                                            <p className="mt-2 max-w-xl text-xs leading-5 text-zinc-600">
                                                Connect your social media, music,
                                                and other online platforms.
                                            </p>
                                        </div>

                                        {form.data.social_links.length < 8 && (
                                            <button
                                                type="button"
                                                onClick={addSocialLink}
                                                className="group inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full border border-white/[0.09] bg-[linear-gradient(145deg,rgba(255,255,255,0.045),rgba(255,255,255,0.01))] px-4 text-xs font-medium text-zinc-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition duration-300 hover:border-white/[0.18] hover:bg-white/[0.05] hover:text-white"
                                            >
                                                <PlusIcon />
                                                Add Social Link
                                            </button>
                                        )}
                                    </div>

                                    {form.data.social_links.length === 0 ? (
                                        <div className="group/social relative mt-6 overflow-hidden rounded-[1.25rem] border border-white/[0.07] bg-[linear-gradient(145deg,rgba(255,255,255,0.028),rgba(255,255,255,0.008))] px-6 py-12 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]">
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

                                                <button
                                                    type="button"
                                                    onClick={addSocialLink}
                                                    className="mt-2 text-[11px] text-zinc-700 transition hover:text-zinc-300"
                                                >
                                                    Add your first link
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="mt-6 space-y-3">
                                            {form.data.social_links.map(
                                                (socialLink, index) => (
                                                    <div
                                                        key={index}
                                                        className="relative rounded-[1.25rem] border border-white/[0.07] bg-[linear-gradient(145deg,rgba(255,255,255,0.028),rgba(255,255,255,0.008))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]"
                                                    >
                                                        <div className="grid gap-4 sm:grid-cols-[220px_1fr_auto] sm:items-end">
                                                            {/* Platform */}

                                                            <div>
                                                                <FieldLabel
                                                                    htmlFor={`social-platform-${index}`}
                                                                >
                                                                    Platform
                                                                </FieldLabel>

                                                                <select
                                                                    id={`social-platform-${index}`}
                                                                    value={
                                                                        socialLink.platform
                                                                    }
                                                                    onChange={(
                                                                        event,
                                                                    ) =>
                                                                        updateSocialLink(
                                                                            index,
                                                                            'platform',
                                                                            event
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                    className={`${inputClass} appearance-none`}
                                                                >
                                                                    <option
                                                                        value=""
                                                                        disabled
                                                                        className="bg-[#0a0c0e]"
                                                                    >
                                                                        Select
                                                                        platform
                                                                    </option>

                                                                    {getAvailablePlatforms(
                                                                        index,
                                                                    ).map(
                                                                        (
                                                                            platform,
                                                                        ) => (
                                                                            <option
                                                                                key={
                                                                                    platform.value
                                                                                }
                                                                                value={
                                                                                    platform.value
                                                                                }
                                                                                className="bg-[#0a0c0e]"
                                                                            >
                                                                                {
                                                                                    platform.label
                                                                                }
                                                                            </option>
                                                                        ),
                                                                    )}
                                                                </select>
                                                            </div>

                                                            {/* URL */}

                                                            <div>
                                                                <FieldLabel
                                                                    htmlFor={`social-url-${index}`}
                                                                >
                                                                    URL
                                                                </FieldLabel>

                                                                <input
                                                                    id={`social-url-${index}`}
                                                                    type="url"
                                                                    value={
                                                                        socialLink.url
                                                                    }
                                                                    onChange={(
                                                                        event,
                                                                    ) =>
                                                                        updateSocialLink(
                                                                            index,
                                                                            'url',
                                                                            event
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                    className={inputClass}
                                                                    placeholder="https://..."
                                                                />
                                                            </div>

                                                            {/* Remove */}

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    removeSocialLink(
                                                                        index,
                                                                    )
                                                                }
                                                                className="h-12 rounded-xl border border-white/[0.07] px-4 text-xs text-zinc-600 transition hover:border-red-400/20 hover:bg-red-400/[0.04] hover:text-red-400"
                                                                aria-label="Remove social link"
                                                            >
                                                                <CloseIcon />
                                                            </button>
                                                        </div>

                                                        {form.errors[
                                                            `social_links.${index}.platform` as keyof typeof form.errors
                                                        ] && (
                                                                <p className="mt-2 text-xs text-red-400">
                                                                    {
                                                                        form.errors[
                                                                        `social_links.${index}.platform` as keyof typeof form.errors
                                                                        ]
                                                                    }
                                                                </p>
                                                            )}

                                                        {form.errors[
                                                            `social_links.${index}.url` as keyof typeof form.errors
                                                        ] && (
                                                                <p className="mt-2 text-xs text-red-400">
                                                                    {
                                                                        form.errors[
                                                                        `social_links.${index}.url` as keyof typeof form.errors
                                                                        ]
                                                                    }
                                                                </p>
                                                            )}
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </GlassSection>
                    </div>

                    {/* =====================================================
                        VERIFICATION
                    ====================================================== */}

                    <div className="mt-5">
                        <GlassSection
                            number="03"
                            icon={
                                <span
                                    className={`h-2.5 w-2.5 rounded-full ${verificationStatus === 'verified'
                                        ? 'bg-[#7de7ff] shadow-[0_0_12px_rgba(125,231,255,0.8)]'
                                        : verificationStatus ===
                                            'rejected'
                                            ? 'bg-red-400 shadow-[0_0_12px_rgba(248,113,113,0.5)]'
                                            : 'bg-[#a855f7] shadow-[0_0_12px_rgba(168,85,247,0.7)]'
                                        }`}
                                />
                            }
                            title="Verification"
                            description="Your current LIRA artist verification status."
                        >
                            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-medium text-zinc-200">
                                            {verificationLabel}
                                        </span>

                                        <span className="h-1 w-1 rounded-full bg-zinc-700" />

                                        <span className="text-[9px] uppercase tracking-[0.2em] text-zinc-600">
                                            {profile.verification_status}
                                        </span>
                                    </div>

                                    <p className="mt-3 max-w-2xl text-xs leading-6 text-zinc-600">
                                        {verificationMessage}
                                    </p>
                                </div>

                                <div
                                    className={`shrink-0 rounded-full border px-4 py-2 text-[9px] uppercase tracking-[0.2em] ${verificationStatus === 'verified'
                                        ? 'border-[#7de7ff]/20 bg-[#7de7ff]/[0.04] text-[#7de7ff]'
                                        : verificationStatus ===
                                            'rejected'
                                            ? 'border-red-400/20 bg-red-400/[0.04] text-red-400'
                                            : 'border-white/[0.08] bg-white/[0.02] text-zinc-600'
                                        }`}
                                >
                                    {profile.is_published
                                        ? 'Published'
                                        : 'Not Published'}
                                </div>
                            </div>
                        </GlassSection>
                    </div>

                    {/* =====================================================
                        FORM ACTIONS
                    ====================================================== */}

                    <div className="mt-6 flex flex-col-reverse items-stretch justify-between gap-4 sm:flex-row sm:items-center">
                        <Link
                            href="/dashboard/profile"
                            className="text-center text-xs text-zinc-600 transition hover:text-zinc-300 sm:text-left"
                        >
                            Cancel
                        </Link>

                        <ChromeButton
                            type="submit"
                            disabled={form.processing}
                        >
                            {form.processing ? 'Saving...' : 'Save Changes'}
                        </ChromeButton>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}
