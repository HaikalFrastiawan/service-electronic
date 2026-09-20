'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Wrench, LayoutGrid, Layers, Calculator, HelpCircle, ChevronDown, Laptop, Smartphone, Tv } from 'lucide-react';

interface NavbarProps {
    onNavigate: (id: string) => void;
    onOpenOrderModal?: () => void; // Tambahkan Prop Baru
}

export default function Navbar({ onNavigate, onOpenOrderModal }: NavbarProps) {
    const [openNavMenu, setOpenNavMenu] = useState<string | null>(null);
    const navRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (navRef.current && !navRef.current.contains(e.target as Node)) {
                setOpenNavMenu(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNavClick = (id: string) => {
        setOpenNavMenu(null);
        onNavigate(id);
    };

    return (
        <header ref={navRef} className="fixed top-4 inset-x-0 z-50 max-w-6xl mx-auto px-4">
            <nav className="bg-white/85 backdrop-blur-md rounded-2xl border border-white/80 shadow-xl shadow-slate-900/5 px-5 py-2.5 flex items-center justify-between transition-all">
                <Link href="/" className="flex items-center gap-2.5 font-extrabold text-slate-800 text-sm tracking-wide hover:opacity-80 transition-opacity">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/20">
                        <Wrench className="w-4 h-4" />
                    </div>
                    <span className="font-black">ElectroFix <span className="text-blue-600 font-mono text-xs">PRO</span></span>
                </Link>

                <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600 relative">
                    {/* Dropdown Layanan */}
                    <div className="relative">
                        <button
                            onClick={() => setOpenNavMenu(openNavMenu === 'layanan' ? null : 'layanan')}
                            className={`flex items-center gap-1.5 hover:text-blue-600 transition-colors cursor-pointer py-1 ${openNavMenu === 'layanan' ? 'text-blue-600 font-bold' : ''}`}
                        >
                            <LayoutGrid className="w-3.5 h-3.5 text-slate-400" />
                            <span>Layanan</span>
                            <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${openNavMenu === 'layanan' ? 'rotate-180' : ''}`} />
                        </button>

                        {openNavMenu === 'layanan' && (
                            <div className="absolute top-full left-0 mt-3 w-64 bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/80 shadow-xl p-3 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
                                <button onClick={() => handleNavClick('layanan')} className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 flex items-center gap-3 transition-colors">
                                    <Laptop className="w-4 h-4 text-blue-600" />
                                    <div>
                                        <p className="font-bold text-slate-800 text-xs">Laptop &amp; MacBook</p>
                                        <p className="text-[10px] text-slate-400">Ganti Screen, Keyboard, Chipset</p>
                                    </div>
                                </button>
                                <button onClick={() => handleNavClick('layanan')} className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 flex items-center gap-3 transition-colors">
                                    <Smartphone className="w-4 h-4 text-blue-600" />
                                    <div>
                                        <p className="font-bold text-slate-800 text-xs">Smartphone &amp; Tablet</p>
                                        <p className="text-[10px] text-slate-400">LCD, Baterai, Face ID, Bypass</p>
                                    </div>
                                </button>
                                <button onClick={() => handleNavClick('layanan')} className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 flex items-center gap-3 transition-colors">
                                    <Tv className="w-4 h-4 text-blue-600" />
                                    <div>
                                        <p className="font-bold text-slate-800 text-xs">TV &amp; Smart Devices</p>
                                        <p className="text-[10px] text-slate-400">Power Supply, Mainboard</p>
                                    </div>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Dropdown Alur Kerja */}
                    <div className="relative">
                        <button
                            onClick={() => setOpenNavMenu(openNavMenu === 'alur' ? null : 'alur')}
                            className={`flex items-center gap-1.5 hover:text-blue-600 transition-colors cursor-pointer py-1 ${openNavMenu === 'alur' ? 'text-blue-600 font-bold' : ''}`}
                        >
                            <Layers className="w-3.5 h-3.5 text-slate-400" />
                            <span>Alur Kerja</span>
                            <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${openNavMenu === 'alur' ? 'rotate-180' : ''}`} />
                        </button>

                        {openNavMenu === 'alur' && (
                            <div className="absolute top-full left-0 mt-3 w-56 bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/80 shadow-xl p-3 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
                                <button onClick={() => handleNavClick('alur-kerja')} className="w-full text-left p-2 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-700">1. Penerimaan &amp; Diagnosa</button>
                                <button onClick={() => handleNavClick('alur-kerja')} className="w-full text-left p-2 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-700">2. Estimasi &amp; Persetujuan</button>
                                <button onClick={() => handleNavClick('alur-kerja')} className="w-full text-left p-2 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-700">3. Proses Pengerjaan</button>
                                <button onClick={() => handleNavClick('alur-kerja')} className="w-full text-left p-2 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-700">4. QC &amp; Garansi</button>
                            </div>
                        )}
                    </div>

                    <button onClick={() => handleNavClick('estimasi')} className="flex items-center gap-1.5 hover:text-blue-600 transition-colors cursor-pointer py-1">
                        <Calculator className="w-3.5 h-3.5 text-slate-400" />
                        <span>Cek Estimasi</span>
                    </button>

                    <button onClick={() => handleNavClick('faq')} className="flex items-center gap-1.5 hover:text-blue-600 transition-colors cursor-pointer py-1">
                        <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                        <span>FAQ</span>
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <Link href="/login" className="text-xs font-bold text-slate-600 hover:text-blue-600 px-3 py-2 hidden sm:block transition-colors">
                        Masuk
                    </Link>

                    {/* Ubah onClick di sini agar memicu Modal Order */}
                    <button
                        onClick={onOpenOrderModal}
                        className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-[11px] tracking-wider uppercase shadow-md shadow-blue-600/30 active:scale-95 transition-all cursor-pointer"
                    >
                        Servis Sekarang
                    </button>
                </div>
            </nav>
        </header>
    );
}