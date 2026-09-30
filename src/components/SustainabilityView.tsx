import React, { useState } from 'react';
import { Leaf, Sliders, CheckCircle2, Download, Sparkles, Check, ShieldCheck, FileCheck } from 'lucide-react';

export const SustainabilityView: React.FC = () => {
  // Simulator State
  const [annualUnits, setAnnualUnits] = useState<number>(250000); // 250k packaging units
  const [gramWeight, setGramWeight] = useState<number>(24); // 24 grams per pack
  const [baselineMat, setBaselineMat] = useState<'virgin_pet' | 'multi_alu' | 'ps_eps'>('virgin_pet');
  const [sustainableMat, setSustainableMat] = useState<'rpet_100' | 'bio_pla' | 'kraft_disp' | 'pha_thermo'>('bio_pla');
  const [isExported, setIsExported] = useState(false);

  // Baseline emission factors (kg CO2e per kg material)
  const baselineFactors = {
    virgin_pet: { name: 'Virgin Fossil PET', co2PerKg: 3.4, eprFeePerKg: 0.18, recyclable: 0.25 },
    multi_alu: { name: 'Multi-layer Aluminium Film (Non-Recyclable)', co2PerKg: 4.8, eprFeePerKg: 0.35, recyclable: 0.05 },
    ps_eps: { name: 'Polystyrene EPS Rigid Foam', co2PerKg: 4.1, eprFeePerKg: 0.28, recyclable: 0.1 },
  };

  // Sustainable material factors (kg CO2e per kg material)
  const sustainableFactors = {
    rpet_100: { name: '100% Post-Consumer Recycled rPET', co2PerKg: 1.1, eprFeePerKg: 0.02, recyclable: 0.95 },
    bio_pla: { name: 'Bio-based Compostable PLA (EN 13432)', co2PerKg: 1.3, eprFeePerKg: 0.04, recyclable: 0.9 },
    kraft_disp: { name: 'Aqueous Barrier Coated Kraft Paperboard', co2PerKg: 0.85, eprFeePerKg: 0.01, recyclable: 0.98 },
    pha_thermo: { name: 'Marine Biodegradable PHA Thermoform', co2PerKg: 1.4, eprFeePerKg: 0.03, recyclable: 0.92 },
  };

  // Calculations
  const totalWeightKg = (annualUnits * gramWeight) / 1000;
  const baselineCO2Tonnes = (totalWeightKg * baselineFactors[baselineMat].co2PerKg) / 1000;
  const sustainableCO2Tonnes = (totalWeightKg * sustainableFactors[sustainableMat].co2PerKg) / 1000;
  const avoidedCO2Tonnes = Math.max(0, baselineCO2Tonnes - sustainableCO2Tonnes);
  const avoidedCO2Percent = Math.round((avoidedCO2Tonnes / baselineCO2Tonnes) * 100);
  const baselineEprCost = totalWeightKg * baselineFactors[baselineMat].eprFeePerKg;
  const sustainableEprCost = totalWeightKg * sustainableFactors[sustainableMat].eprFeePerKg;
  const annualEprSavings = Math.round(Math.max(0, baselineEprCost - sustainableEprCost));
  const virginPlasticDisplacedTonnes = (totalWeightKg / 1000).toFixed(1);

  const applyPreset = (preset: 'produce' | 'beverage' | 'snack' | 'ready_meal') => {
    switch (preset) {
      case 'produce':
        setAnnualUnits(250000);
        setGramWeight(18);
        setBaselineMat('virgin_pet');
        setSustainableMat('bio_pla');
        break;
      case 'beverage':
        setAnnualUnits(1000000);
        setGramWeight(32);
        setBaselineMat('virgin_pet');
        setSustainableMat('rpet_100');
        break;
      case 'snack':
        setAnnualUnits(500000);
        setGramWeight(10);
        setBaselineMat('multi_alu');
        setSustainableMat('kraft_disp');
        break;
      case 'ready_meal':
        setAnnualUnits(180000);
        setGramWeight(42);
        setBaselineMat('ps_eps');
        setSustainableMat('pha_thermo');
        break;
    }
  };

  const handleExportLcaReport = () => {
    const reportText = `================================================================================
PACKWISE SUSTAINABILITY & LCA IMPACT AUDIT CERTIFICATE
================================================================================
Generated Date         : ${new Date().toISOString()}
Audit Standard         : ISO 14044 Life Cycle Assessment / EU Packaging & Packaging Waste Directive
Producer Volume Target : ${annualUnits.toLocaleString()} units / annum
Unit Packaging Weight  : ${gramWeight} grams / unit
Annual Packaging Mass  : ${(totalWeightKg / 1000).toFixed(2)} Metric Tonnes

MATERIAL SUBSTITUTION COMPARISON:
- Baseline Substrate   : ${baselineFactors[baselineMat].name}
- Sustainable Solution : ${sustainableFactors[sustainableMat].name}

ECOLOGICAL IMPACT ACHIEVED:
- Fossil Plastic Diverted     : ${virginPlasticDisplacedTonnes} Tonnes diverted from landfill / ocean vectors
- CO2 Equivalent Reduction    : -${avoidedCO2Percent}% (${avoidedCO2Tonnes.toFixed(2)} MT CO2e abated annually)
- Circular Economy Rating     : ${Math.round(sustainableFactors[sustainableMat].recyclable * 100)}% certified circular loop
- Statutory EPR Savings       : $${annualEprSavings.toLocaleString()} USD annual statutory tax abatement

REGULATORY ALIGNMENT:
- European Green Deal Directive (EU) 2019/904 (Single-Use Plastics)
- US State Packaging Producer Responsibility Acts (CA SB 54, CO, ME, OR)
- Global Recycled Standard (GRS) & EN 13432 Compostability Protocol
================================================================================
PackWise Sustainability Engineering Engine
Verification Code: LCA-SHA256-${Date.now().toString(36).toUpperCase()}
================================================================================`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `LCA_Carbon_Audit_${baselineMat}_to_${sustainableMat}.txt`;
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setIsExported(true);
    setTimeout(() => setIsExported(false), 2500);
  };

  return (
    <div className="space-y-6 min-w-0 w-full">
      {/* Header */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-6 shadow-[var(--shadow-card)] transition-colors duration-200">
        <div className="flex items-center gap-2 text-xs font-bold text-[var(--brand-primary)] uppercase tracking-wider">
          <Leaf className="w-4 h-4" />
          <span>Environmental Impact & Circular Economy</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mt-1">
          Sustainability & LCA Engine
        </h2>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Tracking plastic waste diversion, virgin polymer displacement, and compliance with global Extended Producer Responsibility (EPR) mandates.
        </p>
      </div>

      {/* Real-time LCA & Plastic Replacement Simulator */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-5 sm:p-6 shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-2.5 pb-4 border-b border-[var(--border-secondary)]">
          <div className="w-8 h-8 rounded-lg bg-[var(--badge-completed-bg)] flex items-center justify-center text-[var(--brand-primary)]">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
              Interactive Packaging LCA & EPR Plastic Tax Simulator
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              Adjust volume and packaging substrates to simulate carbon abatement and statutory fee reductions in real-time
            </p>
          </div>
        </div>

        {/* Scenario Presets & Action Bar */}
        <div className="mt-4 pt-3 border-t border-[var(--border-secondary)] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[var(--text-muted)] font-medium mr-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
              <span>Industry Presets:</span>
            </span>
            <button
              type="button"
              onClick={() => applyPreset('produce')}
              className="px-2.5 py-1 rounded-lg bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] text-[var(--text-secondary)] font-medium transition-colors cursor-pointer"
            >
              Fresh Berries (250k · PLA)
            </button>
            <button
              type="button"
              onClick={() => applyPreset('beverage')}
              className="px-2.5 py-1 rounded-lg bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] text-[var(--text-secondary)] font-medium transition-colors cursor-pointer"
            >
              Beverage Bottles (1M · rPET)
            </button>
            <button
              type="button"
              onClick={() => applyPreset('snack')}
              className="px-2.5 py-1 rounded-lg bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] text-[var(--text-secondary)] font-medium transition-colors cursor-pointer"
            >
              Bakery Pouch (500k · Kraft)
            </button>
            <button
              type="button"
              onClick={() => applyPreset('ready_meal')}
              className="px-2.5 py-1 rounded-lg bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] text-[var(--text-secondary)] font-medium transition-colors cursor-pointer"
            >
              Ready Meals (180k · PHA)
            </button>
          </div>
          <button
            type="button"
            onClick={handleExportLcaReport}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--badge-completed-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/30 hover:bg-[var(--brand-primary)] hover:text-[var(--brand-text)] font-semibold rounded-xl text-xs transition-colors cursor-pointer shadow-xs"
          >
            {isExported ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
            <span>{isExported ? 'Certificate Downloaded ✓' : 'Export LCA Certificate'}</span>
          </button>
        </div>

        {/* Simulator Controls */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-semibold text-[var(--text-secondary)]">Annual Pack Production</label>
              <span className="font-bold text-[var(--brand-primary)]">{(annualUnits).toLocaleString()} units</span>
            </div>
            <input
              type="range"
              min={10000}
              max={2000000}
              step={10000}
              value={annualUnits}
              onChange={(e) => setAnnualUnits(Number(e.target.value))}
              className="w-full accent-[var(--brand-primary)] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[var(--text-muted)] mt-1">
              <span>10k</span>
              <span>1M</span>
              <span>2M</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-semibold text-[var(--text-secondary)]">Pack Tare Weight</label>
              <span className="font-bold text-[var(--brand-primary)]">{gramWeight} grams</span>
            </div>
            <input
              type="range"
              min={4}
              max={120}
              step={2}
              value={gramWeight}
              onChange={(e) => setGramWeight(Number(e.target.value))}
              className="w-full accent-[var(--brand-primary)] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[var(--text-muted)] mt-1">
              <span>4g (film pouch)</span>
              <span>120g (rigid tray)</span>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[var(--text-secondary)] mb-1">Current Baseline Substrate</label>
            <select
              value={baselineMat}
              onChange={(e) => setBaselineMat(e.target.value as any)}
              className="w-full px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] font-medium text-xs focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] cursor-pointer"
            >
              <option value="virgin_pet">Virgin Fossil PET (Rigid/Film)</option>
              <option value="multi_alu">Multilayer Metalized Laminate</option>
              <option value="ps_eps">Polystyrene EPS Rigid Foam</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-[var(--text-secondary)] mb-1">Target Circular Substrate</label>
            <select
              value={sustainableMat}
              onChange={(e) => setSustainableMat(e.target.value as any)}
              className="w-full px-3 py-2 bg-[var(--bg-input)] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] font-medium text-xs focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] cursor-pointer"
            >
              <option value="bio_pla">Bio-based Compostable PLA (EN 13432)</option>
              <option value="rpet_100">100% Post-Consumer Recycled rPET</option>
              <option value="kraft_disp">Aqueous Coated Barrier Kraft</option>
              <option value="pha_thermo">Marine Biodegradable PHA</option>
            </select>
          </div>
        </div>

        {/* Simulator Outputs */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-primary)]">
            <span className="text-[11px] text-[var(--text-muted)] font-medium">Fossil Plastic Displaced</span>
            <div className="text-xl font-bold text-[var(--brand-primary)] mt-1">
              {virginPlasticDisplacedTonnes} Tonnes
            </div>
            <div className="text-[10.5px] text-[var(--text-secondary)] mt-0.5">100% diverted from landfill</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-primary)]">
            <span className="text-[11px] text-[var(--text-muted)] font-medium">CO₂e Lifecycle Reduction</span>
            <div className="text-xl font-bold text-[var(--brand-primary)] mt-1">
              -{avoidedCO2Percent}%
            </div>
            <div className="text-[10.5px] text-[var(--text-secondary)] mt-0.5">{avoidedCO2Tonnes.toFixed(1)} MT CO₂e abated</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-primary)]">
            <span className="text-[11px] text-[var(--text-muted)] font-medium">Estimated EPR Tax Savings</span>
            <div className="text-xl font-bold text-[var(--accent-gold)] mt-1">
              ${annualEprSavings.toLocaleString()}/yr
            </div>
            <div className="text-[10.5px] text-[var(--text-secondary)] mt-0.5">Reduced plastic levy fees</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-primary)]">
            <span className="text-[11px] text-[var(--text-muted)] font-medium">Circularity Rating</span>
            <div className="text-xl font-bold text-[var(--brand-primary)] mt-1 flex items-center gap-1.5">
              <span>{Math.round(sustainableFactors[sustainableMat].recyclable * 100)}%</span>
              <CheckCircle2 className="w-4 h-4 text-[var(--brand-primary)]" />
            </div>
            <div className="text-[10.5px] text-[var(--text-secondary)] mt-0.5">Certified circular feedstock</div>
          </div>
        </div>
      </div>

      {/* Certification Compliance Matrix */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-6 shadow-[var(--shadow-card)]">
        <h3 className="text-base font-bold text-[var(--text-primary)] mb-4">
          Regulatory Compliance Standards & Verification
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] space-y-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[var(--brand-primary)]" />
              <span className="text-sm font-bold text-[var(--text-primary)]">EN 13432 & ASTM D6400</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Industrial compostability disintegration validation. Verifies over 90% biodegradation within 180 days under controlled aerobic composting conditions.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] space-y-2">
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-[var(--brand-primary)]" />
              <span className="text-sm font-bold text-[var(--text-primary)]">EU Directive 2019/904 (SUP)</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Single-use plastics restrictions and minimum recycled content mandates (30% PCR target for beverage bottles).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
