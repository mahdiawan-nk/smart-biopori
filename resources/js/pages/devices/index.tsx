import { Head, Link, router } from "@inertiajs/react";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { useState } from "react";
import {
    Cpu,
    MapPin,
    HardDrive,
    Binary,
    Droplets,
    Thermometer,
    Zap,
    Clock,
    Layers,
    Settings,
    Plus,
    Trash2,
    AlertTriangle
} from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Device',
        href: '/device',
    },
];

interface SensorThreshold {
    id: string;
    min_soil_moisture: number;
    max_soil_moisture: number;
    min_soil_temperature: number;
    max_soil_temperature: number;
    relay: boolean | null;
    restart_command: boolean;
}

interface Device {
    id: string;
    device_code: string;
    device_name: string;
    description?: string;
    location_name?: string;
    hardware_version?: string;
    firmware_version?: string;
    latitude?: number;
    longitude?: number;
    is_active: boolean;
    last_seen?: string | null;
    sensor_threshold?: SensorThreshold | null;
}

interface Pagination<T> {
    data: T[];
}

interface Props {
    devices: Pagination<Device>;
}

export default function Index({ devices }: Props) {
    // State untuk kontrol modal konfirmasi delete
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const openDeleteModal = (device: Device) => {
        setSelectedDevice(device);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setSelectedDevice(null);
        setIsDeleteModalOpen(false);
    };

    const handleDelete = () => {
        if (!selectedDevice) return;

        router.delete(`/device/${selectedDevice.id}`, {
            onBefore: () => setIsDeleting(true),
            onSuccess: () => {
                closeDeleteModal();
            },
            onFinish: () => setIsDeleting(false),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Device Monitoring" />

            <div className="min-h-screen bg-slate-50/50 p-4 transition-colors duration-300 dark:bg-zinc-950 sm:p-6 lg:p-8">
                <div className="mx-auto max-w-7xl">

                    {/* Header Section */}
                    <div className="relative mb-8 flex flex-col justify-between gap-4 border-b border-slate-100 pb-6 dark:border-zinc-800/80 sm:flex-row sm:items-center">
                        <div>
                            <div className="flex items-center gap-2.5">
                                <div className="rounded-xl bg-indigo-600/10 p-2 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                                    <Cpu className="h-6 w-6" />
                                </div>
                                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-50 sm:text-3xl">
                                    Device Monitoring
                                </h1>
                            </div>
                            <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">
                                Daftar perangkat IoT ESP32 yang terhubung ke sistem secara real-time.
                            </p>
                        </div>

                        <Link
                            href="/device/create"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-600/10 transition-all duration-200 hover:bg-indigo-500 hover:shadow-indigo-600/20 active:scale-95 dark:bg-indigo-500 dark:hover:bg-indigo-400 sm:w-auto"
                        >
                            <Plus className="h-4 w-4 stroke-[2.5]" />
                            <span>Add Device</span>
                        </Link>
                    </div>

                    {/* Grid Cards */}
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {devices.data.map((device) => (
                            <div
                                key={device.id}
                                className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-900 dark:hover:border-zinc-700/80"
                            >
                                {/* Header Perangkat */}
                                <div className="border-b border-slate-100 bg-slate-50/50 p-5 dark:border-zinc-800/50 dark:bg-zinc-900/50">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="space-y-1">
                                            <h2 className="font-semibold tracking-tight text-slate-800 dark:text-zinc-100 sm:text-lg">
                                                {device.device_name}
                                            </h2>
                                            <span className="inline-block rounded bg-slate-200/60 px-2 py-0.5 text-xs font-mono text-slate-600 dark:bg-zinc-800 dark:text-zinc-400">
                                                {device.device_code}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-1.5">
                                            <span
                                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${device.is_active
                                                    ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20"
                                                    : "bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/20"
                                                    }`}
                                            >
                                                <span className={`h-1.5 w-1.5 rounded-full ${device.is_active ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                                {device.is_active ? "Active" : "Inactive"}
                                            </span>

                                            {/* Tombol Pengaturan */}
                                            <Link
                                                href={`/device/${device.id}/edit`}
                                                className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 shadow-sm transition-all duration-200 hover:bg-slate-50 hover:text-indigo-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-indigo-400"
                                                title="Pengaturan Perangkat"
                                            >
                                                <Settings className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
                                            </Link>

                                            {/* Tombol Delete */}
                                            <button
                                                type="button"
                                                onClick={() => openDeleteModal(device)}
                                                className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-400 shadow-sm transition-all duration-200 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-500 dark:hover:bg-rose-950/30 dark:hover:border-rose-900/50 dark:hover:text-rose-400"
                                                title="Hapus Perangkat"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Konten / Body */}
                                <div className="space-y-5 p-5">
                                    {/* Lokasi */}
                                    <div className="flex items-center gap-2.5 text-sm">
                                        <MapPin className="h-4 w-4 text-slate-400 dark:text-zinc-500" />
                                        <div className="flex-1">
                                            <p className="text-xs text-slate-400 dark:text-zinc-500">Location</p>
                                            <p className="font-medium text-slate-700 dark:text-zinc-300">
                                                {device.location_name ?? "Not Assigned"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Spesifikasi Hardware & Firmware */}
                                    <div className="grid grid-cols-2 gap-4 rounded-xl bg-slate-50/50 p-3 dark:bg-zinc-900/40">
                                        <div className="flex items-center gap-2">
                                            <HardDrive className="h-4 w-4 text-slate-400 dark:text-zinc-500" />
                                            <div>
                                                <p className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-zinc-500">HW Ver</p>
                                                <p className="text-xs font-semibold text-slate-700 dark:text-zinc-300">{device.hardware_version ?? "-"}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Binary className="h-4 w-4 text-slate-400 dark:text-zinc-500" />
                                            <div>
                                                <p className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-zinc-500">FW Ver</p>
                                                <p className="text-xs font-semibold text-slate-700 dark:text-zinc-300">{device.firmware_version ?? "-"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Batas Sensor */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-3 transition-colors dark:border-blue-950/40 dark:bg-blue-950/20">
                                            <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                                                <Droplets className="h-4 w-4" />
                                                <p className="text-xs font-medium">Moisture Threshold</p>
                                            </div>
                                            <p className="mt-1.5 text-base font-bold text-blue-900 dark:text-blue-300">
                                                {device.sensor_threshold
                                                    ? `${device.sensor_threshold.min_soil_moisture} - ${device.sensor_threshold.max_soil_moisture}%`
                                                    : "-"}
                                            </p>
                                        </div>

                                        <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-3 transition-colors dark:border-amber-950/40 dark:bg-amber-950/20">
                                            <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                                                <Thermometer className="h-4 w-4" />
                                                <p className="text-xs font-medium">Temp Threshold</p>
                                            </div>
                                            <p className="mt-1.5 text-base font-bold text-amber-900 dark:text-amber-300">
                                                {device.sensor_threshold
                                                    ? `${device.sensor_threshold.min_soil_temperature} - ${device.sensor_threshold.max_soil_temperature}°C`
                                                    : "-"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Status Relay */}
                                    <div className="grid grid-cols-1 gap-4 border-t border-slate-100 pt-4 dark:border-zinc-800/60">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1.5">
                                                <Zap
                                                    className={`h-4 w-4 ${device.sensor_threshold?.relay === true
                                                        ? "text-emerald-500"
                                                        : device.sensor_threshold?.relay === false
                                                            ? "text-rose-500"
                                                            : "text-amber-500"
                                                        }`}
                                                />
                                                <span className="text-xs text-slate-500 dark:text-zinc-400">Relay Status</span>
                                            </div>

                                            <span
                                                className={`text-xs font-bold px-2 py-0.5 rounded-md ${device.sensor_threshold?.relay === true
                                                    ? "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10"
                                                    : device.sensor_threshold?.relay === false
                                                        ? "text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-500/10"
                                                        : "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/10"
                                                    }`}
                                            >
                                                {device.sensor_threshold?.relay === true
                                                    ? "MANUAL (ON)"
                                                    : device.sensor_threshold?.relay === false
                                                        ? "MANUAL (OFF)"
                                                        : "AUTO"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Footer Card: Last Seen */}
                                    <div className="flex items-center gap-2 border-t border-slate-100 pt-3 text-xs text-slate-400 dark:border-zinc-800/60 dark:text-zinc-500">
                                        <Clock className="h-3.5 w-3.5" />
                                        <span>Last Seen:</span>
                                        <span className="font-medium text-slate-600 dark:text-zinc-300">
                                            {device.last_seen ?? "Never"}
                                        </span>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {devices.data.length === 0 && (
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 py-20 text-center dark:border-zinc-800">
                            <Layers className="mb-4 h-10 w-10 text-slate-300 dark:text-zinc-700" />
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-zinc-100">Belum ada perangkat</h3>
                            <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">Hubungkan perangkat ESP32 baru Anda ke sistem.</p>
                            <Link
                                href="/device/create"
                                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                            >
                                <Plus className="h-4 w-4" />
                                Tambah Perangkat
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Konfirmasi Delete (Overlay) */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm dark:bg-zinc-950/60 animate-fade-in"
                        onClick={closeDeleteModal}
                    />

                    {/* Modal Content Box */}
                    <div className="relative w-full max-w-md scale-95 transform overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-xl transition-all dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="flex items-start gap-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
                                <AlertTriangle className="h-5 w-5" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-base font-bold text-slate-900 dark:text-zinc-50">
                                    Hapus Perangkat?
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-zinc-400">
                                    Apakah Anda yakin ingin menghapus perangkat <span className="font-semibold text-slate-800 dark:text-zinc-200">{selectedDevice?.device_name}</span> ({selectedDevice?.device_code})? Tindakan ini tidak dapat dibatalkan.
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-6 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                disabled={isDeleting}
                                onClick={closeDeleteModal}
                                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm hover:bg-slate-50 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                disabled={isDeleting}
                                onClick={handleDelete}
                                className="inline-flex items-center justify-center rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-rose-500 disabled:opacity-50 active:scale-95 dark:bg-rose-500 dark:hover:bg-rose-400"
                            >
                                {isDeleting ? "Menghapus..." : "Ya, Hapus Perangkat"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}