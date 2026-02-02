<?php

namespace App\Actions\StockBatches;

use App\Models\StockBatch;
use App\Models\StockLog;
use Illuminate\Support\Facades\DB;

class DeleteStockBatchAction
{
    /**
     * Delete a stock batch.
     */
    public function execute(StockBatch $batch): void
    {
        DB::transaction(function () use ($batch) {
            $warehouseStock = $batch->warehouseStock;

            // Create stock log before deletion
            if ($batch->current_qty > 0) {
                StockLog::create([
                    'warehouse_id' => $warehouseStock->warehouse_id,
                    'product_id' => $warehouseStock->product_id,
                    'batch_id' => $batch->id,
                    'user_id' => auth()->id(),
                    'qty' => -$batch->current_qty,
                    'type' => 'adjustment',
                    'notes' => "Batch {$batch->batch_number} deleted (qty was {$batch->current_qty})",
                ]);

                // Update warehouse stock total
                $warehouseStock->decrement('total_quantity', $batch->current_qty);
            }

            $batch->delete();
        });
    }
}
