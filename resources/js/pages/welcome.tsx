import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const [isMobile, setIsMobile] = useState<boolean>(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Jalankan animasi ringan log-in hover effect secara internal (opsional)
    const handleLoginRedirect = () => {
        // Arahkan ke rute login Anda di sini
        console.log("Redirecting to login...");
    };
    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <section style={{
                position: 'relative',
                width: '100%',
                height: '100vh',
                minHeight: '600px',
                background: 'radial-gradient(circle at 80% 20%, #064e3b 0%, #0f172a 60%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: isMobile ? '20px' : '40px',
                boxSizing: 'border-box',
                overflow: 'hidden',
                fontFamily: 'Inter, sans-serif'
            }}>
                {/* Ornamen Grafis Latar Belakang (Cyber-Organic Nodes) */}
                <div style={{
                    position: 'absolute',
                    top: '25%',
                    left: '10%',
                    width: isMobile ? '120px' : '250px',
                    height: isMobile ? '120px' : '250px',
                    background: 'rgba(16, 185, 129, 0.08)',
                    borderRadius: '50%',
                    filter: 'blur(40px)',
                    pointerEvents: 'none'
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '15%',
                    right: '15%',
                    width: isMobile ? '180px' : '350px',
                    height: isMobile ? '180px' : '350px',
                    background: 'rgba(6, 182, 212, 0.06)',
                    borderRadius: '50%',
                    filter: 'blur(60px)',
                    pointerEvents: 'none'
                }} />

                {/* Kontainer Utama */}
                <div style={{
                    maxWidth: '1200px',
                    width: '100%',
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : '1.2fr 0.8fr',
                    gap: isMobile ? '40px' : '60px',
                    alignItems: 'center',
                    zIndex: 10
                }}>

                    {/* Kolon Kiri: Branding & Value Proposition */}
                    <div style={{
                        textAlign: isMobile ? 'center' : 'left',
                        animation: 'fadeInLeft 1s ease-out'
                    }}>
                        {/* Badge Kecil */}
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: 'rgba(16, 185, 129, 0.1)',
                            border: '1px solid rgba(16, 185, 129, 0.2)',
                            padding: '6px 14px',
                            borderRadius: '30px',
                            marginBottom: '20px'
                        }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
                            <span style={{ color: '#10b981', fontSize: '12px', fontWeight: 600, letterSpacing: '1px' }}>
                                NEXT-GEN AGROTECH IoT
                            </span>
                        </div>

                        {/* Judul Utama Utama */}
                        <h1 style={{
                            color: '#f8fafc',
                            fontSize: isMobile ? '32px' : '54px',
                            fontWeight: 800,
                            lineHeight: 1.15,
                            letterSpacing: '-1px',
                            margin: '0 0 20px 0'
                        }}>
                            Smart <span style={{
                                background: 'linear-gradient(to right, #10b981, #06b6d4)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>Biopori</span> <br />Monitoring System
                        </h1>

                        {/* Deskripsi */}
                        <p style={{
                            color: '#94a3b8',
                            fontSize: isMobile ? '14px' : '18px',
                            lineHeight: 1.6,
                            maxWidth: '540px',
                            margin: isMobile ? '0 auto 30px' : '0 0 40px',
                        }}>
                            Integrasi ekologi bawah tanah dan teknologi sensor presisi tinggi. Pantau kelembapan tanah, serapan air, dan temperatur makro secara realtime dalam satu dasbor premium.
                        </p>

                        {/* Fitur Singkat (Sembunyikan di layar super kecil jika terlalu padat) */}
                        {!isMobile && (
                            <div style={{ display: 'flex', gap: '30px', marginTop: '20px' }}>
                                <div>
                                    <h4 style={{ color: '#f8fafc', margin: '0 0 4px 0', fontSize: '18px' }}>5s</h4>
                                    <p style={{ color: '#64748b', margin: 0, fontSize: '13px' }}>Live Telemetry</p>
                                </div>
                                <div style={{ borderLeft: '1px solid #334155' }}></div>
                                <div>
                                    <h4 style={{ color: '#f8fafc', margin: '0 0 4px 0', fontSize: '18px' }}>99.9%</h4>
                                    <p style={{ color: '#64748b', margin: 0, fontSize: '13px' }}>Uptime Tracker</p>
                                </div>
                                <div style={{ borderLeft: '1px solid #334155' }}></div>
                                <div>
                                    <h4 style={{ color: '#f8fafc', margin: '0 0 4px 0', fontSize: '18px' }}>AI</h4>
                                    <p style={{ color: '#64748b', margin: 0, fontSize: '13px' }}>Absorption Analysis</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Kolom Kanan: Kotak Interaktif CTA Login */}
                    <div style={{
                        display: 'flex',
                        justifyContent: isMobile ? 'center' : 'flex-end',
                    }}>
                        <div style={{
                            background: 'rgba(30, 41, 59, 0.4)',
                            backdropFilter: 'blur(16px)',
                            WebkitBackdropFilter: 'blur(16px)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            padding: isMobile ? '30px 24px' : '40px',
                            borderRadius: '24px',
                            width: '100%',
                            maxWidth: '380px',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                            textAlign: 'center',
                        }}>
                            <div style={{
                                width: '56px',
                                height: '56px',
                                background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
                                borderRadius: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 24px',
                                boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)'
                            }}>
                                {/* SVG Icon Node IoT */}
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                                    <circle cx="12" cy="12" r="4" />
                                </svg>
                            </div>

                            <h3 style={{ color: '#f8fafc', fontSize: '20px', fontWeight: 700, margin: '0 0 8px 0' }}>
                                Gerbang Kendali IoT
                            </h3>
                            <p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 32px 0', lineHeight: 1.5 }}>
                                Masuk menggunakan akun premium Anda untuk mengakses visualisasi data real-time perangkat biopori.
                            </p>

                            {/* Tombol CTA Login Utama */}
                            <a href={route('login')}
                                onClick={handleLoginRedirect}
                                style={{
                                    width: '100%',
                                    padding: '14px 28px',
                                    background: '#10b981',
                                    color: '#0f172a',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontSize: '15px',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#34d399';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(52, 211, 153, 0.5)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = '#10b981';
                                    e.currentTarget.style.transform = 'translateY(0px)';
                                    e.currentTarget.style.boxShadow = '0 4px 14px rgba(16, 185, 129, 0.4)';
                                }}
                            >
                                <span>Masuk ke Dashboard</span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
                            </a>

                            {/* Footer Card */}
                            <div style={{ marginTop: '24px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}>
                                <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>
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
