import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import React from 'react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            <section className="relative w-full min-h-screen bg-[radial-gradient(circle_at_80%_20%,#064e3b_0%,#0f172a_60%)] flex items-center justify-center p-5 md:p-10 overflow-hidden font-sans">
                
                {/* Ornamen Grafis Latar Belakang (Cyber-Organic Nodes) */}
                <div className="absolute top-1/4 left-[10%] w-[120px] md:w-[250px] h-[120px] md:h-[250px] bg-emerald-500/10 rounded-full blur-[40px] pointer-events-none" />
                <div className="absolute bottom-[15%] right-[15%] w-[180px] md:w-[350px] h-[180px] md:h-[350px] bg-cyan-500/5 rounded-full blur-[60px] pointer-events-none" />

                {/* Kontainer Utama */}
                <div className="max-w-[1200px] w-full grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-10 md:gap-[60px] items-center z-10">

                    {/* Kolom Kiri: Branding & Value Proposition */}
                    <div className="text-center md:text-left animate-fade-in-left">
                        {/* Badge Kecil */}
                        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full mb-5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                            <span className="text-emerald-400 text-xs font-semibold tracking-wider">
                                NEXT-GEN AGROTECH IoT
                            </span>
                        </div>

                        {/* Judul Utama */}
                        <h1 className="text-[#f8fafc] text-3xl md:text-5xl lg:text-[54px] font-extrabold leading-[1.15] tracking-tight mb-5">
                            Smart{' '}
                            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                                Biopori
                            </span>{' '}
                            <br />
                            Monitoring System
                        </h1>

                        {/* Deskripsi */}
                        <p className="text-slate-400 text-sm md:text-lg leading-relaxed max-w-[540px] mx-auto md:mx-0 mb-8 md:mb-10">
                            Integrasi ekologi bawah tanah dan teknologi sensor presisi tinggi. Pantau kelembapan tanah,
                            serapan air, dan temperatur makro secara realtime dalam satu dasbor premium.
                        </p>

                        {/* Fitur Singkat (Otomatis sembunyi di mobile lewat kelas md:flex) */}
                        <div className="hidden md:flex gap-[30px] mt-5">
                            <div>
                                <h4 className="text-[#f8fafc] font-bold text-lg mb-1">5s</h4>
                                <p className="text-slate-500 text-xs m-0">Live Telemetry</p>
                            </div>
                            <div className="border-l border-slate-800"></div>
                            <div>
                                <h4 className="text-[#f8fafc] font-bold text-lg mb-1">99.9%</h4>
                                <p className="text-slate-500 text-xs m-0">Uptime Tracker</p>
                            </div>
                            <div className="border-l border-slate-800"></div>
                            <div>
                                <h4 className="text-[#f8fafc] font-bold text-lg mb-1">AI</h4>
                                <p className="text-slate-500 text-xs m-0">Absorption Analysis</p>
                            </div>
                        </div>
                    </div>

                    {/* Kolom Kanan: Kotak Interaktif CTA Login */}
                    <div className="flex justify-center md:justify-end">
                        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/[0.06] p-[30px_24px] md:p-10 rounded-3xl w-full max-w-[380px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] text-center">
                            
                            {/* Icon Wrapper */}
                            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                                    <circle cx="12" cy="12" r="4" />
                                </svg>
                            </div>

                            <h3 className="text-[#f8fafc] text-xl font-bold mb-2">
                                Gerbang Kendali IoT
                            </h3>
                            <p className="text-slate-400 text-xs md:text-sm mb-8 leading-relaxed">
                                Masuk menggunakan akun premium Anda untuk mengakses visualisasi data real-time perangkat biopori.
                            </p>

                            {/* Tombol CTA Login Utama (Menggunakan Inertia Link bawaan agar SPA terasa cepat) */}
                            <Link
                                href={auth.user ? route('dashboard') : route('login')}
                                className="w-full py-3.5 px-7 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-[15px] font-bold cursor-pointer transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 flex items-center justify-center gap-2 group"
                            >
                                <span>{auth.user ? 'Ke Dashboard' : 'Masuk ke Dashboard'}</span>
                                <svg className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
                            </Link>

                            {/* Footer Card */}
                            <div className="mt-6 border-t border-white/[0.05] pt-4">
                                <span className="text-slate-500 text-[11px] block tracking-wide">
                                    Secured Cloud Environment • v2.4-2026
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
        </>
    );
}