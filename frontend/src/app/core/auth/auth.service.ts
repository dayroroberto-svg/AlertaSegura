import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { ApiResponse, LoginRequest, RegisterRequest, UserSession } from './auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = 'http://localhost:8080/api/auth';
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
      .pipe(tap((response) => this.saveSession(response.data, remember)));
  }

  register(data: RegisterRequest): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(`${this.apiUrl}/registro`, data);
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
    sessionStorage.removeItem(this.storageKey);
    this.sessionState.set(null);
    void this.router.navigateByUrl('/login');
  }

  isAuthenticated(): boolean {
    return !!this.sessionState()?.token;
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
}
