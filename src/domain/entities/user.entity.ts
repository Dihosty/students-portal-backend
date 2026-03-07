import { UserRole } from '@domain/core';

//User domain entity
//
//Field requirements based on role:
//STUDENT: groupId, courseYear, and faculty are required
//TEACHER/ADMIN: groupId, courseYear, and faculty should be undefined/null
export class User {
  constructor(
    public id: string | undefined,
    public email: string,
    public password: string,
    public firstName: string,
    public lastName: string,
    public role: UserRole,
    public groupId?: string,
    public courseYear?: number,
    public faculty?: string,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}
}
