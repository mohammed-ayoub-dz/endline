const DB_NAME = "PomodoroDB";
const DB_VERSION = 1;
const NOTES_STORE = "notes";
const SETTINGS_STORE = "settings";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(NOTES_STORE)) {
        db.createObjectStore(NOTES_STORE, { keyPath: "id", autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(SETTINGS_STORE)) {
        db.createObjectStore(SETTINGS_STORE, { keyPath: "id" });
      }
    };
  });
}

export async function saveNote(content: string): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(NOTES_STORE, "readwrite");
  const store = tx.objectStore(NOTES_STORE);
  store.add({ content, createdAt: new Date().toISOString() });
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getNotes(): Promise<{ id: number; content: string; createdAt: string }[]> {
  const db = await openDB();
  const tx = db.transaction(NOTES_STORE, "readonly");
  const store = tx.objectStore(NOTES_STORE);
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

export async function deleteNote(id: number): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(NOTES_STORE, "readwrite");
  const store = tx.objectStore(NOTES_STORE);
  store.delete(id);
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function saveSettings(workDuration: number, breakDuration: number): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(SETTINGS_STORE, "readwrite");
  const store = tx.objectStore(SETTINGS_STORE);
  store.put({ id: "main", workDuration, breakDuration });
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getSettings(): Promise<{ workDuration: number; breakDuration: number } | null> {
  const db = await openDB();
  const tx = db.transaction(SETTINGS_STORE, "readonly");
  const store = tx.objectStore(SETTINGS_STORE);
  return new Promise((resolve) => {
    const request = store.get("main");
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => resolve(null);
  });
}