<?php

namespace App\Actions\Categories;

use App\Models\Category;

class DeleteCategoryAction
{
    /**
     * Delete a category.
     */
    public function execute(Category $category): bool
    {
        return $category->delete();
    }
}
