// ponytail: um único arquivo com os endereços do dev local; criar environment.production.ts + fileReplacements quando houver deploy.
export const environment = {
  apiUrl: 'http://localhost:8080/api',
  notificacoesUrl: 'http://localhost:8082',
  keycloak: {
    // Precisa ser exatamente o `iss` que o backend valida (KEYCLOAK_ISSUER_URI).
    issuer: 'http://localhost:8081/realms/flowsla',
    clientId: 'flowsla-frontend',
  },
};
