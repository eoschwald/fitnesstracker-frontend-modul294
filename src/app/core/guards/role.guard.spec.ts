import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { roleGuard } from './role.guard';
import { AuthService } from '../services/auth.service';

describe('roleGuard', () => {
  it('allows access when any required role matches', () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: { hasAnyRole: () => true } },
        { provide: Router, useValue: { createUrlTree: vi.fn() } }
      ]
    });

    const route = { data: { roles: ['READ', 'UPDATE'] } } as unknown as ActivatedRouteSnapshot;
    const state = { url: '/dashboard' } as RouterStateSnapshot;

    const result = TestBed.runInInjectionContext(() => roleGuard(route, state));
    expect(result).toBe(true);
  });

  it('redirects to forbidden when no role matches', () => {
    const createUrlTree = vi.fn(() => '/forbidden-tree');

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: { hasAnyRole: () => false } },
        { provide: Router, useValue: { createUrlTree } }
      ]
    });

    const route = { data: { roles: ['UPDATE'] } } as unknown as ActivatedRouteSnapshot;
    const state = { url: '/workouts/new' } as RouterStateSnapshot;

    const result = TestBed.runInInjectionContext(() => roleGuard(route, state));
    expect(result).toBe('/forbidden-tree');
    expect(createUrlTree).toHaveBeenCalledWith(['/forbidden']);
  });
});