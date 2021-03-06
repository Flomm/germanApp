import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import AuthService from 'src/app/core/services/authService/auth.service';
import { UserRole } from '../../models/enums/UserRole.enum';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
})
export class WelcomePageComponent implements OnInit {
  userRolesList = UserRole;
  userRoleObs: Observable<string>;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userRoleObs = this.authService.userRoleObservable;
  }
}
