import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsumerGameRoutingModule } from './consumer-game-routing.module';
import { ConsumerGameComponent } from './consumer-game/consumer-game.component';


@NgModule({
  declarations: [
    ConsumerGameComponent
  ],
  imports: [
    CommonModule,
    ConsumerGameRoutingModule
  ]
})
export class ConsumerGameModule { }
