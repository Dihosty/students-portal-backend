import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IGradeRepository } from '@domain/core/interfaces';
import { Grade } from '@domain/entities';
import { CreateGradeDto, UpdateGradeDto } from '@domain/core';

@Injectable()
export class GradeService {
  constructor(
    @Inject(IGradeRepository)
    private readonly gradeRepository: IGradeRepository,
  ) {}

  async create(createGradeDto: CreateGradeDto): Promise<Grade> {
    const grade = new Grade(
      undefined,
      createGradeDto.studentId,
      createGradeDto.subjectId,
      createGradeDto.teacherId!,
      createGradeDto.score,
      createGradeDto.type,
      new Date(createGradeDto.date),
    );
    return this.gradeRepository.create(grade);
  }

  async findAll(): Promise<Grade[]> {
    return this.gradeRepository.findAll();
  }

  async findById(id: string): Promise<Grade> {
    const grade = await this.gradeRepository.findById(id);
    if (!grade) {
      throw new NotFoundException(`Grade with ID ${id} not found`);
    }
    return grade;
  }

  async findByStudentId(studentId: string): Promise<Grade[]> {
    return this.gradeRepository.findByStudentId(studentId);
  }

  async findBySubjectId(subjectId: string): Promise<Grade[]> {
    return this.gradeRepository.findBySubjectId(subjectId);
  }

  async findByTeacherId(teacherId: string): Promise<Grade[]> {
    return this.gradeRepository.findByTeacherId(teacherId);
  }

  async findByStudentAndSubject(
    studentId: string,
    subjectId: string,
  ): Promise<Grade[]> {
    return this.gradeRepository.findByStudentAndSubject(studentId, subjectId);
  }

  async update(id: string, updateGradeDto: UpdateGradeDto): Promise<Grade> {
    const existingGrade = await this.findById(id);

    const updatedGrade = new Grade(
      existingGrade.id,
      existingGrade.studentId,
      existingGrade.subjectId,
      existingGrade.teacherId,
      updateGradeDto.score ?? existingGrade.score,
      updateGradeDto.type ?? existingGrade.type,
      updateGradeDto.date ? new Date(updateGradeDto.date) : existingGrade.date,
      existingGrade.createdAt,
      existingGrade.updatedAt,
    );

    return this.gradeRepository.update(id, updatedGrade);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await this.gradeRepository.delete(id);
  }
}
