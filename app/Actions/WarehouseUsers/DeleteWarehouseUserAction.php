<?php

namespace App\Actions\WarehouseUsers;

use App\Models\WarehouseUser;

class DeleteWarehouseUserAction
{
    /**
     * Delete a warehouse user (mark as ended).
     */
    public function execute(WarehouseUser $warehouseUser): void
    {
        $warehouseUser->update(['end_date' => now()->format('Y-m-d')]);

        $warehouseUser->delete();
    }
}
