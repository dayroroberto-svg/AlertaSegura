import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { ApiResponse, LoginRequest, RegisterRequest, UserSession } from './auth.models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private readonly storageKey = 'alertasegura_session';
  private readonly sessionState = signal<UserSession | null>(this.readSession());

  readonly session = this.sessionState.asReadonly();

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
  ) {}

  login(credentials: LoginRequest, remember = true): Observable<ApiResponse<UserSession>> {
    return this.http
      .post<ApiResponse<UserSession>>(`${this.apiUrl}/login`, credentials)
      .pipe(
        map((response) => {
          if (!response.success || !response.data?.token) {
            throw new Error(response.message || 'No se pudo iniciar sesión');
          }
          return response;
        }),
        tap((response) => {
          this.saveSession(response.data, remember);
          this.router.navigateByUrl('/dashboard');
        }),
      );
  }

  register(data: RegisterRequest): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(`${this.apiUrl}/registro`, data).pipe(
      map((response) => {
        if (!response.success) {
          throw new Error(response.message || 'No se pudo crear la cuenta');
        }
        return response;
      }),
    );
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
    sessionStorage.removeItem(this.storageKey);
    this.sessionState.set(null);
    void this.router.navigateByUrl('/login');
  }

  isAuthenticated(): boolean {
    const session = this.sessionState();
    if (!session?.token || this.isTokenExpired(session.token)) {
      this.clearSession();
      return false;
    }
    return true;
  }

  token(): string | null {
    return this.sessionState()?.token ?? null;
  }

  private saveSession(session: UserSession, remember: boolean): void {
    const storage = remember ? localStorage : sessionStorage;
    localStorage.removeItem(this.storageKey);
    sessionStorage.removeItem(this.storageKey);
    storage.setItem(this.storageKey, JSON.stringify(session));
    this.sessionState.set(session);
  }

  private readSession(): UserSession | null {
    const savedSession = localStorage.getItem(this.storageKey) ?? sessionStorage.getItem(this.storageKey);
    if (!savedSession) {
      return null;
    }

    try {
      return JSON.parse(savedSession) as UserSession;
    } catch {
      localStorage.removeItem(this.storageKey);
      sessionStorage.removeItem(this.storageKey);
      return null;
    }
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(this.decodeBase64Url(token.split('.')[1])) as { exp?: number };
      return typeof payload.exp !== 'number' || payload.exp * 1000 <= Date.now();
    } catch {
      return true;
    }
  }

  private decodeBase64Url(value: string): string {
    const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    return decodeURIComponent(
      Array.from(atob(padded))
        .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`)
        .join(''),
    );
  }

  private clearSession(): void {
    localStorage.removeItem(this.storageKey);
    sessionStorage.removeItem(this.storageKey);
    this.sessionState.set(null);
  }
}
