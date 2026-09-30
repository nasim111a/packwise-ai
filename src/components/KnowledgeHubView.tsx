import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Wind,
  ShieldCheck,
  Microscope,
  ArrowRight,
  Layers,
  Calculator,
  X,
  Search,
  Info,
  ChevronDown,
  ChevronUp,
  Activity,
  FileText,
  Sparkles,
  Scale,
  RefreshCw,
  HelpCircle,
  FlaskConical,
  Award,
  CheckCircle2,
} from 'lucide-react';

interface ArticleData {
  id: string;
  title: string;
  category: string;
  topicTags: string[];
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  readTime: string;
  featured?: boolean;
  fullContent: {
    overview: string;
    keyFormulas: { label: string; formula: string; description: string }[];
    guidelines: string[];
    astmStandards: string;
    packwiseConnection: string;
  };
}

const TOPIC_CATEGORIES = [
  'All',
  'Food Packaging',
  'Barrier Properties',
  'Shelf Life',
  'MAP',
  'Packaging Materials',
  'Active & Intelligent Packaging',
  'Sustainability',
  'Packaging Testing',
  'Food Science',
] as const;

type TopicCategory = (typeof TOPIC_CATEGORIES)[number];

export const KnowledgeHubView: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<ArticleData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TopicCategory>('All');
  const [isCalcDetailsOpen, setIsCalcDetailsOpen] = useState(false);
  const [showQ10Tooltip, setShowQ10Tooltip] = useState(false);

  // Arrhenius Q10 Shelf-Life Calculator State
  const [baseTemp, setBaseTemp] = useState<number>(25); // 25°C ambient
  const [targetTemp, setTargetTemp] = useState<number>(4); // 4°C chilled
  const [baseDays, setBaseDays] = useState<number>(5); // 5 days baseline
  const [q10Value, setQ10Value] = useState<number>(2.5); // standard food spoilage Q10

  // Calculate: Shelf life at T2 = Shelf life at T1 * Q10^((T1 - T2) / 10)
  const tempDelta = baseTemp - targetTemp;
  const powerExponent = tempDelta / 10;
  const calculatedExtensionFactor = Math.pow(q10Value, powerExponent);
  const calculatedShelfLifeDays = Math.max(1, Math.round(baseDays * calculatedExtensionFactor));
  const shelfLifeDelta = calculatedShelfLifeDays - baseDays;

  // Technical Articles Library
  const articles: ArticleData[] = useMemo(
    () => [
      {
        id: 'map-produce',
        title: 'Modified Atmosphere Packaging (MAP) Principles in Fresh Produce',
        category: 'MAP',
        topicTags: ['MAP', 'Food Packaging', 'Food Science', 'Shelf Life', 'Respiration', 'Oxygen Barrier'],
        desc: 'How balancing commodity respiration rate (RO2) with polymer gas permeabilities (PO2 and PCO2) avoids internal anaerobic fermentation while arresting senescence.',
        icon: Wind,
        readTime: '6 min read',
        featured: true,
        fullContent: {
          overview:
            'Fresh fruits and vegetables respire aerobically after harvest, consuming O₂ and liberating CO₂ and water vapor. Modified Atmosphere Packaging (MAP) modifies the internal headspace gas composition (typically 2–5% O₂ and 3–8% CO₂) to slow down metabolic respiration without crossing into anaerobic fermentation (which causes ethanol, acetaldehyde, and off-flavor production).',
          keyFormulas: [
            {
              label: 'Equilibrium Headspace O₂ Mass Balance',
              formula: 'PO₂ · A · (p_atm - p_pkg) / L = RO₂ · W',
              description:
                'Where PO₂ is film oxygen permeability, A is pack surface area, L is film thickness, RO₂ is commodity respiration rate, and W is product weight.',
            },
            {
              label: 'Permselectivity Ratio (β)',
              formula: 'β = P(CO₂) / P(O₂) ≈ 3.0 to 5.0',
              description:
                'Most polyolefins (LDPE, PP) exhibit β ratios between 3.0 and 5.0, matching typical produce respiration quotients (RQ = RO₂ / RCO₂ ≈ 0.8 – 1.3).',
            },
          ],
          guidelines: [
            'Pre-cool commodity to target transit temperature before sealing to prevent moisture condensation and fungal Botrytis growth.',
            'Use micro-perforated bio-films (PLA/Cellulose) or controlled-permeability films for high-respiration produce like strawberries, broccoli, and mushrooms.',
            'Maintain minimum 2 – 5% headspace O₂ to prevent Clostridium botulinum germination and anaerobic tissue breakdown.',
          ],
          astmStandards: 'ASTM D1434 / ASTM F3136 (Gas Transmission Rate of Plastic Film)',
          packwiseConnection:
            'PackWise AI automatically checks your food’s respiration rate and flags whether MAP gas flushing (CO₂/N₂) or micro-perforated films are required to prevent suffocation.',
        },
      },
      {
        id: 'wvtr-dynamics',
        title: 'Water Vapor Transmission Rate (WVTR) vs Relative Humidity Dynamics',
        category: 'Barrier Properties',
        topicTags: ['Barrier Properties', 'Packaging Testing', 'Food Packaging', 'Moisture Barrier', 'PE', 'PET'],
        desc: 'Standard measurement protocols and Glaser-Fick diffusion kinetics for thin barrier films under subtropical storage gradients.',
        icon: Layers,
        readTime: '8 min read',
        fullContent: {
          overview:
            'Moisture gain or loss is the primary spoilage vector for dry foods (biscuits, chips, powders) and fresh produce. Measuring Water Vapor Transmission Rate (WVTR) under standardized temperature and humidity gradients allows precise engineering of barrier pouches to prevent sogginess, caking, or desiccation.',
          keyFormulas: [
            {
              label: 'WVTR Definition (g/m²/day)',
              formula: 'WVTR = (Δm) / (A · Δt)',
              description:
                'Mass transfer rate of water vapor per unit film surface area per 24 hours under standard 37.8°C / 90% RH testing conditions.',
            },
            {
              label: 'Fickian Diffusion Permeation Flux',
              formula: 'J = -D · (dc/dx) = P · (p₁ - p₂) / L',
              description:
                'Permeation flux J through packaging laminate is inversely proportional to thickness L and directly proportional to vapor pressure differential (p₁ - p₂).',
            },
          ],
          guidelines: [
            'For moisture-sensitive dry food (powder, extruded snacks, biscuits), WVTR must be < 1.0 g/m²/24h.',
            'Metallized PET (MET-PET) and AlOx-coated films provide ultra-high moisture barriers (< 0.5 g/m²/day) for extended shelf-life ambient exports.',
            'Aqueous dispersion barrier coatings on paper provide circular alternatives to conventional fossil PE wax coatings.',
          ],
          astmStandards: 'ASTM F1249 (Modulated Infrared Sensor) & ISO 15106-2',
          packwiseConnection:
            'When you set Moisture Sensitivity to "High", PackWise AI filters for materials with certified WVTR < 1.5 g/m²/24h to avoid moisture-driven texture collapse.',
        },
      },
      {
        id: 'otr-oxidation',
        title: 'Oxygen Transmission Rate (OTR) & Oxidation Kinetics in Lipids',
        category: 'Barrier Properties',
        topicTags: ['Barrier Properties', 'Shelf Life', 'Food Science', 'Oxygen Barrier', 'Packaging Materials', 'PET'],
        desc: 'Coulometric sensor measurement protocols and oxidative rancidity prevention in fats, oils, nuts, and roasted snacks.',
        icon: ShieldCheck,
        readTime: '7 min read',
        fullContent: {
          overview:
            'Autoxidation of unsaturated lipids leads to hexanal formation, rancid off-odors, and degradation of fat-soluble vitamins (A, D, E). Minimizing the Oxygen Transmission Rate (OTR) of the container or pouch protects lipid-rich commodities from photo-oxidation and free-radical cascades.',
          keyFormulas: [
            {
              label: 'Coulometric OTR Permeation',
              formula: 'OTR = V(O₂) / (A · t · ΔpO₂)',
              description:
                'Expressed in cc/m²/24h/atm at standard 23°C and 0% or 50% relative humidity according to ASTM D3985 standards.',
            },
            {
              label: 'Peroxide Value (PV) Progression',
              formula: 'ROO· + RH → ROOH + R· (Free radical chain propagation)',
              description:
                'Hydroperoxides break down into volatile aldehydes and ketones causing sensory rejection when oxygen exposure exceeds critical thresholds.',
            },
          ],
          guidelines: [
            'Nuts, seeds, and roasted coffee require high-barrier EVOH, PVDC, or foil laminates with OTR < 2.0 cc/m²/day.',
            'Amber or opaque packaging must accompany high oxygen barriers if light-sensitive photo-sensitizers (riboflavin, chlorophyll) are present.',
          ],
          astmStandards: 'ASTM D3985 / ASTM F1927 / ISO 15105-2',
          packwiseConnection:
            'Food items with High Oxygen Sensitivity trigger PackWise AI to mandate EVOH co-extrusions, foil barriers, or nitrogen gas flushing.',
        },
      },
      {
        id: 'active-intelligent',
        title: 'Active & Intelligent Food Packaging: Ethylene Scavengers and TTIs',
        category: 'Active & Intelligent Packaging',
        topicTags: ['Active & Intelligent Packaging', 'Packaging Materials', 'Food Packaging', 'Active Packaging'],
        desc: 'Implementation of potassium permanganate masterbatches, oxygen scavengers, and Time-Temperature Indicators for supply chain tracking.',
        icon: Microscope,
        readTime: '5 min read',
        fullContent: {
          overview:
            'Active packaging incorporates compounds that actively absorb undesirable headspace gases (O₂, ethylene, moisture) or release antimicrobial volatiles (CO₂, essential oils). Intelligent packaging provides real-time verification of cold-chain compliance and packaging integrity via colorimetric responses.',
          keyFormulas: [
            {
              label: 'Ethylene Oxidation Reaction',
              formula: '3 C₂H₄ + 12 KMnO₄ → 6 CO₂ + 12 MnO₂ + 12 KOH',
              description:
                'Potassium permanganate irreversibly oxidizes autocatalytic ethylene gas into harmless potassium hydroxide and manganese dioxide.',
            },
            {
              label: 'Iron-Based Oxygen Scavenging',
              formula: '4 Fe + 3 O₂ + 6 H₂O → 4 Fe(OH)₃',
              description:
                'Self-activating iron sachets or masterbatch polymer additives reduce residual headspace oxygen down to < 0.01%.',
            },
          ],
          guidelines: [
            'Incorporate natural zeolites or activated clays for food-contact safe ethylene adsorption in climacteric fruits (apples, bananas, tomatoes).',
            'Utilize enzymatic or polymeric colorimetric TTIs on outer cartons to verify uninterrupted cold-chain compliance in export transit.',
          ],
          astmStandards: 'FDA Food Contact Substance (FCS) Notification & EU Regulation 450/2009',
          packwiseConnection:
            'Commodities susceptible to ethylene-driven senescence prompt PackWise AI to recommend active scavenging inserts alongside passive film barriers.',
        },
      },
      {
        id: 'biopolymers-pla',
        title: 'Bio-Polymer Processability: Extrusion and Thermoforming of PLA/PHA Blends',
        category: 'Sustainability',
        topicTags: ['Sustainability', 'Packaging Materials', 'Sustainable Packaging', 'Packaging Materials'],
        desc: 'Addressing brittleness, melt strength, and heat distortion temperature (HDT) challenges in commercial form-fill-seal machines.',
        icon: FlaskConical,
        readTime: '9 min read',
        fullContent: {
          overview:
            'Poly-lactic acid (PLA) and Poly-hydroxyalkanoates (PHA) provide industrial or home-compostable alternatives to fossil PET and PP. Blending and nucleating strategies overcome inherent thermal and elongation limitations during packaging manufacturing.',
          keyFormulas: [
            {
              label: 'Heat Distortion Temperature (HDT)',
              formula: 'HDT (annealed PLA+PHA) = 55°C → 115°C',
              description:
                'Stereocomplex crystallites formed by blending PLLA with PDLA elevate thermal resistance for hot-fill food packaging.',
            },
            {
              label: 'Compostability Degradation Rate',
              formula: 'Biodegradation > 90% within 180 days at 58°C (Industrial)',
              description:
                'Conversion of polymer carbon to CO₂ and biomass under aerobic thermophilic industrial composting conditions.',
            },
          ],
          guidelines: [
            'Pre-dry PLA pellets to < 100 ppm moisture prior to extrusion to prevent hydrolytic molecular weight degradation.',
            'Add biodegradable chain extenders to enhance melt viscosity for blown film extrusion and bubble stability.',
          ],
          astmStandards: 'ASTM D6400 (Compostable Plastics) & EN 13432',
          packwiseConnection:
            'When evaluating circular solutions in PackWise AI, bio-polymers receive high circularity scores while highlighting oxygen/moisture barrier tradeoffs.',
        },
      },
      {
        id: 'water-activity',
        title: 'Food Water Activity (aw) & Critical Microbial Stability Thresholds',
        category: 'Food Science',
        topicTags: ['Food Science', 'Shelf Life', 'Food Packaging', 'Moisture Barrier'],
        desc: 'Understanding moisture sorption isotherms, free vs bound water, and microbial proliferation cutoffs for mold and bacteria.',
        icon: Activity,
        readTime: '6 min read',
        fullContent: {
          overview:
            'Water activity (aw) represents the ratio of the vapor pressure of water in food to the vapor pressure of pure water at the same temperature. Unlike total moisture content, aw governs microbial growth, enzymatic browning, lipid oxidation, and Maillard reactions.',
          keyFormulas: [
            {
              label: 'Water Activity Definition',
              formula: 'aw = p / p₀ = %ERH / 100',
              description:
                'Where p is the partial vapor pressure of water in food, p₀ is the vapor pressure of pure water, and ERH is Equilibrium Relative Humidity.',
            },
            {
              label: 'Microbial Cutoff Thresholds',
              formula: 'Bacteria: aw > 0.91 | Yeasts: aw > 0.88 | Molds: aw > 0.80 | Safe dry: aw < 0.60',
              description:
                'No pathogenic microorganisms can proliferate below aw = 0.60, making it the universal dry packaging stabilization target.',
            },
          ],
          guidelines: [
            'Package bakery and confectioneries to maintain headspace equilibrium below aw = 0.65 to prevent mold spoilage.',
            'Construct moisture sorption isotherms (GAB or BET models) to determine the exact critical moisture gain before crispness loss.',
          ],
          astmStandards: 'ISO 21807:2004 (Determination of water activity in foodstuffs)',
          packwiseConnection:
            'PackWise AI leverages aw stability cutoffs to determine whether hermetic moisture barrier sealing or desiccants are mandatory.',
        },
      },
      {
        id: 'packaging-testing',
        title: 'Mechanical Puncture Resistance & Tensile Strength in Food Logistics',
        category: 'Packaging Testing',
        topicTags: ['Packaging Testing', 'Packaging Materials', 'PE', 'PET'],
        desc: 'ASTM D882 tensile testing, slow rate penetration resistance (ASTM F1306), and vibration transit simulation protocols.',
        icon: Scale,
        readTime: '7 min read',
        fullContent: {
          overview:
            'Packaging materials must endure static stack loads, puncture hazards from sharp food geometries (bones, pasta, dried beans), and transport vibration. Quantitative tensile and puncture testing guarantees package hermeticity through the distribution cycle.',
          keyFormulas: [
            {
              label: 'Slow Rate Puncture Energy',
              formula: 'E_p = ∫ F dx (Peak Force · Probe Displacement)',
              description:
                'Measures the energy absorbed by flexible barrier film before catastrophic burst under a hemispherical probe.',
            },
            {
              label: 'Tensile Yield & Elongation',
              formula: 'σ = F / A₀ ; ε = (ΔL / L₀) × 100%',
              description:
                'High tensile modulus resists pouch stretching during vacuum packaging or high-speed vertical form-fill-seal (VFFS).',
            },
          ],
          guidelines: [
            'Use biaxially oriented nylon (BOPA) or metallocene mLLDPE sealing layers for products with sharp or irregular profiles.',
            'Perform ASTM D4169 distribution testing to simulate compression, random vibration, and drop impacts encountered in cold-chain logistics.',
          ],
          astmStandards: 'ASTM D882 (Tensile Properties) & ASTM F1306 (Slow Rate Penetration)',
          packwiseConnection:
            'When you flag export or long-distance transit, PackWise elevates mechanical strength thresholds to avoid seal rupture and pinholing.',
        },
      },
      {
        id: 'mono-material-polyolefins',
        title: 'Recyclable Mono-Material Polyolefins (MDO-PE / BOPP) vs Multi-layer Laminates',
        category: 'Sustainability',
        topicTags: ['Sustainability', 'Barrier Properties', 'Packaging Materials', 'PE', 'Sustainable Packaging'],
        desc: 'Machine Direction Orientation (MDO) technology to replace unrecyclable PET/PE/Alu multimaterial pouches with circular mono-PE structures.',
        icon: RefreshCw,
        readTime: '8 min read',
        fullContent: {
          overview:
            'Traditional barrier pouches utilize incompatible polymer layers (PET print web + Aluminum foil + PE sealant) which cannot be mechanically recycled. MDO-PE orientation technology allows all-PE mono-material standup pouches that match PET stiffness and barrier while fitting existing PE recycling streams.',
          keyFormulas: [
            {
              label: 'Orientation Draw Ratio Effect',
              formula: 'Draw Ratio = L_stretched / L_initial ≈ 4:1 to 7:1',
              description:
                'Stretching polyethylene below its melting point aligns crystalline lamellae, drastically increasing optical clarity, stiffness, and gas barrier.',
            },
          ],
          guidelines: [
            'Incorporate EVOH layers < 5 wt% with compatible PE tie resins to maintain official APR / CEFLEX recyclable certification.',
            'Apply vacuum-deposited AlOx or SiOx transparent coatings for ultra-high barrier mono-material flexible pouches.',
          ],
          astmStandards: 'CEFLEX Design Guidelines & APR Critical Guidance Protocol',
          packwiseConnection:
            'PackWise AI highlights MDO-PE and BOPP alternatives in your recommendation report to maximize European and global circular packaging compliance.',
        },
      },
      {
        id: 'astm-standards-matrix',
        title: 'ASTM & ISO Food Packaging Barrier Testing Standards Reference',
        category: 'Packaging Testing',
        topicTags: ['Packaging Testing', 'Barrier Properties', 'OTR', 'WVTR'],
        desc: 'Comprehensive reference catalog of international testing protocols for barrier transmission, seal integrity, and migration limits.',
        icon: Award,
        readTime: '5 min read',
        fullContent: {
          overview:
            'Standardized analytical testing protocols ensure reproducibility between packaging converters, food processors, and quality labs. This reference catalog summarizes the essential ASTM and ISO standards governing food packaging qualification.',
          keyFormulas: [
            {
              label: 'Primary Standards Catalog',
              formula: 'ASTM D3985 (OTR) | ASTM F1249 (WVTR) | ASTM F88 (Seal Strength)',
              description:
                'Baseline international qualification protocols for all flexible barrier specifications.',
            },
          ],
          guidelines: [
            'Always verify calibration of coulometric OTR sensors with certified NIST Mylar reference films.',
            'Report both temperature and relative humidity when specifying WVTR values (e.g. 38°C / 90% RH vs 23°C / 85% RH).',
          ],
          astmStandards: 'ASTM D3985, ASTM F1249, ASTM F88, ASTM F1929, ISO 15105',
          packwiseConnection:
            'All technical barrier numbers in PackWise AI are benchmarked against standardized ASTM laboratory conditions.',
        },
      },
    ],
    []
  );

  // Filter articles by category and search query
  const filteredArticles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return articles.filter((art) => {
      // Category match
      let matchesCat = true;
      if (selectedCategory !== 'All') {
        matchesCat =
          art.category === selectedCategory ||
          art.topicTags.some((tag) => tag.toLowerCase() === selectedCategory.toLowerCase());
      }
      if (!matchesCat) return false;

      // Query match across title, description, category, topicTags, standards, formulas, and overview
      if (!q) return true;

      const searchableText = [
        art.title,
        art.desc,
        art.category,
        art.readTime,
        art.fullContent.overview,
        art.fullContent.astmStandards,
        art.fullContent.packwiseConnection,
        ...art.topicTags,
        ...art.fullContent.keyFormulas.map((f) => `${f.label} ${f.formula} ${f.description}`),
        ...art.fullContent.guidelines,
      ]
        .join(' ')
        .toLowerCase();

      // Support multi-term searches (all words must be present)
      const words = q.split(/\s+/).filter(Boolean);
      return words.every((word) => searchableText.includes(word));
    });
  }, [articles, selectedCategory, searchQuery]);

  // Featured article (first featured article or first filtered article)
  const featuredArticle = useMemo(() => {
    return articles.find((a) => a.featured) || articles[0];
  }, [articles]);

  return (
    <div className="space-y-6 min-w-0 w-full pb-12">
      {/* 1. Header */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-6 sm:p-7 shadow-[var(--shadow-card)] transition-colors duration-200">
        <div className="flex items-center gap-2 text-xs font-bold text-[var(--accent-purple)] uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>Food Packaging Science & Engineering</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] mt-1.5 tracking-tight">
          Knowledge Hub
        </h1>
        <p className="text-sm sm:text-base font-medium text-[var(--text-secondary)] mt-1">
          Food packaging science, engineering principles, material behavior, and practical calculation tools.
        </p>
        <p className="text-xs sm:text-sm text-[var(--brand-primary)] font-semibold mt-1 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Learn the science behind packaging recommendations generated by PackWise AI.</span>
        </p>
      </div>

      {/* 2. Global Knowledge Search */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-4 sm:p-5 shadow-[var(--shadow-card)]">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search packaging topics, materials, properties, calculations..."
            className="w-full pl-10 pr-10 py-3 bg-[var(--bg-input)] border border-[var(--border-primary)] rounded-xl text-sm font-medium text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/30 focus:border-[var(--brand-primary)] transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Search quick hints */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-[var(--text-muted)]">
          <span className="font-semibold text-[var(--text-secondary)]">Popular queries:</span>
          {['OTR', 'WVTR', 'MAP', 'Shelf Life', 'PET', 'PE', 'Active Packaging', 'Sustainability', 'Water Activity'].map(
            (term) => (
              <button
                key={term}
                type="button"
                onClick={() => setSearchQuery(term)}
                className="px-2 py-0.5 rounded-md bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] cursor-pointer transition-colors"
              >
                {term}
              </button>
            )
          )}
        </div>
      </div>

      {/* 3. Topic Navigation */}
      <div className="w-full overflow-hidden">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar sm:flex-wrap">
          {TOPIC_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[var(--brand-primary)] text-white shadow-xs'
                    : 'bg-[var(--bg-card)] border border-[var(--border-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-secondary)]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Knowledge Overview: 4 Category Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => {
            setSelectedCategory('Food Packaging');
            setSearchQuery('');
          }}
          className={`bg-[var(--bg-card)] border rounded-2xl p-4 shadow-[var(--shadow-card)] hover:border-[var(--brand-primary)] cursor-pointer transition-all group ${
            selectedCategory === 'Food Packaging' ? 'border-[var(--brand-primary)] ring-1 ring-[var(--brand-primary)]/20' : 'border-[var(--border-primary)]'
          }`}
        >
          <div className="w-8 h-8 rounded-xl bg-[var(--accent-purple-soft)] text-[var(--accent-purple)] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
            <BookOpen className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors">
            Packaging Fundamentals
          </h3>
          <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-2">
            Learn core food-packaging concepts, headspace gas dynamics, and biological spoilage vectors.
          </p>
        </div>

        <div
          onClick={() => {
            setSelectedCategory('Packaging Materials');
            setSearchQuery('');
          }}
          className={`bg-[var(--bg-card)] border rounded-2xl p-4 shadow-[var(--shadow-card)] hover:border-[var(--brand-primary)] cursor-pointer transition-all group ${
            selectedCategory === 'Packaging Materials' ? 'border-[var(--brand-primary)] ring-1 ring-[var(--brand-primary)]/20' : 'border-[var(--border-primary)]'
          }`}
        >
          <div className="w-8 h-8 rounded-xl bg-[var(--accent-blue-soft)] text-[var(--accent-blue)] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
            <Layers className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors">
            Material Science
          </h3>
          <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-2">
            Understand polymers, mono-materials, functional barrier coatings, and multilayer laminate structures.
          </p>
        </div>

        <div
          onClick={() => {
            setSelectedCategory('Shelf Life');
            setSearchQuery('');
          }}
          className={`bg-[var(--bg-card)] border rounded-2xl p-4 shadow-[var(--shadow-card)] hover:border-[var(--brand-primary)] cursor-pointer transition-all group ${
            selectedCategory === 'Shelf Life' ? 'border-[var(--brand-primary)] ring-1 ring-[var(--brand-primary)]/20' : 'border-[var(--border-primary)]'
          }`}
        >
          <div className="w-8 h-8 rounded-xl bg-[var(--badge-completed-bg)] text-[var(--brand-primary)] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
            <Activity className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors">
            Shelf-Life Engineering
          </h3>
          <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-2">
            Explore shelf-life kinetics, Arrhenius temperature relationships, and biochemical degradation concepts.
          </p>
        </div>

        <div
          onClick={() => {
            setSelectedCategory('Sustainability');
            setSearchQuery('');
          }}
          className={`bg-[var(--bg-card)] border rounded-2xl p-4 shadow-[var(--shadow-card)] hover:border-[var(--brand-primary)] cursor-pointer transition-all group ${
            selectedCategory === 'Sustainability' ? 'border-[var(--brand-primary)] ring-1 ring-[var(--brand-primary)]/20' : 'border-[var(--border-primary)]'
          }`}
        >
          <div className="w-8 h-8 rounded-xl bg-[var(--accent-gold-soft)] text-[var(--accent-gold)] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
            <RefreshCw className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors">
            Packaging Sustainability
          </h3>
          <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-2">
            Understand mechanical recyclability, bio-polymers (PLA/PHA), material efficiency, and circular standards.
          </p>
        </div>
      </div>

      {/* 5, 6, 7, 8. Featured Engineering Tool: Arrhenius Q10 Shelf-Life Calculator */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-5 sm:p-7 shadow-[var(--shadow-card)] relative overflow-hidden">
        {/* Tool Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[var(--border-secondary)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--badge-completed-bg)] flex items-center justify-center text-[var(--brand-primary)] shadow-xs">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[var(--badge-completed-bg)] text-[var(--brand-primary)]">
                  ENGINEERING TOOL
                </span>
                <span className="text-xs text-[var(--text-muted)] font-medium">Kinetic Modeling</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)] mt-0.5">
                Interactive Arrhenius Q10 Shelf-Life Calculator
              </h2>
            </div>
          </div>
          <p className="text-xs text-[var(--text-secondary)] max-w-md">
            Estimate temperature-dependent shelf-life changes using the Arrhenius/Q10 relationship.
          </p>
        </div>

        {/* 6. Clean 4-Column Desktop Calculator Inputs */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Input 1 */}
          <div className="bg-[var(--bg-card-elevated)] p-3.5 rounded-xl border border-[var(--border-primary)]">
            <label className="block text-xs font-bold text-[var(--text-primary)]">
              Baseline Temperature
            </label>
            <span className="block text-[11px] text-[var(--text-muted)] mb-2">
              Reference environmental temperature
            </span>
            <div className="relative">
              <input
                type="number"
                value={baseTemp}
                onChange={(e) => setBaseTemp(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] font-bold text-sm focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
              />
              <span className="absolute right-3 top-2 text-xs font-bold text-[var(--text-muted)]">°C</span>
            </div>
          </div>

          {/* Input 2 */}
          <div className="bg-[var(--bg-card-elevated)] p-3.5 rounded-xl border border-[var(--border-primary)]">
            <label className="block text-xs font-bold text-[var(--text-primary)]">
              Controlled Storage
            </label>
            <span className="block text-[11px] text-[var(--text-muted)] mb-2">
              Target storage temperature
            </span>
            <div className="relative">
              <input
                type="number"
                value={targetTemp}
                onChange={(e) => setTargetTemp(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] font-bold text-sm focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
              />
              <span className="absolute right-3 top-2 text-xs font-bold text-[var(--text-muted)]">°C</span>
            </div>
          </div>

          {/* Input 3 */}
          <div className="bg-[var(--bg-card-elevated)] p-3.5 rounded-xl border border-[var(--border-primary)]">
            <label className="block text-xs font-bold text-[var(--text-primary)]">
              Ambient Shelf Life
            </label>
            <span className="block text-[11px] text-[var(--text-muted)] mb-2">
              Observed/reference shelf life
            </span>
            <div className="relative">
              <input
                type="number"
                min={1}
                value={baseDays}
                onChange={(e) => setBaseDays(Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] font-bold text-sm focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
              />
              <span className="absolute right-3 top-2 text-xs font-bold text-[var(--text-muted)]">days</span>
            </div>
          </div>

          {/* Input 4 */}
          <div className="bg-[var(--bg-card-elevated)] p-3.5 rounded-xl border border-[var(--border-primary)] relative">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-[var(--text-primary)]">
                Reaction Q10
              </label>
              <button
                type="button"
                onClick={() => setShowQ10Tooltip(!showQ10Tooltip)}
                className="text-[var(--text-muted)] hover:text-[var(--brand-primary)] cursor-pointer"
                title="What is Q10?"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            </div>
            <span className="block text-[11px] text-[var(--text-muted)] mb-2">
              Temperature sensitivity factor
            </span>
            <select
              value={q10Value}
              onChange={(e) => setQ10Value(Number(e.target.value))}
              className="w-full px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] font-bold text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] cursor-pointer"
            >
              <option value={2.0}>Q10 = 2.0 (Slow enzymatic)</option>
              <option value={2.5}>Q10 = 2.5 (Standard produce spoilage)</option>
              <option value={3.0}>Q10 = 3.0 (Fast bacterial growth)</option>
            </select>

            {/* Q10 Tooltip Popover */}
            {showQ10Tooltip && (
              <div className="absolute right-0 top-12 z-20 w-64 p-3 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl shadow-xl text-xs text-[var(--text-secondary)]">
                <div className="font-bold text-[var(--text-primary)] mb-1 flex items-center justify-between">
                  <span>Temperature Sensitivity (Q10)</span>
                  <button onClick={() => setShowQ10Tooltip(false)} className="cursor-pointer">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="leading-relaxed">
                  Q10 represents the factor by which the rate of biochemical spoilage reaction increases with a 10°C increase in temperature. Typical fresh food spoilage exhibits a Q10 between 2.0 and 3.0.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 7. Visually Strong Calculator Result */}
        <div className="mt-5 p-5 rounded-2xl bg-gradient-to-r from-[var(--bg-card-elevated)] via-[var(--bg-card-elevated)] to-[var(--badge-completed-bg)]/30 border border-[var(--border-primary)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase font-extrabold tracking-wider text-[var(--brand-primary)]">
                Estimated Shelf-Life Impact
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-[var(--brand-primary)] mt-1 flex items-baseline gap-2">
                <span>{calculatedShelfLifeDays} Days</span>
                <span className="text-xs sm:text-sm font-semibold text-[var(--text-secondary)]">
                  ({calculatedExtensionFactor >= 1 ? '+' : ''}
                  {shelfLifeDelta} days · {calculatedExtensionFactor.toFixed(1)}x factor)
                </span>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-[var(--text-secondary)] font-medium">
                <div>
                  <span className="text-[var(--text-muted)]">Reference:</span>{' '}
                  <strong className="text-[var(--text-primary)]">{baseDays} days</strong>
                </div>
                <div>
                  <span className="text-[var(--text-muted)]">Estimated change:</span>{' '}
                  <strong className={shelfLifeDelta >= 0 ? 'text-[var(--brand-primary)]' : 'text-[var(--accent-red)]'}>
                    {shelfLifeDelta >= 0 ? `+${shelfLifeDelta}` : shelfLifeDelta} days
                  </strong>
                </div>
                <div>
                  <span className="text-[var(--text-muted)]">Temperature difference:</span>{' '}
                  <strong className="text-[var(--text-primary)]">{Math.abs(tempDelta)}°C {tempDelta >= 0 ? 'cooling' : 'heating'}</strong>
                </div>
              </div>
            </div>

            {/* Calculation Details Toggle */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <button
                type="button"
                onClick={() => setIsCalcDetailsOpen(!isCalcDetailsOpen)}
                className="px-3.5 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-primary)] text-xs font-bold text-[var(--text-primary)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Calculation Details</span>
                {isCalcDetailsOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Expandable Calculation Details */}
          {isCalcDetailsOpen && (
            <div className="mt-4 pt-4 border-t border-[var(--border-secondary)] text-xs space-y-3 animate-in fade-in duration-200">
              <div className="font-bold text-[var(--text-primary)]">Arrhenius Q10 Governing Equation:</div>
              <div className="p-3 bg-[var(--bg-card)] rounded-xl border border-[var(--border-secondary)] font-mono text-xs font-bold text-[var(--text-primary)]">
                Shelf Life(T₂) = Shelf Life(T₁) × Q₁₀^((T₁ - T₂) / 10)
              </div>
              <div className="p-3 bg-[var(--bg-card)] rounded-xl border border-[var(--border-secondary)] space-y-1 font-mono text-xs text-[var(--text-secondary)]">
                <div>
                  Step 1: ΔT = T₁ - T₂ = {baseTemp}°C - {targetTemp}°C = {tempDelta}°C
                </div>
                <div>
                  Step 2: Exponent = ΔT / 10 = {tempDelta} / 10 = {powerExponent.toFixed(2)}
                </div>
                <div>
                  Step 3: Extension Factor = {q10Value}^{powerExponent.toFixed(2)} = {calculatedExtensionFactor.toFixed(3)}
                </div>
                <div className="text-[var(--brand-primary)] font-bold pt-1">
                  Step 4: Estimated Shelf Life = {baseDays} days × {calculatedExtensionFactor.toFixed(3)} ≈ {calculatedShelfLifeDays} days
                </div>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                Physical mechanism: Lowering temperature reduces kinetic energy of molecules, decreasing the frequency of effective collisions and exponentially slowing down microbial replication and enzymatic degradation according to classical Arrhenius reaction kinetics.
              </p>
            </div>
          )}
        </div>

        {/* 8. Scientific Disclaimer */}
        <div className="mt-4 p-3.5 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] flex items-start gap-2.5 text-xs text-[var(--text-secondary)]">
          <Info className="w-4 h-4 text-[var(--brand-primary)] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-[var(--text-primary)] mr-1">Engineering estimate:</span>
            <span>
              This calculation is a temperature-based estimate and does not replace product-specific shelf-life testing. Actual shelf life depends on food composition, packaging barrier properties, microbial behavior, relative humidity, storage conditions, and other environmental factors.
            </span>
          </div>
        </div>
      </div>

      {/* 9. Featured Engineering Guide Callout */}
      {featuredArticle && (!searchQuery || filteredArticles.some((a) => a.id === featuredArticle.id)) && (
        <div className="bg-[var(--bg-card)] border-2 border-[var(--brand-primary)]/40 rounded-2xl p-5 sm:p-6 shadow-[var(--shadow-card)] relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-[var(--brand-primary)] text-white">
                FEATURED ENGINEERING GUIDE
              </span>
              <span className="text-xs font-semibold text-[var(--accent-purple)] bg-[var(--accent-purple-soft)] px-2 py-0.5 rounded-md">
                {featuredArticle.category}
              </span>
            </div>
            <span className="text-xs text-[var(--text-muted)] font-medium">{featuredArticle.readTime}</span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] mt-1">
            {featuredArticle.title}
          </h3>

          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-2 leading-relaxed max-w-3xl">
            {featuredArticle.desc}
          </p>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-[var(--bg-card-elevated)] rounded-xl border border-[var(--border-primary)]">
              <div className="font-bold text-[var(--brand-primary)] mb-0.5">Key Equation Highlight</div>
              <div className="font-mono text-[11px] font-bold text-[var(--text-primary)]">
                {featuredArticle.fullContent.keyFormulas[0]?.formula}
              </div>
            </div>
            <div className="p-3 bg-[var(--bg-card-elevated)] rounded-xl border border-[var(--border-primary)]">
              <div className="font-bold text-[var(--text-primary)] mb-0.5">Standard Protocol</div>
              <div className="text-[11px] text-[var(--text-secondary)]">
                {featuredArticle.fullContent.astmStandards}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[var(--border-secondary)] flex items-center justify-between">
            <span className="text-xs text-[var(--text-muted)]">
              Recommended reading before configuring fresh produce packaging.
            </span>
            <button
              type="button"
              onClick={() => setSelectedArticle(featuredArticle)}
              className="px-4 py-2 rounded-xl bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-secondary)] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
            >
              <span>Read Complete Technical Guide</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 9 & 10. Technical Articles Library Header & Grid */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">
              Featured Engineering Guides & Technical Articles
            </h2>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Showing {filteredArticles.length} {filteredArticles.length === 1 ? 'article' : 'articles'}{' '}
              {selectedCategory !== 'All' ? `in "${selectedCategory}"` : ''}
              {searchQuery ? ` matching "${searchQuery}"` : ''}
            </p>
          </div>

          {(searchQuery || selectedCategory !== 'All') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="text-xs font-semibold text-[var(--brand-primary)] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset all filters</span>
            </button>
          )}
        </div>

        {/* Empty state if no articles found */}
        {filteredArticles.length === 0 ? (
          <div className="bg-[var(--bg-card)] border border-dashed border-[var(--border-primary)] rounded-2xl p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[var(--bg-card-elevated)] mx-auto flex items-center justify-center text-[var(--text-muted)]">
              <Search className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-[var(--text-primary)]">
              No technical guides match your search criteria
            </h4>
            <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto">
              No results found for &ldquo;{searchQuery}&rdquo; in category &ldquo;{selectedCategory}&rdquo;. Try broader terms like &ldquo;OTR&rdquo;, &ldquo;WVTR&rdquo;, &ldquo;MAP&rdquo;, or &ldquo;Shelf Life&rdquo;.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="px-4 py-2 bg-[var(--brand-primary)] text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-[var(--brand-secondary)] transition-colors inline-flex items-center gap-1.5"
            >
              <span>View All Technical Guides</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredArticles.map((art) => {
              const IconComp = art.icon;
              return (
                <div
                  key={art.id}
                  className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-5 shadow-[var(--shadow-card)] hover:border-[var(--brand-primary)] transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-3">
                      <span className="font-bold text-[10px] text-[var(--accent-purple)] bg-[var(--accent-purple-soft)] border border-[var(--accent-purple)]/20 px-2 py-0.5 rounded-md">
                        {art.category}
                      </span>
                      <span>{art.readTime}</span>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-secondary)] flex items-center justify-center text-[var(--brand-primary)] shrink-0 group-hover:bg-[var(--badge-completed-bg)] transition-colors">
                        <IconComp className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)] leading-snug group-hover:text-[var(--brand-primary)] transition-colors">
                        {art.title}
                      </h3>
                    </div>

                    <p className="text-xs text-[var(--text-secondary)] mt-2.5 leading-relaxed line-clamp-3">
                      {art.desc}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-1">
                      {art.topicTags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-medium text-[var(--text-muted)] bg-[var(--bg-card-elevated)] px-1.5 py-0.5 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[var(--border-secondary)] flex items-center justify-between">
                    <span className="text-[11px] text-[var(--text-muted)] truncate max-w-[150px]">
                      {art.fullContent.astmStandards.split('/')[0]}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedArticle(art)}
                      className="text-xs font-bold text-[var(--brand-primary)] flex items-center gap-1 cursor-pointer hover:underline"
                    >
                      <span>Read Guide</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 10. Engineering Parameters & Standards Quick Reference */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-5 sm:p-6 shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-2 mb-3">
          <Award className="w-4 h-4 text-[var(--brand-primary)]" />
          <h3 className="text-base font-bold text-[var(--text-primary)]">
            Core Packaging Engineering Parameters & ASTM Standards
          </h3>
        </div>
        <p className="text-xs text-[var(--text-secondary)] mb-4">
          Quick-reference benchmarks used by PackWise AI when matching food requirements to material specifications.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 bg-[var(--bg-card-elevated)] rounded-xl border border-[var(--border-primary)]">
            <div className="flex items-center justify-between font-bold text-[var(--text-primary)]">
              <span>Oxygen Transmission Rate (OTR)</span>
              <span className="font-mono text-[10px] text-[var(--brand-primary)]">ASTM D3985</span>
            </div>
            <div className="text-[11px] text-[var(--text-muted)] mt-1">Standard Units: cc/m²/24h/atm (23°C, 0% RH)</div>
            <div className="mt-2 text-[11px] text-[var(--text-secondary)]">
              • High Barrier: &lt; 2.0 cc<br />
              • Medium Barrier: 2.0 – 50.0 cc<br />
              • Low Barrier: &gt; 50.0 cc
            </div>
          </div>

          <div className="p-3.5 bg-[var(--bg-card-elevated)] rounded-xl border border-[var(--border-primary)]">
            <div className="flex items-center justify-between font-bold text-[var(--text-primary)]">
              <span>Water Vapor Transmission Rate (WVTR)</span>
              <span className="font-mono text-[10px] text-[var(--brand-primary)]">ASTM F1249</span>
            </div>
            <div className="text-[11px] text-[var(--text-muted)] mt-1">Standard Units: g/m²/24h (37.8°C, 90% RH)</div>
            <div className="mt-2 text-[11px] text-[var(--text-secondary)]">
              • High Barrier: &lt; 1.0 g<br />
              • Medium Barrier: 1.0 – 5.0 g<br />
              • Low Barrier: &gt; 5.0 g
            </div>
          </div>

          <div className="p-3.5 bg-[var(--bg-card-elevated)] rounded-xl border border-[var(--border-primary)]">
            <div className="flex items-center justify-between font-bold text-[var(--text-primary)]">
              <span>Permselectivity Ratio (β)</span>
              <span className="font-mono text-[10px] text-[var(--brand-primary)]">P(CO₂) / P(O₂)</span>
            </div>
            <div className="text-[11px] text-[var(--text-muted)] mt-1">Dimensionless Ratio for Polyolefins</div>
            <div className="mt-2 text-[11px] text-[var(--text-secondary)]">
              • Standard Polyolefins: 3.0 – 5.0<br />
              • Produce RQ Quotient: 0.8 – 1.3<br />
              • Critical for steady-state MAP equilibria
            </div>
          </div>

          <div className="p-3.5 bg-[var(--bg-card-elevated)] rounded-xl border border-[var(--border-primary)]">
            <div className="flex items-center justify-between font-bold text-[var(--text-primary)]">
              <span>Water Activity (aw) Stability</span>
              <span className="font-mono text-[10px] text-[var(--brand-primary)]">ISO 21807</span>
            </div>
            <div className="text-[11px] text-[var(--text-muted)] mt-1">Headspace Relative Humidity / 100</div>
            <div className="mt-2 text-[11px] text-[var(--text-secondary)]">
              • Safe Dry Target: aw &lt; 0.60<br />
              • Mold Limit: aw &lt; 0.80<br />
              • Bacterial Proliferation: aw &gt; 0.91
            </div>
          </div>

          <div className="p-3.5 bg-[var(--bg-card-elevated)] rounded-xl border border-[var(--border-primary)]">
            <div className="flex items-center justify-between font-bold text-[var(--text-primary)]">
              <span>Tensile & Puncture Resistance</span>
              <span className="font-mono text-[10px] text-[var(--brand-primary)]">ASTM D882 / F1306</span>
            </div>
            <div className="text-[11px] text-[var(--text-muted)] mt-1">Mechanical Durability Under Logistics</div>
            <div className="mt-2 text-[11px] text-[var(--text-secondary)]">
              • Peak puncture energy (J)<br />
              • Tensile yield stress (MPa)<br />
              • Protects against pinholing and burst
            </div>
          </div>

          <div className="p-3.5 bg-[var(--bg-card-elevated)] rounded-xl border border-[var(--border-primary)]">
            <div className="flex items-center justify-between font-bold text-[var(--text-primary)]">
              <span>Arrhenius Reaction Factor (Q10)</span>
              <span className="font-mono text-[10px] text-[var(--brand-primary)]">Kinetic Rate</span>
            </div>
            <div className="text-[11px] text-[var(--text-muted)] mt-1">Temperature Sensitivity per 10°C Shift</div>
            <div className="mt-2 text-[11px] text-[var(--text-secondary)]">
              • Produce Spoilage: Q10 ≈ 2.5<br />
              • Lipid Rancidity: Q10 ≈ 2.0 – 2.5<br />
              • Bacterial Spoilage: Q10 ≈ 3.0
            </div>
          </div>
        </div>
      </div>

      {/* 11. How PackWise AI Applies Packaging Science */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-5 sm:p-6 shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-[var(--brand-primary)]" />
          <h3 className="text-base font-bold text-[var(--text-primary)]">
            How PackWise AI Applies Packaging Science
          </h3>
        </div>
        <p className="text-xs text-[var(--text-secondary)] mb-4">
          Understand WHY our deterministic packaging recommendation engine selects particular barrier thresholds, MAP atmospheres, and sustainable materials.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-primary)]">
            <div className="font-bold text-[var(--text-primary)] mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
              <span>Sensitivity Threshold Mapping</span>
            </div>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              When a commodity is identified with High Moisture Sensitivity or High Oxygen Sensitivity, PackWise mandates materials with ASTM-certified WVTR &lt; 1.0 g/m²/day and OTR &lt; 2.0 cc/m²/day to arrest lipid oxidation and texture loss.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-primary)]">
            <div className="font-bold text-[var(--text-primary)] mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
              <span>Headspace Equilibrium Balance</span>
            </div>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              For respiring fruits and vegetables, applying an impermeable barrier causes rapid anaerobic fermentation. PackWise AI recommends micro-perforated or selective-permeability films with balanced β ratios (3.0 – 5.0).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-primary)]">
            <div className="font-bold text-[var(--text-primary)] mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
              <span>Transit & Logistics Compensation</span>
            </div>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Long-distance and export supply chains encounter temperature fluctuations and vibration. PackWise incorporates Arrhenius kinetic safety margins and requires higher tensile modulus to prevent package rupture.
            </p>
          </div>
        </div>
      </div>

      {/* 12. Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--modal-overlay)] backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto p-6 sm:p-7 shadow-2xl relative">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[var(--border-secondary)]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold text-[var(--accent-purple)] bg-[var(--accent-purple-soft)] px-2.5 py-0.5 rounded-md">
                    {selectedArticle.category}
                  </span>
                  <span className="text-xs text-[var(--text-muted)] font-medium">
                    {selectedArticle.readTime}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] mt-2 leading-snug">
                  {selectedArticle.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1.5 rounded-lg cursor-pointer hover:bg-[var(--bg-card-elevated)] transition-colors"
                title="Close guide"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="py-5 space-y-5 text-xs">
              {/* Scientific Overview */}
              <div>
                <h4 className="text-sm font-bold text-[var(--text-primary)] mb-1.5 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-[var(--brand-primary)]" />
                  <span>Scientific Overview</span>
                </h4>
                <p className="text-[var(--text-secondary)] text-xs sm:text-sm leading-relaxed">
                  {selectedArticle.fullContent.overview}
                </p>
              </div>

              {/* Governing Engineering Equations */}
              <div>
                <h4 className="text-sm font-bold text-[var(--text-primary)] mb-2 flex items-center gap-1.5">
                  <Calculator className="w-4 h-4 text-[var(--brand-primary)]" />
                  <span>Governing Engineering Equations</span>
                </h4>
                <div className="space-y-3">
                  {selectedArticle.fullContent.keyFormulas.map((f, i) => (
                    <div
                      key={i}
                      className="p-3.5 bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] rounded-xl"
                    >
                      <div className="font-bold text-[var(--brand-primary)] text-xs">{f.label}</div>
                      <div className="font-mono text-xs sm:text-sm font-bold text-[var(--text-primary)] my-2 bg-[var(--bg-card)] p-2 rounded-lg border border-[var(--border-secondary)]">
                        {f.formula}
                      </div>
                      <div className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                        {f.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Industrial Best Practices */}
              <div>
                <h4 className="text-sm font-bold text-[var(--text-primary)] mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[var(--brand-primary)]" />
                  <span>Industrial Best Practices & Engineering Guidelines</span>
                </h4>
                <ul className="space-y-2 text-[var(--text-secondary)] text-xs sm:text-sm">
                  {selectedArticle.fullContent.guidelines.map((g, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-primary)] mt-1.5 shrink-0" />
                      <span>{g}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Standard Test Protocol */}
              <div className="p-3.5 bg-[var(--badge-completed-bg)] text-[var(--badge-completed-text)] rounded-xl font-medium flex items-center gap-2">
                <Award className="w-4 h-4 shrink-0" />
                <span>
                  <strong>Standard Test Protocol:</strong> {selectedArticle.fullContent.astmStandards}
                </span>
              </div>

              {/* PackWise Recommendation Connection */}
              <div className="p-3.5 bg-[var(--accent-purple-soft)]/60 border border-[var(--accent-purple)]/20 text-[var(--text-primary)] rounded-xl text-xs">
                <div className="font-bold text-[var(--accent-purple)] mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>PackWise AI Engine Integration</span>
                </div>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  {selectedArticle.fullContent.packwiseConnection}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-[var(--border-secondary)] flex items-center justify-between">
              <span className="text-[11px] text-[var(--text-muted)]">
                Peer-reviewed packaging engineering technical guide
              </span>
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="px-5 py-2.5 bg-[var(--brand-primary)] text-[var(--brand-text)] hover:bg-[var(--brand-secondary)] text-xs font-bold rounded-xl cursor-pointer transition-colors shadow-xs"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
