import { FormEvent } from 'react';
import { useForm } from '@inertiajs/react';

export default function Create() {
    const form = useForm({
        username: '',
        display_name: '',
        bio: '',
        artist_type: '',
        location: '',
        website: '',
        spotify_artist_url: '',
        apple_music_artist_url: '',
    });

    function submit(event: FormEvent) {
        event.preventDefault();

        form.post('/dashboard/profile');
    }

    return (
        <main>
            <h1>Create Your Artist Profile</h1>

            <p>
                Tell us about yourself and connect your artist profile.
            </p>

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
                        placeholder="yourusername"
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
                        placeholder="Your artist name"
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
                        placeholder="Tell people about your work..."
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
                        placeholder="Musician, Photographer, Designer..."
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
                        placeholder="City, Country"
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
                        placeholder="https://example.com"
                    />

                    {form.errors.website && (
                        <p>{form.errors.website}</p>
                    )}
                </div>

                <hr />

                <h2>Artist Verification</h2>

                <p>
                    Provide at least one public artist profile from Spotify
                    or Apple Music.
                </p>

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
                        placeholder="https://open.spotify.com/artist/..."
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
                        placeholder="https://music.apple.com/..."
                    />

                    {form.errors.apple_music_artist_url && (
                        <p>{form.errors.apple_music_artist_url}</p>
                    )}
                </div>

                <button type="submit" disabled={form.processing}>
                    {form.processing
                        ? 'Creating Profile...'
                        : 'Create Artist Profile'}
                </button>
            </form>
        </main>
    );
}
