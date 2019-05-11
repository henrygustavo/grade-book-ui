import {Injectable} from '@angular/core';
import {JwtHttp} from 'ng2-ui-auth';
import {BaseResourceService} from '../services/base-resource.service';
import { Student } from '../models/student';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class StudentService extends BaseResourceService <Student> {
    constructor(private _jwHttp: JwtHttp) {
        super(_jwHttp, 'students');
    }

    public getAllStudents(): Observable<Student[]> {

        let entity$ = this._jwHttp
            .get(`${this.baseUrl}/all/`)
            .map((response: any) => response.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));
        return entity$;
    }
}
