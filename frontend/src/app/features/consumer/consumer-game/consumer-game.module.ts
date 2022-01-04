import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ConsumerGameRoutingModule } from './consumer-game-routing.module';
import { ConsumerGameComponent } from './consumer-game/consumer-game.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ConsumerGameComponent, MainMenuComponent],
  imports: [
    CommonModule,
    ConsumerGameRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class ConsumerGameModule {}
