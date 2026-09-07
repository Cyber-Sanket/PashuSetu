import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { DataService } from '../../services/dataService';
import { Outbreak } from '../../types';
import { RiskBadge } from '../../components/RiskBadge';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import { Flame, ShieldAlert, Users, MapPin, CheckCircle2, Calendar } from 'lucide-react';

export const OutbreakMonitoringPage: React.FC = () => {
  const [outbreaks, setOutbreaks] = useState<Outbreak[]>([]);
  const [loading, setLoading] = useState(true);

  // Status Modal
  const [selectedOutbreak, setSelectedOutbreak] = useState<Outbreak | null>(null);
  const [newStatus, setNewStatus] = useState('CONTAINMENT_ACTIVE');
  const [assignedTeam, setAssignedTeam] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchOutbreaks = async () => {
    setLoading(true);
    try {
      const data = await DataService.getGovtOutbreaks();
      setOutbreaks(data);
    } catch (err) {
      console.error('Failed to load outbreaks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOutbreaks();
  }, []);

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOutbreak) return;

    setSubmitting(true);
    try {
      await api.put(`/government/outbreaks/${selectedOutbreak.id}/status`, {
        status: newStatus,
        assignedTeam: assignedTeam || selectedOutbreak.assignedTeam,
      });
      setSelectedOutbreak(null);
      fetchOutbreaks();
    } catch (err: any) {
      alert('Failed to update outbreak: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 font-['Outfit']">
          Outbreak Detection & Containment / रोग उद्रेक नियंत्रण
        </h1>
        <p className="text-xs text-slate-500">
          Automated spatio-temporal cluster detector identifying epidemiological surges in villages and talukas
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500">Loading outbreak clusters...</div>
      ) : outbreaks.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center text-xs text-slate-500 border border-slate-200">
          No disease outbreaks currently detected.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {outbreaks.map((o) => (
            <div
              key={o.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-900">{o.outbreakCode}</span>
                  <RiskBadge level={o.riskLevel} size="sm" />
                </div>

                <div>
                  <h3 className="font-bold text-base text-slate-900 font-['Outfit']">{o.suspectedDisease}</h3>
                  <p className="text-xs text-slate-600 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <span>{o.village}, {o.block}, {o.district}</span>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-100">
                    <p className="text-slate-500">Active Cases:</p>
                    <p className="font-bold text-amber-700 text-lg">{o.caseCount}</p>
                  </div>
                  <div className="p-2.5 bg-red-50 rounded-xl border border-red-100">
                    <p className="text-slate-500">Mortalities:</p>
                    <p className="font-bold text-red-700 text-lg">{o.deathCount}</p>
                  </div>
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <p><strong>Containment Status:</strong> <StatusBadge status={o.status} /></p>
                  <p><strong>Response Team:</strong> {o.assignedTeam || 'Rapid Unit Active'}</p>
                  <p className="text-[11px] text-slate-400">
                    Detected: {new Date(o.detectedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedOutbreak(o);
                  setNewStatus(o.status);
                  setAssignedTeam(o.assignedTeam || '');
                }}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
              >
                Update Containment Status
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Update Outbreak Modal */}
      <Modal
        isOpen={!!selectedOutbreak}
        onClose={() => setSelectedOutbreak(null)}
        title={`Update Containment Status: ${selectedOutbreak?.outbreakCode}`}
        maxWidth="md"
      >
        <form onSubmit={handleUpdateStatus} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Outbreak Lifecycle Status *
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none font-medium"
            >
              <option value="DETECTED">DETECTED</option>
              <option value="UNDER_INVESTIGATION">UNDER INVESTIGATION</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="CONTAINMENT_ACTIVE">CONTAINMENT ACTIVE (Ring Vaccination)</option>
              <option value="CONTAINED">CONTAINED</option>
              <option value="RESOLVED">RESOLVED</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Assigned Rapid Response Team
            </label>
            <input
              type="text"
              placeholder="e.g. Pune District Mobile Veterinary Rapid Response Team #3"
              value={assignedTeam}
              onChange={(e) => setAssignedTeam(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setSelectedOutbreak(null)}
              className="px-4 py-2 text-xs font-semibold text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 text-xs font-bold bg-blue-600 text-white rounded-xl shadow"
            >
              {submitting ? 'Saving...' : 'Update Status'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
