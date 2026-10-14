import { FormEvent, ReactNode, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';

import DashboardLayout from '../../Components/Dashboard/d_layout';
import FlashAlert from '../../Components/UI/FlashAlert';

// Chrome sparkle decoration.
function ChromeSparkle({
    className = '',
    size = 'sm',
}: {
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}) {
    const sizes = {
        sm: 'h-3 w-3',
        md: 'h-4 w-4',
        lg: 'h-5 w-5',
    };

    return (
        <span
            className={`pointer-events-none absolute ${sizes[size]} ${className}`}
            aria-hidden="true"
        >
            <svg viewBox="0 0 20 20" fill="none" className="h-full w-full">
                <path
                    d="M10 0.75C10.6 6.8 13.2 9.4 19.25 10C13.2 10.6 10.6 13.2 10 19.25C9.4 13.2 6.8 10.6 0.75 10C6.8 9.4 9.4 6.8 10 0.75Z"
                    fill="url(#chrome-sparkle-security)"
                />
                <defs>
                    <linearGradient
                        id="chrome-sparkle-security"
                        x1="2"
                        y1="2"
                        x2="18"
                        y2="18"
                    >
                        <stop offset="0" stopColor="#ffffff" />
                        <stop offset="0.35" stopColor="#dce5e9" />
                        <stop offset="0.55" stopColor="#7d8a91" />
                        <stop offset="0.72" stopColor="#ffffff" />
                        <stop offset="1" stopColor="#68747c" />
                    </linearGradient>
                </defs>
            </svg>
        </span>
    );
}

// Reusable glass section.
function GlassSection({
    number,
    icon,
    title,
    description,
    children,
}: {
    number: string;
    icon: ReactNode;
    title: string;
    description: string;
    children: ReactNode;
}) {
    return (
        <section className="group relative overflow-hidden rounded-[1.5rem] border border-white/[0.10] bg-[linear-gradient(145deg,rgba(255,255,255,0.045),rgba(255,255,255,0.012)_35%,rgba(255,255,255,0.018)_70%,rgba(255,255,255,0.035))] shadow-[0_30px_80px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.055)] backdrop-blur-2xl transition duration-500 hover:border-white/[0.14]">
            <div className="pointer-events-none absolute inset-0 rounded-[1.5rem] border border-white/[0.025]" />

            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent_5%,rgba(255,255,255,0.45)_35%,rgba(255,255,255,0.18)_55%,transparent_95%)] opacity-70" />

            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(125deg,transparent_0%,transparent_42%,rgba(255,255,255,0.018)_49%,rgba(255,255,255,0.035)_51%,transparent_58%,transparent_100%)] opacity-70" />

            <ChromeSparkle
                size="sm"
                className="right-8 top-7 opacity-30 transition duration-500 group-hover:opacity-60"
            />

            <ChromeSparkle
                size="sm"
                className="bottom-8 right-[18%] opacity-10 transition duration-700 group-hover:opacity-30"
            />

            <div className="relative p-6 sm:p-8 lg:p-9">
                <div className="flex items-start gap-5">
                    <div className="hidden shrink-0 sm:block">
                        <span className="text-[9px] uppercase tracking-[0.25em] text-zinc-700">
                            {number}
                        </span>
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="flex items-start gap-4">
                            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/[0.09] bg-[linear-gradient(145deg,rgba(255,255,255,0.065),rgba(255,255,255,0.015))] text-zinc-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_45%,rgba(255,255,255,0.025))]" />
                                <span className="relative">{icon}</span>
                            </div>

                            <div className="min-w-0">
                                <h2 className="text-lg font-medium tracking-[-0.02em] text-white">
                                    {title}
                                </h2>
                                <p className="mt-1.5 max-w-xl text-xs leading-5 text-zinc-600">
                                    {description}
                                </p>
                            </div>
                        </div>

                        <div className="mt-8">{children}</div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// Password field definitions.
type PasswordFieldName =
    | 'current_password'
    | 'password'
    | 'password_confirmation';

interface PasswordFieldProps {
    name: PasswordFieldName;
    label: string;
    placeholder: string;
    value: string;
    error?: string;
    visible: boolean;
    onChange: (value: string) => void;
    onToggleVisibility: () => void;
}

// Password input with visibility toggle.
function PasswordField({
    name,
    label,
    placeholder,
    value,
    error,
    visible,
    onChange,
    onToggleVisibility,
}: PasswordFieldProps) {
    return (
        <div>
            <label
                htmlFor={name}
                className="mb-2.5 block text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500"
            >
                {label}
            </label>

            <div className="relative">
                <input
                    id={name}
                    name={name}
                    type={visible ? 'text' : 'password'}
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    autoComplete={
                        name === 'current_password'
                            ? 'current-password'
                            : 'new-password'
                    }
                    placeholder={placeholder}
                    required
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? `${name}-error` : undefined}
                    className={`w-full rounded-xl border bg-black/20 px-4 py-3.5 pr-12 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-700 focus:ring-2 ${error
                        ? 'border-red-400/40 focus:border-red-300/60 focus:ring-red-400/[0.06]'
                        : 'border-white/[0.09] focus:border-white/[0.22] focus:ring-white/[0.035]'
                        }`}
                />

                <button
                    type="button"
                    onClick={onToggleVisibility}
                    className="absolute inset-y-0 right-0 flex items-center px-4 text-zinc-600 transition hover:text-zinc-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                    aria-label={`${visible ? 'Hide' : 'Show'} ${label.toLowerCase()}`}
                >
                    {visible ? (
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            className="h-4 w-4"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 5.2A10.8 10.8 0 012 12s3.5 7 10 7c1.1 0 2.1-.2 3-.6M14.1 5.2A10.8 10.8 0 0122 12s-.8 1.7-2.4 3.3"
                            />
                        </svg>
                    ) : (
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            className="h-4 w-4"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"
                            />
                            <circle cx="12" cy="12" r="3" />
                        </svg>
                    )}
                </button>
            </div>

            {error && (
                <p
                    id={`${name}-error`}
                    role="alert"
                    className="mt-2 text-xs leading-5 text-red-400"
                >
                    {error}
                </p>
            )}
        </div>
    );
}

// Security settings page.
export default function Security() {
    const [visiblePasswords, setVisiblePasswords] = useState<
        Record<PasswordFieldName, boolean>
    >({
        current_password: false,
        password: false,
        password_confirmation: false,
    });

    const [successMessage, setSuccessMessage] = useState('');

    const {
        data,
        setData,
        put,
        processing,
        errors,
        reset,
        clearErrors,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const toggleVisibility = (field: PasswordFieldName) => {
        setVisiblePasswords((previous) => ({
            ...previous,
            [field]: !previous[field],
        }));
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSuccessMessage('');

        put('/dashboard/security/password', {
            errorBag: 'updatePassword',
            preserveScroll: true,
            onSuccess: () => {
                reset();
                clearErrors();

                setVisiblePasswords({
                    current_password: false,
                    password: false,
                    password_confirmation: false,
                });

                setSuccessMessage(
                    'Your password has been updated successfully.',
                );
            },
        });
    };

    const clearForm = () => {
        reset();
        clearErrors();
        setSuccessMessage('');

        setVisiblePasswords({
            current_password: false,
            password: false,
            password_confirmation: false,
        });
    };

    const passwordFields: {
        name: PasswordFieldName;
        label: string;
        placeholder: string;
    }[] = [
            {
                name: 'current_password',
                label: 'Current password',
                placeholder: 'Enter your current password',
            },
            {
                name: 'password',
                label: 'New password',
                placeholder: 'Create a new password',
            },
            {
                name: 'password_confirmation',
                label: 'Confirm new password',
                placeholder: 'Enter your new password again',
            },
        ];

    const firstError = errors.current_password
        ? String(errors.current_password)
        : errors.password
            ? String(errors.password)
            : errors.password_confirmation
                ? String(errors.password_confirmation)
                : '';

    return (
        <DashboardLayout>
            <Head title="Security" />

            <div className="mx-auto max-w-[1400px] px-6 py-10 sm:px-8 lg:px-12 lg:py-12">
                <div className="mb-12">
                    <div className="mb-5 flex items-center gap-3">
                        <span className="h-px w-8 bg-[linear-gradient(90deg,#ffffff,#7d8991,transparent)]" />
                        <span className="text-[9px] uppercase tracking-[0.35em] text-zinc-600">
                            LIRA / STUDIO / SECURITY
                        </span>
                    </div>

                    <h1 className="text-4xl font-light tracking-[-0.055em] text-white sm:text-5xl">
                        Your account,
                        <br />
                        <span className="bg-[linear-gradient(90deg,#fff_0%,#bdefff_24%,#9d8cff_58%,#f08bd7_82%,#fff_100%)] bg-clip-text text-transparent">
                            protected.
                        </span>
                    </h1>

                    <p className="mt-5 max-w-xl text-sm leading-6 text-zinc-600">
                        Manage your password and keep your LIRA account
                        secure. Your creative work deserves a protected
                        space.
                    </p>
                </div>

                <div className="space-y-5">
                    <GlassSection
                        number="01"
                        icon={
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                className="h-5 w-5"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 3l8 3v5c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6l8-3z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M8.5 12l2.2 2.2 4.8-5"
                                />
                            </svg>
                        }
                        title="Account Protection"
                        description="A few good security habits help protect your identity and creative work."
                    >
                        <div className="flex items-start gap-4 rounded-xl border border-white/[0.07] bg-white/[0.015] p-5">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-emerald-300/15 bg-emerald-300/[0.05] text-emerald-200/80">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M5 12l4 4L19 6"
                                    />
                                </svg>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-zinc-300">
                                    Keep your password private
                                </p>
                                <p className="mt-2 text-xs leading-6 text-zinc-600">
                                    Use a unique password that you do not
                                    share with anyone or reuse on other
                                    websites.
                                </p>
                            </div>
                        </div>
                    </GlassSection>

                    <GlassSection
                        number="02"
                        icon={
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                className="h-5 w-5"
                                aria-hidden="true"
                            >
                                <rect
                                    x="4"
                                    y="10"
                                    width="16"
                                    height="11"
                                    rx="2"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M8 10V7a4 4 0 018 0v3"
                                />
                                <circle cx="12" cy="15" r="1" />
                                <path d="M12 16v2" />
                            </svg>
                        }
                        title="Change Password"
                        description="Update your password using your current credentials."
                    >
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {successMessage && (
                                <FlashAlert
                                    type="success"
                                    message={successMessage}
                                />
                            )}

                            {firstError && (
                                <FlashAlert
                                    type="error"
                                    message={firstError}
                                />
                            )}

                            <div className="space-y-5">
                                {passwordFields.map((field) => (
                                    <PasswordField
                                        key={field.name}
                                        name={field.name}
                                        label={field.label}
                                        placeholder={field.placeholder}
                                        value={data[field.name]}
                                        error={
                                            errors[field.name]
                                                ? String(errors[field.name])
                                                : undefined
                                        }
                                        visible={visiblePasswords[field.name]}
                                        onChange={(value) => {
                                            setData(field.name, value);
                                            setSuccessMessage('');
                                        }}
                                        onToggleVisibility={() =>
                                            toggleVisibility(field.name)
                                        }
                                    />
                                ))}
                            </div>

                            <div className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-black/10 p-4">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500"
                                    aria-hidden="true"
                                >
                                    <circle cx="12" cy="12" r="9" />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 11v5m0-8h.01"
                                    />
                                </svg>

                                <p className="text-[11px] leading-5 text-zinc-600">
                                    Your new password must meet the password
                                    rules configured for LIRA and match the
                                    confirmation field.
                                </p>
                            </div>

                            <div className="flex flex-col-reverse gap-3 border-t border-white/[0.07] pt-6 sm:flex-row sm:items-center sm:justify-between">
                                <button
                                    type="button"
                                    disabled={processing}
                                    onClick={clearForm}
                                    className="inline-flex h-11 items-center justify-center rounded-full border border-white/[0.10] bg-white/[0.015] px-5 text-xs font-medium text-zinc-500 transition duration-300 hover:border-white/[0.20] hover:bg-white/[0.04] hover:text-zinc-300 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Clear Fields
                                </button>

                                <button
                                    type="submit"
                                    disabled={
                                        processing ||
                                        !data.current_password ||
                                        !data.password ||
                                        !data.password_confirmation
                                    }
                                    className="group relative inline-flex h-11 items-center justify-center gap-3 overflow-hidden rounded-full border border-white/[0.14] bg-[linear-gradient(145deg,rgba(255,255,255,0.10),rgba(255,255,255,0.025))] px-6 text-xs font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.10)] transition duration-300 hover:border-white/[0.25] hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <span className="pointer-events-none absolute inset-x-4 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.65),transparent)]" />

                                    {processing ? (
                                        <>
                                            <span className="h-3.5 w-3.5 animate-spin rounded-full border border-white/25 border-t-white" />
                                            Updating Password
                                        </>
                                    ) : (
                                        <>
                                            Update Password
                                            <svg
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M5 12h14m-6-6l6 6-6 6"
                                                />
                                            </svg>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </GlassSection>

                    <div className="relative overflow-hidden rounded-[1.5rem] border border-white/[0.07] bg-[linear-gradient(145deg,rgba(255,255,255,0.025),rgba(255,255,255,0.008))] p-6 sm:p-7">
                        <ChromeSparkle
                            size="sm"
                            className="right-7 top-6 opacity-20"
                        />

                        <p className="text-[9px] uppercase tracking-[0.3em] text-zinc-600">
                            A note on security
                        </p>

                        <p className="mt-3 max-w-3xl text-xs leading-6 text-zinc-600">
                            Never share your password or verification codes.
                            If you believe your account has been accessed
                            without permission, change your password and
                            review the security of your email account.
                        </p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
