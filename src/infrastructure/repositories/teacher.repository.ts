import { ITeacherRepository } from '@domain/core';
import { Teacher } from '@domain/entities';
import { TeacherOrmEntity } from '@infrastructure/database';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TeacherRepository implements ITeacherRepository {
  constructor(
    @InjectRepository(TeacherOrmEntity)
    private readonly repository: Repository<TeacherOrmEntity>,
  ) {}

  async findById(id: string): Promise<Teacher | null> {
    const teacherOrm = await this.repository.findOne({ where: { id } });
    return teacherOrm ? this.toDomain(teacherOrm) : null;
  }

  async findByUserId(userId: string): Promise<Teacher | null> {
    const teacherOrm = await this.repository.findOne({ where: { userId } });
    return teacherOrm ? this.toDomain(teacherOrm) : null;
  }

  async create(teacher: Teacher): Promise<Teacher> {
    const teacherOrm = this.toOrm(teacher);
    const savedTeacher = await this.repository.save(teacherOrm);
    return this.toDomain(savedTeacher);
  }

  async update(id: string, teacher: Teacher): Promise<Teacher> {
    await this.repository.update(id, this.toOrm(teacher));
    const updatedTeacher = await this.repository.findOne({ where: { id } });
    if (!updatedTeacher) {
      throw new Error('Teacher not found');
    }
    return this.toDomain(updatedTeacher);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findAll(): Promise<Teacher[]> {
    const teachers = await this.repository.find();
    return teachers.map((teacher) => this.toDomain(teacher));
  }

  private toDomain(teacherOrm: TeacherOrmEntity): Teacher {
    return new Teacher(
      teacherOrm.id,
      teacherOrm.userId,
      teacherOrm.facultyId,
      teacherOrm.createdAt,
    );
  }

  private toOrm(teacher: Partial<Teacher>): Partial<TeacherOrmEntity> {
    const teacherOrm: Partial<TeacherOrmEntity> = {};
    if (teacher.id !== undefined) teacherOrm.id = teacher.id;
    if (teacher.userId !== undefined) teacherOrm.userId = teacher.userId;
    if (teacher.facultyId !== undefined) teacherOrm.facultyId = teacher.facultyId;
    return teacherOrm;
  }
}
