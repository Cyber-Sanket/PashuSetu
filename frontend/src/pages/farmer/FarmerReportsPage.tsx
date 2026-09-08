import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DataService } from '../../services/dataService';
import { SymptomReport } from '../../types';
import { useLanguage, getSpeciesLabel, getSymptomLabel, getBreedLabel } from '../../context/LanguageContext';
import { RiskBadge } from '../../components/RiskBadge';
import { StatusBadge } from '../../components/StatusBadge';
import { Stethoscope, UserCheck } from 'lucide-react';

export const FarmerReportsPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [reports, setReports] = useState<SymptomReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    DataService.getFarmerReports()
      .then((data) => setReports(data))
      .catch((err) => console.error('Failed to load farmer reports:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-['Outfit']">
            {t('myCaseReports')}
          </h1>
          <p className="text-xs text-slate-500">
            {t('caseReportsSubtitle')}
          </p>
        </div>

        <Link
          to="/farmer/report-symptoms"
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow flex items-center gap-2 self-start sm:self-auto"
        >
          <Stethoscope className="w-4 h-4" />
          <span>{t('reportNewSymptoms')}</span>
        </Link>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500">{t('loadingReports')}</div>
      ) : reports.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3">
          <p className="text-sm font-semibold text-slate-700">{t('noReportsSubmitted')}</p>
          <p className="text-xs text-slate-500">{t('noReportsSubmittedDesc')}</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">{t('reportId')}</th>
                  <th className="p-3.5">{t('animalDetails')}</th>
                  <th className="p-3.5">{t('reportedDate')}</th>
                  <th className="p-3.5">{t('observedSymptoms')}</th>
                  <th className="p-3.5">{t('riskRating')}</th>
                  <th className="p-3.5">{t('caseStatus')}</th>
                  <th className="p-3.5">{t('attendingVet')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reports.map((report) => {
                  const speciesLabel = getSpeciesLabel(report.animal?.species || '', language);
                  const parsedSymptoms = JSON.parse(report.symptoms || '[]');
                  const localizedSymptoms = parsedSymptoms.map((s: string) => getSymptomLabel(s, language)).join(', ');
                  const severityText = report.severity === 'Mild' ? t('mild') : report.severity === 'Moderate' ? t('moderate') : report.severity === 'Severe' ? t('severe') : report.severity;

                  return (
                    <tr key={report.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3.5 font-bold text-slate-900 font-mono">
                        {report.reportCode}
                      </td>

                      <td className="p-3.5">
                        <p className="font-bold text-slate-900">{report.animal?.name || report.animal?.animalCode}</p>
                        <p className="text-slate-500 text-[11px]">{speciesLabel} ({report.animal?.breed ? getBreedLabel(report.animal.breed, language) : ''})</p>
                      </td>

                      <td className="p-3.5 text-slate-600">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </td>

                      <td className="p-3.5 max-w-xs">
                        <p className="text-slate-800 font-medium truncate">
                          {localizedSymptoms}
                        </p>
                        <p className="text-slate-400 text-[11px]">{report.durationDays} {t('daysUnit')} • {severityText}</p>
                      </td>

                      <td className="p-3.5">
                        <RiskBadge level={report.riskLevel} score={report.riskScore} size="sm" />
                      </td>

                      <td className="p-3.5">
                        <StatusBadge status={report.status} />
                      </td>

                      <td className="p-3.5 text-slate-700">
                        {report.diseaseCase?.vet?.user?.name ? (
                          <div className="flex items-center gap-1.5 font-medium text-blue-700">
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Dr. {report.diseaseCase.vet.user.name}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">{t('underTriage')}</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
