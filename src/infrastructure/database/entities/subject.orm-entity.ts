import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TeacherOrmEntity } from './teacher.orm-entity';

@Entity('subjects')
export class SubjectOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ name: 'teacher_id' })
  teacherId: string;

  @ManyToOne(() => TeacherOrmEntity)
  @JoinColumn({ name: 'teacher_id' })
  teacher: TeacherOrmEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
