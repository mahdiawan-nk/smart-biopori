import { Head, router } from "@inertiajs/react";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { useState, useEffect } from "react";
import {
    Activity,
    Cpu,
    Calendar,
    Search,
    RefreshCw,
    SlidersHorizontal,
    Wifi,
    Battery,
    Droplets,
    Thermometer,
    ChevronLeft,
    ChevronRight
} from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Sensor Logs',
        href: '/sensor-log',
    },
];

interface Device {
    id: string;
    device_code: string;
    device_name: string;
}

interface SensorLog {
    id: number;
    device_id: string;
    soil_moisture: number | null;
    soil_temperature: number | null;
    air_temperature: number | null;
    humidity: number | null;
    battery_voltage: number | null;
    wifi_rssi: number | null;
    status: string | null;
    created_at: string;
    device?: Device;
}

interface PaginationLinks {
    url: string | null;
    label: string;
    active: boolean;
}

interface Pagination<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLinks[];
}

interface Props {
    sensorLogs: Pagination<SensorLog>;
    devices: Device[];
    filters: {
        search?: string;
        device_id?: string;
        start_date?: string;
        end_date?: string;
    };
}

export default function Index({ sensorLogs, devices, filters }: Props) {
    // State untuk nilai filter komponen input
    const [search, setSearch] = useState(filters.search || "");
    const [deviceId, setDeviceId] = useState(filters.device_id || "");
    const [startDate, setStartDate] = useState(filters.start_date || "");
    const [endDate, setEndDate] = useState(filters.end_date || "");
    const [isLoading, setIsLoading] = useState(false);

    // Fungsi untuk mengirimkan request filter ke server menggunakan Inertia router
    const handleFilter = (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        setIsLoading(true);
        router.get(
            '/sensor-logs',
            { search, device_id: deviceId, start_date: startDate, end_date: endDate },
            {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => setIsLoading(false),
            }
        );
    };

    // Reset semua parameter filter ke kondisi awal
    const handleReset = () => {
        setSearch("");
        setDeviceId("");
        setStartDate("");
        setEndDate("");

        setIsLoading(true);
        router.get('/sensor-logs', {}, { onFinish: () => setIsLoading(false) });
    };

    // Fungsi utilitas untuk memberikan warna badge berdasarkan status log
    const getStatusClass = (status: string | null) => {
        if (!status) return "bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300";
        const normalStatus = status.toLowerCase();
        if (normalStatus === "normal" || normalStatus === "safe") {
            return "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400";
        }
        if (normalStatus === "warning" || normalStatus === "alert") {
            return "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400";
        }
        return "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400";
    };

    // Fungsi utilitas untuk indikator sinyal RSSI Wifi
    const getWifiColor = (rssi: number | null) => {
        if (!rssi) return "text-slate-300";
        if (rssi >= -60) return "text-emerald-500";
        if (rssi >= -80) return "text-amber-500";
        return "text-rose-500";
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Sensor Logs History" />

            <div className="min-h-screen bg-slate-50/50 p-4 transition-colors duration-300 dark:bg-zinc-950 sm:p-6 lg:p-8">
                <div className="mx-auto max-w-7xl">

                    {/* Header Section */}
                    <div className="mb-6 border-b border-slate-100 pb-5 dark:border-zinc-800/80">
                        <div className="flex items-center gap-2.5">
                            <div className="rounded-xl bg-indigo-600/10 p-2 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                                <Activity className="h-6 w-6" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-50">
                                    Sensor Logs History
                                </h1>
                                <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
                                    Rekam medis data telemetry sensor dari seluruh node IoT ESP32 yang tersimpan di sistem.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Filter Panel / Panel Pencarian */}
                    <div className="mb-6 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
                        <form onSubmit={handleFilter} className="space-y-4">
                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-zinc-300">
                                <SlidersHorizontal className="h-4 w-4 text-indigo-500" />
                                <span>Filter & Optimization Engine</span>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                {/* Search Status */}
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Search Status</label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="e.g. Normal, Danger..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2 text-sm transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                                        />
                                    </div>
                                </div>

                                {/* Dropdown Device */}
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Select Device</label>
                                    <div className="relative">
                                        <Cpu className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                        <select
                                            value={deviceId}
                                            onChange={(e) => setDeviceId(e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2 text-sm transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                                        >
                                            <option value="">All Devices</option>
                                            {devices.map((device) => (
                                                <option key={device.id} value={device.id}>
                                                    {device.device_name} ({device.device_code})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Start Date */}
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Start Date</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2 text-sm transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                                        />
                                    </div>
                                </div>

                                {/* End Date */}
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1.5">End Date</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                        <input
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2 text-sm transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 dark:border-zinc-800/60">
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
                                >
                                    <RefreshCw className="h-3.5 w-3.5" />
                                    Reset
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-70 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                                >
                                    {isLoading ? "Loading..." : "Apply Filters"}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Table View */}
                    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-left text-sm">
                                <thead className="bg-slate-50/75 text-xs font-bold uppercase tracking-wider text-slate-500 dark:bg-zinc-900/50 dark:text-zinc-400 border-b border-slate-100 dark:border-zinc-800/50">
                                    <tr>
                                        <th className="p-4">Timestamp</th>
                                        <th className="p-4">Device Node</th>
                                        <th className="p-4"><div className="flex items-center gap-1"><Droplets className="h-3.5 w-3.5 text-blue-500" /> Soil Moisture</div></th>
                                        <th className="p-4"><div className="flex items-center gap-1"><Thermometer className="h-3.5 w-3.5 text-amber-500" /> Temp</div></th>
                                        <th className="p-4"><div className="flex items-center gap-1"><Wifi className="h-3.5 w-3.5" /> RSSI</div></th>
                                        <th className="p-4 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/50">
                                    {sensorLogs.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="p-8 text-center text-slate-400 dark:text-zinc-500">
                                                Tidak ditemukan rekaman log sensor yang sesuai dengan kriteria filter.
                                            </td>
                                        </tr>
                                    ) : (
                                        sensorLogs.data.map((log) => (
                                            <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-900/40 transition-colors">
                                                <td className="p-4 whitespace-nowrap font-medium text-slate-600 dark:text-zinc-300">
                                                    {log.created_at ? new Date(log.created_at).toLocaleString('id-ID') : '-'}
                                                </td>
                                                <td className="p-4 whitespace-nowrap">
                                                    <div className="font-semibold text-slate-800 dark:text-zinc-100">{log.device?.device_name ?? 'Unknown Device'}</div>
                                                    <div className="text-xs text-slate-400 font-mono">{log.device?.device_code ?? '-'}</div>
                                                </td>
                                                <td className="p-4 whitespace-nowrap font-bold text-blue-600 dark:text-blue-400">
                                                    {log.soil_moisture !== null ? `${log.soil_moisture}%` : '-'}
                                                </td>
                                                <td className="p-4 whitespace-nowrap font-bold text-amber-600 dark:text-amber-400">
                                                    {log.soil_temperature !== null ? `${log.soil_temperature}°C` : '-'}
                                                </td>
                                                <td className="p-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-1.5 font-semibold">
                                                        <Wifi className={`h-4 w-4 ${getWifiColor(log.wifi_rssi)}`} />
                                                        <span>{log.wifi_rssi ? `${log.wifi_rssi} dBm` : '-'}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 whitespace-nowrap text-center">
                                                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${getStatusClass(log.status)}`}>
                                                        {log.status ?? 'UNKNOWN'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Footer */}
                        {sensorLogs.data.length > 0 && (
                            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 p-4 dark:border-zinc-800/50 dark:bg-zinc-900/20">
                                <div className="text-xs text-slate-500 dark:text-zinc-400">
                                    Showing <span className="font-semibold text-slate-700 dark:text-zinc-300">{sensorLogs.data.length}</span> of{" "}
                                    <span className="font-semibold text-slate-700 dark:text-zinc-300">{sensorLogs.total}</span> data logs
                                </div>
                                <div className="flex items-center gap-1">
                                    {sensorLogs.links.map((link, idx) => {
                                        // Skip render jika tidak ada url dan bukan label text prev/next
                                        if (!link.url && link.label.includes('Previous') || link.label.includes('Next')) return null;

                                        const isPrev = link.label.includes('Previous');
                                        const isNext = link.label.includes('Next');

                                        return (
                                            <button
                                                key={idx}
                                                disabled={!link.url || isLoading}
                                                onClick={() => link.url && router.get(link.url, { search, device_id: deviceId, start_date: startDate, end_date: endDate }, { preserveState: true })}
                                                className={`inline-flex h-8 items-center justify-center rounded-lg border px-3 text-xs font-semibold transition shadow-sm disabled:opacity-40
                                                    ${link.active
                                                        ? "bg-indigo-600 border-indigo-600 text-white dark:bg-indigo-500 dark:border-indigo-500"
                                                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800"
                                                    }`}
                                            >
                                                {isPrev ? <ChevronLeft className="h-3.5 w-3.5" /> : isNext ? <ChevronRight className="h-3.5 w-3.5" /> : link.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}