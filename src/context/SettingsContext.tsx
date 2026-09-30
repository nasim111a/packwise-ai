import React, { createContext, useContext, useState, useEffect } from 'react';

export type BarrierUnit = 'metric' | 'imperial';
export type ComplianceStandard = 'iso' | 'fda' | 'fssai';
export type TempUnit = 'celsius' | 'fahrenheit';
export type FoodSafetyStandard = 'iso22000' | 'fda_cfr' | 'fssai' | 'codex';
export type CompostabilityStandard = 'en13432' | 'astm_d6400' | 'is_17088' | 'none';
export type ReportingRegion = 'global' | 'eu' | 'us' | 'india';
export type ReportFormat = 'csv' | 'summary';
export type BarrierPrecision = 'standard' | 'high';
export type TestConditions = 'astm_standard' | 'tropical';

interface SettingsState {
  barrierUnits: BarrierUnit;
  complianceStandard: ComplianceStandard;
  tempUnit: TempUnit;
  notificationsEnabled: boolean;
  foodSafetyStandard: FoodSafetyStandard;
  compostabilityStandard: CompostabilityStandard;
  reportingRegion: ReportingRegion;
  defaultReportFormat: ReportFormat;
  barrierPrecision: BarrierPrecision;
  testConditions: TestConditions;
  setBarrierUnits: (unit: BarrierUnit) => void;
  setComplianceStandard: (standard: ComplianceStandard) => void;
  setTempUnit: (unit: TempUnit) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setFoodSafetyStandard: (standard: FoodSafetyStandard) => void;
  setCompostabilityStandard: (standard: CompostabilityStandard) => void;
  setReportingRegion: (region: ReportingRegion) => void;
  saveSettings: (newSettings: Partial<SettingsState>) => void;
}

const SettingsContext = createContext<SettingsState | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [barrierUnits, setBarrierUnits] = useState<BarrierUnit>(() => {
    return (localStorage.getItem('packwise_barrier_units') as BarrierUnit) || 'metric';
  });
  const [complianceStandard, setComplianceStandard] = useState<ComplianceStandard>(() => {
    return (localStorage.getItem('packwise_compliance_standard') as ComplianceStandard) || 'iso';
  });
  const [tempUnit, setTempUnit] = useState<TempUnit>(() => {
    return (localStorage.getItem('packwise_temp_unit') as TempUnit) || 'celsius';
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(() => {
    return localStorage.getItem('packwise_notifications') !== 'false';
  });
  const [foodSafetyStandard, setFoodSafetyStandard] = useState<FoodSafetyStandard>(() => {
    return (localStorage.getItem('packwise_food_safety_standard') as FoodSafetyStandard) || 'iso22000';
  });
  const [compostabilityStandard, setCompostabilityStandard] = useState<CompostabilityStandard>(() => {
    return (localStorage.getItem('packwise_compostability_standard') as CompostabilityStandard) || 'en13432';
  });
  const [reportingRegion, setReportingRegion] = useState<ReportingRegion>(() => {
    return (localStorage.getItem('packwise_reporting_region') as ReportingRegion) || 'global';
  });
  const [defaultReportFormat, setDefaultReportFormat] = useState<ReportFormat>(() => {
    return (localStorage.getItem('packwise_report_format') as ReportFormat) || 'csv';
  });
  const [barrierPrecision, setBarrierPrecision] = useState<BarrierPrecision>(() => {
    return (localStorage.getItem('packwise_barrier_precision') as BarrierPrecision) || 'standard';
  });
  const [testConditions, setTestConditions] = useState<TestConditions>(() => {
    return (localStorage.getItem('packwise_test_conditions') as TestConditions) || 'astm_standard';
  });

  const saveSettings = (newSettings: Partial<SettingsState>) => {
    if (newSettings.barrierUnits) {
      setBarrierUnits(newSettings.barrierUnits);
      localStorage.setItem('packwise_barrier_units', newSettings.barrierUnits);
    }
    if (newSettings.complianceStandard) {
      setComplianceStandard(newSettings.complianceStandard);
      localStorage.setItem('packwise_compliance_standard', newSettings.complianceStandard);
    }
    if (newSettings.tempUnit) {
      setTempUnit(newSettings.tempUnit);
      localStorage.setItem('packwise_temp_unit', newSettings.tempUnit);
    }
    if (newSettings.notificationsEnabled !== undefined) {
      setNotificationsEnabled(newSettings.notificationsEnabled);
      localStorage.setItem('packwise_notifications', String(newSettings.notificationsEnabled));
    }
    if (newSettings.foodSafetyStandard) {
      setFoodSafetyStandard(newSettings.foodSafetyStandard);
      localStorage.setItem('packwise_food_safety_standard', newSettings.foodSafetyStandard);
    }
    if (newSettings.compostabilityStandard) {
      setCompostabilityStandard(newSettings.compostabilityStandard);
      localStorage.setItem('packwise_compostability_standard', newSettings.compostabilityStandard);
    }
    if (newSettings.reportingRegion) {
      setReportingRegion(newSettings.reportingRegion);
      localStorage.setItem('packwise_reporting_region', newSettings.reportingRegion);
    }
    if (newSettings.defaultReportFormat) {
      setDefaultReportFormat(newSettings.defaultReportFormat);
      localStorage.setItem('packwise_report_format', newSettings.defaultReportFormat);
    }
    if (newSettings.barrierPrecision) {
      setBarrierPrecision(newSettings.barrierPrecision);
      localStorage.setItem('packwise_barrier_precision', newSettings.barrierPrecision);
    }
    if (newSettings.testConditions) {
      setTestConditions(newSettings.testConditions);
      localStorage.setItem('packwise_test_conditions', newSettings.testConditions);
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        barrierUnits,
        complianceStandard,
        tempUnit,
        notificationsEnabled,
        foodSafetyStandard,
        compostabilityStandard,
        reportingRegion,
        defaultReportFormat,
        barrierPrecision,
        testConditions,
        setBarrierUnits: (u) => saveSettings({ barrierUnits: u }),
        setComplianceStandard: (s) => saveSettings({ complianceStandard: s }),
        setTempUnit: (t) => saveSettings({ tempUnit: t }),
        setNotificationsEnabled: (n) => saveSettings({ notificationsEnabled: n }),
        setFoodSafetyStandard: (s) => saveSettings({ foodSafetyStandard: s }),
        setCompostabilityStandard: (c) => saveSettings({ compostabilityStandard: c }),
        setReportingRegion: (r) => saveSettings({ reportingRegion: r }),
        saveSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
