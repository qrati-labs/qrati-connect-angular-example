import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth/auth.service';


type ThemeMode = 'light' | 'dark';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './topbar.html',
  styleUrl: './topbar.css',
})
export class Topbar {
  readonly theme = signal<ThemeMode>('light');
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly user = this.auth.user;

  readonly initials = computed(() => {
    const u = this.user();
    if (!u) return '';
    const parts = u.fullName.trim().split(/\s+/);
    return parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : parts[0].slice(0, 2).toUpperCase();
  });

    constructor() {
    this.syncTheme(this.getInitialTheme());
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
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
