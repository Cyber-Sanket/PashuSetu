import React, { useEffect, useState } from 'react';
import { DataService } from '../../services/dataService';
import { Vaccination } from '../../types';
import { useLanguage, getSpeciesLabel, getVaccineLabel } from '../../context/LanguageContext';
import { StatusBadge } from '../../components/StatusBadge';
import { Calendar, Clock } from 'lucide-react';

export const VaccinationsPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    DataService.getVaccinations()
      .then((data) => setVaccinations(data))
      .catch((err) => console.error('Failed to load vaccinations:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 font-['Outfit']">
          {t('vaccinationTrackerTitle')}
        </h1>
        <p className="text-xs text-slate-500">
          {t('vaccinationTrackerSubtitle')}
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500">{t('loadingVaccinations')}</div>
      ) : vaccinations.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center text-xs text-slate-500 border border-slate-200">
          {t('noVaccinationsFound')}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {vaccinations.map((vac) => {
            const speciesText = getSpeciesLabel(vac.animal?.species || '', language);

            return (
              <div
                key={vac.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-900 text-sm">{getVaccineLabel(vac.vaccineName, language)}</span>
                    <StatusBadge status={vac.status} />
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                    <p className="font-bold text-slate-800">
                      {t('animalName')}: {vac.animal?.name || vac.animal?.animalCode} ({speciesText})
                    </p>
                    <p className="text-slate-500 text-[11px]">{t('earTagId')}: {vac.animal?.identificationNumber || vac.animal?.animalCode}</p>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1.5 pt-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{t('administeredDate')}: <strong>{new Date(vac.administeredDate).toLocaleDateString()}</strong></span>
                    </div>

                    {vac.nextDueDate && (
                      <div className="flex items-center gap-2 text-emerald-700 font-medium">
                        <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{t('nextBoosterDue')} <strong>{new Date(vac.nextDueDate).toLocaleDateString()}</strong></span>
                      </div>
                    )}

                    {vac.batchNumber && (
                      <p className="text-[11px] text-slate-400 font-mono">{t('batch')}: {vac.batchNumber} ({t('dose')} {vac.doseNumber})</p>
                    )}
                  </div>
                </div>

                {vac.administeredBy && (
                  <p className="text-[11px] text-slate-400 border-t border-slate-100 pt-2">
                    {t('administeredBy')} {vac.administeredBy}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
