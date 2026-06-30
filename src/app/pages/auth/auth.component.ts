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
  protected router = inject(Router);

  protected activeTab = signal<'login' | 'register'>('login');
  protected feedback = signal<string>('');
  protected isLoading = signal<boolean>(false);

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
    this.isLoading.set(true);
    try {
      const role = await this.authService.login(this.loginData.email, this.loginData.password);
      this.router.navigateByUrl(this.routeByRole(role));
    } catch (err) {
      this.feedback.set(err instanceof Error ? err.message : 'E-mail ou senha inválidos.');
    } finally {
      this.isLoading.set(false);
    }
  }

  protected async onRegister(): Promise<void> {
    this.feedback.set('');
    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.feedback.set('As senhas não coincidem.');
      return;
    }
    this.isLoading.set(true);
    try {
      const role = await this.authService.register({
        nome: this.registerData.firstName,
        sobrenome: this.registerData.lastName,
        email: this.registerData.email,
        senha: this.registerData.password,
      });
      this.router.navigateByUrl(this.routeByRole(role));
    } catch (err) {
      this.feedback.set(err instanceof Error ? err.message : 'Erro ao criar conta. Tente novamente.');
    } finally {
      this.isLoading.set(false);
    }
  }

  private routeByRole(role: string): string {
    if (role === 'CORRETOR') return '/corretor';
    if (role === 'ADMIN') return '/admin';
    return '/cliente';
  }
}
