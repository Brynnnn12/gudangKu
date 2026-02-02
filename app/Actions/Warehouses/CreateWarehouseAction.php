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
        $warehouse = Warehouse::create([
            'name' => $input['name'],
            'address' => $input['address'],
        ]);

        return $warehouse;
    }
}
