import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    appTitle: 'PashuSetu',
    appSubtitle: 'Smart Livestock Health Surveillance & Early Warning System',
    tagline: 'Connecting Livestock, Farmers & Veterinary Care',
    govtHeader: 'Government of Maharashtra • Department of Animal Husbandry',
    sihStatement: 'SIH Problem Statement: 6128',
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
    totalAnimals: 'Total Livestock',
    healthyAnimals: 'Healthy',
    sickAnimals: 'Sick Animals',
    underObservation: 'Under Observation',
    activeReports: 'Active Reports',
    vaccinationCoverage: 'Vaccination Coverage',
    myLivestock: 'My Livestock',
    addAnimal: 'Add Livestock',
    reportSymptoms: 'Report Symptoms',
    reportDeath: 'Report Mortality',
    myReports: 'My Reports',
    vaccinations: 'Vaccinations',
    treatments: 'Treatments',
    nearbyVets: 'Nearby Veterinary Care',
    alerts: 'Alerts & Advisories',
    riskAssessment: 'Automated Risk Assessment — Decision Support',
    riskDisclaimer:
      'Notice: This assessment is an automated epidemiological decision-support tool. Final diagnosis and prescriptions must be confirmed by a certified veterinarian.',
    riskLow: 'Low Risk',
    riskMedium: 'Medium Risk',
    riskHigh: 'High Risk',
    riskCritical: 'Critical Risk',
    submit: 'Submit',
    cancel: 'Cancel',
    save: 'Save',
    offlineNotice: 'You are currently offline. Reports will be saved locally and synced once internet connection is restored.',
    syncPending: 'Sync Pending Reports',
  },
  mr: {
    appTitle: 'पशुसेतू (PashuSetu)',
    appSubtitle: 'स्मार्ट पशु आरोग्य पाळत व पूर्वसूचना प्रणाली',
    tagline: 'पशुधन, शेतकरी आणि पशुवैद्यकीय सेवांना जोडणारा डिजिटल सेतू',
    govtHeader: 'महाराष्ट्र शासन • पशुसंवर्धन विभाग',
    sihStatement: 'SIH समस्या विधान: ६१२८',
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
    totalAnimals: 'एकूण पशुधन',
    healthyAnimals: 'निरोगी जनावरे',
    sickAnimals: 'आजारी जनावरे',
    underObservation: 'निरीक्षणाखाली',
    activeReports: 'सक्रिय तक्रारी',
    vaccinationCoverage: 'लसीकरण टक्केवारी',
    myLivestock: 'माझे पशुधन',
    addAnimal: 'नवीन जनावर जोडा',
    reportSymptoms: 'आजाराची लक्षणे नोंदवा',
    reportDeath: 'मृत्यू नोंदवा',
    myReports: 'माझे अहवाल',
    vaccinations: 'लसीकरण',
    treatments: 'औषधोपचार',
    nearbyVets: 'जवळचे पशुवैद्यक दवाखाने',
    alerts: 'सूचना व इशारे',
    riskAssessment: 'स्वयंचलित जोखीम मूल्यमापन — निर्णय साहाय्य',
    riskDisclaimer:
      'महत्त्वाची सूचना: हे मूल्यमापन केवळ निर्णय-साहाय्यक प्रणाली आहे. अंतिम रोगनिदान व औषधोपचार अधिकृत पशुवैद्यकीय डॉक्टरांकडूनच निश्चित केले जावे.',
    riskLow: 'कमी जोखीम',
    riskMedium: 'मध्यम जोखीम',
    riskHigh: 'उच्च जोखीम',
    riskCritical: 'अत्यंत गंभीर जोखीम',
    submit: 'दाखल करा',
    cancel: 'रद्द करा',
    save: 'जतन करा',
    offlineNotice: 'तुम्ही सध्या ऑफलाइन आहात. माहिती स्थानिक पातळीवर सुरक्षित ठेवली जाईल व इंटरनेट आल्यावर आपोआप पाठवली जाईल.',
    syncPending: 'प्रलंबित अहवाल पाठवा',
  },
  hi: {
    appTitle: 'पशुसेतु (PashuSetu)',
    appSubtitle: 'स्मार्ट पशु स्वास्थ्य निगरानी एवं पूर्व चेतावनी प्रणाली',
    tagline: 'पशुधन, किसान और पशु चिकित्सा सेवा का डिजिटल सेतु',
    govtHeader: 'महाराष्ट्र शासन • पशुपालन विभाग',
    sihStatement: 'SIH समस्या कथन: 6128',
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
    totalAnimals: 'कुल पशुधन',
    healthyAnimals: 'स्वस्थ पशु',
    sickAnimals: 'बीमार पशु',
    underObservation: 'निगरानी में',
    activeReports: 'सक्रिय रिपोर्ट',
    vaccinationCoverage: 'टीकाकरण कवरेज',
    myLivestock: 'मेरा पशुधन',
    addAnimal: 'नया पशु जोड़ें',
    reportSymptoms: 'लक्षण रिपोर्ट करें',
    reportDeath: 'मृत्यु दर्ज करें',
    myReports: 'मेरी रिपोर्ट',
    vaccinations: 'टीकाकरण',
    treatments: 'उपचार',
    nearbyVets: 'निकटतम पशु चिकित्सालय',
    alerts: 'अलर्ट एवं परामर्श',
    riskAssessment: 'स्वचालित जोखिम मूल्यांकन — निर्णय सहायता',
    riskDisclaimer:
      'महत्वपूर्ण सूचना: यह जोखिम मूल्यांकन केवल निर्णय सहायता हेतु है। अंतिम निदान व उपचार पंजीकृत पशु चिकित्सक द्वारा ही मान्य होगा।',
    riskLow: 'कम जोखिम',
    riskMedium: 'मध्यम जोखिम',
    riskHigh: 'उच्च जोखिम',
    riskCritical: 'गंभीर जोखिम',
    submit: 'जमा करें',
    cancel: 'रद्द करें',
    save: 'सहेजें',
    offlineNotice: 'आप ऑफ़लाइन हैं। रिपोर्ट स्थानीय रूप से सुरक्षित रहेगी और इंटरनेट आने पर स्वचालित रूप से सिंक होगी।',
    syncPending: 'लंबित रिपोर्ट सिंक करें',
  },
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
