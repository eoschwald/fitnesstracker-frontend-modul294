import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

function requiredRoles(route: ActivatedRouteSnapshot): string[] {
  return (route.data['roles'] as string[] | undefined) ?? [];
}

export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const roles = requiredRoles(route);

  if (auth.hasAnyRole(roles)) {
    return true;
  }

  return router.createUrlTree(['/forbidden']);
};
