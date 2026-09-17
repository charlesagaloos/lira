import { router } from '@inertiajs/react';

interface ArtistProfile {
    id: number;
    username: string;
    display_name: string;
    bio: string | null;
    artist_type: string | null;
    location: string | null;
    spotify_artist_url: string | null;
    apple_music_artist_url: string | null;
    verification_status: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
}

interface Props {
    profiles: ArtistProfile[];
}

export default function Index({ profiles }: Props) {
    return (
        <main>
            <h1>Artist Verifications</h1>

            <p>Review artists waiting for verification.</p>

            {profiles.length === 0 ? (
                <p>No pending artist verifications.</p>
            ) : (
                <div>
                    {profiles.map((profile) => (
                        <article key={profile.id}>
                            <h2>{profile.display_name}</h2>

                            <p>@{profile.username}</p>

                            <p>
                                Submitted by: {profile.user.name} (
                                {profile.user.email})
                            </p>

                            <p>
                                Artist Type: {profile.artist_type ?? 'Not provided'}
                            </p>

                            <p>
                                Location: {profile.location ?? 'Not provided'}
                            </p>

                            {profile.spotify_artist_url && (
                                <p>
                                    Spotify:{' '}
                                    <a
                                        href={profile.spotify_artist_url}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        View Artist Profile
                                    </a>
                                </p>
                            )}

                            {profile.apple_music_artist_url && (
                                <p>
                                    Apple Music:{' '}
                                    <a
                                        href={profile.apple_music_artist_url}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        View Artist Profile
                                    </a>
                                </p>
                            )}
                            <div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        router.post(
                                            `/dashboard/admin/verifications/${profile.id}/verify`,
                                        );
                                    }}
                                >
                                    Verify Artist
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        router.post(
                                            `/dashboard/admin/verifications/${profile.id}/reject`,
                                        );
                                    }}
                                >
                                    Reject Artist
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </main>
    );
}
