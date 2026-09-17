import { router } from '@inertiajs/react';

export default function Dashboard() {
    function logout() {
        router.post('/logout');
    }

    return (
        <main>
            <h1>LIRA Dashboard</h1>

            <p>You are authenticated.</p>

            <button type="button" onClick={logout}>
                Log out
            </button>
        </main>
    );
}
