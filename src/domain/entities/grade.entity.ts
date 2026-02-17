import { GradeType } from '@domain/core/enums/grade-type.enum';

export class Grade {
  constructor(
    public id: string | undefined,
    public studentId: string,
    public subjectId: string,
    public teacherId: string,
    public score: number, // 0-100
    public type: GradeType, //exam,prcatice or lab
    public date: Date,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}
}
