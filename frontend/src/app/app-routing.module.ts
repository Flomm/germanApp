import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/services/authGuard/auth.guard';
import { EmailVerificationPageComponent } from './features/authentication-page/email-verification-page/email-verification-page/email-verification-page.component';
import { UserRole } from './shared/models/enums/UserRole.enum';

const routes: Routes = [
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  {
    path: 'landing',
    loadChildren: () =>
      import('./features/landing-page/landing-page.module').then(
        (m) => m.LandingPageModule
      ),
  },
  {
    path: 'email/verify',
    component: EmailVerificationPageComponent,
  },
  {
    path: 'registration',
    loadChildren: () =>
      import('./features/authentication-page/authentication-page.module').then(
        (m) => m.AuthenticationPageModule
      ),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./features/authentication-page/authentication-page.module').then(
        (m) => m.AuthenticationPageModule
      ),
  },
  {
    path: 'password-recovery',
    loadChildren: () =>
      import('./features/authentication-page/authentication-page.module').then(
        (m) => m.AuthenticationPageModule
      ),
  },
  {
    path: 'new-password',
    loadChildren: () =>
      import('./features/authentication-page/authentication-page.module').then(
        (m) => m.AuthenticationPageModule
      ),
  },
  {
    path: 'myprofile',
    loadChildren: () =>
      import('./features/authentication-page/authentication-page.module').then(
        (m) => m.AuthenticationPageModule
      ),
  },
  {
    path: 'admin',
    canLoad: [AuthGuard],
    data: { roles: [UserRole.Admin] },
    loadChildren: () =>
      import('./features/admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: 'consumer',
    canLoad: [AuthGuard],
    data: { roles: [UserRole.All] },
    loadChildren: () =>
      import('./features/consumer/consumer.module').then(
        (m) => m.ConsumerModule
      ),
  },
  {
    path: '**',
    loadChildren: () =>
      import('./features/not-found-page/not-found-page.module').then(
        (m) => m.NotFoundPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
