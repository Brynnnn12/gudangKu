<?php

use App\Http\Controllers\Settings\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::get('dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::prefix('dashboard')->middleware(['auth', 'verified'])->group(function () {

    Route::delete('employees/bulk-destroy', [\App\Http\Controllers\EmployeeController::class, 'bulkDestroy'])
        ->name('employees.bulk-destroy');

    // Resource untuk Employees (hanya aktifkan rute yang diperlukan)
    Route::resource('employees', \App\Http\Controllers\EmployeeController::class)
        ->parameters(['employees' => 'employee'])
        ->except(['create', 'edit']); // <--- Tambahkan ini

    Route::delete('categories/bulk-destroy', [\App\Http\Controllers\CategoryController::class, 'bulkDestroy'])
        ->name('categories.bulk-destroy');

    // Ulangi hal yang sama untuk yang lain
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
});

Route::get('auth/google/redirect', [ProfileController::class, 'google_redirect'])->name('google.redirect');
Route::get('auth/google/callback', [ProfileController::class, 'google_callback'])->name('google.callback');

require __DIR__.'/settings.php';
