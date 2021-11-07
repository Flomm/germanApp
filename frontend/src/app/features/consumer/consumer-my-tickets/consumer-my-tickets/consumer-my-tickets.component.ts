import { Component, OnInit } from '@angular/core';
import TicketService from 'src/app/core/services/ticketService/ticket.service';
import IGetTicketResponse from 'src/app/shared/models/responses/IGetTicketResponse';

@Component({
  selector: 'app-consumer-my-tickets',
  templateUrl: './consumer-my-tickets.component.html',
  styleUrls: ['./consumer-my-tickets.component.scss'],
})
export class ConsumerMyTicketsComponent implements OnInit {
  getMyTicketsResponse: IGetTicketResponse;
  
  constructor(private ticketService: TicketService) {}

  ngOnInit(): void {
    this.ticketService.getMyTickets().subscribe((response) => {
      this.getMyTicketsResponse = response;
    });
  }
}
