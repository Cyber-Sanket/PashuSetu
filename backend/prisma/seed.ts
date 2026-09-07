import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding PashuSetu database with realistic Maharashtra livestock surveillance data...');

  // Clean existing data
  await prisma.notification.deleteMany();
  await prisma.advisory.deleteMany();
  await prisma.outbreak.deleteMany();
  await prisma.mortalityReport.deleteMany();
  await prisma.labSample.deleteMany();
  await prisma.treatment.deleteMany();
  await prisma.diseaseCase.deleteMany();
  await prisma.riskAssessment.deleteMany();
  await prisma.symptomReport.deleteMany();
  await prisma.vaccination.deleteMany();
  await prisma.animal.deleteMany();
  await prisma.govtProfile.deleteMany();
  await prisma.vetProfile.deleteMany();
  await prisma.farmerProfile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.vetServiceLocation.deleteMany();

  const hashedFarmerPassword = await bcrypt.hash('Farmer@123', 10);
  const hashedVetPassword = await bcrypt.hash('Vet@123', 10);
  const hashedGovtPassword = await bcrypt.hash('Admin@123', 10);

  // 1. Create Farmer 1 (Primary Demo)
  const farmerUser1 = await prisma.user.create({
    data: {
      name: 'Ramesh Tukaram Patil',
      email: 'farmer@pashusetu.gov.in',
      mobile: '9876543210',
      passwordHash: hashedFarmerPassword,
      role: 'FARMER',
      language: 'mr',
      status: 'ACTIVE',
      farmerProfile: {
        create: {
          village: 'Uruli Kanchan',
          block: 'Haveli',
          district: 'Pune',
          state: 'Maharashtra',
          pincode: '412202',
        },
      },
    },
    include: { farmerProfile: true },
  });

  // Farmer 2
  const farmerUser2 = await prisma.user.create({
    data: {
      name: 'Dnyaneshwar Sopan Shinde',
      email: 'farmer2@pashusetu.gov.in',
      mobile: '9823456781',
      passwordHash: hashedFarmerPassword,
      role: 'FARMER',
      language: 'mr',
      status: 'ACTIVE',
      farmerProfile: {
        create: {
          village: 'Loni Kalbhor',
          block: 'Haveli',
          district: 'Pune',
          state: 'Maharashtra',
          pincode: '412201',
        },
      },
    },
    include: { farmerProfile: true },
  });

  // 2. Create Veterinarian (Primary Demo)
  const vetUser = await prisma.user.create({
    data: {
      name: 'Dr. Aniket Kulkarni',
      email: 'vet@pashusetu.gov.in',
      mobile: '9822012345',
      passwordHash: hashedVetPassword,
      role: 'VETERINARIAN',
      language: 'en',
      status: 'ACTIVE',
      vetProfile: {
        create: {
          vetId: 'VET-MH-2024-042',
          qualification: 'B.V.Sc & A.H., M.V.Sc (Veterinary Medicine)',
          hospitalName: 'District Veterinary Polyclinic, Aundh, Pune',
          assignedDistrict: 'Pune',
          assignedBlock: 'Haveli',
        },
      },
    },
    include: { vetProfile: true },
  });

  // 3. Create Government Official (Primary Demo)
  const govtUser = await prisma.user.create({
    data: {
      name: 'Dr. Sunita Deshmukh',
      email: 'admin@pashusetu.gov.in',
      mobile: '9422098765',
      passwordHash: hashedGovtPassword,
      role: 'GOVERNMENT',
      language: 'en',
      status: 'ACTIVE',
      govtProfile: {
        create: {
          officialId: 'MAH-AHD-001',
          department: 'Department of Animal Husbandry, Govt of Maharashtra',
          designation: 'Joint Director (Disease Surveillance & Epidemiology)',
          jurisdiction: 'Maharashtra State',
        },
      },
    },
    include: { govtProfile: true },
  });

  console.log('Created Users: Farmer, Vet, and Government Official.');

  // 4. Create Livestock for Farmer 1
  const cow1 = await prisma.animal.create({
    data: {
      farmerId: farmerUser1.farmerProfile!.id,
      animalCode: 'PS-COW-001',
      name: 'Gauri (गौरी)',
      species: 'Cow',
      breed: 'Gir',
      gender: 'Female',
      ageYears: 4.5,
      weightKg: 380,
      color: 'Reddish Brown',
      identificationNumber: 'TAG-MH-829101',
      healthStatus: 'SICK',
      photoUrl: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=600&auto=format&fit=crop',
      village: 'Uruli Kanchan',
      block: 'Haveli',
      district: 'Pune',
      latitude: 18.4862,
      longitude: 74.1332,
    },
  });

  const buffalo1 = await prisma.animal.create({
    data: {
      farmerId: farmerUser1.farmerProfile!.id,
      animalCode: 'PS-BUF-002',
      name: 'Lakshmi (लक्ष्मी)',
      species: 'Buffalo',
      breed: 'Murrah',
      gender: 'Female',
      ageYears: 5.0,
      weightKg: 520,
      color: 'Jet Black',
      identificationNumber: 'TAG-MH-829102',
      healthStatus: 'OBSERVATION',
      photoUrl: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=600&auto=format&fit=crop',
      village: 'Uruli Kanchan',
      block: 'Haveli',
      district: 'Pune',
      latitude: 18.4875,
      longitude: 74.1345,
    },
  });

  const goat1 = await prisma.animal.create({
    data: {
      farmerId: farmerUser1.farmerProfile!.id,
      animalCode: 'PS-GOA-003',
      name: 'Kalu (काळू)',
      species: 'Goat',
      breed: 'Osmanabadi',
      gender: 'Male',
      ageYears: 2.0,
      weightKg: 38,
      color: 'Black',
      identificationNumber: 'TAG-MH-829103',
      healthStatus: 'HEALTHY',
      photoUrl: 'https://images.unsplash.com/photo-1524024973431-2ad916746881?w=600&auto=format&fit=crop',
      village: 'Uruli Kanchan',
      block: 'Haveli',
      district: 'Pune',
      latitude: 18.4851,
      longitude: 74.1321,
    },
  });

  const cow2 = await prisma.animal.create({
    data: {
      farmerId: farmerUser1.farmerProfile!.id,
      animalCode: 'PS-COW-004',
      name: 'Kapila (कपिला)',
      species: 'Cow',
      breed: 'Sahiwal',
      gender: 'Female',
      ageYears: 3.2,
      weightKg: 350,
      color: 'Pale Red',
      identificationNumber: 'TAG-MH-829104',
      healthStatus: 'HEALTHY',
      village: 'Uruli Kanchan',
      block: 'Haveli',
      district: 'Pune',
      latitude: 18.4868,
      longitude: 74.1352,
    },
  });

  // Additional animals for Farmer 2
  const cow3 = await prisma.animal.create({
    data: {
      farmerId: farmerUser2.farmerProfile!.id,
      animalCode: 'PS-COW-005',
      name: 'Kamdhenu',
      species: 'Cow',
      breed: 'HF Crossbred',
      gender: 'Female',
      ageYears: 4.0,
      weightKg: 420,
      color: 'Black and White',
      identificationNumber: 'TAG-MH-829105',
      healthStatus: 'SICK',
      village: 'Loni Kalbhor',
      block: 'Haveli',
      district: 'Pune',
      latitude: 18.4905,
      longitude: 74.0211,
    },
  });

  // 5. Seed Vaccinations
  await prisma.vaccination.createMany({
    data: [
      {
        animalId: cow1.id,
        vaccineName: 'Foot and Mouth Disease (FMD)',
        batchNumber: 'FMD-MH-2025-08',
        doseNumber: 2,
        administeredDate: new Date('2025-10-15'),
        nextDueDate: new Date('2026-04-15'),
        administeredBy: 'Dr. Aniket Kulkarni',
        status: 'COMPLETED',
        notes: 'Biannual oil-adjuvant vaccine administered subcutaneously.',
      },
      {
        animalId: cow1.id,
        vaccineName: 'Haemorrhagic Septicaemia (HS)',
        batchNumber: 'HS-2025-41',
        doseNumber: 1,
        administeredDate: new Date('2025-05-10'),
        nextDueDate: new Date('2026-05-10'),
        administeredBy: 'Dr. Aniket Kulkarni',
        status: 'COMPLETED',
      },
      {
        animalId: cow1.id,
        vaccineName: 'Brucellosis',
        batchNumber: 'BRU-19-S',
        doseNumber: 1,
        administeredDate: new Date('2024-02-10'),
        status: 'COMPLETED',
        notes: 'Calfhood vaccination done.',
      },
      {
        animalId: buffalo1.id,
        vaccineName: 'Foot and Mouth Disease (FMD)',
        batchNumber: 'FMD-MH-2025-08',
        doseNumber: 1,
        administeredDate: new Date('2025-10-15'),
        nextDueDate: new Date('2026-04-15'),
        administeredBy: 'Dr. Aniket Kulkarni',
        status: 'COMPLETED',
      },
      {
        animalId: buffalo1.id,
        vaccineName: 'Black Quarter (BQ)',
        batchNumber: 'BQ-2025-12',
        doseNumber: 1,
        administeredDate: new Date('2025-06-01'),
        nextDueDate: new Date('2026-06-01'),
        administeredBy: 'Dr. Aniket Kulkarni',
        status: 'COMPLETED',
      },
      {
        animalId: goat1.id,
        vaccineName: 'PPR (Peste des Petits Ruminants)',
        batchNumber: 'PPR-VAC-09',
        doseNumber: 1,
        administeredDate: new Date('2024-11-20'),
        nextDueDate: new Date('2027-11-20'),
        status: 'COMPLETED',
        notes: 'Valid for 3 years.',
      },
    ],
  });

  // 6. Seed High-Risk Symptom Report for Cow 1 (FMD Suspected)
  const report1 = await prisma.symptomReport.create({
    data: {
      reportCode: 'REP-2026-0001',
      animalId: cow1.id,
      farmerId: farmerUser1.id,
      symptoms: JSON.stringify([
        'Fever',
        'Skin Lesions',
        'Weakness',
        'Reduced Milk Production',
        'Lameness',
      ]),
      durationDays: 3,
      severity: 'Severe',
      temperatureF: 104.2,
      appetiteStatus: 'None',
      milkProductionChange: 'Severe Drop',
      additionalDescription:
        'Cow is drooling continuously with blisters on tongue and dental pad. Limping severely on left foreleg. Milk production dropped from 14L to 3L.',
      village: 'Uruli Kanchan',
      block: 'Haveli',
      district: 'Pune',
      latitude: 18.4862,
      longitude: 74.1332,
      riskScore: 82,
      riskLevel: 'CRITICAL',
      status: 'DIAGNOSIS_AVAILABLE',
    },
  });

  await prisma.riskAssessment.create({
    data: {
      reportId: report1.id,
      riskScore: 82,
      riskLevel: 'CRITICAL',
      possibleCategory: 'Foot and Mouth Disease (FMD) / लाळ खुरकूत',
      riskFactors: JSON.stringify([
        'Elevated body temperature / fever (+15)',
        'Excessive salivation / oral ulceration (+20)',
        'Locomotive impairment / hoof lesions (+15)',
        'Cutaneous lesions / vesicles present (+25)',
        'High fever reading (104.2°F) (+20)',
        'Complete anorexia (refusal to feed) (+12)',
        'Acute drop in milk yield (>50%) (+15)',
      ]),
      recommendedAction:
        'URGENT: Immediately isolate the affected animal away from the herd. Avoid community grazing or water troughs. Contact local Veterinary Officer immediately. Do not administer unprescribed antibiotics.',
      isDecisionSupportOnly: true,
      engineVersion: 'v1.0-rule-based',
    },
  });

  // Disease Case 1 (Assigned to Dr. Aniket Kulkarni)
  const case1 = await prisma.diseaseCase.create({
    data: {
      caseCode: 'CASE-MH-2026-0001',
      reportId: report1.id,
      animalId: cow1.id,
      vetId: vetUser.vetProfile!.id,
      suspectedDisease: 'Foot and Mouth Disease (FMD)',
      confirmedDisease: 'Foot and Mouth Disease (FMD) — Serotype O',
      clinicalDiagnosis: 'Acute Aphthous Fever (Foot and Mouth Disease) with secondary interdigital infection',
      clinicalSeverity: 'Critical',
      clinicalNotes:
        'Physical examination confirmed rupture of vesicles on the dorsum of tongue and coronary band of left hooves. Body temp 104.1 F. Animal in severe pain. Immediate ring vaccination within 5 km radius requested.',
      recommendedAction: 'Quarantine animal, symptomatic antipyretic therapy, antiseptic hoof wash twice daily.',
      status: 'DIAGNOSED',
      escalatedToGovt: true,
    },
  });

  // Prescribed Treatment for Case 1
  await prisma.treatment.create({
    data: {
      caseId: case1.id,
      animalId: cow1.id,
      vetId: vetUser.vetProfile!.id,
      diagnosis: 'Acute Foot and Mouth Disease',
      medicines: JSON.stringify([
        { name: 'Inj. Meloxicam with Paracetamol (Melonex Plus)', dosage: '15 ml', frequency: 'Once daily IM', duration: '3 days' },
        { name: 'Inj. Ceftiofur Sodium (Xyrofur)', dosage: '1 gram', frequency: 'Once daily IM', duration: '3 days' },
        { name: 'Boro-glycerine Liquid', dosage: 'Apply to oral lesions', frequency: '3 times daily', duration: '5 days' },
        { name: 'Potassium Permanganate (1:1000)', dosage: 'Hoof footbath', frequency: 'Twice daily', duration: '7 days' },
      ]),
      instructions: 'Feed soft green fodder and lukewarm rice gruel. Keep floor clean and dry with lime powder.',
      startDate: new Date(),
      followUpDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      notes: 'Follow up after 4 days to assess vesicle healing and feed intake.',
    },
  });

  // Lab Sample for Case 1
  await prisma.labSample.create({
    data: {
      sampleCode: 'SMP-2026-0001',
      caseId: case1.id,
      animalId: cow1.id,
      sampleType: 'Nasal Swab & Vesicular Fluid',
      collectedDate: new Date(),
      collectionLocation: 'Patil Farmstead, Uruli Kanchan',
      laboratoryName: 'Disease Investigation Section (DIS), Aundh, Pune',
      testType: 'RT-PCR',
      status: 'COMPLETED',
      result: 'POSITIVE',
      resultNotes: 'RT-PCR confirmed FMD virus Serotype O. Positive viral genome copy detected.',
      resultDate: new Date(),
    },
  });

  // 7. Seed Active Outbreak in Pune District (Haveli Block)
  await prisma.outbreak.create({
    data: {
      outbreakCode: 'OUT-MH-2026-001',
      district: 'Pune',
      block: 'Haveli',
      village: 'Uruli Kanchan',
      latitude: 18.4862,
      longitude: 74.1332,
      suspectedDisease: 'Foot and Mouth Disease (FMD)',
      caseCount: 14,
      deathCount: 2,
      riskLevel: 'CRITICAL',
      status: 'CONTAINMENT_ACTIVE',
      assignedTeam: 'Pune District Mobile Veterinary Rapid Response Team #3',
      detectedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
  });

  // Outbreak 2 in Ahmednagar (Rahata)
  await prisma.outbreak.create({
    data: {
      outbreakCode: 'OUT-MH-2026-002',
      district: 'Ahmednagar',
      block: 'Rahata',
      village: 'Shirdi Rural',
      latitude: 19.7645,
      longitude: 74.4776,
      suspectedDisease: 'Lumpy Skin Disease (LSD)',
      caseCount: 8,
      deathCount: 0,
      riskLevel: 'HIGH',
      status: 'UNDER_INVESTIGATION',
      assignedTeam: 'Ahmednagar Mobile Unit #1',
      detectedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
  });

  // Outbreak 3 in Satara (Karad)
  await prisma.outbreak.create({
    data: {
      outbreakCode: 'OUT-MH-2026-003',
      district: 'Satara',
      block: 'Karad',
      village: 'Malkapur',
      latitude: 17.2885,
      longitude: 74.1812,
      suspectedDisease: 'Black Quarter (BQ)',
      caseCount: 5,
      deathCount: 1,
      riskLevel: 'HIGH',
      status: 'DETECTED',
      assignedTeam: 'Satara District Animal Health Team',
      detectedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  });

  // 8. Seed Multilingual Advisories
  await prisma.advisory.create({
    data: {
      titleEn: 'Foot and Mouth Disease (FMD) Biosecurity Alert — Pune District',
      titleMr: 'लाळ खुरकूत रोग (FMD) प्रतिबंधात्मक सतर्कता — पुणे जिल्हा',
      titleHi: 'खुरपका-मुंहपका रोग (FMD) जैव-सुरक्षा चेतावनी — पुणे जिला',
      contentEn:
        'A confirmed outbreak cluster of FMD has been detected in Haveli block. All livestock owners are advised to avoid animal gatherings, disinfect farm entrances with 4% sodium carbonate, and immediately report salivating or limping cattle to the nearest veterinary dispensary. Ring vaccination is underway.',
      contentMr:
        'हवेली तालुक्यातील उरुळी कांचन भागात लाळ खुरकूत (FMD) रोगाचा संसर्ग आढळला आहे. सर्व पशुपालकांनी जनावरांचे बाजार आणि एकत्र चरण्यास तात्काळ मज्जाव करावा. गोठ्याची स्वच्छता राखावी आणि लक्षणे दिसल्यास स्थानिक पशुवैद्यकीय अधिकाऱ्यांशी संपर्क साधावा.',
      contentHi:
        'हवेली ब्लॉक में खुरपका-मुंहपका रोग का प्रकोप दर्ज किया गया है। सभी पशुपालक बीमार पशुओं को स्वस्थ पशुओं से तुरंत अलग रखें और नजदीकी पशु चिकित्सालय में सूचना दें।',
      targetDistrict: 'Pune',
      severity: 'URGENT',
      issuedBy: 'Directorate of Animal Husbandry, Pune, Maharashtra',
      isActive: true,
    },
  });

  await prisma.advisory.create({
    data: {
      titleEn: 'Haemorrhagic Septicaemia (HS) Monsoon Preparedness',
      titleMr: 'पावसाळी घटसर्प रोग प्रतिबंधक लसीकरण मोहीम',
      titleHi: 'गलघोंटू (एच.एस.) मानसून पूर्व टीकाकरण अभियान',
      contentEn:
        'Statewide preventive vaccination against Haemorrhagic Septicaemia (Ghatsarpa) is currently active across all taluka veterinary dispensaries. Ensure your cattle and buffaloes receive vaccination before water-logging starts.',
      contentMr:
        'पावसाळ्याच्या पार्श्वभूमीवर घटसर्प रोगापासून संरक्षणासाठी मोफत लसीकरण सुरू आहे. सर्व शेतकऱ्यांनी आपल्या गायी आणि म्हशींना वेळेवर लस टोचून घ्यावी.',
      contentHi:
        'मानसून के दौरान गलघोंटू रोग से बचाव हेतु सभी पशुपालक अपने मवेशियों का समय पर टीकाकरण अवश्य कराएं।',
      targetDistrict: 'ALL',
      severity: 'WARNING',
      issuedBy: 'Commissionerate of Animal Husbandry, Govt of Maharashtra',
      isActive: true,
    },
  });

  // 9. Seed Nearby Veterinary Facilities
  await prisma.vetServiceLocation.createMany({
    data: [
      {
        name: 'District Veterinary Polyclinic, Pune',
        type: 'District Veterinary Polyclinic',
        district: 'Pune',
        block: 'Haveli',
        village: 'Aundh',
        address: 'Near Bremen Square, Aundh, Pune, Maharashtra 411007',
        contactPhone: '+91 20 2588 0124',
        latitude: 18.558,
        longitude: 73.8077,
        doctorInCharge: 'Dr. Aniket Kulkarni, Assistant Director',
        operatingHours: '24/7 Emergency & Inpatient Hospital',
      },
      {
        name: 'Taluka Veterinary Dispensary (Grade 1), Hadapsar',
        type: 'Taluka Dispensary',
        district: 'Pune',
        block: 'Haveli',
        village: 'Hadapsar',
        address: 'Solapur Road, Near Gadital, Hadapsar, Pune 411028',
        contactPhone: '+91 20 2687 4512',
        latitude: 18.502,
        longitude: 73.9278,
        doctorInCharge: 'Dr. Pravin More, LDO',
        operatingHours: '8:00 AM – 6:00 PM',
      },
      {
        name: 'Primary Veterinary Aid Center, Uruli Kanchan',
        type: 'Primary Aid Center',
        district: 'Pune',
        block: 'Haveli',
        village: 'Uruli Kanchan',
        address: 'Gram Panchayat Road, Uruli Kanchan, Pune 412202',
        contactPhone: '+91 94220 11223',
        latitude: 18.4862,
        longitude: 74.1332,
        doctorInCharge: 'Dr. Sachin Jagtap, Livestock Supervisor',
        operatingHours: '9:00 AM – 5:00 PM',
      },
      {
        name: 'Taluka Veterinary Hospital, Karad',
        type: 'Taluka Dispensary',
        district: 'Satara',
        block: 'Karad',
        village: 'Karad City',
        address: 'Opposite Bus Stand, Karad, Satara 415110',
        contactPhone: '+91 2164 223456',
        latitude: 17.2885,
        longitude: 74.1812,
        doctorInCharge: 'Dr. Sanjay Patil, LDO',
        operatingHours: '8:30 AM – 5:30 PM',
      },
    ],
  });

  // 10. Seed Notifications for Demo Farmer
  await prisma.notification.createMany({
    data: [
      {
        userId: farmerUser1.id,
        title: '⚠️ High Risk Warning — PS-COW-001',
        message: 'Your animal Gauri has been assessed as CRITICAL risk for Foot & Mouth Disease. Please isolate immediately.',
        type: 'ALERT',
        link: '/farmer/reports',
      },
      {
        userId: farmerUser1.id,
        title: '📋 Veterinary Diagnosis & Prescription Ready',
        message: 'Dr. Aniket Kulkarni has uploaded clinical diagnosis and e-prescription. Click to view treatment guidelines.',
        type: 'CASE_UPDATE',
        link: '/farmer/treatments',
      },
      {
        userId: farmerUser1.id,
        title: '💉 Upcoming Vaccination: FMD Booster',
        message: 'Booster vaccination for Murrah Buffalo Lakshmi is due on 15 April 2026.',
        type: 'VACCINE',
        link: '/farmer/vaccinations',
      },
      {
        userId: vetUser.id,
        title: '🚨 CRITICAL CASE ASSIGNED: Cow PS-COW-001',
        message: 'Patil Farmstead reported high fever (104.2 F) with oral mucosal ulceration in Uruli Kanchan.',
        type: 'ALERT',
        link: '/veterinarian/cases',
      },
      {
        userId: govtUser.id,
        title: '🚨 OUTBREAK FLAGGED: Uruli Kanchan, Pune',
        message: '14 active cases of suspected FMD and 2 mortalities detected within rolling 7 days. Containment team active.',
        type: 'OUTBREAK',
        link: '/government/outbreaks',
      },
    ],
  });

  console.log('✅ PashuSetu database successfully seeded with realistic Maharashtra livestock data!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
