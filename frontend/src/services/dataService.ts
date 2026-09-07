import { api } from './api';
import {
  FALLBACK_USERS,
  FALLBACK_FARMER_STATS,
  FALLBACK_ANIMALS,
  FALLBACK_REPORTS,
  FALLBACK_CASES,
  FALLBACK_VET_STATS,
  FALLBACK_LAB_SAMPLES,
  FALLBACK_VACCINATIONS,
  FALLBACK_TREATMENTS,
  FALLBACK_GOVT_STATS,
  FALLBACK_OUTBREAKS,
  FALLBACK_GIS_DATA,
  FALLBACK_ANALYTICS,
  FALLBACK_ADVISORIES,
  FALLBACK_VET_SERVICES,
  FALLBACK_NOTIFICATIONS,
} from './fallbackData';
import {
  Animal,
  SymptomReport,
  DiseaseCase,
  Vaccination,
  Treatment,
  LabSample,
  Outbreak,
  Advisory,
  NotificationItem,
  VetServiceLocation,
} from '../types';

/**
 * Reusable 3-Tier Data Fallback Strategy:
 * 1. Try real authenticated backend API.
 * 2. If API returns valid data with records, return it.
 * 3. If API throws network/server error or returns empty list for demo presentation, return verified fallback demo data.
 */
export async function fetchWithFallback<T>(
  apiCall: () => Promise<{ data: T }>,
  fallbackData: T,
  shouldFallbackIfEmptyArray: boolean = true
): Promise<T> {
  try {
    const res = await apiCall();
    const data = res.data;

    // If data is array and empty, and fallback is requested for demo
    if (shouldFallbackIfEmptyArray && Array.isArray(data) && data.length === 0) {
      return fallbackData;
    }

    if (data !== null && data !== undefined) {
      return data;
    }

    return fallbackData;
  } catch (err) {
    console.warn('[DataService] Backend request failed or unreachable, serving demo fallback data.', err);
    return fallbackData;
  }
}

export const DataService = {
  // --- FARMER APIs ---
  async getFarmerStats() {
    return fetchWithFallback(
      () => api.get('/animals/farmer/stats'),
      FALLBACK_FARMER_STATS,
      false
    );
  },

  async getAnimals(species?: string, search?: string): Promise<Animal[]> {
    return fetchWithFallback(
      () =>
        api.get('/animals', {
          params: {
            species: species && species !== 'ALL' ? species : undefined,
            search: search || undefined,
          },
        }),
      FALLBACK_ANIMALS.filter((a) => {
        if (species && species !== 'ALL' && a.species.toLowerCase() !== species.toLowerCase()) {
          return false;
        }
        if (search) {
          const q = search.toLowerCase();
          return (
            a.name?.toLowerCase().includes(q) ||
            a.animalCode.toLowerCase().includes(q) ||
            a.breed.toLowerCase().includes(q) ||
            a.identificationNumber?.toLowerCase().includes(q)
          );
        }
        return true;
      }),
      true
    );
  },

  async getAnimalById(id: string): Promise<Animal> {
    const fallback =
      FALLBACK_ANIMALS.find((a) => a.id === id || a.animalCode === id) || FALLBACK_ANIMALS[0];
    return fetchWithFallback(() => api.get(`/animals/${id}`), fallback, false);
  },

  async getFarmerReports(): Promise<SymptomReport[]> {
    return fetchWithFallback(() => api.get('/reports'), FALLBACK_REPORTS, true);
  },

  async getVaccinations(): Promise<Vaccination[]> {
    return fetchWithFallback(() => api.get('/vaccinations'), FALLBACK_VACCINATIONS, true);
  },

  async getTreatments(): Promise<Treatment[]> {
    return fetchWithFallback(() => api.get('/treatments'), FALLBACK_TREATMENTS, true);
  },

  async getNearbyVets(district?: string): Promise<VetServiceLocation[]> {
    return fetchWithFallback(
      () =>
        api.get('/vet-services', {
          params: { district: district && district !== 'ALL' ? district : undefined },
        }),
      FALLBACK_VET_SERVICES.filter((v) =>
        district && district !== 'ALL' ? v.district.toLowerCase() === district.toLowerCase() : true
      ),
      true
    );
  },

  // --- VETERINARIAN APIs ---
  async getVetStats() {
    return fetchWithFallback(() => api.get('/cases/vet/stats'), FALLBACK_VET_STATS, false);
  },

  async getVetCases(params?: {
    riskLevel?: string;
    status?: string;
    district?: string;
    disease?: string;
  }): Promise<DiseaseCase[]> {
    return fetchWithFallback(
      () => api.get('/cases', { params }),
      FALLBACK_CASES.filter((c) => {
        if (params?.riskLevel && params.riskLevel !== 'ALL' && c.report?.riskLevel !== params.riskLevel) {
          return false;
        }
        if (params?.status && params.status !== 'ALL' && c.status !== params.status) {
          return false;
        }
        if (params?.district && params.district !== 'ALL' && c.animal?.district !== params.district) {
          return false;
        }
        return true;
      }),
      true
    );
  },

  async getCaseById(id: string): Promise<DiseaseCase> {
    const fallback =
      FALLBACK_CASES.find((c) => c.id === id || c.caseCode === id) || FALLBACK_CASES[0];
    return fetchWithFallback(() => api.get(`/cases/${id}`), fallback, false);
  },

  async getLabSamples(): Promise<LabSample[]> {
    return fetchWithFallback(() => api.get('/samples'), FALLBACK_LAB_SAMPLES, true);
  },

  // --- GOVERNMENT APIs ---
  async getGovtStats() {
    return fetchWithFallback(() => api.get('/government/statistics'), FALLBACK_GOVT_STATS, false);
  },

  async getGovtOutbreaks(params?: any): Promise<Outbreak[]> {
    return fetchWithFallback(
      () => api.get('/government/outbreaks', { params }),
      FALLBACK_OUTBREAKS,
      true
    );
  },

  async getGovtGis(): Promise<{ outbreaks: Outbreak[]; reports: any[]; districtLayers: any[] }> {
    return fetchWithFallback(() => api.get('/government/gis'), FALLBACK_GIS_DATA, true);
  },

  async getGovtAnalytics() {
    return fetchWithFallback(() => api.get('/government/analytics'), FALLBACK_ANALYTICS, false);
  },

  async getAdvisories(): Promise<Advisory[]> {
    return fetchWithFallback(() => api.get('/advisories'), FALLBACK_ADVISORIES, true);
  },

  async getNotifications(): Promise<NotificationItem[]> {
    return fetchWithFallback(() => api.get('/notifications'), FALLBACK_NOTIFICATIONS, true);
  },
};
