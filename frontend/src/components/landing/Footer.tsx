'use client';

import React from 'react';
import { Wrench } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-white py-10 border-t border-slate-200/80 text-center text-xs text-slate-500">
            <div className="max-w-6xl mx-auto px-4 space-y-3">
                <div className="flex items-center justify-center gap-2 font-extrabold text-slate-900">
                    <Wrench className="w-4 h-4 text-blue-600" />
                    <span>ElectroFix PRO</span>
                </div>
                <p>© 2026 ElectroFix PRO. Layanan Perbaikan Elektronik Transparan &amp; Terpercaya.</p>
            </div>
        </footer>
    );
}