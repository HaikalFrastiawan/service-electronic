"use client";

import { useState, useEffect } from "react";
import { Search, UserCheck, UserX, RefreshCw, Eye, X } from "lucide-react";
import { fetchAllOrders } from "@/lib/api";
import { ServiceOrderResponse } from "@/lib/types";

interface CustomerItem {
    id: string;
    name: string;
    email: string;
    type: "PELANGGAN" | "GUEST";
    totalOrders: number;
    orders: ServiceOrderResponse[];
}

export default function UsersPage() {
    const [customers, setCustomers] = useState<CustomerItem[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerItem | null>(null);

    const loadCustomerData = async () => {
        setLoading(true);
        try {
            const orders = await fetchAllOrders();

            const customerMap = new Map<string, CustomerItem>();

            orders.forEach((order) => {
                const email = order.customerEmail || "No Email";
                const isGuest = email.startsWith("guest_") || email.endsWith("@service.com");

                if (customerMap.has(email)) {
                    const existing = customerMap.get(email)!;
                    existing.totalOrders += 1;
                    existing.orders.push(order);
                } else {
                    customerMap.set(email, {
                        id: order.id,
                        name: isGuest ? "Pelanggan Tamu" : email.split("@")[0],
                        email: email,
                        type: isGuest ? "GUEST" : "PELANGGAN",
                        totalOrders: 1,
                        orders: [order],
                    });
                }
            });

            setCustomers(Array.from(customerMap.values()));
        } catch (err) {
            console.error("Gagal memuat data pelanggan:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCustomerData();
    }, []);

    // Fungsi Refresh: Reset pencarian, tutup modal, dan muat data dari awal
    const handleRefresh = () => {
        setSearchTerm("");
        setSelectedCustomer(null);
        loadCustomerData();
    };

    const formatRupiah = (val: number) =>
        new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val || 0);

    // Fitur Pencarian Lengkap (Nama, Email/Guest ID, & Nomor Resi)
    const filteredCustomers = customers.filter((c) => {
        const query = searchTerm.toLowerCase().trim();
        if (!query) return true;

        const matchName = c.name.toLowerCase().includes(query);
        const matchEmail = c.email.toLowerCase().includes(query);
        // Cek apakah ada nomor resi yang cocok di dalam riwayat servis konsumen ini
        const matchResi = c.orders.some((o) =>
            o.orderNumber?.toLowerCase().includes(query)
        );

        return matchName || matchEmail || matchResi;
    });

    return (
        <div className="space-y-6">
            {/* Header Halaman */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Daftar Konsumen</h1>
                    <p className="text-sm text-slate-500">
                        Daftar riwayat konsumen (Pelanggan & Guest) yang pernah melakukan servis.
                    </p>
                </div>

                {/* Tombol Refresh Data */}
                <button
                    onClick={handleRefresh}
                    className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors self-start md:self-auto"
                >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh Data
                </button>
            </div>

            {/* Filter & Tabel Data Konsumen */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100">
                    <div className="relative w-full md:w-80">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cari nama, email, atau No Resi"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 border-b border-slate-100 font-semibold text-xs uppercase tracking-wider">
                        <tr>
                            <th className="p-4">Identitas Konsumen</th>
                            <th className="p-4">Email / ID Kontak</th>
                            <th className="p-4">Tipe Akun</th>
                            <th className="p-4 text-center">Total Transaksi Servis</th>
                            <th className="p-4 text-center">Aksi</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                        {filteredCustomers.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-8 text-slate-400">
                                    Tidak ada data konsumen ditemukan.
                                </td>
                            </tr>
                        ) : (
                            filteredCustomers.map((c, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-4 font-bold text-slate-900">{c.name}</td>
                                    <td className="p-4 text-slate-600 font-mono text-xs">{c.email}</td>
                                    <td className="p-4">
                                        {c.type === "PELANGGAN" ? (
                                            <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full font-bold">
                          <UserCheck className="w-3 h-3" /> PELANGGAN
                        </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded-full font-bold">
                          <UserX className="w-3 h-3" /> GUEST (TAMU)
                        </span>
                                        )}
                                    </td>
                                    <td className="p-4 text-center">
                      <span className="bg-slate-100 text-slate-800 font-bold px-3 py-1 rounded-xl text-xs">
                        {c.totalOrders} Kali Servis
                      </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <button
                                            onClick={() => setSelectedCustomer(c)}
                                            className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors"
                                        >
                                            <Eye className="w-3.5 h-3.5" /> Detail Servis
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Detail Servis Konsumen */}
            {selectedCustomer && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-2xl space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
                        {/* Header Modal */}
                        <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">
                                    Riwayat Servis: {selectedCustomer.name}
                                </h2>
                                <p className="text-xs text-slate-500 font-mono mt-0.5">{selectedCustomer.email}</p>
                            </div>
                            <button
                                onClick={() => setSelectedCustomer(null)}
                                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* List Riwayat Servis */}
                        <div className="space-y-3">
                            {selectedCustomer.orders.map((o) => (
                                <div key={o.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-3">
                                    <div className="flex flex-wrap justify-between items-center gap-2">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-blue-600 font-mono text-sm">{o.orderNumber}</span>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                                o.status === "COMPLETED" ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800"
                                            }`}>
                        {o.status}
                      </span>
                                        </div>
                                        <span className="text-xs font-bold text-slate-900">
                      {formatRupiah(o.totalCost || o.estimatedCost || 0)}
                    </span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                        <div>
                                            <span className="text-slate-400">Perangkat:</span>
                                            <p className="font-semibold text-slate-800">{o.brand} {o.modelName}</p>
                                        </div>
                                        <div>
                                            <span className="text-slate-400">Deskripsi Kerusakan:</span>
                                            <p className="font-medium text-slate-700">{o.issueDescription || "-"}</p>
                                        </div>
                                    </div>

                                    {o.completionNotes && (
                                        <div className="p-2.5 bg-white rounded-lg border border-slate-200/60 text-xs">
                                            <span className="font-semibold text-slate-600 block mb-0.5">Catatan Perbaikan:</span>
                                            <p className="text-slate-500">{o.completionNotes}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Footer Modal */}
                        <div className="flex justify-end pt-2 border-t border-slate-100">
                            <button
                                onClick={() => setSelectedCustomer(null)}
                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}