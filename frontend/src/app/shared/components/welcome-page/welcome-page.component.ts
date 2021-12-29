import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import AuthService from 'src/app/core/services/authService/auth.service';
import { UserRole } from '../../models/enums/UserRole.enum';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss'],
})
export class WelcomePageComponent implements OnInit, OnDestroy {
  userRolesList: object = UserRole;
  userRole: number;
  userRoleSubscription: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userRoleSubscription = this.authService.userRoleObservable.subscribe(
      (z) => {
        this.userRole = parseInt(z);
      }
    );
  }

  ngOnDestroy(): void {
    this.userRoleSubscription.unsubscribe();
  }
}
