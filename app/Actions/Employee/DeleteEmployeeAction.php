<?php

namespace App\Actions\Employee;

use App\Models\User;
use Illuminate\Support\Facades\DB;

class DeleteEmployeeAction
{
    /**
     * Delete the employee (user) - soft delete.
     *
     * @throws \Exception
     */
    public function execute(User $user): void
    {
        DB::transaction(function () use ($user) {
            // Lock for update to prevent race conditions
            $user = User::where('id', $user->id)->lockForUpdate()->firstOrFail();

            // Check dependencies (aligned with restrict foreign keys)
            // Note: warehouse_users, stock_logs, stock_transfers will prevent hard delete via restrict
            // Soft delete is the correct approach to preserve audit trail

            // Detach roles before soft delete
            $user->syncRoles([]);

            // Soft delete - preserves audit trail
            $user->delete();
        });
    }
}
