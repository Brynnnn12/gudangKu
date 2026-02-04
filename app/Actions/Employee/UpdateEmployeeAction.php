<?php

namespace App\Actions\Employee;

use App\Models\User;
use Illuminate\Support\Facades\DB;

class UpdateEmployeeAction
{
    /**
     * Update the employee (user) information and role.
     *
     * @param  array<string, mixed>  $input
     */
    public function execute(User $user, array $input): User
    {
        return DB::transaction(function () use ($user, $input) {
            $user->forceFill([
                'name' => $input['name'],
                'email' => $input['email'],
                'phone_number' => $input['phone_number'],
            ])->save();

            // Check if role needs update
            if (isset($input['role']) && in_array($input['role'], ['admin', 'viewer'])) {
                $user->syncRoles([$input['role']]);
            }

            return $user;
        });
    }
}
