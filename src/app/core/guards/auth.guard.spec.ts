import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('authGuard', () => {
  it('allows access when logged in', () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: { isLoggedIn: () => true } },
        { provide: Router, useValue: { createUrlTree: vi.fn() } }
      ]
    });

    const route = {} as ActivatedRouteSnapshot;
    const state = { url: '/dashboard' } as RouterStateSnapshot;

    const result = TestBed.runInInjectionContext(() => authGuard(route, state));
    expect(result).toBe(true);
  });

  it('redirects to login when not logged in', () => {
    const createUrlTree = vi.fn(() => '/login-tree');

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: { isLoggedIn: () => false } },
        { provide: Router, useValue: { createUrlTree } }
      ]
    });

    const route = {} as ActivatedRouteSnapshot;
    const state = { url: '/workouts' } as RouterStateSnapshot;

    const result = TestBed.runInInjectionContext(() => authGuard(route, state));
    expect(result).toBe('/login-tree');
    expect(createUrlTree).toHaveBeenCalledWith(['/login'], { queryParams: { returnUrl: '/workouts' } });
  });
});