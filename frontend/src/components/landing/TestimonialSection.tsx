'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { REVIEWS } from '@/data/landingData';

export default function TestimonialSection() {
    return (
        <section className="bg-slate-100/80 border-y border-slate-200/60 py-20">
            <div className="max-w-6xl mx-auto px-4 space-y-12">
                <div className="text-center space-y-3 max-w-xl mx-auto">
                    <span className="text-xs font-extrabold text-blue-600 uppercase tracking-widest">Ulasan Pelanggan</span>
                    <h2 className="text-2xl sm:text-4xl font-black text-slate-900">Dipercaya Lebih Dari 1,500+ Pemilik Perangkat</h2>
                    <p className="text-xs sm:text-sm text-slate-500">
                        Pengalaman nyata pelanggan yang menggunakan sistem pelacakan servis ElectroFix PRO.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                    {REVIEWS.map((rev, idx) => (
                        <div
                            key={idx}
                            className={`p-7 rounded-3xl transition-all duration-300 flex flex-col justify-between space-y-6 ${
                                rev.highlight
                                    ? 'bg-gradient-to-b from-blue-600 to-indigo-700 text-white shadow-2xl shadow-blue-600/30 md:-translate-y-2'
                                    : 'bg-white border border-slate-200/80 text-slate-900 shadow-sm hover:shadow-md'
                            }`}
                        >
                            <div className="space-y-4">
                                <div className="flex gap-1">
                                    {[...Array(rev.rating)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 ${
                                                rev.highlight ? 'text-amber-300 fill-amber-300' : 'text-amber-400 fill-amber-400'
                                            }`}
                                        />
                                    ))}
                                </div>

                                <p className={`text-xs sm:text-sm leading-relaxed ${rev.highlight ? 'text-blue-50' : 'text-slate-600'}`}>
                                    "{rev.comment}"
                                </p>
                            </div>

                            <div className={`pt-4 border-t flex justify-between items-center text-xs ${
                                rev.highlight ? 'border-white/10' : 'border-slate-100'
                            }`}>
                                <span className="font-extrabold">{rev.name}</span>
                                <span
                                    className={`text-[10px] font-mono px-2.5 py-1 rounded-full font-bold ${
                                        rev.highlight ? 'bg-white/20 text-white' : 'bg-slate-100 text-blue-600'
                                    }`}
                                >
                  {rev.device}
                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}