import { Component, OnInit, ViewChildren, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { MenuService } from '../../../../shared/services/menu.service';
import { UserService } from '../../../services/user.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormControlName, FormBuilder, FormControl, Validators } from '@angular/forms';
import { User } from '../../../models/user';
import { GenericValidator } from '../../../../shared/validators/generic-validator';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageAlertHandleService } from '../../../../shared/services/message-alert.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import { CustomValidators } from 'ng2-validation';
import { RoleService } from '../../../services/role.service';
import { Role } from '../../../models/role';

@Component({ selector: 'app-user-edit', templateUrl: './user-edit.component.html', styleUrls: ['./user-edit.component.css'] })
export class UserEditComponent implements OnInit, AfterViewInit, OnDestroy {

  @BlockUI() blockUI: NgBlockUI;
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements: ElementRef[] = [];
  displayMessage: { [key: string]: string } = {};
  validationMessages: { [key: string]: { [key: string]: string } };
  genericValidator: GenericValidator;
  subscription: Subscription = new Subscription();
  mainForm: FormGroup;
  roles: Role[];

  constructor(private _menuService: MenuService,
    private _roleService: RoleService,
    private _userService: UserService,
    private _messageAlertHandleService: MessageAlertHandleService,
    private _route: ActivatedRoute,
    private _router: Router,
    private formBuilder: FormBuilder) { }

  ngOnInit() {

    this._menuService.selectMenuItem('users');
    this.getRoles();
    this.setUpValidationMessages();
    this.setUpFormControls();
  }

  ngAfterViewInit(): void {

    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    let controlSubscription = Observable.merge(this.mainForm.valueChanges, ...controlBlurs).debounceTime(800).subscribe(() => {
      this.displayMessage = this.genericValidator.processMessages(this.mainForm);
    });

    this.subscription.add(controlSubscription);

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  setUpValidationMessages(): void {

    this.validationMessages = {

      roleId: {
        required: 'Role is required.'
      },
      fullName: {
        required: 'Full Name is required.',
        minlength: 'Full Name must have at least 4 characters.',
      },
      userName: {
        required: 'User Name is required.',
        rangeLength: 'User Name must have 8-10 characters.',
      },
      email: {
        required: 'Email is required.',
        minlength: 'Email must have at least 4 characters.',
        email: 'Please enter a valid email address.'
      },
      password: {
        required: 'Password is required.',
        minlength: 'Password must be at least 8 characters.'
      },
      confirmPassword: {
        required: 'Password is required.',
        minlength: 'Password must be at least 8 characters.',
        equalTo: 'ConfirmPassword does not match with Password'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  setUpFormControls(): void {

    const formSubscription = this._route.params.subscribe(

      (params): void => {

        const id: number = Number(params['id']);
        let isAddingNewUser: boolean = id !== 0;

        let password = new FormControl({ value: '', disabled: isAddingNewUser }, [Validators.required, Validators.minLength(8)]);
        let confirmPassword = new FormControl({ value: '', disabled: isAddingNewUser }, [Validators.required, Validators.minLength(8),
        CustomValidators.equalTo(password)]);

        this.mainForm = this.formBuilder.group({
          id: id,
          roleId: new FormControl({ value: '', disabled: isAddingNewUser }, [Validators.required]),
          fullName: new FormControl('', [Validators.required, Validators.minLength(4)]),
          userName: new FormControl('', [Validators.required, CustomValidators.rangeLength([8, 10])]),
          email: new FormControl('', [Validators.required, Validators.minLength(4), CustomValidators.email]),
          password: password,
          confirmPassword: confirmPassword,
          disabled: new FormControl(false)
        });

        this.getModel(id);
      });

    this.subscription.add(formSubscription);
  }

  save(): void {

    if (this.mainForm.dirty && this.mainForm.valid) {

      let model = this.mainForm.value;

      this.blockUI.start();
      let saveSubscription = this._userService.save(model, Number(model.id)).subscribe(
        () => {
          this._messageAlertHandleService.handleSuccess('Saved successfully');
          this.mainForm.reset();
          this.blockUI.stop();
          this._router.navigate(['/users']);
        },
        error => {
          this._messageAlertHandleService.handleError(error);
          this.blockUI.stop();
        }
      );

      this.subscription.add(saveSubscription);
    }
  }

  getModel(id: number): void {

    if (id === 0) { return; }

    this.blockUI.start();

    let modelSubscription = this._userService.get(id).subscribe(
      (response: User) => {

        this.mainForm.patchValue(
          {
            id: response.id,
            roleId: response.roleId,
            fullName: response.fullName,
            userName: response.userName,
            email: response.email,
            password: 'xxxxxx-xxxxx',
            confirmPassword: 'xxxxxx-xxxxx',
            disabled: response.disabled
          });

        this.blockUI.stop();
      },
      (error: any) => {

        this._messageAlertHandleService.handleError(error);
        this.blockUI.stop();
      }
    );

    this.subscription.add(modelSubscription);

  }

  getRoles() {

    let rolesGetAllSubscription = this._roleService.getAllRoles().subscribe(
      (response: Role[]) => {
        this.roles = response;
      },
      (error: any) => {
        this._messageAlertHandleService.handleError(error);
      }
    );

    this.subscription.add(rolesGetAllSubscription);

  }
}
