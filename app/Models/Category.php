<?php

namespace App\Models;

use App\Concerns\Models\Concerns\HasSlug;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasSlug;

    protected $fillable = [
        'name',
        'slug',
    ];
}
