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
import INewPasswordRequest from 'src/app/shared/models/requests/INewPasswordRequest';
import { ICustomResponse } from 'src/app/shared/models/responses/ICustomResponse';

@Component({
  selector: 'app-change-password-form',
  templateUrl: './change-password-form.component.html',
})
export class ChangePasswordFormComponent implements OnInit {
  @Input()
  newPasswordChangeResponse: ICustomResponse;

  @Output()
  newPasswordChangeRequest = new EventEmitter<INewPasswordRequest>();

  newPasswordForm: FormGroup;
  isPasswordVisible = false;
  paramsEmail: string;
  paramsPasswordRecoveryCode: number;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.paramsPasswordRecoveryCode = parseInt(params.code, 10);
      this.paramsEmail = params.email;
    });
    this.newPasswordForm = new FormGroup(
      {
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(/(?:[A-Za-z].*?\d|\d.*?[A-Za-z])/),
        ]),
        confirmedPassword: new FormControl('', [Validators.required]),
      },
      {
        validators: this.passwordMatchValidator(
          'password',
          'confirmedPassword',
        ),
      },
    );
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
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

  submitNewPassword(): void {
    const newPassword: INewPasswordRequest = {
      email: this.paramsEmail,
      passwordRecoveryCode: this.paramsPasswordRecoveryCode,
      password: this.newPasswordForm.controls.password.value,
    };
    this.newPasswordChangeRequest.emit(newPassword);
  }
}
