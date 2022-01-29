import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminModifyWordComponent } from './admin-modify-word/admin-modify-word/admin-modify-word.component';

@NgModule({
  declarations: [AdminPageComponent, AdminModifyWordComponent],
  imports: [
    CommonModule,
    SharedModule,
    AdminRoutingModule,
    ReactiveFormsModule,
  ],
})
export class AdminModule {}
