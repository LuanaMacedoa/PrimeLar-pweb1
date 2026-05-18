import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './auth.html',
})
export class AuthComponent {
  private readonly documentRef = inject(DOCUMENT);

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

  goTo(tab: 'login' | 'register'): void {
    (this.documentRef.activeElement as HTMLElement | null)?.blur();
    this.activeTab.set(tab);

    setTimeout(() => {
      const targetId = tab === 'login' ? 'login-email' : 'reg-name';
      this.documentRef.getElementById(targetId)?.focus();
    }, 0);
  }

  onLogin(): void {
    console.log('Login:', this.loginData);
  }

  onRegister(): void {
    if (this.registerData.password !== this.registerData.confirmPassword) {
      alert('As senhas não coincidem.');
      return;
    }
    console.log('Cadastro:', this.registerData);
  }
}