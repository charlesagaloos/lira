import { FormEvent, useState } from 'react';
import { Link, router } from '@inertiajs/react';

interface Settings {
    template: string;
    primary_color: string;
    background_color: string;
    text_color: string;
    accent_color: string;
    card_background_color: string;
    card_text_color: string;
    card_accent_color: string;
}

interface Props {
    settings: Settings;
}

export default function Settings({ settings }: Props) {
    const [template, setTemplate] = useState(settings.template);
    const [primaryColor, setPrimaryColor] = useState(settings.primary_color);
    const [backgroundColor, setBackgroundColor] = useState(
        settings.background_color,
    );

    const [cardBackgroundColor, setCardBackgroundColor] = useState(
        settings.card_background_color,
    );

    const [cardTextColor, setCardTextColor] = useState(
        settings.card_text_color,
    );

    const [cardAccentColor, setCardAccentColor] = useState(
        settings.card_accent_color,
    );
    const [textColor, setTextColor] = useState(settings.text_color);
    const [accentColor, setAccentColor] = useState(settings.accent_color);

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        router.put('/dashboard/portfolio/settings', {
            template,
            primary_color: primaryColor,
            background_color: backgroundColor,
            text_color: textColor,
            accent_color: accentColor,
            card_background_color: cardBackgroundColor,
            card_text_color: cardTextColor,
            card_accent_color: cardAccentColor,
        });
    }

    return (
        <main className="min-h-screen bg-zinc-950 px-6 py-12 text-white sm:px-8 lg:px-12">
            <div className="mx-auto max-w-4xl">
                <Link
                    href="/dashboard"
                    className="text-sm text-zinc-500 transition hover:text-white"
                >
                    ← Back to Dashboard
                </Link>

                <div className="mt-10">
                    <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
                        Portfolio
                    </p>

                    <h1 className="mt-2 text-4xl font-bold tracking-tight">
                        Customize Portfolio
                    </h1>

                    <p className="mt-3 text-zinc-400">
                        Customize the appearance of your public portfolio.
                    </p>
                </div>

                <form onSubmit={submit} className="mt-10 space-y-8">
                    <section className="rounded-2xl border border-white/10 bg-zinc-900 p-6">
                        <h2 className="text-xl font-semibold">Template</h2>

                        <p className="mt-2 text-sm text-zinc-400">
                            Choose the visual style of your portfolio.
                        </p>

                        <div className="mt-6">
                            <label
                                htmlFor="template"
                                className="mb-2 block text-sm font-medium text-zinc-300"
                            >
                                Template
                            </label>

                            <select
                                id="template"
                                value={template}
                                onChange={(event) =>
                                    setTemplate(event.target.value)
                                }
                                className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-white/30"
                            >
                                <option value="default">Default</option>
                            </select>
                        </div>
                    </section>

                    <section className="rounded-2xl border border-white/10 bg-zinc-900 p-6">
                        <h2 className="text-xl font-semibold">Colors</h2>

                        <p className="mt-2 text-sm text-zinc-400">
                            Define the colors used by your public portfolio.
                        </p>

                        <div className="mt-6 grid gap-6 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="primary_color"
                                    className="mb-2 block text-sm font-medium text-zinc-300"
                                >
                                    Primary Color
                                </label>

                                <div className="flex gap-3">
                                    <input
                                        id="primary_color"
                                        type="color"
                                        value={primaryColor}
                                        onChange={(event) =>
                                            setPrimaryColor(event.target.value)
                                        }
                                        className="h-12 w-16 cursor-pointer rounded-lg border border-white/10 bg-zinc-950 p-1"
                                    />

                                    <input
                                        type="text"
                                        value={primaryColor}
                                        onChange={(event) =>
                                            setPrimaryColor(event.target.value)
                                        }
                                        className="min-w-0 flex-1 rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-white/30"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="background_color"
                                    className="mb-2 block text-sm font-medium text-zinc-300"
                                >
                                    Background Color
                                </label>

                                <div className="flex gap-3">
                                    <input
                                        id="background_color"
                                        type="color"
                                        value={backgroundColor}
                                        onChange={(event) =>
                                            setBackgroundColor(
                                                event.target.value,
                                            )
                                        }
                                        className="h-12 w-16 cursor-pointer rounded-lg border border-white/10 bg-zinc-950 p-1"
                                    />

                                    <input
                                        type="text"
                                        value={backgroundColor}
                                        onChange={(event) =>
                                            setBackgroundColor(event.target.value)
                                        }
                                        className="min-w-0 flex-1 rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-white/30"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="text_color"
                                    className="mb-2 block text-sm font-medium text-zinc-300"
                                >
                                    Text Color
                                </label>

                                <div className="flex gap-3">
                                    <input
                                        id="text_color"
                                        type="color"
                                        value={textColor}
                                        onChange={(event) =>
                                            setTextColor(event.target.value)
                                        }
                                        className="h-12 w-16 cursor-pointer rounded-lg border border-white/10 bg-zinc-950 p-1"
                                    />

                                    <input
                                        type="text"
                                        value={textColor}
                                        onChange={(event) =>
                                            setTextColor(event.target.value)
                                        }
                                        className="min-w-0 flex-1 rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-white/30"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="accent_color"
                                    className="mb-2 block text-sm font-medium text-zinc-300"
                                >
                                    Accent Color
                                </label>

                                <div className="flex gap-3">
                                    <input
                                        id="accent_color"
                                        type="color"
                                        value={accentColor}
                                        onChange={(event) =>
                                            setAccentColor(event.target.value)
                                        }
                                        className="h-12 w-16 cursor-pointer rounded-lg border border-white/10 bg-zinc-950 p-1"
                                    />

                                    <input
                                        type="text"
                                        value={accentColor}
                                        onChange={(event) =>
                                            setAccentColor(event.target.value)
                                        }
                                        className="min-w-0 flex-1 rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-white/30"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="rounded-2xl border border-white/10 bg-zinc-900 p-6">
                        <h2 className="text-xl font-semibold">Project Cards</h2>

                        <p className="mt-2 text-sm text-zinc-400">
                            Define the colors used by project cards on your public portfolio.
                        </p>

                        <div className="mt-6 grid gap-6 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="card_background_color"
                                    className="mb-2 block text-sm font-medium text-zinc-300"
                                >
                                    Card Background Color
                                </label>

                                <div className="flex gap-3">
                                    <input
                                        id="card_background_color"
                                        type="color"
                                        value={cardBackgroundColor}
                                        onChange={(event) =>
                                            setCardBackgroundColor(event.target.value)
                                        }
                                        className="h-12 w-16 cursor-pointer rounded-lg border border-white/10 bg-zinc-950 p-1"
                                    />

                                    <input
                                        type="text"
                                        value={cardBackgroundColor}
                                        onChange={(event) =>
                                            setCardBackgroundColor(event.target.value)
                                        }
                                        className="min-w-0 flex-1 rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-white/30"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="card_text_color"
                                    className="mb-2 block text-sm font-medium text-zinc-300"
                                >
                                    Card Text Color
                                </label>

                                <div className="flex gap-3">
                                    <input
                                        id="card_text_color"
                                        type="color"
                                        value={cardTextColor}
                                        onChange={(event) =>
                                            setCardTextColor(event.target.value)
                                        }
                                        className="h-12 w-16 cursor-pointer rounded-lg border border-white/10 bg-zinc-950 p-1"
                                    />

                                    <input
                                        type="text"
                                        value={cardTextColor}
                                        onChange={(event) =>
                                            setCardTextColor(event.target.value)
                                        }
                                        className="min-w-0 flex-1 rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-white/30"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="card_accent_color"
                                    className="mb-2 block text-sm font-medium text-zinc-300"
                                >
                                    Card Accent Color
                                </label>

                                <div className="flex gap-3">
                                    <input
                                        id="card_accent_color"
                                        type="color"
                                        value={cardAccentColor}
                                        onChange={(event) =>
                                            setCardAccentColor(event.target.value)
                                        }
                                        className="h-12 w-16 cursor-pointer rounded-lg border border-white/10 bg-zinc-950 p-1"
                                    />

                                    <input
                                        type="text"
                                        value={cardAccentColor}
                                        onChange={(event) =>
                                            setCardAccentColor(event.target.value)
                                        }
                                        className="min-w-0 flex-1 rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-white/30"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="flex items-center gap-4">
                        <Link
                            href="/dashboard"
                            className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-zinc-300 transition hover:border-white/20 hover:text-white"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}
