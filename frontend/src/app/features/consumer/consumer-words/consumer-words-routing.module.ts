import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsumerWordsComponent } from './consumer-words/consumer-words.component';

const routes: Routes = [{ path: '', component: ConsumerWordsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsumerWordsRoutingModule {}
