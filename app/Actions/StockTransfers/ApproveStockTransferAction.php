<?php

namespace App\Actions\StockTransfers;

use App\Models\StockBatch;
use App\Models\StockLog;
use App\Models\StockTransfer;
use App\Models\WarehouseStock;
use Illuminate\Support\Facades\DB;

class ApproveStockTransferAction
{
    /**
     * Approve and execute stock transfer using FEFO logic.
     * Deducts stock from source warehouse batches (oldest expiry first).
     * Creates new batch in destination warehouse.
     *
     * @throws \Exception
     */
    public function execute(StockTransfer $transfer): StockTransfer
    {
        if (! $transfer->isPending()) {
            throw new \Exception('Maaf, hanya transfer dengan status pending yang dapat disetujui.');
        }

        return DB::transaction(function () use ($transfer) {
            // Get source warehouse stock
            $sourceStock = WarehouseStock::where('warehouse_id', $transfer->from_warehouse_id)
                ->where('product_id', $transfer->product_id)
                ->first();

            if (! $sourceStock) {
                throw new \Exception('Stok tidak ditemukan di gudang asal.');
            }

            // Check if enough stock available
            if ($sourceStock->total_quantity < $transfer->qty) {
                throw new \Exception(
                    "Stok tidak cukup. Tersedia: {$sourceStock->total_quantity}, Dibutuhkan: {$transfer->qty}"
                );
            }

            // Deduct from source warehouse using FEFO (First Expired First Out)
            $remainingQty = $transfer->qty;
            $batches = $sourceStock->activeBatches()->get();
            $avgCostPrice = 0;
            $totalDeducted = 0;

            foreach ($batches as $batch) {
                if ($remainingQty <= 0) {
                    break;
                }

                $deductQty = min($remainingQty, $batch->current_qty);

                // Track weighted average cost
                $avgCostPrice += $batch->cost_price * $deductQty;
                $totalDeducted += $deductQty;

                // Update batch quantity
                $batch->current_qty -= $deductQty;
                $batch->save();

                // Create stock log for deduction
                StockLog::create([
                    'warehouse_id' => $transfer->from_warehouse_id,
                    'product_id' => $transfer->product_id,
                    'batch_id' => $batch->id,
                    'user_id' => auth()->id(),
                    'qty' => -$deductQty,
                    'type' => 'transfer',
                    'notes' => "Transfer ke {$transfer->toWarehouse->name} - Transfer #{$transfer->id}",
                ]);

                $remainingQty -= $deductQty;
            }

            // Calculate weighted average cost price
            $avgCostPrice = $totalDeducted > 0 ? $avgCostPrice / $totalDeducted : 0;

            // Update source warehouse stock total
            $sourceStock->recalculateTotal();

            // Get or create destination warehouse stock
            $destStock = WarehouseStock::firstOrCreate(
                [
                    'warehouse_id' => $transfer->to_warehouse_id,
                    'product_id' => $transfer->product_id,
                ],
                [
                    'total_quantity' => 0,
                ]
            );

            // Create batch in destination warehouse
            $newBatch = StockBatch::create([
                'warehouse_stock_id' => $destStock->id,
                'batch_number' => 'TRF-'.now()->format('Ymd').'-'.strtoupper(substr(md5($transfer->id), 0, 6)),
                'expired_at' => null, // Transferred items inherit no expiry by default
                'current_qty' => $transfer->qty,
                'cost_price' => $avgCostPrice,
                'is_active' => true,
                'status' => 'available',
            ]);

            // Create stock log for destination
            StockLog::create([
                'warehouse_id' => $transfer->to_warehouse_id,
                'product_id' => $transfer->product_id,
                'batch_id' => $newBatch->id,
                'user_id' => auth()->id(),
                'qty' => $transfer->qty,
                'type' => 'transfer',
                'notes' => "Transfer dari {$transfer->fromWarehouse->name} - Transfer #{$transfer->id}",
            ]);

            // Update destination warehouse stock total
            $destStock->increment('total_quantity', $transfer->qty);

            // Update transfer status
            $transfer->update([
                'status' => 'completed',
            ]);

            return $transfer->fresh([
                'fromWarehouse',
                'toWarehouse',
                'product',
                'user',
            ]);
        });
    }
}
