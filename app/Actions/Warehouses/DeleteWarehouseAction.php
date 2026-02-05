<?php

namespace App\Actions\Warehouses;

use App\Models\Warehouse;
use Illuminate\Support\Facades\DB;

class DeleteWarehouseAction
{
    /**
     * Delete a warehouse (soft delete).
     *
     * @throws \Exception
     */
    public function execute(Warehouse $warehouse): bool
    {
        return DB::transaction(function () use ($warehouse) {
            // Lock for update to prevent race conditions
            $warehouse = Warehouse::where('id', $warehouse->id)->lockForUpdate()->firstOrFail();

            // Check dependencies (aligned with restrict foreign keys)
            if ($warehouse->warehouseStocks()->exists()) {
                throw new \Exception('Cannot delete warehouse with existing stock. Please transfer or remove stock first.');
            }

            if ($warehouse->users()->exists()) {
                throw new \Exception('Cannot delete warehouse with assigned users. Please unassign users first.');
            }

            // Note: stock_logs and stock_transfers will prevent deletion via restrict foreign key
            // Soft delete preserves historical data
            return $warehouse->delete();
        });
    }
}
