import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class PasswordResetService {

  private readonly API = environment.supabaseUrl;

  constructor(private http: HttpClient) {}

  solicitarReset(email: string): Observable<string> {
    return this.http.post(
      `${this.API}/auth/forgot-password`,
      { email },
      { responseType: 'text' } // backend retorna texto simples
    );
  }

  confirmarReset(token: string, novaSenha: string): Observable<string> {
    return this.http.post(
      `${this.API}/auth/reset-password`,
      { token, novaSenha },
      { responseType: 'text' }
    );
  }
}