<?php

namespace App\Actions\StockTransfers;

use App\Models\StockBatch;
use App\Models\StockLog;
use App\Models\StockTransfer;
use App\Models\WarehouseStock;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ApproveStockTransferAction
{
    public function execute(StockTransfer $transfer): StockTransfer
    {
        if (! $transfer->isPending()) {
            throw new Exception('Maaf, hanya transfer dengan status pending yang dapat disetujui.');
        }

        return DB::transaction(function () use ($transfer) {
            $sourceStock = WarehouseStock::where('warehouse_id', $transfer->from_warehouse_id)
                ->where('product_id', $transfer->product_id)
                ->lockForUpdate()
                ->first();

            if (! $sourceStock || $sourceStock->total_quantity < $transfer->qty) {
                throw new Exception('Stok tidak cukup atau tidak ditemukan.');
            }

            $batches = $sourceStock->activeBatches()
                ->where('current_qty', '>', 0)
                ->orderBy('expired_at', 'asc')
                ->lockForUpdate()
                ->get();

            $remainingToDeduct = $transfer->qty;
            $totalCost = 0;
            $earliestExpiry = null;

            foreach ($batches as $batch) {
                if ($remainingToDeduct <= 0) {
                    break;
                }

                $deductQty = min($remainingToDeduct, $batch->current_qty);
                $earliestExpiry = $earliestExpiry ?? $batch->expired_at;

                $totalCost += ($batch->cost_price * $deductQty);

                $batch->decrement('current_qty', $deductQty);

                $this->logStock(
                    $transfer->from_warehouse_id,
                    $transfer->product_id,
                    $batch->id,
                    -$deductQty,
                    "Transfer Keluar ke {$transfer->toWarehouse->name} (#{$transfer->id})"
                );

                $remainingToDeduct -= $deductQty;
            }

            if ($remainingToDeduct > 0) {
                throw new Exception('Gagal mengalokasikan batch. Data batch mungkin tidak sinkron.');
            }

            $avgCostPrice = $totalCost / $transfer->qty;

            $destStock = WarehouseStock::firstOrCreate([
                'warehouse_id' => $transfer->to_warehouse_id,
                'product_id' => $transfer->product_id,
            ]);

            $newBatch = StockBatch::create([
                'warehouse_stock_id' => $destStock->id,
                'batch_number' => 'TRF-'.now()->format('YmdHis').'-'.strtoupper(bin2hex(random_bytes(3))),
                'expired_at' => $earliestExpiry,
                'current_qty' => $transfer->qty,
                'cost_price' => $avgCostPrice,
                'is_active' => true,
                'status' => 'available',
            ]);

            $this->logStock(
                $transfer->to_warehouse_id,
                $transfer->product_id,
                $newBatch->id,
                $transfer->qty,
                "Transfer Masuk dari {$transfer->fromWarehouse->name} (#{$transfer->id})"
            );

            $sourceStock->recalculateTotal();
            $destStock->recalculateTotal();

            $transfer->update(['status' => 'completed']);

            return $transfer->load(['fromWarehouse', 'toWarehouse', 'product']);
        });
    }

    private function logStock(int $warehouseId, int $productId, int $batchId, int $qty, string $notes): void
    {
        StockLog::create([
            'warehouse_id' => $warehouseId,
            'product_id' => $productId,
            'batch_id' => $batchId,
            'user_id' => Auth::id(),
            'qty' => $qty,
            'type' => 'transfer',
            'notes' => $notes,
        ]);
    }
}
