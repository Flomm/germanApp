import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsumerRoutingModule } from './consumer-routing.module';
import { ConsumerComponent } from './consumer/consumer.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ConsumerComponent],
  imports: [CommonModule, SharedModule, ConsumerRoutingModule],
})
export class ConsumerModule {}
