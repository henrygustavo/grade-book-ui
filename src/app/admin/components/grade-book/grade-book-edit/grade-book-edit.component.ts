import { Component, OnInit, ViewChildren, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { MenuService } from '../../../../shared/services/menu.service';
import { GradeBookService } from '../../../services/grade-book.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormControlName, FormBuilder, FormControl, Validators } from '@angular/forms';
import { GradeBook } from '../../../models/grade-book';
import { GenericValidator } from '../../../../shared/validators/generic-validator';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageAlertHandleService } from '../../../../shared/services/message-alert.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import { CustomValidators } from 'ng2-validation';
import { Course } from '../../../models/course';

@Component({ selector: 'app-grade-book-edit', templateUrl: './grade-book-edit.component.html', styleUrls: ['./grade-book-edit.component.css'] })
export class GradeBookEditComponent implements OnInit, AfterViewInit, OnDestroy {

  @BlockUI() blockUI: NgBlockUI;
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements: ElementRef[] = [];
  displayMessage: { [key: string]: string } = {};
  validationMessages: { [key: string]: { [key: string]: string } };
  genericValidator: GenericValidator;
  subscription: Subscription = new Subscription();
  mainForm: FormGroup;
  courses: Course[];
  constructor(private _menuService: MenuService,
    private _gradebookService: GradeBookService,
    private _messageAlertHandleService: MessageAlertHandleService,
    private _route: ActivatedRoute,
    private _router: Router,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this._menuService.selectMenuItem('gradebooks');

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

      courseId: {
        required: 'Course is required.',
      },
      studentId: {
        required: 'Student is required.',
      },
      teacherId: {
        required: 'Teacher is required.',
      },
      averageWorkScore: {
        required: 'Average Work Score is required.',
      },
      partialWorkScore: {
        required: 'Partial Work Score is required.',
      },
      finalWorkScore: {
        required: 'Final Work Score is required.',
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
          courseId: new FormControl({ value: ''}, [Validators.required]),
          studentId: new FormControl({ value: ''}, [Validators.required]),
          teacherId: new FormControl({ value: ''}, [Validators.required]),
          averageWorkScore: new FormControl({ value: ''}, [Validators.required]),
          partialWorkScore: new FormControl({ value: ''}, [Validators.required]),
          finalWorkScore: new FormControl({ value: ''}, [Validators.required]),
        });

        this.getModel(id);
      });

    this.subscription.add(formSubscription);

  }

  save(): void {

    if (this.mainForm.dirty && this.mainForm.valid) {

      let model =  this.mainForm.value;

      this.blockUI.start();
      let saveSubscription = this._gradebookService.save(model, Number(model.id)).subscribe(
        () => {
          this._messageAlertHandleService.handleSuccess('Saved successfully');
          this.mainForm.reset();
          this.blockUI.stop();
          this._router.navigate(['/gradebooks']);
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

    let modelSubscription = this._gradebookService.get(id).subscribe(
      (response: GradeBook) => {

        this.mainForm.patchValue(
          {
            id: response.id,
            courseId: response.courseId,
            studentId: response.studentId,
            teacherId: response.teacherId,
            averageWorkScore: response.averageWorkScore,
            partialWorkScore: response.partialWorkScore,
            finalWorkScore : response.finalWorkScore
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
