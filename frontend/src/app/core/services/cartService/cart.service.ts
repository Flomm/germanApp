import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import ISmallTicketData from 'src/app/shared/models/models/viewModels/ISmallTicketData.viewModel';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartSubject: Subject<ISmallTicketData[]> = new Subject<ISmallTicketData[]>();
  cartCounterObservable: Observable<
    ISmallTicketData[]
  > = this.cartSubject.asObservable();
  cartList: ISmallTicketData[] = [];

  addTicket(ticket: ISmallTicketData) {
    this.cartList.push(ticket);
    this.cartSubject.next(this.cartList);
  }

  removeTicket(ticketId: number) {
    this.cartList = this.cartList.filter((item) => item.id !== ticketId);
    this.cartSubject.next(this.cartList);
  }

  resetCart() {
    this.cartList = [];
    this.cartSubject.next(this.cartList);
  }
}
