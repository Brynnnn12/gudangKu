<?php

namespace App\Actions\Warehouses;

use App\Models\Warehouse;

class DeleteWarehouseAction
{
    /**
     * Delete a warehouse (soft delete).
     */
    public function execute(Warehouse $warehouse): bool
    {
        return $warehouse->delete();
    }
}
