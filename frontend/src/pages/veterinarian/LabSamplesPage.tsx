import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { DataService } from '../../services/dataService';
import { LabSample } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import {
  Microscope,
  CheckCircle2,
  Clock,
  Send,
  AlertCircle,
  FileText,
  Plus,
} from 'lucide-react';

export const LabSamplesPage: React.FC = () => {
  const [samples, setSamples] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Result Modal State
  const [selectedSample, setSelectedSample] = useState<any | null>(null);
  const [result, setResult] = useState<'POSITIVE' | 'NEGATIVE' | 'INCONCLUSIVE'>('POSITIVE');
  const [resultNotes, setResultNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchSamples = async () => {
    setLoading(true);
    try {
      const data = await DataService.getLabSamples();
      setSamples(data);
    } catch (err) {
      console.error('Failed to load lab samples:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSamples();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await api.put(`/samples/${id}/status`, { status: newStatus });
      fetchSamples();
    } catch (err: any) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const handleSaveResult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSample) return;

    setSubmitting(true);
    try {
      await api.post(`/samples/${selectedSample.id}/result`, {
        result,
        resultNotes,
      });
      setSelectedSample(null);
      setResultNotes('');
      fetchSamples();
    } catch (err: any) {
      alert('Failed to save result: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 font-['Outfit']">
          Laboratory Sample Management / प्रयोगशाळा तपासणी
        </h1>
        <p className="text-xs text-slate-500">
          Chain of custody and testing workflow from field specimen collection to diagnostic result confirmation
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500">Loading laboratory samples...</div>
      ) : samples.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center text-xs text-slate-500 border border-slate-200">
          No diagnostic samples ordered yet.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Sample ID</th>
                  <th className="p-3.5">Animal & Case</th>
                  <th className="p-3.5">Specimen Type</th>
                  <th className="p-3.5">Test Ordered</th>
                  <th className="p-3.5">Destination Lab</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Test Outcome</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {samples.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900 font-mono">
                      {s.sampleCode}
                    </td>

                    <td className="p-3.5">
                      <p className="font-bold text-slate-900">{s.animal?.animalCode} ({s.animal?.species})</p>
                      <p className="text-slate-400 text-[11px]">Case: {s.diseaseCase?.caseCode}</p>
                    </td>

                    <td className="p-3.5 font-medium text-slate-800">
                      {s.sampleType}
                    </td>

                    <td className="p-3.5">
                      <span className="bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded text-[11px]">
                        {s.testType}
                      </span>
                    </td>

                    <td className="p-3.5 text-slate-600 max-w-xs truncate">
                      {s.laboratoryName}
                    </td>

                    <td className="p-3.5">
                      <StatusBadge status={s.status} />
                    </td>

                    <td className="p-3.5">
                      {s.result ? (
                        <span
                          className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                            s.result === 'POSITIVE'
                              ? 'bg-red-50 text-red-700 border border-red-300'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                          }`}
                        >
                          {s.result}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Awaiting Results</span>
                      )}
                    </td>

                    <td className="p-3.5 text-right space-x-2">
                      {s.status === 'REQUESTED' && (
                        <button
                          onClick={() => handleUpdateStatus(s.id, 'COLLECTED')}
                          className="text-[11px] font-bold text-blue-600 hover:underline"
                        >
                          Mark Collected
                        </button>
                      )}

                      {s.status === 'COLLECTED' && (
                        <button
                          onClick={() => handleUpdateStatus(s.id, 'DISPATCHED')}
                          className="text-[11px] font-bold text-indigo-600 hover:underline"
                        >
                          Dispatch to Lab
                        </button>
                      )}

                      {s.status === 'DISPATCHED' && (
                        <button
                          onClick={() => handleUpdateStatus(s.id, 'TESTING')}
                          className="text-[11px] font-bold text-amber-600 hover:underline"
                        >
                          Start Testing
                        </button>
                      )}

                      {s.status !== 'COMPLETED' && (
                        <button
                          onClick={() => setSelectedSample(s)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] px-2.5 py-1 rounded-lg shadow-sm"
                        >
                          Enter Result
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Enter Result Modal */}
      <Modal
        isOpen={!!selectedSample}
        onClose={() => setSelectedSample(null)}
        title={`Enter Diagnostic Result for ${selectedSample?.sampleCode}`}
        maxWidth="md"
      >
        <form onSubmit={handleSaveResult} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Diagnostic Outcome *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['POSITIVE', 'NEGATIVE', 'INCONCLUSIVE'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setResult(r)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                    result === r
                      ? r === 'POSITIVE'
                        ? 'bg-red-600 text-white border-red-600 shadow'
                        : 'bg-emerald-600 text-white border-emerald-600 shadow'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Laboratory Findings & CT Values / Notes
            </label>
            <textarea
              rows={3}
              placeholder="e.g. RT-PCR confirmed viral genome copies detected with CT value 22.4..."
              value={resultNotes}
              onChange={(e) => setResultNotes(e.target.value)}
              className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setSelectedSample(null)}
              className="px-4 py-2 text-xs font-semibold text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 text-xs font-bold bg-blue-600 text-white rounded-xl shadow"
            >
              {submitting ? 'Saving...' : 'Confirm Test Result'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
