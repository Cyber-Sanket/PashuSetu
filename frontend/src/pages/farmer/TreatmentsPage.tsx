import React, { useEffect, useState } from 'react';
import { DataService } from '../../services/dataService';
import { Treatment } from '../../types';
import { useLanguage, getSpeciesLabel, getBreedLabel } from '../../context/LanguageContext';
import { Pill, UserCheck, Clock } from 'lucide-react';

export const TreatmentsPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    DataService.getTreatments()
      .then((data) => setTreatments(data))
      .catch((err) => console.error('Failed to load treatments:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 font-['Outfit']">
          {t('prescriptionsTitle')}
        </h1>
        <p className="text-xs text-slate-500">
          {t('prescriptionsSubtitle')}
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500">{t('loadingPrescriptions')}</div>
      ) : treatments.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center text-xs text-slate-500 border border-slate-200">
          {t('noTreatmentsFound')}
        </div>
      ) : (
        <div className="space-y-4">
          {treatments.map((tr) => {
            const speciesText = getSpeciesLabel(tr.animal?.species || '', language);
            const defaultHospital = language === 'mr' ? 'जिल्हा पशुवैद्यकीय चिकित्सालय' : language === 'hi' ? 'जिला पशु चिकित्सालय' : 'District Veterinary Hospital';

            return (
              <div key={tr.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded uppercase">
                      {t('ePrescription')} • {new Date(tr.startDate).toLocaleDateString()}
                    </span>
                    <h3 className="font-bold text-lg text-slate-900 mt-1 font-['Outfit']">
                      {t('diagnosis')}: {tr.diagnosis}
                    </h3>
                    <p className="text-xs text-slate-600">
                      {t('animalName')}: <strong>{tr.animal?.name || tr.animal?.animalCode}</strong> ({speciesText}, {tr.animal?.breed ? getBreedLabel(tr.animal.breed, language) : ''}) • {t('earTagId')}: {tr.animal?.identificationNumber || tr.animal?.animalCode}
                    </p>
                  </div>

                  <div className="text-left sm:text-right text-xs text-slate-600">
                    <p className="font-bold text-slate-900 flex items-center sm:justify-end gap-1.5 text-blue-700">
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Dr. {tr.vet?.user?.name || t('veterinarian')}</span>
                    </p>
                    <p className="text-slate-400 text-[11px]">{tr.vet?.hospitalName || defaultHospital}</p>
                  </div>
                </div>

                {/* Medicines Grid */}
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {t('medicinesAndDosage')}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {JSON.parse(tr.medicines || '[]').map((med: any, idx: number) => (
                      <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                        <p className="font-bold text-slate-900 flex items-center gap-1.5">
                          <Pill className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{med.name}</span>
                        </p>
                        <p className="text-slate-600"><strong>{t('dosage')}:</strong> {med.dosage}</p>
                        <p className="text-slate-600"><strong>{t('frequency')}:</strong> {med.frequency} • {med.duration}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {tr.instructions && (
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 leading-relaxed">
                    <strong>{t('careAndFeedingInstructions')}</strong> {tr.instructions}
                  </div>
                )}

                {tr.followUpDate && (
                  <div className="flex items-center gap-2 text-xs text-blue-700 bg-blue-50 p-2.5 rounded-xl border border-blue-200">
                    <Clock className="w-4 h-4 shrink-0" />
                    <span>{t('scheduledFollowUp')} <strong>{new Date(tr.followUpDate).toLocaleDateString()}</strong></span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
