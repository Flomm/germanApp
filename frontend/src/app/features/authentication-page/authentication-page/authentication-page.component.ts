import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import AuthService from 'src/app/core/services/authService/auth.service';
import INewPasswordRequest from 'src/app/shared/models/requests/INewPasswordRequest';
import IPasswordRecoveryRequest from 'src/app/shared/models/requests/IPasswordRecoveryRequest';
import { ICustomResponse } from 'src/app/shared/models/responses/ICustomResponse';
import ILoginRequest from 'src/app/shared/models/requests/ILoginRequest';
import IRegistrationRequest from 'src/app/shared/models/requests/IRegistrationRequest';
import INewUsernameRequest from 'src/app/shared/models/requests/INewUsernameRequest';
import IChangePasswordRequest from 'src/app/shared/models/requests/IChangePasswordRequest';

@Component({
  selector: 'app-authentication-page',
  templateUrl: './authentication-page.component.html',
})
export class AuthenticationPageComponent {
  formType: string;
  loginResponse: ICustomResponse;
  registrationResponse: ICustomResponse;
  newPasswordResponse: ICustomResponse;
  changePasswordResponse: ICustomResponse;
  passwordRecoveryResponse: ICustomResponse;
  newUsernameResponse: ICustomResponse;

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.formType = this.activatedRoute.parent.snapshot.url[0].path;
  }

  onRegistrationSubmit(registrationRequest: IRegistrationRequest): void {
    this.authService
      .register(registrationRequest)
      .subscribe((registrationResponse: ICustomResponse) => {
        this.registrationResponse = registrationResponse;
      });
  }

  onLoginSubmit(loginRequest: ILoginRequest): void {
    this.authService
      .login(loginRequest)
      .subscribe((loginResponse: ICustomResponse) => {
        this.loginResponse = loginResponse;
      });
  }

  onPasswordRecoverySubmit(
    passwordRecoveryRequest: IPasswordRecoveryRequest,
  ): void {
    this.authService
      .recoverPassword(passwordRecoveryRequest)
      .subscribe((passwordRecoveryResponse: ICustomResponse) => {
        this.passwordRecoveryResponse = passwordRecoveryResponse;
      });
  }

  onNewPasswordSubmit(newPasswordRequest: INewPasswordRequest): void {
    this.authService
      .updatePassword(newPasswordRequest)
      .subscribe((newPasswordResponse: ICustomResponse) => {
        this.newPasswordResponse = newPasswordResponse;
      });
  }

  onNChangePasswordSubmit(changePasswordRequest: IChangePasswordRequest): void {
    this.authService
      .changePassword(changePasswordRequest)
      .subscribe((changePasswordResponse: ICustomResponse) => {
        this.changePasswordResponse = changePasswordResponse;
      });
  }

  onNewUsernameChangeSubmit(newUsernameRequest: INewUsernameRequest): void {
    this.authService
      .changeUsername(newUsernameRequest)
      .subscribe((newUsernameResponse: ICustomResponse) => {
        this.newUsernameResponse = newUsernameResponse;
      });
  }
}
