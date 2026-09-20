"use client";

import { useState, useEffect } from "react";
import { fetchAllOrders } from "@/lib/api";
import { ServiceOrderResponse } from "@/lib/types";
import { Download, DollarSign, CheckCircle2, TrendingUp, RefreshCw } from "lucide-react";

export default function ReportsPage() {
    const [transactions, setTransactions] = useState<ServiceOrderResponse[]>([]);
    const [loading, setLoading] = useState(true);

    const loadReports = async () => {
        setLoading(true);
        try {
            const data = await fetchAllOrders();
            setTransactions(data);
        } catch (err) {
            console.error("Gagal mengambil data laporan:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReports();
    }, []);

    const formatRupiah = (val: number) =>
        new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val || 0);

    // Kalkulasi Statistik Ringkasan
    const completedOrders = transactions.filter((t) => t.status === "COMPLETED");
    const totalRevenue = completedOrders.reduce((sum, t) => sum + (t.totalCost || 0), 0);
    const completedCount = completedOrders.length;
    const avgCost = completedCount > 0 ? totalRevenue / completedCount : 0;

    // Fitur Unduh PDF (Cetak Dokumen Rapi)
    const handleExportPDF = () => {
        const printWindow = window.open("", "_blank");
        if (!printWindow) return;

        const tableRows = transactions
            .map(
                (t, idx) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center;">${idx + 1}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-family: monospace; font-weight: bold; color: #2563eb;">${t.orderNumber}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${t.brand} ${t.modelName}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${t.customerEmail || "Guest"}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center;">
            <span style="font-weight: bold; font-size: 11px; padding: 2px 8px; border-radius: 12px; background-color: ${t.status === 'COMPLETED' ? '#d1fae5' : '#dbeafe'}; color: ${t.status === 'COMPLETED' ? '#065f46' : '#1e40af'};">
              ${t.status}
            </span>
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: bold;">
            ${formatRupiah(t.totalCost || t.estimatedCost || 0)}
          </td>
        </tr>
      `
            )
            .join("");

        const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Laporan_Transaksi_ElectroFix_${new Date().toISOString().slice(0, 10)}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; color: #0f172a; margin: 0; }
          .header { text-align: center; margin-bottom: 24px; border-bottom: 3px solid #2563eb; padding-bottom: 12px; }
          .header h1 { margin: 0; color: #1e3a8a; font-size: 22px; }
          .header p { margin: 4px 0 0; color: #64748b; font-size: 12px; }
          .summary-grid { display: flex; justify-content: space-between; gap: 12px; margin-bottom: 24px; }
          .summary-card { flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; text-align: center; }
          .summary-card span { font-size: 11px; color: #64748b; font-weight: bold; text-transform: uppercase; }
          .summary-card p { font-size: 16px; font-weight: bold; color: #0f172a; margin: 4px 0 0; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 10px; }
          th { background-color: #f1f5f9; padding: 10px; text-align: left; font-size: 11px; text-transform: uppercase; color: #475569; border-bottom: 2px solid #cbd5e1; }
          .footer { margin-top: 32px; text-align: right; font-size: 11px; color: #94a3b8; }
          @media print {
            @page { size: A4 landscape; margin: 12mm; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>ELECTROFIX - LAPORAN REKAPITULASI TRANSAKSI SERVIS</h1>
          <p>Tanggal Cetak: ${new Date().toLocaleDateString("id-ID", { dateStyle: "full" })}</p>
        </div>

        <div class="summary-grid">
          <div class="summary-card">
            <span>Pendapatan Selesai</span>
            <p>${formatRupiah(totalRevenue)}</p>
          </div>
          <div class="summary-card">
            <span>Servis Terselesaikan</span>
            <p>${completedCount} Unit</p>
          </div>
          <div class="summary-card">
            <span>Rata-Rata Biaya Servis</span>
            <p>${formatRupiah(avgCost)}</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="text-align: center;">No</th>
              <th>No. Resi</th>
              <th>Perangkat</th>
              <th>Pelanggan</th>
              <th style="text-align: center;">Status</th>
              <th style="text-align: right;">Total Biaya</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>

        <div class="footer">
          <p>Dokumen ini dicetak otomatis dari System Dashboard ElectroFix Admin Panel.</p>
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
      </html>
    `;

        printWindow.document.write(htmlContent);
        printWindow.document.close();
    };

    return (
        <div className="space-y-6">
            {/* Header Halaman & Tombol Export PDF */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Laporan & Transaksi</h1>
                    <p className="text-sm text-slate-500">
                        Rekapitulasi keuangan dan riwayat transaksi servis perangkat konsumen.
                    </p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={loadReports}
                        className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
                    </button>

                    <button
                        onClick={handleExportPDF}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-colors"
                    >
                        <Download className="w-4 h-4" /> Unduh Laporan PDF
                    </button>
                </div>
            </div>

            {/* Ringkasan Statistik Laporan */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase text-slate-400">Pendapatan Selesai</p>
                        <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{formatRupiah(totalRevenue)}</h3>
                    </div>
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                        <DollarSign className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase text-slate-400">Servis Terselesaikan</p>
                        <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{completedCount} Unit</h3>
                    </div>
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase text-slate-400">Rata-Rata Biaya Servis</p>
                        <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{formatRupiah(avgCost)}</h3>
                    </div>
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* Tabel Riwayat Transaksi */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 font-bold text-slate-900 text-sm">
                    Riwayat Transaksi Servis
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 border-b border-slate-100 font-semibold text-xs uppercase tracking-wider">
                        <tr>
                            <th className="p-4">No. Resi</th>
                            <th className="p-4">Perangkat</th>
                            <th className="p-4">Pelanggan</th>
                            <th className="p-4 text-center">Status</th>
                            <th className="p-4 text-right">Total Biaya</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                        {transactions.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-8 text-slate-400">
                                    Belum ada transaksi ditemukan.
                                </td>
                            </tr>
                        ) : (
                            transactions.map((t) => (
                                <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-4 font-mono font-bold text-blue-600">{t.orderNumber}</td>
                                    <td className="p-4 font-medium text-slate-800">{t.brand} {t.modelName}</td>
                                    <td className="p-4 text-slate-600 text-xs font-mono">{t.customerEmail || "Guest"}</td>
                                    <td className="p-4 text-center">
                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold ${
                          t.status === "COMPLETED" ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800"
                      }`}>
                        {t.status}
                      </span>
                                    </td>
                                    <td className="p-4 text-right font-bold text-slate-900">
                                        {formatRupiah(t.totalCost || t.estimatedCost || 0)}
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}