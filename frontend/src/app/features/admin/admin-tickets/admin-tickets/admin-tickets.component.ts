import { Component, OnInit } from '@angular/core';
import TicketService from 'src/app/core/services/ticketService/ticket.service';
import IGetTicketResponse from 'src/app/shared/models/responses/IGetTicketResponse';

@Component({
  selector: 'app-admin-tickets',
  templateUrl: './admin-tickets.component.html',
  styleUrls: ['./admin-tickets.component.scss'],
})
export class AdminTicketsComponent implements OnInit {
  getTicketResponse: IGetTicketResponse;

  constructor(private ticketService: TicketService) {}

  ngOnInit(): void {
    this.ticketService
      .getTicket()
      .subscribe((response) => (this.getTicketResponse = response));
  }
}
