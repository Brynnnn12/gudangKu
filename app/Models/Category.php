<?php

namespace App\Models;

use App\Concerns\Models\Concerns\HasSlug;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory,HasSlug;

    protected $fillable = [
        'name',
        'slug',
    ];
}
