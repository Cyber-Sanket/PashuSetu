import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DataService } from '../../services/dataService';
import { Animal } from '../../types';
import { useLanguage, getSpeciesLabel, getSymptomLabel, getBreedLabel, getVaccineLabel, getDiseaseCategoryLabel, getLocationLabel, getSpeciesDefaultPhoto } from '../../context/LanguageContext';
import { StatusBadge } from '../../components/StatusBadge';
import { RiskBadge } from '../../components/RiskBadge';
import {
  ArrowLeft,
  HeartPulse,
  Syringe,
  Pill,
} from 'lucide-react';

export const AnimalDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'reports' | 'vaccines' | 'treatments'>('reports');

  useEffect(() => {
    if (id) {
      DataService.getAnimalById(id)
        .then((data) => setAnimal(data))
        .catch((err) => console.error('Failed to load animal profile:', err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return <div className="p-12 text-center text-xs text-slate-500">{t('loadingLivestockProfile')}</div>;
  }

  if (!animal) {
    return (
      <div className="p-12 text-center text-xs text-slate-500">
        {t('animalNotFound')}{' '}
        <Link to="/farmer/livestock" className="text-blue-600 font-bold hover:underline">
          {t('returnToRoster')}
        </Link>
      </div>
    );
  }

  const speciesText = getSpeciesLabel(animal.species, language);
  const genderText = animal.gender === 'Female' ? t('female') : animal.gender === 'Male' ? t('male') : animal.gender;
  const yearsUnit = language === 'mr' ? 'वर्षे' : language === 'hi' ? 'वर्ष' : 'Yrs';

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        to="/farmer/livestock"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t('backToLivestock')}</span>
      </Link>

      {/* Hero Animal Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-24 h-24 rounded-2xl bg-emerald-50 border border-emerald-200 overflow-hidden flex items-center justify-center text-4xl shrink-0">
            <img
              src={animal.photoUrl || getSpeciesDefaultPhoto(animal.species)}
              alt={animal.name || animal.animalCode}
              onError={(e) => {
                (e.target as HTMLImageElement).src = getSpeciesDefaultPhoto(animal.species);
              }}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900 font-['Outfit']">
                {animal.name || animal.animalCode}
              </h1>
              <StatusBadge status={animal.healthStatus} />
            </div>

            <p className="text-xs text-slate-500 font-mono font-bold">
              {t('earTagId')}: {animal.identificationNumber || animal.animalCode} • {t('animalCode')}: {animal.animalCode}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-700 pt-2 font-medium">
              <span>{t('species')}: <strong>{speciesText}</strong></span>
              <span>{t('breed')}: <strong>{getBreedLabel(animal.breed, language)}</strong></span>
              <span>{t('gender')}: <strong>{genderText}</strong></span>
              <span>{t('age')}: <strong>{animal.ageYears} {yearsUnit}</strong></span>
              {animal.weightKg && <span>{t('weight')}: <strong>{animal.weightKg} {language === 'mr' ? 'कि.ग्रा.' : 'kg'}</strong></span>}
            </div>

            <p className="text-[11px] text-slate-400 pt-1">
              {t('registeredIn')} {getLocationLabel(animal.village, animal.district, language)}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <Link
          to={`/farmer/report-symptoms?animalId=${animal.id}`}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-4 py-2.5 rounded-xl shadow flex items-center gap-2 shrink-0 transition-transform hover:scale-105"
        >
          <HeartPulse className="w-4 h-4" />
          <span>{t('reportNewSymptoms')}</span>
        </Link>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
            activeTab === 'reports'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <HeartPulse className="w-3.5 h-3.5" />
          <span>{t('symptomReportsTab')} ({animal.symptomReports?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('vaccines')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
            activeTab === 'vaccines'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Syringe className="w-3.5 h-3.5" />
          <span>{t('vaccinationsTab')} ({animal.vaccinations?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('treatments')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
            activeTab === 'treatments'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Pill className="w-3.5 h-3.5" />
          <span>{t('treatmentsPrescribedTab')} ({animal.treatments?.length || 0})</span>
        </button>
      </div>

      {/* Tab 1: Symptom Reports */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          {(!animal.symptomReports || animal.symptomReports.length === 0) ? (
            <div className="bg-white rounded-2xl p-8 text-center text-xs text-slate-500 border border-slate-200">
              {t('noSymptomReportsForAnimal')}
            </div>
          ) : (
            animal.symptomReports.map((report) => {
              const parsedSymptoms = JSON.parse(report.symptoms || '[]');
              const localizedSymptoms = parsedSymptoms.map((s: string) => getSymptomLabel(s, language)).join(', ');
              const severityText = report.severity === 'Mild' ? t('mild') : report.severity === 'Moderate' ? t('moderate') : report.severity === 'Severe' ? t('severe') : report.severity;

              return (
                <div key={report.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <span className="font-bold text-slate-900 text-sm">{report.reportCode}</span>
                      <span className="text-xs text-slate-400 ml-2">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <RiskBadge level={report.riskLevel} score={report.riskScore} />
                      <StatusBadge status={report.status} />
                    </div>
                  </div>

                  <div className="text-xs text-slate-700 space-y-1">
                    <p><strong>{t('reportedSymptoms')}:</strong> {localizedSymptoms}</p>
                    <p><strong>{t('duration')}:</strong> {report.durationDays} {t('daysUnit')} • <strong>{t('severity')}:</strong> {severityText}</p>
                    {report.temperatureF && <p><strong>{t('bodyTemperature')}:</strong> {report.temperatureF} °F</p>}
                    {report.additionalDescription && (
                      <p className="text-slate-600 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-2">
                        "{report.additionalDescription}"
                      </p>
                    )}
                  </div>

                  {report.riskAssessment && (
                    <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 text-xs text-amber-900 space-y-1">
                      <p className="font-bold">{t('automatedDecisionSupport')}:</p>
                      <p>{t('possibleCondition')}: <strong>{getDiseaseCategoryLabel(report.riskAssessment.possibleCategory, language)}</strong></p>
                      <p className="text-[11px] text-amber-800">{report.riskAssessment.recommendedAction}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab 2: Vaccinations */}
      {activeTab === 'vaccines' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          {(!animal.vaccinations || animal.vaccinations.length === 0) ? (
            <div className="p-8 text-center text-xs text-slate-500">
              {t('noVaccinationRecordsForAnimal')}
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">{t('vaccineName')}</th>
                  <th className="p-3">{t('doseNumber')}</th>
                  <th className="p-3">{t('administeredDate')}</th>
                  <th className="p-3">{t('nextDueDate')}</th>
                  <th className="p-3">{t('caseStatus')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {animal.vaccinations.map((vac) => (
                  <tr key={vac.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{getVaccineLabel(vac.vaccineName, language)}</td>
                    <td className="p-3 text-slate-600">{t('dose')} {vac.doseNumber}</td>
                    <td className="p-3 text-slate-600">{new Date(vac.administeredDate).toLocaleDateString()}</td>
                    <td className="p-3 text-slate-600">
                      {vac.nextDueDate ? new Date(vac.nextDueDate).toLocaleDateString() : (language === 'mr' ? 'उपलब्ध नाही' : 'N/A')}
                    </td>
                    <td className="p-3">
                      <StatusBadge status={vac.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Tab 3: Treatments */}
      {activeTab === 'treatments' && (
        <div className="space-y-4">
          {(!animal.treatments || animal.treatments.length === 0) ? (
            <div className="bg-white rounded-2xl p-8 text-center text-xs text-slate-500 border border-slate-200">
              {t('noTreatmentsForAnimal')}
            </div>
          ) : (
            animal.treatments.map((tr) => (
              <div key={tr.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{t('diagnosis')}: {tr.diagnosis}</h4>
                    <p className="text-xs text-slate-500">
                      {t('prescribedBy')} {tr.vet?.user?.name || t('veterinarian')} • {new Date(tr.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  {tr.followUpDate && (
                    <span className="text-[11px] bg-blue-50 text-blue-700 font-bold px-2.5 py-1 rounded-lg">
                      {t('followUp')}: {new Date(tr.followUpDate).toLocaleDateString()}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">{t('prescribedMedicines')}:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {JSON.parse(tr.medicines || '[]').map((m: any, i: number) => (
                      <div key={i} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                        <p className="font-bold text-slate-900">{m.name}</p>
                        <p className="text-slate-600 text-[11px]">{t('dosage')}: {m.dosage} • {t('frequency')}: {m.frequency} • {m.duration}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {tr.instructions && (
                  <p className="text-xs text-slate-600 bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                    <strong>{t('careInstructions')}:</strong> {tr.instructions}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
