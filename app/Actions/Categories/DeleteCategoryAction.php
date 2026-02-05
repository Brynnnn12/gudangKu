<?php

namespace App\Actions\Categories;

use App\Models\Category;
use Illuminate\Support\Facades\DB;

class DeleteCategoryAction
{
    /**
     * Delete a category (soft delete).
     *
     * @throws \Exception
     */
    public function execute(Category $category): bool
    {
        return DB::transaction(function () use ($category) {
            // Lock for update to prevent race conditions
            $category = Category::where('id', $category->id)->lockForUpdate()->firstOrFail();

            // Check if category has products (prevent delete if foreign key would fail)
            if ($category->products()->exists()) {
                throw new \Exception('Cannot delete category with existing products. Please reassign or delete products first.');
            }

            return $category->delete();
        });
    }
}
