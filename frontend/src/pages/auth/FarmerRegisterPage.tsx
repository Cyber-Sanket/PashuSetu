import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { UserPlus, AlertCircle } from 'lucide-react';

export const FarmerRegisterPage: React.FC = () => {
  const { login } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: '',
    village: '',
    block: '',
    district: 'Pune',
    state: 'Maharashtra',
    preferredLanguage: 'mr',
  });

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const districts = [
    'Pune',
    'Satara',
    'Ahmednagar',
    'Nashik',
    'Kolhapur',
    'Solapur',
    'Sangli',
    'Aurangabad',
    'Jalgaon',
    'Amravati',
    'Nagpur',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError(t('passwordsDoNotMatch'));
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post('/auth/register', formData);
      login(res.data.token, res.data.user);
      navigate('/farmer');
    } catch (err: any) {
      const serverMessage = err.response?.data?.error || err.response?.data?.message;
      setError(serverMessage || t('registrationFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-2xl mx-auto mb-2">
            📝
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-['Outfit']">
            {t('farmerRegisterTitle')}
          </h1>
          <p className="text-xs text-slate-500">
            {t('farmerRegisterSubtitle')}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700 font-medium">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                {t('fullName')} *
              </label>
              <input
                type="text"
                required
                placeholder={language === 'mr' ? 'उदा. रमेश तुकाराम पाटील' : 'e.g. Ramesh Tukaram Patil'}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                {t('mobileNumber')} *
              </label>
              <input
                type="tel"
                required
                placeholder={language === 'mr' ? '१० अंकी मोबाईल क्रमांक' : '10-digit Mobile Number'}
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              {t('emailAddress')} *
            </label>
            <input
              type="email"
              required
              placeholder="e.g. ramesh.patil@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                {t('password')} *
              </label>
              <input
                type="password"
                required
                placeholder={language === 'mr' ? 'किमान ६ अक्षरे' : 'Minimum 6 characters'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                {t('confirmPassword')} *
              </label>
              <input
                type="password"
                required
                placeholder={language === 'mr' ? 'पासवर्ड पुन्हा टाका' : 'Re-type password'}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none"
              />
            </div>
          </div>

          {/* Location Fields */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
              {t('locationAndJurisdiction')}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">{t('village')} *</label>
                <input
                  type="text"
                  required
                  placeholder={language === 'mr' ? 'उदा. उरुळी कांचन' : 'e.g. Uruli Kanchan'}
                  value={formData.village}
                  onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                  className="w-full text-xs px-2.5 py-2 bg-white border border-slate-300 rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">{t('block')} *</label>
                <input
                  type="text"
                  required
                  placeholder={language === 'mr' ? 'उदा. हवेली' : 'e.g. Haveli'}
                  value={formData.block}
                  onChange={(e) => setFormData({ ...formData, block: e.target.value })}
                  className="w-full text-xs px-2.5 py-2 bg-white border border-slate-300 rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">{t('district')} *</label>
                <select
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full text-xs px-2.5 py-2 bg-white border border-slate-300 rounded-lg outline-none font-medium"
                >
                  {districts.map((d) => {
                    let dLabel = d;
                    if (language === 'mr') {
                      if (d === 'Pune') dLabel = 'पुणे';
                      else if (d === 'Satara') dLabel = 'सातारा';
                      else if (d === 'Ahmednagar') dLabel = 'अहिल्यानगर';
                      else if (d === 'Solapur') dLabel = 'सोलापूर';
                      else if (d === 'Nashik') dLabel = 'नाशिक';
                      else if (d === 'Kolhapur') dLabel = 'कोल्हापूर';
                      else if (d === 'Sangli') dLabel = 'सांगली';
                      else if (d === 'Aurangabad') dLabel = 'छत्रपती संभाजीनगर';
                      else if (d === 'Amravati') dLabel = 'अमरावती';
                      else if (d === 'Nagpur') dLabel = 'नागपूर';
                    }
                    return (
                      <option key={d} value={d}>{dLabel}</option>
                    );
                  })}
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              {t('preferredLanguage')}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { code: 'mr', label: 'मराठी' },
                { code: 'en', label: 'English' },
                { code: 'hi', label: 'हिंदी' },
              ].map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setFormData({ ...formData, preferredLanguage: l.code })}
                  className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                    formData.preferredLanguage === l.code
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50"
          >
            <UserPlus className="w-4 h-4" />
            <span>{isSubmitting ? t('registering') : t('createFarmerAccount')}</span>
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-500 space-y-1">
          <p>
            {t('alreadyHaveAccount')}{' '}
            <Link to="/auth/farmer-login" className="font-bold text-emerald-600 hover:underline">
              {t('signInHere')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
