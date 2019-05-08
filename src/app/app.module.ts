import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';

import { Ng2UiAuthModule } from 'ng2-ui-auth';
import { AuthConfig } from './auth-config';
import { ToastModule } from 'ng2-toastr';
import { BlockUIModule } from 'ng-block-ui';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MessageAlertHandleService } from './shared/services/message-alert.service';
import { HeaderComponent } from './shared/components/header/header.component';
import { MenuService } from './shared/services/menu.service';

import { NgxPermissionsModule } from 'ngx-permissions';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    Ng2UiAuthModule.forRoot(AuthConfig),
    NgxPermissionsModule.forRoot(),
    ToastModule.forRoot(),
    BlockUIModule.forRoot(
      {
        message: 'Please wait...'
      }
    ),
    appRoutes
  ],
  providers: [MessageAlertHandleService, MenuService],
  bootstrap: [AppComponent]
})
export class AppModule { }
