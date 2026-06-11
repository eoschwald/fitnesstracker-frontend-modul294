import { bootstrapApplication } from '@angular/platform-browser';
import { provideOAuthClient } from 'angular-oauth2-oidc';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers ?? []),
    provideOAuthClient()
  ]
}).catch((err) => console.error(err));