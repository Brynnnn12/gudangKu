<?php

namespace App\Actions\WarehouseStocks;

use App\Models\WarehouseStock;

class UpdateWarehouseStockAction
{
    /**
     * Update an existing warehouse stock.
     *
     * @param  array<string, mixed>  $input
     */
    public function execute(WarehouseStock $warehouseStock, array $input): WarehouseStock
    {
        $warehouseStock->update([
            'total_quantity' => $input['total_quantity'],
        ]);

        return $warehouseStock;
    }
}
