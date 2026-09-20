import { Link, router } from '@inertiajs/react';

import DashboardLayout from '../../Components/Dashboard/d_layout';
import {
    ArrowRight,
    ArrowUpRight,
    PlusIcon,
} from '../../Components/Icons';

interface Profile {
    username: string;
}

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
    profile: Profile;
    projects: Project[];
}
/*
|--------------------------------------------------------------------------
| PROJECT THUMBNAIL
|--------------------------------------------------------------------------
*/

function ProjectThumbnail({
    project,
}: {
    project: Project;
}) {
    return (
        <div className="relative aspect-[4/3] overflow-hidden bg-[#0b0d0f]">
            <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(135deg,rgba(255,255,255,0.035),transparent_40%,rgba(255,255,255,0.025))]" />

            <img
                src={`/storage/${project.thumbnail}`}
                alt={project.title}
                className="h-full w-full select-none object-cover"
                draggable={false}
                loading="eager"
                style={{
                    objectPosition: `${project.thumbnail_position_x}% ${project.thumbnail_position_y}%`,
                    transform: `
                        translate(
                            ${project.thumbnail_offset_x}%,
                            ${project.thumbnail_offset_y}%
                        )
                        scale(${project.thumbnail_zoom / 100})
                    `,
                    transformOrigin: 'center',
                }}
            />

            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-[linear-gradient(to_top,rgba(5,6,7,0.78),transparent)]" />

            {/* Image index marker */}
            <div className="pointer-events-none absolute bottom-4 left-5 z-20">
                <span className="text-[8px] uppercase tracking-[0.28em] text-white/45">
                    LIRA / WORK
                </span>
            </div>
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| EMPTY THUMBNAIL
|--------------------------------------------------------------------------
*/

function EmptyThumbnail({
    projectType,
}: {
    projectType: string | null;
}) {
    return (
        <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-[#0b0d0f]">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.04),transparent_45%,rgba(255,255,255,0.018))]" />

            <div className="pointer-events-none absolute right-8 top-8 h-3 w-3">
                <span className="absolute inset-0 rotate-45 bg-white/20 blur-[1px]" />
                <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/30" />
                <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white/30" />
            </div>

            <div className="relative text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.025] text-zinc-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                    <span className="text-sm">
                        +
                    </span>
                </div>

                <p className="mt-4 text-[9px] uppercase tracking-[0.28em] text-zinc-700">
                    {projectType ?? 'Project'}
                </p>
            </div>
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| PROJECT CARD
|--------------------------------------------------------------------------
*/

function ProjectCard({
    project,
    index,
}: {
    project: Project;
    index: number;
}) {
    function deleteProject() {
        if (
            !window.confirm(
                `Delete "${project.title}"?`,
            )
        ) {
            return;
        }

        router.delete(
            `/dashboard/projects/${project.id}`,
        );
    }

    function toggleVisibility() {
        router.patch(
            `/dashboard/projects/${project.id}/visibility`,
        );
    }

    return (
        <article className="group relative overflow-hidden rounded-[1.35rem] border border-white/[0.08] bg-[linear-gradient(145deg,rgba(255,255,255,0.045),rgba(255,255,255,0.012)_42%,rgba(255,255,255,0.022))] shadow-[0_25px_70px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-2xl transition duration-500 hover:-translate-y-0.5 hover:border-white/[0.14] hover:shadow-[0_35px_90px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.06)]">

            {/* Inner border */}
            <div className="pointer-events-none absolute inset-0 z-30 rounded-[1.35rem] border border-white/[0.02]" />

            {/* Chrome line */}
            <div className="pointer-events-none absolute inset-x-0 top-0 z-40 h-px bg-[linear-gradient(90deg,transparent_5%,rgba(255,255,255,0.32)_35%,rgba(255,255,255,0.12)_55%,transparent_95%)] opacity-70" />

            {/* Work number */}
            <div className="pointer-events-none absolute left-5 top-5 z-40">
                <span className="text-[8px] uppercase tracking-[0.2em] text-white/50">
                    {String(index + 1).padStart(2, '0')}
                </span>
            </div>

            {/* Sparkle */}
            <div className="pointer-events-none absolute right-6 top-6 z-40 h-3 w-3 opacity-20 transition duration-500 group-hover:opacity-70">
                <span className="absolute inset-0 rotate-45 bg-white/60 blur-[1px]" />
                <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/70" />
                <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white/70" />
            </div>

            {/* Thumbnail */}
            {project.thumbnail ? (
                <ProjectThumbnail project={project} />
            ) : (
                <EmptyThumbnail
                    projectType={project.project_type}
                />
            )}

            {/* Content */}
            <div className="relative z-10 p-6">
                <div className="flex items-start justify-between gap-5">
                    <div className="min-w-0">
                        {project.project_type && (
                            <p className="text-[8px] uppercase tracking-[0.28em] text-zinc-600">
                                {project.project_type}
                            </p>
                        )}

                        <h2 className="mt-2 truncate text-[17px] font-medium tracking-[-0.025em] text-white">
                            {project.title}
                        </h2>
                    </div>

                    <div
                        className={`mt-1 flex shrink-0 items-center gap-2 text-[8px] uppercase tracking-[0.18em] ${project.is_visible
                            ? 'text-emerald-400/70'
                            : 'text-zinc-700'
                            }`}
                    >
                        <span
                            className={`h-1.5 w-1.5 rounded-full ${project.is_visible
                                ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]'
                                : 'bg-zinc-700'
                                }`}
                        />

                        {project.is_visible
                            ? 'Visible'
                            : 'Hidden'}
                    </div>
                </div>

                {project.description ? (
                    <p className="mt-3 line-clamp-3 text-xs leading-5 text-zinc-600">
                        {project.description}
                    </p>
                ) : (
                    <p className="mt-3 text-xs leading-5 text-zinc-700">
                        No project description has been added yet.
                    </p>
                )}

                {/* Actions */}
                <div className="mt-6 flex items-center justify-between border-t border-white/[0.06] pt-5">
                    <div className="flex items-center gap-5">
                        <Link
                            href={`/dashboard/projects/${project.id}/edit`}
                            className="group/edit inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-zinc-500 transition hover:text-white"
                        >
                            Edit

                            <ArrowUpRight className="h-3 w-3 transition duration-300 group-hover/edit:translate-x-0.5 group-hover/edit:-translate-y-0.5" />
                        </Link>

                        <button
                            type="button"
                            onClick={toggleVisibility}
                            className={`text-[10px] uppercase tracking-[0.18em] transition ${project.is_visible
                                ? 'text-zinc-600 hover:text-zinc-300'
                                : 'text-zinc-600 hover:text-white'
                                }`}
                        >
                            {project.is_visible
                                ? 'Hide'
                                : 'Show'}
                        </button>

                        <button
                            type="button"
                            onClick={deleteProject}
                            className="text-[10px] uppercase tracking-[0.18em] text-zinc-700 transition hover:text-red-400"
                        >
                            Delete
                        </button>
                    </div>

                    {project.url && (
                        <a
                            href={project.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-zinc-600 transition hover:text-white"
                            aria-label={`Open ${project.title}`}
                        >
                            <ArrowUpRight className="h-4 w-4" />
                        </a>
                    )}
                </div>
            </div>
        </article>
    );
}

/*
|--------------------------------------------------------------------------
| STAT BLOCK
|--------------------------------------------------------------------------
*/

function StudioStat({
    value,
    label,
    description,
}: {
    value: number;
    label: string;
    description: string;
}) {
    return (
        <div className="relative overflow-hidden border-l border-white/[0.08] pl-5 first:border-l-0 first:pl-0">
            <p className="text-2xl font-light tracking-[-0.04em] text-white">
                {String(value).padStart(2, '0')}
            </p>

            <p className="mt-2 text-[8px] uppercase tracking-[0.28em] text-zinc-500">
                {label}
            </p>

            <p className="mt-2 max-w-[180px] text-[10px] leading-4 text-zinc-700">
                {description}
            </p>
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| PROJECTS
|--------------------------------------------------------------------------
*/

export default function Index({ profile, projects }: Props) {

    const visibleProjects = projects.filter(
        (project) => project.is_visible,
    );

    const hiddenProjects = projects.filter(
        (project) => !project.is_visible,
    );

    const projectTypes = new Set(
        projects
            .map((project) => project.project_type)
            .filter(Boolean),
    ).size;

    return (
        <DashboardLayout>
            <div className="mx-auto max-w-[1400px] px-6 py-10 sm:px-8 lg:px-12 lg:py-12">

                {/* =====================================================
                    HERO
                ====================================================== */}

                <section className="relative mb-14 overflow-hidden border-b border-white/[0.07] pb-12">

                    <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">

                        <div>
                            <div className="mb-5 flex items-center gap-3">
                                <span className="h-px w-8 bg-[linear-gradient(90deg,#ffffff,#7d8991,transparent)]" />

                                <span className="text-[9px] uppercase tracking-[0.35em] text-zinc-600">
                                    LIRA / STUDIO / PROJECTS
                                </span>
                            </div>

                            <h1 className="text-4xl font-light tracking-[-0.055em] text-white sm:text-5xl">
                                Your selected
                                <br />

                                <span className="bg-[linear-gradient(90deg,#fff_0%,#bdefff_24%,#9d8cff_58%,#f08bd7_82%,#fff_100%)] bg-clip-text text-transparent">
                                    work.
                                </span>
                            </h1>

                            <p className="mt-6 max-w-xl text-sm leading-6 text-zinc-600">
                                A curated archive of the work,
                                projects, and creative pieces that
                                define your presence on LIRA.
                            </p>
                        </div>

                        <Link
                            href="/dashboard/projects/create"
                            className="group relative inline-flex h-11 shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full border border-white/40 bg-[linear-gradient(105deg,#32ddff_0%,#6677ff_20%,#a955ff_38%,#f05abd_51%,#ff8ed3_63%,#7b63ff_78%,#34dcff_94%)] px-5 text-xs font-medium text-[#08090b] shadow-[0_8px_35px_rgba(90,150,255,0.14)] transition duration-300 hover:scale-[1.015] hover:shadow-[0_12px_50px_rgba(190,80,255,0.22)]"
                        >
                            <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_20%,rgba(255,255,255,0.65)_48%,transparent_72%)] opacity-0 transition duration-700 group-hover:translate-x-[25%] group-hover:opacity-100" />

                            <PlusIcon className="relative h-3.5 w-3.5" />

                            <span className="relative">
                                Add Project
                            </span>
                        </Link>
                    </div>
                </section>

                {/* =====================================================
                    STUDIO OVERVIEW
                ====================================================== */}

                <section className="mb-16">
                    <div className="mb-6 flex items-end justify-between">
                        <div>
                            <p className="text-[9px] uppercase tracking-[0.32em] text-zinc-700">
                                Studio Overview
                            </p>

                            <h2 className="mt-2 text-lg font-light tracking-[-0.025em] text-white">
                                Your creative inventory.
                            </h2>
                        </div>

                        <span className="hidden text-[8px] uppercase tracking-[0.25em] text-zinc-700 sm:block">
                            CURRENT STATE
                        </span>
                    </div>

                    <div className="relative overflow-hidden rounded-[1.25rem] border border-white/[0.08] bg-[linear-gradient(145deg,rgba(255,255,255,0.035),rgba(255,255,255,0.008))] px-6 py-7 shadow-[0_25px_70px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.035)] sm:px-8">
                        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)]" />

                        <div className="grid gap-8 sm:grid-cols-3">
                            <StudioStat
                                value={projects.length}
                                label="Total Projects"
                                description="Creative work currently stored in your studio."
                            />

                            <StudioStat
                                value={visibleProjects.length}
                                label="On Portfolio"
                                description="Projects currently visible to visitors."
                            />

                            <StudioStat
                                value={hiddenProjects.length}
                                label="Hidden Work"
                                description="Projects kept private while you continue refining them."
                            />
                        </div>
                    </div>
                </section>

                {/* =====================================================
                    WORK INDEX
                ====================================================== */}

                <section>

                    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <div className="flex items-center gap-3">
                                <span className="h-px w-7 bg-[linear-gradient(90deg,#ffffff,transparent)]" />

                                <p className="text-[9px] uppercase tracking-[0.32em] text-zinc-600">
                                    Work Index
                                </p>
                            </div>

                            <h2 className="mt-3 text-2xl font-light tracking-[-0.035em] text-white">
                                Curated collection.
                            </h2>

                            <p className="mt-2 max-w-xl text-xs leading-5 text-zinc-700">
                                Each project contributes to the
                                creative identity presented through
                                your public portfolio.
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="hidden h-px w-10 bg-white/[0.08] sm:block" />

                            <div className="text-right">
                                <p className="text-sm font-light text-white">
                                    {String(projects.length).padStart(2, '0')}
                                </p>

                                <p className="mt-1 text-[8px] uppercase tracking-[0.25em] text-zinc-700">
                                    Works
                                </p>
                            </div>
                        </div>
                    </div>

                    {projects.length === 0 ? (
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
                                    Work Index / Empty
                                </p>

                                <h2 className="mt-3 text-xl font-light tracking-[-0.025em] text-white">
                                    Your space is waiting for
                                    its first project.
                                </h2>

                                <p className="mx-auto mt-3 max-w-md text-xs leading-5 text-zinc-600">
                                    Add your first piece of work and
                                    start shaping the creative identity
                                    people will discover on LIRA.
                                </p>

                                <Link
                                    href="/dashboard/projects/create"
                                    className="group mt-7 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-zinc-500 transition hover:text-white"
                                >
                                    Add your first project

                                    <ArrowRight className="h-3 w-3 transition duration-300 group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                            {projects.map((project, index) => (
                                <ProjectCard
                                    key={project.id}
                                    project={project}
                                    index={index}
                                />
                            ))}
                        </div>
                    )}
                </section>

                {/* =====================================================
                    PORTFOLIO PRESENTATION
                ====================================================== */}

                <section className="mt-16 border-t border-white/[0.07] pt-10">

                    <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">

                        <div>
                            <p className="text-[9px] uppercase tracking-[0.32em] text-zinc-700">
                                Portfolio Presentation
                            </p>

                            <h2 className="mt-3 text-xl font-light tracking-[-0.03em] text-white">
                                Decide what the world sees.
                            </h2>

                            <p className="mt-3 max-w-xl text-xs leading-5 text-zinc-600">
                                Visibility controls determine which
                                projects appear on your public LIRA
                                portfolio. Keep unfinished work private
                                until it is ready to represent you.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-5">
                            <div className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.45)]" />

                                <span className="text-[8px] uppercase tracking-[0.2em] text-zinc-600">
                                    {visibleProjects.length} Visible
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-zinc-700" />

                                <span className="text-[8px] uppercase tracking-[0.2em] text-zinc-700">
                                    {hiddenProjects.length} Hidden
                                </span>
                            </div>

                            <Link
                                href={`/@${profile.username}`}
                                className="group inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-zinc-500 transition hover:text-white"
                            >
                                View Portfolio

                                <ArrowRight className="h-3 w-3 transition duration-300 group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* =====================================================
                    FOOTER METADATA
                ====================================================== */}

                <footer className="mt-10 flex flex-col gap-3 border-t border-white/[0.05] pt-6 sm:flex-row sm:items-center sm:justify-between">

                    <p className="text-[9px] uppercase tracking-[0.22em] text-zinc-800">
                        LIRA / STUDIO / WORK ARCHIVE
                    </p>

                    <p className="text-[10px] text-zinc-800">
                        {projectTypes > 0
                            ? `${projectTypes} project ${projectTypes === 1
                                ? 'type'
                                : 'types'
                            } represented`
                            : 'Start building your collection'}
                    </p>
                </footer>
            </div>
        </DashboardLayout>
    );
}
