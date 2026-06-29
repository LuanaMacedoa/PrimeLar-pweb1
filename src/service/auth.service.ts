import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, lastValueFrom } from 'rxjs';
import { environment } from '../environments/environment';

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
  private readonly API = environment.supabaseUrl || 'http://localhost:8080';
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private readonly storageKey = 'primelar:user';

  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  private isLoggedIn$ = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isLoggedIn$.asObservable();
  
  user = signal<Usuario | null>(this.loadUser());

  async login(email: string, password: string): Promise<boolean> {
    try {
      const response = await lastValueFrom(
        this.http.post<{ name: string; token: string }>(`${this.API}/auth/login`, { email, password })
      );
      if (response && response.token) {
        this.accessToken = response.token;
        this.isLoggedIn$.next(true);
        const usuario: Usuario = {
          id: 0,
          nome: response.name,
          email: email,
          role: 'USER'
        };
        this.user.set(usuario);
        this.persistUser(usuario);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }

  logout(): void {
    this.clearLocalSession();
  }

  private clearLocalSession(): void {
    this.accessToken = null;
    this.refreshToken = null;
    this.isLoggedIn$.next(false);
    this.user.set(null);
    this.persistUser(null);
  }

  async register(data: {
    nome: string;
    sobrenome: string;
    email: string;
    senha: string;
  }): Promise<boolean> {
    try {
      const payload = {
        firstname: data.nome,
        lastname: data.sobrenome,
        email: data.email,
        password: data.senha
      };
      const response = await lastValueFrom(
        this.http.post<{ name: string; token: string }>(`${this.API}/auth/register`, payload)
      );
      if (response && response.token) {
        this.accessToken = response.token;
        this.isLoggedIn$.next(true);
        const usuario: Usuario = {
          id: 0,
          nome: response.name,
          email: data.email,
          role: 'USER'
        };
        this.user.set(usuario);
        this.persistUser(usuario);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  }

  async deactivateAccount(): Promise<boolean> {
    this.logout();
    return true;
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