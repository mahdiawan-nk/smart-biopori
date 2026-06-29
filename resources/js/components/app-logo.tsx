export default function AppLogo() {
    return (
        // Dibungkus flex container agar tata letak horizontal konsisten saat dipanggil
        <div className="flex items-center gap-3 p-1 rounded-xl">
            
            {/* Wadah Ikon: Warna emerald alam dengan shadow lembut yang senada */}
            <div className="flex aspect-square size-9 items-center justify-center rounded-xl shadow-md shadow-emerald-600/10 dark:shadow-none shrink-0">
                {/* Penyesuaian untuk Tag Image */}
                <img 
                    src="/img/logo.png" 
                    alt="Logo BioMonitor" 
                    className="size-9.5 object-contain" 
                    
                />
            </div>
            
            {/* Teks Identitas Aplikasi */}
            {/* min-w-0 penting agar efek truncate (titik-titik) bekerja saat sidebar mengecil */}
            <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
                <span className="truncate font-semibold tracking-wide text-slate-900 dark:text-slate-100">
                    Smart Biopori
                </span>
                <span className="truncate text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                    Sistem Monitoring Biopori
                </span>
            </div>
            
        </div>
    );
}