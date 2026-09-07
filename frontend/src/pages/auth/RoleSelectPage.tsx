import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { ArrowRight, UserCheck, Stethoscope, Building2 } from 'lucide-react';

export const RoleSelectPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          Role-Based Access Control
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 font-['Outfit']">
          Select Your Portal / तुमची भूमिका निवडा
        </h1>
        <p className="text-sm text-slate-600">
          Choose your stakeholder role to securely sign in to the appropriate surveillance dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Role 1: Farmer */}
        <div className="bg-white rounded-2xl p-6 border-2 border-emerald-200 shadow-sm hover:shadow-xl hover:border-emerald-500 transition-all flex flex-col justify-between">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-3xl mb-4">
              👨‍🌾
            </div>
            <h2 className="text-xl font-bold text-slate-900">{t('farmer')}</h2>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              {t('farmerDesc')}
            </p>
          </div>
          <Link
            to="/auth/farmer-login"
            className="mt-6 w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow transition-colors"
          >
            <span>Continue as Farmer</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Role 2: Veterinarian */}
        <div className="bg-white rounded-2xl p-6 border-2 border-blue-200 shadow-sm hover:shadow-xl hover:border-blue-500 transition-all flex flex-col justify-between">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center text-3xl mb-4">
              🩺
            </div>
            <h2 className="text-xl font-bold text-slate-900">{t('veterinarian')}</h2>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              {t('vetDesc')}
            </p>
          </div>
          <Link
            to="/auth/vet-login"
            className="mt-6 w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow transition-colors"
          >
            <span>Continue as Veterinarian</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Role 3: Government */}
        <div className="bg-white rounded-2xl p-6 border-2 border-indigo-200 shadow-sm hover:shadow-xl hover:border-indigo-500 transition-all flex flex-col justify-between">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center text-3xl mb-4">
              🏛️
            </div>
            <h2 className="text-xl font-bold text-slate-900">{t('government')}</h2>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              {t('govtDesc')}
            </p>
          </div>
          <Link
            to="/auth/govt-login"
            className="mt-6 w-full py-3 px-4 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow transition-colors"
          >
            <span>Continue as Government</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
