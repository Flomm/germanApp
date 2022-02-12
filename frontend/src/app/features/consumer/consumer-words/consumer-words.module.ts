import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsumerWordsComponent } from './consumer-words/consumer-words.component';
import { ConsumerWordsRoutingModule } from './consumer-words-routing.module';

@NgModule({
  declarations: [ConsumerWordsComponent],
  imports: [CommonModule, ConsumerWordsRoutingModule],
})
export class ConsumerWordsModule {}
