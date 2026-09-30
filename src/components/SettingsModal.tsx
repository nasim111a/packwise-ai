import React, { useState, useEffect } from 'react';
import {
  X,
  Settings,
  Bell,
  Check,
  ChevronDown,
  ChevronUp,
  Info,
  Scale,
  Thermometer,
  ShieldCheck,
  Globe,
  SlidersHorizontal,
  FileSpreadsheet,
} from 'lucide-react';
import {
  useSettings,
  BarrierUnit,
  ComplianceStandard,
  TempUnit,
  FoodSafetyStandard,
  CompostabilityStandard,
  ReportingRegion,
  ReportFormat,
  BarrierPrecision,
} from '../context/SettingsContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const {
    barrierUnits,
    complianceStandard,
    tempUnit,
    notificationsEnabled,
    foodSafetyStandard,
    compostabilityStandard,
    reportingRegion,
    defaultReportFormat,
    barrierPrecision,
    saveSettings,
  } = useSettings();

  const [localBarrier, setLocalBarrier] = useState<BarrierUnit>(barrierUnits);
  const [localTemp, setLocalTemp] = useState<TempUnit>(tempUnit);
  const [localNotifs, setLocalNotifs] = useState<boolean>(notificationsEnabled);
  const [localFoodSafety, setLocalFoodSafety] = useState<FoodSafetyStandard>(foodSafetyStandard);
  const [localCompostability, setLocalCompostability] = useState<CompostabilityStandard>(compostabilityStandard);
  const [localRegion, setLocalRegion] = useState<ReportingRegion>(reportingRegion);
  const [localReportFormat, setLocalReportFormat] = useState<ReportFormat>(defaultReportFormat);
  const [localPrecision, setLocalPrecision] = useState<BarrierPrecision>(barrierPrecision);

  const [showBarrierDetails, setShowBarrierDetails] = useState<boolean>(true);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [savedFeedback, setSavedFeedback] = useState(false);

  // Sync state when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalBarrier(barrierUnits);
      setLocalTemp(tempUnit);
      setLocalNotifs(notificationsEnabled);
      setLocalFoodSafety(foodSafetyStandard);
      setLocalCompostability(compostabilityStandard);
      setLocalRegion(reportingRegion);
      setLocalReportFormat(defaultReportFormat);
      setLocalPrecision(barrierPrecision);
      setSavedFeedback(false);
    }
  }, [
    isOpen,
    barrierUnits,
    tempUnit,
    notificationsEnabled,
    foodSafetyStandard,
    compostabilityStandard,
    reportingRegion,
    defaultReportFormat,
    barrierPrecision,
  ]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSave = () => {
    // Determine legacy complianceStandard mapping for backwards compatibility
    let mappedCompliance: ComplianceStandard = complianceStandard;
    if (localFoodSafety === 'fda_cfr') {
      mappedCompliance = 'fda';
    } else if (localFoodSafety === 'fssai') {
      mappedCompliance = 'fssai';
    } else {
      mappedCompliance = 'iso';
    }

    saveSettings({
      barrierUnits: localBarrier,
      complianceStandard: mappedCompliance,
      tempUnit: localTemp,
      notificationsEnabled: localNotifs,
      foodSafetyStandard: localFoodSafety,
      compostabilityStandard: localCompostability,
      reportingRegion: localRegion,
      defaultReportFormat: localReportFormat,
      barrierPrecision: localPrecision,
    });

    setSavedFeedback(true);
    setTimeout(() => {
      setSavedFeedback(false);
      onClose();
    }, 800);
  };

  const isMetric = localBarrier === 'metric';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[var(--modal-overlay)] backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="platform-settings-title"
    >
      <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl w-full max-w-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden transition-colors duration-200">
        
        {/* 1. Modal Header */}
        <div className="px-6 py-5 border-b border-[var(--border-secondary)] flex items-center justify-between bg-[var(--bg-card-elevated)] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--badge-completed-bg)] flex items-center justify-center text-[var(--brand-primary)] border border-[var(--border-primary)] shrink-0">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 id="platform-settings-title" className="text-base font-bold text-[var(--text-primary)] tracking-tight">
                Platform Settings
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Configure packaging engineering units, standards, and notifications.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close settings"
            className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="px-6 py-5 overflow-y-auto space-y-6 text-xs">
          
          {/* 2 & 3. Section: Engineering Units */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-1 border-b border-[var(--border-secondary)]">
              <Scale className="w-4 h-4 text-[var(--brand-primary)]" />
              <div>
                <h4 className="text-[13px] font-bold text-[var(--text-primary)]">Engineering Units</h4>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Choose the measurement system used throughout packaging calculations and reports.
                </p>
              </div>
            </div>

            {/* Measurement System */}
            <div>
              <label className="block text-xs font-semibold text-[var(--text-primary)] mb-2">
                Measurement System
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                
                {/* Metric Option */}
                <button
                  type="button"
                  onClick={() => setLocalBarrier('metric')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                    localBarrier === 'metric'
                      ? 'border-[var(--brand-primary)] bg-[var(--badge-completed-bg)]/40 text-[var(--text-primary)] ring-1 ring-[var(--brand-primary)]/20'
                      : 'border-[var(--border-primary)] bg-[var(--bg-card-elevated)] hover:bg-[var(--bg-card-hover)] text-[var(--text-secondary)]'
                  }`}
                >
                  <div className="flex items-start justify-between w-full mb-1.5">
                    <span className="font-bold text-xs text-[var(--text-primary)]">Metric (SI)</span>
                    {localBarrier === 'metric' && (
                      <span className="w-4 h-4 rounded-full bg-[var(--brand-primary)] text-white flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>
                  <div className="space-y-0.5 text-[11px] text-[var(--text-muted)] font-mono">
                    <div>WVTR: g/m²·24h</div>
                    <div>OTR: cc/m²·24h</div>
                  </div>
                  <div className="mt-2 text-[10px] text-[var(--brand-primary)] font-medium">
                    ISO & DIN standard
                  </div>
                </button>

                {/* US Customary Option */}
                <button
                  type="button"
                  onClick={() => setLocalBarrier('imperial')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                    localBarrier === 'imperial'
                      ? 'border-[var(--brand-primary)] bg-[var(--badge-completed-bg)]/40 text-[var(--text-primary)] ring-1 ring-[var(--brand-primary)]/20'
                      : 'border-[var(--border-primary)] bg-[var(--bg-card-elevated)] hover:bg-[var(--bg-card-hover)] text-[var(--text-secondary)]'
                  }`}
                >
                  <div className="flex items-start justify-between w-full mb-1.5">
                    <span className="font-bold text-xs text-[var(--text-primary)]">US Customary</span>
                    {localBarrier === 'imperial' && (
                      <span className="w-4 h-4 rounded-full bg-[var(--brand-primary)] text-white flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>
                  <div className="space-y-0.5 text-[11px] text-[var(--text-muted)] font-mono">
                    <div>WVTR: g/100 in²·24h</div>
                    <div>OTR: cc/100 in²·24h·atm</div>
                  </div>
                  <div className="mt-2 text-[10px] text-[var(--brand-primary)] font-medium">
                    ASTM standard
                  </div>
                </button>
              </div>
            </div>

            {/* 4. Barrier Property Units (Compact Expandable Detail) */}
            <div className="rounded-xl border border-[var(--border-secondary)] bg-[var(--bg-card-elevated)] overflow-hidden">
              <button
                type="button"
                onClick={() => setShowBarrierDetails(!showBarrierDetails)}
                className="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-[var(--bg-card-hover)] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-[var(--text-primary)]">Barrier Property Units</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--badge-completed-bg)] text-[var(--brand-primary)] font-medium">
                    Auto-synchronized
                  </span>
                </div>
                {showBarrierDetails ? (
                  <ChevronUp className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                )}
              </button>

              {showBarrierDetails && (
                <div className="px-3.5 pb-3 pt-1 border-t border-[var(--border-subtle)] space-y-2.5">
                  {/* WVTR Row */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-secondary)]">
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <button
                          type="button"
                          onMouseEnter={() => setActiveTooltip('wvtr')}
                          onMouseLeave={() => setActiveTooltip(null)}
                          onClick={() => setActiveTooltip(activeTooltip === 'wvtr' ? null : 'wvtr')}
                          className="text-[var(--text-muted)] hover:text-[var(--brand-primary)] cursor-pointer"
                          aria-label="WVTR Information"
                        >
                          <Info className="w-3.5 h-3.5" />
                        </button>
                        {activeTooltip === 'wvtr' && (
                          <div className="absolute left-0 bottom-full mb-1.5 w-60 p-2 bg-[#10251F] text-white text-[11px] rounded-lg shadow-lg z-20 leading-relaxed font-sans">
                            Measures water vapor transmission through a packaging material.
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-[11px] text-[var(--text-primary)]">WVTR</div>
                        <div className="text-[10px] text-[var(--text-muted)]">Water Vapor Transmission Rate</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-xs font-bold text-[var(--brand-primary)]">
                        {isMetric ? 'g/m²·24h' : 'g/100 in²·24h'}
                      </span>
                      <div className="text-[9.5px] text-[var(--text-muted)]">@ 37.8°C, 90% RH</div>
                    </div>
                  </div>

                  {/* OTR Row */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-secondary)]">
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <button
                          type="button"
                          onMouseEnter={() => setActiveTooltip('otr')}
                          onMouseLeave={() => setActiveTooltip(null)}
                          onClick={() => setActiveTooltip(activeTooltip === 'otr' ? null : 'otr')}
                          className="text-[var(--text-muted)] hover:text-[var(--brand-primary)] cursor-pointer"
                          aria-label="OTR Information"
                        >
                          <Info className="w-3.5 h-3.5" />
                        </button>
                        {activeTooltip === 'otr' && (
                          <div className="absolute left-0 bottom-full mb-1.5 w-60 p-2 bg-[#10251F] text-white text-[11px] rounded-lg shadow-lg z-20 leading-relaxed font-sans">
                            Measures oxygen transmission through a packaging material.
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-[11px] text-[var(--text-primary)]">OTR</div>
                        <div className="text-[10px] text-[var(--text-muted)]">Oxygen Transmission Rate</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-xs font-bold text-[var(--brand-primary)]">
                        {isMetric ? 'cc/m²·24h' : 'cc/100 in²·24h·atm'}
                      </span>
                      <div className="text-[9.5px] text-[var(--text-muted)]">@ 23°C, 0% RH, 1 atm</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 5. Temperature Unit */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Thermometer className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
                <label className="text-xs font-semibold text-[var(--text-primary)]">
                  Temperature Unit
                </label>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setLocalTemp('celsius')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    localTemp === 'celsius'
                      ? 'border-[var(--brand-primary)] bg-[var(--badge-completed-bg)]/40 text-[var(--text-primary)] ring-1 ring-[var(--brand-primary)]/20'
                      : 'border-[var(--border-primary)] bg-[var(--bg-card-elevated)] hover:bg-[var(--bg-card-hover)] text-[var(--text-secondary)]'
                  }`}
                >
                  <div>
                    <div className="font-bold text-xs">Celsius (°C)</div>
                    <div className="text-[10px] text-[var(--text-muted)]">Standard thermal unit</div>
                  </div>
                  {localTemp === 'celsius' && (
                    <span className="w-4 h-4 rounded-full bg-[var(--brand-primary)] text-white flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setLocalTemp('fahrenheit')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    localTemp === 'fahrenheit'
                      ? 'border-[var(--brand-primary)] bg-[var(--badge-completed-bg)]/40 text-[var(--text-primary)] ring-1 ring-[var(--brand-primary)]/20'
                      : 'border-[var(--border-primary)] bg-[var(--bg-card-elevated)] hover:bg-[var(--bg-card-hover)] text-[var(--text-secondary)]'
                  }`}
                >
                  <div>
                    <div className="font-bold text-xs">Fahrenheit (°F)</div>
                    <div className="text-[10px] text-[var(--text-muted)]">US storage notation</div>
                  </div>
                  {localTemp === 'fahrenheit' && (
                    <span className="w-4 h-4 rounded-full bg-[var(--brand-primary)] text-white flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* 6. Section: Standards & References */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-1 border-b border-[var(--border-secondary)]">
              <ShieldCheck className="w-4 h-4 text-[var(--brand-primary)]" />
              <div>
                <h4 className="text-[13px] font-bold text-[var(--text-primary)]">Standards & References</h4>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Select the standards and reference frameworks used in technical outputs.
                </p>
              </div>
            </div>

            {/* Food Safety Standard */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[var(--text-primary)]">
                  Food Safety / Management Standard
                </label>
                <span className="text-[10px] text-[var(--text-muted)]">Reference framework</span>
              </div>
              <select
                value={localFoodSafety}
                onChange={(e) => setLocalFoodSafety(e.target.value as FoodSafetyStandard)}
                className="w-full px-3 py-2 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] cursor-pointer"
              >
                <option value="iso22000">ISO 22000:2018 (Food safety management systems)</option>
                <option value="fda_cfr">FDA 21 CFR § 177 (Indirect food additives: polymers)</option>
                <option value="fssai">FSSAI Packaging Regulations 2018 (India)</option>
                <option value="codex">Codex Alimentarius (CAC/RCP 1-1969 Food Hygiene)</option>
              </select>
              <p className="text-[10.5px] text-[var(--text-muted)] leading-relaxed">
                Food safety management system reference for barrier integrity cross-checks.
              </p>
            </div>

            {/* Packaging / Compostability Standard */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[var(--text-primary)]">
                  Packaging / Compostability Standard
                </label>
                <span className="text-[10px] text-[var(--text-muted)]">Reference framework</span>
              </div>
              <select
                value={localCompostability}
                onChange={(e) => setLocalCompostability(e.target.value as CompostabilityStandard)}
                className="w-full px-3 py-2 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] cursor-pointer"
              >
                <option value="en13432">EN 13432 (Compostable packaging & organic recovery)</option>
                <option value="astm_d6400">ASTM D6400 (Solid material aerobic composting specification)</option>
                <option value="is_17088">IS 17088 (Specifications for compostable plastics - India)</option>
                <option value="none">None / Non-Compostable Baseline (Standard multilayer barrier)</option>
              </select>
              <p className="text-[10.5px] text-[var(--text-muted)] leading-relaxed">
                Requirements related to compostable packaging and packaging materials.
              </p>
            </div>

            {/* 7. Reporting Region */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
                <label className="text-xs font-semibold text-[var(--text-primary)]">
                  Reporting Region
                </label>
              </div>
              <select
                value={localRegion}
                onChange={(e) => setLocalRegion(e.target.value as ReportingRegion)}
                className="w-full px-3 py-2 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] cursor-pointer"
              >
                <option value="global">Global (Harmonized Technical Nomenclature)</option>
                <option value="eu">European Union (EU Framework Reg. 1935/2004)</option>
                <option value="us">United States (US FDA & FTC Green Guides)</option>
                <option value="india">India (FSSAI & BIS Standards)</option>
              </select>
              <p className="text-[10.5px] text-[var(--text-muted)] leading-relaxed">
                Adapts regulatory terminology and nomenclature used in generated reports.
              </p>
            </div>

            {/* Note on Reference Standards */}
            <div className="p-2.5 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-subtle)] text-[11px] text-[var(--text-muted)] flex items-start gap-2">
              <Info className="w-4 h-4 text-[var(--brand-primary)] shrink-0 mt-0.5" />
              <span>
                <strong>Reference Standards Notice:</strong> Standards serve as reference benchmarks for material compatibility models and do not substitute for certified lab testing.
              </span>
            </div>
          </div>

          {/* 8. Section: Notifications */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 pb-1 border-b border-[var(--border-secondary)]">
              <Bell className="w-4 h-4 text-[var(--brand-primary)]" />
              <div>
                <h4 className="text-[13px] font-bold text-[var(--text-primary)]">Notifications</h4>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Choose which packaging analysis alerts you want to receive.
                </p>
              </div>
            </div>

            {/* Packaging Alerts Toggle Switch */}
            <div className="p-3.5 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-[var(--text-primary)]">Packaging Alerts</div>
                <div className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                  Notify me about degradation risks, material compatibility issues, and significant analysis changes.
                </div>
              </div>

              {/* Modern Switch Toggle */}
              <button
                type="button"
                role="switch"
                aria-checked={localNotifs}
                onClick={() => setLocalNotifs(!localNotifs)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:ring-offset-1 ${
                  localNotifs ? 'bg-[var(--brand-primary)]' : 'bg-[var(--border-primary)]'
                }`}
              >
                <span className="sr-only">Toggle packaging alerts</span>
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    localNotifs ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* 9. Optional Advanced Settings (Accordion) */}
          <div className="pt-2">
            <div className="rounded-xl border border-[var(--border-secondary)] bg-[var(--bg-card-elevated)] overflow-hidden">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-[var(--bg-card-hover)] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[var(--text-secondary)]" />
                  <span className="font-bold text-xs text-[var(--text-primary)]">Advanced Settings</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[var(--text-muted)] font-medium">
                    {showAdvanced ? 'Collapse' : 'Expand'}
                  </span>
                  {showAdvanced ? (
                    <ChevronUp className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                  )}
                </div>
              </button>

              {showAdvanced && (
                <div className="p-4 border-t border-[var(--border-secondary)] space-y-4 bg-[var(--bg-card)]">
                  {/* Default Report Format */}
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5">
                      Default Report Export Format
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setLocalReportFormat('csv')}
                        className={`p-2 rounded-lg border text-left flex items-center gap-2 transition-colors cursor-pointer ${
                          localReportFormat === 'csv'
                            ? 'border-[var(--brand-primary)] bg-[var(--badge-completed-bg)] text-[var(--brand-primary)] font-bold'
                            : 'border-[var(--border-primary)] bg-[var(--bg-card-elevated)] text-[var(--text-secondary)]'
                        }`}
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5 shrink-0" />
                        <div>
                          <div className="text-[11px]">CSV Spreadsheet Data</div>
                          <div className="text-[9.5px] font-normal text-[var(--text-muted)]">Excel & Sheets ready</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setLocalReportFormat('summary')}
                        className={`p-2 rounded-lg border text-left flex items-center gap-2 transition-colors cursor-pointer ${
                          localReportFormat === 'summary'
                            ? 'border-[var(--brand-primary)] bg-[var(--badge-completed-bg)] text-[var(--brand-primary)] font-bold'
                            : 'border-[var(--border-primary)] bg-[var(--bg-card-elevated)] text-[var(--text-secondary)]'
                        }`}
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5 shrink-0" />
                        <div>
                          <div className="text-[11px]">Executive Summary</div>
                          <div className="text-[9.5px] font-normal text-[var(--text-muted)]">Structured specification</div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Barrier Numerical Precision */}
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5">
                      Barrier Precision Decimals
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setLocalPrecision('standard')}
                        className={`p-2 rounded-lg border text-left transition-colors cursor-pointer ${
                          localPrecision === 'standard'
                            ? 'border-[var(--brand-primary)] bg-[var(--badge-completed-bg)] text-[var(--brand-primary)] font-bold'
                            : 'border-[var(--border-primary)] bg-[var(--bg-card-elevated)] text-[var(--text-secondary)]'
                        }`}
                      >
                        <div className="text-[11px]">Standard Precision</div>
                        <div className="text-[9.5px] font-normal text-[var(--text-muted)]">2 Decimal Places (e.g. 1.25)</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setLocalPrecision('high')}
                        className={`p-2 rounded-lg border text-left transition-colors cursor-pointer ${
                          localPrecision === 'high'
                            ? 'border-[var(--brand-primary)] bg-[var(--badge-completed-bg)] text-[var(--brand-primary)] font-bold'
                            : 'border-[var(--border-primary)] bg-[var(--bg-card-elevated)] text-[var(--text-secondary)]'
                        }`}
                      >
                        <div className="text-[11px]">High Precision</div>
                        <div className="text-[9.5px] font-normal text-[var(--text-muted)]">3 Decimal Places (e.g. 1.250)</div>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 10. Modal Footer */}
        <div className="px-6 py-4 border-t border-[var(--border-secondary)] bg-[var(--bg-card-elevated)] flex items-center justify-between shrink-0">
          <div>
            {savedFeedback ? (
              <span className="text-xs font-semibold text-[var(--brand-primary)] flex items-center gap-1.5 animate-in fade-in">
                <Check className="w-4 h-4" /> Preferences saved successfully!
              </span>
            ) : (
              <span className="text-[11px] text-[var(--text-muted)]">
                Preferences persist across analysis sessions
              </span>
            )}
          </div>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] border border-transparent hover:border-[var(--border-primary)] transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4.5 py-2 rounded-xl bg-[var(--brand-primary)] text-[var(--brand-text)] hover:bg-[var(--brand-secondary)] text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              {savedFeedback ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Saved!
                </>
              ) : (
                'Save Preferences'
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
