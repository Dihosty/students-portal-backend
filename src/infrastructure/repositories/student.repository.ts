import { IStudentRepository } from '@domain/core/interfaces/student.repository';
import { Student } from '@domain/entities';
import { StudentOrmEntity } from '@infrastructure/database';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class StudentRepository implements IStudentRepository {
  private readonly repository: Repository<StudentOrmEntity>;
  constructor(private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(StudentOrmEntity);
  }
  async findAll(): Promise<Student[]> {
    const students = await this.repository.find();
    return students.map(
      (s) => new Student(s.id, s.firstName, s.lastName, s.email),
    );
  }
  async create(student: Student): Promise<Student> {
    const entity = this.repository.create({
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
    });
    const saved = await this.repository.save(entity);
    return new Student(saved.id, saved.firstName, saved.lastName, saved.email);
  }
}
