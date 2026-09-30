import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Leaf,
  Clock,
  Droplet,
  Wind,
  Thermometer,
  Truck,
  FileSpreadsheet,
  FileText,
  Check,
} from 'lucide-react';
import { PackagingAnalysis } from '../types/packaging';
import { exportSingleAnalysisPDF } from '../utils/pdfExport';
import { exportSingleAnalysisCSV } from '../utils/csvExport';

interface AnalysisDetailModalProps {
  analysis: PackagingAnalysis | null;
  onClose: () => void;
  onUpdateAnalysis?: (updated: PackagingAnalysis) => void;
}

export const AnalysisDetailModal: React.FC<AnalysisDetailModalProps> = ({
  analysis,
  onClose,
  onUpdateAnalysis,
}) => {
  const [isCsvExported, setIsCsvExported] = useState(false);
  const [isPdfExported, setIsPdfExported] = useState(false);

  if (!analysis) return null;

  const handleExportPdf = () => {
    exportSingleAnalysisPDF(analysis);
    setIsPdfExported(true);
    setTimeout(() => setIsPdfExported(false), 2500);
  };

  const handleExportCsv = () => {
    exportSingleAnalysisCSV(analysis);
    setIsCsvExported(true);
    setTimeout(() => setIsCsvExported(false), 2500);
  };

  const handleToggleStatus = () => {
    if (!onUpdateAnalysis) return;
    const nextStatus = analysis.status === 'Completed' ? 'In Progress' : 'Completed';
    onUpdateAnalysis({ ...analysis, status: nextStatus });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--modal-overlay)] backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col transition-colors duration-200">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[var(--border-secondary)] flex items-center justify-between bg-[var(--bg-card-elevated)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--badge-completed-bg)] border border-[var(--brand-primary)]/20 flex items-center justify-center text-[var(--brand-primary)] font-bold text-sm">
              {analysis.product.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-[var(--text-primary)]">
                  {analysis.product} Packaging Analysis
                </h3>
                <span
                  className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                    analysis.status === 'Completed'
                      ? 'bg-[var(--badge-completed-bg)] text-[var(--badge-completed-text)] border-[var(--brand-primary)]/30'
                      : analysis.status === 'In Progress'
                      ? 'bg-[var(--badge-inprogress-bg)] text-[var(--badge-inprogress-text)] border-[var(--accent-gold)]/30'
                      : 'bg-[var(--badge-draft-bg)] text-[var(--badge-draft-text)] border-[var(--border-secondary)]'
                  }`}
                >
                  {analysis.status}
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Reference ID: <span className="font-mono">{analysis.id}</span> · Analyzed on {analysis.date}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-6">
          {/* Recommendation Highlights Banner */}
          <div className="p-4 rounded-xl bg-[var(--badge-completed-bg)] border border-[var(--brand-primary)]/20">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[var(--brand-primary)] shrink-0 mt-0.5" />
              <div>
                <div className="text-xs uppercase tracking-wider font-bold text-[var(--badge-completed-text)]">
                  Primary Packaging Recommendation
                </div>
                <div className="text-[15px] font-bold text-[var(--text-primary)] mt-0.5">
                  {analysis.recommendedMaterial}
                </div>
                {analysis.secondaryMaterial && (
                  <div className="text-xs text-[var(--text-secondary)] mt-1">
                    Alternative: <span className="font-medium text-[var(--text-primary)]">{analysis.secondaryMaterial}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] rounded-xl">
              <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] font-medium">
                <Clock className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
                <span>Shelf Life Gain</span>
              </div>
              <div className="text-[14px] font-bold text-[var(--text-primary)] mt-1.5">
                {analysis.shelfLifeGain}
              </div>
            </div>

            <div className="p-3 bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] rounded-xl">
              <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] font-medium">
                <Leaf className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
                <span>Eco Score</span>
              </div>
              <div className="text-[14px] font-bold text-[var(--brand-primary)] mt-1.5">
                {analysis.sustainabilityRating} / 100
              </div>
            </div>

            <div className="p-3 bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] rounded-xl">
              <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] font-medium">
                <Droplet className="w-3.5 h-3.5 text-[var(--accent-blue)]" />
                <span>WVTR Barrier</span>
              </div>
              <div className="text-[13px] font-bold text-[var(--text-primary)] mt-1.5 truncate">
                {analysis.wvtRate}
              </div>
            </div>

            <div className="p-3 bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] rounded-xl">
              <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] font-medium">
                <Wind className="w-3.5 h-3.5 text-[var(--accent-purple)]" />
                <span>OTR Barrier</span>
              </div>
              <div className="text-[13px] font-bold text-[var(--text-primary)] mt-1.5 truncate">
                {analysis.otRate.split(' ')[0]} cc
              </div>
            </div>
          </div>

          {/* Technical Environment Parameters */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Supply Chain & Atmosphere Specification
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] rounded-xl flex items-start gap-2.5">
                <Thermometer className="w-4 h-4 text-[var(--accent-gold)] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-[var(--text-primary)]">Target Storage Environment</div>
                  <div className="text-[var(--text-secondary)] mt-0.5">{analysis.storageCondition}</div>
                </div>
              </div>

              <div className="p-3 bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] rounded-xl flex items-start gap-2.5">
                <Truck className="w-4 h-4 text-[var(--accent-blue)] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-[var(--text-primary)]">Logistics Mode</div>
                  <div className="text-[var(--text-secondary)] mt-0.5">{analysis.transitMethod}</div>
                </div>
              </div>

              {analysis.mapGasMix && (
                <div className="p-3 bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] rounded-xl flex items-start gap-2.5 sm:col-span-2">
                  <Wind className="w-4 h-4 text-[var(--brand-primary)] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-[var(--text-primary)]">MAP (Modified Atmosphere) Gas Flush</div>
                    <div className="text-[var(--brand-primary)] mt-0.5 font-mono">{analysis.mapGasMix}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Scientific Rationale Notes */}
          {analysis.notes && (
            <div className="p-3.5 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-primary)]">
              <div className="text-xs font-semibold text-[var(--text-primary)] mb-1">
                Packaging Engineering & Food Science Rationale
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {analysis.notes}
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-[var(--border-secondary)] bg-[var(--bg-card-elevated)] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--text-muted)] hidden sm:inline">
              ISO 14040 Life Cycle Assessment verified
            </span>
            {onUpdateAnalysis && (
              <button
                type="button"
                onClick={handleToggleStatus}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
              >
                Mark as {analysis.status === 'Completed' ? 'In Progress' : 'Completed'}
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] text-emerald-800 dark:text-emerald-300 border border-emerald-600/30 text-xs font-semibold transition-colors cursor-pointer"
              title="Download spreadsheet-compatible CSV specification"
            >
              {isCsvExported ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>CSV Saved ✓</span>
                </>
              ) : (
                <>
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Export CSV</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleExportPdf}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[var(--badge-completed-bg)] hover:bg-[var(--brand-primary)] text-[var(--brand-primary)] hover:text-[var(--brand-text)] border border-[var(--brand-primary)]/30 text-xs font-bold transition-all shadow-xs cursor-pointer"
              title="Download formatted PDF technical data sheet"
            >
              {isPdfExported ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>PDF Downloaded ✓</span>
                </>
              ) : (
                <>
                  <FileText className="w-3.5 h-3.5" />
                  <span>Download TDS (PDF)</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[var(--brand-primary)] text-[var(--brand-text)] hover:bg-[var(--brand-secondary)] text-xs font-semibold transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
