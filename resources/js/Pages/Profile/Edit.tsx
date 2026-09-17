import { FormEvent } from 'react';
import { useForm } from '@inertiajs/react';

interface Profile {
    username: string;
    display_name: string;
    bio: string | null;
    artist_type: string | null;
    location: string | null;
    website: string | null;
    spotify_artist_url: string | null;
    apple_music_artist_url: string | null;
    verification_status: string;
}

interface Props {
    profile: Profile;
}

export default function Edit({ profile }: Props) {
    const form = useForm({
        username: profile.username,
        display_name: profile.display_name,
        bio: profile.bio ?? '',
        artist_type: profile.artist_type ?? '',
        location: profile.location ?? '',
        website: profile.website ?? '',
        spotify_artist_url: profile.spotify_artist_url ?? '',
        apple_music_artist_url: profile.apple_music_artist_url ?? '',
    });

    function submit(event: FormEvent) {
        event.preventDefault();

        form.put('/dashboard/profile');
    }

    return (
        <main>
            <h1>Edit Your Artist Profile</h1>

            <form onSubmit={submit}>
                <div>
                    <label htmlFor="username">Username</label>

                    <input
                        id="username"
                        type="text"
                        value={form.data.username}
                        onChange={(event) =>
                            form.setData('username', event.target.value)
                        }
                    />

                    {form.errors.username && (
                        <p>{form.errors.username}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="display_name">Artist Name</label>

                    <input
                        id="display_name"
                        type="text"
                        value={form.data.display_name}
                        onChange={(event) =>
                            form.setData('display_name', event.target.value)
                        }
                    />

                    {form.errors.display_name && (
                        <p>{form.errors.display_name}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="bio">Bio</label>

                    <textarea
                        id="bio"
                        value={form.data.bio}
                        onChange={(event) =>
                            form.setData('bio', event.target.value)
                        }
                    />

                    {form.errors.bio && <p>{form.errors.bio}</p>}
                </div>

                <div>
                    <label htmlFor="artist_type">Artist Type</label>

                    <input
                        id="artist_type"
                        type="text"
                        value={form.data.artist_type}
                        onChange={(event) =>
                            form.setData('artist_type', event.target.value)
                        }
                    />

                    {form.errors.artist_type && (
                        <p>{form.errors.artist_type}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="location">Location</label>

                    <input
                        id="location"
                        type="text"
                        value={form.data.location}
                        onChange={(event) =>
                            form.setData('location', event.target.value)
                        }
                    />

                    {form.errors.location && (
                        <p>{form.errors.location}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="website">Website</label>

                    <input
                        id="website"
                        type="url"
                        value={form.data.website}
                        onChange={(event) =>
                            form.setData('website', event.target.value)
                        }
                    />

                    {form.errors.website && (
                        <p>{form.errors.website}</p>
                    )}
                </div>

                <hr />

                <h2>Artist Verification</h2>

                <div>
                    <label htmlFor="spotify_artist_url">
                        Spotify Artist Profile
                    </label>

                    <input
                        id="spotify_artist_url"
                        type="url"
                        value={form.data.spotify_artist_url}
                        onChange={(event) =>
                            form.setData(
                                'spotify_artist_url',
                                event.target.value,
                            )
                        }
                    />

                    {form.errors.spotify_artist_url && (
                        <p>{form.errors.spotify_artist_url}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="apple_music_artist_url">
                        Apple Music Artist Profile
                    </label>

                    <input
                        id="apple_music_artist_url"
                        type="url"
                        value={form.data.apple_music_artist_url}
                        onChange={(event) =>
                            form.setData(
                                'apple_music_artist_url',
                                event.target.value,
                            )
                        }
                    />

                    {form.errors.apple_music_artist_url && (
                        <p>{form.errors.apple_music_artist_url}</p>
                    )}
                </div>

                <p>
                    Verification Status:{' '}
                    {profile.verification_status.charAt(0).toUpperCase() +
                        profile.verification_status.slice(1)}
                </p>

                <button type="submit" disabled={form.processing}>
                    {form.processing
                        ? 'Saving...'
                        : 'Save Changes'}
                </button>
            </form>
        </main>
    );
}
