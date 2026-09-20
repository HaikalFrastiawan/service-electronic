'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle2, Loader2, Wrench, User, Smartphone } from 'lucide-react';

interface CreateOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CreateOrderModal: React.FC<CreateOrderModalProps> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        category: 'GADGET_COMPUTER',
        brand: '',
        modelName: '',
        serialNumber: '',
        issueDescription: '',
        customerName: '',
        customerPhone: '',
        customerEmail: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [createdOrderNumber, setCreatedOrderNumber] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Mengirim POST request ke backend
            const response = await fetch('http://localhost:8080/api/v1/service-orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const result = await response.json().catch(() => ({}));
                // Fleksibel membaca orderNumber baik dari result.data maupun langsung dari result
                const orderNo = result.data?.orderNumber || result.orderNumber || result.data?.id || result.id;

                if (orderNo) {
                    setCreatedOrderNumber(orderNo);
                } else {
                    alert('Pesanan berhasil dibuat!');
                    handleResetAndClose();
                }
            } else {
                // Tangani respons error (seperti 403 Forbidden / 400 Bad Request) secara aman
                const errData = await response.json().catch(() => ({}));
                alert(`Gagal membuat pesanan (${response.status}): ${errData.message || 'Akses ditolak atau data tidak valid.'}`);
            }
        } catch (error) {
            console.error('Error submitting order:', error);
            alert('Terjadi kesalahan koneksi ke server. Pastikan backend Spring Boot aktif.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResetAndClose = () => {
        setCreatedOrderNumber(null);
        setFormData({
            category: 'GADGET_COMPUTER',
            brand: '',
            modelName: '',
            serialNumber: '',
            issueDescription: '',
            customerName: '',
            customerPhone: '',
            customerEmail: '',
        });
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
                    {/* Backdrop Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleResetAndClose}
                        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
                    />

                    {/* Modal Box */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10"
                    >
                        {/* Header */}
                        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div className="flex items-center gap-2 text-blue-600 font-bold text-base">
                                <Wrench className="w-5 h-5" />
                                <span>Buat Pesanan Servis Baru</span>
                            </div>
                            <button
                                onClick={handleResetAndClose}
                                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content Area */}
                        {createdOrderNumber ? (
                            /* Success State */
                            <div className="p-8 text-center space-y-4">
                                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                                    <CheckCircle2 className="w-10 h-10" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800">Pesanan Berhasil Dibuat!</h3>
                                <p className="text-xs text-slate-500">
                                    Simpan nomor resi di bawah ini untuk melacak status perbaikan perangkat Anda secara berkala.
                                </p>
                                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xl font-extrabold text-blue-600 tracking-wider">
                                    {createdOrderNumber}
                                </div>
                                <button
                                    onClick={handleResetAndClose}
                                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition-all shadow-md shadow-blue-500/20"
                                >
                                    Selesai
                                </button>
                            </div>
                        ) : (
                            /* Form State */
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                {/* Section 1: Data Pelanggan */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wide">
                                        <User className="w-3.5 h-3.5 text-blue-600" />
                                        <span>Informasi Pemesan</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-medium text-slate-600 mb-1">Nama Lengkap *</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="Ahmad Saepulloh"
                                                value={formData.customerName}
                                                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-600 mb-1">No. WhatsApp *</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="08123456789"
                                                value={formData.customerPhone}
                                                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-600 mb-1">Email (Opsional)</label>
                                        <input
                                            type="email"
                                            placeholder="ahmad@example.com"
                                            value={formData.customerEmail}
                                            onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                                        />
                                    </div>
                                </div>

                                <hr className="border-slate-100" />

                                {/* Section 2: Detail Perangkat */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wide">
                                        <Smartphone className="w-3.5 h-3.5 text-blue-600" />
                                        <span>Detail Perangkat</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-medium text-slate-600 mb-1">Kategori *</label>
                                            <select
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                                            >
                                                <option value="GADGET_COMPUTER">Gadget & Komputer (HP, Laptop, PC)</option>
                                                <option value="AUDIO_VIDEO">Audio & Video (TV, Speaker, Monitor)</option>
                                                <option value="HOME_APPLIANCES">Peralatan Rumah (Kulkas, AC, Kipas)</option>
                                                <option value="OTHER">Lain-lain / Perangkat Lainnya</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-600 mb-1">Merek / Brand *</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="Asus, Samsung, dll."
                                                value={formData.brand}
                                                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-medium text-slate-600 mb-1">Tipe / Model *</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="ROG GL553, Galaxy S21"
                                                value={formData.modelName}
                                                onChange={(e) => setFormData({ ...formData, modelName: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-600 mb-1">Serial Number</label>
                                            <input
                                                type="text"
                                                placeholder="S/N (Jika ada)"
                                                value={formData.serialNumber}
                                                onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-600 mb-1">Deskripsi Kerusakan / Keluhan *</label>
                                        <textarea
                                            required
                                            rows={3}
                                            placeholder="Jelaskan kendala seperti: Mati total, layar pecah, tidak bisa di-charge..."
                                            value={formData.issueDescription}
                                            onChange={(e) => setFormData({ ...formData, issueDescription: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Submit Action */}
                                <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={handleResetAndClose}
                                        className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                <span>Mengirim Pesanan...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-3.5 h-3.5" />
                                                <span>Kirim Pesanan</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};