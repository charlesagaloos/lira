import { Head, Link, router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { Plus, Search, Shield, Trash2, UserRoundPen } from 'lucide-react';
import AdminLayout from '../../../Components/Dashboard/AdminLayout';
import ConfirmModal from '../../../Components/UI/ConfirmModal';

interface AdminUser {
    id: number;
    name: string;
    email: string;
    created_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedUsers {
    data: AdminUser[];
    current_page: number;
    last_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: PaginationLink[];
}

interface Props {
    users: PaginatedUsers;
    filters: {
        search: string;
        per_page: number;
    };
    adminOnlyCount: number;
    activeAdminCount: number;
    currentUserId: number;
}

function paginationLabel(label: string): string {
    return label
        .replace(/<[^>]*>/g, '')
        .replace(/&laquo;/g, '«')
        .replace(/&raquo;/g, '»')
        .replace(/&amp;/g, '&')
        .trim();
}

function formattedDate(value: string): string {
    const date = new Date(value);

    return Number.isNaN(date.getTime())
        ? value
        : new Intl.DateTimeFormat(undefined, {
              dateStyle: 'medium',
          }).format(date);
}

export default function Index({
    users,
    filters,
    adminOnlyCount,
    activeAdminCount,
    currentUserId,
}: Props) {
    const [search, setSearch] = useState(filters.search);
    const [perPage, setPerPage] = useState(String(filters.per_page));
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
    const [deleting, setDeleting] = useState(false);

    function filterUsers(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        router.get(
            '/dashboard/admin/users',
            {
                search: search.trim() || undefined,
                per_page: perPage,
            },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    }

    function deleteUser() {
        if (!selectedUser || deleting) {
            return;
        }

        setDeleting(true);
        router.delete(`/dashboard/admin/users/${selectedUser.id}`, {
            preserveScroll: true,
            onFinish: () => {
                setDeleting(false);
                setSelectedUser(null);
            },
        });
    }

    return (
        <AdminLayout>
            <Head title="User Management" />

            <div className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
                <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <div className="mb-5 flex items-center gap-3">
                            <span className="h-px w-8 bg-[linear-gradient(90deg,#ffffff,#7d8991,transparent)]" />
                            <span className="text-[9px] uppercase tracking-[0.35em] text-zinc-600">
                                Administration / Access
                            </span>
                        </div>
                        <h1 className="text-4xl font-light tracking-[-0.055em] text-white sm:text-5xl">
                            User management
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
                            Create and manage dedicated administrator accounts.
                            Artist and admin accounts are managed in the artists
                            directory.
                        </p>
                    </div>

                    <Link
                        href="/dashboard/admin/users/create"
                        className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl border border-cyan-200/25 bg-cyan-200/[0.08] px-4 text-sm font-medium text-cyan-100 transition hover:bg-cyan-200/[0.14] sm:self-auto"
                    >
                        <Plus className="h-4 w-4" />
                        Add admin user
                    </Link>
                </div>

                <div className="mb-6 grid gap-4 sm:grid-cols-2">
                    <section className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
                        <p className="text-[9px] uppercase tracking-[0.22em] text-zinc-500">
                            Dedicated admin accounts
                        </p>
                        <p className="mt-2 text-3xl font-light text-white">
                            {adminOnlyCount}
                        </p>
                        <p className="mt-1 text-xs text-zinc-500">
                            Admin accounts without an artist profile
                        </p>
                    </section>
                    <section className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
                        <p className="text-[9px] uppercase tracking-[0.22em] text-zinc-500">
                            Active administrators
                        </p>
                        <p className="mt-2 text-3xl font-light text-white">
                            {activeAdminCount}
                        </p>
                        <p className="mt-1 text-xs text-zinc-500">
                            Includes artist/admin accounts
                        </p>
                    </section>
                </div>

                <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02]">
                    <form
                        onSubmit={filterUsers}
                        className="flex flex-col gap-3 border-b border-white/[0.08] p-4 sm:flex-row sm:items-center"
                    >
                        <label className="relative min-w-0 flex-1">
                            <span className="sr-only">Search admin users</span>
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                            <input
                                type="search"
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Search by name or email"
                                className="h-10 w-full rounded-xl border border-white/10 bg-black/20 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-cyan-200/40"
                            />
                        </label>
                        <div className="flex gap-2">
                            <select
                                aria-label="Users per page"
                                value={perPage}
                                onChange={(event) =>
                                    setPerPage(event.target.value)
                                }
                                className="h-10 rounded-xl border border-white/10 bg-black/20 px-3 text-xs text-white"
                            >
                                <option value="10">10 per page</option>
                                <option value="25">25 per page</option>
                                <option value="50">50 per page</option>
                            </select>
                            <button
                                type="submit"
                                className="h-10 rounded-xl border border-white/10 bg-white/[0.06] px-4 text-xs text-white transition hover:bg-white/[0.1]"
                            >
                                Search
                            </button>
                        </div>
                    </form>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[640px] text-left">
                            <thead className="border-b border-white/[0.07]">
                                <tr className="text-[9px] uppercase tracking-[0.2em] text-zinc-500">
                                    <th className="px-5 py-4 font-medium">
                                        Administrator
                                    </th>
                                    <th className="px-5 py-4 font-medium">
                                        Access
                                    </th>
                                    <th className="px-5 py-4 font-medium">
                                        Created
                                    </th>
                                    <th className="px-5 py-4 text-right font-medium">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.06]">
                                {users.data.map((user) => {
                                    const isCurrentUser =
                                        user.id === currentUserId;
                                    const canDelete =
                                        !isCurrentUser && activeAdminCount > 1;

                                    return (
                                        <tr
                                            key={user.id}
                                            className="transition hover:bg-white/[0.025]"
                                        >
                                            <td className="px-5 py-4">
                                                <p className="text-sm font-medium text-white">
                                                    {user.name}
                                                </p>
                                                <p className="mt-1 text-xs text-zinc-500">
                                                    {user.email}
                                                </p>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className="inline-flex items-center gap-2 rounded-full border border-cyan-200/20 bg-cyan-200/[0.06] px-2.5 py-1 text-[10px] text-cyan-100">
                                                    <Shield className="h-3 w-3" />
                                                    Admin only
                                                </span>
                                                {isCurrentUser && (
                                                    <span className="ml-2 text-[10px] text-zinc-500">
                                                        You
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-5 py-4 text-xs text-zinc-400">
                                                {formattedDate(user.created_at)}
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        href={`/dashboard/admin/users/${user.id}/edit`}
                                                        aria-label={`Edit ${user.name}`}
                                                        className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-xs text-zinc-300 transition hover:bg-white/[0.08] hover:text-white"
                                                    >
                                                        <UserRoundPen className="h-3.5 w-3.5" />
                                                        Edit
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        aria-label={`Delete ${user.name}`}
                                                        title={
                                                            isCurrentUser
                                                                ? 'You cannot delete your own account'
                                                                : activeAdminCount <= 1
                                                                  ? 'The last active admin cannot be deleted'
                                                                  : undefined
                                                        }
                                                        disabled={!canDelete}
                                                        onClick={() =>
                                                            setSelectedUser(
                                                                user,
                                                            )
                                                        }
                                                        className="inline-flex h-9 items-center gap-2 rounded-lg border border-rose-400/20 bg-rose-400/[0.06] px-3 text-xs text-rose-200 transition hover:bg-rose-400/[0.12] disabled:cursor-not-allowed disabled:opacity-40"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}

                                {users.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-5 py-16 text-center"
                                        >
                                            <p className="text-sm text-zinc-300">
                                                {filters.search
                                                    ? 'No admin accounts match your search.'
                                                    : 'No dedicated admin accounts yet.'}
                                            </p>
                                            <p className="mt-2 text-xs text-zinc-500">
                                                Add an admin-only account to
                                                grant someone access.
                                            </p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-col gap-3 border-t border-white/[0.08] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                        <p className="text-xs text-zinc-500">
                            Showing {users.from ?? 0}–{users.to ?? 0} of{' '}
                            {users.total} admin accounts
                        </p>
                        <nav
                            aria-label="Admin users pagination"
                            className="flex flex-wrap gap-1"
                        >
                            {users.links.map((link, index) => {
                                const label = paginationLabel(link.label);
                                const classes = `inline-flex min-h-9 min-w-9 items-center justify-center rounded-lg border px-3 text-xs transition ${
                                    link.active
                                        ? 'border-cyan-200/30 bg-cyan-200/[0.1] text-cyan-100'
                                        : 'border-white/[0.08] text-zinc-400 hover:bg-white/[0.05] hover:text-white'
                                }`;

                                return link.url ? (
                                    <Link
                                        key={`${label}-${index}`}
                                        href={link.url}
                                        aria-current={
                                            link.active ? 'page' : undefined
                                        }
                                        className={classes}
                                    >
                                        {label}
                                    </Link>
                                ) : (
                                    <span
                                        key={`${label}-${index}`}
                                        aria-disabled="true"
                                        className={`${classes} cursor-not-allowed opacity-40`}
                                    >
                                        {label}
                                    </span>
                                );
                            })}
                        </nav>
                    </div>
                </section>
            </div>

            <ConfirmModal
                isOpen={selectedUser !== null}
                title="Delete admin account?"
                description={`This will soft-delete ${selectedUser?.name ?? 'this account'}. They will no longer be able to sign in. The account data is retained.`}
                confirmText="Delete account"
                variant="danger"
                isLoading={deleting}
                onConfirm={deleteUser}
                onCancel={() => {
                    if (!deleting) {
                        setSelectedUser(null);
                    }
                }}
            />
        </AdminLayout>
    );
}
