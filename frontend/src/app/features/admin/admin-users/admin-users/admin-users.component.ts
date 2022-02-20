import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/core/services/userService/user.service';
import IGetUserResponse from 'src/app/shared/models/responses/IGetUserResponse';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
})
export class AdminUsersComponent implements OnInit {
  getUserResponse: IGetUserResponse;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getUserData();
  }

  getUserData(): void {
    this.userService
      .getAllUsers()
      .subscribe(response => (this.getUserResponse = response));
  }
}
