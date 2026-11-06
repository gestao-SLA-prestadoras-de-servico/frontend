import { PrerenderFallback, RenderMode, ServerRoute } from '@angular/ssr';
import { WORKSPACE_PROFILES } from './features/workspace/data/workspace-data';
import { CLIENT_TICKETS } from './features/workspace/client/data/client-data';

export const serverRoutes: ServerRoute[] = [
  ...['', 'login', 'sessao-demo', 'sessao-expirada', 'app'].map((path): ServerRoute => ({
    path,
    renderMode: RenderMode.Prerender,
  })),
  ...WORKSPACE_PROFILES.flatMap((profile) =>
    profile.pages.map((page): ServerRoute => ({
      path: page.path.slice(1),
      renderMode: RenderMode.Prerender,
    })),
  ),
  {
    path: 'app/cliente/chamados/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => CLIENT_TICKETS.map((ticket) => ({ id: String(ticket.id) })),
    fallback: PrerenderFallback.Server,
  },
  { path: '**', renderMode: RenderMode.Server, status: 404 },
];
