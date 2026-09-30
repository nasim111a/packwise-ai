import React from 'react';
import {
  Plus,
  Database,
  BookOpen,
  FileText,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { NavItemKey } from './Sidebar';

interface QuickActionsProps {
  onSelectAction: (key: NavItemKey) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onSelectAction }) => {
  const actions = [
    {
      id: 'new_analysis' as NavItemKey,
      title: 'New Analysis',
      desc: 'Start a packaging analysis',
      icon: Plus,
      color: 'var(--brand-primary)',
      bgIcon: 'var(--badge-completed-bg)',
      iconBorder: 'var(--brand-primary)',
    },
    {
      id: 'food_database' as NavItemKey,
      title: 'Food Database',
      desc: 'Browse food profiles',
      icon: Database,
      color: 'var(--accent-blue)',
      bgIcon: 'var(--accent-blue-soft)',
      iconBorder: 'var(--accent-blue)',
    },
    {
      id: 'knowledge_base' as NavItemKey,
      title: 'Knowledge Base',
      desc: 'Learn about materials',
      icon: BookOpen,
      color: 'var(--accent-purple)',
      bgIcon: 'var(--accent-purple-soft)',
      iconBorder: 'var(--accent-purple)',
    },
    {
      id: 'reports' as NavItemKey,
      title: 'View Reports',
      desc: 'Download analysis reports',
      icon: FileText,
      color: 'var(--accent-gold)',
      bgIcon: 'var(--accent-gold-soft)',
      iconBorder: 'var(--accent-gold)',
    },
  ];

  return (
    <div className="min-w-0 w-full overflow-hidden bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-5 sm:p-6 shadow-[var(--shadow-card)] flex flex-col justify-between transition-colors duration-200">
      {/* Header matching screenshot */}
      <div className="flex min-w-0 items-center gap-2 pb-3 border-b border-[var(--border-secondary)]">
        <Zap className="w-4 h-4 text-[var(--brand-primary)] fill-[var(--brand-primary)] shrink-0" />
        <h3 className="text-[15px] font-bold text-[var(--text-primary)] truncate">
          Quick Actions
        </h3>
      </div>

      {/* 2 x 2 Action Cards Grid */}
      <div className="py-4 grid min-w-0 grid-cols-1 sm:grid-cols-2 gap-3.5">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              type="button"
              onClick={() => onSelectAction(act.id)}
              className="flex min-w-0 items-center justify-between p-3.5 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card-elevated)] hover:bg-[var(--bg-card-hover)] hover:border-[var(--border-secondary)] transition-all duration-150 text-left group shadow-xs cursor-pointer hover:scale-[1.01]"
            >
              <div className="flex min-w-0 flex-1 items-center gap-3 mr-2">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border border-[var(--border-primary)]"
                  style={{
                    backgroundColor: act.bgIcon,
                    color: act.color,
                  }}
                >
                  <Icon className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-[13px] font-bold text-[var(--text-primary)] leading-tight truncate">
                    {act.title}
                  </h4>
                  <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 leading-tight truncate">
                    {act.desc}
                  </p>
                </div>
              </div>
              <ChevronRight
                className="w-4 h-4 transition-transform group-hover:translate-x-0.5 shrink-0"
                style={{ color: act.color }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};
