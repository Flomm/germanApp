import { Injectable } from '@angular/core';
import { CanLoad, Route, Router } from '@angular/router';
import { UserRole } from 'src/app/shared/models/enums/UserRole.enum';
import AuthService from '../authService/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanLoad {
  constructor(private authService: AuthService, private router: Router) {}

  canLoad(route: Route): boolean {
    const userRole = parseInt(this.authService.getUserRole());
    const permittedRoles = route.data.roles as UserRole[];

    if (userRole) {
      if (
        permittedRoles &&
        (permittedRoles.includes(userRole) ||
          permittedRoles.includes(UserRole.All))
      ) {
        return true;
      }
    }
    this.router.navigate(['landing']);
    return false;
  }
}
