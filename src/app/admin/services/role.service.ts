import {Injectable} from '@angular/core';
import {JwtHttp} from 'ng2-ui-auth';
import {BaseResourceService} from '../services/base-resource.service';
import { Role } from '../models/role';

@Injectable()
export class RoleService extends BaseResourceService <Role> {
    constructor(private _jwHttp: JwtHttp) {
        super(_jwHttp, 'roles');
    }
}
