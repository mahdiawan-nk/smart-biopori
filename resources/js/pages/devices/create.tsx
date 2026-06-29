import { Head, Link, useForm } from "@inertiajs/react";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import {
    Cpu,
    ArrowLeft,
    Save,
    Info,
    MapPin,
    Sliders,
    Droplets,
    Thermometer,
    Zap
} from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Device',
        href: '/device',
    },
    {
        title: 'Create',
        href: '/device/create',
    },
];

export default function Create() {
    // Inisialisasi useForm dari Inertia dengan tambahan field sensor_threshold
    const { data, setData, post, processing, errors, reset } = useForm({
        device_code: '',
        device_name: '',
        description: '',
        location_name: '',
        hardware_version: 'ESP32-v1.0',
        firmware_version: 'v1.0.0',
        latitude: '',
        longitude: '',
        is_active: true,
        // Object threshold untuk dikirim bersamaan ke backend
        sensor_threshold: {
            min_soil_moisture: 20,
            max_soil_moisture: 80,
            min_soil_temperature: 15,
            max_soil_temperature: 35,
            relay: null, // NULL secara default mewakili AUTO
        }
    });

    // Helper unik untuk mengupdate state nested object (sensor_threshold)
    const handleThresholdChange = (key: string, value: any) => {
        setData('sensor_threshold', {
            ...data.sensor_threshold,
            [key]: value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/device', {
            onSuccess: () => reset()
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add New Device" />

            <div className="min-h-screen bg-slate-50/50 p-4 transition-colors duration-300 dark:bg-zinc-950 sm:p-6 lg:p-8">
                <div className="mx-auto max-w-4xl">

                    {/* Header Navigasi Kembali */}
                    <div className="mb-6">
                        <Link
                            href="/device"
                            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span>Back to Devices</span>
                        </Link>
                    </div>

                    {/* Judul Halaman */}
                    <div className="mb-8 flex items-center gap-3">
                        <div className="rounded-xl bg-indigo-600/10 p-2 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                            <Cpu className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-50 sm:text-3xl">
                                Add New Device
                            </h1>
                            <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
                                Daftarkan unit perangkat ESP32 beserta konfigurasi batasan sensor awalnya.
                            </p>
                        </div>
                    </div>

                    {/* Form Utama */}
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Section 1: Informasi Dasar */}
                        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
                            <div className="mb-5 flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-zinc-800/60">
                                <Info className="h-4 w-4 text-indigo-500" />
                                <h2 className="text-sm font-semibold text-slate-900 dark:text-zinc-100">Basic Information</h2>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">
                                        Device Code <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.device_code}
                                        onChange={e => setData('device_code', e.target.value)}
                                        placeholder="e.g. ESP32-NODEMCU-01"
                                        className={`w-full rounded-xl border p-2.5 text-sm bg-transparent transition-all focus:outline-none focus:ring-2 ${errors.device_code
                                            ? 'border-rose-500 focus:ring-rose-500/20 text-rose-600'
                                            : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20 text-slate-900 dark:border-zinc-800 dark:text-zinc-100'
                                            }`}
                                    />
                                    {errors.device_code && (
                                        <p className="mt-1.5 text-xs text-rose-500 font-medium">{errors.device_code}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">
                                        Device Name <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.device_name}
                                        onChange={e => setData('device_name', e.target.value)}
                                        placeholder="e.g. Sensor IoT Lahan A"
                                        className={`w-full rounded-xl border p-2.5 text-sm bg-transparent transition-all focus:outline-none focus:ring-2 ${errors.device_name
                                            ? 'border-rose-500 focus:ring-rose-500/20 text-rose-600'
                                            : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20 text-slate-900 dark:border-zinc-800 dark:text-zinc-100'
                                            }`}
                                    />
                                    {errors.device_name && (
                                        <p className="mt-1.5 text-xs text-rose-500 font-medium">{errors.device_name}</p>
                                    )}
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">
                                        Description
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        placeholder="Tulis deskripsi atau catatan tambahan mengenai penugasan perangkat..."
                                        className="w-full rounded-xl border border-slate-200 bg-transparent p-2.5 text-sm text-slate-900 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-800 dark:text-zinc-100"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* SECTION BARU: Sensor Threshold Configuration */}
                        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
                            <div className="mb-5 flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-zinc-800/60">
                                <Sliders className="h-4 w-4 text-indigo-500" />
                                <h2 className="text-sm font-semibold text-slate-900 dark:text-zinc-100">Sensor Threshold Limits</h2>
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2">
                                {/* Kelembapan Tanah */}
                                <div className="rounded-xl border border-blue-100/80 bg-blue-50/10 p-4 dark:border-blue-950/40 dark:bg-blue-950/5">
                                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-3">
                                        <Droplets className="h-4 w-4" />
                                        <h3 className="text-xs font-bold uppercase tracking-wider">Soil Moisture Range (%)</h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-[11px] text-slate-400 mb-1">Min Value</label>
                                            <input
                                                type="number"
                                                step="any"
                                                value={data.sensor_threshold.min_soil_moisture}
                                                onChange={e => handleThresholdChange('min_soil_moisture', parseInt(e.target.value) || 0)}
                                                className="w-full rounded-lg border border-slate-200 bg-white p-2 text-sm dark:border-zinc-800 dark:bg-zinc-900"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] text-slate-400 mb-1">Max Value</label>
                                            <input
                                                type="number"
                                                step="any"
                                                value={data.sensor_threshold.max_soil_moisture}
                                                onChange={e => handleThresholdChange('max_soil_moisture', parseInt(e.target.value) || 0)}
                                                className="w-full rounded-lg border border-slate-200 bg-white p-2 text-sm dark:border-zinc-800 dark:bg-zinc-900"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Temperatur Tanah */}
                                <div className="rounded-xl border border-amber-100/80 bg-amber-50/10 p-4 dark:border-amber-950/40 dark:bg-amber-950/5">
                                    <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-3">
                                        <Thermometer className="h-4 w-4" />
                                        <h3 className="text-xs font-bold uppercase tracking-wider">Temperature Range (°C)</h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-[11px] text-slate-400 mb-1">Min Value</label>
                                            <input
                                                type="number"
                                                step="any"
                                                value={data.sensor_threshold.min_soil_temperature}
                                                onChange={e => handleThresholdChange('min_soil_temperature', parseInt(e.target.value) || 0)}
                                                className="w-full rounded-lg border border-slate-200 bg-white p-2 text-sm dark:border-zinc-800 dark:bg-zinc-900"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] text-slate-400 mb-1">Max Value</label>
                                            <input
                                                type="number"
                                                step="any"
                                                value={data.sensor_threshold.max_soil_temperature}
                                                onChange={e => handleThresholdChange('max_soil_temperature', parseInt(e.target.value) || 0)}
                                                className="w-full rounded-lg border border-slate-200 bg-white p-2 text-sm dark:border-zinc-800 dark:bg-zinc-900"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Default Relay State */}
                                {/* Default Relay State - Tri-State (NULL, TRUE, FALSE) */}
                                <div className="sm:col-span-2 flex flex-col gap-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/40 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <Zap className={`h-4 w-4 ${data.sensor_threshold.relay === true ? "text-emerald-500" :
                                                data.sensor_threshold.relay === false ? "text-rose-500" : "text-amber-500"
                                            }`} />
                                        <div>
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">Initial Relay State</h4>
                                            <p className="text-xs text-slate-400">Tentukan apakah relay dikontrol otomatis oleh batas sensor atau dipaksa manual.</p>
                                        </div>
                                    </div>

                                    {/* Segmented Button Group */}
                                    <div className="inline-flex rounded-xl bg-slate-200/70 p-1 dark:bg-zinc-800">
                                        {/* Button AUTO (null) */}
                                        <button
                                            type="button"
                                            onClick={() => handleThresholdChange('relay', null)}
                                            className={`rounded-lg px-4 py-1.5 text-xs font-semibold tracking-wide transition-all ${data.sensor_threshold.relay === null
                                                    ? 'bg-white text-amber-600 shadow-sm dark:bg-zinc-900 dark:text-amber-400'
                                                    : 'text-slate-500 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-200'
                                                }`}
                                        >
                                            AUTO
                                        </button>

                                        {/* Button ON (true) */}
                                        <button
                                            type="button"
                                            onClick={() => handleThresholdChange('relay', true)}
                                            className={`rounded-lg px-4 py-1.5 text-xs font-semibold tracking-wide transition-all ${data.sensor_threshold.relay === true
                                                    ? 'bg-white text-emerald-600 shadow-sm dark:bg-zinc-900 dark:text-emerald-400'
                                                    : 'text-slate-500 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-200'
                                                }`}
                                        >
                                            ON
                                        </button>

                                        {/* Button OFF (false) */}
                                        <button
                                            type="button"
                                            onClick={() => handleThresholdChange('relay', false)}
                                            className={`rounded-lg px-4 py-1.5 text-xs font-semibold tracking-wide transition-all ${data.sensor_threshold.relay === false
                                                    ? 'bg-white text-rose-600 shadow-sm dark:bg-zinc-900 dark:text-rose-400'
                                                    : 'text-slate-500 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-200'
                                                }`}
                                        >
                                            OFF
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Spesifikasi & Status */}
                        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
                            <div className="mb-5 flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-zinc-800/60">
                                <Sliders className="h-4 w-4 text-indigo-500" />
                                <h2 className="text-sm font-semibold text-slate-900 dark:text-zinc-100">Hardware & Deployment State</h2>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">
                                        Hardware Version
                                    </label>
                                    <input
                                        type="text"
                                        value={data.hardware_version}
                                        onChange={e => setData('hardware_version', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-transparent p-2.5 text-sm text-slate-900 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-800 dark:text-zinc-100"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">
                                        Firmware Version
                                    </label>
                                    <input
                                        type="text"
                                        value={data.firmware_version}
                                        onChange={e => setData('firmware_version', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-transparent p-2.5 text-sm text-slate-900 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-800 dark:text-zinc-100"
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">
                                        Device Activation State
                                    </label>
                                    <div className="flex flex-wrap gap-4 mt-1">
                                        <button
                                            type="button"
                                            onClick={() => setData('is_active', true)}
                                            className={`flex items-center gap-2 rounded-xl px-4 py-3 border text-sm font-medium transition-all ${data.is_active
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30'
                                                : 'border-slate-200 text-slate-500 dark:border-zinc-800 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/50'
                                                }`}
                                        >
                                            <span className={`h-2 w-2 rounded-full bg-emerald-500 ${data.is_active ? 'animate-pulse' : ''}`} />
                                            Active
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setData('is_active', false)}
                                            className={`flex items-center gap-2 rounded-xl px-4 py-3 border text-sm font-medium transition-all ${!data.is_active
                                                ? 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/30'
                                                : 'border-slate-200 text-slate-500 dark:border-zinc-800 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/50'
                                                }`}
                                        >
                                            <span className="h-2 w-2 rounded-full bg-rose-500" />
                                            Inactive
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 4: Geokode Lokasi */}
                        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
                            <div className="mb-5 flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-zinc-800/60">
                                <MapPin className="h-4 w-4 text-indigo-500" />
                                <h2 className="text-sm font-semibold text-slate-900 dark:text-zinc-100">Location Placement</h2>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-3">
                                <div className="sm:col-span-3">
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">
                                        Location Name
                                    </label>
                                    <input
                                        type="text"
                                        value={data.location_name}
                                        onChange={e => setData('location_name', e.target.value)}
                                        placeholder="e.g. Greenhouse Utama Blok B"
                                        className="w-full rounded-xl border border-slate-200 bg-transparent p-2.5 text-sm text-slate-900 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-800 dark:text-zinc-100"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">
                                        Latitude
                                    </label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={data.latitude}
                                        onChange={e => setData('latitude', e.target.value)}
                                        placeholder="e.g. -6.2088"
                                        className="w-full rounded-xl border border-slate-200 bg-transparent p-2.5 text-sm text-slate-900 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-800 dark:text-zinc-100"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">
                                        Longitude
                                    </label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={data.longitude}
                                        onChange={e => setData('longitude', e.target.value)}
                                        placeholder="e.g. 106.8456"
                                        className="w-full rounded-xl border border-slate-200 bg-transparent p-2.5 text-sm text-slate-900 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-800 dark:text-zinc-100"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Tombol Simpan / Aksi */}
                        <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-6 dark:border-zinc-800/60">
                            <Link
                                href="/device"
                                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 shadow-sm hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-600/10 transition hover:bg-indigo-500 disabled:opacity-50 active:scale-95 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                            >
                                <Save className="h-4 w-4" />
                                <span>{processing ? 'Saving...' : 'Save Device'}</span>
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </AppLayout>
    );
}