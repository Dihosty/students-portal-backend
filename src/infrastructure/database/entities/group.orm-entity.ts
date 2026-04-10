import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserOrmEntity } from './user.orm-entity';
import { FacultyOrmEntity } from './faculty.orm-entity';

@Entity('groups')
export class GroupOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ name: 'course_year' })
  courseYear: number;

  @Column({ name: 'faculty_id', nullable: true })
  facultyId?: string;

  @ManyToOne(() => FacultyOrmEntity)
  @JoinColumn({ name: 'faculty_id' })
  faculty?: FacultyOrmEntity;

  @OneToMany(() => UserOrmEntity, (user) => user.group)
  students: UserOrmEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
