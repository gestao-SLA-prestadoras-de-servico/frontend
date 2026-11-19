import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { firstValueFrom } from 'rxjs';
import type { ProfileKey } from '@app/features/workspace/data/workspace-data';
import { environment } from '../../../environments/environment';
import { Papel } from '../api/modelos';

/** `UsuarioResponse` de `GET /api/usuarios/me`. */
export interface Usuario {
  id: string;
  sub: string;
  nome: string;
  email: string;
  perfil: Papel;
  clienteId: string | null;
  ativo: boolean;
}

const PERFIL_POR_PAPEL: Record<Papel, ProfileKey> = {
  GESTOR: 'gestor',
  TECNICO: 'tecnico',
  CLIENTE: 'cliente',
};

/**
 * Sessão OIDC no Keycloak (Authorization Code + PKCE). O papel e o cadastro vêm de
 * `/api/usuarios/me`, que também garante que o usuário existe e está ativo no backend.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly oauth = inject(OAuthService);
  private readonly http = inject(HttpClient);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  private retorno: string | null = null;

  readonly usuario = signal<Usuario | null>(null);
  readonly perfil = computed(() => {
    const usuario = this.usuario();
    return usuario ? PERFIL_POR_PAPEL[usuario.perfil] : null;
  });

  async init(): Promise<void> {
    if (!this.browser) return;
    this.oauth.configure({
      issuer: environment.keycloak.issuer,
      clientId: environment.keycloak.clientId,
      responseType: 'code',
      scope: 'openid profile email',
      redirectUri: `${location.origin}/app`,
      postLogoutRedirectUri: `${location.origin}/login?estado=saida`,
    });
    await this.oauth.loadDiscoveryDocumentAndTryLogin();
    // A lib limpa code/state do retorno, mas o Keycloak também manda `iss`.
    const url = new URL(location.href);
    if (url.searchParams.has('iss')) {
      url.searchParams.delete('iss');
      history.replaceState(history.state, '', url);
    }
    if (!this.oauth.hasValidAccessToken()) return;
    // Rota pedida antes do login (ida e volta no `state`); só aceita rotas internas.
    const destino = this.oauth.state ? decodeURIComponent(this.oauth.state) : '';
    if (destino.startsWith('/app/')) this.retorno = destino;
    this.oauth.setupAutomaticSilentRefresh();
    try {
      this.usuario.set(
        await firstValueFrom(this.http.get<Usuario>(`${environment.apiUrl}/usuarios/me`)),
      );
    } catch {
      // Token válido, mas sem cadastro ativo no backend (401) ou backend fora do ar.
      this.logout('sem-acesso');
    }
  }

  login(retorno?: string): void {
    this.oauth.initCodeFlow(retorno ?? '');
  }

  /** Devolve uma única vez a rota pedida antes do login. */
  consumirRetorno(): string | null {
    const retorno = this.retorno;
    this.retorno = null;
    return retorno;
  }

  logout(estado: 'saida' | 'sem-acesso' = 'saida'): void {
    this.usuario.set(null);
    this.oauth.postLogoutRedirectUri = `${location.origin}/login?estado=${estado}`;
    this.oauth.logOut();
  }

  /** Descarta os tokens locais sem passar pelo Keycloak (ex.: 401 de uma chamada). */
  descartarSessao(): void {
    this.usuario.set(null);
    this.oauth.logOut(true);
  }
}
