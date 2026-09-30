export type AnalysisStatus = 'Completed' | 'In Progress' | 'Draft';

export interface PackagingAnalysis {
  id: string;
  product: string;
  category: 'Fruits & Vegetables' | 'Grains & Pulses' | 'Dairy Products' | 'Bakery & Snacks' | 'Meat & Poultry' | 'Others';
  status: AnalysisStatus;
  date: string;
  recommendedMaterial: string;
  secondaryMaterial?: string;
  shelfLifeGain: string;
  sustainabilityRating: number; // 1-100
  wvtRate: string; // Water Vapor Transmission Rate
  otRate: string; // Oxygen Transmission Rate
  storageCondition: string;
  transitMethod: string;
  targetShelfLife: string;
  co2Reduction: string;
  mapGasMix?: string;
  notes?: string;
  thumbnailType: 'tomato' | 'rice' | 'milk' | 'potato' | 'apple' | 'grain' | 'meat' | 'bread';
}

export interface FoodProfile {
  id: string;
  name: string;
  category: string;
  waterActivity: number | string;
  respirationRate: 'Very Low' | 'Low' | 'Moderate' | 'High' | 'Extremely High';
  ethyleneSensitivity: 'Low' | 'Medium' | 'High';
  optimalTemp: string;
  optimalRH: string;
  keyDegradationFactors: string[];
  recommendedPackagingMethod: string;
  source?: 'system' | 'user';
  description?: string;
  packagingConsiderations?: string;
  advancedData?: {
    waterActivity?: string;
    pH?: string;
    moistureContentPercent?: string;
    respirationRateNumerical?: string;
    otrRequirement?: string;
    wvtrRequirement?: string;
  };
}

export interface PackagingMaterialInfo {
  id: string;
  name: string;
  type: 'Bio-Polymer' | 'Multilayer Barrier' | 'Recycled Plastic' | 'Cellulose / Paper' | 'Rigid Polymer';
  sharePercentage: number;
  recyclability: string;
  biodegradability: string;
  otrBarrier: string;
  wvtrBarrier: string;
  tensileStrength: string;
  co2Footprint: string;
  typicalUses: string[];
}
