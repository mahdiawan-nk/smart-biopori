import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import {
    Droplets,
    Thermometer,
    TrendingUp,
} from "lucide-react";

// 1. Sesuaikan Interface dengan data riil dari backend controller
interface TrendDataPoint {
    time: string;
    soil_moisture: number | null;
    soil_temperature: number | null;
    air_temperature: number | null;
    humidity: number | null;
}

interface TrendChartProps {
    title?: string;
    description?: string;
    data: TrendDataPoint[];
}

export default function TrendChart({
    title = "Trend Sensor",
    description = "Monitoring suhu dan kelembapan tanah",
    data = [], // Berikan default array kosong agar tidak crash jika data belum load
}: TrendChartProps) {

    // 2. Kalkulasi rata-rata menggunakan properti baru (filter nilai null agar presisi)
    const validData = data.filter(d => d.soil_temperature !== null && d.soil_moisture !== null);

    // Mengambil item terakhir jika validData memiliki isi, jika tidak kembalikan null/0
    const lastData = validData.length ? validData.at(-1) : null;

    const lastTemp = lastData ? lastData.soil_temperature : 0;
    const lastMoisture = lastData ? lastData.soil_moisture : 0;

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">

            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-zinc-50">
                        {title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-zinc-400">
                        {description}
                    </p>
                </div>

                <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    <TrendingUp size={16} />
                    Live Data
                </div>
            </div>

            {/* Rekap Rata-rata dari data ter-render */}
            <div className="mb-6 grid gap-4 grid-cols-2 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-100 p-4 dark:border-zinc-800/60 bg-slate-50/50 dark:bg-zinc-900/40">
                    <div className="flex items-center gap-2">
                        <Thermometer size={18} className="text-rose-500" />
                        <span className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
                            Suhu Tanah Rata-rata
                        </span>
                    </div>
                    <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-800 dark:text-zinc-100">
                        {lastTemp?.toFixed(1)}°C
                    </h2>
                </div>

                <div className="rounded-2xl border border-slate-100 p-4 dark:border-zinc-800/60 bg-slate-50/50 dark:bg-zinc-900/40">
                    <div className="flex items-center gap-2">
                        <Droplets size={18} className="text-blue-500" />
                        <span className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
                            Kelembapan Rata-rata
                        </span>
                    </div>
                    <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-800 dark:text-zinc-100">
                        {lastMoisture?.toFixed(0)}%
                    </h2>
                </div>
            </div>

            {/* Container Grafik Area Recharts */}
            <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="temperatureGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25} />
                                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                            </linearGradient>

                            <linearGradient id="moistureGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-slate-200 dark:stroke-zinc-800" opacity={0.5} />

                        <XAxis
                            dataKey="time"
                            tickLine={false}
                            className="text-xs fill-slate-400 dark:fill-zinc-500"
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            className="text-xs fill-slate-400 dark:fill-zinc-500"
                        />

                        {/* Kustomisasi Tooltip agar mendukung tema gelap/terang */}
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgb(var(--background) / 0.8)',
                                borderRadius: '12px',
                                border: '1px solid rgb(var(--border))'
                            }}
                            className="rounded-xl shadow-lg border"
                        />

                        {/* 3. Sesuaikan dataKey dengan field response dari DashboardController */}
                        <Area
                            type="monotone"
                            dataKey="soil_temperature"
                            name="Suhu Tanah"
                            stroke="#f43f5e"
                            fill="url(#temperatureGradient)"
                            strokeWidth={3}
                            dot={false}
                        />

                        <Area
                            type="monotone"
                            dataKey="soil_moisture"
                            name="Kelembapan Tanah"
                            stroke="#3b82f6"
                            fill="url(#moistureGradient)"
                            strokeWidth={3}
                            dot={false}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Legend Indicators */}
            <div className="mt-6 flex items-center justify-center gap-8 border-t border-slate-100 pt-4 dark:border-zinc-800/60">
                <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-rose-500" />
                    <span className="text-xs font-medium text-slate-600 dark:text-zinc-400">Suhu Tanah (°C)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-blue-500" />
                    <span className="text-xs font-medium text-slate-600 dark:text-zinc-400">Kelembapan Tanah (%)</span>
                </div>
            </div>

        </div>
    );
}