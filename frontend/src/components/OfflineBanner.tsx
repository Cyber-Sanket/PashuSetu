import React from 'react';
import { useOffline } from '../context/OfflineContext';
import { useLanguage } from '../context/LanguageContext';
import { WifiOff, RefreshCw, CheckCircle } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
  const { isOnline, pendingCount, syncPendingReports } = useOffline();
  const { t } = useLanguage();
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [syncedSuccess, setSyncedSuccess] = React.useState<number | null>(null);

  if (isOnline && pendingCount === 0 && !syncedSuccess) {
    return null;
  }

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const count = await syncPendingReports();
      setSyncedSuccess(count);
      setTimeout(() => setSyncedSuccess(null), 4000);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className={`px-4 py-2 text-sm font-medium flex items-center justify-between transition-colors ${!isOnline ? 'bg-amber-600 text-white' : 'bg-emerald-600 text-white'}`}>
      <div className="flex items-center gap-2 max-w-4xl mx-auto w-full justify-between">
        <div className="flex items-center gap-2">
          {!isOnline ? (
            <>
              <WifiOff className="w-4 h-4 animate-pulse text-amber-200" />
              <span>{t('offlineNotice')}</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4 text-emerald-200" />
              <span>
                {t('backOnline')}{' '}
                {pendingCount > 0
                  ? `${pendingCount} ${t('reportsWaitingToSync')}`
                  : t('allReportsSynced')}
              </span>
            </>
          )}
        </div>

        {isOnline && pendingCount > 0 && (
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="flex items-center gap-1.5 bg-white text-emerald-800 text-xs font-bold px-3 py-1 rounded shadow hover:bg-emerald-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? t('syncing') : `${t('syncPending')} (${pendingCount})`}
          </button>
        )}
      </div>
    </div>
  );
};
