import React, { useState, useEffect } from 'react';
import {
  X,
  Wheat,
  Info,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Check,
  Sparkles,
  Sliders,
  Shield,
  Layers,
  Thermometer,
  Droplet,
  Flame,
} from 'lucide-react';
import { UserFoodRecord, saveUserFood, updateUserFood, checkDuplicateFoodName } from '../data/userFoodStore';
import { PackagingAnalysis } from '../types/packaging';
import { SensitivityLevel, RespirationLevel, RiskLevel, ProductStateType } from '../data/foodDatabase';

interface AddFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (food: UserFoodRecord, isEdit: boolean) => void;
  initialFood?: UserFoodRecord | null;
  initialName?: string;
  onViewExisting?: (name: string, category: string) => void;
}

const CATEGORIES = [
  'Fruits & Vegetables',
  'Grains & Pulses',
  'Dairy Products',
  'Meat & Poultry',
  'Bakery & Snacks',
  'Beverages',
  'Spices & Condiments',
  'Processed Foods',
  'Frozen Foods',
  'Other',
] as const;

const PRODUCT_STATES: { value: ProductStateType; label: string }[] = [
  { value: 'Fresh', label: 'Fresh' },
  { value: 'Processed', label: 'Processed' },
  { value: 'Dried', label: 'Dried' },
  { value: 'Frozen', label: 'Frozen' },
  { value: 'Liquid', label: 'Liquid' },
  { value: 'Powder', label: 'Powder' },
  { value: 'Ready-to-Eat', label: 'Ready-to-Eat' },
];

const DEGRADATION_FACTORS_OPTIONS = [
  'Moisture Loss',
  'Moisture Absorption',
  'Oxidation',
  'Rancidity',
  'Microbial Growth',
  'Fungal Growth',
  'Color Degradation',
  'Texture Degradation',
  'Nutrient Loss',
  'Respiration',
  'Aroma Loss',
];

export const AddFoodModal: React.FC<AddFoodModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialFood,
  initialName = '',
  onViewExisting,
}) => {
  const isEdit = !!initialFood;

  // Basic info
  const [name, setName] = useState('');
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [state, setState] = useState<ProductStateType>('Fresh');
  const [description, setDescription] = useState('');

  // Storage Profile
  const [storageCondition, setStorageCondition] = useState<'ambient' | 'chilled' | 'frozen'>('chilled');
  const [tempMin, setTempMin] = useState<string>('');
  const [tempMax, setTempMax] = useState<string>('');
  const [rhMin, setRhMin] = useState<string>('');
  const [rhMax, setRhMax] = useState<string>('');

  // Food Characteristics
  const [moistureSensitivity, setMoistureSensitivity] = useState<SensitivityLevel>('Medium');
  const [oxygenSensitivity, setOxygenSensitivity] = useState<SensitivityLevel>('Medium');
  const [respirationRate, setRespirationRate] = useState<'Low' | 'Moderate' | 'High'>('Moderate');
  const [microbialRisk, setMicrobialRisk] = useState<RiskLevel>('Medium');

  // Packaging Requirements
  const [oxygenBarrier, setOxygenBarrier] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [moistureBarrier, setMoistureBarrier] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [gasPermeability, setGasPermeability] = useState<'Controlled' | 'Open' | 'Low'>('Controlled');
  const [mechanicalStrength, setMechanicalStrength] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [sealability, setSealability] = useState<'High' | 'Medium' | 'Low'>('High');
  const [mapSuitability, setMapSuitability] = useState(true);

  // Degradation factors
  const [degradationFactors, setDegradationFactors] = useState<string[]>([
    'Moisture Loss',
    'Oxidation',
  ]);

  // Considerations
  const [packagingConsiderations, setPackagingConsiderations] = useState('');

  // Advanced accordion
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [waterActivity, setWaterActivity] = useState('');
  const [pH, setPH] = useState('');
  const [moistureContentPercent, setMoistureContentPercent] = useState('');
  const [respirationRateNumerical, setRespirationRateNumerical] = useState('');
  const [otrRequirement, setOtrRequirement] = useState('');
  const [wvtrRequirement, setWvtrRequirement] = useState('');

  // Validation & Duplicates
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  const [existingDuplicateMatch, setExistingDuplicateMatch] = useState<{ name: string; category: string } | null>(null);
  const [allowDuplicateAsVariant, setAllowDuplicateAsVariant] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialFood) {
        setName(initialFood.name || '');
        setCategory(initialFood.backendCategory || initialFood.category || CATEGORIES[0]);
        setState(initialFood.state || 'Fresh');
        setDescription(initialFood.description || '');
        setStorageCondition(initialFood.storage?.condition || 'chilled');
        setTempMin(initialFood.storage?.temperature?.min !== undefined ? String(initialFood.storage.temperature.min) : '');
        setTempMax(initialFood.storage?.temperature?.max !== undefined ? String(initialFood.storage.temperature.max) : '');
        setRhMin(initialFood.storage?.humidity?.min !== undefined ? String(initialFood.storage.humidity.min) : '');
        setRhMax(initialFood.storage?.humidity?.max !== undefined ? String(initialFood.storage.humidity.max) : '');

        setMoistureSensitivity(initialFood.characteristics?.moistureSensitivity || 'Medium');
        setOxygenSensitivity(initialFood.characteristics?.oxygenSensitivity || 'Medium');
        const resp = initialFood.characteristics?.respiration;
        setRespirationRate(resp === 'High' ? 'High' : resp === 'Low' || resp === 'None' ? 'Low' : 'Moderate');
        setMicrobialRisk(initialFood.characteristics?.microbialRisk || 'Medium');

        setOxygenBarrier(initialFood.packagingRequirements?.oxygenBarrier || 'Medium');
        setMoistureBarrier(initialFood.packagingRequirements?.moistureBarrier || 'Medium');
        const gas = initialFood.packagingRequirements?.gasPermeability;
        setGasPermeability(
          gas === 'Open' || gas === 'High Exchange' ? 'Open' : gas === 'Low' || gas === 'Restricted' ? 'Low' : 'Controlled'
        );
        const mech = initialFood.packagingRequirements?.mechanicalStrength;
        setMechanicalStrength(
          mech === 'Low' || mech === 'Standard' ? 'Low' : mech === 'High' ? 'High' : 'Medium'
        );
        const seal = initialFood.packagingRequirements?.sealability;
        setSealability(
          seal === 'Low' ? 'Low' : seal === 'Standard' || seal === 'Medium' ? 'Medium' : 'High'
        );
        setMapSuitability(initialFood.packagingRequirements?.mapSuitability ?? true);

        setDegradationFactors(initialFood.degradationFactors || ['Moisture Loss', 'Oxidation']);
        setPackagingConsiderations(initialFood.packagingConsiderations || '');

        setWaterActivity(initialFood.advancedTechnicalData?.waterActivity || '');
        setPH(initialFood.advancedTechnicalData?.pH || '');
        setMoistureContentPercent(initialFood.advancedTechnicalData?.moistureContentPercent || '');
        setRespirationRateNumerical(initialFood.advancedTechnicalData?.respirationRateNumerical || '');
        setOtrRequirement(initialFood.advancedTechnicalData?.otrRequirement || '');
        setWvtrRequirement(initialFood.advancedTechnicalData?.wvtrRequirement || '');
      } else {
        // Reset defaults
        setName(initialName || '');
        setCategory(CATEGORIES[0]);
        setState('Fresh');
        setDescription('');
        setStorageCondition('chilled');
        setTempMin('');
        setTempMax('');
        setRhMin('');
        setRhMax('');
        setMoistureSensitivity('Medium');
        setOxygenSensitivity('Medium');
        setRespirationRate('Moderate');
        setMicrobialRisk('Medium');
        setOxygenBarrier('Medium');
        setMoistureBarrier('Medium');
        setGasPermeability('Controlled');
        setMechanicalStrength('Medium');
        setSealability('High');
        setMapSuitability(true);
        setDegradationFactors(['Moisture Loss', 'Oxidation']);
        setPackagingConsiderations('');
        setShowAdvanced(false);
        setWaterActivity('');
        setPH('');
        setMoistureContentPercent('');
        setRespirationRateNumerical('');
        setOtrRequirement('');
        setWvtrRequirement('');
      }
      setErrors({});
      setDuplicateWarning(null);
      setExistingDuplicateMatch(null);
      setAllowDuplicateAsVariant(false);
    }
  }, [isOpen, initialFood, initialName]);

  // Check duplicate when name changes
  const handleNameChange = (val: string) => {
    setName(val);
    if (errors.name) {
      setErrors((prev) => ({ ...prev, name: '' }));
    }
    if (!val.trim()) {
      setDuplicateWarning(null);
      setExistingDuplicateMatch(null);
      return;
    }
    const check = checkDuplicateFoodName(val, category, initialFood?.id);
    if (check.exists) {
      setDuplicateWarning(`A profile for ${check.existingFood?.name || val} already exists in this category.`);
      setExistingDuplicateMatch({
        name: check.existingFood?.name || val,
        category: check.existingFood?.category || category,
      });
    } else {
      setDuplicateWarning(null);
      setExistingDuplicateMatch(null);
    }
  };

  const toggleDegradationFactor = (factor: string) => {
    setDegradationFactors((prev) =>
      prev.includes(factor) ? prev.filter((f) => f !== factor) : [...prev, factor]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) {
      newErrors.name = 'Food name is required.';
    }
    if (!category) {
      newErrors.category = 'Category is required.';
    }
    if (!state) {
      newErrors.state = 'Product state is required.';
    }

    if (duplicateWarning && !allowDuplicateAsVariant && !isEdit) {
      newErrors.name = 'A profile with this name already exists. Choose "Add as Variant" to continue.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const cleanName = name.trim();
    const finalId = initialFood?.id || `user-food-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;

    const backendCategory: PackagingAnalysis['category'] =
      category === 'Fruits & Vegetables'
        ? 'Fruits & Vegetables'
        : category === 'Grains & Pulses'
        ? 'Grains & Pulses'
        : category === 'Dairy Products'
        ? 'Dairy Products'
        : category === 'Bakery & Snacks'
        ? 'Bakery & Snacks'
        : category === 'Meat & Poultry'
        ? 'Meat & Poultry'
        : 'Others';

    const respRateLevel: RespirationLevel =
      respirationRate === 'High' ? 'High' : respirationRate === 'Moderate' ? 'Medium' : 'Low';

    const thumbnailType: PackagingAnalysis['thumbnailType'] =
      category.toLowerCase().includes('fruit') || category.toLowerCase().includes('veg')
        ? 'apple'
        : category.toLowerCase().includes('grain')
        ? 'grain'
        : category.toLowerCase().includes('dairy')
        ? 'milk'
        : category.toLowerCase().includes('meat')
        ? 'meat'
        : category.toLowerCase().includes('snack') || category.toLowerCase().includes('bake')
        ? 'bread'
        : 'tomato';

    const preferredMaterials =
      state === 'Fresh'
        ? ['breathable-film', 'micro-perforated-film', 'pet-barrier-pe', 'mono-pe']
        : state === 'Dried'
        ? ['mono-pp', 'bopp', 'met-pet-pe', 'pet-pe']
        : state === 'Liquid'
        ? ['hdpe-bottle', 'evoh-multilayer', 'pet-barrier-pe']
        : ['pet-barrier-pe', 'mono-pe', 'aluminum-foil-laminate'];

    const userRecord: UserFoodRecord = {
      id: finalId,
      name: cleanName,
      category,
      foodGroup: category,
      state,
      source: 'user',
      description: description.trim(),
      storage: {
        condition: storageCondition,
        temperature: {
          min: tempMin.trim() ? Number(tempMin) : undefined,
          max: tempMax.trim() ? Number(tempMax) : undefined,
        },
        humidity: {
          min: rhMin.trim() ? Number(rhMin) : undefined,
          max: rhMax.trim() ? Number(rhMax) : undefined,
        },
      },
      characteristics: {
        moistureSensitivity,
        oxygenSensitivity,
        respiration: respRateLevel,
        microbialRisk,
        waterActivity: waterActivity.trim() || undefined,
      },
      storageProfiles: {
        ambient: {
          suitable: storageCondition === 'ambient',
          typicalShelfLife: storageCondition === 'ambient' ? '7–30 Days' : 'Short holding only',
          note: 'Ambient storage profile configured by user',
        },
        chilled: {
          suitable: storageCondition === 'chilled' || storageCondition === 'ambient',
          typicalShelfLife: '14–45 Days',
          tempRangeC: tempMin && tempMax ? `${tempMin}–${tempMax}°C` : '2–8°C',
          note: 'Refrigerated cold chain condition',
        },
        frozen: {
          suitable: storageCondition === 'frozen',
          typicalShelfLife: '90–180 Days',
          note: 'Deep freeze cold storage',
        },
      },
      packagingRequirements: {
        oxygenBarrier,
        moistureBarrier,
        gasPermeability,
        mechanicalStrength,
        sealability,
        mapSuitability,
      },
      preferredPackaging: preferredMaterials,
      aliases: [cleanName.toLowerCase(), `${cleanName.toLowerCase()} variant`],
      backendCategory,
      thumbnailType,
      explanationNotes:
        packagingConsiderations.trim() ||
        `User-specified food commodity profile for ${cleanName} (${category}). Configured with ${moistureSensitivity.toLowerCase()} moisture sensitivity and ${oxygenSensitivity.toLowerCase()} oxygen barrier needs.`,
      degradationFactors,
      packagingConsiderations: packagingConsiderations.trim(),
      advancedTechnicalData: {
        waterActivity: waterActivity.trim() || undefined,
        pH: pH.trim() || undefined,
        moistureContentPercent: moistureContentPercent.trim() || undefined,
        respirationRateNumerical: respirationRateNumerical.trim() || undefined,
        otrRequirement: otrRequirement.trim() || undefined,
        wvtrRequirement: wvtrRequirement.trim() || undefined,
      },
      createdAt: initialFood?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isEdit) {
      updateUserFood(finalId, userRecord);
    } else {
      saveUserFood(userRecord);
    }

    onSuccess(userRecord, isEdit);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[var(--modal-overlay)] backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col transition-colors duration-200">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-[var(--border-secondary)] bg-[var(--bg-card-elevated)] flex items-start justify-between gap-4 sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[var(--badge-completed-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/20">
                <Wheat className="w-3.5 h-3.5" />
                <span>{isEdit ? 'Edit Commodity' : 'Add Food Commodity'}</span>
              </span>
              <span className="text-[10px] font-semibold text-[var(--text-muted)] bg-[var(--bg-card)] px-2 py-0.5 rounded border border-[var(--border-secondary)]">
                USER ADDED
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] mt-1.5">
              {isEdit ? `Edit ${initialFood?.name}` : 'Add Food Commodity'}
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Add a food profile to the packaging knowledge database.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)] rounded-lg cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-6 text-xs text-[var(--text-primary)]">
          {/* Data Source Notice */}
          <div className="p-3 rounded-xl bg-[var(--badge-completed-bg)] border border-[var(--brand-primary)]/20 flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-[var(--brand-primary)] shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-[var(--brand-primary)]">
                Data Source: User Added
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                This food profile will be saved to your local knowledge database and marked with a <strong>USER ADDED</strong> badge. It will immediately be accessible in New Analysis and the recommendation engine.
              </p>
            </div>
          </div>

          {/* Section 1: Basic Information */}
          <div className="space-y-3.5 pt-1">
            <div className="flex items-center gap-2 pb-1 border-b border-[var(--border-secondary)]">
              <Sparkles className="w-4 h-4 text-[var(--brand-primary)]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                1. Basic Information
              </h4>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
                Food Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Guava, Dragon Fruit, Artisan Sourdough"
                className={`w-full px-3.5 py-2 text-xs bg-[var(--bg-input)] border rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] ${
                  errors.name ? 'border-rose-500' : 'border-[var(--border-primary)]'
                }`}
              />
              {errors.name && (
                <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.name}</span>
                </p>
              )}

              {duplicateWarning && (
                <div className="mt-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-200 space-y-2">
                  <div className="flex items-center gap-1.5 font-medium">
                    <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span>{duplicateWarning}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 pt-0.5">
                    {onViewExisting && existingDuplicateMatch && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onViewExisting(existingDuplicateMatch.name, existingDuplicateMatch.category);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-[var(--bg-card)] border border-amber-500/30 text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] cursor-pointer"
                      >
                        View Existing Profile
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        const variantName = `${name.trim()} - Variant`;
                        setName(variantName);
                        setAllowDuplicateAsVariant(true);
                        setDuplicateWarning(null);
                        setExistingDuplicateMatch(null);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold cursor-pointer transition-colors shadow-2xs"
                    >
                      Save as Variant ({name.trim()} - Variant)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setName('');
                        setDuplicateWarning(null);
                        setExistingDuplicateMatch(null);
                        setAllowDuplicateAsVariant(false);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-[var(--bg-card)] border border-[var(--border-secondary)] text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    if (name.trim()) handleNameChange(name);
                  }}
                  className="w-full px-3 py-2 text-xs bg-[var(--bg-input)] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
                  Product State <span className="text-rose-500">*</span>
                </label>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {PRODUCT_STATES.map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => setState(s.value)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer border ${
                        state === s.value
                          ? 'bg-[var(--brand-primary)] text-[var(--brand-text)] font-semibold border-[var(--brand-primary)] shadow-2xs'
                          : 'bg-[var(--bg-card-elevated)] text-[var(--text-secondary)] border-[var(--border-primary)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
                Description <span className="text-[11px] font-normal text-[var(--text-muted)]">(Optional)</span>
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the food commodity..."
                className="w-full px-3.5 py-2 text-xs bg-[var(--bg-input)] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] placeholder:text-[var(--text-muted)] resize-none"
              />
            </div>
          </div>

          {/* Section 2: Storage Profile */}
          <div className="space-y-3.5 pt-1">
            <div className="flex items-center gap-2 pb-1 border-b border-[var(--border-secondary)]">
              <Thermometer className="w-4 h-4 text-[var(--brand-primary)]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                2. Storage Profile
              </h4>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
                Typical Storage Condition
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'ambient', label: 'Ambient', desc: 'Room Temp (~20°C)' },
                  { id: 'chilled', label: 'Chilled', desc: 'Cold Chain (2°C – 8°C)' },
                  { id: 'frozen', label: 'Frozen', desc: 'Deep Freeze (-18°C)' },
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setStorageCondition(c.id as any)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      storageCondition === c.id
                        ? 'border-[var(--brand-primary)] bg-[var(--badge-completed-bg)] text-[var(--brand-primary)] font-bold'
                        : 'border-[var(--border-primary)] bg-[var(--bg-card-elevated)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]'
                    }`}
                  >
                    <div className="font-semibold text-xs text-[var(--text-primary)]">{c.label}</div>
                    <div className="text-[10px] text-[var(--text-muted)] mt-0.5">{c.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-[var(--text-primary)]">
                  <span>Recommended Temperature</span>
                  <span className="text-[10px] text-[var(--text-muted)] font-normal">Optional</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-[var(--text-muted)]">Min (°C)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={tempMin}
                      onChange={(e) => setTempMin(e.target.value)}
                      placeholder="e.g. 2"
                      className="w-full mt-0.5 px-2.5 py-1.5 text-xs bg-[var(--bg-input)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[var(--text-muted)]">Max (°C)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={tempMax}
                      onChange={(e) => setTempMax(e.target.value)}
                      placeholder="e.g. 8"
                      className="w-full mt-0.5 px-2.5 py-1.5 text-xs bg-[var(--bg-input)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)]"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-[var(--text-primary)]">
                  <span>Relative Humidity</span>
                  <span className="text-[10px] text-[var(--text-muted)] font-normal">Optional</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-[var(--text-muted)]">Min (% RH)</label>
                    <input
                      type="number"
                      value={rhMin}
                      onChange={(e) => setRhMin(e.target.value)}
                      placeholder="e.g. 85"
                      className="w-full mt-0.5 px-2.5 py-1.5 text-xs bg-[var(--bg-input)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[var(--text-muted)]">Max (% RH)</label>
                    <input
                      type="number"
                      value={rhMax}
                      onChange={(e) => setRhMax(e.target.value)}
                      placeholder="e.g. 95"
                      className="w-full mt-0.5 px-2.5 py-1.5 text-xs bg-[var(--bg-input)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Food Characteristics */}
          <div className="space-y-3.5 pt-1">
            <div className="flex items-center gap-2 pb-1 border-b border-[var(--border-secondary)]">
              <Sliders className="w-4 h-4 text-[var(--brand-primary)]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                3. Food Characteristics
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Moisture Sensitivity */}
              <div className="p-3 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 font-semibold text-xs text-[var(--text-primary)]">
                    <Droplet className="w-3.5 h-3.5 text-blue-500" />
                    <span>Moisture Sensitivity</span>
                  </div>
                  <div className="group relative">
                    <Info className="w-3.5 h-3.5 text-[var(--text-muted)] cursor-help" />
                    <div className="hidden group-hover:block absolute right-0 bottom-full mb-1 w-48 p-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-primary)] shadow-lg text-[10px] text-[var(--text-secondary)] z-20">
                      Indicates how strongly moisture gain or loss can affect product quality.
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-1 pt-1">
                  {(['Low', 'Medium', 'High'] as SensitivityLevel[]).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setMoistureSensitivity(lvl)}
                      className={`py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        moistureSensitivity === lvl
                          ? 'bg-[var(--brand-primary)] text-[var(--brand-text)] shadow-2xs'
                          : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border-secondary)] hover:bg-[var(--bg-card-hover)]'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Oxygen Sensitivity */}
              <div className="p-3 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 font-semibold text-xs text-[var(--text-primary)]">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    <span>Oxygen Sensitivity</span>
                  </div>
                  <div className="group relative">
                    <Info className="w-3.5 h-3.5 text-[var(--text-muted)] cursor-help" />
                    <div className="hidden group-hover:block absolute right-0 bottom-full mb-1 w-48 p-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-primary)] shadow-lg text-[10px] text-[var(--text-secondary)] z-20">
                      Indicates sensitivity to oxidative deterioration, nutrient degradation, and rancidity.
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-1 pt-1">
                  {(['Low', 'Medium', 'High'] as SensitivityLevel[]).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setOxygenSensitivity(lvl)}
                      className={`py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        oxygenSensitivity === lvl
                          ? 'bg-[var(--brand-primary)] text-[var(--brand-text)] shadow-2xs'
                          : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border-secondary)] hover:bg-[var(--bg-card-hover)]'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Respiration Rate */}
              <div className="p-3 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 font-semibold text-xs text-[var(--text-primary)]">
                    <Sliders className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Respiration Rate</span>
                  </div>
                  <div className="group relative">
                    <Info className="w-3.5 h-3.5 text-[var(--text-muted)] cursor-help" />
                    <div className="hidden group-hover:block absolute right-0 bottom-full mb-1 w-48 p-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-primary)] shadow-lg text-[10px] text-[var(--text-secondary)] z-20">
                      Indicates the rate of O₂ consumption and CO₂ release in living tissues.
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-1 pt-1">
                  {(['Low', 'Moderate', 'High'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setRespirationRate(lvl)}
                      className={`py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        respirationRate === lvl
                          ? 'bg-[var(--brand-primary)] text-[var(--brand-text)] shadow-2xs'
                          : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border-secondary)] hover:bg-[var(--bg-card-hover)]'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Microbial Risk */}
              <div className="p-3 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 font-semibold text-xs text-[var(--text-primary)]">
                    <Shield className="w-3.5 h-3.5 text-rose-500" />
                    <span>Microbial Risk</span>
                  </div>
                  <div className="group relative">
                    <Info className="w-3.5 h-3.5 text-[var(--text-muted)] cursor-help" />
                    <div className="hidden group-hover:block absolute right-0 bottom-full mb-1 w-48 p-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-primary)] shadow-lg text-[10px] text-[var(--text-secondary)] z-20">
                      Indicates susceptibility to bacterial and fungal spoilage based on water activity and pH.
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-1 pt-1">
                  {(['Low', 'Medium', 'High'] as RiskLevel[]).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setMicrobialRisk(lvl)}
                      className={`py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        microbialRisk === lvl
                          ? 'bg-[var(--brand-primary)] text-[var(--brand-text)] shadow-2xs'
                          : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border-secondary)] hover:bg-[var(--bg-card-hover)]'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Packaging Requirements */}
          <div className="space-y-3.5 pt-1">
            <div className="flex items-center gap-2 pb-1 border-b border-[var(--border-secondary)]">
              <Layers className="w-4 h-4 text-[var(--brand-primary)]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                4. Packaging Requirements
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
                  Oxygen Barrier
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {(['Low', 'Medium', 'High'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setOxygenBarrier(lvl)}
                      className={`py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                        oxygenBarrier === lvl
                          ? 'bg-[var(--brand-primary)] text-[var(--brand-text)] font-semibold shadow-2xs'
                          : 'bg-[var(--bg-card-elevated)] border border-[var(--border-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
                  Moisture Barrier
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {(['Low', 'Medium', 'High'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setMoistureBarrier(lvl)}
                      className={`py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                        moistureBarrier === lvl
                          ? 'bg-[var(--brand-primary)] text-[var(--brand-text)] font-semibold shadow-2xs'
                          : 'bg-[var(--bg-card-elevated)] border border-[var(--border-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
                  Gas Permeability
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { value: 'Open', label: 'Open' },
                    { value: 'Controlled', label: 'Controlled' },
                    { value: 'Low', label: 'Low' },
                  ].map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setGasPermeability(item.value as any)}
                      className={`py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                        gasPermeability === item.value
                          ? 'bg-[var(--brand-primary)] text-[var(--brand-text)] font-semibold shadow-2xs'
                          : 'bg-[var(--bg-card-elevated)] border border-[var(--border-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
                  Mechanical Strength
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { value: 'Low', label: 'Low' },
                    { value: 'Medium', label: 'Medium' },
                    { value: 'High', label: 'High' },
                  ].map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setMechanicalStrength(item.value as any)}
                      className={`py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                        mechanicalStrength === item.value
                          ? 'bg-[var(--brand-primary)] text-[var(--brand-text)] font-semibold shadow-2xs'
                          : 'bg-[var(--bg-card-elevated)] border border-[var(--border-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
                  Sealability
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { value: 'Low', label: 'Low' },
                    { value: 'Medium', label: 'Medium' },
                    { value: 'High', label: 'High' },
                  ].map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setSealability(item.value as any)}
                      className={`py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                        sealability === item.value
                          ? 'bg-[var(--brand-primary)] text-[var(--brand-text)] font-semibold shadow-2xs'
                          : 'bg-[var(--bg-card-elevated)] border border-[var(--border-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col justify-end">
                <label className="flex items-center justify-between p-2.5 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card-elevated)] cursor-pointer">
                  <div className="pr-2">
                    <div className="text-xs font-semibold text-[var(--text-primary)]">MAP Suitability</div>
                    <div className="text-[10px] text-[var(--text-muted)]">Modified atmosphere packaging</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={mapSuitability}
                    onChange={(e) => setMapSuitability(e.target.checked)}
                    className="w-4 h-4 accent-[var(--brand-primary)] rounded cursor-pointer"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Section 5: Degradation Factors */}
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center justify-between pb-1 border-b border-[var(--border-secondary)]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                5. Degradation Factors <span className="text-[10px] font-normal text-[var(--text-muted)]">(Select all that apply)</span>
              </h4>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {DEGRADATION_FACTORS_OPTIONS.map((factor) => {
                const selected = degradationFactors.includes(factor);
                return (
                  <button
                    key={factor}
                    type="button"
                    onClick={() => toggleDegradationFactor(factor)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all cursor-pointer flex items-center gap-1.5 border ${
                      selected
                        ? 'bg-[var(--badge-completed-bg)] text-[var(--brand-primary)] border-[var(--brand-primary)]/40 font-bold shadow-2xs'
                        : 'bg-[var(--bg-card-elevated)] text-[var(--text-secondary)] border-[var(--border-primary)] hover:bg-[var(--bg-card-hover)]'
                    }`}
                  >
                    {selected && <Check className="w-3 h-3 text-[var(--brand-primary)]" />}
                    <span>{factor}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 6: Packaging Considerations */}
          <div className="space-y-2 pt-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
              6. Packaging Considerations <span className="text-[10px] font-normal text-[var(--text-muted)]">(Optional)</span>
            </label>
            <textarea
              rows={2}
              value={packagingConsiderations}
              onChange={(e) => setPackagingConsiderations(e.target.value)}
              placeholder="Describe any known packaging considerations, handling requirements, or special conditions (e.g. Requires breathable packaging because of active respiration)..."
              className="w-full px-3.5 py-2 text-xs bg-[var(--bg-input)] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] placeholder:text-[var(--text-muted)] resize-none"
            />
          </div>

          {/* Section 7: Optional Advanced Data (Accordion) */}
          <div className="border border-[var(--border-secondary)] rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full p-3.5 bg-[var(--bg-card-elevated)] flex items-center justify-between text-left cursor-pointer hover:bg-[var(--bg-card-hover)] transition-colors"
            >
              <div>
                <div className="text-xs font-bold text-[var(--text-primary)]">
                  Advanced Technical Data
                </div>
                <div className="text-[10.5px] text-[var(--text-muted)] mt-0.5">
                  Advanced fields are optional and intended for technical users.
                </div>
              </div>
              {showAdvanced ? (
                <ChevronUp className="w-4 h-4 text-[var(--text-muted)]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />
              )}
            </button>

            {showAdvanced && (
              <div className="p-4 space-y-3 bg-[var(--bg-card)] border-t border-[var(--border-secondary)] animate-in fade-in duration-150">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-[var(--text-muted)] mb-1">
                      Water Activity (aw)
                    </label>
                    <input
                      type="text"
                      value={waterActivity}
                      onChange={(e) => setWaterActivity(e.target.value)}
                      placeholder="e.g. 0.92"
                      className="w-full px-3 py-1.5 text-xs bg-[var(--bg-input)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[var(--text-muted)] mb-1">
                      pH Level
                    </label>
                    <input
                      type="text"
                      value={pH}
                      onChange={(e) => setPH(e.target.value)}
                      placeholder="e.g. 5.8"
                      className="w-full px-3 py-1.5 text-xs bg-[var(--bg-input)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[var(--text-muted)] mb-1">
                      Moisture Content (%)
                    </label>
                    <input
                      type="text"
                      value={moistureContentPercent}
                      onChange={(e) => setMoistureContentPercent(e.target.value)}
                      placeholder="e.g. 84%"
                      className="w-full px-3 py-1.5 text-xs bg-[var(--bg-input)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[var(--text-muted)] mb-1">
                      Respiration Rate (Numerical)
                    </label>
                    <input
                      type="text"
                      value={respirationRateNumerical}
                      onChange={(e) => setRespirationRateNumerical(e.target.value)}
                      placeholder="e.g. 25 mg CO₂/kg·h"
                      className="w-full px-3 py-1.5 text-xs bg-[var(--bg-input)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[var(--text-muted)] mb-1">
                      OTR Target Requirement
                    </label>
                    <input
                      type="text"
                      value={otrRequirement}
                      onChange={(e) => setOtrRequirement(e.target.value)}
                      placeholder="e.g. < 50 cc/m²/24h"
                      className="w-full px-3 py-1.5 text-xs bg-[var(--bg-input)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[var(--text-muted)] mb-1">
                      WVTR Target Requirement
                    </label>
                    <input
                      type="text"
                      value={wvtrRequirement}
                      onChange={(e) => setWvtrRequirement(e.target.value)}
                      placeholder="e.g. < 2.0 g/m²/24h"
                      className="w-full px-3 py-1.5 text-xs bg-[var(--bg-input)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)]"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Live Preview Summary (Requirement #13) */}
          <div className="p-4 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-secondary)]">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  Live Profile Preview
                </span>
              </div>
              <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                USER ADDED
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="text-sm font-bold text-[var(--text-primary)]">
                  {name.trim() || 'Unnamed Food Commodity'}
                </div>
                <div className="text-xs text-[var(--text-secondary)] mt-0.5">
                  {category} · {state}
                </div>
              </div>
              <div className="text-[11px] text-[var(--text-muted)] bg-[var(--bg-card)] px-2.5 py-1 rounded-lg border border-[var(--border-secondary)] self-start sm:self-auto">
                Storage: <span className="font-semibold text-[var(--text-primary)] capitalize">{storageCondition}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-secondary)]">
                <div className="text-[10.5px] text-[var(--text-muted)] font-medium">Sensitivity Summary</div>
                <div className="font-semibold text-[var(--text-primary)] mt-0.5">
                  Moisture: {moistureSensitivity} · Oxygen: {oxygenSensitivity} · Respiration: {respirationRate}
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-secondary)]">
                <div className="text-[10.5px] text-[var(--text-muted)] font-medium">Recommended Packaging (Live)</div>
                <div className="font-semibold text-[var(--brand-primary)] mt-0.5 truncate">
                  {(() => {
                    if (state === 'Fresh') {
                      if (respirationRate === 'High' || gasPermeability === 'Open') {
                        return 'Breathable / Micro-Perforated Equilibrium Film' + (mapSuitability ? ' (MAP Suitable)' : '');
                      }
                      return 'Recyclable Mono-Material PE Film with Anti-Fog' + (mapSuitability ? ' (MAP Suitable)' : '');
                    }
                    if (state === 'Dried' || state === 'Powder') {
                      return oxygenBarrier === 'High'
                        ? 'High-Barrier Metallized Pouch (PET/Met-PET/PE)'
                        : 'Mono-Material PP Moisture Barrier Pouch';
                    }
                    if (state === 'Liquid') {
                      return 'Rigid HDPE Bottle / Multi-layer Barrier Pouch';
                    }
                    return oxygenBarrier === 'High'
                      ? 'PET / Barrier / PE Multi-layer Laminate' + (mapSuitability ? ' (MAP)' : '')
                      : 'Mono-Material PE Pouch';
                  })()}
                </div>
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-[var(--border-secondary)] flex items-center justify-between gap-3 sticky bottom-0 bg-[var(--bg-card)] py-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[var(--border-cta)] bg-[var(--bg-card-elevated)] text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[var(--brand-primary)] text-[var(--brand-text)] hover:bg-[var(--brand-secondary)] text-xs font-semibold shadow-xs cursor-pointer transition-colors flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isEdit ? 'Update Food Profile' : 'Save Food Profile'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
