import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import IPasswordRecoveryRequest from 'src/app/shared/models/requests/IPasswordRecoveryRequest';
import { ICustomResponse } from 'src/app/shared/models/responses/ICustomResponse';

@Component({
  selector: 'app-password-recovery-form',
  templateUrl: './password-recovery-form.component.html',
})
export class PasswordRecoveryFormComponent implements OnInit {
  @Input()
  passwordRecoveryResponse: ICustomResponse;

  @Output()
  passwordRecoveryRequest: EventEmitter<IPasswordRecoveryRequest> = new EventEmitter<IPasswordRecoveryRequest>();

  passwordRecoveryForm: FormGroup;

  ngOnInit(): void {
    this.passwordRecoveryForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  submitPasswordRecovery(): void {
    this.passwordRecoveryRequest.emit(this.passwordRecoveryForm.value);
  }
}
