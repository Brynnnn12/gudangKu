<?php

namespace App\Actions\WarehouseStocks;

use App\Models\StockBatch;
use App\Models\StockLog;
use App\Models\WarehouseStock;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class StockOutAction
{
    /**
     * Reduce stock using FEFO (First Expired First Out) method.
     *
     * @param  int  $warehouseStockId
     * @param  int  $quantity
     * @param  string  $type  'exit' or 'damage'
     * @param  string|null  $notes
     * @return array  Details of batches affected
     *
     * @throws InvalidArgumentException
     */
    public function execute(int $warehouseStockId, int $quantity, string $type = 'exit', ?string $notes = null): array
    {
        if ($quantity <= 0) {
            throw new InvalidArgumentException('Quantity must be greater than 0');
        }

        if (! in_array($type, ['exit', 'damage'])) {
            throw new InvalidArgumentException('Type must be exit or damage');
        }

        return DB::transaction(function () use ($warehouseStockId, $quantity, $type, $notes) {
            $warehouseStock = WarehouseStock::with(['product', 'warehouse'])
                ->findOrFail($warehouseStockId);

            // Check available stock
            if ($warehouseStock->total_quantity < $quantity) {
                throw new InvalidArgumentException(
                    "Insufficient stock. Available: {$warehouseStock->total_quantity}, Requested: {$quantity}"
                );
            }

            // Get available batches ordered by FEFO (First Expired First Out)
            $batches = StockBatch::where('warehouse_stock_id', $warehouseStockId)
                ->where('current_qty', '>', 0)
                ->orderBy('expired_at', 'asc')
                ->orderBy('created_at', 'asc')
                ->get();

            if ($batches->isEmpty()) {
                throw new InvalidArgumentException('No available batches found');
            }

            $remainingQty = $quantity;
            $affectedBatches = [];

            // Reduce stock from batches using FEFO
            foreach ($batches as $batch) {
                if ($remainingQty <= 0) {
                    break;
                }

                $qtyToReduce = min($batch->current_qty, $remainingQty);
                $oldQty = $batch->current_qty;
                $newQty = $oldQty - $qtyToReduce;

                // Update batch quantity
                $batch->current_qty = $newQty;
                $batch->save();

                // Create stock log for this batch
                StockLog::create([
                    'warehouse_id' => $warehouseStock->warehouse_id,
                    'product_id' => $warehouseStock->product_id,
                    'batch_id' => $batch->id,
                    'user_id' => auth()->id(),
                    'qty' => -$qtyToReduce, // negative = outbound
                    'type' => $type,
                    'notes' => $notes ?? "Stock {$type}: {$batch->batch_number} ({$oldQty} → {$newQty})",
                ]);

                $affectedBatches[] = [
                    'batch_number' => $batch->batch_number,
                    'qty_reduced' => $qtyToReduce,
                    'old_qty' => $oldQty,
                    'new_qty' => $newQty,
                    'expired_at' => $batch->expired_at?->format('Y-m-d'),
                ];

                $remainingQty -= $qtyToReduce;
            }

            // Update warehouse stock total
            $warehouseStock->decrement('total_quantity', $quantity);

            return [
                'warehouse_stock_id' => $warehouseStock->id,
                'warehouse' => $warehouseStock->warehouse->name,
                'product' => $warehouseStock->product->name,
                'total_reduced' => $quantity,
                'old_total' => $warehouseStock->total_quantity + $quantity,
                'new_total' => $warehouseStock->total_quantity,
                'affected_batches' => $affectedBatches,
            ];
        });
    }
}
