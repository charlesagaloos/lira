import { Link } from '@inertiajs/react';
import { ReactNode } from 'react';

import DashboardLayout from '../../Components/Dashboard/d_layout';
import {
    ArrowUpRight,
    GlobeIcon,
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
    username: string;
    display_name: string;
    bio: string | null;
    artist_type: string | null;
    location: string | null;
    website: string | null;
    verification_status: string;
    verified_at: string | null;
    social_links: SocialLink[];
}

interface Props {
    profile: Profile;
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
                    fill="url(#chrome-sparkle-view)"
                />

                <defs>
                    <linearGradient
                        id="chrome-sparkle-view"
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
| PLATFORM LABEL
|--------------------------------------------------------------------------
*/

function getPlatformLabel(platform: string): string {
    const labels: Record<string, string> = {
        spotify: 'Spotify',
        apple_music: 'Apple Music',
        instagram: 'Instagram',
        youtube: 'YouTube',
        tiktok: 'TikTok',
        x: 'X',
        facebook: 'Facebook',
        soundcloud: 'SoundCloud',
    };

    return labels[platform] ?? platform;
}

/*
|--------------------------------------------------------------------------
| VERIFICATION
|--------------------------------------------------------------------------
*/

function getVerificationLabel(status: string): string {
    switch (status.toLowerCase()) {
        case 'verified':
            return 'Verified';

        case 'rejected':
            return 'Rejected';

        case 'pending':
        default:
            return 'Pending Review';
    }
}

function getVerificationDescription(status: string): string {
    switch (status.toLowerCase()) {
        case 'verified':
            return 'Your artist identity has been verified. Portfolio tools are available to you.';

        case 'rejected':
            return 'Your profile verification was not approved. You can update your profile and submit it again when available.';

        case 'pending':
        default:
            return 'Your artist profile is currently being reviewed. Portfolio tools become available once your profile is verified.';
    }
}

/*
|--------------------------------------------------------------------------
| VIEW PROFILE
|--------------------------------------------------------------------------
*/

export default function View({ profile }: Props) {
    const isVerified =
        profile.verification_status.toLowerCase() === 'verified';

    const visibleSocialLinks = profile.social_links.filter(
        (socialLink) => socialLink.is_visible,
    );

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
                                Your artist
                                <br />
                                <span className="bg-[linear-gradient(90deg,#fff_0%,#bdefff_24%,#9d8cff_58%,#f08bd7_82%,#fff_100%)] bg-clip-text text-transparent">
                                    identity.
                                </span>
                            </h1>

                            <p className="mt-5 max-w-xl text-sm leading-6 text-zinc-600">
                                This is your artist profile inside LIRA.
                                Keep your identity current so people can
                                discover your work.
                            </p>
                        </div>

                        <div className="flex shrink-0 items-center gap-4">
                            <Link
                                href="/dashboard/profile/edit"
                                className="group inline-flex h-11 items-center gap-3 rounded-full border border-white/[0.14] bg-[linear-gradient(145deg,rgba(255,255,255,0.055),rgba(255,255,255,0.012))] px-5 text-xs font-medium text-zinc-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition duration-300 hover:border-white/[0.24] hover:bg-white/[0.07] hover:text-white"
                            >
                                Edit Profile

                                <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                                    <ArrowUpRight />
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* =========================================================
                    PROFILE IDENTITY
                ========================================================== */}

                <div className="space-y-5">
                    <GlassSection
                        number="01"
                        icon={<UserIcon />}
                        title="Artist Identity"
                        description="The information people see when they discover your LIRA profile."
                    >
                        <div className="space-y-8">
                            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                                <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/[0.10] bg-[linear-gradient(145deg,rgba(255,255,255,0.07),rgba(255,255,255,0.015))] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                                    <span className="text-2xl font-light text-zinc-500">
                                        {profile.display_name
                                            .charAt(0)
                                            .toUpperCase()}
                                    </span>

                                    <ChromeSparkle
                                        size="sm"
                                        className="right-2 top-2 opacity-30"
                                    />
                                </div>

                                <div className="min-w-0">
                                    <h2 className="text-2xl font-light tracking-[-0.035em] text-white">
                                        {profile.display_name}
                                    </h2>

                                    <p className="mt-1 text-sm text-zinc-600">
                                        @{profile.username}
                                    </p>

                                    <div className="mt-4 flex flex-wrap items-center gap-2">
                                        {profile.artist_type && (
                                            <span className="rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-1.5 text-[9px] uppercase tracking-[0.18em] text-zinc-500">
                                                {profile.artist_type}
                                            </span>
                                        )}

                                        {profile.location && (
                                            <span className="rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-1.5 text-[9px] uppercase tracking-[0.18em] text-zinc-500">
                                                {profile.location}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {profile.bio && (
                                <div className="border-t border-white/[0.07] pt-7">
                                    <p className="max-w-3xl whitespace-pre-line text-sm leading-7 text-zinc-500">
                                        {profile.bio}
                                    </p>
                                </div>
                            )}
                        </div>
                    </GlassSection>

                    {/* =====================================================
                        ONLINE PRESENCE
                    ====================================================== */}

                    <GlassSection
                        number="02"
                        icon={<GlobeIcon />}
                        title="Online Presence"
                        description="Your website, social profiles, and music platforms."
                    >
                        <div className="space-y-6">
                            {profile.website && (
                                <div>
                                    <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-zinc-600">
                                        Website
                                    </p>

                                    <a
                                        href={profile.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
                                    >
                                        <span className="break-all">
                                            {profile.website}
                                        </span>

                                        <ArrowUpRight className="shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                    </a>
                                </div>
                            )}

                            {visibleSocialLinks.length > 0 ? (
                                <div className="border-t border-white/[0.07] pt-7">
                                    <p className="mb-4 text-[10px] uppercase tracking-[0.25em] text-zinc-600">
                                        Social & Music
                                    </p>

                                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                        {visibleSocialLinks.map(
                                            (socialLink) => (
                                                <a
                                                    key={socialLink.id}
                                                    href={socialLink.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="group flex min-h-[58px] items-center justify-between rounded-xl border border-white/[0.07] bg-[linear-gradient(145deg,rgba(255,255,255,0.028),rgba(255,255,255,0.008))] px-4 transition duration-300 hover:border-white/[0.14] hover:bg-white/[0.04]"
                                                >
                                                    <span className="text-xs text-zinc-500 transition group-hover:text-zinc-200">
                                                        {getPlatformLabel(
                                                            socialLink.platform,
                                                        )}
                                                    </span>

                                                    <ArrowUpRight className="text-zinc-700 transition duration-300 group-hover:text-zinc-300" />
                                                </a>
                                            ),
                                        )}
                                    </div>
                                </div>
                            ) : !profile.website ? (
                                <div className="relative overflow-hidden rounded-[1.25rem] border border-white/[0.07] bg-[linear-gradient(145deg,rgba(255,255,255,0.028),rgba(255,255,255,0.008))] px-6 py-10 text-center">
                                    <ChromeSparkle
                                        size="sm"
                                        className="right-8 top-6 opacity-20"
                                    />

                                    <p className="text-sm text-zinc-600">
                                        No online links added yet.
                                    </p>

                                    <p className="mt-2 text-[11px] text-zinc-700">
                                        Add your website and social platforms
                                        from Edit Profile.
                                    </p>
                                </div>
                            ) : null}
                        </div>
                    </GlassSection>

                    {/* =====================================================
                        VERIFICATION
                    ====================================================== */}

                    <GlassSection
                        number="03"
                        icon={
                            <span
                                className={`h-2.5 w-2.5 rounded-full ${isVerified
                                    ? 'bg-[#7de7ff] shadow-[0_0_12px_rgba(125,231,255,0.8)]'
                                    : 'bg-white/50 shadow-[0_0_10px_rgba(255,255,255,0.25)]'
                                    }`}
                            />
                        }
                        title="Verification"
                        description="Your current LIRA artist verification status."
                    >
                        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <div className="flex items-center gap-3">
                                    <span
                                        className={`text-sm font-medium ${isVerified
                                            ? 'text-white'
                                            : 'text-zinc-300'
                                            }`}
                                    >
                                        {getVerificationLabel(
                                            profile.verification_status,
                                        )}
                                    </span>

                                    <span className="h-1 w-1 rounded-full bg-zinc-700" />

                                    <span className="text-[9px] uppercase tracking-[0.2em] text-zinc-600">
                                        {profile.verification_status}
                                    </span>
                                </div>

                                <p className="mt-3 max-w-2xl text-xs leading-6 text-zinc-600">
                                    {getVerificationDescription(
                                        profile.verification_status,
                                    )}
                                </p>
                            </div>

                            <div
                                className={`shrink-0 rounded-full border px-4 py-2 text-[9px] uppercase tracking-[0.2em] ${isVerified
                                    ? 'border-[#7de7ff]/20 bg-[#7de7ff]/[0.04] text-[#7de7ff]'
                                    : 'border-white/[0.08] bg-white/[0.02] text-zinc-600'
                                    }`}
                            >
                                {isVerified
                                    ? 'Verified Artist'
                                    : 'Under Review'}
                            </div>
                        </div>
                    </GlassSection>

                    {/* =====================================================
                        PROFILE URL
                    ====================================================== */}

                    <div className="relative overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-[linear-gradient(145deg,rgba(255,255,255,0.03),rgba(255,255,255,0.008))] shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]">
                        <ChromeSparkle
                            size="sm"
                            className="right-8 top-6 opacity-20"
                        />

                        <div className="relative flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
                            <div>
                                <p className="text-[9px] uppercase tracking-[0.3em] text-zinc-600">
                                    Public Profile
                                </p>

                                <p className="mt-2 text-sm text-zinc-500">
                                    Your LIRA profile
                                </p>
                            </div>

                            {isVerified ? (
                                <a
                                    href={`/@${profile.username}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group inline-flex shrink-0 items-center gap-2 text-xs text-zinc-500 transition hover:text-white"
                                >
                                    <span className="break-all">
                                        /@{profile.username}
                                    </span>

                                    <ArrowUpRight className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </a>
                            ) : (
                                <span className="text-[9px] uppercase tracking-[0.2em] text-zinc-700">
                                    Available after verification
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
