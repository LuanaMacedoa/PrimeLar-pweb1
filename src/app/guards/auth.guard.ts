import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../service/auth.service';

// TASK 57: Protege rotas verificando se o utilizador está logado
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verifica se existe um token (utilizador logado)
  if (authService.getAccessToken()) {
    return true; 
  }

  // Se não estiver logado, redireciona para o ecrã de login
  router.navigate(['/auth']);
  return false;
};