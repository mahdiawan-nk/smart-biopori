import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

type DataPoint = [number, number];

interface PremiumTelemetryChartProps {
    deviceId: string;
}

const INTERVAL_MS = 5000;

export default function PremiumTelemetryChart({ deviceId }: PremiumTelemetryChartProps) {
    const [limit, setLimit] = useState<number>(10);
    const [isMobile, setIsMobile] = useState<boolean>(false);

    const [series, setSeries] = useState<any[]>([
        { name: 'Soil Temperature', data: [] },
        { name: 'Soil Moisture', data: [] }
    ]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 640);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const dynamicXAxisRange = (limit - 1) * INTERVAL_MS;

    const options: ApexOptions = {
        chart: {
            id: 'premium-telemetry-chart',
            height: isMobile ? 280 : 380,
            type: 'area',
            background: '#0f172a',
            foreColor: '#94a3b8',
            animations: {
                enabled: true,
                easing: 'linear',
                dynamicAnimation: {
                    speed: 800,
                },
            },
            toolbar: { show: false },
            zoom: { enabled: false },
        },
        colors: ['#10b981', '#06b6d4'],
        stroke: {
            curve: 'smooth',
            width: isMobile ? 2 : 3,
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.3,
                opacityTo: 0.01,
                stops: [0, 90, 100],
            },
        },
        grid: {
            borderColor: '#334155',
            strokeDashArray: 5,
            padding: {
                right: isMobile ? 10 : 20,
                left: isMobile ? 10 : 20
            }
        },
        title: {
            text: 'ENVIRONMENTAL TELEMETRY',
            align: 'left',
            style: {
                fontSize: isMobile ? '12px' : '14px',
                fontWeight: '700',
                fontFamily: 'Inter, sans-serif',
                color: '#f8fafc',
                letterSpacing: '1px'
            },
        },
        subtitle: {
            text: `Live: ${deviceId.slice(0, 8)}...`, // Diperpendek agar pas di lebar 390px
            style: {
                fontSize: isMobile ? '10px' : '12px',
                fontFamily: 'Inter, sans-serif',
                color: '#64748b'
            }
        },
        xaxis: {
            type: 'datetime',
            // range: dynamicXAxisRange,
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: {
                format: 'HH:mm:ss',
                rotate: isMobile ? -30 : 0,
                style: {
                    colors: '#64748b',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: isMobile ? '10px' : '11px'
                }
            }
        },
        yaxis: [
            {
                // PERBAIKAN: Objek 'title' tetap ada, tapi teksnya dikosongkan '' jika mobile
                title: {
                    text: isMobile ? '' : 'Temperature (°C)',
                    style: { color: '#10b981', fontWeight: 600 }
                },
                labels: {
                    style: { colors: '#10b981', fontSize: isMobile ? '10px' : '11px' },
                    formatter: (val) => `${val.toFixed(1)}°C`
                },
            },
            {
                opposite: true,
                // PERBAIKAN: Objek 'title' tetap ada, tapi teksnya dikosongkan '' jika mobile
                title: {
                    text: isMobile ? '' : 'Moisture (%)',
                    style: { color: '#06b6d4', fontWeight: 600 }
                },
                labels: {
                    style: { colors: '#06b6d4', fontSize: isMobile ? '10px' : '11px' },
                    formatter: (val) => `${val.toFixed(0)}%`
                },
            }
        ],
        legend: {
            position: isMobile ? 'bottom' : 'top',
            horizontalAlign: isMobile ? 'center' : 'right',
            fontFamily: 'Inter, sans-serif',
            fontSize: isMobile ? '11px' : '12px',
            fontWeight: 500,
            markers: { radius: 12 },
            itemMargin: { horizontal: 10, vertical: isMobile ? 5 : 0 }
        },
        tooltip: {
            theme: 'dark',
            shared: true,
            intersect: false,
            x: { format: 'HH:mm:ss' },
            style: { fontFamily: 'Inter, sans-serif' }
        },
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`https://smartbiopori.com/api/trend-data/${deviceId}?limit=${limit}`);
                if (!response.ok) throw new Error('Network response was not ok');

                const result = await response.json();
                const rawData = result.data || [];

                const parsedTemp: DataPoint[] = [];
                const parsedMoisture: DataPoint[] = [];

                rawData.forEach((item: any) => {
                    const newTemp = Number(item.soil_temperature);
                    const newMoisture = Number(item.soil_moisture);

                    if (isNaN(newTemp) || isNaN(newMoisture)) return;

                    // Langsung parsing string ISO dari API ke format Unix Timestamp (milidetik)
                    const timestamp = new Date(item.time).getTime();

                    // Validasi jika terjadi error parsing waktu
                    if (isNaN(timestamp)) return;

                    // unshift digunakan agar data paling lama ada di kiri, dan data terbaru muncul di kanan grafik
                    parsedTemp.unshift([timestamp, newTemp]);
                    parsedMoisture.unshift([timestamp, newMoisture]);
                });

                const updatedSeries = [
                    { name: 'Soil Temperature', data: parsedTemp },
                    { name: 'Soil Moisture', data: parsedMoisture }
                ];

                setSeries(updatedSeries);

                if (typeof window !== 'undefined' && (window as any).ApexCharts) {
                    (window as any).ApexCharts.exec('premium-telemetry-chart', 'updateSeries', updatedSeries);
                }
            } catch (error) {
                console.error("Failed fetching telemetry data:", error);
            }
        };

        fetchData();
        const interval = window.setInterval(fetchData, INTERVAL_MS);
        return () => window.clearInterval(interval);
    }, [deviceId, limit]);

    return (
        <div style={{
            background: '#0f172a',
            padding: isMobile ? '16px 10px' : '24px',
            borderRadius: '16px',
            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.3), 0 8px 10px -6px rgb(0 0 0 / 0.3)',
            border: '1px solid #1e293b',
            width: '100%',
            boxSizing: 'border-box'
        }}>
            <div style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? '8px' : '0px',
                justifyContent: 'space-between',
                alignItems: isMobile ? 'flex-start' : 'center',
                marginBottom: '16px'
            }}>
                <span style={{ color: '#f8fafc', fontWeight: 600, fontSize: '11px', fontFamily: 'Inter', letterSpacing: '0.5px' }}>
                    SHOW HISTORY LIMIT
                </span>
                <select
                    value={limit}
                    onChange={(e) => setLimit(Number(e.target.value))}
                    style={{
                        background: '#1e293b',
                        color: '#f8fafc',
                        border: '1px solid #334155',
                        borderRadius: '6px',
                        padding: '6px 10px',
                        fontSize: '12px',
                        outline: 'none',
                        cursor: 'pointer',
                        width: isMobile ? '100%' : 'auto'
                    }}
                >
                    <option value={5}>5 Data Terakhir</option>
                    <option value={10}>10 Data Terakhir</option>
                    <option value={20}>20 Data Terakhir</option>
                    <option value={50}>50 Data Terakhir</option>
                </select>
            </div>

            <ReactApexChart
                options={options}
                series={series}
                type="area"
                height={options.chart?.height}
            />
        </div>
    );
}