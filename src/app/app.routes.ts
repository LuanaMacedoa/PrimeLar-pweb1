import { Routes } from '@angular/router';

export const routes: Routes = [
{
  path: '',
  loadComponent: () =>
    import('./components/landing/landing').then((m) => m.LandingComponent),
},
  {
    path: 'auth',
    loadComponent: () =>
      import('./components/auth/auth.component').then((m) => m.AuthComponent),
  },
];