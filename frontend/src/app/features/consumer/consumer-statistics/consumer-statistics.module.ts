import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsumerStatisticsRoutingModule } from './consumer-statistics-routing.module';
import { ConsumerStatisticsComponent } from './consumer-statistics/consumer-statistics.component';

@NgModule({
  declarations: [
    ConsumerStatisticsComponent
  ],
  imports: [CommonModule, ConsumerStatisticsRoutingModule],
})
export class ConsumerStatisticsModule {}
