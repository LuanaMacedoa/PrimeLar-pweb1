import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../components/layout/navbar/navbar.component';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './auth.html',
})
export class AuthComponent {
  private readonly documentRef = inject(DOCUMENT);
  readonly router = inject(Router);
  private auth = inject(AuthService);
  
  readonly activeTab = signal<'login' | 'register'>('login');

  loginData = {
    email: '',
    password: '',
  };

  registerData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  feedback = signal<string | null>(null);
  isLoading = signal(false);

  goTo(tab: 'login' | 'register'): void {
    (this.documentRef.activeElement as HTMLElement | null)?.blur();
    this.activeTab.set(tab);

    setTimeout(() => {
      const targetId = tab === 'login' ? 'login-email' : 'reg-name';
      this.documentRef.getElementById(targetId)?.focus();
    }, 0);
  }

  async onLogin() {
    this.feedback.set(null);
    this.isLoading.set(true);

    try {
      const role = await this.auth.login(this.loginData.email, this.loginData.password);
      this.isLoading.set(false);
      await this.router.navigateByUrl(this.routeByRole(role));
      window.location.reload();
    } catch {
      this.isLoading.set(false);
      this.feedback.set('Email ou senha inválidos.');
    }
  }

  async onRegister() {
    this.feedback.set(null);
    this.isLoading.set(true);

    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.isLoading.set(false);
      this.feedback.set('As senhas não coincidem.');
      return;
    }

    try {
      await this.auth.register({
        nome: this.registerData.firstName,
        sobrenome: this.registerData.lastName,
        email: this.registerData.email,
        senha: this.registerData.password,
      });

      this.feedback.set('Usuário criado com sucesso.');
    } catch {
      this.feedback.set('Erro ao criar usuário.');
    } finally {
      this.isLoading.set(false);
    }
  }

  private routeByRole(role: string): string {
    if (role === 'ADMIN') return '/admin';
    if (role === 'CORRETOR') return '/corretor';
    return '/cliente';
  }
}
