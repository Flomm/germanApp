import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { KeyFeaturesComponent } from './key-features/key-features.component';
import { VideoSlotComponent } from './video-slot/video-slot.component';
import { DescriptionComponent } from './description/description.component';
import { LandingPageRoutingModule } from './landing-page-routing.module';
import { SubscribeMailComponent } from './subscribe-mail/subscribe-mail.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    DescriptionComponent,
    LandingPageComponent,
    KeyFeaturesComponent,
    VideoSlotComponent,
    SubscribeMailComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    LandingPageRoutingModule,
    ReactiveFormsModule,
  ],
})
export class LandingPageModule {}
