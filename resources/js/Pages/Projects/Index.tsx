import { Link, router } from '@inertiajs/react';
import { useLayoutEffect, useRef, useState } from 'react';

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
    projects: Project[];
}

function ProjectThumbnail({ project }: { project: Project }) {
    const containerRef = useRef<HTMLDivElement | null>(null);

    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(0);

    useLayoutEffect(() => {
        const container = containerRef.current;

        if (!container) {
            return;
        }

        const updateOffsets = () => {
            setOffsetX(
                (project.thumbnail_offset_x / 100) *
                container.clientWidth,
            );

            setOffsetY(
                (project.thumbnail_offset_y / 100) *
                container.clientHeight,
            );
        };

        updateOffsets();

        const resizeObserver = new ResizeObserver(updateOffsets);

        resizeObserver.observe(container);

        return () => resizeObserver.disconnect();
    }, [
        project.thumbnail_offset_x,
        project.thumbnail_offset_y,
    ]);

    return (
        <div
            ref={containerRef}
            className="relative aspect-[4/3] overflow-hidden"
        >
            <img
                src={`/storage/${project.thumbnail}`}
                alt={project.title}
                className="h-full w-full select-none object-cover"
                draggable={false}
                style={{
                    objectPosition: `${project.thumbnail_position_x}% ${project.thumbnail_position_y}%`,
                    transform: `
                        translate(${offsetX}px, ${offsetY}px)
                        scale(${project.thumbnail_zoom / 100})
                    `,
                    transformOrigin: 'center',
                }}
            />
        </div>
    );
}

export default function Index({ projects }: Props) {
    return (
        <main className="min-h-screen bg-zinc-950 px-6 py-12 text-white sm:px-8 lg:px-12">
            <div className="mx-auto max-w-6xl">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
                            Portfolio
                        </p>

                        <h1 className="mt-2 text-4xl font-bold tracking-tight">
                            Projects
                        </h1>
                    </div>

                    <Link
                        href="/dashboard/projects/create"
                        className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
                    >
                        Add Project
                    </Link>
                </div>

                {projects.length === 0 ? (
                    <div className="mt-12 rounded-2xl border border-white/10 bg-zinc-900 p-12 text-center">
                        <h2 className="text-xl font-semibold">
                            No projects yet
                        </h2>

                        <p className="mt-2 text-zinc-400">
                            Start building your portfolio by adding your first
                            project.
                        </p>
                    </div>
                ) : (
                    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {projects.map((project) => (
                            <article
                                key={project.id}
                                className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900"
                            >
                                {project.thumbnail ? (
                                    <ProjectThumbnail
                                        project={project}
                                    />
                                ) : (
                                    <div className="flex aspect-[4/3] items-center justify-center bg-zinc-800">
                                        <span className="text-sm uppercase tracking-[0.2em] text-zinc-500">
                                            {project.project_type ?? 'Project'}
                                        </span>
                                    </div>
                                )}

                                <div className="p-6">
                                    {project.project_type && (
                                        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                                            {project.project_type}
                                        </p>
                                    )}

                                    <h2 className="mt-2 text-xl font-semibold">
                                        {project.title}
                                    </h2>

                                    {project.description && (
                                        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-zinc-400">
                                            {project.description}
                                        </p>
                                    )}

                                    <div className="mt-6 flex items-center gap-4 text-sm">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                router.get(
                                                    `/dashboard/projects/${project.id}/edit`,
                                                );
                                            }}
                                            className="text-zinc-300 transition hover:text-white"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (
                                                    window.confirm(
                                                        `Delete "${project.title}"?`,
                                                    )
                                                ) {
                                                    router.delete(
                                                        `/dashboard/projects/${project.id}`,
                                                    );
                                                }
                                            }}
                                            className="text-zinc-500 transition hover:text-red-400"
                                        >
                                            Delete
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                router.patch(
                                                    `/dashboard/projects/${project.id}/visibility`,
                                                );
                                            }}
                                            className={
                                                project.is_visible
                                                    ? 'text-emerald-400 transition hover:text-emerald-300'
                                                    : 'text-zinc-500 transition hover:text-zinc-300'
                                            }
                                        >
                                            {project.is_visible
                                                ? 'Visible'
                                                : 'Hidden'}
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
