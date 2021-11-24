import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPageComponent } from './admin-page/admin-page.component';

const routes: Routes = [
  {
    path: '',
    component: AdminPageComponent,
    children: [
      {
        path: '',
        redirectTo: 'tickets',
        pathMatch: 'full',
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./admin-users/admin-users.module').then(
            (m) => m.AdminUsersModule
          ),
      },
      {
        path: 'words',
        loadChildren: () =>
          import('./admin-words/admin-words.module').then(
            (m) => m.AdminWordsModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
