<?php

namespace App\Actions\Employee;

use App\Models\User;
use Illuminate\Support\Facades\DB;

class DeleteEmployeeAction
{
    /**
     * Delete the employee (user).
     */
    public function execute(User $user): void
    {
        DB::transaction(function () use ($user) {
            // Detach roles before deleting if soft deletes aren't used,
            // but normally delete cascades or isn't needed strictly.
            // However, syncRoles([]) is safer to clean up model_has_roles
            $user->syncRoles([]);

            $user->delete();
        });
    }
}
