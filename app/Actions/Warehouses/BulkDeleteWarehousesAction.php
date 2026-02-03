<?php

namespace App\Actions\Warehouses;

use App\Models\Warehouse;

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
        // Get warehouses that have stock
        $warehousesWithStock = Warehouse::whereIn('id', $ids)
            ->has('warehouseStocks')
            ->pluck('name')
            ->toArray();

        if (! empty($warehousesWithStock)) {
            throw new \Exception(
                'Cannot delete warehouses with stock: '.implode(', ', $warehousesWithStock).
                '. Please transfer or remove stock first.'
            );
        }

        // Get warehouses that have users
        $warehousesWithUsers = Warehouse::whereIn('id', $ids)
            ->has('users')
            ->pluck('name')
            ->toArray();

        if (! empty($warehousesWithUsers)) {
            throw new \Exception(
                'Cannot delete warehouses with assigned users: '.implode(', ', $warehousesWithUsers).
                '. Please unassign users first.'
            );
        }

        return Warehouse::whereIn('id', $ids)->delete();
    }
}
