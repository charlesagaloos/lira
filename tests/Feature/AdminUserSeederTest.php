<?php

namespace Tests\Feature;

use App\Models\ArtistProfile;
use App\Models\User;
use Database\Seeders\AdminUserSeeder;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use RuntimeException;
use Tests\TestCase;

class AdminUserSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_seeder_creates_a_verified_admin_without_an_artist_profile_and_is_idempotent(): void
    {
        config([
            'services.admin_user.name' => 'LIRA Administrator',
            'services.admin_user.email' => 'admin@example.com',
            'services.admin_user.password' => 'strong-admin-password',
        ]);

        $this->seed(DatabaseSeeder::class);
        $this->seed(DatabaseSeeder::class);

        $admin = User::where('email', 'admin@example.com')->firstOrFail();

        $this->assertTrue($admin->is_admin);
        $this->assertNotNull($admin->email_verified_at);
        $this->assertTrue(Hash::check('strong-admin-password', $admin->password));
        $this->assertFalse($admin->artistProfile()->exists());
        $this->assertDatabaseHas('users', [
            'email' => 'test@example.com',
        ]);
        $this->assertDatabaseCount('users', 2);
    }

    public function test_seeder_does_not_convert_an_existing_artist_into_an_admin_only_account(): void
    {
        config([
            'services.admin_user.name' => 'LIRA Administrator',
            'services.admin_user.email' => 'artist@example.com',
            'services.admin_user.password' => 'strong-admin-password',
        ]);

        $artist = User::factory()->create([
            'email' => 'artist@example.com',
            'is_admin' => false,
        ]);

        ArtistProfile::create([
            'user_id' => $artist->id,
            'username' => 'existing-seed-artist',
            'display_name' => 'Existing Artist',
        ]);

        try {
            $this->seed(AdminUserSeeder::class);
            $this->fail('The seeder should refuse to use an account that already has an artist profile.');
        } catch (RuntimeException $exception) {
            $this->assertSame(
                'The configured admin account already has an artist profile. Use a dedicated email address for the admin-only account.',
                $exception->getMessage(),
            );
        }

        $this->assertFalse($artist->fresh()->is_admin);
    }
}
