import { PackagingAnalysis } from '../../types/packaging';
import {
  ProductStateType,
  RespirationType,
  IdentifiedFoodProfile,
  FoodRiskProfileData,
  PackagingRequirementsData,
  PackagingSolutionData,
  StorageConditionType,
  TransitDistanceType,
  ShelfLifeUnitType,
} from './types';
import {
  FOOD_DATABASE,
  lookupFoodInDatabase,
  GENERIC_FOOD_PROFILE,
  FoodRecord,
} from '../../data/foodDatabase';
import {
  runRecommendationRules,
  evaluateOperationalRequirements,
} from '../../data/recommendationRules';

export const QUICK_COMMODITIES = [
  'Mango',
  'Apple',
  'Tomato',
  'Potato Chips',
  'Rice',
  'Milk',
  'Paneer',
  'Chicken',
  'Coffee',
  'Nuts',
];

// Compatibility dictionary populated from FOOD_DATABASE
export const FOOD_KNOWLEDGE_BASE: Record<string, Omit<IdentifiedFoodProfile, 'name'>> = {};
for (const food of FOOD_DATABASE) {
  const resp: RespirationType =
    food.characteristics.respiration === 'High' || food.characteristics.respiration === 'Medium'
      ? 'Active'
      : food.characteristics.respiration === 'Low'
      ? 'Dormant'
      : 'None';

  const entry: Omit<IdentifiedFoodProfile, 'name'> = {
    category: food.category,
    foodGroup: food.foodGroup,
    productState: food.state,
    respiration: resp,
    matchStatus: 'AI Identification: Verified',
    backendCategory: food.backendCategory,
    thumbnailType: food.thumbnailType,
  };

  FOOD_KNOWLEDGE_BASE[food.name.toLowerCase()] = entry;
  for (const alias of food.aliases) {
    FOOD_KNOWLEDGE_BASE[alias.toLowerCase()] = entry;
  }
}

/**
 * Derives food profile from input name using local seed database
 */
export function deriveFoodProfile(inputName: string): IdentifiedFoodProfile {
  const clean = inputName.trim();
  if (!clean) {
    return {
      name: '',
      category: '',
      foodGroup: '',
      productState: 'Fresh',
      respiration: 'None',
      matchStatus: 'Please verify the identified product',
      backendCategory: 'Fruits & Vegetables',
      thumbnailType: 'apple',
    };
  }

  const { record, isGenericFallback } = lookupFoodInDatabase(clean);

  const resp: RespirationType =
    record.characteristics.respiration === 'High' || record.characteristics.respiration === 'Medium'
      ? 'Active'
      : record.characteristics.respiration === 'Low'
      ? 'Dormant'
      : 'None';

  return {
    name: isGenericFallback ? clean : record.name,
    category: record.category,
    foodGroup: record.foodGroup,
    productState: record.state,
    respiration: resp,
    matchStatus: isGenericFallback
      ? 'Please verify the identified product'
      : 'AI Identification: Verified',
    backendCategory: record.backendCategory,
    thumbnailType: record.thumbnailType,
  };
}

/**
 * Derives food risk profile deterministically from food database characteristics
 */
export function deriveFoodRiskProfile(
  commodity: string,
  _category: string,
  _productState: ProductStateType,
  storageCondition: StorageConditionType,
  _shelfLifeDays: number,
  _transitDistance: TransitDistanceType
): FoodRiskProfileData {
  const { record } = lookupFoodInDatabase(commodity);

  return {
    moistureSensitivity: {
      level: record.characteristics.moistureSensitivity.toUpperCase() as any,
      explanation: `${record.name} exhibits ${record.characteristics.moistureSensitivity.toLowerCase()} sensitivity to moisture ingress, transpiration, or desiccation under ${storageCondition} holding.`,
    },
    oxygenSensitivity: {
      level: record.characteristics.oxygenSensitivity.toUpperCase() as any,
      explanation: `${record.characteristics.oxygenSensitivity} sensitivity to oxidative deterioration, nutrient degradation, and lipid auto-oxidation.`,
    },
    respiration: {
      level: (record.state === 'Fresh' ? record.characteristics.respiration.toUpperCase() : 'NONE') as any,
      explanation:
        record.state === 'Fresh'
          ? `Active post-harvest cellular respiration (${record.characteristics.respiration.toLowerCase()} rate) requiring balanced gas permeation.`
          : 'Processed or dried shelf-stable matrix with zero active cellular respiration.',
    },
    microbialRisk: {
      level: record.characteristics.microbialRisk.toUpperCase() as any,
      explanation: `Microbial vulnerability rated ${record.characteristics.microbialRisk.toLowerCase()} based on commodity moisture content and storage conditions.`,
    },
    packagingImplication: record.explanationNotes,
  };
}

/**
 * Derives packaging requirements deterministically from operational rule engine
 */
export function derivePackagingRequirements(
  commodity: string,
  _category: string,
  _productState: ProductStateType,
  _respiration: RespirationType,
  storageCondition: StorageConditionType,
  shelfLifeNumber: number,
  shelfLifeUnit: ShelfLifeUnitType,
  transitDistance: TransitDistanceType,
  _riskProfile: FoodRiskProfileData
): PackagingRequirementsData {
  const { record } = lookupFoodInDatabase(commodity);

  const opReqs = evaluateOperationalRequirements(record, {
    product: commodity,
    application: {
      storage: true,
      transportation: true,
      retail: false,
      export: transitDistance === 'long_distance',
    },
    storage: { type: storageCondition },
    shelfLife: {
      value: shelfLifeNumber,
      unit: (shelfLifeUnit.toLowerCase() as any) || 'days',
    },
    transportation: { distance: transitDistance },
  });

  return {
    oxygenBarrier: {
      level: opReqs.requiredOxygenBarrier.toUpperCase() as any,
      explanation: `Oxygen barrier calibrated to prevent lipid rancidity, browning, and quality loss over ${shelfLifeNumber} ${shelfLifeUnit}.`,
    },
    moistureBarrier: {
      level: opReqs.requiredMoistureBarrier.toUpperCase() as any,
      explanation: `Moisture barrier engineered to maintain target water activity and prevent condensation or staling under ${storageCondition} conditions.`,
    },
    gasPermeability: {
      level: opReqs.requiredGasPermeability.toUpperCase() as any,
      explanation: `Permeability tuned to match ${record.characteristics.respiration.toLowerCase()} respiration kinetics.`,
    },
    mechanicalStrength: {
      level: opReqs.requiredMechanicalStrength.toUpperCase() as any,
      explanation: `Mechanical durability configured for ${transitDistance.replace('_', ' ')} logistics and distribution stress.`,
    },
    sealability: {
      level: opReqs.requiredSealability.toUpperCase() as any,
      explanation: 'Hermetic thermal seal required to preserve package integrity and prevent leakages.',
    },
    mapSuitability: {
      level: opReqs.requiredMap ? 'SUITABLE' : 'NOT REQUIRED',
      explanation: opReqs.requiredMap
        ? 'Compatible with modified atmosphere packaging (MAP) gas flush retention.'
        : 'Standard air headspace sufficient for target application.',
    },
    reasoning: opReqs.reasoning.join(' '),
  };
}

/**
 * Derives packaging solution deterministically from rule-based matching engine
 */
export function derivePackagingSolution(
  commodity: string,
  _category: PackagingAnalysis['category'],
  _productState: ProductStateType,
  _respiration: RespirationType,
  storageCondition: StorageConditionType,
  shelfLifeNumber: number,
  shelfLifeUnit: ShelfLifeUnitType,
  transitDistance: TransitDistanceType,
  _foodRiskProfile: FoodRiskProfileData,
  _packagingRequirements: PackagingRequirementsData
): PackagingSolutionData {
  const result = runRecommendationRules({
    product: commodity,
    application: {
      storage: true,
      transportation: true,
      retail: false,
      export: transitDistance === 'long_distance',
    },
    storage: { type: storageCondition },
    shelfLife: {
      value: shelfLifeNumber,
      unit: (shelfLifeUnit.toLowerCase() as any) || 'days',
    },
    transportation: { distance: transitDistance },
  });

  return result.solution;
}
