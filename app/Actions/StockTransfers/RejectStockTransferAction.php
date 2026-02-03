<?php

namespace App\Actions\StockTransfers;

use App\Models\StockTransfer;
use Illuminate\Support\Facades\DB;

class RejectStockTransferAction
{
    /**
     * Reject a pending stock transfer.
     * Only pending transfers can be rejected.
     */
    public function execute(StockTransfer $transfer, ?string $rejectReason = null): StockTransfer
    {
        if (! $transfer->isPending()) {
            throw new \Exception('Maaf, hanya transfer dengan status pending yang dapat ditolak.');
        }

        return DB::transaction(function () use ($transfer, $rejectReason) {
            $notes = $transfer->notes ?? '';

            if ($rejectReason) {
                $notes .= ($notes ? "\n\n" : '')."Rejected: {$rejectReason}";
            }

            $transfer->update([
                'status' => 'rejected',
                'notes' => $notes,
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
