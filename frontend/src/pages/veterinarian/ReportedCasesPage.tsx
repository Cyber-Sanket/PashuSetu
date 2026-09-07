import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DataService } from '../../services/dataService';
import { DiseaseCase } from '../../types';
import { RiskBadge } from '../../components/RiskBadge';
import { StatusBadge } from '../../components/StatusBadge';
import {
  Stethoscope,
  Filter,
  ArrowRight,
  UserCheck,
  Calendar,
  MapPin,
  Phone,
} from 'lucide-react';

export const ReportedCasesPage: React.FC = () => {
  const [cases, setCases] = useState<DiseaseCase[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [districtFilter, setDistrictFilter] = useState('ALL');

  const districts = ['ALL', 'Pune', 'Satara', 'Ahmednagar', 'Nashik', 'Kolhapur'];
  const riskLevels = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
  const statuses = ['ALL', 'UNDER_REVIEW', 'ASSIGNED', 'DIAGNOSED', 'TREATMENT_STARTED', 'RESOLVED', 'ESCALATED'];

  const fetchCases = async () => {
    setLoading(true);
    try {
      const data = await DataService.getVetCases({
        riskLevel: riskFilter !== 'ALL' ? riskFilter : undefined,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        district: districtFilter !== 'ALL' ? districtFilter : undefined,
      });
      setCases(data);
    } catch (err) {
      console.error('Failed to load cases:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, [riskFilter, statusFilter, districtFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 font-['Outfit']">
          Reported Cases Queue / रुग्ण केसेस
        </h1>
        <p className="text-xs text-slate-500">
          Veterinary triage queue filtered by epidemiological risk levels and geographic jurisdiction
        </p>
      </div>

      {/* Filter Control Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        {/* Risk Level Filter */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Risk Tier:</span>
          </span>
          {riskLevels.map((r) => (
            <button
              key={r}
              onClick={() => setRiskFilter(r)}
              className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-colors ${
                riskFilter === r
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-500">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg outline-none font-medium"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>

        {/* District Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-500">District:</label>
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg outline-none font-medium"
          >
            {districts.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Case List */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500">Loading case records...</div>
      ) : cases.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center text-xs text-slate-500">
          No cases match the selected filters.
        </div>
      ) : (
        <div className="space-y-4">
          {cases.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono font-bold text-slate-900 text-sm">{c.caseCode}</span>
                  <RiskBadge level={c.report?.riskLevel} score={c.report?.riskScore} size="sm" />
                  <StatusBadge status={c.status} />
                </div>

                <p className="text-sm font-bold text-slate-900 font-['Outfit']">
                  {c.suspectedDisease || 'Livestock Health Disturbance'}
                </p>

                <div className="text-xs text-slate-600 flex flex-wrap items-center gap-4">
                  <span>Animal: <strong>{c.animal?.name || c.animal?.animalCode}</strong> ({c.animal?.species}, {c.animal?.breed})</span>
                  <span>Ear Tag: <strong>{c.animal?.identificationNumber || 'N/A'}</strong></span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                    {c.report?.village}, {c.report?.district}
                  </span>
                </div>

                <p className="text-xs text-slate-500">
                  Farmer: <strong className="text-slate-800">{c.animal?.farmer?.user?.name || 'Local Livestock Owner'}</strong> •
                  Phone: <a href={`tel:${c.animal?.farmer?.user?.mobile}`} className="text-blue-600 hover:underline ml-1 font-semibold">{c.animal?.farmer?.user?.mobile || 'N/A'}</a>
                </p>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                <Link
                  to={`/veterinarian/cases/${c.id}`}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-2"
                >
                  <Stethoscope className="w-4 h-4" />
                  <span>Clinical Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
