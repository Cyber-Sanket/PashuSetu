import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { DataService } from '../../services/dataService';
import { DiseaseCase } from '../../types';
import { RiskBadge } from '../../components/RiskBadge';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import {
  ArrowLeft,
  Stethoscope,
  Pill,
  Microscope,
  AlertTriangle,
  CheckCircle2,
  Phone,
  MapPin,
  Calendar,
  ShieldCheck,
  Flame,
  Plus,
  Trash2,
  Camera,
  Image as ImageIcon,
  ZoomIn,
} from 'lucide-react';

export const CaseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [caseData, setCaseData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isDiagModalOpen, setIsDiagModalOpen] = useState(false);
  const [isTreatmentModalOpen, setIsTreatmentModalOpen] = useState(false);
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
  const [selectedImageModal, setSelectedImageModal] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Diagnosis Form State
  const [diagForm, setDiagForm] = useState({
    suspectedDisease: '',
    confirmedDisease: '',
    clinicalDiagnosis: '',
    clinicalSeverity: 'Moderate',
    clinicalNotes: '',
    recommendedAction: '',
  });

  // Treatment Form State
  const [medicines, setMedicines] = useState([
    { name: '', dosage: '', frequency: 'Once daily', duration: '3 days' },
  ]);
  const [treatmentInstructions, setTreatmentInstructions] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');

  // Sample Form State
  const [sampleForm, setSampleForm] = useState({
    sampleType: 'Blood',
    collectionLocation: '',
    laboratoryName: 'Disease Investigation Section (DIS), Aundh, Pune',
    testType: 'RT-PCR',
  });

  const fetchCase = async () => {
    if (!id) return;
    try {
      const data = await DataService.getCaseById(id);
      setCaseData(data);
      if (data) {
        setDiagForm({
          suspectedDisease: data.suspectedDisease || data.report?.riskAssessment?.possibleCategory || '',
          confirmedDisease: data.confirmedDisease || '',
          clinicalDiagnosis: data.clinicalDiagnosis || '',
          clinicalSeverity: data.clinicalSeverity || 'Moderate',
          clinicalNotes: data.clinicalNotes || '',
          recommendedAction: data.recommendedAction || '',
        });
      }
    } catch (err) {
      console.error('Failed to load case:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCase();
  }, [id]);

  const handleAcceptCase = async () => {
    try {
      await api.post(`/cases/${id}/accept`);
      alert('Case successfully assigned to your caseload.');
      fetchCase();
    } catch (err: any) {
      alert('Failed to accept case: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleSaveDiagnosis = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post(`/cases/${id}/diagnosis`, diagForm);
      setIsDiagModalOpen(false);
      alert('Clinical diagnosis submitted and farmer notified.');
      fetchCase();
    } catch (err: any) {
      alert('Failed to save diagnosis: ' + (err.response?.data?.error || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const addMedicineRow = () => {
    setMedicines([...medicines, { name: '', dosage: '', frequency: 'Once daily', duration: '3 days' }]);
  };

  const removeMedicineRow = (index: number) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleSaveTreatment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (medicines.some((m) => !m.name || !m.dosage)) {
      alert('Please fill out medicine name and dosage.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/treatments', {
        caseId: id,
        animalId: caseData.animalId,
        diagnosis: diagForm.clinicalDiagnosis || diagForm.suspectedDisease || 'Prescribed Therapy',
        medicines,
        instructions: treatmentInstructions,
        followUpDate: followUpDate || null,
      });
      setIsTreatmentModalOpen(false);
      alert('E-prescription generated and sent to farmer.');
      fetchCase();
    } catch (err: any) {
      alert('Failed to save treatment: ' + (err.response?.data?.error || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleRequestSample = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/samples', {
        caseId: id,
        animalId: caseData.animalId,
        ...sampleForm,
        collectionLocation: sampleForm.collectionLocation || `${caseData.report.village}, ${caseData.report.district}`,
      });
      setIsSampleModalOpen(false);
      alert('Laboratory sample request recorded and tracking initiated.');
      fetchCase();
    } catch (err: any) {
      alert('Failed to request sample: ' + (err.response?.data?.error || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEscalate = async () => {
    const reason = prompt('Please enter the rationale for escalating this case to District/State Authorities:');
    if (!reason) return;
    try {
      await api.post(`/cases/${id}/escalate`, { reason });
      alert('Case escalated to Government Surveillance Center.');
      fetchCase();
    } catch (err: any) {
      alert('Failed to escalate: ' + err.message);
    }
  };

  const handleResolve = async () => {
    const notes = prompt('Enter resolution summary / recovery outcome:');
    if (notes === null) return;
    try {
      await api.post(`/cases/${id}/resolve`, { resolutionNotes: notes });
      alert('Case marked as RESOLVED. Animal status returned to HEALTHY.');
      fetchCase();
    } catch (err: any) {
      alert('Failed to resolve: ' + err.message);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xs text-slate-500">Loading case details...</div>;
  }

  if (!caseData) {
    return <div className="p-12 text-center text-xs text-slate-500">Case record not found.</div>;
  }

  const { report, animal } = caseData;

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb */}
      <Link
        to="/veterinarian/cases"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Cases Queue</span>
      </Link>

      {/* Case Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-mono text-sm font-bold text-slate-900">{caseData.caseCode}</span>
              <RiskBadge level={report?.riskLevel} score={report?.riskScore} size="lg" />
              <StatusBadge status={caseData.status} />
              {caseData.escalatedToGovt && (
                <span className="text-[10px] font-bold bg-red-600 text-white px-2 py-0.5 rounded uppercase">
                  Escalated
                </span>
              )}
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 font-['Outfit']">
              Suspected: {caseData.suspectedDisease || 'Livestock Disease Under Investigation'}
            </h1>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            {caseData.status === 'UNDER_REVIEW' && (
              <button
                onClick={handleAcceptCase}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow transition-colors"
              >
                Accept Case
              </button>
            )}

            <button
              onClick={() => setIsDiagModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow transition-colors flex items-center gap-1.5"
            >
              <Stethoscope className="w-4 h-4" />
              <span>{caseData.clinicalDiagnosis ? 'Update Diagnosis' : 'Record Diagnosis'}</span>
            </button>

            <button
              onClick={() => setIsTreatmentModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow transition-colors flex items-center gap-1.5"
            >
              <Pill className="w-4 h-4" />
              <span>Prescribe Rx</span>
            </button>

            <button
              onClick={() => setIsSampleModalOpen(true)}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-4 py-2 rounded-xl shadow transition-colors flex items-center gap-1.5"
            >
              <Microscope className="w-4 h-4" />
              <span>Order Lab Test</span>
            </button>

            <button
              onClick={handleEscalate}
              className="bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold px-3 py-2 rounded-xl border border-red-200 transition-colors"
            >
              Escalate
            </button>

            {caseData.status !== 'RESOLVED' && (
              <button
                onClick={handleResolve}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-2 rounded-xl transition-colors"
              >
                Mark Resolved
              </button>
            )}
          </div>
        </div>

        {/* Stakeholder Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          {/* Farmer Info */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
            <p className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Livestock Owner</p>
            <p className="text-sm font-bold text-slate-900">{animal?.farmer?.user?.name || 'Patil Farmstead'}</p>
            <p className="text-slate-600 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-blue-600" />
              <a href={`tel:${animal?.farmer?.user?.mobile}`} className="hover:underline font-semibold">
                {animal?.farmer?.user?.mobile || '9876543210'}
              </a>
            </p>
            <p className="text-slate-600 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-red-500" />
              <span>{report?.village}, {report?.block}, {report?.district}</span>
            </p>
          </div>

          {/* Animal Profile */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
            <p className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Animal Information</p>
            <p className="text-sm font-bold text-slate-900">{animal?.name || animal?.animalCode}</p>
            <p className="text-slate-600">Species: <strong>{animal?.species}</strong> ({animal?.breed})</p>
            <p className="text-slate-600 font-mono">Ear Tag: <strong>{animal?.identificationNumber || 'N/A'}</strong></p>
            <p className="text-slate-600">Age: {animal?.ageYears} Yrs • Weight: {animal?.weightKg ? `${animal.weightKg} kg` : 'N/A'}</p>
          </div>

          {/* Assigned Vet */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
            <p className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Attending Veterinarian</p>
            <p className="text-sm font-bold text-blue-800">
              {caseData.vet?.user?.name ? `Dr. ${caseData.vet.user.name}` : 'Unassigned (Awaiting Review)'}
            </p>
            <p className="text-slate-600">{caseData.vet?.hospitalName || 'District Polyclinic'}</p>
            <p className="text-slate-500 text-[11px]">Vet Reg ID: {caseData.vet?.vetId || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Reported Symptoms & Risk Engine Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Reported Clinical Signs */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-slate-900 font-['Outfit']">
            Observed Symptoms & Field Vitals
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <p className="font-semibold text-slate-500 mb-1.5 flex items-center justify-between">
                <span>Observed Symptoms:</span>
                <span className="text-[10px] text-slate-400">Farmer Observation</span>
              </p>
              <div className="flex flex-wrap gap-1.5">
                {JSON.parse(report?.symptoms || '[]').map((s: string, idx: number) => {
                  const isCustom = s.startsWith('Other:') || s.toLowerCase().startsWith('other');
                  return (
                    <span
                      key={idx}
                      className={`font-bold px-2.5 py-1 rounded-lg border text-xs flex items-center gap-1.5 ${
                        isCustom
                          ? 'bg-purple-100 text-purple-900 border-purple-300 ring-2 ring-purple-400/20 shadow-sm'
                          : 'bg-blue-50 text-blue-800 border-blue-200'
                      }`}
                    >
                      {isCustom && <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />}
                      <span>{s}</span>
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-slate-500">Duration:</p>
                <p className="font-bold text-slate-900 text-sm">{report?.durationDays} Days</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-slate-500">Body Temperature:</p>
                <p className="font-bold text-slate-900 text-sm">{report?.temperatureF ? `${report.temperatureF} °F` : 'Not recorded'}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-slate-500">Appetite State:</p>
                <p className="font-bold text-slate-900 text-sm">{report?.appetiteStatus}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-slate-500">Milk Production Drop:</p>
                <p className="font-bold text-slate-900 text-sm">{report?.milkProductionChange}</p>
              </div>
            </div>

            {report?.additionalDescription && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="font-semibold text-slate-500 mb-1">Farmer's Description / Custom Notes:</p>
                <p className="text-slate-700 italic leading-relaxed">"{report.additionalDescription}"</p>
              </div>
            )}

            {/* Photographic Evidence for Authorized Review */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-blue-600" />
                  <span>Photographic Evidence (अधिकृत तपासणी)</span>
                </p>
                <span className="text-[10px] text-slate-500">Click to view full-resolution</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Clinical Symptom Photo */}
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-900 shadow-sm flex flex-col justify-between">
                  <div className="relative aspect-video sm:h-36 w-full flex items-center justify-center overflow-hidden bg-slate-950 group">
                    {report?.photoUrl ? (
                      <>
                        <img
                          src={report.photoUrl}
                          alt="Clinical Case Evidence"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform cursor-pointer"
                          onClick={() => setSelectedImageModal(report.photoUrl)}
                        />
                        <div
                          onClick={() => setSelectedImageModal(report.photoUrl)}
                          className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                        >
                          <span className="px-2.5 py-1 rounded-lg bg-white/90 text-slate-900 font-bold text-xs flex items-center gap-1">
                            <ZoomIn className="w-3.5 h-3.5" /> Enlarge
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-3 text-slate-400">
                        <ImageIcon className="w-6 h-6 mx-auto mb-1 text-slate-600" />
                        <p className="text-[11px]">No clinical symptom photo uploaded</p>
                      </div>
                    )}
                  </div>
                  <div className="p-2 bg-slate-800 border-t border-slate-700 text-[11px] text-slate-200 flex items-center justify-between">
                    <span className="font-semibold truncate">Clinical Report Photo</span>
                    {report?.photoUrl && (
                      <button
                        type="button"
                        onClick={() => setSelectedImageModal(report.photoUrl)}
                        className="text-blue-400 hover:text-blue-300 font-bold text-[10px]"
                      >
                        View Full
                      </button>
                    )}
                  </div>
                </div>

                {/* Animal Profile Photo */}
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-900 shadow-sm flex flex-col justify-between">
                  <div className="relative aspect-video sm:h-36 w-full flex items-center justify-center overflow-hidden bg-slate-950 group">
                    {animal?.photoUrl ? (
                      <>
                        <img
                          src={animal.photoUrl}
                          alt="Animal Profile"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform cursor-pointer"
                          onClick={() => setSelectedImageModal(animal.photoUrl)}
                        />
                        <div
                          onClick={() => setSelectedImageModal(animal.photoUrl)}
                          className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                        >
                          <span className="px-2.5 py-1 rounded-lg bg-white/90 text-slate-900 font-bold text-xs flex items-center gap-1">
                            <ZoomIn className="w-3.5 h-3.5" /> Enlarge
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-3 text-slate-400">
                        <ImageIcon className="w-6 h-6 mx-auto mb-1 text-slate-600" />
                        <p className="text-[11px]">No animal profile photo registered</p>
                      </div>
                    )}
                  </div>
                  <div className="p-2 bg-slate-800 border-t border-slate-700 text-[11px] text-slate-200 flex items-center justify-between">
                    <span className="font-semibold truncate">Animal Profile Photo</span>
                    {animal?.photoUrl && (
                      <button
                        type="button"
                        onClick={() => setSelectedImageModal(animal.photoUrl)}
                        className="text-blue-400 hover:text-blue-300 font-bold text-[10px]"
                      >
                        View Full
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Automated Decision Support Engine */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 font-['Outfit']">
              Automated Decision Support
            </h3>
            <RiskBadge level={report?.riskLevel} score={report?.riskScore} />
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 space-y-1 text-amber-900">
              <p className="font-bold text-sm">Suspected Category: {report?.riskAssessment?.possibleCategory}</p>
              <p className="leading-relaxed">{report?.riskAssessment?.recommendedAction}</p>
            </div>

            <div>
              <p className="font-semibold text-slate-700 mb-1.5">Contributing Epidemiological Risk Factors:</p>
              <ul className="space-y-1">
                {JSON.parse(report?.riskAssessment?.riskFactors || '[]').map((f: string, i: number) => (
                  <li key={i} className="flex items-center gap-1.5 text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3 bg-slate-100 rounded-xl text-slate-600 leading-relaxed italic text-[11px] border border-slate-200">
              ⚡ <strong>Clinical Rule Notice:</strong> This score is generated by a rule-based epidemiological decision-support engine. Clinical diagnostic authority and confirmed therapeutic management remain strictly with the certified veterinarian.
            </div>
          </div>
        </div>
      </div>

      {/* Official Clinical Diagnosis & Treatments Recorded */}
      {caseData.clinicalDiagnosis && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-slate-900 font-['Outfit'] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Official Veterinary Clinical Diagnosis</span>
            </h3>
            <span className="text-xs text-slate-500">
              Updated on {new Date(caseData.updatedAt).toLocaleDateString()}
            </span>
          </div>

          <div className="text-xs space-y-2 text-slate-700">
            <p><strong>Primary Diagnosis:</strong> <span className="text-slate-900 font-bold text-sm">{caseData.clinicalDiagnosis}</span></p>
            {caseData.confirmedDisease && (
              <p><strong>Confirmed Etiology:</strong> {caseData.confirmedDisease}</p>
            )}
            <p><strong>Severity Grade:</strong> {caseData.clinicalSeverity}</p>
            {caseData.clinicalNotes && (
              <p className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-slate-800">
                <strong>Clinical Examination Notes:</strong> {caseData.clinicalNotes}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Diagnosis Modal */}
      <Modal
        isOpen={isDiagModalOpen}
        onClose={() => setIsDiagModalOpen(false)}
        title="Official Veterinary Clinical Diagnosis"
        maxWidth="lg"
      >
        <form onSubmit={handleSaveDiagnosis} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Clinical Diagnosis *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Acute Aphthous Fever (FMD) with secondary hoof lesions"
              value={diagForm.clinicalDiagnosis}
              onChange={(e) => setDiagForm({ ...diagForm, clinicalDiagnosis: e.target.value })}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Confirmed Disease Etiology
              </label>
              <input
                type="text"
                placeholder="e.g. FMD Serotype O / Pasteurella multocida"
                value={diagForm.confirmedDisease}
                onChange={(e) => setDiagForm({ ...diagForm, confirmedDisease: e.target.value })}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Clinical Severity
              </label>
              <select
                value={diagForm.clinicalSeverity}
                onChange={(e) => setDiagForm({ ...diagForm, clinicalSeverity: e.target.value })}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none font-medium"
              >
                <option value="Mild">Mild</option>
                <option value="Moderate">Moderate</option>
                <option value="Severe">Severe</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Clinical Examination Notes
            </label>
            <textarea
              rows={3}
              placeholder="Physical findings, vesicle rupture sites, temperature reading..."
              value={diagForm.clinicalNotes}
              onChange={(e) => setDiagForm({ ...diagForm, clinicalNotes: e.target.value })}
              className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsDiagModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 text-xs font-bold bg-emerald-600 text-white rounded-xl shadow"
            >
              {submitting ? 'Saving...' : 'Submit Certified Diagnosis'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Prescribe Treatment Modal */}
      <Modal
        isOpen={isTreatmentModalOpen}
        onClose={() => setIsTreatmentModalOpen(false)}
        title="Issue Veterinary E-Prescription"
        maxWidth="2xl"
      >
        <form onSubmit={handleSaveTreatment} className="space-y-4 text-xs sm:text-sm">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                Medicines & Dosages
              </label>
              <button
                type="button"
                onClick={addMedicineRow}
                className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Medicine</span>
              </button>
            </div>

            {medicines.map((med, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                <div className="sm:col-span-1">
                  <input
                    type="text"
                    required
                    placeholder="Medicine name"
                    value={med.name}
                    onChange={(e) => {
                      const updated = [...medicines];
                      updated[idx].name = e.target.value;
                      setMedicines(updated);
                    }}
                    className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg outline-none font-medium"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Dosage (e.g. 15 ml)"
                    value={med.dosage}
                    onChange={(e) => {
                      const updated = [...medicines];
                      updated[idx].dosage = e.target.value;
                      setMedicines(updated);
                    }}
                    className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Frequency (e.g. Twice daily IM)"
                    value={med.frequency}
                    onChange={(e) => {
                      const updated = [...medicines];
                      updated[idx].frequency = e.target.value;
                      setMedicines(updated);
                    }}
                    className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg outline-none"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Duration"
                    value={med.duration}
                    onChange={(e) => {
                      const updated = [...medicines];
                      updated[idx].duration = e.target.value;
                      setMedicines(updated);
                    }}
                    className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg outline-none"
                  />
                  {medicines.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMedicineRow(idx)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Instructions & Nutrition Advice
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Feed lukewarm rice gruel, keep shed clean and disinfected with 4% soda..."
              value={treatmentInstructions}
              onChange={(e) => setTreatmentInstructions(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Scheduled Follow-up Date
            </label>
            <input
              type="date"
              value={followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsTreatmentModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 text-xs font-bold bg-indigo-600 text-white rounded-xl shadow"
            >
              {submitting ? 'Prescribing...' : 'Issue E-Prescription'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Request Lab Sample Modal */}
      <Modal
        isOpen={isSampleModalOpen}
        onClose={() => setIsSampleModalOpen(false)}
        title="Order Diagnostic Laboratory Sample"
        maxWidth="lg"
      >
        <form onSubmit={handleRequestSample} className="space-y-4 text-xs sm:text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Sample Specimen Type *
              </label>
              <select
                value={sampleForm.sampleType}
                onChange={(e) => setSampleForm({ ...sampleForm, sampleType: e.target.value })}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none font-medium"
              >
                <option value="Blood / Serum">Blood / Serum</option>
                <option value="Nasal Swab & Vesicular Fluid">Nasal Swab & Vesicular Fluid</option>
                <option value="Milk Sample">Milk Sample</option>
                <option value="Tissue / Biopsy">Tissue / Biopsy</option>
                <option value="Fecal Sample">Fecal Sample</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Diagnostic Test Type *
              </label>
              <select
                value={sampleForm.testType}
                onChange={(e) => setSampleForm({ ...sampleForm, testType: e.target.value })}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none font-medium"
              >
                <option value="RT-PCR">RT-PCR (Polymerase Chain Reaction)</option>
                <option value="ELISA">ELISA (Antibody/Antigen)</option>
                <option value="Microscopy & Smear">Microscopy & Smear</option>
                <option value="Bacterial Culture & Sensitivity">Bacterial Culture & Sensitivity</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Destination Laboratory *
            </label>
            <input
              type="text"
              required
              value={sampleForm.laboratoryName}
              onChange={(e) => setSampleForm({ ...sampleForm, laboratoryName: e.target.value })}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsSampleModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 text-xs font-bold bg-amber-500 text-slate-950 rounded-xl shadow"
            >
              {submitting ? 'Ordering...' : 'Order Diagnostic Test'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Full-Resolution Image Inspection Modal */}
      <Modal
        isOpen={!!selectedImageModal}
        onClose={() => setSelectedImageModal(null)}
        title="High-Resolution Clinical Photographic Evidence"
        maxWidth="xl"
      >
        <div className="space-y-4">
          {selectedImageModal && (
            <div className="rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center p-2 border border-slate-800">
              <img
                src={selectedImageModal}
                alt="Enlarged Clinical Evidence"
                className="max-h-[70vh] w-auto max-w-full object-contain rounded-lg"
              />
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>Official digital evidence record filed under case {caseData.caseCode}</span>
            <button
              type="button"
              onClick={() => setSelectedImageModal(null)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
            >
              Close Viewer
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
