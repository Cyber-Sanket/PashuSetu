import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { DataService } from '../../services/dataService';
import { NotificationItem } from '../../types';
import {
  useLanguage,
  getNotificationTitle,
  getNotificationDescription,
  getNotificationPriorityLabel,
} from '../../context/LanguageContext';
import {
  Bell,
  CheckCircle2,
  Check,
  AlertTriangle,
  Flame,
  ArrowRight,
  Activity,
  Syringe,
  Megaphone,
  Clock,
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'ALL' | 'UNREAD' | 'CRITICAL' | 'CASES' | 'ADVISORIES'>('ALL');
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await DataService.getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Failed to mark all read:', err);
    }
  };

  const markSingleRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error('Failed to mark notification read:', err);
    }
  };

  const handleOpenNotification = async (notif: NotificationItem) => {
    if (!notif.isRead) {
      await markSingleRead(notif.id);
    }
    if (notif.link) {
      navigate(notif.link);
    }
  };

  const getPriorityInfo = (notif: NotificationItem) => {
    if (notif.type === 'OUTBREAK' || notif.title.includes('CRITICAL') || notif.title.includes('🚨')) {
      return {
        level: t('priorityCritical'),
        color: 'bg-red-50 text-red-700 border-red-200 ring-1 ring-red-400/30',
        cardBorder: 'border-l-4 border-l-red-600 bg-red-50/20',
        icon: Flame,
      };
    }
    if (notif.title.includes('High') || notif.type === 'ALERT') {
      return {
        level: t('priorityHigh'),
        color: 'bg-amber-50 text-amber-800 border-amber-200',
        cardBorder: 'border-l-4 border-l-amber-500 bg-amber-50/20',
        icon: AlertTriangle,
      };
    }
    if (notif.type === 'VACCINE') {
      return {
        level: t('priorityVaccination'),
        color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        cardBorder: 'border-l-4 border-l-emerald-500',
        icon: Syringe,
      };
    }
    if (notif.type === 'ADVISORY') {
      return {
        level: t('priorityAdvisory'),
        color: 'bg-purple-50 text-purple-800 border-purple-200',
        cardBorder: 'border-l-4 border-l-purple-500',
        icon: Megaphone,
      };
    }
    return {
      level: t('priorityUpdate'),
      color: 'bg-blue-50 text-blue-800 border-blue-200',
      cardBorder: 'border-l-4 border-l-blue-500',
      icon: Activity,
    };
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'UNREAD') return !n.isRead;
    if (activeTab === 'CRITICAL') {
      return n.type === 'OUTBREAK' || n.title.includes('CRITICAL') || n.title.includes('🚨') || n.title.includes('High');
    }
    if (activeTab === 'CASES') {
      return n.type === 'CASE_UPDATE' || n.type === 'VACCINE';
    }
    if (activeTab === 'ADVISORIES') {
      return n.type === 'ADVISORY';
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 font-['Outfit']">
              {t('notificationsCenterTitle')}
            </h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-red-100 text-red-800 border border-red-200 animate-pulse">
                {unreadCount} {t('unread')}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('notificationsCenterSubtitle')}
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700 shadow-sm transition-colors self-start sm:self-auto"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t('markAllRead')}</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'ALL', label: t('allNotifications'), count: notifications.length },
          { id: 'UNREAD', label: t('unread'), count: unreadCount },
          {
            id: 'CRITICAL',
            label: t('outbreaksAndHighRisk'),
            count: notifications.filter(
              (n) => n.type === 'OUTBREAK' || n.title.includes('CRITICAL') || n.title.includes('🚨') || n.title.includes('High')
            ).length,
          },
          {
            id: 'CASES',
            label: t('casesAndVaccines'),
            count: notifications.filter((n) => n.type === 'CASE_UPDATE' || n.type === 'VACCINE').length,
          },
          {
            id: 'ADVISORIES',
            label: t('stateAdvisories'),
            count: notifications.filter((n) => n.type === 'ADVISORY').length,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white shadow'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeTab === tab.id
                  ? 'bg-slate-700 text-slate-200'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Notification List */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500">{t('loadingNotifications')}</div>
      ) : filteredNotifications.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Bell className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-slate-700">{t('noNotificationsInView')}</p>
          <p className="text-xs text-slate-500">
            {activeTab === 'UNREAD'
              ? t('allCaughtUp')
              : t('newAlertsAppearHere')}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notif) => {
            const priority = getPriorityInfo(notif);
            const PriorityIcon = priority.icon;

            return (
              <div
                key={notif.id}
                className={`bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm transition-all hover:shadow-md ${
                  priority.cardBorder
                } ${!notif.isRead ? 'ring-1 ring-blue-500/30 shadow-blue-50/50' : 'opacity-90'}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-2 flex-1">
                    {/* Header Row: Priority + Status + Timestamp */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-lg border flex items-center gap-1 ${priority.color}`}
                      >
                        <PriorityIcon className="w-3 h-3 shrink-0" />
                        <span>{priority.level}</span>
                      </span>

                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 ring-4 ring-blue-100" />
                      )}

                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>
                          {new Date(notif.createdAt).toLocaleDateString(
                            language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : [],
                            {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            }
                          )}{' '}
                          {language === 'mr' ? 'रोजी' : language === 'hi' ? 'को' : 'at'}{' '}
                          {new Date(notif.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </span>
                    </div>

                    {/* Title & Message */}
                    <h3
                      className={`text-sm font-['Outfit'] ${
                        !notif.isRead ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'
                      }`}
                    >
                      {getNotificationTitle(notif, language)}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                      {getNotificationDescription(notif, language)}
                    </p>
                  </div>

                  {/* Actions Right Side */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {!notif.isRead && (
                      <button
                        onClick={() => markSingleRead(notif.id)}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-emerald-700 text-xs font-semibold transition-colors flex items-center gap-1"
                        title={t('markRead')}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{t('markRead')}</span>
                      </button>
                    )}

                    {notif.link && (
                      <button
                        onClick={() => handleOpenNotification(notif)}
                        className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow transition-colors flex items-center gap-1.5 group"
                      >
                        <span>{t('openDetails')}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
