
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Eye,
    EyeOff,
    Save,
    Shield,
    UserRoundCog,
} from 'lucide-react';
import { useState, type FormEvent, type ReactNode } from 'react';
import AdminLayout from '../../../Components/Dashboard/AdminLayout';

type Status = 'pending' | 'verified' | 'rejected';

interface Profile {
    id: number;
    username: string;
    display_name: string;
    verification_status: Status | string;
    user: {
        id: number;
        name: string;
        email: string;
        is_admin: boolean;
    } | null;
}

interface Props {
    profile: Profile;
}

interface FormData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    is_admin: boolean;
    verification_status: Status;
}

function GlassPanel({
    children,
    className = '',
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <div
            className={`relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.025] backdrop-blur-xl ${className}`}
        >
            {children}
        </div>
    );
}

function FieldError({ message }: { message?: string }) {
    if (!message) return null;

    return (
        <p role="alert" className="mt-2 text-xs leading-5 text-rose-300">
            {message}
        </p>
    );
}

const inputClass =
    'w-full rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-3 text-sm text-zinc-200 outline-none transition placeholder:text-zinc-700 focus:border-cyan-200/30 focus:bg-white/[0.04]';

const labelClass =
    'mb-2 block text-[9px] uppercase tracking-[0.25em] text-zinc-600';

export default function Edit({ profile }: Props) {
    const user = profile.user;

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const allowedStatuses: Status[] = [
        'pending',
        'verified',
        'rejected',
    ];

    const status: Status = allowedStatuses.includes(
        profile.verification_status as Status,
    )
        ? (profile.verification_status as Status)
        : 'pending';

    const { data, setData, put, processing, errors } = useForm<FormData>({
        name: user?.name ?? '',
        email: user?.email ?? '',
        password: '',
        password_confirmation: '',
        is_admin: Boolean(user?.is_admin),
        verification_status: status,
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!user || processing) return;

        put(`/dashboard/admin/artists/${user.id}`, {
            preserveScroll: true,
        });
    };

    const handleCancel = () => {
        if (window.history.length > 1) {
            window.history.back();
            return;
        }

        router.visit('/dashboard/admin/artists');
    };

    if (!user) {
        return (
            <AdminLayout>
                <Head title="Manage Account | LIRA Admin" />

                <div className="mx-auto max-w-[1400px] px-6 py-10 text-white sm:px-8 lg:px-12 lg:py-12">
                    <div className="mb-5 flex items-center gap-3">
                        <span className="h-px w-8 bg-[linear-gradient(90deg,#ffffff,#7d8991,transparent)]" />
                        <span className="text-[9px] uppercase tracking-[0.35em] text-zinc-600">
                            LIRA / ADMIN / ARTISTS / ACCOUNT
                        </span>
                    </div>

                    <h1 className="text-4xl font-light tracking-[-0.055em] sm:text-5xl">
                        Manage
                        <br />
                        <span className="bg-[linear-gradient(90deg,#fff_0%,#bdefff_24%,#9d8cff_58%,#f08bd7_82%,#fff_100%)] bg-clip-text text-transparent">
                            account.
                        </span>
                    </h1>

                    <GlassPanel className="mt-10">
                        <div className="px-6 py-16 text-center">
                            <UserRoundCog className="mx-auto h-7 w-7 text-zinc-600" />

                            <h2 className="mt-5 text-sm text-white">
                                Account unavailable.
                            </h2>

                            <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-zinc-600">
                                This artist profile is not linked to an active
                                user account. Account settings cannot be
                                managed from this page.
                            </p>

                            <Link
                                href="/dashboard/admin/artists"
                                className="group mt-6 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-zinc-500 transition hover:text-white"
                            >
                                <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
                                Back to Directory
                            </Link>
                        </div>
                    </GlassPanel>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <Head
                title={`Manage ${profile.display_name || user.name} | LIRA Admin`}
            />

            <div className="mx-auto max-w-[1400px] px-6 py-10 text-white sm:px-8 lg:px-12 lg:py-12">
                {/* Page Header */}

                <div className="mb-12">
                    <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
                        <div>
                            <div className="mb-5 flex items-center gap-3">
                                <span className="h-px w-8 bg-[linear-gradient(90deg,#ffffff,#7d8991,transparent)]" />

                                <span className="text-[9px] uppercase tracking-[0.35em] text-zinc-600">
                                    LIRA / ADMIN / ARTISTS / ACCOUNT
                                </span>
                            </div>

                            <h1 className="text-4xl font-light tracking-[-0.055em] sm:text-5xl">
                                Manage
                                <br />
                                <span className="bg-[linear-gradient(90deg,#fff_0%,#bdefff_24%,#9d8cff_58%,#f08bd7_82%,#fff_100%)] bg-clip-text text-transparent">
                                    account.
                                </span>
                            </h1>

                            <p className="mt-5 max-w-xl text-sm leading-6 text-zinc-600">
                                Manage account details, verification status,
                                and administrative permissions.
                            </p>
                        </div>

                        <div className="flex shrink-0 items-center gap-4">
                            <Link
                                href={`/dashboard/admin/artists/${profile.id}`}
                                className="group inline-flex items-center gap-2 rounded-xl border border-white/[0.10] bg-white/[0.045] px-4 py-2.5 text-xs font-medium text-white/80 shadow-[0_0_20px_rgba(255,255,255,0.02)] transition duration-300 hover:border-white/[0.18] hover:bg-white/[0.08] hover:text-white"
                            >
                                <ArrowLeft className="h-3.5 w-3.5 text-white/60 transition-transform duration-300 group-hover:-translate-x-1 group-hover:text-white" />
                                Back to Artist
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Account Summary */}

                <div className="mb-5 flex items-end justify-between gap-4">
                    <div>
                        <p className="text-[9px] uppercase tracking-[0.3em] text-zinc-600">
                            Account Management
                        </p>

                        <h2 className="mt-2 text-2xl font-light tracking-[-0.04em] text-white">
                            {profile.display_name || 'Unnamed artist'}
                        </h2>

                        <p className="mt-2 text-xs text-zinc-600">
                            @{profile.username || 'no-username'}
                            <span className="mx-2">·</span>
                            Account ID {user.id}
                        </p>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-5">
                    {/* Account Details */}

                    <GlassPanel>
                        <div className="border-b border-white/[0.06] p-6 sm:p-7">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.025]">
                                    <UserRoundCog className="h-4 w-4 text-zinc-500" />
                                </div>

                                <div>
                                    <h2 className="text-sm text-white">
                                        Account Details
                                    </h2>

                                    <p className="mt-1 text-[10px] text-zinc-600">
                                        Update the name and email associated
                                        with this account.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-7">
                            <div>
                                <label
                                    htmlFor="artist-name"
                                    className={labelClass}
                                >
                                    Full Name
                                </label>

                                <input
                                    id="artist-name"
                                    value={data.name}
                                    onChange={(event) =>
                                        setData('name', event.target.value)
                                    }
                                    required
                                    maxLength={255}
                                    autoComplete="name"
                                    aria-invalid={Boolean(errors.name)}
                                    aria-describedby={
                                        errors.name ? 'artist-name-error' : undefined
                                    }
                                    className={inputClass}
                                />

                                {errors.name && (
                                    <div id="artist-name-error">
                                        <FieldError message={errors.name} />
                                    </div>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="artist-email"
                                    className={labelClass}
                                >
                                    Email Address
                                </label>

                                <input
                                    id="artist-email"
                                    type="email"
                                    value={data.email}
                                    onChange={(event) =>
                                        setData('email', event.target.value)
                                    }
                                    required
                                    maxLength={255}
                                    autoComplete="email"
                                    aria-invalid={Boolean(errors.email)}
                                    aria-describedby={
                                        errors.email ? 'artist-email-error' : undefined
                                    }
                                    className={inputClass}
                                />

                                {errors.email && (
                                    <div id="artist-email-error">
                                        <FieldError message={errors.email} />
                                    </div>
                                )}
                            </div>

                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="artist-status"
                                    className={labelClass}
                                >
                                    Verification Status
                                </label>

                                <select
                                    id="artist-status"
                                    value={data.verification_status}
                                    onChange={(event) =>
                                        setData(
                                            'verification_status',
                                            event.target.value as Status,
                                        )
                                    }
                                    aria-invalid={Boolean(
                                        errors.verification_status,
                                    )}
                                    className={`${inputClass} [color-scheme:dark]`}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="verified">Verified</option>
                                    <option value="rejected">Rejected</option>
                                </select>

                                <FieldError
                                    message={errors.verification_status}
                                />

                                <p className="mt-2 text-[10px] leading-5 text-zinc-700">
                                    This updates the artist profile's
                                    verification status.
                                </p>
                            </div>
                        </div>
                    </GlassPanel>

                    {/* Password */}

                    <GlassPanel>
                        <div className="border-b border-white/[0.06] p-6 sm:p-7">
                            <h2 className="text-sm text-white">
                                Password
                            </h2>

                            <p className="mt-2 text-xs leading-5 text-zinc-600">
                                Leave both fields blank to keep the current
                                password. Use a strong password when changing
                                account credentials.
                            </p>
                        </div>

                        <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-7">
                            <div>
                                <label
                                    htmlFor="artist-password"
                                    className={labelClass}
                                >
                                    New Password
                                </label>

                                <div className="relative">
                                    <input
                                        id="artist-password"
                                        type={
                                            showPassword ? 'text' : 'password'
                                        }
                                        autoComplete="new-password"
                                        value={data.password}
                                        onChange={(event) =>
                                            setData(
                                                'password',
                                                event.target.value,
                                            )
                                        }
                                        minLength={8}
                                        aria-invalid={Boolean(errors.password)}
                                        className={`${inputClass} pr-12`}
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword((value) => !value)
                                        }
                                        aria-label={
                                            showPassword
                                                ? 'Hide password'
                                                : 'Show password'
                                        }
                                        className="absolute inset-y-0 right-0 flex items-center px-4 text-zinc-600 transition hover:text-white"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>

                                <FieldError message={errors.password} />
                            </div>

                            <div>
                                <label
                                    htmlFor="artist-password-confirmation"
                                    className={labelClass}
                                >
                                    Confirm Password
                                </label>

                                <div className="relative">
                                    <input
                                        id="artist-password-confirmation"
                                        type={
                                            showConfirmation
                                                ? 'text'
                                                : 'password'
                                        }
                                        autoComplete="new-password"
                                        value={data.password_confirmation}
                                        onChange={(event) =>
                                            setData(
                                                'password_confirmation',
                                                event.target.value,
                                            )
                                        }
                                        minLength={8}
                                        aria-invalid={Boolean(
                                            errors.password_confirmation,
                                        )}
                                        className={`${inputClass} pr-12`}
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmation(
                                                (value) => !value,
                                            )
                                        }
                                        aria-label={
                                            showConfirmation
                                                ? 'Hide password confirmation'
                                                : 'Show password confirmation'
                                        }
                                        className="absolute inset-y-0 right-0 flex items-center px-4 text-zinc-600 transition hover:text-white"
                                    >
                                        {showConfirmation ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>

                                <FieldError
                                    message={errors.password_confirmation}
                                />
                            </div>
                        </div>
                    </GlassPanel>

                    {/* Administrator Permissions */}

                    <GlassPanel>
                        <div className="p-6 sm:p-7">
                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.025]">
                                    <Shield className="h-4 w-4 text-zinc-500" />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <h2 className="text-sm text-white">
                                        Administrator Access
                                    </h2>

                                    <p className="mt-2 text-xs leading-5 text-zinc-600">
                                        Only enable this for trusted
                                        administrators. This permission grants
                                        access to the LIRA Admin area.
                                    </p>

                                    <label className="mt-5 flex cursor-pointer items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={data.is_admin}
                                            onChange={(event) =>
                                                setData(
                                                    'is_admin',
                                                    event.target.checked,
                                                )
                                            }
                                            className="h-4 w-4 rounded border-white/20 bg-white/[0.05] accent-cyan-300"
                                        />

                                        <span className="text-xs text-zinc-300">
                                            Grant administrator privileges
                                        </span>
                                    </label>

                                    <FieldError message={errors.is_admin} />
                                </div>
                            </div>
                        </div>
                    </GlassPanel>

                    {/* Form Actions */}

                    <div className="border-t border-white/[0.06] pt-5">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-[10px] leading-5 text-zinc-700">
                                Changes take effect after the account is
                                successfully saved.
                            </p>

                            <div className="flex flex-col-reverse gap-3 sm:flex-row">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    disabled={processing}
                                    className="inline-flex items-center justify-center rounded-xl border border-white/[0.10] bg-white/[0.025] px-5 py-3 text-xs text-zinc-400 transition hover:border-white/[0.18] hover:bg-white/[0.05] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white bg-white px-5 py-3 text-xs font-medium text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <Save className="h-3.5 w-3.5" />
                                    {processing
                                        ? 'Saving changes…'
                                        : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
