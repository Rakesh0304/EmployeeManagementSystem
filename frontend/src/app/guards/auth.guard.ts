import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  const expectedRoles = route.data?.['roles'] as string[];
  if (expectedRoles && expectedRoles.length > 0) {
    const userRole = authService.getRole();
    const normalizedRoles = expectedRoles.map(role => String(role).toLowerCase());

    if (!normalizedRoles.includes(userRole)) {
      router.navigate(['/login']);
      return false;
    }
  }

  return true;
};
