import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import IChangePasswordRequest from 'src/app/shared/models/requests/IChangePasswordRequest';
import { ICustomResponse } from 'src/app/shared/models/responses/ICustomResponse';

@Component({
  selector: 'app-change-password-form',
  templateUrl: './change-password-form.component.html',
})
export class ChangePasswordFormComponent implements OnInit {
  @Input()
  changePasswordResponse: ICustomResponse;

  @Output()
  changePasswordRequest = new EventEmitter<IChangePasswordRequest>();

  changePasswordForm: FormGroup;
  isOldPasswordVisible = false;
  isNewPasswordVisible = false;
  paramsEmail: string;
  paramsPasswordRecoveryCode: number;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.paramsPasswordRecoveryCode = parseInt(params.code, 10);
      this.paramsEmail = params.email;
    });
    this.changePasswordForm = new FormGroup(
      {
        oldPassword: new FormControl('', [Validators.required]),
        newPassword: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(/(?:[A-Za-z].*?\d|\d.*?[A-Za-z])/),
        ]),
        confirmedNewPassword: new FormControl('', [Validators.required]),
      },
      {
        validators: this.passwordMatchValidator(
          'newPassword',
          'confirmedNewPassword',
        ),
      },
    );
  }

  toggleOldPasswordVisibility(): void {
    this.isOldPasswordVisible = !this.isOldPasswordVisible;
  }

  toggleNewPasswordVisibility(): void {
    this.isNewPasswordVisible = !this.isNewPasswordVisible;
  }

  passwordMatchValidator(
    passwordControl: string,
    confirmedPasswordControl: string,
  ): ValidatorFn {
    return (fg: FormGroup): ValidationErrors => {
      const password: AbstractControl = fg.controls[passwordControl];
      const confirmedPassword: AbstractControl =
        fg.controls[confirmedPasswordControl];
      let validationErrors: ValidationErrors;
      if (password.value !== confirmedPassword.value) {
        validationErrors = {
          ...confirmedPassword.errors,
          ...{ mismatch: true },
        };
      } else if (
        confirmedPassword.errors &&
        !confirmedPassword.errors.mismatch
      ) {
        validationErrors = confirmedPassword.errors;
      } else {
        validationErrors = null;
      }
      confirmedPassword.setErrors(validationErrors);
      return validationErrors;
    };
  }

  submitChangePassword(): void {
    const changePasswordRequest: IChangePasswordRequest = {
      oldPassword: this.changePasswordForm.controls.oldPassword.value,
      newPassword: this.changePasswordForm.controls.newPassword.value,
    };
    this.changePasswordRequest.emit(changePasswordRequest);
  }
}
