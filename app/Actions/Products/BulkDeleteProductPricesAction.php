<?php

namespace App\Actions\Products;

use App\Models\ProductPrice;

class BulkDeleteProductPricesAction
{
    /**
     * Bulk delete product prices.
     *
     * @param  array<int>  $ids
     */
    public function execute(array $ids): int
    {
        return ProductPrice::whereIn('id', $ids)->delete();
    }
}
