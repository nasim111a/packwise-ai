import React from 'react';
import {
  Home,
  PlusCircle,
  History,
  Box,
  Database,
  BookOpen,
  BarChart2,
  Settings,
  HelpCircle,
  Leaf,
} from 'lucide-react';

export type NavItemKey =
  | 'dashboard'
  | 'new_analysis'
  | 'analysis_history'
  | 'recommendations'
  | 'food_database'
  | 'sustainability'
  | 'knowledge_base'
  | 'reports'
  | 'settings'
  | 'help_support';

interface SidebarProps {
  activeTab: NavItemKey;
  onSelectTab: (tab: NavItemKey) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
}) => {
  const mainNavItems = [
    { key: 'dashboard' as NavItemKey, label: 'Dashboard', icon: Home },
    { key: 'new_analysis' as NavItemKey, label: 'New Analysis', icon: PlusCircle },
    { key: 'analysis_history' as NavItemKey, label: 'Analysis History', icon: History },
    { key: 'recommendations' as NavItemKey, label: 'Recommendations', icon: Box },
    { key: 'food_database' as NavItemKey, label: 'Food Database', icon: Database },
    { key: 'sustainability' as NavItemKey, label: 'Sustainability & LCA', icon: Leaf },
    { key: 'knowledge_base' as NavItemKey, label: 'Knowledge Base', icon: BookOpen },
    { key: 'reports' as NavItemKey, label: 'Reports', icon: BarChart2 },
  ];

  const bottomNavItems = [
    { key: 'settings' as NavItemKey, label: 'Settings', icon: Settings },
    { key: 'help_support' as NavItemKey, label: 'Help & Support', icon: HelpCircle },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-[var(--modal-overlay)] backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-[240px] bg-[var(--bg-sidebar)] border-r border-[var(--border-primary)] flex flex-col justify-between transition-all duration-200 ease-out overflow-hidden lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header & Branding */}
        <div className="flex flex-col flex-1 overflow-y-auto relative z-10">
          <div className="pt-6 pb-6 px-5">
            <div className="flex items-center gap-3">
              {/* Organic glowing leaf icon */}
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none">
                  <path
                    d="M6 26 C8 15 17 6 26 4 C 27 15 20 25 6 26 Z"
                    fill="url(#leafGreenGrad)"
                  />
                  <path
                    d="M6 26 Q17 15 26 4"
                    stroke="#a7f3d0"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <path d="M12 20 Q16 17 21 18" stroke="#a7f3d0" strokeWidth="1" strokeOpacity="0.7" />
                  <path d="M16 15 Q20 12 24 13" stroke="#a7f3d0" strokeWidth="1" strokeOpacity="0.7" />
                  <defs>
                    <linearGradient id="leafGreenGrad" x1="6" y1="26" x2="26" y2="4" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#059669" />
                      <stop offset="50%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#34d399" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="flex flex-col">
                <div className="font-bold text-[18px] tracking-tight text-[var(--text-primary)] leading-tight flex items-center gap-1.5">
                  <span>PackWise</span>
                  <span className="text-[var(--brand-primary)]">AI</span>
                </div>
                <div className="text-[11px] text-[var(--text-secondary)] leading-tight mt-1">
                  <div>Smarter Packaging</div>
                  <div>for a Healthier Tomorrow</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Navigation */}
          <nav className="px-3.5 space-y-1.5 relative z-10">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => {
                    onSelectTab(item.key);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`w-full flex items-center gap-3.5 px-4 py-2.5 text-[13.5px] font-medium rounded-xl transition-all duration-150 text-left relative cursor-pointer z-10 ${
                    isActive
                      ? 'bg-[var(--bg-sidebar-active)] text-[var(--brand-text)] shadow-xs border border-[var(--border-hero)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-sidebar-hover)]'
                  }`}
                >
                  <Icon
                    className={`w-[18px] h-[18px] shrink-0 ${
                      isActive
                        ? 'text-[var(--brand-active-icon)]'
                        : 'text-[var(--text-secondary)]'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Decorative botanical leaf element */}
        <div className="pointer-events-none overflow-hidden absolute bottom-0 left-0 h-[260px] w-full z-0 opacity-40">
          <svg viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute -left-6 bottom-0 w-48 h-56 pointer-events-none">
            <g transform="translate(10, 20)">
              <path
                d="M 10 220 C 20 120 70 40 160 10 C 140 110 90 200 10 220 Z"
                fill="#dcfce7"
                stroke="#86efac"
                strokeWidth="1.5"
              />
              <path
                d="M 10 220 Q 90 120 160 10"
                stroke="#b45309"
                strokeWidth="1.8"
                strokeOpacity="0.8"
              />
              <path d="M 40 180 Q 75 160 105 175" stroke="#b45309" strokeWidth="1" strokeOpacity="0.6" />
              <path d="M 65 145 Q 105 125 130 140" stroke="#b45309" strokeWidth="1" strokeOpacity="0.6" />
              <path d="M 95 105 Q 125 85 150 100" stroke="#b45309" strokeWidth="1" strokeOpacity="0.6" />
              <path
                d="M 10 220 C 60 180 120 160 180 160 C 140 210 70 230 10 220 Z"
                fill="#bbf7d0"
                stroke="#4ade80"
                strokeWidth="1.2"
              />
              <path
                d="M 10 220 Q 100 190 180 160"
                stroke="#15803d"
                strokeWidth="1.2"
                strokeOpacity="0.7"
              />
            </g>
          </svg>
        </div>

        {/* Bottom Section (Settings & Help & Support) */}
        <div className="p-3.5 border-t border-[var(--border-secondary)] bg-[var(--bg-sidebar)] space-y-1 relative z-10">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  onSelectTab(item.key);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center gap-3.5 px-4 py-2.5 text-[13.5px] font-medium rounded-xl transition-all duration-150 text-left cursor-pointer relative z-10 ${
                  isActive
                    ? 'bg-[var(--bg-sidebar-active)] text-[var(--brand-text)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-sidebar-hover)]'
                }`}
              >
                <Icon
                  className={`w-[18px] h-[18px] shrink-0 ${
                    isActive
                      ? 'text-[var(--brand-active-icon)]'
                      : 'text-[var(--text-secondary)]'
                  }`}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </aside>
    </>
  );
};
