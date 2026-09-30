import React from 'react';
import {
  Sparkles,
  Layers,
  CheckCircle2,
  Check,
  ShieldCheck,
  Activity,
  SlidersHorizontal,
  Info,
} from 'lucide-react';
import {
  PackagingSolutionData,
  PackagingRequirementsData,
  FoodRiskProfileData,
  RequirementComparisonItem,
} from './analysis/types';

interface RecommendationResultProps {
  productName: string;
  category: string;
  storageCondition: string;
  shelfLife: string;
  transitDistance: string;
  packagingSolution: PackagingSolutionData;
  packagingRequirements?: PackagingRequirementsData;
  foodRiskProfile?: FoodRiskProfileData;
  onOpenCompare?: () => void;
  isPrototypeEngine?: boolean;
}

export const RecommendationResult: React.FC<RecommendationResultProps> = ({
  productName,
  category,
  storageCondition,
  shelfLife,
  transitDistance,
  packagingSolution,
  isPrototypeEngine = true,
}) => {
  return (
    <div className="space-y-6">
      {/* Engine Status Banner */}
      {isPrototypeEngine && (
        <div className="p-3 rounded-xl bg-[var(--badge-completed-bg)] border border-[var(--brand-primary)]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 font-semibold text-[var(--brand-primary)]">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>Prototype Recommendation Engine (Knowledge Base + Rule Engine)</span>
          </div>
          <span className="text-[11px] text-[var(--text-muted)]">
            Seeded Food Knowledge Base · Packaging Materials Database
          </span>
        </div>
      )}

      {/* Primary Structure Card */}
      <div className="p-5 rounded-2xl bg-[var(--bg-card)] border-2 border-[var(--brand-primary)] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-secondary)]">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--brand-primary)]">
              Recommended Packaging Solution
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mt-0.5">
              {packagingSolution.primaryStructure}
            </h3>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[var(--badge-completed-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/30 self-start sm:self-auto">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Requirement Match: {packagingSolution.compatibilityLevel}</span>
          </div>
        </div>

        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
          {packagingSolution.statusExplanation}
        </p>

        {/* Multilayer Architecture Breakdown */}
        {packagingSolution.layers && packagingSolution.layers.length > 0 && (
          <div className="space-y-2 pt-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
              <Layers className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
              <span>Layer Construction & Caliper Specifications</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              {packagingSolution.layers.map((layer, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-secondary)] space-y-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[var(--text-primary)]">{layer.name}</span>
                    <span className="text-[11px] font-mono text-[var(--brand-primary)] font-semibold">
                      {layer.thickness}
                    </span>
                  </div>
                  <div className="text-[11px] font-medium text-[var(--text-muted)]">{layer.type}</div>
                  <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                    {layer.role}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Reasons */}
        <div className="space-y-2 pt-1">
          <div className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Selection Rationale & Validation Basis
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {packagingSolution.reasons.map((reason, idx) => (
              <div key={idx} className="flex items-start gap-2 text-[var(--text-secondary)]">
                <Check className="w-3.5 h-3.5 text-[var(--brand-primary)] shrink-0 mt-0.5" />
                <span>{reason}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Shelf-Life & Cost Qualitative Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
          <div className="p-3 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-secondary)] space-y-1">
            <div className="font-bold text-[var(--text-primary)]">Target Shelf Life</div>
            <div className="text-sm font-semibold text-[var(--brand-primary)]">
              {packagingSolution.shelfLifeImpact.targetShelfLife}
            </div>
            <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
              {packagingSolution.shelfLifeImpact.explanation}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-secondary)] space-y-1">
            <div className="font-bold text-[var(--text-primary)]">Estimated Cost</div>
            <div className="text-sm font-semibold text-[var(--text-primary)]">
              {packagingSolution.estimatedCost.costPerPackage || 'Cost data unavailable'}
            </div>
            <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
              {packagingSolution.estimatedCost.basis}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
