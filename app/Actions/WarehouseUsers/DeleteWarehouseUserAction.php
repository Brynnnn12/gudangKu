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
        // Set end date to today using update to bypass cast
        $warehouseUser->update(['end_date' => now()->format('Y-m-d')]);

        // Then soft delete
        $warehouseUser->delete();
    }
}
