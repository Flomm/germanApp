import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPageComponent } from './admin-page/admin-page.component';

const routes: Routes = [
  {
    path: '',
    component: AdminPageComponent,
    children: [
      {
        path:'',
        redirectTo: 'tickets',
        pathMatch: 'full' 
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./admin-users/admin-users.module').then(
            (m) => m.AdminUsersModule
          ),
      },
      {
        path: 'tickets',
        loadChildren: () =>
          import('./admin-tickets/admin-tickets.module').then(
            (m) => m.AdminTicketsModule
          ),
      },
      {
        path: 'new-ticket',
        loadChildren: () =>
          import('./admin-add-ticket/admin-add-ticket.module').then(
            (m) => m.AdminAddTicketModule
          ),
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
