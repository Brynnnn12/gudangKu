<?php

namespace App\Actions\Products;

use App\Models\ProductPrice;

class DeleteProductPriceAction
{
    /**
     * Delete a product price.
     */
    public function execute(ProductPrice $productPrice): bool
    {
        return $productPrice->delete();
    }
}
