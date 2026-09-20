'use client';

import React, { useState } from 'react';
import { Calculator, Clock, MessageCircle, Wrench } from 'lucide-react';

interface EstimationCalculatorProps {
    onOpenOrderModal?: () => void;
}

export default function EstimationCalculator({ onOpenOrderModal }: EstimationCalculatorProps) {
    const [estDevice, setEstDevice] = useState('laptop');
    const [estIssue, setEstIssue] = useState('lcd');

    const getEstimationResult = () => {
        const prices: Record<string, Record<string, { price: string; time: string }>> = {
            laptop: {
                lcd: { price: 'Rp 650.000 - Rp 1.400.000', time: '1 - 3 Jam' },
                baterai: { price: 'Rp 450.000 - Rp 850.000', time: '45 Menit' },
                ic: { price: 'Rp 750.000 - Rp 1.800.000', time: '2 - 4 Hari' },
                clean: { price: 'Rp 150.000 - Rp 250.000', time: '1 Jam' },
            },
            phone: {
                lcd: { price: 'Rp 350.000 - Rp 1.200.000', time: '1 Jam' },
                baterai: { price: 'Rp 250.000 - Rp 600.000', time: '30 Menit' },
                ic: { price: 'Rp 500.000 - Rp 1.100.000', time: '1 - 3 Hari' },
                clean: { price: 'Rp 100.000', time: '30 Menit' },
            },
            tv: {
                lcd: { price: 'Rp 800.000 - Rp 2.500.000', time: '1 - 2 Hari' },
                baterai: { price: 'Rp 350.000 (Power Supply)', time: '1 Hari' },
                ic: { price: 'Rp 600.000 - Rp 1.500.000', time: '2 Hari' },
                clean: { price: 'Rp 150.000', time: '1 Jam' },
            }
        };
        return prices[estDevice]?.[estIssue] || { price: 'Hubungi CS', time: '-' };
    };

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
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300">Pilih Tipe Perangkat</label>
                        <select
                            value={estDevice}
                            onChange={(e) => setEstDevice(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3.5 py-3 text-xs outline-none focus:border-blue-500 font-medium cursor-pointer"
                        >
                            <option value="laptop">Laptop / MacBook</option>
                            <option value="phone">Smartphone / iPhone</option>
                            <option value="tv">TV / Smart Display</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300">Pilih Gejala / Kerusakan</label>
                        <select
                            value={estIssue}
                            onChange={(e) => setEstIssue(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3.5 py-3 text-xs outline-none focus:border-blue-500 font-medium cursor-pointer"
                        >
                            <option value="lcd">Layar / LCD Pecah / Blank</option>
                            <option value="baterai">Baterai Drop / Not Charging</option>
                            <option value="ic">Mati Total / IC Power / Short</option>
                            <option value="clean">Overheat / Cleaning &amp; Pasta</option>
                        </select>
                    </div>
                </div>

                <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="space-y-1 text-center sm:text-left">
                        <span className="text-[10px] text-slate-400 font-mono uppercase">Perkiraan Biaya &amp; Waktu</span>
                        <p className="text-lg sm:text-xl font-black text-blue-400">{getEstimationResult().price}</p>
                        <p className="text-xs text-slate-300 flex items-center justify-center sm:justify-start gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" /> Waktu Pengerjaan: <span className="font-bold">{getEstimationResult().time}</span>
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
                            href={`https://wa.me/6281234567890?text=Halo%20ElectroFix,%20saya%20mau%20konsultasi%20servis%20${estDevice}%20masalah%20${estIssue}`}
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