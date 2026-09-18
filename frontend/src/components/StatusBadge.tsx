import React from 'react';
import { ServiceStatus } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Clock, Wrench, Package, CheckCircle2, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: ServiceStatus;
  className?: string;
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className, showIcon = true }) => {
  let badgeStyle = '';
  let label = '';
  let Icon = Clock;

  switch (status) {
    case 'PENDING':
      badgeStyle = 'bg-amber-50 text-amber-700 border-amber-200/80 shadow-sm';
      label = 'PENDING';
      Icon = Clock;
      break;
    case 'IN_PROGRESS':
      badgeStyle = 'bg-blue-50 text-blue-700 border-blue-200/80 shadow-sm';
      label = 'IN PROGRESS';
      Icon = Wrench;
      break;
    case 'WAITING_PARTS':
      badgeStyle = 'bg-orange-50 text-orange-700 border-orange-200/80 shadow-sm';
      label = 'WAITING PARTS';
      Icon = Package;
      break;
    case 'COMPLETED':
      badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200/80 shadow-sm';
      label = 'COMPLETED';
      Icon = CheckCircle2;
      break;
    case 'CANCELLED':
      badgeStyle = 'bg-red-50 text-red-700 border-red-200/80 shadow-sm';
      label = 'CANCELLED';
      Icon = XCircle;
      break;
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border shadow-sm',
        badgeStyle,
        className
      )}
    >
      {showIcon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span>{label}</span>
    </span>
  );
};
