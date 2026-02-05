<?php

namespace App\Actions\Warehouses;

use App\Models\Warehouse;
use Illuminate\Support\Facades\DB;

class BulkDeleteWarehousesAction
{
    /**
     * Delete multiple warehouses (only those without stock or users).
     *
     * @param  array<int>  $ids
     *
     * @throws \Exception
     */
    public function execute(array $ids): int
    {
        return DB::transaction(function () use ($ids) {
            // Lock for update to prevent race conditions
            $warehouses = Warehouse::whereIn('id', $ids)->lockForUpdate()->get();

            // Get warehouses that have stock
            $warehousesWithStock = $warehouses->filter(fn ($wh) => $wh->warehouseStocks()->exists())
                ->pluck('name')
                ->toArray();

            if (! empty($warehousesWithStock)) {
                throw new \Exception(
                    'Cannot delete warehouses with stock: '.implode(', ', $warehousesWithStock).
                    '. Please transfer or remove stock first.'
                );
            }

            // Get warehouses that have users
            $warehousesWithUsers = $warehouses->filter(fn ($wh) => $wh->users()->exists())
                ->pluck('name')
                ->toArray();

            if (! empty($warehousesWithUsers)) {
                throw new \Exception(
                    'Cannot delete warehouses with assigned users: '.implode(', ', $warehousesWithUsers).
                    '. Please unassign users first.'
                );
            }

            // Soft delete - preserves audit trail
            return Warehouse::whereIn('id', $ids)->delete();
        });
    }
}
