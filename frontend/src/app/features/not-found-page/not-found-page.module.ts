import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { NotFoundPageRoutingModule } from './not-found-page-routing.module';

@NgModule({
  declarations: [NotFoundPageComponent],
  imports: [CommonModule, SharedModule, NotFoundPageRoutingModule],
})
export class NotFoundPageModule {}
