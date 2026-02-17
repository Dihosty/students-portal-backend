import { UserRole } from '@domain/core';

export class User {
  constructor(
    public id: string | undefined,
    public email: string,
    public password: string,
    public firstName: string,
    public lastName: string,
    public role: UserRole,
    public isActive: boolean,
    public groupId?: string,
    public courseYear?: number,
    public faculty?: string,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}
}
