import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { DescriptionComponent } from './description/description.component';
import { LandingPageRoutingModule } from './landing-page-routing.module';

@NgModule({
  declarations: [DescriptionComponent, LandingPageComponent],
  imports: [CommonModule, SharedModule, LandingPageRoutingModule],
})
export class LandingPageModule {}
