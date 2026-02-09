import type { IStudentRepository } from '@domain/core/interfaces';
import { Student } from '@domain/entities';
import { Inject, Injectable } from '@nestjs/common';

export interface CreateStudentCommand {
  firstName: string;
  lastName: string;
  email: string;
}

@Injectable()
export class CreateStudentUseCase {
  constructor(
    @Inject('IStudentRepository')
    private readonly repository: IStudentRepository,
  ) {}

  async execute(command: CreateStudentCommand): Promise<Student> {
    const student = new Student(
      undefined,
      command.firstName,
      command.lastName,
      command.email,
    );

    return this.repository.create(student);
  }
}
