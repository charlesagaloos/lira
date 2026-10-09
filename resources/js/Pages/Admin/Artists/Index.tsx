
import { Head, Link, router } from '@inertiajs/react';
import {
    useEffect,
    useRef,
    useState,
    type FormEvent,
    type MouseEvent,
    type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import {
    ArrowLeft,
    ArrowRight,
    ChevronDown,
    Eye,
    MoreHorizontal,
    Search,
    SlidersHorizontal,
    Trash2,
    UserCog,
    Users,
} from 'lucide-react';
import AdminLayout from '../../../Components/Dashboard/AdminLayout';
import ConfirmModal from '../../../Components/UI/ConfirmModal';
import AvatarImage from '../../../Components/Portfolio/AvatarImage';

type Status = 'pending' | 'verified' | 'rejected';
type StatusFilter = 'all' | Status;
type MenuPlacement = 'top' | 'bottom';

interface ArtistUser {
    id: number;
    name: string;
    email: string;
    is_admin: boolean;
}

interface ArtistProfile {
    id: number;
    username: string;
    display_name: string;
    avatar: string | null;
    avatar_zoom?: number | null;
    avatar_position_x?: number | null;
    avatar_position_y?: number | null;
    bio: string | null;
    about_me: string | null;
    artist_type: string | null;
    location: string | null;
    website: string | null;
    verification_status: Status | string;
    is_published: boolean;
    updated_at: string | null;
    user: ArtistUser | null;
    public_url: string | null;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedProfiles {
    data: ArtistProfile[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: PaginationLink[];
}

interface Props {
    profiles: PaginatedProfiles;
    filters: {
        status: StatusFilter;
        search: string;
        per_page: number;
    };
    counts: {
        all: number;
        pending: number;
        verified: number;
        rejected: number;
    };
}

interface MenuPosition {
    top: number;
    left: number;
    placement: MenuPlacement;
}

const MENU_WIDTH = 160;
const MENU_HEIGHT = 150;
const MENU_GAP = 8;
const VIEWPORT_PADDING = 8;

const statusOptions: {
    value: StatusFilter;
    label: string;
}[] = [
        { value: 'all', label: 'All artists' },
        { value: 'pending', label: 'Pending' },
        { value: 'verified', label: 'Verified' },
        { value: 'rejected', label: 'Rejected' },
    ];

function GlassPanel({
    children,
    className = '',
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <div
            className={`relative rounded-2xl border border-white/[0.08] bg-white/[0.025] backdrop-blur-xl ${className}`}
        >
            {children}
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const normalized = status.toLowerCase();

    const styles =
        normalized === 'verified'
            ? 'border-[#35dfff]/20 bg-[#35dfff]/[0.07] text-[#72e9ff]'
            : normalized === 'rejected'
                ? 'border-[#ff6b9d]/20 bg-[#ff6b9d]/[0.07] text-[#ff9cbb]'
                : 'border-[#a855f7]/20 bg-[#a855f7]/[0.07] text-[#c4a2ff]';

    return (
        <span
            className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-2.5 py-1 text-[9px] uppercase tracking-[0.16em] ${styles}`}
        >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {normalized}
        </span>
    );
}

function formatDate(value: string | null) {
    if (!value) return '—';

    const date = new Date(value);

    return Number.isNaN(date.getTime())
        ? '—'
        : new Intl.DateTimeFormat('en', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        }).format(date);
}

function avatarUrl(path: string | null) {
    if (!path) return null;

    if (/^https?:\/\//i.test(path) || path.startsWith('/')) {
        return path;
    }

    return `/storage/${path.replace(/^storage\//, '')}`;
}

function ArtistAvatar({
    profile,
    size = 'h-10 w-10',
}: {
    profile: ArtistProfile;
    size?: string;
}) {
    const [failed, setFailed] = useState(false);
    const src = avatarUrl(profile.avatar);

    useEffect(() => {
        setFailed(false);
    }, [src]);

    return (
        <div
            className={`relative ${size} shrink-0 overflow-hidden rounded-full border border-white/[0.12] bg-[#252b34] text-sm text-zinc-300`}
        >
            {src && !failed ? (
                <AvatarImage
                    src={src}
                    alt={`${profile.display_name || profile.username || 'Artist'} profile`}
                    className="select-none object-cover"
                    zoom={Number(profile.avatar_zoom ?? 1)}
                    positionX={Number(profile.avatar_position_x ?? 50)}
                    positionY={Number(profile.avatar_position_y ?? 50)}
                    onError={() => setFailed(true)}
                />
            ) : (
                <div className="flex h-full w-full items-center justify-center">
                    {(profile.display_name || profile.username || '?')
                        .charAt(0)
                        .toUpperCase()}
                </div>
            )}
        </div>
    );
}


function getVisiblePages(
    currentPage: number,
    lastPage: number,
): (number | 'ellipsis')[] {
    if (lastPage <= 5) {
        return Array.from({ length: lastPage }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
        return [1, 2, 3, 'ellipsis', lastPage];
    }

    if (currentPage >= lastPage - 2) {
        return [
            1,
            'ellipsis',
            lastPage - 2,
            lastPage - 1,
            lastPage,
        ];
    }

    return [
        1,
        'ellipsis',
        currentPage,
        'ellipsis',
        lastPage,
    ];
}


export default function Index({ profiles, filters, counts }: Props) {
    const [search, setSearch] = useState(filters.search);
    const [deleteTarget, setDeleteTarget] =
        useState<ArtistProfile | null>(null);
    const [processing, setProcessing] = useState(false);

    const [menuFor, setMenuFor] = useState<number | null>(null);
    const [menuProfile, setMenuProfile] =
        useState<ArtistProfile | null>(null);
    const [menuPosition, setMenuPosition] =
        useState<MenuPosition | null>(null);

    const menuButtonRef = useRef<HTMLButtonElement | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setSearch(filters.search);
    }, [filters.search]);

    const closeActionsMenu = () => {
        setMenuFor(null);
        setMenuProfile(null);
        setMenuPosition(null);
    };

    const query = (
        status: string,
        searchValue = filters.search,
        perPage = filters.per_page,
    ) => ({
        status: status === 'all' ? undefined : status,
        search: searchValue.trim() || undefined,
        per_page: perPage,
    });

    const changeStatus = (status: string) => {
        closeActionsMenu();

        router.get(
            '/dashboard/admin/artists',
            query(status),
            { preserveScroll: true, replace: true },
        );
    };

    const changePerPage = (value: string) => {
        closeActionsMenu();

        router.get(
            '/dashboard/admin/artists',
            query(filters.status, filters.search, Number(value)),
            { preserveScroll: true, replace: true },
        );
    };

    const submitSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        closeActionsMenu();

        router.get(
            '/dashboard/admin/artists',
            query(filters.status, search),
            { preserveScroll: true, replace: true },
        );
    };


    const deleteUser = () => {
        if (!deleteTarget?.user || processing) return;

        setProcessing(true);

        router.delete(
            `/dashboard/admin/artists/${deleteTarget.user.id}`,
            {
                preserveScroll: true,
                onSuccess: () => {
                    setDeleteTarget(null);
                },
                onError: (errors) => {
                    console.error('Artist deletion failed:', errors);
                },
                onFinish: () => {
                    setProcessing(false);
                },
            },
        );
    };


    const calculateMenuPosition = (
        button: HTMLButtonElement,
    ): MenuPosition => {
        const rect = button.getBoundingClientRect();

        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;

        const placement: MenuPlacement =
            spaceBelow < MENU_HEIGHT + MENU_GAP &&
                spaceAbove > spaceBelow
                ? 'top'
                : 'bottom';

        const desiredTop =
            placement === 'top'
                ? rect.top - MENU_HEIGHT - MENU_GAP
                : rect.bottom + MENU_GAP;

        const maxTop = Math.max(
            VIEWPORT_PADDING,
            window.innerHeight - MENU_HEIGHT - VIEWPORT_PADDING,
        );

        const top = Math.max(
            VIEWPORT_PADDING,
            Math.min(desiredTop, maxTop),
        );

        const left = Math.max(
            VIEWPORT_PADDING,
            Math.min(
                rect.right - MENU_WIDTH,
                window.innerWidth - MENU_WIDTH - VIEWPORT_PADDING,
            ),
        );

        return { top, left, placement };
    };

    const toggleActionsMenu = (
        event: MouseEvent<HTMLButtonElement>,
        profile: ArtistProfile,
    ) => {
        if (menuFor === profile.id) {
            closeActionsMenu();
            return;
        }

        const button = event.currentTarget;

        menuButtonRef.current = button;

        setMenuFor(profile.id);
        setMenuProfile(profile);
        setMenuPosition(calculateMenuPosition(button));
    };

    // Keep the portal menu aligned with its trigger while the page
    // or any nested scroll container moves.
    useEffect(() => {
        if (menuFor === null) return;

        const updatePosition = () => {
            if (!menuButtonRef.current?.isConnected) {
                closeActionsMenu();
                return;
            }

            setMenuPosition(
                calculateMenuPosition(menuButtonRef.current),
            );
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                closeActionsMenu();
            }
        };

        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition, true);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition, true);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [menuFor]);

    // Close the menu when the user clicks outside it and outside its trigger.
    useEffect(() => {
        if (menuFor === null) return;

        const handlePointerDown = (event: PointerEvent) => {
            const target = event.target;

            if (!(target instanceof Node)) return;

            if (menuRef.current?.contains(target)) return;
            if (menuButtonRef.current?.contains(target)) return;

            closeActionsMenu();
        };

        document.addEventListener('pointerdown', handlePointerDown);

        return () => {
            document.removeEventListener(
                'pointerdown',
                handlePointerDown,
            );
        };
    }, [menuFor]);

    return (
        <AdminLayout>
            <Head title="Artists | LIRA Admin" />

            <main className="mx-auto max-w-[1400px] px-5 py-8 text-white sm:px-8 lg:px-12 lg:py-12">
                {/* Page heading */}
                <div className="mb-12">
                    <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
                        <div>
                            <div className="mb-5 flex items-center gap-3">
                                <span className="h-px w-8 bg-[linear-gradient(90deg,#ffffff,#7d8991,transparent)]" />
                                <span className="text-[9px] uppercase tracking-[0.35em] text-zinc-600">
                                    LIRA / ADMIN / ARTISTS
                                </span>
                            </div>

                            <h1 className="text-4xl font-light tracking-[-0.055em] sm:text-5xl">
                                Artist
                                <br />
                                <span className="bg-[linear-gradient(90deg,#fff_0%,#bdefff_24%,#9d8cff_58%,#f08bd7_82%,#fff_100%)] bg-clip-text text-transparent">
                                    directory.
                                </span>
                            </h1>

                            <p className="mt-5 max-w-xl text-sm leading-6 text-zinc-600">
                                Browse artist profiles, manage account details,
                                and review verification status.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                            <Link
                                href="/dashboard/admin"
                                className="group inline-flex items-center gap-2 rounded-xl border border-white/[0.10] bg-white/[0.045] px-4 py-2.5 text-xs font-medium text-white/80 transition hover:border-white/[0.18] hover:bg-white/[0.08] hover:text-white"
                            >
                                <ArrowLeft className="h-3.5 w-3.5 text-white/60 transition-transform group-hover:-translate-x-1 group-hover:text-white" />
                                Back to Admin Dashboard
                            </Link>

                            <div className="hidden h-8 w-px bg-white/[0.06] sm:block" />

                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.025]">
                                    <Users className="h-4 w-4 text-zinc-500" />
                                </div>

                                <div>
                                    <p className="text-[9px] uppercase tracking-[0.25em] text-zinc-600">
                                        Total profiles
                                    </p>
                                    <p className="mt-0.5 text-lg font-light tracking-tight text-white">
                                        {counts.all.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status summary cards */}
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {statusOptions.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => changeStatus(option.value)}
                            className={`rounded-xl border p-4 text-left transition ${filters.status === option.value
                                ? 'border-[#72e9ff]/25 bg-[#72e9ff]/[0.06]'
                                : 'border-white/[0.07] bg-white/[0.02] hover:border-white/[0.14] hover:bg-white/[0.035]'
                                }`}
                        >
                            <p className="text-[9px] uppercase tracking-[0.22em] text-zinc-500">
                                {option.label}
                            </p>
                            <p className="mt-3 text-2xl font-light tabular-nums text-white">
                                {counts[option.value].toLocaleString()}
                            </p>
                        </button>
                    ))}
                </div>

                <GlassPanel className="mt-7">
                    {/* Search and page size */}
                    <div className="flex flex-col gap-4 border-b border-white/[0.07] p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
                        <form
                            onSubmit={submitSearch}
                            className="flex w-full gap-2 lg:max-w-xl"
                        >
                            <label className="flex min-w-0 flex-1 items-center gap-3 rounded-lg border border-white/[0.09] bg-black/20 px-3.5">
                                <Search className="h-4 w-4 shrink-0 text-zinc-600" />
                                <input
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    placeholder="Search artist, username, account, or email..."
                                    className="h-11 w-full min-w-0 bg-transparent text-xs text-white outline-none placeholder:text-zinc-700"
                                />
                            </label>

                            <button
                                type="submit"
                                className="rounded-lg border border-white/[0.1] bg-white/[0.06] px-4 text-xs text-zinc-200 transition hover:bg-white/[0.1]"
                            >
                                Search
                            </button>
                        </form>

                        <label className="flex items-center gap-3 text-xs text-zinc-500">
                            <SlidersHorizontal className="h-3.5 w-3.5" />
                            Rows
                            <select
                                value={String(filters.per_page)}
                                onChange={(event) =>
                                    changePerPage(event.target.value)
                                }
                                className="rounded-lg border border-white/[0.1] bg-[#0b0d10] px-3 py-2 text-xs text-zinc-300 outline-none [color-scheme:dark]"
                            >
                                <option value="10">10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                            </select>
                        </label>
                    </div>

                    {/* Status filters */}
                    <div className="flex flex-wrap gap-2 border-b border-white/[0.06] px-4 py-3 sm:px-5">
                        {statusOptions.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => changeStatus(option.value)}
                                className={`rounded-full px-3 py-1.5 text-[9px] uppercase tracking-[0.14em] transition ${filters.status === option.value
                                    ? 'bg-white text-black'
                                    : 'border border-white/[0.08] text-zinc-500 hover:text-white'
                                    }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>

                    {profiles.data.length > 0 ? (
                        <>
                            {/* Desktop table: horizontal overflow only */}
                            <div className="hidden w-full overflow-x-auto md:block">
                                <table className="w-full min-w-[900px] border-collapse text-left">
                                    <thead>
                                        <tr className="border-b border-white/[0.06] text-[9px] uppercase tracking-[0.18em] text-zinc-600">
                                            <th className="px-5 py-4 font-medium">
                                                Artist
                                            </th>
                                            <th className="px-5 py-4 font-medium">
                                                Account owner
                                            </th>
                                            <th className="px-5 py-4 font-medium">
                                                Visibility
                                            </th>
                                            <th className="px-5 py-4 font-medium">
                                                Updated
                                            </th>
                                            <th className="px-5 py-4 font-medium">
                                                Status
                                            </th>
                                            <th className="px-5 py-4 text-right font-medium">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-white/[0.05]">
                                        {profiles.data.map((profile) => (
                                            <tr
                                                key={profile.id}
                                                className="transition hover:bg-white/[0.02]"
                                            >
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <ArtistAvatar
                                                            profile={profile}
                                                        />
                                                        <div className="min-w-0">
                                                            <p className="truncate text-sm text-zinc-100">
                                                                {profile.display_name ||
                                                                    'Unnamed artist'}
                                                            </p>
                                                            <p className="mt-1 truncate text-[10px] text-zinc-600">
                                                                @{profile.username}
                                                            </p>
                                                            <p className="mt-1 text-[10px] text-zinc-700">
                                                                {profile.artist_type ||
                                                                    'Artist type not set'}
                                                                {profile.location
                                                                    ? ` · ${profile.location}`
                                                                    : ''}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <p className="text-xs text-zinc-300">
                                                        {profile.user?.name ||
                                                            'Unknown account'}
                                                    </p>
                                                    <p className="mt-1 text-[10px] text-zinc-600">
                                                        {profile.user?.email ||
                                                            'No email available'}
                                                    </p>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <span
                                                        className={`whitespace-nowrap text-[9px] uppercase tracking-[0.15em] ${profile.is_published
                                                            ? 'text-[#72e9ff]'
                                                            : 'text-zinc-600'
                                                            }`}
                                                    >
                                                        {profile.is_published
                                                            ? 'Published'
                                                            : 'Unpublished'}
                                                    </span>
                                                </td>

                                                <td className="whitespace-nowrap px-5 py-4 text-xs text-zinc-500">
                                                    {formatDate(profile.updated_at)}
                                                </td>

                                                <td className="px-5 py-4">
                                                    <StatusBadge
                                                        status={
                                                            profile.verification_status
                                                        }
                                                    />
                                                </td>

                                                <td className="px-5 py-4 text-right">
                                                    <button
                                                        type="button"
                                                        aria-expanded={
                                                            menuFor === profile.id
                                                        }
                                                        aria-haspopup="menu"
                                                        onClick={(event) =>
                                                            toggleActionsMenu(
                                                                event,
                                                                profile,
                                                            )
                                                        }
                                                        className="inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.025] px-3 py-2 text-[10px] text-zinc-300 transition hover:border-white/[0.16] hover:bg-white/[0.06] hover:text-white"
                                                    >
                                                        Actions
                                                        <ChevronDown
                                                            className={`h-3 w-3 transition-transform ${menuFor === profile.id &&
                                                                menuPosition?.placement ===
                                                                'top'
                                                                ? 'rotate-180'
                                                                : ''
                                                                }`}
                                                        />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile artist cards */}
                            <div className="divide-y divide-white/[0.06] md:hidden">
                                {profiles.data.map((profile) => (
                                    <div key={profile.id} className="p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex min-w-0 items-center gap-3">
                                                <ArtistAvatar profile={profile} />

                                                <div className="min-w-0">
                                                    <p className="truncate text-sm text-white">
                                                        {profile.display_name ||
                                                            'Unnamed artist'}
                                                    </p>
                                                    <p className="mt-1 truncate text-[10px] text-zinc-600">
                                                        @{profile.username}
                                                    </p>
                                                    <p className="mt-1 break-all text-[10px] text-zinc-600">
                                                        {profile.user?.email ||
                                                            'No email available'}
                                                    </p>
                                                </div>
                                            </div>

                                            <StatusBadge
                                                status={profile.verification_status}
                                            />
                                        </div>

                                        <div className="mt-4 flex items-center justify-between gap-3">
                                            <span className="text-[10px] text-zinc-600">
                                                {profile.is_published
                                                    ? 'Published'
                                                    : 'Unpublished'}{' '}
                                                · {formatDate(profile.updated_at)}
                                            </span>

                                            <button
                                                type="button"
                                                aria-expanded={
                                                    menuFor === profile.id
                                                }
                                                onClick={(event) =>
                                                    toggleActionsMenu(
                                                        event,
                                                        profile,
                                                    )
                                                }
                                                className="inline-flex items-center gap-1 rounded-lg border border-white/[0.08] px-3 py-2 text-[10px] text-zinc-300"
                                            >
                                                Actions
                                                <MoreHorizontal className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="px-6 py-16 text-center">
                            <Users className="mx-auto h-8 w-8 text-zinc-700" />
                            <h2 className="mt-5 text-base font-light text-zinc-200">
                                No artists found
                            </h2>
                            <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-zinc-600">
                                Try another search term or choose a different
                                verification status.
                            </p>

                            {(filters.search || filters.status !== 'all') && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        router.get('/dashboard/admin/artists')
                                    }
                                    className="mt-5 text-xs text-[#72e9ff] transition hover:text-white"
                                >
                                    Clear filters
                                </button>
                            )}
                        </div>
                    )}


                    {/* Pagination */}
                    <div className="flex flex-col gap-4 border-t border-white/[0.07] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                        <p className="text-[10px] text-zinc-600">
                            Showing {profiles.from ?? 0}–{profiles.to ?? 0} of{' '}
                            {profiles.total.toLocaleString()} artists
                        </p>

                        <div className="flex items-center justify-center gap-1">
                            {/* Previous */}
                            <button
                                type="button"
                                disabled={profiles.current_page <= 1}
                                onClick={() => {
                                    const previousUrl = profiles.links[0]?.url;
                                    if (previousUrl) {
                                        router.get(previousUrl, {}, {
                                            preserveScroll: true,
                                            preserveState: true,
                                        });
                                    }
                                }}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] text-zinc-400 transition hover:border-white/[0.2] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                                aria-label="Previous page"
                            >
                                <ArrowLeft className="h-3.5 w-3.5" />
                            </button>

                            {/* Page numbers */}
                            {getVisiblePages(
                                profiles.current_page,
                                profiles.last_page,
                            ).map((page, index) => {
                                if (page === 'ellipsis') {
                                    return (
                                        <span
                                            key={`ellipsis-${index}`}
                                            className="inline-flex h-9 min-w-7 items-center justify-center text-xs text-zinc-600"
                                        >
                                            …
                                        </span>
                                    );
                                }

                                const pageUrl = profiles.links.find(
                                    (link) =>
                                        Number(
                                            link.label
                                                .replace(/&laquo;|&raquo;/g, '')
                                                .trim(),
                                        ) === page,
                                )?.url;

                                return (
                                    <button
                                        key={page}
                                        type="button"
                                        disabled={page === profiles.current_page || !pageUrl}
                                        onClick={() => {
                                            if (pageUrl) {
                                                router.get(pageUrl, {}, {
                                                    preserveScroll: true,
                                                    preserveState: true,
                                                });
                                            }
                                        }}
                                        aria-current={
                                            page === profiles.current_page
                                                ? 'page'
                                                : undefined
                                        }
                                        className={`inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-3 text-[10px] transition ${page === profiles.current_page
                                                ? 'border-white bg-white text-black'
                                                : 'border-white/[0.08] text-zinc-400 hover:border-white/[0.2] hover:text-white'
                                            } disabled:cursor-default`}
                                    >
                                        {page}
                                    </button>
                                );
                            })}

                            {/* Next */}
                            <button
                                type="button"
                                disabled={profiles.current_page >= profiles.last_page}
                                onClick={() => {
                                    const nextUrl = profiles.links[
                                        profiles.links.length - 1
                                    ]?.url;

                                    if (nextUrl) {
                                        router.get(nextUrl, {}, {
                                            preserveScroll: true,
                                            preserveState: true,
                                        });
                                    }
                                }}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] text-zinc-400 transition hover:border-white/[0.2] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                                aria-label="Next page"
                            >
                                <ArrowRight className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    </div>

                </GlassPanel>

                <p className="mt-5 text-[10px] leading-5 text-zinc-700">
                    Use View to inspect portfolio details, Manage to update the
                    account, and Delete the user account.
                </p>
            </main>

            {/* Actions portal: rendered outside the table and its overflow containers */}
            {menuFor !== null &&
                menuProfile &&
                menuPosition &&
                typeof document !== 'undefined' &&
                createPortal(
                    <div
                        ref={menuRef}
                        role="menu"
                        style={{
                            position: 'fixed',
                            top: menuPosition.top,
                            left: menuPosition.left,
                            width: MENU_WIDTH,
                        }}
                        className="z-[91] rounded-xl border border-white/[0.12] bg-[#171b22] p-1.5 text-left shadow-2xl shadow-black/70"
                    >
                        <Link
                            role="menuitem"
                            href={`/dashboard/admin/artists/${menuProfile.id}`}
                            onClick={closeActionsMenu}
                            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs text-zinc-300 transition hover:bg-white/[0.06] hover:text-white"
                        >
                            <Eye className="h-3.5 w-3.5" />
                            View
                        </Link>

                        <Link
                            role="menuitem"
                            href={`/dashboard/admin/artists/${menuProfile.id}/edit`}
                            onClick={closeActionsMenu}
                            aria-disabled={!menuProfile.user}
                            className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs text-zinc-300 transition hover:bg-white/[0.06] hover:text-white ${!menuProfile.user
                                ? 'pointer-events-none opacity-40'
                                : ''
                                }`}
                        >
                            <UserCog className="h-3.5 w-3.5" />
                            Manage
                        </Link>

                        <div className="my-1 border-t border-white/[0.07]" />

                        <button
                            type="button"
                            role="menuitem"
                            disabled={!menuProfile.user}
                            onClick={() => {
                                setDeleteTarget(menuProfile);
                                closeActionsMenu();
                            }}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-xs text-[#ff9cbb] transition hover:bg-[#ff6b9d]/[0.08] disabled:opacity-40"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                        </button>
                    </div>,
                    document.body,
                )}

            {/* Delete confirmation */}
            <ConfirmModal
                isOpen={deleteTarget !== null}
                title="Delete account?"
                description={
                    deleteTarget
                        ? `${deleteTarget.user?.name ||
                        deleteTarget.display_name
                        } will no longer be available through normal user queries. The database record is retained; this does not permanently erase the account.`
                        : ''
                }
                confirmText="Delete account"
                cancelText="Cancel"
                variant="danger"
                isLoading={processing}
                onConfirm={deleteUser}
                onCancel={() => {
                    if (!processing) {
                        setDeleteTarget(null);
                    }
                }}
            />
        </AdminLayout>
    );
}
