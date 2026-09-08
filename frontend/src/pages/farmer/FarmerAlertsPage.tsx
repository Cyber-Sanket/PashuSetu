import React, { useEffect, useState } from 'react';
import { DataService } from '../../services/dataService';
import { Advisory } from '../../types';
import { useLanguage, getDistrictLabel } from '../../context/LanguageContext';

export const FarmerAlertsPage: React.FC = () => {
  const [advisories, setAdvisories] = useState<Advisory[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, language } = useLanguage();

  useEffect(() => {
    DataService.getAdvisories()
      .then((data) => setAdvisories(data))
      .catch((err) => console.error('Failed to load advisories:', err))
      .finally(() => setLoading(false));
  }, []);

  const alertWord = language === 'mr' ? 'इशारा' : language === 'hi' ? 'अलर्ट' : 'ALERT';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 font-['Outfit']">
          {t('alertsAndAdvisoriesTitle')}
        </h1>
        <p className="text-xs text-slate-500">
          {t('alertsAndAdvisoriesSubtitle')}
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500">{t('loadingAlerts')}</div>
      ) : advisories.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center text-xs text-slate-500 border border-slate-200">
          {t('noActiveAdvisories')}
        </div>
      ) : (
        <div className="space-y-4">
          {advisories.map((adv) => {
            const title = language === 'mr' ? adv.titleMr : language === 'hi' ? adv.titleHi : adv.titleEn;
            const content = language === 'mr' ? adv.contentMr : language === 'hi' ? adv.contentHi : adv.contentEn;
            const isUrgent = adv.severity === 'URGENT';
            const severityLabel = isUrgent ? t('priorityCritical') : t('priorityHigh');

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
                      {severityLabel} {alertWord}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {t('targetDistrict')}: {getDistrictLabel(adv.targetDistrict, language)}
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-400">
                    {t('issuedOn')} {new Date(adv.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="font-bold text-base sm:text-lg mb-2 font-['Outfit']">
                  {title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {content}
                </p>

                <p className="text-[11px] text-slate-400 border-t border-slate-200/60 pt-3 mt-4">
                  {t('authorizedAuthority')} {adv.issuedBy}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
