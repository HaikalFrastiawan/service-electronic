'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function FloatingWhatsapp() {
    return (
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
    );
}