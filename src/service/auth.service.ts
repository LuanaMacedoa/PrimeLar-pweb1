import { Injectable, inject, signal } from '@angular/core';
import { DatabaseService } from './database-service';

export interface Usuario {
  id: number;
  nome: string;
  sobrenome?: string;
  email: string;
  senha?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly db = inject(DatabaseService);

  user = signal<Usuario | null>(null);

  async getUsuario(email: string) {
    const { data, error } = await this.db.supabase
      .from('usuario')
      .select('*')
      .eq('email', email)
      .single();

    if (error) return null;
    return data;
  }

  async login(email: string, senha: string) {
    const user = await this.getUsuario(email);

    if (!user) return false;

    if (user.senha !== senha) return false;

    this.user.set(user);
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
      .insert([data])
      .select()
      .single();

    if (error) return false;

    this.user.set(inserted);
    return true;
  }

  logout() {
    this.user.set(null);
  }
}