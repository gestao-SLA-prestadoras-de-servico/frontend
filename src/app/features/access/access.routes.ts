import { Routes } from '@angular/router';

export const ACCESS_ROUTES: Routes = [
  {
    path: 'login',
    title: 'Entrar | NIVELO',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: 'sessao-demo',
    title: 'Sessão de demonstração | NIVELO',
    loadComponent: () => import('./pages/session-demo/session-demo').then((m) => m.SessionDemo),
  },
  {
    path: 'sessao-expirada',
    title: 'Sessão expirada | NIVELO',
    loadComponent: () =>
      import('./pages/session-expired/session-expired').then((m) => m.SessionExpired),
  },
];
