<?php

namespace App\Actions\Warehouses;

use App\Models\Warehouse;

class DeleteWarehouseAction
{
    /**
     * Delete a warehouse (soft delete).
     *
     * @throws \Exception
     */
    public function execute(Warehouse $warehouse): bool
    {
        // Check if warehouse has stock
        if ($warehouse->warehouseStocks()->exists()) {
            throw new \Exception('Cannot delete warehouse with existing stock. Please transfer or remove stock first.');
        }

        // Check if warehouse has assigned users
        if ($warehouse->users()->exists()) {
            throw new \Exception('Cannot delete warehouse with assigned users. Please unassign users first.');
        }

        return $warehouse->delete();
    }
}
