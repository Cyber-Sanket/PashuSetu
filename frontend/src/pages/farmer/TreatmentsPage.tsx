import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { DataService } from '../../services/dataService';
import { Treatment } from '../../types';
import { Pill, UserCheck, Calendar, Clock, FileCheck } from 'lucide-react';

export const TreatmentsPage: React.FC = () => {
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
          Prescriptions & Treatments / औषधोपचार
        </h1>
        <p className="text-xs text-slate-500">
          Official veterinary e-prescriptions, medication schedules, and follow-up guidance
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500">Loading prescriptions...</div>
      ) : treatments.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center text-xs text-slate-500 border border-slate-200">
          No treatment records found for your livestock.
        </div>
      ) : (
        <div className="space-y-4">
          {treatments.map((t) => (
            <div key={t.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded uppercase">
                    E-Prescription • {new Date(t.startDate).toLocaleDateString()}
                  </span>
                  <h3 className="font-bold text-lg text-slate-900 mt-1 font-['Outfit']">
                    Diagnosis: {t.diagnosis}
                  </h3>
                  <p className="text-xs text-slate-600">
                    Animal: <strong>{t.animal?.name || t.animal?.animalCode}</strong> ({t.animal?.species}, {t.animal?.breed}) • Tag: {t.animal?.identificationNumber || t.animal?.animalCode}
                  </p>
                </div>

                <div className="text-left sm:text-right text-xs text-slate-600">
                  <p className="font-bold text-slate-900 flex items-center sm:justify-end gap-1.5 text-blue-700">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Dr. {t.vet?.user?.name || 'Veterinary Officer'}</span>
                  </p>
                  <p className="text-slate-400 text-[11px]">{t.vet?.hospitalName || 'District Veterinary Hospital'}</p>
                </div>
              </div>

              {/* Medicines Grid */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Prescribed Medicines & Dosage Instructions:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {JSON.parse(t.medicines || '[]').map((med: any, idx: number) => (
                    <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                      <p className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Pill className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{med.name}</span>
                      </p>
                      <p className="text-slate-600"><strong>Dosage:</strong> {med.dosage}</p>
                      <p className="text-slate-600"><strong>Frequency:</strong> {med.frequency} • <strong>Duration:</strong> {med.duration}</p>
                    </div>
                  ))}
                </div>
              </div>

              {t.instructions && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 leading-relaxed">
                  <strong>Care & Feeding Instructions:</strong> {t.instructions}
                </div>
              )}

              {t.followUpDate && (
                <div className="flex items-center gap-2 text-xs text-blue-700 bg-blue-50 p-2.5 rounded-xl border border-blue-200">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>Scheduled Veterinary Follow-up Date: <strong>{new Date(t.followUpDate).toLocaleDateString()}</strong></span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
