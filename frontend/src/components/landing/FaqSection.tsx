'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { FAQS } from '@/data/landingData';

export default function FaqSection() {
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    return (
        <section id="faq" className="max-w-4xl mx-auto px-4 py-20 space-y-8">
            <div className="text-center space-y-2">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Pertanyaan Umum</span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Sering Ditanyakan</h2>
            </div>

            <div className="space-y-3">
                {FAQS.map((faq, idx) => (
                    <div key={idx} className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm transition-all">
                        <button
                            onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                            className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-900 hover:text-blue-600 cursor-pointer"
                        >
                            <span>{faq.q}</span>
                            {openFaq === idx ? (
                                <ChevronUp className="w-4 h-4 text-blue-600 shrink-0" />
                            ) : (
                                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                            )}
                        </button>
                        {openFaq === idx && (
                            <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                                {faq.a}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}