import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface Usuario {
  id: number;
  nome: string;
  sobrenome?: string;
  email: string;
  role?: string;
  inativo?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = environment.supabaseUrl;
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private readonly storageKey = 'primelar:user';

  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  private isLoggedIn$ = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isLoggedIn$.asObservable();
  
  user = signal<Usuario | null>(this.loadUser());


  login(credentials: { email: string; password: string }): Observable<AuthTokens> {
    return this.http.post<AuthTokens>(`${this.API}/auth/login`, credentials).pipe(
      tap(tokens => {
        this.setTokens(tokens);
      })
    );
  }

  logout(): void {
    this.http.post(`${this.API}/auth/logout`, {}).subscribe({
      next: () => this.clearLocalSession(),
      error: () => this.clearLocalSession()
    });
  }

  private clearLocalSession(): void {
    this.accessToken = null;
    this.refreshToken = null;
    this.isLoggedIn$.next(false);
    this.user.set(null);
    this.persistUser(null);
  }

  refresh(): Observable<AuthTokens> {
    return this.http.post<AuthTokens>(`${this.API}/auth/refresh`, {
      refreshToken: this.refreshToken
    }).pipe(
      tap(tokens => this.setTokens(tokens))
    );
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  private setTokens(tokens: AuthTokens): void {
    this.accessToken = tokens.accessToken;
    this.refreshToken = tokens.refreshToken;
    this.isLoggedIn$.next(true);
  }

  private loadUser(): Usuario | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    const rawUser = sessionStorage.getItem(this.storageKey);
    if (!rawUser) return null;
    try {
      return JSON.parse(rawUser) as Usuario;
    } catch {
      sessionStorage.removeItem(this.storageKey);
      return null;
    }
  }

  private persistUser(user: Usuario | null): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!user) {
      sessionStorage.removeItem(this.storageKey);
      return;
    }
    sessionStorage.setItem(this.storageKey, JSON.stringify(user));
  }
}
