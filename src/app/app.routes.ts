import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { LandingComponent } from './pages/landing/landing.component';

import { NotFoundComponent } from './not-found/not-found.component';
import { AuthGuardService } from './services/auth.guard.service';
import { RoleGuardService } from './services/role.guard.service';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { UserDashboardComponent } from './pages/user-dashboard/user-dashboard.component';

import { RegisterComponent } from './pages/auth/register/register.component';
import { LoginComponent } from './pages/auth/login/login.component';

export const routes: Routes = [
  // 1) Redirect empty to /main
  { path: '', redirectTo: 'main', pathMatch: 'full' },

  // 2) Then the “main” / landing page
  { path: 'main', component: LandingComponent },

  // 3) Auth pages
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // route path for different user according to their roles
  {
    path: 'dashboard/admin',
    component: AdminDashboardComponent,
    canActivate: [AuthGuardService, RoleGuardService],
    data: { roles: ['admin'] },
  },
  {
    path: 'dashboard/user',
    component: UserDashboardComponent,
    canActivate: [AuthGuardService, RoleGuardService],
    data: { roles: ['user'] },
  },
  {
    path: 'dashboard/owner',
    loadChildren: () =>
      import('./pages/owner-dashboard/owner-dashboard.module').then(
        (m) => m.OwnerDashboardModule
      ),
  },

  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
