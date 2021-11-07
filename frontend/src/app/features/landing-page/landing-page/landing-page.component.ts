import { Component, OnInit } from '@angular/core';
import { ISubscribeRequest } from '../../../shared/models/requests/ISubscribeRequest';
import { EmailService } from 'src/app/core/services/emailService/email.service';
import { ICustomResponse } from '../../../shared/models/responses/ICustomResponse';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent {
  subscribeResponse: ICustomResponse;

  constructor(private emailService: EmailService) {}

  onMailSubscription(subData: ISubscribeRequest): void {
    this.emailService
      .createSubscription(subData)
      .subscribe((subscribeResponse: ICustomResponse) => {
        this.subscribeResponse = subscribeResponse;
      });
  }
}
