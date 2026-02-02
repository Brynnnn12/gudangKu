<?php

namespace App\Actions\Employee;

use App\Models\User;

class BulkDeleteEmployeesAction
{
    /**
     * Delete multiple employees.
     *
     * @param  array<int>  $ids
     */
    public function execute(array $ids): int
    {
        return User::whereIn('id', $ids)->delete();
    }
}
