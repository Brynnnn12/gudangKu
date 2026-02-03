<?php

namespace App\Actions\Categories;

use App\Models\Category;

class DeleteCategoryAction
{
    /**
     * Delete a category.
     *
     * @throws \Exception
     */
    public function execute(Category $category): bool
    {
        // Check if category has products
        if ($category->products()->exists()) {
            throw new \Exception('Cannot delete category with existing products. Please reassign or delete products first.');
        }

        return $category->delete();
    }
}
