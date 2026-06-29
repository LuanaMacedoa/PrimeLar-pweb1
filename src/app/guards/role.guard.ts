import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../service/auth.service';

// TASK 57: Protege rotas por roles (perfis de acesso)
export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Lê qual perfil é exigido pela rota (ex: ['ADMIN', 'CORRETOR'])
  const expectedRoles: string[] = route.data['roles'] || [];
  
  const user = authService.user();

  // Verifica se o utilizador tem a permissão necessária
  if (user && user.role && expectedRoles.includes(user.role)) {
    return true;
  }

  // Acesso negado: redireciona para a home ou página de erro
  router.navigate(['/']);
  return false;
};