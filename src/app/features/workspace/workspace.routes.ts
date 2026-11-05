import { Routes } from '@angular/router';
import { WORKSPACE_PROFILES } from './data/workspace-data';

export const WORKSPACE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/workspace-shell').then((m) => m.WorkspaceShell),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'gestor' },
      ...WORKSPACE_PROFILES.map((profile) => ({
        path: profile.key,
        data: { profile: profile.key },
        children: [
          ...profile.pages.map((page) => ({
            path: page.path.replace(`/app/${profile.key}`, '').replace(/^\//, ''),
            pathMatch: 'full' as const,
            title: `${page.title} | ${profile.label} | NIVELO`,
            data: { profile: profile.key, page: page.key },
            loadComponent: () => import('./pages/workspace-page').then((m) => m.WorkspacePage),
          })),
          {
            path: '**',
            title: 'Página não encontrada | NIVELO',
            data: { profile: profile.key },
            loadComponent: () => import('./pages/workspace-page').then((m) => m.WorkspacePage),
          },
        ],
      })),
      {
        path: '**',
        title: 'Página não encontrada | NIVELO',
        loadComponent: () => import('./pages/workspace-page').then((m) => m.WorkspacePage),
      },
    ],
  },
];
