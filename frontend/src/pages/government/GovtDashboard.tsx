import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { DataService } from '../../services/dataService';
import { StatCard } from '../../components/StatCard';
import { RiskBadge } from '../../components/RiskBadge';
import { StatusBadge } from '../../components/StatusBadge';
import { LeafletSurveillanceMap } from '../../components/LeafletSurveillanceMap';
import {
  ShieldAlert,
  Flame,
  Activity,
  HeartPulse,
  Syringe,
  Download,
  Users,
  AlertTriangle,
  Building2,
  MapPin,
  ArrowRight,
  Megaphone,
} from 'lucide-react';

export const GovtDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>({
    totalRegisteredAnimals: 12840,
    activeCases: 46,
    suspectedOutbreaks: 3,
    confirmedOutbreaks: 2,
    animalMortality: 5,
    vaccinationCoverage: 84,
    activeVeterinaryResponses: 19,
  });

  const [outbreaks, setOutbreaks] = useState<any[]>([]);
  const [gisData, setGisData] = useState<{ outbreaks: any[]; reports: any[] }>({
    outbreaks: [],
    reports: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGovtData = async () => {
      try {
        const [statsData, outbreaksData, gisResult] = await Promise.all([
          DataService.getGovtStats(),
          DataService.getGovtOutbreaks(),
          DataService.getGovtGis(),
        ]);
        setStats(statsData);
        setOutbreaks(outbreaksData);
        setGisData(gisResult);
      } catch (err) {
        console.error('Failed to load govt data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadGovtData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Government Command Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-amber-300 bg-slate-900/80 px-2.5 py-1 rounded-full border border-amber-500/30">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span>State Command Headquarters • Directorate of Animal Husbandry</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold font-['Outfit']">
            Maharashtra Livestock Health Surveillance Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Real-time multi-district epidemiological monitoring, automated spatio-temporal outbreak cluster alerts, and rapid containment coordination.
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap gap-2.5 relative z-10">
          <Link
            to="/government/map"
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow flex items-center gap-1.5 transition-transform hover:scale-105"
          >
            <MapPin className="w-4 h-4" />
            <span>Open Fullscreen GIS Map</span>
          </Link>

          <Link
            to="/government/outbreaks"
            className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow flex items-center gap-1.5 transition-colors"
          >
            <Flame className="w-4 h-4" />
            <span>Manage Outbreaks ({stats.confirmedOutbreaks || 0} active)</span>
          </Link>

          <Link
            to="/government/reports"
            className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2 rounded-xl border border-white/20 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4 text-emerald-300" />
            <span>Export Surveillance Reports (CSV)</span>
          </Link>

          <Link
            to="/government/advisories"
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-4 py-2 rounded-xl shadow flex items-center gap-1.5 transition-colors"
          >
            <Megaphone className="w-4 h-4 text-slate-950" />
            <span>Broadcast Regional Advisory</span>
          </Link>
        </div>
      </div>

      {/* Main KPI Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4">
        <StatCard
          title="Total Animals"
          value={stats.totalRegisteredAnimals}
          icon={HeartPulse}
          variant="blue"
        />
        <StatCard
          title="Active Cases"
          value={stats.activeCases}
          icon={Activity}
          variant="amber"
        />
        <StatCard
          title="Suspected Outbreaks"
          value={stats.suspectedOutbreaks}
          icon={AlertTriangle}
          variant="amber"
        />
        <StatCard
          title="Confirmed Outbreaks"
          value={stats.confirmedOutbreaks}
          icon={Flame}
          variant="red"
        />
        <StatCard
          title="Mortalities"
          value={stats.animalMortality}
          icon={ShieldAlert}
          variant="red"
        />
        <StatCard
          title="Vaccine Coverage"
          value={`${stats.vaccinationCoverage}%`}
          icon={Syringe}
          variant="emerald"
        />
        <StatCard
          title="Active Responses"
          value={stats.activeVeterinaryResponses}
          icon={Users}
          variant="indigo"
        />
      </div>

      {/* GIS Surveillance Map Snippet */}
      <div>
        <LeafletSurveillanceMap
          outbreaks={gisData.outbreaks}
          reports={gisData.reports}
          height="450px"
        />
      </div>

      {/* Live Outbreak Clusters Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
              <Flame className="w-5 h-5 text-red-600" />
              <span>Active Outbreak Containment Radiuses</span>
            </h2>
            <p className="text-xs text-slate-500">
              Epidemiological cluster detection engine output based on rolling 7-day cases and mortalities
            </p>
          </div>
          <Link
            to="/government/outbreaks"
            className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1"
          >
            <span>Manage All Outbreaks</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {outbreaks.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-xl">
            No active outbreaks detected.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Outbreak ID</th>
                  <th className="p-3">Location (Village, Block, District)</th>
                  <th className="p-3">Suspected Disease</th>
                  <th className="p-3">Cases</th>
                  <th className="p-3">Deaths</th>
                  <th className="p-3">Risk Level</th>
                  <th className="p-3">Containment Status</th>
                  <th className="p-3">Assigned Rapid Response Team</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {outbreaks.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-slate-900">{o.outbreakCode}</td>
                    <td className="p-3 font-semibold text-slate-800">{o.village}, {o.block}, {o.district}</td>
                    <td className="p-3 font-bold text-slate-900">{o.suspectedDisease}</td>
                    <td className="p-3 font-bold text-amber-600">{o.caseCount}</td>
                    <td className="p-3 font-bold text-red-600">{o.deathCount}</td>
                    <td className="p-3"><RiskBadge level={o.riskLevel} size="sm" /></td>
                    <td className="p-3"><StatusBadge status={o.status} /></td>
                    <td className="p-3 text-slate-600 text-[11px]">{o.assignedTeam || 'Rapid Unit Active'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
