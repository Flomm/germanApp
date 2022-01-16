import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ConsumerGameRoutingModule } from './consumer-game-routing.module';
import { ConsumerGameComponent } from './consumer-game/consumer-game.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { ReactiveFormsModule } from '@angular/forms';
import { InfoComponent } from './info/info.component';
import { PlayCardComponent } from './play-card/play-card.component';
import { FinishScreenComponent } from './finish-screen/finish-screen.component';

@NgModule({
  declarations: [ConsumerGameComponent, MainMenuComponent, InfoComponent, PlayCardComponent, FinishScreenComponent],
  imports: [
    CommonModule,
    ConsumerGameRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class ConsumerGameModule {}
