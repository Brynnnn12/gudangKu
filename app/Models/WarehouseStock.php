<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WarehouseStock extends Model
{
    /** @use HasFactory<\Database\Factories\WarehouseStockFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'warehouse_id',
        'product_id',
        'total_quantity',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'total_quantity' => 'integer',
        ];
    }

    /**
     * Get the warehouse that owns this stock.
     */
    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class);
    }

    /**
     * Get the product associated with this stock.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get all batches for this warehouse stock (FEFO).
     */
    public function batches(): HasMany
    {
        return $this->hasMany(StockBatch::class);
    }

    /**
     * Get active batches ordered by expiry date (FEFO).
     */
    public function activeBatches(): HasMany
    {
        return $this->hasMany(StockBatch::class)
            ->where('is_active', true)
            ->where('current_qty', '>', 0)
            ->orderBy('expired_at', 'asc');
    }

    /**
     * Recalculate total_quantity from sum of all batches.
     * WarehouseStock.total_quantity should always equal SUM(batches.current_qty).
     */
    public function recalculateTotal(): void
    {
        $this->total_quantity = $this->batches()->sum('current_qty');
        $this->saveQuietly(); // Save without triggering events
    }
}
