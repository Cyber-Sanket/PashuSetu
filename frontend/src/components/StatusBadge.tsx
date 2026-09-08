import React from 'react';
import { useLanguage, getStatusLabel } from '../context/LanguageContext';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const { language } = useLanguage();
  const rawNorm = (status || '').toUpperCase().replace(/_/g, ' ');
  const displayLabel = getStatusLabel(status, language);

  let classes = 'bg-slate-100 text-slate-700 border-slate-300';

  if (rawNorm.includes('HEALTHY') || rawNorm.includes('RESOLVED') || rawNorm.includes('COMPLETED') || rawNorm.includes('CONTAINED')) {
    classes = 'bg-emerald-50 text-emerald-700 border-emerald-300';
  } else if (rawNorm.includes('DIAGNOSED') || rawNorm.includes('ASSIGNED') || rawNorm.includes('COLLECTED') || rawNorm.includes('TREATMENT STARTED')) {
    classes = 'bg-blue-50 text-blue-700 border-blue-300';
  } else if (rawNorm.includes('OBSERVATION') || rawNorm.includes('UNDER REVIEW') || rawNorm.includes('TESTING') || rawNorm.includes('UNDER INVESTIGATION') || rawNorm.includes('PENDING')) {
    classes = 'bg-amber-50 text-amber-800 border-amber-300';
  } else if (rawNorm.includes('SICK') || rawNorm.includes('CRITICAL') || rawNorm.includes('ESCALATED') || rawNorm.includes('DETECTED') || rawNorm.includes('DECEASED') || rawNorm.includes('CONTAINMENT ACTIVE')) {
    classes = 'bg-red-50 text-red-700 border-red-300';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${classes}`}>
      {displayLabel}
    </span>
  );
};
