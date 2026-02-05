<?php

namespace App\Actions\WarehouseStocks;

use App\Models\WarehouseStock;

class CreateWarehouseStockAction
{
    /**
     * ⚠️ DEPRECATED: WarehouseStock should NOT be created manually.
     * Use CreateStockBatchAction instead - it will auto-create WarehouseStock.
     *
     * WarehouseStock is an aggregate (total_quantity = SUM of all batches).
     * Creating it manually causes double-counting issues.
     *
     * @deprecated Use CreateStockBatchAction::execute() instead
     *
     * @param  array<string, mixed>  $input
     */
    public function execute(array $input): WarehouseStock
    {
        throw new \LogicException(
            'WarehouseStock cannot be created manually. '.
            'Use CreateStockBatchAction to create batches - WarehouseStock will be auto-created.'
        );
    }
}
