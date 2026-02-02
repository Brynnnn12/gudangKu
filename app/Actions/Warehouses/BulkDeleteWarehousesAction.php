<?php

namespace App\Actions\Warehouses;

use App\Models\Warehouse;

class BulkDeleteWarehousesAction
{
    /**
     * Delete multiple warehouses.
     *
     * @param  array<int>  $ids
     */
    public function execute(array $ids): int
    {
        return Warehouse::whereIn('id', $ids)->delete();
    }
}
