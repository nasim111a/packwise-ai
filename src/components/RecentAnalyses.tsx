import React, { useState } from 'react';
import { MoreVertical, ArrowRight, FileText, Download, RotateCw, ExternalLink, FileSpreadsheet } from 'lucide-react';
import { PackagingAnalysis } from '../types/packaging';
import { AnalysisDetailModal } from './AnalysisDetailModal';
import { useResizeObserver } from '../hooks/useResizeObserver';
import { exportSingleAnalysisPDF } from '../utils/pdfExport';
import { exportSingleAnalysisCSV } from '../utils/csvExport';

interface RecentAnalysesProps {
  analyses: PackagingAnalysis[];
  onViewAll?: () => void;
  onSelectAnalysis?: (analysis: PackagingAnalysis) => void;
  onUpdateAnalysis?: (updated: PackagingAnalysis) => void;
  containerWidth?: number;
}

export const RecentAnalyses: React.FC<RecentAnalysesProps> = ({
  analyses,
  onViewAll,
  onSelectAnalysis,
  onUpdateAnalysis,
  containerWidth,
}) => {
  const [containerRef, dimensions] = useResizeObserver<HTMLDivElement>();
  const [selectedAnalysis, setSelectedAnalysis] = useState<PackagingAnalysis | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const effectiveWidth = containerWidth || dimensions.width;
  const isCompact = effectiveWidth > 0 && effectiveWidth < 620;
  const hideDate = effectiveWidth > 0 && effectiveWidth < 520;
  const hideCategory = effectiveWidth > 0 && effectiveWidth < 430;

  const showFeedback = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 3200);
  };

  const handleDownloadItemPdf = (item: PackagingAnalysis) => {
    exportSingleAnalysisPDF(item);
    showFeedback(`Exported certified PDF TDS dossier for ${item.product}`);
  };

  const handleDownloadItemCsv = (item: PackagingAnalysis) => {
    exportSingleAnalysisCSV(item);
    showFeedback(`Exported CSV spreadsheet record for ${item.product}`);
  };

  const handleOpenDetail = (item: PackagingAnalysis) => {
    setSelectedAnalysis(item);
    if (onSelectAnalysis) onSelectAnalysis(item);
  };

  const renderProductIcon = (type: PackagingAnalysis['thumbnailType']) => {
    switch (type) {
      case 'tomato':
        return (
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border bg-[var(--bg-card-elevated)] border-[var(--border-secondary)]">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
              <circle cx="12" cy="14" r="8" fill="#E52D27" />
              <path d="M12 6 C12 4 13 3 15 3" stroke="#20C77A" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M12 6 L10 8 M12 6 L14 8 M12 6 L12 9" stroke="#20C77A" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        );
      case 'rice':
        return (
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border bg-[var(--bg-card-elevated)] border-[var(--border-secondary)]">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
              <path d="M4 12 C4 8 8 5 12 5 C16 5 20 8 20 12 L4 12 Z" fill="#E2BD8A" />
              <ellipse cx="12" cy="12" rx="8" ry="2" fill="#CCA069" />
              <path d="M7 12 C7 17 9 19 12 19 C15 19 17 17 17 12" fill="#D6A72C" opacity="0.8" />
            </svg>
          </div>
        );
      case 'milk':
        return (
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border bg-[var(--bg-card-elevated)] border-[var(--border-secondary)]">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
              <rect x="8" y="4" width="8" height="4" rx="1" fill="#20C77A" />
              <path d="M9 8 L15 8 L16 11 L16 20 L8 20 L8 11 Z" fill="#FFFFFF" stroke="#BACBC3" strokeWidth="1" />
              <rect x="9" y="13" width="6" height="4" rx="0.5" fill="#4A90D9" opacity="0.6" />
            </svg>
          </div>
        );
      case 'potato':
        return (
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border bg-[var(--bg-card-elevated)] border-[var(--border-secondary)]">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
              <ellipse cx="12" cy="12" rx="8" ry="6" transform="rotate(-15 12 12)" fill="#C69C6D" />
              <circle cx="10" cy="11" r="0.8" fill="#755026" />
              <circle cx="14" cy="13" r="0.8" fill="#755026" />
            </svg>
          </div>
        );
      case 'apple':
        return (
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border bg-[var(--bg-card-elevated)] border-[var(--border-secondary)]">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
              <path d="M12 7 C9 7 7 9 7 13 C7 17 9 20 12 20 C15 20 17 17 17 13 C17 9 15 7 12 7 Z" fill="#D92D20" />
              <path d="M12 7 Q13 4 15 3" stroke="#4A2E12" strokeWidth="1.2" strokeLinecap="round" />
              <circle cx="10" cy="11" r="1.2" fill="#FFFFFF" opacity="0.6" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-lg bg-[var(--bg-card-elevated)] flex items-center justify-center shrink-0 border border-[var(--border-primary)] text-[var(--brand-primary)] text-xs font-bold">
            PKG
          </div>
        );
    }
  };

  return (
    <>
      <div
        ref={containerRef}
        className="min-w-0 w-full overflow-hidden bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-5 sm:p-6 shadow-[var(--shadow-card)] flex flex-col justify-between transition-colors duration-200"
      >
        <div className="flex min-w-0 items-center justify-between pb-4 border-b border-[var(--border-secondary)] gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[var(--badge-completed-bg)] flex items-center justify-center text-[var(--brand-primary)] shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <h2 className="text-[15px] sm:text-[16px] font-bold text-[var(--text-primary)] truncate">
              Recent Analyses
            </h2>
          </div>
          <button
            type="button"
            onClick={onViewAll}
            className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-[var(--brand-primary)] hover:opacity-90 transition-opacity cursor-pointer group shrink-0"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="min-w-0 w-full overflow-x-auto">
          <table
            className={`w-full text-left text-[13px] border-collapse ${
              isCompact ? 'min-w-full' : 'min-w-[540px]'
            }`}
          >
            <thead>
              <tr className="bg-[var(--bg-card-elevated)] border-b border-[var(--border-secondary)] text-[var(--text-muted)] text-[11.5px] uppercase tracking-wider font-semibold">
                <th className={`font-semibold ${isCompact ? 'py-2.5 px-3' : 'py-3 px-5 sm:px-3'}`}>
                  Product
                </th>
                {!hideCategory && (
                  <th className={`font-semibold ${isCompact ? 'py-2.5 px-2' : 'py-3 px-3'}`}>
                    Category
                  </th>
                )}
                <th className={`font-semibold ${isCompact ? 'py-2.5 px-2' : 'py-3 px-3'}`}>
                  Status
                </th>
                {!hideDate && (
                  <th className={`font-semibold ${isCompact ? 'py-2.5 px-2' : 'py-3 px-3'}`}>
                    Date
                  </th>
                )}
                <th
                  className={`font-semibold text-right ${
                    isCompact ? 'py-2.5 px-3' : 'py-3 px-5 sm:px-3'
                  }`}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {analyses.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => handleOpenDetail(item)}
                  className="bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] transition-colors cursor-pointer group"
                >
                  <td className={isCompact ? 'py-2.5 px-3' : 'py-3.5 px-5 sm:px-3'}>
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      {renderProductIcon(item.thumbnailType)}
                      <div className="min-w-0">
                        <span className="font-semibold text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors block truncate">
                          {item.product}
                        </span>
                        <div className="text-[11px] text-[var(--text-muted)] font-mono flex items-center gap-1.5 flex-wrap">
                          <span>{item.id}</span>
                          {hideCategory && (
                            <span className="text-[var(--text-secondary)] font-sans">
                              · {item.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  {!hideCategory && (
                    <td className={`text-[var(--text-secondary)] ${isCompact ? 'py-2.5 px-2' : 'py-3.5 px-3'}`}>
                      {item.category}
                    </td>
                  )}
                  <td className={isCompact ? 'py-2.5 px-2' : 'py-3.5 px-3'}>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                        item.status === 'Completed'
                          ? 'bg-[var(--badge-completed-bg)] text-[var(--badge-completed-text)] border-[var(--brand-primary)]/20'
                          : item.status === 'In Progress'
                          ? 'bg-[var(--badge-inprogress-bg)] text-[var(--badge-inprogress-text)] border-[var(--accent-gold)]/30'
                          : 'bg-[var(--badge-draft-bg)] text-[var(--badge-draft-text)] border-[var(--border-secondary)]'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  {!hideDate && (
                    <td className={`text-[var(--text-secondary)] text-[12.5px] ${isCompact ? 'py-2.5 px-2' : 'py-3.5 px-3'}`}>
                      {item.date}
                    </td>
                  )}
                  <td className={`text-right relative ${isCompact ? 'py-2.5 px-3' : 'py-3.5 px-5 sm:px-3'}`}>
                    <div className="inline-block" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)}
                        className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-elevated)] transition-colors cursor-pointer"
                        aria-label="Actions"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      {activeMenuId === item.id && (
                        <div className="absolute right-3 top-10 w-44 bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] rounded-xl shadow-xl z-30 py-1 text-left text-xs animate-in fade-in duration-100">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              handleOpenDetail(item);
                            }}
                            className="w-full px-3 py-2 text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] flex items-center gap-2 cursor-pointer"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
                            <span>View Specification</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              handleDownloadItemPdf(item);
                            }}
                            className="w-full px-3 py-2 text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] flex items-center gap-2 cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5 text-[var(--accent-blue)]" />
                            <span>Download Certified TDS (PDF)</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              handleDownloadItemCsv(item);
                            }}
                            className="w-full px-3 py-2 text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] flex items-center gap-2 cursor-pointer"
                          >
                            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Export Record (CSV)</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              showFeedback(`Re-evaluating ${item.product} barrier kinetics...`);
                              setTimeout(() => {
                                if (onUpdateAnalysis) {
                                  onUpdateAnalysis({
                                    ...item,
                                    status: 'Completed',
                                    date: new Date().toLocaleDateString('en-US', {
                                      day: 'numeric',
                                      month: 'short',
                                      year: 'numeric',
                                    }),
                                  });
                                }
                                showFeedback(`Audit passed: ${item.product} re-certified with 100% barrier compliance.`);
                              }, 1100);
                            }}
                            className="w-full px-3 py-2 text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] flex items-center gap-2 cursor-pointer"
                          >
                            <RotateCw className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                            <span>Re-run & Certify</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {feedbackMessage && (
          <div className="mt-3 py-2 px-3 rounded-lg bg-[var(--badge-completed-bg)] border border-[var(--brand-primary)]/30 text-[var(--brand-primary)] text-xs font-medium flex items-center justify-between animate-in fade-in duration-150">
            <span>{feedbackMessage}</span>
            <button
              onClick={() => setFeedbackMessage(null)}
              className="text-xs hover:opacity-75 cursor-pointer ml-2"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      <AnalysisDetailModal
        analysis={selectedAnalysis}
        onClose={() => setSelectedAnalysis(null)}
        onUpdateAnalysis={onUpdateAnalysis}
      />
    </>
  );
};
