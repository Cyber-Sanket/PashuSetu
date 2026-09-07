import React from 'react';
import { RiskLevel } from '../types';
import { ShieldCheck, AlertTriangle, AlertOctagon, Flame } from 'lucide-react';

interface RiskBadgeProps {
  level: RiskLevel | string;
  score?: number;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  level,
  score,
  showIcon = true,
  size = 'md',
}) => {
  const normLevel = (level || 'LOW').toUpperCase();

  let colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-300';
  let Icon = ShieldCheck;
  let label = 'Low Risk';

  if (normLevel === 'MEDIUM') {
    colorClasses = 'bg-amber-50 text-amber-800 border-amber-300';
    Icon = AlertTriangle;
    label = 'Medium Risk';
  } else if (normLevel === 'HIGH') {
    colorClasses = 'bg-orange-50 text-orange-800 border-orange-300';
    Icon = AlertOctagon;
    label = 'High Risk';
  } else if (normLevel === 'CRITICAL') {
    colorClasses = 'bg-red-50 text-red-800 border-red-400 animate-pulse';
    Icon = Flame;
    label = 'Critical Outbreak Risk';
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1 font-semibold',
    lg: 'text-sm px-3.5 py-1.5 font-bold',
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 border rounded-full ${colorClasses} ${sizeClasses}`}
    >
      {showIcon && <Icon className={size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />}
      <span>{label}</span>
      {score !== undefined && (
        <span className="opacity-75 font-mono text-[11px] ml-0.5">({score}/100)</span>
      )}
    </span>
  );
};
