<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = Category::all();

        // Create 30-50 products with random categories
        Product::factory(rand(30, 50))->create()->each(function ($product) use ($categories) {
            $product->update([
                'category_id' => $categories->random()->id,
            ]);
        });

        $this->command->info('Products seeded successfully!');
    }
}
