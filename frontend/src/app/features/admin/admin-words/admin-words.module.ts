import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminWordsComponent } from './admin-words/admin-words.component';
import { AdminWordsRoutingModule } from './admin-words-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { WordsListTableComponent } from './words-list-table/words-list-table.component';



@NgModule({
  declarations: [
    AdminWordsComponent,
    WordsListTableComponent
  ],
  imports: [
    CommonModule, AdminWordsRoutingModule, SharedModule
  ]
})
export class AdminWordsModule { }
