import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';

import { accountRoutes } from './account.routes';
import { AccountGuard } from './guards/account.guard';

@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    accountRoutes
  ],
  declarations: [LoginComponent],
  providers: [AccountGuard]
})
export class AccountModule { }
