import React from 'react';
import {
  Cpu,
  Activity,
  SlidersHorizontal,
  Info,
  ShieldCheck,
  Database,
  Sparkles,
} from 'lucide-react';
import {
  IdentifiedFoodProfile,
  FoodRiskProfileData,
  PackagingRequirementsData,
  StorageConditionType,
  TransitDistanceType,
  ShelfLifeUnitType,
} from './types';

interface Step5Props {
  identifiedFood: IdentifiedFoodProfile;
  productName: string;
  storageCondition: StorageConditionType;
  shelfLifeNumber: number;
  shelfLifeUnit: ShelfLifeUnitType;
  transitDistance: TransitDistanceType;
  foodRiskProfile: FoodRiskProfileData;
  packagingRequirements: PackagingRequirementsData;
}

const VisualLevelIndicator: React.FC<{
  level: string;
  type: 'three_level' | 'gas' | 'strength' | 'seal' | 'map';
}> = ({ level, type }) => {
  if (type === 'three_level') {
    const isLow = level === 'LOW';
    const isMed = level === 'MEDIUM';
    const isHigh = level === 'HIGH';
    return (
      <div className="mt-2.5 space-y-1.5">
        <div className="flex items-center gap-1.5">
          <div
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              isLow || isMed || isHigh ? 'bg-[var(--brand-primary)]' : 'bg-[var(--border-primary)]'
            }`}
          />
          <div
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              isMed || isHigh ? 'bg-[var(--brand-primary)]' : 'bg-[var(--border-primary)]'
            }`}
          />
          <div
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              isHigh ? 'bg-[var(--brand-primary)]' : 'bg-[var(--border-primary)]'
            }`}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] font-medium">
          <span className={isLow ? 'font-bold text-[var(--brand-primary)]' : ''}>Low</span>
          <span>·</span>
          <span className={isMed ? 'font-bold text-[var(--brand-primary)]' : ''}>Medium</span>
          <span>·</span>
          <span className={isHigh ? 'font-bold text-[var(--brand-primary)]' : ''}>High</span>
        </div>
      </div>
    );
  }

  if (type === 'gas') {
    const isRestricted = level === 'RESTRICTED';
    const isControlled = level === 'CONTROLLED';
    const isHighExchange = level === 'HIGH EXCHANGE';
    return (
      <div className="mt-2.5 space-y-1.5">
        <div className="flex items-center gap-1.5">
          <div
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              isRestricted ? 'bg-[var(--brand-primary)]' : 'bg-[var(--border-primary)]'
            }`}
          />
          <div
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              isControlled ? 'bg-[var(--brand-primary)]' : 'bg-[var(--border-primary)]'
            }`}
          />
          <div
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              isHighExchange ? 'bg-[var(--brand-primary)]' : 'bg-[var(--border-primary)]'
            }`}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] font-medium">
          <span className={isRestricted ? 'font-bold text-[var(--brand-primary)]' : ''}>
            Restricted
          </span>
          <span>·</span>
          <span className={isControlled ? 'font-bold text-[var(--brand-primary)]' : ''}>
            Controlled
          </span>
          <span>·</span>
          <span className={isHighExchange ? 'font-bold text-[var(--brand-primary)]' : ''}>
            High Exchange
          </span>
        </div>
      </div>
    );
  }

  if (type === 'strength') {
    const isStd = level === 'STANDARD';
    const isMed = level === 'MEDIUM';
    const isHigh = level === 'HIGH';
    return (
      <div className="mt-2.5 space-y-1.5">
        <div className="flex items-center gap-1.5">
          <div
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              isStd || isMed || isHigh ? 'bg-[var(--brand-primary)]' : 'bg-[var(--border-primary)]'
            }`}
          />
          <div
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              isMed || isHigh ? 'bg-[var(--brand-primary)]' : 'bg-[var(--border-primary)]'
            }`}
          />
          <div
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              isHigh ? 'bg-[var(--brand-primary)]' : 'bg-[var(--border-primary)]'
            }`}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] font-medium">
          <span className={isStd ? 'font-bold text-[var(--brand-primary)]' : ''}>Standard</span>
          <span>·</span>
          <span className={isMed ? 'font-bold text-[var(--brand-primary)]' : ''}>Medium</span>
          <span>·</span>
          <span className={isHigh ? 'font-bold text-[var(--brand-primary)]' : ''}>High</span>
        </div>
      </div>
    );
  }

  if (type === 'seal') {
    const isHigh = level === 'HIGH';
    return (
      <div className="mt-2.5 space-y-1.5">
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 flex-1 rounded-full bg-[var(--brand-primary)]" />
          <div
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              isHigh ? 'bg-[var(--brand-primary)]' : 'bg-[var(--border-primary)]'
            }`}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] font-medium">
          <span>Standard</span>
          <span>·</span>
          <span className={isHigh ? 'font-bold text-[var(--brand-primary)]' : ''}>
            High Integrity
          </span>
        </div>
      </div>
    );
  }

  const isNotReq = level === 'NOT REQUIRED';
  const isOpt = level === 'OPTIONAL';
  const isSuitable = level === 'SUITABLE';
  return (
    <div className="mt-2.5 space-y-1.5">
      <div className="flex items-center gap-1.5">
        <div
          className={`h-1.5 flex-1 rounded-full transition-colors ${
            isNotReq
              ? 'bg-[var(--border-primary)]'
              : isOpt || isSuitable
              ? 'bg-[var(--brand-primary)]'
              : 'bg-[var(--border-primary)]'
          }`}
        />
        <div
          className={`h-1.5 flex-1 rounded-full transition-colors ${
            isOpt || isSuitable ? 'bg-[var(--brand-primary)]' : 'bg-[var(--border-primary)]'
          }`}
        />
        <div
          className={`h-1.5 flex-1 rounded-full transition-colors ${
            isSuitable ? 'bg-[var(--brand-primary)]' : 'bg-[var(--border-primary)]'
          }`}
        />
      </div>
      <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] font-medium">
        <span className={isNotReq ? 'font-bold text-[var(--text-muted)]' : ''}>Not Required</span>
        <span>·</span>
        <span className={isOpt ? 'font-bold text-[var(--brand-primary)]' : ''}>Optional</span>
        <span>·</span>
        <span className={isSuitable ? 'font-bold text-[var(--brand-primary)]' : ''}>Suitable</span>
      </div>
    </div>
  );
};

export const Step5Requirements: React.FC<Step5Props> = ({
  identifiedFood,
  productName,
  storageCondition,
  shelfLifeNumber,
  shelfLifeUnit,
  transitDistance,
  foodRiskProfile,
  packagingRequirements,
}) => {
  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div className="text-center space-y-1.5 pb-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--badge-completed-bg)] text-[var(--badge-completed-text)] text-xs font-bold tracking-wide uppercase border border-[var(--brand-primary)]/20">
          <Cpu className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
          <span>AI / Rule Engine Derived</span>
        </div>
        <h4 className="text-xl font-bold tracking-tight text-[var(--text-primary)] pt-1">
          Packaging Requirements
        </h4>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-xl mx-auto leading-relaxed">
          Based on your product characteristics, storage conditions, shelf-life target, and transportation requirements, the system has determined the packaging performance required for your product.
        </p>
        <div className="pt-2">
          <div className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight">
            {identifiedFood.name || productName || 'Food Product'}
          </div>
          <div className="text-xs font-medium text-[var(--text-muted)] mt-1 flex flex-wrap items-center justify-center gap-2">
            <span className="font-semibold text-[var(--text-secondary)]">
              {identifiedFood.foodGroup || identifiedFood.category || 'Fresh Produce'}
            </span>
            <span>·</span>
            <span className="capitalize">
              {storageCondition === 'ambient' ? 'Ambient' : storageCondition === 'chilled' ? 'Chilled' : 'Frozen'}
            </span>
            <span>·</span>
            <span>{shelfLifeNumber} {shelfLifeUnit}</span>
            <span>·</span>
            <span>
              {transitDistance === 'local' ? 'Local' : transitDistance === 'regional' ? 'Regional' : 'Long Distance'}
            </span>
          </div>
        </div>
      </div>

      <div className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-secondary)] space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
            <span>Food Risk Profile</span>
          </span>
          <span className="text-[11px] text-[var(--text-muted)]">Source Basis</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-2 rounded-lg bg-[var(--bg-card-elevated)] border border-[var(--border-primary)]/60 flex items-center justify-between">
            <span className="text-[var(--text-secondary)]">Moisture Sensitivity:</span>
            <span className="font-bold text-[var(--text-primary)]">{foodRiskProfile.moistureSensitivity.level}</span>
          </div>
          <div className="p-2 rounded-lg bg-[var(--bg-card-elevated)] border border-[var(--border-primary)]/60 flex items-center justify-between">
            <span className="text-[var(--text-secondary)]">Oxygen Sensitivity:</span>
            <span className="font-bold text-[var(--text-primary)]">{foodRiskProfile.oxygenSensitivity.level}</span>
          </div>
          <div className="p-2 rounded-lg bg-[var(--bg-card-elevated)] border border-[var(--border-primary)]/60 flex items-center justify-between">
            <span className="text-[var(--text-secondary)]">Respiration:</span>
            <span className="font-bold text-[var(--text-primary)]">{foodRiskProfile.respiration.level}</span>
          </div>
          <div className="p-2 rounded-lg bg-[var(--bg-card-elevated)] border border-[var(--border-primary)]/60 flex items-center justify-between">
            <span className="text-[var(--text-secondary)]">Microbial Risk:</span>
            <span className="font-bold text-[var(--text-primary)]">{foodRiskProfile.microbialRisk.level}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-[var(--border-secondary)] pb-1.5">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[var(--brand-primary)]" />
            <h5 className="text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">
              Required Packaging Performance
            </h5>
          </div>
          <span className="text-xs text-[var(--text-muted)] font-medium">Performance Metrics</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Oxygen Barrier
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-[var(--badge-completed-bg)] text-[var(--badge-completed-text)] border border-[var(--brand-primary)]/20">
                  {packagingRequirements.oxygenBarrier.level}
                </span>
              </div>
              <VisualLevelIndicator level={packagingRequirements.oxygenBarrier.level} type="three_level" />
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-3 leading-relaxed">
              {packagingRequirements.oxygenBarrier.explanation}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Moisture Barrier
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  {packagingRequirements.moistureBarrier.level}
                </span>
              </div>
              <VisualLevelIndicator level={packagingRequirements.moistureBarrier.level} type="three_level" />
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-3 leading-relaxed">
              {packagingRequirements.moistureBarrier.explanation}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Gas Permeability
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {packagingRequirements.gasPermeability.level}
                </span>
              </div>
              <VisualLevelIndicator level={packagingRequirements.gasPermeability.level} type="gas" />
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-3 leading-relaxed">
              {packagingRequirements.gasPermeability.explanation}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Mechanical Strength
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-[var(--badge-completed-bg)] text-[var(--badge-completed-text)] border border-[var(--brand-primary)]/20">
                  {packagingRequirements.mechanicalStrength.level}
                </span>
              </div>
              <VisualLevelIndicator level={packagingRequirements.mechanicalStrength.level} type="strength" />
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-3 leading-relaxed">
              {packagingRequirements.mechanicalStrength.explanation}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Sealability
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-[var(--badge-completed-bg)] text-[var(--badge-completed-text)] border border-[var(--brand-primary)]/20">
                  {packagingRequirements.sealability.level}
                </span>
              </div>
              <VisualLevelIndicator level={packagingRequirements.sealability.level} type="seal" />
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-3 leading-relaxed">
              {packagingRequirements.sealability.explanation}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  MAP Suitability
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                  {packagingRequirements.mapSuitability.level}
                </span>
              </div>
              <VisualLevelIndicator level={packagingRequirements.mapSuitability.level} type="map" />
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-3 leading-relaxed">
              {packagingRequirements.mapSuitability.explanation}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-secondary)] space-y-1.5">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-[var(--brand-primary)] shrink-0" />
          <h5 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
            Why these requirements?
          </h5>
        </div>
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
          {packagingRequirements.reasoning}
        </p>
      </div>

      <div className="p-4 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] space-y-2.5 shadow-xs">
        <div>
          <h5 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
            Next: Find Suitable Packaging Materials
          </h5>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5 leading-relaxed">
            The system will now compare these requirements against the packaging material database to identify suitable materials and structures.
          </p>
        </div>
        <div className="p-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-secondary)] flex items-center justify-between text-xs text-[var(--text-secondary)]">
          <div className="flex items-center gap-1.5 font-medium text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
            <span>Food Profile</span>
          </div>
          <span className="text-[var(--text-muted)]">→</span>
          <div className="flex items-center gap-1.5 font-semibold text-[var(--brand-primary)] text-[11px]">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Requirements</span>
          </div>
          <span className="text-[var(--text-muted)]">→</span>
          <div className="flex items-center gap-1.5 font-medium text-[11px]">
            <Database className="w-3.5 h-3.5" />
            <span>Material Database</span>
          </div>
          <span className="text-[var(--text-muted)]">→</span>
          <div className="flex items-center gap-1.5 font-medium text-[11px]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Recommendation</span>
          </div>
        </div>
      </div>
    </div>
  );
};
