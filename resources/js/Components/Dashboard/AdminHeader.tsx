import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import type { PageProps as InertiaPageProps } from '@inertiajs/core';
import {
    ArrowLeft,
    CheckCircle2,
    ChevronRight,
    LayoutDashboard,
    LogOut,
    Menu,
    Settings,
    ShieldCheck,
    Users,
    X,
} from 'lucide-react';

interface AdminHeaderProps {
    sidebarCollapsed: boolean;
}

interface AdminPageProps extends InertiaPageProps {
    auth: {
        user: {
            name: string;
            email: string;
        };
    };
}

const adminLinks = [
    {
        label: 'Dashboard',
        href: '/dashboard/admin',
        icon: LayoutDashboard,
        active: (url: string) => url === '/dashboard/admin',
    },
    {
        label: 'Artist Verifications',
        href: '/dashboard/admin/verifications',
        icon: CheckCircle2,
        active: (url: string) =>
            url.startsWith('/dashboard/admin/verifications'),
    },
];

export default function AdminHeader({
    sidebarCollapsed,
}: AdminHeaderProps) {
    const page = usePage();

    const { auth } = page.props as typeof page.props & {
        auth: AdminPageProps['auth'];
    };

    const url = page.url;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header
            className={`fixed right-0 top-0 z-40 w-full border-b border-white/[0.07] bg-[#050607]/95 backdrop-blur-xl transition-[left] duration-300 lg:w-auto ${sidebarCollapsed
                ? 'lg:left-[76px]'
                : 'lg:left-[250px]'
                }`}
        >
            <div className="flex min-h-[68px] items-center justify-between gap-3 px-4 sm:px-6 lg:h-[76px] lg:px-10">
                <Link
                    href="/dashboard/admin"
                    aria-label="LIRA Admin Dashboard"
                    className="lg:hidden"
                >
                    <img
                        src="/images/brand/Lira_logo.png"
                        alt="LIRA"
                        className="w-[68px] opacity-95 sm:w-[78px]"
                    />
                </Link>

                <div className="hidden lg:block">
                    <p className="text-[8px] uppercase tracking-[0.32em] text-zinc-600">
                        LIRA / ADMIN
                    </p>
                    <p className="mt-1 text-xs text-zinc-400">
                        {url.startsWith('/dashboard/admin/verifications')
                            ? 'Artist Verifications'
                            : 'Administration'}
                    </p>
                </div>

                <div className="ml-auto hidden items-center gap-4 lg:flex">
                    <div className="text-right">
                        <p className="text-xs text-zinc-200">
                            {auth.user.name}
                        </p>
                        <p className="mt-1 text-[9px] text-zinc-600">
                            Administrator
                        </p>
                    </div>

                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.05] text-zinc-300">
                        <ShieldCheck className="h-4 w-4" />
                    </div>

                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        aria-label="Log out"
                        className="text-zinc-500 transition hover:text-white"
                    >
                        <LogOut className="h-4 w-4" />
                    </Link>
                </div>

                <button
                    type="button"
                    onClick={() => setMobileMenuOpen((open) => !open)}
                    aria-label={mobileMenuOpen ? 'Close admin menu' : 'Open admin menu'}
                    aria-expanded={mobileMenuOpen}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/[0.10] bg-white/[0.04] text-zinc-300 transition hover:bg-white/[0.08] hover:text-white lg:hidden"
                >
                    {mobileMenuOpen ? (
                        <X className="h-4 w-4" />
                    ) : (
                        <Menu className="h-4 w-4" />
                    )}
                </button>
            </div>

            {mobileMenuOpen && (
                <div className="max-h-[calc(100dvh-68px)] overflow-y-auto border-t border-white/[0.07] bg-[#070809] px-4 pb-5 pt-4 lg:hidden">
                    <div className="mb-4 rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-3">
                        <p className="text-sm text-zinc-200">
                            {auth.user.name}
                        </p>
                        <p className="mt-1 text-[10px] text-zinc-500">
                            {auth.user.email}
                        </p>
                        <p className="mt-2 text-[9px] uppercase tracking-[0.2em] text-cyan-200/70">
                            Administrator
                        </p>
                    </div>

                    <p className="mb-2 px-2 text-[9px] uppercase tracking-[0.3em] text-zinc-600">
                        Administration
                    </p>

                    <nav className="space-y-1">
                        {adminLinks.map((item) => {
                            const active = item.active(url);
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex min-h-12 items-center justify-between rounded-xl border px-4 transition ${active
                                        ? 'border-white/[0.10] bg-white/[0.07] text-white'
                                        : 'border-transparent text-zinc-400 hover:bg-white/[0.04] hover:text-white'
                                        }`}
                                >
                                    <span className="flex items-center gap-3 text-sm">
                                        <Icon className="h-4 w-4" />
                                        {item.label}
                                    </span>
                                    <ChevronRight className="h-3.5 w-3.5" />
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="my-4 h-px bg-white/[0.07]" />

                    <Link
                        href="/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex min-h-12 items-center gap-3 rounded-xl px-4 text-sm text-zinc-400 transition hover:bg-white/[0.04] hover:text-white"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Artist Dashboard
                    </Link>

                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        onClick={() => setMobileMenuOpen(false)}
                        className="mt-1 flex min-h-12 w-full items-center gap-3 rounded-xl px-4 text-sm text-zinc-400 transition hover:bg-white/[0.04] hover:text-white"
                    >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </Link>

                    <div className="mt-5 flex items-center justify-between px-4">
                        <img
                            src="/images/brand/Lira_logo.png"
                            alt="LIRA"
                            className="w-[55px] opacity-35"
                        />
                        <Settings className="h-4 w-4 text-zinc-700" />
                    </div>
                </div>
            )}
        </header>
    );
}
