import { Injectable, signal } from '@angular/core';

type ThemeMode = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly theme = signal<ThemeMode>('light');

  

    constructor() {
    this.syncTheme(this.getInitialTheme());
  }

    toggleTheme(): void {
    this.syncTheme(this.theme() === 'dark' ? 'light' : 'dark');
  }

  private getInitialTheme(): ThemeMode {
    try {
      const storedTheme = localStorage.getItem('qc-theme');
      if (storedTheme === 'light' || storedTheme === 'dark') return storedTheme;
    } catch {}

    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    return 'light';
  }

  private syncTheme(theme: ThemeMode): void {
    this.theme.set(theme);

    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }

    try {
      localStorage.setItem('qc-theme', theme);
    } catch {}
  }
}
