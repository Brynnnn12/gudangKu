<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StockLog extends Model
{
    /** @use HasFactory<\Database\Factories\StockLogFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'warehouse_id',
        'product_id',
        'batch_id',
        'user_id',
        'qty',
        'type',
        'notes',
    ];

    public function scopeSearch($query, ?string $search): void
    {
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('warehouse', fn ($q) => $q->where('name', 'like', "%{$search}%"))
                    ->orWhereHas('product', fn ($q) => $q->where('name', 'like', "%{$search}%"))
                    ->orWhereHas('user', fn ($q) => $q->where('name', 'like', "%{$search}%"))
                    ->orWhere('notes', 'like', "%{$search}%");
            });
        }
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'qty' => 'integer',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /**
     * Get the warehouse associated with this log.
     */
    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class);
    }

    /**
     * Get the product associated with this log.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get the batch associated with this log (nullable).
     */
    public function batch(): BelongsTo
    {
        return $this->belongsTo(StockBatch::class, 'batch_id');
    }

    /**
     * Get the user who created this log.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
