"use client";

// IndexedDB utility for local journal entry storage
// Entries are stored only on device for privacy

const DB_NAME = "clarity-journal";
const DB_VERSION = 1;
const ENTRIES_STORE = "entries";

export interface LocalEntry {
    id: string;
    date: string; // ISO date string (YYYY-MM-DD)
    content: string;
    reflection?: string;
    promptShown?: string;
    wordCount: number;
    createdAt: string; // ISO timestamp
    updatedAt: string; // ISO timestamp
}

// Open database connection
function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;

            // Create entries store with indexes
            if (!db.objectStoreNames.contains(ENTRIES_STORE)) {
                const store = db.createObjectStore(ENTRIES_STORE, { keyPath: "id" });
                store.createIndex("date", "date", { unique: false });
                store.createIndex("createdAt", "createdAt", { unique: false });
            }
        };
    });
}

// Generate UUID
function generateId(): string {
    return crypto.randomUUID();
}

// Add new entry
export async function addEntry(entry: Omit<LocalEntry, "id" | "createdAt" | "updatedAt">): Promise<LocalEntry> {
    const db = await openDB();
    const now = new Date().toISOString();

    const newEntry: LocalEntry = {
        ...entry,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
    };

    return new Promise((resolve, reject) => {
        const tx = db.transaction(ENTRIES_STORE, "readwrite");
        const store = tx.objectStore(ENTRIES_STORE);
        const request = store.add(newEntry);

        request.onsuccess = () => resolve(newEntry);
        request.onerror = () => reject(request.error);
    });
}

// Get all entries (ordered by createdAt desc)
export async function getAllEntries(): Promise<LocalEntry[]> {
    const db = await openDB();

    return new Promise((resolve, reject) => {
        const tx = db.transaction(ENTRIES_STORE, "readonly");
        const store = tx.objectStore(ENTRIES_STORE);
        const request = store.getAll();

        request.onsuccess = () => {
            const entries = request.result as LocalEntry[];
            // Sort by createdAt descending
            entries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            resolve(entries);
        };
        request.onerror = () => reject(request.error);
    });
}

// Get entries by date (YYYY-MM-DD)
export async function getEntriesByDate(date: string): Promise<LocalEntry[]> {
    const db = await openDB();

    return new Promise((resolve, reject) => {
        const tx = db.transaction(ENTRIES_STORE, "readonly");
        const store = tx.objectStore(ENTRIES_STORE);
        const index = store.index("date");
        const request = index.getAll(date);

        request.onsuccess = () => {
            const entries = request.result as LocalEntry[];
            // Sort by createdAt descending
            entries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            resolve(entries);
        };
        request.onerror = () => reject(request.error);
    });
}

// Get entry by ID
export async function getEntryById(id: string): Promise<LocalEntry | null> {
    const db = await openDB();

    return new Promise((resolve, reject) => {
        const tx = db.transaction(ENTRIES_STORE, "readonly");
        const store = tx.objectStore(ENTRIES_STORE);
        const request = store.get(id);

        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
    });
}

// Update entry
export async function updateEntry(id: string, updates: Partial<LocalEntry>): Promise<LocalEntry | null> {
    const db = await openDB();
    const existing = await getEntryById(id);
    if (!existing) return null;

    const updated: LocalEntry = {
        ...existing,
        ...updates,
        id, // Ensure ID doesn't change
        updatedAt: new Date().toISOString(),
    };

    return new Promise((resolve, reject) => {
        const tx = db.transaction(ENTRIES_STORE, "readwrite");
        const store = tx.objectStore(ENTRIES_STORE);
        const request = store.put(updated);

        request.onsuccess = () => resolve(updated);
        request.onerror = () => reject(request.error);
    });
}

// Delete entry
export async function deleteEntry(id: string): Promise<boolean> {
    const db = await openDB();

    return new Promise((resolve, reject) => {
        const tx = db.transaction(ENTRIES_STORE, "readwrite");
        const store = tx.objectStore(ENTRIES_STORE);
        const request = store.delete(id);

        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(request.error);
    });
}

// Clear all entries
export async function clearAllEntries(): Promise<void> {
    const db = await openDB();

    return new Promise((resolve, reject) => {
        const tx = db.transaction(ENTRIES_STORE, "readwrite");
        const store = tx.objectStore(ENTRIES_STORE);
        const request = store.clear();

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

// Get all unique dates that have entries
export async function getEntryDates(): Promise<string[]> {
    const entries = await getAllEntries();
    const dates = [...new Set(entries.map((e) => e.date))];
    return dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
}

// Export all entries as JSON
export async function exportEntries(): Promise<string> {
    const entries = await getAllEntries();
    return JSON.stringify({
        version: 1,
        exportedAt: new Date().toISOString(),
        entries,
    }, null, 2);
}

// Import entries from JSON
export async function importEntries(jsonData: string): Promise<number> {
    const data = JSON.parse(jsonData);
    const entries = data.entries as LocalEntry[];
    const db = await openDB();

    let imported = 0;
    for (const entry of entries) {
        await new Promise<void>((resolve, reject) => {
            const tx = db.transaction(ENTRIES_STORE, "readwrite");
            const store = tx.objectStore(ENTRIES_STORE);
            const request = store.put(entry); // put will update if exists

            request.onsuccess = () => {
                imported++;
                resolve();
            };
            request.onerror = () => reject(request.error);
        });
    }

    return imported;
}

// Get today's date string (YYYY-MM-DD)
import { getClientTodayDateString } from "./time-client";

export function getTodayDateString(): string {
    return getClientTodayDateString();
}

// Count total entries
export async function getEntryCount(): Promise<number> {
    const entries = await getAllEntries();
    return entries.length;
}
