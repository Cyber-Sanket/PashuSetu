-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mobile" TEXT,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FarmerProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "village" TEXT NOT NULL,
    "block" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "state" TEXT NOT NULL DEFAULT 'Maharashtra',
    "pincode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FarmerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VetProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "vetId" TEXT NOT NULL,
    "qualification" TEXT NOT NULL,
    "hospitalName" TEXT NOT NULL,
    "assignedDistrict" TEXT NOT NULL,
    "assignedBlock" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VetProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GovtProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "officialId" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "jurisdiction" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GovtProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Animal" (
    "id" TEXT NOT NULL,
    "farmerId" TEXT NOT NULL,
    "animalCode" TEXT NOT NULL,
    "name" TEXT,
    "species" TEXT NOT NULL,
    "breed" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "dateOfBirth" TEXT,
    "ageYears" DOUBLE PRECISION NOT NULL,
    "weightKg" DOUBLE PRECISION,
    "color" TEXT,
    "identificationNumber" TEXT,
    "healthStatus" TEXT NOT NULL DEFAULT 'HEALTHY',
    "photoUrl" TEXT,
    "village" TEXT NOT NULL,
    "block" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Animal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SymptomReport" (
    "id" TEXT NOT NULL,
    "reportCode" TEXT NOT NULL,
    "animalId" TEXT NOT NULL,
    "farmerId" TEXT NOT NULL,
    "symptoms" TEXT NOT NULL,
    "durationDays" INTEGER NOT NULL,
    "severity" TEXT NOT NULL,
    "temperatureF" DOUBLE PRECISION,
    "appetiteStatus" TEXT NOT NULL,
    "milkProductionChange" TEXT NOT NULL,
    "additionalDescription" TEXT,
    "photoUrl" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "village" TEXT NOT NULL,
    "block" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "riskScore" INTEGER NOT NULL DEFAULT 0,
    "riskLevel" TEXT NOT NULL DEFAULT 'LOW',
    "status" TEXT NOT NULL DEFAULT 'SUBMITTED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SymptomReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiskAssessment" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "riskScore" INTEGER NOT NULL,
    "riskLevel" TEXT NOT NULL,
    "possibleCategory" TEXT NOT NULL,
    "riskFactors" TEXT NOT NULL,
    "recommendedAction" TEXT NOT NULL,
    "isDecisionSupportOnly" BOOLEAN NOT NULL DEFAULT true,
    "engineVersion" TEXT NOT NULL DEFAULT 'v1.0-rule-based',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RiskAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiseaseCase" (
    "id" TEXT NOT NULL,
    "caseCode" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "animalId" TEXT NOT NULL,
    "vetId" TEXT,
    "suspectedDisease" TEXT,
    "confirmedDisease" TEXT,
    "clinicalDiagnosis" TEXT,
    "clinicalSeverity" TEXT,
    "clinicalNotes" TEXT,
    "recommendedAction" TEXT,
    "status" TEXT NOT NULL DEFAULT 'UNDER_REVIEW',
    "escalatedToGovt" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiseaseCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Treatment" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "animalId" TEXT NOT NULL,
    "vetId" TEXT NOT NULL,
    "diagnosis" TEXT NOT NULL,
    "medicines" TEXT NOT NULL,
    "instructions" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "followUpDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Treatment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vaccination" (
    "id" TEXT NOT NULL,
    "animalId" TEXT NOT NULL,
    "vaccineName" TEXT NOT NULL,
    "batchNumber" TEXT,
    "doseNumber" INTEGER NOT NULL DEFAULT 1,
    "administeredDate" TIMESTAMP(3) NOT NULL,
    "nextDueDate" TIMESTAMP(3),
    "administeredBy" TEXT,
    "status" TEXT NOT NULL DEFAULT 'COMPLETED',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vaccination_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LabSample" (
    "id" TEXT NOT NULL,
    "sampleCode" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "animalId" TEXT NOT NULL,
    "sampleType" TEXT NOT NULL,
    "collectedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "collectionLocation" TEXT NOT NULL,
    "laboratoryName" TEXT NOT NULL,
    "testType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'REQUESTED',
    "result" TEXT,
    "resultNotes" TEXT,
    "resultDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LabSample_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MortalityReport" (
    "id" TEXT NOT NULL,
    "reportCode" TEXT NOT NULL,
    "animalId" TEXT NOT NULL,
    "farmerId" TEXT NOT NULL,
    "dateOfDeath" TIMESTAMP(3) NOT NULL,
    "symptomsBeforeDeath" TEXT NOT NULL,
    "suspectedCause" TEXT,
    "otherSickCount" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,
    "photoUrl" TEXT,
    "village" TEXT NOT NULL,
    "block" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MortalityReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Outbreak" (
    "id" TEXT NOT NULL,
    "outbreakCode" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "block" TEXT NOT NULL,
    "village" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "suspectedDisease" TEXT NOT NULL,
    "caseCount" INTEGER NOT NULL DEFAULT 0,
    "deathCount" INTEGER NOT NULL DEFAULT 0,
    "riskLevel" TEXT NOT NULL DEFAULT 'HIGH',
    "status" TEXT NOT NULL DEFAULT 'DETECTED',
    "assignedTeam" TEXT,
    "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Outbreak_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Advisory" (
    "id" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleMr" TEXT NOT NULL,
    "titleHi" TEXT NOT NULL,
    "contentEn" TEXT NOT NULL,
    "contentMr" TEXT NOT NULL,
    "contentHi" TEXT NOT NULL,
    "targetDistrict" TEXT NOT NULL DEFAULT 'ALL',
    "severity" TEXT NOT NULL DEFAULT 'WARNING',
    "issuedBy" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Advisory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'ALERT',
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "link" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VetServiceLocation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "block" TEXT NOT NULL,
    "village" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "contactPhone" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "doctorInCharge" TEXT NOT NULL,
    "operatingHours" TEXT NOT NULL,

    CONSTRAINT "VetServiceLocation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "FarmerProfile_userId_key" ON "FarmerProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VetProfile_userId_key" ON "VetProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VetProfile_vetId_key" ON "VetProfile"("vetId");

-- CreateIndex
CREATE UNIQUE INDEX "GovtProfile_userId_key" ON "GovtProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "GovtProfile_officialId_key" ON "GovtProfile"("officialId");

-- CreateIndex
CREATE UNIQUE INDEX "Animal_animalCode_key" ON "Animal"("animalCode");

-- CreateIndex
CREATE UNIQUE INDEX "SymptomReport_reportCode_key" ON "SymptomReport"("reportCode");

-- CreateIndex
CREATE UNIQUE INDEX "RiskAssessment_reportId_key" ON "RiskAssessment"("reportId");

-- CreateIndex
CREATE UNIQUE INDEX "DiseaseCase_caseCode_key" ON "DiseaseCase"("caseCode");

-- CreateIndex
CREATE UNIQUE INDEX "DiseaseCase_reportId_key" ON "DiseaseCase"("reportId");

-- CreateIndex
CREATE UNIQUE INDEX "LabSample_sampleCode_key" ON "LabSample"("sampleCode");

-- CreateIndex
CREATE UNIQUE INDEX "MortalityReport_reportCode_key" ON "MortalityReport"("reportCode");

-- CreateIndex
CREATE UNIQUE INDEX "Outbreak_outbreakCode_key" ON "Outbreak"("outbreakCode");

-- AddForeignKey
ALTER TABLE "FarmerProfile" ADD CONSTRAINT "FarmerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VetProfile" ADD CONSTRAINT "VetProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GovtProfile" ADD CONSTRAINT "GovtProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Animal" ADD CONSTRAINT "Animal_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "FarmerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SymptomReport" ADD CONSTRAINT "SymptomReport_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "Animal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SymptomReport" ADD CONSTRAINT "SymptomReport_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskAssessment" ADD CONSTRAINT "RiskAssessment_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "SymptomReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiseaseCase" ADD CONSTRAINT "DiseaseCase_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "SymptomReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiseaseCase" ADD CONSTRAINT "DiseaseCase_vetId_fkey" FOREIGN KEY ("vetId") REFERENCES "VetProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Treatment" ADD CONSTRAINT "Treatment_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "DiseaseCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Treatment" ADD CONSTRAINT "Treatment_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "Animal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Treatment" ADD CONSTRAINT "Treatment_vetId_fkey" FOREIGN KEY ("vetId") REFERENCES "VetProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vaccination" ADD CONSTRAINT "Vaccination_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "Animal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabSample" ADD CONSTRAINT "LabSample_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "DiseaseCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MortalityReport" ADD CONSTRAINT "MortalityReport_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "Animal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

