import AuthService from '../../services/authService/auth.service';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  HttpErrorResponse,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import ExpiredTokenInterceptor from './expiredToken.interceptor';
import { of, throwError } from 'rxjs';
import { MessageService } from '../../services/messageService/message.service';

describe(`ExpiredTokenInterceptor`, () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let httpRequestSpy: jasmine.SpyObj<HttpRequest<any>>;
  let httpHandlerSpy: jasmine.SpyObj<HttpHandler>;
  let messageServiceSpy: jasmine.SpyObj<MessageService>;
  let expiredTokenInterceptor: ExpiredTokenInterceptor;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', [
      'logout',
    ]);
    messageServiceSpy = jasmine.createSpyObj<MessageService>('MessageService', [
      'openSnackBar',
    ]);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        MessageService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: ExpiredTokenInterceptor,
          multi: true,
        },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy },
      ],
    });
    httpRequestSpy = jasmine.createSpyObj('HttpRequest', ['notImportant']);
    httpHandlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);
    expiredTokenInterceptor = new ExpiredTokenInterceptor(
      authServiceSpy,
      messageServiceSpy,
    );
  });

  it('should call the logout method of the AuthService and open the correct snackbar when response is with the adequate error', () => {
    // Arrange
    const mockHttpError: Partial<HttpErrorResponse> = {
      status: 401,
      error: { message: 'Nincs érvényes token.' },
    };
    httpHandlerSpy.handle.and.returnValue(throwError(mockHttpError));

    //Act
    expiredTokenInterceptor.intercept(httpRequestSpy, httpHandlerSpy).subscribe(
      result => expect(result).toBeTruthy(),
      err => expect(err).toEqual(mockHttpError),
    );

    //Assert
    expect(authServiceSpy.logout).toHaveBeenCalledTimes(1);
    expect(messageServiceSpy.openSnackBar).toHaveBeenCalledOnceWith(
      'Nincs érvényes token.',
      '',
      { panelClass: ['warn'], duration: 3000 },
    );
  });

  it('should not call the logout method of AuthService and should not open snackbar when response is with not a triggering error', () => {
    // Arrange
    const mockHttpError: Partial<HttpErrorResponse> = {
      status: 404,
      error: { message: 'Not found' },
    };
    httpHandlerSpy.handle.and.returnValue(throwError(mockHttpError));

    //Act
    expiredTokenInterceptor.intercept(httpRequestSpy, httpHandlerSpy).subscribe(
      result => expect(result).toBeTruthy(),
      err => expect(err).toEqual(mockHttpError),
    );

    //Assert
    expect(authServiceSpy.logout).not.toHaveBeenCalled();
    expect(messageServiceSpy.openSnackBar).not.toHaveBeenCalled();
  });

  it('should not call the logout method of the AuthService and should not open snackbar when response is not errorous', () => {
    // Arrange
    const mockResponseObject = new HttpResponse({
      status: 200,
      body: 'notImportant',
    });

    httpHandlerSpy.handle.and.returnValue(of(mockResponseObject));

    //Act
    expiredTokenInterceptor
      .intercept(httpRequestSpy, httpHandlerSpy)
      .subscribe(result => expect(result).toBeTruthy());

    //Assert
    expect(authServiceSpy.logout).not.toHaveBeenCalled();
    expect(messageServiceSpy.openSnackBar).not.toHaveBeenCalled();
  });
});
