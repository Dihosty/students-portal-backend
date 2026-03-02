import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IGroupRepository } from '@domain/core/interfaces';
import { Group } from '@domain/entities';
import { CreateGroupDto, UpdateGroupDto } from '@domain/core';

@Injectable()
export class GroupService {
  constructor(
    @Inject(IGroupRepository)
    private readonly groupRepository: IGroupRepository,
  ) {}

  async create(createGroupDto: CreateGroupDto): Promise<Group> {
    const group = new Group(
      undefined,
      createGroupDto.name,
      createGroupDto.courseYear,
    );
    return this.groupRepository.create(group);
  }

  async findAll(): Promise<Group[]> {
    return this.groupRepository.findAll();
  }

  async findById(id: string): Promise<Group> {
    const group = await this.groupRepository.findById(id);
    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }
    return group;
  }

  async findByCourseYear(courseYear: number): Promise<Group[]> {
    return this.groupRepository.findByCourseYear(courseYear);
  }

  async update(id: string, updateGroupDto: UpdateGroupDto): Promise<Group> {
    const existingGroup = await this.findById(id);

    const updatedGroup = new Group(
      existingGroup.id,
      updateGroupDto.name ?? existingGroup.name,
      updateGroupDto.courseYear ?? existingGroup.courseYear,
      existingGroup.createdAt,
    );

    return this.groupRepository.update(id, updatedGroup);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await this.groupRepository.delete(id);
  }
}
