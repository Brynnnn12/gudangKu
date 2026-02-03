<?php

namespace App\Actions\Categories;

use App\Models\Category;

class UpdateCategoryAction
{
    /**
     * Update an existing category with auto-regenerated slug via HasSlug trait.
     *
     * @param  array<string, mixed>  $input
     */
    public function execute(Category $category, array $input): Category
    {
        $category->update($input);

        return $category->fresh();
    }
}
