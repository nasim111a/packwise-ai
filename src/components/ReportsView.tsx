import React, { useState } from 'react';
import {
  FileText,
  Download,
  Calendar,
  Search,
  FileDown,
  Check,
  FileCheck2,
  FileSpreadsheet,
} from 'lucide-react';
import { RECENT_ANALYSES } from '../data/mockPackagingData';
import { PackagingAnalysis } from '../types/packaging';
import { AnalysisDetailModal } from './AnalysisDetailModal';
import { exportAnalysisSummaryPDF, exportSingleAnalysisPDF } from '../utils/pdfExport';
import { exportAnalysisHistoryCSV, exportSingleAnalysisCSV } from '../utils/csvExport';

interface ReportsViewProps {
  analyses?: PackagingAnalysis[];
  onUpdateAnalysis?: (updated: PackagingAnalysis) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  analyses = RECENT_ANALYSES,
  onUpdateAnalysis,
}) => {
  const [csvDownloadedIds, setCsvDownloadedIds] = useState<Record<string, boolean>>({});
  const [pdfDownloadedIds, setPdfDownloadedIds] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Completed' | 'In Progress'>('All');
  const [selectedAnalysis, setSelectedAnalysis] = useState<PackagingAnalysis | null>(null);
  const [batchExported, setBatchExported] = useState(false);
  const [summaryPdfExported, setSummaryPdfExported] = useState(false);
  const [historyCsvExported, setHistoryCsvExported] = useState(false);

  const filteredAnalyses = analyses.filter((item) => {
    const matchesSearch =
      item.product.toLowerCase().includes(search.toLowerCase()) ||
      item.recommendedMaterial.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDownloadSinglePdf = (item: PackagingAnalysis) => {
    exportSingleAnalysisPDF(item);
    setPdfDownloadedIds((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setPdfDownloadedIds((prev) => ({ ...prev, [item.id]: false }));
    }, 2500);
  };

  const handleDownloadSingleCsv = (item: PackagingAnalysis) => {
    exportSingleAnalysisCSV(item);
    setCsvDownloadedIds((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setCsvDownloadedIds((prev) => ({ ...prev, [item.id]: false }));
    }, 2500);
  };

  const handleExportSummaryPdf = () => {
    exportAnalysisSummaryPDF(filteredAnalyses, {
      search: search.trim() || undefined,
      status: statusFilter,
    });
    setSummaryPdfExported(true);
    setTimeout(() => setSummaryPdfExported(false), 2500);
  };

  const handleExportHistoryCsv = () => {
    exportAnalysisHistoryCSV(filteredAnalyses);
    setHistoryCsvExported(true);
    setTimeout(() => setHistoryCsvExported(false), 2500);
  };

  const handleExportAllJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(analyses, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `PackWise_All_Dossiers_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setBatchExported(true);
    setTimeout(() => setBatchExported(false), 2500);
  };

  return (
    <div className="space-y-6 min-w-0 w-full">
      {/* Header */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-6 shadow-[var(--shadow-card)] transition-colors duration-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs font-bold text-[var(--accent-gold)] uppercase tracking-wider">
              <FileText className="w-4 h-4" />
              <span>Documentation & Audit Trail</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mt-1">
              Technical Packaging Reports & Compliance Dossiers
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Export packaging analyses to spreadsheet-ready CSV or certified PDF dossiers for regulatory submissions, ERP tracking, and audits.
            </p>
          </div>

          {/* Export Action Controls */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* CSV History Export Button */}
            <button
              type="button"
              onClick={handleExportHistoryCsv}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm transition-all cursor-pointer active:scale-[0.99]"
              title="Export analysis history to CSV for Excel and spreadsheet software"
            >
              {historyCsvExported ? (
                <>
                  <Check className="w-4 h-4 text-emerald-200" />
                  <span>CSV History Exported!</span>
                </>
              ) : (
                <>
                  <FileSpreadsheet className="w-4 h-4 stroke-[2.5]" />
                  <span>Export History (CSV)</span>
                </>
              )}
            </button>

            {/* Formatted PDF Export Button */}
            <button
              type="button"
              onClick={handleExportSummaryPdf}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--brand-primary)] text-[var(--brand-text)] hover:bg-[var(--brand-secondary)] text-xs font-bold shadow-sm transition-all cursor-pointer active:scale-[0.99]"
              title="Export formatted executive summary PDF"
            >
              {summaryPdfExported ? (
                <>
                  <Check className="w-4 h-4 text-emerald-200" />
                  <span>PDF Exported!</span>
                </>
              ) : (
                <>
                  <FileDown className="w-4 h-4 stroke-[2.5]" />
                  <span>Export Summary (PDF)</span>
                </>
              )}
            </button>

            {/* JSON Export Button */}
            <button
              type="button"
              onClick={handleExportAllJson}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] text-xs font-semibold shadow-xs cursor-pointer transition-colors"
              title="Export raw JSON dossier database"
            >
              <Download className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
              <span>{batchExported ? 'All Exported ✓' : 'Export JSON'}</span>
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="mt-5 pt-4 border-t border-[var(--border-secondary)] flex flex-wrap items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by commodity, material, or ID..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[var(--bg-input)] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
            />
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[var(--text-muted)] mr-1 font-medium">Status Filter:</span>
            {(['All', 'Completed', 'In Progress'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer text-xs ${
                  statusFilter === st
                    ? 'bg-[var(--brand-primary)] text-[var(--brand-text)] shadow-2xs'
                    : 'bg-[var(--bg-card-elevated)] text-[var(--text-secondary)] border border-[var(--border-primary)] hover:bg-[var(--bg-card-hover)]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reports Table Card */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-5 sm:p-6 shadow-[var(--shadow-card)]">
        <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[var(--border-secondary)] gap-2">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-[var(--brand-primary)]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
              Packaging Dossiers ({filteredAnalyses.length})
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <button
              type="button"
              onClick={handleExportHistoryCsv}
              className="font-semibold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Download CSV Sheet</span>
            </button>
            <span className="text-[var(--border-primary)]">|</span>
            <button
              type="button"
              onClick={handleExportSummaryPdf}
              className="font-semibold text-[var(--brand-primary)] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Download Summary PDF</span>
            </button>
          </div>
        </div>

        <div className="divide-y divide-[var(--border-subtle)]">
          {filteredAnalyses.length === 0 ? (
            <div className="py-12 text-center text-sm text-[var(--text-muted)]">
              No matching packaging dossiers found for "{search}".
            </div>
          ) : (
            filteredAnalyses.map((item) => (
              <div
                key={item.id}
                className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[var(--bg-card-hover)] p-3 rounded-xl transition-colors cursor-pointer group"
                onClick={() => setSelectedAnalysis(item)}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2.5">
                    <h4 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors truncate">
                      {item.product} Comprehensive Packaging Dossier
                    </h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--badge-completed-bg)] text-[var(--badge-completed-text)] font-semibold border border-[var(--brand-primary)]/20 shrink-0">
                      {item.id}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        item.status === 'Completed'
                          ? 'bg-[var(--badge-completed-bg)] text-[var(--badge-completed-text)] border-[var(--brand-primary)]/30'
                          : 'bg-[var(--badge-inprogress-bg)] text-[var(--badge-inprogress-text)] border-[var(--accent-gold)]/30'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <div className="text-xs text-[var(--text-secondary)] mt-1.5 flex flex-wrap items-center gap-2 sm:gap-3">
                    <span className="truncate max-w-[280px] font-medium text-[var(--text-primary)]">
                      {item.recommendedMaterial}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1 shrink-0 text-[var(--text-muted)]">
                      <Calendar className="w-3 h-3" />
                      {item.date}
                    </span>
                    <span>·</span>
                    <span className="text-[var(--brand-primary)] font-semibold shrink-0">
                      Eco: {item.sustainabilityRating}/100
                    </span>
                    <span>·</span>
                    <span className="text-[var(--text-muted)] shrink-0">
                      Gain: {item.shelfLifeGain}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                  {/* CSV Export for Spreadsheet */}
                  <button
                    type="button"
                    onClick={() => handleDownloadSingleCsv(item)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-card-elevated)] border border-emerald-600/30 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-xs font-semibold shadow-2xs cursor-pointer transition-colors"
                    title={`Export ${item.product} record to CSV for Excel`}
                  >
                    {csvDownloadedIds[item.id] ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>CSV Saved ✓</span>
                      </>
                    ) : (
                      <>
                        <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                        <span>CSV</span>
                      </>
                    )}
                  </button>

                  {/* Single PDF Export Button */}
                  <button
                    type="button"
                    onClick={() => handleDownloadSinglePdf(item)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--badge-completed-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/30 hover:bg-[var(--brand-primary)] hover:text-[var(--brand-text)] text-xs font-bold shadow-2xs cursor-pointer transition-colors"
                    title={`Export ${item.product} as formatted PDF Technical Data Sheet`}
                  >
                    {pdfDownloadedIds[item.id] ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>PDF Saved ✓</span>
                      </>
                    ) : (
                      <>
                        <FileDown className="w-3.5 h-3.5" />
                        <span>Export PDF</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedAnalysis(item)}
                    className="px-3 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-primary)] text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] cursor-pointer"
                  >
                    View
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedAnalysis && (
        <AnalysisDetailModal
          analysis={selectedAnalysis}
          onClose={() => setSelectedAnalysis(null)}
          onUpdateAnalysis={onUpdateAnalysis}
        />
      )}
    </div>
  );
};
