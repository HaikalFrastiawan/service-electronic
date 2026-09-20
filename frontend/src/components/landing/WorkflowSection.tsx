'use client';

import React from 'react';
import { PackageOpen, Activity, FileCheck, ShieldCheck } from 'lucide-react';

const STEPS = [
    {
        step: '01',
        title: 'Serah Unit',
        desc: 'Datang langsung ke workshop atau kirim via kurir ekspedisi.',
        icon: PackageOpen
    },
    {
        step: '02',
        title: 'Diagnosa Gratis',
        desc: 'Teknisi menganalisis kerusakan tanpa biaya awal.',
        icon: Activity
    },
    {
        step: '03',
        title: 'Persetujuan Biaya',
        desc: 'Anda mendapatkan rincian biaya sebelum perbaikan dimulai.',
        icon: FileCheck
    },
    {
        step: '04',
        title: 'Selesai & Garansi',
        desc: 'Unit dites ketat (QC) dan diserahkan dengan garansi resmi.',
        icon: ShieldCheck
    },
];

export default function WorkflowSection() {
    return (
        <section id="alur-kerja" className="bg-slate-950 text-white py-24 relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-blue-900/20 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-6xl mx-auto px-4 space-y-16 relative z-10">
                <div className="text-center space-y-3 max-w-xl mx-auto">
          <span className="text-xs font-bold text-blue-500 uppercase tracking-widest bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-500/20">
            Sederhana &amp; Transparan
          </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-100">4 Langkah Mudah Servis Unit</h2>
                </div>

                <div className="relative">
                    {/* Garis Penghubung Putus-putus (Hanya tampil di Desktop) */}
                    <div className="hidden lg:block absolute top-10 left-[12%] right-[12%] h-[2px] border-t-2 border-dashed border-slate-700 z-0" />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                        {STEPS.map((st, i) => {
                            const Icon = st.icon;
                            return (
                                <div
                                    key={i}
                                    className="group bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-3xl p-7 relative overflow-hidden hover:-translate-y-2 hover:border-blue-500/50 hover:bg-slate-800/80 hover:shadow-[0_0_30px_rgba(37,99,235,0.15)] transition-all duration-300 cursor-default"
                                >
                                    {/* Angka Latar Belakang */}
                                    <span className="text-6xl font-black font-mono text-slate-800/50 absolute -top-0 -right-0  group-hover:text-blue-500/10 group-hover:scale-110 transition-all duration-500">
                    {st.step}
                  </span>

                                    {/* Ikon & Nomor */}
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 text-blue-400 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-blue-500/50 group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:text-white transition-all duration-300 shadow-lg">
                                        <Icon className="w-6 h-6" />
                                    </div>

                                    <h3 className="font-extrabold text-lg text-slate-200 mb-2 group-hover:text-white transition-colors">
                                        {st.step}. {st.title}
                                    </h3>
                                    <p className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                                        {st.desc}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}