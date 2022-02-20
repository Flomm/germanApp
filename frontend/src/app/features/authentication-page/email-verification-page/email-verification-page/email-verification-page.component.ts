import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import AuthService from 'src/app/core/services/authService/auth.service';
import { IVerificationRequest } from 'src/app/shared/models/requests/IVerificationRequest';
import { ICustomResponse } from '../../../../shared/models/responses/ICustomResponse';

@Component({
  selector: 'app-email-verification-page',
  templateUrl: './email-verification-page.component.html',
  styleUrls: ['./email-verification-page.component.scss'],
})
export class EmailVerificationPageComponent implements OnInit {
  verificationResponse: ICustomResponse;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const verificationRequest: IVerificationRequest = {
        verificationCode: parseInt(params.code, 10),
        email: params.email,
      };
      this.authService
        .verify(verificationRequest)
        .subscribe((verificationResponse: ICustomResponse) => {
          this.verificationResponse = verificationResponse;
        });
    });
  }
}
