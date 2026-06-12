import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { OAuthEvent, OAuthService } from 'angular-oauth2-oidc';
import { AuthService } from './auth.service';
import { createOAuthServiceMock, createRouterMock, makeJwt } from '../../../testing/test-helpers';

describe('AuthService', () => {
  let service: AuthService;
  let oauthMock: ReturnType<typeof createOAuthServiceMock>['oauth'];
  let routerMock: ReturnType<typeof createRouterMock>;
  let events$: Subject<OAuthEvent>;

  beforeEach(() => {
    const mock = createOAuthServiceMock({ validAccessToken: false });
    oauthMock = mock.oauth;
    events$ = mock.events$;
    routerMock = createRouterMock('/login', '/dashboard', true);

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
    const token = makeJwt({
      preferred_username: 'benutzer1',
      realm_access: { roles: ['READ'] },
      resource_access: { demoapp: { roles: ['UPDATE'] } }
    });

    oauthMock.getAccessToken = vi.fn(() => token);
    oauthMock.hasValidAccessToken = vi.fn(() => false);

    await service.init();

    expect(service.userName()).toBe('benutzer1');
    expect(service.roles()).toEqual(expect.arrayContaining(['READ', 'UPDATE']));
    expect(service.hasRole('READ')).toBe(true);
    expect(service.hasRole('UPDATE')).toBe(true);
    expect(service.hasAnyRole([])).toBe(true);
  });

  it('navigates away from login after a successful login', async () => {
    const token = makeJwt({ preferred_username: 'benutzer1', realm_access: { roles: ['READ'] } });
    oauthMock.getAccessToken = vi.fn(() => token);
    oauthMock.hasValidAccessToken = vi.fn(() => true);
    routerMock.url = '/login';

    await service.init();

    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/dashboard');
  });

  it('syncs the profile when the token event fires', () => {
    oauthMock.getAccessToken = vi.fn(() => makeJwt({ preferred_username: 'elias', realm_access: { roles: ['READ'] } }));
    events$.next({ type: 'token_received' } as OAuthEvent);

    expect(service.userName()).toBe('elias');
    expect(service.hasRole('READ')).toBe(true);
  });
});