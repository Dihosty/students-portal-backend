import { Faculty } from '@domain/entities';

export interface IFacultyRepository {
  findById(id: string): Promise<Faculty | null>;
  findByName(name: string): Promise<Faculty | null>;
  create(faculty: Faculty): Promise<Faculty>;
  update(id: string, faculty: Faculty): Promise<Faculty>;
  delete(id: string): Promise<void>;
  findAll(): Promise<Faculty[]>;
}

export const IFacultyRepository = Symbol('IFacultyRepository');

