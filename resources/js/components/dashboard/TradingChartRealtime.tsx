import React, { useEffect, useRef } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

type DataPoint = [number, number];

interface PremiumTelemetryChartProps {
    deviceId: string; // UUID device dari tab yang dipilih
}

const INTERVAL_MS = 5000;
const XAXISRANGE = 12 * INTERVAL_MS; // Menampilkan data 1 menit ke belakang

export default function PremiumTelemetryChart({ deviceId }: PremiumTelemetryChartProps) {
    // Menggunakan useRef untuk menyimpan data agar tidak memicu re-render massal React
    // dan aman saat deviceId berubah (bisa langsung di-reset)
    const chartDataRef = useRef<{ temperature: DataPoint[]; moisture: DataPoint[] }>({
        temperature: [],
        moisture: []
    });

    // 1. Premium UI Theme Configuration
    const options: ApexOptions = {
        chart: {
            id: 'premium-telemetry-chart',
            height: 380,
            type: 'area',
            background: '#0f172a', // Slate 900
            foreColor: '#94a3b8',  // Slate 400
            animations: {
                enabled: true,
                easing: 'linear',
                dynamicAnimation: {
                    speed: 1000,
                },
            },
            toolbar: { show: false },
            zoom: { enabled: false },
        },
        colors: ['#10b981', '#06b6d4'], // Emerald Green & Cyan Blue
        stroke: {
            curve: 'smooth',
            width: 3,
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.35,
                opacityTo: 0.02,
                stops: [0, 90, 100],
            },
        },
        grid: {
            borderColor: '#334155', // Slate 700
            strokeDashArray: 5,
            padding: { right: 20, left: 20 }
        },
        title: {
            text: 'ENVIRONMENTAL TELEMETRY',
            align: 'left',
            style: {
                fontSize: '14px',
                fontWeight: '700',
                fontFamily: 'Inter, sans-serif',
                color: '#f8fafc', // Slate 50
                letterSpacing: '1px'
            },
        },
        subtitle: {
            text: `Live updates from IoT node: ${deviceId.slice(0, 8)}...`,
            style: {
                fontSize: '12px',
                fontFamily: 'Inter, sans-serif',
                color: '#64748b' // Slate 500
            }
        },
        xaxis: {
            type: 'datetime',
            range: XAXISRANGE,
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: {
                style: { colors: '#64748b', fontFamily: 'Inter, sans-serif' }
            }
        },
        yaxis: [
            {
                title: {
                    text: 'Temperature (°C)',
                    style: { color: '#10b981', fontWeight: 600 }
                },
                labels: {
                    style: { colors: '#10b981' },
                    formatter: (val) => `${val.toFixed(1)}°C`
                },
            },
            {
                opposite: true,
                title: {
                    text: 'Moisture (%)',
                    style: { color: '#06b6d4', fontWeight: 600 }
                },
                labels: {
                    style: { colors: '#06b6d4' },
                    formatter: (val) => `${val.toFixed(0)}%`
                },
            }
        ],
        legend: {
            position: 'top',
            horizontalAlign: 'right',
            fontFamily: 'Inter, sans-serif',
            fontSize: '12px',
            fontWeight: 500,
            markers: { radius: 12 },
            itemMargin: { horizontal: 15 }
        },
        tooltip: {
            theme: 'dark',
            shared: true,
            intersect: false,
            x: { format: 'HH:mm:ss' },
            style: { fontFamily: 'Inter, sans-serif' }
        },
    };

    // Data awal kosong saat pertama kali di-mount / ganti device
    const series = [
        { name: 'Soil Temperature', data: chartDataRef.current.temperature },
        { name: 'Soil Moisture', data: chartDataRef.current.moisture }
    ];

    // 2. Efek Fetching Data Berdasarkan deviceId & Interval
    useEffect(() => {
        // Reset data grafik jika tab deviceId berubah
        chartDataRef.current = { temperature: [], moisture: [] };

        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:8801/api/trend-data/${deviceId}`);
                if (!response.ok) throw new Error('Network response was not ok');

                const result = await response.json();

                // Menggunakan timestamp browser saat ini agar plotting datetime ApexCharts sinkron secara real-time
                const currentTime = new Date().getTime();

                const newTemp = Number(result.soil_temperature);
                const newMoisture = Number(result.soil_moisture);

                // Masukkan data baru ke dalam ref
                chartDataRef.current.temperature.push([currentTime, newTemp]);
                chartDataRef.current.moisture.push([currentTime, newMoisture]);

                // Batasi kapasitas array agar memori browser tidak jebol (menyimpan maks 50 data terakhir)
                if (chartDataRef.current.temperature.length > 50) {
                    chartDataRef.current.temperature.shift();
                    chartDataRef.current.moisture.shift();
                }

                // Push update langsung ke internal instance ApexCharts tanpa re-render komponen React
                if (typeof window !== 'undefined' && (window as any).ApexCharts) {
                    (window as any).ApexCharts.exec('premium-telemetry-chart', 'updateSeries', [
                        { data: chartDataRef.current.temperature },
                        { data: chartDataRef.current.moisture }
                    ]);
                }
            } catch (error) {
                console.error("Failed fetching telemetry data:", error);
            }
        };

        // Jalankan langsung saat pertama kali di-mount/diubah
        fetchData();

        // Set interval pooling setiap 5 detik
        const interval = window.setInterval(fetchData, INTERVAL_MS);

        return () => window.clearInterval(interval);
    }, [deviceId]); // Memicu ulang effect jika deviceId pada tab berubah

    return (
        <div style={{
            background: '#0f172a',
            padding: '24px',
            borderRadius: '16px',
            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.3), 0 8px 10px -6px rgb(0 0 0 / 0.3)',
            border: '1px solid #1e293b'
        }}>
            <ReactApexChart
                options={options}
                series={series}
                type="area"
                height={380}
            />
        </div>
    );
}