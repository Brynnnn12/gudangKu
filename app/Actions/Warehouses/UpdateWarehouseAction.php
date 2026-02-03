<?php

namespace App\Actions\Warehouses;

use App\Models\Warehouse;

class UpdateWarehouseAction
{
    /**
     * Update an existing warehouse.
     *
     * @param  array<string, mixed>  $input
     */
    public function execute(Warehouse $warehouse, array $input): Warehouse
    {
        $warehouse->update($input);

        return $warehouse->fresh();
    }
}
