import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { DataService } from '../../services/dataService';
import { FALLBACK_ANALYTICS } from '../../services/fallbackData';
import { Syringe, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';

export const VaccinationMonitoringPage: React.FC = () => {
  const [data, setData] = useState<any[]>(FALLBACK_ANALYTICS.vaccinationByDistrict);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    DataService.getGovtAnalytics()
      .then((res) => {
        if (res && res.vaccinationByDistrict && res.vaccinationByDistrict.length > 0) {
          setData(res.vaccinationByDistrict);
        } else {
          setData(FALLBACK_ANALYTICS.vaccinationByDistrict);
        }
      })
      .catch((err) => console.error('Failed to load vaccination data:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 font-['Outfit']">
          Statewide Vaccination Monitoring / लसीकरण पाळत
        </h1>
        <p className="text-xs text-slate-500">
          District-level targets vs achievement for FMD, HS, BQ, Brucellosis, and Lumpy Skin Disease
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500">Loading vaccination statistics...</div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="p-4">District</th>
                <th className="p-4">Target Livestock</th>
                <th className="p-4">Immunized</th>
                <th className="p-4">Pending</th>
                <th className="p-4">Coverage Progress</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((d) => (
                <tr key={d.district} className="hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-900 text-sm">{d.district}</td>
                  <td className="p-4 font-semibold text-slate-700">{d.target}</td>
                  <td className="p-4 font-bold text-emerald-700">{d.vaccinated}</td>
                  <td className="p-4 text-slate-500">{d.pending}</td>
                  <td className="p-4 w-56">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            d.percentage >= 75 ? 'bg-emerald-600' : d.percentage >= 50 ? 'bg-amber-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${d.percentage}%` }}
                        />
                      </div>
                      <span className="font-bold text-slate-900 text-xs w-9">{d.percentage}%</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        d.percentage >= 75
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                          : d.percentage >= 50
                          ? 'bg-amber-50 text-amber-700 border border-amber-300'
                          : 'bg-red-50 text-red-700 border border-red-300'
                      }`}
                    >
                      {d.percentage >= 75 ? 'ON TRACK' : d.percentage >= 50 ? 'MODERATE' : 'CRITICAL GAP'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
