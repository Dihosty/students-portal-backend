import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserRepository } from '../../domain/core/interfaces/user.repository';
import { User } from '../../domain/entities/user.entity';
import { UserOrmEntity } from '../database/entities/user.orm-entity';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repository: Repository<UserOrmEntity>,
  ) {}

  async findById(id: string): Promise<User | null> {
    const userOrm = await this.repository.findOne({ where: { id } });
    return userOrm ? this.toDomain(userOrm) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const userOrm = await this.repository.findOne({ where: { email } });
    return userOrm ? this.toDomain(userOrm) : null;
  }

  async create(user: User): Promise<User> {
    const userOrm = this.toOrm(user);
    const savedUser = await this.repository.save(userOrm);
    return this.toDomain(savedUser);
  }

  async update(id: string, user: Partial<User>): Promise<User> {
    const ormEntity = this.toOrm(user);
    const { id: _, ...updatePayload } = ormEntity;
    await this.repository.update(id, updatePayload);
    const updatedUser = await this.repository.findOne({ where: { id } });
    if (!updatedUser) {
      throw new Error('User not found');
    }
    return this.toDomain(updatedUser);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findAll(): Promise<User[]> {
    const users = await this.repository.find();
    return users.map((user) => this.toDomain(user));
  }

  private toDomain(userOrm: UserOrmEntity): User {
    return new User(
      userOrm.id,
      userOrm.email,
      userOrm.password,
      userOrm.firstName,
      userOrm.lastName,
      userOrm.role,
      userOrm.isActive,
      userOrm.groupId,
      userOrm.courseYear,
      userOrm.faculty,
      userOrm.createdAt,
      userOrm.updatedAt,
    );
  }

  private toOrm(user: Partial<User>): Partial<UserOrmEntity> {
    const userOrm: Partial<UserOrmEntity> = {};
    if (user.id !== undefined) userOrm.id = user.id;
    if (user.email !== undefined) userOrm.email = user.email;
    if (user.password !== undefined) userOrm.password = user.password;
    if (user.firstName !== undefined) userOrm.firstName = user.firstName;
    if (user.lastName !== undefined) userOrm.lastName = user.lastName;
    if (user.role !== undefined) userOrm.role = user.role;
    if (user.isActive !== undefined) userOrm.isActive = user.isActive;
    if (user.groupId !== undefined) userOrm.groupId = user.groupId;
    if (user.courseYear !== undefined) userOrm.courseYear = user.courseYear;
    if (user.faculty !== undefined) userOrm.faculty = user.faculty;
    return userOrm;
  }
}
