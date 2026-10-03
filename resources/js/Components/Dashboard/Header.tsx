import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface User {
    name: string;
    email: string;
}

interface Profile {
    username: string;
    display_name: string;
    verification_status: string;
    avatar: string | null;
    avatar_zoom: number;
    avatar_position_x: number;
    avatar_position_y: number;
}

interface PageProps {
    auth: {
        user: User;
    };
    profile: Profile | null;
}

interface HeaderProps {
    sidebarCollapsed: boolean;
}

/*
|--------------------------------------------------------------------------
| Icons
|--------------------------------------------------------------------------
*/

function UserIcon() {
    return (
        <svg
            viewBox="0 0 20 20"
            fill="none"
            className="h-4 w-4"
            aria-hidden="true"
        >
            <circle
                cx="10"
                cy="7"
                r="3"
                stroke="currentColor"
                strokeWidth="1.3"
            />

            <path
                d="M4.5 17C5.3 13.8 7.1 12.5 10 12.5C12.9 12.5 14.7 13.8 15.5 17"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
            />
        </svg>
    );
}

function LogoutIcon() {
    return (
        <svg
            viewBox="0 0 20 20"
            fill="none"
            className="h-4 w-4"
            aria-hidden="true"
        >
            <path
                d="M8 4H4.5C3.67 4 3 4.67 3 5.5V14.5C3 15.33 3.67 16 4.5 16H8"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
            />

            <path
                d="M11 6L15 10L11 14M15 10H7"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function MenuIcon() {
    return (
        <svg
            viewBox="0 0 20 20"
            fill="none"
            className="h-4 w-4"
            aria-hidden="true"
        >
            <path
                d="M4 6H16M4 10H16M4 14H16"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
            />
        </svg>
    );
}

function CloseIcon() {
    return (
        <svg
            viewBox="0 0 20 20"
            fill="none"
            className="h-4 w-4"
            aria-hidden="true"
        >
            <path
                d="M5 5L15 15M15 5L5 15"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
            />
        </svg>
    );
}

function ArrowIcon() {
    return (
        <svg
            viewBox="0 0 20 20"
            fill="none"
            className="h-3.5 w-3.5"
            aria-hidden="true"
        >
            <path
                d="M7 4L13 10L7 16"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function LockIcon() {
    return (
        <svg
            viewBox="0 0 20 20"
            fill="none"
            className="h-3.5 w-3.5"
            aria-hidden="true"
        >
            <rect
                x="5"
                y="8.5"
                width="10"
                height="7"
                rx="1.5"
                stroke="currentColor"
                strokeWidth="1.2"
            />

            <path
                d="M7.5 8.5V6.75C7.5 5.36929 8.61929 4.25 10 4.25C11.3807 4.25 12.5 5.36929 12.5 6.75V8.5"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
            />
        </svg>
    );
}

function ActiveIndicator() {
    return (
        <span
            className="relative flex h-2.5 w-2.5 shrink-0 items-center justify-center"
            aria-hidden="true"
        >
            <span className="absolute h-1 w-1 rounded-full bg-[#7de7ff] shadow-[0_0_8px_rgba(125,231,255,0.9),0_0_16px_rgba(125,231,255,0.35)]" />

            <span className="absolute h-3 w-px bg-[linear-gradient(to_bottom,transparent,#7de7ff,transparent)] opacity-80" />

            <span className="absolute h-px w-3 bg-[linear-gradient(to_right,transparent,#7de7ff,transparent)] opacity-80" />
        </span>
    );
}


/*
|--------------------------------------------------------------------------
| Profile Avatar
|--------------------------------------------------------------------------
|
| Renders the saved avatar using the same zoom/position model as the
| profile editor and dashboard. The calculation is relative to the
| actual avatar viewport so it remains accurate at every header size.
|--------------------------------------------------------------------------
*/

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

function ProfileAvatar({
    profile,
    size,
    iconSize = 'h-4 w-4',
}: {
    profile: Profile | null;
    size: number;
    iconSize?: string;
}) {
    const [naturalSize, setNaturalSize] = useState({
        width: 1,
        height: 1,
    });

    const avatarUrl = getImageUrl(profile?.avatar ?? null);

    const zoom = Number(profile?.avatar_zoom ?? 1) || 1;
    const positionX = Number(profile?.avatar_position_x ?? 50);
    const positionY = Number(profile?.avatar_position_y ?? 50);

    const aspectRatio = naturalSize.width / naturalSize.height;

    let baseWidth = size;
    let baseHeight = size;

    if (Number.isFinite(aspectRatio) && aspectRatio > 0) {
        if (aspectRatio >= 1) {
            baseWidth = size * aspectRatio;
        } else {
            baseHeight = size / aspectRatio;
        }
    }

    const scaledWidth = baseWidth * zoom;
    const scaledHeight = baseHeight * zoom;

    const maxX = Math.max(0, (scaledWidth - size) / 2);
    const maxY = Math.max(0, (scaledHeight - size) / 2);

    const translateX = ((positionX - 50) / 50) * maxX;
    const translateY = ((positionY - 50) / 50) * maxY;

    return (
        <div
            className="relative shrink-0 overflow-hidden rounded-full border border-white/[0.12] bg-[linear-gradient(135deg,#ffffff,#7c8990,#ffffff,#68747d)] text-[#111] shadow-[0_0_24px_rgba(255,255,255,0.08)]"
            style={{
                width: `${size}px`,
                height: `${size}px`,
            }}
        >
            {avatarUrl ? (
                <img
                    src={avatarUrl}
                    alt={profile?.display_name ?? 'Profile'}
                    draggable={false}
                    onLoad={(event) => {
                        const image = event.currentTarget;

                        if (image.naturalWidth && image.naturalHeight) {
                            setNaturalSize({
                                width: image.naturalWidth,
                                height: image.naturalHeight,
                            });
                        }
                    }}
                    className="absolute left-1/2 top-1/2 max-w-none select-none"
                    style={{
                        width: `${baseWidth}px`,
                        height: `${baseHeight}px`,
                        transform: `translate(-50%, -50%) translate(${translateX}px, ${translateY}px) scale(${zoom})`,
                    }}
                />
            ) : (
                <div className="flex h-full w-full items-center justify-center">
                    <UserIcon />
                </div>
            )}

            <div className="pointer-events-none absolute inset-0 rounded-full bg-[linear-gradient(120deg,transparent_20%,rgba(255,255,255,0.22)_48%,transparent_72%)] opacity-35" />
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| Header
|--------------------------------------------------------------------------
*/

export default function Header({
    sidebarCollapsed,
}: HeaderProps) {
    const page = usePage();

    const { auth, profile } =
        page.props as unknown as PageProps;

    const { url } = page;

    const [mobileMenuOpen, setMobileMenuOpen] =
        useState(false);

    /*
    |--------------------------------------------------------------------------
    | Verification
    |--------------------------------------------------------------------------
    */

    const isVerified =
        profile?.verification_status?.toLowerCase() === 'verified';

    /*
    |--------------------------------------------------------------------------
    | Current Page
    |--------------------------------------------------------------------------
    */

    const getPageTitle = (): string => {
        if (
            url === '/dashboard' ||
            url === '/dashboard/'
        ) {
            return 'Overview';
        }

        if (
            url === '/dashboard/profile' ||
            url === '/dashboard/profile/' ||
            url.startsWith('/dashboard/profile/create') ||
            url.startsWith('/dashboard/profile/edit')
        ) {
            return 'Profile';
        }

        if (
            url === '/dashboard/projects' ||
            url.startsWith('/dashboard/projects/')
        ) {
            return 'Projects';
        }

        if (
            url === '/dashboard/releases' ||
            url.startsWith('/dashboard/releases/')
        ) {
            return 'Music';
        }

        if (
            url === '/dashboard/portfolio' ||
            url.startsWith('/dashboard/portfolio/')
        ) {
            return 'Portfolio';
        }

        if (
            url === '/dashboard/settings' ||
            url.startsWith('/dashboard/settings/')
        ) {
            return 'Settings';
        }

        return 'Studio';
    };

    const pageTitle = getPageTitle();

    /*
    |--------------------------------------------------------------------------
    | Active State
    |--------------------------------------------------------------------------
    */

    const isOverviewActive =
        url === '/dashboard' ||
        url === '/dashboard/';

    const isProfileActive =
        url === '/dashboard/profile' ||
        url === '/dashboard/profile/' ||
        url.startsWith('/dashboard/profile/create') ||
        url.startsWith('/dashboard/profile/edit');

    const isProjectsActive =
        url === '/dashboard/projects' ||
        url.startsWith('/dashboard/projects/');

    const isReleasesActive =
        url === '/dashboard/releases' ||
        url.startsWith('/dashboard/releases/');

    const isPortfolioActive =
        url === '/dashboard/portfolio' ||
        url.startsWith('/dashboard/portfolio/');

    /*
    |--------------------------------------------------------------------------
    | Close Menu After Navigation
    |--------------------------------------------------------------------------
    */

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    return (
        <header
            className={`fixed right-0 top-0 z-40 w-full border-b border-white/[0.07] bg-[#050607]/90 backdrop-blur-xl transition-[left] duration-300 lg:w-auto ${
                sidebarCollapsed
                    ? 'lg:left-[76px]'
                    : 'lg:left-[250px]'
            }`}
        >
            {/* =============================================================
                HEADER BAR
            ============================================================= */}

            <div className="flex min-h-[64px] items-center justify-between gap-3 px-3 py-2 sm:min-h-[68px] sm:px-5 sm:py-2.5 md:px-7 lg:h-[76px] lg:min-h-0 lg:px-10 xl:px-12">

                {/* =========================================================
                    MOBILE / TABLET LOGO
                ========================================================== */}

                <Link
                    href="/dashboard"
                    aria-label="LIRA home"
                    className="lg:hidden"
                >
                    <img
                        src="/images/brand/Lira_logo.png"
                        alt="LIRA"
                        className="w-[68px] opacity-95 xs:w-[74px] sm:w-[82px]"
                    />
                </Link>

                {/* =========================================================
                    DESKTOP PAGE CONTEXT
                ========================================================== */}

                <div className="hidden lg:block">
                    <p className="text-[8px] uppercase tracking-[0.32em] text-zinc-600">
                        LIRA / STUDIO
                    </p>

                    <p className="mt-1 text-xs text-zinc-500">
                        {pageTitle}
                    </p>
                </div>

                {/* =========================================================
                    DESKTOP USER
                ========================================================== */}

                <div className="ml-auto hidden items-center gap-5 lg:flex">

                    <div className="text-right">
                        <p className="text-xs text-zinc-300">
                            {profile?.display_name ??
                                auth.user.name}
                        </p>

                        {profile ? (
                            <p className="mt-1 text-[9px] text-zinc-600">
                                @{profile.username}
                            </p>
                        ) : (
                            <p className="mt-1 text-[9px] text-zinc-600">
                                Artist profile not created
                            </p>
                        )}
                    </div>

                    <ProfileAvatar
                        profile={profile}
                        size={36}
                    />

                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="text-zinc-600 transition hover:text-zinc-300"
                        aria-label="Log out"
                    >
                        <LogoutIcon />
                    </Link>
                </div>

                {/* =========================================================
                    MOBILE / TABLET CONTROLS
                ========================================================== */}

                <div className="ml-auto flex min-w-0 items-center gap-1.5 sm:gap-2.5 lg:hidden">

                    {/* Current tab */}

                    <span className="min-w-0 max-w-[72px] truncate text-right text-[8px] uppercase tracking-[0.14em] text-zinc-500 xs:max-w-[96px] sm:max-w-[140px] sm:text-[9px] sm:tracking-[0.16em]">
                        {pageTitle}
                    </span>

                    {/* Avatar */}

                    <ProfileAvatar
                        profile={profile}
                        size={32}
                    />

                    {/* Menu */}

                    <button
                        type="button"
                        onClick={() =>
                            setMobileMenuOpen(
                                (open) => !open,
                            )
                        }
                        className={`relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border transition duration-300 ${mobileMenuOpen
                            ? 'border-white/[0.22] bg-white/[0.08] text-white'
                            : 'border-white/[0.10] bg-white/[0.035] text-zinc-400 hover:border-white/[0.18] hover:text-white'
                            }`}
                        aria-label={
                            mobileMenuOpen
                                ? 'Close navigation'
                                : 'Open navigation'
                        }
                        aria-expanded={mobileMenuOpen}
                    >
                        <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(53,223,255,0.06),rgba(139,108,255,0.05),rgba(240,90,191,0.04))]" />

                        <span className="relative">
                            {mobileMenuOpen ? (
                                <CloseIcon />
                            ) : (
                                <MenuIcon />
                            )}
                        </span>
                    </button>
                </div>
            </div>

            {/* =============================================================
                MOBILE / TABLET NAVIGATION
            ============================================================= */}

            <div
                className={`overflow-hidden transition-all duration-300 ease-out lg:hidden ${mobileMenuOpen
                    ? 'max-h-[750px] opacity-100'
                    : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="max-h-[calc(100dvh-64px)] overflow-y-auto border-t border-white/[0.06] bg-[#070809]/98 px-3 pb-5 pt-3 backdrop-blur-2xl sm:max-h-[calc(100dvh-68px)] sm:px-5 sm:pt-4">

                    {/* =====================================================
                        USER IDENTITY
                    ====================================================== */}

                    <div className="mb-4 flex items-center justify-between rounded-2xl border border-white/[0.07] bg-white/[0.025] px-4 py-3">

                        <div className="min-w-0">
                            <p className="truncate text-xs text-zinc-200">
                                {profile?.display_name ??
                                    auth.user.name}
                            </p>

                            {profile ? (
                                <p className="mt-1 truncate text-[9px] text-zinc-600">
                                    @{profile.username}
                                </p>
                            ) : (
                                <p className="mt-1 text-[9px] text-zinc-600">
                                    Artist profile not created
                                </p>
                            )}
                        </div>

                        <span className="ml-4 shrink-0 text-[8px] uppercase tracking-[0.2em] text-zinc-700">
                            {isVerified
                                ? 'Verified'
                                : 'Profile Setup'}
                        </span>
                    </div>

                    {/* =====================================================
                        STUDIO LABEL
                    ====================================================== */}

                    <div className="mb-2 flex items-center gap-3 px-2">
                        <span className="h-px w-5 bg-[linear-gradient(90deg,#ffffff,#7d8991,transparent)]" />

                        <span className="text-[8px] uppercase tracking-[0.3em] text-zinc-700">
                            Studio
                        </span>
                    </div>

                    {/* =====================================================
                        NAVIGATION
                    ====================================================== */}

                    <nav className="space-y-1">

                        {/* =================================================
                            OVERVIEW
                        ================================================== */}

                        <Link
                            href="/dashboard"
                            onClick={closeMobileMenu}
                            className={`flex min-h-[48px] items-center justify-between rounded-xl border px-4 transition duration-200 ${isOverviewActive
                                ? 'border-white/[0.10] bg-white/[0.055] text-white'
                                : 'border-transparent text-zinc-500 hover:bg-white/[0.035] hover:text-zinc-200'
                                }`}
                        >
                            <span className="text-sm">
                                Overview
                            </span>

                            {isOverviewActive && (
                                <ActiveIndicator />
                            )}
                        </Link>

                        {/* =================================================
                            PROFILE
                        ================================================== */}

                        <Link
                            href={
                                profile
                                    ? '/dashboard/profile'
                                    : '/dashboard/profile/create'
                            }
                            onClick={closeMobileMenu}
                            className={`flex min-h-[48px] items-center justify-between rounded-xl border px-4 transition duration-200 ${isProfileActive
                                ? 'border-white/[0.10] bg-white/[0.055] text-white'
                                : 'border-transparent text-zinc-500 hover:bg-white/[0.035] hover:text-zinc-200'
                                }`}
                        >
                            <span className="text-sm">
                                Profile
                            </span>

                            {isProfileActive && (
                                <ActiveIndicator />
                            )}
                        </Link>

                        {/* =================================================
                            VERIFIED MODULES
                        ================================================== */}

                        {isVerified ? (
                            <>
                                {/* Projects */}

                                <Link
                                    href="/dashboard/projects"
                                    onClick={closeMobileMenu}
                                    className={`flex min-h-[48px] items-center justify-between rounded-xl border px-4 transition duration-200 ${isProjectsActive
                                        ? 'border-white/[0.10] bg-white/[0.055] text-white'
                                        : 'border-transparent text-zinc-500 hover:bg-white/[0.035] hover:text-zinc-200'
                                        }`}
                                >
                                    <span className="text-sm">
                                        Projects
                                    </span>

                                    {isProjectsActive ? (
                                        <ActiveIndicator />
                                    ) : (
                                        <ArrowIcon />
                                    )}
                                </Link>

                                {/* Music */}

                                <Link
                                    href="/dashboard/releases"
                                    onClick={closeMobileMenu}
                                    className={`flex min-h-[48px] items-center justify-between rounded-xl border px-4 transition duration-200 ${isReleasesActive
                                        ? 'border-white/[0.10] bg-white/[0.055] text-white'
                                        : 'border-transparent text-zinc-500 hover:bg-white/[0.035] hover:text-zinc-200'
                                        }`}
                                >
                                    <span className="text-sm">
                                        Music
                                    </span>

                                    {isReleasesActive ? (
                                        <ActiveIndicator />
                                    ) : (
                                        <ArrowIcon />
                                    )}
                                </Link>

                                {/* Portfolio */}

                                <Link
                                    href="/dashboard/portfolio/settings"
                                    onClick={closeMobileMenu}
                                    className={`flex min-h-[48px] items-center justify-between rounded-xl border px-4 transition duration-200 ${isPortfolioActive
                                        ? 'border-white/[0.10] bg-white/[0.055] text-white'
                                        : 'border-transparent text-zinc-500 hover:bg-white/[0.035] hover:text-zinc-200'
                                        }`}
                                >
                                    <span className="text-sm">
                                        Portfolio
                                    </span>

                                    {isPortfolioActive ? (
                                        <ActiveIndicator />
                                    ) : (
                                        <ArrowIcon />
                                    )}
                                </Link>
                            </>
                        ) : (
                            <>
                                {/* Projects Locked */}

                                <div className="flex min-h-[48px] cursor-not-allowed items-center justify-between rounded-xl px-4 text-zinc-700">
                                    <span className="text-sm">
                                        Projects
                                    </span>

                                    <span className="flex items-center gap-1.5 text-[8px] uppercase tracking-[0.15em]">
                                        <LockIcon />
                                        Locked
                                    </span>
                                </div>

                                {/* Music Locked */}

                                <div className="flex min-h-[48px] cursor-not-allowed items-center justify-between rounded-xl px-4 text-zinc-700">
                                    <span className="text-sm">
                                        Music
                                    </span>

                                    <span className="flex items-center gap-1.5 text-[8px] uppercase tracking-[0.15em]">
                                        <LockIcon />
                                        Locked
                                    </span>
                                </div>

                                {/* Portfolio Locked */}

                                <div className="flex min-h-[48px] cursor-not-allowed items-center justify-between rounded-xl px-4 text-zinc-700">
                                    <span className="text-sm">
                                        Portfolio
                                    </span>

                                    <span className="flex items-center gap-1.5 text-[8px] uppercase tracking-[0.15em]">
                                        <LockIcon />
                                        Locked
                                    </span>
                                </div>
                            </>
                        )}
                    </nav>

                    {/* =====================================================
                        ACCOUNT
                    ====================================================== */}

                    <div className="my-4 h-px bg-white/[0.06]" />

                    <div className="mb-2 flex items-center gap-3 px-2">
                        <span className="h-px w-5 bg-[linear-gradient(90deg,#ffffff,#7d8991,transparent)]" />

                        <span className="text-[8px] uppercase tracking-[0.3em] text-zinc-700">
                            Account
                        </span>
                    </div>

                    {/* Settings */}

                    <div className="flex min-h-[48px] items-center justify-between rounded-xl px-4 text-zinc-700">
                        <span className="text-sm">
                            Settings
                        </span>

                        <span className="text-[8px] uppercase tracking-[0.15em] text-zinc-800">
                            Soon
                        </span>
                    </div>

                    {/* =====================================================
                        LOGOUT
                    ====================================================== */}

                    <div className="mt-2 border-t border-white/[0.06] pt-3">
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            onClick={closeMobileMenu}
                            className="flex min-h-[48px] w-full items-center justify-between rounded-xl px-4 text-zinc-500 transition duration-200 hover:bg-white/[0.035] hover:text-white"
                        >
                            <span className="text-sm">
                                Sign Out
                            </span>

                            <LogoutIcon />
                        </Link>
                    </div>

                    {/* =====================================================
                        BRAND
                    ====================================================== */}

                    <div className="mt-4 flex items-center justify-between px-4 pt-2">
                        <img
                            src="/images/brand/Lira_logo.png"
                            alt="LIRA"
                            className="w-[55px] opacity-35"
                        />

                        <p className="text-[8px] text-zinc-800">
                            Your art. Your identity. Your space.
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
}
