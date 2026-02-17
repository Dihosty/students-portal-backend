import { Grade } from '@domain/entities';

export interface IGradeRepository {
  findById(id: string): Promise<Grade | null>;
  findByStudentId(studentId: string): Promise<Grade[]>;
  findBySubjectId(subjectId: string): Promise<Grade[]>;
  findByTeacherId(teacherId: string): Promise<Grade[]>;
  findByStudentAndSubject(
    studentId: string,
    subjectId: string,
  ): Promise<Grade[]>;
  create(grade: Grade): Promise<Grade>;
  update(id: string, grade: Grade): Promise<Grade>;
  delete(id: string): Promise<void>;
  findAll(): Promise<Grade[]>;
}

export const IGradeRepository = Symbol('IGradeRepository');
