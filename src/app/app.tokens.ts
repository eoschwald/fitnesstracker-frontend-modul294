import { InjectionToken } from '@angular/core';

export interface AppEnvironment {
  apiBaseUrl: string;
  auth: {
    issuer: string;
    clientId: string;
    redirectUri: string;
    postLogoutRedirectUri: string;
    scope: string;
  };
}

export const APP_ENVIRONMENT = new InjectionToken<AppEnvironment>('APP_ENVIRONMENT');
