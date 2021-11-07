import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminTicketsRoutingModule } from './admin-tickets-routing.module';
import { AdminTicketsComponent } from './admin-tickets/admin-tickets.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TicketListComponent } from './ticket-list/ticket-list.component';

@NgModule({
  declarations: [AdminTicketsComponent, TicketListComponent],
  imports: [CommonModule, SharedModule, AdminTicketsRoutingModule],
})
export class AdminTicketsModule {}
