<?php

namespace App\Actions\WarehouseStocks;

use App\Models\StockLog;
use App\Models\WarehouseStock;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class BulkDeleteWarehouseStocksAction
{
    public function execute(array $ids): void
    {
        if (empty($ids)) {
            return;
        }

        DB::transaction(function () use ($ids) {
            $stocks = WarehouseStock::whereIn('id', $ids)
                ->with(['product:id,name', 'warehouse:id,name'])
                ->lockForUpdate()
                ->get();

            /** @var WarehouseStock $stock */
            foreach ($stocks as $stock) {
                $hasActiveStock = $stock->activeBatches()->where('current_qty', '>', 0)->exists();

                if ($hasActiveStock) {
                    throw new Exception(
                        "Gagal menghapus! Produk '{$stock->product->name}' di gudang '{$stock->warehouse->name}' masih memiliki stok aktif di batch."
                    );
                }

                $batches = $stock->batches;

                foreach ($batches as $batch) {
                    StockLog::create([
                        'warehouse_id' => $stock->warehouse_id,
                        'product_id' => $stock->product_id,
                        'batch_id' => $batch->id,
                        'user_id' => Auth::id(),
                        'qty' => -$batch->current_qty,
                        'type' => 'adjustment',
                        'notes' => "Batch {$batch->batch_number} dihapus oleh {$this->getUserName()} (Qty: {$batch->current_qty})",
                    ]);

                    $batch->delete();
                }

                $stock->delete();
            }
        });
    }

    private function getUserName(): string
    {
        return Auth::user()->name ?? 'System';
    }
}
