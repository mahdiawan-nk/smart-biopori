<?php

namespace App\Http\Controllers;

use App\Models\Device;
use App\Models\SensorLog;
use App\Models\SensorThreshold;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class DashboardController extends Controller
{

    /**
     * Menampilkan data telemetry untuk kebutuhan REST API Dashboard.
     * * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        // 1. Ambil device yang dipilih atau default ke device pertama yang aktif
        $selectedDeviceId = $request->input('device_id');

        if (!$selectedDeviceId) {
            $defaultDevice = Device::where('is_active', true)
                ->orderBy('id')
                ->value('id');
            $selectedDeviceId = $defaultDevice;
        }


        // 3. Ambil LOG TERBARU (Real-time data untuk Cards & Gauges)
        $latestLog = null;
        $deviceStatus = 'INACTIVE';

        if ($selectedDeviceId) {
            // Eager loading relasi device dan sensorThreshold-nya
            $latestLog = SensorLog::with('device.sensorThreshold')
                ->where('device_id', $selectedDeviceId)
                ->latest('created_at')
                ->first();

            // Cek keaktifan device (Heartbeat check 5 menit)
            if ($latestLog && Carbon::parse($latestLog->created_at)->greaterThanOrEqualTo(now()->subMinutes(5))) {
                $deviceStatus = 'ONLINE';
            } else if ($selectedDeviceId) {
                $deviceStatus = 'OFFLINE';
            }
        }


        // Ambil threshold dengan safe-navigation (?->) menghindari crash jika threshold bernilai null
        $threshold = $latestLog?->device?->sensorThreshold;

        // 5. Susun struktur response data JSON
        $responseData = [
            'status' => 'success',
            'message' => 'Data telemetry fetched successfully',
            'data' => [
                'deviceStatus' => $deviceStatus,
                'relay_control' => $threshold?->relay,
                'latestData' => $latestLog ? [
                    'soil_moisture' => $latestLog->soil_moisture,
                    'soil_temperature' => $latestLog->soil_temperature,
                    'wifi_rssi' => $latestLog->wifi_rssi,
                    'status' => $latestLog->status ?? 'UNKNOWN',
                    'min_soil_moisture' => $threshold?->min_soil_moisture ?? 0,
                    'max_soil_moisture' => $threshold?->max_soil_moisture ?? 0,
                    'min_temperature' => $threshold?->min_soil_temperature ?? 0,
                    'max_temperature' => $threshold?->max_soil_temperature ?? 0,
                    'updated_at' => Carbon::parse($latestLog->created_at)->isoFormat('D MMMM YYYY, HH:mm:ss')
                ] : null,
            ]
        ];

        // Return dalam bentuk standard JSON API dengan HTTP status 200 OK
        return response()->json($responseData, 200);
    }

    public function getDeviceList()
    {
        $devices = Device::select('id', 'device_code', 'device_name', 'is_active')->get();

        return response()->json($devices);
    }

    public function getTrenData(Request $request, string $id)
    {
        $selectedDeviceId = $id ?: Device::where('is_active', true)
            ->orderBy('id')
            ->value('id');

        // Default 10, minimal 1, maksimal 50
        $limit = (int) $request->query('limit', 10);
        $limit = max(1, min($limit, 50));

        $trendData = SensorLog::where('device_id', $selectedDeviceId)
            ->select([
                'created_at',
                'soil_moisture',
                'soil_temperature',
            ])
            ->latest('created_at')
            ->limit($limit)
            ->get()
            ->reverse() // agar urut dari data lama ke terbaru
            ->values()
            ->map(function ($item) {
                return [
                    'time' => $item->created_at->format('H:i'),
                    'soil_moisture' => $item->soil_moisture,
                    'soil_temperature' => $item->soil_temperature,
                ];
            });

        return response()->json([
            'device_id' => $selectedDeviceId,
            'limit' => $limit,
            'count' => $trendData->count(),
            'data' => $trendData,
        ]);
    }

    public function relayControl(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'device_id' => ['required', 'uuid', 'exists:devices,id'],
            'relay' => ['nullable', 'boolean'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $threshold = SensorThreshold::updateOrCreate(
                [
                    'device_id' => $request->device_id,
                ],
                [
                    'relay' => $request->relay,
                ]
            );

            return response()->json([
                'status' => 'success',
                'message' => 'Relay berhasil diperbarui.',
                'data' => [
                    'device_id' => $threshold->device_id,
                    'relay' => $threshold->relay,
                ]
            ], 200);
        } catch (\Throwable $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal memperbarui relay.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
