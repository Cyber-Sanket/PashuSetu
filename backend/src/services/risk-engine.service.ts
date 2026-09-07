export interface RiskEngineInput {
  species: string;
  symptoms: string[];
  durationDays: number;
  severity: 'Mild' | 'Moderate' | 'Severe' | string;
  temperatureF?: number | null;
  appetiteStatus: 'Normal' | 'Reduced' | 'None' | string;
  milkProductionChange: 'None' | 'Slight Drop' | 'Severe Drop' | string;
  isHerdAffected?: boolean;
}

export interface RiskEngineOutput {
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  possibleCategory: string;
  riskFactors: string[];
  recommendedAction: string;
  disclaimer: string;
  matchedDiseaseProfiles: {
    diseaseName: string;
    confidence: 'High' | 'Moderate' | 'Possible';
    description: string;
  }[];
}

export class RiskEngineService {
  public static assess(input: RiskEngineInput): RiskEngineOutput {
    let score = 0;
    const riskFactors: string[] = [];
    const lowerSymptoms = (input.symptoms || []).map((s) => s.toLowerCase());

    // 1. Core Symptom Weights
    // Severe / Sentinel Symptoms
    if (lowerSymptoms.some((s) => s.includes('difficulty breathing') || s.includes('breathing') || s.includes('respiratory'))) {
      score += 25;
      riskFactors.push('Respiratory distress detected (+25)');
    }
    if (lowerSymptoms.some((s) => s.includes('skin lesion') || s.includes('lesion') || s.includes('nodule') || s.includes('blister'))) {
      score += 25;
      riskFactors.push('Cutaneous lesions / vesicles present (+25)');
    }
    if (lowerSymptoms.some((s) => s.includes('fever') || s.includes('high temperature'))) {
      score += 15;
      riskFactors.push('Elevated body temperature / fever (+15)');
    }
    if (lowerSymptoms.some((s) => s.includes('salivation') || s.includes('drooling') || s.includes('mouth ulcer'))) {
      score += 20;
      riskFactors.push('Excessive salivation / oral ulceration (+20)');
    }
    if (lowerSymptoms.some((s) => s.includes('lameness') || s.includes('limping') || s.includes('hoof'))) {
      score += 15;
      riskFactors.push('Locomotive impairment / hoof lesions (+15)');
    }
    if (lowerSymptoms.some((s) => s.includes('swelling') || s.includes('throat') || s.includes('neck'))) {
      score += 20;
      riskFactors.push('Oedema / throat or muscular swelling (+20)');
    }
    if (lowerSymptoms.some((s) => s.includes('diarrhea') || s.includes('loose stool'))) {
      score += 15;
      riskFactors.push('Gastrointestinal distress / diarrhea (+15)');
    }
    if (lowerSymptoms.some((s) => s.includes('nasal discharge') || s.includes('eye discharge'))) {
      score += 10;
      riskFactors.push('Mucopurulent ocular / nasal discharge (+10)');
    }
    if (lowerSymptoms.some((s) => s.includes('abnormal behavior') || s.includes('tremor') || s.includes('convulsion'))) {
      score += 25;
      riskFactors.push('Neurological involvement / tremors (+25)');
    }

    // 2. Objective Temperature Check
    if (input.temperatureF) {
      if (input.temperatureF >= 104) {
        score += 20;
        riskFactors.push(`High fever reading (${input.temperatureF}°F) (+20)`);
      } else if (input.temperatureF >= 102.5) {
        score += 10;
        riskFactors.push(`Moderate fever reading (${input.temperatureF}°F) (+10)`);
      }
    }

    // 3. Clinical Severity Multipliers
    if (input.severity === 'Severe') {
      score += 15;
      riskFactors.push('Farmer reported clinical severity: Severe (+15)');
    } else if (input.severity === 'Moderate') {
      score += 8;
      riskFactors.push('Farmer reported clinical severity: Moderate (+8)');
    }

    // 4. Appetite & Milk Production
    if (input.appetiteStatus === 'None') {
      score += 12;
      riskFactors.push('Complete anorexia (refusal to feed) (+12)');
    } else if (input.appetiteStatus === 'Reduced') {
      score += 5;
    }

    if (input.milkProductionChange === 'Severe Drop') {
      score += 15;
      riskFactors.push('Acute drop in milk yield (>50%) (+15)');
    } else if (input.milkProductionChange === 'Slight Drop') {
      score += 5;
    }

    // 5. Chronicity / Duration
    if (input.durationDays >= 4) {
      score += 10;
      riskFactors.push(`Prolonged symptom duration (${input.durationDays} days) (+10)`);
    } else if (input.durationDays >= 2) {
      score += 5;
    }

    // 6. Herd Multiplier
    if (input.isHerdAffected) {
      score += 20;
      riskFactors.push('Multiple animals in proximity affected (+20)');
    }

    // Cap score at 100
    score = Math.min(100, Math.max(5, score));

    // Determine Risk Level
    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    if (score <= 30) {
      riskLevel = 'LOW';
    } else if (score <= 60) {
      riskLevel = 'MEDIUM';
    } else if (score <= 80) {
      riskLevel = 'HIGH';
    } else {
      riskLevel = 'CRITICAL';
    }

    // 7. Disease Pattern Matching
    const matchedDiseaseProfiles: {
      diseaseName: string;
      confidence: 'High' | 'Moderate' | 'Possible';
      description: string;
    }[] = [];

    const hasFever = lowerSymptoms.some((s) => s.includes('fever')) || (input.temperatureF && input.temperatureF >= 102.5);
    const hasBreathing = lowerSymptoms.some((s) => s.includes('breathing') || s.includes('respiratory'));
    const hasLesions = lowerSymptoms.some((s) => s.includes('skin lesion') || s.includes('nodule'));
    const hasMouthHoof = lowerSymptoms.some((s) => s.includes('salivation') || s.includes('drooling') || s.includes('mouth') || s.includes('lameness') || s.includes('blister'));
    const hasSwelling = lowerSymptoms.some((s) => s.includes('swelling') || s.includes('throat') || s.includes('neck'));
    const hasDiarrhea = lowerSymptoms.some((s) => s.includes('diarrhea'));

    // Check Foot and Mouth Disease (FMD)
    if (hasMouthHoof && (hasFever || input.milkProductionChange === 'Severe Drop')) {
      matchedDiseaseProfiles.push({
        diseaseName: 'Foot and Mouth Disease (FMD) / लाळ खुरकूत',
        confidence: hasMouthHoof && hasFever ? 'High' : 'Moderate',
        description: 'Vesicular lesions on feet, muzzle, and oral mucosa with hypersalivation and sudden drop in milk yield.',
      });
    }

    // Check Lumpy Skin Disease (LSD)
    if (hasLesions && (hasFever || lowerSymptoms.some((s) => s.includes('discharge')))) {
      matchedDiseaseProfiles.push({
        diseaseName: 'Lumpy Skin Disease (LSD) / लंपी त्वचा रोग',
        confidence: hasLesions && hasFever ? 'High' : 'Moderate',
        description: 'Circumscribed cutaneous nodules, fever, ocular and nasal discharge, and enlarged superficial lymph nodes.',
      });
    }

    // Check Haemorrhagic Septicaemia (HS) / घटसर्प
    if (hasBreathing && hasSwelling) {
      matchedDiseaseProfiles.push({
        diseaseName: 'Haemorrhagic Septicaemia (HS) / घटसर्प',
        confidence: hasFever ? 'High' : 'Moderate',
        description: 'Rapid onset of severe respiratory distress, high pyrexia, and submandibular oedema (swollen neck/brisket).',
      });
    }

    // Check Black Quarter (BQ) / फऱ्या
    if (lowerSymptoms.some((s) => s.includes('lameness')) && hasSwelling && hasFever) {
      matchedDiseaseProfiles.push({
        diseaseName: 'Black Quarter (BQ) / फऱ्या रोग',
        confidence: 'Moderate',
        description: 'Crepitant swelling over muscular regions (shoulder, hindquarters) accompanied by severe lameness and acute toxemia.',
      });
    }

    // Check Mastitis / स्तनदाह
    if (input.species.toLowerCase().includes('cow') || input.species.toLowerCase().includes('buffalo')) {
      if (lowerSymptoms.some((s) => s.includes('udder') || s.includes('milk')) || (input.milkProductionChange === 'Severe Drop' && hasFever)) {
        matchedDiseaseProfiles.push({
          diseaseName: 'Bovine Mastitis / स्तनदाह (कासदाह)',
          confidence: 'Possible',
          description: 'Inflammation of the mammary gland with abnormal milk secretion and localized heat or pain.',
        });
      }
    }

    // Check PPR (Peste des Petits Ruminants) for sheep/goat
    if ((input.species.toLowerCase().includes('goat') || input.species.toLowerCase().includes('sheep')) && hasDiarrhea && hasFever) {
      matchedDiseaseProfiles.push({
        diseaseName: 'Peste des Petits Ruminants (PPR) / शेळ्या-मेंढ्यांमधील देवी',
        confidence: 'Moderate',
        description: 'High fever, ulcerative stomatitis, catarrhal discharge, and severe enteritis with watery diarrhea.',
      });
    }

    // Possible Category Description
    let possibleCategory = 'General Febrile / Systemic Disturbance';
    if (matchedDiseaseProfiles.length > 0) {
      possibleCategory = matchedDiseaseProfiles[0].diseaseName;
    } else if (riskLevel === 'CRITICAL' || riskLevel === 'HIGH') {
      possibleCategory = 'Suspected Acute Infectious Livestock Disease';
    } else if (riskLevel === 'MEDIUM') {
      possibleCategory = 'Sub-acute Health Anomaly Under Observation';
    } else {
      possibleCategory = 'Mild Routine Symptom / Low Risk';
    }

    // Recommended Action
    let recommendedAction = '';
    if (riskLevel === 'CRITICAL') {
      recommendedAction =
        'URGENT: Immediately isolate the affected animal away from the herd. Avoid community grazing or water troughs. Contact local Veterinary Officer or Mobile Veterinary Clinic immediately. Do not administer unprescribed antibiotics.';
    } else if (riskLevel === 'HIGH') {
      recommendedAction =
        'HIGH PRIORITY: Quarantine animal in clean, sheltered premises. Provide clean drinking water and soft forage. Schedule an on-site veterinary inspection within 12-24 hours. Monitor herd for similar symptoms.';
    } else if (riskLevel === 'MEDIUM') {
      recommendedAction =
        'MODERATE CONCERN: Keep under close observation for the next 24 hours. Record rectal temperature twice daily. Notify local Livestock Development Officer (LDO) if appetite or milk yield decreases further.';
    } else {
      recommendedAction =
        'LOW RISK: Continue routine observation, maintain shed hygiene, ensure balanced green fodder and clean water. If symptoms persist beyond 48 hours, seek veterinary guidance.';
    }

    return {
      riskScore: score,
      riskLevel,
      possibleCategory,
      riskFactors,
      recommendedAction,
      disclaimer:
        'NOTICE: This assessment is an automated epidemiological decision-support tool. It does NOT replace certified veterinary diagnosis. Final diagnosis and treatment must be authorized by a registered veterinarian.',
      matchedDiseaseProfiles,
    };
  }
}
