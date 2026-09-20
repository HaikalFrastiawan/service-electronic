'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Wrench,
    Search,
    AlertCircle,
    Laptop,
    Calendar,
    FileText,
    Loader2,
} from 'lucide-react';

function TrackContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const resiFromUrl = searchParams.get('resi') || '';

    const [inputResi, setInputResi] = useState(resiFromUrl);
    const [ticket, setTicket] = useState<any>(null);
    const [searched, setSearched] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Cari otomatis jika ada query parameter ?resi=
    useEffect(() => {
        if (resiFromUrl) {
            setInputResi(resiFromUrl);
            searchTicket(resiFromUrl);
        }
    }, [resiFromUrl]);

    // Mengambil data tracking dari API Backend Spring Boot
    const searchTicket = async (resi: string) => {
        if (!resi.trim()) return;
        setSearched(true);
        setIsLoading(true);

        try {
            // Memanggil API backend publik tanpa butuh token JWT
            const response = await fetch(`http://localhost:8080/api/v1/service-orders/track/${encodeURIComponent(resi.trim())}`);
            const result = await response.json();

            if (response.ok && result.data) {
                setTicket(result.data);
            } else {
                setTicket(null);
            }
        } catch (error) {
            console.error('Gagal mengambil data resi:', error);
            setTicket(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputResi.trim()) return;
        router.push(`/track?resi=${encodeURIComponent(inputResi.trim())}`);
        searchTicket(inputResi);
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            {/* Header Publik */}
            <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
                        <Wrench className="w-4 h-4" />
                    </div>
                    <span className="font-extrabold text-slate-900 tracking-tight text-lg">
                        ElectroFix <span className="text-blue-600 text-xs font-mono">PRO</span>
                    </span>
                </Link>

                <Link
                    href="/login"
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all"
                >
                    Masuk Akun
                </Link>
            </header>

            {/* Main Content */}
            <main className="max-w-3xl mx-auto px-6 py-10 space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-black text-slate-900">Lacak Status Perbaikan</h1>
                    <p className="text-xs text-slate-500">
                        Masukkan nomor resi servis Anda untuk melihat perkembangan perbaikan secara realtime.
                    </p>
                </div>

                {/* Form Pencarian Resi */}
                <form onSubmit={handleSearchSubmit} className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                        <input
                            type="text"
                            required
                            value={inputResi}
                            onChange={(e) => setInputResi(e.target.value)}
                            placeholder="Masukkan Nomor Resi (Contoh: SVC-20260918-A101)..."
                            className="w-full bg-white border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-xs font-mono font-semibold text-slate-800 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 shadow-sm transition-all"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl shadow-md shadow-blue-600/20 transition-all cursor-pointer shrink-0 disabled:opacity-50 flex items-center gap-2"
                    >
                        {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        <span>Lacak Resi</span>
                    </button>
                </form>

                {/* Loading State */}
                {isLoading && (
                    <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-3">
                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
                        <p className="text-xs text-slate-500 font-medium">Mencari data perbaikan di server...</p>
                    </div>
                )}

                {/* Hasil Pencarian */}
                {!isLoading && searched && (
                    <div>
                        {ticket ? (
                            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6 animate-in fade-in zoom-in-95 duration-200">
                                {/* Header Status Resi */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                            Nomor Resi Perbaikan
                                        </span>
                                        <h2 className="text-xl font-mono font-black text-blue-600">{ticket.orderNumber || ticket.id}</h2>
                                    </div>

                                    <span
                                        className={`self-start sm:self-auto px-4 py-1.5 font-extrabold text-xs rounded-full ${
                                            ticket.status === 'COMPLETED'
                                                ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                                : ticket.status === 'IN_PROGRESS'
                                                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                                    : ticket.status === 'WAITING_PARTS'
                                                        ? 'bg-orange-100 text-orange-700 border border-orange-200'
                                                        : 'bg-amber-100 text-amber-700 border border-amber-200'
                                        }`}
                                    >
                                        {ticket.status}
                                    </span>
                                </div>

                                {/* Detail Perangkat */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
                                            <Laptop className="w-3.5 h-3.5 text-blue-600" />
                                            <span>PERANGKAT</span>
                                        </div>
                                        <p className="font-bold text-slate-800 text-sm">
                                            {ticket.brand} {ticket.modelName || ticket.model}
                                        </p>
                                        <p className="text-[11px] text-slate-500 font-mono">SN: {ticket.serialNumber || '-'}</p>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
                                            <Calendar className="w-3.5 h-3.5 text-blue-600" />
                                            <span>TANGGAL MASUK</span>
                                        </div>
                                        <p className="font-bold text-slate-800 text-sm">
                                            {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString('id-ID') : ticket.dateIn || '-'}
                                        </p>
                                        <p className="text-[11px] text-slate-500">Kategori: {ticket.category}</p>
                                    </div>
                                </div>

                                {/* Kendala / Keluhan */}
                                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Keluhan Kerusakan</span>
                                    <p className="text-xs text-slate-700">{ticket.issueDescription || ticket.problem}</p>
                                </div>

                                {/* Catatan Teknisi */}
                                <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-1">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700">
                                        <FileText className="w-3.5 h-3.5" />
                                        <span>Catatan Teknisi</span>
                                    </div>
                                    <p className="text-xs text-slate-700">
                                        {ticket.technicianNotes || 'Perangkat dalam antrean pemeriksaan teknisi.'}
                                    </p>
                                </div>

                                {/* Estimasi / Biaya Final */}
                                <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100">
                                    <span className="text-slate-500 font-semibold">Total Biaya Perbaikan:</span>
                                    <span className="text-base font-mono font-black text-slate-900">
                                        Rp {Number(ticket.totalCost || ticket.finalCost || ticket.estimatedCost || 0).toLocaleString('id-ID')}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-3">
                                <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
                                    <AlertCircle className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-slate-800 text-sm">Resi Tidak Ditemukan</h3>
                                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                                    Nomor resi <strong>"{inputResi}"</strong> tidak ada di sistem. Pastikan nomor resi yang dimasukkan sudah benar.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}

export default function PublicTrackPage() {
    return (
        <Suspense fallback={<div className="p-6 text-center text-xs">Memuat halaman...</div>}>
            <TrackContent />
        </Suspense>
    );
}