import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import AuthService from '../../services/authService/auth.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export default class ExpiredTokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((caughtError) => {
        if (
          caughtError.status === 401 &&
          caughtError.error.message === 'Nincs érvényes token.'
        ) {
          this.authService.logout();
        }
        return throwError(caughtError);
      })
    );
  }
}
