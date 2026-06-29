import React from 'react';
import { Cpu } from 'lucide-react'; // Menggunakan lucide-react untuk icon microchip/ESP

// Menggunakan interface Device yang sudah kita buat sebelumnya
interface Device {
    id: string;
    device_code: string;
    device_name: string;
    is_active: boolean;
}

interface DeviceTabsProps {
    devices: Device[];
    selectedId: string;
    onSelectDevice: (id: string) => void;
}

export default function DeviceTabs({ devices, selectedId, onSelectDevice }: DeviceTabsProps) {
    return (
        <div className="w-full bg-slate-950 p-2 rounded-2xl border border-slate-900 shadow-xl">
            {/* Label atau Header Kecil untuk Komponen Tab */}
            <div className="px-3 pt-2 pb-3">
                <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase font-mono block">
                    Pilih Node / Perangkat ({devices.length})
                </span>
            </div>

            {/* Container List Tab dengan Scroll otomatis di HP jika menu kepanjangan */}
            <div className="flex flex-row gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
                {devices.map((device) => {
                    const isSelected = device.id === selectedId;

                    return (
                        <button
                            key={device.id}
                            onClick={() => onSelectDevice(device.id)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all duration-300 min-w-[160px] sm:min-w-[200px] flex-1 group outline-none
                                ${isSelected
                                    ? 'bg-slate-900 border-emerald-500/30 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.05)]'
                                    : 'bg-slate-900/40 border-slate-900 text-slate-400 hover:bg-slate-900/80 hover:border-slate-800 hover:text-slate-200'
                                }
                            `}
                        >
                            {/* Icon Badge */}
                            <div className={`p-2 rounded-lg border transition-all duration-300
                                ${isSelected
                                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                    : 'bg-slate-950 border-slate-800 text-slate-500 group-hover:text-slate-400'
                                }
                            `}>
                                <Cpu className={`w-4 h-4 ${isSelected ? 'animate-pulse' : ''}`} />
                            </div>

                            {/* Device Info */}
                            <div className="flex flex-col truncate">
                                <span className={`text-xs font-bold font-mono tracking-wider ${isSelected ? 'text-slate-200' : 'text-slate-400 group-hover:text-slate-300'}`}>
                                    {device.device_name}
                                </span>
                                <span className="text-[10px] text-slate-500 mt-0.5 font-mono">
                                    {device.device_code}
                                </span>
                            </div>

                            {/* Active Dot Indicator (Menandakan modul hardware menyala/is_active) */}
                            {device.is_active && (
                                <span className="ml-auto flex h-2 w-2 relative">
                                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isSelected ? 'bg-emerald-400' : 'bg-slate-600'}`}></span>
                                    <span className={`relative inline-flex rounded-full h-2 w-2 ${isSelected ? 'bg-emerald-500' : 'bg-slate-500'}`}></span>
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}