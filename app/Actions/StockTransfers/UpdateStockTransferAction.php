<?php

namespace App\Actions\StockTransfers;

use App\Models\StockTransfer;
use App\Models\WarehouseStock;
use Exception;
use Illuminate\Support\Facades\DB;

class UpdateStockTransferAction
{
    public function execute(StockTransfer $transfer, array $input): StockTransfer
    {
        if (! $transfer->isPending()) {
            throw new Exception('Hanya transfer pending yang dapat diubah.');
        }

        $this->validateTransfer($input);

        return DB::transaction(function () use ($transfer, $input) {
            $transfer->update([
                'from_warehouse_id' => $input['from_warehouse_id'],
                'to_warehouse_id' => $input['to_warehouse_id'],
                'product_id' => $input['product_id'],
                'qty' => $input['qty'],
                'notes' => $input['notes'] ?? $transfer->notes,
            ]);

            return $transfer->load(['fromWarehouse', 'toWarehouse', 'product']);
        });
    }

    private function validateTransfer(array $input): void
    {
        if ($input['from_warehouse_id'] === $input['to_warehouse_id']) {
            throw new Exception('Gudang asal dan tujuan tidak boleh sama.');
        }

        $sourceStock = WarehouseStock::where('warehouse_id', $input['from_warehouse_id'])
            ->where('product_id', $input['product_id'])
            ->first();

        if (! $sourceStock || $sourceStock->total_quantity < $input['qty']) {
            $available = $sourceStock->total_quantity ?? 0;
            throw new Exception("Stok tidak cukup di gudang asal. Tersedia: {$available}, Dibutuhkan: {$input['qty']}");
        }
    }
}
