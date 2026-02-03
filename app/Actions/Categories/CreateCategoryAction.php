<?php

namespace App\Actions\Categories;

use App\Models\Category;

class CreateCategoryAction
{
    /**
     * Create a new category with auto-generated slug via HasSlug trait.
     *
     * @param  array<string, mixed>  $input
     */
    public function execute(array $input): Category
    {
        return Category::create($input);
    }
}
