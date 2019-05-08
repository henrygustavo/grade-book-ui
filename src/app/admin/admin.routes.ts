import { Route, RouterModule } from '@angular/router';
import { DashBoardComponent } from './components/dashboard/dashboard.component';
import { ModuleWithProviders } from '@angular/core';
import { AdminGuard } from './guards/admin.guard';

import {NgxPermissionsGuard} from 'ngx-permissions';
import { CourseListComponent } from './components/course/course-list/course-list.component';
import { CourseEditComponent } from './components/course/course-edit/course-edit.component';

const routes: Route[] = [
    {
        path: 'dashboard',
        component: DashBoardComponent,
        canActivate: [AdminGuard, NgxPermissionsGuard],
        data: { permissions: { only: ['ADMIN', 'TEACHER', 'STUDENT']}}
    },
    {
        path: 'courses',
        component: CourseListComponent,
        canActivate: [AdminGuard, NgxPermissionsGuard],
        data: { permissions: { only: ['ADMIN','TEACHER']}}
    },
    {
        path: 'courses/edit/:id',
        component: CourseEditComponent,
        canActivate: [AdminGuard, NgxPermissionsGuard],
        data: { permissions: { only: ['ADMIN','TEACHER']}}
    },
    {
        path: '**',
        redirectTo: 'dashboard',
        pathMatch: 'full',
        canActivate: [AdminGuard, NgxPermissionsGuard],
        data: { permissions: { only: ['ADMIN', 'TEACHER', 'STUDENT']}}
    }
];

export const adminRoutes: ModuleWithProviders = RouterModule.forChild(routes);
