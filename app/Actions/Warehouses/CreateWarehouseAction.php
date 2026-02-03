<?php

namespace App\Actions\Warehouses;

use App\Models\Warehouse;

class CreateWarehouseAction
{
    /**
     * Create a new warehouse.
     *
     * @param  array<string, mixed>  $input
     */
    public function execute(array $input): Warehouse
    {
        return Warehouse::create($input);
    }
}
