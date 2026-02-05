<?php

namespace App\Actions\WarehouseStocks;

use App\Models\WarehouseStock;

class UpdateWarehouseStockAction
{
    /**
     * ⚠️ DEPRECATED: WarehouseStock.total_quantity should NOT be updated manually.
     * Use UpdateStockBatchAction instead - it will auto-update parent total.
     *
     * WarehouseStock is an aggregate (total_quantity = SUM of all batches).
     * Updating it manually causes inconsistency with batch totals.
     *
     * To fix inconsistencies, use: $warehouseStock->recalculateTotal()
     *
     * @deprecated Use UpdateStockBatchAction::execute() instead
     *
     * @param  array<string, mixed>  $input
     */
    public function execute(WarehouseStock $warehouseStock, array $input): WarehouseStock
    {
        throw new \LogicException(
            'WarehouseStock.total_quantity cannot be updated manually. '.
            'Use UpdateStockBatchAction to update batches - parent total will be auto-updated. '.
            'To recalculate: $warehouseStock->recalculateTotal()'
        );
    }
}
