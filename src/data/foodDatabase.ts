import { PackagingAnalysis } from '../types/packaging';

export type ProductStateType = 'Fresh' | 'Processed' | 'Dried' | 'Frozen' | 'Liquid' | 'Powder' | 'Ready-to-Eat';
export type RespirationLevel = 'High' | 'Medium' | 'Low' | 'None';
export type SensitivityLevel = 'High' | 'Medium' | 'Low';
export type RiskLevel = 'High' | 'Medium' | 'Low';

export interface FoodRecord {
  id: string;
  name: string;
  category: string;
  foodGroup: string;
  state: ProductStateType;
  characteristics: {
    moistureSensitivity: SensitivityLevel;
    oxygenSensitivity: SensitivityLevel;
    respiration: RespirationLevel;
    microbialRisk: RiskLevel;
    waterActivity?: string;
  };
  storageProfiles: {
    ambient: { suitable: boolean; typicalShelfLife: string; note: string };
    chilled: { suitable: boolean; typicalShelfLife: string; tempRangeC?: string; note: string };
    frozen: { suitable: boolean; typicalShelfLife: string; note: string };
  };
  packagingRequirements: {
    oxygenBarrier: 'High' | 'Medium' | 'Low';
    moistureBarrier: 'High' | 'Medium' | 'Low';
    gasPermeability: 'Controlled' | 'Restricted' | 'High Exchange' | 'Open' | 'Low';
    mechanicalStrength: 'High' | 'Medium' | 'Standard' | 'Low';
    sealability: 'High' | 'Standard' | 'Medium' | 'Low';
    mapSuitability: boolean;
  };
  preferredPackaging: string[]; // Material IDs from packagingMaterials database
  aliases: string[];
  backendCategory: PackagingAnalysis['category'];
  thumbnailType: PackagingAnalysis['thumbnailType'];
  explanationNotes: string;
  source?: 'system' | 'user';
  description?: string;
  degradationFactors?: string[];
  packagingConsiderations?: string;
  advancedTechnicalData?: {
    waterActivity?: string;
    pH?: string;
    moistureContentPercent?: string;
    respirationRateNumerical?: string;
    otrRequirement?: string;
    wvtrRequirement?: string;
  };
}

export const FOOD_DATABASE: FoodRecord[] = [
  // ==========================================
  // 1-12: FRESH PRODUCE
  // ==========================================
  {
    id: 'mango',
    name: 'Mango',
    category: 'Fresh Fruit',
    foodGroup: 'Fresh Produce',
    state: 'Fresh',
    characteristics: {
      moistureSensitivity: 'High',
      oxygenSensitivity: 'Medium',
      respiration: 'High',
      microbialRisk: 'Medium',
      waterActivity: '0.98',
    },
    storageProfiles: {
      ambient: { suitable: true, typicalShelfLife: '5–8 Days', note: 'Ripens rapidly at room temperature' },
      chilled: { suitable: true, typicalShelfLife: '20–30 Days', tempRangeC: '10–13°C', note: 'Susceptible to chilling injury below 10°C' },
      frozen: { suitable: true, typicalShelfLife: '12 Months', note: 'Frozen pulp or IQF slices only' },
    },
    packagingRequirements: {
      oxygenBarrier: 'Medium',
      moistureBarrier: 'Medium',
      gasPermeability: 'Controlled',
      mechanicalStrength: 'High',
      sealability: 'High',
      mapSuitability: true,
    },
    preferredPackaging: ['pet-barrier-pe', 'breathable-film', 'micro-perforated-film', 'mono-pe'],
    aliases: ['mangoes', 'alphonso', 'kesar', 'fresh mango'],
    backendCategory: 'Fruits & Vegetables',
    thumbnailType: 'apple',
    explanationNotes: 'Climacteric fruit with active ethylene synthesis and transpiration requiring equilibrium gas exchange and anti-condensation moisture control.',
  },
  {
    id: 'apple',
    name: 'Apple',
    category: 'Pome Fruit',
    foodGroup: 'Fresh Produce',
    state: 'Fresh',
    characteristics: {
      moistureSensitivity: 'Medium',
      oxygenSensitivity: 'Medium',
      respiration: 'Medium',
      microbialRisk: 'Low',
      waterActivity: '0.97',
    },
    storageProfiles: {
      ambient: { suitable: true, typicalShelfLife: '14–21 Days', note: 'Firmness gradually declines' },
      chilled: { suitable: true, typicalShelfLife: '60–120 Days', tempRangeC: '1–4°C', note: 'Optimal under cold storage with high humidity' },
      frozen: { suitable: false, typicalShelfLife: 'N/A', note: 'Cell rupture destroys fresh texture' },
    },
    packagingRequirements: {
      oxygenBarrier: 'Medium',
      moistureBarrier: 'Medium',
      gasPermeability: 'Controlled',
      mechanicalStrength: 'High',
      sealability: 'Standard',
      mapSuitability: true,
    },
    preferredPackaging: ['pet-barrier-pe', 'micro-perforated-film', 'pet-tray', 'mono-pe'],
    aliases: ['apples', 'fresh apple', 'fuji', 'gala'],
    backendCategory: 'Fruits & Vegetables',
    thumbnailType: 'apple',
    explanationNotes: 'Moderate respiration rate with firm epidermis. Requires mechanical impact protection and controlled atmosphere to curb senescent breakdown.',
  },
  {
    id: 'banana',
    name: 'Banana',
    category: 'Tropical Fruit',
    foodGroup: 'Fresh Produce',
    state: 'Fresh',
    characteristics: {
      moistureSensitivity: 'High',
      oxygenSensitivity: 'High',
      respiration: 'High',
      microbialRisk: 'Low',
      waterActivity: '0.97',
    },
    storageProfiles: {
      ambient: { suitable: true, typicalShelfLife: '5–7 Days', note: 'Rapid ripening once ethylene triggered' },
      chilled: { suitable: false, typicalShelfLife: 'N/A', tempRangeC: 'Chilling injury below 13°C', note: 'Peel browning below 13°C' },
      frozen: { suitable: false, typicalShelfLife: 'N/A', note: 'Not recommended for whole fruit' },
    },
    packagingRequirements: {
      oxygenBarrier: 'Medium',
      moistureBarrier: 'Medium',
      gasPermeability: 'Controlled',
      mechanicalStrength: 'High',
      sealability: 'Standard',
      mapSuitability: true,
    },
    preferredPackaging: ['breathable-film', 'micro-perforated-film', 'ldpe-film'],
    aliases: ['bananas', 'cavendish', 'fresh banana'],
    backendCategory: 'Fruits & Vegetables',
    thumbnailType: 'apple',
    explanationNotes: 'High ethylene and respiration sensitivity; requires modified atmosphere permeability to delay yellowing without in-bag anaerobic fermentation.',
  },
  {
    id: 'tomato',
    name: 'Tomato',
    category: 'Fruiting Vegetable',
    foodGroup: 'Fresh Produce',
    state: 'Fresh',
    characteristics: {
      moistureSensitivity: 'High',
      oxygenSensitivity: 'Medium',
      respiration: 'High',
      microbialRisk: 'Medium',
      waterActivity: '0.99',
    },
    storageProfiles: {
      ambient: { suitable: true, typicalShelfLife: '7–10 Days', note: 'Optimal flavor maintenance' },
      chilled: { suitable: true, typicalShelfLife: '14–21 Days', tempRangeC: '10–12°C', note: 'Avoid <10°C to prevent chilling injury' },
      frozen: { suitable: false, typicalShelfLife: 'N/A', note: 'Tissue breakdown upon thawing' },
    },
    packagingRequirements: {
      oxygenBarrier: 'Medium',
      moistureBarrier: 'Medium',
      gasPermeability: 'Controlled',
      mechanicalStrength: 'High',
      sealability: 'High',
      mapSuitability: true,
    },
    preferredPackaging: ['pet-tray', 'micro-perforated-film', 'pet-barrier-pe', 'mono-pp'],
    aliases: ['tomatoes', 'fresh tomato', 'cherry tomato', 'vine tomato'],
    backendCategory: 'Fruits & Vegetables',
    thumbnailType: 'tomato',
    explanationNotes: 'High transpiration rate necessitates anti-fog coating and vented or micro-perforated substrates to balance respiration and prevent mold rot.',
  },
  {
    id: 'potato',
    name: 'Potato',
    category: 'Tuber Vegetable',
    foodGroup: 'Fresh Produce',
    state: 'Fresh',
    characteristics: {
      moistureSensitivity: 'Medium',
      oxygenSensitivity: 'Low',
      respiration: 'Low',
      microbialRisk: 'Low',
      waterActivity: '0.96',
    },
    storageProfiles: {
      ambient: { suitable: true, typicalShelfLife: '30–60 Days', note: 'Must be protected from light to avoid solanine greening' },
      chilled: { suitable: true, typicalShelfLife: '90–120 Days', tempRangeC: '8–10°C', note: 'Cold storage below 6°C causes sweetening (sugar accumulation)' },
      frozen: { suitable: false, typicalShelfLife: 'N/A', note: 'Requires pre-cooking or par-frying before freezing' },
    },
    packagingRequirements: {
      oxygenBarrier: 'Low',
      moistureBarrier: 'Low',
      gasPermeability: 'High Exchange',
      mechanicalStrength: 'High',
      sealability: 'Standard',
      mapSuitability: false,
    },
    preferredPackaging: ['paper-barrier', 'hdpe-film', 'mono-pe', 'pp-container'],
    aliases: ['potatoes', 'tuber', 'fresh potato'],
    backendCategory: 'Fruits & Vegetables',
    thumbnailType: 'potato',
    explanationNotes: 'Requires light barrier to halt chlorophyll and solanine synthesis, coupled with high gas exchange to prevent condensation rot and sprouting.',
  },
  {
    id: 'onion',
    name: 'Onion',
    category: 'Bulb Vegetable',
    foodGroup: 'Fresh Produce',
    state: 'Fresh',
    characteristics: {
      moistureSensitivity: 'High',
      oxygenSensitivity: 'Low',
      respiration: 'Low',
      microbialRisk: 'Low',
      waterActivity: '0.95',
    },
    storageProfiles: {
      ambient: { suitable: true, typicalShelfLife: '30–60 Days', note: 'Cool, well-ventilated dry ambient storage' },
      chilled: { suitable: true, typicalShelfLife: '90–180 Days', tempRangeC: '0–2°C, 65–70% RH', note: 'High humidity causes rapid root emergence and neck rot' },
      frozen: { suitable: false, typicalShelfLife: 'N/A', note: 'Raw whole bulbs unsuitable for freezing' },
    },
    packagingRequirements: {
      oxygenBarrier: 'Low',
      moistureBarrier: 'Low',
      gasPermeability: 'High Exchange',
      mechanicalStrength: 'High',
      sealability: 'Standard',
      mapSuitability: false,
    },
    preferredPackaging: ['paper-barrier', 'hdpe-film', 'mono-pe'],
    aliases: ['onions', 'red onion', 'shallot'],
    backendCategory: 'Fruits & Vegetables',
    thumbnailType: 'tomato',
    explanationNotes: 'Highly vulnerable to high humidity triggering root sprouting and bacterial neck rot; packaging must maximize air exchange and vapor dissipation.',
  },
  {
    id: 'carrot',
    name: 'Carrot',
    category: 'Root Vegetable',
    foodGroup: 'Fresh Produce',
    state: 'Fresh',
    characteristics: {
      moistureSensitivity: 'High',
      oxygenSensitivity: 'Low',
      respiration: 'Medium',
      microbialRisk: 'Medium',
      waterActivity: '0.98',
    },
    storageProfiles: {
      ambient: { suitable: false, typicalShelfLife: '4–7 Days', note: 'Rapid flaccidity and dehydration' },
      chilled: { suitable: true, typicalShelfLife: '30–60 Days', tempRangeC: '0–4°C, >95% RH', note: 'High relative humidity maintains turgidity' },
      frozen: { suitable: true, typicalShelfLife: '12 Months', note: 'Requires blanching before IQF freezing' },
    },
    packagingRequirements: {
      oxygenBarrier: 'Low',
      moistureBarrier: 'High',
      gasPermeability: 'Controlled',
      mechanicalStrength: 'Medium',
      sealability: 'Standard',
      mapSuitability: true,
    },
    preferredPackaging: ['ldpe-film', 'micro-perforated-film', 'mono-pe'],
    aliases: ['carrots', 'baby carrot', 'fresh carrots'],
    backendCategory: 'Fruits & Vegetables',
    thumbnailType: 'tomato',
    explanationNotes: 'Prone to moisture loss causing surface white-blush and limp texture. Requires moisture-retentive film with mild venting.',
  },
  {
    id: 'cucumber',
    name: 'Cucumber',
    category: 'Fruiting Vegetable',
    foodGroup: 'Fresh Produce',
    state: 'Fresh',
    characteristics: {
      moistureSensitivity: 'High',
      oxygenSensitivity: 'Medium',
      respiration: 'Medium',
      microbialRisk: 'Medium',
      waterActivity: '0.99',
    },
    storageProfiles: {
      ambient: { suitable: true, typicalShelfLife: '5–7 Days', note: 'Rapid yellowing and moisture loss' },
      chilled: { suitable: true, typicalShelfLife: '14–20 Days', tempRangeC: '10–12°C', note: 'Avoid <10°C to prevent chilling injury pitting' },
      frozen: { suitable: false, typicalShelfLife: 'N/A', note: 'High water content destroys cellular matrix' },
    },
    packagingRequirements: {
      oxygenBarrier: 'Medium',
      moistureBarrier: 'High',
      gasPermeability: 'Controlled',
      mechanicalStrength: 'Standard',
      sealability: 'High',
      mapSuitability: true,
    },
    preferredPackaging: ['ldpe-film', 'pet-barrier-pe', 'mono-pe'],
    aliases: ['cucumbers', 'english cucumber', 'gherkin'],
    backendCategory: 'Fruits & Vegetables',
    thumbnailType: 'tomato',
    explanationNotes: 'Very thin cuticle leads to rapid shriveling. Tight shrink or barrier wrap prevents desiccation while chilling sensitivity dictates warm chilled holding.',
  },
  {
    id: 'strawberry',
    name: 'Strawberry',
    category: 'Soft Berry',
    foodGroup: 'Fresh Produce',
    state: 'Fresh',
    characteristics: {
      moistureSensitivity: 'High',
      oxygenSensitivity: 'Medium',
      respiration: 'High',
      microbialRisk: 'High',
      waterActivity: '0.98',
    },
    storageProfiles: {
      ambient: { suitable: false, typicalShelfLife: '1–2 Days', note: 'Extremely perishable, rapid mold rot' },
      chilled: { suitable: true, typicalShelfLife: '7–10 Days', tempRangeC: '0–2°C', note: 'Strict continuous cold chain required' },
      frozen: { suitable: true, typicalShelfLife: '12 Months', note: 'IQF frozen whole or sliced' },
    },
    packagingRequirements: {
      oxygenBarrier: 'Medium',
      moistureBarrier: 'Medium',
      gasPermeability: 'Controlled',
      mechanicalStrength: 'High',
      sealability: 'High',
      mapSuitability: true,
    },
    preferredPackaging: ['pet-tray', 'micro-perforated-film', 'compostable-film', 'mono-pp'],
    aliases: ['strawberries', 'berry', 'berries'],
    backendCategory: 'Fruits & Vegetables',
    thumbnailType: 'apple',
    explanationNotes: 'High susceptibility to Botrytis cinerea rot and mechanical compression; requires rigid vented clamshells/trays and elevated CO₂ MAP (10–15% CO₂).',
  },
  {
    id: 'orange',
    name: 'Orange',
    category: 'Citrus Fruit',
    foodGroup: 'Fresh Produce',
    state: 'Fresh',
    characteristics: {
      moistureSensitivity: 'Medium',
      oxygenSensitivity: 'Low',
      respiration: 'Medium',
      microbialRisk: 'Low',
      waterActivity: '0.97',
    },
    storageProfiles: {
      ambient: { suitable: true, typicalShelfLife: '10–14 Days', note: 'Gradual rind desiccation' },
      chilled: { suitable: true, typicalShelfLife: '30–60 Days', tempRangeC: '4–7°C', note: 'Cold storage retains juice content' },
      frozen: { suitable: false, typicalShelfLife: 'N/A', note: 'Whole fruit unsuitable for freezing' },
    },
    packagingRequirements: {
      oxygenBarrier: 'Low',
      moistureBarrier: 'Medium',
      gasPermeability: 'Controlled',
      mechanicalStrength: 'High',
      sealability: 'Standard',
      mapSuitability: false,
    },
    preferredPackaging: ['hdpe-film', 'ldpe-film', 'mono-pe', 'paper-barrier'],
    aliases: ['oranges', 'citrus', 'mandarin', 'tangerine'],
    backendCategory: 'Fruits & Vegetables',
    thumbnailType: 'apple',
    explanationNotes: 'Thick rind provides mechanical defense; primary packaging goal is maintaining moisture balance without trapped humid air inciting Penicillium blue/green mold.',
  },
  {
    id: 'grapes',
    name: 'Grapes',
    category: 'Table Grapes',
    foodGroup: 'Fresh Produce',
    state: 'Fresh',
    characteristics: {
      moistureSensitivity: 'High',
      oxygenSensitivity: 'Low',
      respiration: 'Low',
      microbialRisk: 'High',
      waterActivity: '0.98',
    },
    storageProfiles: {
      ambient: { suitable: false, typicalShelfLife: '2–3 Days', note: 'Rapid stem browning and berry drop' },
      chilled: { suitable: true, typicalShelfLife: '30–60 Days', tempRangeC: '-0.5–0°C, 90–95% RH', note: 'Often packaged with SO₂ generating pads' },
      frozen: { suitable: true, typicalShelfLife: '6 Months', note: 'Frozen whole as snack or processing' },
    },
    packagingRequirements: {
      oxygenBarrier: 'Low',
      moistureBarrier: 'Medium',
      gasPermeability: 'Controlled',
      mechanicalStrength: 'High',
      sealability: 'Standard',
      mapSuitability: false,
    },
    preferredPackaging: ['pet-tray', 'ldpe-film', 'mono-pp'],
    aliases: ['grape', 'table grapes', 'green grapes', 'red grapes'],
    backendCategory: 'Fruits & Vegetables',
    thumbnailType: 'apple',
    explanationNotes: 'Vulnerable to Botrytis rot and rachis (stem) browning. Requires rigid vented packaging with moisture control and SO₂ generator compatibility.',
  },
  {
    id: 'green-peas',
    name: 'Green Peas',
    category: 'Legume Vegetable',
    foodGroup: 'Fresh Produce',
    state: 'Fresh',
    characteristics: {
      moistureSensitivity: 'High',
      oxygenSensitivity: 'Medium',
      respiration: 'High',
      microbialRisk: 'Medium',
      waterActivity: '0.98',
    },
    storageProfiles: {
      ambient: { suitable: false, typicalShelfLife: '1–2 Days', note: 'Rapid sugar-to-starch conversion causing toughness' },
      chilled: { suitable: true, typicalShelfLife: '7–10 Days', tempRangeC: '0–2°C, 95% RH', note: 'Strict cold storage delays sugar loss' },
      frozen: { suitable: true, typicalShelfLife: '18 Months', note: 'Blanched IQF standard preservation' },
    },
    packagingRequirements: {
      oxygenBarrier: 'Medium',
      moistureBarrier: 'High',
      gasPermeability: 'Controlled',
      mechanicalStrength: 'Medium',
      sealability: 'High',
      mapSuitability: true,
    },
    preferredPackaging: ['ldpe-film', 'micro-perforated-film', 'mono-pe'],
    aliases: ['fresh peas', 'peas', 'garden peas'],
    backendCategory: 'Fruits & Vegetables',
    thumbnailType: 'tomato',
    explanationNotes: 'Extremely high respiration and rapid enzymatic sweet-to-starchy conversion. Strict cold chain and balanced gas permeable packaging mandatory.',
  },

  // ==========================================
  // 13-17: GRAINS / DRY FOODS
  // ==========================================
  {
    id: 'rice',
    name: 'Rice',
    category: 'Cereal Grains',
    foodGroup: 'Dry Staples',
    state: 'Dried',
    characteristics: {
      moistureSensitivity: 'High',
      oxygenSensitivity: 'Low',
      respiration: 'None',
      microbialRisk: 'Low',
      waterActivity: '0.50',
    },
    storageProfiles: {
      ambient: { suitable: true, typicalShelfLife: '12–24 Months', note: 'Store dry (<65% RH) away from pests' },
      chilled: { suitable: true, typicalShelfLife: '36 Months', tempRangeC: '10–15°C', note: 'Prevents weevil development' },
      frozen: { suitable: false, typicalShelfLife: 'N/A', note: 'Not necessary for dried paddy/milled rice' },
    },
    packagingRequirements: {
      oxygenBarrier: 'Medium',
      moistureBarrier: 'High',
      gasPermeability: 'Restricted',
      mechanicalStrength: 'High',
      sealability: 'High',
      mapSuitability: true,
    },
    preferredPackaging: ['hdpe-film', 'pet-pe', 'mono-pe', 'paper-barrier'],
    aliases: ['basmati rice', 'white rice', 'brown rice', 'paddy'],
    backendCategory: 'Grains & Pulses',
    thumbnailType: 'rice',
    explanationNotes: 'Hygroscopic dried grain; moisture ingress induces mold growth, enzymic rancidity in brown rice, and pest hatching. Requires robust puncture resistance and moisture seal.',
  },
  {
    id: 'wheat',
    name: 'Wheat',
    category: 'Cereal Grains',
    foodGroup: 'Dry Staples',
    state: 'Dried',
    characteristics: {
      moistureSensitivity: 'High',
      oxygenSensitivity: 'Low',
      respiration: 'None',
      microbialRisk: 'Low',
      waterActivity: '0.55',
    },
    storageProfiles: {
      ambient: { suitable: true, typicalShelfLife: '12–24 Months', note: 'Dry ventilated storage required' },
      chilled: { suitable: true, typicalShelfLife: '36 Months', tempRangeC: 'Ambient to 15°C', note: 'Retains germination and baking vigor' },
      frozen: { suitable: false, typicalShelfLife: 'N/A', note: 'Not required' },
    },
    packagingRequirements: {
      oxygenBarrier: 'Low',
      moistureBarrier: 'High',
      gasPermeability: 'Restricted',
      mechanicalStrength: 'High',
      sealability: 'High',
      mapSuitability: false,
    },
    preferredPackaging: ['hdpe-film', 'paper-barrier', 'mono-pe'],
    aliases: ['wheat grain', 'durum wheat', 'whole wheat'],
    backendCategory: 'Grains & Pulses',
    thumbnailType: 'grain',
    explanationNotes: 'Whole kernel requires high moisture barrier to prevent fungal mycotoxin formation and strong tear resistance against abrasive kernels.',
  },
  {
    id: 'wheat-flour',
    name: 'Wheat Flour',
    category: 'Milled Grains',
    foodGroup: 'Dry Staples',
    state: 'Dried',
    characteristics: {
      moistureSensitivity: 'High',
      oxygenSensitivity: 'Medium',
      respiration: 'None',
      microbialRisk: 'Low',
      waterActivity: '0.55',
    },
    storageProfiles: {
      ambient: { suitable: true, typicalShelfLife: '6–9 Months', note: 'Keep in dry dark pantry' },
      chilled: { suitable: true, typicalShelfLife: '12 Months', tempRangeC: '10–15°C', note: 'Retains gluten protein strength' },
      frozen: { suitable: true, typicalShelfLife: '24 Months', note: 'Can be frozen to extend shelf life' },
    },
    packagingRequirements: {
      oxygenBarrier: 'Medium',
      moistureBarrier: 'High',
      gasPermeability: 'Restricted',
      mechanicalStrength: 'High',
      sealability: 'High',
      mapSuitability: false,
    },
    preferredPackaging: ['paper-barrier', 'pet-pe', 'mono-pe', 'hdpe-film'],
    aliases: ['flour', 'atta', 'maida', 'all purpose flour'],
    backendCategory: 'Grains & Pulses',
    thumbnailType: 'grain',
    explanationNotes: 'Fine particulate powder susceptible to moisture clumping and lipid auto-oxidation (rancidity). Requires dust-tight, moisture-impermeable barrier laminates.',
  },
  {
    id: 'maize',
    name: 'Maize',
    category: 'Cereal Grains',
    foodGroup: 'Dry Staples',
    state: 'Dried',
    characteristics: {
      moistureSensitivity: 'High',
      oxygenSensitivity: 'Low',
      respiration: 'None',
      microbialRisk: 'Medium',
      waterActivity: '0.58',
    },
    storageProfiles: {
      ambient: { suitable: true, typicalShelfLife: '12 Months', note: 'Aflatoxin hazard if moisture >13%' },
      chilled: { suitable: true, typicalShelfLife: '24 Months', tempRangeC: 'Ambient to 15°C', note: 'Prevents insect proliferation' },
      frozen: { suitable: false, typicalShelfLife: 'N/A', note: 'Not required for dry corn' },
    },
    packagingRequirements: {
      oxygenBarrier: 'Low',
      moistureBarrier: 'High',
      gasPermeability: 'Restricted',
      mechanicalStrength: 'High',
      sealability: 'High',
      mapSuitability: false,
    },
    preferredPackaging: ['hdpe-film', 'mono-pe', 'paper-barrier'],
    aliases: ['corn', 'dry corn', 'corn grain'],
    backendCategory: 'Grains & Pulses',
    thumbnailType: 'grain',
    explanationNotes: 'Susceptible to Aspergillus flavus and aflatoxin development if moisture penetrates; requires high moisture barrier and puncture protection.',
  },
  {
    id: 'oats',
    name: 'Oats',
    category: 'Cereal Grains',
    foodGroup: 'Dry Staples',
    state: 'Dried',
    characteristics: {
      moistureSensitivity: 'High',
      oxygenSensitivity: 'High',
      respiration: 'None',
      microbialRisk: 'Low',
      waterActivity: '0.50',
    },
    storageProfiles: {
      ambient: { suitable: true, typicalShelfLife: '12 Months', note: 'Store in cool dry conditions' },
      chilled: { suitable: true, typicalShelfLife: '24 Months', tempRangeC: 'Ambient to 10°C', note: 'Inhibits lipase lipid degradation' },
      frozen: { suitable: true, typicalShelfLife: '36 Months', note: 'Preserves delicate fats' },
    },
    packagingRequirements: {
      oxygenBarrier: 'High',
      moistureBarrier: 'High',
      gasPermeability: 'Restricted',
      mechanicalStrength: 'Medium',
      sealability: 'High',
      mapSuitability: true,
    },
    preferredPackaging: ['met-pet-pe', 'pet-barrier-pe', 'paper-barrier', 'mono-pp'],
    aliases: ['rolled oats', 'oatmeal', 'steel cut oats'],
    backendCategory: 'Grains & Pulses',
    thumbnailType: 'grain',
    explanationNotes: 'High unsaturated lipid content (5–9% fat) makes rolled oats sensitive to oxygen-induced rancidity; requires high oxygen and moisture barriers.',
  },

  // ==========================================
  // 18-22: SNACKS / PROCESSED FOODS
  // ==========================================
  {
    id: 'potato-chips',
    name: 'Potato Chips',
    category: 'Fried Snacks',
    foodGroup: 'Processed Food',
    state: 'Processed',
    characteristics: {
      moistureSensitivity: 'High',
      oxygenSensitivity: 'High',
      respiration: 'None',
      microbialRisk: 'Low',
      waterActivity: '0.20',
    },
    storageProfiles: {
      ambient: { suitable: true, typicalShelfLife: '4–6 Months', note: 'Nitrogen gas-flushed packaging standard' },
      chilled: { suitable: false, typicalShelfLife: 'N/A', note: 'Unnecessary and introduces condensation hazard' },
      frozen: { suitable: false, typicalShelfLife: 'N/A', note: 'Causes texture degradation' },
    },
    packagingRequirements: {
      oxygenBarrier: 'High',
      moistureBarrier: 'High',
      gasPermeability: 'Restricted',
      mechanicalStrength: 'Medium',
      sealability: 'High',
      mapSuitability: true,
    },
    preferredPackaging: ['met-pet-pe', 'pet-barrier-pe', 'bopp-film', 'mono-pp'],
    aliases: ['chips', 'crisps', 'potato crisps', 'wafers'],
    backendCategory: 'Bakery & Snacks',
    thumbnailType: 'potato',
    explanationNotes: 'Very low water activity (loss of crispness above aw 0.35) and high frying oil content. Requires light, oxygen, and moisture barrier with 100% N₂ gas cushion.',
  },
  {
    id: 'biscuits',
    name: 'Biscuits',
    category: 'Bakery Confectionery',
    foodGroup: 'Processed Food',
    state: 'Processed',
    characteristics: {
      moistureSensitivity: 'High',
      oxygenSensitivity: 'Medium',
      respiration: 'None',
      microbialRisk: 'Low',
      waterActivity: '0.25',
    },
    storageProfiles: {
      ambient: { suitable: true, typicalShelfLife: '6–9 Months', note: 'Ambient shelf-stable dry holding' },
      chilled: { suitable: false, typicalShelfLife: 'N/A', note: 'Not required' },
      frozen: { suitable: false, typicalShelfLife: 'N/A', note: 'Not recommended' },
    },
    packagingRequirements: {
      oxygenBarrier: 'Medium',
      moistureBarrier: 'High',
      gasPermeability: 'Restricted',
      mechanicalStrength: 'High',
      sealability: 'High',
      mapSuitability: false,
    },
    preferredPackaging: ['bopp-film', 'met-pet-pe', 'mono-pp', 'pet-pe'],
    aliases: ['biscuit', 'crackers', 'digestive biscuits'],
    backendCategory: 'Bakery & Snacks',
    thumbnailType: 'bread',
    explanationNotes: 'Moisture uptake causes loss of snap and crispness. Fragile physical structure requires tight flow-wrap or tray-in-pillow pack for transit cushioning.',
  },
  {
    id: 'cookies',
    name: 'Cookies',
    category: 'Bakery Confectionery',
    foodGroup: 'Processed Food',
    state: 'Processed',
    characteristics: {
      moistureSensitivity: 'High',
      oxygenSensitivity: 'High',
      respiration: 'None',
      microbialRisk: 'Low',
      waterActivity: '0.35',
    },
    storageProfiles: {
      ambient: { suitable: true, typicalShelfLife: '6–9 Months', note: 'Ambient dry storage' },
      chilled: { suitable: false, typicalShelfLife: 'N/A', note: 'Not recommended' },
      frozen: { suitable: false, typicalShelfLife: 'N/A', note: 'Not required for baked goods' },
    },
    packagingRequirements: {
      oxygenBarrier: 'High',
      moistureBarrier: 'High',
      gasPermeability: 'Restricted',
      mechanicalStrength: 'High',
      sealability: 'High',
      mapSuitability: true,
    },
    preferredPackaging: ['met-pet-pe', 'pet-barrier-pe', 'pp-tray', 'mono-pp'],
    aliases: ['cookie', 'chocolate chip cookies', 'baked cookies'],
    backendCategory: 'Bakery & Snacks',
    thumbnailType: 'bread',
    explanationNotes: 'High butter/shortening fat content subject to oxidation. Requires moisture and oxygen barrier laminate plus rigid thermoformed cavity tray.',
  },
  {
    id: 'namkeen',
    name: 'Namkeen',
    category: 'Savory Snacks',
    foodGroup: 'Processed Food',
    state: 'Processed',
    characteristics: {
      moistureSensitivity: 'High',
      oxygenSensitivity: 'High',
      respiration: 'None',
      microbialRisk: 'Low',
      waterActivity: '0.22',
    },
    storageProfiles: {
      ambient: { suitable: true, typicalShelfLife: '6 Months', note: 'Ambient dark storage' },
      chilled: { suitable: false, typicalShelfLife: 'N/A', note: 'Not recommended' },
      frozen: { suitable: false, typicalShelfLife: 'N/A', note: 'Not recommended' },
    },
    packagingRequirements: {
      oxygenBarrier: 'High',
      moistureBarrier: 'High',
      gasPermeability: 'Restricted',
      mechanicalStrength: 'Medium',
      sealability: 'High',
      mapSuitability: true,
    },
    preferredPackaging: ['met-pet-pe', 'pet-barrier-pe', 'mono-pp'],
    aliases: ['bhujia', 'sev', 'savory snack', 'fried lentils'],
    backendCategory: 'Bakery & Snacks',
    thumbnailType: 'potato',
    explanationNotes: 'Deep-fried extruded snacks with high oil surface area. Extremely vulnerable to lipid rancidity and aroma staling; needs high metallized barrier and nitrogen flushing.',
  },
  {
    id: 'breakfast-cereal',
    name: 'Breakfast Cereal',
    category: 'Extruded Grains',
    foodGroup: 'Processed Food',
    state: 'Processed',
    characteristics: {
      moistureSensitivity: 'High',
      oxygenSensitivity: 'Medium',
      respiration: 'None',
      microbialRisk: 'Low',
      waterActivity: '0.25',
    },
    storageProfiles: {
      ambient: { suitable: true, typicalShelfLife: '12 Months', note: 'Ambient dry pantry' },
      chilled: { suitable: false, typicalShelfLife: 'N/A', note: 'Not required' },
      frozen: { suitable: false, typicalShelfLife: 'N/A', note: 'Not required' },
    },
    packagingRequirements: {
      oxygenBarrier: 'Medium',
      moistureBarrier: 'High',
      gasPermeability: 'Restricted',
      mechanicalStrength: 'High',
      sealability: 'High',
      mapSuitability: false,
    },
    preferredPackaging: ['hdpe-film', 'paper-barrier', 'mono-pe', 'bopp-film'],
    aliases: ['cereal', 'cornflakes', 'muesli', 'granola'],
    backendCategory: 'Bakery & Snacks',
    thumbnailType: 'grain',
    explanationNotes: 'Requires bag-in-box construction. Inner co-extruded HDPE/barrier liner shields against ambient humidity while outer paperboard carton supplies mechanical stacking.',
  },

  // ==========================================
  // 23-26: DAIRY
  // ==========================================
  {
    id: 'milk',
    name: 'Milk',
    category: 'Fluid Dairy',
    foodGroup: 'Dairy Products',
    state: 'Liquid',
    characteristics: {
      moistureSensitivity: 'Low',
      oxygenSensitivity: 'High',
      respiration: 'None',
      microbialRisk: 'High',
      waterActivity: '0.99',
    },
    storageProfiles: {
      ambient: { suitable: false, typicalShelfLife: 'Few Hours', note: 'Pasteurized milk spoils within hours at room temp; UHT milk only for ambient' },
      chilled: { suitable: true, typicalShelfLife: '7–12 Days', tempRangeC: '2–4°C', note: 'Strict cold chain for pasteurized fluid milk' },
      frozen: { suitable: false, typicalShelfLife: 'N/A', note: 'Emulsion breakdown occurs upon freezing' },
    },
    packagingRequirements: {
      oxygenBarrier: 'High',
      moistureBarrier: 'High',
      gasPermeability: 'Restricted',
      mechanicalStrength: 'High',
      sealability: 'High',
      mapSuitability: false,
    },
    preferredPackaging: ['hdpe-bottle', 'alu-foil-laminate', 'pet-barrier-pe', 'ldpe-film'],
    aliases: ['pasteurized milk', 'fresh milk', 'whole milk', 'fluid milk'],
    backendCategory: 'Dairy Products',
    thumbnailType: 'milk',
    explanationNotes: 'Liquid emulsion vulnerable to psychrotrophic bacterial proliferation and light-induced photo-oxidation of riboflavin. Requires opaque, leak-proof barrier containment.',
  },
  {
    id: 'paneer',
    name: 'Paneer',
    category: 'Fresh Cheese',
    foodGroup: 'Dairy Products',
    state: 'Fresh',
    characteristics: {
      moistureSensitivity: 'High',
      oxygenSensitivity: 'High',
      respiration: 'None',
      microbialRisk: 'High',
      waterActivity: '0.97',
    },
    storageProfiles: {
      ambient: { suitable: false, typicalShelfLife: '1 Day', note: 'Rapid acidification and yeast/mold growth' },
      chilled: { suitable: true, typicalShelfLife: '14–30 Days', tempRangeC: '2–5°C', note: 'Vacuum or MAP chilled storage' },
      frozen: { suitable: true, typicalShelfLife: '6 Months', note: 'Texture becomes slightly spongy' },
    },
    packagingRequirements: {
      oxygenBarrier: 'High',
      moistureBarrier: 'High',
      gasPermeability: 'Restricted',
      mechanicalStrength: 'High',
      sealability: 'High',
      mapSuitability: true,
    },
    preferredPackaging: ['evoh-multilayer', 'pet-barrier-pe', 'mono-pe'],
    aliases: ['cottage cheese', 'fresh paneer', 'dairy paneer'],
    backendCategory: 'Dairy Products',
    thumbnailType: 'milk',
    explanationNotes: 'High water activity and neutral pH (5.8) make paneer susceptible to bacterial rot and surface mold. Requires EVOH vacuum skin or high-CO₂ MAP barrier pouches.',
  },
  {
    id: 'cheese',
    name: 'Cheese',
    category: 'Cultured Dairy',
    foodGroup: 'Dairy Products',
    state: 'Processed',
    characteristics: {
      moistureSensitivity: 'High',
      oxygenSensitivity: 'High',
      respiration: 'None',
      microbialRisk: 'Medium',
      waterActivity: '0.85',
    },
    storageProfiles: {
      ambient: { suitable: false, typicalShelfLife: '2–3 Days', note: 'Oil weeping and rapid mold development' },
      chilled: { suitable: true, typicalShelfLife: '60–120 Days', tempRangeC: '2–6°C', note: 'Vacuum or gas-flushed chilled holding' },
      frozen: { suitable: false, typicalShelfLife: 'N/A', note: 'Crumbly texture upon thawing' },
    },
    packagingRequirements: {
      oxygenBarrier: 'High',
      moistureBarrier: 'High',
      gasPermeability: 'Restricted',
      mechanicalStrength: 'High',
      sealability: 'High',
      mapSuitability: true,
    },
    preferredPackaging: ['evoh-multilayer', 'pet-barrier-pe', 'pp-tray', 'mono-pe'],
    aliases: ['cheddar', 'hard cheese', 'processed cheese', 'gouda'],
    backendCategory: 'Dairy Products',
    thumbnailType: 'milk',
    explanationNotes: 'Oxygen triggers surface mold (Penicillium) and oxidative fat souring. Requires high EVOH oxygen barrier with anti-mycotic headspace or vacuum barrier seal.',
  },
  {
    id: 'yogurt',
    name: 'Yogurt',
    category: 'Fermented Dairy',
    foodGroup: 'Dairy Products',
    state: 'Liquid',
    characteristics: {
      moistureSensitivity: 'High',
      oxygenSensitivity: 'High',
      respiration: 'None',
      microbialRisk: 'Medium',
      waterActivity: '0.98',
    },
    storageProfiles: {
      ambient: { suitable: false, typicalShelfLife: '1 Day', note: 'Lactic acid overproduction and gas blowing' },
      chilled: { suitable: true, typicalShelfLife: '21–35 Days', tempRangeC: '2–4°C', note: 'Maintains probiotic culture viability' },
      frozen: { suitable: false, typicalShelfLife: 'N/A', note: 'Causes whey separation (syneresis)' },
    },
    packagingRequirements: {
      oxygenBarrier: 'High',
      moistureBarrier: 'High',
      gasPermeability: 'Restricted',
      mechanicalStrength: 'High',
      sealability: 'High',
      mapSuitability: false,
    },
    preferredPackaging: ['pp-container', 'alu-foil-laminate', 'pet-tray', 'mono-pp'],
    aliases: ['yoghurt', 'curd', 'dahi', 'greek yogurt'],
    backendCategory: 'Dairy Products',
    thumbnailType: 'milk',
    explanationNotes: 'Semi-solid cultured dairy sensitive to syneresis (whey pooling), yeast contamination, and oxygen. Requires rigid thermoformed PP/PET tub with hermetic foil or barrier lidding.',
  },

  // ==========================================
  // 27-29: MEAT / FROZEN
  // ==========================================
  {
    id: 'chicken',
    name: 'Chicken',
    category: 'Fresh Poultry',
    foodGroup: 'Meat & Poultry',
    state: 'Fresh',
    characteristics: {
      moistureSensitivity: 'High',
      oxygenSensitivity: 'High',
      respiration: 'None',
      microbialRisk: 'High',
      waterActivity: '0.99',
    },
    storageProfiles: {
      ambient: { suitable: false, typicalShelfLife: 'Few Hours', note: 'High pathogenic bacterial risk (Salmonella, Campylobacter)' },
      chilled: { suitable: true, typicalShelfLife: '7–10 Days', tempRangeC: '0–2°C', note: 'High CO₂ MAP (70% N₂ / 30% CO₂) essential' },
      frozen: { suitable: true, typicalShelfLife: '9–12 Months', note: '-18°C prevents microbial replication' },
    },
    packagingRequirements: {
      oxygenBarrier: 'High',
      moistureBarrier: 'High',
      gasPermeability: 'Restricted',
      mechanicalStrength: 'High',
      sealability: 'High',
      mapSuitability: true,
    },
    preferredPackaging: ['evoh-multilayer', 'pp-tray', 'pet-barrier-pe', 'mono-pe'],
    aliases: ['poultry', 'chicken breast', 'raw chicken', 'broiler'],
    backendCategory: 'Meat & Poultry',
    thumbnailType: 'meat',
    explanationNotes: 'Perishable muscle protein with high neutral-pH water activity. Requires EVOH gas barrier barrier film, leak-proof thermal hermetic seal, and absorbent drip pad.',
  },
  {
    id: 'frozen-peas',
    name: 'Frozen Peas',
    category: 'Frozen Vegetables',
    foodGroup: 'Frozen Goods',
    state: 'Frozen',
    characteristics: {
      moistureSensitivity: 'High',
      oxygenSensitivity: 'Medium',
      respiration: 'None',
      microbialRisk: 'Low',
      waterActivity: '0.85',
    },
    storageProfiles: {
      ambient: { suitable: false, typicalShelfLife: 'Thaws in hours', note: 'Do not store at ambient' },
      chilled: { suitable: false, typicalShelfLife: '2–3 Days thawed', note: 'Thawed produce loses quality quickly' },
      frozen: { suitable: true, typicalShelfLife: '18–24 Months', note: 'Continuous sub-zero (-18°C) frozen holding' },
    },
    packagingRequirements: {
      oxygenBarrier: 'Medium',
      moistureBarrier: 'High',
      gasPermeability: 'Restricted',
      mechanicalStrength: 'High',
      sealability: 'High',
      mapSuitability: false,
    },
    preferredPackaging: ['ldpe-film', 'mono-pe', 'pet-pe'],
    aliases: ['iqf peas', 'frozen green peas'],
    backendCategory: 'Fruits & Vegetables',
    thumbnailType: 'apple',
    explanationNotes: 'Requires sub-zero freeze-crack resistant polyolefin film (EVA modified or metallocene LLDPE) to prevent freezer burn moisture sublimation and puncturing by ice crystals.',
  },
  {
    id: 'frozen-vegetables',
    name: 'Frozen Vegetables',
    category: 'Frozen Vegetables',
    foodGroup: 'Frozen Goods',
    state: 'Frozen',
    characteristics: {
      moistureSensitivity: 'High',
      oxygenSensitivity: 'Medium',
      respiration: 'None',
      microbialRisk: 'Low',
      waterActivity: '0.85',
    },
    storageProfiles: {
      ambient: { suitable: false, typicalShelfLife: 'N/A', note: 'Thaws and degrades' },
      chilled: { suitable: false, typicalShelfLife: 'N/A', note: 'Transient only' },
      frozen: { suitable: true, typicalShelfLife: '12–18 Months', note: '-18°C or colder' },
    },
    packagingRequirements: {
      oxygenBarrier: 'Medium',
      moistureBarrier: 'High',
      gasPermeability: 'Restricted',
      mechanicalStrength: 'High',
      sealability: 'High',
      mapSuitability: false,
    },
    preferredPackaging: ['mono-pe', 'ldpe-film', 'pet-pe'],
    aliases: ['frozen mix veg', 'frozen carrots', 'frozen corn', 'iqf vegetables'],
    backendCategory: 'Fruits & Vegetables',
    thumbnailType: 'apple',
    explanationNotes: 'Vulnerable to moisture sublimation (freezer burn) and cold-embrittlement film shatter during frozen logistics. Requires puncture-proof, moisture-tight low-temp polymers.',
  },

  // ==========================================
  // 30-34: OTHER FOODS
  // ==========================================
  {
    id: 'coffee',
    name: 'Coffee',
    category: 'Beverage Ingredients',
    foodGroup: 'Dry Staples',
    state: 'Dried',
    characteristics: {
      moistureSensitivity: 'High',
      oxygenSensitivity: 'High',
      respiration: 'None',
      microbialRisk: 'Low',
      waterActivity: '0.30',
    },
    storageProfiles: {
      ambient: { suitable: true, typicalShelfLife: '12–18 Months', note: 'Must be sealed against oxygen and light' },
      chilled: { suitable: false, typicalShelfLife: 'N/A', note: 'Condensation damages flavor oils on removal' },
      frozen: { suitable: false, typicalShelfLife: 'N/A', note: 'Moisture condensation risks aroma degradation' },
    },
    packagingRequirements: {
      oxygenBarrier: 'High',
      moistureBarrier: 'High',
      gasPermeability: 'Controlled',
      mechanicalStrength: 'High',
      sealability: 'High',
      mapSuitability: true,
    },
    preferredPackaging: ['alu-foil-laminate', 'pet-barrier-pe', 'met-pet-pe', 'mono-pe'],
    aliases: ['roasted coffee', 'coffee beans', 'ground coffee', 'espresso'],
    backendCategory: 'Bakery & Snacks',
    thumbnailType: 'grain',
    explanationNotes: 'Roasted beans off-gas significant CO₂ while highly vulnerable to oxygen degradation of roasted volatile aromatics. Requires one-way degassing valve and aluminum or metallized barrier.',
  },
  {
    id: 'tea',
    name: 'Tea',
    category: 'Beverage Ingredients',
    foodGroup: 'Dry Staples',
    state: 'Dried',
    characteristics: {
      moistureSensitivity: 'High',
      oxygenSensitivity: 'High',
      respiration: 'None',
      microbialRisk: 'Low',
      waterActivity: '0.40',
    },
    storageProfiles: {
      ambient: { suitable: true, typicalShelfLife: '18–24 Months', note: 'Keep dry away from foreign odorous commodities' },
      chilled: { suitable: false, typicalShelfLife: 'N/A', note: 'Not recommended due to condensation risk' },
      frozen: { suitable: false, typicalShelfLife: 'N/A', note: 'Not recommended' },
    },
    packagingRequirements: {
      oxygenBarrier: 'High',
      moistureBarrier: 'High',
      gasPermeability: 'Restricted',
      mechanicalStrength: 'Medium',
      sealability: 'High',
      mapSuitability: false,
    },
    preferredPackaging: ['alu-foil-laminate', 'met-pet-pe', 'paper-barrier', 'pet-pe'],
    aliases: ['tea leaves', 'black tea', 'green tea', 'loose tea'],
    backendCategory: 'Bakery & Snacks',
    thumbnailType: 'grain',
    explanationNotes: 'Extremely hygroscopic and ready absorber of external volatile odors. Demands total moisture and volatile aroma barrier (aluminum foil or high-barrier metallized film).',
  },
  {
    id: 'spices',
    name: 'Spices',
    category: 'Seasonings',
    foodGroup: 'Dry Staples',
    state: 'Dried',
    characteristics: {
      moistureSensitivity: 'High',
      oxygenSensitivity: 'High',
      respiration: 'None',
      microbialRisk: 'Low',
      waterActivity: '0.45',
    },
    storageProfiles: {
      ambient: { suitable: true, typicalShelfLife: '12–24 Months', note: 'Cool dark storage away from sunlight' },
      chilled: { suitable: false, typicalShelfLife: 'N/A', note: 'Condensation hazard' },
      frozen: { suitable: false, typicalShelfLife: 'N/A', note: 'Not required' },
    },
    packagingRequirements: {
      oxygenBarrier: 'High',
      moistureBarrier: 'High',
      gasPermeability: 'Restricted',
      mechanicalStrength: 'High',
      sealability: 'High',
      mapSuitability: false,
    },
    preferredPackaging: ['alu-foil-laminate', 'pet-barrier-pe', 'met-pet-pe', 'mono-pp'],
    aliases: ['spice', 'turmeric', 'chilli powder', 'pepper', 'cardamom', 'cumin'],
    backendCategory: 'Bakery & Snacks',
    thumbnailType: 'grain',
    explanationNotes: 'Essential volatile terpene oils can migrate and stress-crack lower-grade polymers. Requires high aroma retention barrier (PET / Alu / PE or high-density EVOH).',
  },
  {
    id: 'dry-fruits',
    name: 'Dry Fruits',
    category: 'Dehydrated Produce',
    foodGroup: 'Dry Staples',
    state: 'Dried',
    characteristics: {
      moistureSensitivity: 'High',
      oxygenSensitivity: 'Medium',
      respiration: 'None',
      microbialRisk: 'Low',
      waterActivity: '0.60',
    },
    storageProfiles: {
      ambient: { suitable: true, typicalShelfLife: '9–12 Months', note: 'Ambient cool storage' },
      chilled: { suitable: true, typicalShelfLife: '18 Months', tempRangeC: '4–8°C', note: 'Inhibits insect hatching and sugar bloom' },
      frozen: { suitable: true, typicalShelfLife: '24 Months', note: 'Extends shelf life without cell damage' },
    },
    packagingRequirements: {
      oxygenBarrier: 'High',
      moistureBarrier: 'High',
      gasPermeability: 'Restricted',
      mechanicalStrength: 'Medium',
      sealability: 'High',
      mapSuitability: true,
    },
    preferredPackaging: ['pet-barrier-pe', 'met-pet-pe', 'mono-pe', 'paper-barrier'],
    aliases: ['raisins', 'dried figs', 'dates', 'apricots', 'prunes'],
    backendCategory: 'Fruits & Vegetables',
    thumbnailType: 'apple',
    explanationNotes: 'Intermediate moisture food vulnerable to moisture uptake causing mold, or moisture loss causing hard crystallization (sugar bloom). Requires balanced vapor barrier.',
  },
  {
    id: 'nuts',
    name: 'Nuts',
    category: 'Tree Nuts & Oilseeds',
    foodGroup: 'Dry Staples',
    state: 'Dried',
    characteristics: {
      moistureSensitivity: 'High',
      oxygenSensitivity: 'High',
      respiration: 'None',
      microbialRisk: 'Low',
      waterActivity: '0.45',
    },
    storageProfiles: {
      ambient: { suitable: true, typicalShelfLife: '6–9 Months', note: 'Nitrogen flush extends shelf life' },
      chilled: { suitable: true, typicalShelfLife: '12–18 Months', tempRangeC: '2–6°C', note: 'Greatly retards lipid oxidation' },
      frozen: { suitable: true, typicalShelfLife: '24 Months', note: 'Freezing preserves oils intact' },
    },
    packagingRequirements: {
      oxygenBarrier: 'High',
      moistureBarrier: 'High',
      gasPermeability: 'Restricted',
      mechanicalStrength: 'High',
      sealability: 'High',
      mapSuitability: true,
    },
    preferredPackaging: ['met-pet-pe', 'pet-barrier-pe', 'mono-pe', 'evoh-multilayer'],
    aliases: ['almonds', 'cashews', 'walnuts', 'peanuts', 'pistachios'],
    backendCategory: 'Bakery & Snacks',
    thumbnailType: 'grain',
    explanationNotes: 'Very high lipid content (45–65% mono/polyunsaturated oils) causes rapid rancid off-flavors upon oxygen exposure. Sharp shells and edges demand high puncture resistance and N₂ flushing.',
  },
];

// Conservative fallback profile for unknown / novel foods
export const GENERIC_FOOD_PROFILE: FoodRecord = {
  id: 'generic-food',
  name: 'Generic Commodity',
  category: 'General Commodity',
  foodGroup: 'General Food',
  state: 'Fresh',
  characteristics: {
    moistureSensitivity: 'Medium',
    oxygenSensitivity: 'Medium',
    respiration: 'Medium',
    microbialRisk: 'Medium',
    waterActivity: '0.85',
  },
  storageProfiles: {
    ambient: { suitable: true, typicalShelfLife: '14–30 Days', note: 'Conservative baseline estimation' },
    chilled: { suitable: true, typicalShelfLife: '30–60 Days', tempRangeC: '2–6°C', note: 'Chilled cold chain provides standard stability' },
    frozen: { suitable: true, typicalShelfLife: '180 Days', note: 'Sub-zero frozen baseline' },
  },
  packagingRequirements: {
    oxygenBarrier: 'Medium',
    moistureBarrier: 'Medium',
    gasPermeability: 'Controlled',
    mechanicalStrength: 'Medium',
    sealability: 'High',
    mapSuitability: true,
  },
  preferredPackaging: ['pet-barrier-pe', 'mono-pe', 'pet-pe'],
  aliases: ['generic', 'custom', 'unidentified'],
  backendCategory: 'Fruits & Vegetables',
  thumbnailType: 'apple',
  explanationNotes: 'Preliminary fallback profile based on conservative packaging engineering baselines. Laboratory barrier validation required prior to commercial specification.',
};

let userFoodsGetter: (() => FoodRecord[]) | null = null;

export function registerUserFoodsGetter(getter: () => FoodRecord[]) {
  userFoodsGetter = getter;
}

/**
 * Deterministic food lookup by name or alias (checks user-added foods first, then system library)
 */
export function lookupFoodInDatabase(query: string): { record: FoodRecord; isGenericFallback: boolean } {
  const clean = query.trim().toLowerCase();
  if (!clean) {
    return { record: GENERIC_FOOD_PROFILE, isGenericFallback: true };
  }

  // 1. Check user-added foods first
  if (userFoodsGetter) {
    try {
      const userFoods = userFoodsGetter();
      // Exact ID or name match
      const userExact = userFoods.find(
        (f) => f.id.toLowerCase() === clean || f.name.toLowerCase() === clean
      );
      if (userExact) return { record: userExact, isGenericFallback: false };

      // Alias exact match
      const userAlias = userFoods.find((f) =>
        f.aliases?.some((a) => a.toLowerCase() === clean)
      );
      if (userAlias) return { record: userAlias, isGenericFallback: false };

      // Substring match
      const userPartial = userFoods.find((f) => {
        const fLower = f.name.toLowerCase();
        return clean.includes(fLower) || fLower.includes(clean);
      });
      if (userPartial) return { record: userPartial, isGenericFallback: false };
    } catch (e) {
      console.error('Error querying user foods:', e);
    }
  }

  // 2. Check system database
  // Exact ID or name match
  const exact = FOOD_DATABASE.find(
    (f) => f.id === clean || f.name.toLowerCase() === clean
  );
  if (exact) return { record: { ...exact, source: exact.source || 'system' }, isGenericFallback: false };

  // Alias exact match
  const aliasMatch = FOOD_DATABASE.find((f) =>
    f.aliases.some((a) => a.toLowerCase() === clean)
  );
  if (aliasMatch) return { record: { ...aliasMatch, source: aliasMatch.source || 'system' }, isGenericFallback: false };

  // Substring match (e.g. "fresh mangoes" matches "mango")
  const partial = FOOD_DATABASE.find((f) => {
    const fLower = f.name.toLowerCase();
    return clean.includes(fLower) || fLower.includes(clean) ||
      f.aliases.some((a) => clean.includes(a.toLowerCase()) || a.toLowerCase().includes(clean));
  });
  if (partial) return { record: { ...partial, source: partial.source || 'system' }, isGenericFallback: false };

  // Fallback with custom name injected
  return {
    record: {
      ...GENERIC_FOOD_PROFILE,
      id: `custom-${clean.replace(/\s+/g, '-')}`,
      name: query.trim(),
      source: 'system',
    },
    isGenericFallback: true,
  };
}

export const foodDatabase = FOOD_DATABASE;
export default FOOD_DATABASE;
