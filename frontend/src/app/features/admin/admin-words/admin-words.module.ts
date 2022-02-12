import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminWordsComponent } from './admin-words/admin-words.component';
import { AdminWordsRoutingModule } from './admin-words-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AdminWordsComponent],
  imports: [
    CommonModule,
    AdminWordsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class AdminWordsModule {}
