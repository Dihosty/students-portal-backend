import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { ITeacherRepository, IUserRepository } from '@domain/core/interfaces';
import { Teacher } from '@domain/entities';
import {
  CreateTeacherDto,
  IFacultyRepository,
  UpdateTeacherDto,
  UserRole,
  TeacherProfileDto,
} from '@domain/core';

@Injectable()
export class TeacherService {
  constructor(
    @Inject(ITeacherRepository)
    private readonly teacherRepository: ITeacherRepository,
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    @Inject(IFacultyRepository)
    private readonly facultyRepository: IFacultyRepository,
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

    const facultyExists = await this.facultyRepository.findById(
      createTeacherDto.facultyId,
    );
    if (!facultyExists) {
      throw new BadRequestException('Faculty not found');
    }

    const teacher = new Teacher(
      undefined,
      createTeacherDto.userId,
      createTeacherDto.facultyId,
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

  async findAllProfiles(): Promise<TeacherProfileDto[]> {
    const [teachers, users, faculties] = await Promise.all([
      this.teacherRepository.findAll(),
      this.userRepository.findAll(),
      this.facultyRepository.findAll(),
    ]);

    const userById = new Map(users.map((u) => [u.id!, u]));
    const facultyById = new Map(faculties.map((f) => [f.id!, f]));

    return teachers.map((teacher) => {
      const user = userById.get(teacher.userId);
      const faculty = facultyById.get(teacher.facultyId);

      return {
        id: teacher.id!,
        userId: teacher.userId,
        fullName: user ? `${user.firstName} ${user.lastName}` : 'Unknown teacher',
        facultyId: teacher.facultyId,
        facultyName: faculty?.name ?? 'Unknown faculty',
        createdAt: teacher.createdAt!,
      };
    });
  }

  async findProfileById(id: string): Promise<TeacherProfileDto> {
    const teacher = await this.findById(id);
    const [user, faculty] = await Promise.all([
      this.userRepository.findById(teacher.userId),
      this.facultyRepository.findById(teacher.facultyId),
    ]);

    return {
      id: teacher.id!,
      userId: teacher.userId,
      fullName: user ? `${user.firstName} ${user.lastName}` : 'Unknown teacher',
      facultyId: teacher.facultyId,
      facultyName: faculty?.name ?? 'Unknown faculty',
      createdAt: teacher.createdAt!,
    };
  }

  async findByUserId(userId: string): Promise<Teacher | null> {
    return this.teacherRepository.findByUserId(userId);
  }

  async update(
    id: string,
    updateTeacherDto: UpdateTeacherDto,
  ): Promise<Teacher> {
    const existingTeacher = await this.findById(id);

    const resultingFacultyId =
      updateTeacherDto.facultyId ?? existingTeacher.facultyId;

    if (updateTeacherDto.facultyId) {
      const facultyExists = await this.facultyRepository.findById(
        updateTeacherDto.facultyId,
      );
      if (!facultyExists) {
        throw new BadRequestException('Faculty not found');
      }
    }

    const updatedTeacher = new Teacher(
      existingTeacher.id,
      existingTeacher.userId,
      resultingFacultyId,
      existingTeacher.createdAt,
    );

    return this.teacherRepository.update(id, updatedTeacher);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await this.teacherRepository.delete(id);
  }
}
