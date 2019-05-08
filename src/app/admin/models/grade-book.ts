import { BaseEntity } from '../models/base-entity';

export class GradeBook extends BaseEntity {

    courseId: number;
    StudentId: number;
    TeacherId:number;
    courseName: string;
    StudentName: string;
    TeacherName:string;
    averageWorkScore: number;
    partialWorkScore: number;
    finalWorkScore: number;
}
