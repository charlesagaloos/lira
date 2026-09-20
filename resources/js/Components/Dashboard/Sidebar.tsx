import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

import {
    ArrowLeft,
    ArrowRight,
    LockIcon,
} from '../../Components/Icons';

interface Profile {
    username: string;
    display_name: string;
    verification_status: string;
}

interface PageProps {
    profile: Profile | null;
}

/*
|--------------------------------------------------------------------------
| NAV ICONS
|--------------------------------------------------------------------------
*/

function OverviewIcon() {
    return (
        <svg
            viewBox="0 0 20 20"
            fill="none"
            className="h-4 w-4"
            aria-hidden="true"
        >
            <rect
                x="3.5"
                y="3.5"
                width="5"
                height="5"
                rx="1"
                stroke="currentColor"
                strokeWidth="1.2"
            />

            <rect
                x="11.5"
                y="3.5"
                width="5"
                height="5"
                rx="1"
                stroke="currentColor"
                strokeWidth="1.2"
            />

            <rect
                x="3.5"
                y="11.5"
                width="5"
                height="5"
                rx="1"
                stroke="currentColor"
                strokeWidth="1.2"
            />

            <rect
                x="11.5"
                y="11.5"
                width="5"
                height="5"
                rx="1"
                stroke="currentColor"
                strokeWidth="1.2"
            />
        </svg>
    );
}

function ProfileIcon() {
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
                strokeWidth="1.2"
            />

            <path
                d="M4.5 16C5.4 13.5 7.2 12.25 10 12.25C12.8 12.25 14.6 13.5 15.5 16"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
            />
        </svg>
    );
}

function ProjectsIcon() {
    return (
        <svg
            viewBox="0 0 20 20"
            fill="none"
            className="h-4 w-4"
            aria-hidden="true"
        >
            <path
                d="M3.5 6.5H8L9.5 8H16.5V15.5C16.5 16.05 16.05 16.5 15.5 16.5H4.5C3.95 16.5 3.5 16.05 3.5 15.5V6.5Z"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinejoin="round"
            />

            <path
                d="M3.5 6.5V4.5C3.5 3.95 3.95 3.5 4.5 3.5H7.5L9 5.5H15.5C16.05 5.5 16.5 5.95 16.5 6.5V8"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function PortfolioIcon() {
    return (
        <svg
            viewBox="0 0 20 20"
            fill="none"
            className="h-4 w-4"
            aria-hidden="true"
        >
            <rect
                x="3.5"
                y="4.5"
                width="13"
                height="11"
                rx="1.5"
                stroke="currentColor"
                strokeWidth="1.2"
            />

            <path
                d="M7 4.5V3.75C7 3.06 7.56 2.5 8.25 2.5H11.75C12.44 2.5 13 3.06 13 3.75V4.5"
                stroke="currentColor"
                strokeWidth="1.2"
            />

            <path
                d="M3.5 8.5H16.5"
                stroke="currentColor"
                strokeWidth="1.2"
            />
        </svg>
    );
}

function SettingsIcon() {
    return (
        <svg
            viewBox="0 0 20 20"
            fill="none"
            className="h-4 w-4"
            aria-hidden="true"
        >
            <circle
                cx="10"
                cy="10"
                r="2.5"
                stroke="currentColor"
                strokeWidth="1.2"
            />

            <path
                d="M10 2.75V4.25M10 15.75V17.25M17.25 10H15.75M4.25 10H2.75M15.13 4.87L14.07 5.93M5.93 14.07L4.87 15.13M15.13 15.13L14.07 14.07M5.93 5.93L4.87 4.87"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
            />
        </svg>
    );
}

/*
|--------------------------------------------------------------------------
| ACTIVE INDICATOR
|--------------------------------------------------------------------------
*/

function ActiveIndicator() {
    return (
        <span
            className="relative flex h-2 w-2 shrink-0 items-center justify-center"
            aria-hidden="true"
        >
            <span className="absolute h-1 w-1 rounded-full bg-[#7de7ff] shadow-[0_0_8px_rgba(125,231,255,0.9),0_0_16px_rgba(125,231,255,0.35)]" />

            <span className="absolute h-2.5 w-px bg-[linear-gradient(to_bottom,transparent,#7de7ff,transparent)] opacity-80" />

            <span className="absolute h-px w-2.5 bg-[linear-gradient(to_right,transparent,#7de7ff,transparent)] opacity-80" />
        </span>
    );
}

function CollapsedActiveIndicator() {
    return (
        <span
            className="pointer-events-none absolute right-1.5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rotate-45 rounded-[1px] bg-[#7de7ff] shadow-[0_0_8px_rgba(125,231,255,0.95),0_0_16px_rgba(125,231,255,0.45)]"
            aria-hidden="true"
        />
    );
}

/*
|--------------------------------------------------------------------------
| SIDEBAR
|--------------------------------------------------------------------------
*/

export default function Sidebar() {
    const { profile } = usePage().props as unknown as PageProps;
    const { url } = usePage();

    const [collapsed, setCollapsed] = useState(() => {
        if (typeof window === 'undefined') {
            return false;
        }

        return localStorage.getItem('lira-sidebar-collapsed') === 'true';
    });

    function toggleSidebar() {
        setCollapsed((current) => {
            const next = !current;

            localStorage.setItem(
                'lira-sidebar-collapsed',
                String(next),
            );

            return next;
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Verification
    |--------------------------------------------------------------------------
    */

    const isVerified =
        profile?.verification_status?.toLowerCase() === 'verified';

    /*
    |--------------------------------------------------------------------------
    | Active State
    |--------------------------------------------------------------------------
    */

    const isOverviewActive =
        url === '/dashboard' || url === '/dashboard/';

    const isProfileActive =
        url === '/dashboard/profile' ||
        url === '/dashboard/profile/' ||
        url.startsWith('/dashboard/profile/create') ||
        url.startsWith('/dashboard/profile/edit');

    const isProjectsActive =
        url === '/dashboard/projects' ||
        url.startsWith('/dashboard/projects/');

    const isPortfolioActive =
        url === '/dashboard/portfolio' ||
        url.startsWith('/dashboard/portfolio/');

    return (
        <aside
            className={`fixed left-0 top-0 z-50 hidden h-screen shrink-0 flex-col overflow-hidden border-r border-white/[0.07] bg-[#070809]/95 backdrop-blur-2xl transition-[width] duration-300 lg:flex ${collapsed ? 'w-[76px]' : 'w-[250px]'
                }`}
        >
            {/* =============================================================
                LOGO
            ============================================================= */}

            <div
                className={`flex h-[76px] shrink-0 items-center border-b border-white/[0.07] transition-all duration-300 ${collapsed ? 'justify-center px-0' : 'px-8'
                    }`}
            >
                <Link
                    href="/"
                    aria-label="LIRA home"
                    className="group"
                >
                    <img
                        src="/images/brand/Lira_logo.png"
                        alt="LIRA"
                        className={`h-auto object-contain opacity-95 transition-all duration-300 group-hover:brightness-125 ${collapsed ? 'w-[38px]' : 'w-[112px]'
                            }`}
                    />
                </Link>
            </div>

            {/* =============================================================
                NAVIGATION
            ============================================================= */}

            <div
                className={`flex min-h-0 flex-1 flex-col px-3 py-8 ${collapsed ? 'overflow-hidden' : 'overflow-y-auto'
                    }`}
            >
                {/* =========================================================
                    STUDIO
                ========================================================== */}

                {!collapsed && (
                    <p className="px-4 text-[8px] uppercase tracking-[0.3em] text-zinc-700">
                        Studio
                    </p>
                )}

                <nav className="mt-4 space-y-1">
                    {/* =====================================================
                        OVERVIEW
                    ====================================================== */}

                    <Link
                        href="/dashboard"
                        title={collapsed ? 'Overview' : undefined}
                        className={`group relative flex items-center rounded-xl px-3 py-3 text-sm transition duration-200 ${collapsed
                            ? 'justify-center'
                            : 'justify-between px-4'
                            } ${isOverviewActive
                                ? 'border border-white/[0.08] bg-white/[0.045] text-white'
                                : 'border border-transparent text-zinc-500 hover:bg-white/[0.025] hover:text-zinc-200'
                            }`}
                    >
                        <span className="flex items-center gap-3">
                            <OverviewIcon />

                            {!collapsed && <span>Overview</span>}
                        </span>

                        {!collapsed && isOverviewActive && (
                            <ActiveIndicator />
                        )}

                        {collapsed && isOverviewActive && (
                            <CollapsedActiveIndicator />
                        )}
                    </Link>

                    {/* =====================================================
                        PROFILE
                    ====================================================== */}

                    <Link
                        href={
                            profile
                                ? '/dashboard/profile'
                                : '/dashboard/profile/create'
                        }
                        title={collapsed ? 'Profile' : undefined}
                        className={`group relative flex items-center rounded-xl px-3 py-3 text-sm transition duration-200 ${collapsed
                            ? 'justify-center'
                            : 'justify-between px-4'
                            } ${isProfileActive
                                ? 'border border-white/[0.08] bg-white/[0.045] text-white'
                                : 'border border-transparent text-zinc-500 hover:bg-white/[0.025] hover:text-zinc-200'
                            }`}
                    >
                        <span className="flex items-center gap-3">
                            <ProfileIcon />

                            {!collapsed && <span>Profile</span>}
                        </span>

                        {!collapsed && isProfileActive && (
                            <ActiveIndicator />
                        )}

                        {!collapsed && !profile && (
                            <span className="text-[8px] uppercase tracking-[0.15em] text-zinc-700">
                                Setup
                            </span>
                        )}

                        {collapsed && isProfileActive && (
                            <CollapsedActiveIndicator />
                        )}
                    </Link>

                    {/* =====================================================
                        VERIFIED MODULES
                    ====================================================== */}

                    {isVerified ? (
                        <>
                            {/* Projects */}

                            <Link
                                href="/dashboard/projects"
                                title={collapsed ? 'Projects' : undefined}
                                className={`group relative flex items-center rounded-xl px-3 py-3 text-sm transition duration-200 ${collapsed
                                    ? 'justify-center'
                                    : 'justify-between px-4'
                                    } ${isProjectsActive
                                        ? 'border border-white/[0.08] bg-white/[0.045] text-white'
                                        : 'border border-transparent text-zinc-500 hover:bg-white/[0.025] hover:text-zinc-200'
                                    }`}
                            >
                                <span className="flex items-center gap-3">
                                    <ProjectsIcon />

                                    {!collapsed && <span>Projects</span>}
                                </span>

                                {!collapsed && isProjectsActive && (
                                    <ActiveIndicator />
                                )}

                                {collapsed && isProjectsActive && (
                                    <CollapsedActiveIndicator />
                                )}
                            </Link>

                            {/* Portfolio */}

                            <Link
                                href="/dashboard/portfolio/settings"
                                title={collapsed ? 'Portfolio' : undefined}
                                className={`group relative flex items-center rounded-xl px-3 py-3 text-sm transition duration-200 ${collapsed
                                    ? 'justify-center'
                                    : 'justify-between px-4'
                                    } ${isPortfolioActive
                                        ? 'border border-white/[0.08] bg-white/[0.045] text-white'
                                        : 'border border-transparent text-zinc-500 hover:bg-white/[0.025] hover:text-zinc-200'
                                    }`}
                            >
                                <span className="flex items-center gap-3">
                                    <PortfolioIcon />

                                    {!collapsed && <span>Portfolio</span>}
                                </span>

                                {!collapsed && isPortfolioActive && (
                                    <ActiveIndicator />
                                )}

                                {collapsed && isPortfolioActive && (
                                    <CollapsedActiveIndicator />
                                )}
                            </Link>
                        </>
                    ) : (
                        <>
                            {/* =================================================
                                PROJECTS LOCKED
                            ================================================= */}

                            <div
                                title={collapsed ? 'Projects — Locked' : undefined}
                                className={`flex cursor-not-allowed items-center rounded-xl px-3 py-3 text-sm text-zinc-700 ${collapsed
                                    ? 'justify-center'
                                    : 'justify-between px-4'
                                    }`}
                            >
                                <span className="flex items-center gap-3">
                                    <ProjectsIcon />

                                    {!collapsed && <span>Projects</span>}
                                </span>

                                {!collapsed && (
                                    <span className="flex items-center gap-1.5 text-[8px] uppercase tracking-[0.15em]">
                                        <LockIcon />
                                        Locked
                                    </span>
                                )}
                            </div>

                            {/* =================================================
                                PORTFOLIO LOCKED
                            ================================================= */}

                            <div
                                title={collapsed ? 'Portfolio — Locked' : undefined}
                                className={`flex cursor-not-allowed items-center rounded-xl px-3 py-3 text-sm text-zinc-700 ${collapsed
                                    ? 'justify-center'
                                    : 'justify-between px-4'
                                    }`}
                            >
                                <span className="flex items-center gap-3">
                                    <PortfolioIcon />

                                    {!collapsed && <span>Portfolio</span>}
                                </span>

                                {!collapsed && (
                                    <span className="flex items-center gap-1.5 text-[8px] uppercase tracking-[0.15em]">
                                        <LockIcon />
                                        Locked
                                    </span>
                                )}
                            </div>
                        </>
                    )}
                </nav>

                {/* =========================================================
                    DIVIDER
                ========================================================== */}

                <div className="my-8 h-px shrink-0 bg-white/[0.06]" />

                {/* =========================================================
                    ACCOUNT
                ========================================================== */}

                {!collapsed && (
                    <p className="px-4 text-[8px] uppercase tracking-[0.3em] text-zinc-700">
                        Account
                    </p>
                )}

                <nav className="mt-4">
                    <div
                        title={collapsed ? 'Settings — Soon' : undefined}
                        className={`flex cursor-not-allowed items-center rounded-xl px-3 py-3 text-sm text-zinc-700 ${collapsed
                            ? 'justify-center'
                            : 'justify-between px-4'
                            }`}
                    >
                        <span className="flex items-center gap-3">
                            <SettingsIcon />

                            {!collapsed && <span>Settings</span>}
                        </span>

                        {!collapsed && (
                            <span className="text-[8px] uppercase tracking-[0.15em] text-zinc-800">
                                Soon
                            </span>
                        )}
                    </div>
                </nav>
            </div>

            {/* =============================================================
                BRAND FOOTER
            ============================================================= */}

            {!collapsed && (
                <div className="shrink-0 border-t border-white/[0.07] p-6">
                    <img
                        src="/images/brand/Lira_logo.png"
                        alt="LIRA"
                        className="h-auto w-[72px] opacity-50"
                    />

                    <p className="mt-3 text-[10px] leading-5 text-zinc-700">
                        Your art. Your identity. Your space.
                    </p>
                </div>
            )}

            {/* =============================================================
                COLLAPSE BUTTON
            ============================================================= */}

            <div
                className={`absolute bottom-5 ${collapsed ? 'left-1/2 -translate-x-1/2' : 'right-4'
                    }`}
            >
                <button
                    type="button"
                    onClick={toggleSidebar}
                    aria-label={
                        collapsed
                            ? 'Expand sidebar'
                            : 'Collapse sidebar'
                    }
                    title={
                        collapsed
                            ? 'Expand sidebar'
                            : 'Collapse sidebar'
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.025] text-zinc-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition duration-300 hover:border-white/[0.16] hover:bg-white/[0.05] hover:text-white"
                >
                    {collapsed ? <ArrowRight /> : <ArrowLeft />}
                </button>
            </div>
        </aside>
    );
}
