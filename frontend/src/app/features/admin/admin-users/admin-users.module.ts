import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListTableComponent } from './user-list-table/user-list-table.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { AdminUsersRoutingModule } from './admin-user-routing.module';

@NgModule({
  declarations: [UserListTableComponent, AdminUsersComponent],
  imports: [CommonModule, SharedModule, AdminUsersRoutingModule],
})
export class AdminUsersModule {}
