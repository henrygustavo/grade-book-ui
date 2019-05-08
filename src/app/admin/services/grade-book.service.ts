import {Injectable} from '@angular/core';
import {JwtHttp} from 'ng2-ui-auth';
import {BaseResourceService} from '../services/base-resource.service';
import { GradeBook } from '../models/grade-book';

@Injectable()
export class GradeBookService extends BaseResourceService <GradeBook> {
    constructor(private _jwHttp: JwtHttp) {
        super(_jwHttp, 'gradebooks');
    }
}
