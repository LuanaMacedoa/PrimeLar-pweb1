import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from '../environments/environment';

export interface Usuario {
  id: number;
  nome: string;
  sobrenome?: string;
  email: string;
  roles: string[];
  inativo?: boolean;
}

interface AuthApiResponse {
  id: number;
  name: string;
  email: string;
  roles: string[];
  token: string;
  expiresAt: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = environment.apiUrl;
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private readonly storageKey = 'primelar:user';
  private readonly tokenKey = 'primelar:token';

  user = signal<Usuario | null>(this.loadUser());

  get isLoggedIn(): boolean {
    return this.user() !== null && this.getAccessToken() !== null;
  }

  async login(email: string, password: string): Promise<string> {
    const response = await lastValueFrom(
      this.http.post<AuthApiResponse>(`${this.API}/auth/login`, { email, password })
    ).catch((error: unknown) => {
      throw new Error(this.extractMessage(error, 'E-mail ou senha inválidos.'));
    });

    if (!response?.token) {
      throw new Error('Resposta inválida do servidor.');
    }

    this.applySession(response);
    return response.roles[0] ?? 'USER';
  }

  async register(data: {
    nome: string;
    sobrenome: string;
    email: string;
    senha: string;
  }): Promise<string> {
    const payload = {
      firstname: data.nome,
      lastname: data.sobrenome,
      email: data.email,
      password: data.senha,
    };

    const response = await lastValueFrom(
      this.http.post<AuthApiResponse>(`${this.API}/auth/register`, payload)
    ).catch((error: unknown) => {
      throw new Error(this.extractMessage(error, 'Erro ao criar conta. Tente novamente.'));
    });

    if (!response?.token) {
      throw new Error('Resposta inválida do servidor.');
    }

    this.applySession(response);
    return response.roles[0] ?? 'USER';
  }

  private extractMessage(error: unknown, fallback: string): string {
    if (error instanceof HttpErrorResponse) {
      return error.error?.message ?? fallback;
    }
    return fallback;
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem(this.storageKey);
      sessionStorage.removeItem(this.tokenKey);
    }
    this.user.set(null);
  }

  async deactivateAccount(): Promise<boolean> {
    this.logout();
    return true;
  }

  getAccessToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    return sessionStorage.getItem(this.tokenKey);
  }

  private applySession(response: AuthApiResponse): void {
    const usuario: Usuario = {
      id: response.id,
      nome: response.name,
      email: response.email,
      roles: response.roles,
    };
    this.user.set(usuario);
    this.persistUser(usuario);
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem(this.tokenKey, response.token);
    }
  }

  private loadUser(): Usuario | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    const raw = sessionStorage.getItem(this.storageKey);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as Usuario;
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
