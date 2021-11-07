import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsumerTicketsRoutingModule } from './consumer-ticket-routing.module';
import { ConsumerTicketComponent } from './consumer-ticket/consumer-ticket.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ConsumerTicketPageComponent } from './consumer-ticket-page/consumer-ticket-page.component';

@NgModule({
  declarations: [ConsumerTicketComponent, ConsumerTicketPageComponent],
  imports: [CommonModule, ConsumerTicketsRoutingModule, SharedModule],
})
export class ConsumerTicketModule {}
