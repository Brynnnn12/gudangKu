<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    
    protected $fillable = [
        'category_id',
        'name',
        'brand',
        'unit',
        'sku',
    ];

    public function scopeSearch($query, ?string $search): void
    {
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('brand', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%")
                    ->orWhereHas('category', function ($category) use ($search) {
                        $category->where('name', 'like', "%{$search}%");
                    });
            });
        }
    }

    
    protected function casts(): array
    {
        return [
            'deleted_at' => 'datetime',
        ];
    }

    
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    
    public function prices(): HasMany
    {
        return $this->hasMany(ProductPrice::class);
    }

    
    public function currentPrice(): ?ProductPrice
    {
        return $this->prices()
            ->where('effective_from', '<=', now())
            ->orderBy('effective_from', 'desc')
            ->first();
    }

    public function warehouseStocks(): HasMany
    {
        return $this->hasMany(WarehouseStock::class);
    }
}
