import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { UserOrmEntity } from './user.orm-entity';
import { SubjectOrmEntity } from './subject.orm-entity';

@Entity('teachers')
export class TeacherOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', unique: true })
  userId: string;

  @OneToOne(() => UserOrmEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserOrmEntity;

  @Column()
  faculty: string;

  @OneToMany(() => SubjectOrmEntity, (subject) => subject.teacher)
  subjects: SubjectOrmEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
