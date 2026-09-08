import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { UserCheck, Stethoscope, Building2, Sparkles } from 'lucide-react';

export const QuickDemoBar: React.FC = () => {
  const { loginAsDemo, user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleDemo = async (role: 'FARMER' | 'VETERINARIAN' | 'GOVERNMENT') => {
    await loginAsDemo(role);
    if (role === 'FARMER') navigate('/farmer');
    else if (role === 'VETERINARIAN') navigate('/veterinarian');
    else if (role === 'GOVERNMENT') navigate('/government');
  };

  return (
    <div className="bg-slate-900 text-white border-b border-slate-800 px-4 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t('sihQuickAccess')}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleDemo('FARMER')}
            className={`px-2.5 py-1 rounded flex items-center gap-1 font-medium transition-colors ${
              user?.role === 'FARMER'
                ? 'bg-emerald-600 text-white ring-2 ring-emerald-300'
                : 'bg-slate-800 hover:bg-slate-700 text-emerald-300'
            }`}
          >
            <UserCheck className="w-3 h-3" />
            <span>{t('patilFarmer')}</span>
          </button>

          <button
            onClick={() => handleDemo('VETERINARIAN')}
            className={`px-2.5 py-1 rounded flex items-center gap-1 font-medium transition-colors ${
              user?.role === 'VETERINARIAN'
                ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                : 'bg-slate-800 hover:bg-slate-700 text-blue-300'
            }`}
          >
            <Stethoscope className="w-3 h-3" />
            <span>{t('kulkarniVet')}</span>
          </button>

          <button
            onClick={() => handleDemo('GOVERNMENT')}
            className={`px-2.5 py-1 rounded flex items-center gap-1 font-medium transition-colors ${
              user?.role === 'GOVERNMENT'
                ? 'bg-indigo-600 text-white ring-2 ring-indigo-300'
                : 'bg-slate-800 hover:bg-slate-700 text-indigo-300'
            }`}
          >
            <Building2 className="w-3 h-3" />
            <span>{t('deshmukhGovt')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
