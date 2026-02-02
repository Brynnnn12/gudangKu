<?php

namespace App\Actions\StockBatches;

use App\Models\StockBatch;
use App\Models\StockLog;
use Illuminate\Support\Facades\DB;

class UpdateStockBatchAction
{
    /**
     * Update an existing stock batch.
     *
     * @param  array<string, mixed>  $input
     */
    public function execute(StockBatch $batch, array $input): StockBatch
    {
        return DB::transaction(function () use ($batch, $input) {
            $oldQty = $batch->current_qty;
            $newQty = $input['current_qty'];
            $difference = $newQty - $oldQty;

            $batch->update([
                'expired_at' => $input['expired_at'] ?? $batch->expired_at,
                'current_qty' => $newQty,
                'cost_price' => $input['cost_price'] ?? $batch->cost_price,
            ]);

            // Update batch status
            $batch->updateStatus();

            // Create stock log if quantity changed
            if ($difference != 0) {
                $warehouseStock = $batch->warehouseStock;
                StockLog::create([
                    'warehouse_id' => $warehouseStock->warehouse_id,
                    'product_id' => $warehouseStock->product_id,
                    'batch_id' => $batch->id,
                    'user_id' => auth()->id(),
                    'qty' => $difference,
                    'type' => 'adjustment',
                    'notes' => "Batch {$batch->batch_number} adjusted from {$oldQty} to {$newQty}",
                ]);

                // Update warehouse stock total
                $warehouseStock->increment('total_quantity', $difference);
            }

            return $batch->fresh();
        });
    }
}
