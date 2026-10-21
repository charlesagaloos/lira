<?php

namespace Tests\Feature;

use App\Models\SocialAccount;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\User as GoogleUser;
use Tests\TestCase;

class GoogleAuthSecurityTest extends TestCase
{
    use RefreshDatabase;

    public function test_verified_google_email_can_create_an_account(): void
    {
        $this->mockGoogleUser([
            'email' => 'verified@example.com',
            'email_verified' => true,
            'sub' => 'google-verified-123',
            'name' => 'Verified Artist',
        ]);

        $response = $this->withServerVariables([
            'REMOTE_ADDR' => '203.0.113.15',
        ])->get(route('auth.google.callback'));

        $user = User::where('email', 'verified@example.com')->first();

        $this->assertNotNull($user);
        $this->assertNotNull($user->email_verified_at);
        $this->assertSame('203.0.113.15', $user->registration_ip_address);
        $this->assertSame('203.0.113.15', $user->last_login_ip_address);

        $this->assertDatabaseHas('social_accounts', [
            'user_id' => $user->id,
            'provider' => 'google',
            'provider_id' => 'google-verified-123',
        ]);

        $response->assertRedirect('/dashboard');
        $this->assertAuthenticatedAs($user);
    }

    public function test_google_login_sends_an_admin_without_an_artist_profile_to_the_admin_dashboard(): void
    {
        $admin = User::factory()->create([
            'email' => 'admin-google@example.com',
            'is_admin' => true,
        ]);

        SocialAccount::create([
            'user_id' => $admin->id,
            'provider' => 'google',
            'provider_id' => 'google-admin-123',
        ]);

        $this->mockGoogleUser([
            'email' => $admin->email,
            'email_verified' => true,
            'sub' => 'google-admin-123',
            'name' => $admin->name,
        ]);

        $this->withSession([
            'url.intended' => route('dashboard'),
        ])->get(route('auth.google.callback'))
            ->assertRedirect(route('admin.dashboard'));

        $this->assertAuthenticatedAs($admin);
    }

    public function test_unverified_google_email_cannot_create_an_account(): void
    {
        $this->mockGoogleUser([
            'email' => 'unverified@example.com',
            'email_verified' => false,
            'sub' => 'google-unverified-123',
            'name' => 'Unverified Artist',
        ]);

        $response = $this->get(route('auth.google.callback'));

        $response->assertRedirect(route('login'));
        $response->assertSessionHasErrors('email');

        $this->assertDatabaseMissing('users', [
            'email' => 'unverified@example.com',
        ]);

        $this->assertDatabaseCount('social_accounts', 0);
        $this->assertGuest();
    }

    public function test_missing_google_email_verification_claim_cannot_create_an_account(): void
    {
        $this->mockGoogleUser([
            'email' => 'missing-claim@example.com',
            'sub' => 'google-missing-claim-123',
            'name' => 'Missing Claim Artist',
        ]);

        $response = $this->get(route('auth.google.callback'));

        $response->assertRedirect(route('login'));
        $response->assertSessionHasErrors('email');

        $this->assertDatabaseMissing('users', [
            'email' => 'missing-claim@example.com',
        ]);

        $this->assertDatabaseCount('social_accounts', 0);
        $this->assertGuest();
    }

    private function mockGoogleUser(array $attributes): void
    {
        $googleUser = (new GoogleUser)
            ->setRaw($attributes)
            ->map([
                'id' => $attributes['sub'],
                'name' => $attributes['name'],
                'email' => $attributes['email'],
            ]);

        Socialite::shouldReceive('driver')
            ->once()
            ->with('google')
            ->andReturn(
                new class($googleUser)
                {
                    public function __construct(
                        private GoogleUser $user,
                    ) {}

                    public function user(): GoogleUser
                    {
                        return $this->user;
                    }
                }
            );
    }
}
