import type { IStudentRepository } from '@domain/core/interfaces';
import { Student } from '@domain/entities';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class GetStudentsUseCase {
  constructor(
    @Inject('IStudentRepository')
    private readonly repository: IStudentRepository,
  ) {}

  async execute(): Promise<Student[]> {
    return this.repository.findAll();
  }
}
