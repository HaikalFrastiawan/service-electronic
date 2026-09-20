"use client";

import { useState, useEffect } from "react";
import { Plus, X, Package, AlertTriangle, RefreshCw, Trash2, Edit3 } from "lucide-react";

// Tipe data sesuai dengan SparePartResponse dari Spring Boot
interface SparePart {
    id: string;
    partCode: string;      // Auto-generated dari backend (misal: PRT-LCD-001)
    partName: string;      // Auto-formatted (misal: [LCD] Layar iPhone 11)
    category: string;
    stockQuantity: number;
    purchasePrice: number;
    sellingPrice: number;
    minStockWarning: number;
    isLowStock?: boolean;
}

const KATEGORI_OPTIONS = [
    { value: "LCD", label: "LCD / Layar Display" },
    { value: "BAT", label: "Baterai" },
    { value: "RAM", label: "RAM / Memory" },
    { value: "IC", label: "IC / Chipset / Power" },
    { value: "CSG", label: "Casing / Frame / Body" },
    { value: "GEN", label: "Lain-lain / General" },
];

export default function SparepartsPage() {
    const [parts, setParts] = useState<SparePart[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // State Form Input
    const [category, setCategory] = useState("LCD");
    const [partName, setPartName] = useState("");
    const [stockQuantity, setStockQuantity] = useState<string>("");
    const [purchasePrice, setPurchasePrice] = useState<string>("");
    const [sellingPrice, setSellingPrice] = useState<string>("");

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await fetch("http://localhost:8080/api/spareparts");
            if (res.ok) {
                const data = await res.json();
                setParts(data || []);
            }
        } catch (err) {
            console.error("Gagal memuat data sparepart:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!partName.trim()) return alert("Nama sparepart wajib diisi!");

        setSubmitting(true);
        try {
            const payload = {
                category,
                partName,
                stockQuantity: Number(stockQuantity) || 0,
                purchasePrice: Number(purchasePrice) || 0,
                sellingPrice: Number(sellingPrice) || 0,
                minStockWarning: 5,
            };

            const res = await fetch("http://localhost:8080/api/spareparts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errText = await res.text();
                alert(`Gagal menyimpan (${res.status}): ${errText || "Akses ditolak / Error server"}`);
                return;
            }

            // Reset form & reload data
            setPartName("");
            setStockQuantity("");
            setPurchasePrice("");
            setSellingPrice("");
            setIsModalOpen(false);
            loadData();
            alert("Sparepart berhasil disimpan!");
        } catch (err) {
            alert("Tidak dapat terhubung ke server. Pastikan Spring Boot berjalan!");
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };
    const formatRupiah = (val: number) =>
        new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val || 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Manajemen Sparepart</h1>
                    <p className="text-sm text-slate-500">Kelola stok dan harga suku cadang servis.</p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={loadData}
                        className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm"
                    >
                        <Plus className="w-4 h-4" /> Tambah Sparepart
                    </button>
                </div>
            </div>

            {/* Tabel Sparepart */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 border-b border-slate-100 font-semibold text-xs uppercase tracking-wider">
                        <tr>
                            <th className="p-4">Kode Part</th>
                            <th className="p-4">Nama Sparepart</th>
                            <th className="p-4">Kategori</th>
                            <th className="p-4 text-center">Stok</th>
                            <th className="p-4 text-right">Harga Beli</th>
                            <th className="p-4 text-right">Harga Jual</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                        {parts.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-8 text-slate-400">
                                    Belum ada data sparepart. Klik "Tambah Sparepart" untuk membuat baru.
                                </td>
                            </tr>
                        ) : (
                            parts.map((p) => (
                                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-4 font-mono font-bold text-blue-600">{p.partCode}</td>
                                    <td className="p-4 font-semibold text-slate-900">{p.partName}</td>
                                    <td className="p-4 text-slate-500 text-xs">{p.category}</td>
                                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                          p.stockQuantity <= (p.minStockWarning || 5)
                              ? "bg-amber-100 text-amber-800"
                              : "bg-emerald-100 text-emerald-800"
                      }`}>
                        {p.stockQuantity <= (p.minStockWarning || 5) && <AlertTriangle className="w-3 h-3" />}
                          {p.stockQuantity} unit
                      </span>
                                    </td>
                                    <td className="p-4 text-right font-mono text-slate-500">{formatRupiah(p.purchasePrice)}</td>
                                    <td className="p-4 text-right font-mono font-bold text-slate-900">{formatRupiah(p.sellingPrice)}</td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL TAMBAH SPAREPART */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4 shadow-xl">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                            <h2 className="text-lg font-bold text-slate-900">Tambah Sparepart Baru</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-3">
                            {/* 1. Pilih Kategori (Ganti Input Kode Manual) */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Kategori Sparepart</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full p-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {KATEGORI_OPTIONS.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            [{opt.value}] {opt.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Live Preview Nama & Kode */}
                            <div className="p-2.5 bg-blue-50/70 border border-blue-100 rounded-xl text-xs space-y-1">
                                <p className="text-blue-900 font-bold">Preview Format Backend:</p>
                                <p className="text-slate-600 font-mono">
                                    Kode: <span className="font-bold text-blue-700">PRT-{category}-XXX</span> (Otomatis)
                                </p>
                                <p className="text-slate-600 font-mono">
                                    Nama: <span className="font-bold text-blue-700">[{category}] {partName || "..."}</span>
                                </p>
                            </div>

                            {/* 2. Nama Sparepart */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Sparepart</label>
                                <input
                                    type="text"
                                    placeholder="Misal: Layar iPhone 11 Original"
                                    value={partName}
                                    onChange={(e) => setPartName(e.target.value)}
                                    required
                                    className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* 3. Jumlah Stok */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Jumlah Stok (Unit)</label>
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={stockQuantity}
                                    onChange={(e) => setStockQuantity(e.target.value)}
                                    required
                                    className="w-full p-2.5 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* 4. Harga Beli & Harga Jual */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Harga Beli (Modal)</label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={purchasePrice}
                                        onChange={(e) => setPurchasePrice(e.target.value)}
                                        className="w-full p-2.5 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Harga Jual (Rp)</label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={sellingPrice}
                                        onChange={(e) => setSellingPrice(e.target.value)}
                                        required
                                        className="w-full p-2.5 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Tombol Aksi */}
                            <div className="flex justify-end gap-2 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm"
                                >
                                    {submitting ? "Menyimpan..." : "Simpan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}