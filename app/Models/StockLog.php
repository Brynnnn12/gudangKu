<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StockLog extends Model
{
    use HasFactory;


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


    protected function casts(): array
    {
        return [
            'qty' => 'integer',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }


    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class)->withTrashed();
    }


    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class)->withTrashed();
    }


    public function batch(): BelongsTo
    {
        return $this->belongsTo(StockBatch::class, 'batch_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class)->withTrashed();
    }
}
