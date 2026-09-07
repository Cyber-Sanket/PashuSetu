import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

interface OfflineContextType {
  isOnline: boolean;
  pendingCount: number;
  queueOfflineReport: (report: any) => void;
  syncPendingReports: () => Promise<number>;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export const OfflineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [pendingReports, setPendingReports] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('pashusetu_offline_reports');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Auto-sync when connection is restored
      syncPendingReports();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const savePending = (reports: any[]) => {
    setPendingReports(reports);
    localStorage.setItem('pashusetu_offline_reports', JSON.stringify(reports));
  };

  const queueOfflineReport = (report: any) => {
    const newQueue = [...pendingReports, { ...report, queuedAt: new Date().toISOString() }];
    savePending(newQueue);
  };

  const syncPendingReports = async (): Promise<number> => {
    if (!navigator.onLine || pendingReports.length === 0) return 0;

    let syncedCount = 0;
    const remaining: any[] = [];

    for (const report of pendingReports) {
      try {
        await api.post('/reports', report);
        syncedCount++;
      } catch (err) {
        console.error('Failed to sync offline report:', err);
        remaining.push(report);
      }
    }

    savePending(remaining);
    return syncedCount;
  };

  return (
    <OfflineContext.Provider
      value={{
        isOnline,
        pendingCount: pendingReports.length,
        queueOfflineReport,
        syncPendingReports,
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
};

export const useOffline = () => {
  const context = useContext(OfflineContext);
  if (!context) throw new Error('useOffline must be used within OfflineProvider');
  return context;
};
