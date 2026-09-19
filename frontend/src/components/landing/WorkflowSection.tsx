'use client';

import React from 'react';

const STEPS = [
    { step: '01', title: 'Serah Unit', desc: 'Datang langsung ke workshop atau kirim via kurir ekspedisi.' },
    { step: '02', title: 'Diagnosa Gratis', desc: 'Teknisi menganalisis kerusakan tanpa biaya awal.' },
    { step: '03', title: 'Persetujuan Biaya', desc: 'Anda mendapatkan rincian biaya sebelum perbaikan dimulai.' },
    { step: '04', title: 'Selesai & Garansi', desc: 'Unit dites ketat (QC) dan diserahkan dengan garansi resmi.' },
];

export default function WorkflowSection() {
    return (
        <section id="alur-kerja" className="bg-slate-900 text-white py-20">
            <div className="max-w-6xl mx-auto px-4 space-y-12">
                <div className="text-center space-y-2 max-w-xl mx-auto">
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Sederhana &amp; Transparan</span>
                    <h2 className="text-2xl sm:text-4xl font-black">4 Langkah Mudah Servis Unit</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {STEPS.map((st, i) => (
                        <div key={i} className="bg-slate-800/50 border border-slate-700/60 rounded-3xl p-6 space-y-3 relative overflow-hidden">
                            <span className="text-4xl font-black font-mono text-blue-500/20 absolute top-4 right-4">{st.step}</span>
                            <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 font-bold font-mono text-xs flex items-center justify-center">
                                {st.step}
                            </div>
                            <h3 className="font-extrabold text-sm">{st.title}</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">{st.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}