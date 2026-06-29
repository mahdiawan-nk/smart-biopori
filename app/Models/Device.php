<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Device extends Model
{
    use HasUuids;

    protected $table = 'devices';

    protected $primaryKey = 'id';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'device_code',
        'device_name',
        'description',
        'location_name',
        'latitude',
        'longitude',
        'hardware_version',
        'firmware_version',
        'api_key',
        'is_active',
        'last_seen',
    ];

    protected $casts = [
        'latitude'     => 'decimal:8',
        'longitude'    => 'decimal:8',
        'is_active'    => 'boolean',
        'last_seen'    => 'datetime',
        'created_at'   => 'datetime',
        'updated_at'   => 'datetime',
    ];

    protected $hidden = [
        'api_key',
    ];

    protected static function booted(): void
    {
        static::creating(function ($device) {
            if (empty($device->api_key)) {
                $device->api_key = Str::uuid()->toString() . Str::random(32);
            }
        });
    }

    /**
     * Threshold sensor milik device.
     */
    public function sensorThreshold(): HasOne
    {
        return $this->hasOne(SensorThreshold::class);
    }
}
