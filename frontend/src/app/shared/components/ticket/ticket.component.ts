import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { TicketType } from '../../models/enums/TicketType.enum';
import { FormControl, Validators } from '@angular/forms';
import AuthService from 'src/app/core/services/authService/auth.service';
import { UserRole } from '../../models/enums/UserRole.enum';
import ITicketData from '../../models/models/viewModels/ITicketData.viewModel';
import ISmallTicketData from '../../models/models/viewModels/ISmallTicketData.viewModel';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss'],
})
export class TicketComponent implements OnChanges {
  @Input()
  ticketData: ITicketData;
  @Input()
  purchasable = true;
  ticketTypeEnum = TicketType;
  numberOfTickets: FormControl;
  currentRole: UserRole;
  userRoles = UserRole;

  @Output()
  addTicket: EventEmitter<ISmallTicketData> = new EventEmitter<ISmallTicketData>();

  constructor(private authService: AuthService) {
    this.currentRole = parseInt(this.authService.getUserRole());
  }

  ngOnChanges(): void {
    this.numberOfTickets = new FormControl(1, [
      Validators.min(1),
      Validators.max(this.ticketData.numberOfRemainingTickets),
    ]);
  }

  addToBasket(): void {
    const ticketInfo: ISmallTicketData = {
      count: this.numberOfTickets.value,
      id: this.ticketData.id,
      name: this.ticketData.name,
      price: this.ticketData.price,
      type: this.ticketData.type
    }
    this.addTicket.emit(ticketInfo);
  }

  reducesValue(): void {
    if (this.numberOfTickets.value > 1) {
      this.numberOfTickets.setValue(this.numberOfTickets.value - 1);
    }
  }

  increasesValue(): void {
    if (
      this.numberOfTickets.value !== this.ticketData.numberOfRemainingTickets
    ) {
      this.numberOfTickets.setValue(this.numberOfTickets.value + 1);
    }
  }

  modifyTicket(): void {}

  deleteTicket(): void {}

  showMore(): void {}
}
