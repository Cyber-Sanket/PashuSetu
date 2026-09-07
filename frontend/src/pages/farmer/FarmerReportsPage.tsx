import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { DataService } from '../../services/dataService';
import { SymptomReport } from '../../types';
import { RiskBadge } from '../../components/RiskBadge';
import { StatusBadge } from '../../components/StatusBadge';
import { FileText, Stethoscope, ArrowRight, UserCheck, Calendar } from 'lucide-react';

export const FarmerReportsPage: React.FC = () => {
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
            My Case Reports / माझे आरोग्य अहवाल
          </h1>
          <p className="text-xs text-slate-500">
            Track submitted cases from initial triage to veterinary diagnosis and treatment
          </p>
        </div>

        <Link
          to="/farmer/report-symptoms"
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow flex items-center gap-2 self-start sm:self-auto"
        >
          <Stethoscope className="w-4 h-4" />
          <span>Report New Symptoms</span>
        </Link>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500">Loading your reports...</div>
      ) : reports.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3">
          <p className="text-sm font-semibold text-slate-700">No reports submitted yet.</p>
          <p className="text-xs text-slate-500">When you file symptoms for an animal, case updates and diagnosis will appear here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Report ID</th>
                  <th className="p-3.5">Animal Details</th>
                  <th className="p-3.5">Reported Date</th>
                  <th className="p-3.5">Observed Symptoms</th>
                  <th className="p-3.5">Risk Rating</th>
                  <th className="p-3.5">Case Status</th>
                  <th className="p-3.5">Veterinarian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900 font-mono">
                      {report.reportCode}
                    </td>

                    <td className="p-3.5">
                      <p className="font-bold text-slate-900">{report.animal?.name || report.animal?.animalCode}</p>
                      <p className="text-slate-500 text-[11px]">{report.animal?.species} ({report.animal?.breed})</p>
                    </td>

                    <td className="p-3.5 text-slate-600">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </td>

                    <td className="p-3.5 max-w-xs">
                      <p className="text-slate-800 font-medium truncate">
                        {JSON.parse(report.symptoms || '[]').join(', ')}
                      </p>
                      <p className="text-slate-400 text-[11px]">{report.durationDays} days • {report.severity}</p>
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
                        <span className="text-slate-400 italic">Under Triage</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
