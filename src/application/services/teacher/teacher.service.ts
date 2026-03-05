import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { ITeacherRepository, IUserRepository } from '@domain/core/interfaces';
import { Teacher } from '@domain/entities';
import { CreateTeacherDto, UpdateTeacherDto, UserRole } from '@domain/core';

@Injectable()
export class TeacherService {
  constructor(
    @Inject(ITeacherRepository)
    private readonly teacherRepository: ITeacherRepository,
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async create(createTeacherDto: CreateTeacherDto): Promise<Teacher> {
    const user = await this.userRepository.findById(createTeacherDto.userId);
    if (!user) {
      throw new NotFoundException(
        `User with ID ${createTeacherDto.userId} not found`,
      );
    }

    if (user.role !== UserRole.TEACHER) {
      throw new BadRequestException(
        'User must have TEACHER role to create a teacher profile',
      );
    }

    const existingTeacher = await this.teacherRepository.findByUserId(
      createTeacherDto.userId,
    );
    if (existingTeacher) {
      throw new ConflictException(
        'Teacher profile already exists for this user',
      );
    }

    const teacher = new Teacher(
      undefined,
      createTeacherDto.userId,
      createTeacherDto.faculty,
    );
    return this.teacherRepository.create(teacher);
  }

  async findAll(): Promise<Teacher[]> {
    return this.teacherRepository.findAll();
  }

  async findById(id: string): Promise<Teacher> {
    const teacher = await this.teacherRepository.findById(id);
    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }
    return teacher;
  }

  async findByUserId(userId: string): Promise<Teacher | null> {
    return this.teacherRepository.findByUserId(userId);
  }

  async update(
    id: string,
    updateTeacherDto: UpdateTeacherDto,
  ): Promise<Teacher> {
    const existingTeacher = await this.findById(id);

    const updatedTeacher = new Teacher(
      existingTeacher.id,
      existingTeacher.userId,
      updateTeacherDto.faculty ?? existingTeacher.faculty,
      existingTeacher.createdAt,
    );

    return this.teacherRepository.update(id, updatedTeacher);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await this.teacherRepository.delete(id);
  }
}
