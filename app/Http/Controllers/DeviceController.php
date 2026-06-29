<?php

namespace App\Http\Controllers;

use App\Models\Device;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
class DeviceController extends Controller
{
    /**
     * Menampilkan daftar perangkat.
     */
    public function index(Request $request): Response
    {
        $devices = Device::with('sensorThreshold')
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('devices/index', [
            'devices' => $devices,
        ]);
    }

    /**
     * Menampilkan form untuk menambahkan perangkat baru.
     */
    public function create(): Response
    {
        // Merender view React yang terletak di resources/js/Pages/devices/create.tsx (atau .jsx)
        return Inertia::render('devices/create');
    }

    /**
     * Menyimpan data perangkat baru ke database.
     */
    public function store(Request $request): RedirectResponse
    {
        // 1. Validasi data input (Termasuk nested array dari sensor_threshold)
        $validated = $request->validate([
            // Validasi Data Perangkat (Device)
            'device_code'                            => 'required|string|unique:devices,device_code|max:50',
            'device_name'                            => 'required|string|max:255',
            'description'                            => 'nullable|string',
            'location_name'                          => 'nullable|string|max:255',
            'hardware_version'                       => 'nullable|string|max:50',
            'firmware_version'                       => 'nullable|string|max:50',
            'latitude'                               => 'nullable|numeric|between:-90,90',
            'longitude'                              => 'nullable|numeric|between:-180,180',
            'is_active'                              => 'required|boolean',

            // Validasi Data Ambang Batas Sensor (Sensor Threshold)
            'sensor_threshold'                       => 'required|array',
            'sensor_threshold.min_soil_moisture'    => 'required|integer|min:0|max:100',
            'sensor_threshold.max_soil_moisture'    => 'required|integer|min:0|max:100',
            'sensor_threshold.min_soil_temperature' => 'required|integer|min:-40|max:125',
            'sensor_threshold.max_soil_temperature' => 'required|integer|min:-40|max:125',
            'sensor_threshold.relay'                => 'nullable|boolean', // nullable mendukung nilai NULL (AUTO)
        ]);

        // 2. Pisahkan data device dan data threshold
        $deviceData = $request->except('sensor_threshold');
        $thresholdData = $request->input('sensor_threshold');

        // 3. Simpan data perangkat baru ke database
        $device = Device::create($deviceData);

        // 4. Simpan data threshold yang dikirim dari form ke tabel relasinya
        $device->sensorThreshold()->create([
            'min_soil_moisture'    => $thresholdData['min_soil_moisture'],
            'max_soil_moisture'    => $thresholdData['max_soil_moisture'],
            'min_soil_temperature' => $thresholdData['min_soil_temperature'],
            'max_soil_temperature' => $thresholdData['max_soil_temperature'],
            'relay'                => $thresholdData['relay'], // Menyimpan null, true, atau false
        ]);

        // 5. Mengarahkan kembali ke halaman index dengan pesan sukses
        return redirect()->route('devices.index')
            ->with('success', 'Perangkat dan konfigurasi threshold berhasil ditambahkan!');
    }

    /**
     * Menampilkan form untuk mengedit perangkat beserta threshold-nya.
     */
    public function edit(Device $device): Response
    {
        // Memuat data device beserta relasi sensorThreshold-nya
        $device->load('sensorThreshold');

        return Inertia::render('devices/edit', [
            'device' => $device
        ]);
    }

    /**
     * Memperbarui data perangkat dan threshold di database.
     */
    public function update(Request $request, Device $device): RedirectResponse
    {
        // 1. Validasi data input (Abaikan unique check untuk id device ini sendiri)
        $validated = $request->validate([
            // Validasi Data Perangkat
            'device_code'                            => 'required|string|max:50|unique:devices,device_code,' . $device->id,
            'device_name'                            => 'required|string|max:255',
            'description'                            => 'nullable|string',
            'location_name'                          => 'nullable|string|max:255',
            'hardware_version'                       => 'nullable|string|max:50',
            'firmware_version'                       => 'nullable|string|max:50',
            'latitude'                               => 'nullable|numeric|between:-90,90',
            'longitude'                              => 'nullable|numeric|between:-180,180',
            'is_active'                              => 'required|boolean',

            // Validasi Data Ambang Batas Sensor
            'sensor_threshold'                       => 'required|array',
            'sensor_threshold.min_soil_moisture'    => 'required|numeric|min:0|max:100',
            'sensor_threshold.max_soil_moisture'    => 'required|numeric|min:0|max:100',
            'sensor_threshold.min_soil_temperature' => 'required|numeric|min:-40|max:125',
            'sensor_threshold.max_soil_temperature' => 'required|numeric|min:-40|max:125',
            'sensor_threshold.relay'                => 'nullable|boolean', // Menerima null (AUTO), true (ON), false (OFF)
        ]);

        // 2. Update data utama Perangkat (Device)
        $device->update($request->except('sensor_threshold'));

        // 3. Update atau Create data Sensor Threshold jika belum ada relasinya
        $device->sensorThreshold()->updateOrCreate(
            ['device_id' => $device->id], // klausul pencarian
            $request->input('sensor_threshold') // data yang diperbarui
        );

        // 4. Kembali ke halaman utama dengan pesan sukses
        return redirect()->route('devices.index')
            ->with('success', 'Perangkat dan konfigurasi threshold berhasil diperbarui!');
    }

    public function destroy(Device $device): RedirectResponse
    {
        DB::beginTransaction();

        try {
            // 1. Hapus data sensor_threshold terkait jika ada relasi di DB
            if ($device->sensor_threshold()->exists()) {
                $device->sensor_threshold()->delete();
            }

            // 2. Hapus data perangkat utama
            $device->delete();

            DB::commit();

            // Menggunakan back() agar Inertia mengarahkan kembali ke halaman index 
            // dan memperbarui properti props `devices` secara reaktif.
            return redirect()->back()->with('message', [
                'type' => 'success',
                'content' => "Perangkat {$device->device_name} berhasil dihapus."
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            Log::error("Gagal menghapus device ID {$device->id}: " . $e->getMessage());

            return redirect()->back()->with('message', [
                'type' => 'error',
                'content' => 'Terjadi kesalahan sistem saat menghapus perangkat.'
            ]);
        }
    }
}
