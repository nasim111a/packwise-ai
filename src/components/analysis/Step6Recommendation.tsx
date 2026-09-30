import React from 'react';
import {
  Sparkles,
  Layers,
  CheckCircle2,
  Check,
  ShieldCheck,
  Eye,
  ChevronUp,
  ChevronDown,
  Activity,
  SlidersHorizontal,
  Wind,
  Droplets,
  Box,
  Lock,
  Scale,
  Leaf,
  Info,
  Database,
  ArrowRight,
} from 'lucide-react';
import {
  IdentifiedFoodProfile,
  FoodRiskProfileData,
  PackagingRequirementsData,
  PackagingSolutionData,
  StorageConditionType,
  TransitDistanceType,
  ShelfLifeUnitType,
  PackagingAlternativeItem,
} from './types';

interface Step6Props {
  identifiedFood: IdentifiedFoodProfile;
  productName: string;
  storageCondition: StorageConditionType;
  shelfLifeNumber: number;
  shelfLifeUnit: ShelfLifeUnitType;
  transitDistance: TransitDistanceType;
  showAnalysisDetails: boolean;
  onToggleAnalysisDetails: () => void;
  foodRiskProfile: FoodRiskProfileData;
  packagingRequirements: PackagingRequirementsData;
  packagingSolution: PackagingSolutionData;
  showDecisionChain: boolean;
  onToggleDecisionChain: () => void;
  onOpenCompare: (alt?: PackagingAlternativeItem) => void;
  onSelectOptionAndStep7: (option: 'recommended' | 'alternative' | 'sustainable') => void;
}

export const Step6Recommendation: React.FC<Step6Props> = ({
  identifiedFood,
  productName,
  storageCondition,
  shelfLifeNumber,
  shelfLifeUnit,
  transitDistance,
  showAnalysisDetails,
  onToggleAnalysisDetails,
  foodRiskProfile,
  packagingRequirements,
  packagingSolution,
  showDecisionChain,
  onToggleDecisionChain,
  onOpenCompare,
  onSelectOptionAndStep7,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="text-center space-y-1.5 pb-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--badge-completed-bg)] text-[var(--badge-completed-text)] border border-[var(--brand-primary)]/20 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
          <span>Prototype Recommendation Engine · Knowledge Base + Rule Engine</span>
        </div>
        <h4 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)] pt-1">
          Recommended Packaging Solution
        </h4>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-xl mx-auto leading-relaxed">
          Based on your product characteristics, storage conditions, transportation requirements, and packaging performance requirements, the system has identified the following packaging solution.
        </p>
      </div>

      <div className="p-3.5 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] shadow-xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-lg font-bold text-[var(--text-primary)] tracking-tight flex items-center gap-2">
              <span>{identifiedFood.name || productName || 'Mango'}</span>
              <span className="text-xs px-2 py-0.5 rounded font-medium bg-[var(--bg-card)] border border-[var(--border-secondary)] text-[var(--text-secondary)]">
                {identifiedFood.foodGroup || identifiedFood.category || 'Fresh Produce'}
              </span>
            </div>
            <div className="text-xs text-[var(--text-muted)] mt-1 flex flex-wrap items-center gap-2 font-medium">
              <span>
                {storageCondition === 'ambient'
                  ? 'Ambient Storage'
                  : storageCondition === 'chilled'
                  ? 'Chilled Storage'
                  : 'Frozen Storage'}
              </span>
              <span>·</span>
              <span>{shelfLifeNumber} {shelfLifeUnit} Target Shelf Life</span>
              <span>·</span>
              <span>
                {transitDistance === 'local'
                  ? 'Local Distribution'
                  : transitDistance === 'regional'
                  ? 'Regional Distribution'
                  : 'Long-Distance Transportation'}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onToggleAnalysisDetails}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-cta)] bg-[var(--bg-card)] text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition-colors cursor-pointer self-start sm:self-auto shrink-0 shadow-2xs"
          >
            <Eye className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
            <span>{showAnalysisDetails ? 'Hide Analysis' : 'View Analysis'}</span>
            {showAnalysisDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {showAnalysisDetails && (
          <div className="mt-3.5 pt-3.5 border-t border-[var(--border-secondary)] space-y-3 animate-in fade-in duration-150">
            <div className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
                <span>Food Risk Profile Used for Recommendation</span>
              </span>
              <span className="text-[11px] font-normal text-[var(--text-muted)]">Non-editable Basis</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-secondary)]">
                <div className="text-[11px] text-[var(--text-muted)]">Moisture Sensitivity</div>
                <div className="font-bold text-[var(--text-primary)] mt-0.5">{foodRiskProfile.moistureSensitivity.level}</div>
                <div className="text-[10px] text-[var(--text-secondary)] mt-0.5 line-clamp-1">{foodRiskProfile.moistureSensitivity.explanation}</div>
              </div>
              <div className="p-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-secondary)]">
                <div className="text-[11px] text-[var(--text-muted)]">Oxygen Sensitivity</div>
                <div className="font-bold text-[var(--text-primary)] mt-0.5">{foodRiskProfile.oxygenSensitivity.level}</div>
                <div className="text-[10px] text-[var(--text-secondary)] mt-0.5 line-clamp-1">{foodRiskProfile.oxygenSensitivity.explanation}</div>
              </div>
              <div className="p-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-secondary)]">
                <div className="text-[11px] text-[var(--text-muted)]">Respiration</div>
                <div className="font-bold text-[var(--text-primary)] mt-0.5">{foodRiskProfile.respiration.level}</div>
                <div className="text-[10px] text-[var(--text-secondary)] mt-0.5 line-clamp-1">{foodRiskProfile.respiration.explanation}</div>
              </div>
              <div className="p-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-secondary)]">
                <div className="text-[11px] text-[var(--text-muted)]">Microbial Risk</div>
                <div className="font-bold text-[var(--text-primary)] mt-0.5">{foodRiskProfile.microbialRisk.level}</div>
                <div className="text-[10px] text-[var(--text-secondary)] mt-0.5 line-clamp-1">{foodRiskProfile.microbialRisk.explanation}</div>
              </div>
            </div>

            <div className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center justify-between pt-1">
              <span className="flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
                <span>Derived Technical Requirements</span>
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-secondary)]">
                <span className="text-[var(--text-secondary)] font-medium">Oxygen Barrier:</span>
                <span className="font-bold text-[var(--text-primary)]">{packagingRequirements.oxygenBarrier.level}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-secondary)]">
                <span className="text-[var(--text-secondary)] font-medium">Moisture Barrier:</span>
                <span className="font-bold text-[var(--text-primary)]">{packagingRequirements.moistureBarrier.level}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-secondary)]">
                <span className="text-[var(--text-secondary)] font-medium">Gas Permeability:</span>
                <span className="font-bold text-[var(--text-primary)]">{packagingRequirements.gasPermeability.level}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-secondary)]">
                <span className="text-[var(--text-secondary)] font-medium">Mechanical Strength:</span>
                <span className="font-bold text-[var(--text-primary)]">{packagingRequirements.mechanicalStrength.level}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-secondary)]">
                <span className="text-[var(--text-secondary)] font-medium">Sealability:</span>
                <span className="font-bold text-[var(--text-primary)]">{packagingRequirements.sealability.level}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-secondary)]">
                <span className="text-[var(--text-secondary)] font-medium">MAP Suitability:</span>
                <span className="font-bold text-[var(--text-primary)]">{packagingRequirements.mapSuitability.level}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Primary Recommendation Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-card-elevated)] border-2 border-[var(--brand-primary)]/40 shadow-sm space-y-5 transition-all">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-[var(--brand-primary)] flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              <span>Recommended Packaging</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
              {packagingSolution.primaryStructureShort || 'PET / PE'}
            </div>
            <div className="text-xs font-semibold text-[var(--text-secondary)]">
              {packagingSolution.primaryStructure}
            </div>
          </div>

          <div className="text-left sm:text-right shrink-0">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[var(--badge-completed-bg)] text-[var(--badge-completed-text)] border border-[var(--brand-primary)]/30 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
              <span>Requirement Match: {packagingSolution.compatibilityLevel}</span>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)] mt-1.5 max-w-xs sm:text-right leading-relaxed">
              {packagingSolution.statusExplanation}
            </p>
          </div>
        </div>

        {/* Packaging Structure Visual Diagram */}
        <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-secondary)] space-y-3">
          <div className="flex items-center justify-between border-b border-[var(--border-secondary)] pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
              <span>Packaging Structure</span>
            </span>
            <span className="text-[11px] font-semibold text-[var(--brand-primary)] bg-[var(--badge-completed-bg)] px-2.5 py-0.5 rounded-full border border-[var(--brand-primary)]/20">
              Multilayer Packaging Structure
            </span>
          </div>

          <div className="space-y-2 pt-1">
            {packagingSolution.layers.map((layer, idx) => (
              <React.Fragment key={layer.name}>
                <div className="p-3 rounded-lg bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] flex items-start justify-between gap-3 text-xs shadow-2xs hover:border-[var(--brand-primary)]/30 transition-colors">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] font-mono font-bold flex items-center justify-center text-[10px] border border-[var(--brand-primary)]/20">
                        L{idx + 1}
                      </span>
                      <span className="font-bold text-[var(--text-primary)] text-sm">{layer.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--bg-card)] text-[var(--text-secondary)] font-medium border border-[var(--border-secondary)]">
                        {layer.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--text-secondary)] pl-7 leading-relaxed">
                      {layer.role}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono text-xs font-bold text-[var(--text-primary)]">{layer.thickness}</span>
                    <div className="text-[10px] text-[var(--text-muted)]">Caliper</div>
                  </div>
                </div>
                {idx < packagingSolution.layers.length - 1 && (
                  <div className="flex items-center justify-center -my-1 text-[var(--text-muted)] text-[10px] font-medium gap-2">
                    <span className="h-2 w-px bg-[var(--border-primary)]" />
                    <span className="text-[10px] text-[var(--brand-primary)]">— Interlayer Co-Extrusion Lamination —</span>
                    <span className="h-2 w-px bg-[var(--border-primary)]" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="p-2.5 rounded-lg bg-[var(--bg-card-elevated)] border border-[var(--border-primary)]/60 text-xs text-[var(--text-secondary)] leading-relaxed">
            <span className="font-bold text-[var(--text-primary)]">Multilayer Structure: </span>
            This is an engineered composite laminate where each layer fulfills a specific technical role: outer puncture defense and print gloss, inner EVOH gas barrier control, and polyolefin hermetic heat-seal integrity.
          </div>
        </div>

        {/* Why this recommendation */}
        <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-secondary)] space-y-3">
          <div className="flex items-center gap-2 border-b border-[var(--border-secondary)] pb-2">
            <ShieldCheck className="w-4 h-4 text-[var(--brand-primary)] shrink-0" />
            <h5 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
              Why this recommendation?
            </h5>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {packagingSolution.reasons.map((reason, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 p-2.5 rounded-lg bg-[var(--bg-card-elevated)] border border-[var(--border-primary)]/60 text-[var(--text-secondary)] shadow-2xs"
              >
                <Check className="w-3.5 h-3.5 text-[var(--brand-primary)] shrink-0 mt-0.5" />
                <span className="leading-snug">{reason}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Packaging Performance Properties */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-[var(--border-secondary)] pb-1.5">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[var(--brand-primary)]" />
            <h5 className="text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">
              Key Packaging Performance Properties
            </h5>
          </div>
          <span className="text-xs text-[var(--text-muted)] font-medium">Reference / Prototype Data</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
                  <span>Oxygen Barrier</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase bg-[var(--badge-completed-bg)] text-[var(--badge-completed-text)] border border-[var(--brand-primary)]/20">
                  {packagingRequirements.oxygenBarrier.level}
                </span>
              </div>
              <div className="text-lg font-bold text-[var(--text-primary)] mt-2">
                {packagingSolution.specifications.otr.value}{' '}
                <span className="text-xs font-normal text-[var(--text-muted)]">
                  {packagingSolution.specifications.otr.unit}
                </span>
              </div>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)] mt-2.5 leading-relaxed">
              {packagingSolution.specifications.otr.tooltip}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-blue-500" />
                  <span>Moisture Barrier</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  {packagingRequirements.moistureBarrier.level}
                </span>
              </div>
              <div className="text-lg font-bold text-[var(--text-primary)] mt-2">
                {packagingSolution.specifications.wvtr.value}{' '}
                <span className="text-xs font-normal text-[var(--text-muted)]">
                  {packagingSolution.specifications.wvtr.unit}
                </span>
              </div>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)] mt-2.5 leading-relaxed">
              {packagingSolution.specifications.wvtr.tooltip}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Total Caliper</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Optimized
                </span>
              </div>
              <div className="text-lg font-bold text-[var(--text-primary)] mt-2">
                {packagingSolution.specifications.thickness.value}
              </div>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)] mt-2.5 leading-relaxed">
              {packagingSolution.specifications.thickness.tooltip}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                  <Box className="w-3.5 h-3.5 text-amber-500" />
                  <span>Mechanical Strength</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase bg-[var(--badge-completed-bg)] text-[var(--badge-completed-text)] border border-[var(--brand-primary)]/20">
                  {packagingRequirements.mechanicalStrength.level}
                </span>
              </div>
              <div className="text-lg font-bold text-[var(--text-primary)] mt-2">
                {packagingSolution.specifications.mechanicalStrength.value}
              </div>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)] mt-2.5 leading-relaxed">
              {packagingSolution.specifications.mechanicalStrength.tooltip}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-rose-500" />
                  <span>Sealability</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase bg-[var(--badge-completed-bg)] text-[var(--badge-completed-text)] border border-[var(--brand-primary)]/20">
                  {packagingRequirements.sealability.level}
                </span>
              </div>
              <div className="text-lg font-bold text-[var(--text-primary)] mt-2">
                {packagingSolution.specifications.sealability.value}
              </div>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)] mt-2.5 leading-relaxed">
              {packagingSolution.specifications.sealability.tooltip}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                  <span>MAP Suitability</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                  {packagingRequirements.mapSuitability.level}
                </span>
              </div>
              <div className="text-lg font-bold text-[var(--text-primary)] mt-2">
                {packagingSolution.specifications.mapSuitability.value}
              </div>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)] mt-2.5 leading-relaxed">
              {packagingSolution.specifications.mapSuitability.gasMixRecommendation || packagingSolution.specifications.mapSuitability.tooltip}
            </p>
          </div>
        </div>
      </div>

      {/* Alternative Packaging Options */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-[var(--border-secondary)] pb-1.5">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-[var(--brand-primary)]" />
            <h5 className="text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">
              Alternative Packaging Options
            </h5>
          </div>
          <span className="text-xs text-[var(--text-muted)] font-medium">Comparative Analysis</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {packagingSolution.alternatives.slice(0, 1).map((alt) => (
            <div
              key={alt.id}
              className="p-4 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] shadow-xs flex flex-col justify-between space-y-3 hover:border-[var(--brand-primary)]/40 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                      Alternative 1 — Rigid Option
                    </span>
                    <div className="text-sm font-bold text-[var(--text-primary)] mt-0.5">
                      {alt.name}
                    </div>
                    <div className="text-xs font-semibold text-[var(--brand-primary)]">
                      {alt.structure}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[var(--badge-completed-bg)] text-[var(--badge-completed-text)] border border-[var(--brand-primary)]/20 shrink-0">
                    Match: {alt.match}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {alt.description}
                </p>
                <div className="p-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-secondary)] space-y-1.5 text-[11px]">
                  <div className="text-[var(--text-secondary)]">
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">Pros: </span>
                    {alt.pros.join('; ')}
                  </div>
                  <div className="text-[var(--text-secondary)]">
                    <span className="font-semibold text-amber-600 dark:text-amber-400">Trade-offs: </span>
                    {alt.cons.join('; ')}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-[var(--border-secondary)] text-xs">
                <span className="text-[var(--text-muted)] font-medium">Cost: {alt.estimatedCost}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onOpenCompare(alt)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--bg-card)] border border-[var(--border-secondary)] text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition-colors cursor-pointer"
                  >
                    <Scale className="w-3 h-3" />
                    <span>Quick Spec</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectOptionAndStep7('alternative')}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--brand-primary)] text-[var(--brand-text)] hover:bg-[var(--brand-secondary)] text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                  >
                    <span>Compare in Step 7</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="p-4 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] shadow-xs flex flex-col justify-between space-y-3 hover:border-emerald-500/40 transition-colors">
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Leaf className="w-3 h-3" />
                    <span>Sustainable Alternative</span>
                  </span>
                  <div className="text-sm font-bold text-[var(--text-primary)] mt-0.5">
                    {packagingSolution.sustainableAlternative.name}
                  </div>
                  <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    {packagingSolution.sustainableAlternative.structure}
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                  Match: {packagingSolution.sustainableAlternative.match}
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {packagingSolution.sustainableAlternative.whyConsider}
              </p>
              <div className="p-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-secondary)] space-y-1.5 text-[11px]">
                <div className="text-[var(--text-secondary)]">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">Recyclability: </span>
                  {packagingSolution.sustainableAlternative.recyclability}
                </div>
                <div className="text-[var(--text-secondary)]">
                  <span className="font-semibold text-amber-600 dark:text-amber-400">Trade-offs: </span>
                  {packagingSolution.sustainableAlternative.tradeoffs}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-[var(--border-secondary)] text-xs">
              <span className="text-[var(--text-muted)] font-medium">Type: {packagingSolution.sustainableAlternative.materialType}</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    const bioAlt: PackagingAlternativeItem = {
                      id: 'bio-pla',
                      name: packagingSolution.sustainableAlternative.name,
                      structure: packagingSolution.sustainableAlternative.structure,
                      match: packagingSolution.sustainableAlternative.match,
                      description: packagingSolution.sustainableAlternative.whyConsider,
                      pros: [
                        'Certified industrially compostable',
                        'Reduced fossil carbon footprint (-68%)',
                        'Inherent anti-fog optical clarity',
                      ],
                      cons: [
                        'Higher moisture permeation',
                        'Requires climate-controlled storage (<25°C)',
                      ],
                      otr: '750 – 1,100 cc/m²/24h',
                      wvtr: '24.0 g/m²/24h',
                      thickness: '60 µm',
                      recyclability: packagingSolution.sustainableAlternative.recyclability,
                      estimatedCost: '$0.040 – $0.050 / package',
                    };
                    onOpenCompare(bioAlt);
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--bg-card)] border border-[var(--border-secondary)] text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition-colors cursor-pointer"
                >
                  <Scale className="w-3 h-3" />
                  <span>Quick Spec</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSelectOptionAndStep7('sustainable')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                >
                  <span>Compare in Step 7</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cost & Sustainability Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="p-4 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] space-y-2 shadow-xs">
          <div className="flex items-center justify-between border-b border-[var(--border-secondary)] pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
              <span>Estimated Material Cost</span>
            </span>
            <span className="text-[11px] font-semibold text-[var(--text-muted)]">Commercial Benchmark</span>
          </div>
          <div className="space-y-1">
            <div className="text-lg font-bold text-[var(--text-primary)]">
              {packagingSolution.estimatedCost.costPerPackage}
            </div>
            <div className="text-xs text-[var(--brand-primary)] font-medium">
              Equivalent to {packagingSolution.estimatedCost.materialCostRange}
            </div>
            <p className="text-[11px] text-[var(--text-secondary)] pt-1 leading-relaxed">
              {packagingSolution.estimatedCost.basis}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] space-y-2 shadow-xs">
          <div className="flex items-center justify-between border-b border-[var(--border-secondary)] pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5 text-emerald-500" />
              <span>Circularity & Material Profile</span>
            </span>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">RIC Code 1 / 4</span>
          </div>
          <div className="space-y-1">
            <div className="text-xs font-bold text-[var(--text-primary)]">
              {packagingSolution.sustainability.recyclability}
            </div>
            <div className="text-xs text-[var(--text-secondary)]">
              Material Efficiency: <span className="font-semibold text-[var(--text-primary)]">{packagingSolution.sustainability.materialUsage}</span>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)] pt-1 leading-relaxed">
              {packagingSolution.sustainability.calculationBasis} Avoided food spoilage represents the highest net GHG reduction benefit.
            </p>
          </div>
        </div>
      </div>

      {/* Expected Shelf-Life Impact */}
      <div className="p-4 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] space-y-2.5 shadow-xs">
        <div className="flex items-center justify-between border-b border-[var(--border-secondary)] pb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
            <span>Shelf-Life Evaluation</span>
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[var(--text-primary)]">
              Target Shelf Life: {shelfLifeNumber} {shelfLifeUnit}
            </span>
          </div>
        </div>
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
          <span className="font-semibold text-[var(--text-primary)]">Shelf-life impact:</span> Designed to support the specified storage and packaging requirements. Validation required before commercial deployment.
        </p>
        <div className="p-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-secondary)] text-[11px] text-[var(--text-muted)] flex items-start gap-2">
          <Info className="w-3.5 h-3.5 text-[var(--brand-primary)] shrink-0 mt-0.5" />
          <span>
            Prototype engine qualitative evaluation. Empirically validated shelf-life models require commercial challenge testing under actual distribution channels.
          </span>
        </div>
      </div>

      {/* AI Decision Chain Flow */}
      <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-secondary)] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-[var(--brand-primary)] shrink-0" />
            <h5 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
              AI Decision Chain & Reasoning Flow
            </h5>
          </div>
          <button
            type="button"
            onClick={onToggleDecisionChain}
            className="text-xs text-[var(--brand-primary)] hover:underline flex items-center gap-1 cursor-pointer font-medium"
          >
            <span>{showDecisionChain ? 'Collapse Flow' : 'Expand Flow'}</span>
            {showDecisionChain ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="p-3 rounded-lg bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] flex items-center justify-between text-xs text-[var(--text-secondary)] overflow-x-auto gap-2">
          <div className="flex items-center gap-1.5 shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
            <span className="font-semibold text-[var(--text-primary)]">1. Product Context</span>
          </div>
          <span className="text-[var(--text-muted)] shrink-0">→</span>
          <div className="flex items-center gap-1.5 shrink-0">
            <Activity className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
            <span className="font-semibold text-[var(--text-primary)]">2. Food Risk Profile</span>
          </div>
          <span className="text-[var(--text-muted)] shrink-0">→</span>
          <div className="flex items-center gap-1.5 shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
            <span className="font-semibold text-[var(--text-primary)]">3. Technical Requirements</span>
          </div>
          <span className="text-[var(--text-muted)] shrink-0">→</span>
          <div className="flex items-center gap-1.5 shrink-0">
            <Database className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
            <span className="font-semibold text-[var(--text-primary)]">4. Material Database</span>
          </div>
          <span className="text-[var(--text-muted)] shrink-0">→</span>
          <div className="flex items-center gap-1.5 shrink-0 font-bold text-[var(--brand-primary)]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>5. Multilayer Solution</span>
          </div>
        </div>

        {showDecisionChain && (
          <div className="space-y-2 text-xs pt-1 animate-in fade-in duration-150">
            <div className="p-2.5 rounded-lg bg-[var(--bg-card-elevated)] border border-[var(--border-primary)]/60 space-y-1">
              <div className="font-semibold text-[var(--text-primary)]">Step 1 & 2: Food & Logistics Baseline</div>
              <div className="text-[var(--text-secondary)]">{packagingSolution.decisionChain.foodRiskSummary}</div>
            </div>
            <div className="p-2.5 rounded-lg bg-[var(--bg-card-elevated)] border border-[var(--border-primary)]/60 space-y-1">
              <div className="font-semibold text-[var(--text-primary)]">Step 3 & 4: Performance Translation & Database Match</div>
              <div className="text-[var(--text-secondary)]">{packagingSolution.decisionChain.packagingRequirementsSummary}</div>
              <div className="text-[11px] text-[var(--text-muted)]">{packagingSolution.decisionChain.databaseCandidates}</div>
            </div>
            <div className="p-2.5 rounded-lg bg-[var(--bg-card-elevated)] border border-[var(--border-primary)]/60 space-y-1">
              <div className="font-semibold text-[var(--text-primary)]">Step 5: Co-Extrusion Recommendation</div>
              <div className="text-[var(--text-secondary)]">{packagingSolution.decisionChain.recommendationSummary}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
