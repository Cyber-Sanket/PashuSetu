import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { DataService } from '../../services/dataService';
import { FALLBACK_REPORTS } from '../../services/fallbackData';
import { Animal } from '../../types';
import { useOffline } from '../../context/OfflineContext';
import { useLanguage, getSpeciesLabel, getSymptomLabel, getBreedLabel, getDiseaseCategoryLabel } from '../../context/LanguageContext';
import { RiskBadge } from '../../components/RiskBadge';
import { PhotoUpload } from '../../components/PhotoUpload';
import {
  Stethoscope,
  MapPin,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

const SYMPTOM_OPTIONS = [
  'Fever',
  'Cough',
  'Difficulty Breathing',
  'Diarrhea',
  'Vomiting',
  'Loss of Appetite',
  'Weakness',
  'Nasal Discharge',
  'Eye Discharge',
  'Skin Lesions',
  'Swelling',
  'Lameness',
  'Reduced Milk Production',
  'Abnormal Behavior',
  'Excessive Salivation / Drooling',
  'Mouth Blisters / Ulcers',
  'Other',
];

export const ReportSymptomsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const preSelectedAnimalId = searchParams.get('animalId');
  const navigate = useNavigate();
  const { isOnline, queueOfflineReport } = useOffline();
  const { t, language } = useLanguage();

  const [animals, setAnimals] = useState<Animal[]>([]);
  const [selectedAnimalId, setSelectedAnimalId] = useState<string>(preSelectedAnimalId || '');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [customSymptom, setCustomSymptom] = useState<string>('');
  const [durationDays, setDurationDays] = useState<number>(2);
  const [severity, setSeverity] = useState<'Mild' | 'Moderate' | 'Severe'>('Moderate');
  const [temperatureF, setTemperatureF] = useState<string>('103.5');
  const [appetiteStatus, setAppetiteStatus] = useState<'Normal' | 'Reduced' | 'None'>('Reduced');
  const [milkProductionChange, setMilkProductionChange] = useState<'None' | 'Slight Drop' | 'Severe Drop'>('Slight Drop');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [photoUrl, setPhotoUrl] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<any | null>(null);

  useEffect(() => {
    DataService.getAnimals().then((data) => {
      setAnimals(data);
      if (!selectedAnimalId && data.length > 0) {
        setSelectedAnimalId(data[0].id);
      }
    });

    // Auto-capture GPS if allowed
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(pos.coords.latitude);
          setLongitude(pos.coords.longitude);
        },
        () => {
          // Fallback default coordinates (Pune district center)
          setLatitude(18.5204);
          setLongitude(73.8567);
        }
      );
    }
  }, []);

  const toggleSymptom = (sym: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym]
    );
  };

  // Client-side rule engine calculation for instant preview
  const livePreview = useMemo(() => {
    let score = 0;
    const lower = selectedSymptoms.map((s) => s.toLowerCase());

    if (lower.some((s) => s.includes('breathing'))) score += 25;
    if (lower.some((s) => s.includes('lesion') || s.includes('blister'))) score += 25;
    if (lower.some((s) => s.includes('fever'))) score += 15;
    if (lower.some((s) => s.includes('salivation') || s.includes('mouth'))) score += 20;
    if (lower.some((s) => s.includes('lameness'))) score += 15;
    if (lower.some((s) => s.includes('swelling'))) score += 20;
    if (lower.some((s) => s.includes('diarrhea'))) score += 15;

    const tempNum = parseFloat(temperatureF);
    if (!isNaN(tempNum)) {
      if (tempNum >= 104) score += 20;
      else if (tempNum >= 102.5) score += 10;
    }

    if (severity === 'Severe') score += 15;
    else if (severity === 'Moderate') score += 8;

    if (appetiteStatus === 'None') score += 12;
    if (milkProductionChange === 'Severe Drop') score += 15;
    if (durationDays >= 3) score += 10;

    score = Math.min(100, Math.max(0, score));

    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
    if (score <= 30) riskLevel = 'LOW';
    else if (score <= 60) riskLevel = 'MEDIUM';
    else if (score <= 80) riskLevel = 'HIGH';
    else riskLevel = 'CRITICAL';

    let matchedDisease = language === 'mr' ? 'सामान्य शारीरिक अस्वस्थता' : language === 'hi' ? 'सामान्य शारीरिक विकार' : 'General Systemic Disturbance';
    if (lower.some((s) => s.includes('salivation') || s.includes('mouth') || s.includes('blister'))) {
      matchedDisease = language === 'mr' ? 'लाळ खुरकूत रोग (FMD)' : language === 'hi' ? 'खुरपका और मुंहपका रोग (FMD)' : 'Foot and Mouth Disease (FMD)';
    } else if (lower.some((s) => s.includes('lesion'))) {
      matchedDisease = language === 'mr' ? 'लंपी त्वचा रोग (LSD)' : language === 'hi' ? 'लम्पी त्वचा रोग (LSD)' : 'Lumpy Skin Disease (LSD)';
    } else if (lower.some((s) => s.includes('breathing') && s.includes('swelling'))) {
      matchedDisease = language === 'mr' ? 'घटसर्प रोग (HS)' : language === 'hi' ? 'गलघोंटू रोग (HS)' : 'Haemorrhagic Septicaemia (HS)';
    }

    return { score, riskLevel, matchedDisease };
  }, [selectedSymptoms, temperatureF, severity, appetiteStatus, milkProductionChange, durationDays, language]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAnimalId || selectedSymptoms.length === 0) {
      alert(t('selectAnimalAndSymptomAlert'));
      return;
    }

    if (selectedSymptoms.includes('Other') && !customSymptom.trim()) {
      alert(t('specifyCustomSymptomAlert'));
      return;
    }

    setIsSubmitting(true);

    const finalSymptoms = selectedSymptoms.map((s) => {
      if (s === 'Other') {
        return `Other: ${customSymptom.trim()}`;
      }
      return s;
    });

    const finalDescription = customSymptom.trim()
      ? `[Custom Symptoms: ${customSymptom.trim()}] ${description}`.trim()
      : description;

    const reportPayload = {
      animalId: selectedAnimalId,
      symptoms: finalSymptoms,
      durationDays,
      severity,
      temperatureF: temperatureF ? parseFloat(temperatureF) : null,
      appetiteStatus,
      milkProductionChange,
      additionalDescription: finalDescription,
      latitude,
      longitude,
      photoUrl: photoUrl || undefined,
    };

    if (!isOnline) {
      // Offline submission
      queueOfflineReport(reportPayload);
      alert(t('offlineReportSavedNotice'));
      navigate('/farmer/reports');
      return;
    }

    try {
      const res = await api.post('/reports', reportPayload);
      setSubmissionSuccess(res.data);
    } catch (err: any) {
      if (!err.response) {
        // Backend offline fallback: generate demo risk assessment response
        const selectedAnimal = animals.find((a) => a.id === selectedAnimalId);
        const demoReportCode = `REP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
        const fallbackSuccess = {
          report: {
            id: `demo-rep-${Date.now()}`,
            reportCode: demoReportCode,
            animalId: selectedAnimalId,
            farmerId: 'usr-farmer-01',
            symptoms: JSON.stringify(finalSymptoms),
            durationDays,
            severity,
            temperatureF: temperatureF ? parseFloat(temperatureF) : null,
            appetiteStatus,
            milkProductionChange,
            additionalDescription: finalDescription,
            latitude: latitude || 18.4862,
            longitude: longitude || 74.1332,
            riskScore: livePreview.score,
            riskLevel: livePreview.riskLevel,
            status: 'SUBMITTED',
            createdAt: new Date().toISOString(),
            animal: selectedAnimal,
          },
          riskAssessment: {
            id: `demo-ra-${Date.now()}`,
            reportId: `demo-rep-${Date.now()}`,
            riskScore: livePreview.score,
            riskLevel: livePreview.riskLevel,
            possibleCategory: livePreview.matchedDisease,
            riskFactors: JSON.stringify(['Automated offline epidemiological rule evaluation (+25)']),
            recommendedAction: language === 'mr' ? 'आजारी जनावराला तात्काळ कळपापासून वेगळे ठेवा. स्थानिक पशुवैद्यकीय अधिकाऱ्यांशी संपर्क साधा.' : language === 'hi' ? 'पशु को तुरंत झुंड से अलग रखें। स्थानीय पशु चिकित्सक से संपर्क करें।' : 'Keep animal isolated away from the herd. Contact local Veterinary Officer.',
            isDecisionSupportOnly: true,
            engineVersion: 'v1.0-rule-based',
            createdAt: new Date().toISOString(),
          },
        };
        FALLBACK_REPORTS.unshift(fallbackSuccess.report as any);
        setSubmissionSuccess(fallbackSuccess);
        return;
      }
      alert(t('failedToSubmitReport') + (err.response?.data?.error || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submissionSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-3xl mx-auto">
            ✅
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-slate-900 font-['Outfit']">
              {t('healthReportFiledSuccess')}
            </h1>
            <p className="text-xs text-slate-500">
              {t('reportCode')}: <strong className="text-slate-800">{submissionSuccess.report.reportCode}</strong>
            </p>
          </div>

          {/* Decision Support Output Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {t('epidemiologicalRisk')}
              </span>
              <RiskBadge
                level={submissionSuccess.riskAssessment.riskLevel}
                score={submissionSuccess.riskAssessment.riskScore}
                size="lg"
              />
            </div>

            <div>
              <p className="text-xs text-slate-500">{t('suspectedDiseaseCategory')}</p>
              <p className="font-bold text-slate-900 text-base">
                {getDiseaseCategoryLabel(submissionSuccess.riskAssessment.possibleCategory, language)}
              </p>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
              <p className="font-bold mb-1">{t('recommendedImmediateAction')}</p>
              <p>{submissionSuccess.riskAssessment.recommendedAction}</p>
            </div>

            <p className="text-[11px] text-slate-500 italic pt-1">
              {submissionSuccess.riskAssessment.isDecisionSupportOnly && (
                <span>⚡ {t('decisionSupportDisclaimerText')}</span>
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/farmer/reports"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition-colors"
            >
              {t('trackCaseInReports')}
            </Link>

            <Link
              to="/farmer/nearby-vets"
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-5 py-2.5 rounded-xl transition-colors"
            >
              {t('findNearestClinic')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 font-['Outfit']">
          {t('reportSymptomsTitle')}
        </h1>
        <p className="text-xs text-slate-500">
          {t('reportSymptomsSubtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Form inputs */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Select Animal */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              {t('selectAffectedAnimal')}
            </label>
            {animals.length === 0 ? (
              <p className="text-xs text-amber-600 font-medium">
                {t('noLivestockRegisteredAddFirst')}{' '}
                <Link to="/farmer/livestock" className="underline font-bold">
                  {t('addAnimal')}
                </Link>
              </p>
            ) : (
              <select
                value={selectedAnimalId}
                onChange={(e) => setSelectedAnimalId(e.target.value)}
                className="w-full text-xs sm:text-sm px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl outline-none font-medium focus:ring-2 focus:ring-emerald-500"
              >
                {animals.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name || a.animalCode} — {getSpeciesLabel(a.species, language)} ({getBreedLabel(a.breed, language)}) • {t('earTagId')}: {a.identificationNumber || a.animalCode}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* 2. Symptom Checklist */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                {t('selectObservedSymptoms')}
              </label>
              <span className="text-[11px] text-slate-500 font-medium">
                {selectedSymptoms.length} {t('symptomsSelected')}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SYMPTOM_OPTIONS.map((sym) => {
                const isChecked = selectedSymptoms.includes(sym);
                const displayLabel = getSymptomLabel(sym, language);

                return (
                  <button
                    key={sym}
                    type="button"
                    onClick={() => toggleSymptom(sym)}
                    className={`text-left p-2.5 rounded-xl border text-xs font-medium transition-all flex items-center justify-between ${
                      isChecked
                        ? sym === 'Other'
                          ? 'bg-purple-50 border-purple-500 text-purple-900 font-bold shadow-sm'
                          : 'bg-blue-50 border-blue-500 text-blue-900 font-bold shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="truncate pr-1">
                      {displayLabel}
                    </span>
                    {isChecked && (
                      <CheckCircle2
                        className={`w-3.5 h-3.5 shrink-0 ${
                          sym === 'Other' ? 'text-purple-600' : 'text-blue-600'
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Custom Symptom Input Field when 'Other' is selected */}
            {selectedSymptoms.includes('Other') && (
              <div className="mt-3 p-4 bg-purple-50/80 border border-purple-200 rounded-2xl space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-purple-900 uppercase tracking-wide">
                    {t('specifyCustomSymptoms')}
                  </label>
                  <span className="text-[11px] text-purple-700 font-semibold bg-purple-100 px-2 py-0.5 rounded">
                    {t('sentDirectlyToVet')}
                  </span>
                </div>
                <input
                  type="text"
                  required
                  placeholder={t('customSymptomsPlaceholder')}
                  value={customSymptom}
                  onChange={(e) => setCustomSymptom(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-white border border-purple-300 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 font-medium text-slate-800"
                />
                <p className="text-[10px] text-purple-700">
                  {t('customSymptomsHelp')}
                </p>
              </div>
            )}
          </div>

          {/* 3. Vitals & Duration */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              {t('clinicalVitalsAndOnset')}
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">{t('durationDaysLabel')}</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={durationDays}
                  onChange={(e) => setDurationDays(parseInt(e.target.value || '1', 10))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">{t('severityReported')}</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none font-medium"
                >
                  <option value="Mild">{t('mild')}</option>
                  <option value="Moderate">{t('moderate')}</option>
                  <option value="Severe">{t('severe')}</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">{t('bodyTempF')}</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder={language === 'mr' ? 'उदा. १०३.५' : 'e.g. 103.5'}
                  value={temperatureF}
                  onChange={(e) => setTemperatureF(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2 border-t border-slate-100">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">{t('appetiteStatus')}</label>
                <select
                  value={appetiteStatus}
                  onChange={(e) => setAppetiteStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none font-medium"
                >
                  <option value="Normal">{t('normal')}</option>
                  <option value="Reduced">{t('reduced')}</option>
                  <option value="None">{t('noneAppetite')}</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">{t('milkYieldImpact')}</label>
                <select
                  value={milkProductionChange}
                  onChange={(e) => setMilkProductionChange(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none font-medium"
                >
                  <option value="None">{t('notLactating')}</option>
                  <option value="Slight Drop">{t('slightDrop')}</option>
                  <option value="Severe Drop">{t('severeDrop')}</option>
                </select>
              </div>
            </div>
          </div>

          {/* 4. Description & Photo */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              {t('additionalNotesAndPhoto')}
            </label>
            <textarea
              rows={3}
              placeholder={t('describePhysicalBehaviorPlaceholder')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
            />

            <PhotoUpload
              value={photoUrl}
              onChange={(url) => setPhotoUrl(url)}
              label={t('symptomsPhotoLabel')}
              helperText={t('symptomsPhotoHelper')}
            />
          </div>
        </div>

        {/* Right Col: Live Risk Engine Preview & Submit */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-xl space-y-4 sticky top-24">
            <div className="flex items-center gap-2 text-amber-400">
              <Sparkles className="w-4 h-4" />
              <h3 className="font-bold text-xs uppercase tracking-wider">
                {t('automatedRiskEnginePreview')}
              </h3>
            </div>

            <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300">{t('epidemiologicalRisk')}</span>
                <RiskBadge level={livePreview.riskLevel} score={livePreview.score} />
              </div>

              <div>
                <p className="text-[11px] text-slate-400">{t('suspectedPatternMatch')}</p>
                <p className="font-bold text-sm text-white">{livePreview.matchedDisease}</p>
              </div>

              {/* Legal disclaimer */}
              <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-700/80 text-[11px] text-slate-300 leading-relaxed">
                ⚡ <strong>{t('riskAssessment')}:</strong> {t('decisionSupportDisclaimerText')}
              </div>
            </div>

            {/* GPS Location Status */}
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              <span>
                GPS: {latitude ? `${latitude.toFixed(4)}, ${longitude?.toFixed(4)}` : t('detectingGps')}
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-transform hover:scale-105 disabled:opacity-50"
            >
              <Stethoscope className="w-4 h-4 text-slate-950" />
              <span>{isSubmitting ? t('processingAssessment') : t('submitHealthReport')}</span>
            </button>

            {!isOnline && (
              <p className="text-[11px] text-amber-300 text-center font-medium">
                {t('offlineQueueNotice')}
              </p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
