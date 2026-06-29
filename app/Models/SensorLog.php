<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;
class SensorLog extends Model
{
    use HasFactory;

    /**
     * Nama tabel yang terkait dengan model.
     *
     * @var string
     */
    protected $table = 'sensor_logs';

    /**
     * Menandakan jika model tidak menggunakan timestamp standar Laravel (created_at & updated_at).
     * Karena tabel Anda hanya memiliki `created_at`, kita matikan timestamp otomatis Laravel
     * dan mengaturnya secara manual saat data dibuat.
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * Atribut yang dapat diisi secara massal (Mass Assignable).
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'device_id',
        'soil_moisture',
        'soil_temperature',
        'air_temperature',
        'humidity',
        'battery_voltage',
        'wifi_rssi',
        'status',
        'created_at', // Diizinkan mass-assign jika ingin memasukkan waktu custom dari ESP32
    ];

    /**
     * Atribut yang harus dikonversi ke tipe data tertentu (Casting).
     * Ini penting agar nilai numeric(5,2) otomatis dibaca sebagai float/double di PHP, 
     * bukan sebagai string.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'id' => 'integer',
        'soil_moisture' => 'float',
        'soil_temperature' => 'float',
        'air_temperature' => 'float',
        'humidity' => 'float',
        'battery_voltage' => 'float',
        'wifi_rssi' => 'integer',
        'created_at' => 'datetime',
    ];

    /**
     * Event boot model untuk mengisi `created_at` otomatis sebelum data disimpan,
     * jika data dikirim tanpa menyertakan waktu.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->created_at)) {
                $model->created_at = now();
            }
        });
    }

    /**
     * Relasi ke model Device (Many-to-One).
     * Menghubungkan log sensor kembali ke perangkat IoT-nya.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function device(): BelongsTo
    {
        return $this->belongsTo(Device::class, 'device_id', 'id');
    }

    public function sensorThreshold(): HasOneThrough
    {
        return $this->hasOneThrough(
            SensorThreshold::class,
            Device::class,
            'id',          // Foreign key pada devices
            'device_id',   // Foreign key pada sensor_thresholds
            'device_id',   // Local key pada sensor_logs
            'id'           // Local key pada devices
        );
    }
}
