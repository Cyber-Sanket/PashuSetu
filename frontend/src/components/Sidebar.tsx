import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  LayoutDashboard,
  HeartPulse,
  Syringe,
  Pill,
  FileText,
  MapPin,
  AlertTriangle,
  Skull,
  Stethoscope,
  Microscope,
  BarChart3,
  Map,
  Megaphone,
  Download,
  Building2,
  Users,
  Bell,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { t } = useLanguage();

  if (!user) return null;

  const role = user.role;

  const farmerLinks = [
    { to: '/farmer', label: t('dashboardOverview'), icon: LayoutDashboard, end: true },
    { to: '/farmer/livestock', label: t('myLivestock'), icon: HeartPulse },
    { to: '/farmer/report-symptoms', label: t('reportSymptoms'), icon: Stethoscope, highlight: true },
    { to: '/farmer/report-death', label: t('reportDeath'), icon: Skull },
    { to: '/farmer/reports', label: t('myReports'), icon: FileText },
    { to: '/farmer/vaccinations', label: t('vaccinations'), icon: Syringe },
    { to: '/farmer/treatments', label: t('treatments'), icon: Pill },
    { to: '/farmer/nearby-vets', label: t('nearbyVets'), icon: MapPin },
    { to: '/farmer/alerts', label: t('alerts'), icon: AlertTriangle },
    { to: '/farmer/notifications', label: t('notificationsAlerts'), icon: Bell },
  ];

  const vetLinks = [
    { to: '/veterinarian', label: t('caseloadDashboard'), icon: LayoutDashboard, end: true },
    { to: '/veterinarian/cases', label: t('reportedCasesQueue'), icon: HeartPulse, highlight: true },
    { to: '/veterinarian/map', label: t('districtDiseaseMap'), icon: Map },
    { to: '/veterinarian/samples', label: t('labSamples'), icon: Microscope },
    { to: '/veterinarian/treatments', label: t('prescriptionsIssued'), icon: Pill },
    { to: '/veterinarian/notifications', label: t('notificationsAlerts'), icon: Bell },
  ];

  const govtLinks = [
    { to: '/government', label: t('statewideOverview'), icon: LayoutDashboard, end: true },
    { to: '/government/map', label: t('gisDiseaseMap'), icon: Map, highlight: true },
    { to: '/government/outbreaks', label: t('outbreakDetection'), icon: AlertTriangle },
    { to: '/government/analytics', label: t('diseaseAnalytics'), icon: BarChart3 },
    { to: '/government/vaccination', label: t('vaccinationMonitoring'), icon: Syringe },
    { to: '/government/response', label: t('veterinaryResponse'), icon: Users },
    { to: '/government/reports', label: t('surveillanceReports'), icon: Download },
    { to: '/government/advisories', label: t('broadcastAdvisory'), icon: Megaphone },
    { to: '/government/notifications', label: t('notificationsAlerts'), icon: Bell },
  ];

  let links = farmerLinks;
  let roleTitle = t('farmerWorkspace');
  let badgeColor = 'bg-emerald-800/60 text-emerald-300 border-emerald-600/40';

  if (role === 'VETERINARIAN') {
    links = vetLinks;
    roleTitle = t('veterinaryPortal');
    badgeColor = 'bg-blue-800/60 text-blue-300 border-blue-600/40';
  } else if (role === 'GOVERNMENT') {
    links = govtLinks;
    roleTitle = t('stateHealthCommand');
    badgeColor = 'bg-indigo-800/60 text-indigo-300 border-indigo-600/40';
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-30 w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Role Header Banner */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/40">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            {t('currentPortal')}
          </p>
          <div className="flex items-center justify-between">
            <span className="font-bold text-white text-sm">{roleTitle}</span>
            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${badgeColor}`}>
              {role === 'FARMER' ? t('farmer') : role === 'VETERINARIAN' ? t('veterinarian') : t('government')}
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20'
                      : link.highlight
                      ? 'text-amber-300 hover:bg-slate-800/80 hover:text-amber-200'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{link.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom System Info */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <div className="truncate">
              <p className="font-semibold text-slate-300 truncate">{t('govtOfMaharashtra')}</p>
              <p className="text-[10px] text-slate-500">{t('animalHusbandryDept')}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
