import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './auth.html',
})
export class AuthComponent {
  activeTab: 'login' | 'register' = 'login';

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