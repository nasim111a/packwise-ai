import React, { useState } from 'react';
import { BarChart3, ChevronDown } from 'lucide-react';
import { ANALYSIS_TRENDS_DATA } from '../data/mockPackagingData';
import { useResizeObserver } from '../hooks/useResizeObserver';

interface AnalysisTrendsProps {
  containerWidth?: number;
}

export const AnalysisTrends: React.FC<AnalysisTrendsProps> = ({ containerWidth }) => {
  const [containerRef, dimensions] = useResizeObserver<HTMLDivElement>();
  const [timeRange, setTimeRange] = useState<'Last 6 Months' | 'Last 3 Months' | 'Year to Date'>('Last 6 Months');
  const [hoveredMonth, setHoveredMonth] = useState<string | null>(null);

  // Dynamic width from either direct container observer or parent prop
  const effectiveWidth = containerWidth || dimensions.width;
  const isUltraCompact = effectiveWidth > 0 && effectiveWidth < 310;
  const isNarrow = effectiveWidth > 0 && effectiveWidth < 380;

  const data = ANALYSIS_TRENDS_DATA[timeRange] || ANALYSIS_TRENDS_DATA['Last 6 Months'];
  const maxCount = 15;

  return (
    <div
      ref={containerRef}
      className="min-w-0 w-full overflow-hidden bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-5 sm:p-6 shadow-[var(--shadow-card)] flex flex-col justify-between transition-colors duration-200"
    >
      {/* Header matching screenshot */}
      <div className="flex min-w-0 items-center justify-between pb-3 border-b border-[var(--border-secondary)] gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[var(--badge-completed-bg)] flex items-center justify-center text-[var(--brand-primary)] shrink-0">
            <BarChart3 className="w-4 h-4" />
          </div>
          <h3 className="text-[15px] font-bold text-[var(--text-primary)] truncate sm:whitespace-nowrap">
            Analysis Trends
          </h3>
        </div>

        {/* Dropdown matching screenshot */}
        <div className="relative shrink-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="appearance-none bg-[var(--bg-card-elevated)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-primary)] text-[var(--text-primary)] text-xs font-semibold py-1.5 pl-3 pr-8 rounded-lg cursor-pointer focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] transition-colors"
          >
            <option value="Last 6 Months">Last 6 Months</option>
            <option value="Last 3 Months">Last 3 Months</option>
            <option value="Year to Date">Year to Date</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Bar Chart Area with dynamically adapting scales & gutters based on ResizeObserver */}
      <div className="pt-6 pb-2 min-w-0 w-full overflow-hidden">
        <div
          className={`relative h-44 flex items-end justify-between gap-1.5 sm:gap-3 pr-2 sm:pr-4 min-w-0 w-full ${
            isUltraCompact ? 'pl-6' : isNarrow ? 'pl-7' : 'pl-8'
          }`}
        >
          {/* Y-Axis numbers matching screenshot */}
          <div className="absolute left-0 inset-y-0 flex flex-col justify-between text-[11px] font-mono text-[var(--text-muted)] select-none pointer-events-none">
            <span>15</span>
            <span>10</span>
            <span>5</span>
            <span>0</span>
          </div>

          {/* Subtle horizontal grid lines */}
          <div
            className={`absolute right-0 inset-y-0 flex flex-col justify-between pointer-events-none z-0 ${
              isUltraCompact ? 'left-5' : isNarrow ? 'left-6' : 'left-7'
            }`}
          >
            <div className="w-full border-b border-[var(--chart-grid)]"></div>
            <div className="w-full border-b border-[var(--chart-grid)]"></div>
            <div className="w-full border-b border-[var(--chart-grid)]"></div>
            <div className="w-full border-b border-[var(--border-primary)]"></div>
          </div>

          {/* Bars */}
          {data.map((item) => {
            const heightPercent = Math.min((item.count / maxCount) * 100, 100);
            const isHovered = hoveredMonth === item.month;
            const barColor = 'var(--brand-primary)';

            // Dynamically adjust label formatting based on container width
            const displayLabel = isUltraCompact
              ? item.month.slice(0, 1)
              : isNarrow
              ? item.month.slice(0, 3)
              : item.month;

            return (
              <div
                key={item.month}
                className="relative flex-1 flex flex-col items-center h-full justify-end group cursor-pointer z-10"
                onMouseEnter={() => setHoveredMonth(item.month)}
                onMouseLeave={() => setHoveredMonth(null)}
              >
                {/* Hover Tooltip */}
                {isHovered && (
                  <div className="absolute -top-10 bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] text-[var(--text-primary)] text-[11px] font-medium py-1 px-2 rounded-md shadow-lg whitespace-nowrap z-20 pointer-events-none animate-in fade-in duration-100">
                    <span className="font-bold text-[var(--brand-primary)]">{item.count} analyses</span>
                  </div>
                )}

                {/* Bar element dynamically scaling max-width */}
                <div
                  className={`w-full rounded-t-md transition-all duration-200 group-hover:scale-y-[1.03] origin-bottom shadow-xs ${
                    isUltraCompact
                      ? 'max-w-[18px]'
                      : isNarrow
                      ? 'max-w-[24px]'
                      : 'max-w-[34px]'
                  }`}
                  style={{
                    height: `${heightPercent}%`,
                    backgroundColor: barColor,
                  }}
                />

                {/* X-axis Label */}
                <span
                  className={`text-[11.5px] mt-2.5 font-medium transition-colors ${
                    isHovered ? 'text-[var(--brand-primary)] font-bold' : 'text-[var(--text-muted)]'
                  }`}
                >
                  {displayLabel}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
