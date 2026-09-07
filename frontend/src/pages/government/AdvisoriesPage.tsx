import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { DataService } from '../../services/dataService';
import { Advisory } from '../../types';
import { Modal } from '../../components/Modal';
import { Megaphone, PlusCircle, AlertTriangle, CheckCircle2, Globe, Send } from 'lucide-react';

export const AdvisoriesPage: React.FC = () => {
  const [advisories, setAdvisories] = useState<Advisory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const districts = ['ALL', 'Pune', 'Satara', 'Ahmednagar', 'Nashik', 'Kolhapur', 'Solapur'];

  const [form, setForm] = useState({
    titleEn: '',
    titleMr: '',
    titleHi: '',
    contentEn: '',
    contentMr: '',
    contentHi: '',
    targetDistrict: 'Pune',
    severity: 'WARNING',
  });

  const fetchAdvisories = async () => {
    setLoading(true);
    try {
      const data = await DataService.getAdvisories();
      setAdvisories(data);
    } catch (err) {
      console.error('Failed to load advisories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvisories();
  }, []);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/advisories', form);
      setIsModalOpen(false);
      setForm({
        titleEn: '',
        titleMr: '',
        titleHi: '',
        contentEn: '',
        contentMr: '',
        contentHi: '',
        targetDistrict: 'Pune',
        severity: 'WARNING',
      });
      alert('Multilingual advisory broadcasted to target district!');
      fetchAdvisories();
    } catch (err: any) {
      alert('Failed to broadcast advisory: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-['Outfit']">
            Broadcast Regional Advisories / मार्गदर्शक सूचना
          </h1>
          <p className="text-xs text-slate-500">
            Publish multilingual disease alerts and biosecurity advisories directly to farmer devices
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow flex items-center gap-2 self-start sm:self-auto transition-transform hover:scale-105"
        >
          <Megaphone className="w-4 h-4 text-slate-950" />
          <span>Issue New Advisory</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500">Loading advisories...</div>
      ) : advisories.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center text-xs text-slate-500 border border-slate-200">
          No advisories issued yet.
        </div>
      ) : (
        <div className="space-y-4">
          {advisories.map((adv) => (
            <div key={adv.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      adv.severity === 'URGENT' ? 'bg-red-600 text-white' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {adv.severity} ALERT
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    Jurisdiction: {adv.targetDistrict} District
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">
                  {new Date(adv.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <p><strong>English:</strong> <span className="font-bold text-slate-900">{adv.titleEn}</span></p>
                <p className="text-slate-600 leading-relaxed">{adv.contentEn}</p>

                {adv.titleMr && (
                  <div className="pt-2 border-t border-slate-50">
                    <p className="text-emerald-800 font-bold">मराठी: {adv.titleMr}</p>
                    <p className="text-slate-600">{adv.contentMr}</p>
                  </div>
                )}
              </div>

              <p className="text-[11px] text-slate-400 border-t border-slate-100 pt-2">
                Authorized By: {adv.issuedBy}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Broadcast Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Broadcast Regional Multilingual Advisory"
        maxWidth="2xl"
      >
        <form onSubmit={handleBroadcast} className="space-y-4 text-xs sm:text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Target District</label>
              <select
                value={form.targetDistrict}
                onChange={(e) => setForm({ ...form, targetDistrict: e.target.value })}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none font-medium"
              >
                {districts.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Severity Level</label>
              <select
                value={form.severity}
                onChange={(e) => setForm({ ...form, severity: e.target.value })}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none font-medium"
              >
                <option value="NORMAL">NORMAL (General Advisory)</option>
                <option value="WARNING">WARNING (Outbreak Watch)</option>
                <option value="URGENT">URGENT (Confirmed Epidemic / Ring Vaccination)</option>
              </select>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <p className="font-bold text-xs text-slate-800">English Content</p>
            <input
              type="text"
              required
              placeholder="Title in English"
              value={form.titleEn}
              onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
              className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none font-medium"
            />
            <textarea
              rows={2}
              required
              placeholder="Detailed advisory instructions in English..."
              value={form.contentEn}
              onChange={(e) => setForm({ ...form, contentEn: e.target.value })}
              className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg outline-none"
            />
          </div>

          <div className="p-3 bg-emerald-50/50 rounded-2xl border border-emerald-200/60 space-y-2">
            <p className="font-bold text-xs text-emerald-900">मराठी (Marathi Content)</p>
            <input
              type="text"
              placeholder="शीर्षक मराठीमध्ये"
              value={form.titleMr}
              onChange={(e) => setForm({ ...form, titleMr: e.target.value })}
              className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none font-medium"
            />
            <textarea
              rows={2}
              placeholder="मार्गदर्शक सूचना मराठीमध्ये..."
              value={form.contentMr}
              onChange={(e) => setForm({ ...form, contentMr: e.target.value })}
              className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 text-xs font-bold bg-amber-500 text-slate-950 rounded-xl shadow"
            >
              {submitting ? 'Broadcasting...' : 'Broadcast to Farmers'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
