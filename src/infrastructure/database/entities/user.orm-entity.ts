import { UserRole } from '@domain/core';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { GroupOrmEntity } from './group.orm-entity';
import { FacultyOrmEntity } from './faculty.orm-entity';

@Entity('users')
export class UserOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.STUDENT,
  })
  role: UserRole;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'group_id', nullable: true })
  groupId?: string;

  @ManyToOne(() => GroupOrmEntity, (group) => group.students)
  @JoinColumn({ name: 'group_id' })
  group?: GroupOrmEntity;

  @Column({ name: 'course_year', nullable: true })
  courseYear?: number;

  @Column({ name: 'faculty_id', nullable: true })
  facultyId?: string;

  @ManyToOne(() => FacultyOrmEntity)
  @JoinColumn({ name: 'faculty_id' })
  faculty?: FacultyOrmEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
