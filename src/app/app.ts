import { Component, CUSTOM_ELEMENTS_SCHEMA, AfterViewInit, OnDestroy, signal } from '@angular/core';
import { EXAMPLE_ORG_ID, QRATI_SCRIPT_URL } from './config';

type ThemeMode = 'light' | 'dark';

const GITHUB_ORG = 'qrati-labs';
const REPO = 'qrati-connect-angular-example';

@Component({
  selector: 'app-root',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements AfterViewInit, OnDestroy {
  readonly orgId = EXAMPLE_ORG_ID;
  readonly theme = signal<ThemeMode>('light');
  readonly repoUrl = `https://github.com/${GITHUB_ORG}/${REPO}`;
  readonly vscodeUrl = `https://vscode.dev/github/${GITHUB_ORG}/${REPO}`;
  readonly currentYear = new Date().getFullYear();

  private scriptEl?: HTMLScriptElement;
  private ownsScript = false;

  constructor() {
    this.syncTheme(this.getInitialTheme());
  }

  ngAfterViewInit(): void {
    const existingScript = document.querySelector(`script[src="${QRATI_SCRIPT_URL}"]`);

    if (existingScript instanceof HTMLScriptElement) {
      this.scriptEl = existingScript;

return;
    }

    const s = document.createElement('script');
    s.type = 'module';
    s.src = QRATI_SCRIPT_URL;
    document.head.appendChild(s);
    this.scriptEl = s;
    this.ownsScript = true;
  }

  ngOnDestroy(): void {
    if (this.ownsScript) {
      this.scriptEl?.remove();
    }
  }

  toggleTheme(): void {
    this.syncTheme(this.theme() === 'dark' ? 'light' : 'dark');
  }

  private getInitialTheme(): ThemeMode {
    try {
      const storedTheme = localStorage.getItem('qc-theme');

      if (storedTheme === 'light' || storedTheme === 'dark') {
        return storedTheme;
      }
    } catch {
      // Ignore storage access issues and fall back to media preference.
    }

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
    } catch {
      // Ignore storage access issues in restricted environments.
    }
  }
}
