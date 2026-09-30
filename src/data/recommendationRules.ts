import { FoodRecord, lookupFoodInDatabase } from './foodDatabase';
import {
  PackagingMaterialRecord,
  PACKAGING_MATERIALS_DATABASE,
  getMaterialById,
  BarrierLevel,
} from './packagingMaterials';
import {
  RequirementComparisonItem,
  PackagingAlternativeItem,
  PackagingSolutionData,
} from '../components/analysis/types';

export interface RecommendationInput {
  product: string;
  application: {
    storage: boolean;
    transportation: boolean;
    retail: boolean;
    export: boolean;
  };
  storage: {
    type: 'ambient' | 'chilled' | 'frozen';
    temperature?: string;
    humidity?: string;
  };
  shelfLife: {
    value: number;
    unit: 'days' | 'weeks' | 'months' | 'years';
  };
  transportation: {
    distance: 'local' | 'regional' | 'long_distance';
  };
}

export interface CompatibilityEvaluation {
  material: PackagingMaterialRecord;
  score: number;
  matchLevel: 'High' | 'Partial' | 'Low' | 'Not Suitable';
  matches: RequirementComparisonItem[];
  mismatchReasons: string[];
}

/**
 * Normalizes shelf life input into standard days for threshold evaluations
 */
export function convertToDays(val: number, unit: 'days' | 'weeks' | 'months' | 'years'): number {
  switch (unit) {
    case 'weeks':
      return val * 7;
    case 'months':
      return val * 30;
    case 'years':
      return val * 365;
    case 'days':
    default:
      return val;
  }
}

/**
 * Determines operational packaging requirements based on food record + environmental conditions
 */
export function evaluateOperationalRequirements(
  food: FoodRecord,
  input: RecommendationInput
): {
  requiredOxygenBarrier: BarrierLevel;
  requiredMoistureBarrier: BarrierLevel;
  requiredGasPermeability: 'Controlled' | 'Restricted' | 'High Exchange' | 'Open' | 'Low';
  requiredMechanicalStrength: 'High' | 'Medium' | 'Standard' | 'Low';
  requiredSealability: 'High' | 'Standard' | 'Medium' | 'Low';
  requiredMap: boolean;
  reasoning: string[];
} {
  const shelfLifeDays = convertToDays(input.shelfLife.value, input.shelfLife.unit);
  const isChilled = input.storage.type === 'chilled';
  const isFrozen = input.storage.type === 'frozen';
  const isLongTransit = input.transportation.distance === 'long_distance' || input.application.export;

  // Base requirements from food database
  let oxygen = food.packagingRequirements.oxygenBarrier;
  let moisture = food.packagingRequirements.moistureBarrier;
  let gas = food.packagingRequirements.gasPermeability;
  let strength = food.packagingRequirements.mechanicalStrength;
  let seal = food.packagingRequirements.sealability;
  let map = food.packagingRequirements.mapSuitability;

  const reasoning: string[] = [];

  // Rule 1: Extended shelf life increases oxygen & moisture barrier demand
  if (shelfLifeDays > 60 && food.state !== 'Frozen') {
    if (food.characteristics.oxygenSensitivity !== 'Low') {
      oxygen = 'High';
      reasoning.push(`Target shelf life of ${input.shelfLife.value} ${input.shelfLife.unit} requires high oxygen barrier to prevent oxidation.`);
    }
    if (food.characteristics.moistureSensitivity !== 'Low') {
      moisture = 'High';
      reasoning.push('Extended ambient holding requires strict moisture vapor containment.');
    }
  }

  // Rule 2: Long distance transit or export requires high mechanical durability
  if (isLongTransit) {
    strength = 'High';
    seal = 'High';
    reasoning.push('Long-distance transit and export vibration demand reinforced mechanical puncture resistance and hermetic seal strength.');
  }

  // Rule 3: Living produce with active respiration requires controlled gas balance
  if (food.characteristics.respiration === 'High' && food.state === 'Fresh') {
    gas = 'Controlled';
    map = true;
    reasoning.push('High commodity respiration rate requires balanced gas permeability to avoid anaerobic produce fermentation.');
  } else if (food.state === 'Processed' || food.state === 'Dried') {
    gas = 'Restricted';
  }

  // Rule 4: Chilled perishables with high microbial risk benefit from MAP
  if (isChilled && food.characteristics.microbialRisk === 'High') {
    map = true;
    oxygen = 'High';
    reasoning.push('Chilled storage with elevated microbial sensitivity benefits from modified atmosphere gas retention (MAP).');
  }

  // Rule 5: Sub-zero frozen holding requires specialized low-temperature flex crack defense
  if (isFrozen) {
    moisture = 'High';
    strength = 'High';
    reasoning.push('Frozen distribution requires moisture vapor barrier to prevent freezer burn and crack-resistant polyolefins.');
  }

  return {
    requiredOxygenBarrier: oxygen,
    requiredMoistureBarrier: moisture,
    requiredGasPermeability: gas,
    requiredMechanicalStrength: strength,
    requiredSealability: seal,
    requiredMap: map,
    reasoning,
  };
}

/**
 * Score level equality (e.g. 'High' vs 'High')
 */
function scoreBarrier(req: BarrierLevel, mat: BarrierLevel): { points: number; status: 'match' | 'partial' | 'no_match'; note: string } {
  if (req === 'Low') {
    return { points: 20, status: 'match', note: 'Exceeds or meets minimum requirement' };
  }
  if (req === 'Medium') {
    if (mat === 'High' || mat === 'Medium') {
      return { points: 20, status: 'match', note: mat === 'High' ? 'Superior barrier protection' : 'Meets requirement' };
    }
    return { points: 5, status: 'partial', note: 'Borderline protection for target shelf life' };
  }
  if (req === 'High') {
    if (mat === 'High') {
      return { points: 20, status: 'match', note: 'Provides necessary high barrier' };
    }
    if (mat === 'Medium') {
      return { points: 8, status: 'partial', note: 'Slightly below high barrier target; may shorten shelf life' };
    }
    return { points: 0, status: 'no_match', note: 'Insufficient barrier against oxidation' };
  }
  return { points: 10, status: 'partial', note: 'Evaluated' };
}

/**
 * Deterministically evaluates a packaging material against evaluated requirements
 */
export function evaluateMaterialCompatibility(
  material: PackagingMaterialRecord,
  requirements: ReturnType<typeof evaluateOperationalRequirements>,
  food: FoodRecord
): CompatibilityEvaluation {
  let score = 0;
  const matches: RequirementComparisonItem[] = [];
  const mismatchReasons: string[] = [];

  // 1. Oxygen Barrier evaluation (20 pts max)
  const o2 = scoreBarrier(requirements.requiredOxygenBarrier, material.properties.oxygenBarrier);
  score += o2.points;
  matches.push({
    requirement: 'Oxygen Barrier',
    requiredLevel: requirements.requiredOxygenBarrier,
    packagingPerformance: `${material.properties.oxygenBarrier} (${material.specifications.otr})`,
    status: o2.status,
    note: o2.note,
  });
  if (o2.status === 'no_match') mismatchReasons.push('Material oxygen barrier insufficient for target preservation.');

  // 2. Moisture Barrier evaluation (20 pts max)
  const h2o = scoreBarrier(requirements.requiredMoistureBarrier, material.properties.moistureBarrier);
  score += h2o.points;
  matches.push({
    requirement: 'Moisture Barrier',
    requiredLevel: requirements.requiredMoistureBarrier,
    packagingPerformance: `${material.properties.moistureBarrier} (${material.specifications.wvtr})`,
    status: h2o.status,
    note: h2o.note,
  });
  if (h2o.status === 'no_match') mismatchReasons.push('Moisture barrier insufficient against ambient humidity ingress.');

  // 3. Gas Permeability (20 pts max)
  if (requirements.requiredGasPermeability === material.properties.gasPermeability) {
    score += 20;
    matches.push({
      requirement: 'Gas Permeability',
      requiredLevel: requirements.requiredGasPermeability,
      packagingPerformance: material.properties.gasPermeability,
      status: 'match',
      note: 'Optimally matched to produce respiration kinetics',
    });
  } else if (
    (requirements.requiredGasPermeability === 'Controlled' && material.properties.gasPermeability === 'High Exchange') ||
    (requirements.requiredGasPermeability === 'Restricted' && material.properties.gasPermeability === 'Controlled')
  ) {
    score += 10;
    matches.push({
      requirement: 'Gas Permeability',
      requiredLevel: requirements.requiredGasPermeability,
      packagingPerformance: material.properties.gasPermeability,
      status: 'partial',
      note: 'Acceptable gas exchange under monitored storage',
    });
  } else {
    score += 2;
    matches.push({
      requirement: 'Gas Permeability',
      requiredLevel: requirements.requiredGasPermeability,
      packagingPerformance: material.properties.gasPermeability,
      status: 'partial',
      note: 'Permeability difference may require storage ventilation',
    });
  }

  // 4. Mechanical Strength (15 pts max)
  if (requirements.requiredMechanicalStrength === 'High') {
    if (material.properties.mechanicalStrength === 'High') {
      score += 15;
      matches.push({
        requirement: 'Mechanical Strength',
        requiredLevel: 'High',
        packagingPerformance: 'High Puncture & Tear Resistance',
        status: 'match',
      });
    } else {
      score += 5;
      matches.push({
        requirement: 'Mechanical Strength',
        requiredLevel: 'High',
        packagingPerformance: material.properties.mechanicalStrength,
        status: 'partial',
        note: 'Secondary transit corrugation recommended',
      });
    }
  } else {
    score += 15;
    matches.push({
      requirement: 'Mechanical Strength',
      requiredLevel: requirements.requiredMechanicalStrength,
      packagingPerformance: material.properties.mechanicalStrength,
      status: 'match',
    });
  }

  // 5. Sealability (15 pts max)
  if (requirements.requiredSealability === 'High') {
    if (material.properties.sealability === 'High') {
      score += 15;
      matches.push({
        requirement: 'Sealability',
        requiredLevel: 'High',
        packagingPerformance: 'Hermetic Thermal Bond',
        status: 'match',
      });
    } else {
      score += 7;
      matches.push({
        requirement: 'Sealability',
        requiredLevel: 'High',
        packagingPerformance: material.properties.sealability,
        status: 'partial',
      });
    }
  } else {
    score += 15;
    matches.push({
      requirement: 'Sealability',
      requiredLevel: requirements.requiredSealability,
      packagingPerformance: material.properties.sealability,
      status: 'match',
    });
  }

  // 6. MAP Suitability (10 pts max)
  if (requirements.requiredMap) {
    if (material.properties.mapSuitability) {
      score += 10;
      matches.push({
        requirement: 'MAP Suitability',
        requiredLevel: 'Suitable',
        packagingPerformance: 'Compatible with Gas-Flush Technology',
        status: 'match',
      });
    } else {
      matches.push({
        requirement: 'MAP Suitability',
        requiredLevel: 'Suitable',
        packagingPerformance: 'Not Gas-Tight for MAP',
        status: 'partial',
        note: 'Product cannot support active gas flush',
      });
    }
  } else {
    score += 10;
    matches.push({
      requirement: 'MAP Suitability',
      requiredLevel: 'Optional / Not Required',
      packagingPerformance: material.properties.mapSuitability ? 'Supported' : 'Standard Atmosphere',
      status: 'match',
    });
  }

  // Commodity Preferred Packaging Bonus (+10 pts)
  if (food.preferredPackaging.includes(material.id)) {
    score += 10;
  }

  // Derive final qualitative match level
  let matchLevel: CompatibilityEvaluation['matchLevel'] = 'High';
  if (score >= 80) matchLevel = 'High';
  else if (score >= 60) matchLevel = 'Partial';
  else if (score >= 40) matchLevel = 'Low';
  else matchLevel = 'Not Suitable';

  return {
    material,
    score,
    matchLevel,
    matches,
    mismatchReasons,
  };
}

/**
 * Core Rule-Based Recommendation Engine function
 */
export function runRecommendationRules(input: RecommendationInput): {
  food: FoodRecord;
  isGenericFallback: boolean;
  requirements: ReturnType<typeof evaluateOperationalRequirements>;
  recommended: CompatibilityEvaluation;
  alternative: CompatibilityEvaluation;
  sustainable: CompatibilityEvaluation;
  allEvaluations: CompatibilityEvaluation[];
  solution: PackagingSolutionData;
} {
  // Step 1: Find food in database
  const { record: food, isGenericFallback } = lookupFoodInDatabase(input.product);

  // Step 2 & 3: Determine packaging requirements
  const requirements = evaluateOperationalRequirements(food, input);

  // Step 4: Evaluate all candidates in material database
  const allEvaluations = PACKAGING_MATERIALS_DATABASE.map((mat) =>
    evaluateMaterialCompatibility(mat, requirements, food)
  ).sort((a, b) => b.score - a.score);

  // Step 5: Select Recommended (highest score)
  const recommended = allEvaluations[0];

  // Select Alternative (next highest that has a different category or structure)
  const alternative =
    allEvaluations.find(
      (e) =>
        e.material.id !== recommended.material.id &&
        (e.material.structure[0] !== recommended.material.structure[0] ||
          e.material.category !== recommended.material.category)
    ) || allEvaluations[1] || recommended;

  // Select Sustainable Alternative (from Sustainable / Recyclable category or highest recyclable score)
  const sustainable =
    allEvaluations.find(
      (e) =>
        e.material.category === 'Sustainable / Recyclable' &&
        e.material.id !== recommended.material.id
    ) ||
    allEvaluations.find(
      (e) =>
        e.material.sustainability.qualitativeRating === 'High' &&
        e.material.id !== recommended.material.id
    ) ||
    allEvaluations.find((e) => e.material.id === 'mono-pe') ||
    recommended;

  // Transform layers for the primary structure
  const layers = recommended.material.structure.map((str, idx) => ({
    name: str.split('(')[0].trim(),
    type: idx === 0 ? 'Outer Protective Layer' : idx === recommended.material.structure.length - 1 ? 'Inner Sealing Layer' : 'Core Barrier Layer',
    role: idx === 0 ? 'Mechanical strength and print protection' : idx === recommended.material.structure.length - 1 ? 'Hermetic heat seal and food contact compliance' : 'Oxygen and moisture permeation control',
    thickness: recommended.material.specifications.thickness,
  }));

  // Build Alternative object for Step 6/7
  const altItem: PackagingAlternativeItem = {
    id: alternative.material.id,
    name: alternative.material.name,
    structure: alternative.material.structure.join(' / '),
    match: alternative.matchLevel === 'High' ? 'High' : 'Medium',
    description: alternative.material.description,
    pros: alternative.material.pros,
    cons: alternative.material.cons,
    otr: alternative.material.specifications.otr,
    wvtr: alternative.material.specifications.wvtr,
    thickness: alternative.material.specifications.thickness,
    recyclability: alternative.material.sustainability.recyclability,
    estimatedCost: alternative.material.estimatedCost.costPerPackage,
  };

  const solution: PackagingSolutionData = {
    primaryStructure: recommended.material.name,
    primaryStructureShort: recommended.material.shortName,
    compatibilityLevel: recommended.matchLevel === 'High' ? 'High' : 'Medium',
    statusExplanation: isGenericFallback
      ? `Preliminary packaging recommendation generated via rule-based heuristic for novel commodity "${input.product}". Physical barrier testing recommended.`
      : `Deterministic recommendation generated via food database parameters and material barrier compatibility rules.`,
    layers,
    reasons: [
      `Delivers required ${requirements.requiredOxygenBarrier.toLowerCase()} oxygen barrier against quality degradation`,
      `Maintains ${requirements.requiredMoistureBarrier.toLowerCase()} moisture vapor protection for ${input.storage.type} conditions`,
      `Meets ${requirements.requiredMechanicalStrength.toLowerCase()} mechanical strength standards for ${input.transportation.distance.replace('_', ' ')} logistics`,
      `Supports target shelf life of ${input.shelfLife.value} ${input.shelfLife.unit}`,
      `Selected from verified local packaging material catalog (${recommended.material.category})`,
    ],
    requirementMatches: recommended.matches,
    specifications: {
      otr: {
        value: recommended.material.specifications.otr.split(' ')[0] || recommended.material.specifications.otr,
        unit: 'cc/m²/24h',
        tooltip: 'Oxygen Transmission Rate — measures how easily oxygen permeates through the packaging substrate.',
        targetRange: `Engineering requirement: ${requirements.requiredOxygenBarrier} Barrier`,
      },
      wvtr: {
        value: recommended.material.specifications.wvtr.split(' ')[0] || recommended.material.specifications.wvtr,
        unit: 'g/m²/24h',
        tooltip: 'Water Vapor Transmission Rate — measures moisture vapor permeation through the barrier structure.',
        targetRange: `Engineering requirement: ${requirements.requiredMoistureBarrier} Barrier`,
      },
      thickness: {
        value: recommended.material.specifications.thickness,
        tooltip: 'Nominal substrate thickness providing mechanical durability and barrier gauge.',
        targetRange: 'Standard production gauge',
      },
      sealability: {
        value: recommended.material.properties.sealability === 'High' ? 'High Integrity Thermal Bond' : 'Standard Seal',
        tooltip: 'Thermal seal strength and integrity under vibration.',
      },
      mechanicalStrength: {
        value: recommended.material.properties.mechanicalStrength,
        tooltip: 'Puncture resistance, drop impact resilience, and tensile resistance during distribution.',
      },
      gasPermeability: {
        value: recommended.material.properties.gasPermeability,
        tooltip: 'Gas permeation tuning matching produce respiration kinetics.',
      },
      mapSuitability: {
        value: recommended.material.properties.mapSuitability ? 'Suitable (Gas Flush Compatible)' : 'Standard Atmosphere Only',
        tooltip: 'Suitability for Modified Atmosphere Packaging gas flush.',
        gasMixRecommendation: recommended.material.properties.mapSuitability
          ? food.state === 'Fresh'
            ? 'Recommended Headspace: 3–5% O₂, 5–8% CO₂, Balance N₂'
            : food.state === 'Processed'
            ? 'Recommended Headspace: 99.5% N₂ gas cushion (<0.5% residual O₂)'
            : 'Recommended Headspace: 70% N₂ / 30% CO₂'
          : undefined,
      },
    },
    alternatives: [altItem],
    sustainableAlternative: {
      name: sustainable.material.name,
      structure: sustainable.material.structure.join(' / '),
      match: sustainable.matchLevel === 'High' ? 'High' : 'Medium',
      whyConsider: `${sustainable.material.name} delivers ${sustainable.material.sustainability.recyclability} with lower environmental impact.`,
      tradeoffs: sustainable.material.cons.join('. ') || 'Slightly higher raw material unit cost.',
      materialType: sustainable.material.category,
      recyclability: sustainable.material.sustainability.recyclability,
    },
    estimatedCost: {
      costPerPackage: recommended.material.estimatedCost.costPerPackage,
      materialCostRange: recommended.material.estimatedCost.costPerPackage,
      basis: recommended.material.estimatedCost.basis,
    },
    sustainability: {
      recyclability: recommended.material.sustainability.recyclability,
      materialType: recommended.material.category,
      materialUsage: recommended.material.specifications.thickness,
      calculationBasis: `Qualitative assessment based on ${recommended.material.sustainability.materialComplexity} classification. ${recommended.material.sustainability.endOfLife}`,
    },
    shelfLifeImpact: {
      targetShelfLife: `${input.shelfLife.value} ${input.shelfLife.unit}`,
      expectedImpact: 'Positive',
      explanation:
        'Shelf-life impact: Designed to support the specified storage and packaging requirements. Validation required before commercial deployment.',
    },
    decisionChain: {
      food: `${food.name} (${food.category} · ${food.state})`,
      foodRiskSummary: `Moisture: ${food.characteristics.moistureSensitivity} · Oxygen: ${food.characteristics.oxygenSensitivity} · Respiration: ${food.characteristics.respiration} · Microbe: ${food.characteristics.microbialRisk}`,
      packagingRequirementsSummary: `O₂ Barrier: ${requirements.requiredOxygenBarrier} · H₂O Barrier: ${requirements.requiredMoistureBarrier} · Permeability: ${requirements.requiredGasPermeability}`,
      databaseCandidates: `${PACKAGING_MATERIALS_DATABASE.length} materials evaluated from local catalog`,
      matchingMethod: 'Deterministic multi-factor rule engine (ASTM / ISO parameter compliance)',
      recommendationSummary: `Primary match: ${recommended.material.name} (${recommended.score}/100 score). Alternative: ${altItem.name}. Sustainable: ${sustainable.material.name}.`,
    },
  };

  return {
    food,
    isGenericFallback,
    requirements,
    recommended,
    alternative,
    sustainable,
    allEvaluations,
    solution,
  };
}

export const recommendationRules = {
  runRecommendationRules,
  evaluateOperationalRequirements,
  evaluateMaterialCompatibility,
  convertToDays,
};

export default runRecommendationRules;
