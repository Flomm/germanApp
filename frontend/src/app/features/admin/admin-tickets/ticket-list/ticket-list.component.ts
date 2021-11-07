import { Component, Input } from '@angular/core';
import IGetTicketResponse from 'src/app/shared/models/responses/IGetTicketResponse';

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.scss'],
})
export class TicketListComponent {
  @Input()
  getTicketResponse: IGetTicketResponse;
}
