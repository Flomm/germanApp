import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsumerTicketPageComponent } from './consumer-ticket-page/consumer-ticket-page.component';

const routes: Routes = [{ path: '', component: ConsumerTicketPageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsumerTicketsRoutingModule {}
