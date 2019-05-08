import { BaseEntity } from '../models/base-entity';

export class User extends BaseEntity {

    name: string;
    userName: string;
    roleId: number;
    password: string;
}
