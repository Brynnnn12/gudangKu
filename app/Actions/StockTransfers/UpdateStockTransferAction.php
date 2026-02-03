<?php

namespace App\Actions\StockTransfers;

use App\Models\StockTransfer;
use Illuminate\Support\Facades\DB;

class UpdateStockTransferAction
{
    /**
     * Update a pending stock transfer.
     * Only pending transfers can be updated.
     *
     * @param  array<string, mixed>  $input
     */
    public function execute(StockTransfer $transfer, array $input): StockTransfer
    {
        if (! $transfer->isPending()) {
            throw new \Exception('Only pending transfers can be updated.');
        }

        return DB::transaction(function () use ($transfer, $input) {
            $transfer->update([
                'from_warehouse_id' => $input['from_warehouse_id'],
                'to_warehouse_id' => $input['to_warehouse_id'],
                'product_id' => $input['product_id'],
                'qty' => $input['qty'],
                'notes' => $input['notes'] ?? $transfer->notes,
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
