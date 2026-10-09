<?php

namespace Database\Seeders;

use App\Models\ArtistProfile;
use App\Models\PortfolioSetting;
use App\Models\User;
use App\VerificationStatus;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class TestArtistSeeder extends Seeder
{
    public function run(): void
    {
        $this->command?->info('Preparing 100 LIRA test artist accounts...');

        $statuses = [
            VerificationStatus::Pending,
            VerificationStatus::Verified,
            VerificationStatus::Rejected,
        ];

        $artistTypes = [
            'Musician',
            'Visual Artist',
            'Photographer',
            'Digital Artist',
            'Writer',
            'Designer',
            'Filmmaker',
            'Illustrator',
            'Producer',
            'Multidisciplinary Artist',
        ];

        DB::transaction(function () use ($statuses, $artistTypes) {
            for ($i = 1; $i <= 100; $i++) {
                $number = str_pad((string) $i, 3, '0', STR_PAD_LEFT);

                $email = "lira-test-{$number}@example.test";
                $username = "lira_test_artist_{$number}";
                $status = $statuses[($i - 1) % count($statuses)];

                // Create only accounts in this seeder's reserved namespace.
                $user = User::firstOrNew(['email' => $email]);

                if (! $user->exists) {
                    $user->name = "Test Artist {$number}";
                    $user->password = 'password';
                }

                // Ensure every account in this test namespace is verified
                // and cannot become an administrator.
                $user->email_verified_at ??= now();
                $user->is_admin = false;
                $user->save();

                // Preserve an existing profile rather than overwriting it.
                $profile = ArtistProfile::firstOrNew([
                    'user_id' => $user->id,
                ]);

                if (! $profile->exists) {
                    // Fail safely if the reserved username is already
                    // assigned to a different artist.
                    $usernameOwner = ArtistProfile::where(
                        'username',
                        $username
                    )->exists();

                    if ($usernameOwner) {
                        throw new RuntimeException(
                            "Username collision detected: {$username}. "
                            . 'No transaction changes were committed.'
                        );
                    }

                    $profile->username = $username;
                    $profile->display_name = "Test Artist {$number}";
                    $profile->bio = "This is test artist profile {$number} "
                        . 'for testing the LIRA admin dashboard.';
                    $profile->about_me = "Sample artist biography {$number}.";
                    $profile->artist_type = $artistTypes[($i - 1) % count($artistTypes)];
                    $profile->location = 'Metro Manila, Philippines';

                    // Leave images empty so the UI can use its initials fallback.
                    $profile->avatar = null;
                    $profile->cover_image = null;

                    $profile->is_published =
                        $status === VerificationStatus::Verified;

                    $profile->verification_status = $status;
                    $profile->verified_at =
                        $status === VerificationStatus::Verified
                            ? now()
                            : null;

                    $profile->save();
                }

                // Create default portfolio settings only when missing.
                PortfolioSetting::firstOrCreate([
                    'artist_profile_id' => $profile->id,
                ]);
            }
        });

        $this->command?->info(
            'Finished processing the 100 reserved LIRA test accounts.'
        );
    }
}
