import {Injectable} from '@angular/core';
import {JwtHttp} from 'ng2-ui-auth';
import {BaseResourceService} from '../services/base-resource.service';
import { Role } from '../models/role';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class RoleService extends BaseResourceService <Role> {
    constructor(private _jwHttp: JwtHttp) {
        super(_jwHttp, 'roles');  
    }

    public getAllRoles(): Observable<Role[]> {

        let entity$ = this._jwHttp
            .get(`${this.baseUrl}/all/`)
            .map((response: any) => response.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));
        return entity$;
    }
}
