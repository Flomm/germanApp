import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsumerMainComponent } from './consumer-main/consumer-main.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ConsumerMainRoutingModule } from './consumer-main-routing.module';

@NgModule({
  declarations: [ConsumerMainComponent],
  imports: [CommonModule, SharedModule, ConsumerMainRoutingModule],
})
export class ConsumerMainModule {}
