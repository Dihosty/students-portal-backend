import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ISubjectRepository } from '@domain/core/interfaces';
import { Subject } from '@domain/entities';
import { CreateSubjectDto, UpdateSubjectDto } from '@domain/core';

@Injectable()
export class SubjectService {
  constructor(
    @Inject(ISubjectRepository)
    private readonly subjectRepository: ISubjectRepository,
  ) {}

  async create(createSubjectDto: CreateSubjectDto): Promise<Subject> {
    const subject = new Subject(
      undefined,
      createSubjectDto.name,
      createSubjectDto.teacherId,
    );
    return this.subjectRepository.create(subject);
  }

  async findAll(): Promise<Subject[]> {
    return this.subjectRepository.findAll();
  }

  async findById(id: string): Promise<Subject> {
    const subject = await this.subjectRepository.findById(id);
    if (!subject) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }
    return subject;
  }

  async findByTeacherId(teacherId: string): Promise<Subject[]> {
    return this.subjectRepository.findByTeacherId(teacherId);
  }

  async update(
    id: string,
    updateSubjectDto: UpdateSubjectDto,
  ): Promise<Subject> {
    const existingSubject = await this.findById(id);

    const updatedSubject = new Subject(
      existingSubject.id,
      updateSubjectDto.name ?? existingSubject.name,
      updateSubjectDto.teacherId ?? existingSubject.teacherId,
      existingSubject.createdAt,
    );

    return this.subjectRepository.update(id, updatedSubject);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await this.subjectRepository.delete(id);
  }
}
