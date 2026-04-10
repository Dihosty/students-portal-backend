import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DATABASE_CONFIG } from '@config/database.config';
import {
  UserOrmEntity,
  TeacherOrmEntity,
  SubjectOrmEntity,
  GroupOrmEntity,
  GradeOrmEntity,
  FacultyOrmEntity,
} from './database';
import {
  UserRepository,
  TeacherRepository,
  SubjectRepository,
  GroupRepository,
  GradeRepository,
  FacultyRepository,
} from './repositories';
import {
  IUserRepository,
  ITeacherRepository,
  ISubjectRepository,
  IGroupRepository,
  IGradeRepository,
  IFacultyRepository,
} from '@domain/core';

const REPOSITORIES = [
  UserRepository,
  TeacherRepository,
  SubjectRepository,
  GroupRepository,
  GradeRepository,
  FacultyRepository,
];

const PROVIDERS = [
  {
    provide: IUserRepository,
    useClass: UserRepository,
  },
  {
    provide: ITeacherRepository,
    useClass: TeacherRepository,
  },
  {
    provide: ISubjectRepository,
    useClass: SubjectRepository,
  },
  {
    provide: IGroupRepository,
    useClass: GroupRepository,
  },
  {
    provide: IGradeRepository,
    useClass: GradeRepository,
  },
  {
    provide: IFacultyRepository,
    useClass: FacultyRepository,
  },
];

const PORT_TOKENS = [
  IUserRepository,
  ITeacherRepository,
  ISubjectRepository,
  IGroupRepository,
  IGradeRepository,
  IFacultyRepository,
];

const ENTITIES = [
  UserOrmEntity,
  TeacherOrmEntity,
  SubjectOrmEntity,
  GroupOrmEntity,
  GradeOrmEntity,
  FacultyOrmEntity,
];

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [DATABASE_CONFIG.KEY],
      useFactory: (dbConfig) => dbConfig,
    }),
    TypeOrmModule.forFeature([...ENTITIES]),
  ],
  providers: [...REPOSITORIES, ...PROVIDERS],
  exports: [...PORT_TOKENS],
})
export class InfrastructureModule {}
