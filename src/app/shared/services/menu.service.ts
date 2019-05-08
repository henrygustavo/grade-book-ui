import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { MenuItem } from '../models/menu-item';

@Injectable()
export class MenuService {

    private subject = new Subject<any>();

    public getListMenuItems(): MenuItem[] {

        return [

            new MenuItem('fa-home', 'dashboard', 'dashboard', 'DashBoard', ['ADMIN', 'TEACHER', 'STUDENT']),
            new MenuItem('fa-edit', 'courses', 'courses', 'Courses', ['ADMIN', 'TEACHER']),
            new MenuItem('fa-edit', 'users', 'users', 'Users', ['ADMIN']),
            new MenuItem('fa-book', 'gradebooks', 'gradebooks', 'Grade Books', ['ADMIN','TEACHER', 'STUDENT'])
        ];
    }

    public selectMenuItem(selectedMenuItem: string) {
        this.subject.next({ text: selectedMenuItem });
    }

    public getSelectedMenuItem(): any {
        return this.subject.asObservable();
    }
}
