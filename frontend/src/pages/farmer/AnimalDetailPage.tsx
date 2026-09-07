import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { DataService } from '../../services/dataService';
import { Animal } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';
import { RiskBadge } from '../../components/RiskBadge';
import {
  ArrowLeft,
  HeartPulse,
  Syringe,
  Pill,
  Calendar,
  AlertTriangle,
  Stethoscope,
  CheckCircle,
} from 'lucide-react';

export const AnimalDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
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
    return <div className="p-12 text-center text-xs text-slate-500">Loading livestock profile...</div>;
  }

  if (!animal) {
    return (
      <div className="p-12 text-center text-xs text-slate-500">
        Animal profile not found.{' '}
        <Link to="/farmer/livestock" className="text-blue-600 font-bold hover:underline">
          Return to roster
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        to="/farmer/livestock"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to My Livestock</span>
      </Link>

      {/* Hero Animal Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-24 h-24 rounded-2xl bg-emerald-50 border border-emerald-200 overflow-hidden flex items-center justify-center text-4xl shrink-0">
            {animal.photoUrl ? (
              <img src={animal.photoUrl} alt={animal.name} className="w-full h-full object-cover" />
            ) : (
              animal.species === 'Cow' ? '🐄' : animal.species === 'Buffalo' ? '🐃' : '🐐'
            )}
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900 font-['Outfit']">
                {animal.name || animal.animalCode}
              </h1>
              <StatusBadge status={animal.healthStatus} />
            </div>

            <p className="text-xs text-slate-500 font-mono font-bold">
              Ear Tag: {animal.identificationNumber || animal.animalCode} • Animal Code: {animal.animalCode}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-700 pt-2 font-medium">
              <span>Species: <strong>{animal.species}</strong></span>
              <span>Breed: <strong>{animal.breed}</strong></span>
              <span>Gender: <strong>{animal.gender}</strong></span>
              <span>Age: <strong>{animal.ageYears} Yrs</strong></span>
              {animal.weightKg && <span>Weight: <strong>{animal.weightKg} kg</strong></span>}
            </div>

            <p className="text-[11px] text-slate-400 pt-1">
              Registered in {animal.village}, {animal.block}, {animal.district}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <Link
          to={`/farmer/report-symptoms?animalId=${animal.id}`}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-4 py-2.5 rounded-xl shadow flex items-center gap-2 shrink-0 transition-transform hover:scale-105"
        >
          <HeartPulse className="w-4 h-4" />
          <span>Report New Symptoms</span>
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
          <span>Symptom Reports ({animal.symptomReports?.length || 0})</span>
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
          <span>Vaccinations ({animal.vaccinations?.length || 0})</span>
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
          <span>Treatments Prescribed ({animal.treatments?.length || 0})</span>
        </button>
      </div>

      {/* Tab 1: Symptom Reports */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          {(!animal.symptomReports || animal.symptomReports.length === 0) ? (
            <div className="bg-white rounded-2xl p-8 text-center text-xs text-slate-500 border border-slate-200">
              No symptom reports filed for this animal yet.
            </div>
          ) : (
            animal.symptomReports.map((report) => (
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
                  <p><strong>Reported Symptoms:</strong> {JSON.parse(report.symptoms || '[]').join(', ')}</p>
                  <p><strong>Duration:</strong> {report.durationDays} days • <strong>Severity:</strong> {report.severity}</p>
                  {report.temperatureF && <p><strong>Body Temperature:</strong> {report.temperatureF} °F</p>}
                  {report.additionalDescription && (
                    <p className="text-slate-600 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-2">
                      "{report.additionalDescription}"
                    </p>
                  )}
                </div>

                {report.riskAssessment && (
                  <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 text-xs text-amber-900 space-y-1">
                    <p className="font-bold">Automated Decision Support:</p>
                    <p>Possible Condition: <strong>{report.riskAssessment.possibleCategory}</strong></p>
                    <p className="text-[11px] text-amber-800">{report.riskAssessment.recommendedAction}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Vaccinations */}
      {activeTab === 'vaccines' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          {(!animal.vaccinations || animal.vaccinations.length === 0) ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No vaccination records available for this animal.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Vaccine Name</th>
                  <th className="p-3">Dose #</th>
                  <th className="p-3">Administered Date</th>
                  <th className="p-3">Next Due Date</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {animal.vaccinations.map((vac) => (
                  <tr key={vac.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{vac.vaccineName}</td>
                    <td className="p-3 text-slate-600">Dose {vac.doseNumber}</td>
                    <td className="p-3 text-slate-600">{new Date(vac.administeredDate).toLocaleDateString()}</td>
                    <td className="p-3 text-slate-600">
                      {vac.nextDueDate ? new Date(vac.nextDueDate).toLocaleDateString() : 'N/A'}
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
              No veterinary prescriptions recorded for this animal yet.
            </div>
          ) : (
            animal.treatments.map((t) => (
              <div key={t.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Diagnosis: {t.diagnosis}</h4>
                    <p className="text-xs text-slate-500">
                      Prescribed by {t.vet?.user?.name || 'Veterinary Officer'} on {new Date(t.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  {t.followUpDate && (
                    <span className="text-[11px] bg-blue-50 text-blue-700 font-bold px-2.5 py-1 rounded-lg">
                      Follow-up: {new Date(t.followUpDate).toLocaleDateString()}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Prescribed Medicines:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {JSON.parse(t.medicines || '[]').map((m: any, i: number) => (
                      <div key={i} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                        <p className="font-bold text-slate-900">{m.name}</p>
                        <p className="text-slate-600 text-[11px]">Dosage: {m.dosage} • Frequency: {m.frequency} • {m.duration}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {t.instructions && (
                  <p className="text-xs text-slate-600 bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                    <strong>Care Instructions:</strong> {t.instructions}
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
