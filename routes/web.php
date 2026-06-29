<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DeviceController;
use App\Http\Controllers\SensorLogController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::get('device', [DeviceController::class, 'index'])->name('devices.index');
    Route::get('/device/create', [DeviceController::class, 'create'])->name('devices.create');
    Route::post('/device', [DeviceController::class, 'store'])->name('devices.store');
    Route::get('/device/{device}/edit', [DeviceController::class, 'edit'])->name('devices.edit');
    Route::put('/device/{device}', [DeviceController::class, 'update'])->name('devices.update');
    Route::get('sensor-logs', [SensorLogController::class, 'index'])->name('logs.index');

    

});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
