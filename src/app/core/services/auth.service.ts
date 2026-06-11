import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService, AuthConfig, OAuthEvent } from 'angular-oauth2-oidc';
import { environment } from '../../../environments/environment';
import { decodeJwtPayload } from './jwt.util';

interface KeycloakPayload {
  preferred_username?: string;
  realm_access?: { roles?: string[] };
  resource_access?: Record<string, { roles?: string[] }>;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly oauth = inject(OAuthService);
  private readonly router = inject(Router);

  private readonly configured = signal(false);
  private readonly initialized = signal(false);

  private readonly _roles = signal<string[]>([]);
  private readonly _userName = signal<string | null>(null);

  readonly roles = this._roles.asReadonly();
  readonly userName = this._userName.asReadonly();
  readonly ready = this.initialized.asReadonly();

  private initPromise: Promise<void> | null = null;

  constructor() {
    this.configure();
  }

  isLoggedIn(): boolean {
    return this.oauth.hasValidAccessToken();
  }

  private configure(): void {
    if (this.configured()) {
      return;
    }

    const authConfig: AuthConfig = {
      issuer: environment.auth.issuer,
      clientId: environment.auth.clientId,
      responseType: 'code',
      redirectUri: environment.auth.redirectUri,
      postLogoutRedirectUri: environment.auth.postLogoutRedirectUri,
      scope: environment.auth.scope,
      strictDiscoveryDocumentValidation: false,
      useSilentRefresh: true,
      showDebugInformation: false,
      requireHttps: environment.auth.issuer.startsWith('https://')
    };

    this.oauth.configure(authConfig);
    this.oauth.setupAutomaticSilentRefresh();

    this.oauth.events.subscribe((event: OAuthEvent) => {
      if (
        event.type === 'token_received' ||
        event.type === 'session_terminated' ||
        event.type === 'logout'
      ) {
        this.syncProfile();
      }
    });

    this.configured.set(true);
  }

  init(): Promise<void> {
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = (async () => {
      await this.oauth.loadDiscoveryDocumentAndTryLogin();
      this.syncProfile();

      if (this.oauth.hasValidAccessToken()) {
        const tree = this.router.parseUrl(this.router.url);
        const returnUrl = tree.queryParams['returnUrl'];

        if (tree.root.children['primary']?.segments?.[0]?.path === 'login') {
          await this.router.navigateByUrl(
            typeof returnUrl === 'string' && returnUrl ? returnUrl : '/dashboard'
          );
        }
      }

      this.initialized.set(true);
    })();

    return this.initPromise;
  }

  login(): void {
    if (!this.initialized()) {
      return;
    }

    this.oauth.initCodeFlow();
  }

  logout(): void {
    this.oauth.logOut();
    this._roles.set([]);
    this._userName.set(null);
  }

  accessToken(): string | null {
    const token = this.oauth.getAccessToken();
    return token || null;
  }

  hasRole(role: string): boolean {
    return this._roles().includes(role) || this._roles().includes(`ROLE_${role}`);
  }

  hasAnyRole(roles: string[]): boolean {
    if (roles.length === 0) {
      return true;
    }

    return roles.some((role) => this.hasRole(role));
  }

  private syncProfile(): void {
    const token = this.accessToken();
    if (!token) {
      this._roles.set([]);
      this._userName.set(null);
      return;
    }

    const payload = decodeJwtPayload<KeycloakPayload>(token);
    const roles = new Set<string>();

    payload?.realm_access?.roles?.forEach((role) => roles.add(role));
    Object.values(payload?.resource_access ?? {}).forEach((client) => {
      client.roles?.forEach((role) => roles.add(role));
    });

    this._roles.set(Array.from(roles));
    this._userName.set(payload?.preferred_username ?? null);
  }
}