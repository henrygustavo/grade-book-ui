import { Component, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { MenuService } from '../../../../shared/services/menu.service';
import { UserService } from '../../../services/user.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Pagination } from '../../../models/pagination';
import { PaginationResult } from '../../../models/pagination-result';
import { Subscription } from 'rxjs/Subscription';
import { MessageAlertHandleService } from '../../../../shared/services/message-alert.service';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, OnDestroy {

    @BlockUI() blockUI: NgBlockUI;
    @ViewChild('editTmplRow') editTmplRow: TemplateRef<any>;

    pagination: Pagination = new Pagination();
    subscription: Subscription = new Subscription();

    rows = new Array<any>();
    columns: Array<any> = [];

    constructor(private _menuService: MenuService, private _userService: UserService,
        private _messageAlertHandleService: MessageAlertHandleService) { }

    ngOnInit() {

        this._menuService.selectMenuItem('users');

        this.setUpColumns();
        this.initializePagination();
        this.setUpPage({ offset: 0 });
    }

    ngOnDestroy(): void {

        this.subscription.unsubscribe();
    }

    onSort(event: any) {

        const sort = event.sorts[0];

        this.pagination.sortBy =  sort.prop === 'fullName' ? 'lastName' : sort.prop;
        this.pagination.sortDirection = sort.dir;
        this.pagination.currentPage = 1;
        this.pagination.pageSize = 10;

        this.loadData();
    }

    initializePagination(): void {

        this.pagination.sortBy = 'lastName';
        this.pagination.sortDirection = 'asc';
        this.pagination.currentPage = 1;
        this.pagination.pageSize = 10;
        this.pagination.totalRecords = 0;
    }

    setUpColumns(): void {

        this.columns = [
            { prop: 'dni', name: 'DNI' },
            { prop: 'fullName', name: 'Full Name' },
            { prop: 'active', name: 'Active' },
            { prop: '', name: '', cellTemplate: this.editTmplRow }];
    }

    loadData(): void {

        this.blockUI.start();

        let userGetAllSubscription = this._userService.getAll(this.pagination).subscribe(
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
}
