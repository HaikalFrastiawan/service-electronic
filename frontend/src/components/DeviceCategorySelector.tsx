'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Laptop, Smartphone, Tv, Shirt, Box, Cpu, Check } from 'lucide-react';
import { DeviceCategory } from '@/lib/types';
import { cn } from '@/lib/utils';

interface CategoryOption {
  id: DeviceCategory;
  name: string;
  icon: React.ElementType;
  description: string;
  color: string;
}

const CATEGORIES: CategoryOption[] = [
  {
    id: 'LAPTOP',
    name: 'Laptop / PC',
    icon: Laptop,
    description: 'Gaming, Ultrabook, Desktop',
    color: 'from-blue-500 to-blue-600 shadow-blue-500/25',
  },
  {
    id: 'SMARTPHONE',
    name: 'Smartphone',
    icon: Smartphone,
    description: 'Android, iPhone, Tablet',
    color: 'from-emerald-500 to-teal-600 shadow-emerald-500/25',
  },
  {
    id: 'TELEVISION',
    name: 'Smart TV / Monitor',
    icon: Tv,
    description: 'OLED, LED, Monitor Gaming',
    color: 'from-purple-500 to-indigo-600 shadow-purple-500/25',
  },
  {
    id: 'WASHING_MACHINE',
    name: 'Mesin Cuci',
    icon: Shirt,
    description: 'Front Load, Top Load',
    color: 'from-cyan-500 to-blue-500 shadow-cyan-500/25',
  },
  {
    id: 'REFRIGERATOR',
    name: 'Kulkas / Freezer',
    icon: Box,
    description: '1 Pintu, 2 Pintu, Inverter',
    color: 'from-sky-400 to-blue-600 shadow-sky-500/25',
  },
  {
    id: 'OTHER',
    name: 'Perangkat Lain',
    icon: Cpu,
    description: 'Audio, Console, AC, dll.',
    color: 'from-amber-500 to-orange-600 shadow-amber-500/25',
  },
];

interface DeviceCategorySelectorProps {
  value: DeviceCategory;
  onChange: (category: DeviceCategory) => void;
}

export const DeviceCategorySelector: React.FC<DeviceCategorySelectorProps> = ({ value, onChange }) => {
  return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 my-2">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isSelected = value === cat.id;

          return (
              <motion.div
                  key={cat.id}
                  whileHover={{ scale: 1.015, y: -1 }}
                  whileTap={{ scale: 0.985 }}
                  onClick={() => onChange(cat.id)}
                  className={cn(
                      'relative flex items-center gap-3.5 p-4 rounded-2xl text-left transition-all duration-200 border cursor-pointer select-none',
                      isSelected
                          ? 'bg-blue-50/60 border-blue-500 ring-2 ring-blue-500/20 shadow-sm'
                          : 'bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/80 shadow-xs'
                  )}
              >
                {/* iOS Style Squircle Gradient Icon */}
                <div
                    className={cn(
                        'p-2.5 rounded-xl text-white bg-gradient-to-br shadow-md shrink-0 transition-transform',
                        cat.color,
                        isSelected && 'scale-105'
                    )}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {/* Category Info */}
                <div className="flex-1 min-w-0 pr-4">
                  <h4
                      className={cn(
                          'text-sm font-semibold leading-tight transition-colors',
                          isSelected ? 'text-blue-950 font-bold' : 'text-slate-900'
                      )}
                  >
                    {cat.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 truncate">{cat.description}</p>
                </div>

                {/* Active Checkmark Badge */}
                {isSelected && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                        className="absolute top-3.5 right-3.5 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs"
                    >
                      <Check className="w-3 h-3 stroke-[3]" />
                    </motion.div>
                )}
              </motion.div>
          );
        })}
      </div>
  );
};