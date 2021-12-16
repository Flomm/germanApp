import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminAddWordComponent } from './admin-add-word/admin-add-word.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminAddWordRoutingModule } from './admin-add-word-router.module';

@NgModule({
  declarations: [AdminAddWordComponent],
  imports: [
    CommonModule,
    AdminAddWordRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class AdminAddWordModule {}
