import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../service/auth.service';

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRoles: string[] = route.data['roles'] || [];
  const user = authService.user();

  if (user && user.roles.some(r => expectedRoles.includes(r))) {
    return true;
  }

  router.navigate(['/']);
  return false;
};
