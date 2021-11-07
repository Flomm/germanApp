import { Component, OnInit } from '@angular/core';
import TicketService from 'src/app/core/services/ticketService/ticket.service';
import IGetTicketResponse from 'src/app/shared/models/responses/IGetTicketResponse';

@Component({
  selector: 'app-consumer-ticket-page',
  templateUrl: './consumer-ticket-page.component.html',
  styleUrls: ['./consumer-ticket-page.component.scss'],
})
export class ConsumerTicketPageComponent implements OnInit {
  getTicketResponse: IGetTicketResponse;
  
  constructor(private ticketService: TicketService) {}

  ngOnInit(): void {
    this.ticketService.getTicket().subscribe((response) => {
      this.getTicketResponse = response;
    });
  }
}
