import React, { useState } from 'react';
import { Layers, Leaf, ArrowUpRight, Search, Scale, X, Check, FileDown } from 'lucide-react';
import { PACKAGING_MATERIALS_CATALOG } from '../data/mockPackagingData';

export const MaterialsView: React.FC = () => {
  const [filterType, setFilterType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMat, setSelectedMat] = useState<typeof PACKAGING_MATERIALS_CATALOG[0] | null>(null);
  const [comparisonIds, setComparisonIds] = useState<string[]>([]);
  const [isComparing, setIsComparing] = useState(false);
  const [isExported, setIsExported] = useState(false);

  const types = ['All', 'Bio-Polymer', 'Multilayer Barrier', 'Recycled Plastic', 'Cellulose / Paper', 'Rigid Polymer'];

  const filtered = PACKAGING_MATERIALS_CATALOG.filter((m) => {
    const matchesType = filterType === 'All' || m.type === filterType;
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.typicalUses.some((u) => u.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const toggleComparison = (id: string) => {
    setComparisonIds((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  };

  const matA = PACKAGING_MATERIALS_CATALOG.find((m) => m.id === comparisonIds[0]);
  const matB = PACKAGING_MATERIALS_CATALOG.find((m) => m.id === comparisonIds[1]);

  return (
    <div className="space-y-6 min-w-0 w-full">
      {/* Header */}
      <div className="min-w-0 w-full overflow-hidden bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-6 shadow-[var(--shadow-card)] transition-colors duration-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs font-bold text-[var(--brand-primary)] uppercase tracking-wider">
              <Layers className="w-4 h-4 shrink-0" />
              <span>Packaging Engineering Catalog</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mt-1 truncate">
              Food Contact Substrates & Barrier Specifications
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Technical characterization of polymers, aqueous barriers, compostable biopolymers, and mono-materials.
            </p>
          </div>
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <div className="relative w-full sm:w-60">
              <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search substrate or barrier..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-[var(--bg-input)] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
              />
            </div>
            <button
              type="button"
              onClick={() => setIsComparing(!isComparing)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                isComparing || comparisonIds.length > 0
                  ? 'bg-[var(--badge-completed-bg)] text-[var(--brand-primary)] border-[var(--brand-primary)]/40'
                  : 'bg-[var(--bg-card-elevated)] text-[var(--text-secondary)] border-[var(--border-primary)] hover:bg-[var(--bg-card-hover)]'
              }`}
            >
              <Scale className="w-4 h-4" />
              <span>Compare ({comparisonIds.length}/2)</span>
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mt-4 pt-4 border-t border-[var(--border-secondary)] flex flex-wrap gap-2">
          {types.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                filterType === t
                  ? 'bg-[var(--brand-primary)] text-[var(--brand-text)] font-semibold shadow-xs'
                  : 'bg-[var(--bg-card-elevated)] text-[var(--text-secondary)] border border-[var(--border-primary)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Drawer */}
      {isComparing && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-5 sm:p-6 shadow-md transition-all animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-secondary)]">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-[var(--brand-primary)]" />
              <h3 className="text-sm font-bold text-[var(--text-primary)]">
                Side-by-Side Material Comparison
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsComparing(false)}
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 rounded-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {!matA || !matB ? (
            <div className="py-6 text-center text-xs text-[var(--text-muted)]">
              Select 2 materials below using the <span className="font-semibold text-[var(--brand-primary)]">"Add to Compare"</span> button to see barrier & sustainability differences side-by-side.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-xs">
                <div className="p-4 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-[var(--text-muted)]">{matA.id}</span>
                    <span className="text-[10px] font-semibold text-[var(--brand-primary)]">{matA.type}</span>
                  </div>
                  <h4 className="font-bold text-sm text-[var(--text-primary)]">{matA.name}</h4>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[var(--border-secondary)]">
                    <div>
                      <span className="text-[10px] text-[var(--text-muted)]">WVTR Barrier</span>
                      <div className="font-bold text-[var(--text-primary)]">{matA.wvtrBarrier}</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-[var(--text-muted)]">OTR Barrier</span>
                      <div className="font-bold text-[var(--text-primary)]">{matA.otrBarrier}</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-[var(--text-muted)]">Tensile Strength</span>
                      <div className="font-bold text-[var(--text-primary)]">{matA.tensileStrength}</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-[var(--text-muted)]">CO₂ Footprint</span>
                      <div className="font-bold text-[var(--brand-primary)]">{matA.co2Footprint}</div>
                    </div>
                  </div>
                  <div className="pt-2 text-[11px] text-[var(--text-secondary)]">
                    <span className="font-medium text-[var(--text-primary)]">Recyclability:</span> {matA.recyclability}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-[var(--text-muted)]">{matB.id}</span>
                    <span className="text-[10px] font-semibold text-[var(--brand-primary)]">{matB.type}</span>
                  </div>
                  <h4 className="font-bold text-sm text-[var(--text-primary)]">{matB.name}</h4>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[var(--border-secondary)]">
                    <div>
                      <span className="text-[10px] text-[var(--text-muted)]">WVTR Barrier</span>
                      <div className="font-bold text-[var(--text-primary)]">{matB.wvtrBarrier}</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-[var(--text-muted)]">OTR Barrier</span>
                      <div className="font-bold text-[var(--text-primary)]">{matB.otrBarrier}</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-[var(--text-muted)]">Tensile Strength</span>
                      <div className="font-bold text-[var(--text-primary)]">{matB.tensileStrength}</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-[var(--text-muted)]">CO₂ Footprint</span>
                      <div className="font-bold text-[var(--brand-primary)]">{matB.co2Footprint}</div>
                    </div>
                  </div>
                  <div className="pt-2 text-[11px] text-[var(--text-secondary)]">
                    <span className="font-medium text-[var(--text-primary)]">Recyclability:</span> {matB.recyclability}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[var(--border-secondary)] flex items-center justify-between">
                <span className="text-xs text-[var(--text-muted)]">
                  Comparing 2 technical substrates across barrier & LCA metrics
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
                      exportDate: new Date().toISOString(),
                      title: `Comparison: ${matA.name} vs ${matB.name}`,
                      materialA: matA,
                      materialB: matB
                    }, null, 2));
                    const downloadAnchor = document.createElement('a');
                    downloadAnchor.setAttribute("href", dataStr);
                    downloadAnchor.setAttribute("download", `material-comparison-${matA.id}-vs-${matB.id}.json`);
                    document.body.appendChild(downloadAnchor);
                    downloadAnchor.click();
                    downloadAnchor.remove();
                    setIsExported(true);
                    setTimeout(() => setIsExported(false), 2500);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--badge-completed-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/30 rounded-lg text-xs font-semibold hover:bg-[var(--brand-primary)] hover:text-[var(--brand-text)] transition-colors cursor-pointer"
                >
                  {isExported ? <Check className="w-3.5 h-3.5" /> : <FileDown className="w-3.5 h-3.5" />}
                  <span>{isExported ? 'Exported!' : 'Export Comparison JSON'}</span>
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Materials Cards */}
      <div className="grid min-w-0 grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((mat) => {
          const isSelectedForCompare = comparisonIds.includes(mat.id);
          return (
            <div
              key={mat.id}
              className={`min-w-0 overflow-hidden bg-[var(--bg-card)] border rounded-2xl p-5 shadow-[var(--shadow-card)] transition-all flex flex-col justify-between ${
                isSelectedForCompare
                  ? 'border-[var(--brand-primary)] ring-1 ring-[var(--brand-primary)]'
                  : 'border-[var(--border-primary)] hover:border-[var(--border-secondary)]'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-semibold text-[var(--brand-primary)] bg-[var(--badge-completed-bg)] px-2.5 py-0.5 rounded-md border border-[var(--brand-primary)]/20">
                      {mat.type}
                    </span>
                    <h3 className="text-base font-bold text-[var(--text-primary)] mt-2">
                      {mat.name}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-[var(--brand-primary)]">{mat.sharePercentage}%</span>
                    <div className="text-[10.5px] text-[var(--text-muted)]">Adoption Share</div>
                  </div>
                </div>

                {/* Technical Barrier Grid */}
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2 bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] rounded-xl text-center">
                    <span className="text-[10px] text-[var(--text-muted)]">OTR Barrier</span>
                    <div className="font-bold text-[var(--text-primary)] mt-0.5">{mat.otrBarrier}</div>
                  </div>
                  <div className="p-2 bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] rounded-xl text-center">
                    <span className="text-[10px] text-[var(--text-muted)]">WVTR Barrier</span>
                    <div className="font-bold text-[var(--text-primary)] mt-0.5">{mat.wvtrBarrier}</div>
                  </div>
                  <div className="p-2 bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] rounded-xl text-center">
                    <span className="text-[10px] text-[var(--text-muted)]">Tensile Yield</span>
                    <div className="font-bold text-[var(--text-primary)] mt-0.5 truncate">{mat.tensileStrength.split(' ')[0]} MPa</div>
                  </div>
                  <div className="p-2 bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] rounded-xl text-center">
                    <span className="text-[10px] text-[var(--text-muted)]">CO₂ Footprint</span>
                    <div className="font-bold text-[var(--brand-primary)] mt-0.5">{mat.co2Footprint.split(' ')[0]} kg</div>
                  </div>
                </div>

                {/* Sustainability Standard */}
                <div className="mt-3 p-3 bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] rounded-xl text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-[var(--brand-primary)]">
                    <Leaf className="w-3.5 h-3.5" />
                    <span>{mat.recyclability}</span>
                  </div>
                  <p className="text-[11.5px] text-[var(--text-secondary)]">{mat.biodegradability}</p>
                </div>

                {/* Uses */}
                <div className="mt-3">
                  <div className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1">
                    Common Commercial Applications
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {mat.typicalUses.map((use) => (
                      <span
                        key={use}
                        className="px-2 py-0.5 rounded-md bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] text-[11.5px] text-[var(--text-primary)]"
                      >
                        {use}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[var(--border-secondary)] flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => {
                    toggleComparison(mat.id);
                    setIsComparing(true);
                  }}
                  className={`inline-flex items-center gap-1 text-xs font-semibold cursor-pointer transition-colors ${
                    isSelectedForCompare
                      ? 'text-[var(--brand-primary)] font-bold'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>{isSelectedForCompare ? 'Compared ✓' : 'Add to Compare'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMat(mat)}
                  className="text-[var(--brand-primary)] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>View Full TDS</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* TDS Specification Modal */}
      {selectedMat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--modal-overlay)] backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
            <div className="flex items-start justify-between pb-3 border-b border-[var(--border-secondary)]">
              <div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[var(--badge-completed-bg)] text-[var(--brand-primary)] font-semibold">
                  {selectedMat.id}
                </span>
                <h3 className="text-lg font-bold text-[var(--text-primary)] mt-1">{selectedMat.name}</h3>
                <p className="text-xs text-[var(--text-secondary)]">{selectedMat.type} · Recyclability: {selectedMat.recyclability}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMat(null)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-primary)]">
                  <div className="text-[var(--text-muted)] font-medium">WVTR Moisture Barrier</div>
                  <div className="text-sm font-bold text-[var(--brand-primary)] mt-0.5">{selectedMat.wvtrBarrier}</div>
                  <div className="text-[10.5px] text-[var(--text-muted)] mt-1">ASTM F1249 test standard</div>
                </div>
                <div className="p-3 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-primary)]">
                  <div className="text-[var(--text-muted)] font-medium">OTR Oxygen Barrier</div>
                  <div className="text-sm font-bold text-[var(--brand-primary)] mt-0.5">{selectedMat.otrBarrier}</div>
                  <div className="text-[10.5px] text-[var(--text-muted)] mt-1">ASTM D3985 test standard</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-primary)]">
                  <div className="text-[var(--text-muted)] font-medium">Global Carbon Footprint</div>
                  <div className="text-sm font-bold text-[var(--text-primary)] mt-0.5">{selectedMat.co2Footprint}</div>
                  <div className="text-[10.5px] text-[var(--text-muted)] mt-1">Cradle-to-gate LCA</div>
                </div>
                <div className="p-3 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-primary)]">
                  <div className="text-[var(--text-muted)] font-medium">Tensile Strength</div>
                  <div className="text-sm font-bold text-[var(--text-primary)] mt-0.5">{selectedMat.tensileStrength}</div>
                  <div className="text-[10.5px] text-[var(--text-muted)] mt-1">ISO 527-3 Yield Strength</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-primary)]">
                <div className="text-[var(--text-muted)] font-medium mb-1.5">Approved Food Applications:</div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedMat.typicalUses.map((app: string) => (
                    <span key={app} className="px-2 py-0.5 rounded bg-[var(--bg-card)] border border-[var(--border-secondary)] text-[var(--text-primary)] font-medium text-[11px]">
                      {app}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--border-secondary)] flex items-center justify-between gap-3">
              <span className="text-[11px] text-[var(--text-muted)] truncate">FDA 21 CFR § 177 & EU 10/2011 Verified</span>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    const tdsContent = `FOOD PACKAGING TECHNICAL SPECIFICATION SHEET (TDS)
==================================================
Substrate ID: ${selectedMat.id}
Material Name: ${selectedMat.name}
Polymer/Substrate Classification: ${selectedMat.type}
Adoption Rate: ${selectedMat.sharePercentage}%

BARRIER PROPERTIES:
- WVTR (Water Vapor Transmission Rate): ${selectedMat.wvtrBarrier} (ASTM F1249)
- OTR (Oxygen Transmission Rate): ${selectedMat.otrBarrier} (ASTM D3985)
- Tensile Yield Strength: ${selectedMat.tensileStrength} (ISO 527-3)

SUSTAINABILITY & COMPLIANCE:
- Cradle-to-gate CO2 Footprint: ${selectedMat.co2Footprint}
- Recyclability Designation: ${selectedMat.recyclability}
- Biodegradability Profile: ${selectedMat.biodegradability}
- Regulatory Status: FDA 21 CFR § 177 & EU Framework Regulation 1935/2004

APPROVED FOOD APPLICATIONS:
${selectedMat.typicalUses.map(u => `- ${u}`).join('\n')}
==================================================
Generated via PackWise Packaging Engine`;
                    const blob = new Blob([tdsContent], { type: 'text/plain;charset=utf-8' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `TDS-${selectedMat.id}-${selectedMat.name.replace(/\s+/g, '_')}.txt`;
                    document.body.appendChild(link);
                    link.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="px-3 py-1.5 bg-[var(--badge-completed-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/30 hover:bg-[var(--brand-primary)] hover:text-[var(--brand-text)] text-xs font-semibold rounded-lg cursor-pointer transition-colors flex items-center gap-1.5"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span>Download TDS</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMat(null)}
                  className="px-4 py-1.5 bg-[var(--brand-primary)] text-[var(--brand-text)] hover:bg-[var(--brand-secondary)] text-xs font-semibold rounded-lg cursor-pointer transition-colors"
                >
                  Close TDS
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
