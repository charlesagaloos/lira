import { Head } from '@inertiajs/react';
import type { CSSProperties, ReactNode } from 'react';

interface PortfolioSettings {
    template: string;
    background_color: string;
    text_color: string;
    primary_color: string;
    accent_color: string;
    hover_color: string;
    surface_color: string;
    muted_text_color: string;
    border_color: string;
    card_background_color: string;
    card_text_color: string;
    card_accent_color: string;
    card_primary_color: string;
    card_hover_color: string;
}

interface Profile {
    username: string;
    display_name: string;
    portfolio_settings: PortfolioSettings;
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

interface Props {
    profile: Profile;
    project: Project;
}

function getImageUrl(path: string | null): string | null {
    if (!path) {
        return null;
    }

    if (/^(https?:|data:|blob:)/.test(path) || path.startsWith('/')) {
        return path;
    }

    return `/storage/${path.replace(/^\/+/, '')}`;
}

function ProjectImage({
    project,
    className = '',
    style,
}: {
    project: Project;
    className?: string;
    style?: CSSProperties;
}) {
    const imageUrl = getImageUrl(project.thumbnail);

    if (!imageUrl) {
        return (
            <div
                className={`flex min-h-64 items-center justify-center ${className}`}
                style={{
                    ...style,
                    backgroundColor: 'var(--project-surface)',
                    color: 'var(--project-muted)',
                }}
            >
                <span className="text-[9px] uppercase tracking-[0.3em]">
                    {project.project_type || 'Selected work'}
                </span>
            </div>
        );
    }

    return (
        <div
            className={`relative overflow-hidden ${className}`}
            style={style}
        >
            <img
                src={imageUrl}
                alt={project.title}
                className="absolute inset-0 h-full w-full object-cover"
                style={{
                    objectPosition: `${project.thumbnail_position_x}% ${project.thumbnail_position_y}%`,
                    transform: `translate(${project.thumbnail_offset_x}%, ${project.thumbnail_offset_y}%) scale(${project.thumbnail_zoom / 100})`,
                    transformOrigin: 'center',
                }}
            />
        </div>
    );
}

function BackLink({
    username,
    displayName,
    className = '',
    style,
}: {
    username: string;
    displayName: string;
    className?: string;
    style?: CSSProperties;
}) {
    return (
        <a
            href={`/@${username}`}
            className={`inline-flex items-center gap-3 transition-opacity hover:opacity-60 ${className}`}
            style={style}
        >
            <span aria-hidden="true">←</span>
            <span>Back to {displayName}</span>
        </a>
    );
}

function ProjectLink({
    url,
    className = '',
    children = 'Visit project',
    style,
}: {
    url: string;
    className?: string;
    children?: ReactNode;
    style?: CSSProperties;
}) {
    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-3 transition-opacity hover:opacity-60 ${className}`}
            style={style}
        >
            {children}
            <span aria-hidden="true">↗</span>
        </a>
    );
}

function DefaultProject({
    profile,
    project,
}: Props) {
    return (
        <div className="mx-auto max-w-6xl px-5 pb-20 pt-8 sm:px-8 sm:pt-12 lg:px-12">
            <BackLink
                username={profile.username}
                displayName={profile.display_name}
                className="text-[9px] uppercase tracking-[0.2em]"
                style={{ color: 'var(--project-muted)' }}
            />
            <div className="mx-auto mt-16 max-w-4xl text-center sm:mt-24">
                <p
                    className="text-[9px] uppercase tracking-[0.35em]"
                    style={{ color: 'var(--project-accent)' }}
                >
                    {project.project_type || 'Selected work'}
                </p>
                <h1 className="mt-6 text-balance text-5xl font-light leading-[0.95] tracking-[-0.065em] sm:text-7xl lg:text-8xl">
                    {project.title}
                </h1>
                {project.description && (
                    <p
                        className="mx-auto mt-7 max-w-2xl whitespace-pre-line text-sm leading-7 sm:text-base"
                        style={{ color: 'var(--project-muted)' }}
                    >
                        {project.description}
                    </p>
                )}
            </div>
            <ProjectImage
                project={project}
                className="mt-12 aspect-[16/10] border"
                style={{ borderColor: 'var(--project-border)' }}
            />
            {project.url && (
                <div className="mt-8 flex justify-end">
                    <ProjectLink
                        url={project.url}
                        className="border-b pb-2 text-[9px] uppercase tracking-[0.2em]"
                        style={{
                            color: 'var(--project-text)',
                            borderColor: 'var(--project-accent)',
                        }}
                    />
                </div>
            )}
        </div>
    );
}

function EditorialProject({
    profile,
    project,
}: Props) {
    return (
        <div className="mx-auto max-w-[1600px] px-5 pb-24 pt-8 sm:px-8 sm:pt-12 lg:px-12 lg:pb-32">
            <div
                className="flex items-center justify-between border-b pb-5"
                style={{ borderColor: 'var(--project-border)' }}
            >
                <BackLink
                    username={profile.username}
                    displayName={profile.display_name}
                    className="text-[8px] uppercase tracking-[0.18em]"
                />
                <span
                    className="hidden text-[8px] uppercase tracking-[0.2em] sm:inline"
                    style={{ color: 'var(--project-muted)' }}
                >
                    {profile.display_name} / Selected work
                </span>
            </div>
            <header className="grid gap-8 py-14 sm:py-20 lg:grid-cols-[0.35fr_1fr] lg:gap-14 lg:py-28">
                <div>
                    <p
                        className="text-[8px] font-semibold uppercase tracking-[0.3em]"
                        style={{ color: 'var(--project-accent)' }}
                    >
                        Project / {project.project_type || 'Work'}
                    </p>
                    <p
                        className="mt-5 text-[8px] uppercase tracking-[0.2em]"
                        style={{ color: 'var(--project-muted)' }}
                    >
                        {profile.display_name}
                    </p>
                </div>
                <div>
                    <h1 className="max-w-5xl font-serif text-5xl font-medium leading-[0.9] tracking-[-0.055em] sm:text-7xl lg:text-[clamp(5rem,10vw,10rem)]">
                        {project.title}
                    </h1>
                    {project.description && (
                        <p
                            className="mt-8 max-w-2xl whitespace-pre-line text-base leading-7 sm:ml-[18%] sm:text-lg"
                            style={{ color: 'var(--project-muted)' }}
                        >
                            {project.description}
                        </p>
                    )}
                </div>
            </header>
            <ProjectImage
                project={project}
                className="aspect-[16/10] border-y"
                style={{ borderColor: 'var(--project-border)' }}
            />
            <div className="mt-6 flex flex-wrap items-center justify-between gap-5 border-b pb-5">
                <span
                    className="text-[8px] uppercase tracking-[0.25em]"
                    style={{ color: 'var(--project-muted)' }}
                >
                    {profile.display_name} — {project.project_type || 'Project'}
                </span>
                {project.url && (
                    <ProjectLink
                        url={project.url}
                        className="text-[8px] font-semibold uppercase tracking-[0.2em]"
                    />
                )}
            </div>
        </div>
    );
}

function CanvasProject({
    profile,
    project,
}: Props) {
    return (
        <div className="relative mx-auto max-w-6xl px-5 pb-24 pt-8 sm:px-8 sm:pt-12 lg:px-12">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.08]"
                style={{
                    backgroundImage:
                        'radial-gradient(circle, currentColor 1px, transparent 1.5px)',
                    backgroundSize: '15px 15px',
                }}
            />
            <div className="relative">
                <BackLink
                    username={profile.username}
                    displayName={profile.display_name}
                    className="canvas-hand text-sm"
                />
                <div className="relative mx-auto mt-14 max-w-5xl sm:mt-20">
                    <div
                        className="absolute -right-2 -top-5 z-10 border px-4 py-2 text-[8px] uppercase tracking-[0.2em] sm:-right-5"
                        style={{
                            backgroundColor: 'var(--project-accent)',
                            borderColor: 'var(--project-border)',
                            color: 'var(--project-background)',
                            transform: 'rotate(4deg)',
                        }}
                    >
                        {project.project_type || 'Made by hand'}
                    </div>
                    <div
                        className="border p-3 shadow-[12px_16px_0_rgba(0,0,0,0.22)] sm:p-5"
                        style={{
                            backgroundColor: 'var(--project-surface)',
                            borderColor: 'var(--project-border)',
                            transform: 'rotate(-1deg)',
                        }}
                    >
                        <ProjectImage
                            project={project}
                            className="aspect-[4/3]"
                        />
                        <div className="px-2 pb-2 pt-5 sm:px-4 sm:pt-7">
                            <p className="canvas-hand text-center text-sm sm:text-base">
                                {project.title}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="mx-auto mt-14 grid max-w-5xl gap-8 sm:mt-20 sm:grid-cols-[1fr_auto] sm:items-end">
                    <div>
                        <p
                            className="text-[8px] uppercase tracking-[0.25em]"
                            style={{ color: 'var(--project-accent)' }}
                        >
                            A project by {profile.display_name}
                        </p>
                        {project.description && (
                            <p
                                className="canvas-hand mt-4 max-w-2xl whitespace-pre-line text-lg leading-8"
                                style={{ color: 'var(--project-muted)' }}
                            >
                                {project.description}
                            </p>
                        )}
                    </div>
                    {project.url && (
                        <ProjectLink
                            url={project.url}
                            className="justify-self-start border px-5 py-3 text-[8px] uppercase tracking-[0.18em] sm:justify-self-end"
                            style={{
                                borderColor: 'var(--project-border)',
                                color: 'var(--project-text)',
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

function MotionProject({
    profile,
    project,
}: Props) {
    return (
        <div className="mx-auto max-w-[1500px] px-5 pb-24 pt-8 sm:px-8 sm:pt-12 lg:px-14">
            <div className="flex items-center justify-between gap-4">
                <BackLink
                    username={profile.username}
                    displayName={profile.display_name}
                    className="text-[8px] uppercase tracking-[0.22em]"
                />
                <span
                    className="text-[8px] uppercase tracking-[0.2em]"
                    style={{ color: 'var(--project-muted)' }}
                >
                    {profile.display_name} / 01
                </span>
            </div>
            <header className="grid items-end gap-8 py-16 sm:py-24 lg:grid-cols-[auto_1fr] lg:gap-12 lg:py-32">
                <span
                    className="text-[clamp(4rem,14vw,12rem)] font-light leading-[0.72] tracking-[-0.1em]"
                    style={{ color: 'var(--project-accent)' }}
                >
                    01
                </span>
                <div>
                    <p
                        className="text-[8px] uppercase tracking-[0.3em]"
                        style={{ color: 'var(--project-muted)' }}
                    >
                        {project.project_type || 'Selected project'}
                    </p>
                    <h1 className="mt-5 max-w-6xl text-5xl font-light leading-[0.88] tracking-[-0.07em] sm:text-7xl lg:text-[clamp(5rem,10vw,10rem)]">
                        {project.title}
                    </h1>
                </div>
            </header>
            <ProjectImage
                project={project}
                className="aspect-[16/9]"
            />
            <div
                className="mt-8 grid gap-8 border-t pt-7 sm:grid-cols-[1fr_auto] sm:items-start"
                style={{ borderColor: 'var(--project-border)' }}
            >
                <div>
                    <p
                        className="text-[8px] uppercase tracking-[0.25em]"
                        style={{ color: 'var(--project-accent)' }}
                    >
                        Project notes
                    </p>
                    {project.description && (
                        <p
                            className="mt-4 max-w-3xl whitespace-pre-line text-sm leading-7"
                            style={{ color: 'var(--project-muted)' }}
                        >
                            {project.description}
                        </p>
                    )}
                </div>
                {project.url && (
                    <ProjectLink
                        url={project.url}
                        className="border px-5 py-3 text-[8px] uppercase tracking-[0.2em]"
                        style={{
                            borderColor: 'var(--project-border)',
                            color: 'var(--project-text)',
                        }}
                    />
                )}
            </div>
        </div>
    );
}

function MusicianProject({
    profile,
    project,
}: Props) {
    return (
        <div className="mx-auto max-w-[1400px] px-5 pb-24 pt-8 sm:px-8 sm:pt-12 lg:px-12">
            <div
                className="flex flex-wrap items-center justify-between gap-4 border-y py-4"
                style={{ borderColor: 'var(--project-border)' }}
            >
                <BackLink
                    username={profile.username}
                    displayName={profile.display_name}
                    className="text-[8px] font-bold uppercase tracking-[0.2em]"
                />
                <span
                    className="text-[8px] font-bold uppercase tracking-[0.2em]"
                    style={{ color: 'var(--project-accent)' }}
                >
                    {profile.display_name} / Project archive
                </span>
            </div>
            <div className="grid gap-10 py-12 sm:py-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(300px,0.95fr)] lg:items-center lg:gap-16 lg:py-24">
                <div
                    className="relative aspect-square border p-3 sm:p-5"
                    style={{
                        backgroundColor: 'var(--project-surface)',
                        borderColor: 'var(--project-border)',
                    }}
                >
                    <ProjectImage
                        project={project}
                        className="h-full w-full"
                    />
                    <span
                        className="absolute bottom-7 left-7 border px-3 py-2 text-[7px] font-bold uppercase tracking-[0.2em] backdrop-blur"
                        style={{
                            backgroundColor: 'var(--project-background)',
                            borderColor: 'var(--project-border)',
                            color: 'var(--project-text)',
                        }}
                    >
                        {project.project_type || 'Project'}
                    </span>
                </div>
                <div>
                    <p
                        className="text-[8px] font-bold uppercase tracking-[0.3em]"
                        style={{ color: 'var(--project-accent)' }}
                    >
                        The work / 01
                    </p>
                    <h1 className="mt-6 break-words text-5xl font-black uppercase leading-[0.82] tracking-[-0.075em] sm:text-7xl lg:text-[clamp(4.5rem,8vw,8rem)]">
                        {project.title}
                    </h1>
                    <p
                        className="mt-5 text-[8px] font-bold uppercase tracking-[0.23em]"
                        style={{ color: 'var(--project-muted)' }}
                    >
                        Created by {profile.display_name}
                    </p>
                    {project.description && (
                        <p
                            className="mt-8 whitespace-pre-line text-sm leading-7"
                            style={{ color: 'var(--project-muted)' }}
                        >
                            {project.description}
                        </p>
                    )}
                    {project.url && (
                        <ProjectLink
                            url={project.url}
                            className="mt-9 border-2 px-6 py-4 text-[8px] font-bold uppercase tracking-[0.22em]"
                            style={{
                                borderColor: 'var(--project-text)',
                                color: 'var(--project-text)',
                            }}
                        >
                            Explore project
                        </ProjectLink>
                    )}
                </div>
            </div>
        </div>
    );
}

const templateLayouts: Record<string, (props: Props) => ReactNode> = {
    default: (props) => <DefaultProject {...props} />,
    editorial: (props) => <EditorialProject {...props} />,
    canvas: (props) => <CanvasProject {...props} />,
    motion: (props) => <MotionProject {...props} />,
    musician: (props) => <MusicianProject {...props} />,
};

export default function ProjectPage({ profile, project }: Props) {
    const settings = profile.portfolio_settings;
    const template = templateLayouts[settings.template] ?? templateLayouts.default;

    const pageStyle = {
        backgroundColor: settings.background_color,
        color: settings.text_color,
        '--project-background': settings.background_color,
        '--project-text': settings.text_color,
        '--project-primary': settings.primary_color,
        '--project-accent': settings.accent_color,
        '--project-hover': settings.hover_color,
        '--project-surface': settings.surface_color,
        '--project-muted': settings.muted_text_color,
        '--project-border': settings.border_color,
        '--project-card': settings.card_background_color,
        '--project-card-text': settings.card_text_color,
        '--project-card-accent': settings.card_accent_color,
        '--project-card-primary': settings.card_primary_color,
        '--project-card-hover': settings.card_hover_color,
    } as CSSProperties;

    return (
        <>
            <Head title={`${project.title} — ${profile.display_name}`} />
            <main
                className={`project-page project-page-${settings.template} min-h-screen overflow-hidden`}
                style={pageStyle}
            >
                {settings.template === 'canvas' && (
                    <style>{`
                        .project-page-canvas {
                            position: relative;
                            isolation: isolate;
                            background-image:
                                radial-gradient(circle at 15% 20%, rgba(255,255,255,0.055) 0 1px, transparent 1.5px),
                                radial-gradient(circle at 70% 80%, rgba(255,255,255,0.04) 0 1px, transparent 1.5px),
                                repeating-linear-gradient(0deg, rgba(255,255,255,0.018) 0 1px, transparent 1px 5px),
                                repeating-linear-gradient(90deg, rgba(0,0,0,0.018) 0 1px, transparent 1px 7px);
                            background-size: 13px 13px, 17px 17px, auto, auto;
                        }

                        .project-page-canvas .canvas-hand {
                            font-family: 'Segoe Print', 'Comic Sans MS', cursive;
                        }
                    `}</style>
                )}
                {template({ profile, project })}
            </main>
        </>
    );
}
