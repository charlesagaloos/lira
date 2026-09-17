import { FormEvent } from 'react';
import { useForm } from '@inertiajs/react';

export default function Login() {
    const form = useForm({
        email: '',
        password: '',
        remember: false,
    });

    function submit(event: FormEvent) {
        event.preventDefault();

        form.post('/login');
    }

    return (
        <main>
            <h1>LIRA Login</h1>

            <form onSubmit={submit}>
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
                        autoComplete="current-password"
                    />

                    {form.errors.password && (
                        <p>{form.errors.password}</p>
                    )}
                </div>

                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={form.data.remember}
                            onChange={(event) =>
                                form.setData('remember', event.target.checked)
                            }
                        />

                        Remember me
                    </label>
                </div>

                <button type="submit" disabled={form.processing}>
                    {form.processing ? 'Logging in...' : 'Log in'}
                </button>
            </form>
        </main>
    );
}
