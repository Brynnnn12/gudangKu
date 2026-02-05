<?php

namespace App\Actions\StockTransfers;

use App\Models\StockTransfer;
use Exception;

class DeleteStockTransferAction
{
    public function execute(StockTransfer $transfer): bool
    {
        if (! $transfer->isPending() && ! $transfer->isRejected()) {
            throw new Exception('Hanya transfer pending atau rejected yang dapat dihapus.');
        }

        return $transfer->delete();
    }
}
