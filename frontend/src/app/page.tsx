'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Wrench, ShieldCheck, Clock, Copy, Check, Sparkles, ArrowRight, AlertCircle, Loader2, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { trackOrder, createServiceOrder } from '@/lib/api';
import { DeviceCategory, ServiceOrderResponse } from '@/lib/types';
import { StatusStepper } from '@/components/StatusStepper';
import { DeviceCategorySelector } from '@/components/DeviceCategorySelector';
import { StatusBadge } from '@/components/StatusBadge';
import { formatDate, formatRupiah } from '@/lib/utils';

export default function CustomerPortal() {
  // Tracker state
  const [searchResi, setSearchResi] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<ServiceOrderResponse | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [trackError, setTrackError] = useState<string | null>(null);

  // Ticket Form state
  const [category, setCategory] = useState<DeviceCategory>('LAPTOP');
  const [brand, setBrand] = useState('');
  const [modelName, setModelName] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdResi, setCreatedResi] = useState<string | null>(null);
  const [copiedResi, setCopiedResi] = useState(false);

  // Quick sample search handler
  const handleSampleSearch = (sample: string) => {
    setSearchResi(sample);
    executeSearch(sample);
  };

  const executeSearch = async (resiQuery: string) => {
    if (!resiQuery.trim()) return;
    setIsSearching(true);
    setTrackError(null);
    setTrackedOrder(null);

    try {
      const order = await trackOrder(resiQuery.trim());
      setTrackedOrder(order);
    } catch (err: unknown) {
      const errorObj = err as Error;
      setTrackError(errorObj.message || 'Nomor tiket tidak ditemukan. Pastikan format kode sudah benar.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(searchResi);
  };

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await createServiceOrder({
        category,
        brand,
        modelName,
        serialNumber,
        issueDescription,
        customerName,
        customerEmail,
        customerPhone,
      });

      setCreatedResi(result.orderNumber);
      setBrand('');
      setModelName('');
      setSerialNumber('');
      setIssueDescription('');
    } catch (err: unknown) {
      const errorObj = err as Error;
      alert('Gagal mengirimkan pengajuan perbaikan: ' + errorObj.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyResi = (resi: string) => {
    navigator.clipboard.writeText(resi);
    setCopiedResi(true);
    setTimeout(() => setCopiedResi(false), 2000);
  };

  return (
      <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white font-sans pb-20">
        {/* Background Decorative Gradients */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] rounded-full bg-blue-100/50 blur-[120px]" />
          <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] rounded-full bg-slate-200/50 blur-[100px]" />
        </div>

        {/* Top Navbar */}
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/20">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900">
                ElectroFix <span className="text-blue-600 font-mono text-sm">PRO</span>
              </span>
                <span className="block text-[10px] text-slate-500 font-mono">Portal Layanan Perbaikan</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                  href="/admin"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 hover:border-blue-500 hover:bg-slate-50 text-slate-700 transition-all flex items-center gap-2 shadow-sm"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-blue-500" />
                <span>Dashboard Teknisi</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-16">

          {/* HERO SECTION */}
          <section className="text-center space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pantau Status Perbaikan Perangkat</span>
            </motion.div>

            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 max-w-3xl mx-auto leading-tight"
            >
              Cek Status Perbaikan Perangkat Anda
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto"
            >
              Masukkan nomor tiket perbaikan (contoh: <span className="font-mono text-blue-600 font-semibold">SVC-20260918-A101</span>) untuk melihat perkembangan pengerjaan secara langsung.
            </motion.p>

            {/* Big Search Bar */}
            <motion.form
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                onSubmit={handleSearchSubmit}
                className="max-w-2xl mx-auto"
            >
              <div className="relative flex items-center bg-white border border-slate-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 rounded-2xl shadow-sm p-2 transition-all">
                <Search className="w-6 h-6 text-slate-400 ml-3 shrink-0" />
                <input
                    type="text"
                    placeholder="Masukkan Nomor Tiket (Contoh: SVC-20260918-A101)"
                    value={searchResi}
                    onChange={(e) => setSearchResi(e.target.value)}
                    className="w-full bg-transparent border-none px-4 py-3 text-slate-900 placeholder-slate-400 font-mono text-sm sm:text-base focus:outline-none"
                />
                <button
                    type="submit"
                    disabled={isSearching}
                    className="px-6 py-3.5 rounded-xl font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 transition-all flex items-center gap-2 shrink-0 disabled:opacity-50 cursor-pointer"
                >
                  {isSearching ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Mencari...</span>
                      </>
                  ) : (
                      <>
                        <span>Lacak Tiket</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                  )}
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-slate-500">
                <span>Contoh nomor tiket:</span>
                {['SVC-20260918-A101', 'SVC-20260918-B202', 'SVC-20260918-C303'].map((sample) => (
                    <button
                        key={sample}
                        type="button"
                        onClick={() => handleSampleSearch(sample)}
                        className="font-mono bg-white border border-slate-200 hover:border-blue-300 hover:text-blue-600 text-slate-600 px-2.5 py-1 rounded-md transition-colors shadow-sm"
                    >
                      {sample}
                    </button>
                ))}
              </div>
            </motion.form>
          </section>

          {/* TRACKING RESULTS */}
          <AnimatePresence mode="wait">
            {trackError && (
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="max-w-2xl mx-auto p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3 shadow-sm"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                  <span className="font-medium">{trackError}</span>
                </motion.div>
            )}

            {trackedOrder && (
                <motion.section
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-500 font-mono font-semibold">NOMOR TIKET:</span>
                        <StatusBadge status={trackedOrder.status} />
                      </div>
                      <h2 className="text-2xl font-bold font-mono text-slate-900 mt-1">
                        {trackedOrder.orderNumber}
                      </h2>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-xs text-slate-500 block">Tanggal Masuk</span>
                      <span className="text-sm font-semibold text-slate-900">
                    {formatDate(trackedOrder.createdAt)}
                  </span>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-6">
                    <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span>Progres Perbaikan</span>
                    </h4>
                    <StatusStepper currentStatus={trackedOrder.status} updatedAt={trackedOrder.updatedAt} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-sm">
                      <h4 className="text-sm font-bold text-blue-700">Rincian Perangkat</h4>
                      <div className="space-y-2 text-sm text-slate-700">
                        <div className="flex justify-between border-b border-slate-100 pb-2">
                          <span className="text-slate-500">Kategori:</span>
                          <span className="font-semibold">{trackedOrder.category}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-100 pb-2">
                          <span className="text-slate-500">Merek & Tipe:</span>
                          <span className="font-semibold">{trackedOrder.brand} {trackedOrder.modelName}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-100 pb-2">
                          <span className="text-slate-500">Serial Number:</span>
                          <span className="font-mono font-medium">{trackedOrder.serialNumber || '-'}</span>
                        </div>
                        <div className="pt-1">
                          <span className="text-slate-500 block mb-1.5 text-xs">Keluhan Kendala:</span>
                          <p className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-700 text-sm">
                            {trackedOrder.issueDescription}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-sm">
                      <h4 className="text-sm font-bold text-emerald-700">Estimasi Biaya & Catatan</h4>
                      <div className="space-y-3 text-sm text-slate-700">
                        <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                          <span className="text-slate-500 text-xs font-semibold">Estimasi Biaya:</span>
                          <span className="text-base font-bold font-mono text-slate-900">
                        {formatRupiah(trackedOrder.estimatedCost)}
                      </span>
                        </div>

                        <div className="flex justify-between items-center bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                          <span className="text-emerald-700 text-xs font-semibold">Total Biaya Final:</span>
                          <span className="text-base font-bold font-mono text-emerald-700">
                        {formatRupiah(trackedOrder.totalCost)}
                      </span>
                        </div>

                        <div className="pt-1">
                          <span className="text-slate-500 block mb-1.5 text-xs">Catatan Teknisi:</span>
                          <p className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-600 text-sm italic">
                            {trackedOrder.completionNotes || 'Belum ada catatan penanganan dari teknisi.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.section>
            )}
          </AnimatePresence>

          {/* TICKET FORM SECTION */}
          <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm">
            <div className="max-w-3xl mx-auto space-y-8">
              <div className="text-center space-y-2">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono">
                Pengajuan Servis
              </span>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                  Formulir Perbaikan Perangkat
                </h2>
                <p className="text-slate-500 text-xs sm:text-sm">
                  Pilih jenis perangkat dan jelaskan kendala yang dialami untuk mendapatkan nomor tiket perbaikan secara instan.
                </p>
              </div>

              {/* Success Created Toast Modal */}
              {createdResi && (
                  <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-lg space-y-4"
                  >
                    <div className="flex items-center gap-3 text-emerald-700">
                      <div className="p-2 rounded-full bg-emerald-100 border border-emerald-300">
                        <Check className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-base text-emerald-900">Tiket Perbaikan Berhasil Dibuat!</h4>
                        <p className="text-xs text-emerald-700">Simpan nomor tiket berikut untuk memantau status perbaikan Anda.</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-emerald-200 font-mono shadow-sm">
                      <span className="text-lg font-bold text-blue-700">{createdResi}</span>
                      <button
                          type="button"
                          onClick={() => handleCopyResi(createdResi)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-600 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        {copiedResi ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Tersalin!</span>
                            </>
                        ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Salin Tiket</span>
                            </>
                        )}
                      </button>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                          type="button"
                          onClick={() => {
                            setCreatedResi(null);
                            handleSampleSearch(createdResi);
                          }}
                          className="w-full py-2.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white text-sm transition-all text-center shadow-sm"
                      >
                        Lacak Tiket Ini
                      </button>
                      <button
                          type="button"
                          onClick={() => setCreatedResi(null)}
                          className="px-4 py-2.5 rounded-xl font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm transition-all shadow-sm"
                      >
                        Tutup
                      </button>
                    </div>
                  </motion.div>
              )}

              <form onSubmit={handleTicketSubmit} className="space-y-6">
                {/* Step 1 */}
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-3">
                    1. Pilih Jenis Perangkat
                  </label>
                  <DeviceCategorySelector value={category} onChange={(cat) => setCategory(cat)} />
                </div>

                {/* Step 2 */}
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-800">
                    2. Detail Perangkat & Kendala
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">Merek / Brand *</label>
                      <input
                          type="text"
                          required
                          placeholder="Contoh: ASUS, Samsung, LG, Sharp"
                          value={brand}
                          onChange={(e) => setBrand(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">Model / Tipe Perangkat *</label>
                      <input
                          type="text"
                          required
                          placeholder="Contoh: ROG Zephyrus G14, S23 Ultra"
                          value={modelName}
                          onChange={(e) => setModelName(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nomor Seri / Serial Number (Opsional)</label>
                    <input
                        type="text"
                        placeholder="Contoh: SN-99201882"
                        value={serialNumber}
                        onChange={(e) => setSerialNumber(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 font-mono transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Deskripsi Kendala / Kerusakan *</label>
                    <textarea
                        required
                        rows={4}
                        placeholder="Jelaskan masalahnya secara ringkas (misal: Mati total setelah lonjakan listrik, layar bergaris, atau suara bising)..."
                        value={issueDescription}
                        onChange={(e) => setIssueDescription(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 leading-relaxed transition-all"
                    />
                  </div>
                </div>

                {/* Step 3 */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <label className="block text-sm font-bold text-slate-800">
                    3. Kontak Pemilik
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nama Lengkap</label>
                      <input
                          type="text"
                          placeholder="Contoh: Budi Santoso"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email</label>
                      <input
                          type="email"
                          placeholder="budi@example.com"
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 font-mono transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nomor WhatsApp / HP</label>
                      <input
                          type="text"
                          placeholder="081234567890"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 font-mono transition-all"
                      />
                    </div>
                  </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-2xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer text-base mt-2"
                >
                  {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Memproses Pengajuan...</span>
                      </>
                  ) : (
                      <>
                        <ShieldCheck className="w-5 h-5" />
                        <span>Kirim Pengajuan Perbaikan</span>
                      </>
                  )}
                </button>
              </form>
            </div>
          </section>
        </main>
      </div>
  );
}