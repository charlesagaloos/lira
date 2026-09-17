import { Link, router } from '@inertiajs/react';

interface Project {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    project_type: string | null;
    thumbnail: string | null;
    url: string | null;
    position: number;
    is_visible: boolean;
}

interface Props {
    projects: Project[];
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
                                    <img
                                        src={project.thumbnail}
                                        alt={project.title}
                                        className="aspect-[4/3] w-full object-cover"
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
                                            {project.is_visible ? 'Visible' : 'Hidden'}
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
