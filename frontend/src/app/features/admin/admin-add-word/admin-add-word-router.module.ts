import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminAddWordComponent } from './admin-add-word/admin-add-word.component';

const routes: Routes = [
  {
    path: '',
    component: AdminAddWordComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminAddWordRoutingModule {}
