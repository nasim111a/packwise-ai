import React from 'react';
import { Package, Leaf, Clock, CheckCircle2, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface KpiItemProps {
  id: string;
  label: string;
  value: number;
  trend: string;
  trendPositive: boolean | 'neutral';
  iconType: 'package' | 'leaf' | 'clock' | 'check';
  sparklineBars: number[];
  color: string;
  darkColor?: string;
  bgColor?: string;
  darkBgColor?: string;
}

export const KpiCard: React.FC<KpiItemProps> = ({
  label,
  value,
  trend,
  trendPositive,
  iconType,
  sparklineBars,
}) => {
  const getIcon = () => {
    switch (iconType) {
      case 'package':
        return <Package className="w-5 h-5" />;
      case 'leaf':
        return <Leaf className="w-5 h-5" />;
      case 'clock':
        return <Clock className="w-5 h-5" />;
      case 'check':
        return <CheckCircle2 className="w-5 h-5" />;
    }
  };

  const isGold = trendPositive === 'neutral' || iconType === 'clock';

  return (
    <div className="min-w-0 w-full overflow-hidden bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl sm:rounded-2xl p-2.5 sm:p-5 flex flex-col justify-between shadow-[var(--shadow-card)] hover:border-[var(--border-secondary)] transition-all duration-200">
      {/* Top row: Icon container (left) & Trend indicator (right) */}
      <div className="flex min-w-0 items-center justify-between gap-1 sm:gap-2">
        <div
          className={`w-7 h-7 sm:w-11 sm:h-11 rounded-full flex items-center justify-center border transition-colors shrink-0 ${
            isGold
              ? 'bg-[var(--accent-gold-soft)] border-[var(--accent-gold)]/30 text-[var(--accent-gold)]'
              : 'bg-[var(--badge-completed-bg)] border-[var(--brand-primary)]/30 text-[var(--brand-primary)]'
          }`}
        >
          {getIcon()}
        </div>

        {/* Top-right Trend indicator */}
        <div className="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-[12px] font-bold shrink-0">
          {trendPositive === true && (
            <span className="flex items-center gap-0.5 text-[var(--brand-primary)]">
              <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
              <span className="truncate">{trend}</span>
            </span>
          )}
          {trendPositive === false && (
            <span className="text-[var(--accent-red)] flex items-center gap-0.5">
              <TrendingDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
              <span className="truncate">{trend}</span>
            </span>
          )}
          {trendPositive === 'neutral' && (
            <span className="text-[var(--accent-gold)] flex items-center gap-0.5">
              <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
              <span className="truncate">{trend}</span>
            </span>
          )}
        </div>
      </div>

      {/* Bottom row: Large stat & label (left) + 5 vertical sparkline bars (right) */}
      <div className="mt-2.5 sm:mt-4 flex min-w-0 items-end justify-between gap-1 sm:gap-2">
        <div className="min-w-0 flex-1">
          <div className="text-lg sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight leading-none truncate">
            {value}
          </div>
          <div className="text-[10px] sm:text-[12.5px] font-medium text-[var(--text-secondary)] mt-1 sm:mt-1.5 truncate">
            {label}
          </div>
        </div>

        {/* Mini 5-bar vertical sparkline in bottom-right */}
        <div className="hidden xs:flex items-end gap-0.5 sm:gap-1 h-4 sm:h-6 pb-0.5 shrink-0">
          {sparklineBars.slice(0, 5).map((height, idx) => (
            <span
              key={idx}
              className="w-0.5 sm:w-1 rounded-sm transition-all"
              style={{
                height: `${height}%`,
                backgroundColor: isGold
                  ? 'var(--accent-gold)'
                  : 'var(--brand-primary)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
