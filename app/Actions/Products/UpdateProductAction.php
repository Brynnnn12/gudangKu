<?php

namespace App\Actions\Products;

use App\Models\Product;

class UpdateProductAction
{
    /**
     * Update an existing product.
     *
     * @param  array<string, mixed>  $input
     */
    public function execute(Product $product, array $input): Product
    {
        $product->update([
            'category_id' => $input['category_id'],
            'name' => $input['name'],
            'brand' => $input['brand'],
            'unit' => $input['unit'],

        ]);

        return $product;
    }
}
