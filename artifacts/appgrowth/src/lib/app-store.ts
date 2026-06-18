/**
 * useAppStore – a lightweight localStorage-backed store for user's connected apps.
 * Apps selected from the landing search bar are persisted here.
 */

export interface StoredApp {
  id: string;           // appId from iTunes / Play Store
  name: string;
  developer: string;
  platform: "iOS" | "Android";
  iconUrl: string | null;
  rating: number | null;
  bundleId: string;
  storeUrl: string;
  addedAt: string;      // ISO timestamp
}

const STORAGE_KEY = "appversal_my_apps";

function readFromStorage(): StoredApp[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredApp[]) : [];
  } catch {
    return [];
  }
}

function writeToStorage(apps: StoredApp[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
  } catch {
    // quota exceeded or private mode – silently ignore
  }
}

/** Add an app (no-op if already present by id). Returns the updated list. */
export function addApp(app: StoredApp): StoredApp[] {
  const current = readFromStorage();
  if (current.some((a) => a.id === app.id)) return current;
  const updated = [app, ...current];
  writeToStorage(updated);
  return updated;
}

/** Remove an app by id. Returns the updated list. */
export function removeApp(id: string): StoredApp[] {
  const updated = readFromStorage().filter((a) => a.id !== id);
  writeToStorage(updated);
  return updated;
}

/** Return all stored apps. */
export function getApps(): StoredApp[] {
  return readFromStorage();
}

/** Check if an app is already saved. */
export function hasApp(id: string): boolean {
  return readFromStorage().some((a) => a.id === id);
}
