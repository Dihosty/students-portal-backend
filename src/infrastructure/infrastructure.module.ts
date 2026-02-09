import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DATABASE_CONFIG } from '@config/database.config';
import { StudentOrmEntity } from './database';
import { StudentRepository } from './repositories';

const REPOSITORIES = [StudentRepository];

const PROVIDERS = [
  {
    provide: 'IStudentRepository',
    useClass: StudentRepository,
  },
];

const PORT_TOKENS = ['IStudentRepository'];

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [DATABASE_CONFIG.KEY],
      useFactory: (dbConfig) => dbConfig,
    }),
    TypeOrmModule.forFeature([StudentOrmEntity]),
  ],
  providers: [...REPOSITORIES, ...PROVIDERS],
  exports: [...PORT_TOKENS],
})
export class InfrastructureModule {}
