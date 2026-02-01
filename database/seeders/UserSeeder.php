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
            'user',
        ];

        foreach ($roles as $role) {
            \Spatie\Permission\Models\Role::create(['name' => $role]);
        }

        User::factory([
            'name' => env('USER_NAME'),
            'email' => env('USER_EMAIL'),
            'password' => env('USER_PASSWORD'),
        ])->create()->assignRole('super-admin');
    }
}
