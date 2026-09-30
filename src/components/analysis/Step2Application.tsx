import React from 'react';
import { Warehouse, Truck, Store, Globe, Check, Info } from 'lucide-react';
import { ApplicationType } from './types';

interface AppCardConfig {
  id: ApplicationType;
  title: string;
  explanation: string;
  examples: string[];
  icon: React.ComponentType<{ className?: string }>;
}

const APPLICATION_CARDS: AppCardConfig[] = [
  {
    id: 'storage',
    title: 'Storage',
    explanation: 'Keep the product protected during storage.',
    examples: ['Warehouse', 'Cold storage', 'Long-term storage'],
    icon: Warehouse,
  },
  {
    id: 'transportation',
    title: 'Transportation',
    explanation: 'Protect the product while it is being moved or distributed.',
    examples: ['Local transport', 'Regional distribution', 'Long-distance transportation'],
    icon: Truck,
  },
  {
    id: 'retail',
    title: 'Retail',
    explanation: 'Prepare the product for retail display and consumer handling.',
    examples: ['Store shelves', 'Retail display', 'Consumer-facing packaging'],
    icon: Store,
  },
  {
    id: 'export',
    title: 'Export',
    explanation: 'Prepare the product for longer-distance or international distribution.',
    examples: ['Export logistics', 'Extended transportation', 'International distribution'],
    icon: Globe,
  },
];

interface Step2Props {
  selectedApps: ApplicationType[];
  transportDistance: 'Local' | 'Regional' | 'Long Distance';
  exportDistance: 'Regional' | 'International';
  onToggleApplication: (id: ApplicationType) => void;
  onTransportDistanceChange: (dist: 'Local' | 'Regional' | 'Long Distance') => void;
  onExportDistanceChange: (dist: 'Regional' | 'International') => void;
}

export const Step2Application: React.FC<Step2Props> = ({
  selectedApps,
  transportDistance,
  exportDistance,
  onToggleApplication,
  onTransportDistanceChange,
  onExportDistanceChange,
}) => {
  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      <div>
        <h4 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
          Where will this packaging be used?
        </h4>
        <p className="text-sm text-[var(--text-secondary)] mt-1.5 leading-relaxed">
          Select all situations that apply. Your choices will help us determine the packaging requirements for storage, handling, distribution, and market use.
        </p>
        <div className="text-xs text-[var(--brand-primary)] font-medium mt-1.5 flex items-center gap-1">
          <span>You can select more than one option.</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {APPLICATION_CARDS.map((card) => {
          const Icon = card.icon;
          const isSelected = selectedApps.includes(card.id);
          return (
            <div
              key={card.id}
              onClick={() => onToggleApplication(card.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer relative text-left select-none ${
                isSelected
                  ? 'border-[var(--brand-primary)] bg-[var(--badge-completed-bg)] shadow-xs ring-1 ring-[var(--brand-primary)]/25'
                  : 'border-[var(--border-primary)] bg-[var(--bg-card)] hover:border-[var(--border-cta)] hover:bg-[var(--bg-card-hover)]'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    isSelected
                      ? 'bg-[var(--brand-primary)] text-[var(--brand-text)]'
                      : 'bg-[var(--bg-card-elevated)] text-[var(--text-secondary)]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors shrink-0 ${
                    isSelected
                      ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)] text-[var(--brand-text)]'
                      : 'border-[var(--border-cta)] bg-[var(--bg-card)] text-transparent'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-sm font-bold text-[var(--text-primary)]">
                  {card.title}
                </div>
                <div className="text-xs text-[var(--text-secondary)] mt-0.5 leading-snug">
                  {card.explanation}
                </div>
                <div className="mt-2.5 flex flex-wrap gap-1 text-[11px] text-[var(--text-muted)]">
                  {card.examples.map((ex) => (
                    <span
                      key={ex}
                      className="px-1.5 py-0.5 rounded bg-[var(--bg-card-elevated)] border border-[var(--border-primary)]/60"
                    >
                      {ex}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-3">
        {selectedApps.includes('transportation') && (
          <div className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-secondary)] space-y-2 animate-in fade-in duration-150">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-primary)]">
              <Truck className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
              <span>Transportation Distance</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['Local', 'Regional', 'Long Distance'] as const).map((dist) => (
                <button
                  key={dist}
                  type="button"
                  onClick={() => onTransportDistanceChange(dist)}
                  className={`py-1.5 px-2.5 rounded-lg text-xs font-medium border text-center transition-colors cursor-pointer ${
                    transportDistance === dist
                      ? 'bg-[var(--brand-primary)] text-[var(--brand-text)] border-[var(--brand-primary)] font-semibold'
                      : 'bg-[var(--bg-card-elevated)] border-[var(--border-primary)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]'
                  }`}
                >
                  {dist}
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedApps.includes('export') && (
          <div className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-secondary)] space-y-2 animate-in fade-in duration-150">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-primary)]">
              <Globe className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
              <span>Distribution Distance</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(['Regional', 'International'] as const).map((dist) => (
                <button
                  key={dist}
                  type="button"
                  onClick={() => onExportDistanceChange(dist)}
                  className={`py-1.5 px-2.5 rounded-lg text-xs font-medium border text-center transition-colors cursor-pointer ${
                    exportDistance === dist
                      ? 'bg-[var(--brand-primary)] text-[var(--brand-text)] border-[var(--brand-primary)] font-semibold'
                      : 'bg-[var(--bg-card-elevated)] border-[var(--border-primary)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]'
                  }`}
                >
                  {dist}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-secondary)] space-y-2">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-[var(--brand-primary)] shrink-0" />
          <h5 className="text-xs font-bold text-[var(--text-primary)]">
            Why does this matter?
          </h5>
        </div>
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
          Different usage conditions require different packaging performance:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
          <div className="p-2 rounded-lg bg-[var(--bg-card-elevated)] border border-[var(--border-primary)]/60">
            <span className="font-semibold text-[var(--text-primary)]">Storage:</span>{' '}
            <span className="text-[var(--text-secondary)]">Shelf-life + barrier protection</span>
          </div>
          <div className="p-2 rounded-lg bg-[var(--bg-card-elevated)] border border-[var(--border-primary)]/60">
            <span className="font-semibold text-[var(--text-primary)]">Transportation:</span>{' '}
            <span className="text-[var(--text-secondary)]">Mechanical strength + handling protection</span>
          </div>
          <div className="p-2 rounded-lg bg-[var(--bg-card-elevated)] border border-[var(--border-primary)]/60">
            <span className="font-semibold text-[var(--text-primary)]">Retail:</span>{' '}
            <span className="text-[var(--text-secondary)]">Appearance + product protection</span>
          </div>
          <div className="p-2 rounded-lg bg-[var(--bg-card-elevated)] border border-[var(--border-primary)]/60">
            <span className="font-semibold text-[var(--text-primary)]">Export:</span>{' '}
            <span className="text-[var(--text-secondary)]">Long-distance durability + climate resilience</span>
          </div>
        </div>
      </div>
    </div>
  );
};
