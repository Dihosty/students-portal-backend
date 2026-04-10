import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import {
  IUserRepository,
  IFacultyRepository,
  CreateUserDto,
  UpdateUserDto,
  UserProfileDto,
  UserRole,
  StudentListItemDto,
} from '@domain/core';
import { User } from '@domain/entities';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    @Inject(IFacultyRepository)
    private readonly facultyRepository: IFacultyRepository,
  ) {}

  private toUserProfile(user: User): UserProfileDto {
    return {
      id: user.id!,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: `${user.firstName} ${user.lastName}`,
      role: user.role,
      groupId: user.groupId,
      courseYear: user.courseYear,
      facultyId: user.facultyId,
      createdAt: user.createdAt!,
    };
  }

  async create(createUserDto: CreateUserDto): Promise<UserProfileDto> {
    const existingUser = await this.userRepository.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Only STUDENT have groupId, courseYear, and facultyId
    const isStudent = createUserDto.role === UserRole.STUDENT;

    if (isStudent) {
      const facultyExists = await this.facultyRepository.findById(
        createUserDto.facultyId!,
      );
      if (!facultyExists) {
        throw new BadRequestException('Faculty not found');
      }
    }

    const newUser = new User(
      undefined,
      createUserDto.email,
      hashedPassword,
      createUserDto.firstName,
      createUserDto.lastName,
      createUserDto.role,
      isStudent ? createUserDto.groupId : undefined,
      isStudent ? createUserDto.courseYear : undefined,
      isStudent ? createUserDto.facultyId : undefined,
    );

    const createdUser = await this.userRepository.create(newUser);
    return this.toUserProfile(createdUser);
  }

  async findAll(): Promise<UserProfileDto[]> {
    const users = await this.userRepository.findAll();
    return users.map((user) => this.toUserProfile(user));
  }

  async findStudents(): Promise<StudentListItemDto[]> {
    const users = await this.userRepository.findAll();
    const faculties = await this.facultyRepository.findAll();
    const facultyById = new Map(faculties.map((f) => [f.id!, f]));

    return users
      .filter((user) => user.role === UserRole.STUDENT)
      .map((student) => ({
        id: student.id!,
        fullName: `${student.firstName} ${student.lastName}`,
        groupId: student.groupId,
        courseYear: student.courseYear,
        facultyId: student.facultyId,
        facultyName: student.facultyId
          ? facultyById.get(student.facultyId)?.name
          : undefined,
      }));
  }

  async findById(id: string): Promise<UserProfileDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.toUserProfile(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserProfileDto> {
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
      const emailExists = await this.userRepository.findByEmail(
        updateUserDto.email,
      );
      if (emailExists) {
        throw new ConflictException('User with this email already exists');
      }
    }

    const resultingRole = updateUserDto.role ?? existingUser.role;
    const isStudent = resultingRole === UserRole.STUDENT;

    const resultingFacultyId = isStudent
      ? updateUserDto.facultyId !== undefined
        ? (updateUserDto.facultyId ?? undefined)
        : existingUser.facultyId
      : undefined;

    if (isStudent && resultingFacultyId) {
      const facultyExists = await this.facultyRepository.findById(
        resultingFacultyId,
      );
      if (!facultyExists) {
        throw new BadRequestException('Faculty not found');
      }
    }

    const updatedUser = new User(
      id,
      updateUserDto.email ?? existingUser.email,
      existingUser.password,
      updateUserDto.firstName ?? existingUser.firstName,
      updateUserDto.lastName ?? existingUser.lastName,
      resultingRole,
      // Only STUDENT have this
      isStudent
        ? updateUserDto.groupId !== undefined
          ? (updateUserDto.groupId ?? undefined)
          : existingUser.groupId
        : undefined,
      isStudent
        ? updateUserDto.courseYear !== undefined
          ? (updateUserDto.courseYear ?? undefined)
          : existingUser.courseYear
        : undefined,
      isStudent
        ? resultingFacultyId
        : undefined,
    );

    const result = await this.userRepository.update(id, updatedUser);
    return this.toUserProfile(result);
  }

  async delete(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    await this.userRepository.delete(id);
  }
}
