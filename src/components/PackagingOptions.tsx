import React from 'react';
import { Sparkles, CheckCircle2, Check, Scale, Leaf, Info } from 'lucide-react';
import {
  PackagingSolutionData,
  PackagingAlternativeItem,
} from './analysis/types';

interface PackagingOptionsProps {
  productName: string;
  selectedOption: 'recommended' | 'alternative' | 'sustainable';
  onSelectOption: (option: 'recommended' | 'alternative' | 'sustainable') => void;
  packagingSolution: PackagingSolutionData;
  primaryAlt: PackagingAlternativeItem;
}

export const PackagingOptions: React.FC<PackagingOptionsProps> = ({
  productName,
  selectedOption,
  onSelectOption,
  packagingSolution,
  primaryAlt,
}) => {
  const sustainable = packagingSolution.sustainableAlternative;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recommended Option */}
        <div
          onClick={() => onSelectOption('recommended')}
          className={`p-4 rounded-2xl bg-[var(--bg-card)] border-2 transition-all flex flex-col justify-between space-y-4 cursor-pointer shadow-sm relative ${
            selectedOption === 'recommended'
              ? 'border-[var(--brand-primary)] ring-2 ring-[var(--brand-primary)]/20'
              : 'border-[var(--border-primary)] hover:border-[var(--brand-primary)]/60'
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[var(--badge-completed-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/30">
                <Check className="w-3 h-3 stroke-[2.5]" />
                <span>Primary Recommendation</span>
              </span>
              <span className="text-[11px] font-bold text-[var(--brand-primary)]">
                Match: {packagingSolution.compatibilityLevel}
              </span>
            </div>

            <div>
              <h5 className="text-base font-bold text-[var(--text-primary)]">
                {packagingSolution.primaryStructure}
              </h5>
              <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed line-clamp-3">
                {packagingSolution.statusExplanation}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-secondary)] space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Oxygen Barrier (OTR):</span>
                <span className="font-semibold text-[var(--text-primary)]">
                  {packagingSolution.specifications.otr.value} {packagingSolution.specifications.otr.unit}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Moisture Barrier (WVTR):</span>
                <span className="font-semibold text-[var(--text-primary)]">
                  {packagingSolution.specifications.wvtr.value} {packagingSolution.specifications.wvtr.unit}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Estimated Cost:</span>
                <span className="font-semibold text-[var(--text-primary)]">
                  {packagingSolution.estimatedCost.costPerPackage || 'Cost data unavailable'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Circularity:</span>
                <span className="font-semibold text-[var(--brand-primary)] truncate max-w-[140px]">
                  {packagingSolution.sustainability.recyclability}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            className={`w-full py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              selectedOption === 'recommended'
                ? 'bg-[var(--brand-primary)] text-[var(--brand-text)]'
                : 'bg-[var(--bg-card-elevated)] text-[var(--text-primary)] border border-[var(--border-primary)] hover:bg-[var(--bg-card-hover)]'
            }`}
          >
            {selectedOption === 'recommended' ? 'Selected Primary' : 'Select Primary'}
          </button>
        </div>

        {/* Alternative Option */}
        <div
          onClick={() => onSelectOption('alternative')}
          className={`p-4 rounded-2xl bg-[var(--bg-card)] border-2 transition-all flex flex-col justify-between space-y-4 cursor-pointer shadow-sm relative ${
            selectedOption === 'alternative'
              ? 'border-[var(--brand-primary)] ring-2 ring-[var(--brand-primary)]/20'
              : 'border-[var(--border-primary)] hover:border-[var(--brand-primary)]/60'
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                <Scale className="w-3 h-3" />
                <span>Alternative Structure</span>
              </span>
              <span className="text-[11px] font-bold text-[var(--text-muted)]">
                Match: {primaryAlt.match}
              </span>
            </div>

            <div>
              <h5 className="text-base font-bold text-[var(--text-primary)]">
                {primaryAlt.name}
              </h5>
              <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed line-clamp-3">
                {primaryAlt.description}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-secondary)] space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Oxygen Barrier (OTR):</span>
                <span className="font-semibold text-[var(--text-primary)]">{primaryAlt.otr}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Moisture Barrier (WVTR):</span>
                <span className="font-semibold text-[var(--text-primary)]">{primaryAlt.wvtr}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Estimated Cost:</span>
                <span className="font-semibold text-[var(--text-primary)]">
                  {primaryAlt.estimatedCost || 'Cost data unavailable'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Circularity:</span>
                <span className="font-semibold text-[var(--text-secondary)] truncate max-w-[140px]">
                  {primaryAlt.recyclability}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            className={`w-full py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              selectedOption === 'alternative'
                ? 'bg-[var(--brand-primary)] text-[var(--brand-text)]'
                : 'bg-[var(--bg-card-elevated)] text-[var(--text-primary)] border border-[var(--border-primary)] hover:bg-[var(--bg-card-hover)]'
            }`}
          >
            {selectedOption === 'alternative' ? 'Selected Alternative' : 'Select Alternative'}
          </button>
        </div>

        {/* Sustainable Option */}
        <div
          onClick={() => onSelectOption('sustainable')}
          className={`p-4 rounded-2xl bg-[var(--bg-card)] border-2 transition-all flex flex-col justify-between space-y-4 cursor-pointer shadow-sm relative ${
            selectedOption === 'sustainable'
              ? 'border-emerald-500 ring-2 ring-emerald-500/20'
              : 'border-[var(--border-primary)] hover:border-emerald-500/60'
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <Leaf className="w-3 h-3" />
                <span>Sustainable Option</span>
              </span>
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                Match: {sustainable.match}
              </span>
            </div>

            <div>
              <h5 className="text-base font-bold text-[var(--text-primary)]">
                {sustainable.name}
              </h5>
              <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed line-clamp-3">
                {sustainable.whyConsider}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-secondary)] space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Material Type:</span>
                <span className="font-semibold text-[var(--text-primary)] truncate max-w-[140px]">
                  {sustainable.materialType}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Recyclability:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 truncate max-w-[140px]">
                  {sustainable.recyclability}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Key Tradeoff:</span>
                <span className="font-medium text-[var(--text-muted)] truncate max-w-[140px]">
                  {sustainable.tradeoffs}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            className={`w-full py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              selectedOption === 'sustainable'
                ? 'bg-emerald-600 text-white'
                : 'bg-[var(--bg-card-elevated)] text-[var(--text-primary)] border border-[var(--border-primary)] hover:bg-[var(--bg-card-hover)]'
            }`}
          >
            {selectedOption === 'sustainable' ? 'Selected Sustainable' : 'Select Sustainable'}
          </button>
        </div>
      </div>
    </div>
  );
};
