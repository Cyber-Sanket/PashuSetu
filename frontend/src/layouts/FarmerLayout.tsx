import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { OfflineBanner } from '../components/OfflineBanner';
import { QuickDemoBar } from '../components/QuickDemoBar';

export const FarmerLayout: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-700">Loading PashuSetu Farmer Portal...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'FARMER') {
    return <Navigate to="/auth/farmer-login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <QuickDemoBar />
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <OfflineBanner />

      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
