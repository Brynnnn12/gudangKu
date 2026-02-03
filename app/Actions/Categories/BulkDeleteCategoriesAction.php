<?php

namespace App\Actions\Categories;

use App\Models\Category;

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
        // Get categories that have products
        $categoriesWithProducts = Category::whereIn('id', $ids)
            ->has('products')
            ->pluck('name')
            ->toArray();

        if (! empty($categoriesWithProducts)) {
            throw new \Exception(
                'Cannot delete categories with products: '.implode(', ', $categoriesWithProducts).
                '. Please reassign or delete products first.'
            );
        }

        return Category::whereIn('id', $ids)->delete();
    }
}
