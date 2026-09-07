import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { DataService } from '../../services/dataService';
import { FALLBACK_ANALYTICS } from '../../services/fallbackData';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { BarChart3, TrendingUp, Syringe, MapPin, Activity } from 'lucide-react';

export const DiseaseAnalyticsPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(FALLBACK_ANALYTICS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    DataService.getGovtAnalytics()
      .then((data) => setAnalytics(data))
      .catch((err) => console.error('Failed to load analytics:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 font-['Outfit']">
          Epidemiological Disease Analytics / रोग विश्लेषण
        </h1>
        <p className="text-xs text-slate-500">
          Statewide case incidence trends, disease-wise burden, mortality spikes, and vaccination achievement
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500">Loading epidemiological charts...</div>
      ) : (
        <div className="space-y-6">
          {/* Chart 1: 7-Day Incidence Trend */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-base text-slate-900 font-['Outfit']">
                  Daily Incidence Trend (Cases vs Mortalities)
                </h3>
              </div>
              <span className="text-xs text-slate-400">Last 7 Days</span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.dailyTrends}>
                  <defs>
                    <linearGradient id="colorCases" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorDeaths" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Area type="monotone" dataKey="cases" stroke="#2563eb" fillOpacity={1} fill="url(#colorCases)" name="Reported Cases" />
                  <Area type="monotone" dataKey="deaths" stroke="#dc2626" fillOpacity={1} fill="url(#colorDeaths)" name="Mortalities" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Charts Row 2: Disease Breakdown & District Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Disease Breakdown */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-base text-slate-900 font-['Outfit']">
                  Disease-wise Caseload Distribution
                </h3>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.diseaseBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="disease" stroke="#94a3b8" fontSize={10} interval={0} angle={-15} textAnchor="end" />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip />
                    <Bar dataKey="cases" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Active Cases" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Vaccination Coverage by District */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Syringe className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-base text-slate-900 font-['Outfit']">
                  District Vaccination Progress (%)
                </h3>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.vaccinationByDistrict}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="district" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} unit="%" domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="percentage" fill="#10b981" radius={[6, 6, 0, 0]} name="Coverage %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
