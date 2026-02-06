<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Warehouse extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'address',
    ];

    public function scopeSearch($query, ?string $search): void
    {
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('address', 'like', "%{$search}%");
            });
        }
    }

    protected function casts(): array
    {
        return [
            'deleted_at' => 'datetime',
        ];
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'warehouse_users')
            ->using(WarehouseUser::class) // Wajib panggil model pivot tadi
            ->withTimestamps()
            ->withPivot('deleted_at');
    }

    public function warehouseStocks(): HasMany
    {
        return $this->hasMany(WarehouseStock::class);
    }

}
