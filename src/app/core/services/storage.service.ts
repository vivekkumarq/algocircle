import { Injectable } from '@angular/core';

/**
 * The single gateway to `localStorage`.
 *
 * Components never touch `localStorage` directly: keys are namespaced and
 * versioned here so the persisted shape can evolve without corrupting data
 * saved by an earlier build (`algocircle:v1:progress`, ...).
 */
@Injectable({ providedIn: 'root' })
export class StorageService {
  static readonly NAMESPACE = 'algocircle';
  static readonly VERSION = 'v1';

  private readonly prefix = `${StorageService.NAMESPACE}:${StorageService.VERSION}:`;
  private readonly memory = new Map<string, string>();

  /** False in private-mode browsers or any context without a usable Storage. */
  readonly available = this.probe();

  key(name: string): string {
    return this.prefix + name;
  }

  read<T>(name: string, fallback: T): T {
    const raw = this.getRaw(this.key(name));
    if (raw === null) return fallback;
    try {
      return JSON.parse(raw) as T;
    } catch {
      // A corrupt entry should never break the app; drop it and move on.
      this.remove(name);
      return fallback;
    }
  }

  write<T>(name: string, value: T): void {
    try {
      this.setRaw(this.key(name), JSON.stringify(value));
    } catch {
      // Quota exceeded or storage disabled — progress simply is not persisted.
    }
  }

  remove(name: string): void {
    const key = this.key(name);
    this.memory.delete(key);
    if (this.available) localStorage.removeItem(key);
  }

  /** Removes every AlgoCircle key, leaving unrelated site data untouched. */
  clearAll(): void {
    this.memory.clear();
    if (!this.available) return;
    const doomed: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(this.prefix)) doomed.push(key);
    }
    doomed.forEach((key) => localStorage.removeItem(key));
  }

  private getRaw(key: string): string | null {
    if (this.available) return localStorage.getItem(key);
    return this.memory.get(key) ?? null;
  }

  private setRaw(key: string, value: string): void {
    if (this.available) localStorage.setItem(key, value);
    else this.memory.set(key, value);
  }

  private probe(): boolean {
    try {
      if (typeof localStorage === 'undefined') return false;
      const probeKey = `${this.prefix}__probe`;
      localStorage.setItem(probeKey, '1');
      localStorage.removeItem(probeKey);
      return true;
    } catch {
      return false;
    }
  }
}
