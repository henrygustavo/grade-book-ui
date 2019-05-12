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
import { Course } from '../../../models/course';
import { Student } from '../../../models/student';
import { StudentService } from '../../../services/student.service';
import { CourseService } from '../../../services/course.service';
import { CustomValidators } from 'ng2-validation';

@Component({
  selector: 'app-grade-book-edit',
  templateUrl: './grade-book-edit.component.html', styleUrls: ['./grade-book-edit.component.css']
})
export class GradeBookEditComponent implements OnInit, AfterViewInit, OnDestroy {

  @BlockUI() blockUI: NgBlockUI;
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements: ElementRef[] = [];
  displayMessage: { [key: string]: string } = {};
  validationMessages: { [key: string]: { [key: string]: string } };
  genericValidator: GenericValidator;
  subscription: Subscription = new Subscription();
  mainForm: FormGroup;
  courses: Course[]  = [];
  students: Student[] = [];
  selectedCourse: Course = new Course();
  constructor(private _menuService: MenuService,
    private _gradebookService: GradeBookService,
    private _messageAlertHandleService: MessageAlertHandleService,
    private _route: ActivatedRoute,
    private _router: Router,
    private formBuilder: FormBuilder,
    private _studentService: StudentService,
    private _courseService: CourseService

  ) { }

  ngOnInit() {
    this._menuService.selectMenuItem('gradebooks');
    this.getCourses();
    this.getStudents();
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
      averageWorkScore: {
        required: 'Average Work Score is required.',
        number: 'Average Work Score should be a number',
        range:'Average Work Score should be between 0-20'
      },
      partialWorkScore: {
        required: 'Partial Work Score is required.',
        number: 'Partial Work Score should be a number',
        range:'Partial Work Score should be between 0-20'
      },
      finalWorkScore: {
        required: 'Final Work Score is required.',
        number: 'Final Work Score should be a number',
        range:'Final Work Score should be between 0-20'
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
          courseId: new FormControl('', [Validators.required]),
          studentId: new FormControl('', [Validators.required]),
          averageWorkScore: new FormControl('', [Validators.required, CustomValidators.number, CustomValidators.range([0, 20])]),
          partialWorkScore: new FormControl('', [Validators.required, CustomValidators.number, CustomValidators.range([0, 20])]),
          finalWorkScore: new FormControl('', [Validators.required, CustomValidators.number, CustomValidators.range([0, 20])])
        });

        this.getModel(id);
      });

    this.subscription.add(formSubscription);

  }

  save(): void {

    if (this.mainForm.dirty && this.mainForm.valid) {

      let model = this.mainForm.value;

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
            averageWorkScore: response.averageWorkScore,
            partialWorkScore: response.partialWorkScore,
            finalWorkScore: response.finalWorkScore
          });
          
        this.onChangeCourse(response.courseId);
        this.blockUI.stop();
      },
      (error: any) => {

        this._messageAlertHandleService.handleError(error);
        this.blockUI.stop();
      }
    );

    this.subscription.add(modelSubscription);

  }

  getStudents() {

    let getAllSubscription = this._studentService.getAllStudents().subscribe(
      (response: Student[]) => {
        this.students = response;
      },
      (error: any) => {
        this._messageAlertHandleService.handleError(error);
      }
    );

    this.subscription.add(getAllSubscription);

  }

  getCourses() {

    let getAllCourseSubscription = this._courseService.getAllCourses().subscribe(
      (response: Course[]) => {
        this.courses = response;
      },
      (error: any) => {
        this._messageAlertHandleService.handleError(error);
      }
    );

    this.subscription.add(getAllCourseSubscription);

  }

  onChangeCourse(courseId) {

    if (courseId === '') { return; }

    this.selectedCourse = this.courses.find(obj => {
      return obj.id === Number.parseInt(courseId);
    });
  }
}
