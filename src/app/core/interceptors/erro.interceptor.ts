import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * 401 numa sessão já aberta: token expirado, usuário inativado ou removido do backend.
 * Durante o login (`perfil` ainda nulo) quem trata é o AuthService.
 */
export const erroInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return next(req).pipe(
    catchError((erro: unknown) => {
      if (erro instanceof HttpErrorResponse && erro.status === 401 && auth.perfil()) {
        auth.descartarSessao();
        void router.navigateByUrl('/sessao-expirada');
      }
      return throwError(() => erro);
    }),
  );
};
