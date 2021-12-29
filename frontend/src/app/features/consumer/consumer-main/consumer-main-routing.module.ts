import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsumerMainComponent } from './consumer-main/consumer-main.component';

const routes: Routes = [
  {
    path: '',
    component: ConsumerMainComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsumerMainRoutingModule {}
