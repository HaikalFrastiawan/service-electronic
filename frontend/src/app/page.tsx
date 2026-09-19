'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Wrench,
  Search,
  ShieldCheck,
  Star,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  LayoutGrid,
  Layers,
  FileText,
  ChevronDown,
  Calculator,
  HelpCircle,
  MessageCircle,
  Clock,
  Laptop,
  Smartphone,
  Tv,
  ChevronUp,
  X
} from 'lucide-react';

// Gambar dummy Slider Hero
const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1597872250970-45d2994e433f?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=1600&auto=format&fit=crop',
];

// Foto Dokumentasi Workshop
const WORK_PHOTOS = [
  {
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop',
    title: 'Micro-Soldering Chipset Motherboard',
    category: 'Laptop & MacBook',
    badge: 'Prosedur Presisi'
  },
  {
    url: 'https://images.unsplash.com/photo-1597872250970-45d2994e433f?q=80&w=800&auto=format&fit=crop',
    title: 'Replacement LCD & Battery Original',
    category: 'Smartphone & Tablet',
    badge: 'Part Original'
  },
];

// Testimoni
const REVIEWS = [
  {
    name: 'Budi Santoso',
    device: 'MacBook Pro M1',
    rating: 5,
    comment: 'Layar sempet mati total. Di sini dicek transparan, dikonfirmasi dulu biayanya sebelum dikerjakan. 2 hari langsung beres!',
    highlight: false
  },
  {
    name: 'Siti Rahma',
    device: 'iPhone 13 Pro',
    rating: 5,
    comment: 'Suka banget bisa cek progress real-time lewat resi. Nggak perlu pusing spam chat teknisinya. Pelayanan super profesional!',
    highlight: true
  },
  {
    name: 'Rian Hidayat',
    device: 'Lenovo Legion 5',
    rating: 5,
    comment: 'Garansi perbaikannya beneran dijamin. Sempet ada kendala sepele setelah seminggu, langsung ditangani gratis tanpa banyak alasan.',
    highlight: false
  },
];

// FAQ Data
const FAQS = [
  {
    q: 'Apakah ada biaya diagnosa jika perangkat tidak jadi diservis?',
    a: 'Tidak ada biaya sama sekali (Diagnosa 100% Gratis). Jika setelah pemeriksaan Anda memilih untuk membatalkan pengerjaan, Anda dapat mengambil kembali unit tanpa dipungut biaya.'
  },
  {
    q: 'Bagaimana dengan keamanan data pribadi saya di dalam perangkat?',
    a: 'Keamanan data pelanggan adalah prioritas utama kami. Kami menerapkan Standard Operating Procedure (SOP) ketat yang melarang teknisi mengakses atau mengubah file pribadi tanpa izin tertulis dari pemilik.'
  },
  {
    q: 'Berapa lama masa garansi yang diberikan?',
    a: 'Garansi berlaku antara 30 hingga 90 hari tergantung pada jenis pergantian sparepart atau perbaikan modul IC/motherboard.'
  },
  {
    q: 'Apakah bisa melakukan servis panggilan ke rumah/kantor?',
    a: 'Untuk kerusakan ringan seperti penggantian Baterai atau Layar LCD HP/Laptop, teknisi kami bisa melakukan panggilan langsung ke lokasi Anda.'
  }
];

export default function LandingPage() {
  const router = useRouter();
  const [resiInput, setResiInput] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

  // State Navbar Dropdown & FAQ
  const [openNavMenu, setOpenNavMenu] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // State Kalkulator Estimasi Biaya
  const [estDevice, setEstDevice] = useState('laptop');
  const [estIssue, setEstIssue] = useState('lcd');

  const navRef = useRef<HTMLDivElement>(null);

  // Close navbar dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenNavMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto Slider Background
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleCekResi = (e: React.FormEvent) => {
    e.preventDefault();
    if (resiInput.trim()) {
      router.push(`/track?resi=${encodeURIComponent(resiInput.trim())}`);
    }
  };

  // Kalkulasi Harga Estimasi Singkat
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

  const scrollToSection = (id: string) => {
    setOpenNavMenu(null);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
      <div className="min-h-screen bg-slate-50/60 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 scroll-smooth">

        {/* 1. FLOATING NAVBAR DENGAN INTERACTIVE DROPDOWNS */}
        <header ref={navRef} className="fixed top-4 inset-x-0 z-50 max-w-6xl mx-auto px-4">
          <nav className="bg-white/85 backdrop-blur-md rounded-2xl border border-white/80 shadow-xl shadow-slate-900/5 px-5 py-2.5 flex items-center justify-between transition-all">

            {/* Brand Logo Kiri */}
            <Link href="/" className="flex items-center gap-2.5 font-extrabold text-slate-800 text-sm tracking-wide hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/20">
                <Wrench className="w-4 h-4" />
              </div>
              <span className="font-black">ElectroFix <span className="text-blue-600 font-mono text-xs">PRO</span></span>
            </Link>

            {/* Nav Links Tengah dengan Interaktivitas Dropdown */}
            <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600 relative">

              {/* Dropdown 1: Layanan */}
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
                      <button onClick={() => scrollToSection('layanan')} className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 flex items-center gap-3 transition-colors">
                        <Laptop className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="font-bold text-slate-800 text-xs">Laptop &amp; MacBook</p>
                          <p className="text-[10px] text-slate-400">Ganti Screen, Keyboard, Chipset</p>
                        </div>
                      </button>
                      <button onClick={() => scrollToSection('layanan')} className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 flex items-center gap-3 transition-colors">
                        <Smartphone className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="font-bold text-slate-800 text-xs">Smartphone &amp; Tablet</p>
                          <p className="text-[10px] text-slate-400">LCD, Baterai, Face ID, Bypass</p>
                        </div>
                      </button>
                      <button onClick={() => scrollToSection('layanan')} className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 flex items-center gap-3 transition-colors">
                        <Tv className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="font-bold text-slate-800 text-xs">TV &amp; Smart Devices</p>
                          <p className="text-[10px] text-slate-400">Power Supply, Mainboard</p>
                        </div>
                      </button>
                    </div>
                )}
              </div>

              {/* Dropdown 2: Alur Kerja */}
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
                      <button onClick={() => scrollToSection('alur-kerja')} className="w-full text-left p-2 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-700">
                        1. Penerimaan &amp; Diagnosa
                      </button>
                      <button onClick={() => scrollToSection('alur-kerja')} className="w-full text-left p-2 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-700">
                        2. Estimasi &amp; Persetujuan
                      </button>
                      <button onClick={() => scrollToSection('alur-kerja')} className="w-full text-left p-2 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-700">
                        3. Proses Pengerjaan
                      </button>
                      <button onClick={() => scrollToSection('alur-kerja')} className="w-full text-left p-2 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-700">
                        4. QC &amp; Garansi
                      </button>
                    </div>
                )}
              </div>

              {/* Direct Link: Estimasi Biaya */}
              <button
                  onClick={() => scrollToSection('estimasi')}
                  className="flex items-center gap-1.5 hover:text-blue-600 transition-colors cursor-pointer py-1"
              >
                <Calculator className="w-3.5 h-3.5 text-slate-400" />
                <span>Cek Estimasi</span>
              </button>

              {/* Direct Link: FAQ */}
              <button
                  onClick={() => scrollToSection('faq')}
                  className="flex items-center gap-1.5 hover:text-blue-600 transition-colors cursor-pointer py-1"
              >
                <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                <span>FAQ</span>
              </button>

            </div>

            {/* CTA Button Kanan */}
            <div className="flex items-center gap-3">
              <Link
                  href="/login"
                  className="text-xs font-bold text-slate-600 hover:text-blue-600 px-3 py-2 hidden sm:block transition-colors"
              >
                Masuk
              </Link>

              <button
                  onClick={() => scrollToSection('estimasi')}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-[11px] tracking-wider uppercase shadow-md shadow-blue-600/30 active:scale-95 transition-all cursor-pointer"
              >
                Servis Sekarang
              </button>
            </div>

          </nav>
        </header>

        {/* 2. Hero Section */}
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

        {/* 3. Floating Resi Box & Stats Bar */}
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

        {/* 4. NEW FEATURE: KALKULATOR ESTIMASI BIAYA INTERAKTIF */}
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

            {/* Result Box */}
            <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-[10px] text-slate-400 font-mono uppercase">Perkiraan Biaya &amp; Waktu</span>
                <p className="text-lg sm:text-xl font-black text-blue-400">{getEstimationResult().price}</p>
                <p className="text-xs text-slate-300 flex items-center justify-center sm:justify-start gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> Waktu Pengerjaan: <span className="font-bold">{getEstimationResult().time}</span>
                </p>
              </div>

              <a
                  href={`https://wa.me/6281234567890?text=Halo%20ElectroFix,%20saya%20mau%20konsultasi%20servis%20${estDevice}%20masalah%20${estIssue}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shrink-0"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Konsultasi WA</span>
              </a>
            </div>
          </div>
        </section>

        {/* 5. Galeri Workshop & Features */}
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

        {/* 6. NEW FEATURE: ALUR KERJA STEP-BY-STEP (01-04) */}
        <section id="alur-kerja" className="bg-slate-900 text-white py-20">
          <div className="max-w-6xl mx-auto px-4 space-y-12">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Sederhana &amp; Transparan</span>
              <h2 className="text-2xl sm:text-4xl font-black">4 Langkah Mudah Servis Unit</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { step: '01', title: 'Serah Unit', desc: 'Datang langsung ke workshop atau kirim via kurir ekspedisi.' },
                { step: '02', title: 'Diagnosa Gratis', desc: 'Teknisi menganalisis kerusakan tanpa biaya awal.' },
                { step: '03', title: 'Persetujuan Biaya', desc: 'Anda mendapatkan rincian biaya sebelum perbaikan dimulai.' },
                { step: '04', title: 'Selesai &amp; Garansi', desc: 'Unit dites ketat (QC) dan diserahkan dengan garansi resmi.' },
              ].map((st, i) => (
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

        {/* 7. Testimoni Pelanggan */}
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

        {/* 8. NEW FEATURE: FAQ ACCORDION INTERAKTIF */}
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
                    {openFaq === idx ? <ChevronUp className="w-4 h-4 text-blue-600 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
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

        {/* 9. FLOATING WHATSAPP BUTTON (Akses Cepat CS) */}
        <a
            href="https://wa.me/6281234567890?text=Halo%20ElectroFix,%20saya%20mau%20tanya%20tentang%20servis"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group"
            title="Hubungi Customer Service via WA"
        >
          <MessageCircle className="w-6 h-6 fill-white stroke-emerald-500" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 text-xs font-extrabold">
          Chat CS Kami
        </span>
        </a>

        {/* 10. Footer */}
        <footer className="bg-white py-10 border-t border-slate-200/80 text-center text-xs text-slate-500">
          <div className="max-w-6xl mx-auto px-4 space-y-3">
            <div className="flex items-center justify-center gap-2 font-extrabold text-slate-900">
              <Wrench className="w-4 h-4 text-blue-600" />
              <span>ElectroFix PRO</span>
            </div>
            <p>© 2026 ElectroFix PRO. Layanan Perbaikan Elektronik Transparan &amp; Terpercaya.</p>
          </div>
        </footer>

      </div>
  );
}