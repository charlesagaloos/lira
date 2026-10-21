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
                'Superadmin user seeding skipped. Set ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD to configure it.'
            );

            return;
        }

        if (blank($name) || blank($email) || blank($password)) {
            throw new RuntimeException(
                'Superadmin user seeding requires ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD.'
            );
        }

        $superadmin = User::withTrashed()->firstOrNew([
            'email' => $email,
        ]);

        if ($superadmin->exists && $superadmin->artistProfile()->exists()) {
            throw new RuntimeException(
                'The configured superadmin account already has an artist profile. '
                .'Use a dedicated email address for the superadmin-only account.'
            );
        }

        $superadmin->forceFill([
            'name' => $name,
            'email' => $email,
            'password' => $password,
            'email_verified_at' => $superadmin->email_verified_at ?? now(),
            'is_admin' => true,
            'is_super_admin' => true,
            'deleted_at' => null,
        ])->save();

        $this->command?->info("Superadmin account [{$email}] is ready.");
    }
}
