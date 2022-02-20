import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import AuthService from 'src/app/core/services/authService/auth.service';
import INewUsernameRequest from 'src/app/shared/models/requests/INewUsernameRequest';
import { ICustomResponse } from 'src/app/shared/models/responses/ICustomResponse';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss'],
})
export class MyProfileComponent implements OnInit {
  @Input()
  newUsernameResponse: ICustomResponse;

  @Output()
  newUsernameRequest: EventEmitter<INewUsernameRequest> = new EventEmitter<INewUsernameRequest>();

  myUserProfileForm: FormGroup;
  userName: string;
  email: string;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userName = this.authService.getUserName();
    this.email = this.authService.getEmail();
    this.myUserProfileForm = new FormGroup({
      name: new FormControl(
        { value: this.userName, disabled: true },
        Validators.required,
      ),
      email: new FormControl({ value: this.email, disabled: true }),
    });
  }

  toggleUsernameModification(): void {
    if (this.myUserProfileForm.controls.name.disabled) {
      this.myUserProfileForm.controls.name.enable();
    } else {
      this.myUserProfileForm.controls.name.disable();
    }
  }

  submitUsernameChange(): void {
    this.newUsernameRequest.emit({
      name: this.myUserProfileForm.controls.name.value,
    });
    this.myUserProfileForm.controls.name.disable();
  }
}
