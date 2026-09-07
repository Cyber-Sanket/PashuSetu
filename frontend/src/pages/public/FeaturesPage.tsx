import React from 'react';
import {
  HeartPulse,
  BrainCircuit,
  MapPin,
  Syringe,
  Microscope,
  WifiOff,
  Globe,
  Bell,
  FileSpreadsheet,
} from 'lucide-react';

export const FeaturesPage: React.FC = () => {
  const featureList = [
    {
      title: 'Farmer Livestock Health Registry',
      icon: HeartPulse,
      desc: 'Complete digital life records for cattle, buffalo, sheep, and goats with Ear Tag IDs, age, weight, and vaccination history.',
    },
    {
      title: 'Rule-Based Risk Assessment Engine',
      icon: BrainCircuit,
      desc: 'Epidemiological algorithm calculating 0-100 severity scores and categorized risk tiers (Low, Medium, High, Critical) with decision-support disclaimers.',
    },
    {
      title: 'GIS Disease Surveillance Map',
      icon: MapPin,
      desc: 'Interactive Leaflet map showing active disease outbreaks, district risk heatmaps, and veterinary dispensary coverage.',
    },
    {
      title: 'Vaccination & Deworming Tracking',
      icon: Syringe,
      desc: 'Automated schedules and upcoming booster reminders for FMD, HS, BQ, Brucellosis, and Lumpy Skin Disease.',
    },
    {
      title: 'Diagnostic Lab Sample Management',
      icon: Microscope,
      desc: 'End-to-end chain of custody tracking from field sample collection to RT-PCR/ELISA testing and positive confirmation alerts.',
    },
    {
      title: 'Offline-Ready Rural PWA',
      icon: WifiOff,
      desc: 'Local browser storage for symptom reports filed in low-connectivity areas, with automatic background synchronization when online.',
    },
    {
      title: 'Multilingual Regional Support',
      icon: Globe,
      desc: 'Full native interface in English, मराठी (Marathi), and हिंदी (Hindi) with farmer-friendly vernacular terms.',
    },
    {
      title: 'Proactive Early Warning Alerts',
      icon: Bell,
      desc: 'Targeted SMS/notification alerts dispatched to farmers within an outbreak radius when new clusters are detected.',
    },
    {
      title: 'Government Surveillance Reports Export',
      icon: FileSpreadsheet,
      desc: 'One-click export of daily, weekly, mortality, and outbreak epidemiology data as downloadable CSV files.',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-10">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Outfit']">
          Comprehensive Platform Features
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
          Built to deliver end-to-end veterinary surveillance, epidemiological triage, and rapid outbreak containment.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {featureList.map((f, i) => {
          const Icon = f.icon;
          return (
            <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-2">{f.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{f.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
