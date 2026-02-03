<?php

namespace App\Actions\StockTransfers;

use App\Models\StockTransfer;
use Illuminate\Support\Facades\DB;

class CreateStockTransferAction
{
    /**
     * Create a new stock transfer request.
     * Transfer starts in pending status and requires approval.
     *
     * @param  array<string, mixed>  $input
     */
    public function execute(array $input): StockTransfer
    {
        return DB::transaction(function () use ($input) {
            // Create transfer request
            $transfer = StockTransfer::create([
                'from_warehouse_id' => $input['from_warehouse_id'],
                'to_warehouse_id' => $input['to_warehouse_id'],
                'product_id' => $input['product_id'],
                'qty' => $input['qty'],
                'user_id' => $input['user_id'],
                'status' => 'pending',
                'notes' => $input['notes'] ?? null,
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
