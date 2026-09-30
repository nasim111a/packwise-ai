import React, { useState } from 'react';
import { Layers, ChevronDown } from 'lucide-react';
import { TOP_MATERIALS } from '../data/mockPackagingData';
import { useResizeObserver } from '../hooks/useResizeObserver';

interface TopMaterialsRecommendedProps {
  containerWidth?: number;
}

export const TopMaterialsRecommended: React.FC<TopMaterialsRecommendedProps> = ({ containerWidth }) => {
  const [containerRef, dimensions] = useResizeObserver<HTMLDivElement>();
  const [timeRange, setTimeRange] = useState('Last 6 Months');
  const effectiveWidth = containerWidth || dimensions.width;
  const isNarrow = effectiveWidth > 0 && effectiveWidth < 350;

  return (
    <div
      ref={containerRef}
      className="min-w-0 w-full overflow-hidden bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-5 sm:p-6 shadow-[var(--shadow-card)] flex flex-col justify-between transition-colors duration-200"
    >
      {/* Header matching screenshot */}
      <div className="flex min-w-0 items-center justify-between pb-3 border-b border-[var(--border-secondary)] gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[var(--badge-completed-bg)] flex items-center justify-center text-[var(--brand-primary)] shrink-0">
            <Layers className="w-4 h-4" />
          </div>
          <h3 className="text-[15px] font-bold text-[var(--text-primary)] truncate sm:whitespace-nowrap">
            Top Materials Recommended
          </h3>
        </div>

        {/* Dropdown matching screenshot */}
        <div className="relative shrink-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="appearance-none bg-[var(--bg-card-elevated)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-primary)] text-[var(--text-primary)] text-xs font-semibold py-1.5 pl-3 pr-8 rounded-lg cursor-pointer focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] transition-colors"
          >
            <option value="Last 6 Months">Last 6 Months</option>
            <option value="Last 3 Months">Last 3 Months</option>
            <option value="All Time">All Time</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Progress Bars */}
      <div className="py-4 space-y-4 min-w-0 w-full">
        {TOP_MATERIALS.map((mat) => (
          <div key={mat.name} className="flex min-w-0 items-center justify-between gap-3 text-xs">
            <span
              className={`font-medium text-[var(--text-primary)] text-[13px] shrink-0 truncate transition-all ${
                isNarrow ? 'w-24 sm:w-28' : 'w-28 sm:w-36'
              }`}
            >
              {mat.name}
            </span>

            {/* Track and Bar */}
            <div className="min-w-0 flex-1 h-3 bg-[var(--chart-track)] rounded-full overflow-hidden flex">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out bg-[var(--brand-primary)]"
                style={{
                  width: `${mat.percentage}%`,
                }}
              />
            </div>

            <span className="font-bold text-[var(--text-primary)] text-[13px] w-10 text-right shrink-0">
              {mat.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
