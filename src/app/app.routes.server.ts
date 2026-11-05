import { RenderMode, ServerRoute } from '@angular/ssr';
import { WORKSPACE_PROFILES } from './features/workspace/data/workspace-data';

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
  { path: '**', renderMode: RenderMode.Server, status: 404 },
];
