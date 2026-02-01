<?php

namespace App\Actions\Categories;

use App\Models\Category;

class CreateCategoryAction
{
    /**
     * Create a new category.
     *
     * @param  array<string, mixed>  $input
     */
    public function execute(array $input): Category
    {
        $category = Category::create($input);

        return $category;
    }
}
