import { Subject } from '@domain/entities';

export interface ISubjectRepository {
  findById(id: string): Promise<Subject | null>;
  findByTeacherId(teacherId: string): Promise<Subject[]>;
  create(subject: Subject): Promise<Subject>;
  update(id: string, subject: Subject): Promise<Subject>;
  delete(id: string): Promise<void>;
  findAll(): Promise<Subject[]>;
}

export const ISubjectRepository = Symbol('ISubjectRepository');
