'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Wrench, Package, CheckCircle2, AlertCircle } from 'lucide-react';
import { ServiceStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

interface StatusStepperProps {
  currentStatus: ServiceStatus;
  updatedAt?: string;
}

const STEPS: { status: ServiceStatus; label: string; icon: React.ElementType; description: string }[] = [
  {
    status: 'PENDING',
    label: 'Pesanan Diterima',
    icon: Clock,
    description: 'Menunggu pemeriksaan awal & diagnosa teknisi',
  },
  {
    status: 'IN_PROGRESS',
    label: 'Dalam Perbaikan',
    icon: Wrench,
    description: 'Teknisi sedang melakukan perbaikan komprehensif',
  },
  {
    status: 'WAITING_PARTS',
    label: 'Menunggu Sparepart',
    icon: Package,
    description: 'Pemesanan komponen pengganti original',
  },
  {
    status: 'COMPLETED',
    label: 'Perbaikan Selesai',
    icon: CheckCircle2,
    description: 'Unit siap diambil & pengujian kualitas berhasil',
  },
];

export const StatusStepper: React.FC<StatusStepperProps> = ({ currentStatus, updatedAt }) => {
  if (currentStatus === 'CANCELLED') {
    return (
      <div className="rounded-2xl bg-red-50 border border-red-200 p-6 text-center text-red-800 shadow-sm">
        <AlertCircle className="w-10 h-10 text-red-600 mx-auto mb-3 animate-pulse" />
        <h4 className="text-lg font-bold text-red-900">Status: Dibatalkan (CANCELLED)</h4>
        <p className="text-sm text-red-700 mt-1">
          Permintaan perbaikan ini telah dibatalkan. Silakan hubungi customer service kami untuk informasi lebih lanjut.
        </p>
      </div>
    );
  }

  const getStepIndex = (status: ServiceStatus): number => {
    switch (status) {
      case 'PENDING':
        return 0;
      case 'IN_PROGRESS':
        return 1;
      case 'WAITING_PARTS':
        return 2;
      case 'COMPLETED':
        return 3;
      default:
        return 0;
    }
  };

  const activeIndex = getStepIndex(currentStatus);
  const progressPercentage = (activeIndex / (STEPS.length - 1)) * 100;

  return (
    <div className="w-full py-4 px-2">
      {/* Horizontal timeline container */}
      <div className="relative mb-8">
        {/* Background track bar */}
        <div className="absolute top-1/2 left-0 right-0 h-2 -translate-y-1/2 bg-slate-200 rounded-full z-0" />

        {/* Active progress bar */}
        <motion.div
          className="absolute top-1/2 left-0 h-2 -translate-y-1/2 bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-500 rounded-full z-0 shadow-sm"
          initial={{ width: '0%' }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        />

        {/* Step Nodes */}
        <div className="relative z-10 flex justify-between items-center">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isPassed = idx < activeIndex;
            const isCurrent = idx === activeIndex;
            const isUpcoming = idx > activeIndex;

            return (
              <div key={step.status} className="flex flex-col items-center">
                <motion.div
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1.2 : 1,
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border-2 shadow-sm',
                    isPassed && 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20',
                    isCurrent && 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/30 ring-4 ring-blue-100',
                    isUpcoming && 'bg-slate-100 border-slate-300 text-slate-400'
                  )}
                >
                  <Icon className={cn('w-5 h-5', isCurrent && 'animate-pulse')} />
                </motion.div>

                {/* Step Titles for Desktop */}
                <div className="mt-3 text-center max-w-[120px]">
                  <span
                    className={cn(
                      'text-xs font-semibold block transition-colors',
                      isCurrent && 'text-blue-600 font-bold',
                      isPassed && 'text-slate-800',
                      isUpcoming && 'text-slate-400'
                    )}
                  >
                    {step.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Stage Detail Banner */}
      <motion.div
        key={currentStatus}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl bg-white border border-slate-200/90 p-4.5 flex items-center gap-4 shadow-sm"
      >
        <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 shrink-0">
          {React.createElement(STEPS[activeIndex].icon, { className: 'w-6 h-6' })}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h5 className="font-bold text-slate-800 text-sm md:text-base">
              Progres Saat Ini: <span className="text-blue-600">{STEPS[activeIndex].label}</span>
            </h5>
            {updatedAt && (
              <span className="text-xs text-slate-500 font-mono">
                Diperbarui: {new Date(updatedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            {STEPS[activeIndex].description}
          </p>
        </div>
      </motion.div>
    </div>
  );
};
