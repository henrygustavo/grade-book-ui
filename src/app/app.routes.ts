import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

 const routes: Routes = [
    { path: 'account', loadChildren: './account/account.module#AccountModule' },
    { path: '', loadChildren: './admin/admin.module#AdminModule' }
];

export const appRoutes: ModuleWithProviders = RouterModule.forRoot(routes, {useHash: true});
