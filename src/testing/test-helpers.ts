import { Subject } from 'rxjs';
import { OAuthEvent, OAuthService } from 'angular-oauth2-oidc';
import { vi } from 'vitest';

export interface AuthServiceLike {
  hasAnyRole: (roles: string[]) => boolean;
  hasRole: (role: string) => boolean;
  isLoggedIn: () => boolean;
  roles: () => string[];
  userName: () => string | null;
  ready: () => boolean;
  login: () => void;
  logout: () => void;
  accessToken: () => string | null;
}

export function createAuthServiceMock(overrides: Partial<AuthServiceLike> = {}): AuthServiceLike {
  return {
    hasAnyRole: vi.fn(() => true),
    hasRole: vi.fn(() => true),
    isLoggedIn: vi.fn(() => true),
    roles: vi.fn(() => ['READ']),
    userName: vi.fn(() => 'benutzer1'),
    ready: vi.fn(() => true),
    login: vi.fn(),
    logout: vi.fn(),
    accessToken: vi.fn(() => null),
    ...overrides
  };
}

export function createRouterMock(url = '/dashboard', returnUrl = '/dashboard', loginPath = true) {
  return {
    url,
    parseUrl: vi.fn(() => ({
      queryParams: { returnUrl },
      root: {
        children: {
          primary: {
            segments: [{ path: loginPath ? 'login' : 'dashboard' }]
          }
        }
      }
    })),
    navigateByUrl: vi.fn().mockResolvedValue(true)
  };
}

export function makeJwt(payload: unknown): string {
  const encode = (value: unknown) => Buffer.from(JSON.stringify(value)).toString('base64url');
  return `${encode({ alg: 'none', typ: 'JWT' })}.${encode(payload)}.signature`;
}

export function createOAuthServiceMock(options: { token?: string | null; validAccessToken?: boolean } = {}) {
  const events$ = new Subject<OAuthEvent>();
  const oauth = {
    configure: vi.fn(),
    setupAutomaticSilentRefresh: vi.fn(),
    events: events$.asObservable(),
    loadDiscoveryDocumentAndTryLogin: vi.fn().mockResolvedValue(undefined),
    hasValidAccessToken: vi.fn(() => options.validAccessToken ?? false),
    getAccessToken: vi.fn(() => options.token ?? null),
    initCodeFlow: vi.fn(),
    logOut: vi.fn()
  } as Partial<OAuthService> & Record<string, unknown>;

  return { oauth, events$ };
}