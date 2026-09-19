'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/lib/api';
import { Wrench, Mail, Lock, User, Phone, ArrowRight, Loader2 } from 'lucide-react';

export default function RegisterPage() {
    const router = useRouter();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Konfirmasi password tidak cocok.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Panggil API register
            await registerUser({
                fullName,
                email,
                phone,
                password,
            } as any);

            // Setelah berhasil daftar, langsung masuk ke dashboard
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Gagal mendaftar. Silakan coba lagi.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-6 my-8">
                {/* Header Logo */}
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/30 mb-2">
                        <Wrench className="w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center gap-1.5">
                        ElectroFix <span className="text-blue-600 font-mono text-xs">PRO</span>
                    </h1>
                    <h2 className="text-xl font-bold text-slate-900">Daftar Akun Baru</h2>
                    <p className="text-xs text-slate-500">
                        Buat akun untuk mulai menggunakan layanan perbaikan elektronik.
                    </p>
                </div>

                {/* Card Form */}
                <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50 space-y-5">
                    {error && (
                        <div className="p-3 text-xs bg-red-50 border border-red-200 text-red-600 rounded-xl text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-4">
                        {/* Nama Lengkap */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap</label>
                            <div className="relative">
                                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                                <input
                                    type="text"
                                    required
                                    placeholder="Nama Lengkap Anda"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition-all"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                            <div className="relative">
                                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                                <input
                                    type="email"
                                    required
                                    placeholder="nama@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition-all"
                                />
                            </div>
                        </div>

                        {/* Nomor HP / WhatsApp */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor WhatsApp / HP</label>
                            <div className="relative">
                                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                                <input
                                    type="tel"
                                    required
                                    placeholder="08123456789"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition-all"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                            <div className="relative">
                                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition-all"
                                />
                            </div>
                        </div>

                        {/* Konfirmasi Password */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Konfirmasi Password</label>
                            <div className="relative">
                                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition-all"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Memproses...</span>
                                </>
                            ) : (
                                <>
                                    <span>Daftar Sekarang</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Area Tautan Navigasi */}
                    <div className="text-center pt-2 space-y-3">
                        <p className="text-xs text-slate-500">
                            Sudah punya akun?{' '}
                            <Link href="/login" className="font-bold text-blue-600 hover:underline">
                                Masuk di sini
                            </Link>
                        </p>

                        <div>
                            <Link
                                href="/"
                                className="text-xs text-slate-400 hover:text-slate-700 font-medium hover:underline transition-all"
                            >
                                Kembali ke Menu
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}