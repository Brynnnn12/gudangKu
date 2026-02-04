<?php

namespace App\Actions\Employee;

use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class CreateEmployeeAction
{
    /**
     * Create a new employee.
     *
     * @param  array<string, mixed>  $input
     */
    public function execute(array $input): User
    {
        return DB::transaction(function () use ($input) {
            $user = User::create([
                'name' => $input['name'],
                'email' => $input['email'],
                'phone_number' => $input['phone_number'],
                'password' => Hash::make($input['password']),
            ]);

            if (isset($input['role']) && in_array($input['role'], ['admin', 'viewer'])) {
                $user->assignRole($input['role']);
            }

            event(new Registered($user));

            return $user;
        });
    }
}
