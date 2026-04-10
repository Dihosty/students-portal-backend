import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { IFacultyRepository, IGroupRepository } from '@domain/core/interfaces';
import { Group } from '@domain/entities';
import { CreateGroupDto, UpdateGroupDto } from '@domain/core';

@Injectable()
export class GroupService {
  constructor(
    @Inject(IGroupRepository)
    private readonly groupRepository: IGroupRepository,
    @Inject(IFacultyRepository)
    private readonly facultyRepository: IFacultyRepository,
  ) {}

  async create(createGroupDto: CreateGroupDto): Promise<Group> {
    const faculty = await this.facultyRepository.findById(createGroupDto.facultyId);
    if (!faculty) {
      throw new BadRequestException('Faculty not found');
    }

    const group = new Group(
      undefined,
      createGroupDto.name,
      createGroupDto.courseYear,
      createGroupDto.facultyId,
    );
    return this.groupRepository.create(group);
  }

  async findAll(filters?: {
    courseYear?: number;
    facultyId?: string;
  }): Promise<Group[]> {
    const groups = await this.groupRepository.findAll();

    const courseYear = filters?.courseYear;
    const facultyId = filters?.facultyId;

    return groups.filter((group) => {
      if (courseYear !== undefined && group.courseYear !== courseYear) {
        return false;
      }
      if (facultyId !== undefined && group.facultyId !== facultyId) {
        return false;
      }
      return true;
    });
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

    const resultingFacultyId =
      updateGroupDto.facultyId ?? existingGroup.facultyId;

    if (updateGroupDto.facultyId) {
      const faculty = await this.facultyRepository.findById(updateGroupDto.facultyId);
      if (!faculty) {
        throw new BadRequestException('Faculty not found');
      }
    }

    const updatedGroup = new Group(
      existingGroup.id,
      updateGroupDto.name ?? existingGroup.name,
      updateGroupDto.courseYear ?? existingGroup.courseYear,
      resultingFacultyId,
      existingGroup.createdAt,
    );

    return this.groupRepository.update(id, updatedGroup);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await this.groupRepository.delete(id);
  }
}
