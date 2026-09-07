import React from 'react';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const norm = (status || '').toUpperCase().replace(/_/g, ' ');

  let classes = 'bg-slate-100 text-slate-700 border-slate-300';

  if (norm.includes('HEALTHY') || norm.includes('RESOLVED') || norm.includes('COMPLETED') || norm.includes('CONTAINED')) {
    classes = 'bg-emerald-50 text-emerald-700 border-emerald-300';
  } else if (norm.includes('DIAGNOSED') || norm.includes('ASSIGNED') || norm.includes('COLLECTED') || norm.includes('TREATMENT STARTED')) {
    classes = 'bg-blue-50 text-blue-700 border-blue-300';
  } else if (norm.includes('OBSERVATION') || norm.includes('UNDER REVIEW') || norm.includes('TESTING') || norm.includes('UNDER INVESTIGATION') || norm.includes('PENDING')) {
    classes = 'bg-amber-50 text-amber-800 border-amber-300';
  } else if (norm.includes('SICK') || norm.includes('CRITICAL') || norm.includes('ESCALATED') || norm.includes('DETECTED') || norm.includes('DECEASED') || norm.includes('CONTAINMENT ACTIVE')) {
    classes = 'bg-red-50 text-red-700 border-red-300';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${classes}`}>
      {norm}
    </span>
  );
};
