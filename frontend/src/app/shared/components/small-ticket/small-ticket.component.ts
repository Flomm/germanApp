import { Component, Input, Output } from '@angular/core';
import { TicketType } from '../../models/enums/TicketType.enum';
import ISmallTicketData from '../../models/models/viewModels/ISmallTicketData.viewModel';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-small-ticket',
  templateUrl: './small-ticket.component.html',
  styleUrls: ['./small-ticket.component.scss'],
})
export class SmallTicketComponent {
  @Input()
  smallTicketData: ISmallTicketData;

  @Output()
  removeTicket: EventEmitter<ISmallTicketData> = new EventEmitter<ISmallTicketData>();

  ticketTypeEnum = TicketType;

  constructor() {}

  deleteTicket(): void {
    this.removeTicket.emit(this.smallTicketData)
  }
}
