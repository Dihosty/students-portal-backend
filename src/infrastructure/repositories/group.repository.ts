import { IGroupRepository } from '@domain/core';
import { Group } from '@domain/entities';
import { GroupOrmEntity } from '@infrastructure/database';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class GroupRepository implements IGroupRepository {
  constructor(
    @InjectRepository(GroupOrmEntity)
    private readonly repository: Repository<GroupOrmEntity>,
  ) {}

  async findById(id: string): Promise<Group | null> {
    const groupOrm = await this.repository.findOne({ where: { id } });
    return groupOrm ? this.toDomain(groupOrm) : null;
  }

  async findByCourseYear(courseYear: number): Promise<Group[]> {
    const groups = await this.repository.find({ where: { courseYear } });
    return groups.map((group) => this.toDomain(group));
  }

  async create(group: Group): Promise<Group> {
    const groupOrm = this.toOrm(group);
    const savedGroup = await this.repository.save(groupOrm);
    return this.toDomain(savedGroup);
  }

  async update(id: string, group: Group): Promise<Group> {
    await this.repository.update(id, this.toOrm(group));
    const updatedGroup = await this.repository.findOne({ where: { id } });
    if (!updatedGroup) {
      throw new Error('Group not found');
    }
    return this.toDomain(updatedGroup);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findAll(): Promise<Group[]> {
    const groups = await this.repository.find();
    return groups.map((group) => this.toDomain(group));
  }

  private toDomain(groupOrm: GroupOrmEntity): Group {
    return new Group(
      groupOrm.id,
      groupOrm.name,
      groupOrm.courseYear,
      groupOrm.createdAt,
    );
  }

  private toOrm(group: Partial<Group>): Partial<GroupOrmEntity> {
    const groupOrm: Partial<GroupOrmEntity> = {};
    if (group.id !== undefined) groupOrm.id = group.id;
    if (group.name !== undefined) groupOrm.name = group.name;
    if (group.courseYear !== undefined) groupOrm.courseYear = group.courseYear;
    return groupOrm;
  }
}
