<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SensorThreshold extends Model
{
    use HasUuids;

    protected $table = 'sensor_thresholds';

    protected $primaryKey = 'id';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'device_id',
        'min_soil_moisture',
        'max_soil_moisture',
        'min_soil_temperature',
        'max_soil_temperature',
        'relay',
        'restart_command',
    ];

    protected $casts = [
        'min_soil_moisture'    => 'decimal:2',
        'max_soil_moisture'    => 'decimal:2',
        'min_soil_temperature' => 'decimal:2',
        'max_soil_temperature' => 'decimal:2',
        'relay'                => 'boolean',
        'restart_command'      => 'boolean',
        'created_at'           => 'datetime',
        'updated_at'           => 'datetime',
    ];

    /**
     * Device yang memiliki threshold ini.
     */
    public function device(): BelongsTo
    {
        return $this->belongsTo(Device::class);
    }
}
