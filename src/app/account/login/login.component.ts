import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControlName, FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { GenericValidator } from '../../shared/validators/generic-validator';
import { AuthService } from 'ng2-ui-auth';
import { Router } from '@angular/router';
import { MessageAlertHandleService } from '../../shared/services/message-alert.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']

})

export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {
    @BlockUI() blockUI: NgBlockUI;
    @ViewChildren(FormControlName, { read: ElementRef })
    formInputElements: ElementRef[] = [];
    displayMessage: { [key: string]: string } = {};
    mainForm: FormGroup;
    validationMessages: { [key: string]: { [key: string]: string } };
    genericValidator: GenericValidator;
    subscription: Subscription = new Subscription();

    constructor(private fb: FormBuilder, private _authService: AuthService,
        private _messageAlertHandleService: MessageAlertHandleService,
        private _router: Router) {

        this.validationMessages = {
            userName: {
                required: 'UserName is required.',
                minlength: 'UserName must be at least 5 characters.'
            },
            password: {
                required: 'Password is required.',
                minlength: 'Password must be at least 5 characters.'
            }
        };

        this.genericValidator = new GenericValidator(this.validationMessages);
    }

    ngOnInit(): void {

        this.mainForm = this.fb.group({
            userName: new FormControl('', [Validators.required, Validators.minLength(5)]),
            password: new FormControl('', [Validators.required, Validators.minLength(5)])

        });
    }

    ngAfterViewInit(): void {

        const controlBlurs: Observable<any>[] = this.formInputElements
            .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

        const controlSubscription = Observable.merge(this.mainForm.valueChanges, ...controlBlurs).debounceTime(800).subscribe(() => {
            this.displayMessage = this.genericValidator.processMessages(this.mainForm);
        });

        this.subscription.add(controlSubscription);
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    signUp(): void {

        this.blockUI.start();

        const authLoginSubscription = this._authService.login(JSON.stringify(this.mainForm.value)).subscribe({
            error: (err: any) => {
                this._messageAlertHandleService.handleError(err);
                this.blockUI.stop();
            },
            complete: () => {
                this._router.navigateByUrl('dashboard');
                this.blockUI.stop();
            }
        });

        this.subscription.add(authLoginSubscription);

    }
}
