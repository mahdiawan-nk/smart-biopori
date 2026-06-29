import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

// Define Interface Props untuk menerima deviceId dari luar
interface TemperatureGaugeProps {
    deviceId: string;
}

export default function TemperatureGauge({ deviceId }: TemperatureGaugeProps) {
    const [series, setSeries] = useState<number[]>([0]);
    const [minTemp, setMinTemp] = useState<number>(20);
    const [maxTemp, setMaxTemp] = useState<number>(30);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const [hasNoData, setHasNoData] = useState<boolean>(false); // State tambahan jika data kosong

    const SENSOR_MAX = 120;

    // Fetch data telemetry setiap 5 detik (Realtime sync)
    useEffect(() => {
        if (!deviceId) return;

        const fetchTemperature = async () => {
            try {
                const response = await fetch(`http://localhost:8801/api/dashboard?device_id=${deviceId}`);
                if (!response.ok) throw new Error();

                const json = await response.json();
                if (json.status === 'success') {
                    const latest = json.data?.latestData;

                    if (!latest) {
                        // Handle jika device terdaftar tapi belum memiliki log data telemetry sama sekali
                        setSeries([0]);
                        setHasNoData(true);
                        setError(false);
                    } else {
                        // Data tersedia secara normal
                        const currentTemp = latest.soil_temperature ?? 0;
                        setSeries([Math.min(currentTemp, SENSOR_MAX)]);

                        if (latest.min_temperature) setMinTemp(parseFloat(latest.min_temperature));
                        if (latest.max_temperature) setMaxTemp(parseFloat(latest.max_temperature));

                        setHasNoData(false);
                        setError(false);
                    }
                }
            } catch (err) {
                console.error("Gagal memperbarui Temperature Gauge");
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchTemperature();

        // Polling setiap 5 detik
        const interval = setInterval(fetchTemperature, 5000);
        return () => clearInterval(interval);
    }, [deviceId]);

    const currentVal = series[0];

    // Penentuan Text Status & Class Tailwind Dinamis Berdasarkan Batas API & Kondisi Data
    let statusText = 'Normal';
    let badgeColorClass = 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30';
    let dotColorClass = 'bg-emerald-400 shadow-[0_0_8px_#10b981]';
    let chartColor = '#10b981';

    if (loading && currentVal === 0 && !hasNoData) {
        statusText = 'Memuat...';
        badgeColorClass = 'text-slate-400 bg-slate-500/15 border-slate-500/30';
        dotColorClass = 'bg-slate-400 animate-pulse';
        chartColor = '#475569';
    } else if (error) {
        statusText = 'Error';
        badgeColorClass = 'text-amber-500 bg-amber-500/15 border-amber-500/30';
        dotColorClass = 'bg-amber-500';
        chartColor = '#f59e0b';
    } else if (hasNoData) {
        // Tampilan khusus jika latestData === null dari API
        statusText = 'No Data';
        badgeColorClass = 'text-slate-400 bg-slate-800/50 border-slate-700/50';
        dotColorClass = 'bg-slate-500';
        chartColor = '#334155'; // Warna track abu-abu gelap mati
    } else if (currentVal < minTemp) {
        statusText = 'Dingin';
        badgeColorClass = 'text-blue-400 bg-blue-500/15 border-blue-500/30';
        dotColorClass = 'bg-blue-400 shadow-[0_0_8px_#3b82f6]';
        chartColor = '#3b82f6';
    } else if (currentVal > maxTemp) {
        statusText = 'Panas';
        badgeColorClass = 'text-red-400 bg-red-500/15 border-red-500/30';
        dotColorClass = 'bg-red-400 shadow-[0_0_8px_#ef4444]';
        chartColor = '#ef4444';
    }

    const options: ApexOptions = {
        chart: {
            type: 'radialBar',
            sparkline: { enabled: true },
            animations: {
                enabled: true,
                dynamicAnimation: { enabled: true, speed: 600 },
            },
        },
        colors: [chartColor],
        plotOptions: {
            radialBar: {
                startAngle: -90,
                endAngle: 90,
                max: SENSOR_MAX,
                track: {
                    background: '#334155', // Slate 700
                    strokeWidth: '97%',
                    margin: 5,
                },
                dataLabels: {
                    name: { show: false },
                    value: {
                        offsetY: -10,
                        fontSize: '28px',
                        fontWeight: '800',
                        color: hasNoData ? '#64748b' : '#f8fafc', // Teks agak redup jika tidak ada data
                        fontFamily: 'Inter, sans-serif',
                        formatter: (val) => hasNoData ? '-- °C' : `${val}°C`, // Tampilkan '-- °C' jika data null
                    },
                },
            },
        },
        grid: { padding: { top: -10, bottom: -10 } },
        stroke: { lineCap: 'round' },
    };

    return (
        <div className="w-full rounded-[20px] border border-slate-800 bg-slate-900 p-6 flex flex-col items-center shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] font-sans">
            <h3 className="text-sm font-bold text-slate-50 tracking-[1.5px] m-0">SOIL TEMPERATURE</h3>
            <span className="text-[11px] font-medium text-slate-500 mt-1">Sensor Max: {SENSOR_MAX}°C</span>

            <div className={`h-[180px] mt-2.5 w-full transition-opacity duration-300 ${loading && currentVal === 0 && !hasNoData ? 'opacity-40' : 'opacity-100'}`}>
                <ReactApexChart options={options} series={series} type="radialBar" height={240} />
            </div>

            {/* Premium Badge Status */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide mt-4 border transition-all duration-500 ${badgeColorClass}`}>
                <span className={`w-2 h-2 rounded-full ${dotColorClass}`}></span>
                {statusText} {!hasNoData && `(${currentVal}°C)`}
            </div>

            {/* Grid Keterangan Batas Dinamis */}
            <div className="mt-6 grid grid-cols-3 gap-2 text-center text-xs w-full">
                <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400 border border-blue-500/10">
                    <div className="font-bold mb-0.5">Dingin</div>
                    <div className="text-slate-400">&lt; {minTemp}°C</div>
                </div>

                <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-400 border border-emerald-500/10">
                    <div className="font-bold mb-0.5">Normal</div>
                    <div className="text-slate-400">{minTemp}-{maxTemp}°C</div>
                </div>

                <div className="rounded-xl bg-red-500/10 p-3 text-red-400 border border-red-500/10">
                    <div className="font-bold mb-0.5">Panas</div>
                    <div className="text-slate-400">&gt; {maxTemp}°C</div>
                </div>
            </div>
        </div>
    );
}