<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::get('dashboard', [DashboardController::class, 'index'])->name('api.dashboard.index');
Route::get('devices', [DashboardController::class, 'getDeviceList'])->name('api.device');
Route::get('trend-data/{id}', [DashboardController::class, 'getTrenData'])->name('api.trendata');
Route::post('relay/update', [DashboardController::class, 'relayControl'])->name('api.relaycontrol');
