import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {
  AbstractControl,
  ValidationErrors,
  FormControl,
  FormGroup,
  Validators,
  ValidatorFn,
} from '@angular/forms';
import IRegistrationRequest from '../../../shared/models/requests/IRegistrationRequest';
import { ICustomResponse } from 'src/app/shared/models/responses/ICustomResponse';
import { Input } from '@angular/core';

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.scss'],
})
export class RegistrationFormComponent implements OnInit {
  registrationForm: FormGroup;
  isPasswordVisible: boolean = false;

  constructor() {}

  @Input()
  registrationResponse: ICustomResponse;

  @Output()
  registrationRequest: EventEmitter<IRegistrationRequest> = new EventEmitter<IRegistrationRequest>();

  ngOnInit(): void {
    this.registrationForm = new FormGroup(
      {
        name: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.required, Validators.email]),
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
          'confirmedPassword'
        ),
      }
    );
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  passwordMatchValidator(
    passwordControl: string,
    confirmedPasswordControl: string
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
        !confirmedPassword.errors['mismatch']
      ) {
        validationErrors = confirmedPassword.errors;
      } else {
        validationErrors = null;
      }
      confirmedPassword.setErrors(validationErrors);
      return validationErrors;
    };
  }

  submitRegistration(): void {
    const { name, email, password } = this.registrationForm.value;
    this.registrationRequest.emit({ name, email, password });
  }
}
