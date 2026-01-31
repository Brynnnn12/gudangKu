<?php

namespace App\Actions\Employee;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class UpdateEmployeeAction
{
    /**
     * Update the employee (user) information and role.
     *
     * @param  \App\Models\User  $user
     * @param  array<string, mixed>  $input
     * @return \App\Models\User
     */
    public function execute(User $user, array $input): User
    {
        return DB::transaction(function () use ($user, $input) {
            $user->forceFill([
                'name' => $input['name'],
                'email' => $input['email'],
            ])->save();

            // Check if role needs update
            if (isset($input['role']) && in_array($input['role'], ['admin', 'user'])) {
                $user->syncRoles([$input['role']]);
            }

            return $user;
        });
    }
}
