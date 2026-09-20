"use client";

import { useState, useEffect } from "react";
import { X, Package, AlertCircle, RefreshCw, Edit3 } from "lucide-react";
import { fetchAllOrders, fetchSpareparts } from "@/lib/api";
import { ServiceOrderResponse } from "@/lib/types";

interface Sparepart {
    id: string | number;
    name?: string;
    partName?: string;
    price?: number;
    sellingPrice?: number;
    stock?: number;
    stockQuantity?: number;
}

// ----------------------------------------------------------------------
// 1. KOMPONEN MODAL UPDATE SERVIS
// ----------------------------------------------------------------------
function UpdateServiceModal({
                                order,
                                onClose,
                                onSuccess,
                            }: {
    order: ServiceOrderResponse;
    onClose: () => void;
    onSuccess: () => void;
}) {
    const [status, setStatus] = useState<string>(order.status || "PENDING");
    const [cost, setCost] = useState<string>(
        order.totalCost || order.estimatedCost ? String(order.totalCost || order.estimatedCost) : ""
    );
    const [notes, setNotes] = useState(order.completionNotes || "");
    const [spareparts, setSpareparts] = useState<Sparepart[]>([]);
    const [selectedPartId, setSelectedPartId] = useState<string>("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function loadParts() {
            try {
                if (typeof fetchSpareparts === "function") {
                    const data = await fetchSpareparts();
                    setSpareparts(data || []);
                }
            } catch (err) {
                console.error("Gagal memuat sparepart:", err);
                setSpareparts([]);
            }
        }
        loadParts();
    }, []);
    const handleSelectSparepart = (partId: string) => {
        setSelectedPartId(partId);
        const part = spareparts.find((p) => String(p.id) === String(partId));
        if (part) {
            const partPrice = part.sellingPrice ?? part.price ?? 0;
            const partName = part.partName ?? part.name ?? "Sparepart";
            const currentCost = Number(cost) || 0;

            setCost(String(currentCost + partPrice));
            const addedNote = `[Membutuhkan/Memakai Sparepart: ${partName} - Rp ${partPrice.toLocaleString("id-ID")}]`;
            setNotes((prev) => (prev ? `${prev}\n${addedNote}` : addedNote));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Susun payload sesuai DTO Spring Boot
            const payload = {
                status: status,
                totalCost: cost ? Number(cost) : 0,
                estimatedCost: cost ? Number(cost) : 0,
                completionNotes: notes || "",
                sparePartId: selectedPartId && selectedPartId !== "" ? Number(selectedPartId) : null,
                quantity: selectedPartId && selectedPartId !== "" ? 1 : null,
            };

            const orderId = order.id || order.orderNumber;

            const res = await fetch(`http://localhost:8080/api/v1/service-orders/${orderId}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token") || ""}`
                },
                body: JSON.stringify(payload),
            });

            const responseData = await res.json();

            if (!res.ok) {
                throw new Error(responseData.message || "Gagal memperbarui status");
            }

            alert("Status servis berhasil diperbarui!");
            onSuccess(); // Refresh tabel data
            onClose();   // Tutup modal
        } catch (error: any) {
            console.error("Error updating status:", error);
            alert(error.message || "Gagal memperbarui status servis!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-lg space-y-4 shadow-xl">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <h2 className="text-lg font-bold text-slate-900">
                        Update Servis <span className="text-blue-600 font-mono">#{order.orderNumber}</span>
                    </h2>
                    <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Status Perbaikan</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full p-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="PENDING">PENDING (Menunggu Pemeriksaan)</option>
                            <option value="IN_PROGRESS">IN_PROGRESS (Sedang Dikerjakan)</option>
                            <option value="WAITING_PARTS">WAITING_PARTS (Menunggu Sparepart)</option>
                            <option value="COMPLETED">COMPLETED (Selesai)</option>
                            <option value="CANCELLED">CANCELLED (Dibatalkan)</option>
                        </select>
                    </div>

                    {/* Integrasi Stok Sparepart */}
                    <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
                            <Package className="w-4 h-4 text-blue-600" />
                            <span>Gunakan / Butuh Sparepart dari Stok?</span>
                        </div>

                        <select
                            value={selectedPartId}
                            onChange={(e) => handleSelectSparepart(e.target.value)}
                            className="w-full p-2 bg-white border border-blue-200 rounded-lg text-xs font-medium focus:outline-none"
                        >
                            <option value="">-- Pilih Suku Cadang (Opsional) --</option>
                            {spareparts.map((part: any) => {
                                const price = part.sellingPrice ?? part.price ?? 0;
                                const stock = part.stockQuantity ?? part.stock ?? 0;
                                const name = part.partName ?? part.name ?? "Sparepart";

                                return (
                                    <option key={part.id} value={part.id} disabled={stock <= 0}>
                                        {name} - Stok: {stock} unit (Rp {Number(price).toLocaleString('id-ID')})
                                        {stock <= 0 ? " [STOK HABIS]" : ""}
                                    </option>
                                );
                            })}
                        </select>

                        {status === "WAITING_PARTS" && !selectedPartId && (
                            <p className="text-[11px] text-amber-600 flex items-center gap-1 mt-1 font-medium">
                                <AlertCircle className="w-3.5 h-3.5" /> Pilih sparepart yang sedang ditunggu agar tercatat.
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Biaya (Rp)</label>
                        <input
                            type="number"
                            placeholder="Masukkan nominal biaya..."
                            value={cost}
                            onChange={(e) => setCost(e.target.value)}
                            className="w-full p-2.5 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Catatan Pengerjaan</label>
                        <textarea
                            rows={3}
                            placeholder="Tambahkan catatan teknisi di sini..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold disabled:opacity-50"
                        >
                            {loading ? "Menyimpan..." : "Simpan Perubahan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ----------------------------------------------------------------------
// 2. HALAMAN UTAMA DASHBOARD
// ----------------------------------------------------------------------
export default function DashboardPage() {
    const [orders, setOrders] = useState<ServiceOrderResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<ServiceOrderResponse | null>(null);

    const loadOrders = async () => {
        setLoading(true);
        try {
            const data = await fetchAllOrders();
            setOrders(data || []);
        } catch (err) {
            console.error("Gagal memuat transaksi:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const formatRupiah = (val: number) =>
        new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val || 0);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Dashboard Utama</h1>
                    <p className="text-sm text-slate-500">Kelola dan pantau semua status pengerjaan servis konsumen.</p>
                </div>

                <button
                    onClick={loadOrders}
                    className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold self-start md:self-auto"
                >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh Data
                </button>
            </div>

            {/* Tabel Pesanan Servis */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 border-b border-slate-100 font-semibold text-xs uppercase tracking-wider">
                        <tr>
                            <th className="p-4">No. Resi</th>
                            <th className="p-4">Perangkat</th>
                            <th className="p-4">Pelanggan</th>
                            <th className="p-4 text-center">Status</th>
                            <th className="p-4 text-right">Biaya</th>
                            <th className="p-4 text-center">Aksi</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-8 text-slate-400">
                                    Belum ada antrean servis.
                                </td>
                            </tr>
                        ) : (
                            orders.map((o) => (
                                <tr key={o.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-4 font-mono font-bold text-blue-600">{o.orderNumber}</td>
                                    <td className="p-4 font-semibold text-slate-900">{o.brand} {o.modelName}</td>
                                    <td className="p-4 text-slate-600 font-mono text-xs">{o.customerEmail || "Guest"}</td>
                                    <td className="p-4 text-center">
                                            <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold ${
                                                o.status === "COMPLETED" ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800"
                                            }`}>
                                                {o.status}
                                            </span>
                                    </td>
                                    <td className="p-4 text-right font-bold text-slate-900">
                                        {formatRupiah(o.totalCost || o.estimatedCost || 0)}
                                    </td>
                                    <td className="p-4 text-center">
                                        <button
                                            onClick={() => setSelectedOrder(o)}
                                            className="inline-flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1.5 rounded-xl text-xs font-semibold"
                                        >
                                            <Edit3 className="w-3.5 h-3.5" /> Update
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Render */}
            {selectedOrder && (
                <UpdateServiceModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onSuccess={loadOrders}
                />
            )}
        </div>
    );
}