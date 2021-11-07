import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import AuthService from 'src/app/core/services/authService/auth.service';
import { UserRole } from '../../models/enums/UserRole.enum';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input()
  hasAuthorizationButtons: boolean = true;

  userRolesList: object = UserRole;

  userName: string;

  userNameSubscription: Subscription;

  userRole: number;

  userRoleSubscription: Subscription;

  constructor(private authService: AuthService) {}

  ngOnDestroy(): void {
    this.userNameSubscription.unsubscribe();
    this.userRoleSubscription.unsubscribe();
  }

  ngOnInit() {
    this.userNameSubscription = this.authService.userNameObservable.subscribe(
      (x) => {
        this.userName = x;
      }
    );
    this.userRoleSubscription = this.authService.userRoleObservable.subscribe(
      (z) => {
        this.userRole = parseInt(z);
      }
    );
  }

  logOut(): void {
    this.authService.logout();
  }
}
