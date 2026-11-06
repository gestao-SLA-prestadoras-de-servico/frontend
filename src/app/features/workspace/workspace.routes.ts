import { inject, RESPONSE_INIT } from '@angular/core';
import { CanMatchFn, Routes } from '@angular/router';
import { WORKSPACE_PROFILES } from './data/workspace-data';
import { clientTicketById } from './client/data/client-data';

const clientTicketExists: CanMatchFn = (_route, segments) => {
  const exists = !!clientTicketById(segments[1]?.path ?? null);
  const response = inject(RESPONSE_INIT, { optional: true });
  if (!exists && response) response.status = 404;
  return exists;
};

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
            loadComponent:
              profile.key === 'cliente' && page.key === 'chamados'
                ? () => import('./client/pages/client-tickets').then((m) => m.ClientTickets)
                : profile.key === 'cliente' && page.key === 'novo-chamado'
                  ? () => import('./client/pages/client-new-ticket').then((m) => m.ClientNewTicket)
                  : () => import('./pages/workspace-page').then((m) => m.WorkspacePage),
          })),
          ...(profile.key === 'cliente'
            ? [
                {
                  path: 'chamados/:id',
                  title: 'Detalhe do chamado | Cliente | NIVELO',
                  data: {
                    profile: 'cliente',
                    page: 'detalhe-chamado',
                    breadcrumb: 'Detalhe do chamado',
                  },
                  canMatch: [clientTicketExists],
                  loadComponent: () =>
                    import('./client/pages/client-ticket-detail').then((m) => m.ClientTicketDetail),
                },
              ]
            : []),
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
