import React, { useState } from 'react';
import { PieChart as PieChartIcon, ChevronDown } from 'lucide-react';
import { useResizeObserver } from '../hooks/useResizeObserver';

interface CategoryDistributionProps {
  containerWidth?: number;
}

export const CategoryDistribution: React.FC<CategoryDistributionProps> = ({ containerWidth }) => {
  const [containerRef, dimensions] = useResizeObserver<HTMLDivElement>();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [timeRange, setTimeRange] = useState('Last 6 Months');

  // Dynamic width from direct container observer or parent prop
  const effectiveWidth = containerWidth || dimensions.width;
  const isStacked = effectiveWidth > 0 && effectiveWidth < 460;
  const isCompact = effectiveWidth > 0 && effectiveWidth < 340;

  const categories = [
    { name: 'Fruits & Vegetables', percentage: 42, count: 10, color: 'var(--brand-primary)' },
    { name: 'Grains & Pulses', percentage: 20, count: 5, color: 'var(--accent-gold)' },
    { name: 'Dairy Products', percentage: 15, count: 4, color: 'var(--accent-blue)' },
    { name: 'Bakery & Snacks', percentage: 10, count: 2, color: 'var(--accent-pink)' },
    { name: 'Meat & Poultry', percentage: 8, count: 2, color: 'var(--accent-red)' },
    { name: 'Others', percentage: 5, count: 1, color: 'var(--accent-purple)' },
  ];

  // SVG Donut calculation
  const total = categories.reduce((acc, curr) => acc + curr.percentage, 0); // 100
  const size = 200;
  const strokeWidth = 30;
  const radius = 76;
  const circumference = 2 * Math.PI * radius;
  let accumulatedPercent = 0;

  return (
    <div
      ref={containerRef}
      className="min-w-0 w-full overflow-hidden bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-5 sm:p-6 shadow-[var(--shadow-card)] flex flex-col justify-between h-full transition-colors duration-200"
    >
      {/* Header matching screenshot */}
      <div className="flex flex-wrap sm:flex-nowrap min-w-0 items-center justify-between gap-3 pb-3 border-b border-[var(--border-secondary)]">
        <div className="flex min-w-0 items-center gap-2 flex-1">
          <div className="w-7 h-7 rounded-lg bg-[var(--badge-completed-bg)] flex items-center justify-center text-[var(--brand-primary)] shrink-0">
            <PieChartIcon className="w-4 h-4" />
          </div>
          <h3 className="text-[15px] font-bold text-[var(--text-primary)] whitespace-nowrap truncate">
            Category Distribution
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
            <option value="Year to Date">Year to Date</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Donut Chart Visual & Center Stat with dynamic stack switching */}
      <div
        className={`py-4 grid min-w-0 w-full gap-5 sm:gap-6 items-center ${
          isStacked ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'
        }`}
      >
        {/* Donut Column */}
        <div className="flex min-w-0 w-full items-center justify-center overflow-hidden">
          <div
            className={`relative aspect-square w-full transition-all duration-200 ${
              isCompact
                ? 'max-w-[190px]'
                : isStacked
                ? 'max-w-[220px]'
                : 'max-w-[260px]'
            }`}
          >
            <svg
              viewBox={`0 0 ${size} ${size}`}
              className="w-full h-full -rotate-90 transform"
            >
              {categories.map((item, index) => {
                const strokeDasharray = `${(item.percentage / total) * circumference} ${circumference}`;
                const strokeDashoffset = -((accumulatedPercent / total) * circumference);
                accumulatedPercent += item.percentage;
                const isHovered = hoveredIndex === index;

                return (
                  <circle
                    key={item.name}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke={item.color}
                    strokeWidth={isHovered ? strokeWidth + 3 : strokeWidth}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-200 cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />
                );
              })}
            </svg>

            {/* Center text in donut hole */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-2">
              <span
                className={`font-bold text-[var(--text-primary)] leading-none transition-all ${
                  isCompact ? 'text-xl' : 'text-2xl sm:text-3xl'
                }`}
              >
                {hoveredIndex !== null ? `${categories[hoveredIndex].percentage}%` : '42%'}
              </span>
              <span className="text-[11px] sm:text-[12px] font-medium text-[var(--text-secondary)] mt-1 truncate max-w-[85%] text-center">
                {hoveredIndex !== null ? categories[hoveredIndex].name.split(' ')[0] : 'Fruits'}
              </span>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="w-full min-w-0 space-y-2">
          {categories.map((item, idx) => (
            <div
              key={item.name}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`flex min-w-0 items-center justify-between text-xs py-1 px-2 rounded-lg transition-colors cursor-pointer gap-2 ${
                hoveredIndex === idx
                  ? 'bg-[var(--bg-card-elevated)] font-semibold'
                  : 'hover:bg-[var(--bg-card-hover)]'
              }`}
            >
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-[var(--text-primary)] truncate text-[12.5px] font-medium min-w-0">
                  {item.name}
                </span>
              </div>
              <span className="font-bold text-[var(--text-primary)] text-[12.5px] shrink-0 text-right min-w-0">
                {item.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
