<?php

namespace App\Actions\WarehouseUsers;

use App\Models\WarehouseUser;

class DeleteWarehouseUserAction
{
    /**
     * Delete a warehouse user.
     */
    public function execute(WarehouseUser $warehouseUser): void
    {
        $warehouseUser->delete();
    }
}
