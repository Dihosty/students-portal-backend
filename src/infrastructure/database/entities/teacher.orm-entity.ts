import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { UserOrmEntity } from './user.orm-entity';
import { SubjectOrmEntity } from './subject.orm-entity';
import { FacultyOrmEntity } from './faculty.orm-entity';

@Entity('teachers')
export class TeacherOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', unique: true })
  userId: string;

  @OneToOne(() => UserOrmEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserOrmEntity;

  @Column({ name: 'faculty_id' })
  facultyId: string;

  @ManyToOne(() => FacultyOrmEntity)
  @JoinColumn({ name: 'faculty_id' })
  faculty: FacultyOrmEntity;

  @OneToMany(() => SubjectOrmEntity, (subject) => subject.teacher)
  subjects: SubjectOrmEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
