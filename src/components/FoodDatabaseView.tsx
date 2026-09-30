import React, { useState, useEffect } from 'react';
import {
  Wheat,
  Search,
  AlertTriangle,
  ArrowRight,
  Info,
  X,
  Thermometer,
  Droplet,
  Wind,
  FileDown,
  Check,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  Sliders,
  Shield,
  Layers,
} from 'lucide-react';
import { FOOD_DATABASE_ITEMS } from '../data/mockPackagingData';
import { FoodProfile } from '../types/packaging';
import {
  getUserFoods,
  deleteUserFood,
  UserFoodRecord,
  convertUserFoodToFoodProfile,
  subscribeUserFoods,
} from '../data/userFoodStore';
import { AddFoodModal } from './AddFoodModal';

interface FoodDatabaseViewProps {
  onSelectFoodForAnalysis: (name: string, category: string) => void;
}

export const FoodDatabaseView: React.FC<FoodDatabaseViewProps> = ({
  onSelectFoodForAnalysis,
}) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [inspectFood, setInspectFood] = useState<FoodProfile | null>(null);
  const [downloadedProfile, setDownloadedProfile] = useState(false);

  // Add / Edit Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<UserFoodRecord | null>(null);
  const [preFillName, setPreFillName] = useState('');

  // Delete Confirmation state
  const [deleteConfirmFood, setDeleteConfirmFood] = useState<UserFoodRecord | null>(null);

  // Toast message state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // User foods state (reactive to localStorage)
  const [userFoods, setUserFoods] = useState<UserFoodRecord[]>(() => getUserFoods());

  useEffect(() => {
    // Listen to changes in user foods
    const unsubscribe = subscribeUserFoods(() => {
      setUserFoods(getUserFoods());
    });
    const handleStorage = () => setUserFoods(getUserFoods());
    window.addEventListener('packwise_user_foods_changed', handleStorage);
    window.addEventListener('storage', handleStorage);

    return () => {
      unsubscribe();
      window.removeEventListener('packwise_user_foods_changed', handleStorage);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3500);
  };

  const categories = [
    'All',
    'Fruits & Vegetables',
    'Grains & Pulses',
    'Dairy Products',
    'Meat & Poultry',
    'Bakery & Snacks',
    'Beverages',
    'Spices & Condiments',
    'Processed Foods',
    'Frozen Foods',
    'Other',
  ];

  // System foods with explicit source
  const systemFoods: FoodProfile[] = FOOD_DATABASE_ITEMS.map((item) => ({
    ...item,
    source: 'system' as const,
  }));

  // User-added foods converted to FoodProfile
  const convertedUserFoods: FoodProfile[] = userFoods.map((uf) =>
    convertUserFoodToFoodProfile(uf)
  );

  // Combined foods list (user-added first so newly added commodities appear prominently)
  const combinedFoods: FoodProfile[] = [...convertedUserFoods, ...systemFoods];

  const filteredFoods = combinedFoods.filter((item) => {
    const matchesQuery =
      item.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(filterQuery.toLowerCase());
    const matchesCat =
      selectedCategory === 'All' || item.category === selectedCategory;
    return matchesQuery && matchesCat;
  });

  const handleDownloadProfile = (food: FoodProfile) => {
    const text = `COMMODITY PHYSIOLOGICAL & SPOILAGE PROFILE
==================================================
Food Commodity     : ${food.name}
Reference ID       : ${food.id}
Classification     : ${food.category}
Data Source        : ${food.source === 'user' ? 'User Added Profile' : 'System Knowledge Base'}

PHYSICAL & BIOCHEMICAL TRAITS:
- Water Activity (aw) : ${food.waterActivity}
- Respiration Rate   : ${food.respirationRate}
- Optimal Temperature: ${food.optimalTemp}
- Optimal Humidity   : ${food.optimalRH}

CRITICAL DEGRADATION VECTORS:
${food.keyDegradationFactors.map((f) => `- ${f}`).join('\n')}

PACKAGING ENGINEERING REQUIREMENTS:
- Primary barrier objective: Prevent moisture migration & control gas equilibrium.
- Recommended Method: ${food.recommendedPackagingMethod}
- Recommended compliance standards: US FDA 21 CFR § 177 / EU 10/2011 / ISO 22000.
==================================================
PackWise Food Science Repository`;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Profile_${food.id}_${food.name.replace(/\s+/g, '_')}.txt`;
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setDownloadedProfile(true);
    setTimeout(() => setDownloadedProfile(false), 2500);
  };

  const handleEditUserFood = (foodId: string) => {
    const found = userFoods.find((uf) => uf.id === foodId);
    if (found) {
      setEditingFood(found);
      setPreFillName(found.name);
      setIsAddModalOpen(true);
    }
  };

  const handleDeleteUserFoodPrompt = (foodId: string) => {
    const found = userFoods.find((uf) => uf.id === foodId);
    if (found) {
      setDeleteConfirmFood(found);
    }
  };

  const confirmDelete = () => {
    if (deleteConfirmFood) {
      deleteUserFood(deleteConfirmFood.id);
      showToast('Food profile removed from database.');
      setDeleteConfirmFood(null);
    }
  };

  return (
    <div className="space-y-6 min-w-0 w-full">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-700 text-white text-xs font-semibold shadow-2xl animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-200" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* View Header */}
      <div className="min-w-0 w-full overflow-hidden bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-6 shadow-[var(--shadow-card)] transition-colors duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs font-bold text-[var(--brand-primary)] uppercase tracking-wider">
              <Wheat className="w-4 h-4 shrink-0" />
              <span>Food Science Repository</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mt-1 truncate">
              Food Physiological & Spoilage Profiles
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Cross-referenced database of water activities, respiration kinetics, and barrier requirements.
            </p>
          </div>

          {/* Action Row: Search Input + Add Food Button */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
            <div className="relative w-full sm:w-64 shrink-0">
              <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Filter food commodities..."
                className="w-full pl-10 pr-4 py-2 text-xs bg-[var(--bg-input)] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] placeholder:text-[var(--text-muted)]"
              />
            </div>

            {/* + Add Food primary button (Requirement #1) */}
            <button
              type="button"
              onClick={() => {
                setEditingFood(null);
                setPreFillName('');
                setIsAddModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[var(--brand-primary)] text-[var(--brand-text)] hover:bg-[var(--brand-secondary)] text-xs font-semibold rounded-xl cursor-pointer shadow-xs transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Food</span>
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="mt-4 pt-4 border-t border-[var(--border-secondary)] flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[var(--brand-primary)] text-[var(--brand-text)] font-semibold shadow-xs'
                  : 'bg-[var(--bg-card-elevated)] text-[var(--text-secondary)] border border-[var(--border-primary)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Food Profiles or Empty State */}
      {filteredFoods.length === 0 ? (
        /* Empty State (Requirement #17) */
        <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-10 text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-[var(--badge-completed-bg)] text-[var(--brand-primary)] flex items-center justify-center">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              {filterQuery.trim()
                ? `No food commodities found matching '${filterQuery}'`
                : 'No food commodities found in this category'}
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-md mx-auto">
              {filterQuery.trim()
                ? `Would you like to add '${filterQuery}' as a food commodity to your database?`
                : 'Add a new food profile to the packaging knowledge database.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setEditingFood(null);
              setPreFillName(filterQuery.trim());
              setIsAddModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--brand-primary)] text-[var(--brand-text)] hover:bg-[var(--brand-secondary)] text-xs font-semibold rounded-xl cursor-pointer shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>
              {filterQuery.trim()
                ? `+ Add '${filterQuery}' as New Food`
                : '+ Add Food'}
            </span>
          </button>
        </div>
      ) : (
        <div className="grid min-w-0 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFoods.map((food) => {
            const isUserAdded = food.source === 'user';
            return (
              <div
                key={food.id}
                className="min-w-0 overflow-hidden bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-5 shadow-[var(--shadow-card)] hover:border-[var(--border-secondary)] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      {/* Badge: USER ADDED vs SYSTEM PROFILE (Requirement #9 & #16) */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] font-semibold text-[var(--brand-primary)] bg-[var(--badge-completed-bg)] px-2 py-0.5 rounded-md border border-[var(--brand-primary)]/20">
                          {food.category}
                        </span>
                        {isUserAdded ? (
                          <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                            USER ADDED
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-[var(--text-muted)] bg-[var(--bg-card-elevated)] px-2 py-0.5 rounded-md border border-[var(--border-secondary)]">
                            SYSTEM PROFILE
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-[var(--text-primary)] mt-2">
                        {food.name}
                      </h3>
                      {food.description && (
                        <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 line-clamp-1">
                          {food.description}
                        </p>
                      )}
                    </div>
                    <span className="text-[11px] font-mono text-[var(--text-muted)] shrink-0">
                      {food.id}
                    </span>
                  </div>

                  {/* Physical Parameters */}
                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] rounded-xl">
                      <div className="text-[10.5px] text-[var(--text-muted)]">Water Activity (aw)</div>
                      <div className="font-bold text-[var(--text-primary)] mt-0.5 truncate">{food.waterActivity}</div>
                    </div>
                    <div className="p-2.5 bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] rounded-xl">
                      <div className="text-[10.5px] text-[var(--text-muted)]">Respiration Rate</div>
                      <div className="font-bold text-[var(--text-primary)] mt-0.5">{food.respirationRate}</div>
                    </div>
                    <div className="p-2.5 bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] rounded-xl col-span-2">
                      <div className="text-[10.5px] text-[var(--text-muted)]">Optimal Conditions</div>
                      <div className="font-semibold text-[var(--text-primary)] mt-0.5 truncate">
                        {food.optimalTemp} · {food.optimalRH}
                      </div>
                    </div>
                  </div>

                  {/* Spoilage Vectors / Degradation Factors */}
                  <div className="mt-3">
                    <div className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-[var(--accent-gold)]" />
                      <span>Degradation Factors</span>
                    </div>
                    <ul className="text-xs text-[var(--text-secondary)] space-y-1 list-disc list-inside">
                      {food.keyDegradationFactors.slice(0, 3).map((f, i) => (
                        <li key={i} className="truncate">{f}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Quick Actions (Requirement #16) */}
                <div className="mt-5 pt-3 border-t border-[var(--border-secondary)] space-y-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setInspectFood(food)}
                      className="flex-1 py-2 px-2.5 bg-[var(--bg-card-elevated)] hover:bg-[var(--bg-card-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-semibold rounded-xl transition-all cursor-pointer border border-[var(--border-primary)] text-center truncate"
                    >
                      Inspect Profile
                    </button>
                    <button
                      type="button"
                      onClick={() => onSelectFoodForAnalysis(food.name, food.category)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 bg-[var(--badge-completed-bg)] hover:bg-[var(--brand-primary)] text-[var(--brand-primary)] hover:text-[var(--brand-text)] text-xs font-semibold rounded-xl transition-all cursor-pointer border border-[var(--brand-primary)]/20 truncate"
                    >
                      <span>Run Analysis</span>
                      <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                    </button>
                  </div>

                  {/* Edit and Delete buttons for User-Added foods */}
                  {isUserAdded && (
                    <div className="flex items-center justify-end gap-2 pt-1 border-t border-dashed border-[var(--border-secondary)]">
                      <button
                        type="button"
                        onClick={() => handleEditUserFood(food.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] rounded-lg transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3 text-[var(--brand-primary)]" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteUserFoodPrompt(food.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Commodity Inspection Modal */}
      {inspectFood && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--modal-overlay)] backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl w-full max-w-lg p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-[var(--border-secondary)]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[var(--badge-completed-bg)] text-[var(--brand-primary)] font-semibold">
                    {inspectFood.id}
                  </span>
                  {inspectFood.source === 'user' ? (
                    <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      USER ADDED
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-[var(--text-muted)] bg-[var(--bg-card-elevated)] px-2 py-0.5 rounded border border-[var(--border-secondary)]">
                      SYSTEM PROFILE
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-[var(--text-primary)] mt-1.5">{inspectFood.name}</h3>
                <p className="text-xs text-[var(--text-secondary)]">{inspectFood.category}</p>
                {inspectFood.description && (
                  <p className="text-xs text-[var(--text-secondary)] mt-1 italic">
                    &ldquo;{inspectFood.description}&rdquo;
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setInspectFood(null)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-primary)]">
                  <div className="flex items-center gap-1 text-[var(--text-muted)] font-medium">
                    <Droplet className="w-3.5 h-3.5 text-[var(--accent-blue)]" />
                    <span>Water Activity (aw)</span>
                  </div>
                  <div className="text-sm font-bold text-[var(--text-primary)] mt-1">{inspectFood.waterActivity}</div>
                  <div className="text-[10.5px] text-[var(--text-muted)] mt-1">Microbial proliferation boundary</div>
                </div>
                <div className="p-3 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-primary)]">
                  <div className="flex items-center gap-1 text-[var(--text-muted)] font-medium">
                    <Wind className="w-3.5 h-3.5 text-[var(--accent-purple)]" />
                    <span>Respiration Dynamics</span>
                  </div>
                  <div className="text-sm font-bold text-[var(--text-primary)] mt-1">{inspectFood.respirationRate}</div>
                  <div className="text-[10.5px] text-[var(--text-muted)] mt-1">O₂ consumption & CO₂ release</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-primary)]">
                <div className="flex items-center gap-1 text-[var(--text-muted)] font-medium mb-1">
                  <Thermometer className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                  <span>Optimal Preservation Conditions</span>
                </div>
                <div className="font-semibold text-sm text-[var(--text-primary)]">
                  {inspectFood.optimalTemp} · {inspectFood.optimalRH}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-primary)]">
                <div className="text-[var(--text-muted)] font-medium mb-1.5 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                  <span>Critical Degradation Vectors & Spoilage Pathways</span>
                </div>
                <ul className="space-y-1 list-disc list-inside text-[var(--text-secondary)]">
                  {inspectFood.keyDegradationFactors.map((factor, idx) => (
                    <li key={idx}>{factor}</li>
                  ))}
                </ul>
              </div>

              {inspectFood.packagingConsiderations && (
                <div className="p-3 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-primary)]">
                  <div className="text-[var(--text-muted)] font-medium mb-1 flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
                    <span>Packaging Considerations</span>
                  </div>
                  <p className="text-[var(--text-secondary)] leading-relaxed">
                    {inspectFood.packagingConsiderations}
                  </p>
                </div>
              )}

              {inspectFood.advancedData && Object.values(inspectFood.advancedData).some(Boolean) && (
                <div className="p-3 rounded-xl bg-[var(--bg-card-elevated)] border border-[var(--border-primary)] space-y-1.5">
                  <div className="text-[var(--text-muted)] font-medium text-[11px] uppercase tracking-wider">
                    Advanced Technical Parameters
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                    {inspectFood.advancedData.pH && (
                      <div>
                        <span className="text-[var(--text-muted)]">pH: </span>
                        <span className="font-semibold text-[var(--text-primary)]">{inspectFood.advancedData.pH}</span>
                      </div>
                    )}
                    {inspectFood.advancedData.moistureContentPercent && (
                      <div>
                        <span className="text-[var(--text-muted)]">Moisture: </span>
                        <span className="font-semibold text-[var(--text-primary)]">{inspectFood.advancedData.moistureContentPercent}</span>
                      </div>
                    )}
                    {inspectFood.advancedData.respirationRateNumerical && (
                      <div>
                        <span className="text-[var(--text-muted)]">Resp: </span>
                        <span className="font-semibold text-[var(--text-primary)]">{inspectFood.advancedData.respirationRateNumerical}</span>
                      </div>
                    )}
                    {inspectFood.advancedData.otrRequirement && (
                      <div>
                        <span className="text-[var(--text-muted)]">OTR: </span>
                        <span className="font-semibold text-[var(--text-primary)]">{inspectFood.advancedData.otrRequirement}</span>
                      </div>
                    )}
                    {inspectFood.advancedData.wvtrRequirement && (
                      <div>
                        <span className="text-[var(--text-muted)]">WVTR: </span>
                        <span className="font-semibold text-[var(--text-primary)]">{inspectFood.advancedData.wvtrRequirement}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[var(--border-secondary)] flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleDownloadProfile(inspectFood)}
                className="px-3 py-1.5 bg-[var(--bg-card-elevated)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-primary)] text-xs font-semibold rounded-lg text-[var(--text-primary)] flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                {downloadedProfile ? (
                  <Check className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
                ) : (
                  <FileDown className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
                )}
                <span>{downloadedProfile ? 'Downloaded ✓' : 'Download Profile'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const targetFood = inspectFood;
                  setInspectFood(null);
                  onSelectFoodForAnalysis(targetFood.name, targetFood.category);
                }}
                className="px-4 py-1.5 bg-[var(--brand-primary)] text-[var(--brand-text)] hover:bg-[var(--brand-secondary)] text-xs font-semibold rounded-lg cursor-pointer transition-colors flex items-center gap-1.5"
              >
                <span>Run Analysis Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmFood && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--modal-overlay)] backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[var(--text-primary)]">
                  Delete Food Profile?
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  Are you sure you want to delete &ldquo;{deleteConfirmFood.name}&rdquo;? This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="pt-3 border-t border-[var(--border-secondary)] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmFood(null)}
                className="px-3.5 py-1.5 rounded-lg border border-[var(--border-secondary)] bg-[var(--bg-card-elevated)] text-xs text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold cursor-pointer transition-colors shadow-2xs"
              >
                Delete Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Food Modal (Requirement #2) */}
      <AddFoodModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingFood(null);
          setPreFillName('');
        }}
        initialFood={editingFood}
        initialName={preFillName}
        onSuccess={(_food, isEdit) => {
          showToast(
            isEdit
              ? 'Food profile updated successfully.'
              : 'Food profile added to database.'
          );
          setUserFoods(getUserFoods());
        }}
        onViewExisting={(name, cat) => {
          setFilterQuery(name);
          if (categories.includes(cat)) {
            setSelectedCategory(cat);
          } else {
            setSelectedCategory('All');
          }
        }}
      />
    </div>
  );
};
