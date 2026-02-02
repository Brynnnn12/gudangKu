<?php

namespace App\Actions\WarehouseStocks;

use App\Models\WarehouseStock;

class BulkDeleteWarehouseStocksAction
{
    /**
     * Bulk delete warehouse stocks.
     *
     * @param  array<int>  $ids
     */
    public function execute(array $ids): void
    {
        WarehouseStock::whereIn('id', $ids)->delete();
    }
}
