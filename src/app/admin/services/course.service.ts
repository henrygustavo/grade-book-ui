import {Injectable} from '@angular/core';
import {JwtHttp} from 'ng2-ui-auth';
import {BaseResourceService} from '../services/base-resource.service';
import { Course } from '../models/course';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CourseService extends BaseResourceService <Course> {
    constructor(private _jwHttp: JwtHttp) {
        super(_jwHttp, 'courses');
    }

    public getAllCourses(): Observable<Course[]> {

        let entity$ = this._jwHttp
            .get(`${this.baseUrl}/all/`)
            .map((response: any) => response.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));
        return entity$;
    }
}
