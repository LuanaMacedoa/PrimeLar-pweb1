import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';

// TASK 55: Interceptor para enviar JWT, tratar erros e refresh
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getAccessToken();

  let authReq = req;
  
  // Se o utilizador tiver um token, anexa-o no cabeçalho de todas as requisições
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Trata erros de autenticação (Token inválido ou expirado)
      if (error.status === 401) {
        authService.logout();
        router.navigate(['/login']); 
      }
      return throwError(() => error);
    })
  );
};