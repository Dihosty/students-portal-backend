import { IGradeRepository } from '@domain/core';
import { Grade } from '@domain/entities';
import { GradeOrmEntity } from '@infrastructure/database';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class GradeRepository implements IGradeRepository {
  constructor(
    @InjectRepository(GradeOrmEntity)
    private readonly repository: Repository<GradeOrmEntity>,
  ) {}

  async findById(id: string): Promise<Grade | null> {
    const gradeOrm = await this.repository.findOne({ where: { id } });
    return gradeOrm ? this.toDomain(gradeOrm) : null;
  }

  async findByStudentId(studentId: string): Promise<Grade[]> {
    const grades = await this.repository.find({ where: { studentId } });
    return grades.map((grade) => this.toDomain(grade));
  }

  async findBySubjectId(subjectId: string): Promise<Grade[]> {
    const grades = await this.repository.find({ where: { subjectId } });
    return grades.map((grade) => this.toDomain(grade));
  }

  async findByTeacherId(teacherId: string): Promise<Grade[]> {
    const grades = await this.repository.find({ where: { teacherId } });
    return grades.map((grade) => this.toDomain(grade));
  }

  async findByStudentAndSubject(
    studentId: string,
    subjectId: string,
  ): Promise<Grade[]> {
    const grades = await this.repository.find({
      where: { studentId, subjectId },
    });
    return grades.map((grade) => this.toDomain(grade));
  }

  async create(grade: Grade): Promise<Grade> {
    const gradeOrm = this.toOrm(grade);
    const savedGrade = await this.repository.save(gradeOrm);
    return this.toDomain(savedGrade);
  }

  async update(id: string, grade: Grade): Promise<Grade> {
    await this.repository.update(id, this.toOrm(grade));
    const updatedGrade = await this.repository.findOne({ where: { id } });
    if (!updatedGrade) {
      throw new Error('Grade not found');
    }
    return this.toDomain(updatedGrade);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findAll(): Promise<Grade[]> {
    const grades = await this.repository.find();
    return grades.map((grade) => this.toDomain(grade));
  }

  private toDomain(gradeOrm: GradeOrmEntity): Grade {
    return new Grade(
      gradeOrm.id,
      gradeOrm.studentId,
      gradeOrm.subjectId,
      gradeOrm.teacherId,
      gradeOrm.score,
      gradeOrm.type,
      gradeOrm.date,
      gradeOrm.createdAt,
      gradeOrm.updatedAt,
    );
  }

  private toOrm(grade: Partial<Grade>): Partial<GradeOrmEntity> {
    const gradeOrm: Partial<GradeOrmEntity> = {};
    if (grade.id !== undefined) gradeOrm.id = grade.id;
    if (grade.studentId !== undefined) gradeOrm.studentId = grade.studentId;
    if (grade.subjectId !== undefined) gradeOrm.subjectId = grade.subjectId;
    if (grade.teacherId !== undefined) gradeOrm.teacherId = grade.teacherId;
    if (grade.score !== undefined) gradeOrm.score = grade.score;
    if (grade.type !== undefined) gradeOrm.type = grade.type;
    if (grade.date !== undefined) gradeOrm.date = grade.date;
    return gradeOrm;
  }
}
