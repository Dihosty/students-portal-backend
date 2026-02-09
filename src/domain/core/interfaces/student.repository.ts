import { Student } from '@domain/entities';

export interface IStudentRepository {
  findAll(): Promise<Student[]>;
  create(student: Student): Promise<Student>;
}
