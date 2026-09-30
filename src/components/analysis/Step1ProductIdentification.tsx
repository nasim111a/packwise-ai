import React from 'react';
import { Search, ShieldCheck, Check, AlertCircle, ArrowRight } from 'lucide-react';
import { IdentifiedFoodProfile, ProductStateType, RespirationType } from './types';
import { QUICK_COMMODITIES } from './analysisLogic';

interface Step1Props {
  searchTerm: string;
  identifiedFood: IdentifiedFoodProfile;
  isEditing: boolean;
  editableCategory: string;
  editableFoodGroup: string;
  editableProductState: ProductStateType;
  editableRespiration: RespirationType;
  onSearchChange: (val: string) => void;
  onSelectCommodity: (name: string) => void;
  onToggleEdit: () => void;
  onCategoryChange: (val: string) => void;
  onFoodGroupChange: (val: string) => void;
  onProductStateChange: (st: ProductStateType) => void;
  onRespirationChange: (r: RespirationType) => void;
  onConfirmProduct: () => void;
}

export const Step1ProductIdentification: React.FC<Step1Props> = ({
  searchTerm,
  identifiedFood,
  isEditing,
  editableCategory,
  editableFoodGroup,
  editableProductState,
  editableRespiration,
  onSearchChange,
  onSelectCommodity,
  onToggleEdit,
  onCategoryChange,
  onFoodGroupChange,
  onProductStateChange,
  onRespirationChange,
  onConfirmProduct,
}) => {
  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      <div>
        <h4 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
          What are you packaging?
        </h4>
        <p className="text-sm text-[var(--text-secondary)] mt-1.5 leading-relaxed">
          Tell us about your food product. Our AI will identify its category and relevant characteristics automatically.
        </p>
        <div className="inline-flex items-center gap-1.5 text-xs text-[var(--brand-primary)] font-medium mt-2 bg-[var(--badge-completed-bg)] px-2.5 py-1 rounded-md border border-[var(--brand-primary)]/20">
          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
          <span>No technical packaging knowledge required.</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search food commodity..."
            className="w-full pl-10 pr-4 py-3 bg-[var(--bg-input)] border border-[var(--border-primary)] rounded-xl text-sm font-medium text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/20 focus:border-[var(--brand-primary)] transition-all shadow-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-xs text-[var(--text-muted)] pt-0.5">
          <span className="font-medium text-[var(--text-secondary)] mr-0.5">e.g.</span>
          {QUICK_COMMODITIES.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onSelectCommodity(item)}
              className={`px-2.5 py-1 rounded-lg border text-xs transition-colors cursor-pointer ${
                searchTerm.toLowerCase() === item.toLowerCase()
                  ? 'bg-[var(--brand-primary)] text-[var(--brand-text)] border-[var(--brand-primary)] font-medium'
                  : 'bg-[var(--bg-card-elevated)] border-[var(--border-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--brand-primary)]/40 hover:bg-[var(--bg-card-hover)]'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] shadow-xs transition-all duration-200">
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-[var(--border-secondary)]">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Product Identified
          </span>
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${
              identifiedFood.matchStatus === 'Please verify the identified product'
                ? 'bg-[var(--accent-gold-soft)] text-[var(--accent-gold)] border border-[var(--accent-gold)]/20'
                : 'bg-[var(--badge-completed-bg)] text-[var(--badge-completed-text)] border border-[var(--brand-primary)]/20'
            }`}
          >
            {identifiedFood.matchStatus === 'Please verify the identified product' ? (
              <AlertCircle className="w-3.5 h-3.5" />
            ) : (
              <Check className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
            )}
            <span>{identifiedFood.matchStatus}</span>
          </div>
        </div>

        <div className="pt-3 pb-1">
          <div className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
            {identifiedFood.name || searchTerm || 'Commodity'}
          </div>
        </div>

        {identifiedFood.matchStatus === 'Please verify the identified product' && (
          <div className="mt-2 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
                <span>Food profile not found.</span>
              </div>
              <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                Commodity is not in the local seed knowledge base. You can proceed with a generic baseline profile or modify your product input.
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 self-start md:self-auto">
              <button
                type="button"
                onClick={onToggleEdit}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-cta)] bg-[var(--bg-card)] text-[var(--text-primary)] font-medium text-xs cursor-pointer hover:bg-[var(--bg-card-hover)] transition-colors shadow-2xs"
              >
                <span>Modify Product Input</span>
              </button>
              <button
                type="button"
                onClick={onConfirmProduct}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--brand-primary)] text-[var(--brand-text)] font-semibold text-xs cursor-pointer hover:bg-[var(--brand-secondary)] transition-colors shadow-2xs"
              >
                <span>Use Generic Food Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {!isEditing ? (
          <div className="space-y-3.5 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-[var(--bg-card)] border border-[var(--border-secondary)] rounded-xl">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Category
                </div>
                <div className="text-sm font-semibold text-[var(--text-primary)] mt-0.5">
                  {identifiedFood.category}
                </div>
              </div>
              <div className="p-3 bg-[var(--bg-card)] border border-[var(--border-secondary)] rounded-xl">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Food Group
                </div>
                <div className="text-sm font-semibold text-[var(--text-primary)] mt-0.5">
                  {identifiedFood.foodGroup}
                </div>
              </div>
              <div className="p-3 bg-[var(--bg-card)] border border-[var(--border-secondary)] rounded-xl">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Product State
                </div>
                <div className="text-sm font-semibold text-[var(--text-primary)] mt-0.5">
                  {identifiedFood.productState}
                </div>
              </div>
            </div>

            <div className="p-3 bg-[var(--bg-card)] border border-[var(--border-secondary)] rounded-xl flex items-center justify-between">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Respiration
                </div>
                <div className="text-sm font-semibold text-[var(--text-primary)] mt-0.5">
                  {identifiedFood.respiration}
                </div>
              </div>
              <div className="text-[11px] text-[var(--text-muted)] font-medium">
                System-Derived Physiological Trait
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3.5 pt-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={editableCategory}
                  onChange={(e) => onCategoryChange(e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-primary)] rounded-lg text-xs text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                  Food Group
                </label>
                <input
                  type="text"
                  value={editableFoodGroup}
                  onChange={(e) => onFoodGroupChange(e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-primary)] rounded-lg text-xs text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                Product State
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {(['Fresh', 'Processed', 'Dried', 'Frozen', 'Liquid'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => onProductStateChange(st)}
                    className={`py-1.5 px-2 text-xs font-medium rounded-lg border text-center transition-colors cursor-pointer ${
                      editableProductState === st
                        ? 'bg-[var(--brand-primary)] text-[var(--brand-text)] border-[var(--brand-primary)] font-semibold'
                        : 'bg-[var(--bg-card)] border-[var(--border-primary)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                Respiration
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['Active', 'Dormant', 'None', 'Suspended'] as const).map((resp) => (
                  <button
                    key={resp}
                    type="button"
                    onClick={() => onRespirationChange(resp)}
                    className={`py-1.5 px-2 text-xs font-medium rounded-lg border text-center transition-colors cursor-pointer ${
                      editableRespiration === resp
                        ? 'bg-[var(--brand-primary)] text-[var(--brand-text)] border-[var(--brand-primary)] font-semibold'
                        : 'bg-[var(--bg-card)] border-[var(--border-primary)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]'
                    }`}
                  >
                    {resp}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-5 pt-4 border-t border-[var(--border-secondary)] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onToggleEdit}
            className="px-4 py-2 text-xs font-semibold rounded-xl border border-[var(--border-cta)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition-colors cursor-pointer"
          >
            {isEditing ? 'Done Editing' : 'Edit'}
          </button>
          <button
            type="button"
            onClick={onConfirmProduct}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[var(--brand-primary)] text-[var(--brand-text)] hover:bg-[var(--brand-secondary)] text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <span>Confirm Product</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
