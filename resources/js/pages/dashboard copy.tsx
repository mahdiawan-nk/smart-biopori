import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import KpiCard from "@/components/dashboard/KpiCard";
import MoistureGaugeCard from '@/components/dashboard/MoistureGaugeCard';
import TemperatureGaugeCard from '@/components/dashboard/TemperatureGaugeCard';
import TrendCard from '@/components/dashboard/TrendCard';
import { Thermometer, Droplets, Activity, Wifi, Cpu, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface Device {
    id: string;
    device_code: string;
    device_name: string;
    is_active: boolean;
}

interface LatestData {
    soil_moisture: number | null;
    soil_temperature: number | null;
    air_temperature: number | null;
    humidity: number | null;
    battery_voltage: number | null;
    wifi_rssi: number | null;
    status: string;
    updated_at: string;
    min_soil_moisture: number | null;
    max_soil_moisture: number | null;
    min_temperature: number | null;
    max_temperature: number | null;
}

interface TrendDataPoint {
    time: string;
    soil_moisture: number | null;
    soil_temperature: number | null;
    air_temperature: number | null;
    humidity: number | null;
}

interface Props {
    devices: Device[];
    selectedDeviceId: string | null;
    deviceStatus: 'ONLINE' | 'OFFLINE';
    latestData: LatestData | null;
    trendData: TrendDataPoint[];
}

export default function Dashboard({ devices, selectedDeviceId, deviceStatus, latestData, trendData }: Props) {
    const [isPolling, setIsPolling] = useState(false);

    // Engine Polling Otomatis: Tarik data terbaru dari backend setiap 5 detik tanpa reload halaman penuh
    useEffect(() => {
        if (!selectedDeviceId) return;

        const interval = setInterval(() => {
            setIsPolling(true);
            router.reload({
                only: ['latestData', 'deviceStatus', 'trendData'],
                preserveScroll: true,
                preserveState: true,
                onFinish: () => setIsPolling(false)
            });
        }, 5000); // Batas aman interval hardware telemetry log

        return () => clearInterval(interval);
    }, [selectedDeviceId]);

    // Handle saat user mengganti device via dropdown select
    const handleDeviceChange = (id: string) => {
        router.get('/dashboard', { device_id: id }, {
            preserveScroll: true,
            preserveState: false
        });
    };

    // Mapping ulang data KPI Card agar terikat dinamis dengan properti controller
    const kpiData = [
        {
            title: "Suhu Udara / Tanah",
            value: latestData?.soil_temperature !== null
                ? `${latestData?.air_temperature ?? '-'}°C / ${latestData?.soil_temperature ?? '-'}°C`
                : "-",
            trend: latestData?.humidity ? `${latestData.humidity}% RH` : "No Data",
            status: "Ambient & Soil",
            icon: Thermometer,
            color: "bg-gradient-to-r from-amber-500 to-orange-500", // Ditulis utuh
        },
        {
            title: "Kelembapan Tanah",
            value: latestData?.soil_moisture !== null ? `${latestData?.soil_moisture}%` : "-",
            trend: latestData?.battery_voltage ? `${latestData.battery_voltage}V` : "Battery -",
            status: "Soil Moisture",
            icon: Droplets,
            color: "bg-gradient-to-r from-blue-500 to-cyan-500", // Ditulis utuh
        },
        {
            title: "Status Log",
            value: latestData?.status ?? "UNKNOWN",
            trend: "Kondisi Lahan",
            status: latestData?.status?.toLowerCase() === 'normal' ? 'Healthy' : 'Check Log',
            icon: Activity,
            color: latestData?.status?.toLowerCase() === 'normal'
                ? "bg-gradient-to-r from-emerald-500 to-green-500"
                : "bg-gradient-to-r from-rose-500 to-red-500", // Ditulis utuh
        },
        {
            title: "Status Node Device",
            value: deviceStatus,
            trend: latestData?.wifi_rssi ? `${latestData.wifi_rssi} dBm` : "No Sinyal",
            status: "Connectivity",
            icon: Wifi,
            color: deviceStatus === 'ONLINE'
                ? "bg-gradient-to-r from-violet-500 to-indigo-500"
                : "bg-gradient-to-r from-slate-500 to-zinc-500", // Ditulis utuh
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Realtime IoT Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4 lg:p-6 bg-slate-50/50 dark:bg-zinc-950">

                {/* Control Panel Header: Dropdown Device Switcher & Engine Live Status */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-600/10 text-indigo-600 rounded-xl dark:bg-indigo-500/10 dark:text-indigo-400">
                            <Cpu className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-slate-900 dark:text-zinc-50">Monitoring Node Controller</h2>
                            <p className="text-xs text-slate-400 dark:text-zinc-500">
                                {latestData ? `Last sync update: ${latestData.updated_at}` : 'Belum ada telemetri masuk'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5 w-full sm:w-auto">
                        {isPolling && (
                            <RefreshCw className="h-4 w-4 text-indigo-500 animate-spin hidden sm:block" />
                        )}
                        <select
                            value={selectedDeviceId || ""}
                            onChange={(e) => handleDeviceChange(e.target.value)}
                            className="w-full sm:w-64 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
                        >
                            <option value="" disabled>-- Pilih Node Device --</option>
                            {devices.map((device) => (
                                <option key={device.id} value={device.id}>
                                    {device.device_name} ({device.device_code}) {!device.is_active && '[Nonaktif]'}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Grid 1: KPI Statistic Cards */}
                <div className="grid auto-rows-min gap-4 grid-cols-2 md:grid-cols-4">
                    {kpiData.map((item, index) => (
                        <KpiCard key={index} {...item} />
                    ))}
                </div>
                {/* Grid 3: Historical Trend Analytics Chart */}
                <TrendCard
                    title="Trend Analisis Sensor 24 Jam"
                    description="Fluktuasi grafik rata-rata parameter sensor per jam yang direkam server"
                    data={trendData}
                />
                {/* Grid 2: Gauges Visualizer */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                    <MoistureGaugeCard
                        value={latestData?.soil_moisture ?? 0}
                        sensorMax={120}
                        minThreshold={latestData?.min_soil_moisture ?? 20}
                        maxThreshold={latestData?.max_soil_moisture ?? 35}
                    />

                    <TemperatureGaugeCard
                        value={latestData?.soil_temperature ?? 0}
                        sensorMax={100}
                        minThreshold={latestData?.min_temperature ?? 20}
                        maxThreshold={latestData?.max_temperature ?? 35}
                    />
                </div>


            </div>
        </AppLayout>
    );
}