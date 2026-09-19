'use client';

import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { WORK_PHOTOS } from '@/data/landingData';

export default function WorkshopSection() {
    return (
        <section id="layanan" className="max-w-6xl mx-auto px-4 py-20 space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 space-y-6">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Transparansi Workshop</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
                        Pengerjaan Profesional dengan Peralatan Standar Pabrik
                    </h2>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                        Setiap unit yang masuk langsung ditangani oleh teknisi bersertifikat di meja kerja khusus, menggunakan mikroskop analisis komponen dan solder temperatur terkalibrasi.
                    </p>

                    <div className="space-y-3 pt-2">
                        <div className="flex items-center gap-3 text-xs font-bold text-slate-800">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span>Pemeriksaan IC &amp; Kelistrikan dengan Mikroskop</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs font-bold text-slate-800">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span>Penggunaan Sparepart Grade Original</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs font-bold text-slate-800">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span>Pembersihan Thermal &amp; Debu Setiap Unit</span>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {WORK_PHOTOS.map((item, idx) => (
                        <div key={idx} className="group bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                            <div className="h-52 overflow-hidden relative">
                                <img
                                    src={item.url}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                  {item.badge}
                </span>
                                <span className="absolute bottom-3 left-3 text-white text-[11px] font-mono font-bold">
                  {item.category}
                </span>
                            </div>
                            <div className="p-4 bg-white">
                                <h3 className="font-bold text-xs text-slate-800 line-clamp-1">{item.title}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}