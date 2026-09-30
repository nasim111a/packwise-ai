import { PackagingAnalysis } from '../types/packaging';

/**
 * Safely escapes a string value for standard RFC 4180 CSV output
 */
function escapeCSV(val: string | number | undefined | null): string {
  if (val === undefined || val === null) return '""';
  const str = String(val);
  // If string contains comma, quote, or newline, wrap in quotes and double internal quotes
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

/**
 * Exports multiple packaging analyses as a clean, spreadsheet-ready CSV file
 */
export function exportAnalysisHistoryCSV(
  analyses: PackagingAnalysis[],
  filenamePrefix = 'packwise-packaging-analysis-history'
): void {
  const headers = [
    'Analysis ID',
    'Product Name',
    'Category',
    'Status',
    'Date of Analysis',
    'Primary Recommended Material',
    'Secondary Alternative Material',
    'Target Shelf Life',
    'Shelf Life Gain',
    'Oxygen Transmission Rate (OTR)',
    'Water Vapor Transmission Rate (WVTR)',
    'Storage Environment Condition',
    'Logistics & Transit Mode',
    'Modified Atmosphere (MAP) Gas Mix',
    'Sustainability Score (1-100)',
    'Lifecycle Carbon Impact',
    'Food Science & Engineering Notes',
  ];

  const rows = analyses.map((item) => [
    escapeCSV(item.id),
    escapeCSV(item.product),
    escapeCSV(item.category),
    escapeCSV(item.status),
    escapeCSV(item.date),
    escapeCSV(item.recommendedMaterial),
    escapeCSV(item.secondaryMaterial || 'N/A'),
    escapeCSV(item.targetShelfLife),
    escapeCSV(item.shelfLifeGain),
    escapeCSV(item.otRate),
    escapeCSV(item.wvtRate),
    escapeCSV(item.storageCondition),
    escapeCSV(item.transitMethod),
    escapeCSV(item.mapGasMix || 'Ambient equilibrium'),
    escapeCSV(item.sustainabilityRating),
    escapeCSV(item.co2Reduction),
    escapeCSV(item.notes || ''),
  ]);

  // Combine headers and rows
  const csvContent =
    '\uFEFF' + // UTF-8 Byte Order Mark for Excel compatibility
    [headers.map(escapeCSV).join(','), ...rows.map((row) => row.join(','))].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  link.download = `${filenamePrefix}-${dateStr}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports a single packaging analysis as a formatted key-value CSV dossier
 */
export function exportSingleAnalysisCSV(analysis: PackagingAnalysis): void {
  const records = [
    ['Field', 'Specification Value'],
    ['Reference ID', analysis.id],
    ['Food Commodity', analysis.product],
    ['Category Classification', analysis.category],
    ['Audit Status', analysis.status],
    ['Date Evaluated', analysis.date],
    ['Primary Recommended Substrate', analysis.recommendedMaterial],
    ['Secondary Alternative Option', analysis.secondaryMaterial || 'N/A'],
    ['Target Shelf Life', analysis.targetShelfLife],
    ['Shelf Life Gain Achieved', analysis.shelfLifeGain],
    ['Oxygen Transmission Rate (OTR)', analysis.otRate],
    ['Water Vapor Transmission Rate (WVTR)', analysis.wvtRate],
    ['Target Storage Environment', analysis.storageCondition],
    ['Logistics & Transit Mode', analysis.transitMethod],
    ['Modified Atmosphere Gas Mix (MAP)', analysis.mapGasMix || 'Ambient equilibrium'],
    ['Sustainability Circularity Score', `${analysis.sustainabilityRating} / 100`],
    ['Lifecycle Carbon Abatement', analysis.co2Reduction],
    ['Food Science & Engineering Notes', analysis.notes || ''],
    ['Compliance Standard', 'US FDA 21 CFR § 177 / EU 10/2011 / ISO 22000'],
  ];

  const csvContent =
    '\uFEFF' +
    records.map((row) => `${escapeCSV(row[0])},${escapeCSV(row[1])}`).join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const safeName = analysis.product.toLowerCase().replace(/[^a-z0-9]/g, '_');
  link.download = `packwise_${analysis.id}_${safeName}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
