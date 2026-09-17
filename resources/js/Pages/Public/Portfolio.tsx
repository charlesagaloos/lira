interface Project {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    project_type: string | null;
    thumbnail: string | null;
    url: string | null;
}

interface Profile {
    username: string;
    display_name: string;
    bio: string | null;
    artist_type: string | null;
    location: string | null;
    website: string | null;
    avatar: string | null;
    cover_image: string | null;
    projects: Project[];
}

interface Props {
    profile: Profile;
}

export default function Portfolio({ profile }: Props) {
    const initials = profile.display_name
        .split(' ')
        .map((name) => name[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    return (
        <main className="min-h-screen bg-zinc-950 text-white">
            <section className="relative flex min-h-screen items-end overflow-hidden">
                {/* Cover Image */}
                {profile.cover_image ? (
                    <img
                        src={profile.cover_image}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 via-zinc-950 to-black" />
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/20" />

                {/* Content */}
                <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-16 sm:px-8 lg:px-12">
                    <div className="max-w-4xl">
                        {/* Avatar */}
                        {profile.avatar ? (
                            <img
                                src={profile.avatar}
                                alt={profile.display_name}
                                className="mb-6 h-20 w-20 rounded-full object-cover ring-2 ring-white/20 sm:h-24 sm:w-24"
                            />
                        ) : (
                            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/10 text-xl font-semibold text-white ring-2 ring-white/20 sm:h-24 sm:w-24 sm:text-2xl">
                                {initials}
                            </div>
                        )}

                        {/* Username */}
                        <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-zinc-400">
                            @{profile.username}
                        </p>

                        {/* Artist Name */}
                        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-8xl">
                            {profile.display_name}
                        </h1>

                        {/* Artist Metadata */}
                        {(profile.artist_type || profile.location) && (
                            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-zinc-300">
                                {profile.artist_type && (
                                    <span>{profile.artist_type}</span>
                                )}

                                {profile.artist_type && profile.location && (
                                    <span className="px-1 text-zinc-500">•</span>
                                )}

                                {profile.location && (
                                    <span>{profile.location}</span>
                                )}
                            </div>
                        )}

                        {/* Website */}
                        {profile.website && (
                            <div className="mt-8">
                                <a
                                    href={profile.website}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
                                >
                                    Visit Website
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 text-zinc-500 sm:block">
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-[10px] uppercase tracking-[0.3em]">
                            Explore
                        </span>

                        <div className="h-8 w-px bg-zinc-600" />
                    </div>
                </div>
            </section>
            <section className="border-t border-white/10 bg-zinc-950 px-6 py-24 sm:px-8 lg:px-12">
                <div className="mx-auto max-w-6xl">
                    <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
                        <div>
                            <p className="text-sm font-medium uppercase tracking-[0.3em] text-zinc-500">
                                About
                            </p>
                        </div>

                        <div>
                            {profile.bio ? (
                                <p className="text-2xl leading-relaxed text-zinc-200 sm:text-3xl">
                                    {profile.bio}
                                </p>
                            ) : (
                                <p className="text-xl text-zinc-500">
                                    This artist hasn&apos;t added an introduction yet.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </section>
            {profile.projects.length > 0 && (
                <section className="border-t border-white/10 bg-zinc-900 px-6 py-24 sm:px-8 lg:px-12">
                    <div className="mx-auto max-w-6xl">
                        <div className="mb-12">
                            <p className="text-sm font-medium uppercase tracking-[0.3em] text-zinc-500">
                                Selected Work
                            </p>

                            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                                Projects
                            </h2>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {profile.projects.map((project) => (
                                <a
                                    key={project.id}
                                    href={`/@${profile.username}/project/${project.slug}`}
                                    className="group block overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 transition hover:border-white/20"
                                >
                                    {project.thumbnail ? (
                                        <img
                                            src={project.thumbnail}
                                            alt={project.title}
                                            className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105"
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
                                            <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
                                                {project.project_type}
                                            </p>
                                        )}

                                        <h3 className="mt-2 text-xl font-semibold transition group-hover:text-zinc-300">
                                            {project.title}
                                        </h3>

                                        {project.description && (
                                            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-zinc-400">
                                                {project.description}
                                            </p>
                                        )}

                                        {project.url && (
                                            <a
                                                href={project.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="mt-5 inline-flex text-sm font-medium text-white underline decoration-zinc-600 underline-offset-4 transition hover:decoration-white"
                                            >
                                                View Project
                                            </a>
                                        )}
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </main>
    );
}
