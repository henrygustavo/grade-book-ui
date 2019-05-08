import {Injectable} from '@angular/core';
import {JwtHttp} from 'ng2-ui-auth';
import {BaseResourceService} from '../services/base-resource.service';
import { Course } from '../models/course';

@Injectable()
export class CourseService extends BaseResourceService <Course> {
    constructor(private _jwHttp: JwtHttp) {
        super(_jwHttp, 'courses');
    }
}
