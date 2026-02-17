import { Group } from '@domain/entities';

export interface IGroupRepository {
  findById(id: string): Promise<Group | null>;
  findByCourseYear(courseYear: number): Promise<Group[]>;
  create(group: Group): Promise<Group>;
  update(id: string, group: Group): Promise<Group>;
  delete(id: string): Promise<void>;
  findAll(): Promise<Group[]>;
}

export const IGroupRepository = Symbol('IGroupRepository');
