import React, { createContext, useContext, useState } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // App & Shell
    appTitle: 'PashuSetu',
    appSubtitle: 'Smart Livestock Health Surveillance & Early Warning System',
    tagline: 'Connecting Livestock, Farmers & Veterinary Care',
    govtHeader: 'Government of Maharashtra • Department of Animal Husbandry',
    sihStatement: 'SIH Problem Statement: SIH26128',
    home: 'Home',
    about: 'About',
    howItWorks: 'How It Works',
    features: 'Features',
    login: 'Login',
    logout: 'Logout',
    reportIssue: 'Report Health Issue',
    selectRole: 'Select Your Portal',
    farmer: 'Farmer',
    veterinarian: 'Veterinarian',
    government: 'Government Official',
    farmerDesc: 'Manage livestock, report symptoms, and receive early outbreak warnings and vaccination alerts.',
    vetDesc: 'Review reported cases, conduct clinical diagnosis, prescribe treatments, and order lab tests.',
    govtDesc: 'Monitor statewide disease hotspots, track outbreaks, analyze trends, and coordinate emergency responses.',
    
    // Sidebar & Navigation
    dashboardOverview: 'Dashboard Overview',
    currentPortal: 'Current Portal',
    farmerWorkspace: 'Farmer Workspace',
    veterinaryPortal: 'Veterinary Portal',
    stateHealthCommand: 'State Health Command',
    notificationsAlerts: 'Notifications & Alerts',
    govtOfMaharashtra: 'Govt of Maharashtra',
    animalHusbandryDept: 'Animal Husbandry Dept',
    earlyWarningSystem: 'Govt of Maharashtra • Early Warning System',
    changeLanguage: 'Change Language',
    caseloadDashboard: 'Caseload Dashboard',
    reportedCasesQueue: 'Reported Cases Queue',
    districtDiseaseMap: 'District Disease Map',
    labSamples: 'Laboratory Samples',
    prescriptionsIssued: 'Prescriptions Issued',
    statewideOverview: 'Statewide Overview',
    gisDiseaseMap: 'GIS Disease Map',
    outbreakDetection: 'Outbreak Detection',
    diseaseAnalytics: 'Disease Analytics',
    vaccinationMonitoring: 'Vaccination Monitoring',
    veterinaryResponse: 'Veterinary Response',
    surveillanceReports: 'Surveillance Reports',
    broadcastAdvisory: 'Broadcast Advisory',

    // Common Actions & States
    submit: 'Submit',
    cancel: 'Cancel',
    save: 'Save',
    saving: 'Saving...',
    submitting: 'Submitting...',
    loading: 'Loading...',
    all: 'ALL',
    allSpecies: 'All Species',
    searchPlaceholder: 'Search Ear Tag, Name, Breed...',
    viewAll: 'View All',
    viewDetails: 'View details',
    edit: 'Edit',
    delete: 'Delete',
    backToLivestock: 'Back to My Livestock',
    returnToRoster: 'Return to Livestock Roster',
    daysUnit: 'days',
    reportedOn: 'Reported on',
    issuedOn: 'Issued on',
    location: 'Location',
    targetDistrict: 'Target District',
    hours: 'Hours',
    inCharge: 'In-Charge',
    contactClinic: 'Contact Clinic',
    offlineNotice: 'You are currently offline. Reports will be saved locally and synced once internet connection is restored.',
    syncPending: 'Sync Pending Reports',
    backOnline: 'Back Online!',
    allReportsSynced: 'All offline reports synchronized successfully.',
    reportsWaitingToSync: 'report(s) waiting to sync.',
    syncing: 'Syncing...',

    // Quick Demo Bar
    sihQuickAccess: 'SIH Evaluator Quick Access (1-Click Test Portals):',
    patilFarmer: 'Farmer (Patil)',
    kulkarniVet: 'Veterinarian (Dr. Kulkarni)',
    deshmukhGovt: 'Government (Dr. Deshmukh)',

    // Header & Notifications Dropdown
    notificationsCenter: 'Notifications & Live Alerts',
    unread: 'unread',
    markAllRead: 'Mark all read',
    noNotifications: 'No notifications right now.',
    openRelatedCase: 'Open related case / report',
    viewNotificationsCenter: 'View Notifications Center',
    markRead: 'Mark Read',
    justNow: 'Just now',
    mAgo: 'm ago',
    hAgo: 'h ago',

    // Farmer Dashboard
    registeredLivestockOwner: 'Registered Livestock Owner',
    namaskar: 'Namaskar',
    farmerDashboardIntro: 'Monitor your livestock health records, report emerging symptoms for immediate decision-support risk scoring, and track veterinary prescriptions.',
    reportAnimalSymptoms: 'Report Animal Symptoms',
    addNewAnimal: 'Add New Animal',
    reportAnimalDeath: 'Report Animal Death',
    totalAnimals: 'Total Livestock',
    healthyAnimals: 'Healthy Animals',
    sickAnimals: 'Sick Animals',
    underObservation: 'Under Observation',
    activeReports: 'Active Complaints',
    vaccinationCoverage: 'Vaccination Coverage',
    activeRegionalAdvisories: 'Active Regional Preventive Advisories',
    recentHealthReports: 'Recent Health & Symptom Reports',
    recentHealthReportsSubtitle: 'Live status of submitted cases and veterinary clinical reviews',
    noRecentHealthIssues: 'No health issues reported recently. Your livestock herd is healthy!',
    urgentVetAdviceTitle: 'Need Urgent Veterinary Advice?',
    urgentVetAdviceDesc: 'Toll-Free 1962 Mobile Veterinary Dispensary is on call 24x7 in your block.',
    findLocalDispensary: 'Find Local Dispensary',
    symptomsColon: 'Symptoms:',

    // My Livestock & Details
    myLivestock: 'My Livestock',
    myLivestockTitle: 'My Livestock',
    myLivestockSubtitle: 'Registered livestock roster with digital health tags and vaccination records',
    addAnimal: 'Add New Animal',
    registerNewLivestock: 'Register New Livestock',
    loadingLivestock: 'Loading livestock roster...',
    noLivestockFound: 'No livestock found matching criteria.',
    registerToStartMonitoring: 'Register your cattle, buffalo, or goats to start monitoring their health.',
    addFirstLivestock: 'Add First Livestock',
    animalCode: 'Animal Code',
    earTagId: 'Ear Tag ID / Tag',
    animalName: 'Animal Name',
    species: 'Species',
    selectSpeciesFirst: '— Select Species First —',
    breed: 'Breed',
    selectBreed: '— Select Breed —',
    specifyCustomBreed: 'Specify Custom Breed',
    customBreedPlaceholder: 'e.g. Non-descript local cross, Malvi, Pandharpuri mix...',
    chooseSpeciesHint: '⚠️ Please choose a species above to view available breeds.',
    gender: 'Gender',
    female: 'Female',
    male: 'Male',
    age: 'Age',
    ageYears: 'Age in Years',
    weight: 'Weight',
    weightKg: 'Weight (kg)',
    color: 'Color',
    registeredIn: 'Registered in',
    reportSymptomBtn: 'Report Symptom',
    medicalRecord: 'Medical Record',
    livestockPhoto: 'Livestock Photo (Optional)',
    photoUploadHelper: 'Capture with mobile camera or upload from gallery (JPEG, PNG, WebP ≤ 5MB)',
    registerLivestockBtn: 'Register Livestock',
    pleaseSelectSpeciesFirst: 'Please select a species first before choosing breed.',
    pleaseSelectBreed: 'Please select a breed.',
    failedToAddAnimal: 'Failed to add animal.',
    loadingLivestockProfile: 'Loading livestock profile...',
    animalNotFound: 'Animal profile not found.',
    symptomReportsTab: 'Symptom Reports',
    vaccinationsTab: 'Vaccinations',
    treatmentsPrescribedTab: 'Treatments Prescribed',
    noSymptomReportsForAnimal: 'No symptom reports filed for this animal yet.',
    noVaccinationRecordsForAnimal: 'No vaccination records available for this animal.',
    noTreatmentsForAnimal: 'No veterinary prescriptions recorded for this animal yet.',
    reportNewSymptoms: 'Report New Symptoms',
    reportedSymptoms: 'Reported Symptoms',
    duration: 'Duration',
    severity: 'Severity',
    bodyTemperature: 'Body Temperature',
    automatedDecisionSupport: 'Automated Decision Support',
    possibleCondition: 'Possible Condition',
    recommendedAction: 'Recommended Action',
    vaccineName: 'Vaccine Name',
    doseNumber: 'Dose #',
    administeredDate: 'Administered Date',
    nextDueDate: 'Next Due Date',
    diagnosis: 'Diagnosis',
    prescribedBy: 'Prescribed by',
    followUp: 'Follow-up',
    prescribedMedicines: 'Prescribed Medicines',
    dosage: 'Dosage',
    frequency: 'Frequency',
    careInstructions: 'Care Instructions',

    // Report Symptoms
    reportSymptoms: 'Report Symptoms',
    reportSymptomsTitle: 'Report Animal Symptoms',
    reportSymptomsSubtitle: 'Early detection surveillance tool for livestock owners across Maharashtra.',
    selectAffectedAnimal: '1. Select Affected Animal *',
    noLivestockRegisteredAddFirst: 'No livestock registered yet. Add an animal first.',
    selectObservedSymptoms: '2. Select Observed Symptoms *',
    symptomsSelected: 'selected',
    otherSymptomsOption: 'Other / Custom Symptoms',
    specifyCustomSymptoms: 'Specify Custom Symptoms *',
    sentDirectlyToVet: 'Sent directly to Attending Vet',
    customSymptomsPlaceholder: 'e.g. Swollen brisket, rapid ear shaking, bleeding from nostrils, limping on rear left hoof...',
    customSymptomsHelp: 'Please describe any unique symptoms, behavioral changes, or visible signs not covered in the standard checklist above.',
    clinicalVitalsAndOnset: '3. Clinical Vitals & Onset',
    durationDaysLabel: 'Duration (Days)',
    severityReported: 'Severity Reported',
    mild: 'Mild',
    moderate: 'Moderate',
    severe: 'Severe',
    bodyTempF: 'Body Temp (°F)',
    appetiteStatus: 'Appetite Status',
    normal: 'Normal (Eating well)',
    reduced: 'Reduced (Eating less)',
    noneAppetite: 'None (Refusing all feed)',
    milkYieldImpact: 'Milk Yield Impact',
    notLactating: 'None / Not Lactating',
    slightDrop: 'Slight Drop (<50%)',
    severeDrop: 'Severe Drop (>50%)',
    additionalNotesAndPhoto: '4. Additional Notes & Clinical Photographic Evidence',
    describePhysicalBehaviorPlaceholder: 'Describe physical behavior, blisters, discharge, or whether neighboring animals are sick...',
    symptomsPhotoLabel: 'Clinical Lesion / Symptoms Photo (Optional)',
    symptomsPhotoHelper: 'Capture or upload photo of visible lesions, ulcers, eye discharge, or affected limbs (JPEG, PNG, WebP ≤ 5MB)',
    automatedRiskEnginePreview: 'Automated Risk Engine Preview',
    epidemiologicalRisk: 'Epidemiological Risk:',
    suspectedPatternMatch: 'Suspected Pattern Match:',
    decisionSupportDisclaimerText: 'This preview is an automated epidemiological triage indicator and does not constitute a certified veterinary diagnosis.',
    detectingGps: 'Detecting GPS...',
    submitHealthReport: 'Submit Health Report',
    processingAssessment: 'Processing Assessment...',
    offlineQueueNotice: 'Offline Mode Active: Report will queue locally.',
    selectAnimalAndSymptomAlert: 'Please select an animal and at least one symptom.',
    specifyCustomSymptomAlert: 'Please describe the custom symptoms in the "Specify Custom Symptoms" field.',
    offlineReportSavedNotice: 'You are currently offline. This report has been saved locally and will automatically synchronize once internet returns.',
    healthReportFiledSuccess: 'Health Report Filed Successfully!',
    reportCode: 'Report Code',
    suspectedDiseaseCategory: 'Suspected Disease Category:',
    recommendedImmediateAction: 'Recommended Immediate Action:',
    trackCaseInReports: 'Track Case in My Reports',
    findNearestClinic: 'Find Nearest Veterinary Clinic',

    // Report Death
    reportDeath: 'Report Mortality',
    reportAnimalDeathTitle: 'Report Animal Death',
    reportAnimalDeathSubtitle: 'Mortality surveillance report feeds into early outbreak detection across Maharashtra',
    mortalityNotice: 'Official Surveillance Notice: Timely reporting of livestock mortalities helps state health authorities detect cluster outbreaks before they spread to other farmsteads.',
    selectDeceasedAnimal: 'Select Deceased Animal *',
    dateOfDeath: 'Date of Death *',
    otherSickAnimalsInHerd: 'Other Sick Animals in Herd',
    symptomsBeforeDeath: 'Symptoms Observed Prior to Death *',
    symptomsBeforeDeathPlaceholder: 'e.g. Sudden severe fever, swelling in throat, loud breathing, refusal to eat for 2 days...',
    suspectedCause: 'Suspected Cause',
    suspectedCausePlaceholder: 'e.g. Suspected Ghatsarpa / Anthrax / High Fever',
    submitMortalityReport: 'Submit Mortality Surveillance Report',
    registeringReport: 'Registering Report...',
    mortalityRegisteredTitle: 'Mortality Report Registered',
    mortalityRegisteredDesc: 'The animal has been marked as deceased. Due to epidemiological outbreak surveillance protocols, local veterinary authorities and the District Epidemiologist have been automatically alerted.',

    // Case Reports
    myReports: 'My Reports',
    myCaseReports: 'My Case Reports',
    caseReportsSubtitle: 'Track submitted cases from initial triage to veterinary diagnosis and treatment',
    loadingReports: 'Loading your reports...',
    noReportsSubmitted: 'No reports submitted yet.',
    noReportsSubmittedDesc: 'When you file symptoms for an animal, case updates and diagnosis will appear here.',
    reportId: 'Report ID',
    animalDetails: 'Animal Details',
    reportedDate: 'Reported Date',
    observedSymptoms: 'Observed Symptoms',
    riskRating: 'Risk Rating',
    caseStatus: 'Case Status',
    attendingVet: 'Veterinarian',
    underTriage: 'Under Triage',

    // Vaccinations Tracker
    vaccinations: 'Vaccinations',
    vaccinationTrackerTitle: 'Vaccination Tracker',
    vaccinationTrackerSubtitle: 'Statewide vaccination schedules, booster calendar, and immunization history',
    loadingVaccinations: 'Loading vaccination calendar...',
    noVaccinationsFound: 'No vaccination records found for your livestock.',
    nextBoosterDue: 'Next Booster Due:',
    administeredBy: 'Administered by:',
    batch: 'Batch',
    dose: 'Dose',

    // Treatments & Prescriptions
    treatments: 'Treatments',
    prescriptionsTitle: 'Prescriptions & Treatments',
    prescriptionsSubtitle: 'Official veterinary e-prescriptions, medication schedules, and follow-up guidance',
    loadingPrescriptions: 'Loading prescriptions...',
    noTreatmentsFound: 'No treatment records found for your livestock.',
    ePrescription: 'E-Prescription',
    medicinesAndDosage: 'Prescribed Medicines & Dosage Instructions:',
    careAndFeedingInstructions: 'Care & Feeding Instructions:',
    scheduledFollowUp: 'Scheduled Veterinary Follow-up Date:',

    // Nearby Vets
    nearbyVets: 'Nearby Veterinary Care',
    nearbyVetsHeader: 'Nearby Veterinary Facilities',
    nearbyVetsSub: 'Government veterinary polyclinics, taluka dispensaries, and mobile health units in Maharashtra',
    helplineTitle: 'Maharashtra Animal Disease Helpline: 1962',
    helplineDesc: 'Call toll-free for dispatching Mobile Veterinary Units (MVU) directly to your farm.',
    call1962Now: 'Call 1962 Now',
    loadingCenters: 'Loading veterinary centers...',
    noFacilitiesFound: 'No facilities found.',

    // Alerts & Advisories
    alerts: 'Alerts & Advisories',
    alertsAndAdvisoriesTitle: 'Alerts & Advisories',
    alertsAndAdvisoriesSubtitle: 'Official disease outbreak warnings, biosecurity protocols, and seasonal vaccination circulars',
    loadingAlerts: 'Loading alerts and advisories...',
    noActiveAdvisories: 'No active outbreak advisories in your district.',
    authorizedAuthority: 'Authorized Authority:',

    // Notifications Center Page
    notificationsCenterTitle: 'Notifications & Early Warning Center',
    notificationsCenterSubtitle: 'Real-time surveillance updates, epidemiological cluster alerts, and veterinary case notifications',
    allNotifications: 'All Notifications',
    outbreaksAndHighRisk: 'Outbreaks & High Risk',
    casesAndVaccines: 'Cases & Vaccines',
    stateAdvisories: 'State Advisories',
    loadingNotifications: 'Loading notifications center...',
    noNotificationsInView: 'No notifications found in this view.',
    allCaughtUp: 'You have caught up with all latest early warning messages!',
    newAlertsAppearHere: 'New outbreak reports, case assignments, and health updates will appear here automatically.',
    openDetails: 'Open Details',
    notifCategoryOutbreak: 'Outbreak',
    notifCategoryCaseUpdate: 'Case Update',
    notifCategoryVaccine: 'Vaccination',
    notifCategoryAlert: 'Alert',
    notifCategoryAdvisory: 'Advisory',
    notifDateAt: 'at',

    // Status & Risk Badges
    riskAssessment: 'Automated Risk Assessment — Decision Support',
    riskDisclaimer: 'Notice: This assessment is an automated epidemiological decision-support tool. Final diagnosis and prescriptions must be confirmed by a certified veterinarian.',
    riskLow: 'Low Risk',
    riskMedium: 'Medium Risk',
    riskHigh: 'High Risk',
    riskCritical: 'Critical Risk',
    priorityCritical: 'CRITICAL',
    priorityHigh: 'HIGH',
    priorityUpdate: 'UPDATE',
    priorityInfo: 'INFO',
    priorityAdvisory: 'ADVISORY',
    priorityVaccination: 'VACCINATION',

    // Status Values
    statusHealthy: 'HEALTHY',
    statusSick: 'SICK',
    statusUnderObservation: 'UNDER OBSERVATION',
    statusObservation: 'OBSERVATION',
    statusDeceased: 'DECEASED',
    statusSubmitted: 'SUBMITTED',
    statusUnderReview: 'UNDER REVIEW',
    statusDiagnosed: 'DIAGNOSED',
    statusTreatmentStarted: 'TREATMENT STARTED',
    statusResolved: 'RESOLVED',
    statusCompleted: 'COMPLETED',
    statusPending: 'PENDING',
    statusOverdue: 'OVERDUE',
    statusAssigned: 'ASSIGNED',
    statusCollected: 'COLLECTED',
    statusTesting: 'TESTING',
    statusUnderInvestigation: 'UNDER INVESTIGATION',
    statusEscalated: 'ESCALATED',
    statusDetected: 'DETECTED',
    statusContained: 'CONTAINED',
    statusContainmentActive: 'CONTAINMENT ACTIVE',

    // Photo Upload Component
    uploadPhoto: 'Upload Photo',
    addPhoto: 'Add Photo',
    changePhoto: 'Change Photo',
    photoAttached: 'Photo attached',
    clickToUpload: 'Click to choose or drag & drop photo',
    useCamera: 'Use Camera',
    gallery: 'Gallery',
    uploadingSecuring: 'Uploading & securing photo...',
    uploadedSuccess: 'Uploaded successfully',
    replace: 'Replace',
    remove: 'Remove',
    invalidFormat: 'Invalid format. Please select a JPEG, PNG, or WebP image.',
    fileSizeExceeded: 'File size exceeds the 5MB limit. Please choose a smaller photo.',
    uploadFailed: 'Failed to upload photo to server. Please try again.',

    // Authentication Pages
    roleSelectTitle: 'Select Your Portal',
    roleSelectSubtitle: 'Choose your stakeholder role to securely sign in to the appropriate surveillance dashboard.',
    roleBasedAccess: 'Role-Based Access Control',
    continueAsFarmer: 'Continue as Farmer',
    continueAsVet: 'Continue as Veterinarian',
    continueAsGovt: 'Continue as Government',
    farmerPortalLogin: 'Farmer Portal Login',
    farmerLoginSubtitle: 'Sign in using your registered mobile number or email address',
    mobileOrEmail: 'Mobile Number or Email',
    password: 'Password',
    loginAsFarmer: 'Login as Farmer',
    dontHaveAccount: "Don't have an account yet?",
    registerLivestockAccount: 'Register Livestock Account',
    switchPortal: '← Switch Portal',
    autoFill: 'Auto-Fill',
    sihEvaluatorDemo: 'SIH Evaluator Demo:',
    farmerRegisterTitle: 'Farmer Registration',
    farmerRegisterSubtitle: 'Create an official livestock health surveillance account with the Department of Animal Husbandry',
    fullName: 'Full Name',
    mobileNumber: 'Mobile Number',
    emailAddress: 'Email Address',
    confirmPassword: 'Confirm Password',
    locationAndJurisdiction: 'Location & Jurisdiction',
    village: 'Village',
    block: 'Block / Taluka',
    district: 'District',
    preferredLanguage: 'Preferred Language',
    createFarmerAccount: 'Create Farmer Account',
    alreadyHaveAccount: 'Already have an account?',
    signInHere: 'Sign In Here',
    passwordsDoNotMatch: 'Passwords do not match.',
    loginFailed: 'Login failed. Please check your credentials.',
    registrationFailed: 'Registration failed. Please check your details.',
    verifying: 'Verifying...',
    registering: 'Registering...',
    failedToSubmitReport: 'Failed to submit report: ',
    failedToSubmitMortalityReport: 'Failed to submit mortality report: ',
    selectAnimalAndSymptomsBeforeDeath: 'Please select animal and describe symptoms before death.',
  },

  mr: {
    // App & Shell
    appTitle: 'पशुसेतू (PashuSetu)',
    appSubtitle: 'स्मार्ट पशु आरोग्य पाळत व पूर्वसूचना प्रणाली',
    tagline: 'पशुधन, शेतकरी आणि पशुवैद्यकीय सेवांना जोडणारा डिजिटल सेतू',
    govtHeader: 'महाराष्ट्र शासन • पशुसंवर्धन विभाग',
    sihStatement: 'SIH समस्या विधान: SIH26128',
    home: 'मुख्यपृष्ठ',
    about: 'माहिती',
    howItWorks: 'कार्यपद्धती',
    features: 'वैशिष्ट्ये',
    login: 'लॉगिन',
    logout: 'लॉगआउट',
    reportIssue: 'लक्षणे नोंदवा',
    selectRole: 'तुमची भूमिका निवडा',
    farmer: 'शेतकरी / पशुपालक',
    veterinarian: 'पशुवैद्यकीय अधिकारी',
    government: 'शासकीय अधिकारी',
    farmerDesc: 'पशुधन नोंदवा, आजारपणाची लक्षणे नोंदवा आणि लसीकरण व रोगराईच्या पूर्वसूचना मिळवा.',
    vetDesc: 'रुग्ण केसेस तपासा, रोगनिदान करा, औषधोपचार लिहा आणि प्रयोगशाळा तपासणी आदेश द्या.',
    govtDesc: 'राज्यस्तरीय रोग पाळत, हॉटस्पॉट नकाशे, उद्रेक नियंत्रण आणि लसीकरण प्रगतीचे निरीक्षण करा.',

    // Sidebar & Navigation
    dashboardOverview: 'डॅशबोर्ड आढावा',
    currentPortal: 'चालू पोर्टल',
    farmerWorkspace: 'शेतकरी कार्यक्षेत्र',
    veterinaryPortal: 'पशुवैद्यकीय पोर्टल',
    stateHealthCommand: 'राज्य आरोग्य नियंत्रण कक्ष',
    notificationsAlerts: 'सूचना आणि इशारे',
    govtOfMaharashtra: 'महाराष्ट्र शासन',
    animalHusbandryDept: 'पशुसंवर्धन विभाग',
    earlyWarningSystem: 'महाराष्ट्र शासन • पूर्वसूचना प्रणाली',
    changeLanguage: 'भाषा बदला',
    caseloadDashboard: 'रुग्णसंख्या डॅशबोर्ड',
    reportedCasesQueue: 'दाखल रुग्ण केसेस',
    districtDiseaseMap: 'जिल्हा रोग नकाशा',
    labSamples: 'प्रयोगशाळा नमुने',
    prescriptionsIssued: 'दिलेले औषधोपचार',
    statewideOverview: 'राज्यस्तरीय आढावा',
    gisDiseaseMap: 'जीआयएस रोग नकाशा',
    outbreakDetection: 'साथरोग उद्रेक शोध',
    diseaseAnalytics: 'रोग सांख्यिकी विश्लेषण',
    vaccinationMonitoring: 'लसीकरण नियंत्रण',
    veterinaryResponse: 'पशुवैद्यकीय प्रतिसाद',
    surveillanceReports: 'आरोग्य पाळत अहवाल',
    broadcastAdvisory: 'सूचना प्रसारण',

    // Common Actions & States
    submit: 'दाखल करा',
    cancel: 'रद्द करा',
    save: 'जतन करा',
    saving: 'जतन करत आहे...',
    submitting: 'दाखल करत आहे...',
    loading: 'लोड होत आहे...',
    all: 'सर्व',
    allSpecies: 'सर्व प्रजाती',
    searchPlaceholder: 'इयर टॅग क्रमांक, नाव, जात शोधा...',
    viewAll: 'सर्व पहा',
    viewDetails: 'तपशील पहा',
    edit: 'संपादित करा',
    delete: 'हटवा',
    backToLivestock: 'माझ्या पशुधनाकडे परत जा',
    returnToRoster: 'पशुधन यादीकडे परत जा',
    daysUnit: 'दिवस',
    reportedOn: 'नोंदणी तारीख',
    issuedOn: 'जारी दिनांक',
    location: 'स्थान',
    targetDistrict: 'लक्ष्य जिल्हा',
    hours: 'वेळ',
    inCharge: 'प्रभारी अधिकारी',
    contactClinic: 'दवाखान्याशी संपर्क साधा',
    offlineNotice: 'तुम्ही सध्या ऑफलाइन आहात. माहिती स्थानिक पातळीवर सुरक्षित ठेवली जाईल व इंटरनेट आल्यावर आपोआप पाठवली जाईल.',
    syncPending: 'प्रलंबित अहवाल पाठवा',
    backOnline: 'इंटरनेट सुरू झाले!',
    allReportsSynced: 'सर्व ऑफलाइन अहवाल यशस्वीरित्या पाठवले गेले.',
    reportsWaitingToSync: 'अहवाल पाठवणे बाकी आहे.',
    syncing: 'पाठवत आहे...',

    // Quick Demo Bar
    sihQuickAccess: 'SIH मूल्यमापन द्रुत प्रवेश (१-क्लिक चाचणी पोर्टल्स):',
    patilFarmer: 'शेतकरी (पाटील)',
    kulkarniVet: 'पशुवैद्यक (डॉ. कुलकर्णी)',
    deshmukhGovt: 'शासकीय अधिकारी (डॉ. देशमुख)',

    // Header & Notifications Dropdown
    notificationsCenter: 'सूचना आणि थेट इशारे',
    unread: 'न वाचलेले',
    markAllRead: 'सर्व वाचलेले म्हणून चिन्हांकित करा',
    noNotifications: 'सध्या कोणतीही सूचना नाही.',
    openRelatedCase: 'संबंधित केस / अहवाल पहा',
    viewNotificationsCenter: 'सूचना केंद्र उघडा',
    markRead: 'वाचले',
    justNow: 'आत्ताच',
    mAgo: 'मि. पूर्वी',
    hAgo: 'ता. पूर्वी',

    // Farmer Dashboard
    registeredLivestockOwner: 'नोंदणीकृत पशुपालक',
    namaskar: 'नमस्कार',
    farmerDashboardIntro: 'तुमच्या पशुधनाच्या आरोग्याची नोंद ठेवा, त्वरित जोखीम मूल्यमापनासाठी आजाराची लक्षणे नोंदवा आणि पशुवैद्यकीय औषधोपचार तपासा.',
    reportAnimalSymptoms: 'जनावरांची लक्षणे नोंदवा',
    addNewAnimal: 'नवीन जनावर जोडा',
    reportAnimalDeath: 'जनावराच्या मृत्यूची नोंद करा',
    totalAnimals: 'एकूण पशुधन',
    healthyAnimals: 'निरोगी जनावरे',
    sickAnimals: 'आजारी जनावरे',
    underObservation: 'निरीक्षणाखाली',
    activeReports: 'सक्रिय तक्रारी',
    vaccinationCoverage: 'लसीकरण कव्हरेज',
    activeRegionalAdvisories: 'सक्रिय प्रादेशिक प्रतिबंधात्मक सूचना',
    recentHealthReports: 'अलीकडील आरोग्य व लक्षण अहवाल',
    recentHealthReportsSubtitle: 'दाखल केसेस आणि पशुवैद्यकीय तपासणीची सद्यस्थिती',
    noRecentHealthIssues: 'अलीकडे कोणतीही आरोग्याची समस्या नोंदवलेली नाही. तुमचे पशुधन निरोगी आहे!',
    urgentVetAdviceTitle: 'तातडीने पशुवैद्यकीय सल्ल्याची गरज आहे?',
    urgentVetAdviceDesc: 'फिरता पशुवैद्यकीय दवाखाना टोल-फ्री १९६२ तुमच्या तालुक्यात २४x७ उपलब्ध आहे.',
    findLocalDispensary: 'स्थानिक दवाखाना शोधा',
    symptomsColon: 'लक्षणे:',

    // My Livestock & Details
    myLivestock: 'माझे पशुधन',
    myLivestockTitle: 'माझे पशुधन',
    myLivestockSubtitle: 'डिजिटल आरोग्य टॅग आणि लसीकरण नोंदींसह नोंदणीकृत पशुधन यादी',
    addAnimal: 'नवीन जनावर जोडा',
    registerNewLivestock: 'नवीन जनावर नोंदवा',
    loadingLivestock: 'पशुधन यादी लोड होत आहे...',
    noLivestockFound: 'निकषांशी जुळणारे कोणतेही पशुधन आढळले नाही.',
    registerToStartMonitoring: 'आरोग्य तपासणी सुरू करण्यासाठी तुमची गाय, म्हैस किंवा शेळी नोंदवा.',
    addFirstLivestock: 'पहिले जनावर जोडा',
    animalCode: 'जनावर कोड',
    earTagId: 'इयर टॅग क्रमांक / बिल्ला',
    animalName: 'जनावराचे नाव',
    species: 'प्रजाती',
    selectSpeciesFirst: '— प्रथम प्रजाती निवडा —',
    breed: 'जात / वाण',
    selectBreed: '— जात निवडा —',
    specifyCustomBreed: 'इतर जात नमूद करा',
    customBreedPlaceholder: 'उदा. देशी स्थानिक संकर, मालवी, पंढरपुरी संकर...',
    chooseSpeciesHint: '⚠️ उपलब्ध जाती पाहण्यासाठी कृपया वर प्रथम प्रजाती निवडा.',
    gender: 'लिंग',
    female: 'मादी',
    male: 'नर',
    age: 'वय',
    ageYears: 'वय (वर्षे)',
    weight: 'वजन',
    weightKg: 'वजन (किलो)',
    color: 'रंग',
    registeredIn: 'नोंदणी ठिकाण:',
    reportSymptomBtn: 'लक्षणे नोंदवा',
    medicalRecord: 'वैद्यकीय नोंद',
    livestockPhoto: 'जनावराचा फोटो (ऐच्छिक)',
    photoUploadHelper: 'मोबाईल कॅमेऱ्याने फोटो काढा किंवा गॅलरीतून निवडा (JPEG, PNG, WebP ≤ ५MB)',
    registerLivestockBtn: 'जनावर नोंदवा',
    pleaseSelectSpeciesFirst: 'जात निवडण्यापूर्वी कृपया प्रथम प्रजाती निवडा.',
    pleaseSelectBreed: 'कृपया जात निवडा.',
    failedToAddAnimal: 'जनावर जोडण्यात अयशस्वी.',
    loadingLivestockProfile: 'पशुधन प्रोफाइल लोड होत आहे...',
    animalNotFound: 'जनावराची माहिती आढळली नाही.',
    symptomReportsTab: 'लक्षण अहवाल',
    vaccinationsTab: 'लसीकरण',
    treatmentsPrescribedTab: 'दिलेले औषधोपचार',
    noSymptomReportsForAnimal: 'या जनावरासाठी अद्याप कोणतीही लक्षण नोंद केलेली नाही.',
    noVaccinationRecordsForAnimal: 'या जनावरासाठी लसीकरण नोंद उपलब्ध नाही.',
    noTreatmentsForAnimal: 'या जनावरासाठी अद्याप पशुवैद्यकीय प्रिस्क्रिप्शन नोंदवलेले नाही.',
    reportNewSymptoms: 'नवीन लक्षणे नोंदवा',
    reportedSymptoms: 'नोंदवलेली लक्षणे',
    duration: 'कालावधी',
    severity: 'तीव्रता',
    bodyTemperature: 'शारीरिक तापमान',
    automatedDecisionSupport: 'स्वयंचलित निर्णय साहाय्य',
    possibleCondition: 'संभाव्य आजार',
    recommendedAction: 'शिफारस केलेली कृती',
    vaccineName: 'लसीचे नाव',
    doseNumber: 'डोस क्र.',
    administeredDate: 'दिलेली तारीख',
    nextDueDate: 'पुढील देय दिनांक',
    diagnosis: 'रोगनिदान',
    prescribedBy: 'उपचार देणारे अधिकारी',
    followUp: 'पुढील तपासणी',
    prescribedMedicines: 'दिलेली औषधे',
    dosage: 'मात्रा (डोस)',
    frequency: 'वारंवारता',
    careInstructions: 'काळजी व सूचना',

    // Report Symptoms
    reportSymptoms: 'आजाराची लक्षणे नोंदवा',
    reportSymptomsTitle: 'आजाराची लक्षणे नोंदवा',
    reportSymptomsSubtitle: 'महाराष्ट्रातील पशुपालकांसाठी रोगांची पूर्वतपासणी व पाळत ठेवणारी प्रणाली.',
    selectAffectedAnimal: '१. आजारी जनावर निवडा *',
    noLivestockRegisteredAddFirst: 'अद्याप कोणतेही पशुधन नोंदवलेले नाही. प्रथम जनावर जोडा.',
    selectObservedSymptoms: '२. दिसणारी लक्षणे निवडा *',
    symptomsSelected: 'निवडले',
    otherSymptomsOption: 'इतर / विशिष्ट लक्षणे',
    specifyCustomSymptoms: 'इतर लक्षणे नमूद करा *',
    sentDirectlyToVet: 'पशुवैद्यकीय अधिकाऱ्यांना थेट पाठवले जाईल',
    customSymptomsPlaceholder: 'उदा. गळ्याला सूज, कान सतत हलवणे, नाकातून रक्तस्त्राव, डाव्या पायाने लंगडणे...',
    customSymptomsHelp: 'कृपया वरील सूचीमध्ये नसलेली कोणतीही वेगळी लक्षणे, वर्तनातील बदल किंवा दिसणाऱ्या खुणा स्पष्ट करा.',
    clinicalVitalsAndOnset: '३. आजाराची स्थिती व लक्षणे',
    durationDaysLabel: 'कालावधी (दिवस)',
    severityReported: 'तीव्रता',
    mild: 'सौम्य',
    moderate: 'मध्यम',
    severe: 'गंभीर',
    bodyTempF: 'शरीराचे तापमान (°F)',
    appetiteStatus: 'चारा खाणे / आहार स्थिती',
    normal: 'नेहमीप्रमाणे',
    reduced: 'कमी खात आहे',
    noneAppetite: 'अन्न पूर्णपणे बंद',
    milkYieldImpact: 'दूध उत्पादनातील घट',
    notLactating: 'काही नाही / भाकड किंवा गाभण',
    slightDrop: 'थोडी घट (<५०%)',
    severeDrop: 'मोठी घट (>५०%)',
    additionalNotesAndPhoto: '४. अतिरिक्त माहिती व जनावराचा फोटो',
    describePhysicalBehaviorPlaceholder: 'शारीरिक हालचाली, फोड, लाळ गळणे, किंवा आजूबाजूची इतर जनावरे आजारी आहेत का ते लिहा...',
    symptomsPhotoLabel: 'लक्षणे किंवा जखमेचा फोटो (ऐच्छिक)',
    symptomsPhotoHelper: 'दिसणारे फोड, लाळ, जखमा किंवा डोळ्यातील स्रावाचा फोटो काढा (JPEG, PNG, WebP ≤ ५MB)',
    automatedRiskEnginePreview: 'स्वयंचलित जोखीम मूल्यमापन पूर्वदृश्य',
    epidemiologicalRisk: 'साथरोग जोखीम:',
    suspectedPatternMatch: 'संभाव्य आजार वर्ग:',
    decisionSupportDisclaimerText: 'हे पूर्वदृश्य संगणकीय निर्णय-साहाय्यक प्रणाली आहे आणि हे अधिकृत पशुवैद्यकीय निदान मानले जाऊ नये.',
    detectingGps: 'GPS स्थान शोधत आहे...',
    submitHealthReport: 'आरोग्य अहवाल दाखल करा',
    processingAssessment: 'मूल्यमापन तपासत आहे...',
    offlineQueueNotice: 'ऑफलाइन मोड सक्रिय: अहवाल स्थानिक पातळीवर साठवला जाईल.',
    selectAnimalAndSymptomAlert: 'कृपया एक जनावर आणि किमान एक लक्षण निवडा.',
    specifyCustomSymptomAlert: 'कृपया "इतर लक्षणे" या रकान्यात लक्षणांचे वर्णन लिहा.',
    offlineReportSavedNotice: 'तुम्ही सध्या ऑफलाइन आहात. हा अहवाल सुरक्षित ठेवला गेला असून इंटरनेट सुरू होताच आपोआप पाठवला जाईल.',
    healthReportFiledSuccess: 'आरोग्य अहवाल यशस्वीरित्या नोंदवला गेला!',
    reportCode: 'अहवाल क्रमांक',
    suspectedDiseaseCategory: 'संभाव्य आजार वर्ग:',
    recommendedImmediateAction: 'तातडीने करायची शिफारस केलेली कृती:',
    trackCaseInReports: 'माझ्या अहवालांमध्ये केस तपासा',
    findNearestClinic: 'जवळचा पशुवैद्यकीय दवाखाना शोधा',

    // Report Death
    reportDeath: 'मृत्यू नोंदवा',
    reportAnimalDeathTitle: 'जनावराच्या मृत्यूची नोंद करा',
    reportAnimalDeathSubtitle: 'मृत्यू पाळत अहवाल महाराष्ट्रातील संभाव्य साथीच्या आजारांचा उद्रेक शोधण्यात मदत करतो',
    mortalityNotice: 'शासकीय पाळत सूचना: जनावरांच्या मृत्यूची वेळेवर नोंद केल्याने पशुसंवर्धन विभागाला रोगाचा प्रादुर्भाव इतर गोठ्यांमध्ये पसरण्यापूर्वी रोखण्यास मदत होते.',
    selectDeceasedAnimal: 'मृत जनावर निवडा *',
    dateOfDeath: 'मृत्यूची तारीख *',
    otherSickAnimalsInHerd: 'कळपातील इतर आजारी जनावरांची संख्या',
    symptomsBeforeDeath: 'मृत्यूअगोदर दिसलेली लक्षणे *',
    symptomsBeforeDeathPlaceholder: 'उदा. अचानक तीव्र ताप, घशात सूज, धाप लागणे, २ दिवस चारा बंद...',
    suspectedCause: 'संभाव्य कारण',
    suspectedCausePlaceholder: 'उदा. संभाव्य घटसर्प / फऱ्या / तीव्र ताप',
    submitMortalityReport: 'मृत्यू पाळत अहवाल सादर करा',
    registeringReport: 'नोंदणी होत आहे...',
    mortalityRegisteredTitle: 'मृत्यू नोंदणी पूर्ण झाली',
    mortalityRegisteredDesc: 'जनावराची मृत म्हणून नोंद झाली आहे. साथरोग नियंत्रण नियमावलीनुसार स्थानिक पशुवैद्यकीय अधिकारी आणि जिल्हा रोग अन्वेषण अधिकाऱ्यांना त्वरित अलर्ट पाठवला गेला आहे.',

    // Case Reports
    myReports: 'माझे अहवाल',
    myCaseReports: 'माझे आरोग्य अहवाल',
    caseReportsSubtitle: 'दाखल केसेसच्या प्राथमिक तपासणीपासून ते प्रत्यक्ष पशुवैद्यकीय निदान आणि उपचारांपर्यंतचा मागोवा घ्या',
    loadingReports: 'अहवाल लोड होत आहेत...',
    noReportsSubmitted: 'अद्याप कोणताही अहवाल दाखल केलेला नाही.',
    noReportsSubmittedDesc: 'तुम्ही जनावराच्या आजारपणाची लक्षणे नोंदवल्यावर त्याचे अद्यतन आणि निदान येथे दिसेल.',
    reportId: 'अहवाल क्र.',
    animalDetails: 'जनावराचा तपशील',
    reportedDate: 'नोंदणी दिनांक',
    observedSymptoms: 'दिसलेली लक्षणे',
    riskRating: 'जोखीम श्रेणी',
    caseStatus: 'केस स्थिती',
    attendingVet: 'पशुवैद्यक अधिकारी',
    underTriage: 'प्राथमिक तपासणीत',

    // Vaccinations Tracker
    vaccinations: 'लसीकरण',
    vaccinationTrackerTitle: 'लसीकरण ट्रॅकर',
    vaccinationTrackerSubtitle: 'राज्यस्तरीय लसीकरण वेळापत्रक, बूस्टर दिनदर्शिका आणि लसीकरणाचा इतिहास',
    loadingVaccinations: 'लसीकरण दिनदर्शिका लोड होत आहे...',
    noVaccinationsFound: 'तुमच्या पशुधनासाठी कोणतीही लसीकरण नोंद आढळली नाही.',
    nextBoosterDue: 'पुढील बूस्टर दिनांक:',
    administeredBy: 'लस देणारे अधिकारी:',
    batch: 'बॅच',
    dose: 'डोस',

    // Treatments & Prescriptions
    treatments: 'औषधोपचार',
    prescriptionsTitle: 'औषधोपचार व प्रिस्क्रिप्शन',
    prescriptionsSubtitle: 'अधिकृत पशुवैद्यकीय ई-प्रिस्क्रिप्शन, औषधांचे वेळापत्रक आणि पुढील सूचना',
    loadingPrescriptions: 'प्रिस्क्रिप्शन लोड होत आहेत...',
    noTreatmentsFound: 'तुमच्या पशुधनासाठी औषधोपचारांची कोणतीही नोंद आढळली नाही.',
    ePrescription: 'ई-प्रिस्क्रिप्शन',
    medicinesAndDosage: 'दिलेली औषधे आणि मात्रा (डोस):',
    careAndFeedingInstructions: 'काळजी व आहार सूचना:',
    scheduledFollowUp: 'पुढील तपासणीची नियोजित तारीख:',

    // Nearby Vets
    nearbyVets: 'जवळचे पशुवैद्यक दवाखाने',
    nearbyVetsHeader: 'जवळचे पशुवैद्यकीय दवाखाने',
    nearbyVetsSub: 'महाराष्ट्रातील शासकीय पशुवैद्यकीय चिकित्सालये, तालुका दवाखाने आणि फिरते पथक',
    helplineTitle: 'महाराष्ट्र पशु आरोग्य हेल्पलाइन: १९६२',
    helplineDesc: 'तुमच्या गोठ्यावर फिरता पशुवैद्यकीय दवाखाना (MVU) बोलावण्यासाठी टोल-फ्री कॉल करा.',
    call1962Now: 'आत्ताच १९६२ वर कॉल करा',
    loadingCenters: 'पशुवैद्यक केंद्रे लोड होत आहेत...',
    noFacilitiesFound: 'कोणतेही केंद्र आढळले नाही.',

    // Alerts & Advisories
    alerts: 'सूचना व इशारे',
    alertsAndAdvisoriesTitle: 'इशारे व सूचना',
    alertsAndAdvisoriesSubtitle: 'अधिकृत रोगाचा प्रादुर्भाव इशारे, जैविक सुरक्षा नियम आणि हंगामी लसीकरण परिपत्रके',
    loadingAlerts: 'इशारे व सूचना लोड होत आहेत...',
    noActiveAdvisories: 'तुमच्या जिल्ह्यात सध्या कोणतीही सक्रिय साथीच्या रोगाची सूचना नाही.',
    authorizedAuthority: 'सक्षम प्राधिकारी:',

    // Notifications Center Page
    notificationsCenterTitle: 'सूचना व पूर्वसूचना केंद्र',
    notificationsCenterSubtitle: 'थेट पाळत अद्यतने, साथरोग क्लस्टर इशारे आणि पशुवैद्यकीय केस सूचना',
    allNotifications: 'सर्व सूचना',
    outbreaksAndHighRisk: 'उद्रेक व उच्च जोखीम',
    casesAndVaccines: 'केसेस व लसीकरण',
    stateAdvisories: 'शासकीय सूचना',
    loadingNotifications: 'सूचना केंद्र लोड होत आहे...',
    noNotificationsInView: 'या विभागात कोणतीही सूचना आढळली नाही.',
    allCaughtUp: 'तुम्ही सर्व ताज्या पूर्वसूचना संदेशांची माहिती घेतली आहे!',
    newAlertsAppearHere: 'नवीन उद्रेक अहवाल, केसेस आणि आरोग्य अद्यतने येथे आपोआप दिसतील.',
    openDetails: 'तपशील उघडा',
    notifCategoryOutbreak: 'उद्रेक',
    notifCategoryCaseUpdate: 'केस अद्यतन',
    notifCategoryVaccine: 'लसीकरण',
    notifCategoryAlert: 'इशारा',
    notifCategoryAdvisory: 'सूचना',
    notifDateAt: 'रोजी',

    // Status & Risk Badges
    riskAssessment: 'स्वयंचलित जोखीम मूल्यमापन — निर्णय साहाय्य',
    riskDisclaimer: 'महत्त्वाची सूचना: हे मूल्यमापन केवळ निर्णय-साहाय्यक प्रणाली आहे. अंतिम रोगनिदान व औषधोपचार अधिकृत पशुवैद्यकीय डॉक्टरांकडूनच निश्चित केले जावे.',
    riskLow: 'कमी जोखीम',
    riskMedium: 'मध्यम जोखीम',
    riskHigh: 'उच्च जोखीम',
    riskCritical: 'अत्यंत गंभीर जोखीम',
    priorityCritical: 'अत्यंत गंभीर',
    priorityHigh: 'उच्च',
    priorityUpdate: 'अद्यतन',
    priorityInfo: 'माहिती',
    priorityAdvisory: 'सूचना',
    priorityVaccination: 'लसीकरण',

    // Status Values
    statusHealthy: 'निरोगी',
    statusSick: 'आजारी',
    statusUnderObservation: 'निरीक्षणाखाली',
    statusObservation: 'निरीक्षणाखाली',
    statusDeceased: 'मृत',
    statusSubmitted: 'दाखल',
    statusUnderReview: 'पुनरावलोकनाधीन',
    statusDiagnosed: 'निदान झाले',
    statusTreatmentStarted: 'उपचार सुरू',
    statusResolved: 'बरे झाले',
    statusCompleted: 'पूर्ण',
    statusPending: 'प्रलंबित',
    statusOverdue: 'मुदत संपली',
    statusAssigned: 'सोपवले',
    statusCollected: 'नमुना संकलित',
    statusTesting: 'तपासणी सुरू',
    statusUnderInvestigation: 'तपासाधीन',
    statusEscalated: 'गंभीर श्रेणीत',
    statusDetected: 'शोध लागला',
    statusContained: 'नियंत्रित',
    statusContainmentActive: 'नियंत्रण कक्ष सक्रिय',

    // Photo Upload Component
    uploadPhoto: 'फोटो अपलोड करा',
    addPhoto: 'फोटो जोडा',
    changePhoto: 'फोटो बदला',
    photoAttached: 'फोटो जोडला गेला आहे',
    clickToUpload: 'फोटो निवडण्यासाठी क्लिक करा किंवा ओढून आणा',
    useCamera: 'कॅमेरा वापरा',
    gallery: 'गॅलरी',
    uploadingSecuring: 'फोटो अपलोड व सुरक्षित करत आहे...',
    uploadedSuccess: 'यशस्वीरित्या अपलोड झाले',
    replace: 'बदला',
    remove: 'काढून टाका',
    invalidFormat: 'अवैध फॉरमॅट. कृपया JPEG, PNG किंवा WebP फोटो निवडा.',
    fileSizeExceeded: 'फोटोचा आकार ५MB पेक्षा जास्त आहे. कृपया लहान फोटो निवडा.',
    uploadFailed: 'फोटो अपलोड करण्यात अयशस्वी. कृपया पुन्हा प्रयत्न करा.',

    // Authentication Pages
    roleSelectTitle: 'तुमची भूमिका निवडा',
    roleSelectSubtitle: 'योग्य पाळत डॅशबोर्डवर सुरक्षितपणे साइन इन करण्यासाठी तुमची भूमिका निवडा.',
    roleBasedAccess: 'भूमिका-आधारित नियंत्रण',
    continueAsFarmer: 'शेतकरी म्हणून पुढे जा',
    continueAsVet: 'पशुवैद्यक अधिकारी म्हणून पुढे जा',
    continueAsGovt: 'शासकीय अधिकारी म्हणून पुढे जा',
    farmerPortalLogin: 'शेतकरी पोर्टल लॉगिन',
    farmerLoginSubtitle: 'तुमचा नोंदणीकृत मोबाईल क्रमांक किंवा ईमेल वापरून लॉगिन करा',
    mobileOrEmail: 'मोबाईल क्रमांक किंवा ईमेल',
    password: 'पासवर्ड',
    loginAsFarmer: 'शेतकरी म्हणून लॉगिन करा',
    dontHaveAccount: 'अद्याप खाते नाही?',
    registerLivestockAccount: 'पशुधन खाते नोंदवा',
    switchPortal: '← पोर्टल बदला',
    autoFill: 'आपोआप भरा',
    sihEvaluatorDemo: 'SIH मूल्यमापन डेमो:',
    farmerRegisterTitle: 'शेतकरी नोंदणी',
    farmerRegisterSubtitle: 'पशुसंवर्धन विभागाकडे अधिकृत पशु आरोग्य पाळत खाते तयार करा',
    fullName: 'पूर्ण नाव',
    mobileNumber: 'मोबाईल क्रमांक',
    emailAddress: 'ईमेल पत्ता',
    confirmPassword: 'पासवर्ड पुष्टी करा',
    locationAndJurisdiction: 'स्थान आणि कार्यक्षेत्र',
    village: 'गाव',
    block: 'तालुका',
    district: 'जिल्हा',
    preferredLanguage: 'पसंतीची भाषा',
    createFarmerAccount: 'शेतकरी खाते तयार करा',
    alreadyHaveAccount: 'आधीच खाते आहे?',
    signInHere: 'येथे साइन इन करा',
    passwordsDoNotMatch: 'पासवर्ड जुळत नाहीत.',
    loginFailed: 'लॉगिन अयशस्वी. कृपया तुमची माहिती तपासा.',
    registrationFailed: 'नोंदणी अयशस्वी. कृपया तुमची माहिती तपासा.',
    verifying: 'तपासत आहे...',
    registering: 'नोंदणी होत आहे...',
    failedToSubmitReport: 'अहवाल सादर करण्यात अयशस्वी: ',
    failedToSubmitMortalityReport: 'मृत्यू पाळत अहवाल सादर करण्यात अयशस्वी: ',
    selectAnimalAndSymptomsBeforeDeath: 'कृपया जनावर निवडा आणि मृत्यूअगोदर दिसलेली लक्षणे लिहा.',
  },

  hi: {
    // App & Shell
    appTitle: 'पशुसेतु (PashuSetu)',
    appSubtitle: 'स्मार्ट पशु स्वास्थ्य निगरानी एवं पूर्व चेतावनी प्रणाली',
    tagline: 'पशुधन, किसान और पशु चिकित्सा सेवा का डिजिटल सेतु',
    govtHeader: 'महाराष्ट्र शासन • पशुपालन विभाग',
    sihStatement: 'SIH समस्या कथन: SIH26128',
    home: 'होम',
    about: 'हमारे बारे में',
    howItWorks: 'यह कैसे काम करता है',
    features: 'विशेषताएं',
    login: 'लॉग इन',
    logout: 'लॉग आउट',
    reportIssue: 'बीमारी की रिपोर्ट करें',
    selectRole: 'अपनी भूमिका चुनें',
    farmer: 'किसान / पशुपालक',
    veterinarian: 'पशु चिकित्सक',
    government: 'सरकारी अधिकारी',
    farmerDesc: 'पशुधन प्रबंधित करें, लक्षणों की रिपोर्ट करें, और टीकाकरण व प्रकोप की चेतावनी प्राप्त करें।',
    vetDesc: 'मामलों की समीक्षा करें, नैदानिक निदान दें, उपचार निर्धारित करें और लैब नमूने ट्रैक करें।',
    govtDesc: 'राज्यव्यापी बीमारी हॉटस्पॉट, प्रकोप नियंत्रण, आंकड़े और टीकाकरण प्रगति की निगरानी करें।',

    // Sidebar & Navigation
    dashboardOverview: 'डैशबोर्ड अवलोकन',
    currentPortal: 'वर्तमान पोर्टल',
    farmerWorkspace: 'किसान कार्यक्षेत्र',
    veterinaryPortal: 'पशु चिकित्सा पोर्टल',
    stateHealthCommand: 'राज्य स्वास्थ्य कमांड',
    notificationsAlerts: 'सूचनाएं और अलर्ट',
    govtOfMaharashtra: 'महाराष्ट्र सरकार',
    animalHusbandryDept: 'पशुपालन विभाग',
    earlyWarningSystem: 'महाराष्ट्र सरकार • पूर्व चेतावनी प्रणाली',
    changeLanguage: 'भाषा बदलें',
    caseloadDashboard: 'केस डैशबोर्ड',
    reportedCasesQueue: 'दर्ज मामले',
    districtDiseaseMap: 'जिला रोग मानचित्र',
    labSamples: 'प्रयोगशाला नमूने',
    prescriptionsIssued: 'जारी नुस्खे',
    statewideOverview: 'राज्यव्यापी समीक्षा',
    gisDiseaseMap: 'जीआईएस रोग मानचित्र',
    outbreakDetection: 'प्रकोप पहचान',
    diseaseAnalytics: 'रोग विश्लेषण',
    vaccinationMonitoring: 'टीकाकरण निगरानी',
    veterinaryResponse: 'पशु चिकित्सा प्रतिक्रिया',
    surveillanceReports: 'निगरानी रिपोर्ट',
    broadcastAdvisory: 'परामर्श प्रसारण',

    // Common Actions & States
    submit: 'जमा करें',
    cancel: 'रद्द करें',
    save: 'सहेजें',
    saving: 'सहेज रहे हैं...',
    submitting: 'जमा हो रहा है...',
    loading: 'लोड हो रहा है...',
    all: 'सभी',
    allSpecies: 'सभी प्रजातियां',
    searchPlaceholder: 'ईयर टैग, नाम, नस्ल खोजें...',
    viewAll: 'सभी देखें',
    viewDetails: 'विवरण देखें',
    edit: 'संपादित करें',
    delete: 'हटाएं',
    backToLivestock: 'मेरे पशुधन पर वापस जाएं',
    returnToRoster: 'पशुधन सूची पर वापस जाएं',
    daysUnit: 'दिन',
    reportedOn: 'रिपोर्ट दिनांक',
    issuedOn: 'जारी दिनांक',
    location: 'स्थान',
    targetDistrict: 'लक्षित जिला',
    hours: 'समय',
    inCharge: 'प्रभारी',
    contactClinic: 'क्लिनिक से संपर्क करें',
    offlineNotice: 'आप ऑफ़लाइन हैं। रिपोर्ट स्थानीय रूप से सुरक्षित रहेगी और इंटरनेट आने पर स्वचालित रूप से सिंक होगी।',
    syncPending: 'लंबित रिपोर्ट सिंक करें',
    backOnline: 'इंटरनेट सक्रिय!',
    allReportsSynced: 'सभी ऑफ़लाइन रिपोर्ट सफलतापूर्वक सिंक हो गईं।',
    reportsWaitingToSync: 'रिपोर्ट सिंक होना बाकी है।',
    syncing: 'सिंक हो रहा है...',

    // Quick Demo Bar
    sihQuickAccess: 'SIH मूल्यांकन त्वरित पहुंच (1-क्लिक टेस्ट पोर्टल):',
    patilFarmer: 'किसान (पाटिल)',
    kulkarniVet: 'पशु चिकित्सक (डॉ. कुलकर्णी)',
    deshmukhGovt: 'सरकारी अधिकारी (डॉ. देशमुख)',

    // Header & Notifications Dropdown
    notificationsCenter: 'सूचनाएं और लाइव अलर्ट',
    unread: 'अपठित',
    markAllRead: 'सभी को पढ़ा हुआ चिह्नित करें',
    noNotifications: 'अभी कोई सूचना नहीं है।',
    openRelatedCase: 'संबंधित केस / रिपोर्ट देखें',
    viewNotificationsCenter: 'सूचना केंद्र देखें',
    markRead: 'पढ़ा',
    justNow: 'अभी',
    mAgo: 'मि. पहले',
    hAgo: 'घंटे पहले',

    // Farmer Dashboard
    registeredLivestockOwner: 'पंजीकृत पशुपालक',
    namaskar: 'नमस्कार',
    farmerDashboardIntro: 'अपने पशुधन स्वास्थ्य रिकॉर्ड की निगरानी करें, त्वरित जोखिम मूल्यांकन के लिए लक्षणों की रिपोर्ट करें और पशु चिकित्सा नुस्खे ट्रैक करें।',
    reportAnimalSymptoms: 'पशु लक्षण रिपोर्ट करें',
    addNewAnimal: 'नया पशु जोड़ें',
    reportAnimalDeath: 'पशु मृत्यु दर्ज करें',
    totalAnimals: 'कुल पशुधन',
    healthyAnimals: 'स्वस्थ पशु',
    sickAnimals: 'बीमार पशु',
    underObservation: 'निगरानी में',
    activeReports: 'सक्रिय रिपोर्ट',
    vaccinationCoverage: 'टीकाकरण कवरेज',
    activeRegionalAdvisories: 'सक्रिय क्षेत्रीय निवारक परामर्श',
    recentHealthReports: 'हालिया स्वास्थ्य एवं लक्षण रिपोर्ट',
    recentHealthReportsSubtitle: 'दर्ज मामलों और पशु चिकित्सा समीक्षा की स्थिति',
    noRecentHealthIssues: 'हाल ही में कोई स्वास्थ्य समस्या दर्ज नहीं हुई। आपका पशुधन स्वस्थ है!',
    urgentVetAdviceTitle: 'तत्काल पशु चिकित्सा सलाह चाहिए?',
    urgentVetAdviceDesc: 'टोल-फ्री 1962 मोबाइल पशु चिकित्सालय आपके ब्लॉक में 24x7 उपलब्ध है।',
    findLocalDispensary: 'स्थानीय औषधालय खोजें',
    symptomsColon: 'लक्षण:',

    // My Livestock & Details
    myLivestock: 'मेरा पशुधन',
    myLivestockTitle: 'मेरा पशुधन',
    myLivestockSubtitle: 'डिजिटल स्वास्थ्य टैग और टीकाकरण रिकॉर्ड के साथ पंजीकृत पशुधन सूची',
    addAnimal: 'नया पशु जोड़ें',
    registerNewLivestock: 'नया पशु पंजीकृत करें',
    loadingLivestock: 'पशुधन सूची लोड हो रही है...',
    noLivestockFound: 'मापदंड से मेल खाने वाला कोई पशुधन नहीं मिला।',
    registerToStartMonitoring: 'स्वास्थ्य निगरानी शुरू करने के लिए अपनी गाय, भैंस या बकरी पंजीकृत करें।',
    addFirstLivestock: 'पहला पशु जोड़ें',
    animalCode: 'पशु कोड',
    earTagId: 'ईयर टैग आईडी / टैग',
    animalName: 'पशु का नाम',
    species: 'प्रजाति',
    selectSpeciesFirst: '— पहले प्रजाति चुनें —',
    breed: 'नस्ल',
    selectBreed: '— नस्ल चुनें —',
    specifyCustomBreed: 'अन्य नस्ल निर्दिष्ट करें',
    customBreedPlaceholder: 'उदा. स्थानीय संकर, मालवी, पंढरपुरी मिक्स...',
    chooseSpeciesHint: '⚠️ उपलब्ध नस्लें देखने के लिए पहले प्रजाति चुनें।',
    gender: 'लिंग',
    female: 'मादा',
    male: 'नर',
    age: 'आयु',
    ageYears: 'आयु (वर्ष)',
    weight: 'वजन',
    weightKg: 'वजन (किग्रा)',
    color: 'रंग',
    registeredIn: 'पंजीकृत स्थान:',
    reportSymptomBtn: 'लक्षण रिपोर्ट करें',
    medicalRecord: 'चिकित्सा रिकॉर्ड',
    livestockPhoto: 'पशु की तस्वीर (वैकल्पिक)',
    photoUploadHelper: 'मोबाइल कैमरे से फोटो लें या गैलरी से अपलोड करें (JPEG, PNG, WebP ≤ 5MB)',
    registerLivestockBtn: 'पशु पंजीकृत करें',
    pleaseSelectSpeciesFirst: 'नस्ल चुनने से पहले कृपया प्रजाति चुनें।',
    pleaseSelectBreed: 'कृपया नस्ल चुनें।',
    failedToAddAnimal: 'पशु जोड़ने में विफल।',
    loadingLivestockProfile: 'पशु प्रोफ़ाइल लोड हो रही है...',
    animalNotFound: 'पशु प्रोफ़ाइल नहीं मिली।',
    symptomReportsTab: 'लक्षण रिपोर्ट',
    vaccinationsTab: 'टीकाकरण',
    treatmentsPrescribedTab: 'निर्धारित उपचार',
    noSymptomReportsForAnimal: 'इस पशु के लिए अभी तक कोई लक्षण रिपोर्ट दर्ज नहीं है।',
    noVaccinationRecordsForAnimal: 'इस पशु के लिए कोई टीकाकरण रिकॉर्ड उपलब्ध नहीं है।',
    noTreatmentsForAnimal: 'इस पशु के लिए अभी तक कोई पशु चिकित्सा पर्ची दर्ज नहीं है।',
    reportNewSymptoms: 'नए लक्षण दर्ज करें',
    reportedSymptoms: 'दर्ज लक्षण',
    duration: 'अवधि',
    severity: 'गंभीरता',
    bodyTemperature: 'शरीर का तापमान',
    automatedDecisionSupport: 'स्वचालित निर्णय सहायता',
    possibleCondition: 'संभावित बीमारी',
    recommendedAction: 'अनुशंसित कार्रवाई',
    vaccineName: 'टीके का नाम',
    doseNumber: 'खुराक सं.',
    administeredDate: 'लगाने की तारीख',
    nextDueDate: 'अगली तारीख',
    diagnosis: 'निदान',
    prescribedBy: 'निर्धारितकर्ता',
    followUp: 'फॉलो-अप',
    prescribedMedicines: 'निर्धारित दवाएं',
    dosage: 'मात्रा',
    frequency: 'बारंबारता',
    careInstructions: 'देखभाल निर्देश',

    // Report Symptoms
    reportSymptoms: 'लक्षण रिपोर्ट करें',
    reportSymptomsTitle: 'पशु लक्षण रिपोर्ट करें',
    reportSymptomsSubtitle: 'महाराष्ट्र के पशुपालकों के लिए रोग पूर्व जांच एवं निगरानी प्रणाली।',
    selectAffectedAnimal: '1. प्रभावित पशु चुनें *',
    noLivestockRegisteredAddFirst: 'अभी कोई पशुधन पंजीकृत नहीं है। पहले एक पशु जोड़ें।',
    selectObservedSymptoms: '2. देखे गए लक्षण चुनें *',
    symptomsSelected: 'चयनित',
    otherSymptomsOption: 'अन्य / विशिष्ट लक्षण',
    specifyCustomSymptoms: 'अन्य लक्षण बताएं *',
    sentDirectlyToVet: 'उपचार करने वाले पशु चिकित्सक को भेजा जाएगा',
    customSymptomsPlaceholder: 'उदा. गले में सूजन, कान हिलाना, नाक से खून आना, पैर से लंगड़ाना...',
    customSymptomsHelp: 'कृपया किसी भी अद्वितीय लक्षण, व्यवहार परिवर्तन या दिखाई देने वाले संकेतों का वर्णन करें।',
    clinicalVitalsAndOnset: '3. नैदानिक लक्षण व स्थिति',
    durationDaysLabel: 'अवधि (दिन)',
    severityReported: 'गंभीरता',
    mild: 'हल्का',
    moderate: 'मध्यम',
    severe: 'गंभीर',
    bodyTempF: 'शरीर का तापमान (°F)',
    appetiteStatus: 'चारा / भूख',
    normal: 'सामान्य',
    reduced: 'कम खा रहा है',
    noneAppetite: 'खाना पूरी तरह बंद',
    milkYieldImpact: 'दूध उत्पादन में गिरावट',
    notLactating: 'कुछ नहीं / दूध नहीं दे रही',
    slightDrop: 'थोड़ी गिरावट (<50%)',
    severeDrop: 'भारी गिरावट (>50%)',
    additionalNotesAndPhoto: '4. अतिरिक्त जानकारी व फोटो',
    describePhysicalBehaviorPlaceholder: 'शारीरिक व्यवहार, छाले, स्राव, या आस-पास के पशु बीमार हैं या नहीं लिखें...',
    symptomsPhotoLabel: 'लक्षण या घाव का फोटो (वैकल्पिक)',
    symptomsPhotoHelper: 'घाव, छाले या स्राव का फोटो लें (JPEG, PNG, WebP ≤ 5MB)',
    automatedRiskEnginePreview: 'स्वचालित जोखिम इंजन पूर्वावलोकन',
    epidemiologicalRisk: 'महामारी जोखिम:',
    suspectedPatternMatch: 'संभावित बीमारी मिलान:',
    decisionSupportDisclaimerText: 'यह पूर्वावलोकन केवल निर्णय सहायता हेतु है और इसे आधिकारिक निदान न मानें।',
    detectingGps: 'GPS खोज रहे हैं...',
    submitHealthReport: 'स्वास्थ्य रिपोर्ट दर्ज करें',
    processingAssessment: 'मूल्यांकन संसाधित हो रहा है...',
    offlineQueueNotice: 'ऑफ़लाइन मोड सक्रिय: रिपोर्ट स्थानीय रूप से सहेजी जाएगी।',
    selectAnimalAndSymptomAlert: 'कृपया एक पशु और कम से कम एक लक्षण चुनें।',
    specifyCustomSymptomAlert: 'कृपया "अन्य लक्षण" फ़ील्ड में लक्षणों का वर्णन करें।',
    offlineReportSavedNotice: 'आप वर्तमान में ऑफ़लाइन हैं। यह रिपोर्ट सहेज ली गई है और इंटरनेट आते ही सिंक हो जाएगी।',
    healthReportFiledSuccess: 'स्वास्थ्य रिपोर्ट सफलतापूर्वक दर्ज की गई!',
    reportCode: 'रिपोर्ट कोड',
    suspectedDiseaseCategory: 'संभावित बीमारी श्रेणी:',
    recommendedImmediateAction: 'अनुशंसित तत्काल कार्रवाई:',
    trackCaseInReports: 'मेरी रिपोर्ट में केस ट्रैक करें',
    findNearestClinic: 'निकटतम पशु चिकित्सालय खोजें',

    // Report Death
    reportDeath: 'मृत्यु दर्ज करें',
    reportAnimalDeathTitle: 'पशु मृत्यु दर्ज करें',
    reportAnimalDeathSubtitle: 'मृत्यु निगरानी रिपोर्ट महाराष्ट्र भर में बीमारी के प्रकोप का पता लगाने में मदद करती है',
    mortalityNotice: 'आधिकारिक निगरानी सूचना: पशु मृत्यु की समय पर रिपोर्टिंग से अधिकारियों को बीमारी का प्रसार रोकने में मदद मिलती है।',
    selectDeceasedAnimal: 'मृत पशु चुनें *',
    dateOfDeath: 'मृत्यु की तारीख *',
    otherSickAnimalsInHerd: 'झुंड में अन्य बीमार पशुओं की संख्या',
    symptomsBeforeDeath: 'मृत्यु से पहले देखे गए लक्षण *',
    symptomsBeforeDeathPlaceholder: 'उदा. अचानक तेज बुखार, गले में सूजन, सांस लेने में कठिनाई, खाना बंद...',
    suspectedCause: 'संभावित कारण',
    suspectedCausePlaceholder: 'उदा. संभावित घटसर्प / एंथ्रेक्स / तेज बुखार',
    submitMortalityReport: 'मृत्यु निगरानी रिपोर्ट जमा करें',
    registeringReport: 'पंजीकरण हो रहा है...',
    mortalityRegisteredTitle: 'मृत्यु रिपोर्ट दर्ज हो गई',
    mortalityRegisteredDesc: 'पशु को मृत चिह्नित किया गया है। महामारी प्रोटोकॉल के तहत स्थानीय पशु चिकित्सक और जिला अधिकारी को सतर्क कर दिया गया है।',

    // Case Reports
    myReports: 'मेरी रिपोर्ट',
    myCaseReports: 'मेरी केस रिपोर्ट',
    caseReportsSubtitle: 'प्रारंभिक जांच से लेकर पशु चिकित्सा निदान और उपचार तक मामलों को ट्रैक करें',
    loadingReports: 'आपकी रिपोर्ट लोड हो रही है...',
    noReportsSubmitted: 'अभी तक कोई रिपोर्ट दर्ज नहीं की गई है।',
    noReportsSubmittedDesc: 'जब आप किसी पशु के लक्षण दर्ज करेंगे, तो केस अपडेट और निदान यहां दिखाई देगा।',
    reportId: 'रिपोर्ट आईडी',
    animalDetails: 'पशु विवरण',
    reportedDate: 'रिपोर्ट दिनांक',
    observedSymptoms: 'देखे गए लक्षण',
    riskRating: 'जोखिम रेटिंग',
    caseStatus: 'केस स्थिति',
    attendingVet: 'पशु चिकित्सक',
    underTriage: 'जांच जारी',

    // Vaccinations Tracker
    vaccinations: 'टीकाकरण',
    vaccinationTrackerTitle: 'टीकाकरण ट्रैकर',
    vaccinationTrackerSubtitle: 'राज्यव्यापी टीकाकरण कार्यक्रम, बूस्टर कैलेंडर और टीकाकरण इतिहास',
    loadingVaccinations: 'टीकाकरण कैलेंडर लोड हो रहा है...',
    noVaccinationsFound: 'आपके पशुधन के लिए कोई टीकाकरण रिकॉर्ड नहीं मिला।',
    nextBoosterDue: 'अगला बूस्टर दिनांक:',
    administeredBy: 'टीका लगाने वाले:',
    batch: 'बैच',
    dose: 'खुराक',

    // Treatments & Prescriptions
    treatments: 'उपचार',
    prescriptionsTitle: 'नुस्खे और उपचार',
    prescriptionsSubtitle: 'आधिकारिक पशु चिकित्सा ई-पर्चे, दवा कार्यक्रम और फॉलो-अप निर्देश',
    loadingPrescriptions: 'पर्चे लोड हो रहे हैं...',
    noTreatmentsFound: 'आपके पशुधन के लिए कोई उपचार रिकॉर्ड नहीं मिला।',
    ePrescription: 'ई-पर्चा',
    medicinesAndDosage: 'निर्धारित दवाएं और खुराक निर्देश:',
    careAndFeedingInstructions: 'देखभाल और आहार निर्देश:',
    scheduledFollowUp: 'निर्धारित फॉलो-अप तारीख:',

    // Nearby Vets
    nearbyVets: 'निकटतम पशु चिकित्सालय',
    nearbyVetsHeader: 'निकटतम पशु चिकित्सालय',
    nearbyVetsSub: 'महाराष्ट्र में सरकारी पशु चिकित्सालय, तालुका औषधालय और मोबाइल इकाइयां',
    helplineTitle: 'महाराष्ट्र पशु स्वास्थ्य हेल्पलाइन: 1962',
    helplineDesc: 'अपने खेत पर मोबाइल पशु चिकित्सा इकाई (MVU) बुलाने के लिए टोल-फ्री कॉल करें।',
    call1962Now: 'अभी 1962 पर कॉल करें',
    loadingCenters: 'पशु चिकित्सा केंद्र लोड हो रहे हैं...',
    noFacilitiesFound: 'कोई केंद्र नहीं मिला।',

    // Alerts & Advisories
    alerts: 'अलर्ट एवं परामर्श',
    alertsAndAdvisoriesTitle: 'अलर्ट और परामर्श',
    alertsAndAdvisoriesSubtitle: 'आधिकारिक रोग प्रकोप चेतावनी, जैव सुरक्षा प्रोटोकॉल और मौसमी टीकाकरण परिपत्र',
    loadingAlerts: 'अलर्ट और परामर्श लोड हो रहे हैं...',
    noActiveAdvisories: 'आपके जिले में कोई सक्रिय बीमारी प्रकोप परामर्श नहीं है।',
    authorizedAuthority: 'अधिकृत प्राधिकरण:',

    // Notifications Center Page
    notificationsCenterTitle: 'सूचना एवं पूर्व चेतावनी केंद्र',
    notificationsCenterSubtitle: 'रीयल-टाइम निगरानी अपडेट, प्रकोप अलर्ट और पशु चिकित्सा केस सूचनाएं',
    allNotifications: 'सभी सूचनाएं',
    outbreaksAndHighRisk: 'प्रकोप और उच्च जोखिम',
    casesAndVaccines: 'केस और टीके',
    stateAdvisories: 'सरकारी परामर्श',
    loadingNotifications: 'सूचना केंद्र लोड हो रहा है...',
    noNotificationsInView: 'इस दृश्य में कोई सूचना नहीं मिली।',
    allCaughtUp: 'आपने सभी नवीनतम पूर्व चेतावनी संदेश पढ़ लिए हैं!',
    newAlertsAppearHere: 'नए प्रकोप रिपोर्ट, केस असाइनमेंट और स्वास्थ्य अपडेट यहाँ दिखाई देंगे।',
    openDetails: 'विवरण खोलें',
    notifCategoryOutbreak: 'प्रकोप',
    notifCategoryCaseUpdate: 'केस अपडेट',
    notifCategoryVaccine: 'टीकाकरण',
    notifCategoryAlert: 'चेतावनी',
    notifCategoryAdvisory: 'परामर्श',
    notifDateAt: 'को',

    // Status & Risk Badges
    riskAssessment: 'स्वचालित जोखिम मूल्यांकन — निर्णय सहायता',
    riskDisclaimer: 'महत्वपूर्ण सूचना: यह जोखिम मूल्यांकन केवल निर्णय सहायता हेतु है। अंतिम निदान व उपचार पंजीकृत पशु चिकित्सक द्वारा ही मान्य होगा।',
    riskLow: 'कम जोखिम',
    riskMedium: 'मध्यम जोखिम',
    riskHigh: 'उच्च जोखिम',
    riskCritical: 'गंभीर जोखिम',
    priorityCritical: 'अत्यंत गंभीर',
    priorityHigh: 'उच्च',
    priorityUpdate: 'अपडेट',
    priorityInfo: 'जानकारी',
    priorityAdvisory: 'परामर्श',
    priorityVaccination: 'टीकाकरण',

    // Status Values
    statusHealthy: 'स्वस्थ',
    statusSick: 'बीमार',
    statusUnderObservation: 'निगरानी में',
    statusObservation: 'निगरानी में',
    statusDeceased: 'मृत',
    statusSubmitted: 'जमा',
    statusUnderReview: 'समीक्षाधीन',
    statusDiagnosed: 'निदान हुआ',
    statusTreatmentStarted: 'उपचार शुरू',
    statusResolved: 'ठीक हुआ',
    statusCompleted: 'पूर्ण',
    statusPending: 'लंबित',
    statusOverdue: 'अतिदेय',
    statusAssigned: 'सौंपा गया',
    statusCollected: 'नमूना संकलित',
    statusTesting: 'परीक्षण जारी',
    statusUnderInvestigation: 'जांच जारी',
    statusEscalated: 'गंभीर',
    statusDetected: 'पहचान की गई',
    statusContained: 'नियंत्रित',
    statusContainmentActive: 'नियंत्रण सक्रिय',

    // Photo Upload Component
    uploadPhoto: 'फोटो अपलोड करें',
    photoAttached: 'फोटो संलग्न है',
    clickToUpload: 'फोटो चुनने के लिए क्लिक करें या ड्रैग करें',
    useCamera: 'कैमरा उपयोग करें',
    gallery: 'गैलरी',
    uploadingSecuring: 'फोटो अपलोड और सुरक्षित किया जा रहा है...',
    uploadedSuccess: 'सफलतापूर्वक अपलोड हुआ',
    replace: 'बदलें',
    remove: 'हटाएं',
    invalidFormat: 'अमान्य प्रारूप। कृपया JPEG, PNG या WebP छवि चुनें।',
    fileSizeExceeded: 'फ़ाइल का आकार 5MB से अधिक है। कृपया छोटी फ़ाइल चुनें।',
    uploadFailed: 'सर्वर पर फोटो अपलोड करने में विफल। कृपया पुनः प्रयास करें।',

    // Authentication Pages
    roleSelectTitle: 'अपनी भूमिका चुनें',
    roleSelectSubtitle: 'उचित निगरानी डैशबोर्ड में सुरक्षित रूप से साइन इन करने के लिए अपनी भूमिका चुनें।',
    roleBasedAccess: 'भूमिका आधारित नियंत्रण',
    continueAsFarmer: 'किसान के रूप में आगे बढ़ें',
    continueAsVet: 'पशु चिकित्सक के रूप में आगे बढ़ें',
    continueAsGovt: 'सरकारी अधिकारी के रूप में आगे बढ़ें',
    farmerPortalLogin: 'किसान पोर्टल लॉगिन',
    farmerLoginSubtitle: 'अपने पंजीकृत मोबाइल नंबर या ईमेल से लॉगिन करें',
    mobileOrEmail: 'मोबाइल नंबर या ईमेल',
    password: 'पासवर्ड',
    loginAsFarmer: 'किसान के रूप में लॉगिन करें',
    dontHaveAccount: 'अभी तक खाता नहीं है?',
    registerLivestockAccount: 'पशुधन खाता पंजीकृत करें',
    switchPortal: '← पोर्टल बदलें',
    autoFill: 'स्वतः भरें',
    sihEvaluatorDemo: 'SIH मूल्यांकन डेमो:',
    farmerRegisterTitle: 'किसान पंजीकरण',
    farmerRegisterSubtitle: 'पशुपालन विभाग के साथ एक आधिकारिक पशु स्वास्थ्य निगरानी खाता बनाएं',
    fullName: 'पूरा नाम',
    mobileNumber: 'मोबाइल नंबर',
    emailAddress: 'ईमेल पता',
    confirmPassword: 'पासवर्ड की पुष्टि करें',
    locationAndJurisdiction: 'स्थान और क्षेत्राधिकार',
    village: 'गांव',
    block: 'तालुका / ब्लॉक',
    district: 'जिला',
    preferredLanguage: 'पसंदीदा भाषा',
    createFarmerAccount: 'किसान खाता बनाएं',
    alreadyHaveAccount: 'पहले से खाता है?',
    signInHere: 'यहाँ साइन इन करें',
    passwordsDoNotMatch: 'पासवर्ड मेल नहीं खाते।',
    loginFailed: 'लॉगिन विफल। कृपया क्रेडेंशियल जांचें।',
    registrationFailed: 'पंजीकरण विफल। कृपया विवरण जांचें।',
    verifying: 'सत्यापन हो रहा है...',
    registering: 'पंजीकरण हो रहा है...',
    failedToSubmitReport: 'रिपोर्ट जमा करने में विफल: ',
    failedToSubmitMortalityReport: 'मृत्यु रिपोर्ट जमा करने में विफल: ',
    selectAnimalAndSymptomsBeforeDeath: 'कृपया पशु चुनें और मृत्यु से पहले देखे गए लक्षणों का वर्णन करें।',
  },
};

// Helper translation mapping for dynamic symptoms
export const SYMPTOM_TRANSLATIONS: Record<string, { mr: string; hi: string; en: string }> = {
  Fever: { en: 'Fever', mr: 'ताप', hi: 'बुखार' },
  Cough: { en: 'Cough', mr: 'खोकला', hi: 'खांसी' },
  'Difficulty Breathing': { en: 'Difficulty Breathing', mr: 'श्वास घेण्यास त्रास / धाप लागणे', hi: 'सांस लेने में कठिनाई' },
  Diarrhea: { en: 'Diarrhea', mr: 'हगवण / जुलाब', hi: 'दस्त' },
  Vomiting: { en: 'Vomiting', mr: 'उलटी', hi: 'उल्टी' },
  'Loss of Appetite': { en: 'Loss of Appetite', mr: 'चारा न खाणे / भूक मंदावणे', hi: 'भूख में कमी' },
  Weakness: { en: 'Weakness', mr: 'अशक्तपणा / सुस्ती', hi: 'कमजोरी' },
  'Nasal Discharge': { en: 'Nasal Discharge', mr: 'नाकातून स्राव गळणे', hi: 'नाक से स्राव' },
  'Eye Discharge': { en: 'Eye Discharge', mr: 'डोळ्यातून घाण / पाणी येणे', hi: 'आंखों से स्राव' },
  'Skin Lesions': { en: 'Skin Lesions', mr: 'त्वचेवर गाठी / पुरळ / चट्टे', hi: 'त्वचा पर घाव / गांठें' },
  Swelling: { en: 'Swelling', mr: 'सूज (गळा / पाय / पोट)', hi: 'सूजन' },
  Lameness: { en: 'Lameness', mr: 'लंगडणे', hi: 'लंगड़ापन' },
  'Reduced Milk Production': { en: 'Reduced Milk Production', mr: 'दूध उत्पादनात घट', hi: 'दूध उत्पादन में कमी' },
  'Abnormal Behavior': { en: 'Abnormal Behavior', mr: 'असामान्य वर्तन', hi: 'असामान्य व्यवहार' },
  'Excessive Salivation / Drooling': { en: 'Excessive Salivation / Drooling', mr: 'तोंडातून लाळ गळणे', hi: 'मुंह से लार गिरना' },
  'Mouth Blisters / Ulcers': { en: 'Mouth Blisters / Ulcers', mr: 'तोंडात / जिभेवर फोड किंवा व्रण', hi: 'मुंह में छाले' },
  Other: { en: 'Other / Custom Symptoms', mr: 'इतर लक्षणे', hi: 'अन्य लक्षण' },
};

// Helper translation mapping for species
export const SPECIES_TRANSLATIONS: Record<string, { mr: string; hi: string; en: string }> = {
  Cow: { en: 'Cow', mr: 'गाय', hi: 'गाय' },
  Buffalo: { en: 'Buffalo', mr: 'म्हैस', hi: 'भैंस' },
  Goat: { en: 'Goat', mr: 'शेळी', hi: 'बकरी' },
  Sheep: { en: 'Sheep', mr: 'मेंढी', hi: 'भेड़' },
  Poultry: { en: 'Poultry', mr: 'कुक्कुटपालन', hi: 'पोल्ट्री' },
  Other: { en: 'Other', mr: 'इतर', hi: 'अन्य' },
  ALL: { en: 'All Species', mr: 'सर्व प्रजाती', hi: 'सभी प्रजातियां' },
};

export const getSymptomLabel = (symptom: string, lang: Language): string => {
  if (symptom.startsWith('Other:')) {
    const customPart = symptom.replace('Other:', '').trim();
    if (lang === 'mr') return `इतर लक्षणे: ${customPart}`;
    if (lang === 'hi') return `अन्य लक्षण: ${customPart}`;
    return `Other: ${customPart}`;
  }
  const match = SYMPTOM_TRANSLATIONS[symptom];
  if (match) {
    return match[lang] || match.en;
  }
  return symptom;
};

export const getSpeciesLabel = (species: string, lang: Language): string => {
  if (!species) return '';
  if (lang === 'en') return species;

  if (lang === 'mr') {
    if (/Gir Cow/i.test(species)) return 'गिर गाय';
    if (/Murrah Buffalo/i.test(species)) return 'मुऱ्हा म्हैस';
    if (/Cow/i.test(species)) return 'गाय';
    if (/Buffalo/i.test(species)) return 'म्हैस';
    if (/Goat/i.test(species)) return 'शेळी';
    if (/Sheep/i.test(species)) return 'मेंढी';
    if (/Poultry/i.test(species)) return 'कुक्कुटपालन';
    if (/Other/i.test(species)) return 'इतर';
  }
  if (lang === 'hi') {
    if (/Gir Cow/i.test(species)) return 'गीर गाय';
    if (/Murrah Buffalo/i.test(species)) return 'मुर्राह भैंस';
    if (/Cow/i.test(species)) return 'गाय';
    if (/Buffalo/i.test(species)) return 'भैंस';
    if (/Goat/i.test(species)) return 'बकरी';
    if (/Sheep/i.test(species)) return 'भेड़';
    if (/Poultry/i.test(species)) return 'पोल्ट्री';
    if (/Other/i.test(species)) return 'अन्य';
  }
  const match = SPECIES_TRANSLATIONS[species];
  if (match) {
    return match[lang] || match.en;
  }
  return species;
};

export const getStatusLabel = (status: string, lang: Language): string => {
  const norm = (status || '').toUpperCase().replace(/[\s-]+/g, '_');
  const keyMap: Record<string, string> = {
    HEALTHY: 'statusHealthy',
    SICK: 'statusSick',
    UNDER_OBSERVATION: 'statusUnderObservation',
    OBSERVATION: 'statusObservation',
    DECEASED: 'statusDeceased',
    SUBMITTED: 'statusSubmitted',
    UNDER_REVIEW: 'statusUnderReview',
    DIAGNOSED: 'statusDiagnosed',
    TREATMENT_STARTED: 'statusTreatmentStarted',
    RESOLVED: 'statusResolved',
    COMPLETED: 'statusCompleted',
    PENDING: 'statusPending',
    OVERDUE: 'statusOverdue',
    ASSIGNED: 'statusAssigned',
    COLLECTED: 'statusCollected',
    TESTING: 'statusTesting',
    UNDER_INVESTIGATION: 'statusUnderInvestigation',
    ESCALATED: 'statusEscalated',
    DETECTED: 'statusDetected',
    CONTAINED: 'statusContained',
    CONTAINMENT_ACTIVE: 'statusContainmentActive',
  };

  const key = keyMap[norm];
  if (key && translations[lang]?.[key]) {
    return translations[lang][key];
  }
  return status;
};

const BREED_TRANSLATION_MAP: Record<string, { mr: string; hi: string }> = {
  'Gir': { mr: 'गीर', hi: 'गीर' },
  'Sahiwal': { mr: 'साहिवाल', hi: 'साहिवाल' },
  'Khillari': { mr: 'खिलार', hi: 'खिलारी' },
  'Dangi': { mr: 'डांगी', hi: 'डांगी' },
  'Deoni': { mr: 'देवणी', hi: 'देवनी' },
  'Red Sindhi': { mr: 'लाल सिंधी', hi: 'लाल सिंधी' },
  'HF Crossbred': { mr: 'होल्स्टीन संकर', hi: 'एचएफ संकर' },
  'Jersey Cross': { mr: 'जर्सी संकर', hi: 'जर्सी संकर' },
  'Gaolao': { mr: 'गौळाऊ', hi: 'गौलाव' },
  'Tharparkar': { mr: 'थारपारकर', hi: 'थारपारकर' },
  'Murrah': { mr: 'मुऱ्हा', hi: 'मुर्राह' },
  'Pandharpuri': { mr: 'पंढरपुरी', hi: 'पंढरपुरी' },
  'Jaffarabadi': { mr: 'जाफराबादी', hi: 'जाफराबादी' },
  'Mehsana': { mr: 'मेहसाणा', hi: 'मेहसाणा' },
  'Nagpuri': { mr: 'नागपुरी', hi: 'नागपुरी' },
  'Surti': { mr: 'सुरती', hi: 'सुरती' },
  'Bhadawari': { mr: 'भदावरी', hi: 'भदावरी' },
  'Marathwadi': { mr: 'मराठवाडी', hi: 'मराठवाड़ी' },
  'Osmanabadi': { mr: 'उस्मानाबादी', hi: 'उस्मानाबादी' },
  'Sangamneri': { mr: 'संगमनेरी', hi: 'संगमनेरी' },
  'Berari': { mr: 'बेरारी', hi: 'बरारी' },
  'Sirohi': { mr: 'सिरोही', hi: 'सिरोही' },
  'Barbari': { mr: 'बरबरी', hi: 'बरबरी' },
  'Jamunapari': { mr: 'जमुनापारी', hi: 'जमुनापारी' },
  'Boer': { mr: 'बोअर', hi: 'बोअर' },
  'Konkan Kanyal': { mr: 'कोकण कन्याळ', hi: 'कोंकण कन्याल' },
  'Deccani': { mr: 'दख्खनी', hi: 'दक्कनी' },
  'Madgyal': { mr: 'माडग्याळ', hi: 'माडग्याल' },
  'Nellore': { mr: 'नेल्लोर', hi: 'नेल्लोर' },
  'Marwari': { mr: 'मारवाडी', hi: 'मारवाड़ी' },
  'Rambouillet Cross': { mr: 'रॅम्ब्युलेट संकर', hi: 'रैम्बुलेट क्रॉस' },
};

export const getBreedLabel = (breed: string, lang: Language): string => {
  if (!breed) return '';
  if (lang === 'mr') {
    const match = breed.match(/\(([\u0900-\u097F\s]+)\)/);
    if (match) return match[1].trim();
    const cleanBreed = breed.replace(/\s*\([\u0900-\u097F\s]+\)/g, '').trim();
    if (BREED_TRANSLATION_MAP[cleanBreed]?.mr) {
      return BREED_TRANSLATION_MAP[cleanBreed].mr;
    }
    if (breed.toLowerCase().includes('other') || breed.toLowerCase().includes('unknown')) {
      return 'इतर / माहिती नाही';
    }
  } else if (lang === 'hi') {
    const match = breed.match(/\(([\u0900-\u097F\s]+)\)/);
    if (match) return match[1].trim();
    const cleanBreed = breed.replace(/\s*\([\u0900-\u097F\s]+\)/g, '').trim();
    if (BREED_TRANSLATION_MAP[cleanBreed]?.hi) {
      return BREED_TRANSLATION_MAP[cleanBreed].hi;
    }
    if (breed.toLowerCase().includes('other') || breed.toLowerCase().includes('unknown')) {
      return 'अन्य / अज्ञात';
    }
  } else {
    const englishPart = breed.replace(/\s*\([\u0900-\u097F\s]+\)/g, '').trim();
    if (englishPart) return englishPart;
  }
  return breed;
};

export const getLocationLabel = (village?: string, district?: string, lang?: Language): string => {
  if (!village && !district) return '';
  if (lang === 'mr') {
    const locMap: Record<string, string> = {
      'Uruli Kanchan': 'उरुळी कांचन',
      'Haveli': 'हवेली',
      'Loni Kalbhor': 'लोणी काळभोर',
      'Pune': 'पुणे',
      'Satara': 'सातारा',
      'Ahmednagar': 'अहिल्यानगर',
      'Solapur': 'सोलापूर',
      'Nashik': 'नाशिक',
      'Kolhapur': 'कोल्हापूर',
      'Sangli': 'सांगली',
      'Aurangabad': 'छत्रपती संभाजीनगर',
      'Amravati': 'अमरावती',
      'Nagpur': 'नागपूर',
      'Baramati': 'बारामती',
    };
    const v = village ? locMap[village] || village : '';
    const d = district ? locMap[district] || district : '';
    if (v && d) return `${v}, ${d}`;
    return v || d;
  }
  if (village && district) return `${village}, ${district}`;
  return village || district || '';
};

export const getVaccineLabel = (vaccine: string, lang: Language): string => {
  if (!vaccine) return '';
  if (lang === 'mr') {
    if (vaccine.includes('FMD') || vaccine.toLowerCase().includes('foot and mouth')) return 'लाळ खुरकूत प्रतिबंधक लस (FMD)';
    if (vaccine.includes('LSD') || vaccine.toLowerCase().includes('lumpy') || vaccine.toLowerCase().includes('goat pox')) return 'लंपी त्वचा रोग लस (LSD / Goat Pox)';
    if (vaccine.includes('HS') || vaccine.toLowerCase().includes('haemorrhagic') || vaccine.toLowerCase().includes('ghatsarpa')) return 'घटसर्प लस (HS)';
    if (vaccine.includes('BQ') || vaccine.toLowerCase().includes('black quarter')) return 'फऱ्या प्रतिबंधक लस (BQ)';
    if (vaccine.toLowerCase().includes('anthrax')) return 'अँथ्रॅक्स प्रतिबंधक लस';
    if (vaccine.toLowerCase().includes('brucellosis')) return 'ब्रुसेलोसिस लस';
    if (vaccine.toLowerCase().includes('enterotoxemia') || vaccine.includes('ET')) return 'एन्टरोटॉक्सेमिया लस (ET)';
    if (vaccine.toLowerCase().includes('ppr')) return 'पीपीआर लस (PPR)';
    if (vaccine.toLowerCase().includes('ranikhet')) return 'राणीखेत लस (Ranikhet)';
  } else if (lang === 'hi') {
    if (vaccine.includes('FMD')) return 'खुरपका-मुंहपका टीका (FMD)';
    if (vaccine.includes('LSD')) return 'लम्पी त्वचा रोग टीका (LSD)';
    if (vaccine.includes('HS')) return 'गलघोंटू टीका (HS)';
    if (vaccine.includes('BQ')) return 'ब्लैक क्वार्टर टीका (BQ)';
    if (vaccine.toLowerCase().includes('anthrax')) return 'एंथ्रेक्स टीका';
  }
  return vaccine;
};

export const getDiseaseCategoryLabel = (category: string, lang: Language): string => {
  if (!category) return '';
  if (lang === 'mr') {
    if (category.includes('Foot and Mouth') || category.includes('FMD') || category.includes('लाळ')) return 'लाळ खुरकूत (FMD)';
    if (category.includes('Lumpy') || category.includes('LSD') || category.includes('लंपी')) return 'लंपी त्वचा रोग (LSD)';
    if (category.includes('Haemorrhagic') || category.includes('HS') || category.includes('घटसर्प')) return 'घटसर्प (HS)';
    if (category.includes('Black Quarter') || category.includes('BQ') || category.includes('फऱ्या')) return 'फऱ्या (BQ)';
    if (category.includes('Anthrax')) return 'अँथ्रॅक्स';
    if (category.includes('General') || category.includes('Disturbance')) return 'सामान्य शारीरिक अस्वस्थता';
  } else if (lang === 'hi') {
    if (category.includes('Foot and Mouth') || category.includes('FMD')) return 'खुरपका-मुंहपका (FMD)';
    if (category.includes('Lumpy') || category.includes('LSD')) return 'लम्पी त्वचा रोग (LSD)';
    if (category.includes('Haemorrhagic') || category.includes('HS')) return 'गलघोंटू (HS)';
  }
  return category;
};

export const getFacilityTypeLabel = (type: string, lang: Language): string => {
  if (!type) return '';
  const norm = type.toUpperCase();
  if (lang === 'mr') {
    if (norm.includes('POLYCLINIC')) return 'पशुवैद्यकीय चिकित्सालय';
    if (norm.includes('DISPENSARY')) return 'पशुवैद्यकीय दवाखाना';
    if (norm.includes('MVU') || norm.includes('MOBILE')) return 'फिरता पशुवैद्यक दवाखाना';
    if (norm.includes('HOSPITAL')) return 'पशुवैद्यकीय रुग्णालय';
  } else if (lang === 'hi') {
    if (norm.includes('POLYCLINIC')) return 'पशु चिकित्सालय';
    if (norm.includes('DISPENSARY')) return 'पशु औषधालय';
    if (norm.includes('MVU') || norm.includes('MOBILE')) return 'मोबाइल पशु चिकित्सा इकाई';
    if (norm.includes('HOSPITAL')) return 'पशु अस्पताल';
  }
  return type;
};

export const getSpeciesDefaultPhoto = (species?: string): string => {
  const s = (species || '').toLowerCase();
  if (s.includes('cow') || s.includes('गाय')) return '/images/animals/kapila.jpg';
  if (s.includes('buffalo') || s.includes('म्हैस')) return 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=600&auto=format&fit=crop';
  if (s.includes('goat') || s.includes('शेळी')) return 'https://images.unsplash.com/photo-1524024973431-2ad916746881?w=600&auto=format&fit=crop';
  if (s.includes('sheep') || s.includes('मेंढी')) return 'https://images.unsplash.com/photo-1484557052118-f32bd25b45b5?w=600&auto=format&fit=crop';
  if (s.includes('poultry') || s.includes('कुक्कुटपालन')) return 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=600&auto=format&fit=crop';
  return '/images/animals/kapila.jpg';
};

export const formatLocalizedDateString = (dateStr: string, lang: Language): string => {
  if (!dateStr) return '';
  if (lang === 'mr') {
    return dateStr
      .replace(/Jan(?:uary)?/gi, 'जानेवारी')
      .replace(/Feb(?:ruary)?/gi, 'फेब्रुवारी')
      .replace(/Mar(?:ch)?/gi, 'मार्च')
      .replace(/Apr(?:il)?/gi, 'एप्रिल')
      .replace(/May/gi, 'मे')
      .replace(/Jun(?:e)?/gi, 'जून')
      .replace(/Jul(?:y)?/gi, 'जुलै')
      .replace(/Aug(?:ust)?/gi, 'ऑगस्ट')
      .replace(/Sep(?:tember)?/gi, 'सप्टेंबर')
      .replace(/Oct(?:ober)?/gi, 'ऑक्टोबर')
      .replace(/Nov(?:ember)?/gi, 'नोव्हेंबर')
      .replace(/Dec(?:ember)?/gi, 'डिसेंबर');
  }
  if (lang === 'hi') {
    return dateStr
      .replace(/Jan(?:uary)?/gi, 'जनवरी')
      .replace(/Feb(?:ruary)?/gi, 'फरवरी')
      .replace(/Mar(?:ch)?/gi, 'मार्च')
      .replace(/Apr(?:il)?/gi, 'अप्रैल')
      .replace(/May/gi, 'मई')
      .replace(/Jun(?:e)?/gi, 'जून')
      .replace(/Jul(?:y)?/gi, 'जुलाई')
      .replace(/Aug(?:ust)?/gi, 'अगस्त')
      .replace(/Sep(?:tember)?/gi, 'सितंबर')
      .replace(/Oct(?:ober)?/gi, 'अक्टूबर')
      .replace(/Nov(?:ember)?/gi, 'नवंबर')
      .replace(/Dec(?:ember)?/gi, 'दिसंबर');
  }
  return dateStr;
};

export const getDiseaseLabel = (disease: string, lang: Language): string => {
  if (!disease) return '';
  if (lang === 'en') return disease;

  if (lang === 'mr') {
    if (/Acute Foot and Mouth Disease/i.test(disease)) return 'तीव्र लाळ खुरकूत रोग';
    if (/Foot and Mouth Disease|FMD/i.test(disease)) return 'लाळ खुरकूत रोग';
    if (/Lumpy Skin Disease|LSD/i.test(disease)) return 'लंपी त्वचा रोग';
    if (/Haemorrhagic Septicaemia|HS/i.test(disease)) return 'घटसर्प';
    if (/Black Quarter|BQ/i.test(disease)) return 'फऱ्या';
    if (/Anthrax/i.test(disease)) return 'अँथ्रॅक्स';
    if (/Brucellosis/i.test(disease)) return 'ब्रुसेलोसिस';
    if (/Enterotoxemia|ET/i.test(disease)) return 'एन्टरोटॉक्सेमिया (आंत्रविषार)';
    if (/PPR|Peste des petits/i.test(disease)) return 'पीपीआर';
    if (/Ranikhet/i.test(disease)) return 'राणीखेत रोग';
    if (/Infectious Disease/i.test(disease)) return 'संसर्गजन्य रोग';
    if (/Livestock Mortality/i.test(disease)) return 'पशुधन मृत्यू';
    return disease;
  }

  if (lang === 'hi') {
    if (/Acute Foot and Mouth Disease/i.test(disease)) return 'तीव्र खुरपका-मुंहपका रोग';
    if (/Foot and Mouth Disease|FMD/i.test(disease)) return 'खुरपका-मुंहपका रोग';
    if (/Lumpy Skin Disease|LSD/i.test(disease)) return 'लम्पी त्वचा रोग';
    if (/Haemorrhagic Septicaemia|HS/i.test(disease)) return 'गलघोंटू';
    if (/Black Quarter|BQ/i.test(disease)) return 'ब्लैक क्वार्टर';
    if (/Anthrax/i.test(disease)) return 'एंथ्रेक्स';
    if (/Brucellosis/i.test(disease)) return 'ब्रुसेलोसिस';
    return disease;
  }

  return disease;
};

export const getDistrictLabel = (district: string, lang: Language): string => {
  if (!district) return '';
  if (lang === 'en') return district;
  return getLocationLabel(undefined, district, lang) || district;
};

export const getNotificationCategoryLabel = (category: string, lang: Language): string => {
  if (!category) return '';
  const norm = (category || '').toUpperCase().trim();
  const keyMap: Record<string, string> = {
    OUTBREAK: 'notifCategoryOutbreak',
    CASE_UPDATE: 'notifCategoryCaseUpdate',
    VACCINE: 'notifCategoryVaccine',
    ALERT: 'notifCategoryAlert',
    ADVISORY: 'notifCategoryAdvisory',
  };
  const key = keyMap[norm];
  if (key && translations[lang]?.[key]) {
    return translations[lang][key];
  }
  return category;
};

export const getNotificationPriorityLabel = (priority: string, lang: Language): string => {
  if (!priority) return '';
  const norm = (priority || '').toUpperCase().trim();
  if (norm.includes('CRITICAL')) return translations[lang]?.priorityCritical || 'CRITICAL';
  if (norm.includes('HIGH')) return translations[lang]?.priorityHigh || 'HIGH';
  if (norm.includes('UPDATE')) return translations[lang]?.priorityUpdate || 'UPDATE';
  if (norm.includes('INFO')) return translations[lang]?.priorityInfo || 'INFO';
  if (norm.includes('VACCIN')) return translations[lang]?.priorityVaccination || 'VACCINATION';
  if (norm.includes('ADVISORY')) return translations[lang]?.priorityAdvisory || 'ADVISORY';
  return priority;
};

// Known static notification text translations mapped by ID
const NOTIFICATION_ID_MAP: Record<string, { mr: { title: string; message: string }; hi: { title: string; message: string } }> = {
  'notif-01': {
    mr: {
      title: '🚨 अत्यंत गंभीर: लाळ खुरकूत रोगाचा उद्रेक समूह',
      message: 'हवेली तालुक्यात (उरुळी कांचन) लाळ खुरकूत रोगाचा उद्रेक आढळला आहे. आजारी पशुधन वेगळे ठेवा आणि अनिवार्य रिंग लसीकरण करून घ्या.',
    },
    hi: {
      title: '🚨 अत्यंत गंभीर: खुरपका-मुंहपका रोग प्रकोप समूह',
      message: 'हवेली ब्लॉक (उरुली कांचन) में एफएमडी प्रकोप का पता चला है। बीमार पशुओं को अलग रखें और अनिवार्य रिंग टीकाकरण करवाएं।',
    },
  },
  'notif-02': {
    mr: {
      title: '📋 गौरी (गिर गाय) साठी पशुवैद्यकीय निदान उपलब्ध',
      message: 'डॉ. अनिकेत कुलकर्णी यांनी निदान पूर्ण केले आहे: तीव्र लाळ खुरकूत रोग. लिहून दिलेली औषधे आणि उपचाराचे वेळापत्रक पहा.',
    },
    hi: {
      title: '📋 गौरी (गीर गाय) के लिए पशु चिकित्सा निदान उपलब्ध',
      message: 'डॉ. अनिकेत कुलकर्णी ने निदान पूरा कर लिया है: तीव्र खुरपका-मुंहपका रोग। निर्धारित दवाएं और उपचार कार्यक्रम देखें।',
    },
  },
  'notif-03': {
    mr: {
      title: '💉 बूस्टर लसीकरणाची आठवण',
      message: 'लक्ष्मी (मुऱ्हा म्हैस) हिचे लाळ खुरकूत रोगाचे सहामाही बूस्टर लसीकरण 15-एप्रिल-2026 रोजी देय आहे.',
    },
    hi: {
      title: '💉 बूस्टर टीकाकरण अनुस्मारक',
      message: 'लक्ष्मी (मुर्राह भैंस) का 15-अप्रैल-2026 को छह महीने का एफएमडी बूस्टर टीकाकरण देय है।',
    },
  },
  'notif-04': {
    mr: {
      title: '🔬 प्रयोगशाळेतील नमुना पॉझिटिव्ह आढळला (SMP-2026-0001)',
      message: 'डीआयएस औंध (DIS Aundh) द्वारे गाय गौरीमध्ये एफएमडी सेरोटाइप ओ साठी आरटी-पीसीआर पॉझिटिव्ह निश्चित झाले आहे. उद्रेक प्रतिबंधात्मक नियमावली सुरू केली आहे.',
    },
    hi: {
      title: '🔬 प्रयोगशाला नमूना पॉजिटिव पाया गया (SMP-2026-0001)',
      message: 'डीआईएस औंध द्वारा गाय गौरी में एफएमडी सीरोटाइप ओ के लिए आरटी-पीसीआर पॉजिटिव की पुष्टि की गई। प्रकोप प्रोटोकॉल शुरू किया गया।',
    },
  },
  'notif-05': {
    mr: {
      title: '🌐 उद्रेक प्रतिबंधात्मक नियंत्रण कक्ष सक्रिय',
      message: 'हवेली ब्लॉक लाळ खुरकूत रोग प्रतिबंधक सीमा स्थापित केली आहे. फिरते जलद प्रतिसाद पथक #3 तैनात केले आहे.',
    },
    hi: {
      title: '🌐 प्रकोप रोकथाम क्षेत्र सक्रिय',
      message: 'हवेली ब्लॉक एफएमडी रोकथाम क्षेत्र स्थापित किया गया। मोबाइल त्वरित प्रतिक्रिया इकाई #3 तैनात की गई।',
    },
  },
};

export const getNotificationTitle = (notif: { id?: string; title?: string; message?: string; type?: string }, lang: Language): string => {
  if (!notif || !notif.title) return '';
  if (lang === 'en') return notif.title;

  // 1. Exact ID match from standard notifications
  if (notif.id && NOTIFICATION_ID_MAP[notif.id]?.[lang]?.title) {
    return NOTIFICATION_ID_MAP[notif.id][lang].title;
  }

  const title = notif.title;

  if (lang === 'mr') {
    if (/Foot and Mouth Disease Outbreak Cluster/i.test(title)) {
      return '🚨 अत्यंत गंभीर: लाळ खुरकूत रोगाचा उद्रेक समूह';
    }
    if (/Booster Vaccination Due Reminder/i.test(title)) {
      return '💉 बूस्टर लसीकरणाची आठवण';
    }
    if (/Outbreak Containment Zone Activated/i.test(title)) {
      return '🌐 उद्रेक प्रतिबंधात्मक नियंत्रण कक्ष सक्रिय';
    }
    if (/Veterinary Diagnosis Available for\s+(.+?)\s*\((.+?)\)/i.test(title)) {
      const match = title.match(/Veterinary Diagnosis Available for\s+(.+?)\s*\((.+?)\)/i);
      if (match) {
        const name = match[1].trim();
        const sp = getSpeciesLabel(match[2].trim(), 'mr');
        return `📋 ${name} (${sp}) साठी पशुवैद्यकीय निदान उपलब्ध`;
      }
    }
    if (/Veterinary Diagnosis Available/i.test(title)) {
      return '📋 पशुवैद्यकीय निदान उपलब्ध';
    }
    if (/Lab Sample Confirmed POSITIVE\s*\((.+?)\)/i.test(title)) {
      const match = title.match(/Lab Sample Confirmed POSITIVE\s*\((.+?)\)/i);
      return `🔬 प्रयोगशाळेतील नमुना पॉझिटिव्ह आढळला (${match ? match[1] : ''})`;
    }
    if (/Lab Sample Confirmed POSITIVE/i.test(title)) {
      return '🔬 प्रयोगशाळेतील नमुना पॉझिटिव्ह आढळला';
    }
    if (/LAB CONFIRMATION:\s*Positive Result for\s*(.+)/i.test(title)) {
      const match = title.match(/LAB CONFIRMATION:\s*Positive Result for\s*(.+)/i);
      return `🔬 प्रयोगशाळा पुष्टीकरण: ${match ? match[1] : ''} साठी पॉझिटिव्ह निकाल`;
    }
    if (/OUTBREAK DETECTED:\s*(.+?),\s*(.+)/i.test(title)) {
      const match = title.match(/OUTBREAK DETECTED:\s*(.+?),\s*(.+)/i);
      const v = match ? getLocationLabel(match[1].trim(), undefined, 'mr') : '';
      const b = match ? getLocationLabel(undefined, match[2].trim(), 'mr') : '';
      return `🚨 रोग उद्रेक आढळला: ${v}, ${b}`;
    }
    if (/Veterinarian Assigned to Your Case/i.test(title)) {
      return '👨‍⚕️ आपल्या केससाठी पशुवैद्यकीय अधिकारी नियुक्त';
    }
    if (/New Treatment Prescribed/i.test(title)) {
      return '💊 नवीन औषधोपचार लिहून दिला';
    }
    if (/Case Resolved — Animal Recovered/i.test(title)) {
      return '✅ केस पूर्ण झाली — पशू बरा झाला';
    }
    if (/CASE ESCALATED BY VETERINARIAN/i.test(title)) {
      return '🚨 पशुवैद्यकीय डॉक्टरांनी केस वरिष्ठ पातळीवर पाठवली';
    }
    if (/High Risk Case Alert:\s*(.+?)\s*\((.+?),\s*(.+?)\)/i.test(title)) {
      const match = title.match(/High Risk Case Alert:\s*(.+?)\s*\((.+?),\s*(.+?)\)/i);
      if (match) {
        return `🚨 उच्च जोखीम केस सतर्कता: ${match[1]} (${getLocationLabel(match[2].trim(), match[3].trim(), 'mr')})`;
      }
    }
    if (/(?:CRITICAL|HIGH)\s*HEALTH RISK:\s*(.+)/i.test(title)) {
      const isCrit = /CRITICAL/i.test(title);
      const match = title.match(/(?:CRITICAL|HIGH)\s*HEALTH RISK:\s*(.+)/i);
      const animalPart = match
        ? match[1]
            .replace(/Gir Cow/gi, 'गिर गाय')
            .replace(/Murrah Buffalo/gi, 'मुऱ्हा म्हैस')
            .replace(/\bCow\b/gi, 'गाय')
            .replace(/\bBuffalo\b/gi, 'म्हैस')
            .replace(/\bGoat\b/gi, 'शेळी')
            .replace(/\bSheep\b/gi, 'मेंढी')
        : '';
      return `⚠️ ${isCrit ? 'अत्यंत गंभीर' : 'उच्च'} आरोग्य जोखीम: ${animalPart}`;
    }
    if (/MORTALITY REPORTED:\s*(.+?),\s*(.+)/i.test(title)) {
      const match = title.match(/MORTALITY REPORTED:\s*(.+?),\s*(.+)/i);
      if (match) {
        return `⚠️ पशू मृत्यूची नोंद: ${getLocationLabel(match[1].trim(), match[2].trim(), 'mr')}`;
      }
    }
    if (/(\w+)\s*ADVISORY:\s*(.+)/i.test(title)) {
      const match = title.match(/(\w+)\s*ADVISORY:\s*(.+)/i);
      if (match) {
        const sev = /CRITICAL|URGENT/i.test(match[1]) ? 'अत्यंत तातडीची' : 'महत्त्वाची';
        return `📢 ${sev} शासकीय सूचना: ${match[2]}`;
      }
    }

    // Generic word replacements for any other notification title:
    return title
      .replace(/CRITICAL:/gi, 'अत्यंत गंभीर:')
      .replace(/HIGH:/gi, 'उच्च:')
      .replace(/Foot and Mouth Disease|FMD/gi, 'लाळ खुरकूत रोग')
      .replace(/Lumpy Skin Disease|LSD/gi, 'लंपी त्वचा रोग')
      .replace(/Outbreak Cluster/gi, 'उद्रेक समूह')
      .replace(/Outbreak/gi, 'उद्रेक')
      .replace(/Veterinary Diagnosis Available/gi, 'पशुवैद्यकीय निदान उपलब्ध')
      .replace(/Diagnosis Available/gi, 'निदान उपलब्ध')
      .replace(/Diagnosis/gi, 'निदान')
      .replace(/Booster Vaccination Due Reminder/gi, 'बूस्टर लसीकरणाची आठवण')
      .replace(/Vaccination Due Reminder/gi, 'लसीकरणाची आठवण')
      .replace(/Vaccination/gi, 'लसीकरण')
      .replace(/Booster/gi, 'बूस्टर')
      .replace(/Reminder/gi, 'आठवण')
      .replace(/Lab Sample Confirmed POSITIVE/gi, 'प्रयोगशाळेतील नमुना पॉझिटिव्ह आढळला')
      .replace(/Confirmed POSITIVE/gi, 'पॉझिटिव्ह निश्चित')
      .replace(/POSITIVE/g, 'पॉझिटिव्ह')
      .replace(/Lab Sample/gi, 'प्रयोगशाळा नमुना')
      .replace(/Gir Cow/gi, 'गिर गाय')
      .replace(/Murrah Buffalo/gi, 'मुऱ्हा म्हैस')
      .replace(/\bCow\b/gi, 'गाय')
      .replace(/\bBuffalo\b/gi, 'म्हैस')
      .replace(/\bGoat\b/gi, 'शेळी')
      .replace(/\bSheep\b/gi, 'मेंढी')
      .replace(/Disease/gi, 'रोग');
  }

  if (lang === 'hi') {
    if (/Foot and Mouth Disease Outbreak Cluster/i.test(title)) {
      return '🚨 अत्यंत गंभीर: खुरपका-मुंहपका रोग प्रकोप समूह';
    }
    if (/Booster Vaccination Due Reminder/i.test(title)) {
      return '💉 बूस्टर टीकाकरण अनुस्मारक';
    }
    if (/Outbreak Containment Zone Activated/i.test(title)) {
      return '🌐 प्रकोप नियंत्रण क्षेत्र सक्रिय';
    }
    if (/Veterinary Diagnosis Available for\s+(.+?)\s*\((.+?)\)/i.test(title)) {
      const match = title.match(/Veterinary Diagnosis Available for\s+(.+?)\s*\((.+?)\)/i);
      if (match) {
        const name = match[1].trim();
        const sp = getSpeciesLabel(match[2].trim(), 'hi');
        return `📋 ${name} (${sp}) के लिए पशु चिकित्सा निदान उपलब्ध`;
      }
    }
    if (/Veterinary Diagnosis Available/i.test(title)) {
      return '📋 पशु चिकित्सा निदान उपलब्ध';
    }
    if (/Lab Sample Confirmed POSITIVE\s*\((.+?)\)/i.test(title)) {
      const match = title.match(/Lab Sample Confirmed POSITIVE\s*\((.+?)\)/i);
      return `🔬 प्रयोगशाला नमूना पॉजिटिव पाया गया (${match ? match[1] : ''})`;
    }
    if (/Veterinarian Assigned to Your Case/i.test(title)) {
      return '👨‍⚕️ आपके केस के लिए पशु चिकित्सक नियुक्त';
    }
    if (/New Treatment Prescribed/i.test(title)) {
      return '💊 नया उपचार निर्धारित किया गया';
    }
    if (/Case Resolved — Animal Recovered/i.test(title)) {
      return '✅ केस पूर्ण — पशु स्वस्थ हुआ';
    }
    return title;
  }

  return title;
};

export const getNotificationDescription = (notif: { id?: string; title?: string; message?: string; type?: string }, lang: Language): string => {
  if (!notif || !notif.message) return '';
  if (lang === 'en') return notif.message;

  // 1. Exact ID match from standard notifications
  if (notif.id && NOTIFICATION_ID_MAP[notif.id]?.[lang]?.message) {
    return NOTIFICATION_ID_MAP[notif.id][lang].message;
  }

  const msg = notif.message;

  if (lang === 'mr') {
    if (/Urgent FMD cluster detected in Haveli block \(Uruli Kanchan\)/i.test(msg)) {
      return 'हवेली तालुक्यात (उरुळी कांचन) लाळ खुरकूत रोगाचा उद्रेक आढळला आहे. आजारी पशुधन वेगळे ठेवा आणि अनिवार्य रिंग लसीकरण करून घ्या.';
    }
    if (/Dr\.\s*Aniket Kulkarni has completed diagnosis:\s*Acute Foot and Mouth Disease/i.test(msg)) {
      return 'डॉ. अनिकेत कुलकर्णी यांनी निदान पूर्ण केले आहे: तीव्र लाळ खुरकूत रोग. लिहून दिलेली औषधे आणि उपचाराचे वेळापत्रक पहा.';
    }
    if (/Lakshmi\s*\(Murrah Buffalo\)\s*is due for biannual FMD booster dose on\s*15-Apr-2026/i.test(msg)) {
      return 'लक्ष्मी (मुऱ्हा म्हैस) हिचे लाळ खुरकूत रोगाचे सहामाही बूस्टर लसीकरण 15-एप्रिल-2026 रोजी देय आहे.';
    }
    if (/DIS Aundh confirmed RT-PCR positive for FMD Serotype O in Cow Gauri/i.test(msg)) {
      return 'डीआयएस औंध (DIS Aundh) द्वारे गाय गौरीमध्ये एफएमडी सेरोटाइप ओ साठी आरटी-पीसीआर पॉझिटिव्ह निश्चित झाले आहे. उद्रेक प्रतिबंधात्मक नियमावली सुरू केली आहे.';
    }
    if (/Haveli block FMD containment perimeter established/i.test(msg)) {
      return 'हवेली तालुका लाळ खुरकूत रोग प्रतिबंधक सीमा स्थापित केली आहे. फिरते जलद प्रतिसाद पथक #3 तैनात केले आहे.';
    }

    // Dynamic pattern: Booster vaccination due
    const boosterMatch = msg.match(/^(.+?)\s*\((.+?)\)\s*is due for\s+(?:biannual|annual)?\s*(.+?)\s*booster dose on\s*(.+?)\.?$/i);
    if (boosterMatch) {
      const name = boosterMatch[1].trim();
      const sp = getSpeciesLabel(boosterMatch[2].trim(), 'mr');
      const dis = getDiseaseLabel(boosterMatch[3].trim(), 'mr');
      const dateStr = formatLocalizedDateString(boosterMatch[4].trim(), 'mr');
      return `${name} (${sp}) हिचे ${dis}चे बूस्टर लसीकरण ${dateStr} रोजी देय आहे.`;
    }

    // Dynamic pattern: Diagnosis completed
    const diagMatch = msg.match(/Dr\.\s*(.+?)\s*has completed diagnosis:\s*(.+?)\.\s*View prescribed medicines and treatment schedule\./i);
    if (diagMatch) {
      const doc = diagMatch[1].trim();
      const dis = getDiseaseLabel(diagMatch[2].trim(), 'mr');
      return `डॉ. ${doc} यांनी निदान पूर्ण केले आहे: ${dis}. लिहून दिलेली औषधे आणि उपचाराचे वेळापत्रक पहा.`;
    }

    // Dynamic pattern: Clinical evaluation
    const evalMatch = msg.match(/Dr\.\s*(.+?)\s*has completed clinical evaluation:\s*(.+?)\.\s*Review recommended management steps\./i);
    if (evalMatch) {
      const doc = evalMatch[1].trim();
      const dis = getDiseaseLabel(evalMatch[2].trim(), 'mr');
      return `डॉ. ${doc} यांनी वैद्यकीय मूल्यमापन पूर्ण केले आहे: ${dis}. शिफारस केलेल्या व्यवस्थापन पायऱ्या तपासा.`;
    }

    // Dynamic pattern: Vet accepted health report
    const acceptMatch = msg.match(/Dr\.\s*(.+?)\s*has accepted your health report and is reviewing the case\./i);
    if (acceptMatch) {
      return `डॉ. ${acceptMatch[1].trim()} यांनी आपला आरोग्य अहवाल स्वीकारला असून ते केस तपासत आहेत.`;
    }

    // Dynamic pattern: E-prescription issued
    const rxMatch = msg.match(/Dr\.\s*(.+?)\s*has issued an e-prescription for your animal\.\s*View medicines, dosage and instructions now\./i);
    if (rxMatch) {
      return `डॉ. ${rxMatch[1].trim()} यांनी आपल्या पशूसाठी ई-प्रिस्क्रिप्शन दिले आहे. औषधे, प्रमाण आणि सूचना आता पहा.`;
    }

    // Dynamic pattern: Case resolved
    const resolvedMatch = msg.match(/Dr\.\s*(.+?)\s*has marked your case as resolved\.\s*Keep continuing routine care\./i);
    if (resolvedMatch) {
      return `डॉ. ${resolvedMatch[1].trim()} यांनी आपली केस पूर्ण (Resolved) म्हणून चिन्हांकित केली आहे. नेहमीची काळजी सुरू ठेवा.`;
    }

    // Dynamic pattern: Urgent cluster detected in block
    const clusterBlockMatch = msg.match(/Urgent\s+(.+?)\s+cluster detected in\s+(.+?)\s+block\s+\((.+?)\)\.\s*Quarantine sick livestock and accept mandatory ring vaccination\./i);
    if (clusterBlockMatch) {
      const dis = getDiseaseLabel(clusterBlockMatch[1].trim(), 'mr');
      const blk = getLocationLabel(undefined, clusterBlockMatch[2].trim(), 'mr');
      const vil = getLocationLabel(clusterBlockMatch[3].trim(), undefined, 'mr');
      return `${blk} तालुक्यात (${vil}) ${dis}चा उद्रेक आढळला आहे. आजारी पशुधन वेगळे ठेवा आणि अनिवार्य रिंग लसीकरण करून घ्या.`;
    }

    // Dynamic pattern: Disease cluster detected (cases & deaths)
    const outbreakMatch = msg.match(/Disease cluster detected:\s*(\d+)\s*cases,\s*(\d+)\s*deaths reported within 7 days in\s*(.+?),\s*(.+?)\.\s*Priority veterinary investigation required\./i);
    if (outbreakMatch) {
      const loc = getLocationLabel(outbreakMatch[3].trim(), outbreakMatch[4].trim(), 'mr');
      return `${loc} येथे 7 दिवसांत रोगाचा समूह: ${outbreakMatch[1]} केसेस, ${outbreakMatch[2]} मृत्यू नोंदवले गेले आहेत. प्राधान्याने पशुवैद्यकीय तपासणी आवश्यक आहे.`;
    }

    // Dynamic pattern: Sample tested POSITIVE
    const sampleMatch = msg.match(/Sample\s*(.+?)\s*tested POSITIVE for\s*(.+?)\.\s*Location:\s*(.+?),\s*(.+?)\./i);
    if (sampleMatch) {
      const code = sampleMatch[1].trim();
      const dis = getDiseaseLabel(sampleMatch[2].trim(), 'mr');
      const loc = getLocationLabel(sampleMatch[3].trim(), sampleMatch[4].trim(), 'mr');
      return `नमुना ${code} ${dis} साठी पॉझिटिव्ह आढळला. ठिकाण: ${loc}.`;
    }

    // Dynamic pattern: Risk categorization
    const riskMatch = msg.match(/Your animal has been categorized as\s*(.+?)\s*risk\s*\((.+?)\)\.\s*Urgent veterinary isolation recommended\./i);
    if (riskMatch) {
      const rk = /CRITICAL/i.test(riskMatch[1]) ? 'अत्यंत गंभीर' : 'उच्च';
      const dis = getDiseaseLabel(riskMatch[2].trim(), 'mr');
      return `आपल्या पशूचे ${rk} जोखीम (${dis}) म्हणून वर्गीकरण केले गेले आहे. तातडीने पशुवैद्यकीय विलगीकरण करण्याचा सल्ला दिला आहे.`;
    }

    // Dynamic pattern: Animal death recorded
    const deathMatch = msg.match(/Animal death recorded for\s*(.+?)\s*\((.+?)\)\.\s*(\d+)\s*other animals reportedly sick\./i);
    if (deathMatch) {
      const code = deathMatch[1].trim();
      const sp = getSpeciesLabel(deathMatch[2].trim(), 'mr');
      return `${code} (${sp}) साठी पशू मृत्यूची नोंद झाली आहे. इतर ${deathMatch[3]} जनावरे आजारी असल्याचे नोंदवले आहे.`;
    }

    // Dynamic pattern: Case escalated
    const escMatch = msg.match(/Dr\.\s*(.+?)\s*has escalated Case\s*(.+?)\s*in\s*(.+?),\s*(.+?)\.\s*High-risk containment review needed\./i);
    if (escMatch) {
      const doc = escMatch[1].trim();
      const code = escMatch[2].trim();
      const loc = getLocationLabel(escMatch[3].trim(), escMatch[4].trim(), 'mr');
      return `डॉ. ${doc} यांनी ${loc} मधील केस ${code} वरिष्ठ पातळीवर पाठवली आहे. उच्च जोखीम नियंत्रण आढावा आवश्यक आहे.`;
    }

    // Fallback word/phrase replacements if any untranslated text remains:
    return msg
      .replace(/Urgent FMD cluster detected in Haveli block \(Uruli Kanchan\)/gi, 'हवेली तालुक्यात (उरुळी कांचन) लाळ खुरकूत रोगाचा उद्रेक आढळला आहे')
      .replace(/Quarantine sick livestock and accept mandatory ring vaccination\./gi, 'आजारी पशुधन वेगळे ठेवा आणि अनिवार्य रिंग लसीकरण करून घ्या.')
      .replace(/View prescribed medicines and treatment schedule\./gi, 'लिहून दिलेली औषधे आणि उपचाराचे वेळापत्रक पहा.')
      .replace(/is due for biannual FMD booster dose on/gi, 'हिचे लाळ खुरकूत रोगाचे सहामाही बूस्टर लसीकरण देय आहे:')
      .replace(/Outbreak protocol initiated\./gi, 'उद्रेक प्रतिबंधात्मक नियमावली सुरू केली आहे.')
      .replace(/Mobile Rapid Response Unit #3 deployed\./gi, 'फिरते जलद प्रतिसाद पथक #3 तैनात केले आहे.')
      .replace(/Foot and Mouth Disease|FMD/gi, 'लाळ खुरकूत रोग')
      .replace(/Acute Foot and Mouth Disease/gi, 'तीव्र लाळ खुरकूत रोग')
      .replace(/Lumpy Skin Disease|LSD/gi, 'लंपी त्वचा रोग')
      .replace(/Gir Cow/gi, 'गिर गाय')
      .replace(/Murrah Buffalo/gi, 'मुऱ्हा म्हैस')
      .replace(/\bCow\b/gi, 'गाय')
      .replace(/\bBuffalo\b/gi, 'म्हैस')
      .replace(/\bGoat\b/gi, 'शेळी')
      .replace(/\bSheep\b/gi, 'मेंढी')
      .replace(/tested POSITIVE/gi, 'पॉझिटिव्ह आढळला')
      .replace(/confirmed RT-PCR positive/gi, 'आरटी-पीसीआर पॉझिटिव्ह निश्चित झाले')
      .replace(/POSITIVE/g, 'पॉझिटिव्ह')
      .replace(/15-Apr-2026/g, '15-एप्रिल-2026');
  }

  if (lang === 'hi') {
    if (/Urgent FMD cluster detected in Haveli block/i.test(msg)) {
      return 'हवेली ब्लॉक (उरुली कांचन) में एफएमडी प्रकोप का पता चला है। बीमार पशुओं को अलग रखें और अनिवार्य रिंग टीकाकरण करवाएं।';
    }
    if (/Dr\.\s*Aniket Kulkarni has completed diagnosis/i.test(msg)) {
      return 'डॉ. अनिकेत कुलकर्णी ने निदान पूरा कर लिया है: तीव्र खुरपका-मुंहपका रोग। निर्धारित दवाएं और उपचार कार्यक्रम देखें।';
    }
    if (/Lakshmi\s*\(Murrah Buffalo\)\s*is due for/i.test(msg)) {
      return 'लक्ष्मी (मुर्राह भैंस) का 15-अप्रैल-2026 को छह महीने का एफएमडी बूस्टर टीकाकरण देय है।';
    }
    return msg;
  }

  return msg;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('pashusetu_lang') as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('pashusetu_lang', lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
