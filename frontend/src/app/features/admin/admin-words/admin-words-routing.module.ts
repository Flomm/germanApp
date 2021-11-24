import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminWordsComponent } from './admin-words/admin-words.component';

const routes: Routes = [
  {
    path: '',
    component: AdminWordsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminWordsRoutingModule {}
