import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import AuthService from 'src/app/core/services/authService/auth.service';
import { CartService } from 'src/app/core/services/cartService/cart.service';
import { UserRole } from '../../models/enums/UserRole.enum';
import ISmallTicketData from '../../models/models/viewModels/ISmallTicketData.viewModel';

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

  cartSubscription: Subscription;

  isTicketVisible: boolean = false;

  isCartOpen: boolean = false;

  cartList: ISmallTicketData[];

  constructor(
    private authService: AuthService,
    private cartService: CartService
  ) {}

  ngOnDestroy(): void {
    this.userNameSubscription.unsubscribe();
    this.cartSubscription.unsubscribe();
    this.userRoleSubscription.unsubscribe();
  }

  ngOnInit() {
    this.userNameSubscription = this.authService.userNameObservable.subscribe(
      (x) => {
        this.userName = x;
      }
    );
    this.cartSubscription = this.cartService.cartCounterObservable.subscribe(
      (y) => {
        this.cartList = y;
        if (this.cartList?.length) {
          this.isTicketVisible = false;
        }
      }
    );
    this.userRoleSubscription = this.authService.userRoleObservable.subscribe(
      (z) => {
        this.userRole = parseInt(z);
      }
    );
  }

  showCartItems(): void {
    this.isTicketVisible = !this.isTicketVisible;
  }

  removeTicket(ticket: ISmallTicketData): void {
    this.cartService.removeTicket(ticket.id);
  }

  logOut(): void {
    this.authService.logout();
  }
}
