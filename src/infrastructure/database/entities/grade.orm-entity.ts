import { GradeType } from '@domain/core';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { SubjectOrmEntity, TeacherOrmEntity, UserOrmEntity } from './index';

@Entity('grades')
export class GradeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'student_id' })
  studentId: string;

  @ManyToOne(() => UserOrmEntity)
  @JoinColumn({ name: 'student_id' })
  student: UserOrmEntity;

  @Column({ name: 'subject_id' })
  subjectId: string;

  @ManyToOne(() => SubjectOrmEntity)
  @JoinColumn({ name: 'subject_id' })
  subject: SubjectOrmEntity;

  @Column({ name: 'teacher_id' })
  teacherId: string;

  @ManyToOne(() => TeacherOrmEntity)
  @JoinColumn({ name: 'teacher_id' })
  teacher: TeacherOrmEntity;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  score: number;

  @Column({
    type: 'enum',
    enum: GradeType,
  })
  type: GradeType;

  @Column({ type: 'date' })
  date: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
