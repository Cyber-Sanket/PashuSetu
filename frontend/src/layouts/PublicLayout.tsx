import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { OfflineBanner } from '../components/OfflineBanner';
import { QuickDemoBar } from '../components/QuickDemoBar';
import { Shield, PhoneCall, Building2 } from 'lucide-react';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <QuickDemoBar />
      <Navbar />
      <OfflineBanner />

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Official Government Footer */}
      <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🐄</span>
                <span className="font-bold text-white text-base font-['Outfit']">
                  Pashu<span className="text-amber-400">Setu</span>
                </span>
                <span className="text-[10px] bg-blue-900 text-blue-200 px-1.5 py-0.5 rounded font-bold">
                  SIH 6128
                </span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed max-w-md">
                Smart Livestock Health Surveillance & Early Warning System. A unified decision-support platform connecting farmers, veterinarians, and government authorities for early disease detection and coordinated containment across Maharashtra.
              </p>
              <p className="text-[11px] text-slate-500 mt-2">
                Developed for Smart India Hackathon • Department of Skills, Employment, Entrepreneurship and Innovation & Maharashtra State Innovation Society.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Quick Navigation</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">About PashuSetu</Link></li>
                <li><Link to="/features" className="hover:text-white transition-colors">System Features</Link></li>
                <li><Link to="/auth/role-select" className="hover:text-white transition-colors">Portal Login</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
                Emergency Support
              </h4>
              <p className="text-slate-300 font-semibold text-sm">Toll-Free Helpline: 1962</p>
              <p className="text-[11px] text-slate-400 mt-1">
                State Animal Disease Emergency Response & Mobile Veterinary Units.
              </p>
              <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Decision Support Platform</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
            <p>© {new Date().getFullYear()} Government of Maharashtra. Department of Animal Husbandry.</p>
            <p>SIH Problem Statement 6128 • MedTech / BioTech / HealthTech</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
