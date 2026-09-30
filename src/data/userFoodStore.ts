import { FoodRecord, ProductStateType, SensitivityLevel, RespirationLevel, RiskLevel, FOOD_DATABASE, registerUserFoodsGetter } from './foodDatabase';
import { FoodProfile, PackagingAnalysis } from '../types/packaging';

const USER_FOODS_STORAGE_KEY = 'packwise_user_food_database';

export interface UserFoodRecord extends Omit<FoodRecord, 'source'> {
  source: 'user';
  description?: string;
  storage: {
    condition: 'ambient' | 'chilled' | 'frozen';
    temperature?: {
      min?: number | string;
      max?: number | string;
    };
    humidity?: {
      min?: number | string;
      max?: number | string;
    };
  };
  degradationFactors: string[];
  packagingConsiderations?: string;
  advancedTechnicalData?: {
    waterActivity?: string;
    pH?: string;
    moistureContentPercent?: string;
    respirationRateNumerical?: string;
    otrRequirement?: string;
    wvtrRequirement?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Memory cache
let cachedUserFoods: UserFoodRecord[] | null = null;
const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (e) {
      console.error('Error notifying user food listener', e);
    }
  });
}

/**
 * Load user foods from localStorage
 */
export function getUserFoods(): UserFoodRecord[] {
  if (cachedUserFoods !== null) {
    return cachedUserFoods;
  }

  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = localStorage.getItem(USER_FOODS_STORAGE_KEY);
    if (!raw) {
      cachedUserFoods = [];
      return cachedUserFoods;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      cachedUserFoods = parsed;
      return cachedUserFoods;
    }
    cachedUserFoods = [];
    return cachedUserFoods;
  } catch (err) {
    console.error('Failed to load user foods from localStorage:', err);
    cachedUserFoods = [];
    return cachedUserFoods;
  }
}

/**
 * Save a new user food profile
 */
export function saveUserFood(record: UserFoodRecord): void {
  const current = getUserFoods();
  // Filter out any existing item with the same ID
  const updated = [record, ...current.filter((item) => item.id !== record.id)];
  cachedUserFoods = updated;

  try {
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      window.localStorage.setItem(USER_FOODS_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('packwise_user_foods_changed'));
    }
  } catch (err) {
    console.error('Failed to save user food to localStorage:', err);
  }

  notifyListeners();
}

/**
 * Update an existing user food profile
 */
export function updateUserFood(id: string, updates: Partial<UserFoodRecord>): boolean {
  const current = getUserFoods();
  const index = current.findIndex((item) => item.id === id);
  if (index === -1) {
    return false;
  }

  const existing = current[index];
  const updatedRecord: UserFoodRecord = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  const updated = [...current];
  updated[index] = updatedRecord;
  cachedUserFoods = updated;

  try {
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      window.localStorage.setItem(USER_FOODS_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('packwise_user_foods_changed'));
    }
  } catch (err) {
    console.error('Failed to update user food in localStorage:', err);
  }

  notifyListeners();
  return true;
}

/**
 * Delete a user food profile
 */
export function deleteUserFood(id: string): boolean {
  const current = getUserFoods();
  const filtered = current.filter((item) => item.id !== id);
  if (filtered.length === current.length) {
    return false;
  }

  cachedUserFoods = filtered;

  try {
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      window.localStorage.setItem(USER_FOODS_STORAGE_KEY, JSON.stringify(filtered));
      window.dispatchEvent(new Event('packwise_user_foods_changed'));
    }
  } catch (err) {
    console.error('Failed to delete user food from localStorage:', err);
  }

  notifyListeners();
  return true;
}

/**
 * Check if a food name already exists (within same category or overall)
 */
export function checkDuplicateFoodName(name: string, category?: string, excludeId?: string): {
  exists: boolean;
  sameCategory: boolean;
  existingFood?: FoodRecord | UserFoodRecord;
} {
  const clean = name.trim().toLowerCase();
  if (!clean) return { exists: false, sameCategory: false };

  // Check user foods first
  const userFoods = getUserFoods();
  const matchedUser = userFoods.find(
    (f) => f.name.toLowerCase() === clean && (!excludeId || f.id !== excludeId)
  );
  if (matchedUser) {
    const sameCat = !category || matchedUser.category.toLowerCase() === category.toLowerCase() || matchedUser.backendCategory.toLowerCase() === category.toLowerCase();
    return { exists: true, sameCategory: sameCat, existingFood: matchedUser };
  }

  // Check system foods
  const matchedSys = FOOD_DATABASE.find(
    (f) => f.name.toLowerCase() === clean && (!excludeId || f.id !== excludeId)
  );
  if (matchedSys) {
    const sameCat = !category || matchedSys.category.toLowerCase() === category.toLowerCase() || matchedSys.backendCategory.toLowerCase() === category.toLowerCase();
    return { exists: true, sameCategory: sameCat, existingFood: matchedSys };
  }

  return { exists: false, sameCategory: false };
}

/**
 * Convert UserFoodRecord to display FoodProfile for FoodDatabaseView
 */
export function convertUserFoodToFoodProfile(item: UserFoodRecord): FoodProfile {
  let optimalTemp = 'Not provided';
  if (item.storage.temperature?.min !== undefined && item.storage.temperature?.max !== undefined && item.storage.temperature.min !== '' && item.storage.temperature.max !== '') {
    optimalTemp = `${item.storage.temperature.min}°C – ${item.storage.temperature.max}°C (${item.storage.condition})`;
  } else if (item.storage.condition) {
    optimalTemp = `${item.storage.condition === 'ambient' ? 'Ambient (~20°C)' : item.storage.condition === 'chilled' ? 'Chilled (2–8°C)' : 'Frozen (-18°C)'}`;
  }

  let optimalRH = 'Not provided';
  if (item.storage.humidity?.min !== undefined && item.storage.humidity?.max !== undefined && item.storage.humidity.min !== '' && item.storage.humidity.max !== '') {
    optimalRH = `${item.storage.humidity.min}% – ${item.storage.humidity.max}% RH`;
  }

  const awVal = item.advancedTechnicalData?.waterActivity?.trim()
    ? item.advancedTechnicalData.waterActivity.trim()
    : 'Not provided';

  const respRate: FoodProfile['respirationRate'] =
    item.characteristics.respiration === 'High'
      ? 'High'
      : item.characteristics.respiration === 'Medium'
      ? 'Moderate'
      : item.characteristics.respiration === 'Low'
      ? 'Low'
      : 'Very Low';

  const degFactors = item.degradationFactors && item.degradationFactors.length > 0
    ? item.degradationFactors
    : [
        `${item.characteristics.moistureSensitivity} moisture sensitivity`,
        `${item.characteristics.oxygenSensitivity} oxidation risk`,
      ];

  const reqSummary = [
    item.packagingRequirements.oxygenBarrier !== 'Low' ? `${item.packagingRequirements.oxygenBarrier} O₂ barrier` : null,
    item.packagingRequirements.moistureBarrier !== 'Low' ? `${item.packagingRequirements.moistureBarrier} H₂O barrier` : null,
    item.packagingRequirements.gasPermeability === 'Controlled' ? 'Controlled breathability' : null,
  ].filter(Boolean).join(', ') || 'Standard protective packaging';

  return {
    id: item.id,
    name: item.name,
    category: item.backendCategory || item.category,
    waterActivity: awVal as any,
    respirationRate: respRate,
    ethyleneSensitivity: item.characteristics.oxygenSensitivity === 'High' ? 'Medium' : 'Low',
    optimalTemp,
    optimalRH,
    keyDegradationFactors: degFactors,
    recommendedPackagingMethod: `${reqSummary}${item.packagingRequirements.mapSuitability ? ' (MAP suitable)' : ''}`,
    source: 'user',
    description: item.description,
    packagingConsiderations: item.packagingConsiderations,
    advancedData: item.advancedTechnicalData,
  };
}

/**
 * Subscribe to changes in user foods
 */
export function subscribeUserFoods(callback: () => void): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

// Automatically register getter so lookupFoodInDatabase resolves user-added foods
registerUserFoodsGetter(getUserFoods);

