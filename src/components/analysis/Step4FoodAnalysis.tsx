import React from 'react';
import {
  Sparkles,
  RotateCw,
  CheckCircle2,
  AlertCircle,
  SlidersHorizontal,
  Database,
  Cpu,
  ShieldCheck,
  Activity,
  ChevronUp,
  ChevronDown,
  Info,
} from 'lucide-react';
import {
  IdentifiedFoodProfile,
  FoodRiskProfileData,
  StorageConditionType,
  TransitDistanceType,
  ShelfLifeUnitType,
  AnalysisStage,
  RiskLevel,
} from './types';

interface Step4Props {
  identifiedFood: IdentifiedFoodProfile;
  productName: string;
  storageCondition: StorageConditionType;
  shelfLifeNumber: number;
  shelfLifeUnit: ShelfLifeUnitType;
  transitDistance: TransitDistanceType;
  analysisStage: AnalysisStage;
  foodRiskProfile: FoodRiskProfileData;
  showAnalysisBasis: boolean;
  onToggleAnalysisBasis: () => void;
  onRetry?: () => void;
}

function getRiskBadge(level: RiskLevel) {
  switch (level) {
    case 'HIGH':
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
          High
        </span>
      );
    case 'MEDIUM':
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
          Medium
        </span>
      );
    case 'LOW':
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-[var(--badge-completed-bg)] text-[var(--badge-completed-text)] border border-[var(--brand-primary)]/20">
          Low
        </span>
      );
    case 'NONE':
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border-secondary)]">
          None
        </span>
      );
  }
}

export const Step4FoodAnalysis: React.FC<Step4Props> = ({
  identifiedFood,
  productName,
  storageCondition,
  shelfLifeNumber,
  shelfLifeUnit,
  transitDistance,
  analysisStage,
  foodRiskProfile,
  showAnalysisBasis,
  onToggleAnalysisBasis,
  onRetry,
}) => {
  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div className="text-center space-y-1.5 pb-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--badge-completed-bg)] text-[var(--badge-completed-text)] text-xs font-bold tracking-wide uppercase border border-[var(--brand-primary)]/20">
          <Sparkles className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
          <span>AI Food Analysis</span>
        </div>
        <h4 className="text-xl font-bold tracking-tight text-[var(--text-primary)] pt-1">
          AI Food Analysis
        </h4>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-lg mx-auto leading-relaxed">
          Analyzing your product and environmental conditions to determine its packaging requirements.
        </p>
        <div className="pt-2">
          <div className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight">
            Analyzing {identifiedFood.name || productName || 'Food Product'}
          </div>
          <div className="text-xs font-medium text-[var(--text-muted)] mt-1 flex flex-wrap items-center justify-center gap-2">
            <span className="font-semibold text-[var(--text-secondary)]">
              {identifiedFood.category || 'Fresh Produce'}
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

      <div className="p-4 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-secondary)]">
            {analysisStage === 'identifying' ? (
              <RotateCw className="w-4 h-4 text-[var(--brand-primary)] animate-spin shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-[var(--brand-primary)] shrink-0" />
            )}
            <span
              className={`font-semibold ${
                analysisStage === 'identifying'
                  ? 'text-[var(--brand-primary)]'
                  : 'text-[var(--text-primary)]'
              }`}
            >
              1. Analyzing food characteristics...
            </span>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-secondary)]">
            {analysisStage === 'identifying' ? (
              <div className="w-4 h-4 rounded-full border border-[var(--border-cta)] bg-[var(--bg-card)] shrink-0" />
            ) : analysisStage === 'analyzing_storage' ? (
              <RotateCw className="w-4 h-4 text-[var(--brand-primary)] animate-spin shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-[var(--brand-primary)] shrink-0" />
            )}
            <span
              className={`font-semibold ${
                analysisStage === 'identifying'
                  ? 'text-[var(--text-muted)]'
                  : analysisStage === 'analyzing_storage'
                  ? 'text-[var(--brand-primary)]'
                  : 'text-[var(--text-primary)]'
              }`}
            >
              2. Determining packaging requirements...
            </span>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-secondary)]">
            {analysisStage === 'identifying' || analysisStage === 'analyzing_storage' ? (
              <div className="w-4 h-4 rounded-full border border-[var(--border-cta)] bg-[var(--bg-card)] shrink-0" />
            ) : analysisStage === 'analyzing_transport' ? (
              <RotateCw className="w-4 h-4 text-[var(--brand-primary)] animate-spin shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-[var(--brand-primary)] shrink-0" />
            )}
            <span
              className={`font-semibold ${
                analysisStage === 'identifying' || analysisStage === 'analyzing_storage'
                  ? 'text-[var(--text-muted)]'
                  : analysisStage === 'analyzing_transport'
                  ? 'text-[var(--brand-primary)]'
                  : 'text-[var(--text-primary)]'
              }`}
            >
              3. Matching packaging materials...
            </span>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-secondary)]">
            {analysisStage === 'completed' ? (
              <CheckCircle2 className="w-4 h-4 text-[var(--brand-primary)] shrink-0" />
            ) : analysisStage === 'building_risk_profile' ? (
              <RotateCw className="w-4 h-4 text-[var(--brand-primary)] animate-spin shrink-0" />
            ) : (
              <div className="w-4 h-4 rounded-full border border-[var(--border-cta)] bg-[var(--bg-card)] shrink-0" />
            )}
            <span
              className={`font-semibold ${
                analysisStage === 'completed'
                  ? 'text-[var(--text-primary)]'
                  : analysisStage === 'building_risk_profile'
                  ? 'text-[var(--brand-primary)]'
                  : 'text-[var(--text-muted)]'
              }`}
            >
              4. Generating recommendation...
            </span>
          </div>
        </div>
      </div>

      <div className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-secondary)]">
        <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2.5 text-center">
          Scientific Deduction Pipeline
        </div>
        <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] px-1 sm:px-4">
          <div className="flex flex-col items-center gap-1 text-center">
            <div className="w-7 h-7 rounded-lg bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] flex items-center justify-center text-[var(--text-primary)]">
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-medium">User Inputs</span>
          </div>
          <div className="h-px flex-1 bg-[var(--border-primary)] mx-2 relative">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 border-t border-r border-[var(--border-cta)] rotate-45" />
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <div className="w-7 h-7 rounded-lg bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] flex items-center justify-center text-[var(--text-primary)]">
              <Database className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-medium">Food Database</span>
          </div>
          <div className="h-px flex-1 bg-[var(--border-primary)] mx-2 relative">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 border-t border-r border-[var(--border-cta)] rotate-45" />
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <div className="w-7 h-7 rounded-lg bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] flex items-center justify-center text-[var(--brand-primary)]">
              <Cpu className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-medium">AI Analysis</span>
          </div>
          <div className="h-px flex-1 bg-[var(--border-primary)] mx-2 relative">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 border-t border-r border-[var(--border-cta)] rotate-45" />
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <div className="w-7 h-7 rounded-lg bg-[var(--badge-completed-bg)] border border-[var(--brand-primary)]/20 flex items-center justify-center text-[var(--brand-primary)]">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-bold text-[var(--text-primary)]">Risk Profile</span>
          </div>
        </div>
      </div>

      {analysisStage === 'completed' ? (
        <div className="space-y-4 pt-1 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-1 border-b border-[var(--border-secondary)]">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[var(--brand-primary)]" />
              <h5 className="text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">
                Food Risk Profile
              </h5>
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-md bg-[var(--badge-completed-bg)] text-[var(--badge-completed-text)] border border-[var(--brand-primary)]/20">
              <ShieldCheck className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
              <span>AI / Database Derived</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    Moisture Sensitivity
                  </span>
                  {getRiskBadge(foodRiskProfile.moistureSensitivity.level)}
                </div>
                <div className="text-base font-bold text-[var(--text-primary)] mt-1.5">
                  {foodRiskProfile.moistureSensitivity.level}
                </div>
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-2 leading-relaxed">
                {foodRiskProfile.moistureSensitivity.explanation}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    Oxygen Sensitivity
                  </span>
                  {getRiskBadge(foodRiskProfile.oxygenSensitivity.level)}
                </div>
                <div className="text-base font-bold text-[var(--text-primary)] mt-1.5">
                  {foodRiskProfile.oxygenSensitivity.level}
                </div>
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-2 leading-relaxed">
                {foodRiskProfile.oxygenSensitivity.explanation}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    Respiration
                  </span>
                  {getRiskBadge(foodRiskProfile.respiration.level)}
                </div>
                <div className="text-base font-bold text-[var(--text-primary)] mt-1.5">
                  {foodRiskProfile.respiration.level}
                </div>
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-2 leading-relaxed">
                {foodRiskProfile.respiration.explanation}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    Microbial Risk
                  </span>
                  {getRiskBadge(foodRiskProfile.microbialRisk.level)}
                </div>
                <div className="text-base font-bold text-[var(--text-primary)] mt-1.5">
                  {foodRiskProfile.microbialRisk.level}
                </div>
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-2 leading-relaxed">
                {foodRiskProfile.microbialRisk.explanation}
              </p>
            </div>
          </div>

          <div className="pt-0.5">
            <button
              type="button"
              onClick={onToggleAnalysisBasis}
              className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] py-1.5 px-2.5 rounded-lg hover:bg-[var(--bg-card-hover)] transition-colors cursor-pointer"
            >
              {showAnalysisBasis ? (
                <ChevronUp className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
              )}
              <span>Analysis Basis</span>
              <span className="text-[11px] font-normal text-[var(--text-muted)]">
                {showAnalysisBasis ? '(click to collapse)' : '(click to view parameters & sources)'}
              </span>
            </button>
            {showAnalysisBasis && (
              <div className="mt-2 p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-secondary)] text-xs space-y-2 animate-in fade-in duration-150">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[var(--text-muted)]">Food identity:</span>{' '}
                    <span className="font-semibold text-[var(--text-primary)]">
                      {identifiedFood.name || productName || 'Food Product'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)]">Food category:</span>{' '}
                    <span className="font-semibold text-[var(--text-primary)]">
                      {identifiedFood.foodGroup || identifiedFood.category || 'Fresh Produce'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)]">Storage:</span>{' '}
                    <span className="font-semibold text-[var(--text-primary)] capitalize">
                      {storageCondition === 'ambient' ? 'Ambient' : storageCondition === 'chilled' ? 'Chilled' : 'Frozen'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)]">Target shelf life:</span>{' '}
                    <span className="font-semibold text-[var(--text-primary)]">
                      {shelfLifeNumber} {shelfLifeUnit}
                    </span>
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)]">Transportation:</span>{' '}
                    <span className="font-semibold text-[var(--text-primary)]">
                      {transitDistance === 'local' ? 'Local' : transitDistance === 'regional' ? 'Regional' : 'Long Distance'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)]">Source:</span>{' '}
                    <span className="font-semibold text-[var(--text-primary)]">
                      Food knowledge base + AI analysis
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-[var(--text-muted)] pt-1.5 border-t border-[var(--border-secondary)]">
                  Database parameters ground biological and moisture decay vectors before packaging translation.
                </p>
              </div>
            )}
          </div>

          <div className="p-4 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] space-y-1.5 shadow-xs">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-[var(--brand-primary)] shrink-0" />
              <h5 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                What this means for packaging
              </h5>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {foodRiskProfile.packagingImplication}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[var(--badge-completed-bg)] border border-[var(--brand-primary)]/20 flex items-center justify-between text-xs text-[var(--text-primary)]">
            <div className="flex items-center gap-2 font-semibold text-[var(--brand-primary)]">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Recommendation Generated</span>
            </div>
            <span className="text-[11px] text-[var(--text-muted)] font-medium">
              Deterministic rule engine completed
            </span>
          </div>
        </div>
      ) : analysisStage === 'error' ? (
        <div className="p-6 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center space-y-3">
          <div className="flex items-center justify-center gap-2 font-bold text-amber-800 dark:text-amber-300 text-sm">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <span>Unable to generate recommendation</span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed">
            The deterministic engine encountered an issue matching packaging requirements. Please try again.
          </p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="px-4 py-2 rounded-xl bg-[var(--brand-primary)] text-[var(--brand-text)] text-xs font-semibold hover:bg-[var(--brand-secondary)] cursor-pointer transition-colors shadow-2xs"
            >
              Try Again
            </button>
          )}
        </div>
      ) : (
        <div className="p-6 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] text-center space-y-2">
          <RotateCw className="w-5 h-5 text-[var(--brand-primary)] animate-spin mx-auto" />
          <div className="text-xs font-bold text-[var(--text-primary)]">
            {analysisStage === 'identifying' && 'Analyzing food characteristics...'}
            {analysisStage === 'analyzing_storage' && 'Determining packaging requirements...'}
            {analysisStage === 'analyzing_transport' && 'Matching packaging materials...'}
            {analysisStage === 'building_risk_profile' && 'Generating recommendation...'}
          </div>
          <div className="text-[11px] text-[var(--text-muted)]">
            Cross-referencing local food database parameters with target conditions
          </div>
        </div>
      )}
    </div>
  );
};
