import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../types';
import { api } from '../services/api';
import { DataService } from '../services/dataService';
import {
  Globe,
  Bell,
  LogOut,
  Shield,
  Activity,
  Menu,
  X,
  CheckCircle2,
  Check,
  AlertTriangle,
  Flame,
  ArrowRight,
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const fetchNotifications = () => {
    if (user) {
      DataService.getNotifications()
        .then((data) => {
          setNotifications(data);
        })
        .catch(() => {});
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000); // Check every 15s
    return () => clearInterval(interval);
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const hasCriticalUnread = notifications.some(
    (n) => !n.isRead && (n.type === 'OUTBREAK' || n.title.includes('CRITICAL') || n.title.includes('🚨'))
  );

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const markAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {}
  };

  const handleNotificationClick = async (notif: any) => {
    if (!notif.isRead) {
      try {
        await api.put(`/notifications/${notif.id}/read`);
        setNotifications((prev) =>
          prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
        );
      } catch {}
    }
    setShowNotifs(false);
    if (notif.link) {
      navigate(notif.link);
    }
  };

  const markSingleRead = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch {}
  };

  const getPriorityBadge = (notif: any) => {
    if (notif.type === 'OUTBREAK' || notif.title.includes('CRITICAL') || notif.title.includes('🚨')) {
      return {
        label: 'CRITICAL',
        color: 'bg-red-500/20 text-red-300 border-red-500/40 ring-1 ring-red-500/50',
        icon: Flame,
      };
    }
    if (notif.title.includes('High') || notif.type === 'ALERT') {
      return {
        label: 'HIGH',
        color: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        icon: AlertTriangle,
      };
    }
    if (notif.type === 'VACCINE' || notif.type === 'CASE_UPDATE') {
      return {
        label: 'UPDATE',
        color: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
        icon: Activity,
      };
    }
    return {
      label: 'INFO',
      color: 'bg-slate-700 text-slate-300 border-slate-600',
      icon: Activity,
    };
  };

  const formatTimestamp = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const diffMs = Date.now() - d.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      if (diffMins < 2) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  return (
    <header className="bg-slate-900 text-white sticky top-0 z-40 shadow-md">
      {/* Tricolor Government Ribbon */}
      <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-600" />

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Sidebar toggle + Logo */}
          <div className="flex items-center gap-3">
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 lg:hidden"
                aria-label="Toggle Navigation"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center text-xl shadow-inner border border-blue-400/30 group-hover:scale-105 transition-transform">
                🐄
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg lg:text-xl tracking-tight text-white font-['Outfit']">
                    Pashu<span className="text-amber-400">Setu</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-900/80 text-blue-200 border border-blue-700/50">
                    SIH 6128
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 hidden sm:block">
                  Govt of Maharashtra • Early Warning System
                </p>
              </div>
            </Link>
          </div>

          {/* Right: Language, Notifications, User */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
                title="Change Language"
              >
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span className="uppercase">{language}</span>
              </button>

              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-36 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-1 z-50">
                  <button
                    onClick={() => { setLanguage('en'); setShowLangMenu(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-700 flex items-center justify-between ${language === 'en' ? 'text-amber-400 font-bold' : 'text-slate-300'}`}
                  >
                    <span>English</span>
                    {language === 'en' && <CheckCircle2 className="w-3 h-3" />}
                  </button>
                  <button
                    onClick={() => { setLanguage('mr'); setShowLangMenu(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-700 flex items-center justify-between ${language === 'mr' ? 'text-amber-400 font-bold' : 'text-slate-300'}`}
                  >
                    <span>मराठी (Marathi)</span>
                    {language === 'mr' && <CheckCircle2 className="w-3 h-3" />}
                  </button>
                  <button
                    onClick={() => { setLanguage('hi'); setShowLangMenu(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-700 flex items-center justify-between ${language === 'hi' ? 'text-amber-400 font-bold' : 'text-slate-300'}`}
                  >
                    <span>हिंदी (Hindi)</span>
                    {language === 'hi' && <CheckCircle2 className="w-3 h-3" />}
                  </button>
                </div>
              )}
            </div>

            {/* Notifications (if logged in) */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setShowNotifs(!showNotifs)}
                  className={`relative p-2 rounded-xl transition-all ${
                    hasCriticalUnread
                      ? 'bg-red-950/60 text-red-400 border border-red-500/60 shadow-[0_0_12px_rgba(239,68,68,0.4)] animate-pulse'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span
                      className={`absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow ${
                        hasCriticalUnread ? 'bg-red-600 animate-bounce' : 'bg-blue-600'
                      }`}
                    >
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifs && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50">
                    <div className="p-3.5 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-bold text-white">Notifications & Live Alerts</span>
                        {unreadCount > 0 && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40">
                            {unreadCount} unread
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllRead}
                          className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold hover:underline"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-800">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-xs text-slate-400">
                          <Bell className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
                          <p>No notifications right now.</p>
                        </div>
                      ) : (
                        notifications.map((notif) => {
                          const priority = getPriorityBadge(notif);
                          const PriorityIcon = priority.icon;
                          return (
                            <div
                              key={notif.id}
                              onClick={() => handleNotificationClick(notif)}
                              className={`p-3.5 text-xs hover:bg-slate-800/80 transition-colors cursor-pointer group flex items-start gap-2.5 ${
                                !notif.isRead ? 'bg-slate-800/40' : 'text-slate-400'
                              } ${
                                notif.type === 'OUTBREAK' || notif.title.includes('CRITICAL')
                                  ? 'border-l-4 border-l-red-500 bg-red-950/20'
                                  : ''
                              }`}
                            >
                              {/* Unread indicator */}
                              <div className="pt-1 shrink-0">
                                {!notif.isRead ? (
                                  <div
                                    className={`w-2 h-2 rounded-full ${
                                      notif.type === 'OUTBREAK' || notif.title.includes('CRITICAL')
                                        ? 'bg-red-500 animate-ping'
                                        : 'bg-blue-500'
                                    }`}
                                  />
                                ) : (
                                  <div className="w-2 h-2 rounded-full bg-slate-700" />
                                )}
                              </div>

                              <div className="flex-1 min-w-0 space-y-1">
                                <div className="flex items-center justify-between gap-1">
                                  <span
                                    className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded border inline-flex items-center gap-1 ${priority.color}`}
                                  >
                                    <PriorityIcon className="w-2.5 h-2.5" />
                                    <span>{priority.label}</span>
                                  </span>
                                  <span className="text-[10px] text-slate-500 font-mono">
                                    {formatTimestamp(notif.createdAt)}
                                  </span>
                                </div>

                                <p
                                  className={`text-xs leading-snug line-clamp-1 ${
                                    !notif.isRead ? 'font-bold text-white' : 'font-medium text-slate-300'
                                  }`}
                                >
                                  {notif.title}
                                </p>

                                <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-2">
                                  {notif.message}
                                </p>

                                {notif.link && (
                                  <p className="text-[10px] text-blue-400 group-hover:text-blue-300 flex items-center gap-1 font-semibold pt-0.5">
                                    <span>Open related case / report</span>
                                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                                  </p>
                                )}
                              </div>

                              {/* Quick Mark Read Check button */}
                              {!notif.isRead && (
                                <button
                                  type="button"
                                  onClick={(e) => markSingleRead(e, notif.id)}
                                  title="Mark as read"
                                  className="p-1 rounded text-slate-500 hover:text-emerald-400 hover:bg-slate-700/50 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Footer to Dedicated Notifications Page */}
                    <div className="p-2.5 bg-slate-800/90 border-t border-slate-700 text-center">
                      <Link
                        to={`/${user.role.toLowerCase()}/notifications`}
                        onClick={() => setShowNotifs(false)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <span>View Notifications Center</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Session Info or Login Links */}
            {user ? (
              <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-bold text-white leading-tight">{user.name}</p>
                  <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/auth/role-select"
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg shadow transition-colors flex items-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>{t('login')}</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
