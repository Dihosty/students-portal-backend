import { Teacher } from '@domain/entities';

export interface ITeacherRepository {
  findById(id: string): Promise<Teacher | null>;
  findByUserId(userId: string): Promise<Teacher | null>;
  create(teacher: Teacher): Promise<Teacher>;
  update(id: string, teacher: Teacher): Promise<Teacher>;
  delete(id: string): Promise<void>;
  findAll(): Promise<Teacher[]>;
}

export const ITeacherRepository = Symbol('ITeacherRepository');
