import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/** Exige sessão e só deixa entrar na área (`data.profile`) do papel do usuário. */
export const papelGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const perfil = auth.perfil();
  if (!perfil) {
    auth.login(state.url);
    return false;
  }
  return perfil === route.data['profile'] || inject(Router).parseUrl(`/app/${perfil}`);
};
