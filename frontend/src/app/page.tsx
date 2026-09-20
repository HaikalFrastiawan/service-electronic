'use client';

import React, { useState } from 'react';

// Import Komponen Lego
import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import TrackingSection from '@/components/landing/TrackingSection';
import EstimationCalculator from '@/components/landing/EstimationCalculator';
import WorkshopSection from '@/components/landing/WorkshopSection';
import WorkflowSection from '@/components/landing/WorkflowSection';
import TestimonialSection from '@/components/landing/TestimonialSection';
import FaqSection from '@/components/landing/FaqSection';
import FloatingWhatsapp from '@/components/landing/FloatingWhatsapp';
import Footer from '@/components/landing/Footer';

// Import Modal Order Publik
import { CreateOrderModal } from '@/components/CreateOrderModal';

export default function LandingPage() {
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleOpenOrderModal = () => {
        setIsOrderModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-slate-50/60 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 scroll-smooth">
            {/* Passing props function untuk membuka modal jika tombol di Navbar/Hero diklik */}
            <Navbar onNavigate={scrollToSection} onOpenOrderModal={handleOpenOrderModal} />
            <HeroSection onOpenOrderModal={handleOpenOrderModal} />

            <TrackingSection />
            <EstimationCalculator onOpenOrderModal={handleOpenOrderModal} />
            <WorkshopSection />
            <WorkflowSection />
            <TestimonialSection />
            <FaqSection />
            <FloatingWhatsapp />
            <Footer />

            {/* Modal Form Pemesanan Publik (Tanpa Login) */}
            <CreateOrderModal
                isOpen={isOrderModalOpen}
                onClose={() => setIsOrderModalOpen(false)}
            />
        </div>
    );
}