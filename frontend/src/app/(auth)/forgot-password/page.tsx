'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, Loader2, Wrench, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Memanggil API backend Spring Boot
            // Pastikan port 8080 sesuai dengan port backend Anda
            const response = await fetch('http://localhost:8080/api/v1/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: email }),
            });

            if (!response.ok) {
                throw new Error('Gagal mengirim email dari backend');
            }

            // Jika backend merespons sukses
            setIsSuccess(true);
        } catch (error) {
            console.error('Error:', error);
            alert('Gagal mengirim email. Pastikan backend Spring Boot sudah berjalan.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans text-slate-900">
            {/* Logo */}
            <div className="mb-8 flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30 mb-4">
                    <Wrench className="w-6 h-6" />
                </div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                    ElectroFix <span className="text-blue-600 text-sm font-mono align-top">PRO</span>
                </h1>
                <p className="text-slate-500 text-sm mt-2">Pulihkan akses ke akun Anda</p>
            </div>

            {/* Card Form */}
            <div className="bg-white w-full max-w-md rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
                {isSuccess ? (
                    <div className="text-center space-y-6 animate-in fade-in zoom-in duration-300">
                        <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">Periksa Email Anda</h2>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                Kami telah mengirimkan tautan untuk mengatur ulang kata sandi ke <strong className="text-slate-800">{email}</strong>.
                            </p>
                        </div>
                        <Link
                            href="/login"
                            className="block w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md shadow-blue-600/20 transition-all text-center"
                        >
                            Kembali ke Halaman Login
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="mb-6">
                            <h2 className="text-lg font-bold text-slate-900">Lupa Password?</h2>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                Masukkan email yang terdaftar pada akun Anda. Kami akan mengirimkan tautan untuk membuat kata sandi baru.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Alamat Email
                                </label>
                                <div className="relative">
                                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                                    <input
                                        type="email"
                                        required
                                        placeholder="contoh@gmail.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition-all"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting || !email}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Memproses...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Kirim Tautan Reset</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>
                    </>
                )}
            </div>

            {/* Footer Link */}
            {!isSuccess && (
                <div className="mt-8">
                    <Link
                        href="/login"
                        className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Kembali ke halaman masuk</span>
                    </Link>
                </div>
            )}
        </div>
    );
}