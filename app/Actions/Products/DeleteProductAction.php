<?php

namespace App\Actions\Products;

use App\Models\Product;

class DeleteProductAction
{
    /**
     * Delete a product.
     */
    public function execute(Product $product): void
    {
        $product->delete();
    }
}
