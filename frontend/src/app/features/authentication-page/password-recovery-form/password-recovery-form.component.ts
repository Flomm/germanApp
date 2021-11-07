import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import IPasswordRecoveryRequest from 'src/app/shared/models/requests/IPasswordRecoveryRequest';
import { ICustomResponse } from 'src/app/shared/models/responses/ICustomResponse';

@Component({
  selector: 'app-password-recovery-form',
  templateUrl: './password-recovery-form.component.html',
  styleUrls: ['./password-recovery-form.component.scss'],
})
export class PasswordRecoveryFormComponent implements OnInit {
  passwordRecoveryForm: FormGroup;

  @Input()
  passwordRecoveryResponse: ICustomResponse;

  @Output()
  passwordRecoveryRequest: EventEmitter<IPasswordRecoveryRequest> = new EventEmitter<IPasswordRecoveryRequest>();

  ngOnInit(): void {
    this.passwordRecoveryForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  submitPasswordRecovery(): void {
    this.passwordRecoveryRequest.emit(this.passwordRecoveryForm.value);
  }
}
