import { PackagingAnalysis } from '../../types/packaging';

export type ProductStateType = 'Fresh' | 'Processed' | 'Dried' | 'Frozen' | 'Liquid' | 'Powder' | 'Ready-to-Eat';
export type RespirationType = 'Active' | 'Dormant' | 'None' | 'Suspended';
export type MatchStatusType =
  | 'AI Identification: Verified'
  | 'AI Identification: High Match'
  | 'Please verify the identified product';

export type ApplicationType = 'storage' | 'transportation' | 'retail' | 'export';
export type StorageConditionType = 'ambient' | 'chilled' | 'frozen';
export type TransitDistanceType = 'local' | 'regional' | 'long_distance';
export type ShelfLifeUnitType = 'Days' | 'Weeks' | 'Months' | 'Years';

export interface IdentifiedFoodProfile {
  name: string;
  category: string;
  foodGroup: string;
  productState: ProductStateType;
  respiration: RespirationType;
  matchStatus: MatchStatusType;
  backendCategory: PackagingAnalysis['category'];
  thumbnailType: PackagingAnalysis['thumbnailType'];
}

export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';

export interface FoodRiskItem {
  level: RiskLevel;
  explanation: string;
}

export interface FoodRiskProfileData {
  moistureSensitivity: FoodRiskItem;
  oxygenSensitivity: FoodRiskItem;
  respiration: FoodRiskItem;
  microbialRisk: FoodRiskItem;
  packagingImplication: string;
}

export type RequirementLevel = 'HIGH' | 'MEDIUM' | 'LOW';
export type GasPermeabilityType = 'CONTROLLED' | 'RESTRICTED' | 'HIGH EXCHANGE';
export type StrengthType = 'HIGH' | 'MEDIUM' | 'STANDARD';
export type SealabilityType = 'HIGH' | 'STANDARD';
export type MapType = 'SUITABLE' | 'OPTIONAL' | 'NOT REQUIRED';

export interface PackagingRequirementsData {
  oxygenBarrier: {
    level: RequirementLevel;
    explanation: string;
  };
  moistureBarrier: {
    level: RequirementLevel;
    explanation: string;
  };
  gasPermeability: {
    level: GasPermeabilityType;
    explanation: string;
  };
  mechanicalStrength: {
    level: StrengthType;
    explanation: string;
  };
  sealability: {
    level: SealabilityType;
    explanation: string;
  };
  mapSuitability: {
    level: MapType;
    explanation: string;
  };
  reasoning: string;
}

export interface PackagingLayer {
  name: string;
  type: string;
  role: string;
  thickness: string;
}

export interface RequirementComparisonItem {
  requirement: string;
  requiredLevel: string;
  packagingPerformance: string;
  status: 'match' | 'partial' | 'no_match';
  note?: string;
}

export interface PackagingAlternativeItem {
  id: string;
  name: string;
  structure: string;
  match: 'High' | 'Medium' | 'Partial';
  description: string;
  pros: string[];
  cons: string[];
  otr: string;
  wvtr: string;
  thickness: string;
  recyclability: string;
  estimatedCost: string;
}

export interface PackagingSolutionData {
  primaryStructure: string;
  primaryStructureShort: string;
  compatibilityLevel: 'High' | 'Medium' | 'Partial';
  statusExplanation: string;
  layers: PackagingLayer[];
  reasons: string[];
  requirementMatches: RequirementComparisonItem[];
  specifications: {
    otr: { value: string; unit: string; tooltip: string; targetRange: string };
    wvtr: { value: string; unit: string; tooltip: string; targetRange: string };
    thickness: { value: string; tooltip: string; targetRange: string };
    sealability: { value: string; tooltip: string };
    mechanicalStrength: { value: string; tooltip: string };
    gasPermeability: { value: string; tooltip: string };
    mapSuitability: { value: string; tooltip: string; gasMixRecommendation?: string };
  };
  alternatives: PackagingAlternativeItem[];
  sustainableAlternative: {
    name: string;
    structure: string;
    match: 'High' | 'Medium' | 'Partial';
    whyConsider: string;
    tradeoffs: string;
    materialType: string;
    recyclability: string;
  };
  estimatedCost: {
    costPerPackage: string;
    materialCostRange: string;
    basis: string;
  };
  sustainability: {
    recyclability: string;
    materialType: string;
    materialUsage: string;
    calculationBasis: string;
  };
  shelfLifeImpact: {
    targetShelfLife: string;
    expectedImpact: 'Positive' | 'Neutral' | 'Requires Validation';
    explanation: string;
  };
  decisionChain: {
    food: string;
    foodRiskSummary: string;
    packagingRequirementsSummary: string;
    databaseCandidates: string;
    matchingMethod: string;
    recommendationSummary: string;
  };
}

export type AnalysisStage =
  | 'identifying'
  | 'analyzing_storage'
  | 'analyzing_transport'
  | 'building_risk_profile'
  | 'completed'
  | 'error';
