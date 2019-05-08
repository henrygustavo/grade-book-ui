import { Route, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { ModuleWithProviders } from '@angular/core';
import { AccountGuard } from './guards/account.guard';

const routes: Route[] = [
    { path: 'login', component: LoginComponent, canActivate: [AccountGuard] },
    { path: '**', redirectTo: 'login', pathMatch: 'full', canActivate: [AccountGuard] }
];

export const accountRoutes: ModuleWithProviders = RouterModule.forChild(routes);
