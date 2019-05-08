import { Component, OnInit, ViewChildren, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { MenuService } from '../../../../shared/services/menu.service';
import { CourseService } from '../../../services/course.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormControlName, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Course } from '../../../models/course';
import { GenericValidator } from '../../../../shared/validators/generic-validator';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageAlertHandleService } from '../../../../shared/services/message-alert.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import { CustomValidators } from 'ng2-validation';

@Component({ selector: 'app-course-edit', templateUrl: './course-edit.component.html', styleUrls: ['./course-edit.component.css'] })
export class CourseEditComponent implements OnInit, AfterViewInit, OnDestroy {

  @BlockUI() blockUI: NgBlockUI;
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements: ElementRef[] = [];
  displayMessage: { [key: string]: string } = {};
  validationMessages: { [key: string]: { [key: string]: string } };
  genericValidator: GenericValidator;
  subscription: Subscription = new Subscription();
  mainForm: FormGroup;

  constructor(private _menuService: MenuService,
    private _courseService: CourseService,
    private _messageAlertHandleService: MessageAlertHandleService,
    private _route: ActivatedRoute,
    private _router: Router,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this._menuService.selectMenuItem('courses');

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

      code: {
        required: 'Code is required.',
        minlength: 'Code must be at least 5 characters.'
      },
      name: {
        required: 'Name is required.',
        minlength: 'Name must be at least 5 characters.'
      },
      averageWorkPercentage: {
        required: 'Average Work % is required.',
        digits: 'Please enter a valid number.'

      },
      partialWorkPercentage: {
        required: 'Partial Work % is required.',
        digits: 'Please enter a valid number.'
      },
      finalWorkPercentage: {
        required: 'Final Work % is required.',
        digits: 'Please enter a valid number.'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  setUpFormControls(): void {

    const formSubscription = this._route.params.subscribe(

      (params): void => {

        const id: number = Number(params['id']);
        
        this.mainForm = this.formBuilder.group({
          id: id,
          code: new FormControl('', [Validators.required, Validators.minLength(5)]),
          name: new FormControl('', [Validators.required, Validators.minLength(5)]),
          averageWorkPercentage: new FormControl('', [Validators.required, CustomValidators.digits]),
          partialWorkPercentage: new FormControl('', [Validators.required, CustomValidators.digits]),
          finalWorkPercentage: new FormControl('', [Validators.required, CustomValidators.digits])
        });

        this.getModel(id);
      });

    this.subscription.add(formSubscription);
  }

  save(): void {

    if (this.mainForm.valid) {

      let model = this.mainForm.value;

      this.blockUI.start();
      let saveSubscription = this._courseService.save(model, Number(model.id)).subscribe(
        () => {
          this._messageAlertHandleService.handleSuccess('Saved successfully');
          this.mainForm.reset();
          this.blockUI.stop();
          this._router.navigate(['/courses']);
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

    let modelSubscription = this._courseService.get(id).subscribe(
      (response: Course) => {

        this.mainForm.patchValue(
          {
            id: response.id,
            code: response.code,
            name: response.name,
            averageWorkPercentage: response.averageWorkPercentage,
            partialWorkPercentage: response.partialWorkPercentage,
            finalWorkPercentage: response.finalWorkPercentage
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
}
