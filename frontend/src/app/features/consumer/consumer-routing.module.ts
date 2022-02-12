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
      {
        path: 'game',
        loadChildren: () =>
          import('./consumer-game/consumer-game.module').then(
            (m) => m.ConsumerGameModule
          ),
      },
      {
        path: 'words',
        loadChildren: () =>
          import('./consumer-words/consumer-words.module').then(
            (m) => m.ConsumerWordsModule
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
