import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('students')
export class StudentOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;
}
