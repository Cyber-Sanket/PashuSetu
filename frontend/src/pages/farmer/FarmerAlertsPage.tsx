import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { DataService } from '../../services/dataService';
import { Advisory } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { AlertTriangle, Megaphone, Calendar, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const FarmerAlertsPage: React.FC = () => {
  const [advisories, setAdvisories] = useState<Advisory[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    DataService.getAdvisories()
      .then((data) => setAdvisories(data))
      .catch((err) => console.error('Failed to load advisories:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 font-['Outfit']">
          Alerts & Advisories / इशारे व सूचना
        </h1>
        <p className="text-xs text-slate-500">
          Official disease outbreak warnings, biosecurity protocols, and seasonal vaccination circulars
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500">Loading alerts and advisories...</div>
      ) : advisories.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center text-xs text-slate-500 border border-slate-200">
          No active outbreak advisories in your district.
        </div>
      ) : (
        <div className="space-y-4">
          {advisories.map((adv) => {
            const title = language === 'mr' ? adv.titleMr : language === 'hi' ? adv.titleHi : adv.titleEn;
            const content = language === 'mr' ? adv.contentMr : language === 'hi' ? adv.contentHi : adv.contentEn;
            const isUrgent = adv.severity === 'URGENT';

            return (
              <div
                key={adv.id}
                className={`rounded-3xl p-6 border transition-all ${
                  isUrgent
                    ? 'bg-red-50/70 border-red-200 text-red-950 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-900 shadow-sm'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        isUrgent ? 'bg-red-600 text-white' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {adv.severity} ALERT
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      Target: {adv.targetDistrict} District
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-400">
                    Issued on {new Date(adv.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="font-bold text-base sm:text-lg mb-2 font-['Outfit']">
                  {title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {content}
                </p>

                <p className="text-[11px] text-slate-400 border-t border-slate-200/60 pt-3 mt-4">
                  Authorized Authority: {adv.issuedBy}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
