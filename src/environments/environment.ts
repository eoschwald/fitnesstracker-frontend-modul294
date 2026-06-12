import { AppEnvironment } from '../app/app.tokens';

export const environment: AppEnvironment = {
  apiBaseUrl: 'http://localhost:8081/api',

  auth: {
    issuer: 'http://localhost:8080/realms/fitness-tracker',
    clientId: 'fitness-tracker-client',
    redirectUri: 'http://localhost:4200',
    postLogoutRedirectUri: 'http://localhost:4200',
    scope: 'openid profile email'
  }
};