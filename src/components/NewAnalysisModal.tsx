import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCw,
  Check,
  CheckCircle2,
  AlertCircle,
  Scale,
  FileText,
  Download,
} from 'lucide-react';
import { PackagingAnalysis } from '../types/packaging';
import {
  ProductStateType,
  RespirationType,
  ApplicationType,
  StorageConditionType,
  TransitDistanceType,
  ShelfLifeUnitType,
  IdentifiedFoodProfile,
  PackagingAlternativeItem,
  AnalysisStage,
} from './analysis/types';
import {
  deriveFoodProfile,
  deriveFoodRiskProfile,
  derivePackagingRequirements,
  derivePackagingSolution,
} from './analysis/analysisLogic';
import {
  generatePackagingRecommendation,
  RecommendationResult,
} from '../services/recommendationEngine';
import { RecommendationInput } from '../data/recommendationRules';
import { Step1ProductIdentification } from './analysis/Step1ProductIdentification';
import { Step2Application } from './analysis/Step2Application';
import { Step3StorageTransit } from './analysis/Step3StorageTransit';
import { Step4FoodAnalysis } from './analysis/Step4FoodAnalysis';
import { Step5Requirements } from './analysis/Step5Requirements';
import { Step6Recommendation } from './analysis/Step6Recommendation';
import { Step7Options } from './analysis/Step7Options';

interface NewAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveAnalysis: (analysis: PackagingAnalysis) => void;
  initialProduct?: string;
  initialCategory?: PackagingAnalysis['category'];
}

const ANALYSIS_STEPS = [
  { num: 1, label: 'Product' },
  { num: 2, label: 'Application' },
  { num: 3, label: 'Storage & Transit' },
  { num: 4, label: 'Food Analysis' },
  { num: 5, label: 'Requirements' },
  { num: 6, label: 'Recommendation' },
  { num: 7, label: 'Options' },
] as const;

export const NewAnalysisModal: React.FC<NewAnalysisModalProps> = ({
  isOpen,
  onClose,
  onSaveAnalysis,
  initialProduct,
  initialCategory,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7>(1);
  const [isSimulating, setIsSimulating] = useState(false);
  const [analysisStage, setAnalysisStage] = useState<AnalysisStage>('completed');
  const [showAnalysisBasis, setShowAnalysisBasis] = useState(false);

  // Step 1: Search & AI Identification state
  const [searchTerm, setSearchTerm] = useState('Mango');
  const [identifiedFood, setIdentifiedFood] = useState<IdentifiedFoodProfile>(() =>
    deriveFoodProfile('Mango')
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editableCategory, setEditableCategory] = useState('Fresh Fruit');
  const [editableFoodGroup, setEditableFoodGroup] = useState('Fresh Produce');
  const [editableProductState, setEditableProductState] = useState<ProductStateType>('Fresh');
  const [editableRespiration, setEditableRespiration] = useState<RespirationType>('Active');

  // Step 2: Application Requirements state
  const [selectedApps, setSelectedApps] = useState<ApplicationType[]>([
    'storage',
    'transportation',
  ]);
  const [transportDistance, setTransportDistance] = useState<'Local' | 'Regional' | 'Long Distance'>('Regional');
  const [exportDistance, setExportDistance] = useState<'Regional' | 'International'>('International');

  // Step 3: Storage & Transit conditions state
  const [productName, setProductName] = useState('Mango');
  const [category, setCategory] = useState<PackagingAnalysis['category']>('Fruits & Vegetables');
  const [storageCondition, setStorageCondition] = useState<StorageConditionType>('chilled');
  const [shelfLifeNumber, setShelfLifeNumber] = useState<number>(30);
  const [shelfLifeUnit, setShelfLifeUnit] = useState<ShelfLifeUnitType>('Days');
  const [transitDistance, setTransitDistance] = useState<TransitDistanceType>('regional');
  const [showAdvancedConditions, setShowAdvancedConditions] = useState(false);
  const [customTemperature, setCustomTemperature] = useState('');
  const [customHumidity, setCustomHumidity] = useState('');

  // Step 6 & 7 interactive states
  const [showAnalysisDetails, setShowAnalysisDetails] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [comparingAlternative, setComparingAlternative] = useState<PackagingAlternativeItem | null>(null);
  const [showDecisionChain, setShowDecisionChain] = useState(false);
  const [selectedOption, setSelectedOption] = useState<'recommended' | 'alternative' | 'sustainable'>('recommended');
  const [showCostEstimationDetails, setShowCostEstimationDetails] = useState(false);
  const [showTechSpecModal, setShowTechSpecModal] = useState(false);

  const [generatedResult, setGeneratedResult] = useState<PackagingAnalysis | null>(null);
  type GenerationState = 'idle' | 'analyzing' | 'determining' | 'matching' | 'generating' | 'completed' | 'error';
  const [generationState, setGenerationState] = useState<GenerationState>('idle');
  const [generationErrorMessage, setGenerationErrorMessage] = useState<string | null>(null);
  const [recommendationResult, setRecommendationResult] = useState<RecommendationResult | null>(null);

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    if (isOpen) {
      const initName = initialProduct || 'Mango';
      setSearchTerm(initName);
      const derived = deriveFoodProfile(initName);
      if (initialCategory) {
        derived.backendCategory = initialCategory;
      }
      setIdentifiedFood(derived);
      setEditableCategory(derived.category);
      setEditableFoodGroup(derived.foodGroup);
      setEditableProductState(derived.productState);
      setEditableRespiration(derived.respiration);
      setProductName(derived.name);
      setCategory(derived.backendCategory);
      setIsEditing(false);
      setStep(1);
      setAnalysisStage('completed');
      setRecommendationResult(null);
      setShowAnalysisDetails(false);
      setShowCompareModal(false);
      setComparingAlternative(null);
      setShowDecisionChain(false);
      setSelectedOption('recommended');
    }
  }, [isOpen, initialProduct, initialCategory]);

  const runStep4FoodAnalysis = async () => {
    try {
      setAnalysisStage('identifying');
      await delay(300);
      setAnalysisStage('analyzing_storage');
      await delay(300);
      setAnalysisStage('analyzing_transport');
      await delay(300);
      setAnalysisStage('building_risk_profile');
      await delay(300);

      const input: RecommendationInput = {
        product: productName || identifiedFood.name || 'Mango',
        application: {
          storage: selectedApps.includes('storage'),
          transportation: selectedApps.includes('transportation'),
          retail: selectedApps.includes('retail'),
          export: selectedApps.includes('export') || transitDistance === 'long_distance',
        },
        storage: {
          type: storageCondition,
          temperature: customTemperature,
          humidity: customHumidity,
        },
        shelfLife: {
          value: shelfLifeNumber,
          unit: (shelfLifeUnit.toLowerCase() as any) || 'days',
        },
        transportation: {
          distance: transitDistance,
        },
      };

      const result = generatePackagingRecommendation(input);
      setRecommendationResult(result);
      setAnalysisStage('completed');

      // Auto continue to next step (Step 5) as specified in Step 12
      await delay(600);
      setStep(5);
    } catch (err) {
      console.error('Packaging analysis error:', err);
      setAnalysisStage('error');
    }
  };

  useEffect(() => {
    if (step === 4 && analysisStage === 'identifying') {
      let isMounted = true;
      const execute = async () => {
        try {
          await delay(300);
          if (!isMounted) return;
          setAnalysisStage('analyzing_storage');

          await delay(300);
          if (!isMounted) return;
          setAnalysisStage('analyzing_transport');

          await delay(300);
          if (!isMounted) return;
          setAnalysisStage('building_risk_profile');

          await delay(300);
          if (!isMounted) return;

          const input: RecommendationInput = {
            product: productName || identifiedFood.name || 'Mango',
            application: {
              storage: selectedApps.includes('storage'),
              transportation: selectedApps.includes('transportation'),
              retail: selectedApps.includes('retail'),
              export: selectedApps.includes('export') || transitDistance === 'long_distance',
            },
            storage: {
              type: storageCondition,
              temperature: customTemperature,
              humidity: customHumidity,
            },
            shelfLife: {
              value: shelfLifeNumber,
              unit: (shelfLifeUnit.toLowerCase() as any) || 'days',
            },
            transportation: {
              distance: transitDistance,
            },
          };

          const result = generatePackagingRecommendation(input);
          if (!isMounted) return;
          setRecommendationResult(result);
          setAnalysisStage('completed');

          await delay(600);
          if (!isMounted) return;
          setStep(5);
        } catch (err) {
          console.error('Analysis stage error:', err);
          if (isMounted) {
            setAnalysisStage('error');
          }
        }
      };

      execute();

      return () => {
        isMounted = false;
      };
    }
  }, [step]);

  const foodRiskProfile = deriveFoodRiskProfile(
    identifiedFood.name || productName,
    identifiedFood.category,
    identifiedFood.productState,
    storageCondition,
    shelfLifeNumber,
    transitDistance
  );

  const packagingRequirements = derivePackagingRequirements(
    identifiedFood.name || productName,
    identifiedFood.category,
    identifiedFood.productState,
    identifiedFood.respiration,
    storageCondition,
    shelfLifeNumber,
    shelfLifeUnit,
    transitDistance,
    foodRiskProfile
  );

  const packagingSolution = derivePackagingSolution(
    identifiedFood.name || productName,
    category,
    identifiedFood.productState,
    identifiedFood.respiration,
    storageCondition,
    shelfLifeNumber,
    shelfLifeUnit,
    transitDistance,
    foodRiskProfile,
    packagingRequirements
  );

  const activeRiskProfile = recommendationResult?.riskProfile || foodRiskProfile;
  const activePackagingRequirements = recommendationResult?.requirements || packagingRequirements;
  const activePackagingSolution = recommendationResult?.recommendation || packagingSolution;

  const activePrimaryAlt: PackagingAlternativeItem = activePackagingSolution.alternatives[0] || {
    id: 'alt-default',
    name: 'HDPE / PE Alternative Structure',
    structure: 'HDPE / PE',
    match: 'Medium',
    description: 'Suitable when mechanical durability and simpler material construction are prioritized.',
    pros: ['High mechanical durability', 'Standard polyolefin recycling stream'],
    cons: ['Lower oxygen barrier compared to EVOH'],
    otr: '120 – 250 cc/m²/24h',
    wvtr: '4.5 – 6.0 g/m²/24h',
    thickness: '65 µm',
    recyclability: 'Code 2 (HDPE) / Code 4 (LDPE)',
    estimatedCost: '$0.022 – $0.028 / unit',
  };
  const primaryAlt = activePrimaryAlt;

  if (!isOpen) return null;

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    const derived = deriveFoodProfile(val);
    setIdentifiedFood(derived);
    setEditableCategory(derived.category);
    setEditableFoodGroup(derived.foodGroup);
    setEditableProductState(derived.productState);
    setEditableRespiration(derived.respiration);
    setIsEditing(false);
  };

  const handleSelectCommodity = (name: string) => {
    setSearchTerm(name);
    const derived = deriveFoodProfile(name);
    setIdentifiedFood(derived);
    setEditableCategory(derived.category);
    setEditableFoodGroup(derived.foodGroup);
    setEditableProductState(derived.productState);
    setEditableRespiration(derived.respiration);
    setIsEditing(false);
  };

  const handleToggleEdit = () => {
    if (isEditing) {
      setIdentifiedFood((prev) => ({
        ...prev,
        category: editableCategory,
        foodGroup: editableFoodGroup,
        productState: editableProductState,
        respiration: editableRespiration,
        matchStatus: 'AI Identification: Verified',
      }));
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const handleConfirmProduct = () => {
    const finalName = searchTerm.trim() || identifiedFood.name || 'Commodity';
    setProductName(finalName);
    setCategory(identifiedFood.backendCategory);
    if (identifiedFood.productState === 'Dried') {
      setStorageCondition('ambient');
      setShelfLifeNumber(6);
      setShelfLifeUnit('Months');
    } else if (identifiedFood.productState === 'Frozen') {
      setStorageCondition('frozen');
      setShelfLifeNumber(6);
      setShelfLifeUnit('Months');
    } else if (identifiedFood.productState === 'Fresh') {
      setStorageCondition('chilled');
      setShelfLifeNumber(14);
      setShelfLifeUnit('Days');
    } else if (identifiedFood.productState === 'Liquid') {
      setStorageCondition('chilled');
      setShelfLifeNumber(10);
      setShelfLifeUnit('Days');
    } else {
      setStorageCondition('ambient');
      setShelfLifeNumber(90);
      setShelfLifeUnit('Days');
    }
    setIsEditing(false);
    setStep(2);
  };

  const handleToggleApplication = (appId: ApplicationType) => {
    setSelectedApps((prev) =>
      prev.includes(appId) ? prev.filter((a) => a !== appId) : [...prev, appId]
    );
  };

  const handleContinueToStorageAndTransit = () => {
    if (selectedApps.length === 0) return;
    if (selectedApps.includes('export')) {
      setTransitDistance('long_distance');
    } else if (selectedApps.includes('transportation')) {
      if (transportDistance === 'Local') {
        setTransitDistance('local');
      } else if (transportDistance === 'Long Distance') {
        setTransitDistance('long_distance');
      } else {
        setTransitDistance('regional');
      }
    }
    setStep(3);
  };

  const handleRunAnalysis = async () => {
    setIsSimulating(true);
    setGenerationErrorMessage(null);
    setGenerationState('analyzing');

    try {
      await delay(280);
      setGenerationState('determining');
      await delay(280);
      setGenerationState('matching');
      await delay(280);
      setGenerationState('generating');
      await delay(280);

      const input: RecommendationInput = {
        product: productName || identifiedFood.name || 'Mango',
        application: {
          storage: selectedApps.includes('storage'),
          transportation: selectedApps.includes('transportation'),
          retail: selectedApps.includes('retail'),
          export: selectedApps.includes('export') || transitDistance === 'long_distance',
        },
        storage: {
          type: storageCondition,
          temperature: customTemperature,
          humidity: customHumidity,
        },
        shelfLife: {
          value: shelfLifeNumber,
          unit: (shelfLifeUnit.toLowerCase() as any) || 'days',
        },
        transportation: {
          distance: transitDistance,
        },
      };

      const result = generatePackagingRecommendation(input);
      setRecommendationResult(result);

      setGenerationState('completed');
      await delay(300);

      const activeSol = result.recommendation;
      const formattedStorage = customTemperature && customHumidity
        ? `${customTemperature}, ${customHumidity} RH`
        : customTemperature
        ? `${customTemperature} (${storageCondition === 'ambient' ? 'Ambient' : storageCondition === 'chilled' ? 'Chilled' : 'Frozen'})`
        : storageCondition === 'ambient'
        ? 'Ambient (Room Temperature ~20°C)'
        : storageCondition === 'chilled'
        ? 'Chilled (Cold Chain 2°C – 8°C)'
        : 'Frozen (Deep Freeze -18°C)';

      const formattedTransit = transitDistance === 'local'
        ? 'Local Distribution (Short distance / local delivery)'
        : transitDistance === 'regional'
        ? 'Regional Distribution (Medium distance / cold chain)'
        : 'Long-Distance Logistics (Extended interstate/export)';

      const formattedShelfLife = `${shelfLifeNumber} ${shelfLifeUnit}`;

      const newAnalysis: PackagingAnalysis = {
        id: `AN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        product: productName,
        category: category,
        status: 'Completed',
        date: new Date().toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        recommendedMaterial: activeSol.primaryStructure,
        secondaryMaterial: activeSol.alternatives[0]?.name || 'rPET Clamshell',
        shelfLifeGain: 'Respiration stabilized under target conditions',
        sustainabilityRating: activeSol.sustainableAlternative.match === 'High' ? 92 : 88,
        wvtRate: `${activeSol.specifications.wvtr.value} ${activeSol.specifications.wvtr.unit}`,
        otRate: `${activeSol.specifications.otr.value} ${activeSol.specifications.otr.unit}`,
        storageCondition: formattedStorage,
        transitMethod: formattedTransit,
        targetShelfLife: formattedShelfLife,
        co2Reduction: activeSol.sustainability.calculationBasis,
        mapGasMix: activeSol.specifications.mapSuitability.gasMixRecommendation || 'Controlled modified atmosphere',
        notes: activeSol.statusExplanation,
        thumbnailType: identifiedFood.thumbnailType,
      };

      setGeneratedResult(newAnalysis);
      setGenerationState('idle');
      setStep(6);
    } catch (err) {
      console.error('Error generating recommendation:', err);
      setGenerationState('error');
      setGenerationErrorMessage('Unable to generate recommendation');
    } finally {
      setIsSimulating(false);
    }
  };

  const handleFinishAndSave = () => {
    const sustainable = activePackagingSolution.sustainableAlternative;
    let chosenMaterial = activePackagingSolution.primaryStructure;
    let chosenSecondary = activePrimaryAlt?.name || 'rPET Clamshell';
    let chosenNotes = activePackagingSolution.statusExplanation;
    let chosenOtr = `${activePackagingSolution.specifications.otr.value} ${activePackagingSolution.specifications.otr.unit}`;
    let chosenWvtr = `${activePackagingSolution.specifications.wvtr.value} ${activePackagingSolution.specifications.wvtr.unit}`;

    if (selectedOption === 'alternative' && activePrimaryAlt) {
      chosenMaterial = activePrimaryAlt.structure || activePrimaryAlt.name;
      chosenSecondary = activePackagingSolution.primaryStructure;
      chosenNotes = `Selected Alternative: ${activePrimaryAlt.name}. ${activePrimaryAlt.description}`;
      chosenOtr = activePrimaryAlt.otr;
      chosenWvtr = activePrimaryAlt.wvtr;
    } else if (selectedOption === 'sustainable') {
      chosenMaterial = sustainable.structure || sustainable.name;
      chosenSecondary = activePackagingSolution.primaryStructure;
      chosenNotes = `Selected Sustainable Option: ${sustainable.name}. ${sustainable.whyConsider}`;
      chosenOtr = 'Controlled Breathability';
      chosenWvtr = 'Controlled Anti-Fog Permeation';
    }

    if (generatedResult) {
      onSaveAnalysis({
        ...generatedResult,
        recommendedMaterial: chosenMaterial,
        secondaryMaterial: chosenSecondary,
        notes: chosenNotes,
        otRate: chosenOtr,
        wvtRate: chosenWvtr,
        sustainabilityRating: selectedOption === 'sustainable' ? 98 : selectedOption === 'alternative' ? 88 : 92,
      });
    } else {
      const fallbackAnalysis: PackagingAnalysis = {
        id: `AN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        product: identifiedFood.name || productName,
        category: category,
        status: 'Completed',
        date: new Date().toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        recommendedMaterial: chosenMaterial,
        secondaryMaterial: chosenSecondary,
        shelfLifeGain: '+10 days respiration stabilization',
        sustainabilityRating: selectedOption === 'sustainable' ? 98 : selectedOption === 'alternative' ? 88 : 92,
        wvtRate: chosenWvtr,
        otRate: chosenOtr,
        storageCondition: storageCondition === 'ambient' ? 'Ambient (~20°C)' : storageCondition === 'chilled' ? 'Chilled (2–8°C)' : 'Frozen (-18°C)',
        transitMethod: transitDistance === 'local' ? 'Local' : transitDistance === 'regional' ? 'Regional' : 'Long Distance',
        targetShelfLife: `${shelfLifeNumber} ${shelfLifeUnit}`,
        co2Reduction: selectedOption === 'sustainable' ? '-68% lifecycle carbon' : '-44% lifecycle carbon',
        mapGasMix: activePackagingSolution.specifications.mapSuitability.gasMixRecommendation || '3% O₂, 5% CO₂, 92% N₂',
        notes: chosenNotes,
        thumbnailType: identifiedFood.thumbnailType,
      };
      onSaveAnalysis(fallbackAnalysis);
    }
    onClose();
  };

  const handleExportComparisonCSV = () => {
    const sustainable = activePackagingSolution.sustainableAlternative;
    const rows = [
      ['Evaluation Parameter', 'Recommended Solution (Primary)', 'Alternative Option', 'Sustainable Option'],
      ['Material Structure', activePackagingSolution.primaryStructure, activePrimaryAlt.structure, sustainable.structure],
      ['Requirement Match', activePackagingSolution.compatibilityLevel, activePrimaryAlt.match, sustainable.match],
      ['Oxygen Barrier (OTR)', `${activePackagingSolution.specifications.otr.value} ${activePackagingSolution.specifications.otr.unit}`, activePrimaryAlt.otr, 'Controlled (< 25 cc/m²/24h)'],
      ['Moisture Barrier (WVTR)', `${activePackagingSolution.specifications.wvtr.value} ${activePackagingSolution.specifications.wvtr.unit}`, activePrimaryAlt.wvtr, 'Controlled (< 15 g/m²/24h)'],
      ['Mechanical Strength', activePackagingSolution.specifications.mechanicalStrength.value, 'Very High', 'Medium-High'],
      ['Sealability', activePackagingSolution.specifications.sealability.value, 'High', 'High / Reliable'],
      ['Recyclability', activePackagingSolution.sustainability.recyclability, activePrimaryAlt.recyclability, sustainable.recyclability],
      ['Estimated Cost per Unit', activePackagingSolution.estimatedCost.costPerPackage, activePrimaryAlt.estimatedCost, '$0.040 – $0.050 / package'],
    ];
    const csvContent = rows
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `packaging-comparison-${(identifiedFood.name || productName).toLowerCase().replace(/\s+/g, '-')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportSpecification = () => {
    const specData = {
      product: identifiedFood.name || productName,
      category: identifiedFood.category,
      storageCondition,
      targetShelfLife: `${shelfLifeNumber} ${shelfLifeUnit}`,
      transitDistance,
      foodRiskProfile: {
        moistureSensitivity: activeRiskProfile.moistureSensitivity.level,
        oxygenSensitivity: activeRiskProfile.oxygenSensitivity.level,
        respiration: activeRiskProfile.respiration.level,
        microbialRisk: activeRiskProfile.microbialRisk.level,
      },
      packagingRequirements: {
        oxygenBarrier: activePackagingRequirements.oxygenBarrier.level,
        moistureBarrier: activePackagingRequirements.moistureBarrier.level,
        gasPermeability: activePackagingRequirements.gasPermeability.level,
        mechanicalStrength: activePackagingRequirements.mechanicalStrength.level,
        sealability: activePackagingRequirements.sealability.level,
        mapSuitability: activePackagingRequirements.mapSuitability.level,
      },
      recommendation: {
        primaryStructure: activePackagingSolution.primaryStructure,
        primaryStructureShort: activePackagingSolution.primaryStructureShort,
        compatibilityLevel: activePackagingSolution.compatibilityLevel,
        statusExplanation: activePackagingSolution.statusExplanation,
        layers: activePackagingSolution.layers,
        specifications: activePackagingSolution.specifications,
        shelfLifeImpact: activePackagingSolution.shelfLifeImpact,
        sustainability: activePackagingSolution.sustainability,
        estimatedCost: activePackagingSolution.estimatedCost,
      },
      exportedAt: new Date().toISOString(),
      engine: 'PackWise AI Food Packaging Recommendation Engine',
    };
    const blob = new Blob([JSON.stringify(specData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `packaging-spec-${(identifiedFood.name || productName).toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleOpenCompare = (alt?: PackagingAlternativeItem) => {
    setComparingAlternative(alt || activePrimaryAlt);
    setShowCompareModal(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--modal-overlay)] backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col transition-colors duration-200">
        {/* Header and Stepper Navigation */}
        <div className="new-analysis-modal-header w-full">
          <div className="p-5 sm:p-6 border-b border-[var(--border-secondary)] flex items-center justify-between bg-[var(--bg-card-elevated)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--badge-completed-bg)] border border-[var(--brand-primary)]/20 flex items-center justify-center text-[var(--brand-primary)]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[var(--text-primary)]">
                  New Packaging Recommendation Analysis
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  AI-assisted barrier matching, shelf-life modeling, and sustainability grading
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Header */}
          <div
            className="stepper w-full max-w-full overflow-hidden box-border px-3 sm:px-4 md:px-5 py-3 bg-[var(--bg-card)] border-b border-[var(--border-secondary)] flex items-center justify-between"
            style={{ display: 'flex', width: '100%', overflow: 'hidden' }}
          >
            {ANALYSIS_STEPS.map((s, idx) => {
              const isCurrent = step === s.num;
              const isCompleted = step > s.num;

              return (
                <div
                  key={s.num}
                  onClick={() => {
                    if (s.num < step) setStep(s.num as any);
                  }}
                  className={`step-item flex flex-1 min-w-0 items-center ${
                    s.num < step ? 'cursor-pointer hover:opacity-85' : 'cursor-default'
                  }`}
                  style={{ display: 'flex', flex: 1, minWidth: 0 }}
                  title={`Step ${s.num}: ${s.label}`}
                >
                  <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                    <span
                      className={`w-4.5 h-4.5 md:w-5 md:h-5 rounded-full flex items-center justify-center text-[10px] md:text-[11px] font-bold shrink-0 transition-colors ${
                        isCurrent
                          ? 'bg-[var(--brand-primary)] text-[var(--brand-text)] ring-2 ring-[var(--brand-primary)]/20 shadow-xs'
                          : isCompleted
                          ? 'bg-[var(--badge-completed-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/40'
                          : 'bg-[var(--bg-card-elevated)] text-[var(--text-muted)] border border-[var(--border-primary)]'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-2.5 h-2.5 md:w-3 md:h-3 stroke-[2.5]" />
                      ) : (
                        s.num
                      )}
                    </span>
                    <span
                      className={`step-label text-[9.5px] sm:text-[10px] md:text-[11px] lg:text-xs whitespace-nowrap tracking-tight select-none ${
                        isCurrent
                          ? 'font-bold text-[var(--text-primary)]'
                          : isCompleted
                          ? 'font-medium text-[var(--text-secondary)]'
                          : 'font-normal text-[var(--text-muted)]'
                      }`}
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      {s.label}
                    </span>
                  </div>

                  {idx < ANALYSIS_STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-[2px] mx-1 md:mx-1.5 lg:mx-2 min-w-[4px] rounded-full transition-colors ${
                        step > s.num
                          ? 'bg-[var(--brand-primary)]'
                          : 'bg-[var(--border-secondary)]'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Body */}
        <div className="p-6">
          {step === 1 && (
            <Step1ProductIdentification
              searchTerm={searchTerm}
              identifiedFood={identifiedFood}
              isEditing={isEditing}
              editableCategory={editableCategory}
              editableFoodGroup={editableFoodGroup}
              editableProductState={editableProductState}
              editableRespiration={editableRespiration}
              onSearchChange={handleSearchChange}
              onSelectCommodity={handleSelectCommodity}
              onToggleEdit={handleToggleEdit}
              onCategoryChange={setEditableCategory}
              onFoodGroupChange={setEditableFoodGroup}
              onProductStateChange={setEditableProductState}
              onRespirationChange={setEditableRespiration}
              onConfirmProduct={handleConfirmProduct}
            />
          )}

          {step === 2 && (
            <Step2Application
              selectedApps={selectedApps}
              transportDistance={transportDistance}
              exportDistance={exportDistance}
              onToggleApplication={handleToggleApplication}
              onTransportDistanceChange={setTransportDistance}
              onExportDistanceChange={setExportDistance}
            />
          )}

          {step === 3 && (
            <Step3StorageTransit
              storageCondition={storageCondition}
              shelfLifeNumber={shelfLifeNumber}
              shelfLifeUnit={shelfLifeUnit}
              transitDistance={transitDistance}
              showAdvancedConditions={showAdvancedConditions}
              customTemperature={customTemperature}
              customHumidity={customHumidity}
              onStorageConditionChange={setStorageCondition}
              onShelfLifeNumberChange={setShelfLifeNumber}
              onShelfLifeUnitChange={setShelfLifeUnit}
              onTransitDistanceChange={setTransitDistance}
              onToggleAdvancedConditions={() => setShowAdvancedConditions(!showAdvancedConditions)}
              onCustomTemperatureChange={setCustomTemperature}
              onCustomHumidityChange={setCustomHumidity}
            />
          )}

          {step === 4 && (
            <Step4FoodAnalysis
              identifiedFood={identifiedFood}
              productName={productName}
              storageCondition={storageCondition}
              shelfLifeNumber={shelfLifeNumber}
              shelfLifeUnit={shelfLifeUnit}
              transitDistance={transitDistance}
              analysisStage={analysisStage}
              foodRiskProfile={activeRiskProfile}
              showAnalysisBasis={showAnalysisBasis}
              onToggleAnalysisBasis={() => setShowAnalysisBasis(!showAnalysisBasis)}
              onRetry={runStep4FoodAnalysis}
            />
          )}

          {step === 5 && (
            <Step5Requirements
              identifiedFood={identifiedFood}
              productName={productName}
              storageCondition={storageCondition}
              shelfLifeNumber={shelfLifeNumber}
              shelfLifeUnit={shelfLifeUnit}
              transitDistance={transitDistance}
              foodRiskProfile={activeRiskProfile}
              packagingRequirements={activePackagingRequirements}
            />
          )}

          {step === 6 && (
            <Step6Recommendation
              identifiedFood={identifiedFood}
              productName={productName}
              storageCondition={storageCondition}
              shelfLifeNumber={shelfLifeNumber}
              shelfLifeUnit={shelfLifeUnit}
              transitDistance={transitDistance}
              showAnalysisDetails={showAnalysisDetails}
              onToggleAnalysisDetails={() => setShowAnalysisDetails(!showAnalysisDetails)}
              foodRiskProfile={activeRiskProfile}
              packagingRequirements={activePackagingRequirements}
              packagingSolution={activePackagingSolution}
              showDecisionChain={showDecisionChain}
              onToggleDecisionChain={() => setShowDecisionChain(!showDecisionChain)}
              onOpenCompare={handleOpenCompare}
              onSelectOptionAndStep7={(opt) => {
                setSelectedOption(opt);
                setStep(7);
              }}
            />
          )}

          {step === 7 && (
            <Step7Options
              identifiedFood={identifiedFood}
              productName={productName}
              storageCondition={storageCondition}
              shelfLifeNumber={shelfLifeNumber}
              shelfLifeUnit={shelfLifeUnit}
              transitDistance={transitDistance}
              selectedOption={selectedOption}
              onSelectOption={setSelectedOption}
              packagingSolution={activePackagingSolution}
              primaryAlt={activePrimaryAlt}
              showCostEstimationDetails={showCostEstimationDetails}
              onToggleCostDetails={() => setShowCostEstimationDetails(!showCostEstimationDetails)}
            />
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-5 border-t border-[var(--border-secondary)] bg-[var(--bg-card-elevated)] flex items-center justify-between">
          {step > 1 && step < 5 && (
            <button
              type="button"
              onClick={() => setStep((step - 1) as any)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[var(--border-cta)] bg-[var(--bg-card)] text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          )}

          {step === 1 && (
            <div className="text-xs text-[var(--text-muted)]">
              Step 1 of 7: Product Identification
            </div>
          )}

          {step === 1 && (
            <button
              type="button"
              onClick={handleConfirmProduct}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[var(--brand-primary)] text-[var(--brand-text)] hover:bg-[var(--brand-secondary)] text-xs font-semibold shadow-xs cursor-pointer transition-colors"
            >
              <span>Confirm Product</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {step === 2 && (
            <button
              type="button"
              disabled={selectedApps.length === 0}
              onClick={handleContinueToStorageAndTransit}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[var(--brand-primary)] text-[var(--brand-text)] hover:bg-[var(--brand-secondary)] text-xs font-semibold shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors ml-auto"
            >
              <span>Continue to Storage & Transportation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {step === 3 && (
            <button
              type="button"
              onClick={() => {
                setStep(4);
                runStep4FoodAnalysis();
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--brand-primary)] text-[var(--brand-text)] hover:bg-[var(--brand-secondary)] text-xs font-semibold shadow-xs cursor-pointer transition-colors ml-auto"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Analyze Packaging Requirements</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {step === 4 && (
            <div className="flex items-center gap-3 ml-auto">
              <button
                type="button"
                disabled={analysisStage !== 'completed'}
                onClick={() => setStep(5)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--brand-primary)] text-[var(--brand-text)] hover:bg-[var(--brand-secondary)] text-xs font-semibold shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                <span>Determine Packaging Requirements</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {step === 5 && (
            <div className="flex items-center justify-between w-full">
              <button
                type="button"
                onClick={() => setStep(4)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[var(--border-cta)] bg-[var(--bg-card)] text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Food Analysis</span>
              </button>
              <button
                type="button"
                disabled={isSimulating}
                onClick={handleRunAnalysis}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--brand-primary)] text-[var(--brand-text)] hover:bg-[var(--brand-secondary)] text-xs font-semibold shadow-xs disabled:opacity-60 cursor-pointer transition-colors"
              >
                {isSimulating ? (
                  <>
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing & Matching Materials...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate AI Recommendation</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          )}

          {step === 6 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
              <button
                type="button"
                onClick={() => setStep(5)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[var(--border-cta)] bg-[var(--bg-card)] text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] cursor-pointer self-start sm:self-auto"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Packaging Requirements</span>
              </button>
              <div className="flex items-center gap-2 flex-wrap justify-end w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleExportSpecification}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[var(--border-cta)] bg-[var(--bg-card)] text-xs font-semibold text-[var(--text-primary)] cursor-pointer hover:bg-[var(--bg-card-hover)] transition-colors shadow-2xs"
                  title="Download technical specification JSON"
                >
                  <Download className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
                  <span>Export Spec</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(7)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--brand-primary)] text-[var(--brand-text)] hover:bg-[var(--brand-secondary)] text-xs font-semibold shadow-xs cursor-pointer transition-colors"
                >
                  <span>Compare Options & Sustainability</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleFinishAndSave}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[var(--border-cta)] bg-[var(--bg-card)] text-xs font-semibold text-[var(--text-primary)] cursor-pointer hover:bg-[var(--bg-card-hover)] transition-colors shadow-2xs"
                >
                  <Check className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
                  <span>Save Result</span>
                </button>
              </div>
            </div>
          )}

          {step === 7 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
              <button
                type="button"
                onClick={() => setStep(6)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[var(--border-cta)] bg-[var(--bg-card)] text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] cursor-pointer self-start sm:self-auto"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Recommendation</span>
              </button>
              <div className="flex items-center gap-2 flex-wrap justify-end w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setShowTechSpecModal(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[var(--border-cta)] bg-[var(--bg-card)] text-xs font-semibold text-[var(--text-primary)] cursor-pointer hover:bg-[var(--bg-card-hover)] transition-colors shadow-2xs"
                >
                  <FileText className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
                  <span>Full Tech Spec</span>
                </button>
                <button
                  type="button"
                  onClick={handleExportComparisonCSV}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[var(--border-cta)] bg-[var(--bg-card)] text-xs font-semibold text-[var(--text-primary)] cursor-pointer hover:bg-[var(--bg-card-hover)] transition-colors shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
                  <span>Export CSV</span>
                </button>
                <button
                  type="button"
                  onClick={handleFinishAndSave}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--brand-primary)] text-[var(--brand-text)] hover:bg-[var(--brand-secondary)] text-xs font-semibold shadow-xs cursor-pointer transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Confirm & Save Analysis</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tech Spec Modal */}
      {showTechSpecModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl w-full max-w-2xl max-h-[88vh] overflow-y-auto shadow-2xl flex flex-col p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-secondary)] pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[var(--brand-primary)]" />
                <div>
                  <h4 className="text-base font-bold text-[var(--text-primary)]">
                    Full Technical Packaging Specification
                  </h4>
                  <p className="text-xs text-[var(--text-muted)]">
                    Engineering and compliance data sheet for {identifiedFood.name || productName}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowTechSpecModal(false)}
                className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-secondary)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[var(--text-primary)] uppercase text-[11px] tracking-wider">
                    Structure Configuration
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[var(--badge-completed-bg)] text-[var(--badge-completed-text)] border border-[var(--brand-primary)]/20">
                    Active: {selectedOption.toUpperCase()}
                  </span>
                </div>
                <div className="text-sm font-bold text-[var(--brand-primary)]">
                  {selectedOption === 'recommended'
                    ? activePackagingSolution.primaryStructure
                    : selectedOption === 'alternative'
                    ? activePrimaryAlt.structure
                    : activePackagingSolution.sustainableAlternative.structure}
                </div>
              </div>

              <div className="overflow-x-auto border border-[var(--border-secondary)] rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <tbody className="divide-y divide-[var(--border-secondary)]">
                    <tr>
                      <td className="p-2.5 font-medium text-[var(--text-secondary)] w-1/3">Target OTR (Oxygen Transmission)</td>
                      <td className="p-2.5 font-mono text-[var(--text-primary)]">
                        {selectedOption === 'recommended'
                          ? `${activePackagingSolution.specifications.otr.value} ${activePackagingSolution.specifications.otr.unit}`
                          : selectedOption === 'alternative'
                          ? activePrimaryAlt.otr
                          : '750 – 1,100 cc/m²/24h (Anti-fog)'}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium text-[var(--text-secondary)]">Target WVTR (Water Vapor)</td>
                      <td className="p-2.5 font-mono text-[var(--text-primary)]">
                        {selectedOption === 'recommended'
                          ? `${activePackagingSolution.specifications.wvtr.value} ${activePackagingSolution.specifications.wvtr.unit}`
                          : selectedOption === 'alternative'
                          ? activePrimaryAlt.wvtr
                          : '24.0 g/m²/24h'}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium text-[var(--text-secondary)]">Nominal Caliper</td>
                      <td className="p-2.5 text-[var(--text-primary)] font-mono">
                        {selectedOption === 'recommended'
                          ? activePackagingSolution.specifications.thickness.value
                          : selectedOption === 'alternative'
                          ? activePrimaryAlt.thickness
                          : '60 µm'}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium text-[var(--text-secondary)]">Food Contact Compliance</td>
                      <td className="p-2.5 text-[var(--text-primary)]">
                        US FDA 21 CFR § 177.1520 / EU Regulation No. 10/2011 / ISO 22000
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium text-[var(--text-secondary)]">Circularity / SPI Resin Code</td>
                      <td className="p-2.5 text-[var(--text-primary)]">
                        {selectedOption === 'recommended'
                          ? activePackagingSolution.sustainability.recyclability
                          : selectedOption === 'alternative'
                          ? activePrimaryAlt.recyclability
                          : activePackagingSolution.sustainableAlternative.recyclability}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-[var(--border-secondary)]">
              <button
                type="button"
                onClick={handleExportSpecification}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[var(--border-cta)] bg-[var(--bg-card)] text-xs font-semibold text-[var(--text-primary)] cursor-pointer hover:bg-[var(--bg-card-hover)] transition-colors shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
                <span>Export JSON Spec</span>
              </button>
              <button
                type="button"
                onClick={() => setShowTechSpecModal(false)}
                className="px-4 py-2 rounded-xl bg-[var(--brand-primary)] text-[var(--brand-text)] font-semibold text-xs cursor-pointer hover:bg-[var(--brand-secondary)] transition-colors"
              >
                Close Specification
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Comparison Modal */}
      {showCompareModal && comparingAlternative && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl w-full max-w-2xl max-h-[88vh] overflow-y-auto shadow-2xl flex flex-col p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-secondary)] pb-3">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-[var(--brand-primary)]" />
                <h4 className="text-base font-bold text-[var(--text-primary)]">
                  Side-by-Side Packaging Comparison
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowCompareModal(false)}
                className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs text-[var(--text-secondary)]">
              Comparing recommended primary solution against {comparingAlternative.name}.
            </div>
            <div className="overflow-x-auto border border-[var(--border-secondary)] rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[var(--bg-card-elevated)] border-b border-[var(--border-secondary)]">
                    <th className="p-3 font-semibold text-[var(--text-muted)] w-1/3">Metric</th>
                    <th className="p-3 font-bold text-[var(--brand-primary)] w-1/3 border-l border-[var(--border-secondary)]">
                      Primary
                    </th>
                    <th className="p-3 font-bold text-[var(--text-primary)] w-1/3 border-l border-[var(--border-secondary)]">
                      {comparingAlternative.name}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-secondary)]">
                  <tr>
                    <td className="p-3 font-medium text-[var(--text-secondary)]">Structure</td>
                    <td className="p-3 font-bold text-[var(--text-primary)] border-l border-[var(--border-secondary)]">
                      {activePackagingSolution.primaryStructureShort}
                    </td>
                    <td className="p-3 font-medium text-[var(--text-primary)] border-l border-[var(--border-secondary)]">
                      {comparingAlternative.structure}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-[var(--text-secondary)]">OTR Barrier</td>
                    <td className="p-3 border-l border-[var(--border-secondary)] font-mono text-[var(--text-primary)]">
                      {activePackagingSolution.specifications.otr.value} {activePackagingSolution.specifications.otr.unit}
                    </td>
                    <td className="p-3 border-l border-[var(--border-secondary)] font-mono text-[var(--text-primary)]">
                      {comparingAlternative.otr}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-[var(--text-secondary)]">WVTR Barrier</td>
                    <td className="p-3 border-l border-[var(--border-secondary)] font-mono text-[var(--text-primary)]">
                      {activePackagingSolution.specifications.wvtr.value} {activePackagingSolution.specifications.wvtr.unit}
                    </td>
                    <td className="p-3 border-l border-[var(--border-secondary)] font-mono text-[var(--text-primary)]">
                      {comparingAlternative.wvtr}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-[var(--text-secondary)]">Total Gauge</td>
                    <td className="p-3 border-l border-[var(--border-secondary)] text-[var(--text-primary)]">
                      {activePackagingSolution.specifications.thickness.value}
                    </td>
                    <td className="p-3 border-l border-[var(--border-secondary)] text-[var(--text-primary)]">
                      {comparingAlternative.thickness}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-[var(--text-secondary)]">Estimated Cost</td>
                    <td className="p-3 border-l border-[var(--border-secondary)] font-semibold text-[var(--text-primary)]">
                      {activePackagingSolution.estimatedCost.costPerPackage}
                    </td>
                    <td className="p-3 border-l border-[var(--border-secondary)] font-semibold text-[var(--text-primary)]">
                      {comparingAlternative.estimatedCost}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowCompareModal(false)}
                className="px-4 py-2 rounded-xl bg-[var(--brand-primary)] text-[var(--brand-text)] font-semibold text-xs cursor-pointer hover:bg-[var(--brand-secondary)] transition-colors"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generation Status UI (Finite State Overlay) */}
      {(isSimulating || generationState === 'error') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-primary)] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-secondary)]">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--badge-completed-bg)] text-[var(--badge-completed-text)] border border-[var(--brand-primary)]/20">
                <Sparkles className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
                <span>AI Packaging Analysis</span>
              </div>
              <span className="text-[11px] font-mono text-[var(--text-muted)]">Rule-Based Engine</span>
            </div>

            {generationState === 'error' ? (
              <div className="space-y-4 py-1">
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
                    <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span>Unable to generate recommendation</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                    {generationErrorMessage || 'The system could not resolve matching packaging materials for the specified parameters.'}
                  </p>
                </div>
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setGenerationState('idle');
                      setStep(1);
                      setIsEditing(true);
                    }}
                    className="px-3.5 py-2 rounded-xl border border-[var(--border-cta)] bg-[var(--bg-card-elevated)] text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] cursor-pointer"
                  >
                    Modify Product Input
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setGenerationState('idle');
                      const generic = deriveFoodProfile('Generic Commodity');
                      setIdentifiedFood(generic);
                      setProductName('Generic Commodity');
                      setCategory('Others');
                      setTimeout(handleRunAnalysis, 50);
                    }}
                    className="px-4 py-2 rounded-xl bg-[var(--brand-primary)] text-[var(--brand-text)] text-xs font-semibold hover:bg-[var(--brand-secondary)] cursor-pointer transition-colors shadow-2xs"
                  >
                    Use Generic Food Profile
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-[var(--text-primary)]">
                    {generationState === 'completed'
                      ? 'Recommendation Generated'
                      : 'Analyzing & Matching Materials...'}
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Cross-referencing {productName || 'product'} with food characteristics and packaging material databases.
                  </p>
                </div>

                <div className="space-y-2 py-1">
                  <div className="flex items-center gap-3 text-xs p-2.5 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-secondary)]">
                    {generationState === 'analyzing' ? (
                      <RotateCw className="w-4 h-4 text-[var(--brand-primary)] animate-spin shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    )}
                    <span className={generationState === 'analyzing' ? 'font-bold text-[var(--brand-primary)]' : 'font-medium text-[var(--text-primary)]'}>
                      Analyzing food characteristics...
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs p-2.5 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-secondary)]">
                    {generationState === 'analyzing' ? (
                      <div className="w-4 h-4 rounded-full border border-[var(--border-cta)] bg-[var(--bg-card)] shrink-0" />
                    ) : generationState === 'determining' ? (
                      <RotateCw className="w-4 h-4 text-[var(--brand-primary)] animate-spin shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    )}
                    <span className={
                      generationState === 'analyzing'
                        ? 'text-[var(--text-muted)]'
                        : generationState === 'determining'
                        ? 'font-bold text-[var(--brand-primary)]'
                        : 'font-medium text-[var(--text-primary)]'
                    }>
                      Determining packaging requirements...
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs p-2.5 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-secondary)]">
                    {generationState === 'analyzing' || generationState === 'determining' ? (
                      <div className="w-4 h-4 rounded-full border border-[var(--border-cta)] bg-[var(--bg-card)] shrink-0" />
                    ) : generationState === 'matching' ? (
                      <RotateCw className="w-4 h-4 text-[var(--brand-primary)] animate-spin shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    )}
                    <span className={
                      generationState === 'analyzing' || generationState === 'determining'
                        ? 'text-[var(--text-muted)]'
                        : generationState === 'matching'
                        ? 'font-bold text-[var(--brand-primary)]'
                        : 'font-medium text-[var(--text-primary)]'
                    }>
                      Matching packaging materials...
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs p-2.5 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-secondary)]">
                    {generationState === 'completed' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    ) : generationState === 'generating' ? (
                      <RotateCw className="w-4 h-4 text-[var(--brand-primary)] animate-spin shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-[var(--border-cta)] bg-[var(--bg-card)] shrink-0" />
                    )}
                    <span className={
                      generationState === 'completed'
                        ? 'font-medium text-[var(--text-primary)]'
                        : generationState === 'generating'
                        ? 'font-bold text-[var(--brand-primary)]'
                        : 'text-[var(--text-muted)]'
                    }>
                      Generating recommendation...
                    </span>
                  </div>

                  <div className={`flex items-center gap-3 text-xs p-2.5 rounded-xl border transition-all ${
                    generationState === 'completed'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-bold'
                      : 'bg-[var(--bg-card-elevated)] border-[var(--border-secondary)] text-[var(--text-muted)]'
                  }`}>
                    {generationState === 'completed' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-[var(--border-cta)] bg-[var(--bg-card)] shrink-0" />
                    )}
                    <span>Recommendation Generated</span>
                  </div>
                </div>

                <div className="w-full bg-[var(--bg-card-elevated)] h-1.5 rounded-full overflow-hidden border border-[var(--border-secondary)]">
                  <div
                    className="bg-[var(--brand-primary)] h-full transition-all duration-300 ease-out"
                    style={{
                      width:
                        generationState === 'analyzing'
                          ? '25%'
                          : generationState === 'determining'
                          ? '50%'
                          : generationState === 'matching'
                          ? '75%'
                          : generationState === 'generating'
                          ? '90%'
                          : '100%',
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
