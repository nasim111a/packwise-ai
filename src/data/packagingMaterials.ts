export type MaterialCategory = 'Flexible Packaging' | 'Rigid Packaging' | 'Sustainable / Recyclable';
export type BarrierLevel = 'High' | 'Medium' | 'Low';
export type GasPermeabilityProperty = 'Controlled' | 'Restricted' | 'High Exchange';
export type MechanicalStrengthProperty = 'High' | 'Medium' | 'Standard';
export type SealabilityProperty = 'High' | 'Standard';

export interface PackagingMaterialRecord {
  id: string;
  name: string;
  shortName: string;
  category: MaterialCategory;
  structure: string[];
  properties: {
    oxygenBarrier: BarrierLevel;
    moistureBarrier: BarrierLevel;
    gasPermeability: GasPermeabilityProperty;
    mechanicalStrength: MechanicalStrengthProperty;
    sealability: SealabilityProperty;
    mapSuitability: boolean;
  };
  sustainability: {
    recyclability: string;
    materialComplexity: 'Single-layer' | 'Mono-material laminate' | 'Multi-layer' | 'Bio-based / Compostable';
    endOfLife: string;
    qualitativeRating: 'High' | 'Moderate' | 'Low' | 'Compostable';
  };
  applications: string[];
  specifications: {
    otr: string; // Oxygen Transmission Rate
    wvtr: string; // Water Vapor Transmission Rate
    thickness: string; // Standard gauge
    density?: string;
  };
  estimatedCost: {
    costPerPackage: string;
    basis: string;
  };
  description: string;
  pros: string[];
  cons: string[];
}

export const PACKAGING_MATERIALS_DATABASE: PackagingMaterialRecord[] = [
  // ==========================================
  // 1-11: FLEXIBLE PACKAGING
  // ==========================================
  {
    id: 'ldpe-film',
    name: 'LDPE (Low-Density Polyethylene)',
    shortName: 'LDPE Film',
    category: 'Flexible Packaging',
    structure: ['Low-Density Polyethylene (Monolayer Film)'],
    properties: {
      oxygenBarrier: 'Low',
      moistureBarrier: 'Medium',
      gasPermeability: 'High Exchange',
      mechanicalStrength: 'Standard',
      sealability: 'High',
      mapSuitability: false,
    },
    sustainability: {
      recyclability: 'High (Code 4 LDPE Stream)',
      materialComplexity: 'Single-layer',
      endOfLife: 'Widely collected in soft-plastic drop-off and mechanical recycling programs',
      qualitativeRating: 'High',
    },
    applications: ['Fresh Vegetables', 'Frozen Food Overwrap', 'Bread Bags', 'Produce Liners'],
    specifications: {
      otr: '2,500 – 3,500 cc/m²/24h',
      wvtr: '15.0 – 20.0 g/m²/24h',
      thickness: '40 – 60 µm',
    },
    estimatedCost: {
      costPerPackage: '$0.012 – $0.018 / package',
      basis: 'Commodity polyolefin blown extrusion indexing',
    },
    description: 'High-clarity, ductile polyolefin film offering good moisture protection and high seal integrity, with moderate breathability suited for chilled produce.',
    pros: ['Cost-effective and widely available', 'Excellent tear resistance and low-temp flex crack resistance', 'Established mechanical recycling stream (RIC 4)'],
    cons: ['Very poor oxygen barrier', 'Cannot retain modified atmosphere gases long-term'],
  },
  {
    id: 'hdpe-film',
    name: 'HDPE (High-Density Polyethylene Film)',
    shortName: 'HDPE Film',
    category: 'Flexible Packaging',
    structure: ['High-Density Polyethylene (Oriented / Blown Film)'],
    properties: {
      oxygenBarrier: 'Low',
      moistureBarrier: 'High',
      gasPermeability: 'Restricted',
      mechanicalStrength: 'High',
      sealability: 'Standard',
      mapSuitability: false,
    },
    sustainability: {
      recyclability: 'High (Code 2 HDPE Stream)',
      materialComplexity: 'Single-layer',
      endOfLife: 'Fully compatible with rigid and flexible polyolefin recycling systems',
      qualitativeRating: 'High',
    },
    applications: ['Cereal Box Liners', 'Dry Bulk Grains', 'Bakery Mixes', 'Produce Sacks'],
    specifications: {
      otr: '1,200 – 1,800 cc/m²/24h',
      wvtr: '4.0 – 6.5 g/m²/24h',
      thickness: '35 – 50 µm',
    },
    estimatedCost: {
      costPerPackage: '$0.015 – $0.022 / package',
      basis: 'Standard high-density virgin resin benchmark',
    },
    description: 'Semi-translucent, crinkly moisture-barrier film delivering exceptional water vapor resistance and puncture resistance for dry staples.',
    pros: ['Excellent moisture vapor barrier at low cost', 'Superior tensile stiffness and dead-fold', 'Widely recyclable (RIC 2)'],
    cons: ['Translucent / milky optical appearance', 'Low oxygen barrier'],
  },
  {
    id: 'pp-film',
    name: 'PP (Polypropylene Film)',
    shortName: 'Cast PP Film',
    category: 'Flexible Packaging',
    structure: ['Cast Polypropylene (CPP)'],
    properties: {
      oxygenBarrier: 'Low',
      moistureBarrier: 'Medium',
      gasPermeability: 'Controlled',
      mechanicalStrength: 'Medium',
      sealability: 'High',
      mapSuitability: false,
    },
    sustainability: {
      recyclability: 'High (Code 5 PP Stream)',
      materialComplexity: 'Single-layer',
      endOfLife: 'Recyclable via PP stream where local collection infrastructure exists',
      qualitativeRating: 'High',
    },
    applications: ['Bakery Products', 'Fresh Herbs', 'Pasta Pouches', 'Confectionery'],
    specifications: {
      otr: '1,500 – 2,200 cc/m²/24h',
      wvtr: '8.0 – 12.0 g/m²/24h',
      thickness: '30 – 50 µm',
    },
    estimatedCost: {
      costPerPackage: '$0.016 – $0.024 / package',
      basis: 'Polypropylene homopolymer resin pricing',
    },
    description: 'Glossy cast polyolefin film providing good gloss, heat resistance, and reliable heat-seal performance across diverse temperature ranges.',
    pros: ['High optical gloss and transparency', 'Higher heat tolerance than PE (retort compatible)', 'Recyclable in polyolefin streams'],
    cons: ['Moderate oxygen barrier limits shelf life for oxidation-sensitive items'],
  },
  {
    id: 'bopp-film',
    name: 'BOPP (Biaxially Oriented Polypropylene)',
    shortName: 'BOPP Pouch Film',
    category: 'Flexible Packaging',
    structure: ['Biaxially Oriented Polypropylene (BOPP)'],
    properties: {
      oxygenBarrier: 'Medium',
      moistureBarrier: 'High',
      gasPermeability: 'Restricted',
      mechanicalStrength: 'High',
      sealability: 'Standard',
      mapSuitability: false,
    },
    sustainability: {
      recyclability: 'Moderate to High (Polyolefin Stream)',
      materialComplexity: 'Single-layer',
      endOfLife: 'Mechanically recyclable with mono-material PP streams',
      qualitativeRating: 'High',
    },
    applications: ['Biscuits', 'Snack Wrappers', 'Dried Fruits', 'Confectionery Flow-wraps'],
    specifications: {
      otr: '1,000 – 1,500 cc/m²/24h',
      wvtr: '4.5 – 6.0 g/m²/24h',
      thickness: '20 – 35 µm',
    },
    estimatedCost: {
      costPerPackage: '$0.018 – $0.026 / package',
      basis: 'Biaxially oriented film standard gauge quote',
    },
    description: 'High-clarity, high-tensile packaging substrate with remarkable water vapor resistance and printability for snack foods and dry goods.',
    pros: ['Exceptional dimensional stability and optical clarity', 'Strong moisture barrier protects crisp texture', 'Mono-material PP recycling readiness'],
    cons: ['Low tear propagation resistance once notched', 'Requires coating or barrier core for oxygen barrier'],
  },
  {
    id: 'pet-pe',
    name: 'PET / PE (Polyethylene Terephthalate / Polyethylene)',
    shortName: 'PET / PE Duplex',
    category: 'Flexible Packaging',
    structure: ['BOPET (Outer Print Layer)', 'LLDPE (Inner Sealant Layer)'],
    properties: {
      oxygenBarrier: 'Medium',
      moistureBarrier: 'Medium',
      gasPermeability: 'Restricted',
      mechanicalStrength: 'High',
      sealability: 'High',
      mapSuitability: true,
    },
    sustainability: {
      recyclability: 'Moderate',
      materialComplexity: 'Multi-layer',
      endOfLife: 'Mixed multi-polymer laminate; requires specialized separation or chemical recycling',
      qualitativeRating: 'Moderate',
    },
    applications: ['Rice', 'Frozen Vegetables', 'Processed Snacks', 'Dry Fruits', 'Pasta'],
    specifications: {
      otr: '90 – 130 cc/m²/24h',
      wvtr: '5.0 – 8.0 g/m²/24h',
      thickness: '60 – 80 µm',
    },
    estimatedCost: {
      costPerPackage: '$0.022 – $0.030 / package',
      basis: 'Standard adhesive lamination duplex converter price',
    },
    description: 'Widely adopted general-purpose duplex laminate combining tough, scratch-resistant outer PET with ductile, hermetic sealing polyethylene.',
    pros: ['Excellent puncture resistance and drop impact tolerance', 'High thermal seal integrity', 'Superior print reproduction quality'],
    cons: ['Multi-material composition hampers mechanical recycling', 'Moderate oxygen barrier for long-shelf-life sensitive items'],
  },
  {
    id: 'pet-barrier-pe',
    name: 'PET / Barrier / PE',
    shortName: 'PET / Barrier / PE Triplex',
    category: 'Flexible Packaging',
    structure: ['BOPET (Outer Layer, 12 µm)', 'EVOH / AlOx High-Barrier Core (4 µm)', 'LLDPE (Inner Sealant, 50 µm)'],
    properties: {
      oxygenBarrier: 'High',
      moistureBarrier: 'High',
      gasPermeability: 'Controlled',
      mechanicalStrength: 'High',
      sealability: 'High',
      mapSuitability: true,
    },
    sustainability: {
      recyclability: 'Moderate',
      materialComplexity: 'Multi-layer',
      endOfLife: 'Advanced recycling or thermal energy recovery; EVOH tie layer compatible with modern compatibilizers',
      qualitativeRating: 'Moderate',
    },
    applications: ['Mango & Chilled Fruits', 'Processed Snacks', 'Cheese', 'Dry Fruits', 'Prepared Meals'],
    specifications: {
      otr: '1.5 – 5.0 cc/m²/24h',
      wvtr: '1.8 – 3.2 g/m²/24h',
      thickness: '65 – 75 µm',
    },
    estimatedCost: {
      costPerPackage: '$0.028 – $0.038 / package',
      basis: 'High-barrier co-extrusion / solventless lamination quote',
    },
    description: 'Gold-standard high-barrier multilayer flexible structure designed for oxygen- and moisture-sensitive foods under chilled or extended ambient logistics.',
    pros: ['Exceptional dual barrier against both oxygen and moisture vapor', 'Hermetic seal integrity under vibration', 'Supports protective modified atmosphere gas retention (MAP)'],
    cons: ['Multilayer structure requires compatibilizers for polyolefin recycling', 'Higher resin processing cost'],
  },
  {
    id: 'met-pet-pe',
    name: 'Metallized PET / PE (Met-PET / PE)',
    shortName: 'Met-PET / PE Laminate',
    category: 'Flexible Packaging',
    structure: ['PET (12 µm)', 'Vacuum Metallized Aluminum Layer (~0.03 µm)', 'LLDPE Sealant (50 µm)'],
    properties: {
      oxygenBarrier: 'High',
      moistureBarrier: 'High',
      gasPermeability: 'Restricted',
      mechanicalStrength: 'High',
      sealability: 'High',
      mapSuitability: true,
    },
    sustainability: {
      recyclability: 'Moderate',
      materialComplexity: 'Multi-layer',
      endOfLife: 'Ultra-thin metallization allows recycling in specialized technical streams',
      qualitativeRating: 'Moderate',
    },
    applications: ['Potato Chips', 'Nuts', 'Namkeen', 'Cookies', 'Ground Spices'],
    specifications: {
      otr: '0.8 – 2.0 cc/m²/24h',
      wvtr: '0.8 – 1.5 g/m²/24h',
      thickness: '65 – 80 µm',
    },
    estimatedCost: {
      costPerPackage: '$0.026 – $0.036 / package',
      basis: 'Vacuum metal deposition laminate standard benchmark',
    },
    description: 'Reflective silver barrier laminate engineered for lipid-rich snacks that require total light blocking, high oxygen barrier, and zero water vapor ingress.',
    pros: ['Total opacity protects against light-induced lipid oxidation', 'High barrier at lower cost and weight than solid aluminum foil', 'Exceptional crispness preservation'],
    cons: ['Flex-cracking can degrade barrier performance under severe crumpling', 'Opaque: product not visible from outside'],
  },
  {
    id: 'alu-foil-laminate',
    name: 'Aluminum Foil Laminate (PET / Alu / PE)',
    shortName: 'Alu-Foil Triplex',
    category: 'Flexible Packaging',
    structure: ['BOPET (12 µm)', 'Pure Aluminum Foil Barrier (7–9 µm)', 'LLDPE Sealant (60 µm)'],
    properties: {
      oxygenBarrier: 'High',
      moistureBarrier: 'High',
      gasPermeability: 'Restricted',
      mechanicalStrength: 'High',
      sealability: 'High',
      mapSuitability: true,
    },
    sustainability: {
      recyclability: 'Low',
      materialComplexity: 'Multi-layer',
      endOfLife: 'Difficult to separate foil from polymers without pyrolysis or thermal delamination',
      qualitativeRating: 'Low',
    },
    applications: ['Coffee Beans & Ground Coffee', 'Tea Leaves', 'Delicate Spices', 'Infant Formula'],
    specifications: {
      otr: '< 0.1 cc/m²/24h (Near absolute barrier)',
      wvtr: '< 0.1 g/m²/24h (Near absolute barrier)',
      thickness: '80 – 110 µm',
    },
    estimatedCost: {
      costPerPackage: '$0.045 – $0.065 / package',
      basis: 'Solid rolled aluminum foil raw material quote',
    },
    description: 'Absolute hermetic barrier laminate providing zero gas permeation, zero moisture vapor transmission, and 100% light blockage for high-value aromatics.',
    pros: ['Impermeable barrier protects volatile aromas for 24+ months', 'Total light and gas blockade', 'Superior puncture strength and dead-fold'],
    cons: ['Heavy carbon footprint in raw foil manufacturing', 'Non-recyclable in standard municipal recycling programs', 'Prone to pinholing if repeatedly folded'],
  },
  {
    id: 'evoh-multilayer',
    name: 'EVOH-based Multilayer (PE / EVOH / PE)',
    shortName: 'EVOH Multilayer Barrier',
    category: 'Flexible Packaging',
    structure: ['LLDPE Outer Layer', 'Adhesive Tie Layer', 'EVOH Barrier Core', 'Adhesive Tie Layer', 'LLDPE Sealant'],
    properties: {
      oxygenBarrier: 'High',
      moistureBarrier: 'High',
      gasPermeability: 'Restricted',
      mechanicalStrength: 'High',
      sealability: 'High',
      mapSuitability: true,
    },
    sustainability: {
      recyclability: 'High (RecyClass Approved Polyolefin Compatible)',
      materialComplexity: 'Mono-material laminate',
      endOfLife: '<5% EVOH content allows mechanical recycling in standard PE stream',
      qualitativeRating: 'High',
    },
    applications: ['Fresh Meat & Poultry', 'Paneer', 'Cheese', 'Nuts', 'Vacuum Skin Packs'],
    specifications: {
      otr: '1.0 – 3.0 cc/m²/24h',
      wvtr: '2.0 – 4.0 g/m²/24h',
      thickness: '70 – 90 µm',
    },
    estimatedCost: {
      costPerPackage: '$0.032 – $0.042 / package',
      basis: '5-layer / 7-layer blown co-extrusion cost basis',
    },
    description: 'Co-extruded barrier film specifically tuned for vacuum skin packaging and modified atmosphere packaging of perishables, retaining full PE recyclability.',
    pros: ['Extreme oxygen barrier prevents meat discolouration and microbial slime', 'Designed to be RecyClass certified for circular PE recycling streams', 'Excellent deep-draw thermoforming and puncture resistance'],
    cons: ['EVOH barrier sensitive to humidity if outer layers are breached', 'Requires precise co-extrusion temperature control'],
  },
  {
    id: 'breathable-film',
    name: 'Breathable Film (Micro-porous Breathable PE)',
    shortName: 'Breathable Produce Film',
    category: 'Flexible Packaging',
    structure: ['Calcium Carbonate Filled Oriented Polyethylene (Micro-porous)'],
    properties: {
      oxygenBarrier: 'Low',
      moistureBarrier: 'Low',
      gasPermeability: 'Controlled',
      mechanicalStrength: 'Medium',
      sealability: 'Standard',
      mapSuitability: true,
    },
    sustainability: {
      recyclability: 'High (Code 4 PE Stream)',
      materialComplexity: 'Single-layer',
      endOfLife: 'Polyolefin recycling stream compatible',
      qualitativeRating: 'High',
    },
    applications: ['Mango', 'Banana', 'Avocados', 'Mushrooms', 'High Respiration Fruit'],
    specifications: {
      otr: '4,000 – 8,000 cc/m²/24h',
      wvtr: '40.0 – 80.0 g/m²/24h',
      thickness: '25 – 40 µm',
    },
    estimatedCost: {
      costPerPackage: '$0.020 – $0.028 / package',
      basis: 'Mineral-filled breathable film converter quote',
    },
    description: 'Engineered micro-porous membrane designed to allow controlled gas and water vapor exchange, preventing anaerobic fermentation in living produce.',
    pros: ['Prevents produce asphyxiation and fermentation off-odors', 'Anti-fog capability avoids droplets promoting fungal rot', 'Recyclable with standard polyethylene'],
    cons: ['Not suitable for shelf-stable or oxidation-sensitive foods', 'Lower barrier to external aromas'],
  },
  {
    id: 'micro-perforated-film',
    name: 'Micro-perforated Film (Laser Micro-perforated BOPP/PE)',
    shortName: 'Micro-perforated Film',
    category: 'Flexible Packaging',
    structure: ['Laser-Perforated BOPP or PET laminated to LLDPE (50–100 µm holes)'],
    properties: {
      oxygenBarrier: 'Medium',
      moistureBarrier: 'Low',
      gasPermeability: 'Controlled',
      mechanicalStrength: 'High',
      sealability: 'High',
      mapSuitability: true,
    },
    sustainability: {
      recyclability: 'Moderate',
      materialComplexity: 'Multi-layer',
      endOfLife: 'Mechanical recycling where flexible polyolefins are accepted',
      qualitativeRating: 'Moderate',
    },
    applications: ['Strawberries', 'Tomatoes', 'Green Peas', 'Grapes', 'Cut Salads'],
    specifications: {
      otr: 'Tuned 2,000 – 6,000 cc/m²/24h via perforation density',
      wvtr: 'Tuned 30.0 – 60.0 g/m²/24h',
      thickness: '35 – 55 µm',
    },
    estimatedCost: {
      costPerPackage: '$0.024 – $0.034 / package',
      basis: 'Precision laser perforation tolling + substrate',
    },
    description: 'Precision-tuned packaging film featuring microscopic laser holes matched precisely to commodity respiration rates for Equilibrium MAP (EMAP).',
    pros: ['Permeability can be tailored exactly to commodity respiration rate', 'Prevents in-package fogging and condensation', 'Extends soft fruit shelf life significantly under cold chain'],
    cons: ['Perforations must be calibrated accurately to product batch weight and temperature'],
  },

  // ==========================================
  // 12-16: RIGID PACKAGING
  // ==========================================
  {
    id: 'pet-rigid',
    name: 'PET (Rigid Thermoformed PET)',
    shortName: 'Rigid PET Container',
    category: 'Rigid Packaging',
    structure: ['Polyethylene Terephthalate (Monolayer Sheet)'],
    properties: {
      oxygenBarrier: 'Medium',
      moistureBarrier: 'Medium',
      gasPermeability: 'Restricted',
      mechanicalStrength: 'High',
      sealability: 'Standard',
      mapSuitability: false,
    },
    sustainability: {
      recyclability: 'High (Code 1 PET Bottle & Sheet Stream)',
      materialComplexity: 'Single-layer',
      endOfLife: 'Highest recycling rate among packaging plastics worldwide',
      qualitativeRating: 'High',
    },
    applications: ['Apples', 'Tomatoes', 'Salad Bowls', 'Bakery Tarts'],
    specifications: {
      otr: '40 – 70 cc/m²/24h (caliper dependent)',
      wvtr: '3.0 – 5.0 g/m²/24h',
      thickness: '250 – 400 µm',
    },
    estimatedCost: {
      costPerPackage: '$0.035 – $0.048 / package',
      basis: 'Thermoformed post-consumer recycled PET sheet quote',
    },
    description: 'Rigid crystal-clear container offering supreme physical crush resistance, retail transparency, and universal curbside recyclability.',
    pros: ['Superior optical clarity maximizes visual consumer appeal', 'Unmatched structural protection against compression in transit', 'Widely recycled (RIC 1)'],
    cons: ['Higher package tare weight than flexible pouches', 'Requires snap-fit lid or heat-seal compatible flange'],
  },
  {
    id: 'hdpe-bottle',
    name: 'HDPE Bottle (Extrusion Blow-Molded Container)',
    shortName: 'HDPE Bottle',
    category: 'Rigid Packaging',
    structure: ['High-Density Polyethylene (Monolayer or Co-extruded 3-layer with light barrier)'],
    properties: {
      oxygenBarrier: 'Medium',
      moistureBarrier: 'High',
      gasPermeability: 'Restricted',
      mechanicalStrength: 'High',
      sealability: 'High',
      mapSuitability: false,
    },
    sustainability: {
      recyclability: 'High (Code 2 HDPE Stream)',
      materialComplexity: 'Single-layer',
      endOfLife: 'Fully circular recycling stream with high commercial demand',
      qualitativeRating: 'High',
    },
    applications: ['Pasteurized Milk', 'Fresh Juices', 'Liquid Dairy', 'Edible Oils'],
    specifications: {
      otr: '150 – 250 cc/m²/24h (thick wall)',
      wvtr: '0.8 – 1.5 g/m²/24h',
      thickness: '600 – 900 µm wall thickness',
    },
    estimatedCost: {
      costPerPackage: '$0.045 – $0.065 / bottle',
      basis: 'Blow-molded 1-liter container index',
    },
    description: 'Impact-resistant rigid container tailored for fluid beverages and liquid dairy, equipped with light-blocking pigments and tamper-evident cap.',
    pros: ['Drop impact toughness and leak-proof sealability', 'Opaque walls protect vitamin B2 / riboflavin in milk', 'High curbside recycling rate worldwide (RIC 2)'],
    cons: ['Bulky transport volume before filling', 'Higher unit mass than flexible liquid pouches'],
  },
  {
    id: 'pp-container',
    name: 'PP Container (Injection Molded PP Tub)',
    shortName: 'PP Tub / Container',
    category: 'Rigid Packaging',
    structure: ['Injection Molded Polypropylene with In-Mold Label (IML)'],
    properties: {
      oxygenBarrier: 'Low',
      moistureBarrier: 'High',
      gasPermeability: 'Restricted',
      mechanicalStrength: 'High',
      sealability: 'High',
      mapSuitability: false,
    },
    sustainability: {
      recyclability: 'High (Code 5 PP Stream)',
      materialComplexity: 'Single-layer',
      endOfLife: 'Fully recyclable in established PP collection schemes',
      qualitativeRating: 'High',
    },
    applications: ['Yogurt', 'Curd', 'Spreads', 'Dry Bulk Confectionery'],
    specifications: {
      otr: '300 – 450 cc/m²/24h',
      wvtr: '1.2 – 2.0 g/m²/24h',
      thickness: '500 – 750 µm',
    },
    estimatedCost: {
      costPerPackage: '$0.038 – $0.052 / unit',
      basis: 'Injection molded tub with IML decoration',
    },
    description: 'Rigid, grease-resistant tub with snap-on lid or peelable membrane flange, ideal for cultured dairy and spreadable foods.',
    pros: ['Thermal resistance supports hot-filling and pasteurization', 'High rigidity resists stacking loads in cold logistics', 'Mono-material PP recyclable'],
    cons: ['Limited oxygen barrier unless EVOH co-injection is specified'],
  },
  {
    id: 'pet-tray',
    name: 'PET Tray (Thermoformed PET Clamshell / Tray)',
    shortName: 'PET Clamshell Tray',
    category: 'Rigid Packaging',
    structure: ['APET / rPET Sheet with Anti-Fog Coating'],
    properties: {
      oxygenBarrier: 'Medium',
      moistureBarrier: 'Medium',
      gasPermeability: 'Controlled',
      mechanicalStrength: 'High',
      sealability: 'Standard',
      mapSuitability: true,
    },
    sustainability: {
      recyclability: 'High (Contains up to 100% Post-Consumer rPET)',
      materialComplexity: 'Single-layer',
      endOfLife: 'Curbside collection compatible with PET thermoform recycling standards',
      qualitativeRating: 'High',
    },
    applications: ['Strawberries', 'Grapes', 'Tomatoes', 'Apples', 'Kiwi'],
    specifications: {
      otr: '50 – 80 cc/m²/24h',
      wvtr: '3.5 – 5.5 g/m²/24h',
      thickness: '300 – 450 µm',
    },
    estimatedCost: {
      costPerPackage: '$0.040 – $0.055 / unit',
      basis: 'Post-consumer recycled rPET thermoform sheet',
    },
    description: 'Perforated vented clamshell or heat-seal tray engineered for delicate soft produce, providing total compression defense and breathability.',
    pros: ['Vents eliminate decay-inducing condensation', 'Protects tender fruit from transit vibration and bruising', 'Incorporates recycled content readily'],
    cons: ['Higher logistics cube and tare weight'],
  },
  {
    id: 'pp-tray',
    name: 'PP Tray (MAP Heat-Sealable PP Tray)',
    shortName: 'Barrier MAP PP Tray',
    category: 'Rigid Packaging',
    structure: ['PP / EVOH / PP Co-extruded Rigid Sheet (350 µm)'],
    properties: {
      oxygenBarrier: 'High',
      moistureBarrier: 'High',
      gasPermeability: 'Restricted',
      mechanicalStrength: 'High',
      sealability: 'High',
      mapSuitability: true,
    },
    sustainability: {
      recyclability: 'High (RecyClass Code 5 PP Stream)',
      materialComplexity: 'Mono-material laminate',
      endOfLife: 'Engineered for polyolefin sorting and mechanical reprocessing',
      qualitativeRating: 'High',
    },
    applications: ['Fresh Chicken', 'Paneer', 'Processed Meats', 'Prepared Ready Meals'],
    specifications: {
      otr: '< 2.0 cc/m²/24h',
      wvtr: '< 1.5 g/m²/24h',
      thickness: '350 – 500 µm',
    },
    estimatedCost: {
      costPerPackage: '$0.050 – $0.070 / tray',
      basis: 'Co-extruded barrier sheet thermoforming',
    },
    description: 'Heavy-duty barrier tray with wide heat-sealing flange for hermetic peelable film lidding under 70% N₂ / 30% CO₂ gas atmosphere.',
    pros: ['Maximum hygiene and drip containment for fresh poultry and paneer', 'Retains high-CO₂ modified atmosphere for extended shelf life', 'High structural rigidity for multi-tier carton stacking'],
    cons: ['Requires dedicated thermoformer and gas-flush heat sealer on packing line'],
  },

  // ==========================================
  // 17-21: SUSTAINABLE / RECYCLABLE OPTIONS
  // ==========================================
  {
    id: 'mono-pe',
    name: 'Mono-Material PE (All-PE Recyclable Pouch)',
    shortName: 'Mono-PE Pouch',
    category: 'Sustainable / Recyclable',
    structure: ['MDO-PE (Machine Direction Oriented PE Outer, 25 µm)', 'EVOH Barrier Core (<3%)', 'LLDPE Sealant Layer (50 µm)'],
    properties: {
      oxygenBarrier: 'High',
      moistureBarrier: 'High',
      gasPermeability: 'Controlled',
      mechanicalStrength: 'High',
      sealability: 'High',
      mapSuitability: true,
    },
    sustainability: {
      recyclability: 'High (100% Recyclable in PE Stream)',
      materialComplexity: 'Mono-material laminate',
      endOfLife: 'Fully compliant with CEFLEX and APR design guidelines for circular polyethylene stream',
      qualitativeRating: 'High',
    },
    applications: ['Mango & Chilled Produce', 'Nuts', 'Dry Fruits', 'Rice', 'Frozen Vegetables', 'Processed Snacks'],
    specifications: {
      otr: '2.5 – 5.0 cc/m²/24h',
      wvtr: '2.0 – 3.5 g/m²/24h',
      thickness: '70 – 85 µm',
    },
    estimatedCost: {
      costPerPackage: '$0.030 – $0.040 / package',
      basis: 'Next-generation MDO-PE co-extrusion technology index',
    },
    description: 'Breakthrough mono-material polyolefin structure delivering equivalent oxygen/moisture barrier to legacy PET/PE while remaining 100% recyclable in code 4 streams.',
    pros: ['Replaces hard-to-recycle PET/PE without sacrificing barrier', 'Fully circular: approved for curbside or soft-plastic PE recycling', 'Excellent puncture and seal performance'],
    cons: ['Slightly narrower sealing temperature window than mixed laminates', 'Higher resin processing precision required on filling lines'],
  },
  {
    id: 'mono-pp',
    name: 'Mono-Material PP (All-PP Recyclable Laminate)',
    shortName: 'Mono-PP Pouch',
    category: 'Sustainable / Recyclable',
    structure: ['BOPP (Outer Print Layer)', 'Aqueous High-Barrier Dispersion Layer', 'CPP (Cast PP Sealant Layer)'],
    properties: {
      oxygenBarrier: 'High',
      moistureBarrier: 'High',
      gasPermeability: 'Restricted',
      mechanicalStrength: 'High',
      sealability: 'High',
      mapSuitability: true,
    },
    sustainability: {
      recyclability: 'High (Code 5 PP Stream)',
      materialComplexity: 'Mono-material laminate',
      endOfLife: 'Mechanically reprocessable in PP streams with no polymer cross-contamination',
      qualitativeRating: 'High',
    },
    applications: ['Potato Chips', 'Biscuits', 'Namkeen', 'Cookies', 'Pasta', 'Spices'],
    specifications: {
      otr: '3.0 – 6.0 cc/m²/24h',
      wvtr: '1.5 – 2.8 g/m²/24h',
      thickness: '55 – 70 µm',
    },
    estimatedCost: {
      costPerPackage: '$0.028 – $0.038 / package',
      basis: 'BOPP/CPP barrier laminated pouch quote',
    },
    description: 'Mono-material polypropylene laminate providing exceptional stiffness, moisture vapor protection, and full circular recyclability for savory snacks.',
    pros: ['Superior moisture vapor protection for crispy snacks', 'Mono-polymer PP stream recycling readiness', 'High optical clarity and surface gloss'],
    cons: ['Sensitive to tear propagation if edge slit is nicked'],
  },
  {
    id: 'paper-barrier',
    name: 'Paper-based Barrier Structure (FSC Paper / Aqueous Barrier)',
    shortName: 'Aqueous Barrier Paper',
    category: 'Sustainable / Recyclable',
    structure: ['FSC-Certified Kraft / White Paper (>85% fiber weight)', 'Water-Based Aqueous Barrier Coating (<15%)'],
    properties: {
      oxygenBarrier: 'Medium',
      moistureBarrier: 'Medium',
      gasPermeability: 'Restricted',
      mechanicalStrength: 'Medium',
      sealability: 'Standard',
      mapSuitability: false,
    },
    sustainability: {
      recyclability: 'High (Standard Curbside Paper Recycling Stream)',
      materialComplexity: 'Mono-material laminate',
      endOfLife: 'Repulpable in standard hydrapulpers (>85% fiber yield); biodegradable if composted',
      qualitativeRating: 'High',
    },
    applications: ['Dry Foods', 'Flour', 'Wheat', 'Oats', 'Confectionery', 'Dry Fruits'],
    specifications: {
      otr: '15 – 35 cc/m²/24h',
      wvtr: '5.0 – 10.0 g/m²/24h',
      thickness: '70 – 95 gsm paper caliper',
    },
    estimatedCost: {
      costPerPackage: '$0.032 – $0.044 / package',
      basis: 'Aqueous coated barrier paper rollstock index',
    },
    description: 'Renewable fiber-based packaging material with aqueous barrier coating, repulpable in conventional paper mills with no microplastic residues.',
    pros: ['Made from renewable FSC certified wood pulp', 'Curbside recyclable via standard paper waste stream', 'Consumer perception strongly positive for eco-friendliness'],
    cons: ['Lower puncture resistance against sharp products than synthetic polymers', 'Sensitive to prolonged immersion in liquid'],
  },
  {
    id: 'compostable-film',
    name: 'Compostable Film (PLA / PBAT Compostable Laminate)',
    shortName: 'Certified Compostable Film',
    category: 'Sustainable / Recyclable',
    structure: ['Polylactic Acid (PLA from corn starch)', 'Polybutyrate Adipate Terephthalate (PBAT)'],
    properties: {
      oxygenBarrier: 'Medium',
      moistureBarrier: 'Low',
      gasPermeability: 'Controlled',
      mechanicalStrength: 'Medium',
      sealability: 'Standard',
      mapSuitability: true,
    },
    sustainability: {
      recyclability: 'Compostable (EN 13432 / ASTM D6400 Certified)',
      materialComplexity: 'Bio-based / Compostable',
      endOfLife: 'Breaks down completely into biomass, water, and CO₂ within 90–180 days in industrial composting facility',
      qualitativeRating: 'Compostable',
    },
    applications: ['Strawberries', 'Fresh Herbs', 'Organic Produce', 'Specialty Confectionery'],
    specifications: {
      otr: '350 – 600 cc/m²/24h',
      wvtr: '25.0 – 45.0 g/m²/24h',
      thickness: '35 – 50 µm',
    },
    estimatedCost: {
      costPerPackage: '$0.042 – $0.058 / package',
      basis: 'Bio-polymer resin conversion premium index',
    },
    description: 'Certified bio-based and industrially compostable flexible film that disintegrates organically without persistent ecotoxic synthetic residues.',
    pros: ['Certified EN 13432 compostable: zero microplastic persistence', 'Inherent gas breathability well-matched to fresh produce', 'Derived from renewable agricultural feedstocks'],
    cons: ['High moisture vapor transmission: not suited for dry crispy snacks', 'Requires access to municipal industrial composting infrastructure', 'Lower storage shelf life before conversion'],
  },
  {
    id: 'bio-film',
    name: 'Bio-based Film (Cellulose / Bio-Polymer Film)',
    shortName: 'Nature-Flex Cellulose Film',
    category: 'Sustainable / Recyclable',
    structure: ['Regenerated Wood-Pulp Cellulose Film with Natural Resins'],
    properties: {
      oxygenBarrier: 'High',
      moistureBarrier: 'Medium',
      gasPermeability: 'Controlled',
      mechanicalStrength: 'Medium',
      sealability: 'High',
      mapSuitability: true,
    },
    sustainability: {
      recyclability: 'Compostable (Home & Industrial Compostable Certified)',
      materialComplexity: 'Bio-based / Compostable',
      endOfLife: 'Suitable for home compost heaps and organic waste collection',
      qualitativeRating: 'Compostable',
    },
    applications: ['Coffee', 'Tea', 'Dried Herbs', 'Organic Fresh Fruit', 'Artisanal Chocolates'],
    specifications: {
      otr: '5.0 – 15.0 cc/m²/24h',
      wvtr: '8.0 – 18.0 g/m²/24h',
      thickness: '30 – 45 µm',
    },
    estimatedCost: {
      costPerPackage: '$0.048 – $0.068 / package',
      basis: 'Regenerated cellulose bio-barrier substrate quote',
    },
    description: 'Home-compostable film synthesized from responsibly sourced wood pulp, offering surprising gas barrier and optical brilliance.',
    pros: ['Home compostable certification (OK Compost Home)', 'Naturally high oxygen and aroma barrier without metallization', 'Anti-static and dead-fold capabilities'],
    cons: ['Moderate moisture vapor barrier: shorter shelf life in high humidity', 'Higher cost per square meter than conventional fossil polymers'],
  },
];

export function getMaterialById(id: string): PackagingMaterialRecord | undefined {
  return PACKAGING_MATERIALS_DATABASE.find((m) => m.id === id);
}

export const packagingMaterialsDatabase = PACKAGING_MATERIALS_DATABASE;
export const packagingMaterials = PACKAGING_MATERIALS_DATABASE;
export default PACKAGING_MATERIALS_DATABASE;
