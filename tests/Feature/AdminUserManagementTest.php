<?php

namespace Tests\Feature;

use App\Models\ArtistProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminUserManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_user_list_only_contains_dedicated_admin_accounts(): void
    {
        $admin = User::factory()->create([
            'is_admin' => true,
            'name' => 'Admin A',
        ]);
        $dedicatedAdmin = User::factory()->create([
            'is_admin' => true,
            'name' => 'Admin B',
        ]);
        $artist = User::factory()->create(['is_admin' => false]);
        $artistAdmin = User::factory()->create([
            'is_admin' => true,
            'name' => 'Artist Admin',
        ]);
        User::factory()->create([
            'is_admin' => true,
            'is_super_admin' => true,
            'name' => 'Superadmin',
        ]);

        ArtistProfile::create([
            'user_id' => $artist->id,
            'username' => 'ordinary-artist',
            'display_name' => 'Ordinary Artist',
        ]);
        ArtistProfile::create([
            'user_id' => $artistAdmin->id,
            'username' => 'artist-admin',
            'display_name' => 'Artist Admin',
        ]);

        $this->actingAs($admin)
            ->get(route('admin.users.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Users/Index')
                ->where('adminOnlyCount', 2)
                ->where('activeAdminCount', 3)
                ->where('currentUserId', $admin->id)
                ->has('users.data', 2)
                ->where('users.data.0.id', $admin->id)
                ->where('users.data.1.id', $dedicatedAdmin->id));
    }

    public function test_admin_can_create_a_verified_admin_only_account(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);

        $this->actingAs($admin)
            ->post(route('admin.users.store'), [
                'name' => 'New Admin',
                'email' => 'new-admin@example.com',
                'password' => 'secure-admin-password',
                'password_confirmation' => 'secure-admin-password',
                'is_admin' => false,
            ])
            ->assertRedirect(route('admin.users.index'));

        $created = User::where('email', 'new-admin@example.com')->firstOrFail();

        $this->assertTrue($created->is_admin);
        $this->assertNotNull($created->email_verified_at);
        $this->assertTrue(Hash::check('secure-admin-password', $created->password));
        $this->assertFalse($created->artistProfile()->exists());
    }

    public function test_admin_cannot_create_an_account_with_a_duplicate_email_or_unconfirmed_password(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        User::factory()->create(['email' => 'already-used@example.com']);

        $this->actingAs($admin)
            ->from(route('admin.users.create'))
            ->post(route('admin.users.store'), [
                'name' => 'Duplicate Admin',
                'email' => 'already-used@example.com',
                'password' => 'secure-admin-password',
                'password_confirmation' => 'different-password',
            ])
            ->assertRedirect(route('admin.users.create'))
            ->assertSessionHasErrors(['email', 'password']);

        $this->assertDatabaseMissing('users', [
            'name' => 'Duplicate Admin',
        ]);
    }

    public function test_admin_cannot_create_an_account_with_a_short_password(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);

        $this->actingAs($admin)
            ->from(route('admin.users.create'))
            ->post(route('admin.users.store'), [
                'name' => 'Short Password Admin',
                'email' => 'short-password-admin@example.com',
                'password' => 'short',
                'password_confirmation' => 'short',
            ])
            ->assertRedirect(route('admin.users.create'))
            ->assertSessionHasErrors('password');

        $this->assertDatabaseMissing('users', [
            'email' => 'short-password-admin@example.com',
        ]);
    }

    public function test_admin_can_edit_a_dedicated_admin_account_without_changing_its_role(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $managedAdmin = User::factory()->create([
            'is_admin' => true,
            'password' => 'original-password',
        ]);

        $this->actingAs($admin)
            ->put(route('admin.users.update', $managedAdmin), [
                'name' => 'Updated Administrator',
                'email' => 'updated-admin@example.com',
                'password' => 'replacement-admin-password',
                'password_confirmation' => 'replacement-admin-password',
                'is_admin' => false,
            ])
            ->assertRedirect(route('admin.users.index'));

        $managedAdmin->refresh();

        $this->assertSame('Updated Administrator', $managedAdmin->name);
        $this->assertSame('updated-admin@example.com', $managedAdmin->email);
        $this->assertTrue($managedAdmin->is_admin);
        $this->assertTrue(Hash::check('replacement-admin-password', $managedAdmin->password));
    }

    public function test_admin_can_leave_password_unchanged_when_editing_a_dedicated_account(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $managedAdmin = User::factory()->create([
            'is_admin' => true,
            'password' => 'original-password',
        ]);
        $passwordHash = $managedAdmin->password;

        $this->actingAs($admin)
            ->put(route('admin.users.update', $managedAdmin), [
                'name' => $managedAdmin->name,
                'email' => $managedAdmin->email,
                'password' => '',
                'password_confirmation' => '',
            ])
            ->assertRedirect(route('admin.users.index'));

        $this->assertSame($passwordHash, $managedAdmin->fresh()->password);
    }

    public function test_admin_can_soft_delete_another_dedicated_admin_account(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $managedAdmin = User::factory()->create(['is_admin' => true]);

        $this->actingAs($admin)
            ->delete(route('admin.users.destroy', $managedAdmin))
            ->assertRedirect(route('admin.users.index'));

        $this->assertSoftDeleted('users', [
            'id' => $managedAdmin->id,
        ]);
        $this->assertTrue($admin->fresh()->is_admin);
    }

    public function test_soft_deleted_admin_account_cannot_sign_in(): void
    {
        $manager = User::factory()->create(['is_admin' => true]);
        $managedAdmin = User::factory()->create([
            'is_admin' => true,
            'email' => 'removed-admin@example.com',
            'password' => 'admin-password',
        ]);

        $this->actingAs($manager)
            ->delete(route('admin.users.destroy', $managedAdmin))
            ->assertRedirect(route('admin.users.index'));

        $this->post(route('logout'));

        $this->post(route('login.store'), [
            'email' => 'removed-admin@example.com',
            'password' => 'admin-password',
        ]);

        $this->assertGuest();
    }

    public function test_admin_cannot_delete_its_own_account(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        User::factory()->create(['is_admin' => true]);

        $this->actingAs($admin)
            ->delete(route('admin.users.destroy', $admin))
            ->assertRedirect()
            ->assertSessionHas('error', 'You cannot delete your own admin account.');

        $this->assertNotSoftDeleted('users', [
            'id' => $admin->id,
        ]);
    }

    public function test_artist_admin_accounts_cannot_be_managed_as_admin_only_accounts(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $artistAdmin = User::factory()->create(['is_admin' => true]);
        ArtistProfile::create([
            'user_id' => $artistAdmin->id,
            'username' => 'protected-artist-admin',
            'display_name' => 'Protected Artist Admin',
        ]);

        $this->actingAs($admin)
            ->get(route('admin.users.edit', $artistAdmin))
            ->assertNotFound();

        $this->actingAs($admin)
            ->delete(route('admin.users.destroy', $artistAdmin))
            ->assertNotFound();

        $this->assertNotSoftDeleted('users', [
            'id' => $artistAdmin->id,
        ]);
    }

    public function test_superadmin_is_hidden_from_admin_user_management_and_cannot_be_edited_or_deleted(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $superadmin = User::factory()->create([
            'is_admin' => true,
            'is_super_admin' => true,
            'name' => 'Protected Superadmin',
        ]);

        $this->actingAs($superadmin)
            ->get(route('admin.dashboard'))
            ->assertOk();

        $this->actingAs($admin)
            ->get(route('admin.users.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Users/Index')
                ->where('adminOnlyCount', 1)
                ->where('activeAdminCount', 1)
                ->where('users.data.0.id', $admin->id)
                ->missing('users.data.1'));

        $this->actingAs($admin)
            ->get(route('admin.users.edit', $superadmin))
            ->assertNotFound();

        $this->actingAs($admin)
            ->put(route('admin.users.update', $superadmin), [
                'name' => 'Changed Name',
                'email' => 'changed@example.com',
                'password' => '',
                'password_confirmation' => '',
            ])
            ->assertNotFound();

        $this->actingAs($admin)
            ->delete(route('admin.users.destroy', $superadmin))
            ->assertNotFound();

        $this->assertSame('Protected Superadmin', $superadmin->fresh()->name);
        $this->assertTrue($superadmin->fresh()->is_super_admin);
        $this->assertNotSoftDeleted('users', [
            'id' => $superadmin->id,
        ]);
    }

    public function test_non_admin_cannot_access_admin_user_management(): void
    {
        $user = User::factory()->create(['is_admin' => false]);

        $this->actingAs($user)
            ->get(route('admin.users.index'))
            ->assertForbidden();

        $this->actingAs($user)
            ->post(route('admin.users.store'), [])
            ->assertForbidden();
    }

    public function test_admin_can_choose_the_light_dashboard_theme(): void
    {
        $admin = User::factory()->create([
            'is_admin' => true,
            'dashboard_theme' => 'dark',
        ]);

        $this->actingAs($admin)
            ->patch(route('artist-settings.update'), [
                'dashboard_theme' => 'light',
            ])
            ->assertRedirect();

        $this->assertSame('light', $admin->fresh()->dashboard_theme);
    }
}
