export type UserRole = 'FARMER' | 'VETERINARIAN' | 'GOVERNMENT';
export type Language = 'en' | 'mr' | 'hi';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type AnimalHealthStatus = 'HEALTHY' | 'SICK' | 'OBSERVATION' | 'DECEASED';
export type ReportStatus =
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'VET_ASSIGNED'
  | 'SAMPLE_REQUESTED'
  | 'DIAGNOSIS_AVAILABLE'
  | 'TREATMENT_STARTED'
  | 'RESOLVED'
  | 'CLOSED';

export type CaseStatus =
  | 'UNDER_REVIEW'
  | 'ASSIGNED'
  | 'DIAGNOSED'
  | 'TREATMENT_STARTED'
  | 'RESOLVED'
  | 'ESCALATED';

export type SampleStatus =
  | 'REQUESTED'
  | 'COLLECTED'
  | 'DISPATCHED'
  | 'RECEIVED'
  | 'TESTING'
  | 'COMPLETED';

export type OutbreakStatus =
  | 'DETECTED'
  | 'UNDER_INVESTIGATION'
  | 'CONFIRMED'
  | 'CONTAINMENT_ACTIVE'
  | 'CONTAINED'
  | 'RESOLVED';

export interface User {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  role: UserRole;
  language: Language;
  farmerProfile?: {
    id: string;
    village: string;
    block: string;
    district: string;
    state: string;
  };
  vetProfile?: {
    id: string;
    vetId: string;
    qualification: string;
    hospitalName: string;
    assignedDistrict: string;
    assignedBlock?: string;
  };
  govtProfile?: {
    id: string;
    officialId: string;
    department: string;
    designation: string;
    jurisdiction: string;
  };
}

export interface Animal {
  id: string;
  farmerId: string;
  animalCode: string;
  name?: string;
  species: string;
  breed: string;
  gender: string;
  ageYears: number;
  weightKg?: number;
  color?: string;
  identificationNumber?: string;
  healthStatus: AnimalHealthStatus;
  photoUrl?: string;
  village: string;
  block: string;
  district: string;
  latitude?: number;
  longitude?: number;
  farmer?: {
    village: string;
    block: string;
    district: string;
    user?: { name: string; mobile: string; email: string };
  };
  vaccinations?: Vaccination[];
  symptomReports?: SymptomReport[];
  treatments?: Treatment[];
  createdAt: string;
}

export interface RiskAssessment {
  id: string;
  reportId: string;
  riskScore: number;
  riskLevel: RiskLevel;
  possibleCategory: string;
  riskFactors: string; // JSON string
  recommendedAction: string;
  isDecisionSupportOnly: boolean;
  engineVersion: string;
  createdAt: string;
}

export interface SymptomReport {
  id: string;
  reportCode: string;
  animalId: string;
  farmerId: string;
  symptoms: string; // JSON string array
  durationDays: number;
  severity: string;
  temperatureF?: number;
  appetiteStatus: string;
  milkProductionChange: string;
  additionalDescription?: string;
  photoUrl?: string;
  latitude?: number;
  longitude?: number;
  village: string;
  block: string;
  district: string;
  riskScore: number;
  riskLevel: RiskLevel;
  status: ReportStatus;
  createdAt: string;
  animal?: Animal;
  riskAssessment?: RiskAssessment;
  diseaseCase?: DiseaseCase;
}

export interface DiseaseCase {
  id: string;
  caseCode: string;
  reportId: string;
  animalId: string;
  vetId?: string;
  suspectedDisease?: string;
  confirmedDisease?: string;
  clinicalDiagnosis?: string;
  clinicalSeverity?: string;
  clinicalNotes?: string;
  recommendedAction?: string;
  status: CaseStatus;
  escalatedToGovt: boolean;
  createdAt: string;
  report: SymptomReport;
  animal?: Animal;
  vet?: {
    id: string;
    vetId: string;
    qualification: string;
    hospitalName: string;
    user?: { name: string; mobile: string; email: string };
  };
  treatments?: Treatment[];
  labSamples?: LabSample[];
}

export interface MedicineItem {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface Treatment {
  id: string;
  caseId: string;
  animalId: string;
  vetId: string;
  diagnosis: string;
  medicines: string; // JSON string of MedicineItem[]
  instructions?: string;
  startDate: string;
  endDate?: string;
  followUpDate?: string;
  notes?: string;
  createdAt: string;
  animal?: Animal;
  vet?: {
    qualification: string;
    hospitalName: string;
    user?: { name: string; mobile?: string };
  };
  diseaseCase?: DiseaseCase;
}

export interface Vaccination {
  id: string;
  animalId: string;
  vaccineName: string;
  batchNumber?: string;
  doseNumber: number;
  administeredDate: string;
  nextDueDate?: string;
  administeredBy?: string;
  status: 'COMPLETED' | 'PENDING' | 'OVERDUE';
  notes?: string;
  animal?: Animal;
}

export interface LabSample {
  id: string;
  sampleCode: string;
  caseId: string;
  animalId: string;
  sampleType: string;
  collectedDate: string;
  collectionLocation: string;
  laboratoryName: string;
  testType: string;
  status: SampleStatus;
  result?: 'POSITIVE' | 'NEGATIVE' | 'INCONCLUSIVE';
  resultNotes?: string;
  resultDate?: string;
  animal?: Animal;
  diseaseCase?: DiseaseCase;
}

export interface Outbreak {
  id: string;
  outbreakCode: string;
  district: string;
  block: string;
  village: string;
  latitude: number;
  longitude: number;
  suspectedDisease: string;
  caseCount: number;
  deathCount: number;
  riskLevel: 'HIGH' | 'CRITICAL';
  status: OutbreakStatus;
  assignedTeam?: string;
  detectedAt: string;
}

export interface Advisory {
  id: string;
  titleEn: string;
  titleMr: string;
  titleHi: string;
  contentEn: string;
  contentMr: string;
  contentHi: string;
  targetDistrict: string;
  severity: 'NORMAL' | 'WARNING' | 'URGENT';
  issuedBy: string;
  isActive: boolean;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'ALERT' | 'VACCINE' | 'CASE_UPDATE' | 'OUTBREAK' | 'ADVISORY';
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface VetServiceLocation {
  id: string;
  name: string;
  type: string;
  district: string;
  block: string;
  village: string;
  address: string;
  contactPhone: string;
  latitude: number;
  longitude: number;
  doctorInCharge: string;
  operatingHours: string;
}
