import type { CoverLetter, Experience } from "@/lib/types";
import type { StorageClient } from "./storageClient";

const EXPERIENCES_KEY = "jss:experiences:v1";
const COVER_LETTERS_KEY = "jss:cover-letters:v1";

function isBrowser() {
  return typeof window !== "undefined";
}

function readList<T>(key: string): T[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeList<T>(key: string, list: T[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(key, JSON.stringify(list));
}

function newId() {
  return crypto.randomUUID();
}

function nowIso() {
  return new Date().toISOString();
}

export const localStorageClient: StorageClient = {
  async listExperiences() {
    return readList<Experience>(EXPERIENCES_KEY).sort((a, b) =>
      b.updatedAt.localeCompare(a.updatedAt),
    );
  },

  async getExperience(id) {
    const list = readList<Experience>(EXPERIENCES_KEY);
    return list.find((e) => e.id === id) ?? null;
  },

  async createExperience(input) {
    const list = readList<Experience>(EXPERIENCES_KEY);
    const ts = nowIso();
    const experience: Experience = { ...input, id: newId(), createdAt: ts, updatedAt: ts };
    writeList(EXPERIENCES_KEY, [...list, experience]);
    return experience;
  },

  async updateExperience(id, patch) {
    const list = readList<Experience>(EXPERIENCES_KEY);
    const idx = list.findIndex((e) => e.id === id);
    if (idx === -1) throw new Error(`Experience not found: ${id}`);
    const updated: Experience = { ...list[idx], ...patch, id, updatedAt: nowIso() };
    const next = [...list];
    next[idx] = updated;
    writeList(EXPERIENCES_KEY, next);
    return updated;
  },

  async deleteExperience(id) {
    const list = readList<Experience>(EXPERIENCES_KEY);
    writeList(
      EXPERIENCES_KEY,
      list.filter((e) => e.id !== id),
    );
  },

  async listCoverLetters() {
    return readList<CoverLetter>(COVER_LETTERS_KEY).sort((a, b) =>
      b.updatedAt.localeCompare(a.updatedAt),
    );
  },

  async getCoverLetter(id) {
    const list = readList<CoverLetter>(COVER_LETTERS_KEY);
    return list.find((c) => c.id === id) ?? null;
  },

  async createCoverLetter(input) {
    const list = readList<CoverLetter>(COVER_LETTERS_KEY);
    const ts = nowIso();
    const coverLetter: CoverLetter = { ...input, id: newId(), createdAt: ts, updatedAt: ts };
    writeList(COVER_LETTERS_KEY, [...list, coverLetter]);
    return coverLetter;
  },

  async updateCoverLetter(id, patch) {
    const list = readList<CoverLetter>(COVER_LETTERS_KEY);
    const idx = list.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error(`CoverLetter not found: ${id}`);
    const updated: CoverLetter = { ...list[idx], ...patch, id, updatedAt: nowIso() };
    const next = [...list];
    next[idx] = updated;
    writeList(COVER_LETTERS_KEY, next);
    return updated;
  },

  async deleteCoverLetter(id) {
    const list = readList<CoverLetter>(COVER_LETTERS_KEY);
    writeList(
      COVER_LETTERS_KEY,
      list.filter((c) => c.id !== id),
    );
  },
};
