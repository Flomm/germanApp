import { Component, Input } from '@angular/core';
import { CartService } from 'src/app/core/services/cartService/cart.service';
import ISmallTicketData from 'src/app/shared/models/models/viewModels/ISmallTicketData.viewModel';
import IGetTicketResponse from 'src/app/shared/models/responses/IGetTicketResponse';

@Component({
  selector: 'app-consumer-ticket',
  templateUrl: './consumer-ticket.component.html',
  styleUrls: ['./consumer-ticket.component.scss'],
})
export class ConsumerTicketComponent {
  @Input()
  getTicketResponse: IGetTicketResponse;

  constructor(private cartService: CartService) {}

  onAddTicket(ticketData: ISmallTicketData): void {
    this.cartService.addTicket(ticketData)
  }
}
