import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { OAuthEvent, OAuthService } from 'angular-oauth2-oidc';
import { Subject } from 'rxjs';
import { AuthService } from './auth.service';

vi.mock('../../../environments/environment', () => ({
  environment: {
    apiBaseUrl: 'http://localhost:8081/api',
    auth: {
      issuer: 'http://localhost:8080/realms/fitness-tracker',
      clientId: 'fitness-tracker-client',
      redirectUri: 'http://localhost:4200',
      postLogoutRedirectUri: 'http://localhost:4200',
      scope: 'openid profile email'
    }
  }
}));

function createJwt(payload: Record<string, unknown>): string {
  const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${header}.${body}.signature`;
}

describe('AuthService', () => {
  let service: AuthService;
  let oauthEvents$: Subject<OAuthEvent>;

  let oauthMock: {
    configure: ReturnType<typeof vi.fn>;
    setupAutomaticSilentRefresh: ReturnType<typeof vi.fn>;
    loadDiscoveryDocumentAndTryLogin: ReturnType<typeof vi.fn>;
    hasValidAccessToken: ReturnType<typeof vi.fn>;
    getAccessToken: ReturnType<typeof vi.fn>;
    initCodeFlow: ReturnType<typeof vi.fn>;
    logOut: ReturnType<typeof vi.fn>;
    events: ReturnType<Subject<OAuthEvent>['asObservable']>;
  };

  let routerMock: {
    url: string;
    parseUrl: ReturnType<typeof vi.fn>;
    navigateByUrl: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    oauthEvents$ = new Subject<OAuthEvent>();

    oauthMock = {
      configure: vi.fn(),
      setupAutomaticSilentRefresh: vi.fn(),
      loadDiscoveryDocumentAndTryLogin: vi.fn().mockResolvedValue(undefined),
      hasValidAccessToken: vi.fn(() => false),
      getAccessToken: vi.fn(() => ''),
      initCodeFlow: vi.fn(),
      logOut: vi.fn(),
      events: oauthEvents$.asObservable()
    };

    routerMock = {
      url: '/login',
      parseUrl: vi.fn(() => ({
        queryParams: { returnUrl: '/dashboard' },
        root: {
          children: {
            primary: {
              segments: [{ path: 'login' }]
            }
          }
        }
      })),
      navigateByUrl: vi.fn().mockResolvedValue(true)
    };

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: OAuthService, useValue: oauthMock },
        { provide: Router, useValue: routerMock }
      ]
    });

    service = TestBed.inject(AuthService);
  });

  it('should create and configure oauth', () => {
    expect(service).toBeTruthy();
    expect(oauthMock.configure).toHaveBeenCalled();
    expect(oauthMock.setupAutomaticSilentRefresh).toHaveBeenCalled();
  });

  it('logs in and out', async () => {
    await service.init();

    service.login();
    expect(oauthMock.initCodeFlow).toHaveBeenCalled();

    service.logout();
    expect(oauthMock.logOut).toHaveBeenCalled();
    expect(service.roles()).toEqual([]);
    expect(service.userName()).toBeNull();
  });

  it('decodes roles and username from the access token', async () => {
    oauthMock.getAccessToken = vi.fn(() =>
      createJwt({
        preferred_username: 'benutzer1',
        realm_access: { roles: ['READ'] },
        resource_access: { 'fitness-tracker-client': { roles: ['UPDATE'] } }
      })
    );

    oauthMock.hasValidAccessToken = vi.fn(() => false);

    await service.init();

    expect(service.userName()).toBe('benutzer1');
    expect(service.roles()).toEqual(expect.arrayContaining(['READ', 'UPDATE']));
  });

  it('navigates away from login after a successful login', async () => {
    oauthMock.getAccessToken = vi.fn(() =>
      createJwt({
        preferred_username: 'benutzer1',
        realm_access: { roles: ['READ'] }
      })
    );

    oauthMock.hasValidAccessToken = vi.fn(() => true);

    await service.init();

    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/dashboard');
  });

  it('syncs the profile when the token event fires', () => {
    oauthMock.getAccessToken = vi.fn(() =>
      createJwt({
        preferred_username: 'elias',
        realm_access: { roles: ['READ'] }
      })
    );

    oauthEvents$.next({ type: 'token_received' } as OAuthEvent);

    expect(service.userName()).toBe('elias');
    expect(service.hasRole('READ')).toBe(true);
  });
});