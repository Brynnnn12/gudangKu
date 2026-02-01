<?php

namespace App\Concerns\Models\Concerns;

use Illuminate\Support\Str;

trait HasSlug
{
    public static function bootHasSlug()
    {
        static::creating(function ($model) {
            $model->slug = $model->generateUniqueSlug($model->name);
        });

        static::updating(function ($model) {
            if ($model->isDirty('name')) {
                $model->slug = $model->generateUniqueSlug($model->name);
            }
        });
    }

    /**
     * Logic untuk membuat slug unik
     */
    private function generateUniqueSlug($name)
    {
        $slug = Str::slug($name);
        $originalSlug = $slug;
        $count = 1;

        // Cek apakah slug sudah ada di table ini
        // Kita exclude ID model ini sendiri jika sedang proses update
        while (static::where('slug', $slug)
            ->where($this->getKeyName(), '!=', $this->getKey())
            ->exists()
        ) {
            $slug = $originalSlug.'-'.$count++;
        }

        return $slug;
    }
}
