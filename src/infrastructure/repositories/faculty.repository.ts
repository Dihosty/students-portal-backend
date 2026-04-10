import { IFacultyRepository } from '@domain/core';
import { Faculty } from '@domain/entities';
import { FacultyOrmEntity } from '@infrastructure/database';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FacultyRepository implements IFacultyRepository {
  constructor(
    @InjectRepository(FacultyOrmEntity)
    private readonly repository: Repository<FacultyOrmEntity>,
  ) {}

  async findById(id: string): Promise<Faculty | null> {
    const facultyOrm = await this.repository.findOne({ where: { id } });
    return facultyOrm ? this.toDomain(facultyOrm) : null;
  }

  async findByName(name: string): Promise<Faculty | null> {
    const facultyOrm = await this.repository.findOne({ where: { name } });
    return facultyOrm ? this.toDomain(facultyOrm) : null;
  }

  async create(faculty: Faculty): Promise<Faculty> {
    const saved = await this.repository.save(this.toOrm(faculty));
    return this.toDomain(saved);
  }

  async update(id: string, faculty: Faculty): Promise<Faculty> {
    await this.repository.update(id, this.toOrm(faculty));
    const updated = await this.repository.findOne({ where: { id } });
    if (!updated) {
      throw new Error('Faculty not found');
    }
    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findAll(): Promise<Faculty[]> {
    const faculties = await this.repository.find({ order: { name: 'ASC' } });
    return faculties.map((faculty) => this.toDomain(faculty));
  }

  private toDomain(facultyOrm: FacultyOrmEntity): Faculty {
    return new Faculty(facultyOrm.id, facultyOrm.name, facultyOrm.createdAt);
  }

  private toOrm(faculty: Partial<Faculty>): Partial<FacultyOrmEntity> {
    const facultyOrm: Partial<FacultyOrmEntity> = {};
    if (faculty.id !== undefined) facultyOrm.id = faculty.id;
    if (faculty.name !== undefined) facultyOrm.name = faculty.name;
    if (faculty.createdAt !== undefined) facultyOrm.createdAt = faculty.createdAt;
    return facultyOrm;
  }
}

