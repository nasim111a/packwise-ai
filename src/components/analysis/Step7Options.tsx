import React from 'react';
import {
  Sparkles,
  CheckCircle2,
  Check,
  Scale,
  Leaf,
  Info,
  SlidersHorizontal,
} from 'lucide-react';
import {
  IdentifiedFoodProfile,
  PackagingSolutionData,
  PackagingAlternativeItem,
  StorageConditionType,
  TransitDistanceType,
  ShelfLifeUnitType,
} from './types';

interface Step7Props {
  identifiedFood: IdentifiedFoodProfile;
  productName: string;
  storageCondition: StorageConditionType;
  shelfLifeNumber: number;
  shelfLifeUnit: ShelfLifeUnitType;
  transitDistance: TransitDistanceType;
  selectedOption: 'recommended' | 'alternative' | 'sustainable';
  onSelectOption: (opt: 'recommended' | 'alternative' | 'sustainable') => void;
  packagingSolution: PackagingSolutionData;
  primaryAlt: PackagingAlternativeItem;
  showCostEstimationDetails: boolean;
  onToggleCostDetails: () => void;
}

export const Step7Options: React.FC<Step7Props> = ({
  identifiedFood,
  productName,
  storageCondition,
  shelfLifeNumber,
  shelfLifeUnit,
  transitDistance,
  selectedOption,
  onSelectOption,
  packagingSolution,
  primaryAlt,
  showCostEstimationDetails,
  onToggleCostDetails,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="text-center space-y-1.5 pb-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--badge-completed-bg)] text-[var(--badge-completed-text)] border border-[var(--brand-primary)]/20 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
          <span>Prototype Recommendation Engine · Knowledge Base + Rule Engine</span>
        </div>
        <h4 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)] pt-1">
          Packaging Options
        </h4>
        <div className="text-xs sm:text-sm text-[var(--text-secondary)] font-medium max-w-2xl mx-auto flex flex-wrap items-center justify-center gap-1.5">
          <span className="font-bold text-[var(--text-primary)]">For:</span>
          <span>{identifiedFood.name || productName || 'Mango'}</span>
          <span className="text-[var(--text-muted)]">·</span>
          <span>{identifiedFood.foodGroup || identifiedFood.category || 'Fresh Produce'}</span>
          <span className="text-[var(--text-muted)]">·</span>
          <span>
            {storageCondition === 'ambient'
              ? 'Ambient'
              : storageCondition === 'chilled'
              ? 'Chilled'
              : 'Frozen'}
          </span>
          <span className="text-[var(--text-muted)]">·</span>
          <span>{shelfLifeNumber} {shelfLifeUnit}</span>
          <span className="text-[var(--text-muted)]">·</span>
          <span>
            {transitDistance === 'local'
              ? 'Local Transit'
              : transitDistance === 'regional'
              ? 'Regional Distribution'
              : 'Long Distance'}
          </span>
        </div>
        <p className="text-xs text-[var(--text-muted)] max-w-xl mx-auto leading-relaxed pt-0.5">
          Compare the recommended packaging solution with practical alternatives and a sustainability-oriented option across technical barrier performance, unit cost estimates, and circularity lifecycles.
        </p>
      </div>

      {/* Three Options Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recommended Option */}
        <div
          className={`p-4.5 rounded-2xl bg-[var(--bg-card)] border-2 transition-all flex flex-col justify-between space-y-4 shadow-sm relative ${
            selectedOption === 'recommended'
              ? 'border-[var(--brand-primary)] ring-2 ring-[var(--brand-primary)]/20'
              : 'border-[var(--brand-primary)]/70 hover:border-[var(--brand-primary)]'
          }`}
        >
          <div className="space-y-3.5">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[var(--badge-completed-bg)] text-[var(--badge-completed-text)] border border-[var(--brand-primary)]/30">
                <CheckCircle2 className="w-3 h-3 text-[var(--brand-primary)]" />
                <span>RECOMMENDED</span>
              </span>
              <span className="text-[11px] font-bold text-[var(--badge-completed-text)] bg-[var(--badge-completed-bg)] px-2 py-0.5 rounded border border-[var(--brand-primary)]/20">
                Match: High
              </span>
            </div>
            <div>
              <div className="text-base font-bold text-[var(--text-primary)] leading-tight">
                {packagingSolution.primaryStructure}
              </div>
              <div className="text-xs font-semibold text-[var(--brand-primary)] mt-1">
                Co-Extruded Multi-Layer Structure
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-secondary)] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[var(--text-secondary)]">Requirement Match:</span>
                <span className="font-bold text-[var(--text-primary)] flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>High</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--text-secondary)]">Oxygen Barrier:</span>
                <span className="font-semibold text-[var(--text-primary)]">
                  High Barrier
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--text-secondary)]">Moisture Barrier:</span>
                <span className="font-semibold text-[var(--text-primary)]">
                  Medium-High
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--text-secondary)]">Mechanical Strength:</span>
                <span className="font-semibold text-[var(--text-primary)]">
                  {packagingSolution.specifications.mechanicalStrength.value}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--text-secondary)]">Sealability:</span>
                <span className="font-semibold text-[var(--text-primary)]">
                  {packagingSolution.specifications.sealability.value}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--text-secondary)]">MAP Suitability:</span>
                <span className="font-semibold text-[var(--text-primary)]">
                  {packagingSolution.specifications.mapSuitability.value}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-secondary)] space-y-1 text-xs">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--brand-primary)]">
                Why selected
              </div>
              <p className="text-[var(--text-secondary)] leading-relaxed text-[11px]">
                {packagingSolution.decisionChain.recommendationSummary ||
                  'Best overall compatibility with the identified food risks, storage conditions, transportation requirements, and required barrier performance.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onSelectOption('recommended')}
            className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold cursor-pointer transition-colors flex items-center justify-center gap-1.5 ${
              selectedOption === 'recommended'
                ? 'bg-[var(--brand-primary)] text-[var(--brand-text)] shadow-xs'
                : 'border border-[var(--border-cta)] bg-[var(--bg-card-elevated)] text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]'
            }`}
          >
            {selectedOption === 'recommended' ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Selected (Primary Recommendation)</span>
              </>
            ) : (
              <span>Select Recommended</span>
            )}
          </button>
        </div>

        {/* Alternative Option */}
        <div
          className={`p-4.5 rounded-2xl bg-[var(--bg-card)] border transition-all flex flex-col justify-between space-y-4 shadow-xs relative ${
            selectedOption === 'alternative'
              ? 'border-[var(--brand-primary)] ring-2 ring-[var(--brand-primary)]/20'
              : 'border-[var(--border-primary)] hover:border-[var(--brand-primary)]/50'
          }`}
        >
          <div className="space-y-3.5">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[var(--bg-card-elevated)] text-[var(--text-secondary)] border border-[var(--border-secondary)]">
                <Scale className="w-3 h-3 text-[var(--brand-primary)]" />
                <span>ALTERNATIVE</span>
              </span>
              <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                Match: {primaryAlt.match}
              </span>
            </div>
            <div>
              <div className="text-base font-bold text-[var(--text-primary)] leading-tight">
                {primaryAlt.structure}
              </div>
              <div className="text-xs font-semibold text-[var(--text-secondary)] mt-1">
                {primaryAlt.name}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-secondary)] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[var(--text-secondary)]">Requirement Match:</span>
                <span className="font-bold text-[var(--text-primary)] flex items-center gap-1">
                  {primaryAlt.match === 'High' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <span className="text-amber-600 dark:text-amber-400">~</span>
                  )}
                  <span>{primaryAlt.match}</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--text-secondary)]">Oxygen Barrier:</span>
                <span className="font-semibold text-[var(--text-primary)]">
                  {primaryAlt.otr.includes('Macro') ? 'Macro-Vented' : 'Medium'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--text-secondary)]">Moisture Barrier:</span>
                <span className="font-semibold text-[var(--text-primary)]">
                  {primaryAlt.wvtr.includes('Macro') ? 'Vented' : 'Medium'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--text-secondary)]">Mechanical Strength:</span>
                <span className="font-semibold text-[var(--text-primary)]">Very High</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--text-secondary)]">Sealability:</span>
                <span className="font-semibold text-[var(--text-primary)]">High</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--text-secondary)]">MAP Suitability:</span>
                <span className="font-semibold text-[var(--text-primary)]">
                  {primaryAlt.structure.includes('Clamshell') ? 'Partial' : 'Suitable'}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-secondary)] space-y-1 text-xs">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Why consider this?
              </div>
              <p className="text-[var(--text-secondary)] leading-relaxed text-[11px]">
                {primaryAlt.description ||
                  'Suitable when mechanical durability, simpler mono-material construction, and curbside collection are prioritized.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onSelectOption('alternative')}
            className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold cursor-pointer transition-colors flex items-center justify-center gap-1.5 ${
              selectedOption === 'alternative'
                ? 'bg-[var(--brand-primary)] text-[var(--brand-text)] shadow-xs'
                : 'border border-[var(--border-cta)] bg-[var(--bg-card-elevated)] text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]'
            }`}
          >
            {selectedOption === 'alternative' ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Selected as Active Choice</span>
              </>
            ) : (
              <span>Select Alternative</span>
            )}
          </button>
        </div>

        {/* Sustainable Option */}
        <div
          className={`p-4.5 rounded-2xl bg-[var(--bg-card)] border transition-all flex flex-col justify-between space-y-4 shadow-xs relative ${
            selectedOption === 'sustainable'
              ? 'border-emerald-500 ring-2 ring-emerald-500/20'
              : 'border-emerald-500/30 hover:border-emerald-500/60'
          }`}
        >
          <div className="space-y-3.5">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <Leaf className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>SUSTAINABILITY OPTION</span>
              </span>
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Match: {packagingSolution.sustainableAlternative.match}
              </span>
            </div>
            <div>
              <div className="text-base font-bold text-[var(--text-primary)] leading-tight">
                {packagingSolution.sustainableAlternative.structure}
              </div>
              <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                {packagingSolution.sustainableAlternative.name}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-secondary)] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[var(--text-secondary)]">Requirement Match:</span>
                <span className="font-bold text-[var(--text-primary)] flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>{packagingSolution.sustainableAlternative.match}</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--text-secondary)]">Recyclability:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 truncate max-w-[130px]">
                  {packagingSolution.sustainableAlternative.recyclability.includes('Compostable') ? 'Industrial Compost' : 'Curbside Polyolefin'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--text-secondary)]">Barrier Compatibility:</span>
                <span className="font-semibold text-[var(--text-primary)]">Medium / Controlled</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--text-secondary)]">Mechanical Performance:</span>
                <span className="font-semibold text-[var(--text-primary)]">Medium-High</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--text-secondary)]">Sealability:</span>
                <span className="font-semibold text-[var(--text-primary)]">High / Reliable</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--text-secondary)]">Application Suitability:</span>
                <span className="font-semibold text-[var(--text-primary)]">Suitable with RH Control</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-secondary)] space-y-1 text-xs">
              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Why consider this?
              </div>
              <p className="text-[var(--text-secondary)] leading-relaxed text-[11px]">
                {packagingSolution.sustainableAlternative.whyConsider}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onSelectOption('sustainable')}
            className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold cursor-pointer transition-colors flex items-center justify-center gap-1.5 ${
              selectedOption === 'sustainable'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'border border-[var(--border-cta)] bg-[var(--bg-card-elevated)] text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]'
            }`}
          >
            {selectedOption === 'sustainable' ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Selected as Active Choice</span>
              </>
            ) : (
              <span>Select Sustainability Option</span>
            )}
          </button>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-[var(--brand-primary)]" />
            <h5 className="text-base font-bold text-[var(--text-primary)]">
              Compare Packaging Options
            </h5>
          </div>
          <span className="text-xs text-[var(--text-muted)]">
            Qualitative performance benchmark
          </span>
        </div>
        <div className="overflow-x-auto border border-[var(--border-secondary)] rounded-2xl bg-[var(--bg-card)] shadow-xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[var(--bg-card-elevated)] border-b border-[var(--border-secondary)]">
                <th className="p-3.5 font-bold uppercase tracking-wider text-[var(--text-muted)] w-1/4">
                  Requirement
                </th>
                <th className="p-3.5 font-bold text-[var(--brand-primary)] w-1/4 border-l border-[var(--border-secondary)] bg-[var(--brand-primary)]/5">
                  <div className="flex items-center gap-1">
                    <span>Recommended</span>
                    <span className="text-[10px] font-normal text-[var(--text-muted)]">(Primary)</span>
                  </div>
                </th>
                <th className="p-3.5 font-bold text-[var(--text-primary)] w-1/4 border-l border-[var(--border-secondary)]">
                  Alternative
                </th>
                <th className="p-3.5 font-bold text-emerald-600 dark:text-emerald-400 w-1/4 border-l border-[var(--border-secondary)] bg-emerald-500/5">
                  Sustainable Option
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-secondary)]">
              <tr>
                <td className="p-3 font-semibold text-[var(--text-primary)]">Oxygen Barrier</td>
                <td className="p-3 border-l border-[var(--border-secondary)] bg-[var(--brand-primary)]/5">
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                    <Check className="w-3.5 h-3.5" /> High
                  </span>
                </td>
                <td className="p-3 border-l border-[var(--border-secondary)] text-[var(--text-secondary)]">
                  <span className="inline-flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
                    <span>~</span> {primaryAlt.otr.includes('Macro') ? 'Macro-Vented' : 'Medium'}
                  </span>
                </td>
                <td className="p-3 border-l border-[var(--border-secondary)] bg-emerald-500/5 text-[var(--text-secondary)]">
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                    <Check className="w-3.5 h-3.5" /> Controlled
                  </span>
                </td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-[var(--text-primary)]">Moisture Barrier</td>
                <td className="p-3 border-l border-[var(--border-secondary)] bg-[var(--brand-primary)]/5">
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                    <Check className="w-3.5 h-3.5" /> Medium-High
                  </span>
                </td>
                <td className="p-3 border-l border-[var(--border-secondary)] text-[var(--text-secondary)]">
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                    <Check className="w-3.5 h-3.5" /> {primaryAlt.wvtr.includes('Macro') ? 'Vented' : 'High'}
                  </span>
                </td>
                <td className="p-3 border-l border-[var(--border-secondary)] bg-emerald-500/5 text-[var(--text-secondary)]">
                  <span className="inline-flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
                    <span>~</span> Medium
                  </span>
                </td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-[var(--text-primary)]">Mechanical Strength</td>
                <td className="p-3 border-l border-[var(--border-secondary)] bg-[var(--brand-primary)]/5">
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                    <Check className="w-3.5 h-3.5" /> High
                  </span>
                </td>
                <td className="p-3 border-l border-[var(--border-secondary)] text-[var(--text-secondary)]">
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                    <Check className="w-3.5 h-3.5" /> Very High
                  </span>
                </td>
                <td className="p-3 border-l border-[var(--border-secondary)] bg-emerald-500/5 text-[var(--text-secondary)]">
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                    <Check className="w-3.5 h-3.5" /> Medium-High
                  </span>
                </td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-[var(--text-primary)]">Sealability</td>
                <td className="p-3 border-l border-[var(--border-secondary)] bg-[var(--brand-primary)]/5">
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                    <Check className="w-3.5 h-3.5" /> High
                  </span>
                </td>
                <td className="p-3 border-l border-[var(--border-secondary)] text-[var(--text-secondary)]">
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                    <Check className="w-3.5 h-3.5" /> High
                  </span>
                </td>
                <td className="p-3 border-l border-[var(--border-secondary)] bg-emerald-500/5 text-[var(--text-secondary)]">
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                    <Check className="w-3.5 h-3.5" /> High / Reliable
                  </span>
                </td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-[var(--text-primary)]">Recyclability</td>
                <td className="p-3 border-l border-[var(--border-secondary)] bg-[var(--brand-primary)]/5 text-[var(--text-secondary)]">
                  <span className="inline-flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
                    <span>~</span> Moderate
                  </span>
                </td>
                <td className="p-3 border-l border-[var(--border-secondary)] text-[var(--text-secondary)]">
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                    <Check className="w-3.5 h-3.5" /> High
                  </span>
                </td>
                <td className="p-3 border-l border-[var(--border-secondary)] bg-emerald-500/5 text-[var(--text-secondary)]">
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                    <Check className="w-3.5 h-3.5" /> High
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Cost Section */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-[var(--brand-primary)]" />
            <h5 className="text-base font-bold text-[var(--text-primary)]">Estimated Cost</h5>
          </div>
          <span className="text-xs text-[var(--text-muted)]">Database-Derived Benchmark</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-primary)] space-y-1.5 shadow-xs">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--brand-primary)]">
              Recommended
            </div>
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

          <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-primary)] space-y-1.5 shadow-xs">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Alternative
            </div>
            <div className="text-lg font-bold text-[var(--text-primary)]">
              {primaryAlt.estimatedCost}
            </div>
            <div className="text-xs text-[var(--text-muted)]">
              Standard commercial packaging range
            </div>
            <p className="text-[11px] text-[var(--text-secondary)] pt-1 leading-relaxed">
              Based on standard polymer resin pricing and lower conversion pass complexity.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-primary)] space-y-1.5 shadow-xs">
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Sustainable Alternative
            </div>
            <div className="text-lg font-bold text-[var(--text-primary)]">
              $0.040 – $0.050 / package
            </div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              Bio-polymer formulation
            </div>
            <p className="text-[11px] text-[var(--text-secondary)] pt-1 leading-relaxed">
              Reflects certified repulpable resin manufacturing premium over standard fossil polyolefins.
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-secondary)] space-y-2">
          <button
            type="button"
            onClick={onToggleCostDetails}
            className="flex items-center justify-between w-full text-xs font-semibold text-[var(--text-primary)] hover:text-[var(--brand-primary)] cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
              <span>How cost is estimated</span>
            </span>
            <span className="text-[var(--text-muted)] text-[11px]">
              {showCostEstimationDetails ? 'Hide details' : 'View calculation details'}
            </span>
          </button>
          {showCostEstimationDetails && (
            <div className="pt-2 border-t border-[var(--border-secondary)] text-xs text-[var(--text-secondary)] space-y-2.5 animate-in fade-in duration-150">
              <div className="p-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-primary)]/60 font-mono text-[11px] text-[var(--text-primary)]">
                Estimated Unit Cost = Material Price × Gauge × Surface Area × Production Yield
              </div>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Calculated using prevailing virgin/recycled resin market indexes, film caliper, and standard pouch converting overheads.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Trade-Off Summary */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[var(--brand-primary)]" />
          <h5 className="text-base font-bold text-[var(--text-primary)]">
            Trade-Off Summary
          </h5>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-secondary)] space-y-2">
            <div className="font-bold text-[var(--brand-primary)] flex items-center justify-between">
              <span>Recommended</span>
              <span className="text-[10px] text-[var(--text-muted)]">Balanced</span>
            </div>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              <span className="font-semibold text-[var(--text-primary)]">Trade-off: </span>
              Highest barrier protection, moderate recyclability, balanced unit cost.
            </p>
            <div className="pt-1 text-[11px] text-[var(--text-muted)]">
              Optimal when target shelf life ({shelfLifeNumber} {shelfLifeUnit}) and transit preservation are critical.
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-secondary)] space-y-2">
            <div className="font-bold text-[var(--text-primary)] flex items-center justify-between">
              <span>Alternative</span>
              <span className="text-[10px] text-[var(--text-muted)]">Cost & Durability</span>
            </div>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              <span className="font-semibold text-[var(--text-primary)]">Trade-off: </span>
              Lower barrier, simpler structure, lower cost, high mechanical crush resistance.
            </p>
            <div className="pt-1 text-[11px] text-[var(--text-muted)]">
              Optimal when rapid retail inventory turnover and standard curbside sorting are prioritized.
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-emerald-500/20 space-y-2">
            <div className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
              <span>Sustainable Option</span>
              <span className="text-[10px] text-[var(--text-muted)]">Circularity</span>
            </div>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              <span className="font-semibold text-[var(--text-primary)]">Trade-off: </span>
              Highest recyclability, moderate barrier performance, premium resin cost.
            </p>
            <div className="pt-1 text-[11px] text-[var(--text-muted)]">
              Optimal for circular brand leadership with monitored cold-chain logistics.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
