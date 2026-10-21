import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import AdminLayout from '../../../Components/Dashboard/AdminLayout';

interface AdminUser {
    id: number;
    name: string;
    email: string;
}

interface Props {
    user: AdminUser | null;
}

export default function Form({ user }: Props) {
    const editing = user !== null;
    const form = useForm({
        name: user?.name ?? '',
        email: user?.email ?? '',
        password: '',
        password_confirmation: '',
    });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (user) {
            form.put(`/dashboard/admin/users/${user.id}`);
        } else {
            form.post('/dashboard/admin/users');
        }
    }

    const inputClasses =
        'h-11 w-full rounded-xl border border-white/10 bg-black/20 px-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-cyan-200/40';
    const fieldLabelClasses =
        'mb-2 block text-xs font-medium text-zinc-300';

    return (
        <AdminLayout>
            <Head title={editing ? 'Edit Admin User' : 'Add Admin User'} />

            <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
                <Link
                    href="/dashboard/admin/users"
                    className="mb-7 inline-flex items-center gap-2 text-xs text-zinc-400 transition hover:text-white"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to user management
                </Link>

                <header className="mb-8">
                    <p className="text-[9px] uppercase tracking-[0.3em] text-zinc-600">
                        Administration / Access
                    </p>
                    <h1 className="mt-3 text-3xl font-light tracking-[-0.05em] text-white sm:text-4xl">
                        {editing ? 'Edit admin account' : 'Add admin user'}
                    </h1>
                    <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-500">
                        {editing
                            ? 'Update the account name, email, or password.'
                            : 'Create a dedicated administrator account without an artist profile.'}
                    </p>
                </header>

                <form
                    onSubmit={submit}
                    className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 backdrop-blur-xl sm:p-7"
                >
                    <div className="grid gap-5">
                        <div>
                            <label htmlFor="name" className={fieldLabelClasses}>
                                Full name
                            </label>
                            <input
                                id="name"
                                type="text"
                                autoComplete="name"
                                required
                                maxLength={255}
                                value={form.data.name}
                                onChange={(event) =>
                                    form.setData('name', event.target.value)
                                }
                                aria-invalid={Boolean(form.errors.name)}
                                aria-describedby={
                                    form.errors.name ? 'name-error' : undefined
                                }
                                className={inputClasses}
                            />
                            {form.errors.name && (
                                <p
                                    id="name-error"
                                    role="alert"
                                    className="mt-2 text-xs text-red-300"
                                >
                                    {form.errors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="email" className={fieldLabelClasses}>
                                Email address
                            </label>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                required
                                maxLength={255}
                                value={form.data.email}
                                onChange={(event) =>
                                    form.setData('email', event.target.value)
                                }
                                aria-invalid={Boolean(form.errors.email)}
                                aria-describedby={
                                    form.errors.email
                                        ? 'email-error'
                                        : undefined
                                }
                                className={inputClasses}
                            />
                            {form.errors.email && (
                                <p
                                    id="email-error"
                                    role="alert"
                                    className="mt-2 text-xs text-red-300"
                                >
                                    {form.errors.email}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="password"
                                    className={fieldLabelClasses}
                                >
                                    {editing
                                        ? 'New password (optional)'
                                        : 'Initial password'}
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required={!editing}
                                    minLength={8}
                                    value={form.data.password}
                                    onChange={(event) =>
                                        form.setData(
                                            'password',
                                            event.target.value,
                                        )
                                    }
                                    aria-invalid={Boolean(form.errors.password)}
                                    aria-describedby={
                                        form.errors.password
                                            ? 'password-error'
                                            : 'password-hint'
                                    }
                                    className={inputClasses}
                                />
                                {form.errors.password ? (
                                    <p
                                        id="password-error"
                                        role="alert"
                                        className="mt-2 text-xs text-red-300"
                                    >
                                        {form.errors.password}
                                    </p>
                                ) : (
                                    <p
                                        id="password-hint"
                                        className="mt-2 text-xs leading-5 text-zinc-500"
                                    >
                                        Use at least 8 characters. Share it
                                        securely with the account owner.
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="password_confirmation"
                                    className={fieldLabelClasses}
                                >
                                    Confirm password
                                </label>
                                <input
                                    id="password_confirmation"
                                    type="password"
                                    autoComplete="new-password"
                                    required={!editing || form.data.password !== ''}
                                    value={form.data.password_confirmation}
                                    onChange={(event) =>
                                        form.setData(
                                            'password_confirmation',
                                            event.target.value,
                                        )
                                    }
                                    className={inputClasses}
                                />
                            </div>
                        </div>

                        {editing && (
                            <p className="text-xs leading-5 text-zinc-500">
                                Leave both password fields blank to keep the
                                current password.
                            </p>
                        )}

                        {!editing && (
                            <div className="flex items-start gap-3 rounded-xl border border-cyan-200/15 bg-cyan-200/[0.04] p-4">
                                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-cyan-200" />
                                <p className="text-xs leading-5 text-zinc-300">
                                    This account will receive admin access and
                                    be marked as email-verified. It will not
                                    have an artist profile.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="mt-7 flex flex-col-reverse gap-3 border-t border-white/[0.08] pt-5 sm:flex-row sm:justify-end">
                        <Link
                            href="/dashboard/admin/users"
                            className="inline-flex h-11 items-center justify-center rounded-xl border border-white/10 px-5 text-sm text-zinc-300 transition hover:bg-white/[0.05] hover:text-white"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={form.processing}
                            className="inline-flex h-11 items-center justify-center rounded-xl border border-cyan-200/25 bg-cyan-200/[0.1] px-5 text-sm font-medium text-cyan-100 transition hover:bg-cyan-200/[0.16] disabled:cursor-wait disabled:opacity-60"
                        >
                            {form.processing
                                ? 'Saving...'
                                : editing
                                  ? 'Save changes'
                                  : 'Create admin account'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
