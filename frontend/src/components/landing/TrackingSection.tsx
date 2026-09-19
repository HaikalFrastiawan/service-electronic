'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, Star } from 'lucide-react';

export default function TrackingSection() {
    const router = useRouter();
    const [resiInput, setResiInput] = useState('');

    const handleCekResi = (e: React.FormEvent) => {
        e.preventDefault();
        if (resiInput.trim()) {
            router.push(`/track?resi=${encodeURIComponent(resiInput.trim())}`);
        }
    };

    return (
        <section className="relative z-20 max-w-4xl mx-auto px-4 -mt-20">
            <div className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-8 border border-slate-200/80 shadow-[0_20px_50px_rgba(8,_112,_184,_0.08)] space-y-6">
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-extrabold text-slate-800 flex items-center gap-2">
                            <Search className="w-4 h-4 text-blue-600" />
                            <span>Cek Status Perbaikan Unit</span>
                        </label>
                        <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">Contoh: SVC-20260918-A101</span>
                    </div>

                    <form onSubmit={handleCekResi} className="flex flex-col sm:flex-row gap-2.5">
                        <input
                            type="text"
                            required
                            placeholder="MASUKKAN NOMOR RESI SERVIS..."
                            value={resiInput}
                            onChange={(e) => setResiInput(e.target.value)}
                            className="flex-1 bg-slate-50 border border-slate-200/90 rounded-2xl px-4 py-3.5 text-xs font-mono font-bold uppercase text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all"
                        />
                        <button
                            type="submit"
                            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 hover:shadow-blue-600/35 active:scale-95 transition-all cursor-pointer shrink-0"
                        >
                            <span>Pelacak Resi</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>
                </div>

                <hr className="border-slate-100" />

                <div className="grid grid-cols-3 divide-x divide-slate-100 text-center">
                    <div className="px-2 space-y-0.5">
                        <p className="text-xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">1,500+</p>
                        <p className="text-[11px] font-semibold text-slate-400">Unit Selesai</p>
                    </div>
                    <div className="px-2 space-y-0.5">
                        <p className="text-xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight flex items-center justify-center gap-1">
                            4.9 <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        </p>
                        <p className="text-[11px] font-semibold text-slate-400">Rating Google</p>
                    </div>
                    <div className="px-2 space-y-0.5">
                        <p className="text-xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight text-blue-600">100%</p>
                        <p className="text-[11px] font-semibold text-slate-400">Garansi Perbaikan</p>
                    </div>
                </div>
            </div>
        </section>
    );
}