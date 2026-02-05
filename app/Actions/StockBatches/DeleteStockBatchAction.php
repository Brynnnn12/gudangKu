<?php

namespace App\Actions\StockBatches;

use App\Models\StockBatch;
use App\Models\StockLog;
use Illuminate\Support\Facades\DB;

class DeleteStockBatchAction
{
    /**
     * Delete a stock batch.
     *
     * @throws \Exception
     */
    public function execute(StockBatch $batch): void
    {
        DB::transaction(function () use ($batch) {
            // Lock for update to prevent race conditions
            $batch = StockBatch::where('id', $batch->id)
                ->with('warehouseStock')
                ->lockForUpdate()
                ->firstOrFail();

            // Validate: Cannot delete batch with remaining quantity
            if ($batch->current_qty > 0) {
                throw new \Exception(
                    "Cannot delete batch {$batch->batch_number} with remaining quantity {$batch->current_qty}. ".'Please adjust stock to zero first.'
                );
            }

            // Create deletion log for audit trail
            $this->createDeletionLog($batch);

            // Delete the batch
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
            'qty' => 0,
            'type' => 'adjustment',
            'notes' => "Batch {$batch->batch_number} deleted (qty was 0)",
        ]);
    }
}
