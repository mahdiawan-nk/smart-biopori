import AppLogoIcon from '@/components/app-logo-icon';
import { Link } from '@inertiajs/react';

interface AuthLayoutProps {
    children: React.ReactNode;
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: AuthLayoutProps) {
    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center p-4 md:p-10 overflow-hidden bg-[#0f172a]">

            {/* AMBIENT GLOW EFFECTS (Latar Belakang Premium) */}
            <div className="absolute top-[-10%] right-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-emerald-500/10 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-15%] left-[-10%] w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-cyan-500/5 rounded-full blur-[60px] md:blur-[100px] pointer-events-none" />

            {/* Grid Pattern Halus untuk Kesan Tech-IoT */}
            <div
                className="absolute inset-0 opacity-[0.02] pointer-events-none"
                style={{
                    backgroundImage: `radial-gradient(#10b981 1px, transparent 1px)`,
                    backgroundSize: '24px 24px'
                }}
            />

            {/* KONTEN UTAMA CONTAINER */}
            <div className="w-full max-w-md z-10 animate-fade-in">

                {/* KARTU GLASSMORPHISM PREMIUM */}
                <div className="bg-slate-900/40  px-6 py-8 md:p-10 rounded-2xl flex flex-col gap-6">

                    {/* AREA LOGO & TITLE HEADER */}
                    <div className="flex flex-col items-center gap-4">
                        <Link href={route('home')} className="flex flex-col items-center gap-2 group">
                            {/* Tempat Logo dengan Efek Glow saat di-hover */}
                            <div className="mb-1 flex h-11 w-11 items-center justify-center group-hover:border-emerald-500/50 shadow-inner transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                                <img
                                    src="/img/logo.png"
                                    alt="Logo BioMonitor"
                                    className="w-15 h-15 object-contain"

                                />
                            </div>
                            <span className="sr-only">Smart Biopori Dashboard</span>
                        </Link>

                        <div className="space-y-1.5 text-center">
                            {/* Judul dengan Gradasi Text Metalik */}
                            <h1 className="text-xl md:text-2xl font-bold tracking-tight bg-gradient-to-b from-slate-50 to-slate-200 bg-clip-text text-transparent">
                                {title}
                            </h1>
                            <p className="text-slate-400 text-center text-xs md:text-sm max-w-xs leading-relaxed mx-auto">
                                {description}
                            </p>
                        </div>
                    </div>

                    {/* Pembatas Garis Neon Redup */}
                    <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />

                    {/* TEMPAT FORM INPUT (CHILDREN) */}
                    <div className="w-full">
                        {children}
                    </div>
                </div>

            </div>
        </div>
    );
}