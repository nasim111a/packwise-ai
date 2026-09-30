import {
  RecommendationInput,
  CompatibilityEvaluation,
  runRecommendationRules,
} from '../data/recommendationRules';
import { FoodRecord, lookupFoodInDatabase, GENERIC_FOOD_PROFILE } from '../data/foodDatabase';
import { PackagingSolutionData, FoodRiskProfileData, PackagingRequirementsData } from '../components/analysis/types';

export interface RecommendationResult {
  status: 'success' | 'fallback' | 'error';
  engineType: string;
  isAITrained: boolean;
  modelNotice: string;
  food: FoodRecord;
  riskProfile: FoodRiskProfileData;
  requirements: PackagingRequirementsData;
  recommendation: PackagingSolutionData;
  candidates: CompatibilityEvaluation[];
  // Backwards compatible aliases
  foodRiskProfile: FoodRiskProfileData;
  packagingRequirements: PackagingRequirementsData;
  packagingSolution: PackagingSolutionData;
  isGenericFallback: boolean;
  generationDurationMs: number;
}

/**
 * RecommendationEngine Interface
 * Allows seamless modular swap between RuleBasedRecommendationEngine and a future trained MLRecommendationEngine.
 */
export interface RecommendationEngine {
  readonly engineName: string;
  readonly isAITrained: boolean;
  generateRecommendation(input: RecommendationInput): Promise<RecommendationResult>;
  generateSync(input: RecommendationInput): RecommendationResult;
}

/**
 * Deterministic Rule-Based Implementation
 * Powered by local Seeded Food Knowledge Base + Packaging Material Database + Compatibility Rules.
 */
export class RuleBasedRecommendationEngine implements RecommendationEngine {
  readonly engineName = 'Local Seeded Knowledge Base & Rule Engine';
  readonly isAITrained = false;

  private simulateDelayMs: number;

  constructor(simulateDelayMs = 900) {
    this.simulateDelayMs = simulateDelayMs;
  }

  /**
   * Synchronously evaluates food and packaging parameters without any blocking, external network, or AI APIs.
   * Guaranteed to always return a valid result or safe fallback.
   */
  generateSync(input: RecommendationInput): RecommendationResult {
    const start = performance.now();

    try {
      const result = runRecommendationRules(input);

      const foodRiskProfile: FoodRiskProfileData = {
        moistureSensitivity: {
          level: result.food.characteristics.moistureSensitivity.toUpperCase() as any,
          explanation: `${result.food.name} has ${result.food.characteristics.moistureSensitivity.toLowerCase()} sensitivity to moisture ingress and transpiration.`,
        },
        oxygenSensitivity: {
          level: result.food.characteristics.oxygenSensitivity.toUpperCase() as any,
          explanation: `${result.food.characteristics.oxygenSensitivity} sensitivity to oxidative deterioration and flavor degradation.`,
        },
        respiration: {
          level: (result.food.state === 'Fresh' ? result.food.characteristics.respiration.toUpperCase() : 'NONE') as any,
          explanation: result.food.state === 'Fresh'
            ? `Active post-harvest cellular respiration (${result.food.characteristics.respiration.toLowerCase()} rate).`
            : 'Processed shelf-stable matrix with zero active respiration.',
        },
        microbialRisk: {
          level: result.food.characteristics.microbialRisk.toUpperCase() as any,
          explanation: `Microbial vulnerability rated ${result.food.characteristics.microbialRisk.toLowerCase()} based on commodity moisture and neutral pH.`,
        },
        packagingImplication: result.food.explanationNotes,
      };

      const packagingRequirements: PackagingRequirementsData = {
        oxygenBarrier: {
          level: result.requirements.requiredOxygenBarrier.toUpperCase() as any,
          explanation: `Oxygen barrier calibrated to prevent lipid rancidity, browning, and quality loss for ${input.shelfLife.value} ${input.shelfLife.unit}.`,
        },
        moistureBarrier: {
          level: result.requirements.requiredMoistureBarrier.toUpperCase() as any,
          explanation: `Moisture barrier engineered to maintain target water activity and prevent condensation or staling under ${input.storage.type} conditions.`,
        },
        gasPermeability: {
          level: result.requirements.requiredGasPermeability.toUpperCase() as any,
          explanation: `Permeability tuned to match ${result.food.characteristics.respiration.toLowerCase()} respiration kinetics.`,
        },
        mechanicalStrength: {
          level: result.requirements.requiredMechanicalStrength.toUpperCase() as any,
          explanation: `Mechanical durability configured for ${input.transportation.distance.replace('_', ' ')} logistics and distribution stress.`,
        },
        sealability: {
          level: result.requirements.requiredSealability.toUpperCase() as any,
          explanation: 'Hermetic thermal seal required to preserve package integrity and prevent leakages.',
        },
        mapSuitability: {
          level: result.requirements.requiredMap ? 'SUITABLE' : 'NOT REQUIRED',
          explanation: result.requirements.requiredMap
            ? 'Compatible with modified atmosphere packaging (MAP) gas flush retention.'
            : 'Standard air headspace sufficient for target application.',
        },
        reasoning: result.requirements.reasoning.join(' '),
      };

      const end = performance.now();

      return {
        status: result.isGenericFallback ? 'fallback' : 'success',
        engineType: 'Rule-Based Knowledge Engine',
        isAITrained: false,
        modelNotice: result.isGenericFallback
          ? 'Preliminary recommendation based on generic packaging requirements. Validation required before commercial deployment.'
          : 'Deterministically generated from verified local food & packaging material database.',
        food: result.food,
        riskProfile: foodRiskProfile,
        requirements: packagingRequirements,
        recommendation: result.solution,
        candidates: result.allEvaluations,
        foodRiskProfile,
        packagingRequirements,
        packagingSolution: result.solution,
        isGenericFallback: result.isGenericFallback,
        generationDurationMs: Math.round(end - start),
      };
    } catch (err) {
      console.error('Deterministic engine error, safely generating fallback:', err);
      // Guarantee loading reset / return fallback rather than hanging
      const fallbackResult = runRecommendationRules({
        ...input,
        product: 'Generic Commodity',
      });
      const end = performance.now();

      const genericRisk: FoodRiskProfileData = {
        moistureSensitivity: { level: 'MEDIUM', explanation: 'Generic baseline moisture sensitivity.' },
        oxygenSensitivity: { level: 'MEDIUM', explanation: 'Generic baseline oxygen sensitivity.' },
        respiration: { level: 'NONE', explanation: 'Generic baseline profile with no active respiration.' },
        microbialRisk: { level: 'MEDIUM', explanation: 'Standard microbial risk control.' },
        packagingImplication: 'Preliminary recommendation based on generic packaging requirements. Validation required.',
      };

      const genericReqs: PackagingRequirementsData = {
        oxygenBarrier: { level: 'MEDIUM', explanation: 'Standard medium oxygen barrier.' },
        moistureBarrier: { level: 'MEDIUM', explanation: 'Standard medium moisture barrier.' },
        gasPermeability: { level: 'CONTROLLED', explanation: 'Controlled gas exchange.' },
        mechanicalStrength: { level: 'MEDIUM', explanation: 'Standard distribution mechanical durability.' },
        sealability: { level: 'HIGH', explanation: 'Standard hermetic seal.' },
        mapSuitability: { level: 'NOT REQUIRED', explanation: 'Air headspace standard.' },
        reasoning: 'Generic food profile fallback.',
      };

      return {
        status: 'fallback',
        engineType: 'Rule-Based Knowledge Engine',
        isAITrained: false,
        modelNotice: 'Preliminary recommendation based on generic packaging requirements. Validation required.',
        food: GENERIC_FOOD_PROFILE,
        riskProfile: genericRisk,
        requirements: genericReqs,
        recommendation: fallbackResult.solution,
        candidates: fallbackResult.allEvaluations,
        foodRiskProfile: genericRisk,
        packagingRequirements: genericReqs,
        packagingSolution: fallbackResult.solution,
        isGenericFallback: true,
        generationDurationMs: Math.round(end - start),
      };
    }
  }

  /**
   * Asynchronous execution with controlled, finite simulated delay (if desired)
   * Guaranteed to resolve and NEVER hang or run in an infinite loop!
   */
  async generateRecommendation(input: RecommendationInput): Promise<RecommendationResult> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.generateSync(input));
      }, this.simulateDelayMs);
    });
  }
}

// Singleton exported instance
export const recommendationEngineInstance = new RuleBasedRecommendationEngine(950);

/**
 * Top-level deterministic matching function conforming to STEP 3 & 4
 * Completely synchronous, local, and offline. Never waits for an AI API.
 */
export function generatePackagingRecommendation(
  input: RecommendationInput
): RecommendationResult {
  return recommendationEngineInstance.generateSync(input);
}

/**
 * Quick synchronous helper alias
 */
export function generatePackagingRecommendationSync(
  input: RecommendationInput
): RecommendationResult {
  return recommendationEngineInstance.generateSync(input);
}

/**
 * Asynchronous helper with short non-blocking timer
 */
export async function generatePackagingRecommendationAsync(
  input: RecommendationInput
): Promise<RecommendationResult> {
  return recommendationEngineInstance.generateRecommendation(input);
}

/**
 * Helper to check whether a commodity exists in the local knowledge base
 */
export function checkFoodInLocalDatabase(name: string): { exists: boolean; matchedName?: string } {
  const { record, isGenericFallback } = lookupFoodInDatabase(name);
  if (!isGenericFallback) {
    return { exists: true, matchedName: record.name };
  }
  return { exists: false };
}

