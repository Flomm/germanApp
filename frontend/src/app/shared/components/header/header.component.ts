import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import AuthService from 'src/app/core/services/authService/auth.service';
import { UserRole } from '../../models/enums/UserRole.enum';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  @Input()
  hasAuthorizationButtons = true;

  userRolesList = UserRole;

  userNameObs: Observable<string>;

  userRoleObs: Observable<string>;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userNameObs = this.authService.userNameObservable;
    this.userRoleObs = this.authService.userRoleObservable;
  }

  logOut(): void {
    this.authService.logout();
  }
}
