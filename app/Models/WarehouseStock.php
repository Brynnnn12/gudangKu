<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WarehouseStock extends Model
{
    use HasFactory;

    protected $fillable = [
        'warehouse_id',
        'product_id',
        'total_quantity',
    ];

    public function scopeSearch($query, ?string $search): void
    {
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('warehouse', fn ($w) => $w->where('name', 'like', "%{$search}%"))
                    ->orWhereHas(
                        'product',
                        fn ($p) => $p->where('name', 'like', "%{$search}%")
                            ->orWhere('sku', 'like', "%{$search}%")
                            ->orWhere('brand', 'like', "%{$search}%")
                    );
            });
        }
    }

    protected function casts(): array
    {
        return [
            'total_quantity' => 'integer',
        ];
    }

    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class);
    }


    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }


    public function batches(): HasMany
    {
        return $this->hasMany(StockBatch::class);
    }


    public function activeBatches(): HasMany
    {
        return $this->hasMany(StockBatch::class)
            ->where('is_active', true)
            ->where('current_qty', '>', 0)
            ->orderBy('expired_at', 'asc');
    }


    public function recalculateTotal(): void
    {
        $this->total_quantity = $this->batches()->sum('current_qty');
        $this->saveQuietly();
    }
}
