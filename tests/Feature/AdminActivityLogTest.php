<?php

namespace Tests\Feature;

use App\Models\ActivityLog;
use App\Models\BlockedIp;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminActivityLogTest extends TestCase
{
    use RefreshDatabase;

    public function test_only_admins_can_view_activity_logs_or_manage_ip_blocks(): void
    {
        $user = User::factory()->create([
            'is_admin' => false,
        ]);

        $this->actingAs($user)
            ->get(route('admin.activity-logs.index'))
            ->assertForbidden();

        $this->assertDatabaseHas('activity_logs', [
            'user_id' => $user->id,
            'event_type' => 'security.access_denied',
            'category' => 'security_signals',
            'status_code' => 403,
        ]);

        $this->actingAs($user)
            ->post(route('admin.activity-logs.block-ip'), [
                'ip_address' => '203.0.113.40',
                'duration_minutes' => 60,
                'reason' => 'Repeated abusive login attempts',
            ])
            ->assertForbidden();

        $this->assertDatabaseCount('blocked_ips', 0);
    }

    public function test_admin_can_view_filtered_logs_and_temporarily_block_then_unblock_an_ip(): void
    {
        $admin = User::factory()->create([
            'is_admin' => true,
        ]);
        $user = User::factory()->create();

        ActivityLog::create([
            'user_id' => $user->id,
            'event_type' => 'auth.login_failed',
            'category' => 'authentication',
            'ip_address' => '203.0.113.45',
            'is_flagged' => true,
            'flag_reason' => 'Repeated failed sign-ins',
            'occurred_at' => now(),
        ]);

        $this->actingAs($admin)
            ->get(route('admin.activity-logs.index', [
                'category' => 'authentication',
                'flagged' => 'flagged',
            ]))
            ->assertOk()
            ->assertInertia(fn($page) => $page
                ->component('Admin/ActivityLogs/Index')
                ->where('logs.total', 1)
                ->where('flaggedCount', 1)
                ->where('logs.data.0.ip_address', '203.0.113.45'));

        $flag = ActivityLog::query()->where('is_flagged', true)->firstOrFail();

        $this->actingAs($admin)
            ->post(route('admin.activity-logs.review', $flag))
            ->assertRedirect(route('admin.activity-logs.index'));

        $this->assertSame($admin->id, $flag->fresh()->reviewed_by);
        $this->assertNotNull($flag->fresh()->reviewed_at);
        $this->assertDatabaseCount('activity_logs', 2);
        $this->assertDatabaseHas('activity_logs', [
            'event_type' => 'moderation.activity_reviewed',
            'route_name' => 'admin.activity-logs.review',
        ]);
        $this->assertDatabaseMissing('activity_logs', [
            'event_type' => 'activity.write',
            'route_name' => 'admin.activity-logs.review',
        ]);

        $this->actingAs($admin)
            ->get(route('admin.activity-logs.index', ['flagged' => 'reviewed']))
            ->assertInertia(fn($page) => $page
                ->where('flaggedCount', 0)
                ->where('logs.total', 1));

        $this->actingAs($admin)
            ->post(route('admin.activity-logs.block-ip'), [
                'ip_address' => '203.0.113.45',
                'duration_minutes' => 1440,
                'reason' => 'Repeated abusive login attempts',
            ])
            ->assertRedirect(route('admin.activity-logs.index'));

        $block = BlockedIp::query()->firstOrFail();

        $this->assertTrue($block->expires_at->between(
            now()->addHours(23)->subMinute(),
            now()->addHours(24)->addMinute(),
        ));

        $this->app['auth']->logout();
        $this->withServerVariables([
            'REMOTE_ADDR' => '203.0.113.45',
        ])->get(route('login'))
            ->assertOk()
            ->assertInertia(fn($page) => $page
                ->component('Auth/Login')
                ->where('flash.error', 'Authentication from this network is temporarily blocked. Please try again later.'));

        $this->withServerVariables([
            'REMOTE_ADDR' => '203.0.113.45',
        ])->post(route('login.store'), [
            'email' => $user->email,
            'password' => 'incorrect-password',
        ])
            ->assertRedirect(route('login'))
            ->assertSessionHas('error', 'Authentication from this network is temporarily blocked. Please try again later.');

        $this->withServerVariables([
            'REMOTE_ADDR' => '203.0.113.45',
        ])->get(route('home'))->assertOk();

        $this->actingAs($admin)
            ->withServerVariables([
                'REMOTE_ADDR' => '203.0.113.45',
            ])
            ->get(route('login'))
            ->assertRedirect();

        $this->actingAs($admin)
            ->delete(route('admin.activity-logs.unblock-ip', $block))
            ->assertRedirect(route('admin.activity-logs.index'));

        $this->assertNotNull($block->fresh()->unblocked_at);
    }

    public function test_repeated_failed_sign_ins_are_flagged_for_admin_review(): void
    {
        User::factory()->create([
            'email' => 'known-user@example.com',
        ]);

        foreach (range(1, 5) as $_) {
            $this->withServerVariables([
                'REMOTE_ADDR' => '203.0.113.50',
            ])->post('/login', [
                'email' => 'known-user@example.com',
                'password' => 'incorrect-password',
            ]);
        }

        $this->assertDatabaseHas('activity_logs', [
            'event_type' => 'auth.login_failed',
            'ip_address' => '203.0.113.50',
            'is_flagged' => true,
        ]);

        $this->assertSame(
            1,
            ActivityLog::query()
                ->where('event_type', 'auth.login_failed')
                ->where('is_flagged', true)
                ->count(),
        );

        $this->assertSame(
            5,
            ActivityLog::query()
                ->where('event_type', 'auth.login_failed')
                ->where('ip_address', '203.0.113.50')
                ->count(),
        );
    }

    public function test_one_failed_sign_in_creates_one_activity_event(): void
    {
        User::factory()->create([
            'email' => 'single-failure@example.com',
        ]);

        $this->withServerVariables([
            'REMOTE_ADDR' => '203.0.113.57',
        ])->post('/login', [
            'email' => 'single-failure@example.com',
            'password' => 'incorrect-password',
        ]);

        $this->assertSame(
            1,
            ActivityLog::query()
                ->where('event_type', 'auth.login_failed')
                ->where('ip_address', '203.0.113.57')
                ->count(),
        );
    }

    public function test_login_throttle_redirects_with_a_flash_alert_instead_of_a_429_page(): void
    {
        User::factory()->create([
            'email' => 'known-user@example.com',
        ]);

        foreach (range(1, 5) as $_) {
            $this->withServerVariables([
                'REMOTE_ADDR' => '203.0.113.55',
            ])->post('/login', [
                'email' => 'known-user@example.com',
                'password' => 'incorrect-password',
            ]);
        }

        $this->withServerVariables([
            'REMOTE_ADDR' => '203.0.113.55',
        ])->post('/login', [
            'email' => 'known-user@example.com',
            'password' => 'incorrect-password',
        ])
            ->assertRedirect(route('login'))
            ->assertSessionHas('error', 'Too many login attempts. Please wait a minute before trying again.');

        $this->assertDatabaseHas('activity_logs', [
            'event_type' => 'security.rate_limited',
            'ip_address' => '203.0.113.55',
            'status_code' => 429,
        ]);
    }

    public function test_failed_login_burst_creates_only_one_flagged_event(): void
    {
        $user = User::factory()->create();
        $request = request();
        $request->server->set('REMOTE_ADDR', '203.0.113.56');

        $listener = app(\App\Listeners\RecordFailedLoginActivity::class);

        foreach (range(1, 8) as $_) {
            $listener->handle(new \Illuminate\Auth\Events\Failed('web', $user, []));
        }

        $this->assertSame(
            1,
            ActivityLog::query()
                ->where('event_type', 'auth.login_failed')
                ->where('is_flagged', true)
                ->count(),
        );
        $this->assertDatabaseCount('activity_logs', 8);
    }

    public function test_user_write_activity_is_logged_without_recording_request_payloads(): void
    {
        $admin = User::factory()->create([
            'is_admin' => true,
        ]);

        $this->actingAs($admin)
            ->post(route('admin.activity-logs.block-ip'), [
                'ip_address' => '203.0.113.60',
                'duration_minutes' => 60,
                'reason' => 'Test activity logging',
            ])
            ->assertRedirect();

        $log = ActivityLog::query()
            ->where('event_type', 'moderation.ip_blocked')
            ->firstOrFail();

        $this->assertSame($admin->id, $log->user_id);
        $this->assertSame('moderation', $log->category);
        $this->assertSame('203.0.113.60', $log->details['blocked_ip']);
        $this->assertArrayNotHasKey('password', $log->details);
    }
}
