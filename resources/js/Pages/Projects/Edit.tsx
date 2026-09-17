import { FormEvent, useState } from 'react';
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
    project: Project;
}

export default function Edit({ project }: Props) {
    const [title, setTitle] = useState(project.title);
    const [description, setDescription] = useState(project.description ?? '');
    const [projectType, setProjectType] = useState(project.project_type ?? '');
    const [url, setUrl] = useState(project.url ?? '');

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        router.put(`/dashboard/projects/${project.id}`, {
            title,
            description,
            project_type: projectType,
            url,
        });
    }

    return (
        <main className="min-h-screen bg-zinc-950 px-6 py-12 text-white sm:px-8 lg:px-12">
            <div className="mx-auto max-w-3xl">
                <Link
                    href="/dashboard/projects"
                    className="text-sm text-zinc-500 transition hover:text-white"
                >
                    ← Back to Projects
                </Link>

                <div className="mt-10">
                    <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
                        Portfolio
                    </p>

                    <h1 className="mt-2 text-4xl font-bold tracking-tight">
                        Edit Project
                    </h1>

                    <p className="mt-3 text-zinc-400">
                        Update your project details.
                    </p>
                </div>

                <form onSubmit={submit} className="mt-10 space-y-6">
                    <div>
                        <label
                            htmlFor="title"
                            className="mb-2 block text-sm font-medium text-zinc-300"
                        >
                            Title
                        </label>

                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            required
                            className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-white/30"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="project_type"
                            className="mb-2 block text-sm font-medium text-zinc-300"
                        >
                            Project Type
                        </label>

                        <input
                            id="project_type"
                            type="text"
                            value={projectType}
                            onChange={(event) => setProjectType(event.target.value)}
                            placeholder="e.g. Music, Artwork, Website"
                            className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-white/30"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="description"
                            className="mb-2 block text-sm font-medium text-zinc-300"
                        >
                            Description
                        </label>

                        <textarea
                            id="description"
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                            rows={6}
                            className="w-full resize-none rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-white/30"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="url"
                            className="mb-2 block text-sm font-medium text-zinc-300"
                        >
                            Project URL
                        </label>

                        <input
                            id="url"
                            type="url"
                            value={url}
                            onChange={(event) => setUrl(event.target.value)}
                            placeholder="https://..."
                            className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-white/30"
                        />
                    </div>

                    <div className="flex items-center gap-4 pt-4">
                        <Link
                            href="/dashboard/projects"
                            className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-zinc-300 transition hover:border-white/20 hover:text-white"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}
