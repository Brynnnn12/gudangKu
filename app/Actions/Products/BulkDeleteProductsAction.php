<?php

namespace App\Actions\Products;

use App\Models\Product;
use Illuminate\Support\Facades\DB;

class BulkDeleteProductsAction
{
    /**
     * Bulk delete products (soft delete).
     *
     * @param  array<int>  $ids
     *
     * @throws \Exception
     */
    public function execute(array $ids): int
    {
        return DB::transaction(function () use ($ids) {
            // Lock for update to prevent race conditions
            $products = Product::whereIn('id', $ids)->lockForUpdate()->get();

            // Check for products with warehouse stocks
            $productsWithStock = $products->filter(fn ($product) => $product->warehouseStocks()->exists())
                ->pluck('name')
                ->toArray();

            if (! empty($productsWithStock)) {
                throw new \Exception(
                    'Cannot delete products with warehouse stock: '.implode(', ', $productsWithStock).
                    '. Please remove all stock first.'
                );
            }

            // Soft delete - preserves audit trail
            return Product::whereIn('id', $ids)->delete();
        });
    }
}
