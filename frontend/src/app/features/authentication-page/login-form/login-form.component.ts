import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import ILoginRequest from 'src/app/shared/models/requests/ILoginRequest';
import { ICustomResponse } from 'src/app/shared/models/responses/ICustomResponse';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
})
export class LoginFormComponent implements OnInit {
  loginForm: FormGroup;
  isPasswordVisible: boolean = false;

  @Input()
  loginResponse: ICustomResponse;

  @Output()
  loginRequest: EventEmitter<ILoginRequest> = new EventEmitter<ILoginRequest>();

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  submitLogin(): void {
    this.loginRequest.emit(this.loginForm.value);
  }
}
