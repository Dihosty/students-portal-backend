import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserOrmEntity } from './user.orm-entity';

@Entity('groups')
export class GroupOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ name: 'course_year' })
  courseYear: number;

  @OneToMany(() => UserOrmEntity, (user) => user.groupId)
  students: UserOrmEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
