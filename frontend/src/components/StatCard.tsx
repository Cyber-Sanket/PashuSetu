import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'blue' | 'emerald' | 'amber' | 'red' | 'indigo';
  change?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'blue',
  change,
}) => {
  const variantStyles = {
    blue: {
      bg: 'bg-blue-50 text-blue-700',
      border: 'border-blue-100',
      dot: 'bg-blue-600',
    },
    emerald: {
      bg: 'bg-emerald-50 text-emerald-700',
      border: 'border-emerald-100',
      dot: 'bg-emerald-600',
    },
    amber: {
      bg: 'bg-amber-50 text-amber-700',
      border: 'border-amber-100',
      dot: 'bg-amber-600',
    },
    red: {
      bg: 'bg-red-50 text-red-700',
      border: 'border-red-100',
      dot: 'bg-red-600',
    },
    indigo: {
      bg: 'bg-indigo-50 text-indigo-700',
      border: 'border-indigo-100',
      dot: 'bg-indigo-600',
    },
  }[variant];

  return (
    <div className={`bg-white rounded-xl p-5 border ${variantStyles.border} shadow-sm hover:shadow-md transition-shadow relative overflow-hidden`}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${variantStyles.bg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <h3 className="text-2xl lg:text-3xl font-bold text-slate-900">{value}</h3>
        {change && (
          <span className="text-xs font-medium text-slate-500">{change}</span>
        )}
      </div>
      {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
      <div className={`absolute bottom-0 left-0 right-0 h-1 ${variantStyles.dot}`} />
    </div>
  );
};
