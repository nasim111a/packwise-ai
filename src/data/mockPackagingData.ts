import { PackagingAnalysis, FoodProfile, PackagingMaterialInfo } from '../types/packaging';
import { FOOD_DATABASE } from './foodDatabase';

export const RECENT_ANALYSES: PackagingAnalysis[] = [
  {
    id: 'AN-2026-0928',
    product: 'Tomato',
    category: 'Fruits & Vegetables',
    status: 'Completed',
    date: '28 Sep 2026',
    recommendedMaterial: 'Bio-based PLA Perforated Clamshell',
    secondaryMaterial: 'Micro-perforated Recycled PET (rPET)',
    shelfLifeGain: '+9 days (18 days total)',
    sustainabilityRating: 94,
    wvtRate: '18.4 g/m²/24h',
    otRate: '850 cc/m²/24h (Anti-Fog Micro-vent)',
    storageCondition: '12°C, 85-90% RH',
    transitMethod: 'Reefer truck (Ambient buffer allowed)',
    targetShelfLife: '14 – 21 days',
    co2Reduction: '-38% vs virgin PET',
    mapGasMix: '3% O₂, 5% CO₂, 92% N₂',
    notes: 'Micro-perforations regulate respiration to suppress fungal botrytis without triggering anaerobic ethanol fermentation.',
    thumbnailType: 'tomato',
  },
  {
    id: 'AN-2026-0927',
    product: 'Rice',
    category: 'Grains & Pulses',
    status: 'In Progress',
    date: '27 Sep 2026',
    recommendedMaterial: '3-Ply Kraft Paper / Bio-Wax / EVOH Liner',
    secondaryMaterial: 'Monopolymer Metallized PP Standup Pouch',
    shelfLifeGain: '+180 days (365 days total)',
    sustainabilityRating: 88,
    wvtRate: '0.8 g/m²/24h',
    otRate: '1.2 cc/m²/24h',
    storageCondition: '20°C, <60% RH',
    transitMethod: 'Dry cargo standard pallet container',
    targetShelfLife: '12 – 24 months',
    co2Reduction: '-46% fossil plastic elimination',
    mapGasMix: 'Vacuum sealed or 99.5% N₂ flush',
    notes: 'Moisture ingress barrier critical to prevent weevil infestation, mold formation, and free fatty acid rancidity in aromatic rice.',
    thumbnailType: 'rice',
  },
  {
    id: 'AN-2026-0925',
    product: 'Milk',
    category: 'Dairy Products',
    status: 'Completed',
    date: '25 Sep 2026',
    recommendedMaterial: 'Light-Blocking High-Barrier HDPE Bottle (Titanium Dioxide-free)',
    secondaryMaterial: 'Aseptic FSC-Certified Multi-Layer Carton (Al-free EVOH)',
    shelfLifeGain: '+6 days cold chain stability',
    sustainabilityRating: 91,
    wvtRate: '0.12 g/m²/24h',
    otRate: '0.4 cc/m²/24h',
    storageCondition: '2°C strict cold chain',
    transitMethod: 'Active temperature-monitored refrigerated transport',
    targetShelfLife: '18 – 22 days',
    co2Reduction: '-28% life cycle carbon',
    mapGasMix: 'Headspace sterile nitrogen blanket',
    notes: 'UV and blue-wavelength light blocking (<450 nm) prevents riboflavin photo-oxidation and sunlight off-flavor development.',
    thumbnailType: 'milk',
  },
  {
    id: 'AN-2026-0924',
    product: 'Potato',
    category: 'Fruits & Vegetables',
    status: 'Draft',
    date: '24 Sep 2026',
    recommendedMaterial: 'Opaque Breathable Paper-Mesh Composite Sack',
    secondaryMaterial: 'Light-shielded Jute / Bio-Polymer blend',
    shelfLifeGain: '+25 days sprout inhibition',
    sustainabilityRating: 86,
    wvtRate: '35.0 g/m²/24h (High permeability)',
    otRate: 'High gas exchange (>2500 cc/m²/24h)',
    storageCondition: '8°C, 90% RH (Darkness critical)',
    transitMethod: 'Ventilated dry distribution',
    targetShelfLife: '60 – 90 days',
    co2Reduction: '-52% vs conventional LDPE sacks',
    notes: 'Light exclusion is vital to arrest solanine (green glycoalkaloid) synthesis; high breathability prevents blackheart asphyxiation.',
    thumbnailType: 'potato',
  },
  {
    id: 'AN-2026-0922',
    product: 'Apple',
    category: 'Fruits & Vegetables',
    status: 'Completed',
    date: '22 Sep 2026',
    recommendedMaterial: 'Active 1-MCP Impregnated Molded Fiber Tray + PLA Stretch Wrap',
    secondaryMaterial: 'Recyclable Mono-PET Punnet with Ethylene Scavenger Sachet',
    shelfLifeGain: '+14 days post-harvest crispness',
    sustainabilityRating: 95,
    wvtRate: '22.0 g/m²/24h',
    otRate: '1200 cc/m²/24h',
    storageCondition: '1°C, 90-95% RH',
    transitMethod: 'CA (Controlled Atmosphere) Reefer shipping',
    targetShelfLife: '30 – 45 days',
    co2Reduction: '-62% vs polystyrene packaging',
    mapGasMix: '2% O₂, 1.5% CO₂, balance N₂',
    notes: 'Integrated 1-Methylcyclopropene slow-release film delays ripening cascade and internal flesh browning during logistics.',
    thumbnailType: 'apple',
  },
];

export const CATEGORY_DISTRIBUTION = [
  { name: 'Fruits & Vegetables', percentage: 42, count: 10, color: 'var(--brand-primary)' },
  { name: 'Grains & Pulses', percentage: 20, count: 5, color: 'var(--accent-gold)' },
  { name: 'Dairy Products', percentage: 15, count: 4, color: 'var(--accent-blue)' },
  { name: 'Bakery & Snacks', percentage: 10, count: 2, color: 'var(--accent-pink)' },
  { name: 'Meat & Poultry', percentage: 8, count: 2, color: 'var(--accent-red)' },
  { name: 'Others', percentage: 5, count: 1, color: 'var(--accent-purple)' },
];

export const ANALYSIS_TRENDS_DATA: Record<string, { month: string; count: number; sustainableShare: number }[]> = {
  'Last 6 Months': [
    { month: 'Apr', count: 5, sustainableShare: 3 },
    { month: 'May', count: 6, sustainableShare: 4 },
    { month: 'Jun', count: 8, sustainableShare: 6 },
    { month: 'Jul', count: 10, sustainableShare: 7 },
    { month: 'Aug', count: 9, sustainableShare: 7 },
    { month: 'Sep', count: 14, sustainableShare: 11 },
  ],
  'Last 3 Months': [
    { month: 'Jul', count: 10, sustainableShare: 7 },
    { month: 'Aug', count: 9, sustainableShare: 7 },
    { month: 'Sep', count: 14, sustainableShare: 11 },
  ],
  'Year to Date': [
    { month: 'Jan', count: 2, sustainableShare: 1 },
    { month: 'Feb', count: 3, sustainableShare: 2 },
    { month: 'Mar', count: 4, sustainableShare: 3 },
    { month: 'Apr', count: 5, sustainableShare: 3 },
    { month: 'May', count: 6, sustainableShare: 4 },
    { month: 'Jun', count: 8, sustainableShare: 6 },
    { month: 'Jul', count: 10, sustainableShare: 7 },
    { month: 'Aug', count: 9, sustainableShare: 7 },
    { month: 'Sep', count: 14, sustainableShare: 11 },
  ],
};

export const TOP_MATERIALS = [
  {
    name: 'Biodegradable Film',
    percentage: 32,
    subtext: 'PLA / PHA blends & starch-based polymers',
    grade: 'Industrial Compostable (EN 13432)',
    accent: 'var(--brand-primary)',
    bg: 'var(--badge-completed-bg)',
  },
  {
    name: 'Multilayer Film',
    percentage: 24,
    subtext: 'EVOH high barrier / PE recyclable laminate',
    grade: 'High O₂ & H₂O Barrier',
    accent: 'var(--brand-secondary)',
    bg: 'var(--badge-completed-bg)',
  },
  {
    name: 'PET',
    percentage: 18,
    subtext: 'Up to 100% PCR food-grade recycled rPET',
    grade: 'Circular Stream (Code 1)',
    accent: 'var(--accent-blue)',
    bg: 'var(--accent-blue-soft)',
  },
  {
    name: 'Paper-based',
    percentage: 12,
    subtext: 'Aqueous barrier dispersion coated kraft',
    grade: 'Curbside Recyclable (PTS-RH 021)',
    accent: 'var(--accent-gold)',
    bg: 'var(--accent-gold-soft)',
  },
  {
    name: 'HDPE',
    percentage: 8,
    subtext: 'Lightweight mono-material rigid bottles',
    grade: 'Widely Recycled (Code 2)',
    accent: 'var(--accent-purple)',
    bg: 'var(--accent-purple-soft)',
  },
];

export const FOOD_DATABASE_ITEMS: FoodProfile[] = FOOD_DATABASE.map((item, idx) => {
  const respRate: FoodProfile['respirationRate'] =
    item.characteristics.respiration === 'High'
      ? 'High'
      : item.characteristics.respiration === 'Medium'
      ? 'Moderate'
      : item.characteristics.respiration === 'Low'
      ? 'Low'
      : 'Very Low';

  const ethylSens: FoodProfile['ethyleneSensitivity'] =
    item.characteristics.respiration === 'High'
      ? 'High'
      : item.characteristics.oxygenSensitivity === 'High'
      ? 'Medium'
      : 'Low';

  const optTemp =
    item.storageProfiles.chilled.suitable && item.storageProfiles.chilled.tempRangeC
      ? item.storageProfiles.chilled.tempRangeC
      : item.storageProfiles.ambient.suitable
      ? '18°C – 22°C (Ambient)'
      : '-18°C (Frozen)';

  const optRH =
    item.state === 'Fresh'
      ? '85% – 95% RH'
      : item.state === 'Dried'
      ? '< 60% RH'
      : 'Standard Ambient';

  const degFactors = [
    item.characteristics.moistureSensitivity === 'High'
      ? 'Moisture sorption / transpiration loss'
      : 'Moisture migration',
    item.characteristics.oxygenSensitivity === 'High'
      ? 'Oxidative rancidity / vitamin loss'
      : 'Slow ambient oxidation',
    item.characteristics.microbialRisk === 'High'
      ? 'Pathogenic & spoilage bacterial growth'
      : 'Fungal and mold vulnerability',
  ];

  return {
    id: `FD-${String(idx + 1).padStart(2, '0')}`,
    name: item.name,
    category: item.backendCategory,
    waterActivity: parseFloat(item.characteristics.waterActivity || '0.85'),
    respirationRate: respRate,
    ethyleneSensitivity: ethylSens,
    optimalTemp: optTemp,
    optimalRH: optRH,
    keyDegradationFactors: degFactors,
    recommendedPackagingMethod: `${
      item.preferredPackaging[0] ? item.preferredPackaging[0].replace(/-/g, ' ').toUpperCase() : 'Barrier film'
    } with moisture & gas regulation`,
  };
});

export const PACKAGING_MATERIALS_CATALOG: PackagingMaterialInfo[] = [
  {
    id: 'MAT-PLA',
    name: 'Polylactic Acid (PLA)',
    type: 'Bio-Polymer',
    sharePercentage: 32,
    recyclability: 'Industrial Compostable (ISO 17088)',
    biodegradability: '100% bio-degradable in commercial composting (58°C, 90 days)',
    otrBarrier: 'Medium',
    wvtrBarrier: 'Low to Medium',
    tensileStrength: '50 – 70 MPa',
    co2Footprint: '1.3 kg CO₂e / kg (vs 2.3 for virgin PET)',
    typicalUses: ['Salad clamshells', 'Fresh cut fruit punnets', 'Window envelopes', 'Cold beverage cups'],
  },
  {
    id: 'MAT-EVOH',
    name: 'EVOH Multilayer Barrier',
    type: 'Multilayer Barrier',
    sharePercentage: 24,
    recyclability: 'Recyclable in Polyolefin Streams (if EVOH < 5% wt)',
    biodegradability: 'Non-biodegradable',
    otrBarrier: 'Very High',
    wvtrBarrier: 'Medium (hydrophilic; protected by PE skins)',
    tensileStrength: '75 – 95 MPa',
    co2Footprint: '3.1 kg CO₂e / kg',
    typicalUses: ['MAP meat trays', 'Aseptic milk cartons', 'Coffee valves & capsules', 'Dry baby food pouches'],
  },
  {
    id: 'MAT-RPET',
    name: 'Recycled Polyethylene Terephthalate (rPET)',
    type: 'Recycled Plastic',
    sharePercentage: 18,
    recyclability: '100% Closed Loop Recyclable (SPI Code 1)',
    biodegradability: 'Non-biodegradable',
    otrBarrier: 'High',
    wvtrBarrier: 'High',
    tensileStrength: '60 – 80 MPa',
    co2Footprint: '0.9 kg CO₂e / kg (70% carbon savings vs virgin PET)',
    typicalUses: ['Thermoformed berry punnets', 'Cold beverage bottles', 'Bakery dome lids'],
  },
  {
    id: 'MAT-KRAFT',
    name: 'Barrier Dispersion Kraft Paper',
    type: 'Cellulose / Paper',
    sharePercentage: 12,
    recyclability: 'Repulpable & Curbside Recyclable (PTS Method)',
    biodegradability: 'Soil & Aquatic biodegradable base substrate',
    otrBarrier: 'High (with waterborne dispersion)',
    wvtrBarrier: 'Medium to High (mineral coating)',
    tensileStrength: '45 – 65 MPa',
    co2Footprint: '0.7 kg CO₂e / kg',
    typicalUses: ['Grain sacks', 'Flour & starch packaging', 'Dry snack multi-wall bags'],
  },
  {
    id: 'MAT-HDPE',
    name: 'High-Density Polyethylene (HDPE)',
    type: 'Rigid Polymer',
    sharePercentage: 8,
    recyclability: 'Widely Recycled (SPI Code 2)',
    biodegradability: 'Non-biodegradable',
    otrBarrier: 'Medium',
    wvtrBarrier: 'Very High',
    tensileStrength: '25 – 35 MPa',
    co2Footprint: '1.8 kg CO₂e / kg',
    typicalUses: ['Fresh pasteurized milk jugs', 'Edible oil containers', 'Bulk produce storage crates'],
  },
];
