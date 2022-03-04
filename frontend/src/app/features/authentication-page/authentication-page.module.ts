import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthenticationPageRoutingModule } from './authentication-page-routing.module';
import { AuthenticationPageComponent } from './authentication-page/authentication-page.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { RegistrationFormComponent } from './registration-form/registration-form.component';
import { NewPasswordFormComponent } from './new-password-form/new-password-form.component';
import { PasswordRecoveryFormComponent } from './password-recovery-form/password-recovery-form.component';
import { EmailVerificationPageComponent } from './email-verification-page/email-verification-page/email-verification-page.component';
import { MyProfileComponent } from './my-profile-page/my-profile.component';
import { ChangePasswordFormComponent } from './change-password-form/change-password-form.component';

@NgModule({
  declarations: [
    AuthenticationPageComponent,
    LoginFormComponent,
    RegistrationFormComponent,
    NewPasswordFormComponent,
    PasswordRecoveryFormComponent,
    EmailVerificationPageComponent,
    MyProfileComponent,
    ChangePasswordFormComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    AuthenticationPageRoutingModule,
    ReactiveFormsModule,
  ],
})
export class AuthenticationPageModule {}
