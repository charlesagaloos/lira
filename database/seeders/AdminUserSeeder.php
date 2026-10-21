<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use RuntimeException;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $name = config('services.admin_user.name');
        $email = config('services.admin_user.email');
        $password = config('services.admin_user.password');

        if (blank($name) && blank($email) && blank($password)) {
            $this->command?->warn(
                'Admin user seeding skipped. Set ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD to configure it.'
            );

            return;
        }

        if (blank($name) || blank($email) || blank($password)) {
            throw new RuntimeException(
                'Admin user seeding requires ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD.'
            );
        }

        $admin = User::withTrashed()->firstOrNew([
            'email' => $email,
        ]);

        if ($admin->exists && $admin->artistProfile()->exists()) {
            throw new RuntimeException(
                'The configured admin account already has an artist profile. '
                .'Use a dedicated email address for the admin-only account.'
            );
        }

        $admin->forceFill([
            'name' => $name,
            'email' => $email,
            'password' => $password,
            'email_verified_at' => $admin->email_verified_at ?? now(),
            'is_admin' => true,
            'deleted_at' => null,
        ])->save();

        $this->command?->info("Admin account [{$email}] is ready.");
    }
}
