import { Component, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { MenuService } from '../../../../shared/services/menu.service';
import { GradeBookService } from '../../../services/grade-book.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Pagination } from '../../../models/pagination';
import { PaginationResult } from '../../../models/pagination-result';
import { Subscription } from 'rxjs/Subscription';
import { MessageAlertHandleService } from '../../../../shared/services/message-alert.service';

@Component({
    selector: 'app-grade-book-list',
    templateUrl: './grade-book-list.component.html',
    styleUrls: ['./grade-book-list.component.css']
})
export class GradeBookListComponent implements OnInit, OnDestroy {

    @BlockUI() blockUI: NgBlockUI;
    @ViewChild('editTmplRow') editTmplRow: TemplateRef<any>;

    pagination: Pagination = new Pagination();
    subscription: Subscription = new Subscription();

    rows = new Array<any>();
    columns: Array<any> = [];

    constructor(private _menuService: MenuService, private _gradebookService: GradeBookService,
        private _messageAlertHandleService: MessageAlertHandleService) { }

    ngOnInit() {

        this._menuService.selectMenuItem('grade-books');

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
            { prop: 'courseName', name: 'Course' },
            { prop: 'teacherName', name: 'Teacher' },
            { prop: 'studentName', name: 'Student' },
            { prop: 'averageWorkScore', name: 'Average Work Score' },
            { prop: 'partialWorkScore', name: 'Partial Work Score' },
            { prop: 'finalWorkScore', name: 'Final Work Score' },
            { prop: 'finalScore', name: 'Final Score' },
            { prop: '', name: '', cellTemplate: this.editTmplRow }];
    }

    loadData(): void {

        this.blockUI.start();

        let getAllSubscription = this._gradebookService.getAll(this.pagination).subscribe(
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

        this.subscription.add(getAllSubscription);
    }

    setUpPage(pageInfo: any) {

        this.pagination.currentPage = pageInfo.offset + 1;

        this.loadData();
    }
}
