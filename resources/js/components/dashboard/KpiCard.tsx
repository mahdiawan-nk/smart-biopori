import React from 'react';
import { Activity } from 'lucide-react';

// 1. Ekspor Interface agar bisa digunakan di file lain saat menyusun data
export interface KpiItemProps {
    title: string;
    value: string | number;
    subtext: string;
    status: 'normal' | 'warning' | 'danger' | 'info';
    icon: React.ReactNode;
}

interface KpiDashboardProps {
    title?: string;
    subtitle?: string;
    lastUpdate?: string;
    data: KpiItemProps[];
}

// 2. Komponen Sub-Item: KpiCard (Dibuat terpisah agar rapi)
export function KpiCard({ title, value, subtext, status, icon }: KpiItemProps) {
    // Menentukan skema warna berdasarkan status data
    const statusConfig = {
        normal: {
            card: 'border-emerald-500/20 bg-emerald-500/[0.02] text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.03)]',
            icon: 'bg-emerald-500/10 border-emerald-500/20 group-hover:bg-emerald-500/20',
            dot: 'bg-emerald-400'
        },
        warning: {
            card: 'border-amber-500/20 bg-amber-500/[0.02] text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.03)]',
            icon: 'bg-amber-500/10 border-amber-500/20 group-hover:bg-amber-500/20',
            dot: 'bg-amber-400'
        },
        danger: {
            card: 'border-red-500/20 bg-red-500/[0.02] text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.03)]',
            icon: 'bg-red-500/10 border-red-500/20 group-hover:bg-red-500/20',
            dot: 'bg-red-400'
        },
        info: {
            card: 'border-blue-500/20 bg-blue-500/[0.02] text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.03)]',
            icon: 'bg-blue-500/10 border-blue-500/20 group-hover:bg-blue-500/20',
            dot: 'bg-blue-400'
        }
    };

    const config = statusConfig[status] || statusConfig.info;

    return (
        <div className={`group relative rounded-2xl border bg-slate-900/60 p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:bg-slate-900 hover:border-slate-700/80 ${config.card}`}>
            {/* Top Layer: Title & Icon Badge */}
            <div className="flex items-center justify-between w-full mb-3">
                <span className="text-[11px] font-bold text-slate-400 tracking-widest uppercase font-mono">
                    {title}
                </span>
                <div className={`p-2 rounded-xl border transition-colors duration-300 ${config.icon}`}>
                    {icon}
                </div>
            </div>

            {/* Middle Layer: Main Value */}
            <div className="mb-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-50 tracking-tight block">
                    {value}
                </span>
            </div>

            {/* Bottom Layer: Dynamic Subtext Context */}
            <div className="flex items-center gap-1.5 mt-1">
                <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${config.dot}`} />
                <span className="text-xs font-medium text-slate-400 group-hover:text-slate-300 transition-colors">
                    {subtext}
                </span>
            </div>
        </div>
    );
}

// 3. Komponen Utama: KpiDashboard
export default function KpiDashboard({
    title = "REAL-TIME TELEMETRY OVERVIEW",
    subtitle = "Kondisi terkini modul sensor dan ekosistem budidaya",
    lastUpdate = "Just Now",
    data
}: KpiDashboardProps) {
    return (
        <div className="w-full bg-slate-950 p-4 sm:p-6 rounded-[24px] border border-slate-900 shadow-2xl">
            {/* Header Section Dashboard */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 border-b border-slate-800 pb-4">
                <div>
                    <h2 className="text-base sm:text-lg font-bold text-slate-50 tracking-wide flex items-center gap-2">
                        <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
                        {title}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
                </div>
                <div className="text-[11px] font-medium text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1 rounded-md self-start sm:self-auto">
                    Last Update: {lastUpdate}
                </div>
            </div>

            {/* Responsive Grid System */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                {data.map((item, index) => (
                    <KpiCard key={index} {...item} />
                ))}
            </div>
        </div>
    );
}