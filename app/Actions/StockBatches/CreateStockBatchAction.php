<?php

namespace App\Actions\StockBatches;

use App\Models\StockBatch;
use App\Models\StockLog;
use App\Models\WarehouseStock;
use Illuminate\Support\Facades\DB;

class CreateStockBatchAction
{
    /**
     * Create a new stock batch with log.
     * Auto-creates WarehouseStock if it doesn't exist.
     *
     * @param  array<string, mixed>  $input
     */
    public function execute(array $input): StockBatch
    {
        return DB::transaction(function () use ($input) {
            // Auto-create WarehouseStock if not exists (first batch)
            $warehouseStock = WarehouseStock::firstOrCreate(
                [
                    'warehouse_id' => $input['warehouse_id'],
                    'product_id' => $input['product_id'],
                ],
                [
                    'total_quantity' => 0, // Will be incremented below
                ]
            );

            // Create batch
            $batch = StockBatch::create([
                'warehouse_stock_id' => $warehouseStock->id,
                'batch_number' => $input['batch_number'],
                'expired_at' => $input['expired_at'] ?? null,
                'current_qty' => $input['current_qty'],
                'cost_price' => $input['cost_price'],
                'is_active' => true,
                'status' => 'available',
            ]);

            // Update batch status based on expiry
            $batch->updateStatus();

            // Create stock log
            StockLog::create([
                'warehouse_id' => $warehouseStock->warehouse_id,
                'product_id' => $warehouseStock->product_id,
                'batch_id' => $batch->id,
                'user_id' => auth()->id(),
                'qty' => $batch->current_qty,
                'type' => 'entry',
                'notes' => "Batch {$batch->batch_number} created",
            ]);

            // Update warehouse stock total (aggregate from batches)
            $warehouseStock->increment('total_quantity', $batch->current_qty);

            return $batch->fresh();
        });
    }
}
