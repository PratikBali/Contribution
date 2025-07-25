import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserProfileComponent } from './users/user-profile/user-profile.component';
import { UserLoginComponent } from './users/user-login/user-login.component';
import { navbarRoute } from './layouts/navbar/navbar.route';
import { loginRoute } from './users/user-login/login.route';
import { HOME_ROUTE } from './home/home.route';

const routes: Routes = [
  // { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: UserLoginComponent },
  { path: 'profile', component: UserProfileComponent },
  // { path: 'user', component: UserComponent,  resolve: { data: UserResolver}}

];

const LAYOUT_ROUTES = [navbarRoute, loginRoute, HOME_ROUTE];

@NgModule({
  imports: [
    RouterModule.forRoot([ ...LAYOUT_ROUTES ]),
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
