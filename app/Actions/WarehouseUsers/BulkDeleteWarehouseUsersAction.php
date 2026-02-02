<?php

namespace App\Actions\WarehouseUsers;

use App\Models\WarehouseUser;

class BulkDeleteWarehouseUsersAction
{
    /**
     * Bulk delete warehouse users.
     *
     * @param  array<int>  $ids
     */
    public function execute(array $ids): int
    {
        return WarehouseUser::whereIn('id', $ids)->delete();
    }
}
