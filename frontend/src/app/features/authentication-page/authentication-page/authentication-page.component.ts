import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import AuthService from 'src/app/core/services/authService/auth.service';
import INewPasswordRequest from 'src/app/shared/models/requests/INewPasswordRequest';
import IPasswordRecoveryRequest from 'src/app/shared/models/requests/IPasswordRecoveryRequest';
import { ICustomResponse } from 'src/app/shared/models/responses/ICustomResponse';
import ILoginRequest from 'src/app/shared/models/requests/ILoginRequest';
import IRegistrationRequest from 'src/app/shared/models/requests/IRegistrationRequest';
import INewUsernameRequest from 'src/app/shared/models/requests/INewUsernameRequest';
import IChangePasswordRequest from 'src/app/shared/models/requests/IChangePasswordRequest';
import { AuthFormType } from 'src/app/shared/models/enums/AuthFormType.enum';

@Component({
  selector: 'app-authentication-page',
  templateUrl: './authentication-page.component.html',
})
export class AuthenticationPageComponent implements OnInit {
  formType: AuthFormType;
  apiResponse: ICustomResponse;
  authFormType = AuthFormType;

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      if (this.apiResponse) {
        this.apiResponse = null;
      }
      this.formType = params.get('formType') as AuthFormType;
    });
  }

  onRegistrationSubmit(registrationRequest: IRegistrationRequest): void {
    this.authService
      .register(registrationRequest)
      .subscribe((registrationResponse: ICustomResponse) => {
        this.apiResponse = registrationResponse;
        console.warn(this.apiResponse);
      });
  }

  onLoginSubmit(loginRequest: ILoginRequest): void {
    this.authService
      .login(loginRequest)
      .subscribe((loginResponse: ICustomResponse) => {
        this.apiResponse = loginResponse;
      });
  }

  onPasswordRecoverySubmit(
    passwordRecoveryRequest: IPasswordRecoveryRequest,
  ): void {
    this.authService
      .recoverPassword(passwordRecoveryRequest)
      .subscribe((passwordRecoveryResponse: ICustomResponse) => {
        this.apiResponse = passwordRecoveryResponse;
      });
  }

  onNewPasswordSubmit(newPasswordRequest: INewPasswordRequest): void {
    this.authService
      .updatePassword(newPasswordRequest)
      .subscribe((newPasswordResponse: ICustomResponse) => {
        this.apiResponse = newPasswordResponse;
      });
  }

  onChangePasswordSubmit(changePasswordRequest: IChangePasswordRequest): void {
    this.authService
      .changePassword(changePasswordRequest)
      .subscribe((changePasswordResponse: ICustomResponse) => {
        this.apiResponse = changePasswordResponse;
      });
  }

  onNewUsernameChangeSubmit(newUsernameRequest: INewUsernameRequest): void {
    this.authService
      .changeUsername(newUsernameRequest)
      .subscribe((newUsernameResponse: ICustomResponse) => {
        this.apiResponse = newUsernameResponse;
      });
  }
}
