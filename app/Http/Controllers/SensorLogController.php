<?php

namespace App\Http\Controllers;

use App\Models\Device;
use App\Models\SensorLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SensorLogController extends Controller
{
    /**
     * Menampilkan daftar log sensor dengan fitur pencarian dan penyaringan.
     */
    public function index(Request $request): Response
    {
        // 1. Ambil semua list device untuk kebutuhan opsi dropdown filter di frontend
        $devices = Device::select('id', 'device_code', 'device_name')->get();

        // 2. Bangun query dasar log sensor beserta relasi device-nya
        $query = SensorLog::with('device:id,device_code,device_name')
            ->latest('created_at');

        // 3. Fitur Filter: Berdasarkan Perangkat (device_id)
        if ($request->filled('device_id')) {
            $query->where('device_id', $request->device_id);
        }

        // 4. Fitur Pencarian: Berdasarkan Status Log
        if ($request->filled('search')) {
            $query->where('status', 'ilike', '%' . $request->search . '%');
            // Catatan: gunakan 'like' jika menggunakan MySQL/MariaDB. 'ilike' khusus PostgreSQL agar case-insensitive.
        }

        // 5. Fitur Filter: Berdasarkan Rentang Tanggal (Range Date)
        if ($request->filled('start_date')) {
            // Memulai dari jam 00:00:00 pada tanggal mulai
            $query->whereDate('created_at', '>=', $request->start_date);
        }

        if ($request->filled('end_date')) {
            // Membatasi sampai tanggal akhir
            $query->whereDate('created_at', '<=', $request->end_date);
        }

        // 6. Eksekusi paginasi data (misal: 15 data per halaman) dan pertahankan query string di URL
        $sensorLogs = $query->paginate(15)->withQueryString();

        // 7. Kirim data ke komponen React via Inertia
        return Inertia::render('sensor-log/index', [
            'sensorLogs' => $sensorLogs,
            'devices' => $devices,
            'filters' => $request->only(['search', 'device_id', 'start_date', 'end_date']),
        ]);
    }
}
