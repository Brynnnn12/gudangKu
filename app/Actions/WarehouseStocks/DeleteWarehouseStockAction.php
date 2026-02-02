<?php

namespace App\Actions\WarehouseStocks;

use App\Actions\StockBatches\DeleteStockBatchAction;
use App\Models\StockLog;
use App\Models\WarehouseStock;
use Illuminate\Support\Facades\DB;

class DeleteWarehouseStockAction
{
    /**
     * Delete a warehouse stock.
     * ⚠️ This will also delete ALL related batches.
     */
    public function execute(WarehouseStock $warehouseStock): void
    {
        DB::transaction(function () use ($warehouseStock) {
            // Check if has batches
            $batches = $warehouseStock->batches;

            if ($batches->isNotEmpty()) {
                // Delete all batches first (this will auto-update parent total and create logs)
                $deleteBatchAction = new DeleteStockBatchAction();
                foreach ($batches as $batch) {
                    $deleteBatchAction->execute($batch);
                }

                // Recalculate to ensure total is 0
                $warehouseStock->refresh();
                $warehouseStock->recalculateTotal();
            }

            // Create final stock log before deletion
            if ($warehouseStock->total_quantity != 0) {
                StockLog::create([
                    'warehouse_id' => $warehouseStock->warehouse_id,
                    'product_id' => $warehouseStock->product_id,
                    'batch_id' => null,
                    'user_id' => auth()->id(),
                    'qty' => -$warehouseStock->total_quantity,
                    'type' => 'adjustment',
                    'notes' => "Warehouse stock record deleted (final adjustment)",
                ]);
            }

            // Delete the warehouse stock record
            $warehouseStock->delete();
        });
    }
}
