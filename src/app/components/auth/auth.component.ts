import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../layout/navbar/navbar.component';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './auth.html',
})
export class AuthComponent {
  private readonly documentRef = inject(DOCUMENT);
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
  loading = signal(false);

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
  this.loading.set(true);

  const ok = await this.auth.login(
    this.loginData.email,
    this.loginData.password
  );

  this.loading.set(false);

  if (!ok) {
    this.feedback.set('Email ou senha inválidos.');
    return;
  }

  this.feedback.set('Login realizado com sucesso.');
  }

  async onRegister() {
     this.feedback.set(null);
  this.loading.set(true);


  if (this.registerData.password !== this.registerData.confirmPassword) {
    this.loading.set(false);
    this.feedback.set('As senhas não coincidem.');
    return;
  }

  const ok = await this.auth.register({
    nome: this.registerData.firstName,
    sobrenome: this.registerData.lastName,
    email: this.registerData.email,
    senha: this.registerData.password,
  });

  this.loading.set(false);

  this.feedback.set(
    ok ? 'Usuário criado com sucesso.' : 'Erro ao criar usuário.'
  );
}
}