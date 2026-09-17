import { router } from '@inertiajs/react';

interface Profile {
    verification_status: string;
    is_published: boolean;
}

interface Props {
    profile: Profile | null;
}

export default function Dashboard({ profile }: Props) {
    function logout() {
        router.post('/logout');
    }

    function publish() {
        router.post('/dashboard/portfolio/publish');
    }

    return (
        <main>
            <h1>LIRA Dashboard</h1>

            <p>You are authenticated.</p>

            {profile && (
                <section>
                    <h2>Portfolio</h2>

                    <p>
                        Verification Status:{' '}
                        {profile.verification_status}
                    </p>

                    <p>
                        Publishing Status:{' '}
                        {profile.is_published ? 'Published' : 'Not Published'}
                    </p>

                    {profile.verification_status === 'verified' &&
                        !profile.is_published && (
                            <button type="button" onClick={publish}>
                                Publish Portfolio
                            </button>
                        )}

                    {profile.verification_status !== 'verified' && (
                        <p>
                            Your portfolio can only be published after your
                            artist profile has been verified.
                        </p>
                    )}
                </section>
            )}

            <button type="button" onClick={logout}>
                Log out
            </button>
        </main>
    );
}
