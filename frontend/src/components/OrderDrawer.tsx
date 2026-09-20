'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wrench, User, Laptop, CheckCircle, Loader2 } from 'lucide-react';
import { ServiceOrderResponse, ServiceStatus, UpdateServiceStatusRequest } from '@/lib/types';
import { StatusBadge } from './StatusBadge';
import { formatDate } from '@/lib/utils';

interface OrderDrawerProps {
  order: ServiceOrderResponse | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateOrder: (orderId: string, data: UpdateServiceStatusRequest) => Promise<void>;
}

export const OrderDrawer: React.FC<OrderDrawerProps> = ({ order, isOpen, onClose, onUpdateOrder }) => {
  const [status, setStatus] = useState<ServiceStatus>('PENDING');
  const [estimatedCost, setEstimatedCost] = useState<string>('');
  const [totalCost, setTotalCost] = useState<string>('');
  const [completionNotes, setCompletionNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (order) {
      setStatus(order.status);
      setEstimatedCost(order.estimatedCost ? String(order.estimatedCost) : '');
      setTotalCost(order.totalCost ? String(order.totalCost) : '');
      setCompletionNotes(order.completionNotes || '');
      setSuccessMessage(null);
    }
  }, [order]);

  if (!order) return null;
  const formatCategory = (categoryRaw: string) => {
    const categoryLabels: Record<string, string> = {
      GADGET_COMPUTER: 'Gadget & Komputer',
      AUDIO_VIDEO: 'Audio & Video',
      HOME_APPLIANCES: 'Elektronik Rumah Tangga',
      OTHER: 'Lain-lain',
    };
    return categoryLabels[categoryRaw] || categoryRaw;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage(null);



    try {
      const updateData: UpdateServiceStatusRequest = {
        status,
        estimatedCost: estimatedCost ? parseFloat(estimatedCost) : undefined,
        totalCost: totalCost ? parseFloat(totalCost) : undefined,
        completionNotes,
      };

      await onUpdateOrder(order.id, updateData);
      setSuccessMessage('Data perbaikan & status berhasil diperbarui!');
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <AnimatePresence>
        {isOpen && (
            <div className="fixed inset-0 z-50 overflow-hidden">
              {/* Backdrop Overlay */}
              <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={onClose}
                  className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
              />

              {/* Slide-over Panel */}
              <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
                <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                    className="w-screen max-w-md bg-slate-50 border-l border-slate-200 shadow-2xl flex flex-col justify-between text-slate-900"
                >
                  {/* Header */}
                  <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-white/90 backdrop-blur sticky top-0 z-10">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">NOMOR RESI</span>
                        <StatusBadge status={order.status} />
                      </div>
                      <h3 className="text-xl font-extrabold text-blue-600 font-mono tracking-tight mt-1">
                        {order.orderNumber}
                      </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Scrollable Content */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-5">
                    {/* Notification Toast */}
                    {successMessage && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2 shadow-xs"
                        >
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{successMessage}</span>
                        </motion.div>
                    )}

                    {/* Device Summary Card */}
                    <div className="rounded-2xl bg-white border border-slate-200/90 p-4 space-y-3 shadow-xs">
                      <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wide">
                        <Laptop className="w-4 h-4" />
                        <span>Detail Perangkat</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-slate-400 block mb-0.5">Kategori</span>
                          <span className="text-slate-800 font-semibold">{order.category}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block mb-0.5">Merek / Brand</span>
                          <span className="text-slate-800 font-semibold">{order.brand}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block mb-0.5">Model / Tipe</span>
                          <span className="text-slate-800 font-semibold">{order.modelName}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block mb-0.5">Serial Number</span>
                          <span className="text-slate-800 font-mono font-medium">{order.serialNumber || '-'}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100">
                        <span className="text-slate-400 text-[11px] font-medium block mb-1">Deskripsi Keluhan</span>
                        <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                          {order.issueDescription || 'Tidak ada deskripsi keluhan.'}
                        </p>
                      </div>
                    </div>

                    {/* Customer Details */}
                    <div className="rounded-2xl bg-white border border-slate-200/90 p-4 space-y-2.5 text-xs shadow-xs">
                      <div className="flex items-center gap-2 text-slate-700 font-bold text-xs uppercase tracking-wide">
                        <User className="w-4 h-4 text-slate-500" />
                        <span>Informasi Pelanggan</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-700">
                        <span className="text-slate-400">Email:</span>
                        <span className="font-mono font-medium text-slate-900">{order.customerEmail || '-'}</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-700">
                        <span className="text-slate-400">Tanggal Masuk:</span>
                        <span className="font-medium text-slate-800">{formatDate(order.createdAt)}</span>
                      </div>
                    </div>

                    {/* Technician Update Form */}
                    <form id="drawer-form" onSubmit={handleSubmit} className="space-y-4 pt-1">
                      <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wide border-b border-slate-200 pb-2">
                        <Wrench className="w-4 h-4" />
                        <span>Perbarui Status & Biaya Perbaikan</span>
                      </div>

                      {/* Status Dropdown */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Status Perbaikan Baru
                        </label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value as ServiceStatus)}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                        >
                          <option value="PENDING">PENDING (Antrean Diagnosa)</option>
                          <option value="IN_PROGRESS">IN_PROGRESS (Dalam Perbaikan)</option>
                          <option value="WAITING_PARTS">WAITING_PARTS (Menunggu Komponen)</option>
                          <option value="COMPLETED">COMPLETED (Selesai & Siap Diambil)</option>
                          <option value="CANCELLED">CANCELLED (Dibatalkan)</option>
                        </select>
                      </div>

                      {/* Input Biaya Format Rupiah (Rp) */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Estimasi Biaya
                          </label>
                          <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                          Rp
                        </span>
                            <input
                                type="number"
                                placeholder="750000"
                                value={estimatedCost}
                                onChange={(e) => setEstimatedCost(e.target.value)}
                                className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Biaya Final / Total
                          </label>
                          <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                          Rp
                        </span>
                            <input
                                type="number"
                                placeholder="500000"
                                value={totalCost}
                                onChange={(e) => setTotalCost(e.target.value)}
                                className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Technician Notes */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Catatan Perbaikan / Teknisi
                        </label>
                        <textarea
                            rows={3}
                            placeholder="Tuliskan komponen yang diganti, perkembangan pengerjaan, atau garansi..."
                            value={completionNotes}
                            onChange={(e) => setCompletionNotes(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 leading-relaxed transition-all"
                        />
                      </div>
                    </form>
                  </div>

                  {/* Drawer Footer Actions */}
                  <div className="p-4 border-t border-slate-200 bg-white sticky bottom-0 z-10 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                        type="submit"
                        form="drawer-form"
                        disabled={isSubmitting}
                        className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                      {isSubmitting ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Menyimpan...</span>
                          </>
                      ) : (
                          <>
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Simpan Perubahan</span>
                          </>
                      )}
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
        )}
      </AnimatePresence>
  );
};