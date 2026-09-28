'use client';

import React, { useState } from 'react';
import { Calculator, Clock, MessageCircle, Wrench } from 'lucide-react';

// Data terpusat: Kategori, Daftar Kerusakan, Harga, & Estimasi Waktu
const SERVICE_DATA = {
    GADGET_COMPUTER: {
        label: 'Gadget & Komputer (Laptop, HP, Tablet)',
        issues: [
            { id: 'lcd', label: 'Layar / LCD Pecah / Blank', price: 'Rp 450.000 - Rp 1.400.000', time: '1 - 3 Jam' },
            { id: 'baterai', label: 'Baterai Drop / Bocor', price: 'Rp 250.000 - Rp 850.000', time: '45 Menit' },
            { id: 'ic', label: 'Mati Total / IC Power / Short', price: 'Rp 500.000 - Rp 1.800.000', time: '2 - 4 Hari' },
            { id: 'clean', label: 'Overheat / Cleaning & Thermal Paste', price: 'Rp 100.000 - Rp 250.000', time: '1 Jam' },
        ]
    },
    AUDIO_VIDEO: {
        label: 'Audio & Video (TV, Speaker, Display)',
        issues: [
            { id: 'tv_backlight', label: 'TV Ada Suara Tanpa Gambar (Backlight)', price: 'Rp 350.000 - Rp 850.000', time: '1 - 2 Hari' },
            { id: 'tv_panel', label: 'Layar Bergaris / Panel LCD TV', price: 'Rp 800.000 - Rp 2.500.000', time: '2 - 3 Hari' },
            { id: 'speaker_sound', label: 'Speaker Suara Pecah / Mati Sebelah', price: 'Rp 150.000 - Rp 450.000', time: '1 Hari' },
            { id: 'power_board', label: 'Mati Total / Board Power Supply', price: 'Rp 300.000 - Rp 750.000', time: '1 - 2 Hari' },
        ]
    },
    HOME_APPLIANCES: {
        label: 'Peralatan Rumah Tangga (Kulkas, Mesin Cuci)',
        issues: [
            { id: 'kulkas_dingin', label: 'Kulkas Tidak Dingin / Tambah Freon', price: 'Rp 350.000 - Rp 850.000', time: '1 - 2 Hari' },
            { id: 'mesin_putar', label: 'Mesin Cuci Tidak Muter / Pengering Rusak', price: 'Rp 250.000 - Rp 600.000', time: '1 Hari' },
            { id: 'modul_pcb', label: 'Modul PCB Error / Mati Total', price: 'Rp 400.000 - Rp 1.200.000', time: '2 - 3 Hari' },
            { id: 'bocor_air', label: 'Bocor Air / Saluran Pembuangan Tersumbat', price: 'Rp 150.000 - Rp 350.000', time: '2 - 4 Jam' },
        ]
    },
    OTHER: {
        label: 'Lainnya (Konsol Game, Small Appliances)',
        issues: [
            { id: 'konsol_drift', label: 'Stik Analog Drift / Port HDMI', price: 'Rp 150.000 - Rp 450.000', time: '1 Hari' },
            { id: 'general_service', label: 'Pengecekan / Kerusakan Lainnya', price: 'Hubungi CS', time: '-' },
        ]
    }
} as const;

type DeviceType = keyof typeof SERVICE_DATA;

interface EstimationCalculatorProps {
    onOpenOrderModal?: () => void;
}

export default function EstimationCalculator({ onOpenOrderModal }: EstimationCalculatorProps) {
    const [estDevice, setEstDevice] = useState<DeviceType>('GADGET_COMPUTER');
    const [estIssue, setEstIssue] = useState<string>(SERVICE_DATA.GADGET_COMPUTER.issues[0].id);

    const handleDeviceChange = (device: DeviceType) => {
        setEstDevice(device);
        // Otomatis atur opsi kerusakan ke item pertama dari kategori baru
        setEstIssue(SERVICE_DATA[device].issues[0].id);
    };

    // Ambil daftar kerusakan sesuai kategori aktif
    const availableIssues = SERVICE_DATA[estDevice].issues;

    // Cari data harga & waktu berdasarkan kerusakan yang dipilih
    const currentEstimation = availableIssues.find((item) => item.id === estIssue) || availableIssues[0];

    // Format  WhatsApp
    const waText = encodeURIComponent(
        `Halo ElectroFix, saya mau konsultasi servis ${SERVICE_DATA[estDevice].label} dengan masalah: ${currentEstimation.label}.`
    );

    return (
        <section id="estimasi" className="max-w-4xl mx-auto px-4 pt-20">
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-800 space-y-6">
                <div className="space-y-2 text-center sm:text-left">
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-widest flex items-center justify-center sm:justify-start gap-1.5">
                        <Calculator className="w-4 h-4" /> Simulasi Biaya Instan
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black">Hitung Estimasi Biaya &amp; Waktu</h2>
                    <p className="text-xs text-slate-400">Pilih tipe perangkat dan indikasi masalah untuk mengetahui perkiraan biaya perbaikan.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Select Tipe Perangkat */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300">Pilih Tipe Perangkat</label>
                        <select
                            value={estDevice}
                            onChange={(e) => handleDeviceChange(e.target.value as DeviceType)}
                            className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3.5 py-3 text-xs outline-none focus:border-blue-500 font-medium cursor-pointer"
                        >
                            {(Object.keys(SERVICE_DATA) as DeviceType[]).map((key) => (
                                <option key={key} value={key}>
                                    {SERVICE_DATA[key].label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Select Gejala / Kerusakan Dinamis */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300">Pilih Gejala / Kerusakan</label>
                        <select
                            value={estIssue}
                            onChange={(e) => setEstIssue(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3.5 py-3 text-xs outline-none focus:border-blue-500 font-medium cursor-pointer"
                        >
                            {availableIssues.map((issue) => (
                                <option key={issue.id} value={issue.id}>
                                    {issue.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Ringkasan Hasil */}
                <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="space-y-1 text-center sm:text-left">
                        <span className="text-[10px] text-slate-400 font-mono uppercase">Perkiraan Biaya &amp; Waktu</span>
                        <p className="text-lg sm:text-xl font-black text-blue-400">{currentEstimation.price}</p>
                        <p className="text-xs text-slate-300 flex items-center justify-center sm:justify-start gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" /> Waktu Pengerjaan: <span className="font-bold">{currentEstimation.time}</span>
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <button
                            onClick={onOpenOrderModal}
                            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 shadow-md shadow-blue-600/30"
                        >
                            <Wrench className="w-4 h-4" />
                            <span>Servis Sekarang</span>
                        </button>

                        <a
                            href={`https://wa.me/6281234567890?text=${waText}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shrink-0 cursor-pointer"
                        >
                            <MessageCircle className="w-4 h-4" />
                            <span>Konsultasi WA</span>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}