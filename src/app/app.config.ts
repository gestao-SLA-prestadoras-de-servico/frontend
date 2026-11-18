import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideOAuthClient } from 'angular-oauth2-oidc';

import { routes } from './app.routes';
import { AuthService } from './core/services/auth.service';
import { erroInterceptor } from './core/interceptors/erro.interceptor';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    // withInterceptorsFromDi: o interceptor da angular-oauth2-oidc (Bearer) é registrado por DI.
    provideHttpClient(withFetch(), withInterceptors([erroInterceptor]), withInterceptorsFromDi()),
    provideOAuthClient({
      resourceServer: {
        allowedUrls: [environment.apiUrl, environment.notificacoesUrl],
        sendAccessToken: true,
      },
    }),
    provideAppInitializer(() => inject(AuthService).init()),
  ],
};
