import { ISubjectRepository } from '@domain/core';
import { Subject } from '@domain/entities';
import { SubjectOrmEntity } from '@infrastructure/database';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SubjectRepository implements ISubjectRepository {
  constructor(
    @InjectRepository(SubjectOrmEntity)
    private readonly repository: Repository<SubjectOrmEntity>,
  ) {}

  async findById(id: string): Promise<Subject | null> {
    const subjectOrm = await this.repository.findOne({ where: { id } });
    return subjectOrm ? this.toDomain(subjectOrm) : null;
  }

  async findByTeacherId(teacherId: string): Promise<Subject[]> {
    const subjects = await this.repository.find({ where: { teacherId } });
    return subjects.map((subject) => this.toDomain(subject));
  }

  async create(subject: Subject): Promise<Subject> {
    const subjectOrm = this.toOrm(subject);
    const savedSubject = await this.repository.save(subjectOrm);
    return this.toDomain(savedSubject);
  }

  async update(id: string, subject: Subject): Promise<Subject> {
    await this.repository.update(id, this.toOrm(subject));
    const updatedSubject = await this.repository.findOne({ where: { id } });
    if (!updatedSubject) {
      throw new Error('Subject not found');
    }
    return this.toDomain(updatedSubject);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findAll(): Promise<Subject[]> {
    const subjects = await this.repository.find();
    return subjects.map((subject) => this.toDomain(subject));
  }

  private toDomain(subjectOrm: SubjectOrmEntity): Subject {
    return new Subject(
      subjectOrm.id,
      subjectOrm.name,
      subjectOrm.teacherId,
      subjectOrm.createdAt,
    );
  }

  private toOrm(subject: Partial<Subject>): Partial<SubjectOrmEntity> {
    const subjectOrm: Partial<SubjectOrmEntity> = {};
    if (subject.id !== undefined) subjectOrm.id = subject.id;
    if (subject.name !== undefined) subjectOrm.name = subject.name;
    if (subject.teacherId !== undefined)
      subjectOrm.teacherId = subject.teacherId;
    return subjectOrm;
  }
}
