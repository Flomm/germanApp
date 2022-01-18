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
import { MessageService } from '../../services/messageService/message.service';

@Injectable({ providedIn: 'root' })
export default class ExpiredTokenInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private messageService: MessageService
  ) {}

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
          this.messageService.openSnackBar(caughtError.error.message, '', {
            panelClass: ['warn'],
            duration: 3000,
          });
        }
        return throwError(caughtError);
      })
    );
  }
}
