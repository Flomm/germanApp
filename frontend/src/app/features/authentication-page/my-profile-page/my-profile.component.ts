import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import AuthService from 'src/app/core/services/authService/auth.service';
import INewUsernameRequest from 'src/app/shared/models/requests/INewUsernameRequest';
import { ICustomResponse } from 'src/app/shared/models/responses/ICustomResponse';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss'],
})
export class MyProfileComponent implements OnInit {
  myUserProfileForm: FormGroup;
  userName: string;
  email: string;

  @Input()
  newUsernameResponse: ICustomResponse;

  @Output()
  newUsernameRequest: EventEmitter<INewUsernameRequest> = new EventEmitter<INewUsernameRequest>();

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userName = this.authService.getUserName();
    this.email = this.authService.getEmail();
    this.myUserProfileForm = new FormGroup({
      name: new FormControl(
        { value: this.userName, disabled: true },
        Validators.required
      ),
      email: new FormControl({ value: this.email, disabled: true }),
    });
  }

  enableUsernameModification(): void {
    this.myUserProfileForm.controls.name.enable();
  }

  submitUsernameChange(): void {
    const name: INewUsernameRequest = {
      name: this.myUserProfileForm.controls.name.value,
    };
    this.newUsernameRequest.emit(name);
    this.myUserProfileForm.controls.name.disable();
  }
}
