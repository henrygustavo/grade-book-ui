import { Route, RouterModule } from '@angular/router';
import { DashBoardComponent } from './components/dashboard/dashboard.component';
import { ModuleWithProviders } from '@angular/core';
import { AdminGuard } from './guards/admin.guard';

import {NgxPermissionsGuard} from 'ngx-permissions';
import { CourseListComponent } from './components/course/course-list/course-list.component';
import { CourseEditComponent } from './components/course/course-edit/course-edit.component';
import { UserListComponent } from './components/user/user-list/user-list.component';
import { UserEditComponent } from './components/user/user-edit/user-edit.component';
import { GradeBookListComponent } from './components/grade-book/grade-book-list/grade-book-list.component';
import { GradeBookEditComponent } from './components/grade-book/grade-book-edit/grade-book-edit.component';

const routes: Route[] = [
    {
        path: 'dashboard',
        component: DashBoardComponent,
        canActivate: [AdminGuard, NgxPermissionsGuard],
        data: { permissions: { only: ['ADMIN', 'TEACHER', 'STUDENT']}}
    },
    {
        path: 'users',
        component: UserListComponent,
        canActivate: [AdminGuard, NgxPermissionsGuard],
        data: { permissions: { only: ['ADMIN']}}
    },
    {
        path: 'users/edit/:id',
        component: UserEditComponent,
        canActivate: [AdminGuard, NgxPermissionsGuard],
        data: { permissions: { only: ['ADMIN']}}
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
        path: 'gradebooks',
        component: GradeBookListComponent,
        canActivate: [AdminGuard, NgxPermissionsGuard],
        data: { permissions: { only: ['ADMIN','TEACHER', 'STUDENT']}}
    },
    {
        path: 'gradebooks/edit/:id',
        component: GradeBookEditComponent,
        canActivate: [AdminGuard, NgxPermissionsGuard],
        data: { permissions: { only: ['ADMIN','TEACHER', 'STUDENT']}}
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

