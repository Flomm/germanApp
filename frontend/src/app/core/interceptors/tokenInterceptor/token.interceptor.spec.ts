import AuthService from '../../services/authService/auth.service';
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import TokenInterceptor from './token.interceptor';

describe(`TokenInterceptor`, () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let httpMock: HttpTestingController;
  let http: HttpClient;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', [
      'getToken',
    ]);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TokenInterceptor,
          multi: true,
        },
        { provide: AuthService, useValue: authServiceSpy },
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should add an Authorization header and getToken if token in not null', () => {
    //Arrange
    const testToken: string = 'testToken';
    authServiceSpy.getToken.and.returnValue(testToken);

    //Act
    http.get('/').subscribe((response) => {
      expect(response).toBeTruthy();
    });

    //Assert
    const httpRequest = httpMock.expectOne('/');
    expect(httpRequest.request.headers.has('Authorization')).toEqual(true);
    expect(httpRequest.request.headers.get('Authorization')).toEqual(
      `Bearer ${testToken}`
    );
    expect(authServiceSpy.getToken).toHaveBeenCalledTimes(1);
  });

  it('should not add an Authorization header if token is null', () => {
    //Arrange
    const testToken: null = null;
    authServiceSpy.getToken.and.returnValue(testToken);

    //Act
    http.get('/').subscribe((response) => {
      expect(response).toBeTruthy();
    });

    //Assert
    const httpRequest = httpMock.expectOne('/');
    expect(httpRequest.request.headers.has('Authorization')).toEqual(false);
    expect(httpRequest.request.headers.get('Authorization')).toEqual(null);
    expect(authServiceSpy.getToken).toHaveBeenCalledTimes(1);
  });
});
