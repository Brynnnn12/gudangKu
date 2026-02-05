<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            'super-admin',
            'admin',
            'viewer',
        ];

        foreach ($roles as $role) {
            \Spatie\Permission\Models\Role::create(['name' => $role]);
        }

        // Super Admin from .env
        User::factory([
            'name' => env('USER_NAME', 'Super Admin'),
            'email' => env('USER_EMAIL', 'admin@example.com'),
            'phone_number' => env('USER_PHONE', '6285150704897'),
            'password' => env('USER_PASSWORD', 'password'),
        ])->create()->assignRole('super-admin');

        // Additional test users
        User::factory([
            'name' => 'Admin User',
            'email' => 'admin@gudangku.com',
            'phone_number' => '6281234567891',
        ])->create()->assignRole('admin');

        User::factory([
            'name' => 'Viewer User',
            'email' => 'viewer@gudangku.com',
            'phone_number' => '6285150704897',
        ])->create()->assignRole('viewer');

        // 5 additional random users with random roles
        User::factory(5)->create()->each(function ($user) {
            $user->assignRole(['admin', 'viewer'][rand(0, 1)]);
        });
    }
}
