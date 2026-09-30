/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { SettingsProvider } from './context/SettingsContext';
import { Sidebar, NavItemKey } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { HeroBanner } from './components/HeroBanner';
import { KpiCard, KpiItemProps } from './components/KpiCard';
import { RecentAnalyses } from './components/RecentAnalyses';
import { CategoryDistribution } from './components/CategoryDistribution';
import { AnalysisTrends } from './components/AnalysisTrends';
import { TopMaterialsRecommended } from './components/TopMaterialsRecommended';
import { QuickActions } from './components/QuickActions';
import { NewAnalysisModal } from './components/NewAnalysisModal';
import { SettingsModal } from './components/SettingsModal';
import { HelpSupportModal } from './components/HelpSupportModal';
import { FoodDatabaseView } from './components/FoodDatabaseView';
import { MaterialsView } from './components/MaterialsView';
import { SustainabilityView } from './components/SustainabilityView';
import { ReportsView } from './components/ReportsView';
import { KnowledgeHubView } from './components/KnowledgeHubView';
import { RECENT_ANALYSES } from './data/mockPackagingData';
import { PackagingAnalysis } from './types/packaging';
import { useResizeObserver } from './hooks/useResizeObserver';

function DashboardContent() {
  const [activeTab, setActiveTab] = useState<NavItemKey>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dashboardGridRef, dashboardDimensions] = useResizeObserver<HTMLDivElement>();

  // Modals state
  const [isNewAnalysisOpen, setIsNewAnalysisOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [foodForAnalysis, setFoodForAnalysis] = useState<{
    name: string;
    category: PackagingAnalysis['category'];
  } | null>(null);

  // Analyses list state with localStorage persistence
  const [analyses, setAnalyses] = useState<PackagingAnalysis[]>(() => {
    try {
      const saved = localStorage.getItem('packwise_analyses');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return RECENT_ANALYSES;
  });

  useEffect(() => {
    try {
      localStorage.setItem('packwise_analyses', JSON.stringify(analyses));
    } catch {}
  }, [analyses]);

  // Handle adding new analysis from simulator
  const handleSaveNewAnalysis = (newAnalysis: PackagingAnalysis) => {
    setAnalyses((prev) => [newAnalysis, ...prev]);
    setActiveTab('dashboard');
  };

  // Handle updating an existing analysis (e.g. status toggle)
  const handleUpdateAnalysis = (updated: PackagingAnalysis) => {
    setAnalyses((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
  };

  // Dynamically computed KPI metrics reflecting real analyses data
  const totalAnalyses = analyses.length;
  const sustainableOptions = analyses.filter((a) => a.sustainabilityRating >= 80).length;
  const inProgress = analyses.filter((a) => a.status === 'In Progress').length;
  const completed = analyses.filter((a) => a.status === 'Completed').length;

  const kpiItems: KpiItemProps[] = useMemo(
    () => [
      {
        id: 'total_analyses',
        label: 'Total Analyses',
        value: totalAnalyses,
        trend: '+12%',
        trendPositive: true,
        iconType: 'package',
        sparklineBars: [35, 65, 45, 85, Math.min(100, totalAnalyses * 4)],
        color: 'var(--brand-primary)',
      },
      {
        id: 'sustainable_options',
        label: 'Sustainable Options',
        value: sustainableOptions,
        trend: '+8%',
        trendPositive: true,
        iconType: 'leaf',
        sparklineBars: [30, 50, 70, 85, Math.min(100, sustainableOptions * 5)],
        color: 'var(--brand-primary)',
      },
      {
        id: 'in_progress',
        label: 'In Progress',
        value: inProgress,
        trend: inProgress > 0 ? '+2%' : '0%',
        trendPositive: 'neutral',
        iconType: 'clock',
        sparklineBars: [70, 45, 65, 55, Math.min(100, inProgress * 8)],
        color: 'var(--accent-gold)',
      },
      {
        id: 'completed',
        label: 'Completed',
        value: completed,
        trend: '+25%',
        trendPositive: true,
        iconType: 'check',
        sparklineBars: [25, 45, 60, 85, Math.min(100, completed * 9)],
        color: 'var(--brand-primary)',
      },
    ],
    [totalAnalyses, sustainableOptions, inProgress, completed]
  );

  // Filter analyses based on global search bar
  const filteredAnalyses = useMemo(() => {
    if (!searchQuery.trim()) return analyses;
    const q = searchQuery.toLowerCase();
    return analyses.filter(
      (a) =>
        a.product.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.recommendedMaterial.toLowerCase().includes(q) ||
        a.status.toLowerCase().includes(q)
    );
  }, [analyses, searchQuery]);

  const handleTabSelection = (tab: NavItemKey) => {
    if (tab === 'new_analysis') {
      setFoodForAnalysis(null);
      setIsNewAnalysisOpen(true);
      return;
    }
    if (tab === 'settings') {
      setIsSettingsOpen(true);
      return;
    }
    if (tab === 'help_support') {
      setIsHelpOpen(true);
      return;
    }
    setActiveTab(tab);
  };

  const handleSelectFoodForAnalysis = (name: string, category: string) => {
    setFoodForAnalysis({
      name,
      category: category as PackagingAnalysis['category'],
    });
    setIsNewAnalysisOpen(true);
  };

  return (
    <div className="min-h-screen w-full min-w-0 overflow-x-hidden bg-[var(--bg-app)] text-[var(--text-primary)] flex flex-col antialiased selection:bg-[var(--badge-completed-bg)] selection:text-[var(--badge-completed-text)] transition-colors duration-200">
      {/* Fixed Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={handleTabSelection}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-[240px] flex flex-col min-w-0 w-full bg-[var(--bg-main)] transition-colors duration-200">
        <Topbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-7 max-w-[1600px] w-full mx-auto space-y-6">
          {/* Active Tab: Dashboard View */}
          {activeTab === 'dashboard' && (
            <div
              ref={dashboardGridRef}
              data-grid-width={dashboardDimensions.width}
              className="space-y-6 min-w-0 w-full"
            >
              {/* Hero Banner with Food Packaging Visual */}
              <HeroBanner
                onStartNewAnalysis={() => setIsNewAnalysisOpen(true)}
                onViewRecommendations={() => {
                  const el = document.getElementById('recent-analyses-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
              />

              {/* KPI Cards */}
              <section aria-label="Key Performance Indicators" className="min-w-0 w-full">
                <div
                  className="grid min-w-0 w-full gap-3 sm:gap-5 [grid-template-columns:repeat(4,minmax(0,1fr))]"
                  style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}
                >
                  {kpiItems.map((item) => (
                    <div key={item.id} className="min-w-0">
                      <KpiCard {...item} />
                    </div>
                  ))}
                </div>
              </section>

              {/* Middle Section: Recent Analyses + Category Distribution */}
              <div id="recent-analyses-section" className="grid min-w-0 w-full grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                <div className="min-w-0 lg:col-span-7 xl:col-span-7 flex flex-col">
                  <RecentAnalyses
                    analyses={filteredAnalyses}
                    onViewAll={() => setActiveTab('reports')}
                    onUpdateAnalysis={handleUpdateAnalysis}
                  />
                </div>
                <div className="min-w-0 lg:col-span-5 xl:col-span-5 flex flex-col">
                  <CategoryDistribution />
                </div>
              </div>

              {/* Lower Section: Analysis Trends, Top Materials, Quick Actions */}
              <div className="grid min-w-0 w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-stretch">
                <div className="min-w-0 lg:col-span-4 flex flex-col">
                  <AnalysisTrends />
                </div>
                <div className="min-w-0 lg:col-span-4 flex flex-col">
                  <TopMaterialsRecommended />
                </div>
                <div className="min-w-0 lg:col-span-4 md:col-span-2 flex flex-col">
                  <QuickActions onSelectAction={handleTabSelection} />
                </div>
              </div>
            </div>
          )}

          {/* Active Tab: Food Database View */}
          {activeTab === 'food_database' && (
            <FoodDatabaseView onSelectFoodForAnalysis={handleSelectFoodForAnalysis} />
          )}

          {/* Active Tab: Recommendations / Packaging Materials */}
          {activeTab === 'recommendations' && <MaterialsView />}

          {/* Active Tab: Sustainability & LCA Engine */}
          {activeTab === 'sustainability' && <SustainabilityView />}

          {/* Active Tab: Analysis History / Reports */}
          {(activeTab === 'reports' || activeTab === 'analysis_history') && (
            <ReportsView analyses={analyses} onUpdateAnalysis={handleUpdateAnalysis} />
          )}

          {/* Active Tab: Knowledge Base */}
          {activeTab === 'knowledge_base' && <KnowledgeHubView />}
        </main>
      </div>

      {/* Interactive Modals */}
      <NewAnalysisModal
        isOpen={isNewAnalysisOpen}
        onClose={() => setIsNewAnalysisOpen(false)}
        onSaveAnalysis={handleSaveNewAnalysis}
        initialProduct={foodForAnalysis?.name}
        initialCategory={foodForAnalysis?.category}
      />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
      <HelpSupportModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <DashboardContent />
      </SettingsProvider>
    </ThemeProvider>
  );
}
