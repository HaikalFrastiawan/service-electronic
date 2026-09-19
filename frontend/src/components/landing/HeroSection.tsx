'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { HERO_IMAGES } from '@/data/landingData';

export default function HeroSection() {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative min-h-[580px] flex items-center justify-center bg-slate-950 overflow-hidden pt-32 pb-28">
            {HERO_IMAGES.map((img, idx) => (
                <div
                    key={idx}
                    className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
                        idx === currentSlide ? 'opacity-30 scale-105 transition-transform duration-[8000ms]' : 'opacity-0'
                    }`}
                    style={{ backgroundImage: `url('${img}')` }}
                />
            ))}

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto px-4 text-center space-y-5">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-blue-500/30 text-blue-300 text-xs font-semibold backdrop-blur-md shadow-inner">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                    <span>Standardized Electronic Repair Workshop</span>
                </div>

                <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white leading-[1.15] tracking-tight">
                    Servis Transparan. <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-blue-200">
            Pantau Progress Real-Time.
          </span>
                </h1>

                <p className="text-slate-300 text-xs sm:text-base max-w-2xl mx-auto font-normal leading-relaxed">
                    Tak perlu repot menanyakan status perbaikan. Masukkan nomor resi untuk melihat detail bongkar, estimasi sparepart, hingga konfirmasi biaya secara terbuka.
                </p>
            </div>
        </section>
    );
}