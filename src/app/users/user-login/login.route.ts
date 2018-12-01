import { Route } from '@angular/router';
import { UserLoginComponent } from './user-login.component';

export const loginRoute: Route = {
    path: '',
    component: UserLoginComponent,
    outlet: 'navbar'
};
