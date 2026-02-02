<?php

namespace App\Actions\Products;

use App\Models\ProductPrice;

class CreateProductPriceAction
{
    /**
     * Create a new product price.
     *
     * @param  array<string, mixed>  $input
     */
    public function execute(array $input): ProductPrice
    {
        $productPrice = ProductPrice::create([
            'product_id' => $input['product_id'],
            'cost_price' => $input['cost_price'],
            'selling_price' => $input['selling_price'],
            'effective_from' => $input['effective_from'],
        ]);

        return $productPrice;
    }
}
