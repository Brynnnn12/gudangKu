<?php

namespace App\Actions\Categories;

use App\Models\Category;

class UpdateCategoryAction
{
    /**
     * Update an existing category.
     *
     * @param  array<string, mixed>  $input
     */
    public function execute(Category $category, array $input): Category
    {
        $category->update([
            'name' => $input['name'],
        ]);

        return $category->fresh();
    }
}
