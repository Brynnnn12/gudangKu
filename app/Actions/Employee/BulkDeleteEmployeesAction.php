<?php

namespace App\Actions\Employee;

use App\Models\User;
use Illuminate\Support\Facades\DB;

class BulkDeleteEmployeesAction
{
    /**
     * Delete multiple employees (soft delete).
     *
     * @param  array<int>  $ids
     */
    public function execute(array $ids): int
    {
        return DB::transaction(function () use ($ids) {
            // Lock for update to prevent race conditions
            $users = User::whereIn('id', $ids)->lockForUpdate()->get();

            // Detach all roles for each user
            foreach ($users as $user) {
                $user->syncRoles([]);
            }

            // Soft delete - preserves audit trail for stock_logs, stock_transfers, warehouse_users
            return User::whereIn('id', $ids)->delete();
        });
    }
}
