<?php

namespace App\Actions\WarehouseStocks;

use App\Models\StockLog;
use App\Models\WarehouseStock;
use Illuminate\Support\Facades\DB;

class BulkDeleteWarehouseStocksAction
{
    /**
     * Bulk delete warehouse stocks.
     *
     * @param  array<int>  $ids
     */
    public function execute(array $ids): void
    {
        DB::transaction(function () use ($ids) {
            $warehouseStocks = WarehouseStock::whereIn('id', $ids)->get();

            foreach ($warehouseStocks as $warehouseStock) {
                // Create stock log before deletion
                StockLog::create([
                    'warehouse_id' => $warehouseStock->warehouse_id,
                    'product_id' => $warehouseStock->product_id,
                    'batch_id' => null,
                    'user_id' => auth()->id(),
                    'qty' => -$warehouseStock->total_quantity,
                    'type' => 'adjustment',
                    'notes' => "Stock record deleted (quantity was {$warehouseStock->total_quantity})",
                ]);
            }

            WarehouseStock::whereIn('id', $ids)->delete();
        });
    }
}
