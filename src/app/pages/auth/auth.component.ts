import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../components/layout/navbar/navbar.component';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule, NavbarComponent],
  templateUrl: './auth.html',
})
export class AuthComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  protected activeTab = signal<'login' | 'register'>('login');
  protected feedback = signal<string>('');

  protected loginData = { email: '', password: '' };
  protected registerData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  protected goTo(tab: 'login' | 'register'): void {
    this.activeTab.set(tab);
    this.feedback.set('');
  }

  protected async onLogin(): Promise<void> {
    this.feedback.set('');
    const role = await this.authService.login(this.loginData.email, this.loginData.password);
    if (role !== null) {
      this.router.navigateByUrl(this.routeByRole(role));
    } else {
      this.feedback.set('E-mail ou senha inválidos.');
    }
  }

  protected async onRegister(): Promise<void> {
    this.feedback.set('');
    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.feedback.set('As senhas não coincidem.');
      return;
    }
    const role = await this.authService.register({
      nome: this.registerData.firstName,
      sobrenome: this.registerData.lastName,
      email: this.registerData.email,
      senha: this.registerData.password,
    });
    if (role !== null) {
      this.router.navigateByUrl(this.routeByRole(role));
    } else {
      this.feedback.set('Erro ao criar conta. Tente novamente.');
    }
  }

  private routeByRole(role: string): string {
    if (role === 'CORRETOR') return '/corretor';
    if (role === 'ADMIN') return '/admin';
    return '/cliente';
  }
}
