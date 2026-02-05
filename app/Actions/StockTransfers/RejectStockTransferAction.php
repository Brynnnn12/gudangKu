<?php

namespace App\Actions\StockTransfers;

use App\Models\StockTransfer;
use Exception;
use Illuminate\Support\Facades\DB;

class RejectStockTransferAction
{
    public function execute(StockTransfer $transfer, ?string $rejectReason = null): StockTransfer
    {
        if (! $transfer->isPending()) {
            throw new Exception('Maaf, hanya transfer dengan status pending yang dapat ditolak.');
        }

        return DB::transaction(function () use ($transfer, $rejectReason) {
            $notes = $this->buildRejectionNotes($transfer->notes, $rejectReason);

            $transfer->update([
                'status' => 'rejected',
                'notes' => $notes,
            ]);

            return $transfer->load(['fromWarehouse', 'toWarehouse', 'product']);
        });
    }

    private function buildRejectionNotes(?string $existingNotes, ?string $rejectReason): string
    {
        $notes = $existingNotes ?? '';

        if ($rejectReason) {
            $notes .= ($notes ? "\n\n" : '')."Alasan ditolak: {$rejectReason}";
        }

        return $notes;
    }
}
