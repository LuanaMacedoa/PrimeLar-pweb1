import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from '../environments/environment';
import { AuthService } from './auth.service';

export type AdminRole = 'USER' | 'CORRETOR' | 'ADMIN';

export interface AdminCreateUserPayload {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: AdminRole;
}

export interface AdminUpdateUserPayload {
  firstname: string;
  lastname: string;
  email: string;
  password?: string;
  role: AdminRole;
  active: boolean;
}

export interface AdminUserResponse {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  active: boolean;
  roles: string[];
}

/** Converte o label do formulário para o enum esperado pelo backend */
export function labelParaRole(label: string): AdminRole {
  const map: Record<string, AdminRole> = {
    Administrador: 'ADMIN',
    Corretor: 'CORRETOR',
    Cliente: 'USER',
  };
  return map[label] ?? 'USER';
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly API = environment.apiUrl;
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private get authHeaders() {
    return { Authorization: `Bearer ${this.authService.getAccessToken()}` };
  }

  async listarUsuarios(): Promise<AdminUserResponse[]> {
    try {
      return await lastValueFrom(
        this.http.get<AdminUserResponse[]>(`${this.API}/users`, { headers: this.authHeaders })
      );
    } catch {
      return [];
    }
  }

  async buscarUsuario(id: number): Promise<AdminUserResponse | null> {
    try {
      return await lastValueFrom(
        this.http.get<AdminUserResponse>(`${this.API}/users/${id}`, { headers: this.authHeaders })
      );
    } catch {
      return null;
    }
  }

  /**
   * Cria um usuário com qualquer role (USER, CORRETOR ou ADMIN).
   * Usado pelo painel admin onde o admin escolhe o perfil no formulário.
   * O endpoint /users já é protegido por hasRole("ADMIN").
   */
  async criarUsuario(data: AdminCreateUserPayload): Promise<AdminUserResponse | null> {
    try {
      return await lastValueFrom(
        this.http.post<AdminUserResponse>(`${this.API}/users`, data, { headers: this.authHeaders })
      );
    } catch {
      return null;
    }
  }

  async atualizarUsuario(id: number, data: AdminUpdateUserPayload): Promise<AdminUserResponse | null> {
    try {
      return await lastValueFrom(
        this.http.put<AdminUserResponse>(`${this.API}/users/${id}`, data, { headers: this.authHeaders })
      );
    } catch {
      return null;
    }
  }

  async alterarStatus(id: number, active: boolean, usuario: AdminUserResponse): Promise<AdminUserResponse | null> {
    return this.atualizarUsuario(id, {
      firstname: usuario.firstname,
      lastname: usuario.lastname,
      email: usuario.email,
      role: (usuario.roles[0] ?? 'USER') as AdminRole,
      active,
    });
  }

  async excluirUsuario(id: number): Promise<boolean> {
    try {
      await lastValueFrom(
        this.http.delete(`${this.API}/users/${id}`, { headers: this.authHeaders })
      );
      return true;
    } catch {
      return false;
    }
  }
}
