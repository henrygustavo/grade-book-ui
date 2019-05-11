import { BaseEntity } from '../models/base-entity';

export class GradeBook extends BaseEntity {

    courseId: number;
    studentId: number;
    teacherId: number;
    courseName: string;
    studentName: string;
    teacherName: string;
    averageWorkScore: number;
    partialWorkScore: number;
    finalWorkScore: number;
}
