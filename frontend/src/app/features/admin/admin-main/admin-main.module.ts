import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminMainComponent } from './admin-main/admin-main.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdminMainRoutingModule } from './admin-main-router.module';

@NgModule({
  declarations: [AdminMainComponent],
  imports: [CommonModule, SharedModule, AdminMainRoutingModule],
})
export class AdminMainModule {}
