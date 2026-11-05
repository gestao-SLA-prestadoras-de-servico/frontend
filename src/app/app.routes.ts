import { Routes } from '@angular/router';
import { ACCESS_ROUTES } from './features/access/access.routes';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./features/landing/landing').then((m) => m.Landing),
  },
  ...ACCESS_ROUTES,
  {
    path: 'app',
    loadChildren: () =>
      import('./features/workspace/workspace.routes').then((m) => m.WORKSPACE_ROUTES),
  },
  {
    path: '**',
    title: 'Página não encontrada | NIVELO',
    loadComponent: () =>
      import('./features/workspace/pages/public-not-found').then((m) => m.PublicNotFound),
  },
];
