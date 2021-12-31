import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsumerComponent } from './consumer/consumer.component';

const routes: Routes = [
  {
    path: '',
    component: ConsumerComponent,
    children: [
      {
        path: '',
        redirectTo: 'welcome',
        pathMatch: 'full',
      },
      {
        path: 'welcome',
        loadChildren: () =>
          import('./consumer-main/consumer-main.module').then(
            (m) => m.ConsumerMainModule
          ),
      },
      {
        path: 'statistics',
        loadChildren: () =>
          import('./consumer-statistics/consumer-statistics.module').then(
            (m) => m.ConsumerStatisticsModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsumerRoutingModule {}
