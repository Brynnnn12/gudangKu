<?php

namespace App\Actions\WarehouseStocks;

use App\Models\WarehouseStock;

class CreateWarehouseStockAction
{
    /**
     * Create a new warehouse stock.
     *
     * @param  array<string, mixed>  $input
     */
    public function execute(array $input): WarehouseStock
    {
        $warehouseStock = WarehouseStock::create([
            'warehouse_id' => $input['warehouse_id'],
            'product_id' => $input['product_id'],
            'total_quantity' => $input['total_quantity'],
        ]);

        return $warehouseStock;
    }
}
