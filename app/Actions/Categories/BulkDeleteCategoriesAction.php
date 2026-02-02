<?php

namespace App\Actions\Categories;

use App\Models\Category;

class BulkDeleteCategoriesAction
{
    /**
     * Delete multiple categories.
     *
     * @param  array<int>  $ids
     */
    public function execute(array $ids): int
    {
        return Category::whereIn('id', $ids)->delete();
    }
}
