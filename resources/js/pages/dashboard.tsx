import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from "react";
import PremiumTelemetryChart from '@/components/dashboard/PremiumTelemetryChart';
import TemperatureGauge from '@/components/dashboard/TemperatureGauge';
import MoistureGauge from '@/components/dashboard/MoistureGauge';
import KpiDashboard from '@/components/dashboard/KpiDashboard';
import { api, ApiError } from '@/lib/api';
import DeviceTabs from '@/components/dashboard/DeviceTabs';
import RelayControl from '@/components/dashboard/RelayControl'; // Import dipastikan aman
import { Device } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [listDevice, setListDevices] = useState<Device[]>([]);
    const [selectedId, setSelectedId] = useState<string>('');

    const handleDeviceChange = (id: string) => {
        setSelectedId(id);
        console.log("Berpindah ke Device ID:", id);
    };

    async function loadDevicesList() {
        try {
            const response = await api.get<Device[]>('/api/devices');

            if (response && response.length > 0) {
                setListDevices(response);
                setSelectedId(response[0].id);
            }
        } catch (error) {
            if (error instanceof ApiError) {
                console.error(`Error ${error.status}:`, error.info);
            } else {
                console.error('Unexpected error:', error);
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadDevicesList();
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Realtime IoT Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4 lg:p-6 bg-slate-50/50 dark:bg-zinc-950">
                {/* 1. Tampilkan Tab List Device */}
                <DeviceTabs
                    devices={listDevice}
                    selectedId={selectedId}
                    onSelectDevice={handleDeviceChange}
                />

                {/* 2. KPI Cards Overview */}
                {selectedId ? (
                    <KpiDashboard deviceId={selectedId} />
                ) : (
                    <div className="py-8 text-center text-sm text-slate-400 bg-slate-950 rounded-[24px] border border-slate-900">
                        {loading ? 'Memuat konfigurasi KPI...' : 'Menunggu pilihan device aktif'}
                    </div>
                )}
                {selectedId ? (
                    <RelayControl deviceId={selectedId} />
                ) : (
                    <div className="h-[380px] flex items-center justify-center bg-slate-900 rounded-2xl border border-slate-800 text-slate-400">
                        {loading ? 'Memuat data device...' : 'Tidak ada device aktif'}
                    </div>
                )}

                {/* 3. Grafik Tren Historis Linear */}
                {selectedId ? (

                    <PremiumTelemetryChart deviceId={selectedId} />
                ) : (
                    <div className="h-[380px] flex items-center justify-center bg-slate-900 rounded-2xl border border-slate-800 text-slate-400">
                        {loading ? 'Memuat data device...' : 'Tidak ada device aktif'}
                    </div>
                )}

                {/* 4. Grid Instrumen: Temperature Gauge, Moisture Gauge, dan Relay Actuator Control */}
                {selectedId ? (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 w-full auto-rows-min'>
                        <TemperatureGauge deviceId={selectedId} />
                        <MoistureGauge deviceId={selectedId} />

                    </div>
                ) : (
                    <div className="py-6 text-center text-xs text-slate-500 font-mono">
                        Menunggu pemilihan modul untuk memuat aktuator sakelar...
                    </div>
                )}
            </div>
        </AppLayout>
    );
}