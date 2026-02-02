<?php

namespace App\Actions\Products;

use App\Models\ProductPrice;

class UpdateProductPriceAction
{
    /**
     * Update an existing product price.
     *
     * @param  array<string, mixed>  $input
     */
    public function execute(ProductPrice $productPrice, array $input): ProductPrice
    {
        $productPrice->update([
            'product_id' => $input['product_id'],
            'cost_price' => $input['cost_price'],
            'selling_price' => $input['selling_price'],
            'effective_from' => $input['effective_from'],
        ]);

        return $productPrice->fresh();
    }
}
