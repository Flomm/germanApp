import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsumerMyTicketsComponent } from './consumer-my-tickets/consumer-my-tickets.component';

const routes: Routes = [
  {
    path: '',
    component: ConsumerMyTicketsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsumerMyTicketsRoutingModule {}
