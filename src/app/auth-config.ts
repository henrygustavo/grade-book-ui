import { CustomConfig } from 'ng2-ui-auth';
import { environment } from './../environments/environment';

export class AuthConfig extends CustomConfig {
    defaultHeaders = { 'Content-Type': 'application/json' };
    loginUrl = environment.apiUrl + 'auth/login';
    tokenPrefix = '';
    tokenName = 'access_token';
}
