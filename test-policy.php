<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use App\Models\StockTransfer;

$user = User::find(1);
$transfer = StockTransfer::first();

if (!$user) {
    echo "User not found\n";
    exit(1);
}

if (!$transfer) {
    echo "No transfer found\n";
    exit(1);
}

echo "User: {$user->name}\n";
echo "Roles: " . $user->roles->pluck('name')->join(', ') . "\n";
echo "Transfer ID: {$transfer->id}\n";
echo "Transfer Status: {$transfer->status}\n";
echo "Is Pending: " . ($transfer->isPending() ? 'YES' : 'NO') . "\n";
echo "\nPolicy Checks:\n";
echo "Can approve: " . ($user->can('approve', $transfer) ? 'YES' : 'NO') . "\n";
echo "Can reject: " . ($user->can('reject', $transfer) ? 'YES' : 'NO') . "\n";
echo "\nRole Checks:\n";
echo "Has super-admin: " . ($user->hasRole('super-admin') ? 'YES' : 'NO') . "\n";
echo "Has admin: " . ($user->hasRole('admin') ? 'YES' : 'NO') . "\n";
echo "Has any role [super-admin, admin]: " . ($user->hasAnyRole(['super-admin', 'admin']) ? 'YES' : 'NO') . "\n";
