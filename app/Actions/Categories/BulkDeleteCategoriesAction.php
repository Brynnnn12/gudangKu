<?php

namespace App\Actions\Categories;

use App\Models\Category;
use Illuminate\Support\Facades\DB;

class BulkDeleteCategoriesAction
{
    /**
     * Delete multiple categories (only those without products).
     *
     * @param  array<int>  $ids
     *
     * @throws \Exception
     */
    public function execute(array $ids): int
    {
        return DB::transaction(function () use ($ids) {
            // Lock for update to prevent race conditions
            $categories = Category::whereIn('id', $ids)->lockForUpdate()->get();

            // Get categories that have products
            $categoriesWithProducts = $categories->filter(fn ($cat) => $cat->products()->exists())
                ->pluck('name')
                ->toArray();

            if (! empty($categoriesWithProducts)) {
                throw new \Exception(
                    'Cannot delete categories with products: '.implode(', ', $categoriesWithProducts).
                    '. Please reassign or delete products first.'
                );
            }

            return Category::whereIn('id', $ids)->delete();
        });
    }
}
