<?php

namespace App\Actions\StockBatches;

use App\Models\StockBatch;
use App\Models\StockLog;
use App\Models\WarehouseStock;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CreateStockBatchAction
{
    public function execute(array $input): StockBatch
    {
        $this->validateBatchNumber($input['batch_number'], $input['product_id']);

        return DB::transaction(function () use ($input) {
            $warehouseStock = $this->getOrCreateWarehouseStock(
                $input['warehouse_id'],
                $input['product_id']
            );

            $batch = $this->createBatch($warehouseStock, $input);
            $this->createStockLog($batch, $warehouseStock);
            $warehouseStock->increment('total_quantity', $batch->current_qty);

            return $batch->fresh();
        });
    }

    protected function validateBatchNumber(string $batchNumber, int $productId): void
    {
        $exists = StockBatch::whereHas('warehouseStock', function ($query) use ($productId) {
            $query->where('product_id', $productId);
        })
            ->where('batch_number', $batchNumber)
            ->exists();

        if ($exists) {
            throw ValidationException::withMessages([
                'batch_number' => "Nomor batch '{$batchNumber}' sudah digunakan untuk produk ini. Gunakan nomor batch yang berbeda.",
            ]);
        }
    }

    protected function getOrCreateWarehouseStock(int $warehouseId, int $productId): WarehouseStock
    {
        // Use lockForUpdate to prevent race conditions when creating warehouse stock
        $warehouseStock = WarehouseStock::where('warehouse_id', $warehouseId)
            ->where('product_id', $productId)
            ->lockForUpdate()
            ->first();

        if (! $warehouseStock) {
            $warehouseStock = WarehouseStock::create([
                'warehouse_id' => $warehouseId,
                'product_id' => $productId,
                'total_quantity' => 0,
            ]);
        }

        return $warehouseStock;
    }

    protected function createBatch(WarehouseStock $warehouseStock, array $input): StockBatch
    {
        $batch = StockBatch::create([
            'warehouse_stock_id' => $warehouseStock->id,
            'batch_number' => $input['batch_number'],
            'expired_at' => $input['expired_at'] ?? null,
            'current_qty' => $input['current_qty'],
            'cost_price' => $input['cost_price'],
            'is_active' => true,
            'status' => 'available',
        ]);

        $batch->updateStatus();

        return $batch;
    }

    protected function createStockLog(StockBatch $batch, WarehouseStock $warehouseStock): void
    {
        StockLog::create([
            'warehouse_id' => $warehouseStock->warehouse_id,
            'product_id' => $warehouseStock->product_id,
            'batch_id' => $batch->id,
            'user_id' => auth()->id(),
            'qty' => $batch->current_qty,
            'type' => 'entry',
            'notes' => "Batch {$batch->batch_number} created",
        ]);
    }
}
