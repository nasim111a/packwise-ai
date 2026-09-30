import React from 'react';
import { Sun, Snowflake, MapPin, Truck, Globe, Check, Info, ShieldCheck, ChevronUp, ChevronDown } from 'lucide-react';
import { StorageConditionType, TransitDistanceType, ShelfLifeUnitType } from './types';

const IceCubeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3z" />
    <path d="M12 12 4 7.5" />
    <path d="m12 12 8-4.5" />
    <path d="M12 12v9" />
  </svg>
);

const STORAGE_CONDITION_CARDS = [
  {
    id: 'ambient' as StorageConditionType,
    title: 'Ambient',
    explanation: 'Room-temperature storage',
    examples: ['Pantry', 'Warehouse', 'Normal environment'],
    icon: Sun,
  },
  {
    id: 'chilled' as StorageConditionType,
    title: 'Chilled',
    explanation: 'Refrigerated storage',
    examples: ['Cold room', 'Refrigerator', 'Chilled supply chain'],
    icon: Snowflake,
  },
  {
    id: 'frozen' as StorageConditionType,
    title: 'Frozen',
    explanation: 'Frozen storage',
    examples: ['Freezer', 'Frozen distribution'],
    icon: IceCubeIcon,
  },
];

const TRANSIT_DISTANCE_CARDS = [
  {
    id: 'local' as TransitDistanceType,
    title: 'Local',
    explanation: 'Short-distance transportation',
    examples: ['Local delivery', 'Nearby market'],
    icon: MapPin,
  },
  {
    id: 'regional' as TransitDistanceType,
    title: 'Regional',
    explanation: 'Medium-distance transportation',
    examples: ['Within a region or state'],
    icon: Truck,
  },
  {
    id: 'long_distance' as TransitDistanceType,
    title: 'Long Distance',
    explanation: 'Extended transportation',
    examples: ['Interstate distribution', 'Long-distance logistics'],
    icon: Globe,
  },
];

interface Step3Props {
  storageCondition: StorageConditionType;
  shelfLifeNumber: number;
  shelfLifeUnit: ShelfLifeUnitType;
  transitDistance: TransitDistanceType;
  showAdvancedConditions: boolean;
  customTemperature: string;
  customHumidity: string;
  onStorageConditionChange: (cond: StorageConditionType) => void;
  onShelfLifeNumberChange: (num: number) => void;
  onShelfLifeUnitChange: (unit: ShelfLifeUnitType) => void;
  onTransitDistanceChange: (dist: TransitDistanceType) => void;
  onToggleAdvancedConditions: () => void;
  onCustomTemperatureChange: (val: string) => void;
  onCustomHumidityChange: (val: string) => void;
}

export const Step3StorageTransit: React.FC<Step3Props> = ({
  storageCondition,
  shelfLifeNumber,
  shelfLifeUnit,
  transitDistance,
  showAdvancedConditions,
  customTemperature,
  customHumidity,
  onStorageConditionChange,
  onShelfLifeNumberChange,
  onShelfLifeUnitChange,
  onTransitDistanceChange,
  onToggleAdvancedConditions,
  onCustomTemperatureChange,
  onCustomHumidityChange,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div>
        <h4 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
          How will your product be stored and transported?
        </h4>
        <p className="text-sm text-[var(--text-secondary)] mt-1.5 leading-relaxed">
          Tell us how the product will be stored, how long it needs to last, and how far it will travel. We'll use this information to determine the required packaging protection.
        </p>
        <div className="inline-flex items-center gap-1.5 text-xs text-[var(--brand-primary)] font-medium mt-2 bg-[var(--badge-completed-bg)] px-2.5 py-1 rounded-md border border-[var(--brand-primary)]/20">
          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
          <span>No technical packaging parameters are required.</span>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <h5 className="text-sm font-bold text-[var(--text-primary)]">
            Storage Condition
          </h5>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Where will the product be stored?
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {STORAGE_CONDITION_CARDS.map((card) => {
            const Icon = card.icon;
            const isSelected = storageCondition === card.id;
            return (
              <div
                key={card.id}
                onClick={() => onStorageConditionChange(card.id)}
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
      </div>

      <div className="space-y-3">
        <div>
          <h5 className="text-sm font-bold text-[var(--text-primary)]">
            Target Shelf Life
          </h5>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            How long should the product remain suitable for use?
          </p>
        </div>
        <div className="p-4 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] space-y-2.5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-[var(--text-secondary)] shrink-0 sm:w-28">
                Target shelf life:
              </label>
              <div className="w-24">
                <input
                  type="number"
                  min={1}
                  max={999}
                  value={shelfLifeNumber}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    onShelfLifeNumberChange(isNaN(val) ? 1 : Math.max(1, val));
                  }}
                  className="w-full px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-primary)] rounded-xl text-sm font-bold text-[var(--text-primary)] text-center focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/20 focus:border-[var(--brand-primary)]"
                />
              </div>
              <div className="w-32">
                <select
                  value={shelfLifeUnit}
                  onChange={(e) => onShelfLifeUnitChange(e.target.value as ShelfLifeUnitType)}
                  className="w-full px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-primary)] rounded-xl text-sm font-semibold text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/20 focus:border-[var(--brand-primary)] cursor-pointer"
                >
                  <option value="Days">Days</option>
                  <option value="Weeks">Weeks</option>
                  <option value="Months">Months</option>
                  <option value="Years">Years</option>
                </select>
              </div>
            </div>
            <div className="text-xs text-[var(--text-muted)] sm:ml-auto">
              Desired target for preservation modeling
            </div>
          </div>
          <div className="pt-2 border-t border-[var(--border-secondary)] flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
            <Info className="w-3.5 h-3.5 text-[var(--brand-primary)] shrink-0" />
            <span>The system will use this target when determining packaging requirements.</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <h5 className="text-sm font-bold text-[var(--text-primary)]">
            Transportation
          </h5>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            How far will the packaged product typically travel?
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {TRANSIT_DISTANCE_CARDS.map((card) => {
            const Icon = card.icon;
            const isSelected = transitDistance === card.id;
            return (
              <div
                key={card.id}
                onClick={() => onTransitDistanceChange(card.id)}
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
      </div>

      <div className="pt-1">
        <button
          type="button"
          onClick={onToggleAdvancedConditions}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] py-2 px-3 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] transition-colors cursor-pointer"
        >
          {showAdvancedConditions ? (
            <ChevronUp className="w-4 h-4 text-[var(--brand-primary)]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[var(--brand-primary)]" />
          )}
          <span>Advanced Conditions</span>
          <span className="text-[11px] font-normal text-[var(--text-muted)]">
            {showAdvancedConditions ? '(click to collapse)' : '+ Add additional conditions (optional)'}
          </span>
        </button>

        {showAdvancedConditions && (
          <div className="mt-3 p-4 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-secondary)] space-y-3.5 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Optional Environmental Overrides
              </span>
              <span className="text-[11px] text-[var(--text-muted)]">
                Default: AI derives automatically from food database
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
                  Storage Temperature (°C)
                </label>
                <input
                  type="text"
                  placeholder={
                    storageCondition === 'ambient'
                      ? 'e.g. 20°C (default)'
                      : storageCondition === 'chilled'
                      ? 'e.g. 3°C (default)'
                      : 'e.g. -18°C (default)'
                  }
                  value={customTemperature}
                  onChange={(e) => onCustomTemperatureChange(e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-primary)] rounded-lg text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
                />
                <span className="text-[11px] text-[var(--text-muted)] mt-1 block">
                  Optional specific temperature setpoint if non-standard
                </span>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
                  Relative Humidity (%)
                </label>
                <input
                  type="text"
                  placeholder={
                    storageCondition === 'ambient'
                      ? 'e.g. 50% RH (default)'
                      : storageCondition === 'chilled'
                      ? 'e.g. 90% RH (default)'
                      : 'e.g. 70% RH (default)'
                  }
                  value={customHumidity}
                  onChange={(e) => onCustomHumidityChange(e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-primary)] rounded-lg text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
                />
                <span className="text-[11px] text-[var(--text-muted)] mt-1 block">
                  Optional ambient moisture target
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
