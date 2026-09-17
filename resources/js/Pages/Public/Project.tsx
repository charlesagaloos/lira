interface Profile {
    username: string;
    display_name: string;
}

interface Project {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    project_type: string | null;
    thumbnail: string | null;
    url: string | null;
}

interface Props {
    profile: Profile;
    project: Project;
}

export default function Project({ profile, project }: Props) {
    return (
        <main className="min-h-screen bg-zinc-950 text-white">
            <section className="border-b border-white/10 px-6 py-16 sm:px-8 lg:px-12">
                <div className="mx-auto max-w-4xl">
                    <a
                        href={`/@${profile.username}`}
                        className="text-sm text-zinc-500 transition hover:text-white"
                    >
                        ← Back to {profile.display_name}
                    </a>

                    {project.project_type && (
                        <p className="mt-12 text-sm font-medium uppercase tracking-[0.3em] text-zinc-500">
                            {project.project_type}
                        </p>
                    )}

                    <h1 className="mt-4 text-5xl font-bold tracking-tight sm:text-6xl">
                        {project.title}
                    </h1>

                    {project.description && (
                        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-zinc-400 sm:text-xl">
                            {project.description}
                        </p>
                    )}
                </div>
            </section>

            {project.thumbnail && (
                <section className="px-6 py-12 sm:px-8 lg:px-12">
                    <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl">
                        <img
                            src={project.thumbnail}
                            alt={project.title}
                            className="h-auto w-full object-cover"
                        />
                    </div>
                </section>
            )}

            {project.url && (
                <section className="px-6 pb-20 sm:px-8 lg:px-12">
                    <div className="mx-auto max-w-4xl">
                        <a
                            href={project.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
                        >
                            Visit Project
                        </a>
                    </div>
                </section>
            )}
        </main>
    );
}
