import { useLayoutEffect, useRef, useState } from 'react';

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

        return () => {
            resizeObserver.disconnect();
        };
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
                src={project.thumbnail ?? ''}
                alt={project.title}
                className="h-full w-full object-cover select-none"
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

interface PortfolioSettings {
    template: string;
    primary_color: string;
    background_color: string;
    text_color: string;
    accent_color: string;
    card_background_color: string;
    card_text_color: string;
    card_accent_color: string;
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
    portfolio_settings: PortfolioSettings;
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
        <main
            className="min-h-screen"
            style={{
                backgroundColor: profile.portfolio_settings.background_color,
                color: profile.portfolio_settings.text_color,
                '--portfolio-primary': profile.portfolio_settings.primary_color,
                '--portfolio-accent': profile.portfolio_settings.accent_color,
            } as React.CSSProperties}
        >
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
                        <h1
                            className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-8xl"
                            style={{
                                color: 'var(--portfolio-primary)',
                            }}
                        >
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
            <section
                className="border-t border-white/10 px-6 py-24 sm:px-8 lg:px-12"
                style={{
                    backgroundColor: profile.portfolio_settings.background_color,
                }}
            >
                <div className="mx-auto max-w-6xl">
                    <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
                        <div>
                            <p className="text-sm font-medium uppercase tracking-[0.3em] text-zinc-500">
                                About
                            </p>
                        </div>

                        <div>
                            {profile.bio ? (
                                <p
                                    className="text-2xl leading-relaxed sm:text-3xl"
                                    style={{
                                        color: profile.portfolio_settings.text_color,
                                    }}
                                >
                                    {profile.bio}
                                </p>
                            ) : (
                                <p
                                    className="text-xl"
                                    style={{
                                        color: profile.portfolio_settings.text_color,
                                    }}
                                >
                                    This artist hasn&apos;t added an introduction yet.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </section>
            {profile.projects.length > 0 && (
                <section
                    className="border-t border-white/10 px-6 py-24 sm:px-8 lg:px-12"
                    style={{
                        backgroundColor: profile.portfolio_settings.background_color,
                    }}
                >
                    <div className="mx-auto max-w-6xl">
                        <div className="mb-12">
                            <p className="text-sm font-medium uppercase tracking-[0.3em] text-zinc-500">
                                Selected Work
                            </p>

                            <h2
                                className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
                                style={{
                                    color: 'var(--portfolio-primary)',
                                }}
                            >
                                Projects
                            </h2>
                        </div>

                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {profile.projects.map((project, index) => (
                                <article
                                    key={project.id}
                                    className="group relative overflow-hidden rounded-xl border border-white/10 bg-black/20 transition-all duration-500 hover:-translate-y-1 hover:border-white/20"
                                    style={{
                                        backgroundColor:
                                            profile.portfolio_settings.card_background_color,
                                    }}
                                >
                                    <a
                                        href={`/@${profile.username}/project/${project.slug}`}
                                        className="block"
                                    >
                                        {/* Project Visual */}
                                        <div className="relative aspect-[4/3] overflow-hidden">
                                            {project.thumbnail ? (
                                                <>
                                                    <ProjectThumbnail project={project} />

                                                    {/* Image Overlay */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />

                                                    {/* Project Number */}
                                                    <span className="absolute right-5 top-5 text-xs font-medium tracking-[0.2em] text-white/50">
                                                        {String(index + 1).padStart(2, '0')}
                                                    </span>

                                                    {/* Hover Indicator */}
                                                    <div className="absolute bottom-5 right-5 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                                                        <span className="text-lg">↗</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <div
                                                    className="relative flex h-full w-full items-center justify-center overflow-hidden"
                                                    style={{
                                                        backgroundColor:
                                                            profile.portfolio_settings.background_color,
                                                    }}
                                                >
                                                    {/* Decorative Background */}
                                                    <div
                                                        className="absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-10 blur-3xl"
                                                        style={{
                                                            backgroundColor:
                                                                profile.portfolio_settings.primary_color,
                                                        }}
                                                    />

                                                    <div
                                                        className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full opacity-5 blur-3xl"
                                                        style={{
                                                            backgroundColor:
                                                                profile.portfolio_settings.accent_color,
                                                        }}
                                                    />

                                                    {/* Project Type */}
                                                    <div className="relative z-10 text-center">
                                                        <p
                                                            className="text-[10px] font-medium uppercase tracking-[0.35em]"
                                                            style={{
                                                                color:
                                                                    profile.portfolio_settings.card_text_color,
                                                            }}
                                                        >
                                                            {project.project_type ?? 'Project'}
                                                        </p>

                                                        <div
                                                            className="mx-auto mt-4 h-px w-10"
                                                            style={{
                                                                backgroundColor:
                                                                    profile.portfolio_settings.primary_color,
                                                            }}
                                                        />
                                                    </div>

                                                    {/* Project Number */}
                                                    <span className="absolute right-5 top-5 text-xs font-medium tracking-[0.2em] text-white/20">
                                                        {String(index + 1).padStart(2, '0')}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Project Information */}
                                        <div className="p-6 sm:p-7">
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    {project.project_type && (
                                                        <p
                                                            className="text-[10px] font-medium uppercase tracking-[0.3em]"
                                                            style={{
                                                                color:
                                                                    profile.portfolio_settings.card_text_color,
                                                            }}
                                                        >
                                                            {project.project_type}
                                                        </p>
                                                    )}

                                                    <h3
                                                        className="mt-2 text-xl font-semibold tracking-tight transition-opacity duration-300 group-hover:opacity-80"
                                                        style={{
                                                            color:
                                                                profile.portfolio_settings.card_accent_color,
                                                        }}
                                                    >
                                                        {project.title}
                                                    </h3>
                                                </div>

                                                <span
                                                    className="mt-1 text-sm opacity-40 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                                                    style={{
                                                        color:
                                                            profile.portfolio_settings.card_accent_color,
                                                    }}
                                                >
                                                    →
                                                </span>
                                            </div>

                                            {project.description && (
                                                <p
                                                    className="mt-4 line-clamp-2 text-sm leading-relaxed opacity-70"
                                                    style={{
                                                        color:
                                                            profile.portfolio_settings.card_text_color,
                                                    }}
                                                >
                                                    {project.description}
                                                </p>
                                            )}

                                            <div
                                                className="mt-6 border-t pt-4"
                                                style={{
                                                    borderColor: 'rgba(255,255,255,0.08)',
                                                }}
                                            >
                                                <span
                                                    className="text-[10px] font-medium uppercase tracking-[0.25em] opacity-50"
                                                    style={{
                                                        color:
                                                            profile.portfolio_settings.card_text_color,
                                                    }}
                                                >
                                                    View Project
                                                </span>
                                            </div>
                                        </div>
                                    </a>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </main>
    );
}
