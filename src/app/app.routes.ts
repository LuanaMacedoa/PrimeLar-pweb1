import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

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
    canActivate: [authGuard, roleGuard],
    data: { roles: ['USER'] },
    loadComponent: () => import('./pages/cliente/cliente').then((m) => m.ClienteComponent),
  },
  {
    path: 'corretor',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['CORRETOR'] },
    loadComponent: () => import('./pages/corretor/corretor').then((m) => m.CorretorComponent),
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] },
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
