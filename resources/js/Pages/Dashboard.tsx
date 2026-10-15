import { Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import DashboardLayout from '../Components/Dashboard/d_layout';

import {
    ArrowRight,
    ArrowUpRight,
    CheckIcon,
    GlobeIcon,
    LockIcon,
    PlusIcon,
    UserIcon,
    FolderIcon,
} from '../Components/Icons';

interface Profile {
    id: number;
    username: string;
    display_name: string;
    bio: string | null;
    artist_type: string | null;
    location: string | null;
    avatar: string | null;
    avatar_zoom: number;
    avatar_position_x: number;
    avatar_position_y: number;
    verification_status: string;
    rejection_reason: string | null;
    is_published: boolean;
    portfolio_views_count: number;
}

interface Project {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    project_type: string | null;
    thumbnail: string | null;
    is_visible: boolean;
}

interface Onboarding {
    profile_complete: boolean;
    has_avatar: boolean;
    has_showcased_work: boolean;
    portfolio_customized: boolean;
    portfolio_published: boolean;
    verification_status: string;
}

interface Analytics {
    daily_views: Array<{
        date: string;
        views: number;
    }>;
    top_projects: Array<{
        id: number;
        title: string;
        slug: string;
        views: number;
    }>;
}

interface Props {
    profile: Profile | null;
    projects: Project[];
    projectCount: number;
    onboarding: Onboarding | null;
    analytics: Analytics | null;
}

function ChromeButton({
    href,
    children,
}: {
    href: string;
    children: ReactNode;
}) {
    return (
        <Link
            href={href}
            className="group relative inline-flex h-11 items-center justify-center gap-3 overflow-hidden rounded-full border border-white/40 bg-[linear-gradient(105deg,#32ddff_0%,#6677ff_20%,#a955ff_38%,#f05abd_51%,#ff8ed3_63%,#7b63ff_78%,#34dcff_94%)] px-6 text-xs font-medium text-[#08090b] shadow-[0_8px_35px_rgba(90,150,255,0.16)] transition duration-300 hover:scale-[1.02] hover:shadow-[0_12px_45px_rgba(190,80,255,0.22)]"
        >
            <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_20%,rgba(255,255,255,0.5)_48%,transparent_72%)] opacity-0 transition duration-700 group-hover:translate-x-[25%] group-hover:opacity-100" />

            <span className="relative">{children}</span>

            <span className="relative">
                <ArrowUpRight />
            </span>
        </Link>
    );
}

function GlassPanel({
    children,
    className = '',
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <div
            className={`relative overflow-hidden rounded-[1.5rem] border border-white/[0.09] bg-white/[0.018] backdrop-blur-xl ${className}`}
        >
            {/* Chrome edge */}
            <div className="pointer-events-none absolute inset-0 rounded-[1.5rem] border border-white/[0.025]" />

            {/* Subtle glass reflection */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)]" />

            <div className="relative">{children}</div>
        </div>
    );
}


function OnboardingChecklist({
    onboarding,
    isVerified,
    isRejected,
    profileId,
}: {
    onboarding: Onboarding;
    isVerified: boolean;
    isRejected: boolean;
    profileId: number;
}) {
    const tasks = [
        {
            title: 'Complete your artist profile',
            description: 'Add your artist name, bio, and creative identity.',
            complete: onboarding.profile_complete,
            href: '/dashboard/profile/edit',
            available: true,
        },
        {
            title: 'Upload a profile picture',
            description: 'Give your artist profile a recognizable face.',
            complete: onboarding.has_avatar,
            href: '/dashboard/profile/edit',
            available: true,
        },
        {
            title: 'Showcase your first work',
            description: 'Add a creative project or a music release.',
            complete: onboarding.has_showcased_work,
            href: '/dashboard/projects/create',
            available: isVerified,
        },
        {
            title: 'Customize your portfolio',
            description: 'Personalize the design and content of your space.',
            complete: onboarding.portfolio_customized,
            href: '/dashboard/portfolio/settings',
            available: isVerified,
        },
        {
            title: 'Publish your portfolio',
            description: 'Make your creative space accessible to visitors.',
            complete: onboarding.portfolio_published,
            href: '/dashboard/portfolio/settings',
            available: isVerified,
        },
    ];

    const completedCount = tasks.filter((task) => task.complete).length;
    const progress = Math.round((completedCount / tasks.length) * 100);
    const [isChecklistHidden, setIsChecklistHidden] = useState(false);
    const dismissalKey = `lira:onboarding-dismissed:${profileId}`;

    useEffect(() => {
        if (progress < 100) {
            setIsChecklistHidden(false);

            try {
                window.localStorage.removeItem(dismissalKey);
            } catch (error) {
                console.error('Unable to clear onboarding dismissal preference.', error);
            }

            return;
        }

        try {
            setIsChecklistHidden(
                window.localStorage.getItem(dismissalKey) === 'true',
            );
        } catch (error) {
            console.error('Unable to load onboarding dismissal preference.', error);
            setIsChecklistHidden(false);
        }
    }, [dismissalKey, progress]);

    const dismissChecklist = () => {
        setIsChecklistHidden(true);

        try {
            window.localStorage.setItem(dismissalKey, 'true');
        } catch (error) {
            console.error('Unable to save onboarding dismissal preference.', error);
        }
    };

    const showChecklist = () => {
        setIsChecklistHidden(false);

        try {
            window.localStorage.removeItem(dismissalKey);
        } catch (error) {
            console.error('Unable to clear onboarding dismissal preference.', error);
        }
    };

    if (progress >= 100 && isChecklistHidden) {
        return (
            <GlassPanel className="mt-6">
                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-medium text-emerald-200">
                            Onboarding complete
                        </p>

                        <p className="mt-1 text-xs text-zinc-500">
                            Your creative space is fully set up and ready to go.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={showChecklist}
                        className="self-start rounded-full border border-white/10 px-4 py-2 text-xs text-zinc-300 transition hover:border-white/20 hover:text-white sm:self-auto"
                    >
                        Show checklist
                    </button>
                </div>
            </GlassPanel>
        );
    }

    return (
        <GlassPanel className="mt-6">
            <div className="p-6 sm:p-8">
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                    <div>
                        <p className="text-[9px] uppercase tracking-[0.3em] text-zinc-600">
                            Getting Started
                        </p>

                        <h2 className="mt-3 text-2xl font-light tracking-[-0.04em] text-white">
                            Build your creative space.
                        </h2>

                        <p className="mt-2 max-w-xl text-xs leading-5 text-zinc-500">
                            Follow these steps to bring your artist portfolio
                            to life. You can work through them at your own pace.
                        </p>
                    </div>

                    <div className="sm:text-right">
                        <p className="text-sm text-white">
                            {completedCount} of {tasks.length} completed
                        </p>

                        <p className="mt-1 text-[10px] text-zinc-600">
                            {progress}% complete
                        </p>
                    </div>
                </div>

                <div
                    className="mt-5 h-1 overflow-hidden rounded-full bg-white/[0.06]"
                    role="progressbar"
                    aria-label="Portfolio setup progress"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={progress}
                >
                    <div
                        className="h-full rounded-full bg-[linear-gradient(90deg,#35dfff,#a855f7,#f08bd7)] transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {progress >= 100 && (
                    <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 shadow-[0_0_25px_rgba(16,185,129,0.1)]">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div className="flex items-start gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-emerald-300/30 bg-emerald-400/10 text-emerald-200">
                                    <svg
                                        aria-hidden="true"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        className="h-5 w-5"
                                    >
                                        <path
                                            d="M12 3.5 13.8 9l5.7 1.8-5.7 1.8L12 18l-1.8-5.4L4.5 10.8 10.2 9 12 3.5Z"
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="1.5"
                                        />
                                        <path
                                            d="m19 15 .9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15Z"
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="1.5"
                                        />
                                    </svg>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-emerald-200">
                                        Congratulations! You completed onboarding.
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-emerald-100/80">
                                        Your creative space is fully set up and ready to go.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={dismissChecklist}
                                className="self-start rounded-full border border-emerald-200/20 px-4 py-2 text-xs font-medium text-emerald-100 transition hover:border-emerald-200/40 hover:bg-emerald-200/[0.06] sm:self-center"
                            >
                                Got it
                            </button>
                        </div>
                    </div>
                )}

                <div className="mt-6 divide-y divide-white/[0.06]">
                    {tasks.map((task, index) => {
                        const locked = !task.complete && !task.available;

                        return (
                            <div
                                key={task.title}
                                className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                            >
                                <div
                                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${task.complete
                                        ? 'border-[#35dfff]/25 bg-[#35dfff]/[0.08] text-[#72e9ff]'
                                        : locked
                                            ? 'border-white/[0.06] text-zinc-700'
                                            : 'border-white/[0.12] text-zinc-400'
                                        }`}
                                >
                                    {task.complete ? (
                                        <CheckIcon />
                                    ) : locked ? (
                                        <LockIcon />
                                    ) : (
                                        <span className="text-xs">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                    )}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p
                                        className={`text-sm ${task.complete
                                            ? 'text-zinc-400'
                                            : 'text-white'
                                            }`}
                                    >
                                        {task.title}
                                    </p>

                                    <p className="mt-1 text-[10px] leading-5 text-zinc-600">
                                        {locked
                                            ? isRejected
                                                ? 'Available after your profile is approved again.'
                                                : 'Available after artist verification.'
                                            : task.description}
                                    </p>
                                </div>

                                {!task.complete && task.available && (
                                    <Link
                                        href={task.href}
                                        className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/[0.09] px-3 py-2 text-[10px] text-zinc-400 transition hover:border-white/20 hover:text-white"
                                    >
                                        Start
                                        <ArrowRight className="h-3 w-3" />
                                    </Link>
                                )}

                                {task.complete && (
                                    <span className="shrink-0 text-[9px] uppercase tracking-[0.15em] text-[#72e9ff]/70">
                                        Done
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </GlassPanel>
    );
}

function ArtistInsights({
    username,
    analytics,
}: {
    username: string;
    analytics: Analytics;
}) {
    const [period, setPeriod] = useState<7 | 30>(7);
    const [copyStatus, setCopyStatus] = useState<'copied' | 'failed' | null>(
        null,
    );

    const currentDays = analytics.daily_views.slice(-period);
    const previousDays = analytics.daily_views.slice(-period * 2, -period);
    const currentViews = currentDays.reduce((total, day) => total + day.views, 0);
    const previousViews = previousDays.reduce((total, day) => total + day.views, 0);
    const highestDailyViews = Math.max(
        1,
        ...currentDays.map((day) => day.views),
    );
    const changePercent =
        previousViews > 0
            ? Math.round(((currentViews - previousViews) / previousViews) * 100)
            : null;
    const portfolioUrl = `${window.location.origin}/@${username}`;

    const copyWithFallback = (text: string): boolean => {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.setAttribute('readonly', '');
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();

        try {
            return document.execCommand('copy');
        } finally {
            textArea.remove();
        }
    };

    const copyPortfolioLink = async () => {
        try {
            if (navigator.clipboard?.writeText) {
                try {
                    await navigator.clipboard.writeText(portfolioUrl);
                    setCopyStatus('copied');
                    return;
                } catch (error) {
                    console.warn(
                        'Clipboard API failed; trying the browser fallback.',
                        error,
                    );
                }
            }

            if (!copyWithFallback(portfolioUrl)) {
                throw new Error('The browser could not copy the portfolio link.');
            }

            setCopyStatus('copied');
        } catch (error) {
            console.error('Unable to copy portfolio link.', error);
            setCopyStatus('failed');
        }
    };

    return (
        <section className="mt-14" aria-labelledby="artist-insights-heading">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div>
                    <p className="text-[9px] uppercase tracking-[0.3em] text-zinc-600">
                        Audience
                    </p>

                    <h2
                        id="artist-insights-heading"
                        className="mt-2 text-2xl font-light tracking-[-0.04em] text-white"
                    >
                        Portfolio insights
                    </h2>

                    <p className="mt-2 text-xs text-zinc-500">
                        See how visitors are discovering your creative work.
                    </p>
                </div>

                <div className="flex flex-col items-start gap-2 sm:items-end">
                    <button
                        type="button"
                        onClick={copyPortfolioLink}
                        className="inline-flex h-10 items-center gap-2 rounded-full border border-white/[0.10] bg-white/[0.025] px-4 text-xs font-medium text-zinc-300 transition hover:border-white/[0.18] hover:bg-white/[0.06] hover:text-white"
                    >
                        {copyStatus === 'copied'
                            ? 'Link copied'
                            : 'Copy portfolio link'}
                        <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>

                    {copyStatus === 'failed' && (
                        <div
                            role="status"
                            className="max-w-sm text-[10px] text-rose-300 sm:text-right"
                        >
                            <p>
                                Automatic copy isn't available here. Select and
                                copy this link:
                            </p>
                            <p className="mt-1 select-all break-all text-zinc-400">
                                {portfolioUrl}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.8fr)]">
                <GlassPanel>
                    <div className="p-6 sm:p-8">
                        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                            <div>
                                <p className="text-[9px] uppercase tracking-[0.25em] text-zinc-600">
                                    Portfolio visits
                                </p>

                                <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-2">
                                    <span className="text-4xl font-light tracking-[-0.05em] text-white">
                                        {currentViews.toLocaleString()}
                                    </span>

                                    <span
                                        className={`text-xs ${
                                            changePercent === null
                                                ? 'text-zinc-500'
                                                : changePercent >= 0
                                                  ? 'text-emerald-300'
                                                  : 'text-rose-300'
                                        }`}
                                    >
                                        {changePercent === null
                                            ? currentViews > 0
                                                ? 'New activity'
                                                : 'No views yet'
                                            : `${changePercent > 0 ? '+' : ''}${changePercent}%`}
                                        {changePercent !== null && (
                                            <span className="ml-1 text-zinc-600">
                                                vs previous {period} days
                                            </span>
                                        )}
                                    </span>
                                </div>
                            </div>

                            <div
                                className="inline-flex rounded-full border border-white/[0.08] bg-black/20 p-1"
                                aria-label="Select analytics period"
                            >
                                {([7, 30] as const).map((days) => (
                                    <button
                                        key={days}
                                        type="button"
                                        onClick={() => setPeriod(days)}
                                        aria-pressed={period === days}
                                        className={`rounded-full px-3 py-1.5 text-[10px] transition ${
                                            period === days
                                                ? 'bg-white/[0.10] text-white'
                                                : 'text-zinc-500 hover:text-zinc-300'
                                        }`}
                                    >
                                        {days} days
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div
                            className="mt-8 flex h-40 items-end gap-1.5 sm:gap-2"
                            role="img"
                            aria-label={`Portfolio visits over the last ${period} days`}
                        >
                            {currentDays.map((day) => (
                                <div
                                    key={day.date}
                                    className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"
                                    title={`${day.date}: ${day.views} ${
                                        day.views === 1 ? 'visit' : 'visits'
                                    }`}
                                >
                                    <div className="flex h-full w-full items-end">
                                        <div
                                            className={`w-full rounded-t-sm ${
                                                day.views > 0
                                                    ? 'bg-[linear-gradient(to_top,#35dfff,#a855f7)]'
                                                    : 'h-px bg-white/[0.08]'
                                            }`}
                                            style={
                                                day.views > 0
                                                    ? {
                                                          height: `${Math.max(
                                                              6,
                                                              (day.views /
                                                                  highestDailyViews) *
                                                                  100,
                                                          )}%`,
                                                      }
                                                    : undefined
                                            }
                                        />
                                    </div>

                                    <span className="text-[8px] text-zinc-600">
                                        {day.date.slice(5)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </GlassPanel>

                <GlassPanel>
                    <div className="p-6 sm:p-8">
                        <p className="text-[9px] uppercase tracking-[0.25em] text-zinc-600">
                            Last 30 days
                        </p>

                        <h3 className="mt-2 text-lg font-light text-white">
                            Most-viewed projects
                        </h3>

                        {analytics.top_projects.length > 0 ? (
                            <div className="mt-5 divide-y divide-white/[0.06]">
                                {analytics.top_projects.map((project, index) => (
                                    <Link
                                        key={project.id}
                                        href={`/@${username}/project/${project.slug}`}
                                        className="group flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                                    >
                                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/[0.08] text-[10px] text-zinc-500">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>

                                        <span className="min-w-0 flex-1 truncate text-xs text-zinc-300 transition group-hover:text-white">
                                            {project.title}
                                        </span>

                                        <span className="shrink-0 text-[10px] text-zinc-500">
                                            {project.views.toLocaleString()}{' '}
                                            {project.views === 1 ? 'view' : 'views'}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p className="mt-4 text-xs leading-5 text-zinc-500">
                                Project visits will appear here as visitors explore
                                your work.
                            </p>
                        )}
                    </div>
                </GlassPanel>
            </div>
        </section>
    );
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

/*
|--------------------------------------------------------------------------
| AVATAR IMAGE
|--------------------------------------------------------------------------
*/

function DashboardAvatar({
    src,
    alt,
    zoom,
    positionX,
    positionY,
    cropSize,
}: {
    src: string;
    alt: string;
    zoom: number;
    positionX: number;
    positionY: number;
    cropSize: number;
}) {
    const [naturalSize, setNaturalSize] = useState({
        width: 1,
        height: 1,
    });

    // IMPORTANT: The editor calculates the image against the actual crop
    // viewport. Dashboard must do the same. Using a larger fixed crop size
    // here makes the image render much larger than it does in the editor.
    const aspectRatio = naturalSize.width / naturalSize.height;

    const baseWidth =
        Number.isFinite(aspectRatio) && aspectRatio > 0
            ? aspectRatio >= 1
                ? cropSize * aspectRatio
                : cropSize
            : cropSize;

    const baseHeight =
        Number.isFinite(aspectRatio) && aspectRatio > 0
            ? aspectRatio >= 1
                ? cropSize
                : cropSize / aspectRatio
            : cropSize;

    const scaledWidth = baseWidth * (zoom || 1);
    const scaledHeight = baseHeight * (zoom || 1);

    const maxX = Math.max(0, (scaledWidth - cropSize) / 2);
    const maxY = Math.max(0, (scaledHeight - cropSize) / 2);

    const translationX = ((positionX - 50) / 50) * maxX;
    const translationY = ((positionY - 50) / 50) * maxY;

    return (
        <img
            src={src}
            alt={alt}
            className="absolute left-1/2 top-1/2 max-w-none select-none"
            draggable={false}
            onLoad={(event) => {
                const image = event.currentTarget;

                if (image.naturalWidth > 0 && image.naturalHeight > 0) {
                    setNaturalSize({
                        width: image.naturalWidth,
                        height: image.naturalHeight,
                    });
                }
            }}
            style={{
                width: `${baseWidth}px`,
                height: `${baseHeight}px`,
                transform: `translate(-50%, -50%) translate(${translationX}px, ${translationY}px) scale(${zoom || 1})`,
                transformOrigin: 'center',
            }}
        />
    );
}

/*Dashboard */

export default function Dashboard({
    profile,
    projects,
    projectCount,
    onboarding,
    analytics,
}: Props) {
    /* NEW USER */


    const [isResubmitting, setIsResubmitting] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);

    const page = usePage();

    const flash = page.props.flash as
        | { success?: string; error?: string }
        | undefined;


    if (!profile) {
        return (
            <DashboardLayout>
                <div className="mx-auto max-w-[1400px] px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
                    {/* Eyebrow */}
                    <div className="mb-8 flex items-center gap-3">
                        <span className="h-px w-8 bg-[linear-gradient(90deg,#ffffff,#7d8991,transparent)]" />

                        <span className="text-[9px] uppercase tracking-[0.35em] text-zinc-600">
                            LIRA / STUDIO
                        </span>
                    </div>

                    {/* Hero */}
                    <div className="max-w-3xl">
                        <h1 className="text-4xl font-light leading-[0.95] tracking-[-0.055em] text-white sm:text-5xl lg:text-6xl">
                            Your creative
                            <br />

                            <span className="bg-[linear-gradient(100deg,#ffffff_0%,#aeb8bd_30%,#ffffff_48%,#77838a_68%,#ffffff_100%)] bg-clip-text text-transparent">
                                space starts here.
                            </span>
                        </h1>

                        <p className="mt-6 max-w-xl text-sm leading-6 text-zinc-500">
                            Create your artist profile, build your portfolio,
                            and shape a space that feels like you.
                        </p>

                        <div className="mt-8">
                            <ChromeButton href="/dashboard/profile/create">
                                Create Artist Profile
                            </ChromeButton>
                        </div>
                    </div>

                    {/* Onboarding */}
                    <GlassPanel className="mt-16 max-w-[1000px]">
                        <div className="grid md:grid-cols-3">
                            <div className="border-b border-white/[0.07] p-7 md:border-b-0 md:border-r">
                                <span className="text-[10px] text-zinc-600">
                                    01
                                </span>

                                <h2 className="mt-7 text-sm font-medium text-white">
                                    Create your identity
                                </h2>

                                <p className="mt-3 text-xs leading-5 text-zinc-600">
                                    Set your artist name, bio, location, and
                                    social presence.
                                </p>
                            </div>

                            <div className="border-b border-white/[0.07] p-7 md:border-b-0 md:border-r">
                                <span className="text-[10px] text-zinc-600">
                                    02
                                </span>

                                <h2 className="mt-7 text-sm font-medium text-white">
                                    Get verified
                                </h2>

                                <p className="mt-3 text-xs leading-5 text-zinc-600">
                                    Your artist identity will be reviewed
                                    before your creative space becomes fully
                                    available.
                                </p>
                            </div>

                            <div className="p-7">
                                <span className="text-[10px] text-zinc-600">
                                    03
                                </span>

                                <h2 className="mt-7 text-sm font-medium text-white">
                                    Build your space
                                </h2>

                                <p className="mt-3 text-xs leading-5 text-zinc-600">
                                    Add projects, customize your portfolio,
                                    and publish your work.
                                </p>
                            </div>
                        </div>
                    </GlassPanel>
                </div>
            </DashboardLayout>
        );
    }

    /* PROFILE STATUS */

    const verificationStatus =
        profile.verification_status.toLowerCase();

    const isVerified = verificationStatus === 'verified';
    const isRejected = verificationStatus === 'rejected';
    const avatarUrl = getImageUrl(profile.avatar);

    const resubmitForVerification = () => {
        if (!isRejected || isResubmitting) return;

        setIsResubmitting(true);

        router.post('/dashboard/profile/resubmit', {}, {
            preserveScroll: true,
            onFinish: () => {
                setIsResubmitting(false);
            },
        });
    };

    const publishPortfolio = () => {
        if (!isVerified || profile.is_published || isPublishing) {
            return;
        }

        setIsPublishing(true);

        router.post('/dashboard/portfolio/publish', {}, {
            preserveScroll: true,
            onFinish: () => {
                setIsPublishing(false);
            },
        });
    };

    /* EXISTING ARTIST */

    return (
        <DashboardLayout>
            <div className="mx-auto max-w-[1400px] px-6 py-10 sm:px-8 lg:px-12 lg:py-12">
                {/* =========================================================
                    PAGE INTRO
                ========================================================== */}

                <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
                    <div>
                        <div className="mb-5 flex items-center gap-3">
                            <span className="h-px w-8 bg-[linear-gradient(90deg,#ffffff,#7d8991,transparent)]" />

                            <span className="text-[9px] uppercase tracking-[0.35em] text-zinc-600">
                                LIRA / STUDIO
                            </span>
                        </div>

                        <h1 className="text-4xl font-light tracking-[-0.055em] text-white sm:text-5xl">
                            Good to see you again,
                            <br />

                            <span className="bg-[linear-gradient(90deg,#fff_0%,#bdefff_24%,#9d8cff_58%,#f08bd7_82%,#fff_100%)] bg-clip-text text-transparent">
                                {profile.display_name}.
                            </span>
                        </h1>

                        <p className="mt-5 max-w-xl text-sm leading-6 text-zinc-600">
                            Manage your creative identity, projects, and
                            portfolio from your studio.
                        </p>
                    </div>

                    {isVerified && (
                        <ChromeButton href="/dashboard/projects/create">
                            <span className="flex items-center gap-2">
                                <PlusIcon />
                                Add Project
                            </span>
                        </ChromeButton>
                    )}
                </div>

                {/* =========================================================
                    ARTIST IDENTITY
                ========================================================== */}

                <GlassPanel className="mt-12">
                    <div className="p-6 sm:p-8">
                        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex items-center gap-5">
                                {/* Artist avatar */}
                                <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-[linear-gradient(135deg,#eef2f3_0%,#66747b_30%,#ffffff_48%,#56636a_70%,#eef2f3_100%)] shadow-[0_0_30px_rgba(255,255,255,0.08)]">
                                    {avatarUrl ? (
                                        <DashboardAvatar
                                            src={avatarUrl}
                                            alt={profile.display_name}
                                            zoom={profile.avatar_zoom || 1}
                                            positionX={profile.avatar_position_x ?? 50}
                                            positionY={profile.avatar_position_y ?? 50}
                                            cropSize={64}
                                        />
                                    ) : (
                                        <span className="text-lg font-medium text-black/70">
                                            {profile.display_name
                                                .charAt(0)
                                                .toUpperCase()}
                                        </span>
                                    )}

                                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent_20%,rgba(255,255,255,0.6)_48%,transparent_72%)] opacity-40" />
                                </div>

                                <div>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <h2 className="text-xl font-medium tracking-[-0.02em]">
                                            {profile.display_name}
                                        </h2>

                                        {isVerified && (
                                            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#35dfff]/20 bg-[#35dfff]/[0.04] px-2.5 py-1 text-[8px] uppercase tracking-[0.18em] text-[#72e9ff]">
                                                <CheckIcon />
                                                Verified
                                            </span>
                                        )}
                                    </div>

                                    <p className="mt-1 text-xs text-zinc-600">
                                        @{profile.username}
                                    </p>

                                    <p className="mt-3 text-xs text-zinc-500">
                                        {[
                                            profile.artist_type,
                                            profile.location,
                                        ]
                                            .filter(Boolean)
                                            .join(' · ') ||
                                            'Independent Artist'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </GlassPanel>

                {/* VERIFICATION STATUS */}
                {!isVerified && (
                    <GlassPanel className="mt-5">
                        <div className="relative p-6 sm:p-8">
                            <div
                                className={`absolute left-0 top-0 h-full w-px ${isRejected
                                    ? 'bg-[#ff6b9d]'
                                    : 'bg-[linear-gradient(to_bottom,#ffffff,#7d8991,#ffffff)]'
                                    }`}
                            />

                            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                                <div className="min-w-0 flex-1">
                                    <p className="text-[9px] uppercase tracking-[0.3em] text-zinc-600">
                                        Artist Verification
                                    </p>

                                    <h2 className="mt-3 text-lg font-medium text-white">
                                        {isRejected
                                            ? 'Your profile needs attention.'
                                            : 'Your artist profile is under review.'}
                                    </h2>

                                    <p className="mt-2 max-w-2xl text-xs leading-5 text-zinc-500">
                                        {isRejected
                                            ? 'Review the feedback below, make any necessary corrections, and resubmit your profile for another review.'
                                            : 'Your artist profile is awaiting review. You will be able to access your portfolio tools once your identity is verified.'}
                                    </p>

                                    {isRejected && (
                                        <div className="mt-5 rounded-xl border border-rose-400/15 bg-rose-400/[0.04] p-4">
                                            <p className="text-[9px] uppercase tracking-[0.2em] text-rose-300">
                                                Feedback from LIRA
                                            </p>

                                            <p className="mt-3 whitespace-pre-line break-words text-sm leading-6 text-zinc-300">
                                                {profile.rejection_reason?.trim() ||
                                                    'No specific reason was provided. Please review your artist profile before resubmitting.'}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
                                    <Link
                                        href="/dashboard/profile/edit"
                                        className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-2.5 text-xs text-zinc-300 transition hover:border-white/20 hover:text-white"
                                    >
                                        {isRejected ? 'Edit Profile' : 'View Profile'}
                                        <ArrowRight />
                                    </Link>

                                    {isRejected && (
                                        <button
                                            type="button"
                                            onClick={resubmitForVerification}
                                            disabled={isResubmitting}
                                            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#35dfff]/25 bg-[#35dfff]/[0.08] px-5 py-2.5 text-xs font-medium text-[#8ceeff] transition hover:bg-[#35dfff]/[0.14] disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {isResubmitting
                                                ? 'Resubmitting...'
                                                : 'Resubmit for Verification'}
                                            <ArrowRight />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </GlassPanel>
                )}

                {/* ONBOARDING CHECKLIST */}
                {onboarding && (
                    <OnboardingChecklist
                        onboarding={onboarding}
                        isVerified={isVerified}
                        isRejected={isRejected}
                        profileId={profile.id}
                    />
                )}

                {/* STATS */}

                <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

                    {/* Projects */}
                    <GlassPanel>
                        <div className="p-6">
                            <p className="text-[9px] uppercase tracking-[0.25em] text-zinc-600">
                                Projects
                            </p>

                            <div className="mt-5 flex items-end justify-between gap-4">
                                <div>
                                    <span className="text-4xl font-light tracking-[-0.05em]">
                                        {projectCount.toLocaleString()}
                                    </span>

                                    <p className="mt-2 max-w-[180px] text-[10px] leading-4 text-zinc-600">
                                        Creative works currently in your studio.
                                    </p>
                                </div>

                                {isVerified && (
                                    <Link
                                        href="/dashboard/projects"
                                        className="mb-1 text-zinc-600 transition hover:text-white"
                                    >
                                        <ArrowUpRight />
                                    </Link>
                                )}
                            </div>
                        </div>
                    </GlassPanel>


                    {/* Verification */}
                    <GlassPanel>
                        <div className="p-6">
                            <p className="text-[9px] uppercase tracking-[0.25em] text-zinc-600">
                                Verification
                            </p>

                            <div className="mt-5 flex items-start gap-3">
                                <span
                                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${isVerified
                                        ? 'bg-[#35dfff] shadow-[0_0_14px_rgba(53,223,255,0.7)]'
                                        : isRejected
                                            ? 'bg-[#ff6b9d] shadow-[0_0_14px_rgba(255,107,157,0.5)]'
                                            : 'bg-[#a855f7] shadow-[0_0_14px_rgba(168,85,247,0.5)]'
                                        }`}
                                />

                                <div>
                                    <span className="text-lg font-light capitalize">
                                        {verificationStatus}
                                    </span>

                                    <p className="mt-2 max-w-[190px] text-[10px] leading-4 text-zinc-600">
                                        {isVerified
                                            ? 'Your artist identity has been verified.'
                                            : isRejected
                                                ? 'Your profile needs attention.'
                                                : 'Your artist profile is currently under review.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </GlassPanel>


                    {/* Portfolio */}
                    <GlassPanel>
                        <div className="p-6">
                            <p className="text-[9px] uppercase tracking-[0.25em] text-zinc-600">
                                Portfolio
                            </p>

                            <div className="mt-5 flex items-start gap-3">
                                <span
                                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${profile.is_published
                                        ? 'bg-[#35dfff] shadow-[0_0_14px_rgba(53,223,255,0.7)]'
                                        : 'bg-zinc-700'
                                        }`}
                                />

                                <div>
                                    <span className="text-lg font-light">
                                        {profile.is_published
                                            ? 'Published'
                                            : 'Not Published'}
                                    </span>

                                    <p className="mt-2 max-w-[190px] text-[10px] leading-4 text-zinc-600">
                                        {profile.is_published
                                            ? 'Your portfolio is currently visible to visitors.'
                                            : 'Your portfolio is not currently visible to visitors.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </GlassPanel>


                    {/* Portfolio Views */}
                    <GlassPanel>
                        <div className="p-6">
                            <p className="text-[9px] uppercase tracking-[0.25em] text-zinc-600">
                                Portfolio Views
                            </p>

                            <div className="mt-5 flex items-end justify-between gap-4">
                                <div>
                                    <span className="text-4xl font-light tracking-[-0.05em]">
                                        {profile.portfolio_views_count.toLocaleString()}
                                    </span>

                                    <p className="mt-2 max-w-[190px] text-[10px] leading-4 text-zinc-600">
                                        Total visits to your public portfolio.
                                    </p>
                                </div>

                                {isVerified && profile.is_published && (
                                    <Link
                                        href={`/@${profile.username}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mb-1 text-zinc-600 transition hover:text-white"
                                    >
                                        <ArrowUpRight />
                                    </Link>
                                )}
                            </div>
                        </div>
                    </GlassPanel>

                </div>

                {isVerified && profile.is_published && analytics && (
                    <ArtistInsights
                        username={profile.username}
                        analytics={analytics}
                    />
                )}

                {/* =========================================================
                    PORTFOLIO PREVIEW
                ========================================================= */}

                <div className="mt-14">
                    <GlassPanel className="overflow-hidden">
                        <div className="grid lg:grid-cols-[0.8fr_1.2fr]">

                            {/* Preview Information */}

                            <div className="relative flex flex-col justify-between overflow-hidden border-b border-white/[0.07] p-7 sm:p-9 lg:border-b-0 lg:border-r">
                                {/* Chrome reflection */}

                                <div className="pointer-events-none absolute right-0 top-0 h-px w-[70%] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)]" />

                                {/* Subtle glow */}

                                <div className="pointer-events-none absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-[#35dfff]/[0.025] blur-3xl" />

                                <div className="relative">
                                    <p className="text-[9px] uppercase tracking-[0.32em] text-zinc-600">
                                        Your Portfolio
                                    </p>

                                    <h2 className="mt-8 max-w-md text-3xl font-light leading-[1.05] tracking-[-0.045em] text-white sm:text-4xl">
                                        A glimpse of your
                                        <br />

                                        <span className="bg-[linear-gradient(100deg,#ffffff_0%,#aeb8bd_30%,#ffffff_48%,#77838a_68%,#ffffff_100%)] bg-clip-text text-transparent">
                                            world.
                                        </span>
                                    </h2>

                                    <p className="mt-5 max-w-md text-sm leading-6 text-zinc-600">
                                        This is how your public portfolio looks right now.
                                    </p>
                                </div>

                                {isVerified && profile.is_published ? (
                                    <div className="relative mt-10">
                                        <Link
                                            href={`/@${profile.username}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group inline-flex h-11 items-center gap-3 rounded-full bg-white px-6 text-xs font-medium text-[#08090b] transition duration-300 hover:bg-zinc-200 hover:shadow-[0_10px_35px_rgba(255,255,255,0.08)]"
                                        >
                                            <span>
                                                View Portfolio
                                            </span>

                                            <ArrowUpRight className="transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="relative mt-10">
                                        <p className="text-sm text-zinc-500">
                                            Your portfolio will be visible once published.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Portfolio Preview */}

                            <div className="relative min-h-[280px] overflow-hidden bg-[#050607] sm:min-h-[360px] lg:min-h-[430px]">
                                {/* Browser-style top edge */}
                                <div className="absolute inset-x-0 top-0 z-30 flex h-8 items-center border-b border-white/[0.07] bg-[#08090a]/90 px-3 backdrop-blur-xl">
                                    <div className="flex items-center gap-1.5">
                                        <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                                        <span className="h-1.5 w-1.5 rounded-full bg-white/10" />
                                        <span className="h-1.5 w-1.5 rounded-full bg-white/10" />
                                    </div>

                                    <div className="mx-auto max-w-[55%] truncate text-[7px] tracking-[0.12em] text-zinc-700">
                                        lira.test/@{profile.username}
                                    </div>
                                </div>

                                <div className="absolute inset-x-3 bottom-3 top-11 overflow-hidden rounded-lg border border-white/[0.08] bg-black shadow-[0_20px_60px_rgba(0,0,0,0.45)] sm:inset-x-5 sm:bottom-5 sm:top-12">
                                    {isVerified && profile.is_published ? (
                                        <div className="absolute inset-0 overflow-hidden">
                                            <iframe
                                                src={`/@${profile.username}`}
                                                title={`${profile.display_name} portfolio preview`}
                                                scrolling="no"
                                                className="pointer-events-none absolute left-0 top-0 h-[250%] w-[250%] origin-top-left border-0 overflow-hidden"
                                                style={{
                                                    transform: 'scale(0.4)',
                                                }}
                                            />

                                            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.025),transparent_35%,rgba(255,255,255,0.015))]" />

                                            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/[0.04]" />
                                        </div>
                                    ) : (
                                        <div className="relative flex h-full items-center justify-center overflow-hidden px-6 text-center">
                                            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(53,223,255,0.06),transparent_34%),radial-gradient(circle_at_65%_70%,rgba(168,85,247,0.05),transparent_30%)]" />

                                            <div className="relative max-w-sm">
                                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/[0.09] bg-white/[0.025] text-zinc-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                                                    {isRejected ? (
                                                        <span className="text-sm text-[#ff6b9d]">!</span>
                                                    ) : isVerified ? (
                                                        <span className="text-sm text-[#35dfff]">✦</span>
                                                    ) : (
                                                        <LockIcon className="h-4 w-4" />
                                                    )}
                                                </div>

                                                <p className="mt-5 text-[9px] uppercase tracking-[0.3em] text-zinc-600">
                                                    {isRejected
                                                        ? 'Profile Review Required'
                                                        : isVerified
                                                            ? 'Portfolio Not Published'
                                                            : 'Portfolio Preparation'}
                                                </p>

                                                <h3 className="mt-3 text-lg font-light tracking-[-0.02em] text-white">
                                                    {isRejected
                                                        ? 'Your creative space is on hold.'
                                                        : isVerified
                                                            ? 'Your space is ready when you are.'
                                                            : 'Your creative space is being prepared.'}
                                                </h3>

                                                <p className="mx-auto mt-3 max-w-xs text-[10px] leading-5 text-zinc-600">
                                                    {isRejected
                                                        ? 'Review your artist profile before your portfolio can become available.'
                                                        : isVerified
                                                            ? 'Customize your portfolio and publish it when everything is ready.'
                                                            : 'Once your artist profile is verified, you can start building and publishing your portfolio.'}
                                                </p>

                                                {isVerified ? (
                                                    <Link
                                                        href="/dashboard/portfolio/settings"
                                                        className="mt-6 inline-flex h-9 items-center gap-2 rounded-full border border-white/[0.10] bg-white/[0.035] px-4 text-[10px] font-medium text-zinc-300 transition hover:border-white/[0.18] hover:bg-white/[0.06] hover:text-white"
                                                    >
                                                        Customize Portfolio
                                                        <ArrowRight className="h-3 w-3" />
                                                    </Link>
                                                ) : (
                                                    <Link
                                                        href="/dashboard/profile"
                                                        className="mt-6 inline-flex h-9 items-center gap-2 rounded-full border border-white/[0.10] bg-white/[0.035] px-4 text-[10px] font-medium text-zinc-300 transition hover:border-white/[0.18] hover:bg-white/[0.06] hover:text-white"
                                                    >
                                                        {isRejected ? 'Review Profile' : 'View Profile'}
                                                        <ArrowRight className="h-3 w-3" />
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </GlassPanel>
                </div>

                {/* =========================================================
                    RECENT WORK
                ========================================================= */}

                <div className="mt-14">
                    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">

                        {/* =====================================================
            RECENT PROJECTS
        ====================================================== */}

                        <section>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[9px] uppercase tracking-[0.3em] text-zinc-600">
                                        Selected Work
                                    </p>

                                    <h2 className="mt-2 text-2xl font-light tracking-[-0.04em] text-white">
                                        Recent Projects
                                    </h2>
                                </div>

                                {isVerified && projects.length > 0 && (
                                    <Link
                                        href="/dashboard/projects"
                                        className="group hidden items-center gap-2 text-xs text-zinc-500 transition hover:text-white sm:flex"
                                    >
                                        View All

                                        <ArrowRight className="h-3.5 w-3.5 transition duration-300 group-hover:translate-x-1" />
                                    </Link>
                                )}
                            </div>

                            <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

                                {/* =================================================
                    PROJECTS
                ================================================== */}

                                {projects.slice(0, 2).map((project) => (
                                    <GlassPanel
                                        key={project.id}
                                        className="group overflow-hidden"
                                    >
                                        {/* Thumbnail */}

                                        <div className="relative aspect-[4/3] overflow-hidden bg-[#0d0f11]">

                                            {project.thumbnail ? (
                                                <img
                                                    src={`/storage/${project.thumbnail}`}
                                                    alt={project.title}
                                                    className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 bg-[linear-gradient(135deg,#15191b_0%,#657178_28%,#f0f3f4_46%,#56636a_67%,#171a1c_100%)]">
                                                    <div className="absolute inset-0 bg-[linear-gradient(125deg,transparent_15%,rgba(45,225,255,0.14)_30%,rgba(130,90,255,0.11)_44%,rgba(255,75,190,0.1)_55%,transparent_78%)]" />
                                                </div>
                                            )}

                                            {/* Image overlay */}

                                            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_45%,rgba(0,0,0,0.72)_100%)]" />

                                            {/* Project type */}

                                            <div className="absolute bottom-4 left-4">
                                                <span className="text-[8px] uppercase tracking-[0.25em] text-white/60">
                                                    {project.project_type || 'Project'}
                                                </span>
                                            </div>

                                            {/* Visibility */}

                                            <div className="absolute right-4 top-4 flex items-center gap-2">
                                                <span
                                                    className={`h-1.5 w-1.5 rounded-full ${project.is_visible
                                                        ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]'
                                                        : 'bg-zinc-600'
                                                        }`}
                                                />

                                                <span
                                                    className={`text-[8px] uppercase tracking-[0.16em] ${project.is_visible
                                                        ? 'text-emerald-300/90'
                                                        : 'text-zinc-500'
                                                        }`}
                                                >
                                                    {project.is_visible
                                                        ? 'Visible'
                                                        : 'Hidden'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Project Information */}

                                        <div className="p-5">
                                            <h3 className="text-sm font-medium text-white">
                                                {project.title}
                                            </h3>

                                            {project.description && (
                                                <p className="mt-1 line-clamp-1 text-[11px] text-zinc-600">
                                                    {project.description}
                                                </p>
                                            )}

                                            {/* Actions */}

                                            <div className="mt-5 flex items-center gap-2">

                                                <Link
                                                    href={`/dashboard/projects/${project.id}/edit`}
                                                    className="inline-flex h-9 items-center rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 text-[10px] font-medium text-zinc-300 transition hover:border-white/[0.14] hover:bg-white/[0.05] hover:text-white"
                                                >
                                                    Edit
                                                </Link>

                                                {project.is_visible && (
                                                    <Link
                                                        href={`/@${profile.username}/project/${project.slug}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="group/view inline-flex h-9 items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 text-[10px] font-medium text-zinc-300 transition hover:border-white/[0.14] hover:bg-white/[0.05] hover:text-white"
                                                    >
                                                        View

                                                        <ArrowUpRight className="h-3 w-3 transition duration-300 group-hover/view:-translate-y-0.5 group-hover/view:translate-x-0.5" />
                                                    </Link>
                                                )}

                                                <Link
                                                    href={`/dashboard/projects/${project.id}/edit`}
                                                    aria-label={`Manage ${project.title}`}
                                                    className="ml-auto flex h-9 w-9 items-center justify-center rounded-xl text-zinc-600 transition hover:bg-white/[0.04] hover:text-white"
                                                >
                                                    <span className="flex gap-[3px]">
                                                        <span className="h-1 w-1 rounded-full bg-current" />
                                                        <span className="h-1 w-1 rounded-full bg-current" />
                                                        <span className="h-1 w-1 rounded-full bg-current" />
                                                    </span>
                                                </Link>
                                            </div>
                                        </div>
                                    </GlassPanel>
                                ))}

                                {/* =================================================
                    ADD PROJECT CARD
                ================================================== */}

                                {isVerified && (
                                    <Link
                                        href="/dashboard/projects/create"
                                        className="group relative flex min-h-[360px] flex-col items-center justify-center overflow-hidden rounded-[1rem] border border-dashed border-white/[0.12] bg-white/[0.008] transition duration-500 hover:border-white/[0.22] hover:bg-white/[0.018]"
                                    >
                                        {/* Chrome reflection */}

                                        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.16),transparent)] opacity-0 transition duration-500 group-hover:opacity-100" />

                                        {/* Ambient glow */}

                                        <div className="pointer-events-none absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#35dfff]/[0.025] blur-3xl transition duration-500 group-hover:bg-[#35dfff]/[0.05]" />

                                        {/* Plus */}

                                        <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.035] text-zinc-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition duration-500 group-hover:border-white/[0.16] group-hover:bg-white/[0.06] group-hover:text-white">
                                            <PlusIcon className="h-5 w-5" />
                                        </div>

                                        <h3 className="relative mt-6 text-sm font-medium text-white">
                                            Add New Project
                                        </h3>

                                        <p className="relative mt-2 max-w-[180px] text-center text-[11px] leading-5 text-zinc-600">
                                            Share your next creation
                                            with the world.
                                        </p>
                                    </Link>
                                )}

                                {/* =================================================
                    EMPTY STATE WHEN NOT VERIFIED
                ================================================== */}

                                {!isVerified && projects.length === 0 && (
                                    <GlassPanel className="md:col-span-2 lg:col-span-3">
                                        <div className="flex flex-col items-start justify-between gap-6 p-8 sm:flex-row sm:items-center">
                                            <div>
                                                <p className="text-sm text-white">
                                                    Your space is waiting for its first
                                                    project.
                                                </p>

                                                <p className="mt-2 text-xs leading-5 text-zinc-600">
                                                    Projects become available once your
                                                    artist profile has been verified.
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-2 text-xs text-zinc-700">
                                                <LockIcon />

                                                Available after verification
                                            </div>
                                        </div>
                                    </GlassPanel>
                                )}
                            </div>

                            {/* Mobile View All */}

                            {isVerified && projects.length > 0 && (
                                <Link
                                    href="/dashboard/projects"
                                    className="group mt-5 flex items-center justify-center gap-2 text-xs text-zinc-500 transition hover:text-white sm:hidden"
                                >
                                    View All

                                    <ArrowRight className="h-3.5 w-3.5 transition duration-300 group-hover:translate-x-1" />
                                </Link>
                            )}
                        </section>

                        {/* =====================================================
                            QUICK ACTIONS
                        ====================================================== */}

                        <aside className="space-y-5">

                            {/* Quick Actions */}

                            <GlassPanel className="overflow-hidden">
                                <div className="p-5">
                                    <h3 className="text-base font-medium text-white">
                                        Quick Actions
                                    </h3>

                                    <div className="mt-4 space-y-1">

                                        {/* Edit Profile */}

                                        <Link
                                            href="/dashboard/profile/edit"
                                            className="group flex items-center gap-4 rounded-2xl p-3 transition hover:bg-white/[0.035]"
                                        >
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.035] text-zinc-400 transition group-hover:border-white/[0.12] group-hover:text-white">
                                                <UserIcon className="h-5 w-5" />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium text-white">
                                                    Edit Profile
                                                </p>

                                                <p className="mt-0.5 text-[10px] text-zinc-600">
                                                    Update your artist information
                                                </p>
                                            </div>

                                            <ArrowRight className="h-4 w-4 shrink-0 text-zinc-600 transition group-hover:translate-x-1 group-hover:text-white" />
                                        </Link>

                                        {/* Manage Projects */}

                                        {isVerified ? (
                                            <Link
                                                href="/dashboard/projects"
                                                className="group flex items-center gap-4 rounded-2xl p-3 transition hover:bg-white/[0.035]"
                                            >
                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.035] text-zinc-400 transition group-hover:border-white/[0.12] group-hover:text-white">
                                                    <FolderIcon className="h-5 w-5" />
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-medium text-white">
                                                        Manage Projects
                                                    </p>

                                                    <p className="mt-0.5 text-[10px] text-zinc-600">
                                                        Add, edit, or organize your work
                                                    </p>
                                                </div>

                                                <ArrowRight className="h-4 w-4 shrink-0 text-zinc-600 transition group-hover:translate-x-1 group-hover:text-white" />
                                            </Link>
                                        ) : (
                                            <div className="flex items-center gap-4 rounded-2xl p-3 opacity-40">
                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.025] text-zinc-600">
                                                    <LockIcon className="h-4 w-4" />
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-medium text-zinc-500">
                                                        Manage Projects
                                                    </p>

                                                    <p className="mt-0.5 text-[10px] text-zinc-700">
                                                        Available after verification
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* View Artist Profile */}
                                        <Link href="/dashboard/profile" className="group flex items-center gap-4 rounded-2xl p-3 transition hover:bg-white/[0.035]">
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.035] text-zinc-400 transition group-hover:border-white/[0.12] group-hover:text-white">
                                                <UserIcon className="h-5 w-5" />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium text-white">
                                                    View Artist Profile
                                                </p>

                                                <p className="mt-0.5 text-[10px] text-zinc-600">
                                                    Review your artist identity and profile details
                                                </p>
                                            </div>
                                            <ArrowRight className="h-4 w-4 shrink-0 text-zinc-600 transition group-hover:translate-x-1 group-hover:text-white" />
                                        </Link>
                                    </div>
                                </div>
                            </GlassPanel>

                            {/* Account */}

                            <GlassPanel className="overflow-hidden">
                                <div className="p-5">
                                    <h3 className="text-base font-medium text-white">
                                        Account
                                    </h3>

                                    <div className="mt-5 flex items-center gap-4">
                                        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/[0.08] bg-[linear-gradient(135deg,#d9e0e3,#68747a,#f4f7f8)] text-sm font-medium text-[#17191b] shadow-[0_0_25px_rgba(255,255,255,0.08)]">
                                            {avatarUrl ? (
                                                <DashboardAvatar
                                                    src={avatarUrl}
                                                    alt={profile.display_name}
                                                    zoom={profile.avatar_zoom || 1}
                                                    positionX={profile.avatar_position_x ?? 50}
                                                    positionY={profile.avatar_position_y ?? 50}
                                                    cropSize={56}
                                                />
                                            ) : (
                                                profile.display_name
                                                    ?.charAt(0)
                                                    .toUpperCase()
                                            )}
                                        </div>

                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium text-white">
                                                @{profile.username}
                                            </p>

                                            <p className="mt-1 truncate text-[10px] text-zinc-600">
                                                {profile.artist_type || 'Artist'}
                                                {profile.location
                                                    ? ` · ${profile.location}`
                                                    : ''}
                                            </p>
                                        </div>
                                    </div>

                                    <Link
                                        href="/dashboard/profile"
                                        className="group mt-5 flex h-10 items-center justify-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.015] text-[10px] font-medium text-zinc-400 transition hover:border-white/[0.15] hover:bg-white/[0.04] hover:text-white"
                                    >
                                        View Profile

                                        <ArrowRight className="h-3.5 w-3.5 transition duration-300 group-hover:translate-x-1" />
                                    </Link>
                                </div>
                            </GlassPanel>
                        </aside>
                    </div>
                </div>


                {/* PORTFOLIO ACTION */}
                {isVerified && (
                    <GlassPanel className="mt-14">
                        <div className="relative overflow-hidden p-8 sm:p-10">
                            <div className="pointer-events-none absolute right-0 top-0 h-px w-[55%] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)]" />

                            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                    <p className="text-[9px] uppercase tracking-[0.3em] text-zinc-600">
                                        Your Space
                                    </p>

                                    <h2 className="mt-3 text-2xl font-light tracking-[-0.04em] text-white">
                                        {profile.is_published
                                            ? 'Your portfolio is live.'
                                            : 'Ready to share your world?'}
                                    </h2>

                                    <p className="mt-3 max-w-xl text-xs leading-5 text-zinc-600">
                                        {profile.is_published
                                            ? 'Your creative portfolio is publicly accessible. Visit it to see how your work appears to visitors.'
                                            : 'When you publish, visitors will be able to access your portfolio using your public artist URL.'}
                                    </p>

                                    {flash?.success && (
                                        <p role="status" className="mt-4 text-xs text-emerald-300">
                                            {flash.success}
                                        </p>
                                    )}

                                    {flash?.error && (
                                        <p role="alert" className="mt-4 text-xs text-rose-300">
                                            {flash.error}
                                        </p>
                                    )}
                                </div>

                                <div className="flex shrink-0 flex-wrap gap-3">
                                    <Link
                                        href="/dashboard/portfolio/settings"
                                        className="inline-flex items-center gap-3 rounded-full border border-white/10 px-6 py-3 text-xs text-zinc-400 transition hover:border-white/20 hover:text-white"
                                    >
                                        Customize Portfolio
                                        <ArrowRight />
                                    </Link>

                                    {profile.is_published ? (
                                        <Link
                                            href={`/@${profile.username}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 text-xs font-medium text-[#08090b] transition hover:bg-zinc-200"
                                        >
                                            View Live Portfolio
                                            <ArrowUpRight />
                                        </Link>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={publishPortfolio}
                                            disabled={isPublishing}
                                            className="inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 text-xs font-medium text-[#08090b] transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {isPublishing
                                                ? 'Publishing...'
                                                : 'Publish Portfolio'}
                                            <ArrowUpRight />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </GlassPanel>
                )}

            </div>
        </DashboardLayout>
    );
}
