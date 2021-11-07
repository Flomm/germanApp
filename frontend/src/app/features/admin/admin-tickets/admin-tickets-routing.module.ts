import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminTicketsComponent } from './admin-tickets/admin-tickets.component';

const routes: Routes = [
  {
    path: '',
    component: AdminTicketsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminTicketsRoutingModule {}
