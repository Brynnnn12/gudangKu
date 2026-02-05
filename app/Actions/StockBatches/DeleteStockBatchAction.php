<?php

namespace App\Actions\StockBatches;

use App\Models\StockBatch;
use App\Models\StockLog;
use Illuminate\Support\Facades\DB;

class DeleteStockBatchAction
{
    public function execute(StockBatch $batch): void
    {
        DB::transaction(function () use ($batch) {
            if ($batch->current_qty > 0) {
                $this->createDeletionLog($batch);
                $this->updateWarehouseStock($batch);
            }

            $batch->delete();
        });
    }

    protected function createDeletionLog(StockBatch $batch): void
    {
        $warehouseStock = $batch->warehouseStock;

        StockLog::create([
            'warehouse_id' => $warehouseStock->warehouse_id,
            'product_id' => $warehouseStock->product_id,
            'batch_id' => $batch->id,
            'user_id' => auth()->id(),
            'qty' => -$batch->current_qty,
            'type' => 'adjustment',
            'notes' => "Batch {$batch->batch_number} deleted (qty was {$batch->current_qty})",
        ]);
    }

    protected function updateWarehouseStock(StockBatch $batch): void
    {
        $batch->warehouseStock->decrement('total_quantity', $batch->current_qty);
    }
}
