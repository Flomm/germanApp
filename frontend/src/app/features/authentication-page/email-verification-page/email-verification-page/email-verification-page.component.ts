import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IVerificationRequest } from 'src/app/shared/models/requests/IVerificationRequest';
import { ICustomResponse } from '../../../../shared/models/responses/ICustomResponse';

@Component({
  selector: 'app-email-verification-page',
  templateUrl: './email-verification-page.component.html',
})
export class EmailVerificationPageComponent implements OnInit {
  @Input() verificationResponse: ICustomResponse;

  @Output() verificationRequest = new EventEmitter<IVerificationRequest>();

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const newVerificationRequest: IVerificationRequest = {
        verificationCode: parseInt(params.code, 10),
        email: params.email,
      };
      if (
        newVerificationRequest.verificationCode &&
        newVerificationRequest.email
      ) {
        this.submitVerify(newVerificationRequest);
      }
    });
  }

  submitVerify(verificationRequest: IVerificationRequest): void {
    this.verificationRequest.emit(verificationRequest);
  }
}
