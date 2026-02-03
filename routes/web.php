<?php

use App\Http\Controllers\Settings\ProfileController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::get('dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::prefix('dashboard')->middleware(['auth', 'verified'])->group(function () {

    Route::delete('employees/bulk-destroy', [\App\Http\Controllers\EmployeeController::class, 'bulkDestroy'])
        ->name('employees.bulk-destroy');

    Route::resource('employees', \App\Http\Controllers\EmployeeController::class)
        ->parameters(['employees' => 'employee'])
        ->except(['create', 'edit']); // <--- Tambahkan ini

    Route::delete('categories/bulk-destroy', [\App\Http\Controllers\CategoryController::class, 'bulkDestroy'])
        ->name('categories.bulk-destroy');

    Route::resource('categories', \App\Http\Controllers\CategoryController::class)
        ->parameters(['categories' => 'category'])
        ->except(['create', 'edit']);

    Route::delete('warehouses/bulk-destroy', [\App\Http\Controllers\WarehouseController::class, 'bulkDestroy'])
        ->name('warehouses.bulk-destroy');
    Route::resource('warehouses', \App\Http\Controllers\WarehouseController::class)
        ->parameters(['warehouses' => 'warehouse'])
        ->except(['create', 'edit']);

    Route::delete('warehouse-users/bulk-destroy', [\App\Http\Controllers\WarehouseUserController::class, 'bulkDestroy'])
        ->name('warehouse-users.bulk-destroy');
    Route::resource('warehouse-users', \App\Http\Controllers\WarehouseUserController::class)
        ->parameters(['warehouse-users' => 'warehouseUser'])
        ->except(['create', 'edit']);

    Route::delete('products/bulk-destroy', [\App\Http\Controllers\ProductController::class, 'bulkDestroy'])
        ->name('products.bulk-destroy');
    Route::resource('products', \App\Http\Controllers\ProductController::class)
        ->parameters(['products' => 'product'])
        ->except(['create', 'edit']);

    Route::delete('product-prices/bulk-destroy', [\App\Http\Controllers\ProductPriceController::class, 'bulkDestroy'])
        ->name('product-prices.bulk-destroy');
    Route::resource('product-prices', \App\Http\Controllers\ProductPriceController::class)
        ->parameters(['product-prices' => 'productPrice'])
        ->except(['create', 'edit', 'show', 'store']);

    Route::delete('warehouse-stocks/bulk-destroy', [\App\Http\Controllers\WarehouseStockController::class, 'bulkDestroy'])
        ->name('warehouse-stocks.bulk-destroy');
    Route::post('warehouse-stocks/stock-out', [\App\Http\Controllers\WarehouseStockController::class, 'stockOut'])
        ->name('warehouse-stocks.stock-out');
    Route::resource('warehouse-stocks', \App\Http\Controllers\WarehouseStockController::class)
        ->parameters(['warehouse-stocks' => 'warehouseStock'])
        ->except(['create', 'edit']);

    // Stock Logs (Audit Trail - read-only)
    Route::resource('stock-logs', \App\Http\Controllers\StockLogController::class)
        ->parameters(['stock-logs' => 'stockLog'])
        ->only(['index', 'show']);

    // Stock Batches (Create only - for stock entry)
    Route::post('stock-batches', [\App\Http\Controllers\StockBatchController::class, 'store'])
        ->name('stock-batches.store');

    // Stock Transfers (Inter-warehouse transfers with approval)
    Route::post('stock-transfers/{stockTransfer}/approve', [\App\Http\Controllers\StockTransferController::class, 'approve'])
        ->name('stock-transfers.approve');
    Route::post('stock-transfers/{stockTransfer}/reject', [\App\Http\Controllers\StockTransferController::class, 'reject'])
        ->name('stock-transfers.reject');
    Route::resource('stock-transfers', \App\Http\Controllers\StockTransferController::class)
        ->parameters(['stock-transfers' => 'stockTransfer'])
        ->except(['show']);
});

Route::get('auth/google/redirect', [ProfileController::class, 'google_redirect'])->name('google.redirect');
Route::get('auth/google/callback', [ProfileController::class, 'google_callback'])->name('google.callback');

require __DIR__.'/settings.php';
