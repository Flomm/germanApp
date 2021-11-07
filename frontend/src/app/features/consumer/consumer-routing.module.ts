import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsumerComponent } from './consumer/consumer.component';

const routes: Routes = [
  {
    path: '',
    component: ConsumerComponent,
    children: [
      {
        path: '',
        redirectTo: 'tickets',
        pathMatch: 'full',
      },
      {
        path: 'tickets',
        loadChildren: () =>
          import('./consumer-ticket/consumer-ticket.module').then(
            (m) => m.ConsumerTicketModule
          ),
      },
      {
        path: 'my-tickets',
        loadChildren: () =>
          import('./consumer-my-tickets/consumer-my-tickets.module').then(
            (m) => m.ConsumerMyTicketsModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsumerRoutingModule {}
