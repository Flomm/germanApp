import { Component, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EventEmitter } from '@angular/core';
import { ISubscribeRequest } from '../../../shared/models/requests/ISubscribeRequest';
import { ICustomResponse } from '../../../shared/models/responses/ICustomResponse';
import { Input } from '@angular/core';

@Component({
  selector: 'app-subscribe-mail',
  templateUrl: './subscribe-mail.component.html',
  styleUrls: ['./subscribe-mail.component.scss'],
})
export class SubscribeMailComponent implements OnInit {
  subscribeForm: FormGroup;

  @Input()
  subscribeResponse: ICustomResponse;

  @Output() subscribe: EventEmitter<ISubscribeRequest> =
    new EventEmitter<ISubscribeRequest>();

  constructor() {}

  ngOnInit(): void {
    this.subscribeForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  mailSubscription(): void {
    this.subscribe.emit(this.subscribeForm.value);
  }
}
