import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsumerStatisticsComponent } from './consumer-statistics/consumer-statistics.component';

const routes: Routes = [{ path: '', component: ConsumerStatisticsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsumerStatisticsRoutingModule {}
