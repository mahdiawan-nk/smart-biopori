import React, { useState, useEffect } from 'react';
import { Power, Cpu, Sliders, RefreshCw } from 'lucide-react';

interface RelayControlProps {
    deviceId: string;
}

// Definisikan tipe untuk opsi relay control
type RelayOption = null | true | false;

export default function RelayControl({ deviceId }: RelayControlProps) {
    const [relayMode, setRelayMode] = useState<RelayOption>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [updating, setUpdating] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // 1. Ambil status awal relay dari API
    const fetchRelayStatus = async () => {
        if (!deviceId) return;
        try {
            const response = await fetch(`http://localhost:8801/api/dashboard?device_id=${deviceId}`);
            if (!response.ok) throw new Error('Gagal mengambil data dari server');

            const json = await response.json();
            if (json.status === 'success') {
                // Sesuai response API: json.data.relay_control
                setRelayMode(json.data?.relay_control ?? null);
                setError(null);
            }
        } catch (err: any) {
            console.error("Gagal mengambil status relay:", err);
            setError("Gagal memuat status");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchRelayStatus();

        // Sinkronisasi status setiap 10 detik
        const interval = setInterval(fetchRelayStatus, 10000);
        return () => clearInterval(interval);
    }, [deviceId]);

    // 2. Fungsi untuk mengirim perubahan status ke backend
    const handleModeChange = async (targetValue: RelayOption) => {
        if (!deviceId || updating) return;

        setUpdating(true);
        setError(null);

        const previousValue = relayMode;
        setRelayMode(targetValue);

        // Ambil token CSRF dari meta tag bawaan Laravel/Inertia HTML
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
            || (document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] ? decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)![1]) : '');

        try {
            const response = await fetch(`http://localhost:8801/api/relay/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken, // Masukkan token ke header
                },
                body: JSON.stringify({
                    device_id: deviceId,
                    relay_control: targetValue
                }),
            });

            if (!response.ok) throw new Error('Gagal memperbarui perangkat');

            const json = await response.json();
            if (json.status !== 'success') {
                throw new Error(json.message || 'Gagal memperbarui');
            }
        } catch (err: any) {
            console.error("Gagal update relay:", err);
            setError("Gagal menyimpan perubahan");
            setRelayMode(previousValue);
        } finally {
            setUpdating(false);
        }
    };

    // Helper styling kelas tombol aktif
    const getButtonClass = (isActive: boolean, activeColorClass: string) => {
        return `flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold font-mono tracking-wider border transition-all duration-300 ${isActive
            ? activeColorClass
            : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900 hover:border-slate-700'
            }`;
    };

    return (
        <div className="w-full rounded-[20px] border border-slate-800 bg-slate-900 p-6 flex flex-col shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] font-sans relative overflow-hidden">

            {/* Header Section */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <Power className={`w-4 h-4 ${relayMode === true ? 'text-emerald-400 animate-pulse' : 'text-slate-400'}`} />
                    <h3 className="text-sm font-bold text-slate-50 tracking-[1.5px] m-0">RELAY CONTROL ACTUATOR</h3>
                </div>
                {updating && (
                    <RefreshCw className="w-3.5 h-3.5 text-blue-400 animate-spin" />
                )}
            </div>
            <span className="text-[11px] font-medium text-slate-500 mb-5 block">
                Kontrol sakelar modul pompa / aerator secara otomatis atau manual
            </span>

            {/* Error Overlay / Banner kecil */}
            {error && (
                <div className="mb-4 text-center text-[11px] font-mono py-1.5 px-3 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400">
                    ⚠️ {error}
                </div>
            )}

            {/* Segmented Control Buttons Grid */}
            <div className={`flex flex-col sm:flex-row gap-3 w-full ${loading ? 'opacity-40 pointer-events-none' : ''}`}>

                {/* 1. Opsi AUTO (null) */}
                <button
                    type="button"
                    onClick={() => handleModeChange(null)}
                    disabled={updating}
                    className={getButtonClass(
                        relayMode === null,
                        'bg-blue-500/15 border-blue-500/40 text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.1)]'
                    )}
                >
                    <Cpu className="w-4 h-4" />
                    AUTO
                </button>

                {/* 2. Opsi MANUAL ON (true) */}
                <button
                    type="button"
                    onClick={() => handleModeChange(true)}
                    disabled={updating}
                    className={getButtonClass(
                        relayMode === true,
                        'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.1)]'
                    )}
                >
                    <Power className="w-4 h-4" />
                    MANUAL ON
                </button>

                {/* 3. Opsi MANUAL OFF (false) */}
                <button
                    type="button"
                    onClick={() => handleModeChange(false)}
                    disabled={updating}
                    className={getButtonClass(
                        relayMode === false,
                        'bg-red-500/15 border-red-500/40 text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.1)]'
                    )}
                >
                    <Sliders className="w-4 h-4" />
                    MANUAL OFF
                </button>

            </div>

            {/* Status Info Footer */}
            <div className="mt-5 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500">Current Strategy:</span>
                <span className={`font-bold uppercase ${relayMode === null ? 'text-blue-400' : relayMode === true ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                    {relayMode === null ? '🤖 Berdasarkan Sensor' : relayMode === true ? '⚡ Paksa Hidup' : '🛑 Paksa Mati'}
                </span>
            </div>
        </div>
    );
}