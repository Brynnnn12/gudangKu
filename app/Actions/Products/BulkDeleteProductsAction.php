<?php

namespace App\Actions\Products;

use App\Models\Product;

class BulkDeleteProductsAction
{
    /**
     * Bulk delete products.
     *
     * @param  array<int>  $ids
     */
    public function execute(array $ids): int
    {
        return Product::whereIn('id', $ids)->delete();
    }
}
