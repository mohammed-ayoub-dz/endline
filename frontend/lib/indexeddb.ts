
const DB_NAME = "EndlineDB";
const DB_VERSION = 1;
const VIDEO_STORE = "videoProgress";
const POMODORO_STORE = "pomodoroState";

export interface VideoProgress {
  videoId: string;
  watchedSeconds: number;
  updatedAt: number;
}

export interface PomodoroState {
  id: "main";
  phase: "work" | "break";
  timeLeft: number;
  isActive: boolean;
  workDuration: number;
  breakDuration: number;
  position?: { x: number; y: number };
  size?: "small" | "medium" | "large";
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(VIDEO_STORE)) {
        db.createObjectStore(VIDEO_STORE, { keyPath: "videoId" });
      }
      if (!db.objectStoreNames.contains(POMODORO_STORE)) {
        db.createObjectStore(POMODORO_STORE, { keyPath: "id" });
      }
    };
  });
}

export async function saveVideoProgress(videoId: string, watchedSeconds: number): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(VIDEO_STORE, "readwrite");
  const store = tx.objectStore(VIDEO_STORE);
  store.put({ videoId, watchedSeconds, updatedAt: Date.now() });
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getVideoProgress(videoId: string): Promise<number> {
  const db = await openDB();
  const tx = db.transaction(VIDEO_STORE, "readonly");
  const store = tx.objectStore(VIDEO_STORE);
  return new Promise((resolve) => {
    const request = store.get(videoId);
    request.onsuccess = () => resolve(request.result?.watchedSeconds || 0);
    request.onerror = () => resolve(0);
  });
}

export async function getAllVideoProgress(): Promise<VideoProgress[]> {
  const db = await openDB();
  const tx = db.transaction(VIDEO_STORE, "readonly");
  const store = tx.objectStore(VIDEO_STORE);
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

export async function savePomodoroState(state: Omit<PomodoroState, "id">): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(POMODORO_STORE, "readwrite");
  const store = tx.objectStore(POMODORO_STORE);
  store.put({ id: "main", ...state });
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getPomodoroState(): Promise<PomodoroState | null> {
  const db = await openDB();
  const tx = db.transaction(POMODORO_STORE, "readonly");
  const store = tx.objectStore(POMODORO_STORE);
  return new Promise((resolve) => {
    const request = store.get("main");
    request.onsuccess = () => {
      const result = request.result;
      if (result) {
        resolve(result as PomodoroState);
      } else {
        resolve(null);
      }
    };
    request.onerror = () => resolve(null);
  });
}

export async function clearAllData(): Promise<void> {
  const db = await openDB();
  const tx = db.transaction([VIDEO_STORE, POMODORO_STORE], "readwrite");
  tx.objectStore(VIDEO_STORE).clear();
  tx.objectStore(POMODORO_STORE).clear();
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}