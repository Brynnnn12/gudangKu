<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, HasRoles, Notifiable, TwoFactorAuthenticatable,SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'phone_number',
        'password',
        'google_id',
        'google_token',
        'google_refresh_token',
        'token',
    ];

    public function scopeSearch($query, ?string $search): void
    {
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }
    }

    public function warehouses()
    {
        return $this->belongsToMany(Warehouse::class, 'warehouse_users')
            ->using(WarehouseUser::class)
            ->withTimestamps()
            ->withPivot('deleted_at');
    }

    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    public function sendEmailVerificationNotification()
    {
        // Tidak perlu override karena sudah dihandle di FortifyServiceProvider
        // menggunakan VerifyEmail::toMailUsing dengan VerifyEmailMail
    }
}
