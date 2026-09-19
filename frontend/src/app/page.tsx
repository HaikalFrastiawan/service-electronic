'use client';

import React from 'react';

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

export default function LandingPage() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
      <div className="min-h-screen bg-slate-50/60 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 scroll-smooth">
        <Navbar onNavigate={scrollToSection} />
        <HeroSection />
        <TrackingSection />
        <EstimationCalculator />
        <WorkshopSection />
        <WorkflowSection />
        <TestimonialSection />
        <FaqSection />
        <FloatingWhatsapp />
        <Footer />
      </div>
  );
}