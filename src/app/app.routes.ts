import { Routes } from '@angular/router';

export const routes: Routes = [
{
  path: '',
  loadComponent: () =>
    import('./pages/landing/landing').then((m) => m.LandingComponent),
},
  {
    path: 'auth',
    loadComponent: () =>
      import('./pages/auth/auth.component').then((m) => m.AuthComponent),
  },
];