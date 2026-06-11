import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { USER_LOGIN_API } from '../config';

export interface AuthUser {
  email: string;
  fullName: string;
  userId: string;
}

const STORAGE_KEY = 'qc-auth-user';

function hashEmail(email: string): string {
  let h = 5381;
  for (let i = 0; i < email.length; i++) {
    h = ((h << 5) + h) ^ email.charCodeAt(i);
    h = h >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  readonly user = signal<AuthUser | null>(this.rehydrate());

  login(email: string, fullName: string) {
    const userId = hashEmail(email);
    return this.http.post(USER_LOGIN_API, { userId, email, fullName }).pipe(
      map(() => {
        const user: AuthUser = { email, fullName, userId  };
        this.user.set(user);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        } catch {}
        return user;
      }),
      catchError(() => {
        const user: AuthUser = { email, fullName, userId };
        this.user.set(user);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        } catch {}
        return of(user);
      }),
    );
  }

  logout(): void {
    this.user.set(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }

  private rehydrate(): AuthUser | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed?.email && parsed?.fullName) {
        return {
          email: parsed.email,
          fullName: parsed.fullName,
          userId: parsed.userId ?? hashEmail(parsed.email),
        };
      }
    } catch {}
    return null;
  }
}
