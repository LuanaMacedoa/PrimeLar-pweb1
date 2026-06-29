import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/landing/landing').then((m) => m.LandingComponent),
  },
  {
    path: 'auth',
    loadComponent: () => import('./pages/auth/auth.component').then((m) => m.AuthComponent),
  },
  {
    path: 'cliente',
    loadComponent: () => import('./pages/cliente/cliente').then((m) => m.ClienteComponent),
  },
  {
    path: 'corretor',
    loadComponent: () => import('./pages/corretor/corretor').then((m) => m.CorretorComponent),
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin').then((m) => m.AdminComponent),
  },

  {
    path: 'auth/esqueci-senha',
    loadComponent: () =>
      import('./pages/auth/forgot-password.component')
        .then(m => m.ForgotPasswordComponent)
  },

  {
    path: 'auth/redefinir-senha', // acessado via /auth/redefinir-senha?token=abc123
    loadComponent: () =>
      import('./pages/auth/reset-password.component')
        .then(m => m.ResetPasswordComponent)
  },

];
