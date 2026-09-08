import React from 'react';
import { ShieldCheck, Target, Award, Users, BookOpen } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
      {/* Title */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          SIH Problem Statement: SIH26128
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Outfit']">
          About PashuSetu
        </h1>
        <p className="text-base text-slate-600 max-w-2xl mx-auto">
          Smart Livestock Health Surveillance & Early Warning Decision-Support Platform
        </p>
      </div>

      {/* Overview Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Background & Problem Context</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Livestock rearing forms the socio-economic backbone of rural Maharashtra, sustaining millions of smallholder farmers and pastoral communities. However, infectious livestock epidemics such as Foot and Mouth Disease (FMD), Lumpy Skin Disease (LSD), and Haemorrhagic Septicaemia cause devastating economic losses, milk yield crashes, and animal mortality.
        </p>
        <p className="text-sm text-slate-600 leading-relaxed">
          Traditional disease surveillance suffers from late reporting, fragmented manual record-keeping, delayed laboratory sample results, and lack of real-time geospatial cluster detection. <strong>PashuSetu</strong> bridges this critical gap by connecting the farmer in the village directly with the local veterinary dispensary and state animal husbandry authorities.
        </p>
      </div>

      {/* Core Objectives Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base mb-2">Early Detection</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Empowers farmers to record symptoms using simple mobile-friendly checklists, photo capture, and offline queuing, providing immediate preliminary decision support.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base mb-2">Decision Support</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Transparent rule-based epidemiological engine evaluates sentinel symptoms, duration, and mortality clustering to flag risk levels without replacing certified veterinary authority.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-3">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base mb-2">Geospatial Containment</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Spatial-temporal cluster analysis detects increasing case densities in specific villages/blocks, triggering rapid veterinary deployment and ring vaccination.
          </p>
        </div>
      </div>

      {/* Institutional Alignment */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 space-y-4">
        <h3 className="text-lg font-bold text-amber-400">Institutional Governance & Department</h3>
        <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
          <p><strong>Organization:</strong> Government of Maharashtra</p>
          <p><strong>Department:</strong> Maharashtra State Innovation Society, Department of Skills, Employment, Entrepreneurship and Innovation</p>
          <p><strong>Operating Authority:</strong> Directorate of Animal Husbandry, Pune, Maharashtra</p>
          <p><strong>Theme:</strong> MedTech / BioTech / HealthTech (Software Category)</p>
        </div>
      </div>
    </div>
  );
};
