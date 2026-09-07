import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import {
  Shield,
  Activity,
  HeartPulse,
  AlertTriangle,
  Stethoscope,
  Building2,
  Syringe,
  MapPin,
  ArrowRight,
  PhoneCall,
  CheckCircle2,
  FileCheck,
  Zap,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState<any>({
    totalRegisteredAnimals: 156,
    activeCases: 14,
    suspectedOutbreaks: 3,
    vaccinationCoverage: 78,
  });

  useEffect(() => {
    // Attempt to load live stats from backend
    api.get('/government/statistics')
      .then((res) => setStats(res.data))
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-blue-950 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="max-w-6xl mx-auto relative z-10 text-center space-y-6">
          {/* SIH & Department Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-900/60 border border-blue-500/30 text-xs font-semibold text-blue-200">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>Government of Maharashtra • SIH Problem Statement 6128</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight font-['Outfit'] leading-tight">
            Pashu<span className="text-amber-400">Setu</span>
          </h1>

          <p className="text-xl sm:text-2xl font-medium text-slate-200 max-w-3xl mx-auto">
            Smart Livestock Health Surveillance & Early Warning System
          </p>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            A unified digital platform connecting farmers, veterinarians, and government authorities for early disease detection, epidemiological decision support, and rapid outbreak containment across Maharashtra.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Link
              to="/farmer/report-symptoms"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3 rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 text-sm transition-all hover:scale-105"
            >
              <HeartPulse className="w-4 h-4 text-slate-950" />
              <span>Report Health Issue</span>
            </Link>

            <Link
              to="/auth/role-select"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2 text-sm transition-all hover:scale-105"
            >
              <Shield className="w-4 h-4" />
              <span>Login to Portal</span>
            </Link>

            <Link
              to="/about"
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-5 py-3 rounded-xl border border-slate-700 text-sm transition-colors"
            >
              Learn More
            </Link>
          </div>

          {/* Decision Support Disclaimer Badge */}
          <div className="pt-2">
            <p className="text-[11px] text-slate-400 max-w-xl mx-auto italic">
              ⚡ Automated Risk Assessment — Epidemiological Decision Support. Final diagnosis is confirmed by certified veterinarians.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Live Surveillance Counters */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl shadow-lg border border-slate-100 text-center">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Registered Animals</p>
            <p className="text-3xl font-extrabold text-blue-900 mt-2">{stats.totalRegisteredAnimals || 156}</p>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">Across 8 Districts</p>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-lg border border-slate-100 text-center">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Cases</p>
            <p className="text-3xl font-extrabold text-amber-600 mt-2">{stats.activeCases || 14}</p>
            <p className="text-[11px] text-slate-500 font-medium mt-1">Under Veterinary Care</p>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-lg border border-slate-100 text-center">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Outbreaks Monitored</p>
            <p className="text-3xl font-extrabold text-red-600 mt-2">{stats.suspectedOutbreaks || 3}</p>
            <p className="text-[11px] text-red-600 font-medium mt-1">Containment Active</p>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-lg border border-slate-100 text-center">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Vaccination Coverage</p>
            <p className="text-3xl font-extrabold text-emerald-700 mt-2">{stats.vaccinationCoverage || 78}%</p>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">Target Achievement</p>
          </div>
        </div>
      </section>

      {/* 3. Three Main Stakeholder Portals */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-['Outfit']">
            Unified Tripartite Healthcare Architecture
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Seamless real-time synchronization between the grassroots livestock owner, the local field veterinarian, and state command headquarters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Farmer */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                👨‍🌾
              </div>
              <h3 className="text-lg font-bold text-slate-900">Farmer / पशुपालक</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Register animals, report symptoms with photos and GPS, view automated risk ratings, track case resolution, and receive upcoming vaccination reminders.
              </p>
              <ul className="mt-4 space-y-1.5 text-xs text-slate-700">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Digital Ear Tag Animal Profiles</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Instant Decision Support Risk Score</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Offline-Ready PWA Reporting</li>
              </ul>
            </div>
            <Link
              to="/auth/farmer-login"
              className="mt-6 w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow transition-colors"
            >
              <span>Continue as Farmer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2: Veterinarian */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                🩺
              </div>
              <h3 className="text-lg font-bold text-slate-900">Veterinarian / पशुवैद्यकीय अधिकारी</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Review prioritized caseload queues, evaluate clinical indicators, conduct clinical diagnoses, prescribe treatment medicines, order lab samples, and escalate high-risk cases.
              </p>
              <ul className="mt-4 space-y-1.5 text-xs text-slate-700">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Clinical Diagnosis & E-Prescriptions</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Diagnostic Lab Sample Tracking</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Local Hotspot Surveillance Map</li>
              </ul>
            </div>
            <Link
              to="/auth/vet-login"
              className="mt-6 w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow transition-colors"
            >
              <span>Continue as Veterinarian</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 3: Government Official */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                🏛️
              </div>
              <h3 className="text-lg font-bold text-slate-900">Government Official / शासन</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Statewide disease surveillance GIS map, automated spatio-temporal outbreak cluster alerts, vaccination coverage analytics, rapid response deployment, and multilingual advisory broadcast.
              </p>
              <ul className="mt-4 space-y-1.5 text-xs text-slate-700">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" /> Interactive Leaflet GIS Hotspot Map</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" /> Automated Outbreak Cluster Detection</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" /> CSV & PDF Surveillance Reports</li>
              </ul>
            </div>
            <Link
              to="/auth/govt-login"
              className="mt-6 w-full py-2.5 px-4 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow transition-colors"
            >
              <span>Continue as Government</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Priority Disease Surveillance Guide */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 relative overflow-hidden">
          <div className="max-w-2xl relative z-10 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Statewide Early Warning Matrix
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-['Outfit']">
              Priority Livestock Endemic Diseases Monitored
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Our automated rule-based risk engine analyzes symptom patterns against major contagious livestock diseases under active surveillance in Maharashtra:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8 relative z-10">
            <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl">
              <h4 className="font-bold text-sm text-white flex items-center justify-between">
                <span>Foot and Mouth Disease (FMD)</span>
                <span className="text-[10px] text-amber-300 bg-amber-900/60 px-1.5 py-0.5 rounded">लाळ खुरकूत</span>
              </h4>
              <p className="text-xs text-slate-400 mt-1">High fever, vesicular blisters on tongue and coronary band of hooves, excessive salivation, acute drop in milk.</p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl">
              <h4 className="font-bold text-sm text-white flex items-center justify-between">
                <span>Lumpy Skin Disease (LSD)</span>
                <span className="text-[10px] text-amber-300 bg-amber-900/60 px-1.5 py-0.5 rounded">लंपी त्वचा रोग</span>
              </h4>
              <p className="text-xs text-slate-400 mt-1">Firm circumscribed cutaneous nodules (2-5 cm), fever, ocular/nasal discharge, enlarged prescapular lymph nodes.</p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl">
              <h4 className="font-bold text-sm text-white flex items-center justify-between">
                <span>Haemorrhagic Septicaemia (HS)</span>
                <span className="text-[10px] text-red-300 bg-red-900/60 px-1.5 py-0.5 rounded">घटसर्प</span>
              </h4>
              <p className="text-xs text-slate-400 mt-1">Rapid onset of respiratory distress, high fever, submandibular throat swelling, loud stertorous breathing.</p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl">
              <h4 className="font-bold text-sm text-white flex items-center justify-between">
                <span>Black Quarter (BQ)</span>
                <span className="text-[10px] text-amber-300 bg-amber-900/60 px-1.5 py-0.5 rounded">फऱ्या रोग</span>
              </h4>
              <p className="text-xs text-slate-400 mt-1">Crepitant swelling over muscular hindquarters, severe lameness, fever, acute toxemia in young cattle.</p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl">
              <h4 className="font-bold text-sm text-white flex items-center justify-between">
                <span>Bovine Mastitis</span>
                <span className="text-[10px] text-blue-300 bg-blue-900/60 px-1.5 py-0.5 rounded">स्तनदाह (कासदाह)</span>
              </h4>
              <p className="text-xs text-slate-400 mt-1">Swollen, warm, tender udder with clotted or blood-tinged milk, systemic pyrexia, refusal to nurse.</p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl">
              <h4 className="font-bold text-sm text-white flex items-center justify-between">
                <span>PPR (Small Ruminants)</span>
                <span className="text-[10px] text-amber-300 bg-amber-900/60 px-1.5 py-0.5 rounded">शेळ्यांमधील देवी</span>
              </h4>
              <p className="text-xs text-slate-400 mt-1">Acute fever, necrotic mouth ulcers, serous ocular discharge, and severe enteritis with watery diarrhea in sheep/goats.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Toll-Free Emergency Hotline Banner */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-700 to-indigo-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
              <PhoneCall className="w-8 h-8 text-amber-400 animate-bounce" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-200">24x7 Government Livestock Helpline</p>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-['Outfit']">Toll-Free: 1962</h3>
              <p className="text-xs text-blue-100 mt-1">Mobile Veterinary Units available for emergency farmstead visits across all talukas in Maharashtra.</p>
            </div>
          </div>

          <Link
            to="/farmer/nearby-vets"
            className="bg-white text-blue-900 hover:bg-blue-50 font-bold px-6 py-3 rounded-xl shadow text-sm shrink-0 transition-colors"
          >
            Locate Nearest Veterinary Center
          </Link>
        </div>
      </section>
    </div>
  );
};
