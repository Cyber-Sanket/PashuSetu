import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { DataService } from '../../services/dataService';
import { FALLBACK_ANALYTICS } from '../../services/fallbackData';
import { Users, Clock, CheckCircle2, AlertTriangle, Stethoscope } from 'lucide-react';
import { StatCard } from '../../components/StatCard';

export const VeterinaryResponsePage: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(FALLBACK_ANALYTICS.responseMetrics);

  useEffect(() => {
    DataService.getGovtAnalytics()
      .then((data) => {
        if (data && data.responseMetrics) {
          setMetrics(data.responseMetrics);
        } else {
          setMetrics(FALLBACK_ANALYTICS.responseMetrics);
        }
      })
      .catch((err) => console.error('Failed to load response metrics:', err));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 font-['Outfit']">
          Veterinary Response & Resource Tracking
        </h1>
        <p className="text-xs text-slate-500">
          Field veterinarian availability, caseload response latency, and escalation oversight
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Field Veterinarians"
          value={metrics.totalVets}
          icon={Users}
          variant="blue"
        />
        <StatCard
          title="Active Field Responses"
          value={metrics.assignedCases}
          icon={Stethoscope}
          variant="indigo"
        />
        <StatCard
          title="Resolved Cases"
          value={metrics.resolvedCases}
          icon={CheckCircle2}
          variant="emerald"
        />
        <StatCard
          title="Avg Response Latency"
          value={`${metrics.avgResponseHours} hrs`}
          icon={Clock}
          variant="emerald"
        />
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3">
        <h3 className="font-bold text-base text-slate-900 font-['Outfit']">
          Rapid Response Protocols Active in Maharashtra
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          The Department operates 80+ Mobile Veterinary Units (MVUs) stationed across taluka headquarters equipped with emergency diagnostic kits, cold-chain vaccine storage, and emergency resuscitation gear. When a critical risk report is triggered, the closest veterinary officer is automatically alerted within 15 minutes.
        </p>
      </div>
    </div>
  );
};
