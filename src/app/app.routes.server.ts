import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  ...['', 'login', 'sessao-expirada'].map((path): ServerRoute => ({
    path,
    renderMode: RenderMode.Prerender,
  })),
  // A área logada depende do token, que só existe no navegador.
  { path: 'app', renderMode: RenderMode.Client },
  { path: 'app/**', renderMode: RenderMode.Client },
  { path: '**', renderMode: RenderMode.Server, status: 404 },
];
