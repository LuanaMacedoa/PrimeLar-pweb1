import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { DatabaseService } from './database-service';

export interface Usuario {
  id: number;
  nome: string;
  sobrenome?: string;
  email: string;
  senha?: string;
  inativo?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly db = inject(DatabaseService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly storageKey = 'primelar:user';

  user = signal<Usuario | null>(this.loadUser());

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

  async getUsuario(email: string) {
    const { data, error } = await this.db.supabase
      .from('usuario')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      console.error('Supabase select error (getUsuario):', error);
      return null;
    }

    return data;
  }

  async login(email: string, senha: string) {
    const user = await this.getUsuario(email);

    if (!user) return false;

    if (user.inativo) return false;

    if (user.senha !== senha) return false;

    this.user.set(user);
    this.persistUser(user);
    return true;
  }

  async register(data: {
    nome: string;
    sobrenome: string;
    email: string;
    senha: string;
  }) {
    const { data: inserted, error } = await this.db.supabase
      .from('usuario')
      .insert([{ ...data, inativo: false }])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error (register):', error);
      return false;
    }

    this.user.set(inserted);
    this.persistUser(inserted);
    return true;
  }

  logout() {
    this.user.set(null);
    this.persistUser(null);
  }

  async deactivateAccount(): Promise<boolean> {
    const currentUser = this.user();
    if (!currentUser) return false;

    const { error } = await this.db.supabase
      .from('usuario')
      .update({ inativo: true })
      .eq('id', currentUser.id);

    this.logout();
    return !error;
  }
}