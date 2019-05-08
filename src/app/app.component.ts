import { Component, ViewContainerRef, OnInit } from '@angular/core';
import { ToastsManager } from 'ng2-toastr';
import { AuthService } from 'ng2-ui-auth';
import { Router, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NgxRolesService } from 'ngx-permissions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public isAuthenticated: boolean;

  constructor(
    public _containerRef: ViewContainerRef,
    private toastr: ToastsManager,
    private _authService: AuthService,
    private _router: Router,
    private _ngxRolesService: NgxRolesService,
  ) {

    this.toastr.setRootViewContainerRef(_containerRef);

  }

  ngOnInit() {

    this._router.events.pipe(filter(event => event instanceof NavigationStart)).subscribe(() => {
      this.isAuthenticated = this._authService.isAuthenticated();
      this.handlePermissionsByRole();
    });
  }

  handlePermissionsByRole(): void {

    let role = this._authService.isAuthenticated() &&
      this._authService.getPayload() !== undefined
      ? this._authService.getPayload().role.toLowerCase() : '';

    this._ngxRolesService.addRoles({
      'ADMIN': () => {
        return this._authService.isAuthenticated() &&
          role === 'admin';
      },
      'TEACHER': () => {
        return this._authService.isAuthenticated() &&
          role === 'teacher';
      },
      'STUDENT': () => {
        return this._authService.isAuthenticated() &&
          role === 'student';
      },
      'GUEST': () => {
        return !this._authService.isAuthenticated();
      }
    });
  }
}
