import { Head, router } from '@inertiajs/react';
import { Check, Moon, Sun } from 'lucide-react';
import { useState } from 'react';

import DashboardLayout from '../../Components/Dashboard/d_layout';

type DashboardTheme = 'dark' | 'light';

interface Props {
    dashboardTheme: DashboardTheme;
}

const themes: Array<{
    id: DashboardTheme;
    label: string;
    description: string;
    Icon: typeof Moon;
}> = [
    {
        id: 'dark',
        label: 'Dark glass',
        description: 'The original dark chrome dashboard appearance.',
        Icon: Moon,
    },
    {
        id: 'light',
        label: 'Light',
        description: 'A bright, neutral workspace with the same layout.',
        Icon: Sun,
    },
];

export default function ArtistSettings({ dashboardTheme }: Props) {
    const [savingTheme, setSavingTheme] = useState<DashboardTheme | null>(null);

    function selectTheme(theme: DashboardTheme) {
        if (theme === dashboardTheme || savingTheme) {
            return;
        }

        setSavingTheme(theme);
        router.patch(
            '/dashboard/settings',
            { dashboard_theme: theme },
            {
                preserveScroll: true,
                onFinish: () => setSavingTheme(null),
            },
        );
    }

    return (
        <DashboardLayout>
            <Head title="Settings" />

            <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 lg:px-12">
                <header>
                    <p className="text-[9px] uppercase tracking-[0.3em] text-zinc-500">
                        Account
                    </p>
                    <h1 className="mt-3 text-3xl font-light tracking-tight text-white sm:text-4xl">
                        Settings
                    </h1>
                    <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-400">
                        Personalize your artist workspace. These preferences
                        affect your dashboard only, not your public portfolio.
                    </p>
                </header>

                <section
                    className="mt-10 max-w-3xl rounded-2xl border border-white/[0.09] bg-white/[0.018] p-5 backdrop-blur-xl sm:p-7"
                    aria-labelledby="appearance-heading"
                >
                    <div className="border-b border-white/[0.07] pb-5">
                        <h2
                            id="appearance-heading"
                            className="text-base font-medium text-white"
                        >
                            Appearance
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-zinc-400">
                            Choose the color theme for your dashboard.
                        </p>
                    </div>

                    <div
                        className="mt-5 grid gap-3 sm:grid-cols-2"
                        aria-label="Dashboard color theme"
                    >
                        {themes.map(({ id, label, description, Icon }) => {
                            const selected = dashboardTheme === id;
                            const isSaving = savingTheme === id;

                            return (
                                <button
                                    key={id}
                                    type="button"
                                    aria-pressed={selected}
                                    disabled={savingTheme !== null}
                                    onClick={() => selectTheme(id)}
                                    className={`relative rounded-xl border p-4 text-left transition disabled:cursor-wait disabled:opacity-70 ${
                                        selected
                                            ? 'border-cyan-200/40 bg-cyan-200/[0.06]'
                                            : 'border-white/[0.08] bg-white/[0.02] hover:border-white/[0.16] hover:bg-white/[0.04]'
                                    }`}
                                >
                                    <span className="flex items-center justify-between gap-3">
                                        <span
                                            className={`flex h-10 w-10 items-center justify-center rounded-lg border ${
                                                selected
                                                    ? 'border-cyan-200/20 bg-cyan-200/[0.08] text-cyan-100'
                                                    : 'border-white/[0.08] bg-white/[0.03] text-zinc-300'
                                            }`}
                                        >
                                            <Icon
                                                className="h-4 w-4"
                                                strokeWidth={1.6}
                                            />
                                        </span>

                                        {selected && (
                                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-200/15 text-cyan-100">
                                                <Check className="h-3 w-3" />
                                            </span>
                                        )}
                                    </span>

                                    <span className="mt-4 block text-sm font-medium text-white">
                                        {label}
                                    </span>
                                    <span className="mt-1 block text-xs leading-5 text-zinc-400">
                                        {isSaving ? 'Saving preference...' : description}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </section>
            </div>
        </DashboardLayout>
    );
}
