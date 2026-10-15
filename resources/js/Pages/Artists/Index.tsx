import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import usePublicTheme from '../../lib/usePublicTheme';

interface Artist {
    id: number;
    username: string;
    display_name: string;
    artist_type: string | null;
    location: string | null;
    avatar: string | null;
    cover_image: string | null;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedArtists {
    data: Artist[];
    current_page: number;
    last_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: PaginationLink[];
}

interface Props {
    artists: PaginatedArtists;
    artistTypes: string[];
    filters: {
        search: string;
        type: string;
    };
}

function ArrowUpRight() {
    return (
        <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
            <path d="M5 15L15 5M7 5H15V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function SearchIcon() {
    return (
        <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
            <circle cx="8.8" cy="8.8" r="5.8" stroke="currentColor" strokeWidth="1.4" />
            <path d="m13.2 13.2 4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
    );
}

function imageUrl(path: string | null) {
    if (!path) return null;
    return path.startsWith('http://') || path.startsWith('https://') || path.startsWith('/')
        ? path
        : `/storage/${path}`;
}

export default function Index({ artists, artistTypes, filters }: Props) {
    const { theme, toggleTheme } = usePublicTheme();
    const [search, setSearch] = useState(filters.search);

    useEffect(() => {
        setSearch(filters.search);
    }, [filters.search]);

    useEffect(() => {
        const normalizedSearch = search.trim();
        if (normalizedSearch === filters.search) return;

        const timer = window.setTimeout(() => {
            router.get('/artists', {
                search: normalizedSearch || undefined,
                type: filters.type === 'all' ? undefined : filters.type,
            }, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }, 300);

        return () => window.clearTimeout(timer);
    }, [search, filters.search, filters.type]);

    function selectType(type: string) {
        router.get('/artists', {
            search: search.trim() || undefined,
            type: type === 'all' ? undefined : type,
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    }

    const previousPage = artists.links[0];
    const nextPage = artists.links[artists.links.length - 1];
    const pageLinks = artists.links.slice(1, -1);

    return (
        <main className="public-site min-h-screen overflow-hidden bg-[#030405] text-white" data-public-theme={theme}>
            <Head title="Explore Artists" />
            <Header theme={theme} onToggleTheme={toggleTheme} />

            <section className="relative isolate overflow-hidden border-b border-white/10 pt-[76px]">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -right-[10%] top-0 h-[700px] w-[700px] rounded-full bg-[radial-gradient(circle,rgba(70,210,255,0.08),rgba(145,90,255,0.05)_34%,transparent_70%)] blur-[90px]" />
                    <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_8%,rgba(40,220,255,0.014)_28%,rgba(120,80,255,0.02)_42%,rgba(255,70,190,0.014)_53%,transparent_75%)]" />
                </div>

                <div className="relative mx-auto max-w-[1920px] px-6 pb-14 pt-20 sm:px-10 sm:pb-20 lg:px-20 lg:pt-28">
                    <Link href="/" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-zinc-500 transition hover:text-white">
                        <span aria-hidden="true">←</span>
                        Back to LIRA
                    </Link>

                    <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_0.65fr] lg:items-end">
                        <div>
                            <p className="mb-5 flex items-center gap-3 text-[10px] uppercase tracking-[0.38em] text-zinc-500">
                                <span className="h-px w-8 bg-[linear-gradient(90deg,#35dfff,#9b5cff,#f05abf)]" />
                                LIRA / ARTIST DIRECTORY
                            </p>
                            <h1 className="max-w-4xl text-5xl font-semibold leading-[0.92] tracking-[-0.07em] sm:text-7xl lg:text-8xl">
                                Find your
                                <br />
                                <span className="public-title-gradient bg-[linear-gradient(102deg,#ffffff_0%,#8a979f_18%,#ffffff_32%,#5ee6ff_46%,#a855f7_60%,#f05abf_73%,#ffffff_90%)] bg-clip-text text-transparent">
                                    people.
                                </span>
                            </h1>
                            <p className="mt-6 max-w-xl text-sm leading-7 text-zinc-400 sm:text-base">
                                Explore independent artists, discover their work, and connect with creative worlds across LIRA.
                            </p>
                        </div>

                        <div className="public-directory-search-card rounded-2xl border border-white/10 bg-white/[0.025] p-3 backdrop-blur-xl">
                            <label htmlFor="artist-search" className="mb-2 block px-2 text-[9px] uppercase tracking-[0.2em] text-zinc-500">
                                Search artists
                            </label>
                            <div className="relative">
                                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                                    <SearchIcon />
                                </span>
                                <input
                                    id="artist-search"
                                    type="search"
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder="Name, artist type, or location"
                                    maxLength={100}
                                    className="public-directory-search-input h-12 w-full rounded-xl border border-white/10 bg-black/30 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-cyan-200/40"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-[1920px] px-6 py-12 sm:px-10 sm:py-16 lg:px-20 lg:py-20">
                <div className="flex flex-col gap-5 border-b border-white/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.32em] text-zinc-500">Browse by discipline</p>
                        <p className="mt-2 text-sm text-zinc-400">
                            {artists.total} {artists.total === 1 ? 'artist' : 'artists'} in the community
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2" aria-label="Filter artists by type">
                        {['all', ...artistTypes].map((type) => {
                            const active = filters.type === type;
                            return (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => selectType(type)}
                                    aria-pressed={active}
                                    className={`public-directory-filter rounded-full border px-4 py-2 text-[10px] font-medium transition ${active
                                        ? 'border-white/30 bg-white/[0.09] text-white'
                                        : 'border-white/10 bg-transparent text-zinc-500 hover:border-white/25 hover:text-white'
                                        }`}
                                >
                                    {type === 'all' ? 'All artists' : type}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {artists.data.length > 0 ? (
                    <>
                        <div className="mt-8 grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {artists.data.map((artist) => {
                                const image = imageUrl(artist.cover_image ?? artist.avatar);
                                return (
                                    <Link
                                        key={artist.id}
                                        href={`/@${artist.username}`}
                                        className="public-artist-card group relative overflow-hidden bg-[#070809] transition duration-500 hover:bg-[#0b0d0e]"
                                    >
                                        <div className="relative aspect-[0.82/1] overflow-hidden">
                                            {image ? (
                                                <img
                                                    src={image}
                                                    alt={artist.display_name}
                                                    loading="lazy"
                                                    className="h-full w-full object-cover grayscale-[0.25] transition duration-700 group-hover:scale-[1.035] group-hover:grayscale-0"
                                                />
                                            ) : (
                                                <div className="h-full w-full bg-[linear-gradient(135deg,#101315,#738087_32%,#151719_54%,#c4ccd0_76%,#111315)]" />
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/5 to-transparent opacity-90" />
                                            <div className="public-artist-card-overlay absolute inset-x-5 bottom-5 sm:inset-x-6 sm:bottom-6">
                                                <p className="text-[9px] uppercase tracking-[0.28em] text-white/50">@{artist.username}</p>
                                                <div className="mt-2 flex items-end justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <h2 className="truncate text-xl font-medium tracking-[-0.04em] sm:text-2xl">{artist.display_name}</h2>
                                                        {(artist.artist_type || artist.location) && (
                                                            <p className="mt-2 truncate text-xs text-white/55">
                                                                {[artist.artist_type, artist.location].filter(Boolean).join(' · ')}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 bg-black/20 text-white/80 backdrop-blur-sm transition group-hover:border-white/40 group-hover:text-white">
                                                        <ArrowUpRight />
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>

                        {artists.last_page > 1 && (
                            <nav className="mt-10 flex flex-wrap items-center justify-center gap-2" aria-label="Artist directory pages">
                                {[previousPage, ...pageLinks, nextPage].map((pageLink, index) => {
                                    const label = pageLink.label.replace(/&laquo;|&raquo;/g, '').trim();
                                    return pageLink.url ? (
                                        <Link
                                            key={`${pageLink.label}-${index}`}
                                            href={pageLink.url}
                                            preserveScroll
                                            className={`public-directory-page rounded-full border px-3.5 py-2 text-xs transition ${pageLink.active
                                                ? 'border-cyan-200/40 bg-cyan-200/10 text-cyan-100'
                                                : 'border-white/10 text-zinc-400 hover:border-white/25 hover:text-white'
                                                }`}
                                        >
                                            {label}
                                        </Link>
                                    ) : (
                                        <span
                                            key={`${pageLink.label}-${index}`}
                                            className="rounded-full border border-white/[0.05] px-3.5 py-2 text-xs text-zinc-700"
                                        >
                                            {label}
                                        </span>
                                    );
                                })}
                            </nav>
                        )}
                    </>
                ) : (
                    <div className="public-directory-empty mt-8 rounded-2xl border border-white/10 bg-white/[0.025] px-6 py-20 text-center">
                        <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-500">No artists found</p>
                        <h2 className="mt-3 text-2xl font-medium tracking-tight">Try another search.</h2>
                        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-500">
                            Adjust your search or choose a different artist type to discover more LIRA spaces.
                        </p>
                        <button
                            type="button"
                            onClick={() => {
                                setSearch('');
                                router.get('/artists', {}, {
                                    preserveState: true,
                                    preserveScroll: true,
                                    replace: true,
                                });
                            }}
                            className="mt-6 rounded-full border border-white/15 px-5 py-2.5 text-xs text-zinc-300 transition hover:border-white/30 hover:text-white"
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </section>

            <Footer theme={theme} />
        </main>
    );
}
