import { Component, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { MenuService } from '../../../../shared/services/menu.service';
import { CourseService } from '../../../services/course.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Pagination } from '../../../models/pagination';
import { PaginationResult } from '../../../models/pagination-result';
import { Subscription } from 'rxjs/Subscription';
import { MessageAlertHandleService } from '../../../../shared/services/message-alert.service';
import { AuthService } from 'ng2-ui-auth';
import { Roles } from '../../enums/roles.enum';

@Component({
    selector: 'app-course-list',
    templateUrl: './course-list.component.html',
    styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit, OnDestroy {

    @BlockUI() blockUI: NgBlockUI;
    @ViewChild('editTmplRow') editTmplRow: TemplateRef<any>;

    pagination: Pagination = new Pagination();
    subscription: Subscription = new Subscription();

    rows = new Array<any>();
    columns: Array<any> = [];

    constructor(private _menuService: MenuService, private _courseService: CourseService,
        private _authService: AuthService,
        private _messageAlertHandleService: MessageAlertHandleService) { }

    ngOnInit() {

        this._menuService.selectMenuItem('courses');

        this.setUpColumns();
        this.initializePagination();
        this.setUpPage({ offset: 0 });
    }

    ngOnDestroy(): void {

        this.subscription.unsubscribe();
    }

    onSort(event: any) {

        const sort = event.sorts[0];

        this.pagination.sortBy =  sort.prop;
        this.pagination.sortDirection = sort.dir;
        this.pagination.currentPage = 1;
        this.pagination.pageSize = 10;

        this.loadData();
    }

    initializePagination(): void {

        this.pagination.sortBy = 'id';
        this.pagination.sortDirection = 'asc';
        this.pagination.currentPage = 1;
        this.pagination.pageSize = 10;
        this.pagination.totalRecords = 0;
    }

    setUpColumns(): void {

        this.columns = [
            { prop: 'code', name: 'Code' },
            { prop: 'name', name: 'Name' },
            { prop: 'averageWorkPercentage', name: '% Average Work' },
            { prop: 'partialWorkPercentage', name: '% Partial Work' },
            { prop: 'finalWorkPercentage', name: '% Final Work' },
            { prop: '', name: '', cellTemplate: this.editTmplRow }];
    }

    loadData(): void {

        this.blockUI.start();

        let userGetAllSubscription = this._courseService.getAll(this.pagination).subscribe(
            (response: PaginationResult) => {

                this.pagination.totalRecords = response.totalRecords;
                this.pagination.totalPages = response.totalPages;

                this.rows = response.content;

                this.blockUI.stop();
            },
            (error: any) => {
                this._messageAlertHandleService.handleError(error);

                this.blockUI.stop();
            }
        );

        this.subscription.add(userGetAllSubscription);
    }

    setUpPage(pageInfo: any) {

        this.pagination.currentPage = pageInfo.offset + 1;

        this.loadData();
    }

        
    isAdmin(): boolean {

        let role = this._authService.isAuthenticated() &&
      this._authService.getPayload() !== undefined
      ? this._authService.getPayload().role.toLowerCase() : '';

      return role == Roles.Admin;
    }
}
