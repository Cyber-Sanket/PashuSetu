import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { DataService } from '../../services/dataService';
import { StatCard } from '../../components/StatCard';
import { RiskBadge } from '../../components/RiskBadge';
import { StatusBadge } from '../../components/StatusBadge';
import {
  Stethoscope,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Clock,
  Microscope,
  ArrowRight,
  MapPin,
  FileText,
  UserCheck,
} from 'lucide-react';

export const VetDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>({
    totalCases: 18,
    newCases: 4,
    pendingCases: 7,
    highRiskCases: 5,
    criticalCases: 3,
    resolvedCases: 11,
    pendingSamples: 2,
  });

  const [priorityCases, setPriorityCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVetData = async () => {
      try {
        const [statsData, casesData] = await Promise.all([
          DataService.getVetStats(),
          DataService.getVetCases({ riskLevel: 'CRITICAL' }),
        ]);
        setStats(statsData);
        setPriorityCases(casesData.slice(0, 5));
      } catch (err) {
        console.error('Failed to load vet dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadVetData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Vet Profile Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-200 bg-blue-950/60 px-2.5 py-1 rounded-full border border-blue-500/30">
            Registered Veterinary Officer • {user?.vetProfile?.vetId || 'VET-MH-2024-042'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-['Outfit']">
            {user?.name || 'Dr. Veterinarian'}
          </h1>
          <p className="text-xs sm:text-sm text-blue-100">
            {user?.vetProfile?.hospitalName || 'District Veterinary Polyclinic, Pune'} • Jurisdiction: {user?.vetProfile?.assignedDistrict || 'Pune'}
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-blue-800/50 flex flex-wrap gap-2.5 relative z-10">
          <Link
            to="/veterinarian/cases"
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold px-4 py-2 rounded-xl shadow flex items-center gap-1.5 transition-transform hover:scale-105"
          >
            <Stethoscope className="w-4 h-4 text-slate-950" />
            <span>Examine Caseload Queue</span>
          </Link>

          <Link
            to="/veterinarian/map"
            className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2 rounded-xl border border-white/20 flex items-center gap-1.5 transition-colors"
          >
            <MapPin className="w-4 h-4 text-amber-300" />
            <span>Disease Hotspot Map</span>
          </Link>

          <Link
            to="/veterinarian/samples"
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Microscope className="w-4 h-4" />
            <span>Track Lab Samples ({stats.pendingSamples || 0})</span>
          </Link>
        </div>
      </div>

      {/* 6 Key Caseload Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          title="Total Cases"
          value={stats.totalCases}
          icon={FileText}
          variant="blue"
        />
        <StatCard
          title="New Cases"
          value={stats.newCases}
          icon={Clock}
          variant="indigo"
        />
        <StatCard
          title="Pending Triage"
          value={stats.pendingCases}
          icon={AlertTriangle}
          variant="amber"
        />
        <StatCard
          title="Critical Cases"
          value={stats.criticalCases}
          icon={Flame}
          variant="red"
        />
        <StatCard
          title="Resolved Cases"
          value={stats.resolvedCases}
          icon={CheckCircle2}
          variant="emerald"
        />
        <StatCard
          title="Pending Lab Tests"
          value={stats.pendingSamples}
          icon={Microscope}
          variant="blue"
        />
      </div>

      {/* Critical Priority Queue */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
              <Flame className="w-5 h-5 text-red-600" />
              <span>Priority Critical Triage Queue</span>
            </h2>
            <p className="text-xs text-slate-500">
              High-mortality risk and contagious symptom reports requiring urgent veterinary intervention
            </p>
          </div>
          <Link
            to="/veterinarian/cases"
            className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1"
          >
            <span>View All Cases</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {priorityCases.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            No critical risk cases currently pending triage in your district.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {priorityCases.map((c) => (
              <div
                key={c.id}
                className="py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 px-2 rounded-xl transition-colors"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-bold text-slate-900 text-sm font-mono">{c.caseCode}</span>
                    <RiskBadge level={c.report?.riskLevel} score={c.report?.riskScore} size="sm" />
                    <span className="text-xs font-semibold text-slate-700">
                      {c.animal?.species} ({c.animal?.breed}) • Tag: {c.animal?.identificationNumber || c.animal?.animalCode}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">
                    Suspected: <strong className="text-slate-900">{c.suspectedDisease || 'Acute Febrile Syndrome'}</strong> • {c.report?.village}, {c.report?.district}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Farmer: {c.animal?.farmer?.user?.name || 'Local Farmer'} • Mobile: {c.animal?.farmer?.user?.mobile || 'N/A'}
                  </p>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <StatusBadge status={c.status} />
                  <Link
                    to={`/veterinarian/cases/${c.id}`}
                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
                  >
                    <span>Examine</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
