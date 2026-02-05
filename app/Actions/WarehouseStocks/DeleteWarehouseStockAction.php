<?php

namespace App\Actions\WarehouseStocks;

use App\Models\StockLog;
use App\Models\WarehouseStock;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DeleteWarehouseStockAction
{
    public function execute(WarehouseStock $warehouseStock): void
    {
        DB::transaction(function () use ($warehouseStock) {
            $warehouseStock->load(['product:id,name', 'warehouse:id,name', 'batches']);

            $hasActiveStock = $warehouseStock->activeBatches()->where('current_qty', '>', 0)->lockForUpdate()->exists();

            if ($hasActiveStock) {
                throw new Exception(
                    "Gagal menghapus! Produk '{$warehouseStock->product->name}' di gudang '{$warehouseStock->warehouse->name}' masih memiliki stok aktif di batch."
                );
            }

            foreach ($warehouseStock->batches as $batch) {
                StockLog::create([
                    'warehouse_id' => $warehouseStock->warehouse_id,
                    'product_id' => $warehouseStock->product_id,
                    'batch_id' => $batch->id,
                    'user_id' => Auth::id(),
                    'qty' => -$batch->current_qty,
                    'type' => 'adjustment',
                    'notes' => "Batch {$batch->batch_number} dihapus oleh {$this->getUserName()} (Qty: {$batch->current_qty})",
                ]);

                $batch->delete();
            }

            $warehouseStock->delete();
        });
    }

    private function getUserName(): string
    {
        return Auth::user()->name ?? 'System';
    }
}
