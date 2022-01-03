import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsumerGameComponent } from './consumer-game/consumer-game.component';

const routes: Routes = [{ path: '', component: ConsumerGameComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsumerGameRoutingModule {}
