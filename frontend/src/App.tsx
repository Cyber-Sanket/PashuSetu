import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { OfflineProvider } from './context/OfflineContext';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { FarmerLayout } from './layouts/FarmerLayout';
import { VeterinarianLayout } from './layouts/VeterinarianLayout';
import { GovernmentLayout } from './layouts/GovernmentLayout';

// Public & Auth Pages
import { HomePage } from './pages/public/HomePage';
import { AboutPage } from './pages/public/AboutPage';
import { FeaturesPage } from './pages/public/FeaturesPage';
import { RoleSelectPage } from './pages/auth/RoleSelectPage';
import { FarmerLoginPage } from './pages/auth/FarmerLoginPage';
import { FarmerRegisterPage } from './pages/auth/FarmerRegisterPage';
import { VetLoginPage } from './pages/auth/VetLoginPage';
import { GovernmentLoginPage } from './pages/auth/GovernmentLoginPage';

// Farmer Pages
import { FarmerDashboard } from './pages/farmer/FarmerDashboard';
import { MyLivestockPage } from './pages/farmer/MyLivestockPage';
import { AnimalDetailPage } from './pages/farmer/AnimalDetailPage';
import { ReportSymptomsPage } from './pages/farmer/ReportSymptomsPage';
import { ReportDeathPage } from './pages/farmer/ReportDeathPage';
import { FarmerReportsPage } from './pages/farmer/FarmerReportsPage';
import { VaccinationsPage } from './pages/farmer/VaccinationsPage';
import { TreatmentsPage } from './pages/farmer/TreatmentsPage';
import { NearbyVetPage } from './pages/farmer/NearbyVetPage';
import { FarmerAlertsPage } from './pages/farmer/FarmerAlertsPage';

// Veterinarian Pages
import { VetDashboard } from './pages/veterinarian/VetDashboard';
import { ReportedCasesPage } from './pages/veterinarian/ReportedCasesPage';
import { CaseDetailPage } from './pages/veterinarian/CaseDetailPage';
import { LabSamplesPage } from './pages/veterinarian/LabSamplesPage';
import { VetSurveillanceMapPage } from './pages/veterinarian/VetSurveillanceMapPage';

// Government Pages
import { GovtDashboard } from './pages/government/GovtDashboard';
import { SurveillanceMapPage } from './pages/government/SurveillanceMapPage';
import { OutbreakMonitoringPage } from './pages/government/OutbreakMonitoringPage';
import { DiseaseAnalyticsPage } from './pages/government/DiseaseAnalyticsPage';
import { VaccinationMonitoringPage } from './pages/government/VaccinationMonitoringPage';
import { VeterinaryResponsePage } from './pages/government/VeterinaryResponsePage';
import { ReportsGeneratorPage } from './pages/government/ReportsGeneratorPage';
import { AdvisoriesPage } from './pages/government/AdvisoriesPage';

// Shared Pages
import { NotificationsPage } from './pages/shared/NotificationsPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <OfflineProvider>
            <Routes>
              {/* Public & Authentication Routes */}
              <Route path="/" element={<PublicLayout />}>
                <Route index element={<HomePage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="features" element={<FeaturesPage />} />
                <Route path="auth/role-select" element={<RoleSelectPage />} />
                <Route path="auth/farmer-login" element={<FarmerLoginPage />} />
                <Route path="auth/farmer-register" element={<FarmerRegisterPage />} />
                <Route path="auth/vet-login" element={<VetLoginPage />} />
                <Route path="auth/govt-login" element={<GovernmentLoginPage />} />
              </Route>

              {/* Farmer Workspace Routes */}
              <Route path="/farmer" element={<FarmerLayout />}>
                <Route index element={<FarmerDashboard />} />
                <Route path="livestock" element={<MyLivestockPage />} />
                <Route path="livestock/:id" element={<AnimalDetailPage />} />
                <Route path="report-symptoms" element={<ReportSymptomsPage />} />
                <Route path="report-death" element={<ReportDeathPage />} />
                <Route path="reports" element={<FarmerReportsPage />} />
                <Route path="vaccinations" element={<VaccinationsPage />} />
                <Route path="treatments" element={<TreatmentsPage />} />
                <Route path="nearby-vets" element={<NearbyVetPage />} />
                <Route path="alerts" element={<FarmerAlertsPage />} />
                <Route path="notifications" element={<NotificationsPage />} />
              </Route>

              {/* Veterinarian Workspace Routes */}
              <Route path="/veterinarian" element={<VeterinarianLayout />}>
                <Route index element={<VetDashboard />} />
                <Route path="cases" element={<ReportedCasesPage />} />
                <Route path="cases/:id" element={<CaseDetailPage />} />
                <Route path="map" element={<VetSurveillanceMapPage />} />
                <Route path="samples" element={<LabSamplesPage />} />
                <Route path="treatments" element={<TreatmentsPage />} />
                <Route path="notifications" element={<NotificationsPage />} />
              </Route>

              {/* Government Command Center Routes */}
              <Route path="/government" element={<GovernmentLayout />}>
                <Route index element={<GovtDashboard />} />
                <Route path="map" element={<SurveillanceMapPage />} />
                <Route path="outbreaks" element={<OutbreakMonitoringPage />} />
                <Route path="analytics" element={<DiseaseAnalyticsPage />} />
                <Route path="vaccination" element={<VaccinationMonitoringPage />} />
                <Route path="response" element={<VeterinaryResponsePage />} />
                <Route path="reports" element={<ReportsGeneratorPage />} />
                <Route path="advisories" element={<AdvisoriesPage />} />
                <Route path="notifications" element={<NotificationsPage />} />
              </Route>

              {/* Fallback to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </OfflineProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
};

export default App;
