<?php

namespace App\Actions\StockTransfers;

use App\Models\StockTransfer;
use Illuminate\Support\Facades\DB;

class DeleteStockTransferAction
{
    /**
     * Delete a stock transfer.
     * Only pending or rejected transfers can be deleted.
     */
    public function execute(StockTransfer $transfer): bool
    {
        if (! $transfer->isPending() && ! $transfer->isRejected()) {
            throw new \Exception('Only pending or rejected transfers can be deleted.');
        }

        return DB::transaction(function () use ($transfer) {
            return $transfer->delete();
        });
    }
}
