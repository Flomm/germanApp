import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddTicketFormComponent } from './add-ticket-form/add-ticket-form.component';

const routes: Routes = [
  {
    path: '',
    component: AddTicketFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminAddTicketRoutingModule {}
