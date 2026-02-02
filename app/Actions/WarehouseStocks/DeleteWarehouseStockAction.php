<?php

namespace App\Actions\WarehouseStocks;

use App\Models\WarehouseStock;

class DeleteWarehouseStockAction
{
    /**
     * Delete a warehouse stock.
     */
    public function execute(WarehouseStock $warehouseStock): void
    {
        $warehouseStock->delete();
    }
}
