import { FormEvent } from 'react';
import { useForm } from '@inertiajs/react';

export default function Register() {
    const form = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    function submit(event: FormEvent) {
        event.preventDefault();

        form.post('/register');
    }

    return (
        <main>
            <h1>LIRA Register</h1>

            <form onSubmit={submit}>
                <div>
                    <label htmlFor="name">Name</label>

                    <input
                        id="name"
                        type="text"
                        value={form.data.name}
                        onChange={(event) =>
                            form.setData('name', event.target.value)
                        }
                        autoComplete="name"
                    />

                    {form.errors.name && (
                        <p>{form.errors.name}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="email">Email</label>

                    <input
                        id="email"
                        type="email"
                        value={form.data.email}
                        onChange={(event) =>
                            form.setData('email', event.target.value)
                        }
                        autoComplete="email"
                    />

                    {form.errors.email && (
                        <p>{form.errors.email}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="password">Password</label>

                    <input
                        id="password"
                        type="password"
                        value={form.data.password}
                        onChange={(event) =>
                            form.setData('password', event.target.value)
                        }
                        autoComplete="new-password"
                    />

                    {form.errors.password && (
                        <p>{form.errors.password}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="password_confirmation">
                        Confirm Password
                    </label>

                    <input
                        id="password_confirmation"
                        type="password"
                        value={form.data.password_confirmation}
                        onChange={(event) =>
                            form.setData(
                                'password_confirmation',
                                event.target.value,
                            )
                        }
                        autoComplete="new-password"
                    />

                    {form.errors.password_confirmation && (
                        <p>{form.errors.password_confirmation}</p>
                    )}
                </div>

                <button type="submit" disabled={form.processing}>
                    {form.processing ? 'Creating account...' : 'Create account'}
                </button>
            </form>
        </main>
    );
}
