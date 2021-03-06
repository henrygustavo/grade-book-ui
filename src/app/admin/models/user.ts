import { BaseEntity } from '../models/base-entity';

export class User extends BaseEntity {

    fullName: string;
    userName: string;
    email: string;
    roleId: number;
    roleName: string;
    password: string;
    disabled: boolean;
}
