<?php

namespace App\Actions\Products;

use App\Models\Product;
use App\Models\ProductPrice;
use Illuminate\Support\Facades\DB;

class CreateProductAction
{
    /**
     * Create a new product.
     *
     * @param  array<string, mixed>  $input
     */
    public function execute(array $input): Product
    {
        return DB::transaction(function () use ($input) {
            // Generate SKU otomatis
            $sku = $this->generateSku();

            // Create product
            $product = Product::create([
                'category_id' => $input['category_id'],
                'name' => $input['name'],
                'brand' => $input['brand'],
                'unit' => $input['unit'],
                'sku' => $sku,
            ]);

            // Create initial price
            ProductPrice::create([
                'product_id' => $product->id,
                'selling_price' => $input['selling_price'],
                'cost_price' => $input['cost_price'],
                'effective_from' => now(),
            ]);

            return $product;
        });
    }

    /**
     * Generate SKU unik dengan format PRD-XXXXXX
     */
    private function generateSku(): string
    {
        // Ambil produk terakhir berdasarkan ID tertinggi
        $lastProduct = Product::withTrashed()
            ->orderBy('id', 'desc')
            ->first();

        // Jika tidak ada produk, mulai dari 1
        $nextNumber = $lastProduct ? $lastProduct->id + 1 : 1;

        // Format: PRD-000001, PRD-000002, dst
        return 'PRD-'.str_pad((string) $nextNumber, 6, '0', STR_PAD_LEFT);
    }
}
