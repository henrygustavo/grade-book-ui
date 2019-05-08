import {Injectable} from '@angular/core';
import {JwtHttp} from 'ng2-ui-auth';
import {BaseResourceService} from '../services/base-resource.service';
import { User } from '../models/user';

@Injectable()
export class UserService extends BaseResourceService <User> {
    constructor(private _jwHttp: JwtHttp) {
        super(_jwHttp, 'users');
    }
}
