<?php

namespace App\Concerns\Models\Concerns;
use Illuminate\Support\Str;

trait HasSlug
{
    /**
     * Boot trait untuk otomatis membuat slug saat model dibuat/diupdate.
     */
    public static function bootHasSlug()
    {
        static::creating(function ($model) {
            if (empty($model->slug)) {
                $model->slug = Str::slug($model->name);
            }
        });

        static::updating(function ($model) {
            // Update slug jika nama berubah
            if ($model->isDirty('name')) {
                $model->slug = Str::slug($model->name);
            }
        });
    }
}
