
import { Link, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    LayoutDashboard,
    Users,
} from 'lucide-react';

interface AdminSidebarProps {
    collapsed: boolean;
    onToggle: () => void;
}


const navigation = [
    {
        label: 'Dashboard',
        href: '/dashboard/admin',
        icon: LayoutDashboard,
        active: (url: string) => url === '/dashboard/admin',
        section: 'Administration',
    },
    {
        label: 'Artist Verifications',
        href: '/dashboard/admin/verifications',
        icon: CheckCircle2,
        active: (url: string) =>
            url.startsWith('/dashboard/admin/verifications'),
        section: 'Artist Management',
    },
    {
        label: 'Artists Directory',
        href: '/dashboard/admin/artists',
        icon: Users,
        active: (url: string) =>
            url.startsWith('/dashboard/admin/artists'),
        section: 'Artist Management',
    },
];

function ActiveIndicator() {
    return (
        <span
            className="relative flex h-2 w-2 shrink-0 items-center justify-center"
            aria-hidden="true"
        >
            <span className="absolute h-1 w-1 rounded-full bg-[#7de7ff] shadow-[0_0_8px_rgba(125,231,255,0.9),0_0_16px_rgba(125,231,255,0.35)]" />
            <span className="absolute h-2.5 w-px bg-[linear-gradient(to_bottom,transparent,#7de7ff,transparent)] opacity-80" />
            <span className="absolute h-px w-2.5 bg-[linear-gradient(to_right,transparent,#7de7ff,transparent)] opacity-80" />
        </span>
    );
}

function CollapsedActiveIndicator() {
    return (
        <span
            className="pointer-events-none absolute right-1.5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rotate-45 rounded-[1px] bg-[#7de7ff] shadow-[0_0_8px_rgba(125,231,255,0.95),0_0_16px_rgba(125,231,255,0.45)]"
            aria-hidden="true"
        />
    );
}

export default function AdminSidebar({
    collapsed,
    onToggle,
}: AdminSidebarProps) {
    const { url } = usePage();

    return (
        <aside
            className={`fixed left-0 top-0 z-50 hidden h-screen shrink-0 flex-col overflow-hidden border-r border-white/[0.07] bg-[#070809]/95 backdrop-blur-2xl transition-[width] duration-300 lg:flex ${collapsed ? 'w-[76px]' : 'w-[250px]'
                }`}
        >
            {/* Logo */}
            <div
                className={`flex h-[76px] shrink-0 items-center border-b border-white/[0.07] transition-all duration-300 ${collapsed ? 'justify-center px-0' : 'px-8'
                    }`}
            >
                <Link
                    href="/dashboard/admin"
                    aria-label="LIRA Admin Dashboard"
                    className="group"
                >
                    <img
                        src="/images/brand/Lira_logo.png"
                        alt="LIRA"
                        className={`h-auto object-contain opacity-95 transition-all duration-300 group-hover:brightness-125 ${collapsed ? 'w-[38px]' : 'w-[112px]'
                            }`}
                    />
                </Link>
            </div>

            {/* Navigation */}
            <div className={`flex min-h-0 flex-1 flex-col px-3 py-8 ${collapsed ? 'overflow-hidden' : 'overflow-y-auto'}`}>

                {(['Administration', 'Artist Management'] as const).map(
                    (section) => {
                        const items = navigation.filter(
                            (item) => item.section === section,
                        );

                        return (
                            <div key={section} className="mt-4 first:mt-0">
                                {!collapsed && (
                                    <p className="px-4 text-[8px] uppercase tracking-[0.3em] text-zinc-700">
                                        {section}
                                    </p>
                                )}

                                <nav className="mt-3 space-y-1">
                                    {items.map((item) => {
                                        const active = item.active(url);
                                        const Icon = item.icon;

                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                title={
                                                    collapsed
                                                        ? item.label
                                                        : undefined
                                                }
                                                aria-current={
                                                    active ? 'page' : undefined
                                                }
                                                className={`group relative flex items-center rounded-xl px-3 py-3 text-sm transition duration-200 ${collapsed
                                                    ? 'justify-center'
                                                    : 'justify-between px-4'
                                                    } ${active
                                                        ? 'border border-white/[0.08] bg-white/[0.045] text-white'
                                                        : 'border border-transparent text-zinc-500 hover:bg-white/[0.025] hover:text-zinc-200'
                                                    }`}
                                            >
                                                <span className="flex min-w-0 items-center gap-3">
                                                    <Icon
                                                        className={`h-4 w-4 shrink-0 ${active
                                                            ? 'text-cyan-100'
                                                            : 'text-current'
                                                            }`}
                                                        strokeWidth={1.5}
                                                    />

                                                    {!collapsed && (
                                                        <span className="truncate">
                                                            {item.label}
                                                        </span>
                                                    )}
                                                </span>

                                                {!collapsed && active && (
                                                    <ActiveIndicator />
                                                )}

                                                {collapsed && active && (
                                                    <CollapsedActiveIndicator />
                                                )}
                                            </Link>
                                        );
                                    })}
                                </nav>
                            </div>
                        );
                    },
                )}


                <div className="my-8 h-px shrink-0 bg-white/[0.06]" />

                {!collapsed && (
                    <p className="px-4 text-[8px] uppercase tracking-[0.3em] text-zinc-700">
                        Other
                    </p>
                )}

                <nav className="mt-4">
                    <Link
                        href="/dashboard"
                        title={collapsed ? 'Artist Dashboard' : undefined}
                        className={`group relative flex items-center rounded-xl px-3 py-3 text-sm transition duration-200 ${collapsed
                            ? 'justify-center'
                            : 'justify-between px-4'
                            } ${url === '/dashboard' ||
                                url === '/dashboard/'
                                ? 'border border-white/[0.08] bg-white/[0.045] text-white'
                                : 'border border-transparent text-zinc-500 hover:bg-white/[0.025] hover:text-zinc-200'
                            }`}
                    >
                        <span className="flex items-center gap-3">
                            <ArrowLeft
                                className="h-4 w-4 shrink-0"
                                strokeWidth={1.5}
                            />

                            {!collapsed && (
                                <span>Artist Dashboard</span>
                            )}
                        </span>

                    </Link>
                </nav>
            </div>

            {/* Brand footer */}
            {!collapsed && (
                <div className="shrink-0 border-t border-white/[0.07] p-6">
                    <img
                        src="/images/brand/Lira_logo.png"
                        alt="LIRA"
                        className="h-auto w-[72px] opacity-50"
                    />

                    <p className="mt-3 text-[10px] leading-5 text-zinc-700">
                        Your art. Your identity. Your space.
                    </p>
                </div>
            )}

            {/* Collapse button */}
            <div
                className={`absolute bottom-5 ${collapsed
                    ? 'left-1/2 -translate-x-1/2'
                    : 'right-4'
                    }`}
            >
                <button
                    type="button"
                    onClick={onToggle}
                    aria-label={
                        collapsed ? 'Expand sidebar' : 'Collapse sidebar'
                    }
                    title={
                        collapsed ? 'Expand sidebar' : 'Collapse sidebar'
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.025] text-zinc-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition duration-300 hover:border-white/[0.16] hover:bg-white/[0.05] hover:text-white"
                >
                    {collapsed ? (
                        <ArrowRight className="h-4 w-4" />
                    ) : (
                        <ArrowLeft className="h-4 w-4" />
                    )}
                </button>
            </div>
        </aside>
    );
}
