import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminAddTicketRoutingModule } from './admin-add-ticket-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AdminAddTicketRoutingModule,
    SharedModule
  ]
})
export class AdminAddTicketModule { }
