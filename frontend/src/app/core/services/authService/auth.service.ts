import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { UserRole } from 'src/app/shared/models/enums/UserRole.enum';
import ILoginRequest from 'src/app/shared/models/requests/ILoginRequest';
import INewPasswordRequest from 'src/app/shared/models/requests/INewPasswordRequest';
import IPasswordRecoveryRequest from 'src/app/shared/models/requests/IPasswordRecoveryRequest';
import IRegistrationRequest from 'src/app/shared/models/requests/IRegistrationRequest';
import { ICustomResponse } from 'src/app/shared/models/responses/ICustomResponse';
import { ILoginResponse } from 'src/app/shared/models/responses/ILoginResponse';
import { environment } from 'src/environments/environment';
import { IVerificationRequest } from 'src/app/shared/models/requests/IVerificationRequest';
import INewUsernameRequest from 'src/app/shared/models/requests/INewUsernameRequest';
import { MessageService } from '../messageService/message.service';

@Injectable({
  providedIn: 'root',
})
export default class AuthService {
  public userNameObservable: Observable<string>;

  public userRoleObservable: Observable<string>;

  private userSubject: BehaviorSubject<string> = new BehaviorSubject<string>(
    this.getUserName(),
  );

  private roleSubject: BehaviorSubject<string> = new BehaviorSubject<string>(
    localStorage.getItem('role'),
  );

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private messageService: MessageService,
  ) {
    this.userNameObservable = this.userSubject.asObservable();
    this.userRoleObservable = this.roleSubject.asObservable();
  }

  getToken(): string {
    return localStorage.getItem('token');
  }

  setToken(token: string): void {
    return localStorage.setItem('token', token);
  }

  getUserName(): string {
    return localStorage.getItem('user');
  }

  setUserName(userName: string): void {
    return localStorage.setItem('user', userName);
  }

  getUserRole(): string {
    return localStorage.getItem('role');
  }

  setUserRole(userRole: number): void {
    return localStorage.setItem('role', `${userRole}`);
  }

  getEmail(): string {
    return localStorage.getItem('email');
  }

  setEmail(email: string): void {
    return localStorage.setItem('email', `${email}`);
  }

  login(loginRequestData: ILoginRequest): Observable<ICustomResponse> {
    return this.httpClient
      .post<ILoginResponse>(
        `${environment.serverUrl}/user/login`,
        loginRequestData,
      )
      .pipe(
        tap(response => {
          this.saveDataToLocalStorage(response);
          this.setEmail(loginRequestData.email);
          this.navigateAfterSuccessfulLogin(response.roleId);
          this.userSubject.next(response.name);
          this.roleSubject.next(`${response.roleId}`);
        }),
        map(() => {
          return {
            message: null,
            isError: false,
          };
        }),
        catchError((httpError: HttpErrorResponse) =>
          of({
            message: httpError.error.message,
            isError: true,
          }),
        ),
      );
  }

  register(
    registrationRequestData: IRegistrationRequest,
  ): Observable<ICustomResponse> {
    return this.httpClient
      .post<ICustomResponse>(
        `${environment.serverUrl}/user/register`,
        registrationRequestData,
      )
      .pipe(
        tap(() => {
          this.router.navigate(['login']);
          this.messageService.openDialog({
            data: {
              dialogText:
                'Köszönjük a regisztrációt. Bejelentkezés előtt kérlek erősítsd meg az e-mail címed a kiküldött e-mail segítségével.',
            },
            panelClass: 'default-dialog',
          });
        }),
        map(response => {
          return {
            message: response.message,
            isError: false,
          };
        }),
        catchError((httpError: HttpErrorResponse) =>
          of({
            message: httpError.error.message,
            isError: true,
          }),
        ),
      );
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    this.router.navigate(['login']);
    this.userSubject.next(null);
    this.roleSubject.next(null);
  }

  recoverPassword(
    passwordRecoveryRequestData: IPasswordRecoveryRequest,
  ): Observable<ICustomResponse> {
    return this.httpClient
      .put<ICustomResponse>(
        `${environment.serverUrl}/user/password-recovery`,
        passwordRecoveryRequestData,
      )
      .pipe(
        tap(() => {
          this.router.navigate(['login']);
          this.messageService.openDialog({
            data: {
              dialogText:
                'A jelszó megváltoztató e-mailt kiküldtük a megadott e-mail címre.',
            },
            panelClass: 'default-dialog',
          });
        }),
        map(response => {
          return {
            message: response.message,
            isError: false,
          };
        }),
        catchError((httpError: HttpErrorResponse) =>
          of({
            message: httpError.error.message,
            isError: true,
          }),
        ),
      );
  }

  updatePassword(
    newPasswordRequestData: INewPasswordRequest,
  ): Observable<ICustomResponse> {
    return this.httpClient
      .put<ICustomResponse>(
        `${environment.serverUrl}/user/new-password`,
        newPasswordRequestData,
      )
      .pipe(
        tap(() => {
          this.router.navigate(['login']);
          this.messageService.openDialog({
            data: {
              dialogText:
                'Jelszó sikeresen megváltoztatva. Kérlek jelentkezz be.',
            },
            panelClass: 'default-dialog',
          });
        }),
        map(response => {
          return {
            message: response.message,
            isError: false,
          };
        }),
        catchError((httpError: HttpErrorResponse) =>
          of({
            message: httpError.error.message,
            isError: true,
          }),
        ),
      );
  }

  changeUsername(
    newUsernameRequestData: INewUsernameRequest,
  ): Observable<ICustomResponse> {
    return this.httpClient
      .put<ICustomResponse>(
        `${environment.serverUrl}/user/change-name`,
        newUsernameRequestData,
      )
      .pipe(
        tap(() => {
          this.router.navigate(['myprofile']);
          this.userSubject.next(newUsernameRequestData.name);
          this.setUserName(newUsernameRequestData.name);
        }),
        map(response => {
          return {
            message: response.message,
          };
        }),
        catchError((httpError: HttpErrorResponse) =>
          of({
            message: httpError.error.message,
            isError: true,
          }),
        ),
      );
  }

  verify(
    verificationRequest: IVerificationRequest,
  ): Observable<ICustomResponse> {
    return this.httpClient
      .put<ICustomResponse>(
        `${environment.serverUrl}/user/verify`,
        verificationRequest,
      )
      .pipe(
        map(response => {
          return {
            message: response.message,
            isError: false,
          };
        }),
        catchError((httpError: HttpErrorResponse) =>
          of({
            message: httpError.error.message,
            isError: true,
          }),
        ),
      );
  }

  private saveDataToLocalStorage(data: ILoginResponse): void {
    this.setUserName(data.name);
    this.setUserRole(data.roleId);
    this.setToken(data.token);
  }

  private navigateAfterSuccessfulLogin(roleId: number): void {
    if (roleId === UserRole.Admin) {
      this.router.navigate(['admin']);
    }

    if (roleId === UserRole.Consumer) {
      this.router.navigate(['consumer']);
    }
  }
}
