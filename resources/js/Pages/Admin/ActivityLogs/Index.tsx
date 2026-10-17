import { Head, router, useForm } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import AdminLayout from '../../../Components/Dashboard/AdminLayout';

interface ActivityUser {
    id: number;
    name: string;
    email: string;
}

interface ActivityLog {
    id: number;
    event_type: string;
    category: string;
    ip_address: string | null;
    route_name: string | null;
    http_method: string | null;
    status_code: number | null;
    details: Record<string, unknown> | null;
    is_flagged: boolean;
    flag_reason: string | null;
    reviewed_at: string | null;
    occurred_at: string;
    user: ActivityUser | null;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedLogs {
    data: ActivityLog[];
    current_page: number;
    last_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: PaginationLink[];
}

interface ActiveBlock {
    id: number;
    ip_address: string;
    reason: string;
    expires_at: string;
    blocked_by: string | null;
    created_at: string;
}

interface Props {
    logs: PaginatedLogs;
    activeBlocks: ActiveBlock[];
    flaggedCount: number;
    filters: {
        category: string;
        search: string;
        flagged: string;
    };
}

function formatDate(value: string): string {
    const date = new Date(value);

    return Number.isNaN(date.getTime())
        ? value
        : new Intl.DateTimeFormat(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short',
        }).format(date);
}

function label(value: string): string {
    return value.replaceAll('_', ' ').replaceAll('.', ' ');
}

function paginationLabel(value: string): string {
    return value
        .replace(/<[^>]*>/g, '')
        .replace(/&laquo;/g, '«')
        .replace(/&raquo;/g, '»')
        .replace(/&amp;/g, '&')
        .trim();
}

export default function Index({
    logs,
    activeBlocks,
    flaggedCount,
    filters,
}: Props) {
    const [category, setCategory] = useState(filters.category);
    const [search, setSearch] = useState(filters.search);
    const [flagged, setFlagged] = useState(filters.flagged);

    const blockForm = useForm({
        ip_address: '',
        duration_minutes: '1440',
        reason: '',
    });

    function filterLogs(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        router.get(
            '/dashboard/admin/activity-logs',
            {
                category: category === 'all' ? undefined : category,
                search: search.trim() || undefined,
                flagged: flagged === 'all' ? undefined : flagged,
            },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    }

    function blockIp(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        blockForm.post('/dashboard/admin/activity-logs/blocked-ips', {
            preserveScroll: true,
            onSuccess: () => blockForm.reset('ip_address', 'reason'),
        });
    }

    return (
        <AdminLayout>
            <Head title="Activity & Security" />
            <div className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <div className="mb-5 flex items-center gap-3">
                            <span className="h-px w-8 bg-[linear-gradient(90deg,#ffffff,#7d8991,transparent)]" />
                            <span className="text-[9px] uppercase tracking-[0.35em] text-zinc-600">
                                Administration / Trust & Safety
                            </span>
                        </div>
                        <h1 className="text-4xl font-light tracking-[-0.055em] text-white sm:text-5xl">
                            Activity &amp;
                            <span className="bg-[linear-gradient(90deg,#fff_0%,#bdefff_24%,#9d8cff_58%,#f08bd7_82%,#fff_100%)] bg-clip-text text-transparent">
                                &nbsp;Security
                            </span>
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
                            Review account and portfolio activity, investigate flagged events, and manage temporary authentication IP blocks.
                        </p>
                    </div>
                    <div className="rounded-2xl border border-amber-300/15 bg-amber-300/[0.04] px-5 py-4">
                        <p className="text-[9px] uppercase tracking-[0.2em] text-amber-200/65">
                            Flagged for review
                        </p>
                        <p className="mt-1 text-2xl font-light text-amber-100">
                            {flaggedCount}
                        </p>
                    </div>
                </div>

                <section className="mb-8 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 sm:p-6">
                    <div className="mb-4">
                        <h2 className="text-lg font-medium text-white">Temporarily block an IP</h2>
                        <p className="mt-1 text-xs leading-5 text-zinc-500">
                            Blocks sign-up, sign-in, password recovery, and other authentication endpoints for up to 24 hours. Admins remain exempt.
                        </p>
                    </div>
                    <form onSubmit={blockIp} className="grid gap-4 md:grid-cols-[1fr_180px_1.4fr_auto] md:items-end">
                        <div>
                            <label htmlFor="block-ip" className="mb-2 block text-xs text-zinc-400">IP address</label>
                            <input
                                id="block-ip"
                                type="text"
                                inputMode="decimal"
                                value={blockForm.data.ip_address}
                                onChange={(event) => blockForm.setData('ip_address', event.target.value)}
                                placeholder="IPv4 or IPv6"
                                className="h-11 w-full rounded-xl border border-white/10 bg-black/20 px-3 text-sm text-white outline-none focus:border-cyan-200/40"
                            />
                            {blockForm.errors.ip_address && <p role="alert" className="mt-1 text-xs text-red-300">{blockForm.errors.ip_address}</p>}
                        </div>
                        <div>
                            <label htmlFor="block-duration" className="mb-2 block text-xs text-zinc-400">Duration</label>
                            <select
                                id="block-duration"
                                value={blockForm.data.duration_minutes}
                                onChange={(event) => blockForm.setData('duration_minutes', event.target.value)}
                                className="h-11 w-full rounded-xl border border-white/10 bg-[#101214] px-3 text-sm text-white outline-none focus:border-cyan-200/40"
                            >
                                <option value="60">1 hour</option>
                                <option value="360">6 hours</option>
                                <option value="720">12 hours</option>
                                <option value="1440">24 hours</option>
                            </select>
                            {blockForm.errors.duration_minutes && <p role="alert" className="mt-1 text-xs text-red-300">{blockForm.errors.duration_minutes}</p>}
                        </div>
                        <div>
                            <label htmlFor="block-reason" className="mb-2 block text-xs text-zinc-400">Reason (required)</label>
                            <input
                                id="block-reason"
                                type="text"
                                maxLength={500}
                                value={blockForm.data.reason}
                                onChange={(event) => blockForm.setData('reason', event.target.value)}
                                placeholder="Briefly describe the abuse or unwanted activity"
                                className="h-11 w-full rounded-xl border border-white/10 bg-black/20 px-3 text-sm text-white outline-none focus:border-cyan-200/40"
                            />
                            {blockForm.errors.reason && <p role="alert" className="mt-1 text-xs text-red-300">{blockForm.errors.reason}</p>}
                        </div>
                        <button
                            type="submit"
                            disabled={blockForm.processing}
                            className="h-11 rounded-xl border border-rose-300/20 bg-rose-300/[0.08] px-4 text-xs font-medium text-rose-100 transition hover:bg-rose-300/[0.14] disabled:opacity-50"
                        >
                            {blockForm.processing ? 'Blocking…' : 'Block IP'}
                        </button>
                    </form>
                </section>

                <section className="mb-8 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 sm:p-6">
                    <div className="mb-4 flex items-baseline justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-medium text-white">Active IP blocks</h2>
                            <p className="mt-1 text-xs text-zinc-500">Blocks expire automatically; you can lift one sooner.</p>
                        </div>
                        <span className="text-xs text-zinc-500">{activeBlocks.length} active</span>
                    </div>
                    {activeBlocks.length ? (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[680px] text-left text-xs">
                                <thead className="text-[9px] uppercase tracking-[0.18em] text-zinc-600">
                                    <tr>
                                        <th className="pb-3 pr-4 font-normal">IP address</th>
                                        <th className="pb-3 pr-4 font-normal">Reason</th>
                                        <th className="pb-3 pr-4 font-normal">Expires</th>
                                        <th className="pb-3 pr-4 font-normal">Blocked by</th>
                                        <th className="pb-3 font-normal">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/[0.06]">
                                    {activeBlocks.map((block) => (
                                        <tr key={block.id}>
                                            <td className="py-3 pr-4 font-mono text-zinc-200">{block.ip_address}</td>
                                            <td className="max-w-sm py-3 pr-4 text-zinc-400">{block.reason}</td>
                                            <td className="py-3 pr-4 text-zinc-400">{formatDate(block.expires_at)}</td>
                                            <td className="py-3 pr-4 text-zinc-400">{block.blocked_by ?? 'Admin'}</td>
                                            <td className="py-3">
                                                <button
                                                    type="button"
                                                    onClick={() => router.delete(`/dashboard/admin/activity-logs/blocked-ips/${block.id}`, { preserveScroll: true })}
                                                    className="rounded-lg border border-white/10 px-3 py-1.5 text-[10px] text-zinc-300 transition hover:border-cyan-200/30 hover:text-white"
                                                >
                                                    Unblock
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="rounded-xl border border-dashed border-white/[0.08] px-4 py-8 text-center text-sm text-zinc-600">No active IP blocks.</p>
                    )}
                </section>

                <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02]">
                    <div className="border-b border-white/[0.07] p-5 sm:p-6">
                        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                            <div>
                                <h2 className="text-lg font-medium text-white">Activity history</h2>
                                <p className="mt-1 text-xs text-zinc-500">Detailed events are automatically removed after one year.</p>
                            </div>
                            <p className="text-xs text-zinc-500">{logs.total} events</p>
                        </div>
                        <form onSubmit={filterLogs} className="grid gap-3 sm:grid-cols-[1fr_190px_170px_auto]">
                            <input
                                type="search"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search user, email, IP, event, or route"
                                className="h-10 rounded-xl border border-white/10 bg-black/20 px-3 text-xs text-white outline-none focus:border-cyan-200/40"
                            />
                            <select value={category} onChange={(event) => setCategory(event.target.value)} className="h-10 rounded-xl border border-white/10 bg-[#101214] px-3 text-xs text-white">
                                <option value="all">All categories</option>
                                <option value="authentication">Authentication</option>
                                <option value="account_changes">Account changes</option>
                                <option value="content_changes">Portfolio changes</option>
                                <option value="moderation">Moderation</option>
                                <option value="security_signals">Security signals</option>
                            </select>
                            <select value={flagged} onChange={(event) => setFlagged(event.target.value)} className="h-10 rounded-xl border border-white/10 bg-[#101214] px-3 text-xs text-white">
                                <option value="all">All activity</option>
                                <option value="flagged">Needs review</option>
                                <option value="reviewed">Reviewed flags</option>
                                <option value="normal">Not flagged</option>
                            </select>
                            <button type="submit" className="h-10 rounded-xl border border-white/10 px-4 text-xs text-zinc-200 transition hover:bg-white/[0.05]">Apply filters</button>
                        </form>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1000px] text-left text-xs">
                            <thead className="border-b border-white/[0.06] bg-white/[0.015] text-[9px] uppercase tracking-[0.18em] text-zinc-600">
                                <tr>
                                    <th className="px-5 py-3 font-normal">Time</th>
                                    <th className="px-5 py-3 font-normal">Account</th>
                                    <th className="px-5 py-3 font-normal">Event</th>
                                    <th className="px-5 py-3 font-normal">IP address</th>
                                    <th className="px-5 py-3 font-normal">Route / result</th>
                                    <th className="px-5 py-3 font-normal">Review</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.05]">
                                {logs.data.map((log) => (
                                    <tr key={log.id} className={log.is_flagged ? 'bg-amber-300/[0.025]' : ''}>
                                        <td className="whitespace-nowrap px-5 py-4 text-zinc-400">{formatDate(log.occurred_at)}</td>
                                        <td className="px-5 py-4">
                                            {log.user ? (
                                                <>
                                                    <p className="text-zinc-200">{log.user.name}</p>
                                                    <p className="mt-1 text-[10px] text-zinc-600">{log.user.email}</p>
                                                </>
                                            ) : <span className="text-zinc-600">Unknown / unauthenticated</span>}
                                        </td>
                                        <td className="px-5 py-4">
                                            <p className="text-zinc-200">{label(log.event_type)}</p>
                                            <p className="mt-1 text-[9px] uppercase tracking-[0.12em] text-zinc-600">{label(log.category)}</p>
                                        </td>
                                        <td className="px-5 py-4 font-mono text-zinc-400">{log.ip_address ?? '—'}</td>
                                        <td className="px-5 py-4">
                                            <p className="text-zinc-400">{log.route_name ?? '—'}</p>
                                            <p className="mt-1 text-[10px] text-zinc-600">
                                                {[log.http_method, log.status_code ? `HTTP ${log.status_code}` : null].filter(Boolean).join(' · ') || '—'}
                                            </p>
                                        </td>
                                        <td className="px-5 py-4">
                                            {log.is_flagged ? (
                                                <div className="flex flex-col items-start gap-2">
                                                    <span title={log.flag_reason ?? undefined} className={`inline-flex max-w-[220px] rounded-lg border px-2.5 py-1.5 text-[10px] leading-4 ${log.reviewed_at ? 'border-emerald-300/15 bg-emerald-300/[0.04] text-emerald-100/80' : 'border-amber-300/15 bg-amber-300/[0.05] text-amber-100'}`}>
                                                        {log.reviewed_at ? 'Reviewed' : (log.flag_reason ?? 'Needs review')}
                                                    </span>
                                                    {!log.reviewed_at && (
                                                        <button
                                                            type="button"
                                                            onClick={() => router.post(`/dashboard/admin/activity-logs/${log.id}/review`, {}, { preserveScroll: true })}
                                                            className="text-[10px] text-cyan-200/80 underline decoration-cyan-200/20 underline-offset-2 hover:text-cyan-100"
                                                        >
                                                            Mark reviewed
                                                        </button>
                                                    )}
                                                </div>
                                            ) : <span className="text-zinc-700">—</span>}
                                        </td>
                                    </tr>
                                ))}
                                {logs.data.length === 0 && (
                                    <tr><td colSpan={6} className="px-5 py-12 text-center text-sm text-zinc-600">No activity matched these filters.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {logs.last_page > 1 && (
                        <nav aria-label="Activity log pages" className="flex flex-wrap justify-center gap-2 border-t border-white/[0.06] p-4">
                            {logs.links.map((link, index) => (
                                link.url ? (
                                    <button
                                        key={`${link.label}-${index}`}
                                        type="button"
                                        onClick={() => router.get(link.url!, {}, { preserveScroll: true })}
                                        className={`rounded-lg border px-3 py-2 text-xs ${link.active ? 'border-cyan-200/30 bg-cyan-200/[0.07] text-cyan-100' : 'border-white/[0.08] text-zinc-400 hover:text-white'}`}
                                    >{paginationLabel(link.label)}</button>
                                ) : (
                                    <span key={`${link.label}-${index}`} className="rounded-lg border border-white/[0.04] px-3 py-2 text-xs text-zinc-700">{paginationLabel(link.label)}</span>
                                )
                            ))}
                        </nav>
                    )}
                </section>
            </div>
        </AdminLayout>
    );
}
