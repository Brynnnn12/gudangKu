<?php

namespace App\Actions\Products;

use App\Models\Product;
use Illuminate\Support\Facades\DB;

class DeleteProductAction
{
    /**
     * Delete a product (soft delete).
     *
     * @throws \Exception
     */
    public function execute(Product $product): void
    {
        DB::transaction(function () use ($product) {
            // Lock for update to prevent race conditions
            $product = Product::where('id', $product->id)->lockForUpdate()->firstOrFail();

            // Check dependencies (aligned with restrict foreign keys)
            if ($product->prices()->exists()) {
                throw new \Exception('Cannot delete product with price history. Product will be soft deleted to preserve audit trail.');
            }

            if ($product->warehouseStocks()->exists()) {
                throw new \Exception('Cannot delete product with warehouse stock. Please remove all stock first.');
            }

            // Soft delete - preserves audit trail for stock_logs and stock_transfers
            $product->delete();
        });
    }
}
