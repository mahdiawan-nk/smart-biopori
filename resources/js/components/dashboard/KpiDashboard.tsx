import React, { useState, useEffect } from 'react';
import { Thermometer, Droplets, Radio, Trees, Activity } from 'lucide-react';

interface KpiItemProps {
    title: string;
    value: string | number;
    subtext: string;
    status: 'normal' | 'warning' | 'danger' | 'info';
    icon: React.ReactNode;
}

interface KpiDashboardProps {
    deviceId: string;
}

export default function KpiDashboard({ deviceId }: KpiDashboardProps) {
    const [apiData, setApiData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!deviceId) return;

        const fetchTelemetry = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`http://localhost:8801/api/dashboard?device_id=${deviceId}`);
                if (!response.ok) {
                    throw new Error('Gagal mengambil data dari server');
                }
                const json = await response.json();
                if (json.status === 'success') {
                    setApiData(json.data);
                } else {
                    throw new Error(json.message || 'Terjadi kesalahan');
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTelemetry();

        // Auto-refresh data telemetry tiap 30 detik
        const interval = setInterval(fetchTelemetry, 30000);
        return () => clearInterval(interval);
    }, [deviceId]);

    // 4. Transformasi Data API ke Format Komponen KPI Card (Selalu mengembalikan 4 card)
    const getKpiCards = (): KpiItemProps[] => {
        const latestData = apiData?.latestData;
        const deviceStatus = apiData?.deviceStatus ?? 'OFFLINE';
        const isDeviceOnline = deviceStatus === 'ONLINE';

        // 1. Logika Status & Nilai Temperatur
        const hasTemp = latestData?.soil_temperature !== undefined && latestData?.soil_temperature !== null;
        const temp = hasTemp ? latestData.soil_temperature : '-';
        const minTemp = parseFloat(latestData?.min_temperature ?? "20.00");
        const maxTemp = parseFloat(latestData?.max_temperature ?? "30.00");

        let tempStatus: 'normal' | 'danger' | 'info' = 'info'; // 'info' (biru) sebagai default jika data tidak ada
        if (hasTemp) {
            tempStatus = (latestData.soil_temperature < minTemp || latestData.soil_temperature > maxTemp) ? 'danger' : 'normal';
        }

        // 2. Logika Status & Nilai Kelembaban
        const hasMoisture = latestData?.soil_moisture !== undefined && latestData?.soil_moisture !== null;
        const moisture = hasMoisture ? latestData.soil_moisture : '-';
        const minMoisture = parseFloat(latestData?.min_soil_moisture ?? "40.00");
        const maxMoisture = parseFloat(latestData?.max_soil_moisture ?? "80.00");

        let moistureStatus: 'normal' | 'warning' | 'danger' | 'info' = 'info';
        if (hasMoisture) {
            if (latestData.soil_moisture === 0) {
                moistureStatus = 'danger';
            } else if (latestData.soil_moisture < minMoisture) {
                moistureStatus = 'warning';
            } else {
                moistureStatus = 'normal';
            }
        }

        // 3. Logika Status Log Perangkat
        const currentStatus = latestData?.status ? latestData.status.toUpperCase() : 'NO DATA';
        let logStatus: 'normal' | 'warning' | 'info' = 'info';
        if (latestData?.status) {
            logStatus = latestData.status === 'abnormal' ? 'warning' : 'normal';
        }

        return [
            {
                title: 'SOIL TEMPERATURE',
                value: hasTemp ? `${temp} °C` : '-',
                subtext: latestData ? `Target: ${minTemp}°C - ${maxTemp}°C` : 'Menunggu data...',
                status: tempStatus,
                icon: <Thermometer className="w-3 h-3 sm:w-5 sm:h-5" />,
            },
            {
                title: 'SOIL MOISTURE',
                value: hasMoisture ? `${moisture} %` : '-',
                subtext: hasMoisture && latestData.soil_moisture === 0
                    ? 'Kritis (0% / Air Habis)'
                    : latestData ? `Target: ${minMoisture}% - ${maxMoisture}%` : 'Menunggu data...',
                status: moistureStatus,
                icon: <Droplets className="w-3 h-3 sm:w-5 sm:h-5" />,
            },
            {
                title: 'DEVICE STATUS',
                value: deviceStatus,
                subtext: latestData?.wifi_rssi ? `Signal: ${latestData.wifi_rssi} dBm` : 'Signal: - dBm',
                status: isDeviceOnline ? 'info' : 'danger',
                icon: <Radio className="w-3 h-3 sm:w-5 sm:h-5" />,
            },
            {
                title: 'STATUS LOG',
                value: currentStatus,
                subtext: latestData?.status === 'abnormal' ? 'Butuh Tindakan' : latestData?.status ? 'Sistem Aman' : 'Status tidak diketahui',
                status: logStatus,
                icon: <Trees className="w-3 h-3 sm:w-5 sm:h-5" />,
            },
        ];
    };

    const kpiCards = getKpiCards();

    return (
        <div className="w-full bg-slate-950 p-4 sm:p-6 rounded-[24px] border border-slate-900 shadow-2xl">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
                <div>
                    <h2 className="text-base sm:text-lg font-bold text-slate-50 tracking-wide flex items-center gap-2">
                        <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
                        REAL-TIME TELEMETRY OVERVIEW
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">Kondisi terkini modul sensor dan ekosistem budidaya</p>
                </div>

                <div className="text-[11px] font-medium text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-md self-start sm:self-auto font-mono">
                    Last Update: {apiData && !loading ? (apiData.latestData?.updated_at ?? 'Tidak ada data') : 'Memuat...'}
                </div>
            </div>

            {/* Error Indicator tetap muncul sebagai pemberitahuan kecil di atas grid jika terjadi masalah */}
            {error && (
                <div className="mb-4 p-3 text-sm text-red-400 border border-red-500/20 bg-red-500/[0.02] rounded-xl font-mono">
                    ⚠️ Gagal menyegarkan data: {error}
                </div>
            )}

            {/* Main Cards Grid - SEKARANG SELALU DI-RENDER */}
            <div className={`grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full ${loading && !apiData ? 'opacity-40 animate-pulse' : ''}`}>
                {kpiCards.map((item, index) => {
                    let statusClasses = '';
                    if (item.status === 'normal') {
                        statusClasses = 'border-emerald-500/20 bg-emerald-500/[0.02] text-emerald-400';
                    } else if (item.status === 'warning') {
                        statusClasses = 'border-amber-500/20 bg-amber-500/[0.02] text-amber-400';
                    } else if (item.status === 'danger') {
                        statusClasses = 'border-red-500/20 bg-red-500/[0.02] text-red-400';
                    } else {
                        statusClasses = 'border-blue-500/20 bg-blue-500/[0.02] text-blue-400';
                    }

                    return (
                        <div
                            key={index}
                            className={`group relative rounded-2xl border bg-slate-900/60 p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:bg-slate-900 hover:border-slate-700/80 ${statusClasses}`}
                        >
                            <div className="flex items-center justify-between w-full mb-3">
                                <span className="text-[8px] sm:text-[11px] font-bold text-slate-400 tracking-widest uppercase font-mono">
                                    {item.title}
                                </span>
                                <div className={`p-2 rounded-xl border transition-colors duration-300 ${item.status === 'normal' ? 'bg-emerald-500/10 border-emerald-500/20 group-hover:bg-emerald-500/20' :
                                    item.status === 'warning' ? 'bg-amber-500/10 border-amber-500/20 group-hover:bg-amber-500/20' :
                                        item.status === 'danger' ? 'bg-red-500/10 border-red-500/20 group-hover:bg-red-500/20' :
                                            'bg-blue-500/10 border-blue-500/20 group-hover:bg-blue-500/20'
                                    }`}>
                                    {item.icon}
                                </div>
                            </div>

                            <div className="mb-2">
                                <span className="text-base sm:text-3xl font-extrabold text-slate-50 tracking-tight block">
                                    {item.value}
                                </span>
                            </div>

                            <div className="flex items-center gap-1.5 mt-1">
                                <span className={`w-1.5 h-1.5 rounded-full ${loading ? 'animate-ping' : 'animate-pulse'} ${item.status === 'normal' ? 'bg-emerald-400' :
                                    item.status === 'warning' ? 'bg-amber-400' :
                                        item.status === 'danger' ? 'bg-red-400' : 'bg-blue-400'
                                    }`} />
                                <span className="text-[10px] sm:text-xs font-medium text-slate-400 group-hover:text-slate-300 transition-colors line-clamp-1">
                                    {item.subtext}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}