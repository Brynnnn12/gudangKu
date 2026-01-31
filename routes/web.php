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
    Route::resource('employees', \App\Http\Controllers\EmployeeController::class)
        ->parameters(['employees' => 'employee']);
});

Route::get('auth/google/redirect', [ProfileController::class, 'google_redirect'])->name('google.redirect');
Route::get('auth/google/callback', [ProfileController::class, 'google_callback'])->name('google.callback');

require __DIR__.'/settings.php';
