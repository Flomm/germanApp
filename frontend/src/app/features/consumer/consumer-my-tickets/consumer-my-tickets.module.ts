import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsumerMyTicketsComponent } from './consumer-my-tickets/consumer-my-tickets.component';
import { ConsumerMyTicketsRoutingModule } from './consumer-my-tickets-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ConsumerMyTicketsComponent],
  imports: [CommonModule, ConsumerMyTicketsRoutingModule, SharedModule],
})
export class ConsumerMyTicketsModule {}
