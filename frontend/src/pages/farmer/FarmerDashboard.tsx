import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { DataService } from '../../services/dataService';
import { StatCard } from '../../components/StatCard';
import { RiskBadge } from '../../components/RiskBadge';
import { StatusBadge } from '../../components/StatusBadge';
import {
  HeartPulse,
  Activity,
  AlertTriangle,
  Syringe,
  PlusCircle,
  Stethoscope,
  Skull,
  ArrowRight,
  ShieldCheck,
  PhoneCall,
  Calendar,
} from 'lucide-react';

export const FarmerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [stats, setStats] = useState({
    totalAnimals: 4,
    healthyAnimals: 2,
    sickAnimals: 1,
    underObservation: 1,
    activeReports: 2,
    vaccinationCoverage: 75,
  });

  const [recentReports, setRecentReports] = useState<any[]>([]);
  const [advisories, setAdvisories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [statsData, reportsData, advisoriesData] = await Promise.all([
          DataService.getFarmerStats(),
          DataService.getFarmerReports(),
          DataService.getAdvisories(),
        ]);
        setStats(statsData);
        setRecentReports(reportsData.slice(0, 4));
        setAdvisories(advisoriesData.slice(0, 2));
      } catch (err) {
        console.error('Error loading farmer dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-200 bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-500/30">
            Registered Livestock Owner • {user?.farmerProfile?.village || 'Uruli Kanchan'}, {user?.farmerProfile?.district || 'Pune'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-['Outfit']">
            Namaskar, {user?.name || 'Farmer'}!
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
            Monitor your livestock health records, report emerging symptoms for immediate decision-support risk scoring, and track veterinary prescriptions.
          </p>
        </div>

        {/* Quick Actions Header */}
        <div className="mt-6 pt-4 border-t border-emerald-700/50 flex flex-wrap gap-2.5 relative z-10">
          <Link
            to="/farmer/report-symptoms"
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold px-4 py-2.5 rounded-xl shadow flex items-center gap-1.5 transition-transform hover:scale-105"
          >
            <Stethoscope className="w-4 h-4 text-slate-950" />
            <span>Report Animal Symptoms</span>
          </Link>

          <Link
            to="/farmer/livestock"
            className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2.5 rounded-xl border border-white/20 flex items-center gap-1.5 transition-colors"
          >
            <PlusCircle className="w-4 h-4 text-emerald-300" />
            <span>Add New Animal</span>
          </Link>

          <Link
            to="/farmer/report-death"
            className="bg-red-900/60 hover:bg-red-900 text-red-200 text-xs font-semibold px-4 py-2.5 rounded-xl border border-red-500/30 flex items-center gap-1.5 transition-colors"
          >
            <Skull className="w-4 h-4 text-red-300" />
            <span>Report Animal Death</span>
          </Link>
        </div>
      </div>

      {/* 6 Core Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          title={t('totalAnimals')}
          value={stats.totalAnimals}
          icon={HeartPulse}
          variant="blue"
        />
        <StatCard
          title={t('healthyAnimals')}
          value={stats.healthyAnimals}
          icon={ShieldCheck}
          variant="emerald"
        />
        <StatCard
          title={t('sickAnimals')}
          value={stats.sickAnimals}
          icon={Activity}
          variant="red"
        />
        <StatCard
          title={t('underObservation')}
          value={stats.underObservation}
          icon={AlertTriangle}
          variant="amber"
        />
        <StatCard
          title={t('activeReports')}
          value={stats.activeReports}
          icon={Stethoscope}
          variant="indigo"
        />
        <StatCard
          title={t('vaccinationCoverage')}
          value={`${stats.vaccinationCoverage}%`}
          icon={Syringe}
          variant="emerald"
        />
      </div>

      {/* Active Advisories Banner */}
      {advisories.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-2 text-amber-900 font-bold text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Active Regional Preventive Advisories</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {advisories.map((adv) => (
              <div key={adv.id} className="bg-white p-3 rounded-xl border border-amber-100 text-xs">
                <p className="font-bold text-slate-900 mb-1">{adv.titleEn}</p>
                <p className="text-slate-600 line-clamp-2 leading-relaxed">{adv.contentEn}</p>
                <span className="inline-block text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-semibold mt-2">
                  Target: {adv.targetDistrict} District
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Health Reports */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-['Outfit']">
              Recent Health & Symptom Reports
            </h2>
            <p className="text-xs text-slate-500">
              Live status of submitted cases and veterinary clinical reviews
            </p>
          </div>
          <Link
            to="/farmer/reports"
            className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1"
          >
            <span>View All ({recentReports.length})</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {recentReports.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-500 space-y-3">
            <p>No health issues reported recently. Your livestock herd is healthy!</p>
            <Link
              to="/farmer/report-symptoms"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold"
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Report Symptoms</span>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentReports.map((report) => (
              <div
                key={report.id}
                className="py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 px-2 rounded-xl transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-900 text-sm">
                      {report.animal?.name || report.animal?.animalCode}
                    </span>
                    <span className="text-xs text-slate-500">
                      ({report.animal?.species}, {report.animal?.breed})
                    </span>
                    <RiskBadge level={report.riskLevel} score={report.riskScore} size="sm" />
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-1">
                    Symptoms: {JSON.parse(report.symptoms || '[]').join(', ')} • {report.durationDays} days
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Reported on {new Date(report.createdAt).toLocaleDateString()} • {report.village}, {report.district}
                  </p>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <StatusBadge status={report.status} />
                  <Link
                    to={`/farmer/reports`}
                    className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                    title="View details"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Veterinary Support Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/30 flex items-center justify-center">
            <PhoneCall className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <p className="font-bold text-sm">Need Urgent Veterinary Advice?</p>
            <p className="text-xs text-slate-400">Toll-Free 1962 Mobile Veterinary Dispensary is on call 24x7 in your block.</p>
          </div>
        </div>
        <Link
          to="/farmer/nearby-vets"
          className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl shrink-0 transition-colors"
        >
          Find Local Dispensary
        </Link>
      </div>
    </div>
  );
};
