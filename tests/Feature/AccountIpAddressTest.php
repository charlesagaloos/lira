<?php

namespace Tests\Feature;

use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AccountIpAddressTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_stores_the_signup_ip_address(): void
    {
        $this->withServerVariables([
            'REMOTE_ADDR' => '203.0.113.20',
        ])->post('/register', [
            'name' => 'New Artist',
            'email' => 'new-artist@example.com',
            'password' => 'Secure-password-123!',
            'password_confirmation' => 'Secure-password-123!',
        ])->assertRedirect();

        $this->assertDatabaseHas('users', [
            'email' => 'new-artist@example.com',
            'registration_ip_address' => '203.0.113.20',
            'last_login_ip_address' => '203.0.113.20',
        ]);

        $user = User::where('email', 'new-artist@example.com')->firstOrFail();

        $this->assertArrayNotHasKey('registration_ip_address', $user->toArray());
        $this->assertArrayNotHasKey('last_login_ip_address', $user->toArray());
        $this->assertDatabaseHas('activity_logs', [
            'user_id' => $user->id,
            'event_type' => 'auth.registered',
            'route_name' => 'register.store',
        ]);
        $this->assertSame(
            1,
            ActivityLog::query()
                ->where('event_type', 'auth.registered')
                ->where('user_id', $user->id)
                ->count(),
        );
        $this->assertSame(
            1,
            ActivityLog::query()
                ->where('event_type', 'auth.login')
                ->where('user_id', $user->id)
                ->count(),
        );
        $this->assertDatabaseMissing('activity_logs', [
            'event_type' => 'activity.write',
            'route_name' => 'register.store',
        ]);
    }

    public function test_successful_login_updates_the_latest_login_ip_address(): void
    {
        $user = User::factory()->create([
            'email' => 'returning-artist@example.com',
            'password' => 'Secure-password-123!',
            'registration_ip_address' => '203.0.113.10',
        ]);

        $this->withServerVariables([
            'REMOTE_ADDR' => '203.0.113.25',
        ])->post('/login', [
            'email' => $user->email,
            'password' => 'Secure-password-123!',
        ])->assertRedirect();

        $this->assertSame(
            '203.0.113.10',
            $user->fresh()->registration_ip_address,
        );
        $this->assertSame(
            '203.0.113.25',
            $user->fresh()->last_login_ip_address,
        );
        $this->assertDatabaseHas('activity_logs', [
            'user_id' => $user->id,
            'event_type' => 'auth.login',
            'route_name' => 'login.store',
        ]);
        $this->assertSame(
            1,
            ActivityLog::query()
                ->where('event_type', 'auth.login')
                ->where('user_id', $user->id)
                ->count(),
        );
        $this->assertDatabaseMissing('activity_logs', [
            'event_type' => 'activity.write',
            'route_name' => 'login.store',
        ]);
    }
}
