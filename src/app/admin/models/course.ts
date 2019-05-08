import { BaseEntity } from '../models/base-entity';

export class Course extends BaseEntity {

    code: string;
    name: string;
    averageWorkPercentage: number;
    partialWorkPercentage: number;
    finalWorkPercentage: number;
}
