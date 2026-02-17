import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DATABASE_CONFIG } from '@config/database.config';
import { UserOrmEntity } from './database';
import { UserRepository } from './repositories';
import { IUserRepository } from '@domain/core';

const REPOSITORIES = [UserRepository];

const PROVIDERS = [
  {
    provide: IUserRepository,
    useClass: UserRepository,
  },
];

const PORT_TOKENS = [IUserRepository];

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [DATABASE_CONFIG.KEY],
      useFactory: (dbConfig) => dbConfig,
    }),
    TypeOrmModule.forFeature([UserOrmEntity]),
  ],
  providers: [...REPOSITORIES, ...PROVIDERS],
  exports: [...PORT_TOKENS],
})
export class InfrastructureModule {}
