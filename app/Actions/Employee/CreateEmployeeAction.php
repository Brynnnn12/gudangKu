<?php

namespace App\Actions\Employee;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class CreateEmployeeAction
{
    /**
     * Create a new employee.
     *
     * @param  array<string, mixed>  $input
     * @return \App\Models\User
     */
    public function execute(array $input): User
    {
        return DB::transaction(function () use ($input) {
            $user = User::create([
                'name' => $input['name'],
                'email' => $input['email'],
                'password' => Hash::make($input['password']),
            ]);

            if (isset($input['role']) && in_array($input['role'], ['admin', 'user'])) {
                $user->assignRole($input['role']);
            }

            return $user;
        });
    }
}
