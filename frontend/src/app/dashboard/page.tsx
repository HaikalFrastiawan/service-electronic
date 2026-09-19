'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthUser, clearAuthData } from '@/lib/api';
import {
    Wrench,
    LogOut,
    Plus,
    ShieldCheck,
    Clock,
    X,
    Laptop,
    Send,
    Loader2,
} from 'lucide-react';

const INITIAL_ORDERS = [
    {
        id: 'SVC-20260918-A101',
        category: 'LAPTOP',
        brand: 'ASUS',
        model: 'ROG Zephyrus G14',
        serialNumber: 'SN-ASUS-99201',
        problem: 'Layar flicker dan kipas pendingin berbunyi bising saat bermain game berat.',
        customerEmail: 'budi.santoso@example.com',
        dateIn: '17 Sep 2026, 22.52',
        status: 'COMPLETED',
        estimatedCost: 850000,
        finalCost: 500000,
        technicianNotes: 'Pembersihan heatsink selesai, menunggu ganti modul layar LCD.',
    },
    {
        id: 'SVC-20260918-B202',
        category: 'SMARTPHONE',
        brand: 'SAMSUNG',
        model: 'Galaxy S23 Ultra',
        serialNumber: 'SN-SAM-33012',
        problem: 'Baterai bocor dan cepat panas saat digunakan.',
        customerEmail: 'siti.rahma@example.com',
        dateIn: '18 Sep 2026, 10.15',
        status: 'IN_PROGRESS',
        estimatedCost: 450000,
        finalCost: 450000,
        technicianNotes: 'Perlu penggantian modul baterai original.',
    },
];

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [tickets, setTickets] = useState<any[]>([]);

    // State Modal & Form Input Tiket Baru
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [category, setCategory] = useState('LAPTOP');
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [serialNumber, setSerialNumber] = useState('');
    const [problem, setProblem] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const currentUser = getAuthUser();
        if (!currentUser) {
            router.push('/login');
        } else if (currentUser.role === 'ROLE_ADMIN') {
            router.push('/admin');
        } else {
            setUser(currentUser);

            // Sinkronisasi data dari localStorage
            const savedOrders = localStorage.getItem('electrofix_orders');
            if (savedOrders) {
                setTickets(JSON.parse(savedOrders));
            } else {
                localStorage.setItem('electrofix_orders', JSON.stringify(INITIAL_ORDERS));
                setTickets(INITIAL_ORDERS);
            }
        }
    }, [router]);

    const handleLogout = () => {
        clearAuthData();
        router.push('/login');
    };

    // Fungsi Tambah Tiket Baru oleh Konsumen
    const handleSubmitTicket = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await new Promise((resolve) => setTimeout(resolve, 600));

            const newTicket = {
                id: `SVC-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`,
                category,
                brand,
                model,
                serialNumber: serialNumber || '-',
                problem,
                customerEmail: user?.email || 'konsumen@example.com',
                dateIn: new Date().toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                }),
                status: 'PENDING',
                estimatedCost: 0,
                finalCost: 0,
                technicianNotes: 'Tiket baru berhasil diajukan.',
            };

            // Mengambil data lama dan menambahkan data baru ke posisi teratas
            const existingOrders = JSON.parse(localStorage.getItem('electrofix_orders') || '[]');
            const updatedOrders = [newTicket, ...existingOrders];

            // Simpan ke state & localStorage
            localStorage.setItem('electrofix_orders', JSON.stringify(updatedOrders));
            setTickets(updatedOrders);

            // Reset form
            setBrand('');
            setModel('');
            setSerialNumber('');
            setProblem('');
            setIsModalOpen(false);
        } catch (error) {
            console.error('Gagal membuat tiket:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!user) return null;

    // Filter tiket sesuai akun konsumen yang sedang login
    const myTickets = tickets.filter((t) => t.customerEmail === user.email || tickets.length > 0);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            {/* Header Navbar Konsumen */}
            <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
                        <Wrench className="w-4 h-4" />
                    </div>
                    <span className="font-extrabold text-slate-900 tracking-tight text-lg">
            ElectroFix <span className="text-blue-600 text-xs font-mono">PRO</span>
          </span>
                </div>

                <div className="flex items-center gap-4 text-xs">
          <span className="text-slate-500">
            Halo, <strong className="text-slate-800">{user.email}</strong>
          </span>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-all cursor-pointer"
                    >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Keluar</span>
                    </button>
                </div>
            </header>

            {/* Main Content Dashboard Konsumen */}
            <main className="max-w-6xl mx-auto px-6 py-8 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Dashboard Layanan Konsumen</h1>
                        <p className="text-xs text-slate-500">Pantau status perbaikan perangkat elektronik Anda secara realtime.</p>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-600/20 transition-all cursor-pointer active:scale-95"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Buat Tiket Perbaikan</span>
                    </button>
                </div>

                {/* Ringkasan Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-semibold uppercase">TOTAL SERVIS</p>
                            <p className="text-2xl font-black text-slate-800">{myTickets.length} Perangkat</p>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-semibold uppercase">STATUS AKUN</p>
                            <p className="text-2xl font-black text-slate-800">Pelanggan Terverifikasi</p>
                        </div>
                    </div>
                </div>

                {/* Daftar Tiket Servis */}
                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-sm">
                    <h2 className="font-bold text-slate-800 text-sm">Riwayat Tiket Servis Saya</h2>

                    {myTickets.length > 0 ? (
                        <div className="space-y-3">
                            {myTickets.map((t) => (
                                <div
                                    key={t.id}
                                    className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 flex items-center justify-between hover:border-slate-200 transition-all"
                                >
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200">
                        {t.id}
                      </span>
                                            <span className="text-[11px] text-slate-400">{t.dateIn}</span>
                                        </div>
                                        <h3 className="font-bold text-slate-800 text-sm">
                                            {t.brand} {t.model}
                                        </h3>
                                        <p className="text-xs text-slate-500">{t.problem}</p>
                                    </div>

                                    <span
                                        className={`px-3 py-1 font-bold text-xs rounded-full ${
                                            t.status === 'COMPLETED'
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : t.status === 'IN_PROGRESS'
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : t.status === 'WAITING_PARTS'
                                                        ? 'bg-orange-100 text-orange-700'
                                                        : 'bg-amber-100 text-amber-700'
                                        }`}
                                    >
                    {t.status}
                  </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-slate-400 text-xs">
                            Belum ada tiket servis. Klik tombol di atas untuk mengajukan perbaikan.
                        </div>
                    )}
                </div>
            </main>

            {/* Modal Input Form Tiket Baru */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                                    <Laptop className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-sm">Buat Tiket Perbaikan Baru</h3>
                                    <p className="text-[11px] text-slate-500">Isi detail perangkat elektronik yang ingin diperbaiki.</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-xl transition-all cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmitTicket} className="p-5 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Kategori Perangkat
                                </label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 outline-none focus:border-blue-600 focus:bg-white"
                                >
                                    <option value="LAPTOP">Laptop / Komputer</option>
                                    <option value="SMARTPHONE">Smartphone / Tablet</option>
                                    <option value="TELEVISI">Televisi / Display</option>
                                    <option value="AUDIO">Audio System / Speaker</option>
                                    <option value="OTHERS">Perangkat Lainnya</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Merek / Brand
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Contoh: Asus, Samsung"
                                        value={brand}
                                        onChange={(e) => setBrand(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 outline-none focus:border-blue-600 focus:bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Model / Tipe
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Contoh: ROG Strix, Galaxy S23"
                                        value={model}
                                        onChange={(e) => setModel(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 outline-none focus:border-blue-600 focus:bg-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Nomor Seri / Serial Number <span className="text-slate-400 font-normal">(Opsional)</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Contoh: SN-12345678"
                                    value={serialNumber}
                                    onChange={(e) => setSerialNumber(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 outline-none focus:border-blue-600 focus:bg-white font-mono"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Deskripsi Kerusakan / Keluhan
                                </label>
                                <textarea
                                    rows={3}
                                    required
                                    placeholder="Jelaskan kendala atau kerusakan yang dialami..."
                                    value={problem}
                                    onChange={(e) => setProblem(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 outline-none focus:border-blue-600 focus:bg-white"
                                />
                            </div>

                            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            <span>Mengirim...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-3.5 h-3.5" />
                                            <span>Kirim Tiket</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}