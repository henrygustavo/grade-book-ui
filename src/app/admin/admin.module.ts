import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashBoardComponent } from './components/dashboard/dashboard.component';
import { adminRoutes } from './admin.routes';
import { AdminGuard } from './guards/admin.guard';

import {NgxDatatableModule} from '@swimlane/ngx-datatable';

import { ReactiveFormsModule } from '@angular/forms';

import { GradeBookService } from './services/grade-book.service';
import { UserService } from './services/user.service';
import { RoleService } from './services/role.service';
import { CourseService } from './services/course.service';
import { CourseListComponent } from './components/course/course-list/course-list.component';
import { CourseEditComponent } from './components/course/course-edit/course-edit.component';
import { UserListComponent } from './components/user/user-list/user-list.component';


@NgModule({
  imports: [
    CommonModule,
    NgxDatatableModule,
    ReactiveFormsModule,
    adminRoutes
  ],
  declarations: [DashBoardComponent, CourseListComponent, CourseEditComponent,UserListComponent],
  providers: [AdminGuard,CourseService, RoleService, UserService, GradeBookService]

})
export class AdminModule { }

