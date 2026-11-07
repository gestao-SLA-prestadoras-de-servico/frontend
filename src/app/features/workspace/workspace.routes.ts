import { inject, RESPONSE_INIT } from '@angular/core';
import { CanMatchFn, Routes } from '@angular/router';
import { WORKSPACE_PROFILES } from './data/workspace-data';
import { clientTicketById } from './client/data/client-data';
import { technicianTicketById } from './technician/technician-data';
import { managerTicketById } from './gestor/data/manager-ticket-demo-store';

const clientTicketExists: CanMatchFn = (_route, segments) => {
  const exists = !!clientTicketById(segments[1]?.path ?? null);
  const response = inject(RESPONSE_INIT, { optional: true });
  if (!exists && response) response.status = 404;
  return exists;
};

const technicianTicketExists: CanMatchFn = (_route, segments) => {
  const exists = !!technicianTicketById(Number(segments[1]?.path));
  const response = inject(RESPONSE_INIT, { optional: true });
  if (!exists && response) response.status = 404;
  return exists;
};

const managerTicketExists: CanMatchFn = (_route, segments) => {
  const exists = !!managerTicketById(segments[1]?.path ?? null);
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
              profile.key === 'gestor' && ['relatorios', 'auditoria'].includes(page.key)
                ? () => import('./gestor/pages/manager-preview').then((m) => m.ManagerPreview)
                : profile.key === 'gestor' && page.key === 'politicas'
                  ? () =>
                      import('./gestor/pages/manager-sla-policies').then(
                        (m) => m.ManagerSlaPolicies,
                      )
                  : profile.key === 'gestor' && page.key === 'contratos'
                    ? () =>
                        import('./gestor/pages/manager-contracts').then((m) => m.ManagerContracts)
                    : profile.key === 'gestor' && page.key === 'empresas'
                      ? () =>
                          import('./gestor/pages/manager-companies').then((m) => m.ManagerCompanies)
                      : profile.key === 'gestor' && page.key === 'usuarios'
                        ? () => import('./gestor/pages/manager-users').then((m) => m.ManagerUsers)
                        : profile.key === 'gestor' && page.key === 'painel'
                          ? () =>
                              import('./gestor/pages/manager-dashboard').then(
                                (m) => m.ManagerDashboard,
                              )
                          : profile.key === 'gestor' && page.key === 'chamados'
                            ? () =>
                                import('./gestor/pages/manager-tickets').then(
                                  (m) => m.ManagerTickets,
                                )
                            : profile.key === 'cliente' && page.key === 'chamados'
                              ? () =>
                                  import('./client/pages/client-tickets').then(
                                    (m) => m.ClientTickets,
                                  )
                              : profile.key === 'cliente' && page.key === 'novo-chamado'
                                ? () =>
                                    import('./client/pages/client-new-ticket').then(
                                      (m) => m.ClientNewTicket,
                                    )
                                : profile.key === 'tecnico' && page.key === 'chamados'
                                  ? () =>
                                      import('./technician/pages/technician-tickets').then(
                                        (m) => m.TechnicianTickets,
                                      )
                                  : profile.key === 'tecnico' && page.key === 'atendimento'
                                    ? () =>
                                        import('./technician/pages/technician-ticket').then(
                                          (m) => m.TechnicianTicketPage,
                                        )
                                    : () =>
                                        import('./pages/workspace-page').then(
                                          (m) => m.WorkspacePage,
                                        ),
          })),
          ...(profile.key === 'gestor'
            ? [
                {
                  path: 'chamados/:id',
                  title: 'Detalhe do chamado | Gestor | NIVELO',
                  data: {
                    profile: 'gestor',
                    page: 'detalhe-chamado',
                    breadcrumb: 'Fila de chamados',
                  },
                  canMatch: [managerTicketExists],
                  loadComponent: () =>
                    import('./gestor/pages/manager-ticket-detail').then(
                      (m) => m.ManagerTicketDetail,
                    ),
                },
                {
                  path: 'politicas/editar',
                  title: 'Revisar prazos | Gestor | NIVELO',
                  data: {
                    profile: 'gestor',
                    page: 'politicas',
                    breadcrumb: 'Políticas SLA',
                  },
                  loadComponent: () =>
                    import('./gestor/pages/manager-sla-policy-edit').then(
                      (m) => m.ManagerSlaPolicyEdit,
                    ),
                },
                {
                  path: 'contratos/nova',
                  title: 'Novo contrato | Gestor | NIVELO',
                  data: {
                    profile: 'gestor',
                    page: 'contratos',
                    breadcrumb: 'Contratos',
                  },
                  loadComponent: () =>
                    import('./gestor/pages/manager-contract-new').then((m) => m.ManagerContractNew),
                },
                {
                  path: 'empresas/nova',
                  title: 'Nova empresa | Gestor | NIVELO',
                  data: {
                    profile: 'gestor',
                    page: 'empresas',
                    breadcrumb: 'Empresas',
                  },
                  loadComponent: () =>
                    import('./gestor/pages/manager-company-new').then((m) => m.ManagerCompanyNew),
                },
                {
                  path: 'usuarios/novo',
                  title: 'Novo usuário | Gestor | NIVELO',
                  data: {
                    profile: 'gestor',
                    page: 'usuarios',
                    breadcrumb: 'Usuários',
                  },
                  loadComponent: () =>
                    import('./gestor/pages/manager-user-new').then((m) => m.ManagerUserNew),
                },
              ]
            : []),
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
          ...(profile.key === 'tecnico'
            ? [
                {
                  path: 'chamados/:id',
                  title: 'Atendimento do chamado | Técnico | NIVELO',
                  data: {
                    profile: 'tecnico',
                    page: 'atendimento',
                    breadcrumb: 'Atendimento do chamado',
                  },
                  canMatch: [technicianTicketExists],
                  loadComponent: () =>
                    import('./technician/pages/technician-ticket').then(
                      (m) => m.TechnicianTicketPage,
                    ),
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
